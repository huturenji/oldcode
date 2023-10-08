import request from './request'
import appEvent from '@/common/mixin/appEventMixin'
import {ScrollLock} from '@/utils/scrollUtils'
import {getPrimaryKey, isEmpty} from '@/utils/common'
import config from '@/common/lib/config';
/**
 * 获取协议内容
 * @param {*} channelId 
 * @returns 必须返回type：text或file。然后按类型返回相应的字段
 */
function getAppProtocols() {
    return new Promise(resolve => {
        let userInfo = getApp().globalData.userParams;
        let channelId = userInfo.channelId;
        request({
            url: 'v3/channel/front/getAppProtocols',
            method: 'get',
            data: {
                channelId: channelId
            },
            noAuth: true
        }).then(res => {
            if (res.data && res.data.channelProtocolForApps && res.data.channelProtocolForApps.length > 0) {
                resolve({
                    content: res.data.channelProtocolForApps
                });
            } else {
                resolve();
            }
        }).catch(e => {
            resolve();
            console.error(e);
        })
    })
}

/**
 * 记录用户是否同意了协议
 * @param param: {logUserConsents: [授权协议id的list]}
 */
function logUserConsent(param) {
    let logUserConsents = []
    let { userId, companyId, companyName, channelId } = getApp().globalData.userParams;

    const logUserConsentsItems = {
        userId,
        companyId,
        channelId,
        companyName,
        approval: true
    };

    // 有协议情况
    param && param.protocols.content && param.protocols.content.forEach(auth => {
        logUserConsents.push(Object.assign(logUserConsentsItems, { protocolId: auth.protocolId }))
    })


    // 无协议情况
    !param && logUserConsents.push(Object.assign(logUserConsentsItems, { protocolId: -1 }));


    return new Promise(resolve => {
        request({
            url: 'v3/channel/front/logUserConsent',
            data: {
                logUserConsents: logUserConsents
            },
            method: 'post',
            noAuth: true,
            header: {
                "Content-Type": 'application/json'
            }
        }).then(res => {
            resolve(res.state == 200)
        }).catch(e => {
            resolve(false);
            console.error(e);
        })
    })
}

/**
 * 获取用户是否同意协议
 */
function getUserConsent() {
    let userInfo = getApp().globalData.userParams;
    let param = {
        "userId": userInfo.userId,
        "companyId": userInfo.companyId,
        "channelId": userInfo.channelId
    }
    return new Promise(resolve => {
        request({
            url: 'v3/channel/front/getUserConsent',
            data: param,
            method: 'get',
            noAuth: true
        }).then(res => {

            // 过滤以前无协议但默认同意过协议的情况，然后协议更新后用户访问时可再次确认
            const newProtocolIds = res.data.protocolIds.filter(item => {
                return item !== -1;
            })
            let data = res.state == 200 && newProtocolIds && newProtocolIds.length > 0;

            resolve(data);
        }).catch(e => {
            resolve(false);
            console.error(e);
        })
    })
}


export function getProtocol(_config = {}, events = {}) {
    return new Promise(resolve => {
        try {
            //获取用户协议回调（这个写在config里面会导致循环引用）
            _config.getAppProtocolsFunc = async channelId => await getAppProtocols(channelId);
            _config.logUserConsentFunc = async param => await logUserConsent(param);
            _config.getUserConsentFunc = async param => await getUserConsent(param);
            _config.showDetailCloseBtn = false;
            _config.primaryKey = getPrimaryKey();
            _config.zIndex = 12999;
    
            const scrollLock = new ScrollLock()
            let titleBarConfig;
    
            //控制返回按钮关闭协议详情
            events.onShowProtocolDetail = instance => {
                titleBarConfig = window.titleBar.getCurrConfig();//缓存当前title的样式
                window.titleBar.reset();//重置title样式
                sinosdk.sino.onBack(() => { //注册返回事件
                    //用户点击返回后，关闭协议详情，并允许业务侧注册app事件
                    delete window.freezeRegisterAppEvent;
                    instance.closeProtocolDetail();
                })
                window.freezeRegisterAppEvent = true;//停止业务侧注册app事件
                sinosdk.sino.showReturnBtn(true);//显示返回按钮
            }
            events.onCloseProtocolDetail = () => {
                window.titleBar.set(titleBarConfig)//还原title样式
                appEvent.methods.tChatEventAppBack();//还原注册app事件
                sinosdk.sino.showReturnBtn(false);//显示返回按钮
            }
            //防止滚动穿透
            events.onShow = () => {
                scrollLock.lock();//展示协议时锁定页面滚动条
            }
            events.onComplete = () => {
                scrollLock.unlock();//恢复页面滚动条
                resolve()
            }
            window.protocol = window.sinoProtocol.install(_config, events)
        } catch (e){
            console.error('获取用户协议失败：' + e)
            resolve()
        }
    })
}

/**
 * 记录用户进入了本系统
 * @param {*} param 
 */
export function logUserEntered(param){
    try{
        const KEY = `bp_${config.AUTH_CONFIG.loginKcConfig.clientId}_entered`;
        if(isEmpty(window.sessionStorage.getItem(KEY))){
            logUserConsent(param)
            window.sessionStorage.setItem(KEY, 1)
        }
    }catch(e){
        console.warn('log user entered failed. ' + e)
    }
}
