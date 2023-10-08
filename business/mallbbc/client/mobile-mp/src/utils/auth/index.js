// 项目中对外暴露的项目授权核心方法
import config from '@/common/lib/config';
import { exchangeBbcTokenRequest, refreshBbcTokenRequest, updateUserInfoRequest, logUserConsentRequest } from '@/utils/auth/handler';
import { authorize as unionAuthorize, setUserParams as setWxUserParams, wxUserInfoKey} from './unionAuth';
import { setStorageSync, getStorageSync } from '@/utils/common.js'
const bbcAuthCacheKey = 'sino-bbcauth-user'; // token存储缓存的key
const protocolIdCacheKey = 'sino-protocolIds'; // 同意协议的key id
const defaultProtocolId = '-1'; // 默认同意协议的协议id 目前是-1
const { atob } = require('@/utils/tool/base64.min.js');

/**
 * 对外暴露的bbc授权的核心方法
 * @export
 */
export function authorize(){
    return new Promise(async resolve => {    
        let token = await getToken();
        if (!!token){ //有token
            if (!isTokenExpired(token)){ //token没有过期
                setUserParams(getStorageSync(bbcAuthCacheKey)); //更新global里面的用户信息，防止页面刷新的时候，global里面的用户信息为空的问题
                setWxUserParams(getStorageSync(wxUserInfoKey)); //更新global里面的用户信息，防止页面刷新的时候，global里面的用户信息为空的问题
                resolve(token); // 把有效的token返回出去
            } else { // token 已过期
                let refreshToken = await getRefreshToken(); // 获取refresh_token
                if(refreshToken && !isTokenExpired(refreshToken)){ // 有refresh_token 并且没有过期
                    try { 
                        let userInfo = await reloadToken(); // refresh token
                        setUserInfoToStorage(userInfo); // 更新缓存中的token
                        setUserParams(userInfo); // 更新globalData里面用户相关的参数
                        resolve(userInfo.access_token);
                    } catch (error) { //刷新token失败重新走授权
                        resolve(await reAuthorize());
                    }
                } else { // token 过期 或者 没有refreshToken 或者refreshToken过期 重新授权流程
                    resolve(await reAuthorize());
                }
            }
        } else { //缓存中没有token的重新走授权流程
            resolve(await reAuthorize());
        }
    })
}

/**
 * 设置用户同意协议
 */
export function setUserConsent(){
    return new Promise(async resolve => {
        if(!checkProtocolId()){
            let flag = await logUserConsent()
            if(flag){
                setStorageSync(protocolIdCacheKey, defaultProtocolId)
            }
        }
        resolve()
    })
}

/***
 * 检测默认的协议id(即-1)在缓存中是否存在
 * @param id: {-1: 授权协议id}
 */
export function checkProtocolId(){
    let protocolId = getStorageSync(protocolIdCacheKey);
    return !!protocolId && protocolId == defaultProtocolId;
}

/**
 * 记录用户是否同意了协议
 * @param param: {logUserConsents: [授权协议id的list]}
 */
export function logUserConsent(param){
    let logUserConsents = []
    let { userId, companyId, channelId } = getApp().globalData.userParams;
    let companyName = config.COMPANYNAME;

    const logUserConsentsItems = {
        userId,
        companyId,
        channelId,
        companyName,
        approval: true
    };

    // 有协议情况
    // param && param.protocols.content && param.protocols.content.forEach(auth => {
    //     logUserConsents.push(Object.assign(logUserConsentsItems, { protocolId: auth.protocolId }))
    // })

    // 目前都是无协议情况 默认同意的协议id为-1
    !param && logUserConsents.push(Object.assign(logUserConsentsItems, { protocolId: defaultProtocolId }));
    return new Promise(resolve => {
        logUserConsentRequest({logUserConsents}).then(res => {
            resolve(res.state == 200)
        }).catch(e => {
            resolve(false);
            console.error(e);
        })
    })
}


/**
 * 重新授权
 * @export
 */
export function reAuthorize(){
    return new Promise(async resolve => {
        loginOut(); // 退出登录
        resolve(await authCore()); //重新授权
    })
}


/**
 * 微信小程序没有token 重新授权的时候需要走的核心授权流程
 */
async function authCore(){  
    return new Promise(async resolve => {
        try {
            let bPlusAccessToken = await unionAuthorize(); // 走B+授权 拿 B+ token
            if (!!bPlusAccessToken){
                let userInfo = await exchangeBbcToken(bPlusAccessToken); // 根据B+ token换取 bbc token
                setUserInfoToStorage(userInfo); // 将用户token信息存入缓存
                setUserParams(userInfo); // 更新globalData里面用户相关的参数
                resolve(userInfo.access_token); // 授权完成
            } else {
                resolve(false); //授权失败
            }
        } catch (error) {
            console.log(error);
            resolve(false); //授权失败
        }
    })  
}

/**
 * 设置用户userInfo 设置到缓存里面
 */
 export function setUserInfoToStorage(userInfo = {}){  
    setStorageSync(bbcAuthCacheKey, userInfo);
}

/**
 *更新globalData里面用户相关的参数
 */
function setUserParams(userInfo){
    if(!!(userInfo?.access_token)){
        let { userId } = decodeToken(userInfo?.access_token);
        getApp().globalData.userParams = Object.assign({}, getApp().globalData.userParams, {
            channelId: config.CHANNELID,
            companyId: config.COMPANYID,
            userId
        })
    }
}

/**
 * b+ token换取bbc token
 */
export function exchangeBbcToken(bplusToken){
    return new Promise(async (resolve, reject) => {
        if( !!!bplusToken ){reject('bplusToken不能为空')}
        exchangeBbcTokenRequest({
            bPlusAccessToken: bplusToken,
            memberRegisterChannel: 2 //会员来源：1-pc、2-H5、3-安卓、4-IOS、5-商城管理平台、6-微信商城
        }).then(res => {
            if(res.state == 200 && res.data){
                resolve(res.data);
            } else {
                reject('BplusToken换取bbcToken失败')
            }
        }).catch(e=>{
            reject('BplusToken换取bbcToken失败', e)
        })
    })
}

/**
 * bbc refresh token 刷新token
 */
function reloadToken(){
    return new Promise(async (resolve, reject) => {
        let refreshToken = await getRefreshToken();
        if( !!!refreshToken ){reject('refreshToken不能为空')}
        refreshBbcTokenRequest({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        }).then(res => {
            if (res.state == 200 && res.data && res.data.access_token){
                resolve(res.data);
            } else {
                reject('refresh token eror, status: ' + res.state)
            }
        }).catch(e=>{
            console.error(res);
            reject('refresh token eror: '+ (res ? JSON.stringify(res) : ''))
        })
    })
}



/**
 * 获取token 从缓存中获取
 * @export
 */
export function getToken(){
    return new Promise(async (resolve) => {
        let token = getStorageSync(bbcAuthCacheKey);
        resolve(token?.access_token);
    })
}
/**
 * 获取refresh_token 从缓存中获取
 * @export
 */
export function getRefreshToken(){
    return new Promise(async (resolve) => {
        let token = getStorageSync(bbcAuthCacheKey);
        resolve(token?.refresh_token);
    })
}

/**
 * 解析token
 * @param token token
 * @export
 */
 export function decodeToken(token){
    try {
        let strings = token.split("."); //截取token，获取载体
        let str = strings[1].replace(/-/g, "+").replace(/_/g, "/"); //解析，需要吧‘_’,'-'进行转换否则会无法解析
        return JSON.parse(decodeURIComponent(atob(str)));
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * 判断token是否过期
 * @param token token
 * @param minValidity 兼容时间 提前多少时间判断token过期时间
 */
function isTokenExpired(token, minValidity = 90, key = 'exp') {
    try {
        if (!token) {
            return true;
        }
        token = decodeToken(token);
        let expiresIn = token[key] - Math.ceil(new Date().getTime() / 1000);
        if (minValidity) {
            if (isNaN(minValidity)) {
                throw 'Invalid minValidity';
            }
            expiresIn -= minValidity;
        }
        return expiresIn < 0;
    } catch (e) {
        return true;
    }
}

/**
 * 退出登录
 */
export function loginOut(){
    uni.removeStorageSync(bbcAuthCacheKey);
    uni.removeStorageSync(protocolIdCacheKey);
}

/***
 * 更新用户信息
 * phoneNumber 手机号
 * nickName 昵称
 */
export function updateUserInfo(userInfo = {}){
    return new Promise(resolve => {
        updateUserInfoRequest(userInfo).then(res => {
            resolve(res)
        }).catch(e => {
            console.log(e);
            resolve(null)
        })
    })
}