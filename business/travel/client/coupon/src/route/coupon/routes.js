import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routers = new VueRouter({
    routes: [ 
        {
            path: '/',
            component: resolve =>require(['modules/coupon/views/cashcoupon/list.vue'], resolve),
            name: '',
            meta: {
                needAnimation:false,
                keepAlive: false,
                requiresAuth: true,
                title: '我的代金券',
                pageType: 'entry'
            }
        },
        {
            path: '/cashcoupon/list',
            component: resolve => require(['modules/coupon/views/cashcoupon/list.vue'], resolve),
            name: 'couponList',
            meta: {
                needAnimation: true,
                keepAlive: false,
                requiresAuth: false,
                title: '我的代金券'
            }
        },
        {
            path: '/cashcoupon/history',
            component: resolve => require(['modules/coupon/views/cashcoupon/history.vue'], resolve),
            name: 'couponList',
            meta: {
                needAnimation: true,
                keepAlive: false,
                requiresAuth: false,
                title: '历史代金券'
            }
        },
        {
            path: '/404',
            component: resolve => require(['modules/home/views/404.vue'], resolve),
            name: ''
        }
    ],
    scrollBehavior() {
        return new Promise((resolve) => {
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
