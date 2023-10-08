import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routers = new VueRouter({
    // mode: 'history',
    routes: [{
        path: '/',
        component:  resolve =>require(['modules/passenger/views/index/index.vue'], resolve),
        name: '',
        meta: {
            needAnimation:false,
            requiresAuth: false,
            title: '乘客管理',
            pageType: 'entry'
        }
    },  
 
    {
        path: '/404',
        component: resolve =>require(['modules/passenger/home/404.vue'], resolve),
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