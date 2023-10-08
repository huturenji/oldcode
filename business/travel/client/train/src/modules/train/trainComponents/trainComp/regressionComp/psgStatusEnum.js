export const trainPsgStatusEmum = {
    // 当前退票状态 REFUND_FAILED=退票失败 REFUND_SUCCESS=退票成功 REFUNDING=正在退票
    //当前改签状态 CHANGE_CANCELLED=改签已取消 CHANGE_FAILED=改签失败 CHANGE_SUCCESS=改签成功 CHANGING=正在改签
    
    'CHANGING': {
        name: ['正在办理改签'],
        color: '',
        // state: StateStyle.INPROCESS,
        failedreason:'',
        type: 0,
        imgurl:require("assets/img/trainList/radio_nor.png")
    },
    'CHANGE_SUCCESS': {
        name: ['改签成功'],
        color: '',
        // state: StateStyle.SUCCESS,
        failedreason:'',
        type: 0,
        imgurl:require("assets/img/trainList/radio_sel2.png")
    },
    'CHANGE_FAILED': {
        name: ['改签失败'],
        color: 'red',
        // state: StateStyle.FAILED,
        failedreason:"因铁路系统繁忙，改签失败，如有需要可重新提交",
        type: 0,
        imgurl:require("assets/img/trainList/warn_lose.png")
    },
    'SEAT_TAKEN_FAILED': {
        name: ['改签失败'],
        color: 'red',
        // state: StateStyle.FAILED,
        failedreason:"改签车次余票不足，占座失败，请选择其他车次重试",
        type: 0,
        imgurl:require("assets/img/trainList/warn_lose.png")
    },
    'CHANGE_CANCELLED': {
        name: ['取消改签'],
        color: 'red',
        // state: StateStyle.CANCEL,
        failedreason:'您已取消改签申请，如有需要可重新提交',
        type: 0,
        imgurl:require("assets/img/trainList/warn_lose.png")
    },
    'REFUNDING': {
        name: ['正在办理退票'],
        color: '',
        // state: StateStyle.INPROCESS,
        failedreason:'',
        type: 0,
        imgurl:require("assets/img/trainList/radio_nor.png")
    },
    'REFUND_SUCCESS': {
        name: ['退票成功'],
        color: '',
        // state: StateStyle.INPROCESS,
        failedreason:'',
        type: 0,
        imgurl:require("assets/img/trainList/radio_sel2.png")
    },
    'REFUND_FAILED': {
        name: ['退票失败'],
        color: 'red',
        // state: StateStyle.FAILED,
        failedreason:"因铁路系统繁忙，请持购票有效证件到火车站办理",
        type: 0,
        imgurl:require("assets/img/trainList/warn_lose.png")
    },

    // 订单取消类型 用户取消=USER_CANCEL PAY_FAIL_CANCEL=支付失败取消 PAY_TIME_EXPIRED_CANCEL=订单支付超时取消
    
    'USER_CANCEL': {
        failedreason:'您已取消改签申请，如有需要可重新提交',
    },    
    'PAY_FAIL_CANCEL': {
        failedreason:'很抱歉您支付失败，改签申请已取消，如有需要可重新提交',
    },    
    'PAY_TIME_EXPIRED_CANCEL': {
        failedreason:'您超时未确认改签',
    },
}