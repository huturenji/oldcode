<!-- 商品组件：竖直方向
    点击进入商品详情页
    应用于商品列表页面
-->
<template name="goodsListItemV">
    <view class="goods_v_item flex_column_start_start" v-if="goods_info">
        <view class="goods-img">
            <image :src="goods_info.mainImage" />
        </view>
        <view class="bottom_part flex_column_center_between">
            <view class="bottom flex_column_center_between">
                <view class="goods-price flex_row_center_center">
                    <view class="left flex_column_center_center">
                        <view class="left_price num-font">
                            <text class="unit fontScaleIgnore">￥</text>
                            <text
                                class="price_int fontScaleIgnore">{{ getPartNumber(seckillVopType?goods_info.promotionPrice: goods_info.seckillInfoVO ? goods_info.seckillInfoVO.promotionPrice : goods_info.salePrice, 'int') }}</text>
                            <text
                                class="price_decimal fontScaleIgnore">{{
                                    getPartNumber(seckillVopType?goods_info.promotionPrice: goods_info.seckillInfoVO ? goods_info.seckillInfoVO.promotionPrice : goods_info.salePrice
                                    , 'decimal')
                                }}</text>
                        </view>
                        <view class="old_price num-font fontScaleIgnore">
                            ￥{{ getPartNumber(seckillVopType?goods_info.salePrice: goods_info.seckillInfoVO ? goods_info.seckillInfoVO.seckillOriPrice : goods_info.originalSalePrice, 'int') }}{{ getPartNumber(seckillVopType?goods_info.salePrice: goods_info.seckillInfoVO ? goods_info.seckillInfoVO.seckillOriPrice : goods_info.originalSalePrice, 'decimal') }}
                        </view>
                    </view>
                </view>
            </view>

        </view>
    </view>
</template>

<script>
import imgThumb from "@/common/components/thumb/imgThumb.vue";
import { getPartNumber } from '@/utils/common';
export default {
    name: "thumb-seckill-index",
    data() {
        return {
            getPartNumber,
        }
    },
    mounted(){
    },
    components: {
        imgThumb
    },
    props: {
        goods_info: {
            type: Object,
            value: {}
        },
        seckillVopType: {
            type: Boolean,
            value: true
        }
    },
    methods: {
        //进入商品详情页
        goGoodsDetail(goods_info) {
            this.$Router.push({ path: '/views/goods/detail', query: { sku: goods_info.sku } })
        }
    }
}
</script>

<style lang='scss'>
.goods_v_item {
    background: #fff;
    overflow: hidden;
    padding: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12rpx;

    .goods-img {
        width: 100rpx;
        height: 100rpx;
        display: block;
        border-radius: 12rpx;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        overflow: hidden;

    }

    .bottom_part {
        flex: 1;
        margin-top: 4rpx;
        width: 100%;
    }

    .goods-price {
        width: 100%;
        color: #f30300;

        .unit.fontScaleIgnore {
            font-size: 24rpx;
            letter-spacing: -2px;
        }

        .price_int.fontScaleIgnore {
            font-size: 36rpx;
        }

        .price_decimal.fontScaleIgnore {
            font-size: 24rpx;
        }

        .old_price.fontScaleIgnore {
            font-size: 26rpx;
            text-decoration: line-through;
            color: #A4ACB2;
        }

    }
}
</style>
