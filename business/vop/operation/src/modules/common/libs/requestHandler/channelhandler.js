import base from "./base";
import injectErrorCode from '../errorcodehandler/channel.js';

class channelHandler extends base {
    constructor() {
        super();
        injectErrorCode()
    }

    listChannel(param) {
        return this.sendApiRequest('/channel/v1/list', param, "GET");
    }

    getChannel(param) {
        return this.sendApiRequest('/channel/v1/get', param, 'GET');
    }

    getSystemLogs(param) {
        return this.sendApiRequest('/channel/v1/listOperationLog', param, 'GET');
    }

    // listOperationLog(param) {
    //   return this.sendApiRequest('/channel/v1/listOperationLog', param, 'GET');
    // }

    setState(param) {
        return this.sendApiRequest('/channel/v1/setState', param);
    }

    getAvailableMethods(param) {
        return this.sendApiRequest('/payment/v1/getAvailableMethods', param, 'GET');
    }

    update(param) {
        return this.sendApiRequest('/channel/v1/update', param);
    }

    add(param) {
        return this.sendApiRequest('/channel/v1/add', param);
    }

    /**
   * 获取渠道信息列表
   */
    getOptionalChannel(param) {
        return this.sendApiRequest('/channel/v1/listOptionalChannel', param);
    }
}

export default new channelHandler();
