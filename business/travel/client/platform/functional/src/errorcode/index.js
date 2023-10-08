import externalUtils from '../utils/external';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = ['operationservice.','coupon.','couponScore.','train/getHotCity',
    'flight/getHotAirportCity','hotel/getHotCity'];//全局白名单
const NoticeType = externalUtils.NoticeType;
const BisType = externalUtils.BisType;

//自定义错误码
var errorMap = {
    //授权失败（token过期或验签失败），http状态码401
    "AUTHORIZE_FAILED": {
        text: '获取信息失败，请稍后重试',
        noticeType: NoticeType.TOAST,
        showCode: false
    },
    //无权限，http状态码403
    "NO_AUTHORIZATION": {
        text: '您没有权限',
        noticeType: NoticeType.TOAST,
        showCode: false
    },
    //接口异常(公共异常)
    "NETWORK_ERR": [
        {
            text: "获取信息失败，请稍后重试",
            noticeType: NoticeType.TOAST
        }
    ],

    /*-----------------公共 COMMON_MODULE_ID = "00"-----------------*/
    "46000001": {//场景说明：请求的公共参数传输错误
        text: '网络异常，请稍后重试',
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "46000002": {//场景说明：请求的公共参数传输错误
        text: '网络异常，请稍后重试',
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "46000003": {//场景说明：服务器内部错误
        text: '网络异常，请稍后重试',
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "46000004": {//场景说明：重复提交错误，如重复取消订单
        text: '请勿重复操作',
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "46000006": {//场景说明："确定支付" 时查无此订单
        text: '订单异常，付款失败，系统将自动取消该异常订单，请您重新下单',
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "46000007": {//场景说明：提交订单时，身份证校验出错，无法下单 //TODO  业务侧未处理,可能需要服务器提供错误信息
        text: '身份证校验失败，请核对',
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "46000008": {//与供应商交互时，由于供应商错误导致操作失败
        text: '由于系统异常，操作失败',
        noticeType: NoticeType.TOAST,
        showCode: true,
        useServerMsg: true,
        serverMsgName: 'resultMessage'
    },
    "46000009": {//场景说明：提交订单时，前后台金额不一致
        text: '抱歉，订单金额获取失败，请重新操作',
        noticeType: NoticeType.TOAST
    },
    "46000010": {//场景说明：页面数据显示/加载错误(API请求异常)
        text: '网络异常，请稍后重试',
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "46000011": {
        text: '该订单已取消，不可进行此项操作，如有疑问，请联系客服',
        noticeType: NoticeType.CONFIRM,
        btnName: ['联系客服', '确定'],
        bisType: BisType.CONTACTSER
    },
    "46000013": {//场景说明：订单超出开票有效期
        text: '订单超出开票有效期',
        noticeType: NoticeType.TOAST,
        showCode: false
    },

    /*=========================以下是兼容旧的TGC登陆模式的错误码====================================== */
    "46090011": {
        text: "用户授权失败",
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "46090012": {
        text: "用户授权失败",
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "46090013": {
        text: "用户授权过期,请重新登录客户端",
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "46090014": {
        text: "appID配置错误",
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "46090015": {
        text: "授权路径配置错误",
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "46090016": {
        text: "应用秘钥配置错误",
        noticeType: NoticeType.TOAST,
        showCode: true
    },

    /***********************安全链路的公共错误码开始*********************/
    "87001020": {
        text: '安全链路请求合法性-时间戳校验失败！',
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "87001010": {
        text: '安全链路请求报文解析失败！',
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "87001021": {
        text: '安全链路请求合法性-reqid校验失败！',
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "87001030": {
        text: '安全链路请求业务服务超时',
        noticeType: NoticeType.TOAST,
        showCode: true
    }
}

export default function(){
    Object.assign(externalUtils.ErrorCodeMap, errorMap);
    externalUtils.WhiteList.popup.push(...popupWhiteList);
    externalUtils.WhiteList.global.push(...globalWhiteList)
}