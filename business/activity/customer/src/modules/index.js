
import Vue from 'vue'
import router from 'approuter/index.js'
import App from './index.vue'
// import { globalAuthData } from 'bislibs/auth/globalauthenum.js';
//全局挂载mathjs
import { create, all } from 'mathjs'
const mathjs = create(all)
mathjs.config({
    number: 'BigNumber',
    precision: 64
})
Vue.prototype.$math = mathjs
//测试业务组件，需要改写router和views
import * as OPCL from 'opcl'
import './ivewindex.less';

//挂载UI库 ivew和 element-ui
// OPCL.useiview(Vue);
// OPCL.useelement(Vue);
//挂载基础组件，全量挂载，暂不支持按需加载。
if (OPCL.bascomp) {
    Vue.use(OPCL.bascomp);
}
//设置超时 不自动退出功能
if(OPCL.idlewatcher){
    OPCL.idlewatcher.setValidTime(-1);
}
//中台的mock数据入口
if (true) {
    // console.log(OPCL)
    // require('./mock/mock');
    // require('./mock/activity');
    // require('./mock/order.js');
}
//执行登录操作。 我们这里以资讯为例来制作Demo
if (OPCL.login) {
    const TIMESTAMP = process.env.TIMESTAMP_ENV;//时间戳
    const NODE_ENV = process.env.NODE_ENV;
    const clientId = 'ACTIVITYSTUDIO_client_front';     
    // const clientId = 'ACTIVITYSTUDIO_client_front_test';   
    const homePath = window.origin + "/activitystudio/static/customer/index.html";
    const jsonFilePath = NODE_ENV == 'production' ? `../keycloak.json?t=${TIMESTAMP}` : './thirdparty/keycloak.json'
    // const permissionsUrl = "/activitystudio" + "/zsa-adapter/v1/getUserPermissionDetail"
    const bslconfigPath = NODE_ENV == 'production' ? `../bslConfig.json?t=${TIMESTAMP}` : './thirdparty/bslConfig.json'
    OPCL.login(
        Vue,
        {
            "homePath": homePath,
            "jsonFilePath": jsonFilePath,
            "clientId": clientId
        },
        {
            // 'permissionsUrl': permissionsUrl,
            'bslConfigPath': bslconfigPath,
            // 'globalAuthData': globalAuthData
        }
    ).then(res => {
        // console.log(res)

        window.app = new Vue({
            el: '#app',
            router,
            components: {
                App
            },
            template: '<App/>'
        })

    }).catch(err => {
        console.error(err)
    })
}

// window.app = new Vue({
//     el: '#app',
//     router,
//     components: {
//         App
//     },
//     template: '<App/>'
// })

