<!-- 商品check失败时，兑换券不可用的缺省页 -->
<template>
    <view class="voucherUnavailable_content" >
        <view class="img_box" >
            <image
                src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/images/icon_common_success.png"
                mode="widthFix"
                style="width: 50px; height: 50px;"
            />
        </view>
        <view class="tips">商品已兑换</view>
        <view class="btn_wrap">
            <btn-customer class="btn-customer" :showCard="false" title="" path='' image="">
                联系客服
            </btn-customer>
        </view>
    </view>
</template>

<script>
import BtnCustomer from '@/common/components/button/btn-customer'

export default {
    name: 'voucher-unavailable',
    components: {
        BtnCustomer
    },
    data() {
        return {
             
        }
    },
    methods: {

    }
}
</script>

<style lang='scss' scoped>
    .voucherUnavailable_content{
        position: fixed;
        top: 0;
        bottom: 0;
        background: #fff;
        width: 750rpx;
        z-index: 1000;
        ::v-deep .empty_container{
            background: #fff;
            .Unavailable_sort_page{
                background: #fff;
                .Unavailable_img{
                    width: 240rpx;
                    height: 240rpx;
                }
            }
        }
        .img_box{
            margin: auto;
            margin-top: 100px;
            display: flex;
            justify-content: center;
        }
        .tips{
            width: 100%;
            text-align: center;
            padding: 0 134rpx;
            font-size: 35rpx;
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