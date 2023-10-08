import { getLocation , isNotEmpty} from '@/utils/common.js';

class SensorHandler {
    constructor(){
        this.bisSwitch = true;//是否开启该功能
        this.autoPageView = true;//控制是否抓取页面浏览事件,不传默认true
        this.setUserInfoComplete = false;//设置用户属性是否完成
        this.bisReady = false;//组件是否就绪
        this.pendingEventList = [];//组件ready前触发的事件进入待处理列表
    }

    /**
     * 初始化SensorSdk
     */
    async init(){
        //数据埋点上报
        try {
            if (this.bisSwitch) {
                let channelOptions = await window.getChannelOptions;
                if (isNotEmpty(channelOptions.sensorAppId) && isNotEmpty(channelOptions.sensorServerAddress) && isNotEmpty(channelOptions.sensorToken)){
                    SnUtils.loadScript({
                        src: './thirdparty/SensorSdk.js',
                        id: 'sensor',
                        onload: () => {
                            //兼容SensorSdk初次上报取pathName的问题2022-10-11
                            let uri = (location.hash.indexOf('/pages/topic/index')>-1)?location.href:(window.location.href.split('?')[0]);
                            uri = this.pageUrlFilter(uri);
                            window.SensorSdk.setPage(decodeURIComponent(uri));
                            window.SensorSdk.init(channelOptions.sensorAppId,channelOptions.sensorServerAddress,channelOptions.sensorToken,this.autoPageView);
                            this.bisReady = true;
                            this.setUserInfo();
                            if (this.pendingEventList.length > 0){
                                this.pendingEventList.forEach((item)=>{
                                    this.setPageAddreportEvent(decodeURIComponent(item));
                                });
                            }
                            this.pendingEventList = [];
                        }
                    });
                }
            }
        } catch (error) {
            console.log('初始化SensorSdk失败',error)
        }
    }

    /**
     * 设置页面地址并上报
     * @param {String} url 请求入参
     */
    setPageAddreportEvent(url){
        try {
            url = this.pageUrlFilter(url);
            if (this.bisSwitch){
                if (this.bisReady){
                    //兼容还未获取到title的场景
                    if (isNotEmpty(document.title)){
                        window.SensorSdk.setPage(url);
                        window.SensorSdk.reportEvent("app-viewScreen");
                    } else {
                        setTimeout(() => {
                            window.SensorSdk.setPage(url);
                            window.SensorSdk.reportEvent("app-viewScreen");
                        }, 1000);
                    }
                } else {
                    this.pendingEventList.push(url);
                }
            }
        } catch (error) {
            console.log('设置页面地址并上报失败',error)
        }
    }

    /**
     * page url filter param
     * @param string url 
     */
    pageUrlFilter(url){
        let res = url;
        try {
            if(url.indexOf('/pages/topic/index')>-1){
                let urlParam = SnUtils.getUrlParams();
                if (isNotEmpty(urlParam.id)){
                    res = `${url.split('?')[0]}?id=${urlParam.id}`
                }
            }
            return res;
        } catch (error) {
            console.log('初始化initTracker失败',error)
            return res;
        }
    } 

    /**
     * 删除url上置顶参数
     * @param string url 
     * @param string key 
     */
    urlDelP(url,name){
        var urlArr = url.split('?');
        if(urlArr.length>1 && urlArr[1].indexOf(name)>-1){
            var query = urlArr[1];
            var obj = {}
            var arr = query.split("&");
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].split("=");
                obj[arr[i][0]] = arr[i][1];
            }
            delete obj[name];
            var urlte = urlArr[0] +'?'+ JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
            return urlte;
        }
        return url
    }

    /**
     * 上报页面浏览事件
     * @param string type 请求入参
     */
    reportEvent(){
        try {
            this.bisSwitch && this.bisReady && window.SensorSdk.reportEvent("app-viewScreen");
        } catch (error) {
            console.log('上报页面浏览事件失败',error)
        }
    }
    
    /**
     * 设置用户信息
     */
    setUserInfo(){
        let userInfo = getApp().globalData.userParams;
        window.SensorSdk.setUserId(userInfo.userId);
        window.SensorSdk.setBankId(userInfo.channelId);
        window.SensorSdk.setCompanyId(userInfo.companyId);
    }
    
    /**
     * 设置用户信息
     * @param Boolean type 确保更新
     */
    setUserInfoAll(promiseUpdata=false){
        return new Promise(async (resolve) => {
            try {
                if (promiseUpdata || (this.bisSwitch && this.bisReady && !this.setUserInfoComplete)){ //全局只设置一次
                    let userInfo = getApp().globalData.userParams;
                    let sinoUserInfo = await sinosdk.sino.getUserInfo();
                    
                    let dataObj = {
                        userId:userInfo.userId,
                        bankId:userInfo.channelId,//渠道Id
                        channelId:userInfo.channelId,//渠道Id
                        bankName:userInfo.channelName||'',//渠道名称
                        userName:userInfo.userName,
                        gender:sinoUserInfo.sex,
                        phoneNumber:userInfo.userPhone,
                        companyId:userInfo.companyId,
                        companyName:userInfo.companyName,
                        department:sinoUserInfo.orgName,//所属部门
                        orgId:sinoUserInfo.orgId//所属部门ID
                    };
                    try {
                        let location = await getLocation();
                        dataObj.country = location.addressComponent.country;
                        dataObj.city = location.addressComponent.city;
                    } catch (error) {
                        console.log('定位失败',error);
                    }
                    window.SensorSdk.setUserId(userInfo.userId);
                    window.SensorSdk.setAttributs(dataObj);
                    this.setUserInfoComplete = true;
                    resolve();
                } else {
                    resolve();
                }
            } catch (error) {
                console.log('上报失败',error);
                resolve();
            }
        });
    }
}
export default new SensorHandler();
