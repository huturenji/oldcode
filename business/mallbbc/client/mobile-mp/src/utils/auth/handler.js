import request from '@/utils/request';
import config from '@/common/lib/config';

/*
 * 获取B+ token
 * data：请求参数
 */
export function bplusTokenRequest(data){
    return request({
        method: 'POST',
        noAuth: true,
        fillUserParam: false,
        serviceName: config.BIZCLOUD_SERVICE_NAME, //服务名字
        url: '/user-center/v1/unionAuth',
        header: { "Content-Type": "application/json" },
        data
    })
}

/*
 * B+ 的refresh_token刷新token
 * data：请求参数
 */
export function refreshTokenRequest(data){
    return request({
        method: 'POST',
        noAuth: true,
        fillUserParam: false,
        serviceName: config.BIZCLOUD_SERVICE_NAME, //服务名字
        url: '/user-center/v1/refreshToken',
        header: { "Content-Type": "application/json" },
        data
    })
}

/*
 * 通过小程序的code码等相关信息 获取小程序的签名数据
 * data：请求参数
 */
export function getSignRequest(data){
    return request({
        method: 'POST',
        noAuth: true,
        fillUserParam: false,
        serviceName: config.BIZCLOUD_SERVICE_NAME, //服务名字
        url: '/user-center/v1/getSignature',
        header: { "Content-Type": "application/json" },
        data
    })
}

/*
 * 更新用户信息
 * data：请求参数
 */
export function updateUserInfoRequest(data){
    return request({
        method: 'POST',
        url: '/v3/member/front/member/updateMember',
        header: { "Content-Type": "application/json" },
        data
    })
}

/*
 * 获取微信小程序的openId、session_key、unionId 
 * data：请求参数
 */
export function getOpenId(data){
    return request({
        method: 'POST',
        noAuth: true,
        fillUserParam: false,
        serviceName: config.BIZCLOUD_SERVICE_NAME, //服务名字
        url: '/user-center/v1/weixin/getOpenId',
        header: { "Content-Type": "application/json" },
        data
    })
}

/*
 * 获取微信小程序手机号
 * data：请求参数
 */
export function getWxPhone(data){
    return request({
        method: 'GET',
        noAuth: true,
        fillUserParam: false,
        serviceName: config.BIZCLOUD_SERVICE_NAME, //服务名字
        url: '/user-center/v1/weixin/getPhoneNumber',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data
    })
}


/*
 * B+ token换取bbc token
 * data：请求参数
 */
export function exchangeBbcTokenRequest(data){
    return request({
        method: 'POST',
        noAuth: true,
        fillUserParam: false,
        url: '/v3/member/front/login/tokenExchange',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data
    })
}

/*
 * bbcg2的refresh_token刷新token
 * data：请求参数
 */
export function refreshBbcTokenRequest(data){
    return request({
        method: 'POST',
        noAuth: true,
        fillUserParam: false,
        url: '/v3/member/front/login/token',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data
    })
}


/*
 * 同意协议的接口
 */
export function logUserConsentRequest(data){
    return request({
        method: 'POST',
        noAuth: true,
        fillUserParam: false,
        url: '/v3/channel/front/logUserConsent',
        header: { "Content-Type": 'application/json' },
        data
    })
}

