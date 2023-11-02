import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const commonRouter = [
	{
		"path": "/",
		"name": "demo",
		"component": resolve => require(["modules/views/index/index.vue"], resolve),
		"meta": {
			"title": "运营平台",
			"classA": "运营平台",
			"name": [],
			"path": []
		},
		"children": [
			{
				"path": "sysmgr/user",
				"name": "userlist",
				"component": resolve => require(["modules/views/user/userlist.vue"], resolve),
				"meta": {
					"title": "用户列表",
					"classA": "用户列表",
					"breadcrumbItems": [
						{
							"title": "用户管理",
							"routePath": "/sysmgr/user"
						}
					]
				}
			},
			{
				"path": "sysmgr/useredit",
				"name": "useredit",
				"component": resolve => require(["modules/views/user/useredit.vue"], resolve),
				"meta": {
					"title": "用户编辑",
					"classA": "用户编辑",
					"breadcrumbItems": [
						{
							"title": "用户管理",
							"routePath": "/sysmgr/user"
						},
						{
							"title": "用户详情",
							"routePath": "/sysmgr/userdetail"
						},
						{
							"title": "用户编辑",
							"routePath": "/sysmgr/useredit"
						}
					]
				}
			},
			{
				"path": "sysmgr/userdetail",
				"name": "userdetail",
				"component": resolve => require(["modules/views/user/userdetail.vue"], resolve),
				"meta": {
					"title": "用户详情",
					"classA": "用户详情",
					"breadcrumbItems": [
						{
							"title": "用户管理",
							"routePath": "/sysmgr/user"
						},
						{
							"title": "用户详情",
							"routePath": "/sysmgr/userdetail"
						}
					]
				}
			},
			{
				"path": "sysmgr/useradd",
				"name": "useradd",
				"component": resolve => require(["modules/views/user/useradd.vue"], resolve),
				"meta": {
					"title": "新增用户",
					"classA": "新增用户",
					"breadcrumbItems": [
						{
							"title": "用户管理",
							"routePath": "/sysmgr/user"
						},
						{
							"title": "新增用户",
							"routePath": "/sysmgr/useradd"
						}
					]
				}
			},
			{
				"path": "sysmgr/rolelist",
				"name": "rolelist",
				"component": resolve => require(["modules/views/role/rolelist.vue"], resolve),
				"meta": {
					"title": "角色管理",
					"classA": "角色管理",
					"breadcrumbItems": [
						{
							"title": "角色管理",
							"routePath": "/sysmgr/rolelist"
						}
					]
				}
			},
			{
				"path": "sysmgr/roledetail",
				"name": "roledetail",
				"component": resolve => require(["modules/views/role/roledetail.vue"], resolve),
				"meta": {
					"title": "角色详情",
					"classA": "角色详情",
					"breadcrumbItems": [
						{
							"title": "角色管理",
							"routePath": "/sysmgr/rolelist"
						},
						{
							"title": "角色详情",
							"routePath": "/sysmgr/roledetail"
						}
					]
				}
			},
			{
				"path": "sysmgr/roleedit",
				"name": "roleedit",
				"component": resolve => require(["modules/views/role/roleedit.vue"], resolve),
				"meta": {
					"title": "编辑角色",
					"classA": "编辑角色",
					"breadcrumbItems": [
						{
							"title": "角色管理",
							"routePath": "/sysmgr/rolelist"
						},
						{
							"title": "角色详情",
							"routePath": "/sysmgr/roledetail"
						},
						{
							"title": "编辑角色",
							"routePath": "/sysmgr/roleedit"
						}
					]
				}
			},
			{
				"path": "sysmgr/roleadd",
				"name": "roleadd",
				"component": resolve => require(["modules/views/role/roleadd.vue"], resolve),
				"meta": {
					"title": "新增角色",
					"classA": "新增角色",
					"breadcrumbItems": [
						{
							"title": "角色管理",
							"routePath": "/sysmgr/rolelist"
						},
						{
							"title": "新增角色",
							"routePath": "/sysmgr/roleadd"
						}
					]
				}
			},
			{
				"path": "couponproxy/couponmgr",
				"name": "couponmgr",
				"component": resolve => require(["modules/views/couponproxy/passmanage/index.vue"], resolve),
				"meta": {
					"title": "卡密管理",
					"classA": "新增角色",
					"breadcrumbItems": [
						{
							"title": "卡密管理",
							"routePath": "/couponproxy/couponmgr"
						}
					]
				}
			},
			{
				"path": "couponproxy/receivepage",
				"name": "receivepage",
				"component": resolve => require(["modules/views/couponproxy/receivepagetool/index.vue"], resolve),
				"meta": {
					"title": "领券地址二维码",
					"classA": "新增角色",
					"breadcrumbItems": [
						{
							"title": "领券地址二维码",
							"routePath": "/couponproxy/receivepage"
						}
					]
				}
			}
		]
	},
	{
		"path": "/*",
		"component": resolve => require(["modules/views/404/404.vue"], resolve),
		"name": ""
	}
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
    if (to.path == "/" && from.path.length > 1 && from.path.startsWith("/")) {
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
