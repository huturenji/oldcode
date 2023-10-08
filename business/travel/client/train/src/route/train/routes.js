import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)
const routers = new VueRouter({
    // mode: 'history',
    routes: [	
		{
		    path: '/',
		    component: resolve =>require(['modules/train/views/home.vue'], resolve),
		    name: 'Train_Home',
		    meta: {
		    	needAnimation:false,
		        keepAlive: true,
		        requiresAuth: false,
                title: '火车票',
                pageType: 'entry'
		    },
			
        },                        
        {
            path: '/list',
            component: resolve =>require(['modules/train/views/trainList/indexTrainList.vue'], resolve),
            name: 'Train_TrainList',
            meta: {
            	needAnimation:true,
                keepAlive: true,
                requiresAuth: false,
                title: '火车列表'
            }
        },
        {
            path: '/detail',
            component: resolve =>require(['modules/train/views/trainTimes/trainTimes.vue'], resolve),
            name: 'Train_TrainTimes',
            meta: {
            	needAnimation:true,
                keepAlive: false,
                requiresAuth: false,
                title: '车次详情'
            }
        },        
        {
            path: '/order/confirm',
            component: resolve =>require(['modules/train/views/orderConfirm/indexOrderConfirm.vue'], resolve),
            name: 'Train_OrderConfirm',
            meta: {
            	needAnimation:true,
                keepAlive: false,
                requiresAuth: true,
                title: '编辑订单'
            }
        },             
        {
            path: '/suc',
            component: resolve =>require(['modules/train/views/orderSuc/orderSuc.vue'], resolve),
            name: 'Train_OrderSuc',
            meta: {
                needAnimation:true,
                keepAlive: false,
                requiresAuth: false,
                title: '结果'
            }
        },           
        {
            path: '/login/12306',
            component: resolve =>require(['modules/train/views/login/login.vue'], resolve),
            name: 'Train_Login',
            meta: {
                needAnimation:true,
                keepAlive: false,
                requiresAuth: false,
                title: '登录12306'
            }
        },           
        {
          path: '/endorse',
          component: resolve =>require(['modules/train/views/changeTrainTickets/changeTrainTickets.vue'], resolve),
          name: 'Train_ChangeTrainTickets',
          meta: {
              needAnimation:true,
              keepAlive: false,
              requiresAuth: false,
              title: '申请改签'
          }
        },
        {
          path: '/endorse/confirm',
          component: resolve =>require(['modules/train/views/changeTrainTickets/confirmChangeTickets.vue'], resolve),
          name: 'Train_ConfirmChangeTickets',
          meta: {
              needAnimation:true,
              keepAlive: false,
              requiresAuth: false,
              title: '申请改签'
          }
        },
        {
            path: '/refund',
            component: resolve =>require(['modules/train/views/refundDetail/refundDetail.vue'], resolve),
            name: 'Train_RefundDetail',
            meta: {
            	needAnimation:true,
                keepAlive: false,
                requiresAuth: false,
                title: '退票详情'
            }
        },
        {
            path: '/regression',
            component: resolve =>require(['modules/train/views/regression/regression.vue'], resolve),
            name: 'Train_Regression',
            meta: {
            	needAnimation:true,
                keepAlive: false,
                requiresAuth: false,
                title: '退改进度'
            }
        }, 
        {
            path: '/404',
            component: resolve =>require(['trainComponents/home/404.vue'], resolve),
            name: '',
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