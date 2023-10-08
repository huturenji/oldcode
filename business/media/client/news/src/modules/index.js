
import Vue from 'vue';
import App from './index.vue';
import extendUtils from 'common/lib/utils'
import {authorize} from 'common/lib/requestHandler/authHandler';
import { getChannelConfigs } from 'common/config/handleChannelConfigs'

//引入vuex
import store from 'common/states/store.js';
import router from '../route/routes';

// if(process.env.NODE_ENV=='development'){
//     //中台的mock数据入口
//     require('./mock/mock');
// }
// 中台的本地代理入口
//require('./mock/DMT/proxy/DMTHttpProxy');

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
    //页面跳转时全局广播停止播放视频
    globalBus.$emit('videoPlayTypeUpdata','');
    if(Config.WHITE_LIST.AUTH.PATH.indexOf(to.path)==-1){
        //只有首页才需要授权页面
        await authorize({
            enableAgreement: to.meta.pageType == 'entry'
        });
        // 设置灰黑主题
        const htmlDom = document.querySelector('html');
        let channelOptions = await getChannelConfigs();
        if (Array.prototype.indexOf.call(htmlDom.classList,'grayscaleFull') === -1 && extendUtils.isNotEmpty(channelOptions.grayscaleFull) && channelOptions.grayscaleFull) {
            htmlDom.classList.add('grayscaleFull');
        }
        
    }
    extendUtils.routesHandler(router, to, from, next, {isDirect: false})
})


const app3 = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#news')