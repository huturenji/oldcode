<template>
    <div class="layout">
        <Layout>
            <Header :style="{position: 'fixed', width: '100%', height:'48px'}">
                <navigationbar
                    :websitename="sitename"
                    :userinfo="userinfo"
                    @acceptevent="actionopen"
                />
            </Header>
            <Sider
                hide-trigger
                :style="{position: 'fixed', bottom: 0, top:'48px',left: 0, overflow: 'auto', background: '#fff'}"
            >
                <div class="menuTop">
                    <img
                        class="homeicon"
                        :src="require('assets/icon_home.png')"
                    />
                    <span>商城VOP管理</span>
                </div>
                <Menu
                    ref="sideMenu"
                    theme="light"
                    width="auto"
                    :active-name="menuActiveMenu && menuActiveMenu.path"
                    :open-names="menuOpenNames"
                    @on-select="onMenuSelect"
                >
                    <div
                        v-for="item in homeMenuList"
                        :key="item.type"
                    >
                        <Submenu
                            v-if="item.children && item.children.length > 0"
                            :name="item.path"
                        >
                            <template slot="title">
                                {{ item.name }}
                            </template>
                            <MenuItem
                                v-for="menusub in item.children"
                                :key="menusub.type"
                                :name="menusub.path"
                            >{{ menusub.name }}</MenuItem>
                        </Submenu>
                        <MenuItem
                            v-else
                            :name="item.path"
                        >
                            {{ item.name }}
                        </MenuItem>
                    </div>
                </Menu>
            </Sider>
            <layout
                :style="{padding: '0 15px 15px', marginLeft: '200px',marginTop:'48px',background: '#fff'}"
            >
                <Breadcrumb
                    :style="{padding: '15px 0',background:'#fff',borderBottom:'1px solid #DCDEE2'}"
                >
                    <BreadcrumbItem
                        :to="item.routePath"
                        v-for="(item,index) in curRouterbreadcrumbItems"
                        :key="item+index"
                    >{{ item.title }}</BreadcrumbItem>
                </Breadcrumb>
                <Content
                    :style="{padding: '0 15px', position: 'fixed', right: 0,left: '200px',marginTop:'52px', height:'calc(100% - 116px)',background: '#fff', overflow: 'auto'}"
                >
                    <router-view v-if="!$route.meta.keepAlive "></router-view>
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive "></router-view>
                    </keep-alive>
                </Content>
            </layout>
        </Layout>
    </div>
</template>
<script>
import permissionManager from 'bislibs/permissionhandler'
import utils from "bislibs/utils";
import systemhandler from "bislibs/requestHandler/systemhandler";
const navigationbar = () => import("components/navigationbar/navigationbar");
export default {
    components: {
        navigationbar
    },
    data() {
        return {
            homeMenuList: [], //左侧的menu数据源
            menuActiveMenu: {}, //当前选中额菜单项
            menuOpenNames: [], //当前选中菜单项的父级节点数据
            curRouterbreadcrumbItems: [], //当前路由页面导航路径
            pageRootPath: "/", //首页空页面的路由标记
            routerPathIsMenu: true, //路由是否是菜单路由
            sitename:"B+商城VOP平台",
            userinfo:null
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
            });
        },
        /**
         * 监听router变化，刷新页面导航栏
         */
        $route: {
            handler: function (route) {
                // console.log(route);
                this.curRouterbreadcrumbItems = utils.breadcrumbHome.concat(
                    route.meta.breadcrumbItems || []
                );
                // console.log(this.curRouterbreadcrumbItems)
            },
            immediate: true
        }
    },
    created() {},
    mounted() {
        this.getHeaderInfo();
        this.initMenuList()
    },
    methods: {
        actionopen(theEvent){
            if (theEvent.name == "quit"){
                systemhandler.logOut();
            }
        },
        getHeaderInfo(){
            this.userinfo = {
                username:(systemhandler.userInfo && systemhandler.userInfo.mgrName) || "",
                userID:(systemhandler.userInfo && systemhandler.userInfo.userId) ||""
            }                
        },
        async initMenuList(){
            //获取本地配置的所有的菜单组件
            this.homeMenuList = await permissionManager.getAuthedMenus({userId: systemhandler.userInfo.userId})
            this.updateMenu();
        },
        /**
         * 菜单项被点击
         */
        onMenuSelect(path) {
            const that = this;
            this.menuOpenNames = []; //每次点击某个节点的时候，我们都需要重新清空这个记录
            this.menuActiveMenu = this.getMenuByName(path, this.homeMenuList);
            that.$router.push({
                path: path
            });
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
                    query: this.$route.query
                });
            }
            //非菜单路由刷新进入，打开this.$route.path
            else {
                this.$router.push({
                    path: this.$route.path,
                    query: this.$route.query
                });
            }
        },
        /**
         * 通过path路由地址，从多级列表中找到菜单项
         */
        getMenuByName(path, list) {
            let result;
            //  
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
        /**
         * 查找首选项菜单，页面onCreated打开的路由
         */
        findDefaultMenu() {
            let result;
            // 
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
        }
    }
};
</script>
<style lang="less">
@import "~styles/base/common.less";
</style>
<style scoped lang="less">
@import "pagelayout.less";
</style>