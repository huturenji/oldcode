import Vue from 'vue'
import App from './index.vue'
import router from '../../route/express/routes'
let functional = SnTravel.functional;
let {urlProxy,routesHandler} = functional;
Vue.prototype.$ELEMENT = { size: 'small' };
import {
  ToastPlugin,
  ConfirmPlugin
} from 'vux';
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
//开发环境使用mock
if(process.env.NODE_ENV=='development'){
    require('../../mock/mock');
}
Vue.config.productionTip = false;

var _push = router.push;
router.push = function(obj){
    if(typeof obj == 'string'){
        obj = urlProxy(obj);
    }else{
        obj.path = urlProxy(obj.path);
    }
    _push.call(router,obj);
}
functional.setFontScale()
router.beforeEach(async (to, from ,next)=>{
        //只有首页才需要授权页面
        await functional.authHandler.authorize({enableAgreement:false});
        routesHandler(router, to, from ,next)
    
});
const app3 = new Vue({
  router,
  render: h => h(App)
}).$mount('#express')