
import Vue from 'vue'
import router from 'route/index.js'
import App from './index.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

window.app = new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    template: '<App/>'
})

