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
                path: "order/list",
                name: "orderlist",
                component: resolve => require(["modules/views/order/list.vue"], resolve),
                meta: {
                    title: "订单管理",
                    classA: "订单管理",
                    keepAlive: true,
                    breadcrumbItems: [{ title: "订单管理", routePath: "/order/list" }],
                }
            },
            {
                path: "order/detail",
                name: "orderlist",
                component: resolve => require(["modules/views/order/detail.vue"], resolve),
                meta: {
                    title: "详情",
                    classA: "详情",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "订单管理", routePath: "/order/list" }, { title: "详情", routePath: "/order/detail" }],
                }
            },
            {
                path: "order/preview",
                name: "orderlist",
                component: resolve => require(["modules/views/order/preview.vue"], resolve),
                meta: {
                    title: "查看附件",
                    classA: "查看附件",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "订单管理", routePath: "/order/list" }, { title: "详情", routePath: "/order/detail" }, { title: "查看附件", routePath: "/order/preview" }],
                }
            },
            {
                path: "goods/pool",
                name: "goodspool",
                component: resolve => require(["modules/views/goods/index.vue"], resolve),
                meta: {
                    title: "商品池",
                    classA: "商品池",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "商品池", routePath: "/goods/pool" }],
                }
            },
            {
                path: "goods/pool/detail",
                name: "goodspoolDetail",
                component: resolve => require(["modules/views/goods/goodspoolDetail.vue"], resolve),
                meta: {
                    title: "商品池详情",
                    classA: "商品池详情",
                    breadcrumbItems: [{ title: "商品池", routePath: "/goods/pool" }, { title: "详情", routePath: "/goods/pool/detail" }],
                }
            },
            {
                path: "goods/pool/associate",
                name: "goodspoolAssociate",
                component: resolve => require(["modules/views/goods/goodspoolAssociate.vue"], resolve),
                meta: {
                    title: "商池关联",
                    classA: "商池关联",
                    keepAlive: false,
                    breadcrumbItems: [{ title: "商品池", routePath: "/goods/pool" }, { title: "商品池关联", routePath: "/goods/pool/associate" }],
                }
            },
            {
                path: "custommange/customerList",
                name: "customerList",
                component: resolve => require(["modules/views/customer/customerList.vue"], resolve),
                meta: {
                    title: "客户管理",
                    classA: "客户管理",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "客户管理", routePath: "/custommange/customerList" }],
                }
            },
            {
                path: "custommange/customerAdd",
                name: "customerAdd",
                component: resolve => require(["modules/views/customer/customerAdd.vue"], resolve),
                meta: {
                    title: "新增账号",
                    classA: "新增账号",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "客户管理", routePath: "/custommange/customerList" }, { title: "新增账号", routePath: "/custommange/customerAdd" }],
                }
            },
            // {
            //     path: "custommange/customerEdit",
            //     name: "customerEdit",
            //     component: resolve => require(["modules/views/customer/customerEdit.vue"], resolve),
            //     meta: {
            //         title: "编辑客户",
            //         classA: "编辑客户",
            //         // keepAlive: true,
            //         breadcrumbItems: [{ title: "客户管理", routePath: "/custommange/customerList" },{ title: "编辑客户", routePath: "/custommange/customerEdit" }],
            //     }
            // },
            {
                path: "custommange/customerDetail",
                name: "customerDetail",
                component: resolve => require(["modules/views/customer/customerDetail.vue"], resolve),
                meta: {
                    title: "详情",
                    classA: "详情",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "客户管理", routePath: "/custommange/customerList" }, { title: "详情", routePath: "/custommange/customerDetail" }],
                }
            },

            {
                path: "promotion/promotionList",
                name: "promotionList",
                component: resolve => require(["modules/views/promotion/promotionList.vue"], resolve),
                meta: {
                    title: "抽奖活动列表",
                    classA: "详情",
                    // keepAlive: true,
                    breadcrumbItems: [{ title: "抽奖活动列表", routePath: "/promotion/promotionList" }],
                }
            }
        ]
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
   
    if (to.path == "/" && from.path.length > 1 && from.path.startsWith("/")) {
        //如果路由导航指向首页，为了不让内容区显示空白，阻止这次导航。
        next(false)
    } else {
        //设置title
        if (to.meta.title && '' != to.meta.title) {
            document.title = to.meta.title;
        }
        // 防止由详情到附件面包屑参数丢失
        if (from.path.includes('/order/detail')) {
            let url = from.fullPath
            to.meta.breadcrumbItems.forEach((item) => {
                if (item.routePath.includes('/order/detail')) {
                    item.routePath = url
                }
            })
        }
        next()
    }
})

export default router
