import store from '../store'

export const PAY_MODE = {
    PAGE_PAY: 'PAGE_PAY',//网页支付（二维码等）
    APP_PAY: 'APP_PAY',//app支付
    H5_PAY: 'H5_PAY',//H5支付
    JS_PAY: 'JS_PAY'
}
export const PAY_RESULT_STATUS = {
    PAID: 'PAID',
    REFUNDED_PARTIAL: 'REFUNDED_PARTIAL',
    REFUNDED: 'REFUNDED',
    FAILED: 'FAILED',
    PAYING: 'PAYING',
    CLOSED: 'CLOSED',//CLOSE是创建预付单后，超时未支付。然后这个单子就关闭了
}

//操作阶段
export const OPERATION_STAGE = {
    SUCCESS: 'success',//成功(终结态)
    FAILED: 'failed',//失败(终结态)
    BREAK: 'break',//支付操作中断
    PAYING: 'paying',//支付动作执行中
    WAITING: 'waiting',//支付动作完成，等待结果
    UNKNOW: 'unknow',//无法预知支付动作是否完成（主要用在二维码支付上）(终结态)
    END: 'end',//非实时支付，当前操作流程结束(终结态)(原用在公款转账上，现暂时弃用)
}

export const qrCodePara = { //二维码配置
    value: null,
    size: 170,
    level: 'H'
}

export const LOADING_STATE = {
    LOADING: 'loading',
    SUBMIT: 'submit',
    CONFIRM: 'confirm',//这个状态应该只有二维码支付使用，二维码支付没有终结态（即不知道用户是否扫码完成）
}

export const PAY_TYPE = {
    WALLET_PAY: {
        code: "WALLET_PAY",
    },
    WECHAT: {
        code:'WX_PAY',
    },
    WX_MINI_PAY: {
        code:'WX_MINI_PAY',
    },
    ALI_PAY: {
        code:'ALI_PAY',
    },
    ALI_PAY_H5: {
        code:'ALI_PAY_H5',
    },
    PUBLIC_PAY: {
        code: 5,
    },
    UNION_PAY: {
        code: "UNION_PAY",
    },
    INBANK_PAY: {//老板付
        code: "INBANK_PAY",
    },
    QUICK_PAY: {//公款闪付
        code: "QUICK_PAY",
    },
    TRANSFER_PAY: {//公款转账
        code: "TRANSFER_PAY",
    },
    XMGJ_PAY: {
        code: 'XMGJ_PAY',
    },
    CHOUZHOU_PAY: {
        code: 'CHOUZHOU_PAY',
    },
    GDHX_PAY: {//华兴银行个人付
        code: "GDHX_PAY",
    },
    IFC: {//免息付
        code: "LOAN_PAY",
    },
    UNION_PAY_JINZHOU: {
        code: "UNION_PAY_JINZHOU",
    },
}

export function getPayTypeConfig(){
    let snutils = store.state.depends.snutils;
    return {
        WALLET_PAY: {
            code: PAY_TYPE.WALLET_PAY.code,
            orderby: 1,//支付列表中显示的顺序
            moduleName: 'walletPay',
            payMethod:PAY_MODE.PAGE_PAY,
        },
        WX_MINI_PAY: {//小程序支付
            code: PAY_TYPE.WX_MINI_PAY.code,
            orderby: 2,//支付列表中显示的顺序
            moduleName: 'wechatMini',
            payMethod:PAY_MODE.JS_PAY,
        },
        WECHAT: {
            code:PAY_TYPE.WECHAT.code,
            alias: '微信支付',
            orderby: 2,//支付列表中显示的顺序
            moduleName: 'wechat',
            thirdPayInfo: {
                sceneInfo: '{"h5_info": {"type":"Wap","wap_url": "'+(location.protocol + "//" + window.location.host)+'","wap_name": "兆日B+"}}',
                qrImgWidth: qrCodePara.size,
            },
            appFuncName: 'CallWXPayFunction',
            payMethod: snutils.isPC() ? PAY_MODE.PAGE_PAY : PAY_MODE.H5_PAY,
            qrCodePara: qrCodePara,
        },
        ALI_PAY: {
            code:PAY_TYPE.ALI_PAY.code,
            alias: '支付宝支付',
            orderby: 3,//支付列表中显示的顺序
            moduleName: 'aliPay',
            thirdPayInfo: {
                qrImgWidth: qrCodePara.size,//和微信支付的qrCodePara中的width保持一致
            },
            appFuncName: 'aliPay',
            payMethod: snutils.isPC() ? PAY_MODE.PAGE_PAY : PAY_MODE.APP_PAY,
            qrCodePara: qrCodePara,
        },
        ALI_PAY_H5: {//支付宝H5支付，单独占用一个支付方式的位置
            code:PAY_TYPE.ALI_PAY_H5.code,
            alias: '支付宝支付',
            orderby: 3,//支付列表中显示的顺序
            moduleName: 'aliPayH5',
            payMethod: PAY_MODE.H5_PAY,
            thirdPayInfo: {
                frontUrl: ''//aliPayH5.vue中动态生成
            }
        },
        PUBLIC_PAY: {
            code: PAY_TYPE.PUBLIC_PAY.code,
            orderby: 5,//支付列表中显示的顺序
            moduleName: 'publicPay',
            appFuncName: 'xmgjPay',
            payMethod: PAY_MODE.APP_PAY,
            showFn: function () {
                return !snutils.isPC();
            },
        },
        UNION_PAY: {
            code: PAY_TYPE.UNION_PAY.code,
            alias: '银联支付',
            orderby: 1,//支付列表中显示的顺序
            moduleName: 'unionPay',
            appFuncName: 'unionPay',
            payMethod: PAY_MODE.H5_PAY,
            thirdPayInfo: {
                equipmentType: snutils.isPC() ? '07' : '08',
                frontUrl: ''//在unionPay.vue中动态生成
            },
        },
        INBANK_PAY: {//老板付
            code: PAY_TYPE.INBANK_PAY.code,
            orderby: 1,//支付列表中显示的顺序
            moduleName: 'bossPay',
            appFuncName: 'bossPay',
            payMethod: PAY_MODE.APP_PAY,
        },
        QUICK_PAY: {//公款闪付
            code: PAY_TYPE.QUICK_PAY.code,
            orderby: 1,//支付列表中显示的顺序
            moduleName: 'quickPay',
            appFuncName: 'quickPay',
            payMethod: PAY_MODE.APP_PAY,
        },
        TRANSFER_PAY: {//公款转账
            code: PAY_TYPE.TRANSFER_PAY.code,
            orderby: 1,//支付列表中显示的顺序
            moduleName: 'transferPay',
            appFuncName: 'transferPay',
            payMethod: PAY_MODE.APP_PAY,
        },
        XMGJ_PAY: {
            code: PAY_TYPE.XMGJ_PAY.code,
            orderby: 1,//支付列表中显示的顺序
            // iconStyle: 'paybg_unionPay',
            moduleName: 'xmgjPay',
            payMethod: PAY_MODE.PAGE_PAY,
            thirdPayInfo: {
                frontUrl: ''//在xmgjPay.vue中动态生成
            },
        },
        CHOUZHOU_PAY: {
            code: PAY_TYPE.CHOUZHOU_PAY.code,
            orderby: 1,//支付列表中显示的顺序
            moduleName: 'chouzhouPay',
            appFuncName: 'chouzhouPay',
            payMethod: PAY_MODE.APP_PAY,
        },
        GDHX_PAY: {//华兴银行个人付
            code: PAY_TYPE.GDHX_PAY.code,
            orderby: 1,//支付列表中显示的顺序
            moduleName: 'hxPersonalPay',
            appFuncName: 'huaxingPersonalPay',
            payMethod: PAY_MODE.APP_PAY,
        },
        IFC: {//免息付
            code: PAY_TYPE.IFC.code,
            orderby: 1,//支付列表中显示的顺序
            moduleName: 'interestFreeCredit',
            appFuncName: 'IFCPay',
            payMethod: PAY_MODE.APP_PAY,
        },
        UNION_PAY_JINZHOU: {//锦州银行支付
            code: PAY_TYPE.UNION_PAY_JINZHOU.code,
            orderby: 1,//支付列表中显示的顺序
            moduleName: 'jinzhouPay',
            payMethod: PAY_MODE.H5_PAY,
        },
    }
}