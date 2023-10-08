import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = ['/channel/v1/getAppProtocols'];//全局白名单

//授权 自定义错误码
var errorMap = {
    "80117001": {
        text: '认证授权服务操作失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}