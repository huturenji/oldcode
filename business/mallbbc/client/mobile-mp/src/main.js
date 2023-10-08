import Vue from 'vue'
import App from './App'
import store from './store'
Vue.prototype.$store = store

import { statEvent } from './utils/tracking'
Vue.prototype.$statEvent = statEvent;

import {router, RouterMount} from './router.js'  
Vue.use(router)
//注册全局mixin
import globalMixin from '@/common/mixin/global.js'
import requestMixin from '@/common/mixin/requestMixin.js'

//全局注入w-loading组件
import wLoading from "@/common/components/loading/index.vue";
Vue.component('w-loading',wLoading)

import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false
Vue.mixin(globalMixin);
Vue.mixin(requestMixin);

Vue.mixin({
  methods:{
      setTabBarIndex(index) {
          if (typeof this.$mp.page.getTabBar === 'function' &&
          this.$mp.page.getTabBar()) {
              this.$mp.page.getTabBar().setData({
                  selected: index,
                //   'list[2].num': this.$store.state.cartNum
              })
          }
      },
      setCartNum(num) {
        // if (typeof this.$mp.page.getTabBar === 'function' && this.$mp.page.getTabBar()) {
        //   // 暂时写死
        //   let numKet = 'list[2].num';
        //   this.$mp.page.getTabBar().setData({
        //       [numKet]: num
        //   })
        // }
      }
  }
})
App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, router, '#app')
// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif