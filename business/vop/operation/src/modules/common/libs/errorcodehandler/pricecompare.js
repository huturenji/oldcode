import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = [];//全局白名单

const NoticeType = extendUtils.NoticeType;

//自定义错误码
var errorMap = {
    "85103001": {
        text: "获取信息失败，请稍后重试",
        noticeType: NoticeType.TOAST
    },
    "85105001": {
        text: "角色不存在",
        noticeType: NoticeType.TOAST
    },
    "88103104": {
        text: "该商品已被供应商删除",
        noticeType: NoticeType.TOAST
    }
}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}