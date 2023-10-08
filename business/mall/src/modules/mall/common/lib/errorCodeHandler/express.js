import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = [];//全局白名单

//物流信息 自定义错误码
var errorMap = {
    "80107001": {//
        text: '查询顺丰快递未传手机号后四位',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80107002": {//
        text: '查无结果',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80107003": {//
        text: '下单失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80107004": {//
        text: '取消失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80107005": {//
        text: '该订单已经取消，无需重复取消',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80107006": {//
        text: '获取物流信息失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },

}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}