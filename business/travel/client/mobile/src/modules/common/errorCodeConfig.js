import extendUtils from 'custCommon/extend.js';

var popupWhiteList = [];//弹窗白名单
var globalWhiteList = [];//全局白名单

let errorMap = {
}

export default function(){
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}