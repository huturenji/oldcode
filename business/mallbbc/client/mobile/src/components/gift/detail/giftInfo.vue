<template>
    <view class="gift-detail-wrapper">
        <view class="card">
            <view class="supplier">
                <view class="storeLogo" v-if="gift.storeId=='6'"></view>
                <image class="img" :src="gift.storeLogo" mode="widthFix" v-else/>
                <view class="name"><text>{{ gift.storeName }}</text></view>
            </view>
            <view class="gift-info" v-for="(product, index) in gift.products" :key="index"
             :class="{free:product.productType==2,attachment:product.productType==1}"
             @click="goProductDetail(product.sku, product.spu)">
                <view class="main-image">
                    <image :src="product.mainImage" />
                </view>
                <view class="center_right">
                    <view class="row1">
                        <view class="description" :style="isGiver ? null : receiverWidth">
                            <text>{{ product.skuName }}</text>
                        </view>
                        <view class="num-wrapper">
                            <view class="num-font" v-if="isGiver">
                                <text class="mark">¥</text>
                                <text class="integer">{{ $getPartNumber(product.productShowPrice, 'int') }}
                                </text>
                                <text class="decimal">{{ $getPartNumber(product.productShowPrice, 'decimal') }}</text>
                            </view>
                            <view>
                                <text class="num num-font" :style="isGiver ? null : receiverFont">
                                    *{{ product.productNum }}
                                </text>
                            </view>
                        </view>
                    </view>
                    <view class="row2">
                        <view class="detail">{{ product.specValues }}</view>
                    </view>
                    <view v-if="!isGiver && isReceiverUsed && orderState === 40  && product.productType === 0 && product.serviceList" class="btn-wrapper">
                        <!-- 收礼人在订单完成的状态下，只能对主商品申请售后 -->
                        <!-- 售后方式如果为空  说明本身不支持售后  如果num为0就说明是支持售后，但没有可售后的商品了 -->
                        <block>
                            <view class="btn"
                            :class="{refund_btn:product.serviceList.num !== 0 && product.serviceList.afterSaleTypes && product.serviceList.afterSaleTypes.length !== 0}"
                                @click.stop="selectService(orderSn, product.orderProductId, product.serviceList)">
                                <text>申请售后</text>
                            </view>
                            <view v-if="afsList.length && product.serviceList.afterSaleTypes && product.serviceList.afterSaleTypes.length !== 0" class="btn" @click.stop="toAfsList(orderSn)">
                                <text>售后详情</text>
                            </view>
                        </block>
                    </view>
                </view>
            </view>
            
        </view>
    </view>

</template>

<script>
import giftHandler from "@/components/gift/handler";

export default {
    props: {
        gift: {
            type: Object,
            default: () => {
                return {
                    storeName: '',
                    storeLogo: '',
                    products: [],
                    storeId:''
                }
            }
        },
        orderSn: {
            type: String,
            default: ''
        },
        orderState: {
            type: Number,
            default: 0
        },
        isGiver: {
            type: Boolean,
            default: false
        },
        isReceiverUsed: {
            type: Boolean,
            default: false
        }

    },
    data() {
        return {
            receiverFont: {
                fontSize: '32rpx'
            },
            receiverWidth: {
                width: '370rpx'
            },
            afsList: []
        }
    },
    mounted() {
        this.fetchAfsList();
    },
    activated() {
        this.fetchAfsList();
    },
    methods: {
        // 售后服务
        selectService(orderSn, orderProductId, serviceList) {
            if (!serviceList || serviceList.num === 0 || serviceList.afterSaleTypes.length === 0) {
                this.$api.msg('该商品无法售后!');
                return;
            }
            let param = {};
            param.url = 'v3/postsale/front/after/sale/apply/applyInfo';
            param.method = 'GET';
            param.data = {};
            param.data.orderSn = orderSn; //订单号
            param.data.orderProductId = orderProductId; //订单明细id
            this.$request(param).then(res => {
                if (res.state == 200) {
                    const len = this.gift.products.filter((item) => { return item.productType == 0 }).length;
                    this.$Router.push({ path: '/views/order/aftersale/index', query: { orderSn, orderProductId, sourceType: 'giftDetail', orderListLen: len } });
                } else if (res.state == 255){
                    this.$api.msg('很抱歉，当前商品的售后服务时间已超期，如有疑问，请联系客服');
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        },
        fetchAfsList() {
            uni.showLoading();
            giftHandler.afsList({
                orderSn: this.orderSn
            }).then(res => {
                if (res.state === 200) {
                    this.afsList = res.data.list;
                }
            }).catch((e) => {
                console.error('error:', e);
            }).finally(() => {
                uni.hideLoading();
            })
        },
        //去商品详情页
        goProductDetail(sku, spu) {
            this.$Router.push({ path: '/standard/product/detail', query: { sku, spu } })
        },
        // 跳转到售后列表页
        toAfsList(orderSn) {
            this.$Router.push({ path: '/views/gift/afterSale/list', query: { orderSn } })
        }

    }
}
</script>

<style lang="scss" scoped>
.gift-detail-wrapper {
    box-sizing: border-box;
    background: #ffffff;
    border: 3rpx solid #ffffff;
    border-radius: 20rpx;
    margin-top: 20rpx;

    .card {
        padding: 28rpx 32rpx 40rpx 32rpx;

        .supplier {
            display: flex;
            gap: 8rpx;
            align-items: center;

            .img {
                height: 40rpx;
                width: 40rpx;
                border-radius: 50%;

            }
            .storeLogo {
                width: 40rpx;
                height: 40rpx;
                border-radius: 50%;
                // background: var(--storeLogo);
                background: url('@/static/shared/common/img/icon_logo_jingdongqiyegou_bnj.svg') center no-repeat;
                background-size: 100% 100%;
            }

            .name {
                margin-left: 10rpx;
                font-size: 28rpx;
                height: 40rpx;
                line-height: 40rpx;
            }
        }

        .gift-info {
            margin-top: 20rpx;
            display: flex;
            justify-content: flex-start;

            &.free,
            &.attachment {
                position: relative;
                margin-top: 22rpx;
                padding: 22rpx;
                border-radius: 16rpx;
                border: 2rpx dashed #ff8366;

                .img {
                    width: 148rpx;
                    height: 148rpx;
                }

                .center_right {
                    margin-left: 20rpx;

                    .row1 {
                        .description {
                            font-size: 26rpx;
                            font-weight: normal;
                        }
                    }
                }

                .num-wrapper {
                    height: 32rpx;
                    line-height: 32rpx;
                    font-weight: normal;

                    .num {
                        font-size: 26rpx !important;
                    }
                }

                .row2 {
                    .detail {
                        font-size: 22rpx !important;
                    }
                }
            }

            &.attachment::before,
            &.free::before {
                display: block;
                content: '';
                width: 68rpx;
                height: 68rpx;
                position: absolute;
                left: 0;
                top: -1px;
                z-index: 1;
            }

            &.attachment::before {
                background: url('@/static/shared/gift/icon_emq_fujian.png') center no-repeat;
                background-size: 68rpx 68rpx;
            }

            &.free::before {
                background: url('@/static/shared/gift/icon_emq_zengpin.png') center no-repeat;
                background-size: 68rpx 68rpx;
            }


            .main-image {
                width: 160rpx;
                height: 160rpx;
                border-radius: 16rpx;
                overflow: hidden;

                image {
                    width: 160rpx;
                    height: 160rpx;
                }
            }

            .center_right {
                margin-left: 24rpx;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;

                .row1 {
                    display: flex;
                    justify-content: space-between;

                    .description {
                        color: #222222;
                        font-size: 28rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        width: 300rpx;
                        font-weight: bold;
                        font-size: 28rpx;
                        color: #222222;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        word-break: break-all;
                        line-height: 150%;
                        font-weight: bold;
                        width: 300rpx;
                    }

                    .num-wrapper {
                        text-align: right;

                        .num {
                            font-weight: normal;
                            font-size: 28rpx;
                        }
                    }
                }

                .row2 {
                    margin-top: 40rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .detail {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        width: 290rpx;
                        white-space: nowrap;
                        font-size: 26rpx;
                        color: #999;
                        font-weight: 400;
                    }
                }

                .btn-wrapper {
                    box-sizing: content-box;
                    height: 58rpx;
                    padding-top: 28rpx;
                    display: flex;
                    justify-content: flex-end;

                    &>view {
                        margin-left: 20rpx;
                    }
                    .refund_btn{
                        border: 2rpx solid #f30300;
                        text{
                            color: #f30300;
                        }
                    }
                }
            }
        }

    }
}

.btn {
    width: 144rpx;
    height: 56rpx;
    border: 1.8rpx solid #c2c2c2;
    border-radius: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &>text {
        color: #222222;
        font-weight: bold;
        font-size: 24rpx;
    }
}


.integer,
.mark,
.decimal {
    font-weight: bold;
}

.mark {
    font-size: 24rpx;
}

.integer {
    font-size: 32rpx;
}

.decimal {
    font-size: 20rpx;
}
</style>