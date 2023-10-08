/* eslint-disable no-unused-vars */
import Vue from 'vue'
import App from './index.vue'
import router from '../../route/flight/routes'
import extendUtils from 'flightCommon/extend.js';

import {
    ToastPlugin,
    ConfirmPlugin
} from 'vux';
Vue.config.productionTip = false;
let functional = SnTravel.functional;
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)

//兼容旧的url上首字母大写
extendUtils.toggleCases();
// extendUtils.autoLoadTheme('bizmate',themePath)//TODO  这是demo

//适配App文字大小
functional.setFontScale()

router.beforeEach(async (to, from ,next)=>{
    //只有首页才需要授权页面
    await extendUtils.authHandler.authorize({
        enableAgreement: to.meta.pageType == 'entry'
    });
    extendUtils.routesHandler(router, to, from ,next)
})

var _push = router.push;
router.push = function(obj){
    if (typeof obj == 'string'){
        obj = extendUtils.urlProxy(obj);
    } else {
        obj.path = extendUtils.urlProxy(obj.path);
    }
    _push.call(router,obj);
}


const app3 = new Vue({
    router,
    render: h => h(App)
}).$mount('#flight')
