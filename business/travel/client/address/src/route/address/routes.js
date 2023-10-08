import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routers = new VueRouter({
    routes: [
        {
            path: '/',
            component: resolve => require(['modules/address/views/addressCard.vue'], resolve),
            name: '',
            meta: {
                needAnimation: true,
                keepAlive: false,
                requiresAuth: false,
                title: '地址管理',
                pageType: 'entry'
            }
        },
        {
            path: '/404',
            component: resolve => require(['modules/home/views/404.vue'], resolve),
            name: ''
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    x: 0,
                    y: 0
                })
            }, 10)
        })
    }
});
export default routers;
