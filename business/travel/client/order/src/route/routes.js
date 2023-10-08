import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routers = new VueRouter({
    // mode: 'history',
    routes: [
        {
            path: '/',
            component: resolve => require(['modules/views/myOrder/home.vue'], resolve),
            name: '',
            meta: {
                requiresAuth: true,
                keepAlive: true,
                title: '我的订单'
            },
            children:[
                {
                    path: '',
                    component: resolve =>require(['modules/views/myOrder/indexOrder/wrapperIndexOrder.vue'], resolve),
                    name: 'MyOrder_listIndex',
                    meta: {
                        keepAlive: true,
                        requiresAuth: false,
                        title: '我的订单',
                        pageType: 'entry'
                    }
                }
            ]
        },
        {
            path: '/exportOrderList',
            component: resolve => require(['modules/views/myOrder/exportOrderList/index.vue'], resolve),
            name: '',
            meta: {
                requiresAuth: true,
                keepAlive: true,
                title: '商旅订单'
            }
        },
        {
            path: '/export',
            component: resolve => require(['modules/views/myOrder/exportOrderList/index.vue'], resolve),
            name: '',
            meta: {
                requiresAuth: true,
                keepAlive: true,
                title: '商旅订单'
            }
        },
        {
            path: '/mine',
            component: resolve => require(['modules/views/myOrder/indexOrder/indexOrder.vue'], resolve),
            name: '',
            meta: {
                requiresAuth: true,
                keepAlive: true,
                title: ''
            }
        },
        {
            path: '/mine/:payStatus',
            component: resolve => require(['modules/views/myOrder/indexOrder/indexOrder.vue'], resolve),
            name: '',
            meta: {
                requiresAuth: false,
                title: '我的订单'
            }
        },
        // {
        //     path: '/',
        //     component: resolve =>require(['modules/orderDetail/views/index.vue'], resolve),
        //     name: '',
        //     meta: {
        //     needAnimation:true,
        //         requiresAuth: false,
        //         title: '订单详情'
        //     }
        // },
        {
            path: '/flight/orderDetail',
            component: resolve =>require(['modules/views/orderDetail/flight/orderDetail/indexOrderDetail.vue'], resolve),
            name: 'Flight_OrderDetail',
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '订单详情'
            }
        },
        {
            path: '/detail/flight',
            component: resolve =>require(['modules/views/orderDetail/flight/orderDetail/indexOrderDetail.vue'], resolve),
            name: 'Flight_OrderDetail2',
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '订单详情'
            }
        },
        {
            path: '/refund/flight',
            component: resolve =>require(['modules/views/orderDetail/flight/orderDetail/refundMoneyDetail.vue'], resolve),
            name: 'Flight_refundMoneyDetail',
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '退款明细'
            }
        },
        {
            path: '/insurances/flight',
            component: resolve =>require(['modules/views/orderDetail/flight/insurancesList/insurancesList.vue'], resolve),
            name: 'Flight_InsurancesList',
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '出行保险'
            }
        },
        {
            path: '/suc/flight',
            component: resolve =>require(['modules/views/orderDetail/flight/orderSuc/orderSuc.vue'], resolve),
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '结果'
            }
        },
        {
            path: '/train/orderDetail',
            component: resolve =>require(['modules/views/orderDetail/train/orderDetail/indexOrderDetail.vue'], resolve),
            name: 'Train_OrderDetail',
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '订单详情'
            }
        },
        {
            path: '/detail/train',
            component: resolve =>require(['modules/views/orderDetail/train/orderDetail/indexOrderDetail.vue'], resolve),
            name: 'Train_OrderDetail2',
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '订单详情'
            }
        },
        {
            path: '/suc/train',
            component: resolve =>require(['modules/views/orderDetail/train/orderSuc/orderSuc.vue'], resolve),
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '结果'
            }
        },
        {
            path: '/hotel/orderDetail',
            component: resolve =>require(['modules/views/orderDetail/hotel/orderDetail/indexOrderDetail.vue'], resolve),
            name: 'Hotel_OrderDetail',
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '订单详情'
            }
        },
        {
            path: '/detail/hotel',
            component: resolve =>require(['modules/views/orderDetail/hotel/orderDetail/indexOrderDetail.vue'], resolve),
            name: 'Hotel_OrderDetail2',
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '订单详情'
            }
        },
        {
            path: '/suc/hotel',
            component: resolve =>require(['modules/views/orderDetail/hotel/orderSuc/orderSuc.vue'], resolve),
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '结果'
            }
        },
        {
            path: '/detail/car',
            component: resolve =>require(['modules/views/orderDetail/car/orderDetail/indexOrderDetail.vue'], resolve),
            name: 'Car_OrderDetail',
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '订单详情'
            }
        },
        {
            path: '/suc/car',
            component: resolve =>require(['modules/views/orderDetail/car/orderSuc/orderSuc.vue'], resolve),
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '结果'
            }
        },
        {
            path: '/miniprogram/pay/result',
            component: resolve =>require(['modules/views/orderDetail/miniprogram/pay/result.vue'], resolve),
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '支付结果'
            }
        },
        {
            path: '/404',
            component: resolve =>require(['modules/common/404.vue'], resolve),
            name: ''
        }
    ],
    /* eslint-disable */
    scrollBehavior (to, from, savedPosition) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ x: 0, y: 0 })
            }, 10)
        })
    }
    /* eslint-enable */
});
export default routers;
