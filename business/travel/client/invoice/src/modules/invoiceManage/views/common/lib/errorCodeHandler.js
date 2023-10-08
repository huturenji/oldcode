// 发票模块的错误码
// import functional from 'platform/functional';
let { functional } = SnTravel;
let {ErrorCodeMap, NoticeType, BisType, WhiteList} = functional;
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = [];//全局白名单
/**
 * 引入发票验真的错误码
 * VERINVOICE_MODULE_ID = "14" 
 */
const invoivceErrorCodeMap = {
    "46140001": {//场景说明：发票信息不一致
        text: '发票信息不一致',
        noticeType: NoticeType.TOAST,
        showCode: false
    },
    "46140002": {//场景说明：所查发票不存在
        text: '所查发票不存在',
        noticeType: NoticeType.TOAST,
        showCode: false
    },
    "46140003": {//场景说明：超过改张票当天查验次数
        text: '该发票今日查验次数已达5次上限，如有需要请在次日重新查询',
        noticeType: NoticeType.ALERT,
        showCode: false
    },
    "46140004": {//场景说明：已超过最大查验量
        text: '您的查验次数已用完，请联系客服充值',
        noticeType: NoticeType.CONFIRM,
        showCode: false,
        btnName: ['联系客服', '确定'],
        bisType: BisType.CONTACTSER,
        phoneNum: functional.BIS_CUSTOMER_SERVICE_PHONE,
        bisStyle: ['color:#478aee','color:#478aee']
    },
    "46140005": {//场景说明：查询发票不规范
        text: '不支持该发票类型或发票信息输入错误',
        noticeType: NoticeType.ALERT,
        showCode: false
    },
    "46140006": {//场景说明：查验异常
        text: '发票查验平台系统维护中，请稍后重试',
        noticeType: NoticeType.ALERT,
        showCode: false
    },
    "46140007": {//场景说明：日期当天的不能查验
        text: '该发票为今日开具，最快可在次日进行查验',
        noticeType: NoticeType.ALERT,
        showCode: false
    },
    "46140008": {//场景说明：超过五年的不能查验
        text: '该发票开具时间已超过五年，不再支持线上查验',
        noticeType: NoticeType.ALERT,
        showCode: false
    },
  
    /*-----------------发票 INVOICE_MODULE_ID = "05"-----------------*/
    "46050001":{
        text:'该发票抬头已存在',
        noticeType:NoticeType.TOAST
    },
    "46051001":{
        text:'离店时间超过30天，不再支持补开报销凭证',
        noticeType: NoticeType.TOAST //todo 暂用toast
        // noticeType:NoticeType.ALERT,
    },
    "46051002":{
        text:'航班起飞30天后，不再支持补开报销凭证',
        noticeType: NoticeType.TOAST //todo 暂用toast
        // noticeType:NoticeType.ALERT,
    },
    "46051003":{
        text:'下单时间超过30天，不再支持补开报销凭证',
        noticeType: NoticeType.TOAST //todo 暂用toast
        // noticeType:NoticeType.ALERT,
    },
    "46030017":{
        text:'重复创建支付订单',
        noticeType: NoticeType.TOAST //todo 暂用toast
        // noticeType:NoticeType.ALERT,
    }
  
}
/** ========================================errorCode end========================================== */
export default function () {
    Object.assign(ErrorCodeMap, invoivceErrorCodeMap);
    WhiteList.popup.push(...popupWhiteList);
    WhiteList.global.push(...globalWhiteList)
}