import request from '@/utils/request';


/**
 * 获取鹅毛情售后列表接口
 * @param {*} param 
*/
export function getAfsList(param){
    return request({
        url: '/v3/postsale/front/after/sale/list/v1',
        data: param,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
    })
}

// 可售后性列表
export function afsCheck(param){
    return request({
        url: '/v3/postsale/front/after/sale/apply/afsServiceCheck',
        data: param
    })
}

export function selectAfsService(param){
    return request({
        url: '/v3/postsale/front/after/sale/apply/applyInfo',
        data: param
    })
}

export function getOrderProductDetail(param){
    return request({
        url: '/v3/postsale/front/after/sale/apply/getOrderProductDetail',
        data: param
    })
}

export function countReturnMoney(param){
    return request({
        url: '/v3/postsale/front/after/sale/apply/countReturnMoney',
        data: param
    })
}
//获取订单退款原因列表
export function refundReasonList(param){
    return request({
        url: '/v3/system/front/reason/list',
        data: param
    })
}

export function getReturnMoney(param){
    return request({
        url: '/v3/postsale/front/after/sale/apply/getReturnMoney',
        data: param
    })
}
export function submit(param){
    return request({
        url: '/v3/postsale/front/after/sale/apply/submit',
        method: 'POST',
        data: param,
        header:{"Content-Type": "application/json"},
    })
}
// 获取返回方式
export function afsServiceReverseExpress(param){
    return request({
        url: '/v3/postsale/front/after/sale/apply/afsServiceReverseExpress',
        method: 'GET',
        data: param,
    })
}
//换货详情
export function replacementDetail(param){
    return request({
        url: '/v1/front/member/afterSale/replacementDetail',
        method: 'GET',
        data: param,
    })
}
//仅退款、退货退款
export function detail(param){
    return request({
        url: '/v3/postsale/front/after/sale/detail',
        method: 'GET',
        data: param,
    })
}
// 用户确认
export function confirm(param){
    return request({
        url: '/v3/postsale/front/after/sale/apply/confirm',
        method: 'POST',
        data: param,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
    })
}
// 用户取消
export function cancel(param){
    return request({
        url: '/v3/postsale/front/after/sale/apply/cancel',
        method: 'POST',
        data: param,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
    })
}


export function deliverGoods(param){
    return request({
        url: '/v3/postsale/front/after/sale/deliverGoods',
        method: 'POST',
        data: param,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
    })
}


// 訂單取消的原因
export function cancelReason(param){
    return request({
        url: '/v3/system/front/reason/list',
        method: 'GET',
        data: param,
        header:{"Content-Type": "application/json"},
    })
}
// //获取物流公司数据信息
export function expressList(param){
    return request({
        url: '/v3/system/front/express/list',
        method: 'GET',
        data: param,
        header:{"Content-Type": "application/json"},
    })
}






