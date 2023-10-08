import { BaseHandler } from "opcl";
import injectErrorCode from '../errorcodehandler/test.js';

class testlHandler extends BaseHandler {
    constructor() {
        super();
        injectErrorCode()
    }
    getPromotionList(param) {
        return this.sendApiRequest('/activitystudio/lottery/v1/platformActivityList', param, "POST");
    }
}

export default new testlHandler();
