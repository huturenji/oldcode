<!-- 鹅毛情退款详情页面 -->
<template>
    <view class="order-refund-wrapper">
        <w-loading ref="loading"></w-loading>
        <block v-if="flag">
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
                    {{ getPartNumber(refundInfo.refundAmount, 'int') }}{{ getPartNumber(refundInfo.refundAmount,
                            'decimal')
                    }} 元
                </text>
            </view>
            <view>
                <text>退款方式</text>
                <text>原支付返还</text>
            </view>
            <view>
                <text>预计退款至</text>
                <text>{{ refundInfo.paymentName }}</text>
            </view>
        </block>
    </view>
</template>

<script>
import { getGiftRefundDetail } from '@/views/components/gift/handler';
import { getPartNumber } from '@/utils/common';
export default {
    data() {
        return {
            getPartNumber,
            refundInfo: {},
            flag: false
        }
    },
    mounted() {
        this.getGiftRefundDetail();

    },
    methods: {
        getGiftRefundDetail() {
            this.$refs?.loading?.open();
            const params = {
                featherId: this.$Route.query.featherId
            };
            getGiftRefundDetail(params).then(res => {
                if (res.state === 200 && res.data) {
                    this.refundInfo = res.data;
                    this.flag = true; // 状态转为正常，显示退款信息
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: res.msg
                    })
                }
            }).finally(() => {
                this.$refs?.loading?.close();
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
