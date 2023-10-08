import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routers = new VueRouter({
    // mode: 'history',
    routes: [
        {
            path: '/',
            component: resolve => require(['modules/orderManagement/company/views/orderManage/orderManage.vue'], resolve),
            name: 'dataStatistics',
            meta: {
                requiresAuth: false,
                keepAlive: true,
                title: '',
                pageType: 'entry'
            }
        },
        {
            path: '/company/dataStatistics',
            component: resolve => require(['modules/orderManagement/company/views/orderManage/orderManage.vue'], resolve),
            name: 'dataStatistics',
            meta: {
                requiresAuth: false,
                keepAlive: true,
                title: '',
                pageType: 'entry'
            }
        },
        {
            path: '/order/refundorpay',
            component: resolve => require(['modules/orderManagement/company/views/orderManage/refundOrPayList.vue'], resolve),
            name: 'refundOrPayList',
            meta: {
                needAnimation: true,
                requiresAuth: false,
                keepAlive: false,
                title: ''
            }
        },


        // {
        //     path: '/order/mine',    骨架屏暂时没有用
        //     component: resolve => require(['modules/orderManagement/myOrder/views/home.vue'], resolve),
        //     name: '',
        //     meta: {
        //         requiresAuth: true,
        //         keepAlive: true,
        //         title: '我的订单',
        //     },
        //     children:[
        //       {
        //         path: '',
        //         component: resolve =>require(['modules/orderManagement/myOrder/views/indexOrder/wrapperIndexOrder.vue'], resolve),
        //         name: 'MyOrder_listIndex',
        //         meta: {
        //           keepAlive: true,
        //           requiresAuth: false,
        //           title: '我的订单',
        //             pageType: 'entry',
        //         },
        //       }
        //     ]
        // },

        {
            path: '/order/mine',
            component: resolve => require(['modules/orderManagement/myOrder/views/indexOrder/indexOrder.vue'], resolve),
            name: '',
            meta: {
                requiresAuth: true,
                keepAlive: true,
                title: ''
            }
        },
        {
            path: '/order/mine/:payStatus',
            component: resolve => require(['modules/orderManagement/myOrder/views/indexOrder/indexOrder.vue'], resolve),
            name: '',
            meta: {
                requiresAuth: false,
                title: '我的订单'
            }
        },
        {
            path: '/order/detail/flight/pc',
            component: resolve => require(['modules/orderManagement/myOrder/viewsPC/orderDetail/flightOrderDetail.vue'], resolve),
            name: '',
            meta: {
                requiresAuth: false,
                title: '机票详情'
            }
        },
        {
            path: '/order/detail/train/pc',
            component: resolve => require(['modules/orderManagement/myOrder/viewsPC/orderDetail/trainOrderDetail.vue'], resolve),
            name: '',
            meta: {
                requiresAuth: false,
                title: '火车票详情'
            }
        },
        {
            path: '/order/detail/hotel/pc',
            component: resolve => require(['modules/orderManagement/myOrder/viewsPC/orderDetail/hotelOrderDetail.vue'], resolve),
            name: '',
            meta: {
                requiresAuth: false,
                title: '酒店详情'
            }
        },
        {
            path: '/order/export',
            component: resolve => require(['modules/orderManagement/myOrder/viewsPC/orderReport/exportReport.vue'], resolve),
            name: '',
            meta: {
                requiresAuth: false,
                title: '订单明细'
            }
        },


        // {
        //   path: '/',     小地址没有这个路由
        //   component: resolve =>require(['modules/orderManagement/orderDetail/views/index.vue'], resolve),
        //   name: '',
        //   meta: {
        //     needAnimation:true,
        //       requiresAuth: false,
        //       title: '订单详情'
        //   }
        // },
        {
            path: '/order/detail/flight/app',
            component: resolve =>require(['modules/orderManagement/orderDetail/views/flight/orderDetail/indexOrderDetail.vue'], resolve),
            name: 'Flight_OrderDetail',
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '订单详情'
            }
        },
        {
            path: '/order/refund/flight',
            component: resolve =>require(['modules/orderManagement/orderDetail/views/flight/orderDetail/refundMoneyDetail.vue'], resolve),
            name: 'Flight_refundMoneyDetail',
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '退款明细'
            }
        },
        {
            path: '/order/suc/flight',
            component: resolve =>require(['modules/orderManagement/orderDetail/views/flight/orderSuc/orderSuc.vue'], resolve),
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '结果'
            }
        },
        {
            path: '/order/detail/train/app',
            component: resolve =>require(['modules/orderManagement/orderDetail/views/train/orderDetail/indexOrderDetail.vue'], resolve),
            name: 'Train_OrderDetail',
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '订单详情'
            }
        },
        {
            path: '/order/suc/train',
            component: resolve =>require(['modules/orderManagement/orderDetail/views/train/orderSuc/orderSuc.vue'], resolve),
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '结果'
            }
        },
        {
            path: '/order/detail/hotel/app',
            component: resolve =>require(['modules/orderManagement/orderDetail/views/hotel/orderDetail/indexOrderDetail.vue'], resolve),
            name: 'Hotel_OrderDetail',
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '订单详情'
            }
        },
        {
            path: '/order/suc/hotel',
            component: resolve =>require(['modules/orderManagement/orderDetail/views/hotel/orderSuc/orderSuc.vue'], resolve),
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '结果'
            }
        },
        {
            path: '/order/detail/car/app',
            component: resolve =>require(['modules/orderManagement/orderDetail/views/car/orderDetail/indexOrderDetail.vue'], resolve),
            name: 'Car_OrderDetail',
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '订单详情'
            }
        },
        {
            path: '/order/suc/car',
            component: resolve =>require(['modules/orderManagement/orderDetail/views/car/orderSuc/orderSuc.vue'], resolve),
            meta: {
                needAnimation:true,
                requiresAuth: false,
                title: '结果'
            }
        },

        {
            path: '/*',
            component: resolve => require(['modules/orderManagement/common/404.vue'], resolve),
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
