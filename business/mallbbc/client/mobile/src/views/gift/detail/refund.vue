<!-- 鹅毛情退款详情页面 -->
<template>
    <view class="order-refund-wrapper">
        <block v-if="state === 200">
            <view v-if="refundInfo.orderSn">
                <text>订单编号</text>
                <text>{{ refundInfo.orderSn }}</text>
            </view>
            <view>
                <text>退款时间</text>
                <text>{{ refundInfo.refundTime }}</text>
            </view>
            <view>
                <text>退款金额</text>

                <text>
                    {{ $getPartNumber(refundInfo.refundAmount, 'int') }}{{ $getPartNumber(refundInfo.refundAmount, 'decimal') }} 元
                </text>
            </view>
            <view>
                <text>支付方式</text>
                <text>{{ refundInfo.paymentName }}</text>
            </view>
            <view>
                <text>退款路径</text>
                <text>原路退回</text>
            </view>
        </block>
    </view>
</template>

<script>
import giftHandler from "@/components/gift/handler";

export default {
    data() {
        return {
            refundInfo: {},
            state: 255
        }
    },
    created() {
        this.getGiftRefundDetail();
    },

    methods: {
        getGiftRefundDetail() {
            uni.showLoading();
            const params = {
                featherId: this.$Route.query.featherId
            };
            giftHandler.getGiftRefundDetail(params).then(res => {
                if (res.state === 200 && res.data) {
                    this.refundInfo = res.data;
                    this.state = 200; // 状态转为正常，显示退款信息
                } else {
                    console.error(res.state, res.msg);
                }
            }).finally(() => {
                uni.hideLoading();
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.order-refund-wrapper {
    background-color: #fff;
    min-height: 100vh;
    padding: 40rpx;

    &>view {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20rpx;
        line-height: 40rpx;
        height: 40rpx;

        text:nth-child(1) {
            color: #999;
            font-size: 28rpx;
            line-height: 40rpx;
            font-weight: 400;
        }


        text:nth-child(2) {
            font-size: 28rpx;
            line-height: 40rpx;
            font-weight: 400;
            color: #222222;
        }
    }
}
</style>
