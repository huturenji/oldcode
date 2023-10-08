<!-- 小浮窗组件
-->
<template name="floatingWindow">
    <view>
        <view class="floatingWindow right" :class="{floatWindowPc:isPC}">
            <view class="float_right_list flex_column_center_end" v-margin="decoItem" v-if="decoItem && decoItem.props && decoItem.props.is_show">
                <template v-for="(item,index) in rightFloatList">
                    <view v-if="rightFloatList && rightFloatList.length>0 && item.uploadImg.img" :key="index" class="item initRight" 
                    :class="{hideRightRotate:item.isShow && item.showStyle == 2 && onScroll,
                    hideRight:item.isShow && item.showStyle == 3 && onScroll,
                    opacity0:((item.showStyle == 0 && onScroll) || !item.isShow)}" ref="floatItemRight"
                    :style="{
                        right:((item.showStyle == 2 || item.showStyle == 3) && onScroll)?-1*(widthListRight[index]+40)/2+'px':'0'
                        }">
                        <img :src="item.uploadImg.img?item.uploadImg.img:''" @click="goPage(item)"/>
                        <view class="close" @click="close(item)" v-if="item.allowClose && !(item.showStyle == 0 && onScroll) && item.isShow"></view>
                    </view>
                </template>
            </view>
            <!-- 页面悬浮的返回顶部按钮-->
            <template v-if="showBackTop && showTopThumb">
                <scrollto @scrollToTop="scrollToTop"></scrollto>
            </template>
            <!-- 页面悬浮的购物车按钮-->
            <template v-if="!disabledModule && showCartThumb">
                <cart :decoItem='cartData'></cart>
            </template>
        </view>

        <view class="floatingWindow left" :class="{floatWindowPc:isPC}" v-if="decoItem && decoItem.props && decoItem.props.is_show && leftFloatList && leftFloatList.length>0" v-margin="decoItem">
            <template v-for="(item,index) in leftFloatList">
                <view v-if="item.uploadImg.img" :key="index" class="item initLeft" 
                :class="{hideLeftRotate:item.isShow && item.showStyle == 2 && onScroll,
                hideLeft:item.isShow && item.showStyle == 3 && onScroll,
                opacity0:((item.showStyle == 0 && onScroll) || !item.isShow)}" ref="floatItemLeft"
                :style="{
                    left:((item.showStyle == 2 || item.showStyle == 3) && onScroll)?-1*(widthListLeft[index]+40)/2+'px':'0',
                    }">
                    <img :src="item.uploadImg.img?item.uploadImg.img:''" @click="goPage(item)"/>
                    <view class="close" @click="close(item)" v-if="item.allowClose && !(item.showStyle == 0 && onScroll) && item.isShow"></view>
                </view>
            </template>
        </view>
    </view>
    
</template>

<script>
import { skipTo, getViewportInfo, isNotEmpty } from '@/utils/common.js'
import { mapGetters } from "vuex";
import scrollto from '@/components/decorate/scrollto/scrollto.vue';
import cart from '@/components/decorate/cart/cart.vue';
export default {
    name: "deco-floating-window",
    components: {
        scrollto,
        cart
    },
    data() {
        return {
            onScroll:false, //页面是否正在滚动
            widthListLeft:[], //左侧小浮窗宽度集合
            widthListRight:[], //右侧小浮窗宽度集合
            leftFloatList:[], //左侧小浮窗数据
            rightFloatList:[], //右侧小浮窗数据
            time:null, //是否在滚动的定时器
            showBackTopHeight: 300, //显示返回顶部的滚动高度
            showBackTop: false, //是否显示返回顶部按钮
            isPC:SnUtils.isPC()
        }
    },
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        },
        // 购物车数据
        cartData: {
            type: Object,
            default: () => {}
        },
        // 区域滚动高度
        parentScrollTop: {
            type: Number,
            default: 0
        },
        // 是否显示购物车按钮
        showCartThumb: {
            type: Boolean,
            default:false
        },
        // 是否显示回到顶部按钮
        showTopThumb: {
            type: Boolean,
            default:false
        },
        isDecoReady: {
            type: Boolean
        }
    },
    computed: {
        ...mapGetters(["disabledModule"])
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
        },
        decoItem: {
            handler(val) {
                if (isNotEmpty(val) && this.isDecoReady){
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
                        this.leftFloatList.forEach(item => {
                            this.widthListLeft.push(item.uploadImg.width?item.uploadImg.width>100?100:item.uploadImg.width:50)
                        })
                        this.rightFloatList.forEach(item => {
                            this.widthListRight.push(item.uploadImg.width?item.uploadImg.width>100?100:item.uploadImg.width:50)
                        })
                    }
                }
                
            },
            immediate:true
        }
    },
    created() {

    },
    mounted(){
        this.initTopHeight()
    },
    methods: {
        scrollToTop() {
            this.$emit('scrollToTop')
        },
        goPage(item) {
            if ((item.showStyle == 0 && this.onScroll) || !item.isShow) {
                return
            }
            skipTo(item.uploadImg, this);
        },
        async initTopHeight(){
            try {  
                let { height } = await getViewportInfo();
                //显示返回顶部按钮的最小高度，100为tabbar高度和顶部搜索栏高度
                this.showBackTopHeight = height - 100;
            } catch (error) {
                
            }
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
        display: flex;
        flex-direction: column;
        position: fixed;
        z-index: 1000;
        bottom: calc(170rpx + var(--safe-area-inset-bottom)); 
        pointer-events: none;
        &.floatWindowPc {
            padding: 0 40rpx 170rpx;
            overflow-x: hidden;
            bottom: calc(0rpx + var(--safe-area-inset-bottom));
            &.right {
                padding-left: 90rpx;
                right: calc((100vw - 750rpx) / 2);
            }
            &.left {
                padding-right: 90rpx;
                left:  calc((100vw - 750rpx) / 2);
            }
        }
        &.right {
            right: calc((100vw - 750rpx) / 2 + 40rpx);
            align-items: flex-end;
            ::v-deep .backTop {
                margin-top: 20rpx;
                position: static;
                bottom: unset;
                right: unset;   
                z-index: unset;
                pointer-events: auto;
            }
            ::v-deep .cart-thumb {
                margin-top: 20rpx;
                position: relative;
                bottom: unset; 
                right: unset;   
                z-index: unset;
                pointer-events: auto;
            }
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
                img {
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
            background: url('@/static/shared/common/icon/close.svg') center/100% 100% no-repeat;
            pointer-events: auto;
        }
        img {
            vertical-align: middle;
            max-width: 200rpx;
            pointer-events: auto;
        }
    }
</style>
