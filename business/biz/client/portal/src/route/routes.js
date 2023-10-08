import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)
const routers = new VueRouter({
    routes: [
        { 
            path: '/voucher',
            component: resolve =>require(['modules/views/dispatch/voucher/index.vue'], resolve),
            name: 'dispatchVoucher',
        },   
        { 
            path: '/voucher/receive',
            component: resolve =>require(['modules/views/dispatch/voucher/receive.vue'], resolve),
            name: 'voucherReceive',
        },  
        { 
            path: '/voucher/brief',
            component: resolve =>require(['modules/views/dispatch/voucher/brief.vue'], resolve),
            name: 'voucherBrief',
        },  
        { 
            path: '/preventRender',
            component: resolve =>require(['modules/views/preventRender/index.vue'], resolve),
            name: 'preventRender',
        },  
        {
            path: '/404',
            component: resolve =>require(['modules/views/404.vue'], resolve),
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