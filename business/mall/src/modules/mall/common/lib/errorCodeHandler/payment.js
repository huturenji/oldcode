import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = ['/payment/v1/getPaymentInfo'];//全局白名单

//支付 自定义错误码
var errorMap = {
    "80103001":{
        text: '支付类型错误',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103002":{
        text: '支付总金额错误',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103003":{
        text: '订单不存在',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103004":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103005":{
        text: '订单已全额退款或未支付',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103006":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103007":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103008":{
        text: '系统异常，请联系客服'+BMallConfig.BIS_CUSTOMER_SERVICE_PHONE,
        noticeType: extendUtils.NoticeType.CONFIRM,
        btnName: ['呼叫客服', '取消'],
        bisFunc: ()=>{extendUtils.callNativeTel(BMallConfig.BIS_CUSTOMER_SERVICE_PHONE)},
        showCode: true,
    },
    "80103009":{
        text: '存在无效订单，请核对订单状态再支付',
        noticeType: extendUtils.NoticeType.ALERT,
        btnName: '我知道了',
        showCode: true,
    },
    "80103010":{
        text: '支付方式不可用',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103011":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },

    "80103100":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103101":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103102":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103103":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103104":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },

    "80103200":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103201":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103202":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103203":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },

    "80103300":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103301":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103302":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103303":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },

    "80103400":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103401":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103402":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103403":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103404":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103405":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },

    "80103600":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103601":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },

    "80103700":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103701":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103702":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103998":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80103999":{
        text: '支付失败，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}