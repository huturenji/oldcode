<template name="rechargeResult">
    <view class="container flex_column_between_center">
        <view class="top_bg">
        </view>
        <view class="top_content flex_column_start_center">
            <view class="nav flex_row_center_center">
                <text class="title">充值结果</text>
            </view>
            <view class="detail flex_column_start_center">
                <image class="result_icon" :src='rechargeData.icon' />
                <text class="result">{{rechargeData.title}}</text>
                <view v-for="(item,key,index) in rechargeData.detail"  :key='index' class="item flex_row_between_center">
                    <text class="left">{{item.name}}</text>
                    <text class="right">{{item.value}}</text>
                </view>
            </view>
        </view>
        <view v-if="rechargeData.resule=='success'" class="operate flex_row_center_center">
            确认
        </view>
        <view v-if="rechargeData.resule=='fail'" class="flex_column_end_center">
            <view class="operate flex_row_center_center">
                再次充值
            </view>
            <view class="go_back flex_row_center_center">
                返回
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: "rechargeResult",
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
        }
    },
    props: {
        rechargeData: {
            type: Object,
            value: {}
        }
    },
    onLoad(){
    },
    methods: {

    }
}
</script>

<style lang="scss">
    page {
        background: $bg-color-split;

        .container {
            width: 750rpx;
            height: 100vh;

            .top_bg {
                position: absolute;
                top: 0;
                left: 50%;
                margin-left: -375rpx;
                right: 0;
                width: 750rpx;
                height: 533rpx;
                background-size: contain;
                z-index: 0;
                background: #F30300;
            }

            .top_content {
                width: 100%;

                .nav {
                    width: 100%;
                    padding: 20rpx;
                    height: 90rpx;
                    position: relative;
                    margin-bottom: 40rpx;

                    .iconfont {
                        position: absolute;
                        font-size: 26rpx;
                        left: 20rpx;
                        top: 37rpx;
                        color: #fff;
                    }

                    .title {
                        color: #fff;
                        font-size: 36rpx;
                    }
                }

                .detail {
                    width: 670rpx;
                    background: #fff;
                    box-shadow: 0px 0px 20px 0px rgba(86, 86, 86, 0.15);
                    border-radius: 10rpx;
                    z-index: 1;
                    padding: 30rpx 30rpx 50rpx;

                    .result_icon {
                        width: 146rpx;
                        height: 146rpx;
                        margin-top: 60rpx;
                    }

                    .result {
                        color: $main-third-color;
                        font-size: 28rpx;
                        width: 100%;
                        text-align: center;
                        border-bottom: 1rpx solid rgba(0,0,0,.1);
                        padding-bottom: 50rpx;
                    }

                    .item {
                        width: 100%;
                        color: $main-third-color;
                        font-size: 26rpx;
                        margin-top: 30rpx;
                    }
                }
            }

            .operate {
                width: 670rpx;
                height: 88rpx;
                margin-bottom: 40rpx;
                background: linear-gradient(-90deg, rgba(252, 29, 28, 1) 0%, rgba(255, 122, 24, 1) 100%);
                box-shadow: 0px 3rpx 20rpx 0px rgba(252, 30, 28, 0.26);
                border-radius: 44rpx;
                color: #fff;
                font-size: 36rpx;
            }
            .go_back{
                width:670rpx;
                height:88rpx;
                background:#fff;
                border:1rpx solid $main-color;
                border-radius:44rpx;
                color: $main-color;
                font-size: 36rpx;
                margin-bottom: 40rpx;
            }
        }
    }
</style>
