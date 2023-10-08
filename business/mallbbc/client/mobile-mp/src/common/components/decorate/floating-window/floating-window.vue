<!-- 小浮窗组件
-->
<template name="floatingWindow">
    <view>
        <view class="floatingWindow right" :style="[styles]">
            <template v-for="(item, index) in rightFloatList">
                <view
                    v-if="item.uploadImg.img"
                    :key="index"
                    :class="[{
                        item: true,
                        initRight: true,
                        hideRightRotate: item.isShow && item.showStyle == 2 && onScroll,
                        hideRight: item.isShow && item.showStyle == 3 && onScroll,
                        opacity0: ((item.showStyle == 0 && onScroll) || !item.isShow)
                    }]"
                    :style="[{
                        right: ((item.showStyle == 2 || item.showStyle == 3) && onScroll)?-((item.width || 0) + 40)/2+'px':'0'
                    }]"
                >
                    <image
                        :src="item.uploadImg.img"
                        @load="imageLoad($event, index, 'right')"
                        @click.stop="goPage(item)"
                        :style="{ width: item.width + 'px', height: item.height + 'px' }"
                    />
                    <view class="close" @click="close(item)" v-if="item.allowClose && !(item.showStyle == 0 && onScroll) && item.isShow"></view>
                </view>
            </template>
            <!-- 页面悬浮的返回顶部按钮-->
            <template v-if="showBackTop && showTopThumb">
                <scrollTo @scrollToTop="scrollToTop" />
            </template>
            <!-- 页面悬浮的购物车按钮-->
            <template v-if="showCartThumb">
                <cart :decoItem='cartData'></cart>
            </template>
        </view>

        <view class="floatingWindow left" :style="[styles]">
            <template v-for="(item,index) in leftFloatList">
                <view
                    v-if="item.uploadImg.img"
                    :key="index"
                    :class="[{
                        item: true,
                        initLeft: true,
                        hideLeftRotate:item.isShow && item.showStyle == 2 && onScroll,
                        hideLeft:item.isShow && item.showStyle == 3 && onScroll,
                        opacity0:((item.showStyle == 0 && onScroll) || !item.isShow)
                    }]"
                    :style="{
                        left:((item.showStyle == 2 || item.showStyle == 3) && onScroll) ? (-((item.width || 0)+40/2)+'px') : '0'
                    }"
                >
                    <image
                        :src="item.uploadImg.img"
                        @load="imageLoad($event, index, 'left')"
                        @click="goPage(item)"
                        :style="{ width: item.width + 'px', height: item.height + 'px' }"
                    />
                    <view class="close" @click="close(item)" v-if="item.allowClose && !(item.showStyle == 0 && onScroll) && item.isShow"></view>
                </view>
            </template>
        </view>
    </view>
</template>

<script>
import mixin from "@/common/components/decorate/common/mixin/index";
import cart from '@/common/components/decorate/cart/cart.vue';
import scrollTo from '@/common/components/decorate/scrollto';
import { skipTo, getViewportInfo } from '@/utils/common.js'

export default {
    name: "deco-floating-window",
    mixins: [mixin],
    components: {
        cart,
        scrollTo
    },
    data() {
        return {
            onScroll:false, //页面是否正在滚动
            leftFloatList:[], //左侧小浮窗数据
            rightFloatList:[], //右侧小浮窗数据
            time:null, //是否在滚动的定时器
            showBackTopHeight: 300, //显示返回顶部的滚动高度
            showBackTop: false //是否显示返回顶部按钮
        }
    },
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        },
        // 区域滚动高度
        parentScrollTop: {
            type: Number,
            default: 0
        },
        // 是否显示自定义小浮窗
        showFloat: {
            type: Boolean,
            default: false
        },
        // 是否显示购物车按钮
        showCartThumb: {
            type: Boolean,
            default: false
        },
        // 是否显示回到顶部按钮
        showTopThumb: {
            type: Boolean,
            default: false
        },
        cartData: {
            type: Object,
            default: () => {}
        }
    },
    watch: {
        parentScrollTop:{
            handler(val, oldVal){
                //不在初始化时执行，避免多次触发同一事件
                this.showBackTop = val > this.showBackTopHeight; 
                if (oldVal != undefined){
                    this.judgePageScrollState()
                }
            },
            immediate: true
        }
    },
    mounted() {
        if (this.showFloat) {
            this.initData(this.decoItem)
            this.initSpace(this.decoItem)
        }
        
        this.initTopHeight()
    },
    methods: {
        initData(val) {
            if (val.data && val.data.length>0) {
                let tempData = []
                val.data.forEach((item) => {
                    tempData.push({...item,isShow:true})
                })
                this.leftFloatList = tempData.filter((item) => {
                    return item.position == 'left'
                })
                this.rightFloatList = tempData.filter((item) => {
                    return item.position == 'right'
                })
            }
        },
        // 滑动到顶部
        scrollToTop() {
            this.$emit('scrollToTop')
        },
        async initTopHeight(){
            try {  
                let { height } = await getViewportInfo();
                //显示返回顶部按钮的最小高度，100为tabbar高度和顶部搜索栏高度
                this.showBackTopHeight = height - 100;
            } catch (error) {
                
            }
        },
        imageLoad(e, index, type) {
            if (type === 'right') {
                if (e.detail.width > 100) {
                    this.$set(this.rightFloatList[index], 'width', 100)
                    this.$set(this.rightFloatList[index], 'height', e.detail.height * 100 / e.detail.width)
                } else {
                    this.$set(this.rightFloatList[index], 'width', e.detail.width)
                    this.$set(this.rightFloatList[index], 'height', e.detail.height)
                }
            }

            if (type === 'left') {
                if (e.detail.width > 100) {
                    this.$set(this.leftFloatList[index], 'width', 100)
                    this.$set(this.leftFloatList[index], 'height', e.detail.height * 100 / e.detail.width)
                } else {
                    this.$set(this.leftFloatList[index], 'width', e.detail.width)
                    this.$set(this.leftFloatList[index], 'height', e.detail.height)
                }
            }
        },
        goPage(item) {
            if ((item.showStyle == 0 && this.onScroll) || !item.isShow) {
                return
            }
            skipTo(item.uploadImg, this);
        },
        close(item) {
            item.isShow = false
        },
        // 判断页面是否在滚动的状态 
        judgePageScrollState(){
            if (!!this.time){
                clearTimeout(this.time)
            }
            this.onScroll = true;
            this.time = setTimeout(() => {
                this.onScroll = false;
            }, 1000);
        }
    }
}
</script>

<style lang='scss' scoped>
    .floatingWindow {
        position: fixed;
        z-index: 999;
        bottom: calc(170rpx + env(safe-area-inset-bottom)); 
        display: flex;
        flex-direction: column;
        pointer-events: none;
        &.right {
            right: calc((100vw - 750rpx) / 2 + 40rpx);
            align-items: flex-end;
        }
        &.left {
            left:  calc((100vw - 750rpx) / 2 + 40rpx);
        }
        .item {
            width: fit-content;
            position: relative;
            margin-top: 32rpx;
            opacity: 1;
            &.opacity0 {
                opacity: 0;
                image {
                    pointer-events: none;
                }
            }
            &.initRight {
                right: 0;
                transform: rotate(0);
                transition: transform .2s linear, right .2s .4s linear;
            }
            &.initLeft {
                left: 0;
                transform: rotate(0);
                transition: transform .2s linear, left .2s .4s linear;
            }
            &.hideRightRotate {
                opacity: .5;
                transition: transform .2s linear, right .2s .4s linear; 
                transform: rotate(-30deg);
            }
            &.hideLeftRotate {
                opacity: .5;
                transition: transform .2s linear, left .2s .4s linear; 
                transform: rotate(30deg);
            }
            &.hideRight {
                opacity: .5;
                transition: transform .2s linear, right .2s .4s linear; 
            }
            &.hideLeft {
                opacity: .5;
                transition: transform .2s linear, left .2s .4s linear; 
            }
        }
        .close {
            position: absolute;
            right: -32rpx;
            top: -32rpx;
            width: 32rpx;
            height: 32rpx;
            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/close.svg') center/100% 100% no-repeat;
            pointer-events: auto;
        }

        image {
            vertical-align: middle;
            max-width: 200rpx;
            pointer-events: auto;
        }
    }
</style>
