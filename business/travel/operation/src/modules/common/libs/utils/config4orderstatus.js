/*
 功能：公共常量、键值对
author：songjun
date：2018年11月1日
 */

/**
 * category定义
 * -1: 已取消
 * 0: 未付款
 * 1: 已付款待出行(及出行后的状态)
 * 2: 已退款
 * ----------
 * 运营管理订单中心
 * t21：待支付
 * t22：待出行
 * t23：退款单
 * t24：已取消
 * t25：已开发票
 * 运营管理订单中心
 * ----------
 * 
 * useCase定义：
 * 0： 企业管理订单
 * 1： 我的订单
 * 2： 运营管理订单中心
 */

/** ========================================订单状态start========================================== */
//机票订单状态（非供应商状态，是商旅通平台自定义的，将供应状态简化后的状态）
export const flightOrderStatus = {
    'UNPAID': { text: '待支付', color: '#f8a339', category: '0,t21', showSubStatus: false, useCase: ['1', '2'] },
    'ALREADY_PAID': { text: '已支付', color: '#25cb67', category: '1,t22', showSubStatus: false, useCase: ['0', '1', '2'] },
    'ALREADY_CANCEL': { text: '已取消', color: '#999999', category: '-1,t24', showSubStatus: false, useCase: ['1', '2'] },
    'PARTIAL_ALREADY_REFUND': { text: '已出票', color: '#25cb67', category: '1,2,t22,t23', showSubStatus: true, useCase: ['0', '1', '2'] },//实际状态是部分退票，但展示文字是“已出票”
    'ALREADY_REFUND': { text: '已退票', color: '#f83939', category: '2,t23', showSubStatus: false, useCase: ['0', '1', '2'] },
    'ALREADY_OUT_TICKET': { text: '已出票', color: '#25cb67', category: '1,t22', showSubStatus: true, useCase: ['0', '1', '2'] },
    'FAILED_OUT_TICKET': { text: '出票失败', color: '#f83939', category: '2,t23', showSubStatus: false, useCase: ['0', '1', '2'] },
    'ALREADY_INVOICE': { text: '已开发票', color: '#25cb67', category: '1,t25', showSubStatus: false, useCase: ['0', '1', '2'] },
    'UNKNOWN': { text: '已支付', color: '#25cb67', category: '1,t22', showSubStatus: false, useCase: ['0', '1', '2'] },//支付成功了，但供应商没返回出票状态
};


/** ========================================保险订单状态start========================================== */
//保险订单状态
// ALREADY_CANCELED(1, 已取消),TO_PAY(2, 待支付),TO_BILL(3, 已支付，待出单),ALREADY_BILLED(4, 已出单，待生效),
// ORDER_FAILED(5, 下单失败),ALREADY_REFUND(6, 已退保),PARTIAL_REFUND(7, 部分退保),ALREADY_IN_FORCE(8, 已生效),
// APPLY_REFUND(9, 已申请退保),PARTIAL_BILLED(10, 部分投保),PARTIAL_IN_FORCE(11, 部分生效),PARTIAL_APPLY_REFUND(12, 部分申请退保),
// REFUND_AND_IN_FORCE(13, 部分退保部分生效),BILL_FAILED(99, 投保失败),REFUND_FAILED(100, 退保失败);
export const insuranceStatus = {
    'ALREADY_CANCELED': { text: '已取消', color: '#999999', category: '0,t51,t24', showRefundInfo: false, useCase: ['2'] },
    'TO_PAY': { text: '待支付', color: '#f8a339', category: '0,t52,t21', showRefundInfo: false, useCase: ['2'] },
    'TO_BILL': { text: '已支付，待出单', color: '#25cb67', category: '0,t53,t22', showRefundInfo: false, useCase: ['2'] },
    'ALREADY_BILLED': { text: '已出单，待生效', color: '#25cb67', category: '0,t54,t22', showRefundInfo: false, useCase: ['2'] },
    'ORDER_FAILED': { text: '下单失败', color: '#f83939', category: '0,t55,t23', showRefundInfo: true, useCase: ['2'] },
    'ALREADY_REFUND': { text: '已退保', color: '#f83939', category: '0,t56,t23', showRefundInfo: true, useCase: ['2'] },
    'PARTIAL_REFUND': { text: '部分退保', color: '#f83939', category: '0,t57,t23', showRefundInfo: true, useCase: ['2'] },
    'ALREADY_IN_FORCE': { text: '已生效', color: '#25cb67', category: '0,t58,t22', showRefundInfo: false, useCase: ['2'] },
    'APPLY_REFUND': { text: '申请退保', color: '#25cb67', category: '0,t505,t22', showRefundInfo: false, useCase: ['2'] },
    'PARTIAL_BILLED': { text: '部分投保', color: '#25cb67', category: '0,t59,t22', showRefundInfo: true, useCase: ['2'] },
    'PARTIAL_IN_FORCE': { text: '部分生效', color: '#25cb67', category: '0,t501,t22', showRefundInfo: true, useCase: ['2'] },
    'PARTIAL_APPLY_REFUND': { text: '部分申请退保', color: '#25cb67', category: '0,t505,t22', showRefundInfo: false, useCase: ['2'] },
    'REFUND_AND_IN_FORCE': { text: '部分退保、部分生效', color: '#25cb67', category: '0,t502,t22', showRefundInfo: true, useCase: ['2'] },
    'BILL_FAILED': { text: '投保失败', color: '#f83939', category: '0,t503', showRefundInfo: true, useCase: ['2'] },
    'REFUND_FAILED': { text: '退保失败', color: '#f83939', category: '0,t504', showRefundInfo: false, useCase: ['2'] }
};

//火车票订单状态（非供应商状态，是商旅通平台自定义的，将供应状态简化后的状态）
export const trainOrderStatus = {
    'UNPAID': { text: '待支付', color: '#f8a339', category: '0,t21', showSubStatus: false, useCase: ['1', '2'] },
    'ALREADY_PAID': { text: '已支付', color: '#25cb67', category: '1,t22', showSubStatus: false, useCase: ['0', '1', '2'] },
    'ALREADY_CANCEL': { text: '已取消', color: '#999999', category: '-1,t2,t24', showSubStatus: false, useCase: ['1', '2'] },
    'PARTIAL_ALREADY_REFUND': { text: '已出票', color: '#25cb67', category: '1,2,t22', showSubStatus: true, useCase: ['0', '1', '2'], showRefundTicket:true },//实际状态是部分退票，但展示文字是“已出票”
    'ALREADY_REFUND': { text: '已退票', color: '#f83939', category: '2,t23', showSubStatus: false, useCase: ['0', '1', '2'] },
    'ALREADY_OUT_TICKET': { text: '已出票', color: '#25cb67', category: '1,t22', showSubStatus: true, useCase: ['0', '1', '2'], showRefundTicket:true },
    'FAILED_OUT_TICKET': { text: '出票失败', color: '#f83939', category: '2,t23', showSubStatus: false, useCase: ['0', '1', '2'] },
    // 'ALREADY_CHANGE': {text:'已改签',color:'#25cb67',category:'1,t22', useCase:['0','1','2']},
    // 'ALREADY_INVOICE': {text:'已开发票',color:'#25cb67',category:'1,t25', showSubStatus: false, useCase:['0','1','2']},
    // 'CHANGING': {text:'改签中',color:'#25cb67',category:'1,t22', useCase:['0','1','2']},
    // 'REFUNDING': {text:'退票中',color:'#25cb67',category:'2,t22', useCase:['0','1','2']},
    'UNKNOWN': { text: '已支付', color: '#25cb67', category: '1,t22', showSubStatus: false, useCase: ['0', '1', '2'] },//支付成功了，但供应商没返回出票状态
};

//酒店订单状态（非供应商状态，是商旅通平台自定义的，将供应状态简化后的状态）
/**
 * isCancel  该状态下是否可以取消
 * payCancel 支付或者担保之后是否可以取消
 */

export const hotelOrderStatus = {
    'WAIT_FOR_CHECK_IN': { text: '已支付，待入住', color: '#25cb67', category: '1,t22', payCancel: true, useCase: ['0', '1', '2'] },
    'ALREADY_CANCEL': { text: '已取消', color: '#999999', category: '-1,t24', useCase: ['1', '2'] },
    'ALREADY_CANCEL_HAS_REFUND': { text: '已取消', color: '#999999', category: '2,t23', useCase: ['0', '1', '2'] },
    'ALREADY_FOR_CHECK_IN': { text: '已入住', color: '#25cb67', category: '1,t22', useCase: ['0', '1', '2'] },
    'WAIT_FOR_PAY': { text: '待支付', color: '#f8a339', category: '0,t21', isCancel: true, useCase: ['1', '2'] },
    'WAIT_FOR_CONFIRM': { text: '待确认', color: '#f8a339', category: '1,t22', isCancel: true, useCase: ['0', '1', '2'] },
    'ALREADY_FOR_CONFIRM': { text: '已确认，待入住', color: '#25cb67', category: '1,t22', payCancel: true, useCase: ['0', '1', '2'] },
    'ALREADY_PAY_WAIT_CONFIRM': { text: '已支付，待确认', color: '#25cb67', category: '1,t21', payCancel: true, useCase: ['0', '1', '2'] },
    'HOTEL_REJECT_ORDER': { text: '客房不足，已取消', color: '#f83939', category: '-1,t24', useCase: ['0', '1', '2'] },
    'WAIT_FOR_VERIFY_CHECK_IN': { text: '待核实入住', color: '#25cb67', category: '1,t22', useCase: ['0', '1', '2'] },
    'NOT_FOR_CHECK_IN': { text: '未入住', color: '#f83939', category: '1,t22', useCase: ['0', '1', '2'] },
    'ALREADY_LEAVE': { text: '已离店', color: '#25cb67', category: '1,t22', useCase: ['0', '1', '2'] },
    'ALREADY_INVOICE': { text: '已开发票', color: '#25cb67', category: '1,t25', useCase: ['0', '1', '2'] },
    'UNKNOWN': { text: '已支付', color: '#25cb67', category: '1,t22', useCase: ['0', '1', '2'] },//支付成功了，但供应商没返回出票状态
};

export function getExpressOrderStatus(status) {
    return "已支付"
}

export function getFlightOrderStatus(status) {
    if (!status) {
        return '';
    }
    let obj = flightOrderStatus[status];
    return obj ? obj.text : '';
}
export function getInsuranceOrderStatus(status) {
    if (!status) {
        return '';
    }
    let obj = insuranceStatus[status];
    return obj ? obj.text : '';
}

export function getTrainOrderStatus(status) {
    if (!status) {
        return '';
    }
    let obj = trainOrderStatus[status];
    return obj ? obj.text : '';
}

export function getHotelOrderStatus(status) {
    if (!status) {
        return '';
    }
    let obj = hotelOrderStatus[status];
    return obj ? obj.text : '';
}

export function getFlightOrderStatusColor(status) {
    if (!status) {
        return '';
    }
    let obj = flightOrderStatus[status];
    return obj ? obj.color : '';
}
export function getInsuranceOrderStatusColor(status) {
    if (!status) {
        return '';
    }
    let obj = insuranceStatus[status];
    return obj ? obj.color : '';
}

export function getTrainOrderStatusColor(status) {
    if (!status) {
        return '';
    }
    let obj = trainOrderStatus[status];
    return obj ? obj.color : '';
}
//订单状态是否显示退款按钮
export function getRefundTicketTrainStatus(status) {
    if (!status) {
        return '';
    }
    let obj = trainOrderStatus[status];
    return obj ? obj.showRefundTicket : '';
    // return true
}

export function getHotelOrderStatusColor(status) {
    if (!status) {
        return '';
    }
    let obj = hotelOrderStatus[status];
    return obj ? obj.color : '';
}

/**
 * 当前订单状态是否是有票的状态
 */
export function showTrainSubStatus(statu) {
    let statuEnum = trainOrderStatus[statu];
    return !!(statuEnum || {}).showSubStatus;
};

/**
 * 当前订单状态是否是有票的状态
 */
export function showFlightSubStatus(statu) {
    let statuEnum = flightOrderStatus[statu];
    return !!(statuEnum || {}).showSubStatus;
};

/**
 * 
 * @param {*} category 
 * @param {*} useCase 使用场景
 * @param {*} exclude 需要排除的状态
 */
export function getStatusByCategory(category, useCase, exclude = []) {
    let result = [];
    const orderStatusStack = [flightOrderStatus, trainOrderStatus, hotelOrderStatus, insuranceStatus];
    orderStatusStack.forEach((statusObj) => {
        for (let key in statusObj) {
            let obj = statusObj[key];
            if (obj && obj.category && obj.category.split(',').contains(category)) {
                //如果传了使用场景，则需要判断场景
                if (typeof useCase == 'undefined'
                    || useCase == null
                    || (!!obj.useCase && obj.useCase.contains(useCase))) {
                    !exclude.contains(key) && result.push(key);
                }
            }
        }
    })
    return result
}

/**
 * 企业订单管理不使用的订单状态
 */
export function excludeInCompanyOrder() {
    return ['FAILED_OUT_TICKET', 'WAIT_FOR_CONFIRM', 'ALREADY_FOR_CONFIRM', 'WAIT_FOR_VERIFY_CHECK_IN'];
}

/**
 * 获取退改标签 机票的 售后状态
 */
export function getFlightPartStatus(orderItem) {
    //订单的退改状态
    let result;
    //兼容处理，优先使用postSaleStatus
    if (!!orderItem.postSaleStatus) {
        result = postSaleStatus[orderItem.postSaleStatus]
        return !!result ? "(" + result + ")" : "";
    }
    if (orderItem.hasChangeOrder) {
        result = "有改签"
    }
    if (orderItem.hasRefundOrder) {
        if (!!result) {
            result = "有退改"
        } else {
            result = "有退票"
        }
    }
    return !!result ? "(" + result + ")" : "";
}
/**
 * 售后状态，适用于 机票、火车票，未来可能酒店、保险
 * postSaleStatus	string
售后状态：REFUNDING-退票中，CHANGING改签中，CHANGING_AND_REFUNDING-退改中，
HAS_REFUND-有退票，HAS_CHANGE-有改签，HAS_CHANGE_AND_REFUND-有退改，NONE-无退改
 */
const postSaleStatus = {
    REFUNDING: "退票中",
    CHANGING: "改签中",
    CHANGING_AND_REFUNDING: "退改中",
    HAS_REFUND: "有退票",
    HAS_CHANGE: "有改签",
    HAS_CHANGE_AND_REFUND: "有退改",
    // NONE: "无退改", UE不然显示
}
//对应的ChangeAndRefundStatus字段的状态，不再使用IsHasGai和IsHasRefundOrder、IsHasTui
export const trainTuiGaiStatus = {
    "NONE": "无退改签",
    "HAS_CHANGE": "有改签",
    "CHANGING": "改签中",
    "HAS_REFUND": "有退票",
    "REFUNDING": "退票中",
    "CHANGING_AND_REFUNDING": "退改中",
    "HAS_CHANGE_AND_REFUND": "有退改",
}
/**
*获取火车票的退改状态
*/
export function getTrainPsgStatusUIName(orderItem) {
    var result = ""
    //兼容处理，优先使用postSaleStatus
    if (!!orderItem.postSaleStatus) {
        result = postSaleStatus[orderItem.postSaleStatus]
        return !!result ? "(" + result + ")" : "";
    }
    if (orderItem.changeAndRefundStatus == "NONE") {
        result = ""
    } else {
        result = trainTuiGaiStatus[orderItem.changeAndRefundStatus]
    }
    return !!result ? "(" + result + ")" : "";
}
/** ========================================订单状态end========================================== */
