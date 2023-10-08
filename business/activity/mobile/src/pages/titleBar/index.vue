<template>
    <div class='title-bar-container' ref='titleBarContainer' v-if='enable && (showTitle || showStatus)'>
        <div class='status-bar' v-if='showStatus' :style='statusStyle'></div>
        <div class='title-bar' v-if='showTitle' :style='titleStyle'>
            <view class='background' :style="titleBgStyle"></view>
            <div class='left' :class="{'empty': !decoData.native.showBack}"></div>
            <div class='center' v-show='decoData.h5.title.showTitle'>
                <div class='no-wrap normalTitle'>{{decoData.h5.title.titleText}}</div>
                <div ref='slot'></div>
            </div>
            <div class='right' :class="{'empty': !decoData.native.showMenuAction}"></div>
        </div>
    </div>
</template>
<script>
//备注
//app左边[返回按钮]宽50pt，贴边；右边小应用菜单宽76pt，距边8pt；右边非小应用菜单宽22pt，距边20pt

//默认标题栏样式
import {isNotEmpty, isEmpty, deepClone} from '@/utils/common.js'

const DEFAULT_TITLE_STYLE = {
    suspend: false,
    showTitle: true,
    background: '#fff',
    color: '#222',
    opacity: 1,
    titleText: ''
}

//默认状态栏样式
const DEFAULT_STATUS_STYLE = {
    suspend: false,
    background: '#fff',
    opacity: 1
}
const navigatorData = SnUtils.getAppVersion();
var titleHeight = 0;
var statusBarHeight = 0;
var titleBarHeight = 0;

//初始化css变量
document.body.style.setProperty('--titleBarHeight', '0px');
document.body.style.setProperty('--titleBarFillHeight', '0px');//实际占位高度
document.body.style.setProperty('--titleHeight', '0px');
document.body.style.setProperty('--statusHeight', '0px');

//默认配置
const DEFAULT_NATIVE_CONFIG = {
    showTitle:false,
    suspend:true,
    opacity:0,
    showBack:true,
    showMenuAction:true,
    themeMode: 'dark',
    statusBarMode: 'dark',//状态栏字体颜色，传值为'dark'或'light'，不传的话，值和themeMode保持一致
    titlePosition: 'center',//传值为'left'和'center'
    backStyle: 'simple',//传值为'simple'和'solid'
    contentOpacity:1 //title内容透明度，0.0~1.0
};

function support(){
    return sinosdk.sino.getPlatform() == sinosdk.sino.constant.RUN_ENV.BIZMATE //必须是伴正事平台
            && sinosdk.sino.getNavigatorType() != sinosdk.sino.constant.NAVIGATOR_TYPE.PC //不可是pc端
            && isNotEmpty(navigatorData) //需是支持的webkit版本
            
}

//初始化全局titlebar高度
window.titleBarHeight = window.titleHeight = window.statusHeight = 0;
if (support()){
    titleHeight = window.titleHeight = parseInt((navigatorData.titleBarHeight || 132) / window.devicePixelRatio);
    statusBarHeight = window.statusHeight = parseInt((navigatorData.statusBarHeight || 75) / window.devicePixelRatio);
    titleBarHeight = window.titleBarHeight = titleHeight + statusBarHeight;
    sinosdk.sino.setTitleBar(DEFAULT_NATIVE_CONFIG);//初始设置native
    document.body.style.setProperty('--titleBarHeight', titleBarHeight + 'px');
    document.body.style.setProperty('--titleBarFillHeight', titleBarHeight + 'px');
    document.body.style.setProperty('--titleHeight', titleHeight + 'px');
    document.body.style.setProperty('--statusHeight', statusBarHeight + 'px');
    
}

export default {
    name: 'title-bar',
    data(){
        let h5Config = {
            title: DEFAULT_TITLE_STYLE,
            status: DEFAULT_STATUS_STYLE
        }
        return {
            enable: support(),//是否存在H5的title栏
            showTitle: true,
            showStatus: true,
            observer: null,
            decoData: {
                h5: h5Config,
                native: Object.assign({}, DEFAULT_NATIVE_CONFIG)
            },
            unDecoData: {
                h5:JSON.parse(JSON.stringify(h5Config)),
                native: JSON.parse(JSON.stringify(DEFAULT_NATIVE_CONFIG))
            },
            fixedStyle: {//不可被修改样式
                status: {
                    height: statusBarHeight + 'px !important'
                },
                title: {
                    height: titleHeight + 'px !important' 
                }
            }
        }
    },
    computed: {
        statusStyle(){
            return Object.assign({}, this.fixedStyle.status, this.decoData.h5.status);
        },

        titleStyle(){
            let style = Object.assign({}, this.fixedStyle.title, this.decoData.h5.title);
            for (let key in style){
                if (key.startsWith('background')){
                    delete style[key];
                }
            }
            delete style.opacity;
            return style;
        },
        titleBgStyle(){
            let style = Object.assign({}, this.fixedStyle.title, this.decoData.h5.title);
            let bgStyle = {};
            for (let key in style){
                if (key.startsWith('background')){
                    bgStyle[key] = style[key];
                }
            }
            bgStyle.opacity = style.opacity;
            return bgStyle;
        }
    },
    watch:{
        title(_new){
            if (typeof(_new) == 'string' && this.$refs.slot){
                Array.prototype.forEach.call(this.$refs.slot.childNodes, node=>{
                    node.remove();
                })
            }
        }
    },
    created() {
        if (!this.enable){
            return;
        }
        this.observerTitle();//监听title变化
        if (!this.decoData.h5.title.height){
            this.decoData.h5.title.height = titleHeight + 1 + 'px';//增加1px高度，并上移1px，防止statusbar和titlebar中间有缝隙
        }
        this.decoData.h5.status.height = statusBarHeight + 'px'
        this.callHook('created');
    },
    mounted() {
        this.callHook('mounted');
    },
    methods: {
        dealClass(deco){
            try {
                return `${deco.direction} align-${deco.align||"left"}`
            } catch (error) {
                return ''
            }
        },
        /**
         * 监听title变化并同步显示
         */ 
        observerTitle(){
            try {
                let that = this;
                // 选择需要观察变动的节点
                const targetNode = document.querySelector('title');
                // 观察器的配置（需要观察什么变动）
                const config = { childList: true, subtree: true };
                // 当观察到变动时执行的回调函数
                const callback = function(mutationsList) {
                    that.decoData.h5.title.titleText = mutationsList?.[0].addedNodes?.[0]?.textContent
                };
                    // 创建一个观察器实例并传入回调函数
                this.observer = new MutationObserver(callback);
                // 以上述配置开始观察目标节点
                this.observer.observe(targetNode, config);
            } catch (e){
                console.warn(e)
            }
        },
        set(option={}){
            if (!this.enable || isEmpty(option)){
                return this;
            }
            //兼容decoData格式的数据
            if (Object.keys(option).every(key => Object.keys(this.decoData).contains(key))){
                this.set(option.h5);
                this.updateNativeConfig(option.native);
                this._setTitle(option.h5.title.titleText)
                return;
            }

            //H5设置
            let statusOption = option.status ?? option;
            if (isNotEmpty(statusOption)){
                let statusStyle = {};
                isNotEmpty(statusOption.show) && (this.showStatus = statusOption.show);
                isNotEmpty(statusOption.suspend) && (statusStyle.suspend = statusOption.suspend);
                isNotEmpty(statusOption.opacity) && (statusStyle = Object.assign({}, statusStyle, this._opacityTransfer(statusOption.opacity)))
                isNotEmpty(statusOption.background) && (statusStyle.background = statusOption.background)
                this._setStatusStyle(statusStyle)
            }

            let titleOption = option.title ?? option;
            if (isNotEmpty(titleOption)){
                let titleStyle = {};
                isNotEmpty(titleOption.show) && (this.showTitle = titleOption.show);
                isNotEmpty(titleOption.suspend) && (titleStyle.suspend = titleOption.suspend);
                isNotEmpty(titleOption.opacity) && (titleStyle = Object.assign({}, titleStyle, this._opacityTransfer(titleOption.opacity)))
                isNotEmpty(titleOption.background) && (titleStyle.background = titleOption.background)
                isNotEmpty(titleOption.color) && (titleStyle.color = titleOption.color)
                isNotEmpty(titleOption.showTitle) && (this.decoData.h5.title.showTitle = titleOption.showTitle) 
                this._setTitleStyle(titleStyle)
            }

            //title组件的实际占位高度（不含悬浮的高度）
            document.body.style.setProperty('--titleBarFillHeight', this.getDrawHeight()+'px');

            //native设置
            let config = {};
            isNotEmpty(titleOption.themeMode) && (config.themeMode = titleOption.themeMode);
            isNotEmpty(titleOption.showBack) && (config.showBack = titleOption.showBack);
            isNotEmpty(titleOption.showMenu) && (config.showMenu = titleOption.showMenu);
            isNotEmpty(titleOption.titlePosition) && (config.titlePosition = titleOption.titlePosition);
            isNotEmpty(titleOption.backStyle) && (config.backStyle = titleOption.backStyle);
            isNotEmpty(titleOption.contentOpacity) && (config.contentOpacity = titleOption.contentOpacity);
            let statusBarMode = isNotEmpty(statusOption.themeMode) ? statusOption.themeMode : titleOption.themeMode;
            isNotEmpty(statusBarMode) && (config.statusBarMode = statusBarMode)
            this.updateNativeConfig(config)
            return this;
        },
        /**
         * 实际渲染所占的高度（不含悬浮的高度）
         */
        getDrawHeight(){
            let height = 0;
            if (this.showStatus && !this.decoData.h5.status.suspend){
                height += statusBarHeight;
            }   
            if (this.showTitle && !this.decoData.h5.title.suspend){
                height += titleHeight;
            }      
            return height;     
        },
        /**
         * 显示的的高度
         */
        getShowHeight(){
            let height = 0;
            if (this.showStatus){
                height += statusBarHeight;
            }   
            if (this.showTitle){
                height += titleHeight;
            }      
            return height;     
        },
        /**
         * 是否显示整个titleBar（包括h5和native）
         * value: 支持boolean和Object两种参数配置。 boolean表示都生效，Object表示分开设置(举例：{title: true, status: false})
         */
        visiable(value){
            if (!this.enable){
                return this;
            }
            if (Object.prototype.toString.call(value) == '[object Boolean]'){
                this.showTitle = this.showStatus = value;
            } else {
                this.showTitle = value.showTitle;
                this.showStatus = value.showStatus;
            }
            //隐藏时肯定要同时隐藏返回按钮。但显示时，需要看当前页面是否需要显示返回按钮
            this.updateNativeConfig({
                showBack: !value ? false : this.decoData.native.showBack
            })
            return this;
        },
        _setTitle(title){
            if (typeof(title) == 'string'){
                this.decoData.h5.title.titleText = title;
                this.$refs.slot && (this.$refs.slot.innerHtml = '')
            } else if (title instanceof HTMLElement){
                this.decoData.h5.title.titleText=null;
                this.$refs.slot && this.$refs.slot.appendChild(title)
            }
        },
        /**
         * 设置title样式 
         */
        _opacityTransfer(value){
            //单位转换
            if (value > 1){
                value /= 100;
            }
            return {opacity: value, filter: `alpha(${value} * 100)`};
        },
        _setTitleStyle(option){
            this.decoData.h5.title = Object.assign({}, this.decoData.h5.title, option);
        },
        _setStatusStyle(option){
            this.decoData.h5.status = Object.assign({}, this.decoData.h5.status, option);
        },
        /**
         * 重置到默认状态
         */
        reset(){
            if (!this.enable){
                return this;
            }
            this.visiable(true);
            let h5Config = JSON.parse(JSON.stringify(this.unDecoData?.h5))
            delete h5Config.title.titleText;//不可重置title文字
            this.set(h5Config);//重置h5配置
            this.updateNativeConfig(DEFAULT_NATIVE_CONFIG);//重置native配置
            return this;
        },
        /**
         * 更新native的titlebar的配置
         */
        updateNativeConfig(config){
            if (!this.enable){
                return;
            }
            //节流：配置为空或于当前配置的值相等时，不再次更新
            if (isEmpty(config) || Object.getOwnPropertyNames(config).every(key => config[key] == this.decoData.native[key])){
                return;
            }
            this.decoData.native = Object.assign({}, DEFAULT_NATIVE_CONFIG, this.decoData.native, config);
            sinosdk.sino.setTitleBar(this.decoData.native)
        },

        getCurrConfig(){
            return deepClone(this.decoData);
        },

        /**
         * 触发事件
         */ 
        callHook(event, data){
            this.$emit(event, data);
            this[event] && typeof this[event]=='function' && this[event](data);
        }
    },
    beforeDestroy(){
        this.observer && this.observer.disconnect();
    }
};
</script>
<style lang='scss' scoped>
    .title-bar-container {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        background: transparent;
        width: 100%;
        height: auto;
        text-align: center;
        z-index: 13999;

        .title-bar{
            position: relative;
            top: -1px;
            display: flex;
            justify-content: space-between;
            .background{
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
            }
            .left{
                width: 100rpx;
            }
            .right{
                width: 176rpx;
            }
            .left, .right{
                position: relative;
                flex: none;
                &.empty{
                    width: 40rpx;
                }
            }
            .center{
                position: relative;
                flex: auto;
                display: flex;
                align-items: center;
                justify-content: center;

                .normalTitle{
                    margin-left: 76rpx;//保持左侧返回按钮占位和右侧菜单按钮一致
                    font-size: 17px;
                    font-weight: 600;
                    text-align: center;
                    font-family: initial;
                }


                .decoCotent{
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    text-align: left;
                    width: 100%;
                    height: 100%;
                    .decoItem{
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        &>div{
                            flex: none;
                        }
                        &.align-right{
                            margin-left: auto;
                        }
                        .decoImg{
                            width: 248rpx;
                            height: 78rpx;
                        }
                        .decoText{
                            font-size: 28rpx;
                        }
                        &.column{
                            flex-direction: column;
                            align-items: center;
                            .decoImg{
                                width: 42rpx;
                                height: 42rpx;
                            }
                            .decoText{
                                font-size: 24rpx;
                            }
                        }

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