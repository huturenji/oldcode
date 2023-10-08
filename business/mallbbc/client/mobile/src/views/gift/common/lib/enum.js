
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

export const giftUsedMap = {
    'UNUSED': 0, //未兑换
    'USED': 1 //已兑换
}

export const afsTypes = {
    'RETURN': 1, // 退货 001
    'EXCHANGE':2, // 换货 010
    'REPAIR':4 // 维修 100
}

/****
 *  鹅毛情首页列表状态枚举
 */
export const giftEnum = {
    [giftType.GIVED]: { //我送出的
        [giftStatusMap.CANCEL]: {
            text: '已取消',
            textColor: '#FC8848',
            btnConfig: [],
            btnConfigDetail: [
                {
                    type: 'agagin',
                    bgColor: '#f30300',
                    textColor: '#fff',
                    borderColor: '#f30300'
                }
            ]
        },
        [giftStatusMap.UNPAY]: {
            text: '待支付',
            textColor: '#FC8848',
            btnConfig: [
                {
                    type: 'cancel',
                    bgColor: '#fff',
                    textColor: '#f30300',
                    borderColor: '#f30300'
                },
                {
                    type: 'pay',
                    bgColor: '#f30300',
                    textColor: '#fff',
                    borderColor: '#f30300'
                }
            ],
            btnConfigDetail: [
                {
                    type: 'cancel',
                    bgColor: '#fff',
                    textColor: '#f30300',
                    borderColor: '#f30300'
                },
                {
                    type: 'pay_detail',
                    bgColor: '#f30300',
                    textColor: '#fff',
                    borderColor: '#f30300'
                }
            ]
        },
        [giftStatusMap.TO_RECEIVE]: {
            text: '待收礼',
            textColor: '#FC8848',
            btnConfig: [
                {
                    type: 'weixin',
                    bgColor: '#f30300',
                    textColor: '#fff',
                    borderColor: '#f30300'
                },
                {
                    type: 'bizmate',
                    bgColor: '#f30300',
                    textColor: '#fff',
                    borderColor: '#f30300'
                }
            ],
            btnConfigDetail: [
                {
                    type: 'weixin',
                    bgColor: '#f30300',
                    textColor: '#fff',
                    borderColor: '#f30300'
                },
                {
                    type: 'bizmate',
                    bgColor: '#f30300',
                    textColor: '#fff',
                    borderColor: '#f30300'
                }
            ]
        },
        [giftStatusMap.RECEIVED]: {
            text: '已收礼',
            textColor: '#666666',
            btnConfig: [
                {
                    type: 'agagin',
                    bgColor: '#f30300',
                    textColor: '#fff',
                    borderColor: '#f30300'
                }
            ],
            btnConfigDetail: [
                {
                    type: 'addInvoice',
                    bgColor: '#fff',
                    textColor: '#f30300',
                    borderColor: '#f30300'
                },
                {
                    type: 'resInvoice',
                    bgColor: '#fff',
                    textColor: '#f30300',
                    borderColor: '#f30300'
                },
                {
                    type: 'viewInvoice',
                    bgColor: '#fff',
                    textColor: '#f30300',
                    borderColor: '#f30300'
                },
                {
                    type: 'agagin',
                    bgColor: '#f30300',
                    textColor: '#fff',
                    borderColor: '#f30300'
                }
            ]
        },
        [giftStatusMap.EXPIRED]: {
            text: '已失效',
            textColor: '#666666',
            btnConfig: [
                {
                    type: 'refund',
                    bgColor: '#fff',
                    textColor: '#f30300',
                    borderColor: '#f30300'
                },
                {
                    type: 'agagin',
                    bgColor: '#f30300',
                    textColor: '#fff',
                    borderColor: '#f30300'
                }
            ],
            btnConfigDetail: [
                {
                    type: 'refund',
                    bgColor: '#fff',
                    textColor: '#f30300',
                    borderColor: '#f30300'
                },
                {
                    type: 'agagin',
                    bgColor: '#f30300',
                    textColor: '#fff',
                    borderColor: '#f30300'
                }
            ]
        }
    },

    [giftType.RECEIVED]: { //我收到的
        [giftStatusMap.RECEIVED]: {
            [giftUsedMap.UNUSED]: { // 已收礼未兑换
                text: '已收礼',
                textColor: '#666666',
                btnConfig: [
                    {
                        type: 'fillAddress',
                        bgColor: '#fff',
                        textColor: '#f30300',
                        borderColor: '#f30300'
                    }
                ],
                btnConfigDetail: [
                    {
                        type: 'fillAddress',
                        bgColor: '#fff',
                        textColor: '#f30300',
                        borderColor: '#f30300'
                    }
                ]
            },
            [giftUsedMap.USED]: { //已收礼已兑换
                text: '已收礼',
                textColor: '#666666',
                btnConfig: [
                    {
                        type: 'detail',
                        bgColor: '#fff',
                        textColor: '#f30300',
                        borderColor: '#f30300'
                    }
                ],
                btnConfigDetail: [
                    {
                        type: 'returnGift',
                        bgColor: '#f30300',
                        textColor: '#fff',
                        borderColor: '#f30300'
                    }
                ]
            }
        }
    }
}
// 定义哪些路径跳转到礼物详情页需要刷新数据
export const FLUSH_PATH = [
    "/pages/invoice/myInvoice" // 发票页
]