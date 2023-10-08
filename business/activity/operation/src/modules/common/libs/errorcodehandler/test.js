import { utils } from "opcl";
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = [];//全局白名单

const NoticeType = utils.NoticeType;

//自定义错误码
var errorMap = {
    //参数错误
    "85103001": {
        text: "获取信息失败，请稍后重试",
        noticeType: NoticeType.TOAST
    }
}

export default function () {
    Object.assign(utils.ErrorCodeMap, errorMap);
    utils.WhiteList.popup.push(...popupWhiteList);
    utils.WhiteList.global.push(...globalWhiteList)
}