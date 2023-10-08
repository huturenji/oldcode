import extendUtils from 'orderCommon/extend.js';

var popupWhiteList = [];//弹窗白名单
var globalWhiteList = [];//全局白名单

let errorMap = {
    /*-----------------火车票 TRAIN_MODULE_ID = "02"-----------------*/
    "46020001": {
        text: '网络异常，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true
    },
    "46020002": {
        text: '当前时间供应商不支持此服务',
        noticeType: extendUtils.NoticeType.TOAST,
        ignore: true
    },
    "46020003": {
        text: '网络异常，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true
    },
    "46020004": {//todo 场景不明确
        text: '乘客身份信息涉嫌被他人冒用',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46020005": {
        text: '乘客身份信息未通过验证',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46020006": {
        text: '乘客信息不正确',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46020007": {//TODO 下个迭代服务器处理
        text: '乘客行程冲突无法提交订单，请将原票退改后重新购票',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true
    },
    "46020008": {//TODO 下个迭代服务器处理
        text: '乘客行程冲突无法提交订单，请将原票退改后重新购票',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true
    },
    "46020009": {
        text: '当前车票状态不允许执行此操作',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46020010": {
        text: '出票五分钟内不可退票',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true
    },
    "46020011": {//TODO 下个迭代业务侧处理
        text: '距离发车时间不足35分钟，已停止网络退票，如有需要请前往车站窗口办理',
        noticeType: extendUtils.NoticeType.TOAST
        // ignore: true,
    },
    "46020012": {
        text: '不支持网上退票',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46020013": {
        text: '该订单不支持改签',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46020014": {
        text: '网络异常，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true
    },
    "46020015": {
        text: '该车票为受限车票，不支持网络退票，如有需要请前往车站窗口办理',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46020040": {
        text: '列车已发车，已停止退票，详情请查看退改签规则！',
        noticeType: extendUtils.NoticeType.TOAST,
        ignore: true
    },
    "46020039": {
        text: '当前时间已过票面日期当日24:00，无法办理改签业务，详情请查看退改签规则！',
        noticeType: extendUtils.NoticeType.TOAST,
        ignore: true
    },
    "46020016": {
        text: '您终于回来了，车次可能有变动，为您重新查询',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46020017": {
        text: '该车次不可下单',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46020018": {
        text: '网络异常，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true
    },
    "46020019": {
        text: '您已取票，无法办理网络改签，如有需要请前往车站窗口办理',
        noticeType: extendUtils.NoticeType.TOAST,
        ignore: true
    },
    "46020020": {
        text: '距离发车时间不足35分钟，已停止网络改签，如有需要请前往车站窗口办理',
        noticeType: extendUtils.NoticeType.TOAST,
        ignore: true
    },
    "46020038": {
        text: '不符合改签条件',
        noticeType: extendUtils.NoticeType.TOAST,
        ignore: true
    },
    "46020021": {
        text: '乘客行程冲突无法提交订单，请将原票退改后重新购票',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
        ignore: true
    },
    "46020022": {
        text: '已过发车时间，无法办理网络退票，如有需要请前往车站售票窗口办理',
        noticeType: extendUtils.NoticeType.TOAST,
        ignore: true
    },
    "46020026": {
        text: '距离发车时间不足35分钟，已停止网络退票，如有需要请前往车站售票窗口办理',
        noticeType: extendUtils.NoticeType.TOAST,
        ignore: true
    },

    /*-----------------飞机票 FLIGHT_MODULE_ID = "03"-----------------*/
    "46030001": {//业务侧处理
        text: '国内机票验仓验价失败',
        noticeType: extendUtils.NoticeType.TOAST,
        ignore: true
    },
    "46030002": {
        text:'抱歉，航班舱位不足，请重新选择航班',
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

    /*-----------------用车 CAR_MODULE_ID = "18"-----------------*/

    "46180002": {//场景说明：预估价格后等待5分钟以上再下单
        text: '预估价格已过期，请重新输入再下单',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false
    },
    "46180003": {//场景说明：手机号无效
        text: '无效的手机号',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false
    },
    "46180004": {//场景说明：该城市不支持下单
        text: '地点暂未开通',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false
    },

    /*-----------------酒店 HOTEL_MODULE_ID = "18"-----------------*/
    "46010001": {
        text: '信用卡已过有效期，无法下单，请更换其他信用卡重试',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46010002": {
        text: '当前已过入住时间，请更改查询条件',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46010003": {
        text:'房间价格变动，下单失败，请重新选购',
        // noticeType:extendUtils.NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        noticeType: extendUtils.NoticeType.TOAST//todo 暂用toast
    },
    "46010004": {
        text:'该酒店已不可预订，请选择其他酒店',
        noticeType: extendUtils.NoticeType.TOAST//todo 暂用toast
    },
    "46010005": {
        text:'剩余房间数不足，下单失败，请重新选购',
        // noticeType:extendUtils.NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        noticeType: extendUtils.NoticeType.TOAST//todo 暂用toast
    },
    "46010006": {
        text:'该商品预订失败，请重新选购其他商品',
        // noticeType:extendUtils.NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        showCode: true,
        noticeType: extendUtils.NoticeType.TOAST//todo 暂用toast
    },
    "46010007": {
        text:'信用卡错误，请重新填写',
        // noticeType:extendUtils.NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        noticeType: extendUtils.NoticeType.TOAST//todo 暂用toast
    },
    "46010008": {
        text:'该商品预订政策变动，下单失败，请重新选购其他商品',
        // noticeType:extendUtils.NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        showCode: true,
        noticeType: extendUtils.NoticeType.TOAST//todo 暂用toast
    },
    "46010009": {
        text:'该商品预订政策变动，下单失败，请重新选购其他商品',
        // noticeType:extendUtils.NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        showCode: true,
        noticeType: extendUtils.NoticeType.TOAST//todo 暂用toast
    },
    "46010010": {
        text:'该商品预订失败，请重新选购其他商品',
        // noticeType:extendUtils.NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        showCode: true,
        noticeType: extendUtils.NoticeType.TOAST,//todo 暂用toast
        useServerMsg:true,
        serverMsgName: 'resultMessage'
    },
    "46010011": {
        text:'该商品预订失败，请重新选购其他商品',
        // noticeType:extendUtils.NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        showCode: true,
        noticeType: extendUtils.NoticeType.TOAST//todo 暂用toast
    },
    "46010012": {
        text:'姓名只能输入英文或汉字，空格请用“/”代替',
        noticeType:extendUtils.NoticeType.TOAST
    },
    "46010013": {
        text: '网络异常，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true
    },
    "46010014": {
        text: '网络异常，请稍后重试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true
    },
    "46010015": {
        text: '订单重复，下单失败，请将原单取消后重新预订',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46010016": {
        text: '操作过于频繁，请稍后再试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true
    },
    "46010017": {
        text: '请填写实际入住客人的真实姓名，确保顺利入住',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46010018": {
        text: '乘客姓名/电话未通过供应商黑名单校验',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46010019": {
        text: '您无可用的酒店供应商，请联系管理员进行配置',
        noticeType: extendUtils.NoticeType.TOAST
    }
}

export default function(){
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}