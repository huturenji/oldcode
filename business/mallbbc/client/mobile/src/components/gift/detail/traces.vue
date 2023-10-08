<template>
    <view class="trace-container">
        <view class="trace">
            <view class="trace-head"><text>礼物配送信息</text></view>
            <view class="divide-line"></view>
            <view class="trace-body">
                <view class="trace-item" v-for="(trace, index) in traces" :key="index">
                    <view class="icon-wrapper">
                        <!-- 开始节点 -->
                        <block  v-if="index == 0">
                            <image class="icon" v-if="trace.acceptTime" :src="imgUrl + 'gift/icon_setp_sel3_red.svg'"></image>
                            <image class="icon" v-else :src="imgUrl + 'gift/icon_setp_ing.svg'"></image>
                        </block>
                        <block v-else>
                            <image class="icon" v-if="trace.acceptTime" :src="imgUrl + 'gift/icon_setp_sel3_red.svg'">
                            </image>
                            <image class="icon" v-else :src="imgUrl + 'gift/icon_setp_sel3_gray.svg'"></image>
                        </block>
                    </view>
                    <view class="content-wrapper" :class="{'content-wrapper-line': index < traces.length - 1}">
                        <view class="title">{{trace.acceptStation}}</view>
                        <view class="remark">
                            <block v-if="index == 0 && !trace.acceptTime">
                                等待商家发货
                            </block>
                            <block v-else-if="index > 0 && !trace.acceptTime"></block>
                            <block v-else>
                                {{trace.remark}}
                            </block>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>

</template>

<script>
export default {
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
        }
    },
    props: {
        traces: {
            default: () => [],
            type: Array
        }
    }
}
</script>

<style lang="scss" scoped>
.trace-container {
    padding: 0 20rpx;
    margin-top: 20rpx;
}

.trace {
    padding: 16rpx 28rpx;
    background: #ffffff;
    border-radius: 20rpx;
    position: relative;

    .trace-head {
        height: 36rpx;
        font-size: 26rpx;
        color: #666666;
        line-height: 36rpx;
    }

    .divide-line {
        border-bottom: 1rpx solid #DDDCDC;
        position: absolute;
        width: 100%;
        left: 0;
        top: 64rpx
    }

    .trace-body {
        margin-top: 32rpx;

        .trace-item {
            display: flex;
            align-items: flex-start;

            .icon-wrapper {
                width: 64rpx;
                height: 64rpx;
                display: flex;
                justify-content: center;

                .icon {
                    margin-top: 4rpx;
                    width: 32rpx;
                    height: 32rpx;
                }
            }

            .content-wrapper {
                position: relative;
                display: flex;
                align-items: center;

                .title {
                    font-size: 30rpx;
                    font-weight: bold;
                    color: #222;
                    line-height: 42rpx;
                    height:42rpx;
                }

                .remark {
                    font-size: 28rpx;
                    margin-left: 16rpx;
                    height: 40rpx;
                    line-height: 40rpx;
                }
            }

            .content-wrapper-line {
                &::before {
                    content: "";
                    border-left: 2rpx dashed #c2c2c2;
                    position: absolute;
                    height: 18rpx;
                    top: 42rpx;
                    left: -32rpx;
                }
            }
        }
    }
}
</style>