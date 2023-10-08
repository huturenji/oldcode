/*
 * @Descripttion: 分享js
 * @version: 
 * @Author: 肖文川
 * @Date: 2021-9-7
 * @LastEditors: xiaowe
 * @LastEditTime: 2021-9-7
 */
import {
    isWeiXinBrower,
    weiXinBrowerShare,
    isNotEmpty,
    inMiniprogram
} from '@/utils/common.js'
import wxHandler from "@/components/wechat/handler";
class ShareHandler {
    constructor(){
        // 分享的type类型 music、video、link、 applet[小程序]；不填默认为link
        this.contentType = {
            'APPLET': 'applet',
            'LINK': 'link'
        }
    }

    /**
     * 异步获取登录用户名字
     */
    async getUserInfo() {
        return await sinosdk.sino.getUserInfo().then(function(data){
            if (!!data){ //用户存在
                return data;  
            }
        }).catch(()=>{
            return '';
        })
    }

    /**
     * 异步获取appId
     */
    async getAppConfig() {
        return await sinosdk.sino.getAppInfo({'key':'msgSource'}).then(function(data){
            if (!!data){ //用户存在
                var jsonData = JSON.parse(data.value);
                return jsonData||{};
            }
        }).catch(()=>{
            return {};
        })
    }

    /**
     * 获取微信ticket
     */
    proxyWxTicket(param) {
        return this.request('/product/v1/proxyWxTicket', param, Object.assign({
            noSSOFlag: true,
            method: 'get',
            noZipFlag: true
        }));
    }

    /**
     * 注册第三方分享信息
     * @param json 分享信息
     * @param json 游客header
     */ 
    setThirdShareInfo(shareInfo){
        let that = this;
        try {
            //伴正事分享
            let inApp = SnUtils?.getBizMateVersion();
            if (inApp){
                that.registerBizmateShare(shareInfo);
            }
            //处理微信分享
            if (isWeiXinBrower() && !inMiniprogram()){
                //分享到微信好友mobile提供的方法
                weiXinBrowerShare('', shareInfo)
            }
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * 注册伴正事浏览器网页分享功能的数据
     */
    async registerBizmateShare(shareData) {  
        let that = this;
        let {supportShareWxMini} = await window.getChannelOptions; // 运营后台配置的渠道相关配置
        let typeList = ['bizmate','wechat','wechatTimeline','copylink','note'];
        let appInfo = {};
        try {
            appInfo = await that.getAppConfig();
        } catch (error) {
        }
        let appName = '商云';
        let appId = '268435729';
        let shareParam = {
            sharingType:'',//分享的类型，伴正事分享bizmate，微信分享wechat，朋友圈分享wechatTimeline
            title : shareData.title||'', // 分享标题          
            desc : shareData.desc||'', // 分享描述           
            link : shareData.link||'', // 分享链接          
            imgUrl : shareData.imgUrl||'', // 分享图标,图片绝对地址 
            appId: (appInfo.appId||appId)+'',//小应用Id
            appName: appInfo.appName||appName||'比N家',//小应用名字,无合法appId时使用appName
            contentType : 'link' // 分享类型,music、video或link，不填默认为link
        }  
        
        let registerListDate = typeList.map((item) => {
            shareParam.sharingType = item;
            let tempObj = JSON.stringify(shareParam);
            /**
             * 判断条件介绍
             * shareData.shareMini = 业务侧注册是否需要注册为分享小程序分享
             * supportShareWxMini = 当前渠道下在admin运维配置是否配置支持微信小程序分享
             * appletId = 当前渠道下在admin运维配置是否配置需要分享的微信小程序的原始id
             * item.toLowerCase() == 'wechat' = 当前是否是微信好友分享项
             */
            if(item.toLowerCase() == 'wechat'){
                if(!!shareData.shareMini && !!supportShareWxMini && isNotEmpty(shareData.appletId)){ 
                    tempObj = JSON.stringify(Object.assign({}, shareParam, that.wechatMiniShareInfo(shareData)));
                } else if(!!shareData.shareMini && !supportShareWxMini){
                    let transferLink = that.getWxTransferLink(shareData.wxSchemeData)
                    tempObj = JSON.stringify(Object.assign({}, shareParam, {link: transferLink}));
                }
            }
            return JSON.parse(tempObj);
        });
        sinosdk.sino.registerShare({dataList:registerListDate}).then(()=>{
        }).catch((e)=>{
            console.log(e)
        });
    } 

    /***
     * 处理微信分享如果是分享微信小程序，此时涉及的分享信息需要特殊处理
     */
    wechatMiniShareInfo(shareData){
        return {
            imgUrl: shareData.wxImgUrl, //小程序分享特有的图片
            path: shareData.path || '', //小程序分享特有的path
            webpageUrl: shareData.link, // 兼容低版本的网页链接 支持小程序分享特有
            title: shareData.wxTitle, //小程序分享特有的title
            contentType: this.contentType.APPLET, // // 分享类型,music、video或link applet代表微信小程序，不填默认为link
            appletId: shareData.appletId, // 小程序原始id 支持小程序分享特有
            appletType: shareData.appletType // 正式版:0，测试版:1，体验版:2 支持小程序分享特有
        }
    }

    /**
     * 注销伴正事浏览器网页分享功能的数据
     */   
    cancelBizmateShare(){
        try {
            let inApp = SnUtils?.getBizMateVersion?.();
            if (inApp){
                sinosdk.sino.registerShare({dataList:[]}).then(()=>{
                }).catch((e)=>{
                    console.log(e)
                });        
            }
        } catch (error) {
            
        }
    }

    // h5 url 直接拉起 scheme方法
    async setToWxScheme(wxSchemeData){
        // 用h5的方式打开小程序 
        let wxSchemeUrl = await wxHandler.getScheme(wxSchemeData); //获取小程序的scheme
        if (isNotEmpty(wxSchemeUrl)){
            try {
                this.$bbcStatEvent({behaviorType:'share'});
            } catch(e) {
                console.log(e)
            }
            window.location.href = wxSchemeUrl;
        } else {
            alert('获取微信小程序scheme失败')
        }
    }

    // 获取微信分享的中转页
    getWxTransferLink(wxSchemeData = {}){
        let href = location.href.split('#')[0]; //伴正事分享鹅毛情地址
        let path = '/views/weixin/transfer/index'
        let quertString = encodeURIComponent(JSON.stringify(wxSchemeData))
        return `${href}#${path}?shareInfo=${quertString}`
    }

    /**
     * 真正的分享操作
     * @param type 分享的类型
     * @param config 分享的整合信息
     * @param callback 分享后执行的callback
     */ 
    async share(type, config, callback){
        let that = this;
        let {supportShareWx, supportShareWxMini} = await window.getChannelOptions; // 运营后台配置的渠道相关配置
        let param = {
            sharingType: type,//分享的类型，伴正事分享bizmate，微信分享wechat，朋友圈分享wechatTimeline
            title: config.title, // 分享标题          
            desc: config.desc, // 分享描述           
            link: config.link, // 分享链接          
            imgUrl: config.imgUrl, // 分享图标,图片绝对地址 
            appId: config.appId,//小应用Id
            appName: config.appName,//小应用名字,无合法appId时使用appName
            contentType: this.contentType.LINK // 分享类型, music、video 或 link applet[小程序] ，不填默认为link
        }

        if(type.toLowerCase() == 'wechat'){ // 针对微信分享进行特殊处理
            if(!!supportShareWx){ // 渠道支持微信分享
                if(!!supportShareWxMini && !!config.shareMini && isNotEmpty(config.appletId)){ //渠道支持小程序分享 并且业务侧需要分享小程序
                    param = Object.assign({}, param, that.wechatMiniShareInfo(config))
                } else if(!supportShareWxMini && !!config.shareMini){ //不支持分享小程序，但是业务侧需要分享到小程序 此时分享到微信中转页
                    let transferLink = that.getWxTransferLink(config.wxSchemeData)
                    param = {...param, link: transferLink}
                } else {}
                that.shareFun(param, callback)
            } else if(!supportShareWx && !!config.shareMini) { // 渠道不支持微信分享 并且业务侧需要分享小程序 
                /**
                 * 当前渠道不支持微信分享 并且当前页面的业务是需要分享到微信小程序的 则由 H5直接拉起小程序，在小程序里面分享
                 * 适用场景：商品详情页分享/鹅毛情分享礼物
                 */ 
                config.wxSchemeData.path = config.shareTransferConfig.path; // 此时用中转页path
                config.wxSchemeData.query = config.shareTransferConfig.query; // 此时用中转页query
                that.setToWxScheme(config.wxSchemeData)
            }
        } else {
            that.shareFun(param, callback)
        }
    }

    // sdk的分享方法
    shareFun(param, callback){
        sinosdk.sino.share(param).then(()=>{
            /**
             * 目前只有安卓能进这里，意思是只有安卓才能监听到分享了，才会上报
             */ 
            try {
                this.$bbcStatEvent({behaviorType:'share'});
            } catch(e) {
                console.log(e)
            }
            
        }).catch(() => {
        })
        callback && callback();
    }
}
export default new ShareHandler();
