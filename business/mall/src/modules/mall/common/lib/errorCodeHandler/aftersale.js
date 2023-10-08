import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = ['/postsale/v1/getMyServiceStatistics'];//全局白名单

let supplierId = extendUtils.getUserPara('supplierId')

//地址管理 自定义错误码
var errorMap = {
    "80104101": {
        text: '不可售后',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80104102": {
        text: '请求参数为空',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80104103": {
        text: '未知的'+(BMallConfig[supplierId] || {}).name+'售后服务单状态',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80104104": {
        text: '未知的售后服务单状态',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80104105": {
        text: '不存在的售后类型',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80104106": {
        text: '未查询到服务单信息,服务单不存在',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80104107": {
        text: '该服务单已审核',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80104108": {
        text: '您已经提过申请了',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80104118":  {
        text: '服务单已经处理，无法取消',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80104119": {
        text: '发运信息无法提交',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80104901": {
        text: '交易失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}