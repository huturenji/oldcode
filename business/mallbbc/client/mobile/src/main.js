import Vue from 'vue'
import App from './App'
// 引入全局uView
import uView from 'uview-ui'
import prototype from './common/lib/reload.js'
//全局注册组件
import loadingState from '@/components/loading/loading'
import Protocol from '@/components/protocol'
//注册全局mixin
import requestMixin from '@/common/mixin/requestMixin.js'
import { proxyAgent } from './utils/proxyMethods'
import store from './store'
import config from '@/common/lib/config'

// #ifdef H5
import { RouterMount } from 'uni-simple-router'
import {install as installTitleBar} from '@/components/decorate/titleBar' 
import {setFontScale} from './utils/common.js'
import {install as installDirectives } from 'common/directive'//自动注册指令
//注册全局mixin
import appEventMixin from '@/common/mixin/appEventMixin.js'
import './utils/indexDB.js'
import {channelOptionsInit} from '@/utils/channelOptions.js';
import { authorize } from './utils/auth.js'
//挂载渠道控制参数的Promise对象
window.getChannelOptions = new Promise(async resolve=> { await authorize(); let options = await channelOptionsInit();resolve(options) });
installTitleBar();
//根据app字号设置文字缩放
setFontScale();
installDirectives();
Vue.mixin(appEventMixin);
// #endif


Vue.use(uView)
uni.$u.config.unit = 'rpx'
Vue.config.productionTip = false
Vue.prototype = Object.assign(Vue.prototype || {}, prototype)
App.mpType = 'app'
Vue.component('loadingState',loadingState)
Vue.mixin(requestMixin);
Vue.use(Protocol)
Vue.prototype.$store = store

//代理全局函数
proxyAgent.open();
const app = new Vue({
    ...App,
    store
})

//TODO 临时代码 保留时间2022/07/09-2022/10/09
if (!uni.getStorageSync('clearCache')){
    const storage = uni.getStorageInfoSync();
    storage.keys.forEach(key => {
        if (
            key.indexOf('_userInfo') > -1 
            || (key.indexOf('_token') > -1 && key.indexOf(config.AUTH_CONFIG.loginKcConfig.clientId) > -1)
        ){
            uni.removeStorageSync(key)
        }
    })

    uni.setStorageSync('clearCache', true);
}


//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app,'#app');
// #endif
// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
