import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = ['/supplier/v1/list'];//全局白名单

//自定义错误码
var errorMap = {  
}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}