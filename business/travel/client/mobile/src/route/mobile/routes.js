import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routers = new VueRouter({
    // mode: 'history',
    routes: [
        {
            path: '/',
            component: resolve =>require(['modules/mobile/views/index/index.vue'], resolve),
            name: 'home',
            meta: {
                needAnimation:false,
                keepAlive: true,
                requiresAuth: false,
                title: '出行',
                pageType: 'entry'
            }
        },
        {
            path: '/404',
            component: resolve =>require(['modules/mobile/views/404.vue'], resolve),
            name: ''
        }
    ],
    // eslint-disable-next-line no-unused-vars
    scrollBehavior (to, from, savedPosition) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ x: 0, y: 0 })
            }, 10)
        })
    }
});
export default routers;
