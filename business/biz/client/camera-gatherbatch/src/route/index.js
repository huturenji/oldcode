import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const commonRouter = [
    {
        path: "/",
        name: "home",
        component: resolve => require(["modules/views/home.vue"], resolve),
        meta: {
            title: "纸纹标签批量注册系统",
            name: [],
            path: []
        },
    },

    {
        path: '/gather',
        component: resolve => require(['modules/views/gather/index.vue'], resolve),
        name: 'gather',
        meta: { requiresAuth: false, title: 'check' }
    },
    {
        path: '/check',
        component: resolve => require(['modules/views/check/list/index.vue'], resolve),
        name: 'check',
        meta: { requiresAuth: false, title: '纸纹标签审核' },
    },
    {
        path: '/check/detail',
        component: resolve => require(['modules/views/check/detail/index.vue'], resolve),
        name: 'detail',
        meta: { requiresAuth: false, title: '纸纹标签详情' },
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
