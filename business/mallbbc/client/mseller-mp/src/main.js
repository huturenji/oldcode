import Vue from 'vue'
import App from './App'
import {router, RouterMount} from './router.js'
//注册全局mixin
import globalMixin from '@/common/mixin/global.js'

import uView from "uview-ui";

// Vue.mixin({
//   methods:{
//       setTabBarIndex(index) {
//           if (typeof this.$mp.page.getTabBar === 'function' &&
//           this.$mp.page.getTabBar()) {
//               this.$mp.page.getTabBar().setData({
//                   selected: index
//               })
//           }
//       }
//   }
// })

//注册全局mixin
Vue.use(router)
Vue.use(uView);

Vue.config.productionTip = false
Vue.mixin(globalMixin);

App.mpType = 'app'

const app = new Vue({
    ...App
})

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, router, '#app')
// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif