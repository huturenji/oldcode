export const ORDER_SOURCE = {
    NORMAL: 'NORMAL',
    FEATHER: 'FEATHER'
}
// 订单状态枚举 订单状态：0-已取消；10-未付款；20-已付款；30-已发货；40-已完成;50-已关闭; DELETED和ALL是自定义的
export const ORDER_STATE = {
    CANCELED: 0, // 已取消,
    WAIT_PAY: 10, // 待付款,
    WAIT_DELIVER: 20, // 待发货
    DELIVERED: 30, // 已发货
    FINISHED: 40, // 交易完成
    CLOSED: 50, // 已关闭
    DELETED: 999, // 该订单已删除
    ALL: Symbol.for('all'), // 全部
}

// 排除的订单状态
export const EXCLUDE_ORDER_STATE = [
    ORDER_STATE.CANCELED,
    ORDER_STATE.CLOSED,
    ORDER_STATE.DELETED,
    ORDER_STATE.ALL
]

export const ORDER_STATE_VAlUE = {
    [ORDER_STATE.CANCELED]: '已取消',
    [ORDER_STATE.WAIT_PAY]: '待付款',
    [ORDER_STATE.WAIT_DELIVER]: '待发货',
    [ORDER_STATE.DELIVERED]: '待收货',
    [ORDER_STATE.FINISHED]: '已完成',
    [ORDER_STATE.CLOSED]: '已关闭',
    [ORDER_STATE.ALL]: '已关闭',
}

export const ORDER_STATE_COLOR = {
    [ORDER_STATE.CANCELED]: '#666666',
    [ORDER_STATE.WAIT_PAY]: '#FC8848',
    [ORDER_STATE.WAIT_DELIVER]: '#FC8848',
    [ORDER_STATE.DELIVERED]: '#FC8848',
    [ORDER_STATE.FINISHED]: '#f30300',
    [ORDER_STATE.CLOSED]: '#666666',
    [ORDER_STATE.ALL]: '#666666',
}


export const BUTTON_TYPES = {
    CANCEL: 'cancel', // 取消订单
    PAY: 'pay', // 支付
    FINISH: 'finish', // 确认收货
    VIEW_LOGISTIC: 'viewLogistic',
    BUY_AGAIN: 'buyAgain', // 再次购买该商品
    DELETE: 'delete', // 删除该订单
    UPDATE_ADDRESS: 'updateAddress', // 修改地址
    CUSTOMER_SERVICE: 'customerService', // 联系客服退款
    ADD_INVOICE: 'addInvoice', // 补开发票
    RE_INVOICE: 'reInvoice', //换开发票
    VIEW_INVOICE: 'viewInvoice', //查看发票
}

export const ORDER_ENUM = {
    [ORDER_STATE.CANCELED]: {
        text: '已取消',
        totalText: '应付款',
        btnTypes: [BUTTON_TYPES.DELETE, BUTTON_TYPES.BUY_AGAIN],
        btnTypesDetail: [BUTTON_TYPES.DELETE, BUTTON_TYPES.BUY_AGAIN],
        btnTypesGift: [BUTTON_TYPES.DELETE]
    },
    [ORDER_STATE.WAIT_PAY]: {
        text: '待付款',
        totalText: '需付款',
        btnTypes: [BUTTON_TYPES.CANCEL, BUTTON_TYPES.PAY],
        btnTypesDetail: [BUTTON_TYPES.CANCEL, BUTTON_TYPES.PAY],
        btnTypesGift: [BUTTON_TYPES.CANCEL]
    },
    [ORDER_STATE.WAIT_DELIVER]: {
        text: '待发货',
        totalText: '实付款',
        btnTypes: [BUTTON_TYPES.CANCEL, BUTTON_TYPES.BUY_AGAIN],
        btnTypesDetail: [BUTTON_TYPES.CANCEL, BUTTON_TYPES.BUY_AGAIN],
        btnTypesGift: [BUTTON_TYPES.CANCEL]
    },
    [ORDER_STATE.DELIVERED]: {
        text: '待收货', //  已发货
        totalText: '实付款',
        btnTypes: [BUTTON_TYPES.CUSTOMER_SERVICE, BUTTON_TYPES.VIEW_INVOICE, BUTTON_TYPES.ADD_INVOICE, BUTTON_TYPES.RE_INVOICE, BUTTON_TYPES.VIEW_LOGISTIC, BUTTON_TYPES.BUY_AGAIN, BUTTON_TYPES.FINISH],
        btnTypesDetail: [BUTTON_TYPES.CUSTOMER_SERVICE, BUTTON_TYPES.VIEW_INVOICE, BUTTON_TYPES.ADD_INVOICE, BUTTON_TYPES.RE_INVOICE, BUTTON_TYPES.VIEW_LOGISTIC, BUTTON_TYPES.BUY_AGAIN, BUTTON_TYPES.FINISH],
        btnTypesGift: [BUTTON_TYPES.VIEW_LOGISTIC, BUTTON_TYPES.FINISH]
    },
    [ORDER_STATE.FINISHED]: {
        text: '已完成',
        totalText: '实付款',
        btnTypes: [BUTTON_TYPES.DELETE, BUTTON_TYPES.VIEW_LOGISTIC, BUTTON_TYPES.VIEW_INVOICE, BUTTON_TYPES.ADD_INVOICE, BUTTON_TYPES.RE_INVOICE, BUTTON_TYPES.BUY_AGAIN],
        btnTypesDetail: [BUTTON_TYPES.DELETE, BUTTON_TYPES.VIEW_LOGISTIC, BUTTON_TYPES.VIEW_INVOICE, BUTTON_TYPES.ADD_INVOICE, BUTTON_TYPES.RE_INVOICE, BUTTON_TYPES.BUY_AGAIN],
        btnTypesGift: [BUTTON_TYPES.DELETE, BUTTON_TYPES.VIEW_LOGISTIC]
    },
    [ORDER_STATE.CLOSED]: {
        text: '交易关闭',
        totalText: '应付款',
        btnTypes: [BUTTON_TYPES.DELETE, BUTTON_TYPES.BUY_AGAIN],
        btnTypesDetail: [BUTTON_TYPES.DELETE, BUTTON_TYPES.BUY_AGAIN],
        btnTypesGift: [BUTTON_TYPES.DELETE]
    }
}

export const ORDER_LIST_NAV = [
    {
        name: '待付款',
        path: '/views/order/list/index',
        query: {
            orderState: ORDER_STATE.WAIT_PAY,
        },
        meta: {
            icon: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/order/btn_wode_daifukuai.svg'
        }
    },
    {
        name: '待发货',
        query: {
            orderState: ORDER_STATE.WAIT_DELIVER,
        },
        path: '/views/order/list/index',
        meta: {
            icon: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/order/btn_wode_zhifuzhong.svg'
        }
    },
    {
        name: '待收货',
        query: {
            orderState: ORDER_STATE.DELIVERED,
        },
        path: '/views/order/list/index',
        meta: {
            icon: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/order/btn_wode_daishouhuo.svg'
        }
    },
    {
        name: '退换/售后',
        path: '/views/gift/afterSale/list',
        query: {
            sourceType: 'orderDetail',
        },
        meta: {
            icon: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/order/btn_wode_refund.svg'
        }
    },
    // {
    //     name: '全部',
    //     query: {
    //         orderState: '',
    //     },
    //     path: '/views/order/list/index',
    //     meta: {
    //         icon: 'https://bucket-sinosun-dev1.oss-cn-hangzhou.aliyuncs.com/jegzgPi4g9/images/admin/deco/43e7aa5e-1263-4656-bdfc-f2042d389df8.svg'
    //     }
    // }
]