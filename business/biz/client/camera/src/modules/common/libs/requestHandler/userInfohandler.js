import { BaseHandler } from "opcl";
import injectErrorCode from '../errorcodehandler/test.js';

class userInfoHandler extends BaseHandler {
    constructor() {
        super();
        injectErrorCode()
    }


    //修改密码
    updatePassword(param) {
        return this.sendApiRequest('/activitystudio/user/v1/user/updatePassword', param, "post");
    }
}

export default new userInfoHandler();