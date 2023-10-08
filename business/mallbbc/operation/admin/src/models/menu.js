import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import { getStorage } from '@/utils/utils';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
    return data
        .map(item => {
            if (!item.name || !item.path) {
                return null;
            }

            let locale = 'menu';
            if (parentName) {
                locale = `${parentName}.${item.name}`;
            } else {
                locale = `menu.${item.name}`;
            }

            const result = {
                ...item,
                name: formatMessage({ id: locale, defaultMessage: item.name }),
                locale,
                authority: item.authority || parentAuthority
            };
            if (item.routes) {
                const children = formatter(item.routes, item.authority, locale);
                // Reduce memory usage
                result.children = children;
            }
            delete result.routes;
            return result;
        })
        .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
        return {
            ...item,
      children: filterMenuData(item.children), // eslint-disable-line
        };
    }
    return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
    if (!menuData) {
        return [];
    }
    return menuData
        .filter(item => item.name && !item.hideInMenu)
        .map(item => check(item.authority, getSubMenu(item)))
        .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
    const routerMap = {};

    const flattenMenuData = data => {
        data.forEach(menuItem => {
            if (menuItem.children) {
                flattenMenuData(menuItem.children);
            }
            // Reduce memory usage
            routerMap[menuItem.path] = menuItem;
        });
    };
    flattenMenuData(menuData);
    return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
    namespace: 'menu',

    state: {
        menuData: [],
        breadcrumbNameMap: {}
    },

    effects: {
        * getMenuData({ payload }, { put }) {
            let { routes, authority } = payload;
            let routes_copy = JSON.parse(JSON.stringify(routes));
            //根据接口返回数据组装菜单
            var tmp_data = JSON.parse(getStorage('sld_menu_data'));
            if(tmp_data&&tmp_data.length!=undefined&&tmp_data.length){
                for (var i = 0; i < routes.length; i++) {
                    var item = tmp_data.filter(items => items.frontPath == routes[i].path);
                    if (item.length > 0) {
                        var item_child = item[0];
                        if (item_child.children != undefined && item_child.children.length > 0) {
                            for (var j = 0; j < routes[i]['routes'].length; j++) {
                                var child_item = item_child.children.filter(citem => citem.frontPath == routes[i]['routes'][j].path);
                                if (child_item.length == 0) {
                                    routes_copy[i]['routes'][j].name = '';
                                }
                            }
                        }
                    } else {
                        routes_copy[i].name = '';
                    }
                }
            }
            const menuData = filterMenuData(memoizeOneFormatter(routes_copy, authority));

            const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
            yield put({
                type: 'save',
                payload: { menuData, breadcrumbNameMap }
            });
        }
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                ...action.payload
            };
        }
    }
};
