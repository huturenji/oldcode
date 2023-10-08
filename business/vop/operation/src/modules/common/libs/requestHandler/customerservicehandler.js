import base from "./base";
// import Qs from "qs";
import injectErrorCode from '../errorcodehandler/channel.js';

class customerservicehandler extends base {
    constructor() {
        super();
        injectErrorCode()
    }

    getSupplier(param) {
        return this.sendApiRequest('/supplier/v1/get', param, 'GET');
    }
  
    getServiceStatistics(param) {
        return this.sendApiRequest(`/postsale/v1/countTask`, param);
    }

    listServiceRequest(param) {
        return this.sendApiRequest('/postsale/v1/getTaskList', param);
    }

    updateTaskState(param) {
        return this.sendApiRequest('/postsale/v1/updateTaskState', param);
    }

    getPostSaleDetail(param) {
        return this.sendApiRequest('/postsale/v1/getPostSaleDetail', param);//获取售后单详情
    }

    refund(param) {
        return this.sendApiRequest('/postsale/v1/confirmRefund', param);//退款接口
    }

    submitReturnExpressInfo(param) {
        return this.sendApiRequest('/postsale/v1/submitReturnExpressInfo', param);// 填写返件运单信息
    }

    submitSendBackAddress(param) {
        return this.sendApiRequest('/postsale/v1/submitSendBackAddress', param);// 填写寄回地址
    }

    confirmOrCancelApplyPostSale(param) {
        return this.sendApiRequest('/postsale/v1/confirmOrCancelApplyPostSale', param);// 更新任务状态
    }

    getExpressList(param) {
        return this.sendApiRequest('/postsale/v1/getExpressList', param);// 获取快递公司列表
    }
}

export default new customerservicehandler();
