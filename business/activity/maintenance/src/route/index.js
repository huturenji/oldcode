import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const commonRouter = [
    {
        path: "/",
        name: "demo",
        component: resolve => require(["modules/views/index/index.vue"], resolve),
        meta: {
            title: "运维配置",
            classA: "运维配置",
            // breadcrumbItems: [{ title: "运维平台", routePath: "" }],
            // keepAlive: true,
        },
        children: [
            {
                path: "menu",
                name: "menu",
                component: resolve => require(["modules/views/menupage/menu.vue"], resolve),
                meta: {
                    title: "运维菜单",
                    classA: "运维菜单",
                    breadcrumbItems: [{ title: "运维平台", routePath: "/menu" }],
                    // keepAlive: true,
                }
            },
            {
                path: "authlist",
                name: "authlist",
                component: resolve => require(["modules/views/auth/authlist.vue"], resolve),
                meta: {
                    title: "权限列表",
                    classA: "权限列表",

                    breadcrumbItems: [{ title: "运维平台", routePath: "/menu" }, { title: "权限列表", routePath: "/authlist" }],
                    // keepAlive: true,
                }
            },
            {
                path: "authImport",
                name: "authImport",
                component: resolve => require(["modules/views/auth/authedit.vue"], resolve),
                meta: {
                    title: "导入权限",
                    classA: "导入权限",
                    breadcrumbItems: [{ title: "运维平台", routePath: "/menu" }, { title: "权限列表", routePath: "/authlist" }, { title: "导入权限", routePath: "/authImport" }],
                    // keepAlive: true,
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
    console.log(to, from, next)
    if (to.path == "/" && from.path.startsWith("/menu")) {
        //如果路由导航指向首页，为了不让内容区显示空白，阻止这次导航。
        next(false)
    } else {
        //设置title
        if (to.meta.title && '' != to.meta.title) {
            document.title = to.meta.title;
        }
        next()
    }
})

export default router
