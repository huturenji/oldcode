
/**
 * 功能：订单中票的状态维护和管理。
 * author：liguanqun
 * date：2021年04月1日
 * 
 * 按照业务逻辑，订单(order)、票(ticket)、客户(passenger)是3个独立对象。
 * 订单和票是组合关系，一个订单里面有多个票，比如 车票、机票、房票等。
 * 票和客户是组合关系，一个票对应有多个客户。比如，车票、机票是一对一，房票是一对多。
 *  
 * 客户没有状态，客户的信息是只读的，不会随着业务本身变化；
 * 票有票的状态，票的状态每个业务不同，我们经常将票的状态跟客户的状态混为一谈。
 * 为了处理批量票的场景，目前的对象是 一个车次对应多个乘客，车次包含的是所有的票公共的东西，
 * 而车票的一些个性化的数据都挂载到了乘客身上，主要是座位等信息。等于是票的数据被分成了2部分，一部分公共的叫做车次，另一部分
 * 与乘客混在一起。
 * 订单有订单的状态，订单的状态跟票的状态有关系，在我们的模型里，就是跟客户的状态有关系。
 * 
 * 我们这个文件维护票的状态，包括 车票、机票、房票等。
 * 
 */

const COLOR = {
    SUCCESS: '#25cb67',
    FAILED: '#F83939',
    PROCESSING: '#f8a339',
    CANCEL: '#999',
}
//给页面显示状态常量,这里包含了 车票的退票、改签 全流程。原单的车票的支付、出票等 使用的是订单的orderStatus
export const StateEnum = {
    NORMAL: "normal",
    CANCEL: "cancel",
    //车票的状态，未知状态和已取票
    UNKNOW: 'unknow',
    PICKED: 'picked',
    //改签的显示状态
    CHANGE_PROCESSING: "CHANGE_PROCESSING1",
    CHANGE_OK: "CHANGE_OK1",
    CHANGE_FAIL: "CHANGE_FAIL1",
    //退票的显示状态
    REFUND_PROCESSING: "REFUND_PROCESSING1",
    REFUND_OK: "REFUND_OK1",
    REFUND_FAIL: "REFUND_FAIL1",
}
/** ========================================火车票业务的车票状态Start========================================== */

/**
 * key 是车票的状态码：无论是数字还是字符串，也可以是历史的都可以，应该包含票的全量生命周期，这里包含了 车票的退票、改签 全流程。
 * 原单的车票的支付、出票等 使用的是订单的orderStatus
 * value  是车票状态对应的业务，比如 名字name，显示颜色color，是否显示退票canRefund，是否显示改签canChange等
 */
export const trainTicketStatusEnum = {
    0: {
        name: [],
        color: [],
        bisState: StateEnum.NORMAL,
    },
    1: {
        name: ['退票中'],
        color: [COLOR.PROCESSING],
        bisState: StateEnum.REFUND_PROCESSING,
    },
    2: {
        name: ['退票中'],
        color: [COLOR.PROCESSING],
        bisState: StateEnum.REFUND_PROCESSING,
    },
    3: {
        name: ['退票成功'],
        color: [COLOR.SUCCESS],
        bisState: StateEnum.REFUND_OK,

    },
    4: {
        name: ['退票失败'],
        color: [COLOR.FAILED],
        bisState: StateEnum.REFUND_FAIL,

    },
    5: {
        name: [],
        color: [COLOR.CANCEL],
        bisState: StateEnum.CANCEL,

    },
    6: {
        name: ['退票成功'],
        color: [COLOR.SUCCESS],
        bisState: StateEnum.REFUND_OK,

    },
    101: {//出票超时
        name: ['未知出票结果'],
        color: [COLOR.FAILED],
        bisState: StateEnum.UNKNOW,
    },
    102: {//已取票
        name: ['已取票'],
        color: [COLOR.SUCCESS],
        bisState: StateEnum.PICKED,

    },
    'UNCHANGED': {
        name: ['出票失败'],
        color: [COLOR.FAILED],
        bisState: StateEnum.CHANGE_FAIL,

    },
    'CHANGING': {
        name: ['改签中'],
        color: [COLOR.PROCESSING],
        bisState: StateEnum.CHANGE_PROCESSING,

    },
    'CHANGE_SUCCESS': {
        name: ['已改签'],
        color: [COLOR.SUCCESS],
        bisState: StateEnum.CHANGE_OK,

    },
    'HAS_CHANGE_SUCCESS': {//原票改签完成
        name: ['已改签'],
        color: [COLOR.SUCCESS],
        bisState: StateEnum.CHANGE_OK,

    },
    'CHANGE_FAILED': {
        name: ['改签失败'],
        color: [COLOR.FAILED],
        bisState: StateEnum.CHANGE_FAIL,
        changeFailed: true,

    },
    'CHANGE_CANCELLED': {
        name: ['取消改签'],
        color: [COLOR.FAILED],
        bisState: StateEnum.CHANGE_FAIL,

    },
    'SEAT_TAKING': {
        name: ['改签中'],
        color: [COLOR.PROCESSING],
        bisState: StateEnum.CHANGE_PROCESSING,

    },
    'HAS_CHANGING': { //原票改签中
        name: ['改签中'],
        color: [COLOR.PROCESSING],
        bisState: StateEnum.CHANGE_PROCESSING,

    },
    'SEAT_TAKEN_SUCCESS': {
        name: ['改签中'],
        color: [COLOR.PROCESSING],
        bisState: StateEnum.CHANGE_PROCESSING,

    },
    'SEAT_TAKEN_FAILED': {
        name: ['改签失败'],
        color: [COLOR.FAILED],
        bisState: StateEnum.CHANGE_FAIL,

    },
    'AFTER_CHANGE_REFUND_SUCCESS': { //改签后退票成功 真正订单显示的是已改签状态  此状态为改签成功后退票成功
        name: ['已改签'],
        color: [COLOR.SUCCESS],
        bisState: StateEnum.CHANGE_OK,

    },
    'AFTER_CHANGE_REFUND_FAILED': { //改签成功后 真正的订单显示为已改签  此状态为改签成功后退票失败
        name: ['已改签'],
        color: [COLOR.FAILED],
        bisState: StateEnum.CHANGE_OK,

    },
    'AFTER_CHANGE_REFUNDING': { //改签成功后 真正的订单显示为已改签 此状态为改签成功后退票中
        name: ['已改签'],
        color: [COLOR.PROCESSING],
        bisState: StateEnum.CHANGE_OK,

    },
}

/**
 * 火车票：根据乘机人状态码返回状态对象
 * 注意：只返回退改签的状态
 * @param status 乘车人的状态码
 * @returns {string} 状态对象
 */
export function getTrainTicketStatusObj(status) {
    try {
        return trainTicketStatusEnum[status];
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
export function getTrainTicketStatusName(status, index) {
    try {
        if (index == null || index == undefined) {
            index = 0;
        }
        let name = getTrainTicketStatusObj(status).name;
        if (name) {
            index = name.length >= index ? index : 0;//如果index越界，则默认取第一个
            return name[index];
        }
        return "";
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
export function getTrainTicketStatusColor(status, index) {
    try {
        if (index == null || index == undefined) {
            index = 0;
        }
        let color = getTrainTicketStatusObj(status).color;
        if (color) {
            index = color.length >= index ? index : 0;//如果index越界，则默认取第一个
            return color[index] || '#333';//默认颜色是#333
        } else {
            return "";
        }
    } catch (e) {
        return "";
    }
}
/**
 * 是否 车票的显示状态是 改签成功
 */
export function isTrainTicketCHANGE_OK(status) {
    try {
        return getTrainTicketStatusObj(status).bisState == StateEnum.CHANGE_OK;
    } catch (e) {
        return false
    }
}
/**
 * 是否 车票的显示状态是 改签失败
 */
export function isTrainTicketCHANGE_FAIL(status) {
    try {
        return getTrainTicketStatusObj(status).bisState == StateEnum.CHANGE_FAIL;
    } catch (e) {
        return false
    }
}
/**
 * 是否 车票的显示状态是 改签中
 */
export function isTrainTicketCHANGE_PROCESSING(status) {
    try {
        return getTrainTicketStatusObj(status).bisState == StateEnum.CHANGE_PROCESSING;
    } catch (e) {
        return false;
    }
}

/**
 * 是否 车票的显示状态是 退票成功
 */
export function isTrainTicketREFUND_OK(status) {
    try {
        return getTrainTicketStatusObj(status).bisState == StateEnum.REFUND_OK;
    } catch (e) {
        return false
    }
}
/**
 * 是否 车票的显示状态是 退票失败
 */
export function isTrainTicketREFUND_FAIL(status) {
    try {
        return getTrainTicketStatusObj(status).bisState == StateEnum.REFUND_FAIL;
    } catch (e) {
        return false
    }
}
/**
 * 是否 车票的显示状态是 退票中
 */
export function isTrainTicketREFUND_PROCESSING(status) {
    try {
        return getTrainTicketStatusObj(status).bisState == StateEnum.REFUND_PROCESSING;
    } catch (e) {
        return false;
    }
}
/** ========================================火车客户状态End========================================== */
/**
 * 获取火车票的退改签规则
 */
 export function getTrainPolicy() {
   return "购票说明\n\n1、我司接受二代身份证及护照、台胞证、港澳通行证预订，其他证件暂不支持。\n\n2、一张有效身份证件同一乘车日期同一车次限购一张车票。（儿童用成人的证件号情况除外）\n\n\n取票说明\n\n1、使用二代身份证预订的客户，可持预订时所使用的乘车人有效二代身份证到车站售票窗口、铁路客票代售点或车站自动售票机上办理取票手续，部分高铁站可持二代居民身份证直接检票进站，以各铁路站点实际情况为准。\n\n2、如预订时使用的乘车人二代身份证无法识别或使用护照预订的客户，请持预订时留下的有效证件原件及本公司给您发送的火车票订单号至火车站售票点，由售票员核实后办理换票手续。\n\n3、若您在预订成功后、换票前，不慎遗失有效身份证件，须由您本人到乘车站铁路公安制证口办理临时身份证明。\n\n4、纸质火车票作为唯一的报销凭证，如您需要报销，请提前至火车站换取纸质车票并妥善保管。如您未提前换票或纸质票遗失，我司概不提供火车票票款发票。\n\n\n退票及改签说明\n\n1、在线申请退票须同时满足以下条件：\n\n①服务时间：7:00—22:55；②发车时间外35分钟；③未取纸质票\n\n2、根据铁路局规定，开车前16天22点不收取退票费。开车前48小时以上，手续费5%；开车前24-48小时之间，手续费10%；开车前24小时内，手续费20%。最终退票手续费以铁路局实际收取为准。\n\n3、支持在线改签（热门线路除外），一张车票只能改签一次，且须同时满足以下条件：\n\n①服务时间：7:00—22:55；②发车时间外35分钟；③未取纸质票。\n\n开车前48小时（不含）以上，可改签预售期内的其他列车；开车前48小时以内，可改签至票面日期当日24:00之间的列车；不办理票面日期次日及以后的改签。开车前48小时-15天期间内，改签至距开车15天以上的其他列车，又在距开车15天前退票的，仍核收5%的退票费。铁路部门规定，对于改签后新车票价格低于原车票价格的，退还差额，并对差额部分收取改签手续费：新票距发车时间15天以上的，差额不收改签费；48小时-15天（含）的，收取差额5%的改签费；24-48小时（含）的，收取10%；不足24小时（含）的，收取20%。\n\n4、如发生网络技术故障等情形，造成我司临时性暂停在线退票、改签服务，您可以在发车前携带纸质车票及购票时使用的有效身份证件至火车站的退票窗口办理。"
}
