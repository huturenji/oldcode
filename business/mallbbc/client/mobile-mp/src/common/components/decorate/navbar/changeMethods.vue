<template>
    <view></view>  
</template>

<script>
import { isNotEmpty, colorToRgba } from "@/utils/common.js";
export default {
    name: "deco-navbar-change",
    components: {},
    props: {},
    data() {
        return {
        };
    },
    computed: {
       
    },
    watch: {},
    created(){},

    methods: {
        /***
         * 初始化装修的statusbar
         */
        initStatusbar(config){
            this.statusbar = config.statusbar;
            this.setStatusbar0();
        },

        /**
         * 设置初始化状态栏
         */
         setStatusbar0(){
            if(!!(this.statusbar?.data?.length > 0)){
                this.setNavigationBarColor({
                    frontColor: this.getFrontColor(this.statusbar.data[0].themeMode),
                    backgroundColor: this.statusbar.data[0].background
                })
            }
        },

        /**
         * 设置滑动后状态栏
         */
        setStatusbar1(){
            if(!!(this.statusbar?.data?.length > 1)){
                this.setNavigationBarColor({
                    frontColor: this.getFrontColor(this.statusbar.data[1].themeMode),
                    backgroundColor: this.statusbar.data[1].background
                })
            }
        },

        /**
         * 设置导航栏样式
         */
        setNavigationBarColor(config){
            let {frontColor, backgroundColor } = config
            uni.setNavigationBarColor({
                frontColor: frontColor || '#000000', // 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
                backgroundColor: backgroundColor || '#eff2f5', // 背景颜色值，有效值为十六进制颜色
            })
        },

        /**
         * 获取主题颜色
         * @param {} theme 
         */
        getFrontColor(theme = ''){
            return theme == 'dark' ? '#000000' : "#ffffff";
        },

        /***
         * 初始化装修的titlebar
         */
        initTitlebar(config){
            this.titlebar = config.titlebar;
            this.setTitlebar0();
        },

        /**
         * 设置初始化导航栏
         */
        setTitlebar0(){
            if(!!(this.titlebar?.data?.length > 0)){
               this.setNavbar(this.titlebar.data[0])
            }
        },

        /**
         * 设置初始化导航栏
         */
        setTitlebar1(opacity){
            if(!!(this.titlebar?.data?.length > 1)){
               this.setNavbar(this.titlebar.data[1], opacity)
            }
        },

       
        /**
         * 根据装修配置显示不同的title栏
         * @param {*} config 
         */
        setNavbar(config, opacity){
            // 获取渐变透明度
            if(opacity == undefined && isNotEmpty(config.opacity)){
                opacity = (config.opacity - 0) / 100
                this.bgColor = colorToRgba(config.background, opacity);
            }
           
            // 更新背景色
            if(isNotEmpty(config.background)){
                this.bgColor = colorToRgba(config.background, opacity);
            }

            // 更新title颜色
            if(isNotEmpty(config.color)){
                this.titleStyle = {
                    color: config.color,
                    'font-weight': 'bold'
                }; 
            }

            // 更新title中间文字是否显示
            if(isNotEmpty(config.showTitle)){
                this.titleWidth = opacity === 1 && config.showTitle ? '400rpx' : '0'
            }

            // 更新title是否是沉浸式
            if(isNotEmpty(config.suspend)){
                this.placeholder = !config.suspend
            }

            // 更新title返回按钮
            if(isNotEmpty(config.showBack)){
                this.leftIconSize = config.showBack ? '24px' : '0'
            }

            // 更新title返回按钮的颜色
            if(isNotEmpty(config.themeMode)){
                this.leftIconColor = config.themeMode == 'light' ? '#ffffff' : '#303133'; 
            }
            
        }
    }
};
</script>

<style lang="scss" scoped></style>