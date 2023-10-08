
import Vue from 'vue'
import App from './index.vue'

import router from '../../route/train/routes'

if(process.env.NODE_ENV=='development'){
    require('./mock/mock');
}


let { functional } = SnTravel;
import {
  ToastPlugin,
  ConfirmPlugin
} from 'vux';
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)

//兼容消息推送历史消息url里面大写开头的传参
functional.toggleCases();

var _push = router.push;
router.push = function(obj){
    if(typeof obj == 'string'){
        obj = functional.urlProxy(obj);
    }else{
        obj.path = functional.urlProxy(obj.path);
    }
    _push.call(router,obj);
} 

Vue.config.productionTip = false;
router.beforeEach(async (to, from, next)=>{
//   //只有首页才需要展示授权弹窗
  await functional.authHandler.authorize({
    enableAgreement: to.meta.pageType == 'entry' 
  });
  functional.routesHandler(router, to, from, next)
})


sinosdk.sino.setTitleBar({
    showTitle: false,
})


let instance = new Vue({
  router,
  render: h => h(App)
})

//TODO 该方法主要解决当前火车票小应用 老入口和新入口(同城)并存的问题，Uat下非伴正事渠道跳转至老入口，伴正事渠道跳转至新入口(同城)。其余环境（dev、sit、prob）所有渠道都跳转至新入口(同城)



functional.getChannelId().then((channelId)=>{
    
    let env = process.env.BP_ENV;
    if(env != 'Sandbox' ){  //BlackBox  Sandbox
        location.replace('https://m.ly.com/universal/touch/?refid=85141262#/index?sswbv_multipage=false');
    }else{
        if(channelId != 5){ //9729 5
            instance.$mount('#train')
        }else{
            location.replace('https://m.ly.com/universal/touch/?refid=85141262#/index?sswbv_multipage=false');
        } 
    }
});

