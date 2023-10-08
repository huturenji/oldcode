<!-- 我的优惠券列表 消费券item
-->
<template name="goodsItemH">
    <view class="my_coupon_pre">
        <view class="coupon_pre_top">
            <view class="coupon_pre_left" :class="{grey:couponItem.useState != 1}" @click="goConsumptionDetail(couponItem)">
                <view class="coupon_pre_price num-font" v-if="couponItem.couponType != 2">
                    <text class="unit num-font" :style="{fontSize:fitfontSize['small'][couponItem.publishValue.toString().length]}">¥ </text>
                    <text class="price_int num-font" :style="{fontSize:fitfontSize['big'][couponItem.publishValue.toString().length]}">{{couponItem.publishValue}}</text>
                </view>
                <view class="coupon_pre_price" v-if="couponItem.couponType == 2">
                    <text class="price_int">{{couponItem.publishValue/10}}</text>
                    <text class="price_decimal">折</text>
                </view>
                <view v-if="couponItem.couponContent" class="coupon_pre_active" :style="{fontSize:fitfontSize['active'][couponItem.couponContent.length]}">
                    {{couponItem.couponContent}}</view>
            </view>
            <view class="coupon_pre_cen" :class="{grey:couponItem.useState != '1'}" @click="goConsumptionDetail(couponItem)">
                <view class="coupon_pre_title" :class="{greyName:couponItem.useState != '1',zhekouName:couponItem.couponType == 2,normalName:couponItem.couponType == 1}">{{couponItem.couponName}}</view>
                <view class="maxDeductionValue flex_row_center_center" :class="{greyDesc:couponItem.useState != '1'}" v-if="couponItem.couponType == 2 && couponItem.discountLimitAmount">最多优惠<text class="num-font">{{couponItem.discountLimitAmount}}</text>元</view>
                <view class="coupon_pre_time lineH16" v-if="couponItem.effectiveStart.indexOf(':')==-1">{{couponItem.effectiveStart}}~{{couponItem.effectiveEnd}}</view>
                <view class="coupon_pre_time lineH12" v-else>
                    <view>{{couponItem.effectiveStart}}~</view>
                    <view>{{couponItem.effectiveEnd}}</view>
                </view>
            </view>
            <!-- 优惠券中间分割线 -->
            <view class="kacao kacao1" v-if="couponItem.useState == '1'"></view>
            <view class="kacao kacao3" v-else></view>
            <view class="coupon_pre_right">
                <view v-if="couponItem.useState == '1'" class="coupon_right haveNotUse">
                    <view>已领取</view>
                    <view @click="goGoodsList(couponItem)">去使用</view>
                </view>
                <view v-else-if="couponItem.useState == '2'" class="coupon_right haveUse"><view></view></view>
                <view v-else-if="couponItem.useState == '3'" class="coupon_right haveExpired"><view></view></view>
                <view v-else class="coupon_right invalid"><view></view></view>
            </view>
        </view>
        <view class="coupon_type fontScaleIgnore" :class="{grey_type:couponItem.useState != 1}">消费券</view>
    </view>
</template>
<script module="filters" lang="wxs" src="@/utils/filter.wxs"></script>
<script>
import uniPopup from '@/common/components/uni-popup/uni-popup.vue'
export default {
    name: "coupon-item",
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            fitfontSize:{
                'active':{19:'22rpx',20:'22rpx',21:'20rpx',22:'20rpx'},
                'big':{1:'56rpx',2:'56rpx',3:'56rpx',4:'56rpx',5:'52rpx',6:'48rpx',7:'40rpx',8:'36rpx',9:'32rpx',10:'28rpx',11:'24rpx'},
                'small':{1:'28rpx',2:'28rpx',3:'28rpx',4:'28rpx',5:'24rpx',6:'24rpx',7:'24rpx',8:'24rpx',9:'24rpx',10:'24rpx',11:'24rpx'}
            }
        }
    },
    components: {
        uniPopup
    },
    props: {
        couponItem: {
            type: Object,
            value: {}
        }
        
    },
    methods: {
        goConsumptionDetail(item) {
            this.$Router.push({
                path: '/views/coupon/consumptionDetail',
                query: {
                    couponMemberId:item.couponMemberId,
                    useState:item.useState
                }
            })
        },
        //规则展开
        descriptionOpen(couponItem) {
            couponItem.isOpen = !couponItem.isOpen
        },
        //去优惠券对应的商品列表
        goGoodsList(item) {    
            this.$emit('openQrCode',item)

        }
    }
}
</script>

<style lang='scss'>
.my_coupon_pre {
    width: 100%;
    margin-top: 30rpx;
    position: relative;

    .coupon_pre_top {
        position: relative;
        height: 100%;
        background-size: 100% 100%;
        display: flex;
        align-items: stretch;
        border-radius: 16rpx;
        overflow: hidden;

        .coupon_pre_left {
            display: flex;
            flex-direction: column;
            width: 192rpx;
            align-items: center;
            justify-content: center;
            padding: 0 8rpx;
            color: #FF711E;
            background: #fff;
            &.grey{
                color: #a7a7a7;
            }

            .coupon_pre_price {
                margin-top: 19rpx;
                font-size: 28rpx;
                font-family: Source Han Sans CN;
                line-height: 34rpx;

                .price_int {
                    font-size: 56rpx;
                    font-family: Source Han Sans CN;
                }
                .price_decimal {
                    font-size: 28rpx;
                }
            }

            .coupon_pre_active {
                font-size: 24rpx;
                font-family: Source Han Sans CN;
                font-weight: 500;
                line-height: 100%;
                margin-top: 18rpx;
                text-align: center;
            }

        }

        .coupon_pre_cen {
            display: flex;
            flex-direction: column;
            flex: 1;
            padding: 22rpx 0rpx 22rpx 10rpx;
            color: #222222;
            background: #fff;
            &.grey{
                color: rgba(34,34,34,0.4);
            }
            .maxDeductionValue {
                width: fit-content;
                height: 32rpx;
                margin-top: 8rpx;
                padding: 0 10rpx;
                font-size: 20rpx;
                color: #ff711e;
                border: 1px solid #ff711e;
                border-radius: 6rpx;
                &.greyDesc {
                    color: rgba(34,34,34,0.4);
                    border-color: rgba(34,34,34,0.4);
                }
            }

            .coupon_pre_title {
                width: 100%;
                font-size: 28rpx;
                font-family: PingFang SC;
                font-weight: bold;
                color: #222222;
                &.greyName {
                    color: rgba(34,34,34,0.4);
                }
                &.zhekouName {
                    max-width: 300rpx;
                    max-height: 36rpx;
                    line-height: 36rpx;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                &.normalName {
                    min-height: 72rpx;
                    line-height: 36rpx;
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    word-break: break-all;
                    -webkit-box-orient: vertical;
                }
            }

            .coupon_pre_time {
                font-size: 22rpx;
                font-family: PingFang SC;
                line-height: 32rpx;
                margin: 18rpx 0 2rpx;
                word-break: break-all;
                &.lineH16{
                    height: 32rpx;
                    line-height: 32rpx;
                }
                &.lineH12{
                    height: 52rpx;
                    line-height: 24rpx;
                }
            }
        }

        .coupon_pre_right {
            width: 176rpx;
            .coupon_right{
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
                &.haveUse,&.haveExpired,&.invalid {
                    background: #E8E8E8;
                    view {
                        width: 160rpx;
                        height: 160rpx;
                    }
                }
            }
            .haveNotUse{
                padding: 24rpx 0 32rpx 0;
                flex-direction: column;
                justify-content: space-between;
                background: radial-gradient(circle at 0% 0%,#ff985b, #fc6106);
                &>view:first-child{
                    font-size: 26rpx;
                }
                &>view:nth-child(2){
                    padding: 4rpx 22rpx;
                    line-height: 20px;
                    background: #fff;
                    color: #EB5700;
                    border-radius: 24rpx;
                    font-weight: bold;
                }
            }
            .haveUse{
                view{
                    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/icon_yhq_yishiyong_gray.svg') center/100% 100% no-repeat;
                }
            }
            .haveExpired{
                view{
                    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/icon_yhq_yiguoqi.svg') center/100% 100% no-repeat;
                }
            }
            .invalid{
                view{
                    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/icon_common_yishixiao.svg') center/100% 100% no-repeat;
                }
            }
        }
        .kacao{
            width: 24rpx;
            background-size: 24rpx 100%;
            &.kacao1{
                background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/bg_yhq_xiaofeiquan.png');
            }
            &.kacao3{
                background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/bg_yhq_xuxian2.2.png');
            }
        }
    }

    .coupon_type.fontScaleIgnore {
        width: 124rpx;
        height: 36rpx;
        line-height: 36rpx;
        position: absolute;
        top: 0;
        left: 0;
        background: #FFE3D4;
        font-size: 20rpx;
        font-weight: 500;
        color: #EB5700;
        text-align: center;
        border-radius: 16rpx 0px 20rpx 0px;
        &.grey_type {
            background: #e8e8e8;
            color: #a7a7a7;
        }
    }
}
</style>
