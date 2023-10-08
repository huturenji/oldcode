import Vue from 'vue'
import App from './index.vue'
import router from '../../route/invoiceManage/routes'

import InfiniteScroll from 'thirdparty/infinite-scroll/infinite-scroll.js'
import {
    ToastPlugin,
    ConfirmPlugin
} from 'vux';
// import functional from 'platform/functional';
let { functional } = SnTravel;
Vue.use(InfiniteScroll);
//获取app用户字号缩放值并设置页面缩放
SnTravel.functional.setFontScale();
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)

//模拟mockjs
if (process.env.NODE_ENV=='development'){
    require('./mock/mock');
}

Vue.config.productionTip = false;

var _push = router.push;
router.push = function(obj){
    if (typeof obj == 'string'){
        obj = functional.urlProxy(obj);
    } else {
        obj.path = functional.urlProxy(obj.path);
    }
    _push.call(router, obj);
}

router.beforeEach((to, from, next)=>{
    functional.authHandler.moduleGate(async ()=>{
        //只有首页才需要展示授权弹窗
        await functional.authHandler.authorize({
            enableAgreement: to.meta.pageType == 'entry' 
        });
        functional.routesHandler(router, to, from, next)
    })
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#invoiceManage')