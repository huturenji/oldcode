import { BaseHandler } from "opcl";
import injectErrorCode from '../errorcodehandler/goods.js';

class goodsHandler extends BaseHandler {
    constructor() {
        super();
        injectErrorCode()
    }

    listProductPool(param) {
        return this.sendApiRequest('/activitystudio/product/v1/listProductPool', param, "get");
    }

    listProduct(param) {
        return this.sendApiRequest('/activitystudio/product/v1/listProduct', param, "get");
    }

    bindProductPool(param) {
        return this.sendApiRequest('/activitystudio/product/v1/bindProductPool', param, "post");
    }
}

export default new goodsHandler();