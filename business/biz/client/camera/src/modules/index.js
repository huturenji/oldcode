
import Vue from 'vue'
import router from 'approuter/index.js'
import App from './index.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
//TODO import {install as installTilterBar} from '@/modules/common/components/titleBar/index.js'; 
// installTilterBar();//自定义title


window.app = new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    template: '<App/>'
})



