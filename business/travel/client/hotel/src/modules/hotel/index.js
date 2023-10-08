import Vue from 'vue'
import App from './index.vue'
import router from '../../route/hotel/routes'

//开发环境使用mock
// if(process.env.NODE_ENV=='development'){
//       require('../../mock/mock');
// }

import { Slider } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import {
    ToastPlugin,
    ConfirmPlugin,
    LoadingPlugin
} from 'vux';
let functional = SnTravel.functional;
let {urlProxy,routesHandler} = functional;
SnTravel.functional.setFontScale();

//兼容消息推送历史消息url里面大写开头的传参
functional.toggleCases();
Vue.use(Slider);
Vue.prototype.$ELEMENT = { size: 'small' };
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
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
router.beforeEach(async (to, from ,next)=>{
    //只有首页才需要授权页面
    await functional.authHandler.authorize({enableAgreement:to.meta.pageType == 'entry'});
    routesHandler(router, to, from ,next);
})
// eslint-disable-next-line no-unused-vars
const app3 = new Vue({
    router,
    render: h => h(App)
}).$mount('#hotel')