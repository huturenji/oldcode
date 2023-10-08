import request from '@/utils/request';

export default {
    // 获取门店下历史核销记录
    getCheckListByShop(params={}) {
        return request({
            url: '/v3/conscoupon/seller/consumeCoupon/storeCouponHistoryList',
            method: 'GET',
            header: { "Content-Type": "application/json" },
            data: params
        })
    },
    
    // 核销券码
    checkCash(params={}) {
        return request({
            url: '/v3/conscoupon/seller/consumeCoupon/audit',
            method: 'GET',
            header: { "Content-Type": "application/json" },
            data: params
        })
    },
    
    // 获取门店核销优惠券详情
    getCashDetail(params={}) {
        return request({
            url: '/v3/conscoupon/seller/consumeCoupon/getCouponDetail',
            method: 'GET',
            header: { "Content-Type": "application/json" },
            data: params
        })
    },

    // 获取全部门店下列表
    getShopList(params={}) {
        return request({
            url: '/v3/seller/seller/offlineShop/page',
            method: 'GET',
            header: { "Content-Type": "application/json" },
            data: params
        })
    },
    // 更新备注
    updateRemarks(params={}) {
        return request({
            url: '/v3/conscoupon/seller/consumeCoupon/updateRemarks',
            method: 'POST',
            header: { "Content-Type": "application/json" },
            data: params
        })
    }
};