<!-- 巨拾惠一起买item组件
-->
<template name="goodsItem">
    <view class="goods_item" @click="goGoodsDetail(goodsItem)" v-if="goodsItem">
        <view class="goods-img">
            <imgThumb :imgSrc="goodsItem.mainImage" showThumbTips :noSale="promotionNoSale(goodsItem)" />
        </view>
        <view class="goodsNameWrap">
            <view :title="goodsItem.skuName" class="goods_name">
                <text>{{ goodsItem.skuName }}</text>
            </view>
        </view>
        <view class="price_box flex_row_between_start">
            <view class="old_price">
                ¥{{$getPartNumber(goodsItem.salePrice,'int')}}{{$getPartNumber(goodsItem.salePrice,'decimal')}}
            </view>
            <view class="now_price">
                <view>
                    <view v-fitFontSize>
                        <text style="font-size: 28rpx;">¥</text>
                        <text style="font-size: 36rpx;">{{ $getPartNumber(goodsItem.promotionPrice,'int') }}</text>
                        <text style="font-size: 24rpx;">{{ $getPartNumber(goodsItem.promotionPrice,'decimal') }}</text>
                    </view>
                </view>
                <view>专场价</view>
            </view>
        </view>
    </view>
</template>

<script>
import imgThumb from "@/components/goods/thumb/imgThumb.vue";
import activityMinxin from './minxin/activity.js'
export default {
    name: "thumb-day-buy-big",
    data() {
        return {

        };
    },
    components: {
        imgThumb
    },
    mixins:[activityMinxin],
    props: {
        // 商品item对象
        goodsItem: {
            type: Object,
            default: () => {}
        }
    },
    mounted() {},
    methods: {
        //进入商品详情页
        goGoodsDetail(goodsItem) {
            try {
                let sku = goodsItem.sku;
                this.$Router.push({
                    path: '/standard/product/detail',
                    query: {
                        sku
                    }
                });
            } catch (error) {
                console.log("跳转到商品详情出错", error);
            }
        }
    }
};
</script>

<style scoped lang='scss'>
.goods_item {
    background: #fff;
    border-radius: 20rpx;
    box-shadow: -2rpx 0rpx 40rpx -4rpx rgba(156, 159, 169, 0.1);
    overflow: hidden;
    position: relative;

    .goods-img {
        width: 100%;
        height: 560rpx;
        overflow: hidden;

        ::v-deep uni-image {
            border-radius: 20rpx 20rpx 0 0 !important;
        }
        ::v-deep img {
            width: 100%;
            height: auto;
            display: block;
        }
    }
    .goodsNameWrap {
        height: 76rpx;
        overflow: hidden;
        margin: 16rpx 0 14rpx;
        word-break: break-all;

        .goods_name {
            max-height: 76rpx;
            width: 100%;
            padding: 0 20rpx;
            font-size: 28rpx;
            color: #222222;
            line-height: 36rpx;
            font-weight: bold;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
        }
    }

    .price_box {
        height: 56rpx;
        line-height: 56rpx;
        padding: 0 28rpx;
        margin-bottom: 30rpx;

        .old_price {
            height: 56rpx;
            line-height: 56rpx;
            font-size: 24rpx;
            
            font-weight: 400;
            text-align: left;
            color: #666666;
        }

        .now_price {
            position: relative;
            width: 308rpx;
            height: 56rpx;
            line-height: 56rpx;
            padding-left: 16rpx;
            font-weight: bold;
            background: var(--dayDayBuyPriceBgBig);
            background-size: 100% 100%;

            > view:first-child {
                width: 52%;
                color: #fff;

                > view {
                    width: fit-content;
                }
            }

            > view:last-child {
                position: absolute;
                top: 50%;
                right: 44rpx;
                transform: translateY(-50%);
                color: var(--prizeColor2);
                font-size: 26rpx;
            }
        }
    }
}
</style>
