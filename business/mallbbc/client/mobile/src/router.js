import Vue from 'vue'
import Router from 'uni-simple-router'
import store from '@/store'
import {getProtocol, logUserEntered} from '@/utils/protocol.js'
import {bbcStatEvent,updateStatCommonProperty} from "./utils/stat.js";
// #ifdef H5
import { authorize } from './utils/auth.js'
// #endif
import {unlockScroll, isNotEmpty, getUrlStableParamValue, updateStableParams, isSpecialChouzhou} from '@/utils/common.js'
import exclusive from '@/utils/taskLock/exclusive'
//引入数据埋点对象
import sensorHandler from '@/utils/sensorHandler';
import shareHandler from '@/utils/shareHandler.js';
import config from '@/common/lib/config';
import {changeTheme} from '@/utils/theme';
Vue.use(Router);

const router = new Router({
    encodeURI: false, //默认为true
    routes: [
        ...ROUTES, //路由表
        // 404路由
        {
            path: "*",    
            component: () => import('@/views/404/404.vue')
        }
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

// 隐藏h5titlebar 同时相关样式变量赋0
function hideH5Titlebar(){
    window.titleBar?.set({
        show: false
    })
}

async function showProtocol(){
    let ruleInUrl = SnUtils.getUserPara('enableAgreement'); 
    if (isNotEmpty(ruleInUrl) && ruleInUrl == 'false'){
        return
    }
    if (!window.protocol //未弹出过授权协议
        && store.state.role == config.ROLE.USER //必须是已登录用户
    //未配置不提示协议
    ){
        await getProtocol();
    }
}

//uni有bug：B页面重新加载后再路由回退到A，A页面上body的class还是B页面
//具体判断逻辑见：@dcloudio\uni-h5\src\core\service\plugins\app\router-guard.js -> beforeEach() -> toId === fromId
//原因是刷新后，B的__id__初始化成了1（此时A也是1）。逻辑可参考：@dcloudio\webpack-uni-pages-loader\lib\platforms\h5.js -> genPageRoutes()
function fixBodyClassScope(to){
    //修复body上的class为当前路由
    //参考router-guard.js -> beforeEach() [line 148]
    document.body.className = 'uni-body ' + to.path.substring(1).replace(/\//g,'-')
}

/**
 * 判断路由是否需要过滤，如果需要过滤则不往后走next()方法
 * @param {路由对象} to 前往的路由对象
 * @param {路由对象} from 来源路由对象
 * @returns 
 */
function routerFilter(to,from) {
    return from&&config.ROUTER_PATH_FILTER_FROMLIST.indexOf(from?.path||'')>-1&&from?.path!=to?.path
}

let stableParams;//url上需要固定的参数
//全局路由前置守卫
router.beforeEach(async (to, from, next) => {
    if (routerFilter(to,from)){ //如果路由在过滤列表中，则不往下走
        return 
    }
    
    fixBodyClassScope(to);
    // #ifdef H5
    //beforeEach内的函数都必须放到节流锁中。
    //因为：ios（包括Safari）上，页面location.href到其他页面，再从其他页面history.back()回来，beforeEach会进入两次。场景举例：ios上微信H5支付，从中转页返回时
    await exclusive(async () => {
        await sinosdk.sino.getUserAgentFromJsBridge();
        let pathInWhiteList = config.AUTH_PATH_WHITELIST.indexOf(to.path || '') > -1; // 要跳转的路由是否需要走授权流程
        !pathInWhiteList && await authorize();
        //记录用户进入了系统
        logUserEntered();
        //设置主题
        !window.themeObj && await changeTheme();
        if(to.meta?.disableProtocol !== false){
            await showProtocol();//显示协议
        }
        if(sinosdk.sino.getPlatform()==sinosdk.sino.constant.RUN_ENV.WEBOA){ //WEBOA环境下，将除了首页之外的其他页面H5title隐藏，使用app title
            if(to.path=='/pages/tabbar/services'||to.path=='/pages/tabbar/personalcenter'){ //直接写死"出行"与"我的"路由 后续需要优化
                hideH5Titlebar();
                sinosdk.sino.setTitleBar({showTitleBar:true})
            }else{
                setTitleStyle(to);
            }
           
        }else if (isSpecialChouzhou()){ //改变title栏样式
            hideH5Titlebar();
        } else {
            setTitleStyle(to);
        }
    }, 'authExclusive')
    //将全局锁定解锁
    unlockScroll();
    //读取url上固定的参数
    stableParams = getUrlStableParamValue()
    // #endif
    next()
})
// 全局路由后置守卫
router.afterEach((to, from) => {
    // #ifdef H5
    let url = getApp().globalData.apiUrl.substring(0,getApp().globalData.apiUrl.length-1);
    //商品详情页、店铺的页面需要单独统计，但是需要把pageUrl和referrerPageUrl先存进去
    let specialPages = [
        '/standard/product/detail',//商品详情页
        '/standard/store/shopHomePage',//店铺首页
        '/standard/store/storeIntroduction',//店铺信息页
        '/standard/store/productSearch',//店铺商品列表页
        '/extra/tshou/goods/detail'//推手商品详情页
    ];
    let statPvFlag = true;
    for (let i = 0; i < specialPages.length; i++){
        if (specialPages[i].indexOf(to.path)>-1){
            statPvFlag = false;
            break;
        }
    }
    if (!statPvFlag){
        //不需要pv类型的统计
        updateStatCommonProperty({pageUrl:url+to.path,referrerPageUrl:url+from.path});
    } else {
        setTimeout(() => {
            bbcStatEvent({behaviorType:'pv',pageUrl:url+to.path,referrerPageUrl:url+from.path});
        }, 3000)
    }
 
    //H5 tarbar，根据页面routePath 判断tabbar状态
    window.onTabBarLoad?.then(bar=>{
        bar.updateTabbar();
    }); 
    // #endif

    //将title存储到缓存中，页面回退后取出赋值 WEBOA场景下使用 兼容贵阳银行
    if(sinosdk.sino.getPlatform()==sinosdk.sino.constant.RUN_ENV.WEBOA){
        if(to.path=='/pages/tabbar/services'||to.path=='/pages/tabbar/personalcenter'){
            uni.setStorageSync('weboa_topic_title',document.title)//设置title有问题，需要在路由处设置
        }
    }
    
    //切换页面注销分享信息
    shareHandler.cancelBizmateShare();
    sinosdk.sino.overwriteWindowopen(); // 兼容部分老银行ios异步window.open页面的时候 打不开的问题  
    
    Vue.nextTick(() => {
        //延迟设置url上需固定的参数（此时replaceState才有效）
        //说明：若使用beforeEach的next({query})保持参数，会导致页面回退异常；若代理uni和router的相关方法，uni.switchTab无法带参。故暂用本方案
        if (isNotEmpty(stableParams)){
            let hash = updateStableParams(location.hash, stableParams)
            history.replaceState(window.history.state, '', location.origin + location.pathname + location.search + hash);
        }
        //数据埋点数据上报,需在下一帧调用待url更新完成，路由通过meta控制是否取query参数
        let uri = (!!to.meta?.sensorUseHref)?location.href:(window.location.href.split('?')[0]);
        
        sensorHandler.setPageAddreportEvent(decodeURIComponent(uri));// 设置当前单页页面的pagePath并上报页面浏览事件
    })

})
export default router;