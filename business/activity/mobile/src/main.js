import Vue from 'vue'
import App from './App'
import { RouterMount } from 'uni-simple-router'
import request from '@/utils/request.js'
import "./router.js"  // 引入路由文件

//注册全局mixin
import appEventMixin from '@/common/mixin/appEventMixin.js'
Vue.mixin(appEventMixin);

// #ifdef H5
import {install as installTitleBar} from '@/pages/titleBar/index.js' 
installTitleBar();
// #endif
import {install as installDirectives } from '@/common/directive'//自动注册指令
installDirectives();

Vue.config.productionTip = false
Vue.prototype.$request = request




App.mpType = 'app'

const app = new Vue({
  ...App
})

//TODO 临时代码 保留时间2023/06/14-2022/06/24
if (!uni.getStorageSync('clearCache_activitystudio')){
  const storage = uni.getStorageInfoSync();
  storage.keys.forEach(key => {
      if (
          key.indexOf('_BPLUS_H5_token') > -1 || key.indexOf('_BPLUS_H5_refreshToken') > -1
      ){
          uni.removeStorageSync(key)
      }
  })

  uni.setStorageSync('clearCache_activitystudio', true);
}


//#ifdef H5
RouterMount(app, "#app");
//#endif

//#ifndef H5
app.$mount();
//#endif
