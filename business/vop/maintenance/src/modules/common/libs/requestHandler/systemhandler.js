import base from "./base";
import injectErrorCode from '../errorcodehandler/systemauth';

class systemHandler extends base {
    constructor() {
        super();
        injectErrorCode()
    }

    /**
     * 查询用户(运营接口)
     */
    searchUser(param) {
        return this.sendApiRequest('/zsa-adapter/v1/searchUser', param);
    }

    /**
  * 查询用户详情(运营接口)
  */
    getUser(param) {
        return this.sendApiRequest('/zsa-adapter/v1/getUser', param, "get");
    }

    /**
   * 新增用户(运营接口)
   */
    addUser(param) {
        return this.sendApiRequest('/zsa-adapter/v1/addUser', param);
    }

    /**
   * 删除用户(运营接口)
   */
    deleteUser(param) {
        return this.sendApiRequest('/zsa-adapter/v1/deleteUser', param, "get");
    }

    /**
   * 修改用户(运营接口)
   */
    updateUser(param) {
        return this.sendApiRequest('/zsa-adapter/v1/updateUser', param);
    }

    /**
   * 查询企业用户(运营接口)
   */
    searchCompanyUser(param) {
        return this.sendApiRequest('/zsa-adapter/v1/searchCompanyUser', param);
    }

    /**
   * 查询角色(运营接口)
   */
    listRole(param) {
        return this.sendApiRequest('/zsa-adapter/v1/listRole', param, "get");
    }

    /**
   * 查询角色详情(运营接口)
   */
    getRoleDetail(param) {
        return this.sendApiRequest('/zsa-adapter/v1/getRoleDetail', param, "get");
    }

    /**
   * 修改角色详情(运营接口)
   */
    updateRole(param) {
        return this.sendApiRequest('/zsa-adapter/v1/updateRole', param);
    }

    /**
   * 新增角色(运营接口)
   */
    addRole(param) {
        return this.sendApiRequest('/zsa-adapter/v1/addRole', param);
    }

    /**
   * 删除角色(运营接口)
   */
    deleteRole(param) {
        return this.sendApiRequest('/zsa-adapter/v1/deleteRole', param, "get");
    }

    /**
   * 查询权限(运营接口)
   */
    listPermission(param) {
        return this.sendApiRequest('/zsa-adapter/v1/listPermission', param, "get");
    }

    /**
   * 编辑权限(运营接口)
   */
    updatePermission(param) {
        return this.sendApiRequest('/zsa-adapter/v1/initPermission', param);
    }
  
    /**
   * 查询用户权限(运营接口)
   */
    getUserPermissionDetail(param) {
        return this.sendApiRequest('/zsa-adapter/v1/getUserPermissionDetail', param, "get");
    }
}

export default new systemHandler();
