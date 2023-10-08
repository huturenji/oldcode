import commomUtils from 'src/lib/utils'
import constant from 'sino/constant'
import { Base64 } from 'js-base64';
var Utils = {};

/**
 * 是否运行在兆日的平台中，包括但不限于（今后可能会继续增加）：伴正事、老T信、webOA
 * @returns 
 */
Utils.isInSinoEnv = ()=>{
    let platform = Utils.getPlatform();
    return platform == constant.RUN_ENV.WEBOA 
            || platform == constant.RUN_ENV.BIZMATE 
            || platform == constant.RUN_ENV.TCHAT 
            || platform == constant.RUN_ENV.WEBSINO;
}

/**
 * 是否运行在兆日的WebOA平台中
 * @returns 
 */
Utils.isInWebOA = (deep = true) => {
    let _window = window;
    let hasFlag = () => _window.name.startsWith('applet_')
    if(!deep){
        return hasFlag();
    }
    try{
        while (_window.parent !== self && _window != top) {
            //applet_是webOA iframe上设置的name,name的完整值是 applet_[appletId]
            if(hasFlag()){
                return true
            }
            _window = _window.parent
        }
        return false
    }catch(e){
        return false
    }
}


/**
 * 获取当前运行的平台
 * @param {*} agentStr 如果无法从window.navigator上获取到正确的userAgent（比如大连银行IOS有这种情况），则可手动传入userAgent字符串
 */
let platform;
Utils.getPlatform = () =>{
    if(commomUtils.isNotEmpty(platform)){
        return platform;
    }
    const browserInfo = commomUtils.browserInfo();
    //微信环境
    if(/(micromessenger)/i.test(navigator.userAgent)){
        if (window.__wxjs_environment === 'miniprogram') {
            platform = constant.RUN_ENV.WECHAT_MINI_APP;
        } 
        //微信浏览器授权一定需要这四个参数
        else if(location.href.indexOf('bp-param')>-1
            &&location.href.indexOf('appId')>-1
            &&location.href.indexOf('openId')>-1
            &&location.href.indexOf('channelId')>-1
        ){
            platform = constant.RUN_ENV.WECHAT_H5;
        }else{
            platform = constant.RUN_ENV.BROWSER; 
        }
    }//websino 授权使用H5授权 APP只提供简单的jsbridge交互
    else if(commomUtils.getAPPPlatform() == constant.BRIDGE_TYPE.WEBSINO){
        platform = constant.RUN_ENV.WEBSINO;
    }
    //优先判断webOA
    else if(Utils.isInWebOA()){
        platform = constant.RUN_ENV.WEBOA;
    }
    //通过navigator中的版本号判断
    else if(!!commomUtils.getBizMateVersion()){
        platform = constant.RUN_ENV.BIZMATE;
    }
    //老银行上的商旅一定会有这4个参数，如果都有，则是老银行环境(不用判断是否有值，没有值时会在业务中报错)
    else if(
        location.href.indexOf('TGC') >-1
        && location.href.indexOf('ProdId') >-1
        && location.href.indexOf('cpyId') >-1
        && location.href.indexOf('uaId') >-1
    ){
        platform = constant.RUN_ENV.TCHAT;
    }
    //通过UA来判断是普通浏览器。融合app的ua可能被修改，supporter为空
    else if(browserInfo.platform == "desktop" || (browserInfo.platform == 'mobile' && commomUtils.isNotEmpty(browserInfo.supporter))){
        platform = constant.RUN_ENV.BROWSER;
    }
    //其他场景都默认是bizmate
    else {
        platform = constant.RUN_ENV.BIZMATE;
    }
    return platform
}

/**
 * 是否是web版bizmate打开的
 */
Utils.openedByBizmateWeb = () => {
    try{
        return (commomUtils.getUrlParam() || {}).env == 'bizmate_web' || commomUtils.isNotEmpty(Utils.getSignData())
    }catch(e){
        console.error('sinosdk openedByBizmateWeb error: ', e);
        return false;
    }
}

/**
 * 获取signData。signData中包含了bizmate用户的uaId、cpyId、channelId
 */
Utils.getSignData = () => {
    const platform = Utils.getPlatform();
    //伴正事和T信不走此逻辑
    if(platform == constant.RUN_ENV.BIZMATE
        && platform == constant.RUN_ENV.TCHAT){//todo websino要走这个逻辑  这个逻辑不会走
            return;
    }
    return commomUtils.getUrlParam('signData') || sessionStorage.getItem('signData')
}

/**
 * 解析signData。signData中包含了bizmate用户的uaId、cpyId、channelId
 */
Utils.decodeSignData = (signData, key) => {
    if(commomUtils.isEmpty(signData)){
        return null;
    }
    try{
        signData = commomUtils.isNotEmpty(signData) ? JSON.parse(Base64.decode(signData)) : {}
        if(commomUtils.isNotEmpty(key)){
            return signData[key] || null;
        }
        return signData;
    }catch(e){
        console.error('sinosdk decodeSignData error: ', e);
        return commomUtils.isNotEmpty(key) ? null : {}
    }
}

Utils.getBpParam = ()=>{
    const bpParam = commomUtils.getUrlParam('bp-param') || window.sessionStorage.getItem('bp-param')
    if(commomUtils.isNotEmpty(bpParam)){
        try{
            return JSON.parse(Base64.decode(decodeURIComponent(bpParam)))
        }catch(e){
            console.error(`sinosdk解析bp-param失败,原始数据：${bpParam}。 ` , e)
            return JSON.parse(decodeURIComponent(bpParam))
        }
    }
    return {};
}
export default Object.assign({}, Utils, commomUtils);