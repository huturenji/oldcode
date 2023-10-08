
import Vue from 'vue'
import router from 'approuter/index.js'
import App from './index.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import idleWatcher from 'libs/idlewatcher.js'
import keyclockproxy from "libs/keyclockproxy.js"
import permissionManager from 'bislibs/permissionhandler'
import { TransferDom, ConfirmPlugin } from 'vux';
import iLoading from 'components/loading/index'

Vue.directive('transfer-dom', TransferDom)
Vue.use(ConfirmPlugin)
Vue.use(ElementUI);
Vue.use(iLoading);
Vue.use(ViewUI, {
    size: 'default',
    capture: true,
    select: {
        arrow: 'md-arrow-dropdown',
        arrowSize: 20
    }
});

router.beforeEach((to, from, next) => {
    //console.log(to, from, next)
    //设置title
    if (to.meta.title && '' != to.meta.title) {
        document.title = to.meta.title;
    }
    next()
})

async function launch() {
    //如果有这个标识位，说明需要登出
    if (idleWatcher.getTimeoutFlag() != null && !!Vue.prototype.$keycloak) {
        idleWatcher.clearTimeoutFlag()
        Vue.prototype.$keycloak.logoutFn();
        return;
    }
    //获取用户权限
    await permissionManager.init({ userId: Vue.prototype.$keycloak.tokenParsed.sub })
    window.app = new Vue({
        el: '#app',
        router,
        components: {
            App
        },
        template: '<App/>'
    })
}

keyclockproxy.start(Vue).then(kc => {
    idleWatcher.start(kc.tokenParsed.auth_time * 1000);
    launch(kc);
}).catch(e => {
    launch();
    console.error(e);
})
