import { toLogin, removeShopStorage } from '@/utils/common';
import config from '@/common/lib/config';
import { getToken, loginOut as loginAhthOut } from '@/utils/auth/index';

export default async function request(opt) {
    opt = opt || {};
    opt.url = opt.url || '';
    opt.data = opt.data || null;
    opt.method = opt.method || 'GET';
    let otherParam = {};
    if (!opt.responseType) {
        opt.header = opt.header || Object.assign({}, opt.header);
        otherParam.dataType = 'json'
    } else {
        otherParam.responseType = opt.responseType;
    }

    if (!!opt.noAuth) { // 不需要授权
        opt.header.Authorization = 'Basic c2VsbGVyOnNlbGxlcg==';
    } else {
        let token = await getToken();   
        opt.header.Authorization = 'Bearer ' + token;
    }

    let userData = {}


    if (opt.data) {
        if (typeof opt.data == 'string'){ //jsonString处理
            try {
                opt.data = JSON.stringify(Object.assign({}, JSON.parse(opt.data), userData));
            } catch (e){ console.error(e) }
        } else {
            opt.data = Object.assign({}, opt.data, userData);
        }
    } else {
        opt.data = userData;
    }
    let url = `${getApp().globalData.apiUrl}${opt.serviceName ? opt.serviceName : config.SERVICE_NAME}${opt.url}`
    return new Promise((resolve, reject) => {
        uni.request({
            url: url,
            data: opt.data,
            method: opt.method,
            header: opt.header,
            ...otherParam,
            success: async res => {
                if (res.statusCode == 200){
                    if(res.data?.state == 266){
                        loginAhthOut(); //退出登录
                        removeShopStorage();
                        toLogin(); // 跳转到登录页面
                        return
                    }
                    resolve(res.data);
                } else {
                    console.log('请求出错：', res);
                    reject(res);
                }
            },
            fail: err => {
                console.log('请求出错：', err);
                reject(err);
            },
            complete: (res) => {
                
            }
        })
    })
}


