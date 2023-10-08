import request from '@/utils/request';

export default {
    /**
     * 获取发票抬头的列表
     * @param {*} param 
    */
    getInvoiceList(param = {}){
        return request({
            url: '/v3/member/front/customer-profile/listInvoiceTitle',
            method: 'POST',
            data: param,
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 新增发票抬头 【批量接口】
     * @param {*} param 
    */
    addInvoices(param = {}){
        return request({
            url: '/v3/member/front/customer-profile/addInvoiceTitles',
            method: 'POST',
            data: param,
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 更新发票抬头
     * @param {*} param 
    */
    updateInvoice(param = {}){
        return request({
            url: '/v3/member/front/customer-profile/updateInvoiceTitle',
            method: 'POST',
            data: param,
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 删除发票抬头
     * @param {*} param 
    */
    deleteInvoice(param = {}){
        return request({
            url: '/v3/member/front/customer-profile/deleteInvoiceTitle',
            method: 'POST',
            data: param,
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 检查发票抬头是否存在
     * @param {*} param 
    */
    checkTitleExists(param = {}){
        return request({
            url: '/v3/member/front/customer-profile/checkIfTitleExists',
            method: 'POST',
            data: param,
            header: {
                "Content-Type": "application/json"
            }
        })
    },
    /**
     * 获取收票人信息
     * @param {*} param 
    */
    getInvoiceReceiver(param = {}){
        return request({
            url: '/v3/member/front/customer-profile/getInvoiceReceiver',
            method: 'POST',
            data: param,
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 新增收票人信息
     * @param {*} param 
    */
    addInvoiceReceiver(param = {}){
        return request({
            url: '/v3/member/front/customer-profile/addInvoiceReceiver',
            method: 'POST',
            data: param,
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 更新收票人信息
     * @param {*} param 
    */
    updateInvoiceReceiver(param = {}){
        return request({
            url: '/v3/member/front/customer-profile/updateInvoiceReceiver',
            method: 'POST',
            data: param,
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 补开发票
     * @param {*} param 
    */
    addInvoice(param = {}){
        return request({
            url: '/v3/business/front/orderOperate/addInvoice',
            method: 'POST',
            data: param,
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 换开发票
     * @param {*} param 
    */
    reInvoice(param = {}){
        return request({
            url: '/v3/business/front/orderOperate/reInvoice',
            method: 'POST',
            data: param,
            header: {
                "Content-Type": "application/json"
            }
        })
    }

};