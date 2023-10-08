import { utils } from "opcl";
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = [];//全局白名单

const NoticeType = utils.NoticeType;

//自定义错误码
var errorMap = {
    //参数错误
    "91103001": {
        text: "商品已失效，请重新选择",
        noticeType: NoticeType.TOAST
    },
    "91103002": {
        text: "网络连接错误，请稍后再试",
        noticeType: NoticeType.TOAST
    }
}

export default function () {
    Object.assign(utils.ErrorCodeMap, errorMap);
    utils.WhiteList.popup.push(...popupWhiteList);
    utils.WhiteList.global.push(...globalWhiteList)
}