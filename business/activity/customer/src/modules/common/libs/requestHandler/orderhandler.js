import { BaseHandler } from "opcl";
import injectErrorCode from '../errorcodehandler/test.js';

class orderHandler extends BaseHandler {
    constructor() {
        super();
        injectErrorCode()
    }

    // getOrderList(param) {
    //     return this.sendApiRequest('/media/admin/v1/getOrderList', param, "post");
    // }

    // getOrderDeatil(param) {
    //     return this.sendApiRequest('/media/admin/v1/getOrderDeatil', param, "post");
    // }

    //获取订单详情
    getOrderDetail(param) {
        return this.sendApiRequest('/activitystudio/order/v1/detailOrder', param, "get");
    }

    //获取订单列表
    getOrderList(param) {
        return this.sendApiRequest('/activitystudio/order/v1/listOrder', param, "post");
    }
}

export default new orderHandler();