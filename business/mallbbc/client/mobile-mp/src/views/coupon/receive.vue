<!-- 领取指定优惠券 -->
<template>
    <view class="container">
        <w-loading ref="loading"></w-loading>
        <view class="page-bg">
            <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/img_youhuiquan_beijing.png" mode="widthfix" />
        </view>
        <view class="top-bg"></view>
        <view class="my_coupon_pre" v-if="coupon.state">
            <view class="coupon_pre_top">
                <view class="coupon_pre_left">
                    <view>
                        <!-- 固定券 start -->
                        <view class="coupon_pre_price"
                            v-if="coupon.couponType == 1 && coupon.publishValue">
                            <text class="unit">¥ </text>
                            <text class="price_int">{{coupon.publishValue}}</text>
                        </view>
                        <!-- 固定券 end -->
                        <!-- 折扣券 start -->
                        <view class="coupon_pre_price"
                            v-if="coupon.couponType == 2 && coupon.publishValue">
                            <view class=""></view>
                            <text
                                class="price_int">{{filters.toSplit(filters.toFixNum(coupon.publishValue/10,1))[0]}}</text>.
                            <text
                                class="price_decimal">{{filters.toSplit(filters.toFixNum(coupon.publishValue/10,1))[1]}}</text>
                            <text class="price_decimal">折</text>
                        </view>
                        <!-- 折扣券 end -->
                        <!-- 随机券 start -->
                            <view class="coupon_pre_price" v-if="coupon.couponType == 3 && coupon.randomMax">
                            <text class="unit">¥ </text>
                            <text class="price_int">{{coupon.randomMax}}</text>
                        </view>
                        <!-- 随机券 end -->
                        <view class="coupon_pre_active">
                            {{coupon.couponContent}}
                        </view>
                    </view>
                </view>
                <view class="coupon_pre_cen">
                    <view class="coupon_pre_title">{{coupon.couponName}}</view>
                    <view class="coupon_pre_time" v-if="coupon.effectiveStart && coupon.effectiveEnd">
                        <view>{{formateDate(coupon.effectiveStart)}}~{{formateDate(coupon.effectiveEnd)}}</view>
                    </view>
                    <view class="coupon_pre_time" v-else-if="coupon.cycle">
                        领取后{{coupon.cycle}}天内可用
                    </view>
                </view>
                <view class="coupon_pre_right">
                    <image mode="widthFix" v-if="useState == 2" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/img_binjia_yilingqu.png"/>
                    <image mode="widthFix" v-if="useState == 3" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/img_youhuiquan_yiguoqi.png"/>
                </view>
            </view>
            
            <view class="btn" v-show="useState != 1">
                <template v-if="useState == 2">
                    <view @click="goGoodsList">去购买</view>
                </template>
                <template v-if="useState == 3">
                    <view @click="goHomePage">去商场逛逛</view>
                </template>
            </view>
        </view>

    </view>
</template>

<script module="filters" lang="wxs" src="@/utils/filter.wxs"></script>
<script>
import goodsHandler from "@/views/components/goods/handler";
import { skipTo } from '@/utils/common.js'

export default {
    data() {
        return {
            password: '',
            coupon: {},
            useState: 1,
            goReceiveBg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/coupon_pre_bg.png', //未使用
            finishReceiveBg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/finishReceiveBg.png' //已使用，已过期,
        };
    },
    watch: {
        coupon: {
            handler: function(newVal) {
                //优惠券状态state: 1-未开始；2-已失效；3-已删除； 4-进行中；5-已结束
                //已过期
                if (newVal.state == 2 || newVal.state == 3 || newVal.state == 5){
                    this.useState = 3
                    return
                }
                //未领取
                if (newVal.pwdCouponState == 1){
                    this.useState = 1
                }
                //已领取
                else if (newVal.pwdCouponState == 2){
                    this.useState = 2
                }
            },
            immediate: true,
            deep: true
        }
    },
    mounted(){
        this.password = this.$Route.query.password;
        this.getCouponByPwd();
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
            this.$refs?.loading?.open();
            let isSuccess = await this.getCoupon({password: this.password});
            if(this.useState == 1 && isSuccess) {
                await this.receive();
            }
            this.$refs?.loading?.close();
        },
        //获取优惠券详情
        getCoupon(requestData) {
            return new Promise(resolve => {
                let param = requestData;
                goodsHandler.getCouponDetail(param).then(res => {
                    if (res.state == 200) {
                        this.coupon = res.data;
                        resolve(true)
                    } else {
                        uni.showToast({ title: res.msg, icon: 'none' })
                        resolve(false)
                    }
                }).catch((e) => {
                    uni.showToast({ title: '获取优惠券信息失败', icon: 'none' })
                    console.error('获取优惠券详情失败：', e)
                    resolve(false)
                })
            })
        },
        receive(){
            let that = this;
            return new Promise(resolve => {
                let param = {
                    couponId: this.coupon.couponId,
                    password: this.password
                };
                goodsHandler.receiveCoupon(param).then(res => {
                    if (res.state == 200) {
                        uni.showToast({ title: '领取成功', icon: 'none' })
                        this.getCouponByPwd();
                    } else {
                        uni.showToast({ title: res.msg, icon: 'none' })
                    }
                }).catch((e) => {
                    console.error('领取优惠券失败：', e)
                }).finally(()=>{
                    resolve();
                })
            })
        },
        goHomePage(){
            uni.navigateTo({ url: '/' });
        },
        //去优惠券对应的商品列表
        goGoodsList() {
            let item = this.coupon;
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
</script>

<style lang='scss' scoped>
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

    .page-bg{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100vh;
        font-size: 0;
        z-index: -1;
    }
}

.top-bg{
    width: 100%;
    height: 234rpx;
    background-clip: padding-box;
    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/img_youhuiquan_up.png') left top / 100% 100% no-repeat;
}

.my_coupon_pre {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 68rpx 30rpx 62rpx;
    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/img_youhuiquan_down.png') left top / 100% 100% no-repeat;

    .coupon_pre_top {
        width: $couponWidth;
        height: 190rpx;
        position: relative;
        display: flex;
        align-items: stretch;

        .coupon_pre_left {
            position: relative;
            flex: none;
            display: flex;
            flex-direction: column;
            width: 192rpx;
            align-items: center;
            justify-content: center;
            color: #F30300;
            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/img_youhuiquan_banyuan.png') left top / 100% 100% no-repeat;

            .coupon_pre_price {
                font-size: 20rpx;
                color: #F20C06;
                line-height: 31rpx;
                text-align: center;

                text:nth-child(2) {
                    font-size: 48rpx;
                    font-weight: bold;
                    line-height: 31rpx;
                }
            }

            .coupon_pre_active {
                font-size: 24rpx;
                line-height: 31rpx;
                margin-top: 20rpx;
                padding: 0 15rpx;
                text-align: center;
            }
        }

        .coupon_pre_cen {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: auto;
            padding: 20rpx 10rpx;
            background: #fff;
            max-width: calc(100% - 192rpx - 160rpx);
            overflow: hidden;

            .coupon_pre_title {
                flex: none;
                font-size: 30rpx;
                font-weight: bold;
                color: #222;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-all;
            }

            .coupon_pre_time {
                margin-top: 20rpx;
                font-size: 24rpx;
                color: #222;
            }
        }

        .coupon_pre_right {
            flex: none;
            width: 160rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fff;
            border-radius: 0 16rpx 16rpx 0;
            image{
                width: 100%;
            }
        }
    }
}
.btn{
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
    }
}
</style>
