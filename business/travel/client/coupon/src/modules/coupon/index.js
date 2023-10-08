import Vue from 'vue'
import App from './index.vue'
import router from '../../route/coupon/routes'
import {
    ToastPlugin,
    ConfirmPlugin
} from 'vux';
// import functional from 'platform/functional';

let { functional } = SnTravel;

Vue.config.productionTip = false;
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)

var _push = router.push;
router.push = function(obj){
    if (typeof obj == 'string'){
        obj = functional.urlProxy(obj);
    } else {
        obj.path = functional.urlProxy(obj.path);
    }
    _push.call(router,obj);
} 
//App超大文字适配
functional.setFontScale();

router.beforeEach((to, from ,next)=>{
    functional.authHandler.moduleGate(async () => {

        await functional.authHandler.authorize({
            enableAgreement: to.meta.pageType == 'entry' 
        });
        functional.routesHandler(router, to, from, next)
    })
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#coupon')