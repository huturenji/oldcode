import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = [];//全局白名单

//发票 自定义错误码
var errorMap = {
    "80105001": {//
        text: '换开发票申请失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80105002":{
        text: '发票仅支持一年内换开',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80111015":{
        text: '该发票抬头或税号已存在',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false,
    },
    "80111016":{
        text: '新增发票抬头已超过上限',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false,
    },

}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}