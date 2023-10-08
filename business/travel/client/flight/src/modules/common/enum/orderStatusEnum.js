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
    'UNPAID': {text:'待支付',color:'#f8a339',category:'0,t21', showSubStatus: false, useCase:['1','2']},
    'ALREADY_PAID': {text:'已支付',color:'#25cb67',category:'1,t22', showSubStatus: false, useCase:['0','1','2']},
    'ALREADY_CANCEL': {text:'已取消',color:'#999999',category:'-1,t24', showSubStatus: false, useCase:['1','2']},
    'PARTIAL_ALREADY_REFUND': {text:'已出票',color:'#25cb67',category:'1,2,t22,t23', showSubStatus: true, useCase:['0','1','2']},//实际状态是部分退票，但展示文字是“已出票”
    'ALREADY_REFUND': {text:'已退票',color:'#f83939',category:'2,t23', showSubStatus: false, useCase:['0','1','2']},
    'ALREADY_OUT_TICKET': {text:'已出票',color:'#25cb67',category:'1,t22', showSubStatus: true, useCase:['0','1','2']},
    'FAILED_OUT_TICKET': {text:'出票失败',color:'#f83939',category:'2,t23', showSubStatus: false, useCase:['0','1','2']},
    'ALREADY_INVOICE': {text:'已开发票',color:'#25cb67',category:'1,t25', showSubStatus: false, useCase:['0','1','2']},
    'UNKNOWN': {text:'已支付',color:'#25cb67',category:'1,t22', showSubStatus: false, useCase:['0','1','2']}//支付成功了，但供应商没返回出票状态
};


/** ========================================保险订单状态start========================================== */
//保险订单状态
//text 保险订单状态
//color 保险订单状态文字颜色
//showRefundInfo 是否展示退款提示信息
//endorseAbnormal 机票改签时保险异常信息是否展示
//canCancel 保险是否是生效状态（是否可退保）
//infoCardShowTips 机票订单详情页面人员信息界面是否展示保险退改提示信息
//gaiTips 机票订单详情页面人员信息界面改签保险提示信息
//tuiTips 机票订单详情页面人员信息界面退票保险提示信息
export const insuranceStatus = {
    'ALREADY_CANCELED': {text:'已取消',color:'#999999',showRefundInfo: false,endorseAbnormal:false,canCancel:false,infoCardShowTips:false,gaiTips:'',tuiTips:''},
    'TO_PAY': {text:'待支付',color:'#f8a339',showRefundInfo: false,endorseAbnormal:false,canCancel:false,infoCardShowTips:false,gaiTips:'',tuiTips:''},
    'TO_BILL': {text:'已支付，待出单',color:'#25cb67',showRefundInfo: false,endorseAbnormal:true,canCancel:false,infoCardShowTips:false,gaiTips:'',tuiTips:''},
    'ALREADY_BILLED': {text:'已出单，待生效',color:'#25cb67', showRefundInfo: false,endorseAbnormal:false,canCancel:true,infoCardShowTips:true,gaiTips:'改签单保险未退保，请联系客服',tuiTips:'退票单保险未退保，请联系客服'},
    'ORDER_FAILED': {text:'下单失败',color:'#f83939', showRefundInfo: true,endorseAbnormal:false,canCancel:false,infoCardShowTips:false,gaiTips:'',tuiTips:''},
    'ALREADY_REFUND': {text:'已退保',color:'#f83939', showRefundInfo: true,endorseAbnormal:false,canCancel:false,infoCardShowTips:false,gaiTips:'',tuiTips:''},
    'ALREADY_IN_FORCE': {text:'已生效',color:'#25cb67', showRefundInfo: false,endorseAbnormal:false,canCancel:true,infoCardShowTips:true,gaiTips:'改签单保险未退保，请联系客服',tuiTips:'退票单保险未退保，请联系客服'},
    'APPLY_REFUND': {text:'已申请退保',color:'#f83939', showRefundInfo: true,endorseAbnormal:false,canCancel:false,infoCardShowTips:true,gaiTips:'已申请退保',tuiTips:'已申请退保'},
    'BILL_FAILED': {text:'投保失败',color:'#f83939', showRefundInfo: true,endorseAbnormal:false,canCancel:false,infoCardShowTips:false,gaiTips:'',tuiTips:''},
    'REFUND_FAILED': {text:'退保失败',color:'#f83939', showRefundInfo: false,endorseAbnormal:false,canCancel:false,infoCardShowTips:true,gaiTips:'改签单保险退保失败，请联系客服',tuiTips:'退票单保险退保失败，请联系客服'}
};

//火车票订单状态（非供应商状态，是商旅通平台自定义的，将供应状态简化后的状态）
export const trainOrderStatus = {
    'UNPAID': {text:'待支付',color:'#f8a339',category:'0,t21', showSubStatus: false, useCase:['1','2']},
    'ALREADY_PAID': {text:'已支付',color:'#25cb67',category:'1,t22', showSubStatus: false, useCase:['0','1','2']},
    'ALREADY_CANCEL': {text:'已取消',color:'#999999',category:'-1,t2,t24', showSubStatus: false, useCase:['1','2']},
    'PARTIAL_ALREADY_REFUND': {text:'已出票',color:'#25cb67',category:'1,2,t22', showSubStatus: true, useCase:['0','1','2']},//实际状态是部分退票，但展示文字是“已出票”
    'ALREADY_REFUND': {text:'已退票',color:'#f83939',category:'2,t23', showSubStatus: false, useCase:['0','1','2']},
    'ALREADY_OUT_TICKET': {text:'已出票',color:'#25cb67',category:'1,t22', showSubStatus: true, useCase:['0','1','2']},
    'FAILED_OUT_TICKET': {text:'出票失败',color:'#f83939',category:'2,t23', showSubStatus: false, useCase:['0','1','2']},
    // 'ALREADY_CHANGE': {text:'已改签',color:'#25cb67',category:'1,t22', useCase:['0','1','2']},
    'ALREADY_INVOICE': {text:'已开发票',color:'#25cb67',category:'1,t25', showSubStatus: false, useCase:['0','1','2']},
    'CHANGING': {text:'改签中',color:'#25cb67',category:'1,t22', useCase:['0','1','2']},
    'REFUNDING': {text:'退票中',color:'#25cb67',category:'2,t22', useCase:['0','1','2']},
    'UNKNOWN': {text:'已支付',color:'#25cb67',category:'1,t22', showSubStatus: false, useCase:['0','1','2']}//支付成功了，但供应商没返回出票状态
};

//酒店订单状态（非供应商状态，是商旅通平台自定义的，将供应状态简化后的状态）
/**
 * isCancel  该状态下是否可以取消
 * payCancel 支付或者担保之后是否可以取消
 */

export const hotelOrderStatus = {
    'WAIT_FOR_CHECK_IN': {text:'已支付，待入住',color:'#25cb67',category:'1,t22',payCancel:true, useCase:['0','1','2']},
    'ALREADY_CANCEL': {text:'已取消',color:'#999999',category:'-1,t24', useCase:['1','2']},
    'ALREADY_CANCEL_HAS_REFUND': {text:'已取消',color:'#999999',category:'2,t23', useCase:['0','1','2']},
    'ALREADY_FOR_CHECK_IN': {text:'已入住',color:'#25cb67',category:'1,t22', useCase:['0','1','2']},
    'WAIT_FOR_PAY': {text:'待支付',color:'#f8a339',category:'0,t21',isCancel:true, useCase:['1','2']},
    'WAIT_FOR_CONFIRM': {text:'待确认',color:'#f8a339',category:'1,t22',isCancel:true, useCase:['0','1','2']},
    'ALREADY_FOR_CONFIRM': {text:'已确认，待入住',color:'#25cb67',category:'1,t22',payCancel:true, useCase:['0','1','2']},
    'ALREADY_PAY_WAIT_CONFIRM': {text:'已支付，待确认',color:'#25cb67',category:'1,t21',payCancel:true, useCase:['0','1','2']},
    'HOTEL_REJECT_ORDER': {text:'客房不足，已取消',color:'#f83939',category:'-1,t24', useCase:['0','1','2']},
    'WAIT_FOR_VERIFY_CHECK_IN':{text:'待核实入住',color:'#25cb67',category:'1,t22', useCase:['0','1','2']},
    'NOT_FOR_CHECK_IN':{text:'未入住',color:'#f83939',category:'1,t22', useCase:['0','1','2']},
    'ALREADY_LEAVE': {text:'已离店',color:'#25cb67',category:'1,t22', useCase:['0','1','2']},
    'ALREADY_INVOICE': {text:'已开发票',color:'#25cb67',category:'1,t25', useCase:['0','1','2']},
    'UNKNOWN': {text:'已支付',color:'#25cb67',category:'1,t22', useCase:['0','1','2']}//支付成功了，但供应商没返回出票状态
};

export function getFlightOrderStatus(status){
    if (!status) {
        return '';
    }
    let obj = flightOrderStatus[status];
    return obj ? obj.text : '';
}

export function getTrainOrderStatus(status){
    if (!status) {
        return '';
    }
    let obj = trainOrderStatus[status];
    return obj ? obj.text : '';
}

export function getHotelOrderStatus(status){
    if (!status) {
        return '';
    }
    let obj = hotelOrderStatus[status];
    return obj ? obj.text : '';
}

export function getFlightOrderStatusColor(status){
    if (!status) {
        return '';
    }
    let obj = flightOrderStatus[status];
    return obj ? obj.color : '';
}

export function getTrainOrderStatusColor(status){
    if (!status) {
        return '';
    }
    let obj = trainOrderStatus[status];
    return obj ? obj.color : '';
}

export function getHotelOrderStatusColor(status){
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
}

/**
 * 当前订单状态是否是有票的状态
 */
export function showFlightSubStatus(statu) {
    let statuEnum = flightOrderStatus[statu];
    return !!(statuEnum || {}).showSubStatus;
}

/**
 * 
 * @param {*} category 
 * @param {*} useCase 使用场景
 * @param {*} exclude 需要排除的状态
 */
export function getStatusByCategory(category, useCase, exclude=[]) {
    let result = [];
    const orderStatusStack = [flightOrderStatus, trainOrderStatus, hotelOrderStatus];
    orderStatusStack.forEach((statusObj) => {
        for (let key in statusObj){
            let obj = statusObj[key];
            if (obj && obj.category && obj.category.split(',').contains(category)){
                //如果传了使用场景，则需要判断场景
                if (typeof useCase == 'undefined' 
                || useCase==null 
                || (!!obj.useCase && obj.useCase.contains(useCase))){
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
export function excludeInCompanyOrder(){
    return ['FAILED_OUT_TICKET','WAIT_FOR_CONFIRM','ALREADY_FOR_CONFIRM','WAIT_FOR_VERIFY_CHECK_IN'];
}
/** ========================================订单状态end========================================== */
