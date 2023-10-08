import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routers = new VueRouter({
    // mode: 'history',
    routes: [
        {
            path: '/',
            component: resolve =>require(['modules/hotel/views/index/index.vue'], resolve),
            name: 'HotelHome',
            meta: {
                needAnimation:false,
                keepAlive: false,                        
                requiresAuth: false,
                title: '酒店',
                pageType: 'entry'
            }
        },
        {
            path: '/list',
            component: resolve =>require(['modules/hotel/views/hotelList/indexHotelList.vue'], resolve),
            name: 'HotelList',
            meta: {
                needAnimation:true,
                keepAlive: true,                        
                requiresAuth: false,
                title: '酒店列表'
            }
        },
        {
            path: '/detail',
            component: resolve =>require(['modules/hotel/views/hotelDetail/indexHotelDetail.vue'], resolve),
            name: 'HotelDetail',
            meta: {
                needAnimation:true,
                keepAlive: true,
                requiresAuth: false,
                title: '酒店详情'
            }
        },
        {
            path: '/order/confirm',
            component: resolve =>require(['modules/hotel/views/order/order.vue'], resolve),
            name: 'HotelOrder',
            meta: {
                needAnimation:true,
                keepAlive: false,
                requiresAuth: false,
                title: '编辑订单'
            }
        },
        {
            path: '/comments',
            component: resolve =>require(['modules/hotel/views/comments/indexComments.vue'], resolve),
            name: 'Comments',
            meta: {
                needAnimation:true,
                keepAlive: false,
                requiresAuth: false,
                title: '酒店点评'
            }
        },
        {
            path: '/img',
            component: resolve =>require(['modules/hotel/views/hotelImgList/indexHotelImgList.vue'], resolve),
            name: 'HotelImgList',
            meta: {
                needAnimation:true,
                keepAlive: false,
                requiresAuth: false,
                title: '查看图片'
            }
        },
        {
            path: '/introduction',
            component: resolve =>require(['modules/hotel/views/introduction/indexIntroduction.vue'], resolve),
            name: 'Introduction',
            meta: {
                needAnimation:true,
                keepAlive: false,
                requiresAuth: false,
                title: '酒店介绍'
            }
        },
        {
            path: '/addr',
            component: resolve =>require(['modules/hotel/views/map/indexMap.vue'], resolve),
            name: 'Map',
            meta: {
                needAnimation:true,
                keepAlive: false,
                requiresAuth: false,
                title: '酒店地址'
            }
        },  
        {
            path: '/recommend',
            component: resolve =>require(['modules/hotel/views/recommendList/recommendList.vue'], resolve),
            name: 'recommendList',
            meta: {
                needAnimation:true,
                keepAlive: false,
                requiresAuth: false,
                title: '相似酒店'
            }
        },
        {
            path: '/404',
            component: resolve =>require(['modules/hotel/views/home/404.vue'], resolve),
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