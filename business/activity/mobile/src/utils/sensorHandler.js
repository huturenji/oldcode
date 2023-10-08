import { getLocation , isNotEmpty} from '@/utils/common.js';

class SensorHandler {
    constructor(){
        this.bisSwitch = true;//是否开启该功能
        this.autoPageView = true;//控制是否抓取页面浏览事件,不传默认true
        this.setUserInfoComplete = false;//设置用户属性是否完成
        this.bisReady = false;//组件是否就绪
        this.pendingEventList = [];//组件ready前触发的事件进入待处理列表
        this.optionsMap = {
            'sit':{
                sensorAppId:'1058319',
                sensorServerAddress:'https://januspublicsit.sinosun.com:17380',
                sensorToken:'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDbnVkTThTV0dQVjJjX1hsa0xGU1VZS2JCOU9zaktYNTJyM1pVTlRBR0JBIn0.eyJleHAiOjIwMDMxOTM2NTUsImlhdCI6MTY4NzkyMDA1NSwianRpIjoiZTU5ZWQ5NWItZTFmMi00ZWI3LWFhYjktMDdmODVkMzQ5NGIwIiwiaXNzIjoiaHR0cHM6Ly9qYW51c3B1YmxpY3NpdC5zaW5vc3VuLmNvbToxNzM4MC9hdXRoL3JlYWxtcy9qYW51c3NpdCIsInN1YiI6Ijc3MWVlNzc4LTIwMGQtNDY5MS1iZTUxLTMyNDE0NjViYzJkOSIsInR5cCI6IkJlYXJlciIsImF6cCI6IjUzNzYyZGVkLTNhMTItNDNkMS1hN2ExLWI0MWFhNjg3ZTdjNCIsInNlc3Npb25fc3RhdGUiOiI1ZGRhM2FlNS04MWRlLTQ0YjctODNmOC1mOGMwNTRhNTkwNTgiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIkFQUF9ST0xFX0dVRVNUIiwiQVBQX1JPTEVfVVNFUiIsIm9mZmxpbmVfYWNjZXNzIiwiQVBQX1JPTEUiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtamFudXNzaXQiXX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImJpem1hdGVJZCI6InNlcnZpY2UtYWNjb3VudC01Mzc2MmRlZC0zYTEyLTQzZDEtYTdhMS1iNDFhYTY4N2U3YzQiLCJjbGllbnRJZCI6IjUzNzYyZGVkLTNhMTItNDNkMS1hN2ExLWI0MWFhNjg3ZTdjNCIsImNsaWVudEhvc3QiOiIxMC4xMTEuMjQ0LjEwNyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiYXBwSWQiOiIxMDU4MzE5IiwiYmFua05hbWUiOiLkvLTmraPkuotkZXYiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtNTM3NjJkZWQtM2ExMi00M2QxLWE3YTEtYjQxYWE2ODdlN2M0IiwiY2xpZW50QWRkcmVzcyI6IjEwLjExMS4yNDQuMTA3IiwiY2hhbm5lbElkIjoiOTcyOSJ9.GPkTnTm-i0SCNa5kOuG5MmvCMNWTU44fgz3-splpadlrQwCXP98DCbXjQhmXbm19rOuBizvAqeEOz3CBJPw910MIh8Qc2zllgsOTbF7a375qpReaJkeJChrjgVlMQF4XEQpvexFPLfdP75-qxqKNkvZEFEwZm7-gavIz60gRbqETUypyO6Y42FVGxzokroR7LphpXdt2H5BPPIH0U2iHnDCueN-WM62aZaL9HyHoKQ62TCgOznZkwhHOgNugFK6qrvzy10EtyB6eGDttNDuQTo2qfDiwkFiILNqbR_PGlNhaqFzI-6p8mr_dei_TcMvdeC6aZYTNQ5wmrYblojmdhg'
            },
            'uat':{
                sensorAppId:'1048602',
                sensorServerAddress:'https://operationpublicuat.sinosun.com',
                sensorToken:'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJfMURWd09fMDhJTDBteHVoa1pxcDFxazRDbEtqVzViU21fVXdNc1FzTzU0In0.eyJleHAiOjIwMDMyOTExMjIsImlhdCI6MTY4NzkzMTEyMiwianRpIjoiZDk1MDc3YjMtM2JlZS00NmIyLWJhY2EtZmFhODA3MTljZWJjIiwiaXNzIjoiaHR0cHM6Ly9vcGVyYXRpb25wdWJsaWN1YXQuc2lub3N1bi5jb20vYXV0aC9yZWFsbXMvb3BlcmF0aW9ucHVibGljdWF0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjZiOWQ3NGYxLTUyOWMtNDExZC05NmY3LWIxOTgyMDEyMjkwMCIsInR5cCI6IkJlYXJlciIsImF6cCI6IjIyZTRjMjc0LTRhNWYtNGQ4Zi1hODQ5LWI3MDVkZTA1ZTg2NyIsInNlc3Npb25fc3RhdGUiOiJjODY4OGFhMS1lYWQ1LTRlMzUtOTQ2NS1kYjhmYjljYjUwYjEiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIkFQUF9ST0xFX0dVRVNUIiwiQVBQX1JPTEVfVVNFUiIsImRlZmF1bHQtcm9sZXMtb3BlcmF0aW9ucHVibGljdWF0IiwiQVBQX1JPTEUiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiYml6bWF0ZUlkIjoic2VydmljZS1hY2NvdW50LTIyZTRjMjc0LTRhNWYtNGQ4Zi1hODQ5LWI3MDVkZTA1ZTg2NyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2xpZW50SWQiOiIyMmU0YzI3NC00YTVmLTRkOGYtYTg0OS1iNzA1ZGUwNWU4NjciLCJjbGllbnRIb3N0IjoiMTAuMC4zNS4xMjkiLCJhcHBJZCI6IjEwNDg2MDIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtMjJlNGMyNzQtNGE1Zi00ZDhmLWE4NDktYjcwNWRlMDVlODY3IiwiY2xpZW50QWRkcmVzcyI6IjEwLjAuMzUuMTI5IiwiY2hhbm5lbElkIjoiNSJ9.h7O-I5Ps-IoT_mfKU02gRT9JDHNDQTaHqNPrGWx9fc80YX_B5SZqeF0UaKQ12JNuLpMnhWVmDKz_rhoesiCpC_ge_Pamf_JDplsMYaZs4EbbyK_78RhTePHsxApOais9Px7xuw55gQONCx1MpST0hSWJW6Nj_Gv85sFYWbtnH5h-hEADMsv8DYWmludBDcD2wH_Zq1EbHgVTa_nXxwfZelraHTScGD6jocrL-xk1SRscImXc-7P5Yn32ChtpjOS3R6qIZ1Ey1cmocLGFTMiNLOE3FN7rwj0eVpHksQLfNSI9vIetm5Ll2RS-ejSRaZnuHvCxxgsH2RwWWhFthnscEA'
            },
            'prod':{
                sensorAppId:'1059856',
                sensorServerAddress:'https://cloudanalysis.sinosun.com',
                sensorToken:'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDZ1VMNklvUHBwckFXT1R5clBCdmNydnl1MjJrZms0SkNHYjh3c21hdXBnIn0.eyJleHAiOjIwMDMyOTEzNjMsImlhdCI6MTY4NzkzMTM2MywianRpIjoiMjdmNzMxOWUtOGFjOC00ZDA2LTljYjMtM2IzOGEzNjdmODNjIiwiaXNzIjoiaHR0cHM6Ly9jbG91ZGFuYWx5c2lzLnNpbm9zdW4uY29tL2F1dGgvcmVhbG1zL29wZXJhdGlvbnB1YmxpY3BybyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI4ZWNlYTlkZS03ZTE4LTQwNjMtYTZjYS04MjI3YjZlNWQ5NzEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJjZjk3MDA1OS0xY2Y2LTRiNGMtYTE4OS1kYmI2ODEzNjk2ZDciLCJzZXNzaW9uX3N0YXRlIjoiNGRlN2YyNTYtZDU1Yy00Y2JjLTgzNzUtNzBlNTg0MTcxMGJkIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJBUFBfUk9MRV9HVUVTVCIsIkFQUF9ST0xFX1VTRVIiLCJBUFBfUk9MRSIsIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1vcGVyYXRpb25wdWJsaWNwcm8iLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsImJpem1hdGVJZCI6InNlcnZpY2UtYWNjb3VudC1jZjk3MDA1OS0xY2Y2LTRiNGMtYTE4OS1kYmI2ODEzNjk2ZDciLCJjbGllbnRIb3N0IjoiNDcuOTcuNi4xMzciLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImNsaWVudElkIjoiY2Y5NzAwNTktMWNmNi00YjRjLWExODktZGJiNjgxMzY5NmQ3IiwiYXBwSWQiOiIxMDU5ODU2IiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LWNmOTcwMDU5LTFjZjYtNGI0Yy1hMTg5LWRiYjY4MTM2OTZkNyIsImNsaWVudEFkZHJlc3MiOiI0Ny45Ny42LjEzNyIsImNoYW5uZWxJZCI6IjUifQ.NypMg5JAWwZ57lhu-Jw6JCCFO4MyjSZtU8_dt4XxgkouPgXfxQ4WLlmzj0dRoa07M2eLIVE1HI4pDdk2sRrJgMKhRRg71h93Ru1IsMaWkXHq84X5HEdWSAai8OqAqRfbPvmK2OEOUoxOsc5eF9LHMTApY86llBBa5y5i0eRY2Gm9fbnzfv2_8kt0cUkw8qMNArls-EBm80OpWf8B5Vik1wJY4wwKVNqiaLyYyCd0qlINHL6bUZr4REV4_oCQLLjh6RNZoLbURUw4gKCY8X2yIMshE4_nmGP2hLYgWfSRobDcxFjN6_fFab4vcWglSsqTSiSU0fwdwqv3zK-2qZMAXw'
            }
        }
    }
    /**
     * 初始化SensorSdk
     */
    async init(){
        //数据埋点上报
        try {
            if (this.bisSwitch) {
                let hostname = window.location.hostname;
                let hostMap={
                    "bplussit.sinosun.com":"sit",
                    "bplus-uat.sinosun.com":"uat",
                    "cloud.sinosun.com":"prod"
                }
                const DOMAIN_NAME = hostMap[hostname]||'sit';
                let options = this.optionsMap[DOMAIN_NAME];
                if (isNotEmpty(options.sensorAppId) && isNotEmpty(options.sensorServerAddress) && isNotEmpty(options.sensorToken)){
                    SnUtils.loadScript({
                        src: './thirdparty/SensorSdk.js',
                        id: 'sensor',
                        onload: () => {
                            //兼容SensorSdk初次上报取pathName的问题2022-10-11
                            let uri = location.href;
                            uri = this.pageUrlFilter(uri);
                            window.SensorSdk.setPage(decodeURIComponent(uri));
                            window.SensorSdk.init(options.sensorAppId,options.sensorServerAddress,options.sensorToken,this.autoPageView);
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
     * getUrlHash
     * @param string url 
     */
    getUrlHash(url){
        let urlObj = new URL(url)
        return urlObj.hash;
    }

    /**
     * page url filter param
     * @param string url 
     */
    pageUrlFilter(url){
        let res = url;
        try {
            let urlHash = this.getUrlHash(url);
            let routePath = urlHash.replaceAll("#","").split('?')[0];
            if(routePath=='/'){
                let urlParam = SnUtils.getUrlParams(url);
                if (isNotEmpty(urlParam.activityId)){
                    res = `${url.split('?')[0]}?activityId=${urlParam.activityId}`
                }
            }else{
                res = url.split('?')[0];
            }
            return res;
        } catch (error) {
            console.log('pageUrlFilter失败',error)
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
