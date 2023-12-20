import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const commonRouter = [
    {
        path: "/",
        name: "gather",
        component: resolve => require(["modules/views/gather/index.vue"], resolve),
        meta: {
            title: "注册",
            name: [],
            path: []
        },
    },

    {
        path: '/gather',
        component: resolve => require(['modules/views/gather/index.vue'], resolve),
        name: 'gather',
        meta: { requiresAuth: false, title: '注册纸纹' }
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
