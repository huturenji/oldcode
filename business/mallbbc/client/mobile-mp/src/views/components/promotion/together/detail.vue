<!-- 商品详情页涉及天天专场价格模块的显示组件 -->
<template>
    <view v-if="show" class="goods_detail_thumb promotion">
        <!-- 活动未开始 -->
        <view v-if="detail.state == 1" class="promotion_will_start flex_row_start_center">
            <view class="left flex_column_between_start">
                <view class="title">当前价</view>
                <view v-if="priceInfo.originalSalePrice" class="price"
                    :style="{ fontSize: leftPrice['small'][toSplit(toFix(priceInfo.originalSalePrice))[0].length] + 'rpx' }">
                    <text class="num-font">¥</text>
                    <text class="num-font intPrice"
                        :style="{ fontSize: leftPrice['big'][toSplit(toFix(priceInfo.originalSalePrice))[0].length] + 'rpx' }">{{
                            toSplit(toFix(priceInfo.originalSalePrice))[0] }}.</text>
                    <text class="num-font">{{ toSplit(toFix(priceInfo.originalSalePrice))[1] }}</text>
                </view>
                <view v-else class="no_price">
                    <text>￥</text>
                    <text>暂无报价</text>
                </view>
            </view>
            <view class="center flex_column_between_start">
                <view class="tabs flex_row_center_center">
                    <image :src="yiqimai" mode=""></image>
                    <view class="tab flex_column_center_center">{{ detail.wishStock }}件成团</view>
                </view>
                <view class="price"
                    :style="{ fontSize: rightPrice['small'][toSplit(toFix(detail.promotionPrice))[0].length] + 'rpx' }">
                    <text class="num-font">¥</text>
                    <text class="num-font intPrice"
                        :style="{ fontSize: rightPrice['big'][toSplit(toFix(detail.promotionPrice))[0].length] + 'rpx' }">{{
                            toSplit(toFix(detail.promotionPrice))[0] }}.</text>
                    <text class="num-font">{{ toSplit(toFix(detail.promotionPrice))[1] }}</text>
                </view>
            </view>
            <view class="right flex_column_between_end">
                <view class="preview flex_row_center_center" v-if="!remind" @click="subscribe">
                    <view class="clock"></view>
                    <view>提醒我</view>
                </view>
                <view class="cancel_preview flex_row_center_center" v-else @click="subscribe">
                    取消提醒
                </view>
                <view class="start_time">
                    {{ detail.startTime.substr(0, 16) + ' ' + "开售" }}
                </view>
            </view>
        </view>
        <!-- 一起买活动未开始 end -->
        <!-- 一起买活动进行中 start -->
        <view v-if="detail.state == 2" class="promotion_start flex_row_between_center">
            <view class="left">
                <view class="left_top flex_row_start_center">
                    <image :src="yiqimai" mode=""></image>
                    <!-- 经与需求人员沟通，当已拼人数大于5的时候，才展示已拼标签 -->
                    <view v-if="detail.buyQuantity && detail.buyQuantity >= 5" class="tab1 flex_column_center_center">
                        已拼{{ detail.buyQuantity }}件</view>
                    <view class="tab flex_column_center_center">{{ detail.wishStock }}件成团</view>
                </view>
                <view class="left_bottom flex_row_start_end">
                    <view class="price1">
                        <text class="num-font">¥</text>
                        <text class="num-font intPrice">{{ toSplit(toFix(detail.promotionPrice))[0]
                        }}.</text>
                        <text class="num-font">{{ toSplit(toFix(detail.promotionPrice))[1] }}</text>
                    </view>
                    <view v-if="priceInfo.originalSalePrice" class="price2">
                        <text class="num-font">¥</text>
                        <text class="num-font intPrice">{{ toSplit(toFix(priceInfo.originalSalePrice))[0] }}.</text>
                        <text class="num-font">{{ toSplit(toFix(priceInfo.originalSalePrice))[1] }}</text>
                    </view>
                    <view v-else class="no_price">
                        <text>￥</text>
                        <text class="">暂无报价</text>
                    </view>
                </view>
            </view>
            <view class="right">
                <view class="second_kill_text ">
                    距结束:
                </view>
                <view class="sec_kill_countdown">
                    <text class="time num-font">{{ Hour }}</text>
                    <text class="time_tips"></text>
                    <text class="time num-font">{{ Minute }}</text>
                    <text class="time_tips"></text>
                    <text class="time num-font">{{ Second }}</text>
                </view>
            </view>
        </view>
        <!-- 一起买活动进行中 end -->
    </view>
</template>

<script>
import { toFix, toSplit } from '@/utils/common.js'

import promotionHandler from "@/views/components/promotion/common/handler";
export default {
    props: {
        // 一起买活动详情
        detail: {
            type: Object,
            default: () => { }
        },
        // 价格相关信息
        priceInfo: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            toFix, toSplit,
            yiqimai: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/promotion/icon_jsh_yiqimai.png',
            imgUrl: getApp().globalData.imgUrl,
            Hour: '00',
            Minute: '00',
            Second: '00',
            timer: null,//定时器任务
            rightPrice: { //价格字号大小枚举
                small: { 1: 32, 2: 32, 3: 32, 4: 32, 5: 30, 6: 26, 7: 24, 8: 24 },
                big: { 1: 48, 2: 48, 3: 48, 4: 48, 5: 44, 6: 40, 7: 36, 8: 32 }
            },
            leftPrice: {
                small: { 1: 32, 2: 32, 3: 32, 4: 32, 5: 30, 6: 30, 7: 26, 8: 24 },
                big: { 1: 48, 2: 48, 3: 48, 4: 48, 5: 48, 6: 40, 7: 36, 8: 32 }
            },
            remind: false,
        };
    },
    created() {
    },

    computed: {
        show() {
            return Object.keys(this.detail).length > 0
        }
    },
    watch: {
        detail: {
            handler(val) {
                this.initCountTime(val);
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        // 初始化倒计时相关功能
        initCountTime(detail) {
            let that = this;
            if (detail.state == 1 || detail.state == 2) {
                let countTime = detail.distanceTime; //剩余时间秒 单位：s【秒】
                that.getTime(countTime);
                that.timer = setInterval(() => {
                    if (countTime <= 0) {
                        //倒计时结束，清除倒计时
                        clearInterval(that.timer);
                        if (detail.state == 1) { // 未开始一起买的商品倒计时结束之后，需要重新拉取一起买详情
                            that.$emit('initPromotionDetail')
                        } else { // 一起买结束的商品需要重新调用商品详情
                            that.$emit('initGoodsDetail')
                        }
                    } else {
                        countTime--;
                        that.getTime(countTime);
                    }
                }, 1000)
            }
        },
        /*
         * 获取倒计时
         * countTime：倒计时总秒数
         */
        getTime(countTime) {
            let hours = parseInt(countTime / 60 / 60);
            let minutes = parseInt(countTime / 60 % 60);
            let seconds = parseInt(countTime % 60);
            this.Hour = hours > 9 ? hours : '0' + hours;
            this.Minute = minutes > 9 ? minutes : '0' + minutes;
            this.Second = seconds > 9 ? seconds : '0' + seconds;
        },

        // 设置一起买活动提醒
        subscribe() {

            let param = {};
            param.productId = this.detail.productId;
            promotionHandler.setBuyTogetherRemind(param).then(res => {
                if (res.state == 200) {
                    this.remind = !this.remind;
                    if (this.remind) {
                        uni.showToast({
                            icon: 'error',
                            title: '活动预约成功'
                        })
                    } else {
                        uni.showToast({
                            icon: 'error',
                            title: '取消预约成功'
                        })
                    }
                } else {
                }
            }).catch((e) => {
                //异常处理
            })

        },
    }

}
</script>

<style lang='scss'>
/* 一起买活动 start */
.promotion {
    height: 132rpx;
    background-color: #fff;
    border-radius: 20rpx 20rpx 0rpx 0rpx;

    .price {
        margin-top: 12rpx;
        height: 38rpx;
        line-height: 38rpx;
        font-size: 32rpx;

        .intPrice {
            font-size: 48rpx;
        }
    }
}

.promotion_will_start {
    padding: 0 28rpx;
    height: 100%;
    background: url(https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/bg_jsh_yiqimmai_nor_red.png) center no-repeat;
    background-size: 100% 100%;

    .no_price {
        height: 38rpx;
        font-size: 32rpx;
        font-family: PingFangSC, PingFangSC-Semibold;
        font-weight: 600;
        text-align: left;
        color: #222222;
        line-height: 38rpx;
    }

    .left {
        height: 100%;
        padding: 18rpx 0 18rpx 0;
        font-size: 26rpx;
        color: #222222
    }

    .center {
        width: 190rpx;
        height: 100%;
        padding: 18rpx 0 18rpx 0;
        font-size: 26rpx;
    }

    .title {
        line-height: 36rpx;
        font-weight: bold;
    }

    .left {
        width: 248rpx;
        padding-right: 48rpx;

    }

    .center {
        color: #ffffff;

        .tabs {
            image {
                width: 84rpx;
                height: 24rpx;
            }

            .tab {
                color: #fff;
                min-width: 110rpx;
                height: 36rpx;
                font-size: 20rpx;
                border: 1px solid #fff;
                margin-left: 10rpx;
                text-align: center;
                border-radius: 4rpx;
                padding: 8rpx 6rpx;
            }
        }
    }

    .right {
        flex: 1;
        height: 100%;
        padding: 18rpx 0 16rpx 0;
        position: relative;

        .preview {
            font-size: 24rpx;
            font-weight: 600;
            text-align: center;
            line-height: 24rpx;
            color: #222222;

            .clock {
                width: 28rpx;
                height: 28rpx;
                background: url(https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/promotion/icon_common_naozhong_black.svg) center no-repeat;
                margin-right: 4rpx;
            }

            image {
                width: 28rpx;
                height: 28rpx;
            }

            text {
                margin-left: 4rpx;
                line-height: 24rpx;
            }
        }

        .start_time {
            position: absolute;
            bottom: 12rpx;
            right: 0;
            width: 260rpx;
            font-size: 22rpx;
            font-weight: bold;
            text-align: right;
            color: #ffffff;
            word-break: break-all;
        }

        .preview {
            width: 144rpx;
            height: 52rpx;
            background: #ffffff;
            border-radius: 26rpx;
            font-size: 24rpx;
            font-weight: bold;
        }

        .cancel_preview {
            width: 144rpx;
            height: 52rpx;
            background: #ffffff;
            border-radius: 26rpx;
            font-size: 24rpx;
            font-weight: bold;
        }
    }
}

.promotion_start {
    padding: 0 28rpx;
    height: 100%;
    background: url(https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/bg_jsh_redyiqimmai_red.png) center no-repeat;
    background-size: 100% 100%;

    .price {
        margin-bottom: 10rpx;
        color: #fff;
    }

    .left {
        height: 100%;

        .left_top {
            padding: 18rpx 0rpx;

            image {
                width: 84rpx;
                height: 24rpx;
            }

            .tab {
                color: #fff;
                min-width: 110rpx;
                height: 36rpx;
                font-size: 20rpx;
                border: 1px solid #fff;
                margin-left: 8rpx;
                text-align: center;
                border-radius: 4rpx;
                padding: 8rpx 6rpx;
            }

            .tab1 {
                font-size: 20rpx;
                width: 106rpx;
                color: #ffffff;
                height: 36rpx;
                background: rgba(102, 102, 102, 0.40);
                border-radius: 4rpx;
                margin-left: 26rpx;
            }
        }

        .left_bottom {
            .price1 {
                height: 36rpx;
                line-height: 36rpx;
                font-size: 32rpx;
                color: #fff;

                .intPrice {
                    font-size: 48rpx;
                }
            }

            .price2 {
                height: 20rpx;
                color: #ffffff;
                line-height: 20rpx;
                font-size: 28rpx;
                margin-left: 16rpx;
                text-decoration: line-through;
            }

            .no_price {
                margin-left: 16rpx;
                height: 20rpx;
                font-size: 28rpx;
                font-family: PingFangSC, PingFangSC-Semibold;
                font-weight: 600;
                text-align: left;
                color: #ffffff;
                line-height: 20rpx;
            }
        }
    }

    .right {
        height: 100%;
        padding: 18rpx 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
    }
}

.promotion_icon {
    line-height: 40rpx;
    height: 40rpx;
    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/seckill/icon_common_naozhong_white.svg') left center no-repeat;
    background-size: 30rpx 30rpx;
    padding-left: 34rpx;
    height: 30rpx;
    font-size: 28rpx;
    color: #eef4f9;
    font-weight: 600;
    display: flex;
    align-items: center;
    padding-bottom: 4rpx;
}

.second_kill_price {
    margin-left: 14rpx;
    font-size: 24rpx;
    font-family: PingFang SC;
    color: #ffdada;
    height: 36rpx;
    display: flex;
    position: relative;

    &.line_through::before {
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background: #ffdada;
        position: absolute;
        top: 18rpx;
    }

    .price {
        font-size: 26rpx;
        padding-left: 6rpx;
    }
}


.second_kill_text {
    color: #222222;
    margin-bottom: 20rpx;
    height: 24rpx;
    line-height: 24rpx;
    font-size: 24rpx;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 600;
    text-align: center;
}

.sec_kill_countdown {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    font-family: PingFang SC;
    color: #FF333A;
    line-height: 34rpx;
}

.sec_kill_countdown .day {
    margin-right: 10rpx;
}

.sec_kill_countdown .time {
    width: 48rpx;
    height: 36rpx;
    line-height: 36rpx;
    background: url(https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/promotion/bg_jsh_time1.png) center no-repeat;
    background-size: 100% 100%;
    text-align: center;
    color: #ffffff;
}

.sec_kill_countdown .time_tips {
    width: 6rpx;
    height: 24rpx;
    background: url(https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/promotion/bg_jsh_time5.png) center no-repeat;
    background-size: 100% 100%;
    margin: 0 12rpx;
}

/* 一起买活动 end */
</style>