/*
 功能：公共常量、键值对
author：songjun
date：2018年11月1日
 */

export const StateStyle = {
    SUCCESS: "success",
    INPROCESS: "inProcess",
    FAILED: "failed",
    NORMAL: "normal",
    CANCEL: "cancel"
}

/** ========================================乘机人状态Start========================================== */
/**
 * 乘机人Status的枚举。（对应飞机票票Passengers里面的Status字段）
 * 每个状态有对应的文字描述和颜色，文字描述和颜色可以不唯一，因此用Array装填。可使用下标来选择需要返回的文字或颜色
 * 【注意】：原则上，name和color数组中，每增加一个场景（即一组值），所有状态下的数组都要加一个值。因为数组的每个下标都对应同一个场景。
 *  本对象是可以根据需求和场景进行扩展的，具体扩展方式是在状态对象中增加新的属性
 *
 *  场景0（对应数组下标0）：正常航班
 *  场景1（对应数组下标1）：改签航班
 *  场景2（对应数组下标2）：退改签乘机人列表
 */
const COLOR = {
    SUCCESS: '#23CDA7',
    FAILED: '#ff4e3a',
    PROCESSING: '#F49939',
    CANCEL: '#999',
}
export const flightPsgStatusEmum = {
    0: {
        name: [],
        color: [],
        state: StateStyle.NORMAL,
    },
    1: {
        name: ['退票中', '退票中', '退票中'],
        color: [COLOR.PROCESSING, COLOR.PROCESSING, COLOR.PROCESSING, COLOR.PROCESSING],
        state: StateStyle.INPROCESS,
        type: 0,//0表示退票，1表示改签
    },
    2: {
        name: ['退票失败', '退票失败', null],
        color: [COLOR.FAILED, COLOR.FAILED, COLOR.FAILED],
        state: StateStyle.FAILED,
        type: 0,
    },
    3: {
        name: ['退票中', '退票中', '退票中'],
        color: [COLOR.PROCESSING, COLOR.PROCESSING, COLOR.PROCESSING],
        state: StateStyle.INPROCESS,
        type: 0,
    },
    4: {//只要供应商给到我们已退票的信息，我们就像用户展示“退票成功”的状态
        name: ['退票成功', '退票成功', '已退票'],
        color: [COLOR.SUCCESS, COLOR.SUCCESS, COLOR.SUCCESS],
        state: StateStyle.SUCCESS,
        type: 0,
        hasPriceDetail: false,//是否返回了退票金额明细
    },
    5: {
        name: ['退票成功', '退票成功', '已退票'],
        color: [COLOR.SUCCESS, COLOR.SUCCESS, COLOR.SUCCESS],
        state: StateStyle.SUCCESS,
        type: 0,
        hasPriceDetail: true,//是否返回了退票金额明细
    },
    6: {
        name: ['退票成功', '退票成功', '已退票'],
        color: [COLOR.PROCESSING, COLOR.PROCESSING, COLOR.PROCESSING],
        state: StateStyle.SUCCESS,
        type: 0,
        hasPriceDetail: true,//是否返回了退票金额明细
    },
    11: {
        name: ['改签中', null, '改签中'],
        color: [COLOR.PROCESSING, COLOR.PROCESSING, COLOR.PROCESSING],
        state: StateStyle.INPROCESS,
        type: 1,
    },
    12: {
        name: ['改签中', null, '改签中'],
        color: [COLOR.PROCESSING, COLOR.PROCESSING, COLOR.PROCESSING],
        state: StateStyle.INPROCESS,
        type: 1,
    },
    13: {
        name: ['改签中', null, '改签中'],
        color: [COLOR.PROCESSING, COLOR.PROCESSING, COLOR.PROCESSING],
        state: StateStyle.INPROCESS,
        ticketStatus: 'ALREADY_PAID',//改签票特有的状态，用于标识这个改签票的出票状态
        type: 1,
    },
    14: {
        name: ['改签中', null, '改签中'],
        color: [COLOR.PROCESSING, COLOR.PROCESSING, COLOR.PROCESSING],
        state: StateStyle.INPROCESS,
        type: 1,
    },
    15: {
        name: ['改签失败', null, null],
        color: [COLOR.FAILED, COLOR.FAILED, COLOR.FAILED],
        state: StateStyle.FAILED,
        type: 1,
    },
    16: {
        name: ['已改签', '改签成功', '已改签'],
        color: [COLOR.SUCCESS, COLOR.SUCCESS, COLOR.SUCCESS],
        state: StateStyle.SUCCESS,
        type: 1,
    },
    17: {
        name: ['取消改签'],
        color: [COLOR.FAILED],
        state: StateStyle.CANCEL,
        reason: 'activeCancel',
        type: 1,
    },
    18: {
        name: [],
        color: [],
        state: StateStyle.CANCEL,
        type: 1,
    },
    100: {
        name: ['改签失败', null, null],
        color: [COLOR.FAILED, COLOR.FAILED, COLOR.FAILED],
        state: StateStyle.FAILED,
        reason: 'timeout',
        type: 1,
    },
    101: {//出票超时
        name: ['未知出票结果', null, null],
        color: [COLOR.FAILED, COLOR.FAILED, COLOR.FAILED],
        state: StateStyle.UNKNOW,
        reason: 'unknow',
        type: 1,
    }
}

/**
 *  改签单状态与乘机人状态Status的对应关系
 */
export const gaiOrderStatuConvert = {
    1: 11,//申请改签
    2: 14,//处理中
    3: 15,//不能改签
    4: 16,//改签完成
    5: 12,//改签需补款
    6: 13,//改签已补款
    7: 16,//改签退款中
    8: 16,//改签已退款
    9: 17//改签已撤销
}

/**
 *  退单状态与乘机人状态Status的对应关系
 */
export const tuiOrderStatuConvert = {
    1: 1,//申请退票
    2: 3,//处理中
    3: 2,//不能退票
    4: 4,//等待退款
    5: 6,//退款中
    6: 5,//已退票退款
    7: 18,//退票已撤销
}

/**
 * 机票：根据乘机人状态码返回状态对象
 * 注意：只返回退改签的状态
 * @param status 乘机人的状态码
 * @returns {string} 状态对象
 */
export function getFlightPsgStatusObj(status) {
    try {
        return flightPsgStatusEmum[status];
    } catch (e) {
        return {};
    }
};

/**
 * 机票：根据乘机人状态码返回状态中文名。可以根据index来选择返回的文字
 * 注意：只返回退改签的状态
 * @param status 乘机人的状态码
 * @param index 乘机人状态名称的下标
 * @returns {string} 状态名字
 */
export function getFlightPsgStatusName(status, index) {
    try {
        if (index == null || index == undefined) {
            index = 0;
        }
        let name = getFlightPsgStatusObj(status).name;
        index = name.length >= index ? index : 0;//如果index越界，则默认取第一个
        return name[index];
    } catch (e) {
        return "";
    }
}

/**
 * 机票：根据乘机人状态码返回状态显示颜色。可以根据index来选择返回的颜色
 * 注意：只返回退改签的状态颜色
 * @param status 乘机人的状态码
 * @param index 乘机人状态名称的下标
 * @returns {string} 状态颜色
 */
export function getFlightPsgStatusColor(status, index) {
    try {
        if (index == null || index == undefined) {
            index = 0;
        }
        let color = getFlightPsgStatusObj(status).color;
        index = color.length >= index ? index : 0;//如果index越界，则默认取第一个
        return color[index] || '#333';//默认颜色是#333
    } catch (e) {
        return "";
    }
}

/** ========================================乘机人状态End========================================== */
