
import Vue from 'vue';
import App from './index.vue';
import extendUtils from 'common/lib/utils'
import directive from 'common/lib/directive/attach.js';//自动注册指令
import {authorize,guestAuthorize} from 'common/lib/requestHandler/authHandler';
//引入vuex
import store from 'common/states/store.js';
import router from '../../route/mall/routes';
import {install} from 'common/lib/plugin/titleBar'
if(!extendUtils.isPC() && !!extendUtils.getBizMateVersion()){
    window.loadTitleBar = new Promise(resolve=>resolve(install())) 
}


if(process.env.NODE_ENV=='development'){
  //中台的mock数据入口
    // require('./mock/mock');
}
// 中台的本地代理入口，加密后此处时效，商城的业务处理挪到base.js处理2021年2月5日
// require('./mock/DMT/proxy/DMTHttpProxy');

import {
  ToastPlugin,
  ConfirmPlugin
} from 'vux';

// 注册全局toast和confirm
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)

import VueTouch from 'vue-touch';
Vue.use(VueTouch, {name: 'v-touch'})

//配置全局变量
import Config from 'common/lib/config.js';
Vue.prototype.BMallConfig = window.BMallConfig = Config;

// 全局的混入
import globalMixin from 'common/lib/mixin/globalMixin.js';
Vue.mixin(globalMixin);

//注册全局的loading插件
import Loading from 'common/lib/plugin/loading/index.js';
Vue.use(Loading);

//router push方法的代理
var _push = router.push;
router.push = async function(obj){
    if(obj.query && Object.keys(obj.query).length>0){
        obj.query = await extendUtils.authInterceptor(obj.query)
    }
  if(typeof obj == 'string'){
      obj = extendUtils.urlProxy(obj, BMallConfig.URL_STABLE_PARAMS);
  }else{
      obj.path = extendUtils.urlProxy(obj.path, BMallConfig.URL_STABLE_PARAMS);
  }
  _push.call(router, obj);
} 

//router replace方法的代理
var _replace = router.replace;
router.replace = async function(obj){
    if(obj.query && Object.keys(obj.query).length>0){
        obj.query = await extendUtils.authInterceptor(obj.query)
    }
  if(typeof obj == 'string'){
      obj = extendUtils.urlProxy(obj, BMallConfig.URL_STABLE_PARAMS);
  }else{
      obj.path = extendUtils.urlProxy(obj.path, BMallConfig.URL_STABLE_PARAMS);
  }
  _replace.call(router, obj);
} 

Vue.config.productionTip = false;
router.beforeEach(async (to, from ,next)=>{
  extendUtils.autoLoadTheme(to.query.supplierId); //全局守卫加载京东/苏宁的主题
  if(to.name == 'indexJD' || to.name == 'indexSN'){ //如果是进入京东首页或者是苏宁首页的话，此时需要重新更新meta里面的title
    to.meta.title = extendUtils.getMallTitle(to.query.supplierId);
  }
  if(!extendUtils.getBizMateVersion() && !!to.meta.supportGuest){//游客访问
    await guestAuthorize();
  }else{//用户访问
    await authorize({
        enableAgreement: !to.meta.noAuthAgreement
    });
  }
  extendUtils.routesHandler(router, to, from, next, {isDirect: false})
})

import './index.less';

const app3 = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#mall')