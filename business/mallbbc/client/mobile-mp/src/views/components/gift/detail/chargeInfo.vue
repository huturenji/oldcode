<template>
    <view class="charge-wrapper">
        <view>
            <text>商品合计</text>
            <text class="num-font">
                <text class="mark">￥</text>
                <text class="integer">{{ getPartNumber(chargeInfo.totalMoney, 'int') }} </text>
                <text class="decimal">{{ getPartNumber(chargeInfo.totalMoney, 'decimal')
                }}</text>
            </text>
        </view>
        <view>
            <text>运费</text>
            <text class="num-font">
                <text class="mark">￥</text>
                <text class="integer">{{ getPartNumber(chargeInfo.totalExpress, 'int') }}
                </text>
                <text class="decimal">{{ getPartNumber(chargeInfo.totalExpress, 'decimal')
                }}</text>
            </text>
        </view>
        <view v-if="chargeInfo.fullDiscountAmount">
            <text>满优惠</text>
            <text class="num-font">
                <text class="mark">-￥</text>
                <text class="integer">{{ getPartNumber(chargeInfo.fullDiscountAmount, 'int') }}
                </text>
                <text class="decimal">{{ getPartNumber(chargeInfo.fullDiscountAmount,
                        'decimal')
                }}</text>
            </text>
        </view>
        <view v-if="chargeInfo.storeVoucherAmount">
            <text>店铺优惠券</text>
            <text class="num-font">
                <text class="mark">-￥</text>
                <text class="integer">{{ getPartNumber(chargeInfo.storeVoucherAmount, 'int') }}
                </text>
                <text class="decimal">{{ getPartNumber(chargeInfo.storeVoucherAmount,
                        'decimal')
                }}</text>
            </text>
        </view>
        <view v-if="chargeInfo.platformVoucherAmount">
            <text>平台优惠券</text>
            <text class="num-font">
                <text class="mark">-￥</text>
                <text class="integer">{{ getPartNumber(chargeInfo.platformVoucherAmount, 'int')
                }} </text>
                <text class="decimal">{{ getPartNumber(chargeInfo.platformVoucherAmount,
                        'decimal')
                }}</text>
            </text>
        </view>
        <view v-if="chargeInfo.integralCashAmount">
            <text>云豆抵扣优惠</text>
            <text class="num-font">
                <text class="mark">-￥</text>
                <text class="integer">{{ getPartNumber(chargeInfo.integralCashAmount, 'int') }}
                </text>
                <text class="decimal">{{ getPartNumber(chargeInfo.integralCashAmount,
                        'decimal')
                }}</text>
            </text>
        </view>
        <view v-if="!isCancel && !isToPay">
            <text>实付款</text>
            <text class="real-pay num-font">
                <text class="mark real-pay-mark">￥</text>
                <text class="integer real-pay-integer">{{
                        getPartNumber(chargeInfo.actualPayment, 'int')
                }}
                </text>
                <text class="decimal real-pay-decimal">{{
                        getPartNumber(chargeInfo.actualPayment, 'decimal')
                }}</text>
            </text>
        </view>
        <view v-if="isToPay">
            <text>待支付金额</text>
            <text class="real-pay num-font">
                <text class="mark real-pay-mark">￥</text>
                <text class="integer real-pay-integer">{{
                        getPartNumber(chargeInfo.orderAmount, 'int')
                }}
                </text>
                <text class="decimal real-pay-decimal">{{
                        getPartNumber(chargeInfo.orderAmount, 'decimal')
                }}</text>
            </text>
        </view>
    </view>
</template>

<script>
import { getPartNumber } from '@/utils/common';
export default {
    props: {
        chargeInfo: {
            type: Object,
            default: () => { }
        },
        isCancel: {
            type: Boolean,
            default: () => false
        },
        isToPay: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            getPartNumber
        }
    }
}
</script>

<style lang="scss" scoped>
.charge-wrapper {
    overflow: hidden;
    padding: 0 16px 16px;
    background-color: #fff;

    &>view {
        display: flex;
        justify-content: space-between;
        margin-top: 20rpx;

        &>text:nth-child(1) {
            color: #999;
            font-size: 28rpx;
            font-weight: 400;
            line-height: 40rpx;
            height: 40rpx;
        }


        .real-pay {
            color: #F30300;
            height: 44rpx;
            line-height: 34rpx;
        }
    }
}

.mark {
    font-size: 24rpx;
}

.decimal {
    font-size: 20rpx;
}

.integer {
    font-size: 32rpx;
}

.real-pay-mark {
    font-size: 28rpx;
}

.real-pay-decimal {
    font-size: 24rpx;
}

.real-pay-integer {
    font-size: 36rpx;
}

</style>