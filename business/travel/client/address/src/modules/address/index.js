import Vue from 'vue'
import App from './index.vue'
import router from '../../route/address/routes'
import {
    ToastPlugin,
    ConfirmPlugin
} from 'vux';
Vue.config.productionTip = false;
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
// import functional from "platform/functional"
let { functional } = SnTravel;
let {urlProxy, routesHandler} = functional;

var _push = router.push;
router.push = function(obj){
    if (typeof obj == 'string'){
        obj = urlProxy(obj);
    } else {
        obj.path = urlProxy(obj.path);
    }
    _push.call(router,obj);
} 
//app文字大小适配
functional.setFontScale();

router.beforeEach((to, from ,next)=>{
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
}).$mount('#address')