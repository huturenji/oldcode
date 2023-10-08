import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)
const routers = new VueRouter({
    routes: [
        {
            path: '/',
            component: resolve =>require(['modules/trip/views/tripList/tripList.vue'], resolve),
            name: '',
            meta: {
                keepAlive: false,
                requiresAuth: false,
                title: '',
                pageType: 'entry'
            }
        },     
        {
            path: '/his',
            component: resolve =>require(['modules/trip/views/tripHistoryList/tripHistoryList.vue'], resolve),
            name: 'his',
            meta: {
                requiresAuth: false,
                title: '历史行程'
            }
        },
        {
            path: '/excess',
            component: resolve =>require(['modules/trip/views/tripExcess/tripExcess.vue'], resolve),
            name: 'tripExcess',
            meta: {
                requiresAuth: false
            }
        },
        {
            path: '/404',
            component: resolve => require(['modules/home/views/404.vue'], resolve),
            name: ''
        }
    ],
    scrollBehavior () {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ x: 0, y: 0 })
            }, 10)
        })
    }
});
export default routers;
