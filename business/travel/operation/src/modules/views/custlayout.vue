<!-- 运营管理的主体页面 -->
<template>
    <div id="main">
        <div class="header">
            <navigationbar
                :websitename="sitename"
                :userinfo="userinfo"
                @acceptevent="actionopen"
            />
        </div>
        <div>
            <div class="main-container">
                <div class="sider">
                    <div class="menuTop">
                        <img
                            class="homeicon"
                            :src="require('assets/icon_home.png')"
                        />
                        <span>商旅管理</span>
                    </div>
                    <Menu
                        ref="sideMenu"
                        theme="light"
                        width="auto"
                        :active-name="menuActiveMenu && menuActiveMenu.path"
                        :open-names="menuOpenNames"
                        @on-select="onMenuSelect"
                    >
                        <div v-for="item in homeMenuList" :key="item.type">
                            <Submenu
                                v-if="item.children && item.children.length > 0"
                                :name="item.path"
                            >
                                <template slot="title">{{
                                    item.name
                                }}</template>
                                <MenuItem
                                    v-for="menusub in item.children"
                                    :key="menusub.type"
                                    :name="menusub.path"
                                    >{{ menusub.name }}</MenuItem
                                >
                            </Submenu>
                            <MenuItem v-else :name="item.path">{{
                                item.name
                            }}</MenuItem>
                        </div>
                    </Menu>
                </div>
                <div class="content">
                    <Breadcrumb
                        separator=">"
                        style="
                            display: flex;
                            padding: 10px;
                            font-size: 14px;
                            position: fixed;
                            border-bottom: 1px solid #e2e2e2;
                        "
                    >
                        <!-- :to="$route.meta.path[index]" -->
                        <BreadcrumbItem
                            v-for="(item, index) in curRouterbreadcrumbItems"
                            :key="index"
                            >{{ item }}</BreadcrumbItem
                        >
                    </Breadcrumb>
                    <router-view class="pageContent"></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import navigationbar from "components/navigationbar/navigationbar";
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import permissionManager from "bislibs/permissionhandler";

export default {
    components: {
        navigationbar,
    },
    data() {
        return {
            //运营地址导航首页对象
            breadcrumbHome: ["运营管理"],
            curRouterbreadcrumbItems: [], //当前路由页面导航路径

            homeMenuList: [], //左侧的menu数据源
            menuActiveMenu: {}, //当前选中额菜单项
            menuOpenNames: [], //当前选中菜单项的父级节点数据
            pageRootPath: "/", //首页空页面的路由标记
            routerPathIsMenu: true, //路由是否是菜单路由

            sitename: "B+商旅运营平台",
            userinfo: null,
        };
    },
    watch: {
        /**
         * 当用户刷新页面的时候，menu菜单的展开和选中效果需要手动调用方法触发。仅仅赋值是没有效果的
         */
        menuOpenNames() {
            this.$nextTick(() => {
                this.$refs.sideMenu.updateOpened();
                this.$refs.sideMenu.updateActiveName();
                // console.log("nextTick.watch");
            });
        },
        /**
         * 监听router变化，刷新页面导航栏
         */
        $route: {
            handler: function (route) {
                this.curRouterbreadcrumbItems = this.breadcrumbHome.concat(
                    route.meta.name || []
                );
            },
            immediate: true,
        },
    },
    created() {},
    mounted() {
        this.getHeaderInfo();
        this.initMenuList();
    },
    deactivated() {
        // console.info("custlayout.deactivated");
    },
    activated() {
        //因为index.vue使用了keep-alive，当有的路由使用了保活的时候，
        //被唤醒后，menu会丢失选中效果，需要手动模拟一下点击，回恢复选中效果
        // console.info("custlayout.activated");
        if (this.isMenuPah(this.$route.path)) {
            this.onMenuSelect(this.$route.path);
        }
    },
    methods: {
        actionopen(theEvent) {
            if (theEvent.name == "quit") {
                tmHandler.logOut();
            }
        },
        getHeaderInfo() {
            this.userinfo = {
                username:
                    (tmHandler.userInfo && tmHandler.userInfo.mgrName) || "",
                userID: (tmHandler.userInfo && tmHandler.userInfo.userId) || "",
            };
        },
        /**
         * 菜单项被点击
         */
        onMenuSelect(path) {
            const that = this;
            this.menuOpenNames = []; //每次点击某个节点的时候，我们都需要重新清空这个记录
            this.menuActiveMenu = this.getMenuByName(path, this.homeMenuList);
            console.log("ActiveMenu=" + JSON.stringify(this.menuActiveMenu));
            console.log("menuOpenNames=" + JSON.stringify(this.menuOpenNames));
            console.log("path=" + path);
            that.$router.push({
                path: path,
            });
        },
        async initMenuList() {
            //获取本地配置的所有的菜单组件
            this.homeMenuList = await permissionManager.getAuthedMenus({
                userId: tmHandler.userInfo.userId,
            });
            this.updateMenu();
        },
        /**
         * 页面刷新或首次打开 需要调用的方法
         */
        updateMenu() {
            // console.log("updateMenu=");
            this.menuOpenNames = []; //每次点击某个节点的时候，我们都需要重新清空这个记录
            //默认打开首选项
            this.menuActiveMenu = this.findDefaultMenu();
            if (!this.menuActiveMenu) {
                return;
            }
            //首次进入或点击菜单或者刷新，打开selectItem.path
            if (this.routerPathIsMenu) {
                this.$router.push({
                    path: this.menuActiveMenu.path,
                    query: this.$route.query,
                });
            }
            //非菜单路由刷新进入，打开this.$route.path
            else {
                this.$router.push({
                    path: this.$route.path,
                    query: this.$route.query,
                });
            }
        },
        /**
         * 查找首选项菜单，页面onCreated打开的路由
         */
        findDefaultMenu() {
            let result;
            // debugger
            //这个场景是首次跳转过来
            if (this.$route.path == this.pageRootPath) {
                if (
                    this.homeMenuList.length > 0 &&
                    this.homeMenuList[0].children &&
                    this.homeMenuList[0].children.length > 0
                ) {
                    result = this.homeMenuList[0].children[0];
                } else if (this.homeMenuList.length > 0) {
                    result = this.homeMenuList[0];
                }
                this.routerPathIsMenu = true;
            }
            //这个场景是当前页面刷新
            else {
                result = this.getMenuByName(
                    this.$route.path,
                    this.homeMenuList
                );
            }
            return result;
        },
        /**
         * 通过path路由地址，从多级列表中找到菜单项
         */
        getMenuByName(path, list) {
            let result;
            //  debugger
            for (let i = 0; i < list.length; i++) {
                if (list[i].path == path) {
                    result = list[i];
                    this.routerPathIsMenu = true;
                    break;
                } else if (
                    list[i].sameMenuPaths &&
                    list[i].sameMenuPaths.indexOf(path) != -1
                ) {
                    this.routerPathIsMenu = false;
                    result = list[i];
                    //如果是非菜单栏的路由，需要记录对应的入口路由节点，用于菜单栏的刷新展示
                    this.menuOpenNames.push(list[i].path);
                    break;
                } else if (list[i].children && list[i].children.length > 0) {
                    result = this.getMenuByName(path, list[i].children);
                    if (result) {
                        //如果是叶子节点，我们需要记录一下非叶子节点用于 菜单栏的刷新展示
                        this.menuOpenNames.push(list[i].path);
                        break;
                    }
                }
            }
            return result;
        },
        //路由是否是menu的路由
        isMenuPah(path) {
            let ismenuPath = false;
            for (let i = 0; i < this.homeMenuList.length; i++) {
                if (
                    this.homeMenuList[i].children &&
                    this.homeMenuList[i].children.length > 0
                ) {
                    for (
                        let j = 0;
                        j < this.homeMenuList[i].children.length;
                        j++
                    ) {
                        if (this.homeMenuList[i].children[j].path == path) {
                            ismenuPath = true;
                            break;
                        }
                    }
                } else {
                    if (this.homeMenuList[i].path == path) {
                        ismenuPath = true;
                        break;
                    }
                }
            }
            return ismenuPath;
        },
    },
};
</script>
<style scoped lang="less">
@import "custlayout.less";
</style>



