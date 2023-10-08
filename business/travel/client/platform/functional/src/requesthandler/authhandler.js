import base from './base'
import extendUtils from '../utils';
import constant from '../constant';
import protocolhandler from './protocolhandler'

extendUtils.WhiteList.global.push('/auth-adapter/v1/getIdToken')

var requestHanlder = new base();

/**
 * 通过TGC等银企通原始用户属性，获取idToken
 */
function getIdTokenByTGC() {
    return new Promise(async resolve => {
        // let terType = extendUtils.getUserPara('terType')
        // terType = extendUtils.isEmpty(terType) || isNaN(terType) ? 0 : parseInt(terType);
        let param = {
            tgc: extendUtils.getUserPara('TGC'),
            uaId: extendUtils.getUserPara('uaId'),
            channelId: extendUtils.getUserPara('ProdId'),
            companyId: extendUtils.getUserPara('cpyId'),
            terType: extendUtils.getUserPara('terType')
        }
        if (param.tgc==null || param.tgc==undefined || param.tgc==''){
            extendUtils.showToast('打开页面失败，请重新登录后再试（101010001）')//url上没有TGC
            return;
        }
        if (param.uaId==null || param.uaId==undefined || param.uaId==''){
            extendUtils.showToast('打开页面失败，请重新登录后再试（101010002）')//url上没有uaId
            return;
        }
        if (param.channelId==null || param.channelId==undefined || param.channelId==''){
            extendUtils.showToast('打开页面失败，请重新登录后再试（101010003）')//url上没有channelId
            return;
        }
        if (param.companyId==null || param.companyId==undefined || param.companyId==''){
            extendUtils.showToast('打开页面失败，请重新登录后再试（101010004）')//url上没有companyId
            return;
        }

        requestHanlder.request('/auth-adapter/v1/getIdToken', param, { notAssignUserParam: true }).then(res => {
            if (res.result.idToken != null && res.result.idToken != undefined && res.result.idToken != ''){
                resolve(res.result.idToken);
            } else {
                throw new Error({resultCode: '1010100051'})
            }
        }).catch(e => {
            resolve();
            let resultCode = e ? `(${e.resultCode})` : ''
            extendUtils.showConfirm(`打开页面失败，请重新登录后再试（101010005_${resultCode}）`,function(){},1,null,null,null,null,true)//TGC换取idToken失败
            console.error(e);
        })
    })
}

let getSrc = function (type) {
    return constant.HTTP_CONT.ORIGIN + constant.APP_URL_MAP.swplib.path + constant.APP_URL_MAP.swplib.child[type].prefix +
         (constant.APP_URL_MAP.swplib.child[type].version || '') + constant.APP_URL_MAP.swplib.child[type].entry;
}

export async function authorize(config){
    //提前从app获取一次UA
    await sinosdk.sino.getUserAgentFromJsBridge(); 
    await _authorize(config)
}

function _authorize(config){
    return new Promise(async resolve => {
        let src = getSrc('serverAuth');
        constant.AUTH_CONFIG.getIdTokenByTGC = getIdTokenByTGC;
        if (!config.identity){
            config.identity = await getRole();
        }
        sinosdk.sino.auth.getToken(src, Object.assign(constant.AUTH_CONFIG, config)).then(async data => {
            window.authorization = data;
            extendUtils.setSession("role", config.identity);
            //记录用户进入了系统
            protocolhandler.logUserEntered();
            await protocolhandler.getProtocol()
            resolve();
        })
    })
}

async function getRole(){
    const platform = sinosdk.sino.getPlatform()
    if (platform == sinosdk.sino.constant.RUN_ENV.BIZMATE || platform == sinosdk.sino.constant.RUN_ENV.WEBOA || platform == sinosdk.sino.constant.RUN_ENV.WEBSINO
        || sinosdk.sino.openedByBizmateWeb()
    ){
        //判断是否登陆
        let isLogined = await sinosdk.sino.isLogined();
        if (isLogined.ret ==0 && isLogined.responseData.status == 1){
            return constant.ROLE.USER
        }
        return constant.ROLE.GUEST
        
    } else if (platform == sinosdk.sino.constant.RUN_ENV.TCHAT){
        return constant.ROLE.USER
    } else if (platform == sinosdk.sino.constant.RUN_ENV.WECHAT_H5 || platform == sinosdk.sino.constant.RUN_ENV.WECHAT_MINI_APP){
        return constant.ROLE.USER
    }
    return constant.ROLE.GUEST
    
}
export function guestLogin(){
    return authorize({identity: 'guest'})
}

export async function moduleGate(func){
    try {
        extendUtils.throttle(async ()=>{
            if (await getRole() == constant.ROLE.GUEST){
                sinosdk.sino.login().then(async result=>{
                    if (result.state){
                        window.authorization && window.authorization.logout();//先登出guest
                        await authorize({identity: constant.ROLE.USER});//重新授权
                        func && func(true);
                    } else {
                        console.info('用户未登录')
                    }
                })
            } else {
                func && func(false);
            }
        }, 'moduleGate', 1000, 'moduleGate')
    } catch (e){
        console.error(e);
    }
}
