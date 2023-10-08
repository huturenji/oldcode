/**
 * 发票接口和方法处理工厂
 * @author zhangbin
 */
//引入公共的配置文件
// import functional from 'platform/functional';
let { functional } = SnTravel;
let {ErrorCodeMap, NoticeType} = functional;
/**
 * 引入发票验真的错误码
 * VERINVOICE_MODULE_ID = "14" 
 */
const InvoivceErrorCodeMap = {
    /*-----------------发票 INVOICE_MODULE_ID = "05"-----------------*/
    "46050001":{
        text: '该发票抬头已存在',
        noticeType: NoticeType.TOAST
    }
}
functional.WhiteList.global.push('/customer-profile/v1/checkIfTitleExists');
Object.assign(ErrorCodeMap, InvoivceErrorCodeMap);
/** ========================================errorCode end========================================== */

class invoiceCompHandler extends functional.baseRequestHandler{
    constructor(){
        super();
        this.ENTERPRISE_INVOICE_APPID = '268435731'; //伴正事企业发票抬头小应用的小应用id，用来做导入企业发票抬头功能
    }

    /**
     * 获取发票抬头信息列表
     */
    getInvoiceInfo(param){
        return this.request('/customer-profile/v1/listInvoiceTitle', param);
    }
    

    /**
     * 批量新增发票抬头信息
     */
    addInvoiceInfos(param){
        return this.request('/customer-profile/v1/addInvoiceTitles', param);
    }
    
    /**
     * 检查发票抬头是否存在
     */
    checkTitleExists(param){
        return this.request('/customer-profile/v1/checkIfTitleExists', param);
    } 

    /**
     * 删除发票抬头
     */
    deleteInvoiceInfo(param){
        return this.request('/customer-profile/v1/deleteInvoiceTitle', param);
    }


    /**
     * 修改发票抬头信息
     */
    modifyInvoiceInfo(param){
        return this.request('/customer-profile/v1/updateInvoiceTitle', param);
    }


    /**
     * 获取渠道管理配置的导入企业发票抬头的地址
     */
    getChannelInfo(param){
        return this.request('/channel/v1/getChannel', param, {method: 'get'});
    }

}

Object.assign(invoiceCompHandler.prototype, functional);
export default new invoiceCompHandler();


