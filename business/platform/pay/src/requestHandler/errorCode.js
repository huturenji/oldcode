import store from '../store'
import Utils from '../utils/utils'
//自定义错误码
var errorMap = function (){
    const NoticeType = store.state.depends.snutils.NoticeType;
    const sinosdk = store.state.depends.sinosdk;
    return{
        //授权失败（token过期或验签失败），http状态码401
        "AUTHORIZE_FAILED": {
            text: '请求接口失败，请重新登录后再试',
            noticeType: NoticeType.TOAST,
            showCode: false,
        },
        //无权限，http状态码403
        "NO_AUTHORIZATION": {
            text: '您没有权限',
            noticeType: NoticeType.TOAST,
            showCode: false,
        },
        //接口异常(公共异常)
        "NETWORK_ERR": [
            {
                text: "接口请求错误，请稍后再试",
                noticeType: NoticeType.TOAST,
            }
        ],
    
        /***********************安全链路的公共错误码开始*********************/
        "87001020": {
            text: '安全链路请求合法性-时间戳校验失败！',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "87001010": {
            text: '安全链路请求报文解析失败！',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "87001021": {
            text: '安全链路请求合法性-reqid校验失败！',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "87001030": {
            text: '安全链路请求业务服务超时',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        /***********************安全链路的公共错误码 end*********************/
        
        "80103001":{
            text: '支付类型错误',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103002":{
            text: '支付总金额错误',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103003":{
            text: '订单不存在',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103004":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103005":{
            text: '订单已全额退款或未支付',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103006":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103007":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103008":{
            text: '系统异常，请联系客服'+store.state.config.serviceHotline,
            noticeType: NoticeType.CONFIRM,
            btnName: ['呼叫客服', '取消'],
            bisFunc: ()=>{store.state.depends.sinosdk.callNativeTel(store.state.config.serviceHotline)},
            showCode: true,
        },
        "80103009":{
            text: '存在无效订单，请核对订单状态再支付',
            noticeType: NoticeType.ALERT,
            btnName: '我知道了',
            showCode: true,
        },
        "80103010":{
            text: '支付方式不可用',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103011":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
    
        "80103100":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103101":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103102":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103103":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103104":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
    
        "80103200":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103201":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103202":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103203":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
    
        "80103300":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103301":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103302":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103303":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
    
        "80103400":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103401":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103402":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103403":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103404":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103405":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
    
        "80103600":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103601":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
    
        "80103700":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103701":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103702":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103998":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },
        "80103999":{
            text: '支付失败，请稍后重试',
            noticeType: NoticeType.TOAST,
            showCode: true,
        },

        "80103605":{
            text: '该订单还在审批中，如需使用其他支付方式支付，请先撤销该审批单。',
            showCode: false,
            noticeType: NoticeType.CUST_ACTION,
            func: data=>{
                Utils.showConfirm({
                    content: '该订单还在审批中，如需使用其他支付方式支付，请先撤销该审批单。',
                    confirmText: "去撤销",
                    cancelText: "取消",
                    onConfirm: function(){
                        let content = data[store.state.config.responseAdapter.messageKey];
                        content = content ? JSON.parse(content) : null;
                        sinosdk.cancelTransferPay(content).then(data=>{
                            if (!data || data.ret != 0) {
                                if (!!data && data.ret != -2) { //-2为用户手动取消支付，不提示
                                    Utils.showConfirm({
                                        content: '撤销失败<br/>原因：' + (data.errorMsg || '无'),
                                        showCancelButton: false
                                    })
                                }
                            }
                        }).catch(e=>{
                            console.warn(e);
                            Utils.showConfirm(
                                {
                                    content: '撤销失败',
                                    showCancelButton: false
                                }
                            )
                        })
                    },
                })
                return true;
            }
        },
        "80103606":{
            text: '该订单已在网银发起转账，不能使用其他支付方式支付。',
            noticeType: NoticeType.ALERT,
            btnName: '好的',
            showCode: false,
        },
        "80103608":{
            text: '该订单已有一笔使用公款转账的支付，请使用其他支付方式。',
            noticeType: NoticeType.ALERT,
            btnName: '好的',
            showCode: false,
        },
    }
}

export default function(){
    Object.assign(store.state.depends.snutils.ErrorCodeMap, errorMap());
    var popupWhiteList = [];//弹窗白名单
    var globalWhiteList = [];//全局白名单
    store.state.config.api.getPaymentInfo && globalWhiteList.push(store.state.config.api.getPaymentInfo.path);
    store.state.config.api.payNotify && globalWhiteList.push(store.state.config.api.payNotify.path);
    store.state.depends.snutils.WhiteList.popup.push(...popupWhiteList);
    store.state.depends.snutils.WhiteList.global.push(...globalWhiteList)
}