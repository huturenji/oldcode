<!-- 领取指定优惠券 -->
<template>
    <view class="container">
        <img class="page-bg" :src="imgUrl + 'coupon/img_youhuiquan_beijing.png'"/>
        <view class="top-bg"></view>
        <view class="my_coupon_pre">
            <view class='scroll-container'>
                <view v-for='coupon in couponList' :key='coupon.couponId' class='coupon-item' :class='{expired: useState(coupon) == 3}'>
                    <view class='coupon-content'>
                        <view class="coupon_pre_left">
                            <!-- 固定券 start -->
                            <view class="coupon_pre_price" :class='{hide: !showPrice}' ref='fitFont'
                                v-if="coupon.couponType == 1 && coupon.publishValue">
                                <text class="unit">¥ </text>
                                <text class="price_int num-font" :class='{hide: !showPrice}'>{{coupon.publishValue}}</text>
                            </view>
                            <!-- 固定券 end -->
                            <!-- 折扣券 start -->
                            <view class="coupon_pre_price" :class='{hide: !showPrice}' ref='fitFont'
                                v-if="coupon.couponType == 2 && coupon.publishValue">
                                <text
                                    class="price_int num-font">
                                    {{filters.toSplit(filters.toFixNum(coupon.publishValue/10,1))[0]}}
                                    </text>.
                                <text
                                    class="price_decimal">{{filters.toSplit(filters.toFixNum(coupon.publishValue/10,1))[1]}}</text>
                                <text class="price_decimal">{{$L('折')}}</text>
                            </view>
                            <!-- 折扣券 end -->
                            <!-- 随机券 start  $getPartNumber(item.randomMax,'int')-->
                            <view class="coupon_pre_price" :class='{hide: !showPrice}' ref='fitFont'
                                v-if="coupon.couponType == 3 && coupon.randomMax">
                                <text class="unit">¥ </text>
                                <text class="price_int num-font" :class='{hide: !showPrice}'>
                                    {{coupon.randomMax}}
                                </text>
                            </view>
                            <!-- 随机券 end -->
                            <view class="coupon_pre_active">
                                {{coupon.couponContent}}
                            </view>
                        </view>
                        <view class="coupon_pre_cen">
                            <view class="coupon_pre_title">{{coupon.couponName}}</view>
                            <view class="coupon_pre_time" v-if="coupon.effectiveStart && coupon.effectiveEnd">
                                <view>{{formateDate(coupon.effectiveStart)}}</view>
                                <view>~</view>
                                <view>{{formateDate(coupon.effectiveEnd)}}</view>
                            </view>
                            <view class="coupon_pre_time" v-else-if="coupon.cycle">
                                领取后{{coupon.cycle}}天内可用
                            </view>
                        </view>
                        <view class="coupon_pre_right">
                            <view v-if="useState(coupon) == '-1'">
                                <view>{{$L('未开始')}}</view>
                            </view>
                            <view v-if="useState(coupon) == '1'">
                                <view>{{$L('领取中')}}</view>
                            </view>
                            <view v-if="useState(coupon) == '4'">
                                <view>{{$L('已领取')}}</view>
                            </view>
                            <view v-if="useState(coupon) == '2'" class="haveNotUse">
                                <view>{{$L('已领取')}}</view>
                                <view @click="goGoodsList(coupon)">{{$L('去使用')}}</view>
                            </view>
                            <img v-if="useState(coupon) == 3" class='expired' :src="imgUrl + 'coupon/icon_common_yishixiao.svg'"/>
                        </view>
                    </view>
                </view>
            </view>
        </view>

    </view>
</template>

<script module="filters" lang="wxs" src="../../utils/filter.wxs"></script>
<script>
import goodsHandler from '@/components/goods/handler';
import {skipTo, isEmpty, isNotEmpty, fitFontSize} from '@/utils/common.js'
export default {
    data() {
        return {
            showPrice: false,//自适应字体大小前先不展示金额
            receiveState: false,
            couponList: [],
            imgUrl: getApp().globalData.imgUrl,
            goReceiveBg: getApp().globalData.imgUrl + 'coupon/coupon_pre_bg.png', //未使用
            finishReceiveBg: getApp().globalData.imgUrl + 'coupon/finishReceiveBg.png' //已使用，已过期,
        };
    },
    created(){
        this.getCouponByPwd();
    },
    watch: {
        couponList(_new){
            if(isNotEmpty(_new) && isNotEmpty(this.$refs.fitFont)){
                fitFontSize(this.$refs.fitFont.map(dom => dom.$el))
                this.showPrice = true;
            }
        }
    },
    methods:{
        formateDate(dateStr){
            if(!dateStr){
                return ''
            }
            let date = new Date(dateStr.replace(/-/g, '/'));
            let month = date.getMonth()+1;
            month = month < 10 ? '0'+month : month;
            let day = date.getDate()
            day = day < 10 ? '0' + day : day;
            return date.getFullYear() + '.'+ month + '.' + day
        },
        async getCouponByPwd(){
            let password = SnUtils.getUserPara('password');
            if(isEmpty(password)){
                return
            }
            let userInfo = getApp().globalData.userParams
            let passwordList = password.split('|')
            passwordList = Array.from(new Set(passwordList))
            //1.查询优惠券列表
            uni.showLoading()
            this.couponList = await this.getCouponList(passwordList)
            //2.获取当前用户未领取的优惠券 pwdCouponState：1未领取 2已领取
            const unreceivedCouponList = this.couponList
            .filter(coupon => coupon.pwdCouponState == 1 && coupon.state == 4)
            .map(coupon => coupon.password);
            //3.领取
            uni.showLoading({title: '领取中'})
            await this.receive(unreceivedCouponList);
            //4.更新优惠券列表
            this.couponList = (await this.getCouponList(passwordList)).map(coupon => {
                //已被其他人领取的，标记失败
                if(coupon.pwdCouponState == 2 && 
                !(coupon.userId == userInfo.userId
                && coupon.channelId == userInfo.channelId 
                && coupon.companyId == userInfo.companyId)){
                    coupon.pwdCouponState = -1; 
                }
                return coupon
            });
            this.receiveState = true;
            uni.hideLoading();
            //5.缓存领取状态 要么都成功
            this.cacheReceivedPwd(this.couponList.map(coupon => ({[coupon.password]: this.useState(coupon) == 2})));//存缓存
        },
        //获取优惠券详情
        async getCouponList(passwordList) {
            let param = {
                couponList: passwordList.map(password => ({password}))
            };
            try{
                const res = await goodsHandler.batchGetCouponDetail(param)
                if (res.state == 200) {
                    return res.data.couponList || [];
                } else {
                    this.$api.msg(res.msg);
                }
            }catch(e){
                this.$api.msg('获取优惠券信息失败');
                console.error('获取优惠券详情失败：', e)
            }
            return [];
        },
        /**
         * 领取优惠券
         */
        async receive(unreceivedCouponList){
            if(isEmpty(unreceivedCouponList)){
                return;
            }
            let param = {
                couponList: unreceivedCouponList.map(password => ({password}))
            };
            try{
                const res = await goodsHandler.batchReceiveCoupon(param)
                if (res.state == 200 || res.state == 89123101) {//89123101表示已被领取
                    return;
                } else {
                    this.$api.msg(res.msg);
                }
            }catch(e){
                this.$api.msg('优惠券领取失败');
                console.error('领取优惠券失败：', e)
            }
            return;
        },
        /**
         * 将已领取的券存储到app缓存中
         */
        cacheReceivedPwd(passwordList){
            sinosdk.sino.putNativeCache({
                type: 'string',
                key: 'bplusReceivedPwd',
                value: JSON.stringify(passwordList)
            });
        },
        /**
         * @returns {-1: 未开始；1：领取中；2：已领取去使用；3：已失效；4：仅显示已领取}
         */
        useState(coupon){
            //领取流程未执行完时，统一显示“领取中”
            if(!this.receiveState){
                return 1;
            }
            //优惠券状态state: 1-未开始；2-已失效；3-已删除； 4-进行中；5-已结束
            //pwdCouponState：1-未领取；2-已领取
            //useState: 1-未使用；2-已使用
            //已过期
            if (coupon.state == 2){
                return 3
            }else if(coupon.state == 3 || coupon.state == 5){
                //如果已领取，则可使用；否则显示已失效
                if(coupon.pwdCouponState == 2){
                    if(coupon.useState == 2){
                        return 4;
                    }
                    return 2
                }else{
                    return 3;
                }
            }else if(coupon.state == 1){
                return -1
            }else{
                //未领取
                if (coupon.pwdCouponState == 1){
                    return 1
                }
                //已领取
                else if (coupon.pwdCouponState == 2){
                    if(coupon.useState == 2){//已使用
                        return 4//仅显示已领取
                    }
                    return 2//已领取，去使用
                }
                //失败（前端自定义状态）
                else{
                    return 3
                }
            }
        },
        //去优惠券对应的商品列表
        goGoodsList(coupon) {
            let item = coupon;
            if (item.linkInfo!=null){
                let skipUrl={};
                try {
                    skipUrl=JSON.parse(item.linkInfo);
                    skipTo(skipUrl,this);
                } catch (error){
                    this.goDefaultGoodsList(item);
                }
            } else {
                this.goDefaultGoodsList(item);
            }

        },
        goDefaultGoodsList(item){
            let params = {}
            if (item.storeId > 0) {
                params.storeId=item.storeId
            }
            if (item.useType == 2 && item.skus) { ////指定商品 跳转到活动商品列表页面
                params.skus = item.skus;
                this.$Router.push({
                    path: '/pages/activity/activity',
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
                path: '/standard/product/list',
                query: {
                    source: 'coupon',
                    ...params
                }
            })
        }
    }
}
</script>

<style lang='scss'>
$couponWidth: 632rpx;
//覆盖wrapper背景色
page{
    position: relative;
    height: 100%;
    background-color: #fff;
    z-index: 0;
}
.container{
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;

    .page-bg{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        font-size: 0;
        z-index: -1;
    }
}

.top-bg{
    flex: none;
    width: 100%;
    height: 440rpx;
    background-clip: padding-box;
    background: url('@/static/shared/coupon/img_youhuiquan_up.png') left top / 100% 100% no-repeat;
}

.my_coupon_pre {
    position: relative;
    top: -10rpx;
    flex: auto;
    padding: 40rpx 20rpx 10rpx;
    background: url('@/static/shared/coupon/img_youhuiquan_down.png') left top / 100% 100% no-repeat;
    background-size: 100% 100%;
    overflow: hidden;

    .scroll-container{
        width: 100%;
        height: calc(100% - 50rpx);
        overflow-y: auto;
    }

    .coupon-item{
        flex: none;
        height: 190rpx;
        position: relative;
        margin: auto;
        width: $couponWidth;
        border-radius: 20rpx;
        background: #fff;
        overflow: hidden;
        &:not(:first-of-type){
            margin-top: 20rpx;
        }

        &:before {
            content: '';
            width: 20rpx;
            height: 20rpx;
            position: absolute;
            left: calc(100% - 170rpx);
            top: -10rpx;
            border-radius: 20rpx;
            background: #FFE4C9;
            z-index: 10;
        }

        &:after {
            content: '';
            width: 20rpx;
            height: 20rpx;
            position: absolute;
            left: calc(100% - 170rpx);
            bottom: -10rpx;
            border-radius: 20rpx;
            background: #FFE4C9;
            z-index: 10;
        }

        &.expired{
            .coupon-content{
                .coupon_pre_left, .coupon_pre_cen{
                    color: rgba(34, 34, 34, .4);
                }
                .coupon_pre_right{
                    position: relative;
                    background: #E8E8E8;
                    &:before{
                        content: '';
                        position: absolute;
                        left: -1px;
                        top: 10rpx;
                        bottom: 10rpx;
                        height: calc(100% - 20rpx);
                        width: 0;
                        border-left: 2px dotted #E8E8E8;
                    }
                }
            }
        }

        .coupon-content{
            position: relative;
            display: flex;
            align-items: stretch;
            height: 100%;
            z-index: 9;


            .coupon_pre_left {
                position: relative;
                flex: none;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                width: 180rpx;
                padding: 40rpx 0;
                color: #FC1C1C;
    
                .hide{
                    visibility: hidden;
                }

                .coupon_pre_price {
                    text-align: center;
                    line-height: 32rpx;
                    padding: 0 20rpx;

                    .unit{
                        font-size: 32rpx;
                    }

                    .price_int{
                        font-size: 63rpx;
                        font-weight: normal;
                    }
                }
    
                .coupon_pre_active {
                    font-size: 24rpx;
                    line-height: 31rpx;
                    padding: 0 15rpx;
                    text-align: center;
                }
            }
    
            .coupon_pre_cen {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex: auto;
                padding: 40rpx 10rpx;
                max-width: calc(100% - 180rpx - 160rpx);
                color: #222;
                overflow: hidden;
    
                .coupon_pre_title {
                    flex: none;
                    font-size: 34rpx;
                    font-weight: bold;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    word-break: break-all;
                }
    
                .coupon_pre_time {
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: 20rpx;
                    font-size: 24rpx;
                }
            }
    
            .coupon_pre_right {
                flex: none;
                width: 160rpx;
                display: flex;
                align-items: center;
                justify-content: center;
    
                img.expired{
                    width: 100%;
                }

                .haveNotUse{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    padding: 40rpx 0;
                    height: 100%;
                    &>view:first-child{
                        font-size: 26rpx;
                        text-align: center;
                    }
                    &>view:nth-child(2){
                        font-size: 28rpx;
                        padding: 4rpx 22rpx;
                        line-height: 20px;
                        background: #f30300;
                        color: #fff;
                        border-radius: 24rpx;
                        font-weight: bold;
                    }
                }
            }
        }

    }
}
.btn-group{
    width: $couponWidth;
    height: 88rpx;
    margin-top: 62rpx;
    border-radius: 88rpx;
    background-color: #F30300;
    font-size: 30rpx;
    color: #fff;

    view{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }
}
</style>
