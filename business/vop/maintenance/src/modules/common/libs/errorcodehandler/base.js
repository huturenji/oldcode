import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = [];//全局白名单

const NoticeType = extendUtils.NoticeType;

//自定义错误码
var errorMap = {
    //参数错误
    "85000001": {
        text: "无效的登录，请检查你的密码是否正确",
        noticeType: NoticeType.TOAST
    },
    //站点故障
    "85000002": {
        text: "登录过期，请重新登录",
        noticeType: NoticeType.TOAST
    }
}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}