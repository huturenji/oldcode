import base from 'libs/permission-manager'
import utils from 'bislibs/utils'
import menujson from './menu.json'
//权限接口的错误码
function getErrorCode() {
    return {
        "85105001": {
            text: "角色不存在",
            noticeType: utils.NoticeType.TOAST,
        },
        "85105002": {
            text: "角色名已存在",
            noticeType: utils.NoticeType.TOAST,
        },
        "85105003": {
            text: "用户不存在",
            noticeType: utils.NoticeType.TOAST,
        },
        "85105004": {
            text: "权限为空",
            noticeType: utils.NoticeType.TOAST,
        },
        "85105005": {
            text: "非法角色名称",
            noticeType: utils.NoticeType.TOAST,
        },
        "85105006": {
            text: "认证授权服务操作失败",
            noticeType: utils.NoticeType.TOAST,
        },
        "85105007": {
            text: "IDP不存在",
            noticeType: utils.NoticeType.TOAST,
        },
        "85105008": {
            text: "Keycloak用户信息异常",
            noticeType: utils.NoticeType.TOAST,
        }
    }
}
class PermissionManager extends base {
    constructor() {
        //子类提供菜单数据源和错误码
        super({
            url: "/travel" + "/zsa-adapter/v1/getUserPermissionDetail",
            menuList: menujson,
            errorcode: getErrorCode()
        })
    }
    /**
     * 复写接口、子类实现
     * 通过权限获取菜单项
     */
     getMenuFromAuth(userPermissionIds) {
        let menuListFull = Object.create(this.getAllMenu()).menu;
        return this.filterMenu4Auth(menuListFull)
    }
    /**
     * 过滤左侧菜单
     */
    filterMenu4Auth(menuList) {
        let that = this;
        let userPermissionIds = this.permissions

        let res = [];
        let len = menuList.length;
        for (let i = 0; i < len; i++) {
            let menuItem = {};
            let item = menuList[i];
            if (that.getArrHaveItem(item.authCodeList, userPermissionIds)) {
                menuItem = item;
            }
            if (!!item.children) {
                menuItem.children =
                    that.filterMenu4Auth(item.children) || [];
            }
            !!menuItem.name ? res.push(menuItem) : "";
        }
        return res;
    }
    /**
     * 判断菜单是否有权限
     * @param {*} ids 
     */
     hasEventAuth(ids) {
        return this.getArrHaveItem(ids, this.permissions)
    }
    /**
     * 维数组是否包含另一个数组总的元素
     * @param list 元数据数组
     * @param items 另一个数组
     */
    getArrHaveItem(list, items) {
        var that = this;
        var isInArr = false;
        var len = list.length;
        for (var i = 0; i < len; i++) {
            if (that.arrhaveitem(list[i], items)) {
                isInArr = true;
                break;
            }
        }
        return isInArr;
    }
    /**
     * 维数组是否包含元素
     */
    arrhaveitem(item, arr, key) {
        var isInArr = false;
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (!!key ? arr[i][key] == item : arr[i] == item) {
                isInArr = true;
                break;
            }
        }
        return isInArr;
    }
}

export default new PermissionManager();