import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const commonRouter = [
    {
        path: "/",
        name: "demo",
        component: resolve => require(["modules/views/index/index.vue"], resolve),
        meta: {
            title: "运营平台",
            classA: "运营平台",
            name: [],
            path: []
            // keepAlive: true,
        },
        children: [
            {
                path: "sysmgr/user",
                name: "userlist",
                component: resolve => require(["modules/views/user/userlist.vue"], resolve),
                meta: {
                    title: "用户列表",
                    classA: "用户列表",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "用户管理", routePath: "/sysmgr/user" }],
                }
            },
            {
                path: "sysmgr/useredit",
                name: "useredit",
                component: resolve => require(["modules/views/user/useredit.vue"], resolve),
                meta: {
                    title: "用户编辑",
                    classA: "用户编辑",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "用户管理", routePath: "/sysmgr/user" }, { title: "用户详情", routePath: "/sysmgr/userdetail" }, { title: "用户编辑", routePath: "/sysmgr/useredit" }],
                }
            },
            {
                path: "sysmgr/userdetail",
                name: "userdetail",
                component: resolve => require(["modules/views/user/userdetail.vue"], resolve),
                meta: {
                    title: "用户详情",
                    classA: "用户详情",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "用户管理", routePath: "/sysmgr/user" }, { title: "用户详情", routePath: "/sysmgr/userdetail" }],
                }
            },
            {
                path: "sysmgr/useradd",
                name: "useradd",
                component: resolve => require(["modules/views/user/useradd.vue"], resolve),
                meta: {
                    title: "新增用户",
                    classA: "新增用户",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "用户管理", routePath: "/sysmgr/user" }, { title: "新增用户", routePath: "/sysmgr/useradd" }],
                }
            },
            {
                path: "sysmgr/userpwd-forgot",
                name: "userpwd-forgot",
                component: resolve => require(["modules/views/user/userpwd-forgot.vue"], resolve),
                meta: {
                    title: "忘记密码",
                    classA: "忘记密码",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "忘记密码", routePath: "/sysmgr/userpwd-forgot" }],
                }
            },
            {
                path: "sysmgr/userpwd-update",
                name: "userpwd-update",
                component: resolve => require(["modules/views/user/userpwd-update.vue"], resolve),
                meta: {
                    title: "修改密码",
                    classA: "修改密码",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "修改密码", routePath: "/sysmgr/userpwd-update" }],
                }
            },

            {
                path: "sysmgr/rolelist",
                name: "rolelist",
                component: resolve => require(["modules/views/role/rolelist.vue"], resolve),
                meta: {
                    title: "角色管理",
                    classA: "角色管理",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "角色管理", routePath: "/sysmgr/rolelist" }],
                }
            },
            {
                path: "sysmgr/roledetail",
                name: "roledetail",
                component: resolve => require(["modules/views/role/roledetail.vue"], resolve),
                meta: {
                    title: "角色详情",
                    classA: "角色详情",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "角色管理", routePath: "/sysmgr/rolelist" }, { title: "角色详情", routePath: "/sysmgr/roledetail" }],
                }
            },
            {
                path: "sysmgr/roleedit",
                name: "roleedit",
                component: resolve => require(["modules/views/role/roleedit.vue"], resolve),
                meta: {
                    title: "编辑角色",
                    classA: "编辑角色",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "角色管理", routePath: "/sysmgr/rolelist" }, { title: "角色详情", routePath: "/sysmgr/roledetail" }, { title: "编辑角色", routePath: "/sysmgr/roleedit" }],
                }
            },
            {
                path: "sysmgr/roleadd",
                name: "roleadd",
                component: resolve => require(["modules/views/role/roleadd.vue"], resolve),
                meta: {
                    title: "新增角色",
                    classA: "新增角色",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "角色管理", routePath: "/sysmgr/rolelist" }, { title: "新增角色", routePath: "/sysmgr/roleadd" }],
                }
            },
            {
                path: "home/entry",
                name: "homeEntry",
                component: resolve => require(["modules/views/home/entry.vue"], resolve),
                meta: {
                    title: "首页",
                    classA: "首页",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "首页", routePath: "/home/entry" }],
                }
            },
            {
                path: "home/newlottery",
                name: "newlottery",
                component: resolve => require(["modules/views/home/new-lottery.vue"], resolve),
                meta: {
                    title: "创建抽奖活动",
                    classA: "创建抽奖活动",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "首页", routePath: "/home/entry" }, { title: "创建抽奖活动", routePath: "/home/newlottery" }],
                }
            }
            , {
                path: 'activity/list',
                component: resolve => require(['modules/views/activity/list.vue'], resolve),
                name: 'activity',
                meta: { requiresAuth: false, title: '抽奖活动列表', breadcrumbItems: [{ title: "抽奖活动列表", routePath: "/activity/list" }] }
            }
            , {
                path: 'activity/detail',
                component: resolve => require(['modules/views/activity/detail.vue'], resolve),
                name: 'activityDetail',
                meta: { requiresAuth: false, title: '抽奖活动列表', breadcrumbItems: [{ title: "抽奖活动列表", routePath: "/activity/list" }, { title: "详情", routePath: "/activity/detail" }] }
            }
            , {
                path: 'activity/winerlist',
                component: resolve => require(['modules/views/activity/winerlist.vue'], resolve),
                name: 'activityWinerlist',
                meta: { requiresAuth: true, title: '抽奖活动列表', breadcrumbItems: [{ title: "抽奖活动列表", routePath: "/activity/list" }, { title: "详情", routePath: "/activity/detail" }, { title: "中奖名单", routePath: "/activity/winerlist" }] }
            }
            , {
                path: 'activity/registeredlist',
                component: resolve => require(['modules/views/activity/registeredlist.vue'], resolve),
                name: 'registeredlist',
                meta: { requiresAuth: true, title: '抽奖活动列表', breadcrumbItems: [{ title: "抽奖活动列表", routePath: "/activity/list" }, { title: "报名用户", routePath: "/activity/registeredlist" }] }
            }            
            , {
                path: 'activity/addprize',
                component: resolve => require(['modules/views/activity/add/addprize.vue'], resolve),
                name: 'activityAddprize',
                meta: { requiresAuth: true, title: '抽奖活动列表', breadcrumbItems: [{ title: "抽奖活动列表", routePath: "/activity/list" }, { title: "详情", routePath: "/activity/detail" }, { title: "补充奖品", routePath: "/activity/addprize" }] }
            }
            , {
                path: 'activity/addsuccess',
                component: resolve => require(['modules/views/activity/add/success.vue'], resolve),
                name: 'activityAddsuccess',
                meta: { requiresAuth: true, title: '抽奖活动列表', breadcrumbItems: [{ title: "详情", routePath: "/activity/detail" }, { title: "补充奖品", routePath: "/activity/addprize" }, { title: "提交成功", routePath: "/activity/addsuccess" }] }
            }
            , {
                path: 'order/list',
                component: resolve => require(['modules/views/order/list.vue'], resolve),
                name: 'orderlist',
                meta: { requiresAuth: true, title: '订单管理', breadcrumbItems: [{ title: "订单列表", routePath: "/order/list" }] }
            },
            {
                path: 'order/detail',
                component: resolve => require(['modules/views/order/detail.vue'], resolve),
                name: 'orderdetail',
                meta: { requiresAuth: true, title: '订单管理', breadcrumbItems: [{ title: "订单列表", routePath: "/order/list" }, { title: "订单详情", routePath: "/order/detail" }] }
            }
        ]
    },
    {
        path: '/raffle/liveRaffle/manager',
        component: resolve => require(['modules/views/activity/rafflePages/liveRaffle/manager.vue'], resolve),
        name: 'liveRaffleManager',
        meta: { title: '现场抽奖管理' }
    },
    {
        path: '/raffle/liveRaffle/preview',
        component: resolve => require(['modules/views/activity/rafflePages/liveRaffle/preview.vue'], resolve),
        name: 'liveRafflePreview',
        meta: { title: '抽奖' }
    },

    {
        path: '/*',
        component: resolve => require(['modules/views/404/404.vue'], resolve),
        name: '',
    },
]

//捕获导航报错信息
const routerpush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return routerpush.call(this, location).catch(err => err)

}

const router = new Router({
    routes: commonRouter,
});

router.beforeEach((to, from, next) => {
    // console.log(to, from, next)
    if (to.path == "/" && from.path.length > 1 && from.path.startsWith("/")) {
        //如果路由导航指向首页，为了不让内容区显示空白，阻止这次导航。
        next(false)
    } else {
        //设置title
        if (to.meta.title && '' != to.meta.title) {
            document.title = to.meta.title;
        }
        // 防止由详情到补充奖品面包屑参数丢失
        if (from.path.includes('/activity/detail')) {
            let url = from.fullPath
            to.meta.breadcrumbItems && to.meta.breadcrumbItems.forEach((item) => {
                if (item.routePath.includes('/activity/detail')) {
                    item.routePath = url
                }
            })
        }
        next()
    }
})

export default router
