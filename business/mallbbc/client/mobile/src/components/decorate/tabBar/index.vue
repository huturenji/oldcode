<template>
    <div class='tabbarWrap' ref='tabBarContainer' v-if="show && !!config && tabbarPage">
        <div class="tabbarMain" :style="{backgroundColor:config.backgroundColor,backdropFilter:config.backdropFilterBlur?`blur(${config.backdropFilterBlur})`:'0'}">
            <div class="tabbarBorder" v-if="config.borderDisplay" :style="{height:config.borderWidth,backgroundColor:config.borderColor,top:`calc(-${config.borderWidth.slice(0,-2)/2}px)`}"></div>
            <template v-for="(item,index) in config.list">
                <div class="tabbarItem" @click="itemAction(item.pagePath)" v-if="item.visible"  :key="index">
                    <div class="tabbarbd" :style="{height:config.height}">
                        <div class="tabbarIcon" :style="{height:item.iconHeight,width:item.iconWidth}">
                            <img :src="activeIndex==index?item.selectedIconPath:item.iconPath">
                            <div v-if="!!item.showReddot" class="tabbarReddot" :class="{tabbarBadge:!!item.badge&&item.badge!=''}">{{item.badge}}</div>
                        </div>
                        <div class="tabbarLabel" v-if="!!item.text && item.text!=''" :style="{color: activeIndex==index?config.selectedColor:config.color,fontSize: config.fontSize, marginTop: config.spacing}">{{item.text}}</div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import decorateHandler from '@/components/decorate/handler';
//默认标题栏样式
import {isNotEmpty} from '@/utils/common.js'
import HomeIndicator from '@/common/lib/homeIndicator'

//默认配置
const DEFAULT_CONFIG = {
    color:'#222222',
    selectedColor:'#f30300',
    fontSize:'12px',
    backgroundColor:'#f7f7fa',
    backdropFilterBlur:'0',
    spacing:'-3px',
    height:'54px',
    visible:true,
    borderDisplay:true,
    borderColor:'#ffffff',
    borderWidth:'1px',
    list:[]
};
const TABBAT_STYLE_OPTIONS = ['color','selectedColor','fontSize','backgroundColor','backdropFilterBlur','spacing','height','borderTopStyle','borderTopColor','borderTopWidth'];
const TABBAT_ITEM_OPTIONS = ['pagePath','text','iconPath','selectedIconPath','visible','iconWidth','iconHeight'];
window.tabBarHeight = 0;
document.body.style.setProperty('--tabBarHeight', '0px');

export default {
    name: 'deco-tab-bar',
    props: {  
    },
    data(){
        return {
            config:null,//配置
            show:DEFAULT_CONFIG.visible,//是否显示
            routePath:null,//页面routePath
            tabbarPage:false,//是否是tabbar页面
            activeIndex:-1,//active index
            tabbarReady:false//组件是否初始化完成
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {     
        /**
         * installTabbar
         */ 
        install(){
            let that = this;
            return new Promise(async (resolve)=>{
                await that.initTabar();
                resolve();
            })
        },      
        /**
         * initTabar
         */ 
        initTabar(){
            let that = this;
            return new Promise(async (resolve)=>{
                let tabbarData = await that.getTabbarData();
                that.loadTabbar(tabbarData); 
                resolve();
            })
        },      
        /**
         * 获取tabbar配置数据
         */ 
        getTabbarData() {
            return new Promise(async (resolve)=>{
                let query = {
                    // channelId: await sinosdk.sino.getChannelId(),
                    type: 'tabbar',
                    t:new Date().getTime()
                }
                let config = {};
                // 接口为获取tabbar装修列表，目前默认一个条数据为tabbar数据
                decorateHandler.getTabbarDeco(query,config).then(res => {
                    if (res.state === 200) {
                        if (res.data.list.length > 0 && res.data.list[0].data) {
                            try {
                                resolve(JSON.parse(res.data.list[0].data));
                            } catch (error) {
                                resolve({useDefault:true})
                            }
                        } else {
                            resolve({useDefault:true})
                        }
                    } else {
                        resolve({useDefault:true})
                    }
                })
            })
        },               
        /**
         * 加载Tabbar
         */  
        loadTabbar(option){
            if (!!option.useDefault){
                this.initConfig(DEFAULT_CONFIG);
            } else {
                this.initConfig(option.tabbarConfig);
            }
            this.tabbarReady = true;
        },         
        /**
         * 初始化Tabbar配置数据
         */  
        initConfig(conf){
            let tempConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
            if (isNotEmpty(conf)){
                for (let key in tempConfig) {
                    isNotEmpty(conf[key]) && (tempConfig[key] = conf[key]);
                }
                this.config = tempConfig;
                this.show = isNotEmpty(tempConfig.visible)?tempConfig.visible:true;
            } else {
                this.config = DEFAULT_CONFIG;
            }
            this.updateTabbar();
        },
        /**
         * 判断是否是tabbar页面是
         */  
        isTabbarPage(){
            let index = this.config?.list.findIndex((item)=>{
                return item.pagePath == this.routePath;
            })
            this.activeIndex = index;
            this.tabbarPage = index > -1;
        },
        /**
         * 获取页面routePath
         */         
        getRoutePath(){
            this.routePath = window.location.hash.replaceAll("#","").split('?')[0];
        },
        /**
         * 按钮点击事件
         * @param str pagePath
         */ 
        itemAction(pagePath){
            if (location.hash == '#'+pagePath){
                return;
            }
            uni.switchTab({ 
                url: pagePath,
                fail:()=>{
                    console.log('switchTab fail')
                    uni.navigateTo({ url: pagePath});
                }
            });
        },
        /**
         * 跳转tabbar首页
         */ 
        gotoHomePage(){
            let pagePath = '/';
            try {
                pagePath = this.getHomePage();
            } catch (e) {
                console.log(e)
            }
            uni.switchTab({ 
                url: pagePath,
                fail:()=>{
                    console.log('switchTab fail')
                    uni.navigateTo({ url: pagePath});
                }
            });
        },
        /**
         * 获取tabbar首页
         */ 
        getHomePage(){
            let pagePath = '/';
            let index = this.config?.list.findIndex((item)=>{
                return item.pagePath == '/';
            })
            if (index > -1){
                pagePath = '/'
            } else if (isNotEmpty(this.config) && isNotEmpty(this.config.list) && this.config.list.lenght > 0){
                pagePath = this.config.list[0].pagePath;
            }
            return pagePath;
        },
        /**
         * 获取当前页面对应的tabbaritem-可外部调用
         * @param str router path 不传默认取当前路由，传入则取对应的tabitem
         */         
        getTabbarItem(path){
            let routePath = isNotEmpty(path)?path:window.location.hash.replaceAll("#","").split('?')[0];
            return this.config?.list.find((item)=>{
                return routePath == item.pagePath;
            })
        },                
        /**
         * 更新Tabbar-可外部调用
         */  
        updateTabbar(){
            //获取页面routePath,判断active的按钮
            this.getRoutePath();
            this.isTabbarPage();
            this.setTabBarStyle();
            // this.visiable(this.tabbarPage && this.show);
        },
        /**
         * 控制显隐-可外部调用
         * @param boolean 显隐
         */         
        visiable(value){
            this.show = value;
            if (isNotEmpty(this.config.list) && this.getShowItemSum(this.config.list) > 0 && this.show && this.tabbarPage){
                window.tabBarHeight = parseInt(this.config.height) + HomeIndicator.getSafeAreaInsetBottom();
                document.body.style.setProperty('--tabBarHeight', window.tabBarHeight+'px');
                document.querySelector('uni-app').classList.add('h5--showtabbar');
            } else {
                window.tabBarHeight = 0;
                document.body.style.setProperty('--tabBarHeight', '0px'); 
                document.querySelector('uni-app').classList.remove('h5--showtabbar');
            }
        },
        /**
         * 获取显示的tabbaritem总数
         */
        getShowItemSum(){
            let sum = 0;
            this.config?.list.forEach((item)=>{
                if (!!item.visible){
                    sum++;
                }
            })
            return sum;
        },
        /**
         * setTabBarstyle-可外部调用
         * @param Obj tabBarStyle
         */
        setTabBarStyle(param={}){
            try {
                if (isNotEmpty(param)){
                    TABBAT_STYLE_OPTIONS.forEach((key)=>{
                        isNotEmpty(param[key]) && this.$set(this.config,key,param[key]);
                    })
                }
            } catch (error) {
                console.log('setTabBarStyle error:'+JSON.stringify(error));
            } 
            if (isNotEmpty(this.config.list) && this.getShowItemSum(this.config.list) > 0 && this.show && this.tabbarPage){
                window.tabBarHeight = parseInt(this.config.height) + HomeIndicator.getSafeAreaInsetBottom();
                document.body.style.setProperty('--tabBarHeight', window.tabBarHeight+'px'); 
                document.querySelector('uni-app').classList.add('h5--showtabbar');
            } else {
                window.tabBarHeight = 0;
                document.body.style.setProperty('--tabBarHeight', '0px'); 
                document.querySelector('uni-app').classList.remove('h5--showtabbar');
            }            
        },
        /**
         * setTabBarItem-可外部调用
         * @param Obj tabbarItem
         */
        setTabBarItem(param={}){
            let itemIndex = param.index || null;
            try {
                if (isNotEmpty(itemIndex) && itemIndex < this.config?.list.length && itemIndex >= 0 && isNotEmpty(this.config?.list[itemIndex])){
                    TABBAT_ITEM_OPTIONS.forEach((key)=>{
                        isNotEmpty(param[key]) && this.$set(this.config?.list[itemIndex],key,param[key]);
                    })
                }
            } catch (error) {
                console.log('setTabBarItem error:'+JSON.stringify(error));
            }
        },
        /**
         * 设置红点公共方法内部调用
         * @param Number index
         * @param Boolean showReddot
         * @param String badge
         */
        setReddot(index,showReddot=false,badge=null){
            if (isNotEmpty(index)){
                this.$set(this.config.list[index],'showReddot',showReddot)
                this.$set(this.config.list[index],'badge',badge)
            }
        },
        /**
         * 显示红点数字-可外部调用
         * @param Obj {index，text}
         */
        setTabBarBadge(param){
            this.setReddot(param.index,true,param.text);
        },
        /**
         * 隐藏红点数字-可外部调用
         * @param Obj {index}
         */
        removeTabBarBadge(param){ 
            this.setReddot(param.index,false,null);
        },
        /**
         * 显示红点-可外部调用
         * @param Obj {index}
         */
        showTabBarRedDot(param){
            this.setReddot(param.index,true,null);
        },
        /**
         * 隐藏红点-可外部调用
         * @param Obj {index}
         */
        hideTabBarRedDot(param){
            this.setReddot(param.index,false,null);
        }
    }
};
</script>
<style lang='scss' scoped>
    .tabbarWrap{
        position: fixed;
        left: 0;
        top: 0;
        display: flex;
        justify-content: center;
        box-sizing: border-box;
        width: 100%;
        z-index: 998;
        .tabbarMain{
            backdrop-filter: none;
            bottom: 0;
            padding-bottom: var(--safe-area-inset-bottom);
            position: fixed;
            box-shadow: 0px 3px 20px 0px rgb(147 148 159 / 20%);
            background: #fff ;
            width: 750rpx ;
            left: auto ;
            right: auto ;
            display: flex;
            z-index: 998;
            box-sizing: border-box;
            .tabbarBorder{
                background-color: rgba(211, 211, 211, 0.45);
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 1px;
                -webkit-transform: scaleY(.5);
                transform: scaleY(.5)
            }
            .tabbarItem{
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                flex: 1;
                font-size: 0;
                text-align: center;
                -webkit-tap-highlight-color: rgba(0,0,0,0);
                .tabbarbd{
                    height: 54px;
                    position: relative;
                    flex-direction: column;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .tabbarIcon{
                        width: 30px;
                        height: 30px;
                        margin-top: 0px;
                        position: relative;
                        display: inline-block;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                        .tabbarReddot {
                            position: absolute;
                            top: 0;
                            right: 0;
                            width: 12px;
                            height: 12px;
                            border-radius: 50%;
                            background-color: #f43530;
                            color: #fff;
                            transform: translate(40%,-20%);
                        }
                        .tabbarBadge {
                            width: auto;
                            height: 16px;
                            line-height: 16px;
                            border-radius: 16px;
                            min-width: 16px;
                            padding: 0 2px;
                            font-size: 12px;
                            text-align: center;
                            white-space: nowrap;
                        }
                    }
                    .tabbarLabel{
                        color: #222222;
                        font-size: 12px;
                        line-height: normal;
                        margin-top: -3px;
                        position: relative;
                        text-align: center;
                    }
                }
            }
        }
    }
    .no-wrap{
        display: block;
        overflow : hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-break: break-all; 
        white-space: nowrap;
    }
</style>