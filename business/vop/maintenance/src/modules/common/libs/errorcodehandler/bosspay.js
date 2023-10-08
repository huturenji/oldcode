import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = [];//全局白名单

const NoticeType = extendUtils.NoticeType;

//自定义错误码
var errorMap = {
    //参数错误
    "85104001": {
        text: "获取信息失败，请稍后重试",
        noticeType: NoticeType.TOAST
    }
}

export default function(){
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}