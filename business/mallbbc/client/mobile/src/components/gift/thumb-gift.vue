<!-- 鹅毛情列表卡片组件
-->
<template name="goodsItemH">
        <view class="gift_item_con flex_column_start_start" @click.stop="goGiftDetail(gift_info)">
            <view class="gift_item_con_top flex_row_between_center">
                <view class="time">{{gift_info.createTime}}</view>
                <view class="state" :style="{color:giftEnum[tabCurrent][giftStatusMap.UNPAY].textColor}" v-if="tabCurrent==0 && gift_info.featherOrderInfoVO.orderState==giftStatusMap.UNPAY">{{giftEnum[tabCurrent][giftStatusMap.UNPAY].text}}</view>
                <view class="state" :style="{color:giftEnum[tabCurrent][gift_info.status].textColor}" v-if="tabCurrent==0 && gift_info.featherOrderInfoVO.orderState!=giftStatusMap.UNPAY">{{giftEnum[tabCurrent][gift_info.status].text}}</view>
                <view class="state" :style="{color:giftEnum[tabCurrent][gift_info.status][gift_info.used].textColor}" v-if="tabCurrent==1">{{giftEnum[tabCurrent][gift_info.status][gift_info.used].text}}</view>
            </view>
            <template v-for="(item,index) in gift_info.orderProducts">
                <!-- 一期不显示赠品和附件，只显示主商品 -->
                <view class="gift_item_con_center flex_row_center_start" :key="index" :class="{free:item.productType==2,attachment:item.productType==1}">
                    <view class="goods_image">
                        <imgThumb :imgSrc="item.mainImage" />
                    </view>
                    <view class="right_desc">
                        <text class="goods_name">{{item.skuName}}</text>  
                        <text class="spec_info" v-if="item.specValues">{{item.specValues}}</text>
                    </view>
                    <view class="product_num flex_row_end_center">*{{item.productNum}}</view>
                </view>
            </template>
            <view class="gift_item_con_bottom">
                <!-- 我送出的 待支付 -->
                <btnGroup
                    v-if="tabCurrent==0 && gift_info.featherOrderInfoVO.orderState==giftStatusMap.UNPAY"
                    :btnTypes="giftEnum[tabCurrent][giftStatusMap.UNPAY].btnConfig"
                    :info="gift_info"
                    @cancelResult="cancelResult"
                    @giftCanceled="giftCanceled"
                />
                <!-- 我收到的 除了待支付 -->
                <btnGroup
                    v-if="tabCurrent==0 && gift_info.featherOrderInfoVO.orderState!=giftStatusMap.UNPAY"
                    :btnTypes="giftEnum[tabCurrent][gift_info.status].btnConfig"
                    :info="gift_info"
                />
                <!-- 我收到的 -->
                <btnGroup
                    v-if="tabCurrent==1"
                    :btnTypes="giftEnum[tabCurrent][gift_info.status][gift_info.used].btnConfig"
                    :info="gift_info"
                />
            </view>
        </view>
</template>

<script>
import imgThumb from "@/components/goods/thumb/imgThumb.vue";
import btnGroup from "@/components/button/btnGroup.vue";
import { giftEnum, giftStatusMap } from '@/views/gift/common/lib/enum.js';
export default {
    name: "thumb-gift",
    data() {
        return {
            giftEnum:giftEnum,
            giftStatusMap:giftStatusMap
        }
    },
    components: {
        imgThumb,
        btnGroup
    },
    props: {
        // 订单item
        gift_info: {
            type: Object,
            value: {}
        },
        tabCurrent:{
            type: [Number,String],
            default:0
        }
    },
    methods: {
        // 进礼物详情
        goGiftDetail(item){
            this.$Router.push({path:'/gift/detail',query:{featherId:item.featherId}})
        },
        // 取消支付
        cancelResult(data){
            this.$emit('cancelResult',data)
        },
        // 礼物已取消
        giftCanceled(){
            this.$emit('giftCanceled')
        }
        
       
    }
}
</script>

<style lang='scss' scoped>
.gift_item_con{
    padding: 28rpx 32rpx 40rpx;
    margin-top: 20rpx;
    border-radius: 20rpx;
    background: #fff;
    &_top{
        width: 100%;
        margin-bottom: 22rpx;
        line-height: 40rpx;
        font-size: 28rpx;
        .time{
            color: #999999;
        }
        .state{
            color: #666666;
        }
    }
    &_center{
        width: 100%;
        padding: 0 0rpx 0rpx 12rpx;
        &.free,&.attachment{
            position: relative;
            margin-top: 22rpx;
            padding: 22rpx;
            border-radius: 16rpx;
            border: 2rpx dashed #ff8366;
            .goods_image{
                width: 148rpx;
                height: 148rpx;
            }
            .goods_name{
                font-size: 26rpx;
                font-weight: 400;
            }
            .product_num{
                font-size: 26rpx;
                height: 32rpx;
                line-height: 32rpx;
            }
            .spec_info{
                font-size: 22rpx;
            }
        }
        &.attachment::before,&.free::before{
            display: block;
            content:'';
            width: 68rpx;
            height: 68rpx;
            position: absolute;
            left: 0;
            top: -1px;
            z-index: 1;
        }
        &.attachment::before{
            background: url('@/static/shared/gift/icon_emq_fujian.png') center no-repeat;
            background-size: 68rpx 68rpx;
        }
        &.free::before{
            background: url('@/static/shared/gift/icon_emq_zengpin.png') center no-repeat;
            background-size: 68rpx 68rpx;
        }
        .right_desc{
            flex: 1;
            padding-left: 24rpx;
        }
        .product_num{
            width: 74rpx;
            height: 38rpx;
            line-height: 38rpx;
            font-size: 32rpx;
            color: #222222;
        }
        .goods_image{
            width: 164rpx;
            height: 164rpx;
            border-radius: 16rpx;
            overflow: hidden;
        }
        .goods_name {
            color: #222222;
            font-size: 28rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
            line-height: 128%;
            font-weight: bold;
        }

        .spec_info {
            color: #999999;
            font-size: 26rpx;
            line-height: 138%;
            margin-top: 36rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
        }
    }
    &_bottom{
        width: 100%;
        margin-top: 28rpx;
        ::v-deep.btn-refund,::v-deep .btn-cancel,::v-deep .btn-detail,::v-deep .btn-fillAddress, ::v-deep .btn-weixin{
            color: #f30300;
            background:#fff;
        }
    }
}
</style>
