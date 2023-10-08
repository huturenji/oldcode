// import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './index.vue'
import Vuex from 'vuex'
import router from '../route/routes'
import InfiniteScroll from 'orderCommon/third/infinite-scroll/infinite-scroll.js'
import extendUtils from 'orderCommon/extend.js'

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
//App文字大小适配
extendUtils.setFontScale();
router.beforeEach((to, from ,next)=>{
    extendUtils.authHandler.moduleGate(async () => {
        await extendUtils.authHandler.authorize({
            enableAgreement: to.meta.pageType == 'entry'
        });
        extendUtils.routesHandler(router, to, from ,next)
    })
})
/* eslint-disable */
const app4 = new Vue({
    router,
    render: h => h(App)
}).$mount('#Order')
/* eslint-enable */