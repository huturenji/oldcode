<!-- 我的优惠券列表 优惠券item
-->
<template name="goodsItemH">
    <view class="my_coupon_pre">
        <view class="coupon_pre_top">
            <view class="coupon_pre_left" :class="{grey:couponItem.useState != 1}">
                <view class="coupon_pre_price num-font"
                    v-if="couponItem.couponType != 2">
                    <text class="unit num-font" :style="{fontSize:fitfontSize['small'][couponItem.publishValue.toString().length]}">¥ </text>
                    <text class="price_int num-font" :style="{fontSize:fitfontSize['big'][couponItem.publishValue.toString().length]}">{{couponItem.publishValue}}</text>
                </view>
                <view class="coupon_pre_price"
                    v-if="couponItem.couponType == 2">
                    <view class=""></view>
                    <text
                        class="price_int">{{filters.toSplit(filters.toFixNum(couponItem.publishValue,1))[0]}}</text>.
                    <text
                        class="price_decimal">{{filters.toSplit(filters.toFixNum(couponItem.publishValue,1))[1]}}</text>
                    <text class="price_decimal">折</text>
                </view>
                <view v-if="couponItem.couponContent" class="coupon_pre_active" :style="{fontSize:fitfontSize['active'][couponItem.couponContent.length]}">
                    {{couponItem.couponContent}}</view>
            </view>
            <view class="coupon_pre_cen" :class="{grey:couponItem.useState != '1'}">
                <view class="coupon_pre_title" :class="{greyName:couponItem.useState != '1'}">{{couponItem.couponName}}</view>
                <view class="coupon_pre_time lineH16" v-if="couponItem.effectiveStart.indexOf(':')==-1">{{couponItem.effectiveStart}}~{{couponItem.effectiveEnd}}</view>
                <view class="coupon_pre_time lineH12" v-else>
                    <view>{{couponItem.effectiveStart}}~</view>
                    <view>{{couponItem.effectiveEnd}}</view>
                </view>
                <view class="coupon_pre_rules" @click="descriptionOpen()">
                    <text>使用规则</text>
                    <image
                        :src="couponItem.isOpen ? upTriangleImage : downTriangleImage"
                        :style="{ opacity: couponItem.useState != '1' ? '0.4' : '1' }" mode=""
                        draggable="false"></image>
                </view>
            </view>
            <!-- 优惠券中间分割线 -->
            <view class="kacao kacao1" v-if="couponItem.useState == '1'" :class="{kacao1_notUse:couponItem.effectiveStart.indexOf(':')==-1}"></view>
            <view class="kacao kacao3" v-else :class="{kacao3_haveExpired:couponItem.effectiveStart.indexOf(':')==-1}"></view>
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
        <view class="coupon_rules" v-if="couponItem.isOpen" :class="{grey:couponItem.useState != '1'}">
            <view>优惠券类型：<text class="coupon_type_text">【{{couponItem.storeId==0?'平台优惠券':'店铺优惠券'}}】</text></view>
            <view class="coupon_rules_title"><text>{{couponItem.description}}</text></view>
        </view>
        <view class="coupon_type fontScaleIgnore" :class="{grey_type:couponItem.useState != 1,suiji:couponItem.useState != 3 && couponItem.couponType==3,zhekou:couponItem.useState != 3 && couponItem.couponType==2}">{{couponItem.couponTypeValue}}</view>
    </view>
</template>

<script module="filters" lang="wxs" src="@/utils/filter.wxs"></script>
<script>
import {skipTo} from '@/utils/common.js'
export default {
    name: "coupon-item",
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            upTriangleImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/uptriangle2%402x.png',
            downTriangleImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_downtriangle2%402x.png',
            fitfontSize:{
                'active':{19:'22rpx',20:'22rpx',21:'20rpx',22:'20rpx'},
                'big':{1:'56rpx',2:'56rpx',3:'56rpx',4:'56rpx',5:'52rpx',6:'48rpx',7:'40rpx',8:'36rpx',9:'32rpx',10:'28rpx',11:'24rpx'},
                'small':{1:'28rpx',2:'28rpx',3:'28rpx',4:'28rpx',5:'24rpx',6:'24rpx',7:'24rpx',8:'24rpx',9:'24rpx',10:'24rpx',11:'24rpx'}
            }
        }
    },
    components: {
        
    },
    props: {
        couponItem: {
            type: Object,
            value: {}
        }
        
    },
    methods: {
        //规则展开
        descriptionOpen() {
            this.$emit('changeRulesState',!this.couponItem.isOpen)
        },
        //去优惠券对应的商品列表
        goGoodsList(item) {
            if(item.linkInfo!=null){
                let tempLinkInfo = item.linkInfo.replace(/wx_url/g,"url");
                let skipUrl={};
                try{
                    skipUrl=JSON.parse(tempLinkInfo);
                    skipTo(skipUrl,this);
                }catch(error){
                    this.goDefaultGoodsList(item);
                }
            }else{
                this.goDefaultGoodsList(item);
            }

        },
        goDefaultGoodsList(item){
            if (item.useState == 1) {
                let params = {}
                if (item.storeId > 0) {
                    params.storeId=item.storeId
                }
                if (item.useType == 2 && item.skus) { ////指定商品 跳转到活动商品列表页面
                    params.skus = item.skus;
                    this.$Router.push({
                        path: '/views/coupon/list/index',
                        query: {
                            source: 'coupon',
                            ...params
                        }
                    })
                    return 
                } else if (item.useType == 3 && item.couponCategoryVO) { //指定分类 跳转到商品列表页面
                    params.categoryIds = item.couponCategoryVO.categoryId
                }
                this.$Router.push({
                    path: '/views/goods/list/index',
                    query: {
                        source: 'coupon',
                        ...params
                    }
                })
            }
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
            color: #f30300;
            background: #fff;
            &.grey{
                color: #a7a7a7;
            }

            .coupon_pre_price {
                margin-top: 19rpx;
                font-size: 28rpx;
                font-family: Source Han Sans CN;
                line-height: 34rpx;

                text:nth-child(2) {
                    font-size: 56rpx;
                    font-family: Source Han Sans CN;
                    font-weight: bold;
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
            display: felx;
            flex-direction: column;
            flex: 1;
            padding: 22rpx 0rpx 22rpx 10rpx;
            color: #222222;
            background: #fff;
            &.grey{
                color: rgba(34,34,34,0.4);
            }

            .coupon_pre_title {
                min-height: 72rpx;
                line-height: 36rpx;
                font-size: 28rpx;
                font-family: PingFang SC;
                font-weight: bold;
                color: #222222;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                word-break: break-all;
                -webkit-box-orient: vertical;
                &.greyName {
                    color: rgba(34,34,34,0.4);
                }
            }

            .coupon_pre_time {
                font-size: 22rpx;
                font-family: PingFang SC;
                line-height: 32rpx;
                margin: 10rpx 0 2rpx;
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

            .coupon_pre_rules {
                display: flex;
                align-items: center;
                line-height: 32rpx;
                font-size: 22rpx;

                text {
                    line-height: 31rpx;
                    font-size: 24rpx;
                    font-family: PingFang SC;
                    font-weight: 500;
                }

                image {
                    width: 24rpx;
                    height: 24rpx;
                    margin-left: 8rpx;
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
                padding: 28rpx 0 24rpx 0;
                flex-direction: column;
                justify-content: space-between;
                background: linear-gradient(152deg,#FF2929 4%, #FC1C1C 100%);
                &>view:first-child{
                    font-size: 26rpx;
                }
                &>view:nth-child(2){
                    padding: 4rpx 22rpx;
                    line-height: 20px;
                    background: #fff;
                    color: #f30300;
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
                background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/bg_yhq_xuxian1.1.png');
            }
            &.kacao1_notUse{
                background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/bg_yhq_xuxian1.png');
            }
            &.kacao3{
                background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/bg_yhq_xuxian2.2.png');
            }
            &.kacao3_haveExpired{
                background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/bg_yhq_xuxian2.png');
            }
        }
    }

    .coupon_rules {
        width: 100%;
        padding: 36rpx 24rpx 20rpx;
        text-align: justify;
        box-sizing: border-box;
        font-size: 22rpx;
        font-family: PingFang SC;
        font-weight: 500;
        word-break: break-all;
        color: #666666;
        line-height: 30rpx;
        background: linear-gradient(180deg,#f7f7f7, #ffffff);
        margin-top: -16rpx;
        border-radius: 0 0 16rpx 16rpx;

        .coupon_rules_title {
            margin: 16rpx 0 0rpx;
        }
        .coupon_type_text{
            color: #222222;
        }
        &.grey {
            color: rgba(34,34,34,0.4);
            .coupon_type_text {
                color: rgba(34,34,34,0.4);
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
        background: #FFE8E8;
        font-size: 20rpx;
        font-weight: 500;
        color: #f30300;
        text-align: center;
        border-radius: 16rpx 0px 20rpx 0px;
        &.grey_type {
            background: #e8e8e8;
            color: #a7a7a7;
        }
        &.suiji{
            background: #ffefe2;
            color: #fe8224;
        }
        &.zhekou{
            background: #e8edff;
            color: #2455fe;
        }
    }
}
</style>
