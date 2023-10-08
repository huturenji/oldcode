import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routers = new VueRouter({
    // mode: 'history',
    routes: [
        {
            path: '/',
            component: resolve =>require(['modules/flight/views/index/index.vue'], resolve),
            name: 'Flight_SearchHome',
            meta: {
                needAnimation:false,
                keepAlive: true,
                requiresAuth: false,
                title: '机票',
                pageType: 'entry'
            }
        },
        // {
        //     path: '/flight/flightList',
        //     component: resolve =>require(['modules/flight/views/flightList/indexFlightList.vue'], resolve),
        //     name: 'Flight_FlightList',
        //     meta: {
        //     needAnimation:true,
        //         keepAlive: true,
        //         requiresAuth: false,
        //         title: '航班列表',
        //     }
        // },
        {
            path: '/list',
            component: resolve =>require(['modules/flight/views/flightList/indexFlightList.vue'], resolve),
            name: 'Flight_FlightList',
            meta: {
                needAnimation:true,
                keepAlive: true,
                requiresAuth: false,
                title: '航班列表'
            }
        },
        // {
        //     path: '/flight/cabinList',
        //     component: resolve =>require(['modules/flight/views/flightList/cabinList.vue'], resolve),
        //     name: 'Flight_CabinList',
        //     meta: {
        //     needAnimation:true,
        //         keepAlive: true,
        //         requiresAuth: false,
        //     }
        // },
        {
            path: '/detail',
            component: resolve =>require(['modules/flight/views/flightList/cabinList.vue'], resolve),
            name: 'Flight_CabinList',
            meta: {
                needAnimation:true,
                keepAlive: true,
                requiresAuth: false
            }
        },
        {
            path: '/shihui',
            component: resolve =>require(['modules/flight/views/shihui/index.vue'], resolve),
            name: 'Flight_shuihui',
            meta: {
                needAnimation:true,
                keepAlive: true,
                requiresAuth: false,
                title: '实惠介绍'
            }
        },
        // {
        //     path: '/flight/orderConfirm',
        //     component: resolve =>require(['modules/flight/views/orderConfirm/indexOrderConfirm.vue'], resolve),
        //     name: 'Flight_OrderConfirm',
        //     meta: {
        //     needAnimation:true,
        //         keepAlive: false,
        //         requiresAuth: true,
        //     }
        // },
        {
            path: '/order/confirm',
            component: resolve =>require(['modules/flight/views/orderConfirm/indexOrderConfirm.vue'], resolve),
            name: 'Flight_OrderConfirm',
            meta: {
                needAnimation:true,
                keepAlive: false,
                requiresAuth: true
            }
        },
        // {
        //     path: '/flight/endorseConfirm',
        //     component: resolve =>require(['modules/flight/views/orderConfirm/endorseConfirm.vue'], resolve),
        //     name: 'Flight_EndorseConfirm',
        //     meta: {
        //         needAnimation:true,
        //         keepAlive: false,
        //         requiresAuth: true,
        //         title: '申请改签'
        //     }
        // },
        {
            path: '/endorse',
            component: resolve =>require(['modules/flight/views/orderConfirm/endorseConfirm.vue'], resolve),
            name: 'Flight_EndorseConfirm',
            meta: {
                needAnimation:true,
                keepAlive: false,
                requiresAuth: true,
                title: '申请改签'
            }
        },
        // {
        //     path: '/flight/orderDetail',
        //     component: resolve =>require(['modules/transferPage/views/orderDetail.vue'], resolve),
        //     name: 'Flight_OrderDetail',
        //     meta: {
        //         needAnimation:true,
        //         requiresAuth: false,
        //         title: '订单详情'
        //     }
        // },
        {
            path: '/404',
            component: resolve =>require(['modules/flight/views/404.vue'], resolve),
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
