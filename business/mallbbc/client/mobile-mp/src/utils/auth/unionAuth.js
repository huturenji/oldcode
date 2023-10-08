/*****
 * js模块文件说明
 * B+ 统一认证接口 即获取、刷新等B+ token的相关流程 
 */

import wxAuth from '@/utils/auth/weixin.js'; //微信小程序相关的授权方法
import config from '@/common/lib/config';
import { bplusTokenRequest, refreshTokenRequest, getSignRequest } from '@/utils/auth/handler';
import { setStorageSync, getStorageSync } from '@/utils/common.js'
const { atob } = require('@/utils/tool/base64.min.js'); // 解析token辅助方法
const unionAuthCacheKey = 'sino-unionauth-user'; //B+ token存储缓存的key
export const wxUserInfoKey = 'wxUserInfo'; //微信小程序的用户信息


/****
 * 对外暴露的核心 B+ 统一授权方法
 * return B+的accessToken
 */
export function authorize(){
    return new Promise(async resolve => {    
        let token = await getToken();
        if (!!token){ //有token
            if (!isTokenExpired(token, 60)){ //token没有过期
                resolve(token); // 把有效的token返回出去
            } else { // token 已过期
                let refreshToken = await getRefreshToken(); // 获取refresh_token
                if(refreshToken && !isTokenExpired(refreshToken, 60)){ // 有refresh_token 并且没有过期
                    try { 
                        let userInfo = await reloadToken(); // refresh token
                        setUserInfoToStorage(userInfo); // 更新缓存中的token
                        resolve(userInfo.accessToken);
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
 * 授权的时候需要走的核心授权流程
 */
 async function authCore(){  
    return new Promise(async resolve => {
        try {
            let userInfo = await getBplusToken(); // 获取B+ token
            setUserInfoToStorage(userInfo); // 将用户token信息存入缓存
            resolve(userInfo.accessToken); // 授权完成
        } catch (error) {
            console.log(error);
            resolve(false); //授权失败
        }
    })  
}

/**
 * 通过第三方的id等相关信息作为参数 获取B+ token
 */
export function getBplusToken(){
    return new Promise(async (resolve, reject) => {
        let signData = await getSign();
        if (!!signData){
            bplusTokenRequest({
                sign: signData.sign, // 签名数据
                thirdUserId: signData.openId, //第三方用户id
                channelId: signData.channelId, //渠道id
                wxUnionId: signData.unionId, //小程序联合id
                mobile: signData.mobile, //手机号
                name: signData.name, //姓名
                signAlg: signData.signAlg, //签名算法
                timestamp: signData.timestamp, //时间戳
                source: 'social_weixin', //来源 
                applicationId: config.MINI_CONFIG.applicationId //小应用程序 
            }).then(res => {
                if(res.resultCode == 0 && res.result && res.result && res.result.accessToken){
                    resolve(res.result);
                } else {
                    reject('获取BplusToken失败')
                }
            }).catch(e=>{
                reject('获取BplusToken失败', e)
            })
        } else {
            reject('获取签名数据失败')
        }
    })
}

/**
 * B+ refreshToken 刷新token
 */
function reloadToken(){
    return new Promise(async (resolve, reject) => {
        let refreshToken = await getRefreshToken();
        if( !!!refreshToken ){reject('B+ refreshToken不能为空')}
        refreshTokenRequest({
            refreshToken
        }).then(res => {
            if (res.resultCode == 0 && res.result){
                resolve(res.result);
            } else {
                reject('refresh token eror, status: ' + res.state)
            }
        }).catch(e=>{
            console.error(e);
            reject('refresh token eror: '+ (e ? JSON.stringify(e) : ''))
        })
    })
}

/**
 * 设置用户B+ userInfo 设置到缓存里面
 */
function setUserInfoToStorage(userInfo = {}){  
    setStorageSync(unionAuthCacheKey, userInfo);
}

/**
 * 通过微信code码等相关信息获取签名数据
 */
function getSign(){
    return new Promise(async (resolve) => {
        // 通过微信授权功能 获取微信小程序的code码
        let code = await wxAuth.getWxCode();
        if(!code){  
            console.log('获取微信code码失败');
            resolve(null);
            return
        }
        let params = {
            code, // 微信小程序code码
            channelId: config.CHANNELID, //渠道ID
            timestamp: String(new Date().getTime()), //时间戳
            signAlg: 'SHA256', //签名算法
            mobile: '', //手机号 没有提供可以传空字符串
            name: '', // 姓名 没有提供可以传空字符串
            weixinAppletType: config.MINI_CONFIG.WX_APPLET_TYPE //微信小程序的环境类型
        }
        // 通过微信code码等相关信息获取签名数据
        getSignRequest(params).then(res => {
            if(res.resultCode == 0 && !!res.result && !!res.result.sign){
                setUserParams(res.result); //更新用户信息
                resolve({
                    sign: res.result.sign,
                    unionId: res.result.unionId || '',
                    openId: res.result.openId || '',
                    sessionKey: res.result.sessionKey || '',
                    ...params
                });
            }else{
                resolve(null);
                console.log('微信code码获取签名数据失败', res);
            }
        }).catch(e => {
            console.log('微信code码获取签名数据失败', e);
            resolve(null);;
        })
    })
}

/**
 *更新globalData里面微信小程序用户相关的参数
 */
export function setUserParams(userInfo){
    if(userInfo?.openId){
        let wxUserInfo = {
            openId: userInfo.openId,
            unionId: userInfo.unionId
        }
        setStorageSync(wxUserInfoKey, wxUserInfo)
        getApp().globalData.userParams = Object.assign({}, getApp().globalData.userParams, wxUserInfo)
    }
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
 * 获取token 从缓存中获取 B+ accessToken
 * @export
 */
export function getToken(){
    return new Promise(async (resolve) => {
        let token = getStorageSync(unionAuthCacheKey);
        resolve(token?.accessToken);
    })
}
/**
 * 获取refreshToken 从缓存中获取 B+ refreshToken
 * @export
 */
export function getRefreshToken(){
    return new Promise(async (resolve) => {
        let token = getStorageSync(unionAuthCacheKey);
        resolve(token?.refreshToken);
    })
}

/**
 * 退出登录
 */
 export function loginOut(){
    uni.removeStorageSync(unionAuthCacheKey);
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