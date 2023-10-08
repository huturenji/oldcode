<!-- 商品卡片页 -->
<template>
    <view class="order-product-box" @click="viewGoodsDetail">
        <view class="product-horizontal">
            <view class="top-part">
                <view class="left-part">
                    <image class="main-image" :src="orderProduct.mainImage" />
                </view>
                <view class="center-part">
                    <view class="sku-name text-ellipsis">
                        <text>{{ orderProduct.skuName }}</text>
                    </view>
                    <view class="spec-value text-ellipsis">
                        <text>{{ orderProduct.specValues || '' }}</text>
                    </view>

                </view>
                <view class="right-part">
                    <view class="others" v-if="orderProduct.productType == 1">附件</view>
                    <view class="others" v-else-if="orderProduct.productType == 2">赠品</view>
                    <view class="price-wrapper num-font" v-else>
                        <text>￥</text>
                        <text>{{ getPartNumber(orderProduct.productShowPrice, 'int') }}</text>
                        <text>{{ getPartNumber(orderProduct.productShowPrice, 'decimal') }}</text>
                    </view>
                    <view>*{{ orderProduct.productNum }}</view>
                </view>
            </view>
            <view class="bottom-part">
                <slot name="bottom-part"></slot>
            </view>
        </view>
    </view>
</template>

<script>
import { getPartNumber } from '@/utils/common';

export default {
    name: 'thumb-order-product',
    data() {
        return {
            getPartNumber
        }
    },
    props: {
        orderProduct: {
            type: Object,
            default: () => { }
        }
    },
    methods: {
        viewGoodsDetail() {
            this.$emit('viewGoodsDetail', this.orderProduct.sku, this.orderProduct.storeId, this.orderProduct.mainImage)
        }
    }

}
</script>

<style lang="scss" scoped>
.text-ellipsis {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
}

.order-product-box {
    overflow: hidden;

    .product-horizontal {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .top-part {
            display: flex;
            margin-top: 30rpx;
            width: 100%;

            .left-part {
                width: 160rpx;
                margin-right: 24rpx;

                .main-image {
                    width: 160rpx;
                    height: 160rpx;
                    border-radius: 16rpx;
                }
            }

            .center-part {
                width: 320rpx;
                display: flex;
                flex-direction: column;
                // justify-content: space-between;

                .sku-name {
                    color: #222222;
                    font-size: 28rpx;
                    font-weight: bold;
                }

                .spec-value {
                    margin-top: 20rpx;
                    font-size: 28rpx;
                    color: #999;
                    margin-top: 8rpx;
                }
            }

            .right-part {
                flex: 1;
                display: flex;
                flex-direction: column;
                // justify-content: space-between;
                align-items: flex-end;
                margin-left: 40rpx;

                .others {
                    // margin-top: 20rpx;
                    font-weight: bold;
                }

                .price-wrapper {
                    // margin-top: 10px;
                    text-align: right;
                    &>text {
                        color: #222222;
                    }

                    &>text:nth-child(1) {
                        font-size: 20rpx;
                    }

                    &>text:nth-child(2) {
                        font-size: 28rpx;
                    }

                    &>text:nth-child(3) {
                        font-size: 20rpx;
                    }
                }
            }
        }
    }
}
</style>
