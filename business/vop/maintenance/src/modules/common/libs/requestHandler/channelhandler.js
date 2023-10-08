import base from "./base";
import injectErrorCode from '../errorcodehandler/channel.js';

class channelHandler extends base {
    constructor() {
        super();
        injectErrorCode()
    }

    listChannel(param) {
        return this.sendApiRequest('/channel/v1/list', param, "get");
    }

    addChannel(param) {
        return this.sendApiRequest('/channel/v1/add', param);
    }

    updateChannel(param) {
        return this.sendApiRequest('/channel/v1/updateConfig', param);
    }
}

export default new channelHandler();
