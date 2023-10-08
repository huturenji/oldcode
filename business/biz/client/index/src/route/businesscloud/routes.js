import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter)
const routers = new VueRouter({
    routes: [	
        { 
            path: '/',
            component: resolve =>require(['modules/businesscloud/views/index/index.vue'], resolve),
            name: '',
            meta: {
                needAnimation:false,
                keepAlive: false,
                title: '商云',
            },
        },
        {
            path: '/404',
            component: resolve =>require(['modules/businesscloud/views/404.vue'], resolve),
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