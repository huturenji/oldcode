import Vue from 'vue'
import Router from 'vue-router'

Router.prototype.goBack = function () {
    this.isBack = true
    window.history.go(-1)
}
Vue.use(Router)
const router = new Router({
    routes: [{
        path: '/',
        redirect: '/mainane',
    },
    {
        path: "/mainane",
        name: "mainane",
        component: resolve => (require(["modules/views/mainane.vue"], resolve)),
        meta: {
            title: "运维配置",
            classA: "运维配置",
            name: ['运维配置'],
            path: ['/']
        }

    },
    {
        path: "/channellist",
        name: "channellist",
        component: resolve => (require(["modules/views/channel/list.vue"], resolve)),
        meta: {
            title: "渠道配置管理",
            classA: "渠道管理",
            name: ['运维配置', '渠道配置'],
            path: ['/'],
            keepAlive: true
        }

    },
    {
        path: "/addChannel",
        name: "addChannel",
        component: resolve => (require(["modules/views/channel/add.vue"], resolve)),
        meta: {
            title: "渠道配置管理",
            classA: "渠道管理",
            name: ['运维配置', '渠道配置', "新建渠道"],
            path: ['/', '/channellist']
        }
    },
    {
        path: "/channeldetail",
        name: "channeldetail",
        component: resolve => (require(["modules/views/channel/detail.vue"], resolve)),
        meta: {
            title: "渠道配置管理",
            classA: "渠道管理",
            name: ['运维配置', '渠道配置', "渠道接入详情"],
            path: ['/', '/channellist']
        }
    },
    {
        path: "/channeledit",
        name: "channeledit",
        component: resolve => (require(["modules/views/channel/edit.vue"], resolve)),
        meta: {
            title: "渠道配置管理",
            classA: "渠道管理",
            name: ['运维配置', '渠道配置', "编辑渠道"],
            path: ['/', '/channellist']
        }
    },
    {
        path: "/powermange",
        name: "powermange",
        component: resolve => (require(["modules/views/auth/list.vue"], resolve)),
        meta: {
            title: "权限配置",
            classA: "权限配置",
            name: ['运维配置', '权限配置'],
            path: ['/']
            // keepAlive: true,
        }
    },
    {
        path: "/authImport",
        name: "authImport",
        component: resolve => (require(["modules/views/auth/edit.vue"], resolve)),
        meta: {
            title: "导入权限",
            classA: "导入权限",
            name: ['运维配置', '权限配置', '导入权限'],
            path: ['/', '/powermange']
            // keepAlive: true,
        }
    },    
    ],

});

export default router
