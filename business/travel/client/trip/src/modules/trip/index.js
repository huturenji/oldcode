import Vue from 'vue'
import App from './index.vue'

import router from '../../route/trip/routes'
import tripHandler from './views/tripHandler.js'; 
// 下拉加载插件
import infiniteScroll from 'vue-infinite-scroll'
import {
    ToastPlugin,
    ConfirmPlugin
} from 'vux';
Vue.use(infiniteScroll)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)

// import {functional} from 'platform/functional/src/index';
let { functional } = SnTravel;
let {getUserPara, urlProxy, routesHandler} = functional;
var _push = router.push;
router.push = function(obj){
    if (typeof obj == 'string'){
        obj = urlProxy(obj);
    } else {
        obj.path = urlProxy(obj.path);
    }
    _push.call(router, obj);
} 

//伴正事文字大小适配
functional.setFontScale();

router.beforeEach((to, from, next) => {
    functional.authHandler.moduleGate(async () => {

        //Base64Local为非正规和规范的base64加解码方法，咱们自己在后面加了一个“=”号。
        //此处银企通审批和商旅审批后续都会改成行业规范的base64加解码库（js-base64）但是为了兼容之前部署的银行版本，此处需要针对旧的做一个兼容
        let buyTicketParam = !!getUserPara('buyTicketParam') ? tripHandler.getBuyTicketParam(getUserPara('buyTicketParam')) : {};
        //此处加这个逻辑是为了审批出差申请的时候跳转商旅的话，需要屏蔽掉服务授权（使使用者感觉不到跳转商旅）。
        let NeedJump = (!!getUserPara('NeedJump') && getUserPara('NeedJump') == 2);//点击聊天上下文的时候也不展示服务授权
        let hasStatus = Object.prototype.hasOwnProperty.call(buyTicketParam,"status") ; //是否是从审批跳转过来的
        let config = {enableAgreement: true}//config参数的‘enableAgreement’用来判断是否显示授权的弹窗的
        if (hasStatus || NeedJump){
            config.enableAgreement = false
        }
        await functional.authHandler.authorize(config);
        routesHandler(router, to, from, next);
    })
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#trip')