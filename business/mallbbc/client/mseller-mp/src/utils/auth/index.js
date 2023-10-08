import { setStorageSync, getStorageSync, isNotEmpty, removeStorageSync } from '@/utils/common.js'
import authHandler from '@/utils/auth/handler';
const { atob } = require('@/utils/tool/base64.min.js');
const sellerAuthCacheKey = 'seller_token'; // token存储缓存的key

/**
 * 对外暴露的登录授权的核心方法
 * null 代表需要重新登录
 * @export
 */
export function authorize(){
    return new Promise(async (resolve, reject) => {
        let token = await getToken();
        if(isNotEmpty(token)){ // token 不为空
            if (!isTokenExpired(token)){ //token没有过期
                resolve(token); // 把有效的token返回出去
            } else { // token 已过期
                let refreshToken = await getRefreshToken(); // 获取refresh_token
                if(isNotEmpty(refreshToken) && !isTokenExpired(refreshToken)){ // 有refresh_token 并且没有过期
                    try { 
                        let tokenInfo = await reloadToken(); // refresh token
                        // 更新缓存中的token
                        setTokenInfoToStorage({
                            access_token: tokenInfo.access_token,
                            refresh_token: tokenInfo.refresh_token
                        }); 
                        resolve(tokenInfo.access_token);
                    } catch (error) { //刷新token失败重新走授权
                        resolve(null);
                    }
                } else { // token 过期 或者 没有refreshToken 或者refreshToken过期 重新授权流程
                    resolve(null);
                }
            }
        } else { // token不存在
            resolve(null)
        }
    })
}


/**
 * 设置用户userInfo 设置到缓存里面
 */
export function setTokenInfoToStorage(tokenInfo = {}){  
    setStorageSync(sellerAuthCacheKey, tokenInfo);
}


/**
 * 退出登录
 */
export function loginOut(){
    removeStorageSync(sellerAuthCacheKey);
}

/**
 * 获取token 从缓存中获取
 * @export
 */
export function getToken(){
    return new Promise((resolve, reject) => {

        let token = getStorageSync(sellerAuthCacheKey)
        resolve(token?.access_token);
    })
}

/**
 * 获取refresh_token 从缓存中获取
 * @export
 */
export function getRefreshToken(){
    return new Promise((resolve, reject) => {
        let token = getStorageSync(sellerAuthCacheKey)
        resolve(token?.refresh_token);
    })
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
 * bbc refresh token 刷新token
 */
function reloadToken(){
    return new Promise(async (resolve, reject) => {
        let refreshToken = await getRefreshToken();
        if( !!!refreshToken ){ reject('refreshToken不能为空') }
        authHandler.refresh({
            refresh_token: refreshToken
        }).then(res => {
            if (res.state == 200 && res.data && res.data.access_token){
                resolve(res.data);
            } else {
                reject('refresh token eror, status: ' + res.state)
            }
        }).catch(e => {
            console.error(e);
            reject('refresh token eror: '+ (e ? JSON.stringify(e) : ''))
        })
    })
}