import request from '@/utils/request';

export default {
    /**
     * 获取礼物详情 param = {}
     * @param {*} param 
    */
    getGiftDetail(params) {
        return request({
            url: 'v3/business/front/orderInfo/featherDetail',
            method: 'GET',
            data: params
        })
    },
    // 物流信息
    getLogistics(params) {
        return request({
            url: 'v3/business/front/logistics/order/getTrace',
            method: 'GET',
            header: { "Content-Type": "application/json" },
            data: params
        })
    },

    // 退款详情
    getGiftRefundDetail(params = {}) {
        return request({
            url: 'v3/business/front/orderInfo/featherOrderRefundDetail',
            data: params
        })

    },
    /**
     * 获取鹅毛情列表接口
     * @param {*} param 
    */
    getGiftList(param){
        return request({
            url: 'v3/business/front/orderInfo/featherOrderList',
            data: param
        })

    },
    /**
     * 获取鹅毛情售后列表接口
     * @param {*} param 
    */
    afsList(param){
        return request({
            url: 'v3/postsale/front/after/sale/list/v1',
            data: param
        })

    },
    /**
     * 领取页面收下礼物
     * @param {*} param 
    */
    receiveGift(param){
        return request({
            url: 'v3/business/front/orderOperate/receiveFeather',
            method: 'POST',
            header:{"Content-Type": "application/json"},
            data: param
        })
    }
};