import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = [];//全局白名单

//虚拟供应商 自定义错误码
var errorMap = {
    "0": {
        text: '操作成功',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false,
        ignore: true
    },

    "0000": {
        text: '操作成功',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false,
        ignore: true
    },

    "5002": {
        text: '参数为空',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false,
        ignore: false
    },
}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}