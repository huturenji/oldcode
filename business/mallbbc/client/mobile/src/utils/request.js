import App from '@/App'
import {
    getCacheUserInfo, getBplusToken, authorize, logoutBbc
} from '../utils/auth.js'
import store from '@/store'
import SafeRequest from '@/utils/safeRequest'
let reAuth = null;
let reAuthTimes = 0;//重试授权计数

export default async function request(opt) {
    //等待重新授权
    if (!opt.noAuth && reAuth){
        await reAuth;
    }
    opt = opt || {};
    opt.url = opt.url || '';
    opt.data = opt.data || null;
    opt.method = opt.method || 'GET';
    let otherParam = {};
    if (!opt.responseType) {
        opt.header = opt.header || Object.assign({}, opt.header, {
            "Content-Type": "application/x-www-form-urlencoded",
            "Language": App.globalData.curLang
        });
        otherParam.dataType = 'json'
    } else {
        opt.header = Object.assign({}, opt.header, {
            "Language": App.globalData.curLang
        })
        otherParam.responseType = opt.responseType;
    }

    let token = '';
    if (!opt.noAuth) {
        token = (await getCacheUserInfo()).access_token;
    }
    //opt.noAuth表示不需要token相关逻辑
    if (opt.noAuth !== false) {
        opt.header.Authorization = 'Bearer ' + token;
    }
    let globalUserData = getApp().globalData.userParams;
    let userData = {
        channelId: opt?.data?.channelId ?? globalUserData.channelId,
        companyId: opt?.data?.companyId ?? globalUserData.companyId,
        userId: opt?.data?.userId ?? globalUserData.userId
    }
    if (opt.data) {
        //如果不是formData类型，则使用处理后的参数对象，否则使用原始值
        if (!(opt.data instanceof FormData)) {
            if (typeof opt.data == 'string'){ //jsonString处理
                try {
                    opt.data = JSON.stringify(Object.assign({}, JSON.parse(opt.data), userData));
                } catch (e){ console.error(e) }
            } else {
                opt.data = Object.assign({}, opt.data, userData);
            }
        }
    } else {
        opt.data = userData;
    }
    let url = ''
    if (opt.url.startsWith('media/content')){
        url = `${window.location.origin}/${opt.url}`
        opt.header.Authorization = 'Bearer ' + await getBplusToken({identity: store.state.role});
    } else if (opt.url.startsWith('http')){
        url = opt.url;
    } else {
        url = getApp().globalData.apiUrl + opt.url;
    }
    if (opt.method === 'GET'){
        url += `${url.indexOf('?') > -1 ? '&' : '?'}t=${new Date().getTime()}`;
    }
    return new Promise(async (resolve, reject) => {
        //封装bsl请求参数
        let safeRequest = new SafeRequest();
        let safeParam = await safeRequest.packageParams({url, method: opt.method, data: opt.data, header: opt.header}, {enableBsl: opt.enableBsl, encryption: opt.encryption});
        uni.request({
            ...safeParam,
            ...otherParam,
            success: async res => {
                try {
                    res.data = await safeRequest.unpackageParams(res.data, safeParam)
                } catch (e){
                    res.data = e;
                    reject(res);
                    console.error('bsl service error! ' + e)
                    return;
                }
                //token校验失败后重新执行一次tokenExchange流程
                //最大重试3次
                if (res.data?.state == 266 && reAuthTimes < 3){
                    /* eslint-disable */
                    reAuth = new Promise(async reAuthResolve => {
                        await logoutBbc();
                        await authorize();
                        reAuthResolve();
                    })
                    /* eslint-disable */
                    await reAuth;
                    reAuthTimes++;
                    //重新授权后重新执行一次当前请求
                    resolve(request(opt));
                    return;
                }
                resolve(res.data);
            },
            fail: err => {
                reject(err);
            },
            complete: () => {}
        })
    })
}
