import base from './base'
import extendUtils from '../utils';
import constant from '../../config';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';

const TIMESTAMP = process.env.TIMESTAMP_ENV;//时间戳
const PATH = `./thirdparty/protocol/sino-protocol.js?t=${TIMESTAMP}`

class protocolHandler extends base{
    constructor(){
        super();
        extendUtils.WhiteList.global.push('/channel/v1/getAppProtocols');
        this.protocolPromise=null;
    }

    /**
     * 是否开启协议
     */
    enableProtocols(){
        //商旅没有这个开关，不实现。 如果没有配置协议，则认为不开启
    }

    /**
     * 获取协议内容
     * @param {*} channelId 
     * @returns 必须返回type：text或file。然后按类型返回相应的字段
     */
    getAppProtocols(){
        let that = this;
        return this.protocolPromise = new Promise(resolve=>{
            let userInfo = authorization.getUserInfo();
            let channelId = userInfo.channelId;
            that.request('/channel/v1/getAppProtocols',{channelId: channelId}, {method: 'get'}).then(res=>{
                if (extendUtils.isNotEmpty(res.result) && extendUtils.isNotEmpty(res.result.channelProtocolForApps)) {
                    resolve({
                        content: res.result.channelProtocolForApps
                    });
                } else {
                    
                    this.logUserConsent();
                    resolve();
                }
            }).catch(e=>{
                resolve();
                console.error(e);
            })
        })
    }

    /**
     * 记录用户是否同意了协议
     * @param param: {logUserConsents: [授权协议id的list]}
     */
    logUserConsent(param){
        let logUserConsents = []
        let userInfo = authorization.getUserInfo();
        /* eslint-disable */
        if(extendUtils.isEmpty(param) || extendUtils.isEmpty(param.protocols) || extendUtils.isEmpty(param.protocols.content)){
            param = {
                protocols: {
                    content: [{protocolId: -1}]
                }
            }
        }
        param.protocols.content && param.protocols.content.forEach(auth=>{
            logUserConsents.push({
                "userId": userInfo.userId,
                "companyId": userInfo.companyId,
                "channelId": userInfo.channelId,
                "protocolId": auth.protocolId,
                "companyName": userInfo.companyName
            })
        })
        /* eslint-enable */

        return new Promise(resolve=>{
            if(!logUserConsents || logUserConsents.length==0){
                resolve(false);
                return 
            }
            this.request('/channel/v1/addUserAgreeProtocol', {logUserConsents: logUserConsents}).then(res=>{
                resolve(res.resultCode==0)
            }).catch(e=>{
                resolve(false);
                console.error(e);
            })
        })
    }

    /**
     * 获取用户是否同意了协议
     */
    getUserConsent(){
        let that = this;
        let userInfo = authorization.getUserInfo();
        let param = {
            "userId": userInfo.userId,
            "companyId": userInfo.companyId,
            "channelId": userInfo.channelId
        }
        return new Promise(resolve=>{
            //静默自动同意协议
            let autoAgreetProtocol = SnUtils.getUserPara('agreetProtocol')=='auto';
            if(autoAgreetProtocol){
                resolve(true);
            }
            this.request('/channel/v1/getUserAgreeProtocol', param, {method: 'get'}).then(res=>{
                let result = false;
                if(res.resultCode==0 && res.result){
                    // 过滤以前无协议但默认同意过协议的情况，然后协议更新后用户访问时可再次确认
                    const newProtocolIds = res.result.protocolIds.filter(item => {
                        return item !== -1;
                    })
                    result = extendUtils.isNotEmpty(newProtocolIds);
                }
                // eslint-disable-next-line no-unused-expressions
                !result && autoAgreetProtocol && that.autoLogUserConsent();//自动同意协议
                resolve(result);
            }).catch(e=>{
                resolve(false);
                console.error(e);
            })
        })
    }

    /**
     * 自动同意协议
     * @returns 
     */
    async autoLogUserConsent(){
        try{

            let protocolConfig = await (this.protocolPromise || this.getAppProtocols());
            if(!protocolConfig){
                return;
            }
            this.logUserConsent({protocols: {content: protocolConfig.content}});
        }catch(e){
            console.warn(e);
        }
    }

    getProtocol(config = {}, events = {}) {
        let that = this;
        return new Promise(resolve => {
            extendUtils.loadScript({
                src: PATH,
                id: 'protocol',
                onload: async function () {
                    try {
                        //获取用户协议回调（这个写在config里面会导致循环引用）
                        config.getAppProtocolsFunc = async channelId => await that.getAppProtocols(channelId);
                        config.logUserConsentFunc = async param => await that.logUserConsent(param);
                        config.getUserConsentFunc = async param => await that.getUserConsent(param);
                        config.showDetailCloseBtn = false;
                        config.primaryKey = that.getPrimaryKey();
                        config.zIndex = 12999;
                
                        //控制返回按钮关闭协议详情
                        events.onShowProtocolDetail = instance => {
                            sinosdk.sino.onBack(() => { //注册返回事件
                                instance.closeProtocolDetail();
                            })
                            sinosdk.sino.showReturnBtn(true);//显示返回按钮
                        }
                        events.onCloseProtocolDetail = () => {
                            tChatEventMixin.methods.tChatEventAppBack();//还原注册app事件
                            //显示返回按钮
                            let pageFrom = SnUtils.getUserPara('pageFrom');
                            if (!pageFrom){ //如果前面有页面，则不隐藏返回按钮
                                if (!window.opener || history.length <= 1) {
                                    sinosdk.sino.showReturnBtn(false);
                                }
                            }
                        }
                        events.onComplete = () => {
                            resolve()
                        }
                        window.protocol = window.sinoProtocol.install(config, events)
                    } catch (e){
                        console.error('获取用户协议失败：' + e)
                        resolve()
                    }
                }
            })
        })
    }

    /**
     * 记录用户进入了本系统
     * @param {*} param 
     */
    logUserEntered(param){
        try{
            const KEY = `bp_${constant.AUTH_CONFIG.loginKcConfig.clientId}_entered`
            if(extendUtils.isEmpty(window.sessionStorage.getItem(KEY))){
                this.logUserConsent(param)
                window.sessionStorage.setItem(KEY, 1)
            }
        }catch(e){
            console.warn('log user entered failed. ' + e)
        }
    }
}

export default new protocolHandler();