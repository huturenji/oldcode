// import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './index.vue'
import Vuex from 'vuex'
import router from 'routeDir/routes'
import InfiniteScroll from 'orderCommon/third/infinite-scroll/infinite-scroll.js'
import VueTouch from 'vue-touch' // 滑动事件
import extendUtils from 'orderCommon/extend.js';

import { Calendar } from 'vant';
import 'vant/lib/index.css';

import {
    ToastPlugin,
    ConfirmPlugin,
    LoadingPlugin
} from 'vux';
Vue.use(InfiniteScroll)
Vue.use(Vuex);
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(VueTouch, {name: 'v-touch'})
Vue.use(Calendar);

//模拟mockjs
if (process.env.NODE_ENV=='development'){
    require('./mock/mock');
}

var _push = router.push;
router.push = function(obj){
    if (typeof obj == 'string'){
        obj = extendUtils.urlProxy(obj);
    } else {
        obj.path = extendUtils.urlProxy(obj.path);
    }
    _push.call(router,obj);
}

Vue.config.productionTip = false;

//兼容旧的url上首字母大写
extendUtils.toggleCases();
extendUtils.setFontScale();

router.beforeEach((to, from ,next)=>{
    extendUtils.authHandler.moduleGate(async ()=>{
        await extendUtils.authHandler.authorize({
            enableAgreement: false
        });
        extendUtils.routesHandler(router, to, from ,next)
    })
})
const app9 = new Vue({ //eslint-disable-line no-unused-vars
    router,
    render: h => h(App)
}).$mount('#Order') 
