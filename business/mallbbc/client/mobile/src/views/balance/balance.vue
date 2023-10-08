<!-- 我的钱包页面 -->
<template>
    <view class="container">
        <view class="content">
            <image class="bg"/>
            <view class="detail flex_column_start_start">
                <text class="balance_title">{{$L('可用余额(元)')}}</text>
                <view class="balance_num flex_row_start_end">
                    <text class="unit">￥</text>
                    <text class="amount">{{$getPartNumber(balanceData.balanceAvailable,'int')}}</text>
                    <text class="unit">{{$getPartNumber(balanceData.balanceAvailable,'decimal')}}</text>
                </view>
                <view class="total_amount flex_row_start_center">
                    <image class="amount_icon" :src="imgUrl+'balance/amount_icon.png'" />
                    <text class="con tit">{{$L('账户总额 (元)')}}</text>
                    <text class="con unit">￥</text>
                    <text class="con amount">{{balanceData.rechargeSum}}</text>
                </view>
            </view>
            <view class="recharge_btn flex_row_center_center" @click="navTo({path:'/pages/recharge/recharge',query:{balance:balanceData.rechargeSum,payMethodType:'rechargeBalance'}})">
                <text class="con">{{$L('充值')}}</text>
                <text class="iconfont icon_arrow_right"></text>
            </view>
        </view>
        <view class="detail_list flex_column_start_start">
            <view class="item flex_row_between_center b_b" @click="navTo('/pages/balance/list')">
                <view class="left flex_row_start_center">
                    <image class="icon" :src="imgUrl+'balance/balance_icon.png'" />
                    <text class="tit">{{$L('余额明细')}}</text>
                </view>
                <text class="iconfont icon_arrow_right"></text>
            </view>
            <view class="item flex_row_between_center" @click="navTo('/pages/recharge/list')">
                <view class="left flex_row_start_center">
                    <image class="icon" :src="imgUrl+'balance/recharge_icon.png'" />
                    <text class="tit">{{$L('充值明细')}}</text>
                </view>
                <text class="iconfont icon_arrow_right"></text>
            </view>

        </view>
    </view>
</template>

<script>
import {
    mapState
} from 'vuex';
export default {
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            balanceData: {} //余额
        }
    },
    onLoad() {
        // this.getInfo()
    },
    mounted(){
        this.getInfo()
    },
    computed: {
        ...mapState(['hasLogin', 'userInfo'])
    },
    methods: {
        //获取会员账户余额
        getInfo() {
            this.$request({
                url: 'v3/member/front/balanceRecharge/getMemberBalance',
                // data: {
                //     key: this.userInfo.access_token
                // },
                method: 'GET'
            }).then(res => {
                if (res.state == 200) {
                    this.balanceData = res.data;
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {})
        },
        navTo(url) {
            this.$Router.push(url)
        }
    }
}
</script>

<style lang="scss">
    uni-page-body {
        display: flex;
        height: 100%;
    }

    page {
        background: $bg-color-split;
        width: 750rpx;
        margin: 0 auto;
        .container {
            margin-top: 20rpx;
            display: flex;
            flex-direction: column;
            flex: 1;
            background: #fff;

            .content {
                margin-top: 30rpx;
                width: 690rpx;
                height: 340rpx;
                margin-left: 30rpx;
                position: relative;

                .recharge_btn {
                    position: absolute;
                    z-index: 2;
                    right: 0;
                    top: 111rpx;
                    width: 142rpx;
                    height: 60rpx;
                    background: linear-gradient(90deg, rgba(238, 238, 238, .5) 0%, rgba(238, 238, 238, 0) 100%);
                    // opacity:0.5;
                    border-radius: 30rpx;
                    color: #fff;
                    font-size: 30rpx;

                    .iconfont {
                        font-size: 16rpx;
                        transform: scale(0.75);
                        display: inline-block;
                        margin-left: 5rpx;
                    }
                }

                .bg {
                    width: 100%;
                    height: 100%;
                }

                .detail {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    z-index: 2;
                    padding: 45rpx 40rpx;
                    color: #fff;
                    background: #F30300;
                    border-radius: 30rpx;

                    .balance_title {
                        font-size: 26rpx;
                    }

                    .balance_num {
                        font-weight: bold;
                        margin-top: 41rpx;
                        color: #fff;

                        .unit {
                            font-size: 46rpx;
                            font-weight: bold;
                            line-height: 52rpx;
                        }

                        .amount {
                            font-size: 66rpx;
                            font-weight: bold;
                            line-height: 66rpx;
                        }
                    }

                    .total_amount {
                        margin-top: 84rpx;

                        .amount_icon {
                            width: 27rpx;
                            height: 23rpx;
                            margin-right: 9rpx;
                        }

                        .con {
                            color: rgba(255, 255, 255, .8);
                        }

                        .tit,
                        .amount {
                            font-size: 26rpx;
                        }

                        .unit {
                            font-size: 22rpx;
                            margin-left: 5rpx;
                        }
                    }

                }
            }

            .detail_list {
                padding: 0 30rpx;

                .item {
                    width: 100%;
                    height: 141rpx;
                    position: relative;

                    .left {
                        .icon {
                            width: 80rpx;
                            height: 80rpx;
                            margin-right: 20rpx;
                        }

                        .tit {
                            color: $main-font-color;
                            font-size: 30rpx;
                        }
                    }

                    .iconfont {
                        color: $main-third-color;
                        font-size: 32rpx;
                        transform: scale(0.75);
                        display: inline-block;
                    }
                }
            }
        }


    }
</style>
