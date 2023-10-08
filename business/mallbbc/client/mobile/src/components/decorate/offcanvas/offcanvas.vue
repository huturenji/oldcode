<template>
    <view class='tab-row' v-margin="decoItem">
        <view class="tab-left">
            <tabs 
                :class="{ 'tabFixed': showMoreTabFixed }" :style="{ 'top': stickyHeightTotal + 'px', 'height': '100%' }"
                :list="titleList"
                :current="currIndex"
                :itemStyle="{width: '80rpx',padding:'24rpx 0'}"     
                lineWidth="24rpx"
                lineHeight="94rpx"  
                :lineColor="`url(${imgUrl + 'offcanvas/btn_home_miaodian.png'}) 100% 100% no-repeat`"  
                @click="data => data.index != currIndex && change(data.index - currIndex)"                        
            >
            <template v-slot:content="{navItem}">
                <view class="tabs-content" :class="currIndex==navItem.index?'active':''">
                    <view class="text" v-for="(textItem,index) in navItem.item.title.split('')" :key="index">{{ textItem }}</view>
                    <!-- <view class="img"><image :src="currIndex==navItem.index?imgUrl+'/offcanvas/test1.png':imgUrl+'/offcanvas/test.png'" mode="widthFix"></image></view> -->
                </view>
            </template>
            </tabs>
        </view>
        <view
            class="tab-right"
            ref="scrollView"
        >
            <template v-if="currNavItem">
                <!-- 拉伸背景 -->
                <view
                    v-if="currNavItem.backgroundImg"
                    class="tabBg1"
                    :style="{
                        'background-image': `url(${currNavItem.backgroundImg})`,
                        'background-repeat': 'no-repeat',
                        'background-position': 'top',
                        'backgroundSize': '100% 100%'
                    }"
                ></view>
                <view ref='bounceContent' class='bounce-content' :class='{"no-top-bounce": currIndex > 0}' :style="{ 'paddingBottom': (!noMoreShow.bottomShow || isPC) ? 0 : '104rpx' }">
                    <!-- 模拟顶部下拉回到上一页回弹占位 -->
                    <slideMore v-if="noMoreShow.topShow" :text="noMoreShow.topTitle" class="topViewMore"></slideMore>
                    
                    <!-- 右侧title区域 -->
                    <view class="tab-right-top" v-if="currNavItem.mainTitle.img || currNavItem.subTitle.titleStyle === 'imgOrtext'">
                        <!-- 顶部背景 -->
                        <view
                            v-if="currNavItem.topBackgroundImg"
                            class="tabBg2"
                            :style="{
                                'background-image': `url(${currNavItem.topBackgroundImg})`,
                                'background-repeat': 'no-repeat',
                                'background-position': 'top',
                                'backgroundSize': '100% auto'
                            }"
                        ></view>
                        <view class="right-title" ref="rightTitle" v-if="currNavItem.mainTitle.img || currNavItem.subTitle.titleStyle !== 'none'">
                            <!-- 左侧主标题 -->
                            <view class="right-title-left">
                                <image :src="currNavItem.mainTitle.img" mode="heightFix" />
                            </view>
                            <!-- 右侧区域 图文 -->
                            <view class="right-title-right">
                                <view class="imgOrtext" v-if="currNavItem.subTitle.titleStyle === 'imgOrtext'" @click="skipTo(currNavItem.subTitle)">
                                    <view v-if="currNavItem.subTitle.title">{{ currNavItem.subTitle.title }}</view>
                                    <image v-else-if="currNavItem.subTitle.img" :src="currNavItem.subTitle.img" mode="heightFix" />
                                </view>
                            </view>
                        </view>
                    </view>
    
                    <!-- 轮播和图片自由组合区域 -->
                    <view class="right-components">
                        <Children v-if='children[currNavItem.id]' isKeepAlive :deco_info='children[currNavItem.id]' :isChildren="true" :parentScrollTop="parentScrollTop" :isDecoReady="isDecoReady" :getDefaultAddress="getDefaultAddress" />
                    </view>
                    
                    <slideMore class="slideMore" v-if="noMoreShow.bottomShow && !isPC" :text="noMoreShow.bottomTitle"></slideMore>
                </view>
            </template>
        </view>
    </view>
</template>
<script>
import eventsMixin from '../common/mixin/eventsMixin'
import { skipTo, isH5, isNotEmpty, getUrlParams } from '@/utils/common.js'
import tabs from "@/components/tabs-column/u-tabs.vue";
import slideMore from "@/components/slide-more/index.vue"
import Bounce from '@/utils/bounce'
const Children = () => import('@/components/decorate/common/components/children.vue')

export default {
    name: 'deco-offcanvas',
    mixins: [eventsMixin],
    components: {
        Children,
        tabs,
        slideMore
    },
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        },
        parentScrollTop: {
            type: Number,
            default: 0
        },
        stickyHeightTotal: {
            type: Number
        },
        //装修内容所在的滚动区域（默认是document）
        scrollContainer: {
            // #ifdef H5
            type: [HTMLElement, Document]
            // #endif
        },
        isDecoReady: {},
        // 获取默认地址信息
        getDefaultAddress: {
            type: Function
        }
    },
    watch: {
        currNavItem(){
            if (this.currIndex >= this.nav_list.length){
                return;
            }
            this.scrollContainer.scrollTop=0;
            this.$nextTick(() => this.bindBounce())
        },
        parentScrollTop:{
            handler(val, oldVal) {
                //不在初始化时执行，避免多次触发同一事件
                if (oldVal != undefined) {
                    this.tabFixed()
                }
            },
            immediate: true
        },
        decoItem: {
            handler(val) {
                if (isNotEmpty(val) && this.isDecoReady) {
                    this.initData(JSON.parse(JSON.stringify(val)))
                }
            },
            deep: true,
            immediate: true
        }
    },
    computed: {
        children(){
            return this.decoItem?.children || {}
        },
        // 当前选中的tab
        currNavItem() {
            return isNotEmpty(this.nav_list) ? this.nav_list[this.currIndex] : null;
        },
        // 暂无更多是否显示
        // 最后一个tab，接口/装修没有商品 && 有其他嵌套组件时 不显示"暂无更多"
        noMoreShow() {
            let obj = {
                topTitle: '',
                topShow: false,
                bottomTitle: '',
                bottomShow: true
            }
            try {
                if (this.currIndex < this.titleList.length - 1) {
                    obj.bottomTitle = `向上滑前往"${this.titleList[this.currIndex + 1].title}"`
                } else {
                    obj.bottomShow = false
                }

                if (this.currIndex > 0) {
                    obj.topTitle = `向上滑前往"${this.titleList[this.currIndex - 1].title}"`
                    obj.topShow = true
                }
            } catch (error) {
                obj = {
                    topTitle: '',
                    topShow: false,
                    bottomTitle: '',
                    bottomShow: false
                }
            }

            return obj
        }
    },
    data() {
        return {
            bounceIns: null,
            skeletonLoading: false,//是否在展示骨架图（全局参数）
            imgUrl: getApp().globalData.imgUrl,
            statusBarHeight: window.statusHeight,
            showMoreTabFixed: false,
            currIndex: 0, // 当前分类索引
            nav_list: [],
            titleList: [],
            isPC: isH5() ? SnUtils.isPC() : false,
            isPageLeave: false
        }
    },
    mounted() {
        // 页面渲染完后计算一次组件所需高度
        setTimeout(() => { this.tabFixed() }, 500)
        //设置滚动容器
        this.setScrollView()
    },
    destroyed() {
        this.secInterval && clearInterval(this.secInterval)
    },
    activated() {
        this.isPageLeave = false
    },
    deactivated() {
        this.isPageLeave = true
    },
    methods: {
        bindBounce(){
            let config = {el:this.$refs.bounceContent.$el, bounceTop: this.currIndex > 0, bounceBottom: this.currIndex != this.nav_list.length-1, scrollEl: this.$refs.scrollView.$el}
            //注意：下滑到底时，需要数据加载完了才能
            let events = {onBounceTop: ()=> this.change(-1), onBounceBottom: ()=>!this.skeletonLoading && this.change(1)};
            if (!this.bounceIns){
                this.bounceIns = new Bounce(config, events);
            } else {
                this.bounceIns.set(config)
            }
        },
        setScrollView(){
            if (this.$refs.scrollView){
                this.custEvents.dispatch('setScrollView', this.$refs.scrollView.$el, true)
            }
        },
        // 初始化数据
        initData(data) {
            this.titleList = data.data.map((item, index) => {
                return {
                    title: item.leftTitle.title,
                    index: index
                }
            })
            // 对tab数据进行处理
            this.nav_list = data.data.map(item => {
                let obj = {
                    leftTitle: item.leftTitle || {},
                    mainTitle: item.mainTitle || {},
                    subTitle: item.subTitle || {},
                    backgroundImg: item.backgroundImg,
                    topBackgroundImg: item.topBackgroundImg,
                    id: item.leftTitle.id
                }
                return obj
            })

            // 如果url上面有location
            const location = getUrlParams('location')
            if (location && !isNaN(parseInt(location)) && parseInt(location) >= 0 && parseInt(location) < this.nav_list.length) {
                this.currIndex = parseInt(location)
            }
        },
        // 计算左侧tab区域是否进行fixed吸顶
        tabFixed() {
            try {
                let domList = document.querySelectorAll('.tab-left');
                    
                if (domList.length > 1){ return }
                let domTop = domList[0].getBoundingClientRect().top;
                // 根据元素离顶部距离控制是否使用fixed布局
                if (domTop <= this.stickyHeightTotal) {
                    this.showMoreTabFixed = true;
                } else {
                    this.showMoreTabFixed = false;
                }
            } catch (error) {
                this.showMoreTabFixed = false;
            }
        },
        change(diff){
            if (this.isPageLeave || this.currIndex >= this.nav_list.length) { return }
            // tab切换之前记录当前的二级分类和三级分类
            this.currIndex = this.currIndex + diff
            if (this.currIndex < 0){ //防止内存溢出
                this.currIndex = 0;
            }
            // tab切换后返回页面顶部
            //这里的和watch currNavItem里面滚动逻辑的都别删,IOS16上，两个菜单来回切换，当第二次切到下一个菜单时，
            //第二个菜单的scrollTop会卡住，不滚到顶部。原因未知，但这里和watch里面都写，可以解决此问题
            setTimeout(() => {
                try {
                    this.scrollContainer.scrollTop=0;
                } catch (error) {}
            },100)
        },
        // 装修跳转相关
        skipTo(item) {
            skipTo(item, this);
        }
    }
};
</script>
<style lang='scss' scoped>
.tab-row {
    width: 100%;
    height: 100%;
    position: relative;

    .tab-left {
        position: absolute;
        top: 0;
        left: 0;
        width: 100rpx;
        height: 100%;
        color: #fff;
        overflow: hidden;/*防止子元素u-tab超出高度*/
        z-index: 99;
         ::v-deep .u-tabs__wrapper__nav__line{
            right: -20rpx;
        }
        ::v-deep .uni-scroll-view-content{
            width: 80rpx;
            background: #000;
        }
        ::v-deep .u-tabs__wrapper__nav__item{
            background: #000;
        }

        .tabFixed {
            position: fixed;
            top: 0;
            left: auto;
            right: auto;
            width: 100rpx;
            z-index: 900;
        }
        .u-tabs {
            ::v-deep .u-tabs__wrapper__nav__item {
                padding: 0;
            }
            .tabs-content {
                width: 80rpx;
                font-size: 30rpx;
                color: #fff;
                &.active {
                    font-size: 40rpx;
                    transition: transform 0.4s;
                }
                .text {
                    padding: 0 22rpx;
                }
                .img {
                    width: 100%;
                    image {
                        width: 100%;
                    }
                }
            }
        }

        .menu-item {
            text-align: center;
            position: relative;
            padding: 20rpx 0;

            > view {
                cursor: pointer;
                font-size: 30rpx;

                &.menu-active {
                    font-size: 40rpx;
                    font-weight: 400;
                }
            }
        }

        .active-icon {
            position: absolute;
            width: 24rpx;
            height: 96rpx;
            right: -20rpx;
            transform: translateY(-50%);
            transition: 0.3s;

            image {
                width: 100%;
                height: 100%;
                vertical-align: top;
            }
        }
    }

    .tab-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
        width: calc(100% - 80rpx);
        height: 100%;
        margin-left: 80rpx;
        border-top-left-radius: 16rpx;
        padding: 26rpx 28rpx 38rpx 30rpx;
        background-color: #eff2f5;
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;

        .topViewMore{
            margin-bottom: 20rpx;
        }

        .bounce-content{
            position: relative;
            flex: auto;
            
            &.no-top-bounce{
                margin-top: -120rpx;
            }

            .slideMore {
                position: absolute;
                left: 0;
                bottom: 0;
            }
        }


        .right-title {
            position: relative;
            width: 100%;
            height: 48rpx;

            .right-title-left,
            image {
                height: 100%;
            }

            .right-title-right {
                position: absolute;
                top: 0;
                right: 0;
                height: 48rpx;

                .imgOrtext {
                    height: 48rpx;
                    line-height: 48rpx;
                    cursor: pointer;
                }
            }
        }

        .tab-right-top {
            margin-bottom: 20rpx;
            position: relative;
        }

        .right-components {
            position: relative;
        }

        .tabBg1 {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
        }

        .tabBg2 {
            position: absolute;
            width: 100%;
            height: 50vh;
            left: 0;
            top: -32rpx;
        }
    }
}
</style>