/*
 * @Descripttion: your project
 * @Author: mawenshu
 * @Date: 2023-05-22 10:08:04
 */
import request from '@/utils/request';

// 退款详情
export function getGiftRefundDetail(params = {}) {
    return request({
        url: '/v3/business/front/orderInfo/featherOrderRefundDetail',
        data: params
    })

}
/*
 * 获取收到礼物的商品列表
 * data：请求参数
 */
export function getGiftList(data){
    return request({
        method: 'GET',
        url: '/v3/business/front/orderInfo/featherOrderList',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data
    })
}

//获取礼物详情
export function getGiftDetail(data){
    return request({
        method: 'GET',
        url: '/v3/business/front/orderInfo/featherDetail',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data
    })
}

//提交礼物
export function submitGift(data){
    return request({
        method: 'POST',
        url: '/v3/business/front/orderOperate/submit',
        data
    })
}

// 物流信息
export function getLogistics(params) {
    return request({
        url: '/v3/business/front/logistics/order/getTrace',
        method: 'GET',
        header: { "Content-Type": "application/json" },
        data: params
    })
}

//校验地址
export function addressFlag(data){
    return request({
        method: 'POST',
        url: '/v3/member/front/memberAddress/addressCheck',
        data
    })
}

//添加地址
export function addAddress(param){
    return request({
        url: '/v3/member/front/memberAddress/add',
        data: param,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'POST'
    })
}

/**
     * 领取页面收下礼物
     * @param {*} param 
    */
 export function  receiveGiftNew(param){
    return request({
        url: '/v3/business/front/orderOperate/receiveFeather',
        method: 'POST',
        header:{"Content-Type": "application/json"},
        data: param
    })
}
