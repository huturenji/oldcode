<!-- 奖品详情check接口报错的联系客服缺省页 -->
<template>
    <view class="voucherEmpty_content">
        <empty emptyImg="icon_defpage_zrcc" :tips="tips" />
        <view class="tips">您的奖品暂时无法领取，如有疑问，请联系客服</view>
        <view class="btn_wrap">
            <btn-customer class="btn-customer" :showCard="false" title="" path='' image="">
                联系客服
            </btn-customer>
        </view>
    </view>
</template>

<script>
import empty from '@/common/components/empty/index.vue';
import BtnCustomer from '@/common/components/button/btn-customer.vue'

export default {
    name: 'voucher-empty',
    components: {
        empty,
        BtnCustomer
    },
    data() {
        return {
            tips: ''
        }
    },
    methods: {

    }
}
</script>

<style lang='scss' scoped>
    .voucherEmpty_content {
        position: fixed;
        top: 0;
        bottom: 0;
        background: #eff2f5;
        width: 750rpx;
        z-index: 1000;

        .tips {
            width: 100%;
            text-align: center;
            padding: 0 134rpx;
            font-size: 30rpx;
            line-height: 42rpx;
            margin-top: 32rpx;
        }

        .btn_wrap{
            width: 100%;
            display: flex;
            justify-content: center;
            padding: 0 56rpx;
            margin-top: 110rpx;

            ::v-deep .btn-customer {
                width: 100%;
            }

            ::v-deep button {
                cursor: pointer;
                width: 100%;
                height: 88rpx;
                background: #f30300;
                border-radius: 44rpx;
                line-height: 88rpx;
                text-align: center;
                color: #fff;
                font-size: 30rpx;
                &:active{
                    opacity: .8;
                }
            }
        }
    }
</style>