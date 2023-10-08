<!-- eslint-disable vue/valid-v-for -->
<template>
    <view class='children-components' v-if='deco_info && deco_info.length>0'>
        <template v-for="(decoItem) in deco_info">
            <keep-alive v-if="isKeepAlive">
                <component
                    v-if="decoItem.props.is_show == true"
                    :key="decoItem.id"
                    :is="decoComs[decoItem.name]"
                    :decoItem='decoItem'
                    :parentScrollTop='parentScrollTop'
                    :showTransition='showTransition'
                    v-bind="$attrs"
                />
            </keep-alive>
            <template v-else>
                <component
                    v-if="decoItem.props.is_show == true"
                    :key="decoItem.id"
                    :is="decoComs[decoItem.name]"
                    :decoItem='decoItem'
                    :parentScrollTop='parentScrollTop'
                    :showTransition='showTransition'
                    v-bind="$attrs"
                />
            </template>
        </template>
    </view>
</template>
 
<script>
// 搜索组件
import decoSearch from '@/components/decorate/search/search.vue';
// 公告组件
import decoNotice from '@/components/decorate/notice/notice.vue';
// 导航组件
import decoNavigation from '@/components/decorate/navigation/navigation.vue';
// 客服组件
import decoCustomerService from '@/components/decorate/customer-service/customer-service.vue';
// 搭配组件
import decoGoodsImageTop from '@/components/decorate/goods-image-top/goods-image-top.vue';
// 辅助图片组件（顶部slogan用到）
import decoFixImage from '@/components/decorate/fix-image/fix-image.vue'; 
// 辅助线组件
import decoFixLine from '@/components/decorate/fix-line/fix-line.vue'; 
// 辅助空白组件
import decoFixBlank from '@/components/decorate/fix-blank/fix-blank.vue';    
// 轮播组件
import decoImageSwiper from '@/components/decorate/image-swiper/image-swiper.vue';    
// 推荐商品组件
import decoGoods from '@/components/decorate/goods/goods.vue'; 
// tab切换组件
import decoGoodsCategory from '@/components/decorate/goods-category/goods-category.vue'; 
// live组件
import decoLive from '@/components/decorate/live/live.vue'; 
// 短视频组件
import decoShortVideo from '@/components/decorate/short-video/short-video.vue'; 
// tab组件
import decoTab from '@/components/decorate/tab/tab.vue'; 
// 咨询组件
import decoMedia from '@/components/decorate/media/media.vue'; 
// 广告组件
import decoAdvertise from '@/components/decorate/advertise/advertise.vue'; 
// 分类资讯组件
import mediaCategory from '@/components/decorate/media-category/media-category.vue'; 
// 富文本
import decoRichText from '@/components/decorate/rich-text/rich-text.vue';
// 富文本
import decoHtml from '@/components/decorate/html/html.vue';
// 秒杀活动
import decoGoodsSeckillActivity from '@/components/decorate/goods-seckill-activity/goods-seckill-activity.vue';
// 秒杀入口
import decoGoodsSeckillEntry from '@/components/decorate/goods-seckill-entry/goods-seckill-entry.vue';
// 热销
import decoGoodsHotsale from '@/components/decorate/goods-hotsale/goods-hotsale.vue';
// 图片组合
import decoImageCombination from '@/components/decorate/image-combination/image-combination.vue';
// 优惠券
import decoCoupon from '@/components/decorate/coupon/coupon.vue';
// 个人信息
import decoPersonalCenter from '@/components/decorate/personal-center/personal-center.vue'
// 商品样式组合
import decoGoodsCombination from '@/components/decorate/goods-combination/goods-combination.vue'
// tab竖向商品分类组件
import decoOffcanvas from '@/components/decorate/offcanvas/offcanvas.vue'
// 一起买组件
import decoTogetherBuy from '@/components/decorate/together-buy/together-buy.vue'
// 天天专场组件
import decoEverydayBuy from '@/components/decorate/everyday-buy/everyday-buy.vue'
// 滚动选择商品组件
import decoScrollloader from '@/components/decorate/scrollloader/scrollloader.vue'
// 倒计时组件
import decoCounterTimer from '@/components/decorate/counter-timer/counter-timer.vue'
// 签到组件
import decoSignin from '@/components/decorate/signin/signin.vue'
// 一键领取组件
import decoClaimAll from '@/components/decorate/claim-all/claim-all.vue'
// 活动图片组合组件
import decoActivityCombination from '@/components/decorate/activity-combination/activity-combination.vue'
export default {
    name:'children',
    data() {
        return {
            decoComs:{
                'search':decoSearch,
                'notice':decoNotice,
                'navigation':decoNavigation,
                'customer-service':decoCustomerService,
                'goods-image-top':decoGoodsImageTop,
                'fix-image':decoFixImage,
                'fix-line':decoFixLine,
                'fix-blank':decoFixBlank,
                'image-swiper':decoImageSwiper,
                'goods':decoGoods,
                'goods-category':decoGoodsCategory,
                'live': decoLive,
                'short-video': decoShortVideo,
                'tab': decoTab,
                'media': decoMedia,
                'advertise': decoAdvertise,
                'media-category': mediaCategory,
                'rich-text': decoRichText,
                'html':decoHtml,
                'goods-seckill-activity': decoGoodsSeckillActivity,
                'goods-seckill-entry': decoGoodsSeckillEntry,
                'goods-hotsale': decoGoodsHotsale,
                'image-combination': decoImageCombination,
                'coupon': decoCoupon,
                'personal-center': decoPersonalCenter,
                'goods-combination': decoGoodsCombination,
                'offcanvas': decoOffcanvas,
                'together-buy': decoTogetherBuy,
                'everyday-buy': decoEverydayBuy,
                'scrollloader': decoScrollloader,
                'counter-timer': decoCounterTimer,
                'signin': decoSignin,
                'claim-all':decoClaimAll,
                'activity-combination':decoActivityCombination
            }
        };
    },
    props: {
        deco_info: {
            type: Array,
            require: true
        },
        isKeepAlive: {
            type: Boolean,
            default: false
        },
        parentScrollTop:{
            type:Number,
            default:0
        },
        showTransition:{
            type: Boolean,
            default: false
        }
    }
}
</script>
<style lang="scss">
.children-components{
    height: 100%;
    max-width: var(--page-width);
    .search{
        z-index: 901;
    }
}
</style>