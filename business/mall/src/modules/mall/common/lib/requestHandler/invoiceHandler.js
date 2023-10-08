// 发票类的接口  
import base from './base';
import extendUtils from '../utils';
import injectErrorCode from '../errorCodeHandler/invoice';
class InvoiceHandler extends base{
    constructor(){
        super();   
        injectErrorCode()
    }
    
    /**
     * 查询发票详情（订单服务的接口  暂时放在这）
     */
    async getInvoiceDetails(param){
        return this.request('/order/v1/getInvoiceInfo', param, {noSSOFlag:true});
    }

    /**
     * 发票重开
     */
    async counteractInvoice(param){
        return this.request('/order/v1/reIssueInvoice', param, {noSSOFlag:true});
    }

    /**
     * 获取发票助手列表
     */
    getInvoiceList(param){
        return this.request('/customer-profile/v1/listInvoiceTitle', param);
    }

    /**
     * 批量新增发票抬头(注意该接口新增时是批量的)
     */
    addInvoices(param){
        return this.request('/customer-profile/v1/addInvoiceTitles', param);
    }

    /**
     * 修改发票抬头
     */
    updateInvoice(param){
        return this.request('/customer-profile/v1/updateInvoiceTitle', param);
    }

    /**
     * 删除发票抬头
     */
    deleteInvoice(param){
        return this.request('/customer-profile/v1/deleteInvoiceTitle', param);
    }

    /**
     * 添加发票收票人信息
     */
    addInvoiceReceiver(param){
        return this.request('/customer-profile/v1/addInvoiceReceiver', param);
    }

    /**
     * 更新发票收票人信息
     */
    updateInvoiceReceiver(param){
        return this.request('/customer-profile/v1/updateInvoiceReceiver', param);
    }

    /**
     * 获取发票收票人手机和邮箱和发票内容
     */
    getInvoiceReceiverInfo(param){
        return this.request('/customer-profile/v1/getInvoiceReceiver', param);
    }
    

    /**
     * 获取运维平台配置的伴正事企业发票抬头地址url 查询渠道详情（运营管理平台）
     */
    getImportInvoiceUrl(param){
        return this.request('/channel/v1/getAccessConfig', param, {method: 'get'});
    } 

    /**
     * 检查发票抬头是否存在
     */
    checkTitleExists(param){
        return this.request('/customer-profile/v1/checkIfTitleExists', param);
    } 
}

export default new InvoiceHandler();