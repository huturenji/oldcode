import { BaseHandler } from "opcl";
import injectErrorCode from '../errorcodehandler/test.js';

class testlHandler extends BaseHandler {
    constructor() {
        super();
        injectErrorCode()
    }
    // 获取客户列表
    getCustomerList(param) {
        return this.sendApiRequest('/activitystudio/user/v1/admin/listUser', param, "POST");
    }
    // 新增账号
    addCustomerInfo(param) {
        return this.sendApiRequest('/activitystudio/user/v1/admin/register', param, "POST");
    }
    // 启用/冻结客户
    editCustomerInfo(param) {
        return this.sendApiRequest('/activitystudio/user/v1/admin/isEnable', param, "POST");
    }
    // 审核用户
    auditCustomerInfo(param) {
        return this.sendApiRequest('/activitystudio/user/v1/admin/audit', param, "POST");
    }
    // 获取详情
    getCustomerDetail(param) {
        return this.sendApiRequest('/activitystudio/user/v1/admin/getUser', param, "GET");
    }
    // 重置密码
    resetCustomerPassword(param) {
        return this.sendApiRequest('/activitystudio/user/v1/admin/resetPassword', param, "POST");
    }
}

export default new testlHandler();
