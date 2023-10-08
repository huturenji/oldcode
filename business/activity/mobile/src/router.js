import Vue from 'vue'
import Router from 'uni-simple-router'
import { getBplusToken } from '@/utils/auth.js'
import { isNotEmpty } from '@/utils/common.js'
import sensorHandler from '@/utils/sensorHandler';
Vue.use(Router);

const router = new Router({
    encodeURI: false, //默认为true
    routes: [
        ...ROUTES //路由表
    ] 
});

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
            suspend: titleBarConfig?.title?.suspend
        }
    }
    if (isNotEmpty(titleBarConfig?.status)){
        statusOption = {
            opacity: titleBarConfig?.status?.opacity ?? 1,
            themeMode: titleBarConfig?.status?.themeMode,
            show: titleBarConfig?.status?.show,
            suspend: titleBarConfig?.status?.suspend
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

//全局路由前置守卫
router.beforeEach(async (to, from, next) => {
    await getBplusToken();
    //改变title栏样式
    setTitleStyle(to);
    next();
})
// 全局路由后置守卫
router.afterEach((to, from) => {
    Vue.nextTick(() => {
        //数据埋点数据上报,需在下一帧调用待url更新完成，路由通过meta控制是否取query参数
        let uri = (!!to.meta?.sensorUseHref)?location.href:(window.location.href.split('?')[0]);
        sensorHandler.setPageAddreportEvent(decodeURIComponent(uri));// 设置当前单页页面的pagePath并上报页面浏览事件
    })
})
export default router;