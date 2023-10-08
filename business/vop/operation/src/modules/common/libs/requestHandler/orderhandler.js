import base from "./base";
import injectErrorCode from '../errorcodehandler/channel.js';

class orderHandler extends base {
    constructor() {
        super();
        injectErrorCode()
    }

    listByOperation(param) {
        return this.sendApiRequest('/order/v1/pageOrders', param);
    }

    getDetailByOperation(param) {
        return this.sendApiRequest('/order/v1/getOrderDetail', param,'GET');
    }

    getSubDetailByOperation(param) {
        return this.sendApiRequest('/order/v1/getSubOrderDetail', param,'GET');
    }

    // listByOperation(param) {
    //   return this.sendApiRequest('/order/v1/listByOperation', param);
    // }

    listByOperation1(param) {
        return this.sendApiRequest('/supplier-order/v1/listByOperation', param);
    }

    exportOrder(param) {
        return this.sendApiRequest('/order/v1/exportOrder', param);
    }

    exportOrder1(param) {
        return this.sendApiRequest('/supplier-order/v1/exportOrder', param);
    }

    // getDetailByOperation(param) {
    //   return this.sendApiRequest('/order/v1/getDetailByOperation', param);
    // }

    getDetailByOperation1(param) {
        return this.sendApiRequest('/supplier-order/v1/getDetailByOperation', param);
    }

    updateByOperation(param) {
        return this.sendApiRequest('/order/v1/updateByOperation', param);
    }

    updateByOperation1(param) {
        return this.sendApiRequest('/supplier-order/v1/updateByOperation', param);
    }

    logAction(param) {
        return this.sendApiRequest('/order/v1/logAction', param);
    }

    logAction1(param) {
        return this.sendApiRequest('/supplier-order/v1/logAction', param);
    }

    listSupplier(param) {
        return this.sendApiRequest('/supplieraccess/v1/supplier/list', param, 'GET');
    }

    listChannel(param) {
        return this.sendApiRequest('/channel/v1/channelList', param, 'GET');
    }

    exportSubOrderInfo(param) {
        return this.sendApiRequest('/order/v1/exportSubOrderInfo', param);
    }
}

export default new orderHandler();
