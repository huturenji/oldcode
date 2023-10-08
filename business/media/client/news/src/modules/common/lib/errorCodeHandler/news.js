import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = ['/customer-profile/v1/updateUserCategory'];//全局白名单
const NoticeType = extendUtils.NoticeType;
//自定义错误码
var errorMap = {  
    "81100001": {
        text: '资讯模块已停用，敬请谅解',
        noticeType: NoticeType.TOAST,
        showCode: true,
        ignore: true
    },
    "81100002": {
        text: '该内容已被发布者删除',
        noticeType: NoticeType.TOAST,
        showCode: true,
        ignore: true
    },
    "81101001": {
        text: '获取信息失败，请稍后重试',
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "81101002": {
        text: '获取信息失败，请稍后重试',
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "81101003": {
        text: '获取信息失败，请稍后重试',
        noticeType: NoticeType.TOAST,
        showCode: true
    }
}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}