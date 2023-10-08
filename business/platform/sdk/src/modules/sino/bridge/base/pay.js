import * as bridge from "sino/bridge/lib/handler";
export default {

    /**
     * 支付宝sdk支付
     * @param {*} data 
     * @returns 
     */
    aliPay(data={}){
        return bridge.callHandler('CallALiPayFunction', data);
    },

    /**
     * 厦门国际支付
     * @param {*} data 
     * @returns 
     */
    xmgjPay(data={}){
        return bridge.callHandler('QuickPaymentOrderPayFunction', data);
    },

    /**
     * 银联支付
     * @param {*} data 
     * @returns 
     */
    unionPay(data={}){
        return bridge.callHandler('GetPayAccountFunction', data);
    },

    /**
     * 老板付
     * @param {*} data 
     * @returns 
     */
    bossPay(data={}){
        return bridge.callHandler('QuickPaymentPayOrderFunction', data);
    },

    /**
     * 稠州银行个人付
     * @param {*} data 
     * @returns 
     */
    chouzhouPay(data={}){
        return bridge.callHandler('PersonalPaymentFunction', data);
    },
    /**
     * 华兴银行个人付
     * @param {*} data 
     * @returns 
     */
    huaxingPersonalPay(data={}){
        return bridge.callHandler('HXPersonalPaymentFunction', data);
    },

    /**
     * 取消老板付（针对公款转账）
     * @param {*} data 
     * @returns 
     */
    cancelTransferPay(data={}){
        return bridge.callHandler('CancelPublicTransferFunction', data);
    },

    /**
     * 公款转账
     * @param {*} data 
     * @returns 
     */
    transferPay(data={}){
        return bridge.callHandler('PublicTransferFunction', data);
    },

    /**
     * 公款闪付
     * @param {*} data 
     * @returns 
     */
    quickPay(data={}){
        return bridge.callHandler('PublicQuickPayFunction', data);
    },

    /**
     * 免息付（白条付）
     * @param {*} data 
     * @returns 
     */
    IFCPay(data={}){
        return bridge.callHandler('InterestFreeCreditFunction', data);
    },
}