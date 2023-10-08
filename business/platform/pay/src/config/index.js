export default {
    origin: '', //域名
    api: {//接口路径
        payTypeList: {path: '/channel/v1/getPaymentMethods', method: 'GET'},//支付列表
        createPay: {path: '/payment/v1/makePayment'},//创建预付单
        getPaymentInfo: {path: '/payment/v1/getPaymentInfo'},//获取支付结果状态
        payNotify: null,//通知老板付服务回传支付状态  默认不配置
    },
    commonParams: {},//请求的公共参数
    bslConfig: null,//bsl配置
    checkNetwork: false,//是否启用网络检测
    serviceHotline: '400-855-6588',//客服电话
    timeout: 10*1000,//超时时间，单位：秒
    token: null, //提供token [String | Function]
    responseAdapter: {
        dataKey: 'result',
        codeKey: 'resultCode',
        messageKey: 'resultMessage',
        isSuccess(response){
            return response.resultCode == 0;
        }
    },
    zIndex: 999,//页面元素基准z-index
    redirectUri: '',//h5支付后跳回到首页。该url不可带hash和参数
    validPayType: true,//是否需要校验支付方式的合法性
    runEnv: 'bizmate',//运行环境，bizmate需要sinosdk，browser不需要sinosdk
    primaryColor: '#262DD9',//主要颜色
    cutdown: true,//是否开启倒计时，默认开启
    appExtraData: null,//app支付时，需要提供的额外业务参数。具体内容由业务侧按app的api来定
    pcWidth: '616',//单位px
    weixinMiniParam: {},//打开微信小程序需要的参数
}