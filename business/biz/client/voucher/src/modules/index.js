
import Vue from 'vue';
import App from './index.vue';
import extendUtils from 'common/lib/utils'
import {authorize} from 'common/lib/requestHandler/authHandler';

//引入vuex
import store from 'common/states/store.js';
import router from '../route/routes';

import {
    ToastPlugin,
    ConfirmPlugin
} from 'vux';
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)

//配置全局变量
import Config from 'common/config';
Vue.prototype.GlobalConfig = window.GlobalConfig = Config;

// 全局的混入
import globalMixin from 'common/lib/mixin/globalMixin.js';
Vue.mixin(globalMixin);

//注册全局的loading插件
import Loading from 'common/lib/plugin/loading/index.js';
Vue.use(Loading);

//安装全局titlebar组件
import {install as installTitleBar} from 'common/components/titleBar';
installTitleBar();

//router push方法的代理
var _push = router.push;
router.push = async function(obj){
    if(typeof obj == 'string'){
        obj = extendUtils.urlProxy(obj, GlobalConfig.USER_CONFIG.URL_STABLE_PARAMS);
    }else{
        obj.path = extendUtils.urlProxy(obj.path, GlobalConfig.USER_CONFIG.URL_STABLE_PARAMS);
    }
    _push.call(router, obj);
} 

//router replace方法的代理
var _replace = router.replace;
router.replace = async function(obj){
    if(typeof obj == 'string'){
        obj = extendUtils.urlProxy(obj, GlobalConfig.USER_CONFIG.URL_STABLE_PARAMS);
    }else{
        obj.path = extendUtils.urlProxy(obj.path, GlobalConfig.USER_CONFIG.URL_STABLE_PARAMS);
    }
    _replace.call(router, obj);
} 

Vue.config.productionTip = false;
//获取app用户字号缩放值并设置页面缩放
sinosdk.sino.getAppInfo({key:'fontScale'}).then((res)=>{
    let MIN_PC_WIDTH = 616;
    if(!!res.value&&''!=res.value&&0!=res.value && document.documentElement.clientWidth < MIN_PC_WIDTH){
        document.documentElement.style.fontSize=((res.value*10000/750)+'vw')
    }
})
router.beforeEach(async (to, from ,next)=>{
    await sinosdk.sino.getUserAgentFromJsBridge();
    //只有首页才需要授权页面
    await authorize({
        enableAgreement: to.meta.pageType == 'entry'
    });
    extendUtils.routesHandler(router, to, from, next, {isDirect: false})
})


const app3 = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#voucher')