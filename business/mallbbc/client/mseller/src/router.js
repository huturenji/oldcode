import {RouterMount, createRouter} from 'uni-simple-router';
import { authorize, getAppUserInfo, setUserInfoInGlobalData } from '@/utils/auth/index';
import { isNotEmpty, toLogin } from '@/utils/common.js'
import config from '@/common/lib/config'

const router = createRouter({
    resolveQuery:jsonQuery => {
        return jsonQuery
    },
    parseQuery:jsonQuery => {
        return jsonQuery
    },
    platform: process.env.VUE_APP_PLATFORM,  
    routes: [
        ...ROUTES //路由表
    ] 
});


// #ifdef H5
function setTitleStyle(to){
    let titleBarConfig = to.meta?.titleBar;
    if (isNotEmpty(titleBarConfig?.visiable)){
        window.titleBar.visiable(titleBarConfig?.visiable ?? true);
    }
    let titleOption = {};
    let statusOption = {};
    if (isNotEmpty(titleBarConfig?.title)){
        titleOption = {
            opacity: titleBarConfig?.title?.opacity ?? 1,
            showBack: titleBarConfig?.title?.showBack,
            showMenu: titleBarConfig?.title?.showMenu,
            themeMode: titleBarConfig?.title?.themeMode,
            color: titleBarConfig?.title?.color,
            show: titleBarConfig?.title?.show,
            showTitle: titleBarConfig?.title?.showTitle,
            backStyle: titleBarConfig?.title?.backStyle,
            suspend: titleBarConfig?.title?.suspend,
            background: titleBarConfig?.title?.background
        }
    }
    if (isNotEmpty(titleBarConfig?.status)){
        statusOption = {
            opacity: titleBarConfig?.status?.opacity ?? 1,
            themeMode: titleBarConfig?.status?.themeMode,
            show: titleBarConfig?.status?.show,
            suspend: titleBarConfig?.status?.suspend,
            background: titleBarConfig?.title?.background
        }
    }
    window.titleBar.reset();
    if (isNotEmpty(titleOption) || isNotEmpty(statusOption)){
        window.titleBar.set({
            title: titleOption,
            status: statusOption
        })
    }
}
// #endif


//全局路由前置守卫
router.beforeEach(async (to, from, next) => {

    // #ifdef H5
    // 更新用户信息 为了获取缓存前置的key即getPrimaryKey 使缓存前置的key能做到针对公司独立
    let userInfo = await getAppUserInfo();
    setUserInfoInGlobalData(userInfo);
    //改变title栏样式
    setTitleStyle(to);
    // #endif

    if(to.path == config.LOGIN_PATH){ // 如果要去的页面是登录页的话，此时return掉
        next()
        return
    }
    let tokenInfo = await authorize();
    isNotEmpty(tokenInfo) ? next() : toLogin();
})

// 全局路由后置守卫
router.afterEach((to, from) => {})

export {
    router,
    RouterMount
}