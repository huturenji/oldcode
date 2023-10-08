import Vue from 'vue'
import Vuex from 'vuex'
import App from './index.vue'
import {
    TransferDom,
    Loading,
    ToastPlugin,
    ConfirmPlugin
} from 'vux';
//处理报错 NavigationDuplicated 
import Router from 'vue-router';
//处理vue警告，non-passive event 
import 'default-passive-events';
import keyclockproxy from "libs/keyclockproxy.js"
import idleWatcher from 'libs/idlewatcher'
import permissionManager from 'bislibs/permissionhandler'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI, {
    size: 'default',
    capture: true,
    select: {
        arrow: 'md-arrow-dropdown',
        arrowSize: 20
    }
});

Vue.directive('transfer-dom', TransferDom)
Vue.component('Loading', Loading)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(Vuex);
import iLoading from 'components/iloading/index'
Vue.use(iLoading)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

if (process.env.NODE_ENV == 'development') {
    //中台的mock数据入口
    // require('../mock/mock');
}

//处理报错 NavigationDuplicated 
const originalPush = Router.prototype.push
//console.log("originalPush="+originalPush)
Router.prototype.push = function push(location) {
    //console.log("location="+location)
    return originalPush.call(this, location).catch(err => err)
}

//路由拦截器
function routerProxyTM(to, from, next) {
    //console.log(to, from, next)
    //设置title
    if (to.meta.title && '' != to.meta.title) {
        document.title = to.meta.title;
    }
    next()
}

Vue.config.productionTip = false;
import router from 'route/index'
router.beforeEach(routerProxyTM)

async function launch() {
    //如果有这个标识位，说明需要登出
    if (idleWatcher.getTimeoutFlag() != null && !!Vue.prototype.$keycloak) {
        idleWatcher.clearTimeoutFlag()
        Vue.prototype.$keycloak.logoutFn();
        return;
    }
    //获取用户权限
    await permissionManager.init({ userId: Vue.prototype.$keycloak.tokenParsed.sub })
    new Vue({
        router,
        render: h => h(App)
    }).$mount('#home')
}

keyclockproxy.start(Vue).then(kc => {
    idleWatcher.start(kc.tokenParsed.auth_time * 1000);
    launch(kc);
}).catch(e => {
    launch();
    console.error(e);
})
