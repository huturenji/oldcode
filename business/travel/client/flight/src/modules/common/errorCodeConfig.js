import extendUtils from 'flightCommon/extend.js';

var popupWhiteList = [];//弹窗白名单
var globalWhiteList = ['queryBussinessTripCalendar', 'searchPriceCalendar', 'queryGuestRule', 'queryUserFlightHistory'];//全局白名单

let errorMap = {
    "46240001": {
        text: '机票已停用，敬请谅解',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46030001": {//业务侧处理
        text: '国内机票验仓验价失败',
        noticeType: extendUtils.NoticeType.TOAST,
        ignore: true
    },
    "46030002": {
        text:'抱歉，航班舱位不足，请重新选择航班',
        ignore: true,
        // noticeType:extendUtils.NoticeType.ALERT,
        noticeType: extendUtils.NoticeType.TOAST,//todo 暂用toast
        showCode: true
    },
    "46030003": {//TODO 下个迭代服务器处理
        text:'乘客行程冲突无法提交订单，请将原票退改后重新购票',
        noticeType: extendUtils.NoticeType.TOAST,//todo 暂用toast
        // noticeType:extendUtils.NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        showCode: true
    },
    "46030004": {
        text: '当前行程不支持12岁以下儿童购票',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46030005": {
        text: '上传失败，请重试',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46030006": {
        text: '此航班由365提供，其在00:00~7:00间进行系统维护将无法购票，如需购票，请选择其他航班',
        noticeType: extendUtils.NoticeType.ALERT
    },
    "46030022": {
        text: '没有获取到经停信息',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46030023": {
        text: '当前已无座位或座位数量不足',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46030024": {
        text: '独立查询接口数据为空',
        noticeType: extendUtils.NoticeType.TOAST
    }
}

export default function(){
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}