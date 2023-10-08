import base from "./base";
import injectErrorCode from '../errorcodehandler/bosspay.js';

class bosspayHandler extends base {
    constructor() {
        super();
        injectErrorCode()
    }

    listBossPay(param) {
        return this.sendApiRequest('/payment/v1/listBossPayConfig', param, "get");
    }

    getBossPay(param) {
        return this.sendApiRequest('/payment/v1/getBossPayConfig', param, "get");
    }

    updateBossPay(param) {
        return this.sendApiRequest('/payment/v1/updateBossPayConfig', param);
    }
}

export default new bosspayHandler();
