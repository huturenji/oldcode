import base from "./base";
import injectErrorCode from '../errorcodehandler/channel.js';

class supplierhandler extends base {
    constructor() {
        super();
        injectErrorCode()
    }

    listSupplier(param) {
        return this.sendApiRequest('/supplieraccess/v1/supplier/list', param, 'GET');
    }

    getSupplier(param) {
        return this.sendApiRequest('/supplieraccess/v1/supplier/get', param, 'GET');
    }

    setState(param) {
        return this.sendApiRequest('/supplieraccess/v1/supplier/setState', param);
    }

    updateSupplier(param) {
        return this.sendApiRequest('/supplieraccess/v1/supplier/update', param);
    }
}

export default new supplierhandler();
