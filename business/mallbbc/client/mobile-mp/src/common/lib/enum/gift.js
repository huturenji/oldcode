
// 我送的和我收的两个状态的枚举
export const giftType = {
    'GIVED': 0, // 我送的
    'RECEIVED': 1 // 我收的
}

export const giftStatusMap = {
    'CANCEL': 99, // 已取消
    'UNPAY': 10, //待支付
    'PAY': 20, //已付款
    'TO_RECEIVE': 0, //待收礼
    'RECEIVED': 1, //已收礼
    'EXPIRED': 2 //已失效
}

export const giftStatusValueMap = new Map()
    .set(giftStatusMap.CANCEL, '已取消')
    .set(giftStatusMap.UNPAY, '待支付')
    .set(giftStatusMap.PAY, '已付款')
    .set(giftStatusMap.TO_RECEIVE, '待收礼')
    .set(giftStatusMap.RECEIVED, '已收礼')
    .set(giftStatusMap.EXPIRED, '已失效');

export const giftUsedMap = {
    'UNUSED': 0, //未兑换
    'USED': 1 //已兑换
}

export const afsNavList = [{
    text: '退货',
    value: 1,
    loaded: false,
    afsList: []
}, {
    text: '换货',
    value: 2,
    loaded: false, //标记已经加载过
    afsList: []

}, {
    text: '维修',
    value: 4,
    loaded: false,
    afsList: []
}]
/****
 *  鹅毛情首页列表状态枚举
 */
export const giftEnum = {
    [giftType.GIVED]: { //我送出的
        [giftStatusMap.CANCEL]: {
            text: '已取消',
            textColor: '#FC8848',
            btnConfig: [],
            btnConfigDetail: ['again']
        },
        [giftStatusMap.UNPAY]: {
            text: '待支付',
            textColor: '#FC8848',
            btnConfig: ['cancel', 'pay'],
            btnConfigDetail: ['cancel', 'pay']
        },
        [giftStatusMap.TO_RECEIVE]: {
            text: '待收礼',
            textColor: '#FC8848',
            btnConfig: ['weixinShare'],
            btnConfigDetail: ['weixinShare']
        },
        [giftStatusMap.RECEIVED]: {
            text: '已收礼',
            textColor: '#666666',
            btnConfig: ['again'],
            btnConfigDetail: ['viewInvoice','addInvoice', 'resInvoice', 'again']
        },
        [giftStatusMap.EXPIRED]: {
            text: '已失效',
            textColor: '#666666',
            btnConfig: ['refundDetail', 'again'],
            btnConfigDetail: ['refundDetail', 'again']
        }
    },

    [giftType.RECEIVED]: { //我收到的
        [giftStatusMap.RECEIVED]: {
            text: '已收礼',
            textColor: '#666666',
            btnConfig: ['detail'],
            btnConfigDetail: ['backGift']
        }
    }
}