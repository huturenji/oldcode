import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const commonRouter = [
    {
        path: "/",
        name: "login",
        component: resolve => require(["modules/views/home/login.vue"], resolve),
        meta: {
            title: "登录",
            name: [],
            path: []
            // keepAlive: true,
            // breadcrumbItems: [{ title: "首页", routePath: "/home/entry" }]
        },
    },
    {
        path: "/entry",
        name: "entry",
        component: resolve => require(["modules/views/home/entry.vue"], resolve),
        meta: {
            title: "首页",
            name: [],
            path: []
            // keepAlive: true,
            // breadcrumbItems: [{ title: "首页", routePath: "/home/entry" }]
        },
    },
    {
        path: '/gather',
        component: resolve => require(['modules/views/gather/index.vue'], resolve),
        name: 'gather',
        meta: { requiresAuth: false, title: '注册纸纹' }
    },
    {
        path: '/register',
        component: resolve => require(['modules/views/register/index.vue'], resolve),
        name: 'register',
        meta: { requiresAuth: false, title: '注册纸纹', breadcrumbItems: [{ title: "首页", routePath: "/home/entry" }] }
    },
    {
        path: '/verify',
        component: resolve => require(['modules/views/verify/index.vue'], resolve),
        name: 'verify',
        meta: { requiresAuth: false, title: '核验纸纹', breadcrumbItems: [{ title: "首页", routePath: "/home/entry" }] }
    }, 
    {
        path: '/register/list',
        component: resolve => require(['modules/views/register/list.vue'], resolve),
        name: 'registerlist',
        meta: { requiresAuth: false, title: '注册列表', breadcrumbItems: [{ title: "注册列表", routePath: "/register/list" }] }
    },
    {
        path: '/*',
        component: resolve => require(['modules/views/404/404.vue'], resolve),
        name: '',
    },
]

const router = new Router({
    routes: commonRouter,
});

export default router
