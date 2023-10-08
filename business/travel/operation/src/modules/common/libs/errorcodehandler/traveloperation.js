import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = ['/presign/', '/file/', '/travel-management/', '/channel/', '/operation-record/', '/notice/'
    , '/express/', '/invoice/', '/order/', '/insurance/', '/customer-profile/', '/file/', '/alarm/', '/test-assistant/'
    , '/customer/', '/supplier-order/', '/payment/', '/train/', '/flight/', '/hotel/'];//全局白名单

const NoticeType = extendUtils.NoticeType;

//自定义错误码
var errorMap = {
    //参数错误
    "85104001": {
        text: "获取信息失败，请稍后重试",
        noticeType: NoticeType.TOAST,
    },
    //站点故障
    "85104002": {
        text: "获取信息失败，请稍后重试",
        noticeType: NoticeType.TOAST,
    },
    //系统内部错误
    "85104003": {
        text: "获取信息失败，请稍后重试",
        noticeType: NoticeType.TOAST,
    },
}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}