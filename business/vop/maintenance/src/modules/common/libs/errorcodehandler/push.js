import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = [];//全局白名单

const NoticeType = extendUtils.NoticeType;

//自定义错误码
var errorMap = {
    "85105001": {
        text: "角色不存在",
        noticeType: NoticeType.TOAST
    }
}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}