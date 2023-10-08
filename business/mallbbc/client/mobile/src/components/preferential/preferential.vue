<!-- 优惠券/满优惠展示组件 -->
<template>
    <view class="preferential_container">
        <view class="left">
            <view class="preferential_wrapper">
                <!-- 优惠券 -->
                <view class="coupon_icon_wrapper" v-for="item in couponList"
                        :key="item">
                    <view
                        :class="[
                            'coupon_icon',
                            iconSize === 'large'
                                ? 'large_coupon_icon'
                                : 'small_coupon_icon',
                        ]"
                        
                    >
                        <view
                            :class="[
                                'getCoupon_btn',
                                iconSize === 'large'
                                    ? 'large_btn'
                                    : 'small_btn',
                            ]"
                            >领券</view
                        >
                        <view class="coupon_content">
                            {{ item }}
                        </view>
                    </view>
                    <!-- 优惠券圆角 -->
                    <span
                        :class="[
                            'coupon_circle',
                            'left_circle',
                            iconSize === 'large'
                                ? 'large_circle'
                                : 'small_circle',
                        ]"
                    ></span>
                    <span
                        :class="[
                            'coupon_circle',
                            'right_circle',
                            iconSize === 'large'
                                ? 'large_circle'
                                : 'small_circle',
                        ]"
                    ></span>
                </view>

                <!-- 满优惠活动 -->
                <view
                    class="full_preferential_wrapper"
                    v-for="item in fullList"
                    :key="item"
                >
                    {{ item }}
                </view>

                <!-- 免息 -->
                <view
                    class="interest_free_wrapper"
                    v-for="item in interestFreeList"
                    :key="item"
                >
                    {{ item }}
                </view>

                <!-- 云豆 -->
                <view
                    class="integral_wrapper"
                    v-for="item in scoreList"
                    :key="item"
                >
                    <span class="integral_icon"></span>
                    <span>{{ item }}</span>
                </view>
            </view>
        </view>
        <view class="right">
            <slot name="right"></slot>
        </view>
    </view>
</template>

<script>
export default {
    name: "preferential",
    props: {
        // 领券按钮部分宽度
        iconSize: {
            type: String,
            default: () => "small"
        },
        // 优惠类型
        couponList: {
            type: Array,
            default: () => []
        },
        // 优惠内容
        fullList: {
            type: Array,
            default: () => []
        },
        // 优惠内容
        scoreList: {
            type: Array,
            default: () => []
        },
        // 优惠内容
        interestFreeList: {
            type: Array,
            default: () => []
        }
    }
};
</script>

<style lang="scss" scoped>
.preferential_container {
    position: relative;
    display: flex;
    .left {
        width: calc(100% - 100rpx);
        .preferential_wrapper {
            display: flex;
            flex-wrap: wrap;
            // margin-bottom: 24rpx;
            // justify-content: space-between;

            .coupon_icon_wrapper {
                position: relative;
                overflow: hidden;
                margin-right: 20rpx;
                margin-bottom: 16rpx;

                .coupon_icon {
                    display: flex;
                    align-items: center;
                    border: 1px solid #f30300;
                    border-radius: 4rpx;
                    color: #f30300;
                    font-weight: bold;
                    font-size: 20rpx;

                    .getCoupon_btn {
                        text-align: center;
                        border-right: 1px dotted #f30300;
                        cursor: pointer;
                    }
                    .large_btn {
                        width: 58rpx;
                    }

                    .small_btn {
                        width: 52rpx;
                    }

                    .coupon_content {
                        padding: 0 12rpx;
                    }
                }

                .large_coupon_icon {
                    height: 40rpx;
                }

                .small_coupon_icon {
                    height: 33rpx;
                }

                .coupon_circle {
                    display: inline-block;
                    position: absolute;
                    border-radius: 50%;
                    border: 1px solid #f30300;
                    background-color: #fff;
                }
                .large_circle {
                    width: 12rpx;
                    height: 12rpx;
                }

                .small_circle {
                    width: 10rpx;
                    height: 10rpx;
                }

                .left_circle {
                    left: 0;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }

                .right_circle {
                    right: 0;
                    top: 50%;
                    transform: translate(50%, -50%);
                }
            }

            .full_preferential_wrapper,
            .integral_wrapper,
            .interest_free_wrapper {
                height: 40rpx;
                line-height: 40rpx;
                border: 1px solid #f30300;
                border-radius: 4rpx;
                padding: 0 16rpx;
                text-align: center;
                color: #f30300;
                font-size: 20rpx;
                font-weight: bold;
                margin-right: 20rpx;
                margin-bottom: 20rpx;
            }

            .integral_wrapper {
                display: flex;
                align-items: center;
                span {
                    display: inline-block;
                }

                .integral_icon {
                    width: 28rpx;
                    height: 28rpx;
                    background-image: url("@/static/shared/coupon/icon_common_jifen_big.svg");
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                }
            }
        }
    }

    .right {
        position: absolute;
        bottom: 20rpx;
        right: 0;
    }
}
</style>