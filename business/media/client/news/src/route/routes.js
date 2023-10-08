import Vue from 'vue';
import VueRouter from 'vue-router';
import indexSkeleton from 'modules/views/index/indexSkeleton.vue'

Vue.use(VueRouter)
const routers = new VueRouter({
    routes: [
        { 
            path: '/',
            component: indexSkeleton,
            name: 'index',
            meta: {
                needAnimation:false,
                keepAlive: true,
                title: '资讯',
                pageType: 'entry'
            }
        },         
        { 
            path: '/article',
            component: resolve =>require(['modules/views/article/index.vue'], resolve), 
            name: 'article',
            meta: {
                needAnimation:false,
                keepAlive: false,
                title: '资讯详情'
            }
        },          
        { 
            path: '/shareArticle',
            component: resolve =>require(['modules/views/article/index.vue'], resolve), 
            name: 'shareArticle',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '资讯详情'
            }
        }, 	        
        { 
            path: '/report',
            component: resolve =>require(['modules/views/report/index.vue'], resolve), 
            name: 'report',
            meta: {
                needAnimation:false,
                keepAlive: false,
                title: '举报内容'
            }
        }, 
        { 
            path: '/search',
            component: resolve =>require(['modules/views/search/index.vue'], resolve),
            name: 'search',
            meta: {
                needAnimation:false,
                keepAlive: false,
                title: '资讯'
            }
        }, 	
        { 
            path: '/channel',
            component: resolve =>require(['modules/views/channel/index.vue'], resolve),
            name: 'channel',
            meta: {
                needAnimation:false,
                keepAlive: false,
                title: '自定义频道'
            }
        }, 	
        { 
            path: '/personal',
            component: resolve =>require(['modules/views/personal/index.vue'], resolve),
            name: 'personal',
            meta: {
                needAnimation:false,
                keepAlive: false,
                title: '我的',
                pageType: 'entry'
            }
        }, 	
        { 
            path: '/industry',
            component: resolve =>require(['modules/views/industry/index.vue'], resolve),
            name: 'industry',
            meta: {
                needAnimation:false,
                keepAlive: true,
                title: '全部行业资源'
            }
        }, 	
        { 
            path: '/searchIndustry',
            component: resolve =>require(['modules/views/searchIndustry/index.vue'], resolve),
            name: 'searchIndustry',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '全部行业资源'
            }
        }, 	
        { 
            path: '/favorite',
            component: resolve =>require(['modules/views/favorite/index.vue'], resolve),
            name: 'favorite',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '我的收藏',
                pageType: 'entry'
                // showTitleBar: true, //是否显示顶部的title
            }
        }, 	
        { 
            path: '/like',
            component: resolve =>require(['modules/views/like/index.vue'], resolve),
            name: 'like',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '我的点赞',
                pageType: 'entry'
                // showTitleBar: true, //是否显示顶部的title
            }
        }, 	
        { 
            path: '/readHistory',
            component: resolve =>require(['modules/views/readHistory/index.vue'], resolve),
            name: 'readHistory',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '阅读历史',
                pageType: 'entry'
                // showTitleBar: true, //是否显示顶部的title
            }
        }, 	 	
        { 
            path: '/readingRoom',
            component: resolve =>require(['modules/views/readingRoom/index.vue'], resolve),
            name: 'readingRoom',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '悦览室',
                pageType: 'entry'
                // showTitleBar: true, //是否显示顶部的title
            }
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