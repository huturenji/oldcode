import Vue from 'vue'
import App from './index.vue'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import 'styles/thirdparty/ivewindex.less';
import ElementUI, { Loading } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import iLoading from 'components/loading/index'
import keyclockproxy from "libs/keyclockproxy.js"
import idleWatcher from 'libs/idlewatcher'
import permissionManager from 'bislibs/permissionhandler'
import router from 'route/index'
import store from 'vuexStore/store'
import * as moment from "moment";
import * as math from "mathjs";

import VueLazyload from 'vue-lazyload';
//处理报错 NavigationDuplicated 
import Router from 'vue-router';
//处理vue警告，non-passive event 
import 'default-passive-events';
//全局全量的引用Iview组件，没有按需加载，因为iview是我们项目的UI框架库
Vue.use(ElementUI);
Vue.use(Loading)
Vue.use(iLoading)
Vue.use(ViewUI, {
    size: 'default',
    capture: true,
    select: {
        arrow: 'md-arrow-dropdown',
        arrowSize: 20
    }
});
Vue.use(VueLazyload, {
    error: 'assets/img_error.png',
    loading: 'assets/img_default.png'
})
//处理报错 NavigationDuplicated 
const originalPush = Router.prototype.push
//console.log("originalPush="+originalPush)
Router.prototype.push = function push(location) {
    //console.log("location="+location)
    return originalPush.call(this, location).catch(err => err)
}
//中台的mock数据入口
if (process.env.NODE_ENV == 'development') {

    // require('../mock/mock');
}

const EventBus = new Vue();

Vue.prototype.$bus = EventBus;
Vue.prototype.$moment = moment;
Vue.prototype.$math = math;

Array.prototype.fakeFlat = function (num = 1) {
    if (!Number(num) || Number(num) < 0) {
        return this;
    }
    let arr = [];
    this.forEach(item => {
        if (Array.isArray(item)) {
            arr = arr.concat(item.fakeFlat(--num));
        } else {
            arr.push(item);
        }
    });
    return arr;
};

//路由拦截器
function routerProxyTM(to, from, next) {
    //console.log(to, from, next)
    //设置title
    if (to.meta.title && '' != to.meta.title) {
        document.title = to.meta.title;
    }
    next()
}
router.beforeEach(routerProxyTM)
//阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false;

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
        store,
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
