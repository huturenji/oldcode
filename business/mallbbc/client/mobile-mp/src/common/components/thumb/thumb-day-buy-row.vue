<!-- 巨拾惠折扣新秒杀item组件
-->
<template name="goodsItem">
    <view class="thumb-seckill" v-if="goodsItem">
        <view class="seckill_item flex_row_center_center" @click="goGoodsDetail(goodsItem)">
            <view class="goods-img">
                <imgThumb :imgSrc="goodsItem.mainImage" showThumbTips :noSale="promotionNoSale(goodsItem)" />
            </view>
            <view class="right flex_column_between_start">
                <view class="top">
                    <view class="goods-name">
                        {{ goodsItem.skuName }}</view>
                </view>
                <view class="bottom">
                    <view class="old_price">
                        ¥{{ getPartNumber(goodsItem.salePrice,'int') }}{{ getPartNumber(goodsItem.salePrice,'decimal') }}
                    </view>
                    <view class="now_price">
                        <view>
                            <view>
                                <text style="font-size: 28rpx;">¥</text>
                                <text style="font-size: 36rpx;">{{ getPartNumber(goodsItem.promotionPrice,'int') }}</text>
                                <text style="font-size: 24rpx;">{{ getPartNumber(goodsItem.promotionPrice,'decimal') }}</text>
                            </view>
                        </view>
                        <view>专场价</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { getPartNumber } from '@/utils/common';
import imgThumb from '@/common/components/thumb/imgThumb.vue';
import activityMinxin from './minxin/activity.js'
import goodsHandler from "@/views/components/goods/handler.js";

export default {
    name: 'thumb-day-buy-row',
    components: {
        imgThumb,
    },
    mixins: [activityMinxin],
    props: {
        // 商品列表数据
        goodsItem:{
            type: Object,
            default:()=>{}
        }
    },
    components: {
        // imgThumb
    },
    // mixins:[activityMinxin],
    data() {
        return {
            getPartNumber
        }
    },
    mounted() {
    },
    computed: {
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
}
</script>

<style lang='scss' scoped>
.thumb-seckill {
    width: 100%;
    .seckill_item {
        width: 100%;
        height: 270rpx;
        padding-left: 20rpx;
        border-radius: 12rpx;
        overflow: hidden;
        background: #fff;
        position: relative;

        .goods-img {
            width: 230rpx;
            height: auto;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            overflow: hidden;
            flex-shrink: 0;
        }
        .right {
            width: 100%;
            height: 100%;
            padding: 16rpx 0rpx 20rpx 20rpx;
        }
        .top {
            width: 100%;
            padding: 0 24rpx 12rpx 0;
        }
        .goods-name {
            font-size: 28rpx;
            color: #222222;
            font-weight: bold;
            line-height: 130%;
            min-height: 32rpx;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
        }

        .bottom {
            width: 100%;
            padding-right: 22rpx;
            .old_price {
                height: 34rpx;
                line-height: 34rpx;
                font-size: 24rpx;
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #666666;
                margin-bottom: 8rpx;
            }

            .now_price {
                position: relative;
                width: 100%;
                padding-left: 16rpx;
                height: 52rpx;
                line-height: 52rpx;
                font-weight: bold;
                background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/btn_tt_zcj_4_bnj.svg") center no-repeat;
                background-size: 100%;
                border-radius: 8rpx 0 0 8rpx;

                > view:first-child {
                    width: 50%;
                    color: #fff;

                    > view {
                        width: fit-content;
                    }
                }

                > view:last-child {
                    position: absolute;
                    top: 50%;
                    right: 11%;
                    transform: translateY(-50%);
                    color: #fff;
                }
            }
        }
    }
}
</style>
