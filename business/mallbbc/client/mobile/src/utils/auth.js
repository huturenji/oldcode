import App from '../App';
import config from '@/common/lib/config';
import {
    isEmpty,
    isNotEmpty,
    throttle
} from './common.js'
import request from './request'
import global from '@/common/lib/reload.js'
import store from '@/store'
import QueueLock from '@/utils/taskLock/queue.js'

const queueLock = new QueueLock();
let _tchatUserInfo = null;
let PATH = `./thirdparty/auth/swp-serviceAuth.js?t=${TIMESTAMP_ENV}`

async function getTchatUserInfo(){
    try {
        if (isNotEmpty(_tchatUserInfo)){
            return _tchatUserInfo;
        }
        _tchatUserInfo = await sinosdk.sino.getUserInfo()
        return _tchatUserInfo;
    } catch (e){
        console.error('authorize getTchatUserInfo error: '+e);
    }
    return {}
}

async function getPrimaryKey(role){
    let tchatUserInfo = await getTchatUserInfo();
    if (isEmpty(tchatUserInfo)){
        return config.CLIENT_NAME + '_' + role;
    }
    return tchatUserInfo?.UAId + '_' + config.CLIENT_NAME + '_' + role
}

export async function getCacheUserInfo(role = store.state.role){
    return uni.getStorageSync((await getPrimaryKey(role))+'_userInfo')
}

/**
 * 获取bbc token
 * @returns 
 */
async function getBbcToken(opt){
    let bplusToken = await getBplusToken(opt)
    let userToken = await exchangeBbcToken(bplusToken);
    return userToken;
}

/**
 * 获取新的b+ token
 */
export function getBplusToken(opt = {}) {
    return new Promise(async resolve => {
        let events = {
            log: (type, level, desc) => log(type, level, desc)
        }

        sinosdk.sino.auth.getToken(PATH, Object.assign({}, config.AUTH_CONFIG, opt), events).then(
            async data => {
                window.authorization = data;
                resolve(authorization.getToken());
            }
        ).catch(e => {
            console.error('getBplusToken error：'+e)
            resolve();
        })
    })
}

/**
 * b+ token换取bbc token
 */
function exchangeBbcToken(token) {
    return new Promise(resolve => {
        let data = {
            bPlusAccessToken: token,
            memberRegisterChannel: 2 //会员来源：1-pc、2-H5、3-安卓、4-IOS、5-商城管理平台、6-微信商城
        }
        //如果有缓存的购物车数据，登录需要把数据同步，并清除本地缓存
        let local_cart_list = uni.getStorageSync('cart_list')
        let cartInfo = []
        if (local_cart_list) {
            local_cart_list.storeCartGroupList.forEach(item => {
                item.promotionCartGroupList.forEach(item1 => {
                    item1.cartList.forEach(item2 => {
                        if (item2.isChecked == 1) {
                            cartInfo.push({
                                sku: item2.sku,
                                buyNum: item2.buyNum,
                                storeId: item.storeId
                            })
                        }
                    })
                })
            })
            data.cartInfo = JSON.stringify(cartInfo)
        }
        request({
            url: 'v3/member/front/login/tokenExchange',
            data: data,
            method: 'post',
            noAuth: true
        }).then(async res => {
            if (res.state == 200) {
                uni.removeStorage({
                    key: 'cart_list'
                }); //清除购物车数据
                //如果推手分享，则建立推手分享关系 (存疑，找不到estabTs函数定义)
                // if(getStorageSync('u')){
                // this.estabTs()
                // }
                
            } else {
                //错误提示
                setTimeout(function () { //需延迟执行，否则toast出不来
                    global.$api.msg(res.msg);
                }, 500)
            }
            resolve(res.data);
        }).catch(e => {
            resolve();
            console.error(e);
        })
    })
}

/**
 * 初始化用户名
 */
function initMemberName(token){
    try {
        //获取个人中心的数据
        request({
            url: 'v3/member/front/member/memberInfo'
        }).then(async memberResult => {
            let memberInfo = memberResult.data;
            //如果没有昵称，则使用B+ token中的名字
            if (!memberInfo?.memberNickName) {
                let tokenParsed = decodeBbcToken(token)
                let userName = tokenParsed.userName;
                if (!!userName && !await setMemberNickName(userName)) {
                    console.error('初始化昵称失败！');
                } else {
                    memberInfo.memberNickName = userName;
                }
            }
            if (memberInfo) {
                store.commit("setUserCenterData", memberInfo);
            }
        }).catch(e => {
            throw e
        })
    } catch (e) {
        console.error('初始化昵称失败！', e);
    }
}

/**
 * 设置用户昵称
 * @param {Object} val
 */
async function setMemberNickName(val) {
    try {
        let param = {
            url: 'v3/member/front/member/updateInfo',
            method: 'POST',
            data: {
                memberNickName: val
            }
        };
        let res = await request(param)
        if (res.state == 200) {
            return true;
        }
        return false;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/** 
 * 刷新token
 * @zjf-2021-07-22
 */
function reloadToken(refresh_token) {
    return new Promise((resolve, reject) => {
        uni.request({
            noAuth: true,
            url: getApp().globalData.apiUrl + 'v3/member/front/login/token',
            data: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Language": App.globalData.curLang,
                Authorization: 'Basic ZnJvbnQ6ZnJvbnQ='
            },
            success: res => {
                if (res?.data?.state == 200){
                    resolve(res.data.data);
                } else {
                    reject('refresh token eror, statusCode: '+res.statusCode)
                }
            },
            fail: res => {
                console.error(res);
                reject('refresh token eror: '+ (res ? JSON.stringify(res) : ''))
            }
        })
    })
}

/**
 * 设置用户公共参数
 */
async function setUserParams(token) {
    let tokenParsed = {};
    if (token){
        tokenParsed = decodeBbcToken(token)
    }
    const tchatUserInfo = await sinosdk.sino.getUserInfo();
    //user角色才有这些数据
    getApp().globalData.userParams = {
        userId: tokenParsed.userId,
        userName: tokenParsed.userName,
        channelId: await sinosdk.sino.getChannelId(),
        companyId: tchatUserInfo.cpyId ?? -1,
        companyName: tchatUserInfo.cpyName ?? '',
        userPhone: tokenParsed.mobile
    }
}

/**
 * 解析bbc的token
 */
function decodeBbcToken(token) {
    try {
        let strings = token.split("."); //截取token，获取载体
        //解析，需要吧‘_’,'-'进行转换否则会无法解析
        return JSON.parse(decodeURIComponent(escape(window.atob(strings[1].replace(/-/g, "+").replace(/_/g, "/")))));
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * 判断token是否过期
 */
function isBbcTokenExpired(token, minValidity = 90) {
    try {
        if (!token) {
            return true;
        }
        token = decodeBbcToken(token);
        let expiresIn = token.exp - Math.ceil(new Date().getTime() / 1000);
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
 * 自动刷新bbc token
 */
let refreshInterval = null;
function autoRefreshBbcToken() {
    clearInterval(refreshInterval);
    refreshInterval = null;
    refreshInterval = setInterval(async () => {
        let userInfo = await getCacheUserInfo(store.state.role)
        //判断token是否已过期
        if (isBbcTokenExpired(userInfo.access_token)) {
            try {
                if (!userInfo.refresh_token){
                    throw 'no refresh token'
                }
                userInfo = await reloadToken(userInfo.refresh_token);
                //同步userInfo
                updateUserInfo(userInfo)
            } catch (e){
                //如果刷新异常，则重新授权
                authorize({identity: store.state.role});
                console.warn(e);
            }
        }
    }, 30 * 1000)
}

/**
 * 初始化登陆用户信息
 */
async function initUser(userInfo, role){
    //设置global用户参数，必须最先执行，否则后面的primaryKey生成不正确
    await setUserParams(userInfo?.access_token)
    //设置角色
    store.commit("setRole", role);
    updateUserInfo(userInfo)
}

async function updateUserInfo(userInfo){
    if (userInfo){
        userInfo.primaryKey = await getPrimaryKey(store.state.role);
    }
    //同步login信息
    store.commit("login", userInfo || {})
}

async function getRole(){
    //url如果有规则，则优先使用url上的规则
    let roleInUrl = SnUtils.getUserPara('role');
    if (isNotEmpty(roleInUrl)){
        return roleInUrl;
    }
    let role = null;
    //判断是否登陆
    let isLogined = await sinosdk.sino.isLogined();
    if (isLogined?.ret ==0 && isLogined?.responseData?.status == 1){
        role = config.ROLE.USER
    } else {
        role= config.ROLE.GUEST
    }
    return role;
}

/**
 * 授权主入口
 */
export function authorize(opt = {}) {
    return new Promise(resolve => {
        queueLock.exec(async ()=>{
            let resultToken;//最终返回的token
            let initName = false;//是否需要初始化用户名称
            let initialized = false;
            //判断用户身份
            let role = opt.identity = opt.identity || await getRole()
            //获取缓存的用户信息
            let userInfo = await getCacheUserInfo(role) || {};
            try {
                //无用户信息
                if (!userInfo.access_token) {
                    throw 'no login'
                }
                //用户token已过期
                if (isBbcTokenExpired(userInfo.access_token, 10)) {
                    //如果refreshToken没过期，则继续用refreshToken获取token，不需要重新授权
                    if (!isBbcTokenExpired(userInfo.refresh_token, 90)) {
                        resultToken = (await reloadToken(userInfo.refresh_token))
                        initialized = true;
                        return;
                    }
                    throw 'bbc token will be expired in 10s'
                }
                resultToken = userInfo
                if (!window.bbcAuthorized){
                    initialized = true;
                }
            } catch (e) {
                console.warn(e);
                _tchatUserInfo = null;//重新授权时清空原办正事用户信息，重新获取。防止切换用户身份时拿到了旧身份的用户信息
                if (role == config.ROLE.USER){
                    logoutBbc(config.ROLE.GUEST)
                } else {
                    logoutBbc(config.ROLE.USER)
                }
                resultToken = await getBbcToken(opt);
                initialized = true;
                initName = true;
            } finally {
                // if (!resultToken){
                //     SnUtils.showToast('授权失败，请稍后重试(101010009)')
                // }
                //初次进入页面，需要根据token初始化用户信息
                if (initialized){
                    if (resultToken){
                        window.bbcAuthorized = true;
                        autoRefreshBbcToken();
                    }
                    await initUser(resultToken, opt.identity)
                }
                resolve(resultToken?.access_token)
                //初次登陆时初始化用户昵称
                initName && initMemberName(resultToken?.access_token);
            }
        })
    })

}

/**
 * 模块登录判断
 * @param {*} func 使用/进入模块的函数
 */
export async function moduleGate(func) {
    try {
        throttle(() => {
            if (store.getters.isGuest){
                sinosdk.sino.login().then(async result=>{
                    if (result.state){
                        uni.showLoading();
                        await authorize({identity: config.ROLE.USER});//重新授权
                        uni.hideLoading();
                        func?.(true)
                    } else {
                        result.msg && uni.showModal({
                            content: result.msg,
                            showCancel: false
                        });
                    }
                })
            } else {
                func?.(false)
            }
        }, 'moduleGate')
    } catch (e) {
        console.error(e);
    }
}

/**
 * 登出bbc（清理bbc的用户缓存）
 */
export async function logoutBbc(role = store.state.role){
    store.commit("logout", role)
}

function log(type, level, desc){
    if (level == 'error'){
        console.warn(`[${level}]${type}:${desc}`)
    }
}