import base from "./base";
import injectErrorCode from '../errorcodehandler/channel.js';

class pushHandler extends base {
    constructor() {
        super();
        injectErrorCode()
    }

    listPush(param) {
        return this.sendApiRequest('/notice/v1/getPushTemplateList', param);
    }

    deletePush(param) {
        return this.sendApiRequest('/notice/v1/deletePushTemplate', param);
    }

    listChannel(param) {
        return this.sendApiRequest('/channel/v1/list', param, "get");
    }

    isPushExist(param) {
        return this.sendApiRequest('/notice/v1/isPushTemplateExist', param);
    }

    addPush(param) {
        return this.sendApiRequest('/notice/v1/addPushTemplate', param);
    }
}

export default new pushHandler();
