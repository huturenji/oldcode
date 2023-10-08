<template>
    <view class="container" ref='container' v-background:[reverse].parent='background'>
        <!-- 没有装修数据时暂时空页面 -->
        <empty
            v-if="!hasDecoInfo"
            emptyImg="icon_defpage_zwnr"
            tips="暂无装修数据"
        />

        <!--这里要用v-show，用于设置默认滚动容器-->
        <view v-show="hasDecoInfo" class="deco_content" ref='decoContent'>
            <Children 
            class='children'
            :deco_info='deco_info' :parentScrollTop="scrollTop" :showTransition='showTransition' :stickyHeightTotal="stickyHeightTotal" :scrollContainer="scrollContainer" :isDecoReady="isDecoReady"
            :getDefaultAddress="getDefaultAddress"
            />
        </view>

        <!-- 首页开屏框 start -->
        <spread-dialog v-if="spreadDialogData && showSpread" :openScreenData="spreadDialogData"></spread-dialog>
        <!-- 开屏框 end -->

        <!-- 小浮窗组件 start -->
        <floatingWindow v-if="showFloat || showCartThumb || showTopThumb" :decoItem="floatData" :cartData="cartData" :isDecoReady="isDecoReady"
        :showCartThumb="showCartThumb" :showTopThumb="showTopThumb" :parentScrollTop="scrollTop" @scrollToTop="scrollToTop"></floatingWindow>
        <!-- 小浮窗组件 end -->
    </view>
</template>

<script module="filters" lang="wxs" src="@/utils/filter.wxs"></script>
<script>
    /*===========组件使用说明（请注意维护本说明）=============*/
    /*======1. 本组件作为装修容器，只能存放装修组件，及公共模块的相关逻辑。子组件的能力由本组件统一下发和监听=====================================*/
    /*======2. 新增子组件，如果需要和父组件或其他兄弟子组件联动，可将本组件作为统一调度中心使用，切不可在本组件中写耦合代码========================*/
    /*======3. 关于页面渲染位置（请把状态栏和标题栏想象成非H5组件，页面的实际内容就是可渲染区域，这样便于理解）：=================================*/
    /*=========3.1 默认是全屏渲染（即隐藏状态栏和标题栏），此时是将本组件的根节点上移到顶部，并增加顶部padding，使内容下移（不占用状态栏的位置）====*/
    /*=========3.2 如果装修了状态栏或标题栏，则根据这两个组件的高度，调整本组件上移的高度。=====================================================*/
    /*======4. 关于固定元素（sticky组件），由子组件告知父组件自己需要sticky，然后本组件重绘sticky区域================================================*/
    /*======5. 关于反转样式，默认随滚动条移动时反转，也可由子组件注册，并提供反转时机（以最后一个注册的为主）=====================================*/
    /*============================================*/

    import {
        isNotEmpty,
        isEmpty,
        getStyle,
        isSpecialChouzhou
    } from '@/utils/common.js'
    import { mapState } from 'vuex';
    import taskLock from '@/utils/taskLock/index.js'
    import CustEvent from '@/utils/custEvent.js'
    import Children from './common/components/children.vue'
    import empty from "@/components/empty/index.vue";
     // 广告开屏组件
    import spreadDialog from '@/components/decorate/spread-dialog/spread-dialog.vue';
    // 小浮窗组件
    import floatingWindow from '@/components/decorate/floating-window/floating-window.vue'
    import {getScrollTop, reachScrollBottom} from '@/utils/scrollUtils'

    const docEventListeners = {};//remove已有的事件监听的函数句柄

    export default {
        components: {
            Children,
            spreadDialog,
            empty,
            floatingWindow
        },        
        data() {
            return {
                reverse: false,//装修数据是否反转
                stickyLayoutHeight: 0,//sticky元素的总高度
                scrollEventHandle: null,//scroll事件函数句柄
                scrollTop: 0,
                scrollContainer: document,
                custEvents: CustEvent.init('deco'+this._uid),//自定义事件，用于父子组件通信（非广播型事件，只在id相同的组件间通信）
                statusBarPageConfig: {},//状态栏装修参数（不提供给titleBar组件，而是本页面内使用）
                stickyHeightTotal: 0, //offCanvas组件因为临时的左上角圆角需要这个值
                showCartThumb:false, //是否显示购物车
                showTopThumb:false, //是否显示回到顶部
                showFloat:false, //是否显示小浮窗
                showTransition:false,//反转是否需要过渡效果
                floatData:{}, //小浮窗数据
                cartData: {} //购物车数据
            };
        },
        provide(){
            return {
                rootId: this._uid//注入装修根容器的id，使其子组件能与之建立唯一关联关系
            }
        },
        props: {
            //可由父组件指定默认滚动容器
            defaultScrollView: {
                // #ifdef H5
                type: [HTMLElement, Document],
                // #endif
            },
            deco_info: {
                type: [Array, null],
            },
            // 装修数据接口是否请求完成 tabbar页面存在缓存
            isDecoReady: {
                type: Boolean,
                default: true
            },
            isPageShowCart: {
                type: Boolean,
                default:false
            },
            isPageShowTop: {
                type: Boolean,
                default:false
            },
            /*开屏图参数*/
            spreadDialogData: {
                type: String,
                default: null
            },
            // 根据开屏图有效期来判断的是否展示开屏图
            showSpread: {
                type: Boolean,
                default:true
            },
            cacheKey:{ //如果tabGroup有常用功能，此时需要借助前端缓存来实现，需要页面给一个前端缓存的key
                type: String
            }
            /*===开屏图和空白页参数 end ===*/
        },
        computed: {
            ...mapState(['defaultAddress']),
            /**
             * 本组件的背景装修
             */
            background(){
                let data = this.deco_info?.find(item => item.name == 'background')
                if(isNotEmpty(data) && data.props.is_show) {
                    return data?.styles.map(item => item.background);
                }
                return null;
            },
            hasDecoInfo() {
                if (this.deco_info !== null) {
                    return (this.deco_info && this.deco_info.length > 0)
                } else {
                    return true
                }
            }
        },
        created(){
            // #ifdef H5
            this.listenChildFrameMessage();
            // #endif
        },
        mounted(){
            //设置默认滚动区域
            this.setScrollView();
            //监听自定义事件
            this.listenCustEvent()
        },
        //本组件可能有保活机制
        activated(){
            // 监听页面的滚动事件
            // #ifdef H5
            this.addScrollEvent();
            //还原滚动条位置
            window.decorateScrollTop && window.decorateScrollTop[this._uid] && this.scrollContainer.scrollTo(0, window.decorateScrollTop[this._uid])
            // #endif
            this.execDeco();
        },
        deactivated(){
            // #ifdef H5
            docEventListeners.scroll?.();
            //记住滚动条位置
            window.decorateScrollTop = Object.assign({}, window.decorateScrollTop, {[this._uid]: this.scrollTop})
            // #endif
        },
        watch: {
            /**
             * 监听到装修数据变化时，开始绘制整体框架
             */
            deco_info: {
                handler(val, oldVal){
                    if(isNotEmpty(val) && JSON.stringify(val) != JSON.stringify(oldVal)){
                         //重置默认滚动区域
                        this.setScrollView();
                        this.execDeco();
                    }
                    if (isNotEmpty(val)) {
                        
                        val.forEach(item => {
                            if (item.type === 'cart') {
                                this.cartData = item
                                this.showCartThumb = item.props?.is_show && item.props?.showCart && this.isPageShowCart;
                            }
                            if (item.type === 'scrollto') {
                                this.showTopThumb = item.props?.is_show && item.props?.showScrollto && this.isPageShowTop;
                            }
                            if (item.type === 'floating-window') {
                                this.showFloat = item.props?.is_show;
                                this.floatData = item
                            }
                        }) 
                    }
                       
                },
                immediate: true
            },
            scrollTop:{
                handler(val, oldVal){
                    let opacity
                    if(window.titleHeight + window.statusHeight!=0){
                        opacity = val / (window.titleHeight + window.statusHeight - 1);
                    }else{
                        opacity = 1
                    }
                    opacity = opacity > 1 ? 1 : opacity;
                    //不在初始化时执行，避免多次触发同一事件
                    if (oldVal != undefined){
                        this.reverseDeco( val > 0,opacity)//反转沉浸式样式
                        this.calcContentPos();
                        // 触发页面触底事件
                        if (reachScrollBottom(this.scrollContainer)) {
                            this.custEvents.dispatch('reachBottom')
                        }
                    }
                },
                immediate: true
            },     
        },
        methods: {
            scrollToTop(scrollTop=0) {
                try {
                    this.scrollContainer.scrollTop = scrollTop;
                } catch (error) {}
            },
            setShowTransition(){
                let info = this.deco_info?.filter(item => item.name == 'titlebar')[0]
                if(!!info?.props?.showTransition){
                    this.showTransition = true
                }else{
                    this.showTransition = false
                }
            },
            /**
             * 重置装修数据
             */
            resetData(){
                this.reverse = false,//装修数据是否反转
                this.stickyLayoutHeight = 0,//sticky元素的总高度
                this.scrollTop = 0,
                this.custEvents = CustEvent.init('deco'+this._uid),//自定义事件，用于父子组件通信（非广播型事件，只在id相同的组件间通信）
                this.statusBarPageConfig = {},//状态栏装修参数（不提供给titleBar组件，而是本页面内使用）
                this.stickyHeightTotal = 0 //offCanvas组件因为临时的左上角圆角需要这个值
            },
            /**
             * 子组件是递归组件，无法用$emit抛出，因此用custEvents
             */
            listenCustEvent(){
                this.custEvents.addListener('addFixed', this.addFixed)
                this.custEvents.addListener('setScrollView', this.setScrollView)
                this.custEvents.addListener('changeUnion', item => this.$emit('changeUnion', item))
                this.custEvents.addListener('changeTab', item => this.$emit('changeUnion', item))
                this.custEvents.addListener('scrollToTop', this.scrollToTop)
            },
            /**
             * 执行装修动作（入口）
             */
            execDeco(){
                //必须先重置数据。场景：切换装修内容后，初次刷新页面，会先加载旧装修数据，再加载新数据。加载新数据时，可能会遗留旧装修的数据，导致计算结果错误
                this.resetData()
                //装修titlebar
                this.decoTitleBar();
                //等待dom挂载后再计算sticky的位置
                this.$nextTick(()=>{
                    this.stickyLayout();
                })
            },
            /**
             * 反转沉浸式样式
             */
            reverseDeco(reverse,opacity){
                this.reverse = reverse;
                this.decoTitleBar(opacity);
                this.custEvents.dispatch('decoReverse', {reverse: reverse})
            },
            /**
             * 设置滚动容器。
             * @param el 容器对象
             * @param scroll 是否成为滚动容器，如果是falsy值，则重置为默认值
             */
            setScrollView(el, scroll = true, containerHeight = '100%'){
                const DEFAULT_SCROLL_VIEW = this.defaultScrollView || this.$refs.decoContent?.$el
                if(!el){
                    el = DEFAULT_SCROLL_VIEW;
                }
                //设置容器
                if(scroll){
                    this.scrollContainer = el
                }else{
                    this.scrollContainer = DEFAULT_SCROLL_VIEW
                }
                
                //设置decoContent样式
                if (this.$refs.decoContent?.$el) {
                    //1.如果滚动容器是decoContent
                    if (this.scrollContainer === this.$refs.decoContent?.$el){
                        this.$refs.decoContent.$el.style.height = '100%'
                        this.$refs.decoContent.$el.style.overflowY = 'auto'
                    } 
                    //2.如果滚动容器在子组件中，则由子组件告知本容器的高度，默认是100%。考虑到需求的多样性，可能会出现父组件可滚动，子组件也可滚动的情况
                    else {
                        this.$refs.decoContent.$el.style.height = containerHeight
                        this.$refs.decoContent.$el.style.overflowY = 'hidden'
                    }
                }

                this.addScrollEvent();
            },
            /**
             * 子组件发出通知，使其变成sticky-box
             */
            addFixed(dom, value){
                try {
                    const CLASS_NAME = 'sticky-box'
                    if(!value){
                        //本来就非fixed，即值未变，则不操作
                        if(!dom.classList.contains(CLASS_NAME)){
                            return;
                        }
                        dom.classList.remove(CLASS_NAME);
                    }else if(!dom.classList.contains(CLASS_NAME)){
                        dom.classList.add(CLASS_NAME);
                    }
                    this.stickyLayout(dom);
                } catch (error) {
                    console.error(error)
                }
            },
            /**
             * 设置sticky元素
             * @curDom(可选) 被设置为sticky的dom
             */
            stickyLayout(curDom){
                try {
                    let stickyDoms = document.querySelectorAll('.sticky-box');
                    let container = this.$refs.decoContent?.$el;
                    let startTop = 0;
                    let stickyHeight = 0;
                    if(isNotEmpty(stickyDoms) && isNotEmpty(container)){
                        //需要修改定位的起始index，默认从0开始
                        let startIndex = 0;
                        if(isNotEmpty(curDom)){
                            startIndex = Array.prototype.findIndex.call(stickyDoms, dom => dom == curDom);
                        }
                        //删除sticky元素，需要重新计算
                        if(startIndex == -1){
                            startIndex = 0;
                        }
        
                        startTop = window.titleBar.getDrawHeight();//是否从状态栏开始绘制内容
                        stickyHeight = Array.prototype.reduce.call(stickyDoms, (pre, cur, index) => {
                            pre--;//防止某些手机上有1px的间隔
                            let style = getStyle(cur);
                            let boxSizing = style.boxSizing;
                            let height = parseFloat(style.height);
                            //加上padding值。 定位元素不考虑margin
                            if(boxSizing == 'content-box'){
                                height += parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
                            }
                            //指定下标之前的dom不更新样式（节流）
                            if(index >= startIndex){
                                cur.style.top = pre + 'px';//设置当前定位元素的top
                            }
                            return pre + height;
                        }, startTop)
                    }
                    this.stickyLayoutHeight = stickyHeight - startTop;//实际高度需要减去初始top
                    this.calcContentPos();
                } catch (error) {
                    console.error(error)
                }
            },
             /**
             * 计算内容区域的位置
             */
             calcContentPos(){
                //沉浸式页面时，根据contentFillTop决定状态栏是否能放内容
                let startPosH = window.titleBar.getDrawHeight() <= 0 && !this.statusBarPageConfig.contentFillTop ? (window.statusHeight || 0) : 0;
                if(this.$refs.decoContent){
                    //(暂屏蔽，此代码会导致<记住滚动条位置>功能异常：在列表底部离开页面再回来，此时会触发该if，从而不会重置容器高度")
                    //触底的时候不可再增加marginTop，否则会使scrollTop变小 
                    // if(!this.resetScrollTop && getScrollTop(this.scrollContainer)>0 && reachScrollBottom(this.scrollContainer)){
                    //     return;
                    // }
                    //如果用paddingTop，会导致子组件的fixed计算不正确。因为paddingTop会随着sticky-box的增加而增加，从而导致offsetTop值改变
                    this.stickyHeightTotal = this.stickyLayoutHeight + startPosH;
                    this.$refs.decoContent.$el.style.marginTop = this.stickyHeightTotal + 'px';
                    //需要实时更新容器高度(因为上面用的marginTop，容器高度需要减去这一部分)
                    this.$refs.decoContent.$el.style.height = `calc(100% - ${this.stickyHeightTotal}px)`;
                }
            },
            /**
             * 装修titleBar
             */
            async decoTitleBar(opacity){
                this.setShowTransition()
                try{
                   
                    let reverse = this.reverse;
                    let titleBarConfig = this.deco_info?.filter(item => item.name == 'titlebar' || item.name == 'statusbar')?.reduce((pre, cur) => (pre[cur.name] = cur, pre), {});
                    let option = {};
                    if(isNotEmpty(titleBarConfig?.statusbar?.data)){
                        option.status = {}
                        let index = reverse ? (titleBarConfig.statusbar.data.length > 1 ? 1 : 0) : 0
                        let statusBarData = titleBarConfig.statusbar.data[index];
                        if(index==1&&!!this.showTransition){
                            this.mergeConfig(option.status, 'opacity',opacity)//设置透明度
                        }else{
                            this.mergeConfig(option.status, 'opacity', statusBarData.opacity)//设置透明度
                        }
                        this.mergeConfig(option.status, 'background', statusBarData.background)//设置背景
                        this.mergeConfig(option.status, 'themeMode', statusBarData.themeMode)//设置按钮颜色
                        //如果即悬浮又是透明, 则说明不需要显示status部分，此时最好将其隐藏，防止遮挡下面的元素
                        option.status.show = titleBarConfig.statusbar.props.is_show;

                        this.statusBarPageConfig.contentFillTop  = statusBarData.contentFillTop;//内容是否可填充到状态栏
                    }
                    if(isNotEmpty(titleBarConfig?.titlebar?.data)){
                        option.title = {}
                        let index = reverse ? (titleBarConfig.titlebar.data.length > 1 ? 1 : 0) : 0
                        let titleBarData = titleBarConfig.titlebar.data[index];
                        this.mergeConfig(option.title, 'suspend', titleBarData.suspend)//设置透悬浮
                        this.mergeConfig(option.status, 'suspend', titleBarData.suspend)//设置透悬浮 更改沉浸式模式，title上选择沉浸式后status的suspend属性会随title的suspend属性变动而变动
                        if(index==1&&!!this.showTransition){
                            this.mergeConfig(option.title, 'opacity', opacity)//设置透明度
                        }else{
                            this.mergeConfig(option.title, 'opacity', titleBarData.opacity)//设置透明度
                        }
                        this.mergeConfig(option.title, 'color', titleBarData.color)//设置透明度
                        this.mergeConfig(option.title, 'background', titleBarData.background)//设置背景
                        this.mergeConfig(option.title, 'themeMode', titleBarData.themeMode)//设置按钮颜色
                        this.mergeConfig(option.title, 'showBack', titleBarData.showBack)//设置返回按钮
                        this.mergeConfig(option.title, 'showTitle', titleBarData.showTitle)//设置显示文字
                        //如果即悬浮又是透明,也不用显示title文字，则说明不需要显示title部分，此时最好将其隐藏，防止遮挡下面的元素
                        option.title.show =  titleBarConfig.titlebar.props.is_show;
                    }
                    //todo 判断装修页面是否需要隐藏h5titlebar
                    if(sinosdk.sino.getPlatform()==sinosdk.sino.constant.RUN_ENV.WEBOA){//WEBOA环境下，将除了首页之外的其他页面H5title隐藏，使用app title
                        if(this.$route.path=='/pages/tabbar/services'||this.$route.path=='/pages/tabbar/personalcenter'){//直接写死"出行"与"我的"路由 后续需要优化
                            this.hideH5Titlebar();
                            sinosdk.sino.setTitleBar({showTitleBar:true})
                        }else{
                            if(isNotEmpty(option)){
                                this.$titleBar?.set(option)
                            }
                        }  
                    }else if(isSpecialChouzhou()){
                        this.hideH5Titlebar()
                    } else {
                        if(isNotEmpty(option)){
                            this.$titleBar?.set(option)
                        }
                    }
                }catch(e){
                    console.error(e)
                }
            },
            // 隐藏h5titlebar 
            hideH5Titlebar(){
                this.$titleBar?.set({
                    show: false
                })
            },
            /*==========监听scroll事件 start============*/
            addScrollEvent(){
                let that = this;
                docEventListeners.scroll?.();
                this.scrollContainer?.addEventListener('scroll', that.scrollEventHandle = function handler(){
                    that.scrollTop = getScrollTop(that.scrollContainer);
                }, true);
                docEventListeners.scroll = () => {
                    that.scrollContainer?.removeEventListener('scroll', that.scrollEventHandle, true);
                }
            },
            /**
             * 监听来自子frame发出的postMessage事件
             */
            listenChildFrameMessage(){
                let that = this;
                //移除监听（如有）
                docEventListeners.childFrameScroll?.();
                docEventListeners.closePage?.();
                //监听iframe事件，并更新listeners
                docEventListeners.childFrameScroll = sinosdk.sino.message.addEventListener('childFrameScroll', ()=>{
                    that.scrollTop = event.data.scrollTop;
                })
                docEventListeners.closePage = sinosdk.sino.message.addEventListener('closePage', ()=>{
                    that.appBackFun();
                    that.initAppEvent();
                })
            },
            /*==========监听scroll事件 end============*/
            /**
             * 合并对象
             */
            mergeConfig(target, key, value){
                if(isNotEmpty(value)){
                    target[key] = value;
                }
            },
            // 获取地址列表
            getDefaultAddress() {
                return this.defaultAddress
            },

            // 返回上一页
            toBack() {
                this.$Router.back(1)
            },
        },
    }
</script>

<style lang="scss">
    .container {
        width: 100%;
        height: 100%;
        &::before{
            display: table;
            content: "";
        }
    }
    .deco_content{
        height: 100%;
        /*这里不能用static之外的定位，否则在旧IOS上，会隐藏fixed的子元素 */
        position: static;
        z-index: 1;
        .children{
            position: relative;//设置子组件的offsetParent，防止子组件的offsetTop取值异常
        }
        ::v-deep .sticky-box{
            max-width: var(--page-width);
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            margin: 0;
            z-index: 900;
        }
    }
    .show-dialog {
        animation: 100ms showDialog linear forwards;
    }

     /* 富文本包裹层 */
    .rich_text_wrap {
        font-size: 28rpx;
        background: #fff;
        padding: 0 30rpx;
        box-sizing: border-box;
        word-break: break-word;
    }
</style>
