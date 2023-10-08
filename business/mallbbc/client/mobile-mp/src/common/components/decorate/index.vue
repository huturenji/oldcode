<template>
    <block>
        <scroll-view class="decorate_container" ref='container' :style="[getBackgroud()]">
            <!-- 没有装修数据时暂时空页面 -->

            <empty v-if="!hasDecoInfo && requestDone" emptyImg="icon_defpage_zwnr" tips="暂无装修数据" />

            <view v-if="hasDecoInfo && requestDone" class="deco_content" ref='decoContent'>
                <view class="index_deco" v-for="decoItem in deco_info" :key="decoItem.id">
                    <!-- tab -->
                    <deco-tab v-if="decoItem.name == 'tab' && decoItem.props.is_show == true" :decoItem="decoItem" />

                    <!-- 空白 -->
                    <fix-blank v-if="decoItem.name == 'fix-blank' && decoItem.props.is_show == true" :decoItem="decoItem" />

                    <!-- 个人信息 -->
                    <personal-center v-if="decoItem.name == 'personal-center' && decoItem.props.is_show == true" :decoItem="decoItem" />

                    <!-- 轮播图 -->
                    <image-swiper v-if="decoItem.name == 'image-swiper' && decoItem.props.is_show == true" :decoItem="decoItem" :getDefaultAddress="getDefaultAddress" />

                    <!-- 图片自由组合 -->
                    <img-combination v-if="decoItem.name == 'image-combination' && decoItem.props.is_show == true" :decoItem="decoItem" :parentScrollTop="parentScrollTop"/>

                    <!-- tab切换/商品分类 -->
                    <goods-category v-if="decoItem.name == 'goods-category' && decoItem.props.is_show == true" :decoItem="decoItem" :getDefaultAddress="getDefaultAddress" />

                    <!-- 导航 -->
                    <navigation v-if="decoItem.name == 'navigation' && decoItem.props.is_show == true" :decoItem="decoItem" />

                    <!-- 搭配 -->
                    <goods-image-top v-if="decoItem.name == 'goods-image-top' && decoItem.props.is_show == true" :decoItem="decoItem" :getDefaultAddress="getDefaultAddress" />
                    <!-- 热销 -->
                    <goods-hotsale v-if="decoItem.name == 'goods-hotsale' && decoItem.props.is_show == true" :decoItem="decoItem" :getDefaultAddress="getDefaultAddress" />

                    <!-- 推荐商品 -->
                    <goods v-if="decoItem.name == 'goods' && decoItem.props.is_show == true" :decoItem="decoItem" :getDefaultAddress="getDefaultAddress" />

                    <!--优惠券-->
                    <coupon v-if="decoItem.name == 'coupon' && decoItem.props.is_show == true" :decoItem='decoItem' />

                    <!--随机商品组件-->
                    <scrollloader v-if="decoItem.name == 'scrollloader' && decoItem.props.is_show == true"
                        :decoItem='decoItem' />

                    <!--商品图片组合组件-->
                    <goodsCombination v-if="decoItem.name == 'goods-combination' && decoItem.props.is_show == true" :decoItem='decoItem' />

                    <!--搜索组件-->
                    <search v-if="decoItem.name == 'search' && decoItem.props.is_show == true && showSearchBar" :decoItem='decoItem' :parentScrollTop="parentScrollTop" />

                    <!-- 秒杀入口 -->
                    <goods-seckill-entry v-if="decoItem.name == 'goods-seckill-entry' && decoItem.props.is_show == true" :decoItem='decoItem' />
                    <!-- 秒杀活动 -->
                    <goods-seckill-activity v-if="decoItem.name == 'goods-seckill-activity' && decoItem.props.is_show == true" :decoItem='decoItem' :getDefaultAddress="getDefaultAddress" />
                    <!-- 签到 -->
                    <sign-in v-if="decoItem.name == 'signin' && decoItem.props.is_show == true" :decoItem='decoItem' />

                    <!-- 公告 -->
                    <notice v-if="decoItem.name == 'notice' && decoItem.props.is_show == true" :decoItem='decoItem' />

                    <!-- 客服 -->
                    <customer-service v-if="decoItem.name == 'customer-service' && decoItem.props.is_show == true" :decoItem='decoItem' />

                    <!-- 辅助线 -->
                    <fix-line v-if="decoItem.name == 'fix-line' && decoItem.props.is_show == true" :decoItem='decoItem' />

                    <!-- 辅助图片 -->
                    <fix-image v-if="decoItem.name == 'fix-image' && decoItem.props.is_show == true" :decoItem='decoItem' :parentScrollTop="parentScrollTop" />
                    <!-- 一键领取 -->
                    <claim-all v-if="decoItem.name == 'claim-all' && decoItem.props.is_show == true" :decoItem='decoItem' />
                    <!-- 倒计时 -->
                    <counter-timer v-if="decoItem.name == 'counter-timer' && decoItem.props.is_show == true" :decoItem='decoItem' />
                    <!-- 天天专场 -->
                    <everyday-buy v-if="decoItem.name == 'everyday-buy' && decoItem.props.is_show == true" :decoItem='decoItem' :getDefaultAddress="getDefaultAddress" />
                    <!-- 一起买 -->
                    <together-buy v-if="decoItem.name == 'together-buy' && decoItem.props.is_show == true" :decoItem='decoItem' :getDefaultAddress="getDefaultAddress" />
                    <!-- 活动图片组合 -->
                    <activity-combination v-if="decoItem.name == 'activity-combination' && decoItem.props.is_show == true" :decoItem='decoItem' />
                </view>
                <view class="index_deco">
                    <!-- 小浮窗 -->
                    <floating-window
                        v-if="showCartThumb || showTopThumb || showFloat"
                        :decoItem='floatData'
                        :cartData="cartData"
                        :showFloat="showFloat"
                        :showCartThumb="showCartThumb"
                        :showTopThumb="showTopThumb"
                        :parentScrollTop="parentScrollTop"
                        @scrollToTop="scrollToTop"
                    />
                </view>
            </view>
        </scroll-view>
        <template v-if="fixImageList.length > 0 && requestDone">
            <template v-for="decoItem in fixImageList">
                <fix-image :key="decoItem.id" v-if="decoItem.name == 'fix-image' && decoItem.props.is_show == true" :decoItem='decoItem' :parentScrollTop="parentScrollTop" />
            </template>
        </template>
    </block>
</template>

<script>

import { isNotEmpty, isEmpty, getStorageSync } from '@/utils/common.js'
// *********装修组件******** //

// 轮播组件
import imageSwiper from '@/common/components/decorate/image-swiper/image-swiper.vue';
// 图片组合
import imgCombination from '@/common/components/decorate/image-combination/image-combination.vue';
// 空组件
import empty from '@/common/components/empty/index';

//商品分类组件
import goodsCategory from '@/common/components/decorate/goods-category/goods-category.vue';

// 导航组件
import navigation from '@/common/components/decorate/navigation/navigation.vue';

// 搭配组件
import goodsImageTop from '@/common/components/decorate/goods-image-top/goods-image-top.vue';
// 热销
import goodsHotsale from '@/common/components/decorate/goods-hotsale/goods-hotsale.vue';

// 推荐商品
import goods from '@/common/components/decorate/goods/goods.vue';

// 优惠券
import coupon from '@/common/components/decorate/coupon/coupon.vue';

// 随机商品组件
import scrollloader from '@/common/components/decorate/scrollloader/scrollloader.vue';

// 商品图片组合组件
import goodsCombination from '@/common/components/decorate/goods-combination/goods-combination.vue';

// 个人信息组件
import personalCenter from '@/common/components/decorate/personal-center/personal-center.vue';

// 固定空白
import fixBlank from '@/common/components/decorate/fix-blank/fix-blank.vue';

// 搜索
import search from '@/common/components/decorate/search/search.vue';
// tab
import decoTab from '@/common/components/decorate/tab/tab.vue';

// 购物车thumb组件
import cart from '@/common/components/decorate/cart/cart.vue';

// 秒杀入口
import goodsSeckillEntry from '@/common/components/decorate/goods-seckill-entry/goods-seckill-entry.vue';
// 一键领取
import claimAll from '@/common/components/decorate/claim-all/claim-all.vue';
// 秒杀活动
import goodsSeckillActivity from '@/common/components/decorate/goods-seckill-activity/goods-seckill-activity.vue';
// 签到
import signIn from '@/common/components/decorate/signIn';
// 倒计时
import counterTimer from '@/common/components/decorate/counter-timer/counter-timer.vue';
// 小浮窗
import floatingWindow from '@/common/components/decorate/floating-window/floating-window.vue';
// 天天专场
import everydayBuy from '@/common/components/decorate/everyday-buy/everyday-buy.vue';
// 一起买
import togetherBuy from '@/common/components/decorate/together-buy/together-buy.vue'
// 上下滑动
import scrollTo from '@/common/components/decorate/scrollto';
// 公告
import notice from '@/common/components/decorate/notice';
// 客服
import customerService from '@/common/components/decorate/customer-service';
// 辅助图片
import fixImage from '@/common/components/decorate/fix-image';
// 辅助线
import fixLine from '@/common/components/decorate/fix-line';
// 活动图片组合
import activityCombination from '@/common/components/decorate/activity-combination/activity-combination.vue';
import View from '../../../views/components/invoice/view.vue';

export default {
    components: {
        imageSwiper,
        imgCombination,
        empty,
        goodsCategory,
        navigation,
        goodsImageTop,
        goodsHotsale,
        goods,
        coupon,
        scrollloader,
        goodsCombination,
        personalCenter,
        fixBlank,
        search,
        decoTab,
        cart,
        goodsSeckillEntry,
        goodsSeckillActivity,
        claimAll,
        signIn,
        counterTimer,
        floatingWindow,
        everydayBuy,
        togetherBuy,
        scrollTo,
        notice,
        fixLine,
        fixImage,
        customerService,
        activityCombination
    },
    data() {
        return {
            // 小浮窗相关数据
            cartData: {},
            showCartThumb: false,
            showTopThumb: false,
            showFloat: false,
            floatData: {}
        };
    },
    props: {
        deco_info: {
            type: [Array, null],
        },
        parentScrollTop: {
            type: Number,
            default: 0
        },
        showSearchBar: {
            type: Boolean,
            default: true
        },
        requestDone: {
            type: Boolean,
            default: false
        },
    },
    computed: {
        /**
         * 获取默认地址
         */
        getDefaultAddress() {
            return this.$store.state.defaultAddress;
        },
        /**
         * 本组件的背景装修
         */
        background() {
            let data = this.deco_info?.find(item => item.name == 'background')
            if (isNotEmpty(data) && data.props.is_show) {
                let background = data?.styles[0]?.background
                if (isNotEmpty(background)) {
                    return background
                }
            }
            return null;
        },

        /**
         * 本组件的分享组件
         */
        share() {
            let data = this.deco_info?.find(item => item.name == 'share')
            if (isNotEmpty(data) && data.props.is_show) {
                let shareImg = data?.props?.shareImg
                if (isNotEmpty(shareImg)) {
                    this.$emit('updateShareImg', shareImg)
                }
            }
            return null;
        },

        hasDecoInfo() {
            if (this.deco_info !== null) {
                return (this.deco_info && this.deco_info.length > 0)
            } else {
                return false
            }
        },
        fixImageList() {
            let fixImageList = []
            if (this.hasDecoInfo) {
                for(let i = this.deco_info.length - 1; i > -1; i--) {
                    const item = this.deco_info[i];
                    if (item.name === 'fix-image' && !item.data.find(option => !option.fixed)) {
                        fixImageList.push(item);
                        this.deco_info.splice(i, 1);
                    } 
                }
            }
            return fixImageList;
        }
    },
    activated() {

    },
    deactivated() {

    },
    watch: {
        /**
         * 监听到装修数据变化时，开始绘制整体框架
         */
        deco_info: {
            handler(val, oldVal) {
                if (isNotEmpty(val) && JSON.stringify(val) != JSON.stringify(oldVal)) {
                    this.decoTitleBar()
                    this.initWindowFloat(val)
                }
            },
            immediate: true
        }
    },
    methods: {
        getBackgroud() {
            if (isEmpty(this.background)) { return {} }
            const style = {
                height: '100%',//默认高度
            }
            if (this.background.img) {
                style.backgroundImage = `url(${this.background.img})`;//背景颜色
                style.backgroundSize = 'contain';
                style.backgroundRepeat = 'no-repeat';
            } else {
                style.backgroundColor = this.background.color;//背景颜色
            }
            return style
        },

        /**
         * 装修titleBar
         */
        decoTitleBar() {
            try {
                let titleBarConfig = this.deco_info?.filter(item => item.name == 'titlebar' || item.name == 'statusbar')?.reduce((pre, cur) => (pre[cur.name] = cur, pre), {});
                if (isNotEmpty(titleBarConfig)) {
                    this.$emit('initNavbar', titleBarConfig)
                }

            } catch (e) {
                console.error(e)
            }
        },
        // 初始化小浮窗数据 将购物车/上下滑动/小浮窗组件整合
        initWindowFloat(val) {
            val.forEach(item => {
                if (item.name === 'cart') {
                    this.cartData = item
                    this.showCartThumb = item.props?.is_show && item.props?.showCart;
                }
                if (item.name === 'scrollto') {
                    this.showTopThumb = item.props?.is_show && item.props?.showScrollto;
                }
                if (item.name === 'floating-window') {
                    this.showFloat = item.props?.is_show;
                    this.floatData = item
                }
            })
        },
        /**
         * 向上滚动
         */
        scrollToTop(scrollTop = 0) {
            try {
                uni.pageScrollTo({
                    scrollTop,
                    duration: 300
                });
            } catch (error) {}
        },
    },
}
</script>

<style lang="scss" scoped>
.decorate_container {
    .deco_content {
        position: relative;
        overflow-x: hidden; // 为了去除swiper导致的横向滚动条
    }
}
</style>
