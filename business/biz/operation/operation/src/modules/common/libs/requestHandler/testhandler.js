import { BaseHandler } from "opcl";
import injectErrorCode from '../errorcodehandler/test.js';

class testlHandler extends BaseHandler {
    constructor() {
        super();
        injectErrorCode()
    }

    listChannel(param) {
        return this.sendApiRequest('/bizcloud/channel/v1/listChannel', param, "GET");
    }
}

export default new testlHandler();
