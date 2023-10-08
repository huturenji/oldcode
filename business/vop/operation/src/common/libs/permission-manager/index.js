import apibase from 'libs/apibase.js';
/**
 * 权限管理基类，封装的功能：请求用户权限 init，返回用户有权限的菜单 getAuthedMenus，
 * 返回全部菜单 getAllMenu，是否有权限hasAuth
 * 
 * 子类通过复写hasAuth和getMenuFromAuth方法 来定制业务
 */
class PermissionBase {
    /**
    * 初始化需要注入全量菜单和权限接口的错误码
    * @param {*} initData 
    */
    constructor(initData) {
        this.permissions = []
        this.setMenuList(initData.menuList || [])
        //创建api对象
        this.apiClient = new apibase(true)
        this.setPermissionErrorCode(initData.errorcode || {})
        this.permissionsUrl = initData.url;
    }

    /**
     * 设置菜单数据源
     * @param {*} menus 
     */
    setMenuList(menus) {
        this.menuList = menus
    }

    /**
     * 设置权限接口的错误码
     * @param {*} errorcode 
     */
    setPermissionErrorCode(errorcode) {
        this.apiClient.setErrorCodeData(errorcode);
    }

    /**
     * 初始化，调用接口刷新权限数据
     * @param {*} option 
     */
    async init(option) {
        this.permissions = await this.getPermissions(option.userId);
    }

    /**
     * 获取有权限的菜单数据
     * @param {*} option 
     */
    async getAuthedMenus(option) {
        if (!this.permissions) {
            this.permissions = await this.getPermissions(option.userId);
        }        
        return this.getMenuFromAuth(this.permissions)
    }

    /**
     * 获取用户权限
     * @param {*} userId 
     */
    getPermissions(userId) {
        const that = this
        return new Promise(resolve => {
            that.apiClient.apiCallHandler(that.permissionsUrl, { userId: userId }, { method: "get" })
                .then((res) => {
                    if (
                        res.resultCode == 0 &&
                        res.result.permissionIds &&
                        res.result.permissionIds.length > 0
                    ) {
                        resolve(res.result.permissionIds)
                    }
                    resolve([])
                }).catch((error) => {
                    console.log(error);
                    resolve([])
                });
        })
    }

    /**
     * 获取所有菜单
     */
    getAllMenu() {
        return this.menuList;
    }

    /**
     * 判断菜单是否有权限
     * @param {*} id 
     */
    hasAuth(id) {
        return this.permissions.includes(id)
    }

    /**
     * 通过权限获取菜单项，
     */
    getMenuFromAuth(authData) {
        let fullAuth = []; //用户所有的权限
        for (let i = 0; i < authData.length; i++) {
            fullAuth = fullAuth.concat(authData[i]);
        }
        //从配置文件获取全量菜单
        let menuListFull = Object.create(this.menuList).menu;
        return menuListFull;
    }
}

export default PermissionBase;