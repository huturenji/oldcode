import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routers = new VueRouter({
    // mode: 'history',
    routes: [
		{
		    path: '/',
		    component: resolve =>require(['modules/express/views/expressServer/kuaidi100.vue'], resolve),
		    name: 'express',
		    meta: {
		    	needAnimation:true,
		        keepAlive: true,                        
		        requiresAuth: false,
		        title: '',
				pageType: 'entry',
		    },
		},
		{
		    path: '/kuaidi100',
		    component: resolve =>require(['modules/express/views/expressServer/kuaidi100.vue'], resolve),
		    name: 'query',
		    meta: {
		    	needAnimation:true,
		        keepAlive: false,                        
		        requiresAuth: false,
		        title: '快递查询'
		    },
		},
		{
		    path: '/third',
		    component: resolve =>require(['modules/express/views/query/query.vue'], resolve),
		    name: 'query',
		    meta: {
		    	needAnimation:true,
		        keepAlive: false,                        
		        requiresAuth: false,
		        title: '快递查询'
		    },
		},
		{
		    path: '/sample',
		    component: resolve =>require(['modules/express/views/reimburse/sample.vue'], resolve),
		    name: 'sample',
		    meta: {
		    	needAnimation:true,
		        keepAlive: false,                        
		        requiresAuth: false,
		        title: '报销凭证'
		    },
		},
		{
		    path: '/invoice/flight',
		    component: resolve =>require(['modules/express/views/reimburse/reimburseDetail.vue'], resolve),
		    name: 'reimburseDetail',
		    meta: {
		    	needAnimation:true,
		        keepAlive: false,                        
		        requiresAuth: false,
		        title: '报销凭证'
		    },
		},
		{
		    path: '/express',
		    component: resolve =>require(['modules/express/views/expressServer/kuaidi100.vue'], resolve),
		    name: 'express',
		    meta: {
		    	needAnimation:true,
		        keepAlive: true,                        
		        requiresAuth: false,
		        title: '',
				pageType: 'entry',
		    },
		},
		{
		    path: '/query',
		    component: resolve =>require(['modules/express/views/expressServer/queryExpress.vue'], resolve),
		    name: 'queryExpress',
		    meta: {
		    	needAnimation:true,
		        keepAlive: true,                        
		        requiresAuth: false,
		        title: '查快递'
		    },
		},
		{
		    path: '/order/confirm',
		    component: resolve =>require(['modules/express/views/expressServer/order.vue'], resolve),
		    name: 'order',
		    meta: {
		    	needAnimation:true,
		        keepAlive: false,                        
		        requiresAuth: false,
		        title: '寄件'
		    },
		},
		{
		    path: '/detail/order',
		    component: resolve =>require(['modules/express/views/expressServer/orderDetail.vue'], resolve),
		    name: 'orderDetail',
		    meta: {
		    	needAnimation:true,
		        keepAlive: false,                        
		        requiresAuth: false,
		        title: '订单详情'
		    },
		},
		{
		    path: '/detail/express',
		    component: resolve =>require(['modules/express/views/expressServer/expressDetail.vue'], resolve),
		    name: 'expressDetail',
		    meta: {
		    	needAnimation:true,
		        keepAlive: false,                        
		        requiresAuth: false,
		        title: '物流详情'
		    },
		},
		{
		    path: '/404',
		    component: resolve =>require(['modules/express/views/expressServer/404.vue'], resolve),
		    name: '404',
		    meta: {
		    	needAnimation:true,
		        keepAlive: false,                        
		        requiresAuth: false,
		        title: ''
		    },
		},
    ],
	scrollBehavior (to, from, savedPosition) {
	  return new Promise((resolve, reject) => {
	    setTimeout(() => {
	      resolve({ x: 0, y: 0 })
	    }, 10)
	  })
	}
});
export default routers;