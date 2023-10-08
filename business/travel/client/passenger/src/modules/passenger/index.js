import Vue from 'vue'
import App from './index.vue'
import router from '../../route/passenger/routes'

import {
    ToastPlugin,
    ConfirmPlugin
} from 'vux';

//开发环境使用mock
if (process.env.NODE_ENV=='development'){
    require('./mock/mock');
}
Vue.use(ToastPlugin);
Vue.use(ConfirmPlugin);
// import functional from "platform/functional"
let { functional } = SnTravel;
let {urlProxy, routesHandler} = functional;
SnTravel.functional.setFontScale();

var _push = router.push;
router.push = function(obj){
    if (typeof obj == 'string'){
        obj = urlProxy(obj);
    } else {
        obj.path = urlProxy(obj.path);
    }
    _push.call(router,obj);
} 

Vue.config.productionTip = false;
router.beforeEach((to, from ,next) => {
    functional.authHandler.moduleGate(async ()=>{
        await functional.authHandler.authorize({
            enableAgreement: to.meta.pageType == 'entry' 
        });
        routesHandler(router, to, from, next)
    });
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#passenger')