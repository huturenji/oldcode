/**
 * 发票接口和方法处理工厂
 * @author zhangbin
 */

//引入公共的配置文件
// import functional from 'platform/functional';
import errorCodeHandler from './errorCodeHandler.js';
let { functional } = SnTravel;
//引入发票模块的错误码
const ORIGIN = functional.HTTP_CONT.ORIGIN;
class invoiceHandler extends functional.baseRequestHandler{
    constructor(){
        super();
        errorCodeHandler();
    }           
    
    /***************** 发票验证的接口开始 *****************/
    /**
     * 发票验真接口
     */
    verInvoice(param){
        return this.request('/verify-invoice/v1/verifyInvoice', param, {noZipFlag: true});
    }
    
    /**
     * 查验结果
     */
    verInvoiceResult(param){
        return this.request('/verify-invoice/v1/verInvoiceResult', param, {noZipFlag: true, method: 'get' });
    }

    /**
    * 查验记录列表
    */
    verInvoiceList(param){
        return this.request('/verify-invoice/v1/verInvoiceList', param, {noZipFlag: true});
    }  
    /***************** 发票验证的接口结束 *****************/

 
    /**
    * 商务用车补开报销凭证
    */
    carCreateBatchInvoiceTitle(param){
        return this.request('/bp/invoice/carCreateBatchInvoiceTitle', param);
    }

    /**
     * 火车票补开报销凭证
     */
    trainCreateBatchInvoiceTitle(param){
        return this.request('/train/v1/trainCreateBatchInvoiceTitle', param);
    }

    /**
     * 酒店补开报销凭证
     */
    hotelCreateBatchInvoiceTitle(param){
        return this.request('/hotel/v1/hotelCreateBatchInvoiceTitle', param);
    }
    
    /**
     * 机票补开报销凭证
     */
    airCreateBatchInvoiceTitle(param){
        return this.request('/flight/v1/airCreateBatchInvoiceTitle', param);
    }

    /**
     * 查询默认快递费
     */
    getExpressFee(param){
        return this.request('/express/v1/getExpressFee', param);
    }

    /**
     * 补开后下快递单
     */
    createExpressOrder(param){
        return this.request('/express/v1/patchSubmit', param);
    }

    /**
     * 获取报销凭证订单列表
     */
    getOrderWithoutInvoice(param){
        return this.request('/order/v1/list', param);
    }

    /**
     * 删除发票记录
     */
    deleteInvoiceHistory(param){
        return this.request('/invoice/v1/deleteInvoiceHistory', param);
    }

    /**
     * 获取发票列表
     */
    getInvoiceHistories(param){
        return this.request('/invoice/v1/getInvoiceHistories', param);
    }

    /**
     *从订单详情跳转发票详情
     */
    getInvoiceDetailByOrderNo(param){
        return this.request('/invoice/v1/getInvoiceDetailByOrderNo', param);
    }

    /**
     * 公共方法，打开新窗口前处理路径
     */
    openPageLib(url){
        let newUrl = '';
        let preUrl = null;
        let appName = 'invoice';
        for (const key in functional.OPENPAGE_MAP) {
            if (url.indexOf(key) > -1) {
                preUrl = functional.OPENPAGE_MAP[key];
                break;
            } else {
                url = url.replace(appName+'/','');
            }
        }
        newUrl = preUrl ? (ORIGIN + preUrl + url) : url;
        functional.openPage(newUrl);
    }

    /**
     * 加载js
     * @id 加载js的id属性 swpPay
     * @type 代表加载sets.env.js 里面的js类型 如 pay invoice address passenger等等
     * @onload js加载完执行的回调
     */
    loadJs(id, type, onload){
        const src = ORIGIN + functional.APP_URL_MAP.swplib.path + functional.APP_URL_MAP.swplib.child[type].prefix + 
                    (functional.APP_URL_MAP.swplib.child[type].version || '') + functional.APP_URL_MAP.swplib.child[type].entry;
        functional.loadScript({
            id: id,
            src: src,
            onload: onload
        })
    }
}

Object.assign(invoiceHandler.prototype, functional);
export default new invoiceHandler();
