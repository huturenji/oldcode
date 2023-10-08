import request from '@/utils/request';

export default {
    // 获取验证码
    getCaptcha(params={}) {
        return request({
            url: '/v3/system/common/getCaptcha',
            method: 'GET',
            noAuth: true,
            header: { "Content-Type": "application/json" },
            data: params
        })
    },
    // 获取店铺信息
    getStoreSetting(params={}) {
        return request({
            url: '/v3/system/seller/setting/getStoreSetting',
            method: 'GET',
            noAuth: true,
            header: { "Content-Type": "application/json" },
            data: params
        })
    },
    // 登录
    login(params={}) {
        let data = {
            ...params,
            client: 'mobile'
        }
        return request({
            url: '/v3/seller/oauth/token',
            method: 'POST',
            noAuth: true,
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            data
        })
    },
    // 刷新token
    refresh(params={}) {
        let data = {
            ...params,
            grant_type: 'refresh_token',
            client: 'mobile'
        }
        return request({
            url: '/v3/seller/oauth/token',
            method: 'POST',
            noAuth: true,
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            data
        })
    }
};