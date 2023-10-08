<template>
    <view class="gift-detail-wrapper">
        <w-loading ref="loading"></w-loading>
        <view class="card">
            <view class="supplier">
                <view class="ownStoreLogo" v-if="gift.storeId=='6'"></view>
                <image class="img" :src="gift.storeLogo" mode="widthFix" v-else/>
                <view class="name"><text>{{ gift.storeName }}</text></view>
            </view>
            <view class="gift-info" v-for="(item, index) in gift.products" :key="index" @click="viewGoodsDetail(item)">
                <view v-if="item.productType == 0" class="warp">
                    <view class="img">
                        <imgThumb :imgSrc="item.mainImage"/>
                    </view>
                    <view class="nameWrap">
                        <view class="name">{{item.skuName}}</view>
                        <view class="spec">{{item.specValues||''}}</view>
                    </view>
                    <view class="price-amount-info">
                        <view class="price" v-if="isGiver">
                            <text class="num-font">
                                <text class="mark">￥</text>
                                <text class="integer">{{ getPartNumber(item.productShowPrice, 'int') }}
                                </text>
                                <text class="decimal">{{ getPartNumber(item.productShowPrice, 'decimal')
                                }}</text>
                            </text>
                        </view>
                        <view class="amount num-font">*{{ item.productNum }}</view>
                    </view>
                </view>
                <view v-else class="giftWarp">
                    <view class="giftImg">
                        <imgThumb :imgSrc="item.mainImage"/>
                    </view>
                    <view class="nameWrap">
                        <view class="tag_name">
                            <text class="tag">{{giftType[item.productType].text}}</text>
                            <text class="name">{{item.skuName}}</text>
                        </view>
                        <view class="spec">
                            {{item.specValues||''}}
                        </view>
                    </view>
                    <view class="productNum">
                        *{{ item.productNum }}
                    </view>
                </view>
                <view v-if="!isGiver" class="btn-wrapper">
                    <!-- 收礼人在订单完成的状态下，只能对主商品申请售后 -->
                    <!-- 售后方式如果为空  说明本身不支持售后  如果num为0就说明是支持售后，但没有可售后的商品了 -->
                    <block v-if="isReceiverUsed && orderState === 40  && item.productType === 0 && item.serviceList">
                        <view class="btn btn-disabled"
                            :class="{refund_btn:item.serviceList.num !== 0 && item.serviceList.afterSaleTypes && item.serviceList.afterSaleTypes.length !== 0}"
                            @click.stop="selectService(orderSn, item.orderProductId, item.serviceList)">
                            <text>申请售后</text>
                        </view>
                        <view v-if="afsList.length" class="btn" @click.stop="toAfsList(orderSn)">
                            <text>售后详情</text>
                        </view>
                    </block>
                </view>
            </view>
        </view>
    </view>

</template>

<script>
import imgThumb from "@/common/components/thumb/imgThumb.vue";
import { getAfsList, selectAfsService } from "@/views/components/aftersale/handler";
import { getPartNumber } from '@/utils/common';

export default {
    components: { imgThumb },
    props: {
        gift: {
            type: Object,
            default: () => {
                return {
                    storeName: '',
                    storeLogo: '',
                    products: []
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
            getPartNumber,
            afsList: [],
            receiverFont: {
                fontSize: '32rpx'
            },
            receiverWidth: {
                width: '370rpx'
            },
            giftType:{
                1:{
                    text:'附件'
                },
                2:{
                    text:'赠品'
                }
            }
        }
    },
    mounted() {
        this.fetchAfsList();
    },
    methods: {
        // 售后服务
        selectService(orderSn, orderProductId, serviceList) {
            if (!serviceList || serviceList.num === 0 || serviceList.afterSaleTypes.length === 0) {
                uni.showToast({
                        title: '该商品无法售后',
                        icon: 'none'
                })
                return;
            }
  
            const param = {
                orderSn: orderSn, //订单号
                orderProductId: orderProductId //订单明细id 
            };

            selectAfsService(param).then(res=>{
                if (res.state == 200) {
                    const len = this.gift.products.filter((item) => { return item.productType == 0 }).length;
                    this.$Router.push({ 
                        path: '/views/gift/afterSale/index', 
                        query: { orderSn, orderProductId, sourceType: 'giftDetail', orderListLen: len } 
                    });
                } else {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            })
        },
        fetchAfsList() {
            this.$refs?.loading?.open();
            getAfsList({
                orderSn: this.orderSn
            }).then(res => {
                if (res.state === 200) {
                    this.afsList = res.data.list;
                }
            }).catch((e) => {
                console.error('error:', e);
            }).finally(e=>{
                this.$refs?.loading?.close();
            })
        },
        // 跳转到售后列表页
        toAfsList(orderSn) {
            this.$Router.push({ path: '/views/gift/afterSale/list', query: { orderSn, sourceType: 'giftDetail' } })
        },
        viewGoodsDetail({sku, storeId, mainImage}){
            this.$emit('viewGoodsDetail', sku, storeId, mainImage);
        }
    }
}
</script>

<style lang="scss" scoped>
.gift-detail-wrapper {
    box-sizing: border-box;
    background: #ffffff;
    border: 3rpx solid #ffffff;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;

    .card {
        margin: 28rpx 32rpx;

        .supplier {
            display: flex;
            gap: 8rpx;
            align-items: center;

            .ownStoreLogo {
                height: 40rpx;
                width: 40rpx;
                background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_logo_jingdongqiyegou_bnj.svg');
                background-size: 100% 100%;
            }

            .img {
                height: 40rpx;
                width: 40rpx;
                border-radius: 50%;

            }

            .name {
                margin-left: 10rpx;
                font-size: 28rpx;
                height: 40rpx;
                line-height: 40rpx;
            }
        } 
    }
}

.gift-info{
    .warp{
        margin-top: 20rpx;
        display: flex;
        justify-content: flex-start;
    }
    .name{
        margin-right: 10px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin-bottom: 10rpx;
        font-size: 28rpx;
        font-weight: bold;
        text-align: left;
        .store{
            padding: 2rpx 10rpx;
            height: 30rpx;
            background: #f30300;
            border-radius: 6rpx;
            color: #fff;
            line-height: 30rpx;
            text-align: center;
            font-size: 20rpx;
            vertical-align: center;
            margin-right: 10rpx;
            margin-top: 6rpx;
            font-weight: bold;
        }
    }
    .spec{
        color: #999;
        width: 360rpx;
        font-size: 26rpx;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: bold;
    }
    .img{
        width: 160rpx;
        height: 160rpx;
        border-radius: 16rpx;
        flex-shrink: 0;
        margin-right: 20rpx;
    }
    .giftWarp{
        height: 192rpx;
        border-radius: 16rpx;
        margin-top: 24rpx;
        position: relative;
        overflow: hidden;
        display: flex;
        padding: 20rpx;
        .leftText{
            color: #fff;
            font-size: 20rpx;
            width: 140rpx;
            height: 40rpx;
            background-color: #f30300;
            text-align: center;
            line-height: 40rpx;
            transform: rotate(-45deg);
            position: absolute;
            left: -40rpx;
            top: 6rpx;
            z-index: 10;
        }
        .giftImg{
            width: 148rpx;
            height:148rpx;
            margin-right: 20rpx;
            flex-shrink: 0;
        }
        .nameWrap{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-right: 10px;
            height: 150rpx;
            .tag_name{
                display: flex;
                align-items: flex-start;
            }
            .tag{
                box-sizing: content-box;
                height: 26rpx;
                line-height: 26rpx;
                flex-shrink: 0;
                color: $main-color;
                font-size: 20rpx;
                font-weight: bold;
                border: 2rpx solid $main-color;
                border-radius: 6rpx;
                margin-right: 16rpx;
                margin-top: 2rpx;
                padding: 2rpx 8rpx;
            }
            .name{
                font-size: 26rpx;
                color: #222;
                padding-top: 0;
            }
            .spec{
                font-size: 22rpx;
                color: #999;
            }
        }
    }
    .price-amount-info{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .price{
            font-size: 14px;
        }

        .amount{
            font-size: 14px;
        }
    }
}
.btn_disabled {
    opacity: 0.5;
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

.btn-disabled{
    width: 144rpx;
    height: 56rpx;
    border: 1.8rpx solid #c2c2c2;
    border-radius: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &>text {
        color: #999;
        font-weight: bold;
        font-size: 24rpx;
    }
}


.btn-wrapper {
    margin-top: 20rpx;
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