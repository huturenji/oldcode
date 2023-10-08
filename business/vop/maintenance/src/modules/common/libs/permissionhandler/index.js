import base from 'libs/permission-manager'
import utils from 'bislibs/utils'
import menujson from './menu.json'
//权限接口的错误码
function getErrorCode() {
    return {
        "85105001": {
            text: "角色不存在",
            noticeType: utils.NoticeType.TOAST
        },
        "85105002": {
            text: "角色名已存在",
            noticeType: utils.NoticeType.TOAST
        }
    }
}
class PermissionManager extends base {
    constructor() {
        //子类提供菜单数据源和错误码
        super({
            url: "/mallvop" + "/zsa-adapter/v1/getUserPermissionDetail",
            menuList: menujson,
            errorcode: getErrorCode()
        })
    }

    /**
     * 复写接口、子类实现
     * 通过权限获取菜单项
     */
    getMenuFromAuth(authData) {
        const that = this;

        let fullAuth = []; //用户所有的权限
        for (let i = 0; i < authData.length; i++) {
            fullAuth = fullAuth.concat(authData[i]);
        }

        //从配置文件获取全量菜单
        let menuListFull = Object.create(this.menuList).menu;
        //如果有root权限1_-1_root，全部菜单显示。否则，要进行权限匹配
        if (fullAuth.indexOf("1_-1_root") == -1) {
            //目录列表 权限码不存在的 都删除掉
            for (let i = 0; i < menuListFull.length; i++) {
                if (fullAuth.indexOf(menuListFull[i].authCode) == -1) {
                    menuListFull.splice(i, 1);
                    i--;
                } //子菜单有权限，父菜单没有的情况，删除掉
                else if (
                    fullAuth.indexOf(menuListFull[i].authCode) != -1 &&
                    !!menuListFull[i].parentType &&
                    that.parentNoAuth(
                        menuListFull[i].parentType,
                        menuListFull,
                        fullAuth
                    )
                ) {
                    menuListFull.splice(i, 1);
                    i--;
                }
            }
        }
        menuListFull = menuListFull.map(menu => {
            try {
                menu.icon = require(`./icon/${menu.iconName}`)
            } catch (e) {
                console.error(e)
            }
            return menu
        })
        return menuListFull;
    }

    /**
     * 父菜单没有权限
     */
    parentNoAuth(PType, menuListFull, fullAuth) {
        let result = true;
        for (let i = 0; i < menuListFull.length; i++) {
            //找到了父菜单，并且有权限，
            if (
                menuListFull[i].type == PType &&
                fullAuth.indexOf(menuListFull[i].authCode) != -1
            ) {
                if (!!menuListFull[i].parentType) {
                    //父菜单还是子菜单，继续判断上一级
                    result = that.parentNoAuth(
                        menuListFull[i].parentType,
                        menuListFull,
                        fullAuth
                    );
                } else {
                    //父菜单是一级目录，那这个子菜单是有权限的
                    result = false;
                    break;
                }
            }
        }
        return result;
    }

    /**
     * 判断菜单是否有权限
     * @param {*} ids 
     */
    hasAuth(ids) {
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