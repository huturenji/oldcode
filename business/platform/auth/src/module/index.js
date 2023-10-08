import constant from 'constant';
import extendUtils from 'utils';

/**
 * T信授权。使用v2版本
 * @param {*} config 
 * @returns 
 */
async function tchatAuth(config, events){
    return (await require('./version/tchat')).install(config, events)
}

/**
 * 伴正事授权，使用v3
 * @param {*} config 
 * @returns 
 */
async function bizmateAuth(config, events){
    config.identity = constant.IDENTITY.USER;
    return (await require('./version/bizmate')).install(config, events)
}

/**
 * 通过签名授权，使用v3
 * @param {*} config 
 * @returns 
 */
async function signAuth(config, events){
    config.identity = constant.IDENTITY.USER;
    config.mode = 'sign';
    return (await require('./version/bizmate')).install(config, events)
}

/**
 * 游客授权，使用v3
 * @param {*} config 
 * @returns 
 */
async function guestAuth(config, events){
    config.identity = constant.IDENTITY.GUEST;
    return (await require('./version/bizmate')).install(config, events);
}

/**
 * 根据平台执行相应授权逻辑
 * @param {*} config 
 * @returns 
 */
export async function run(config, events){
    try{
        //如果是web版的bizmate打开的，直接走keycloak h5授权
        if(sinosdk.sino.openedByBizmateWeb()){
            config.mode='h5';
            return await bizmateAuth(config, events);
        }
        let authPromise = null;
        //防止无法从window.navigator上获取到正确的userAgent，因此选择从jsbridge中获取（比如大连银行IOS有这种情况）
        //注意：授权入口必须放到业务最前侧执行，否则可能导致某些渠道（比如大连银行）无法正确判断平台
        const platform = sinosdk.sino.getPlatform();//获取平台类别
        //其他情况均通过判断运行平台来选择授权方式
        switch(platform){
            //wechat
            case sinosdk.sino.constant.RUN_ENV.WECHAT_H5: 
            case sinosdk.sino.constant.RUN_ENV.WECHAT_MINI_APP: 
                authPromise = signAuth(config, events);
                break;
            //websino
            case sinosdk.sino.constant.RUN_ENV.WEBSINO: 
                config.mode='h5'
                authPromise = bizmateAuth(config, events);
                break;
            //webOA
            case sinosdk.sino.constant.RUN_ENV.WEBOA: 
                config.mode='h5'
                authPromise = bizmateAuth(config, events);
                break;
            //T信
            case sinosdk.sino.constant.RUN_ENV.TCHAT: 
                authPromise = tchatAuth(config, events);
                break;
            //bizmate
            case sinosdk.sino.constant.RUN_ENV.BIZMATE:     
                //判断bizmate是否登录，如果未登录，则仍使用guest授权
                if(config.identity == constant.IDENTITY.GUEST){
                    authPromise = guestAuth(config, events);
                }else{
                    authPromise = bizmateAuth(config, events);
                }
                break;
            case sinosdk.sino.constant.RUN_ENV.BROWSER:   
            default: 
                authPromise = guestAuth(config, events);
        }
        return await authPromise;
    }catch(e){
        console.error(e)
        //授权异常时提示错误，并阻塞后续流程
        extendUtils.showConfirm({
            content: `<div>系统繁忙，请重新登录APP后再试（101010008）</div><div style='color: #eee;font-size: 12px;'>${e}</div>`,
            showCancelButton: false,
            onConfirm: ()=>sinosdk.sino.back()
        })
    }
}