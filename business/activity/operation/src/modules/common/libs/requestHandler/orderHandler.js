import { BaseHandler } from "opcl";
import injectErrorCode from '../errorcodehandler/test.js';

class orderHandler extends BaseHandler {
    constructor() {
        super();
        injectErrorCode()
    }

    getOrderList(param) {
        return this.sendApiRequest('/activitystudio/order/v1/listOrder', param, "POST");
    }

    getOrderDeatil(param) {
        return this.sendApiRequest('/activitystudio/order/v1/detailOrder', param, "GET");
    }

    checkSuccess(param) {
        return this.sendApiRequest('/activitystudio/order/v1/approveOrder', param, "POST");
    }
}

export default new orderHandler();
