
import Vue from 'vue';
import App from './index.vue';
import extendUtils from 'common/lib/utils';
import router from '../../route/businesscloud/routes';

//配置全局变量
import Config from 'common/config';
Vue.prototype.GlobalConfig = window.GlobalConfig = Config;


import {
  ToastPlugin,
  ConfirmPlugin
} from 'vux';

// 注册全局toast和confirm
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)

router.beforeEach((to, from ,next)=>{
    extendUtils.routesHandler(router, to, from, next, {isDirect: false})
  })

import './index.less';

const app3 = new Vue({
  router,
  render: h => h(App)
}).$mount('#businesscloud')