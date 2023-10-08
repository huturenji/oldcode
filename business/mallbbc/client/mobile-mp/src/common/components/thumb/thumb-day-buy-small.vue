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
        <view class="price_box">
            <view class="old_price">
                ¥{{ getPartNumber(goodsItem.salePrice,'int') }}{{ getPartNumber(goodsItem.salePrice,'decimal') }}
            </view>
            <view class="now_price">
                <view>
                    <view>
                        <text style="font-size: 24rpx;">¥</text>
                        <text style="font-size: 32rpx;">{{ getPartNumber(goodsItem.promotionPrice,'int') }}</text>
                        <text style="font-size: 22rpx;">{{ getPartNumber(goodsItem.promotionPrice,'decimal') }}</text>
                    </view>
                </view>
                <view>专场价</view>
            </view>
        </view>
    </view>
</template>

<script>
import { getPartNumber } from '@/utils/common';
import imgThumb from '@/common/components/thumb/imgThumb.vue';
import activityMinxin from './minxin/activity.js'

export default {
    name: "thumb-day-buy-small",
    components: {
        imgThumb
    },
    mixins:[activityMinxin],
    data() {
        return {
            getPartNumber
        };
    },
    props: {
        // 商品item对象
        goodsItem: {
            type: Object,
            default: () => {}
        }
    },
    mounted() {
    },
    methods: {
        //进入商品详情页
        goGoodsDetail({ sku, storeId, mainImage }) {
            try {
                this.$Router.push({
                    path: '/views/goods/detail/index',
                    query: {
                        sku, 
                        storeId, 
                        mainImage
                    }
                })
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
        height: 296rpx;
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
        padding: 0 20rpx 30rpx 20rpx;

        .old_price {
            height: 34rpx;
            line-height: 34rpx;
            font-size: 24rpx;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #666666;
            margin-bottom: 12rpx;
        }

        .now_price {
            position: relative;
            width: 100%;
            height: 52rpx;
            line-height: 52rpx;
            padding-left: 12rpx;
            font-weight: bold;
            background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/btn_tt_zcj3_bnj.svg") center no-repeat;
            background-size: 100%;
            border-radius: 8rpx 0 0 8rpx;

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
                right: 10%;
                transform: translateY(-50%);
                color: #fff;
                font-size: 22rpx;
            }
        }
    }
}
</style>
