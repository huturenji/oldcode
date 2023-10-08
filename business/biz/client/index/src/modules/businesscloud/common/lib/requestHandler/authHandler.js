import base from './base'
import extendUtils from '../utils';
import constant from '../../config';
import protocolHandler from '../requestHandler/protocolHandler'
extendUtils.WhiteList.global.push('/auth-adapter/v1/getIdToken')
const TIMESTAMP = process.env.TIMESTAMP_ENV;//时间戳
const PATH = `./thirdparty/serviceAuth/swp-serviceAuth.js?t=${TIMESTAMP}`
/**
 * 注意：这里就不要用class了，否则外部调用这里的函数时，this的指向会改变（不是当前的class了）
 */

var requestHanlder = new base();

/**
 * 通过TGC等银企通原始用户属性，获取idToken
 */
function getIdTokenByTGC() {
    return new Promise(resolve => {
        let terType = extendUtils.getUserPara('terType')
        terType = extendUtils.isEmpty(terType) || isNaN(terType) ? 0 : parseInt(terType);
        let param = {
            tgc: extendUtils.getUserPara('TGC'),
            uaId: extendUtils.getUserPara('uaId'),
            channelId: extendUtils.getUserPara('ProdId'),
            companyId: extendUtils.getUserPara('cpyId'),
            terType: extendUtils.getUserPara('terType'),
        }
        if(param.tgc==null || param.tgc==undefined){
            extendUtils.showToast('url上没有TGC')
            return;
        }
        if(param.uaId==null || param.uaId==undefined){
            extendUtils.showToast('url上没有uaId')
            return;
        }
        if(param.channelId==null || param.channelId==undefined){
            extendUtils.showToast('url上没有channelId')
            return;
        }
        if(param.companyId==null || param.companyId==undefined){
            extendUtils.showToast('url上没有companyId')
            return;
        }

        requestHanlder.request('/auth-adapter/v1/getIdToken', param, { notAssignUserParam: true }).then(res => {
            resolve(res.result.idToken);
        }).catch(e => {
            resolve();
            extendUtils.showConfirm(`TGC换取idToken失败(${e.resultCode})`,null,1)
            console.error(e);
        })
    })
}

export function authorize(config, events={}){
    return new Promise(async resolve => {
        extendUtils.loadScript({
            src: PATH,
            id: 'auth',
            onload: async function () {
                Object.assign(constant.AUTH_CONFIG.loginKcConfig, await extendUtils.getJsonFile(constant.AUTH_CONFIG.loginKcConfigPath));
                //获取用户协议回调（这个写在constant里面会导致循环引用）
                constant.AUTH_CONFIG.getAppProtocolsFunc = async (channelId, token)=>protocolHandler.getAppProtocols(channelId, token);
                constant.AUTH_CONFIG.logUserConsentFunc = async param=>protocolHandler.logUserConsent(param);
                constant.AUTH_CONFIG.getUserConsentFunc = async param=>protocolHandler.getUserConsent(param);
                constant.AUTH_CONFIG.getIdTokenByTGC = getIdTokenByTGC;

                events.onOpenAuthDetail = () => {
                    extendUtils.toggleReturnBtn(true);
                }
                events.onCloseAuthDetail = () => {
                    let pageFrom = requestHanlder.getUserParam('pageFrom');
                    if(!pageFrom){//如果前面有页面，则不显隐返回按钮
                        if (!window.opener || history.length <= 1) {
                            extendUtils.toggleReturnBtn(false);
                        }
                    }
                }
                swpServiceAuth.install(Object.assign(constant.AUTH_CONFIG, config), events).then(async data => {
                    window.authorization = data;
                    await extendUtils.authInterceptor()
                    resolve();
                })
            }
        })
    })
}

export function guestLogin(config){
    return new Promise(async resolve => {
        extendUtils.loadScript({
            src: PATH,
            id: 'guestAuth',
            onload: async function () {
                Object.assign(constant.AUTH_CONFIG.loginKcConfig, await extendUtils.getJsonFile(constant.AUTH_CONFIG.loginKcConfigPath));
                constant.AUTH_CONFIG.cacheKey = {
                    USER_CONSENT: `${requestHanlder.supplierId}_userConsent`
                }
                let channelId = extendUtils.getUserPara('channelId')
                let _config = {
                    channelId: channelId,
                    primaryKey: channelId
                }
                swpServiceAuth.guestLogin(Object.assign(constant.AUTH_CONFIG, _config, config)).then(async data => {
                    resolve(data);
                })
            }
        })
    })
}