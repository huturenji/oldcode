<!-- 奖品详情check接口报错的联系客服缺省页 -->
<template>
    <view class="voucherEmpty_content">
        <empty emptyImg="icon_defpage_zrcc" tips="" />
        <view class="tips">您的奖品暂时无法领取，如有疑问，请联系客服</view>
        <view class="btn_wrap">
            <btn-customer class="btn-customer" :showCard="false" title="" path='' image="">
                联系客服
            </btn-customer>
        </view>
    </view>
</template>

<script>
// 引入客服的功能
import empty from '@/common/components/empty';
import BtnCustomer from '@/common/components/button/btn-customer'

export default {
    name: 'voucher-empty',
    components: {
        empty,
        BtnCustomer
    },
    data() {
        return {
 
        }
    },
    methods: {
        //跳转到客服系统
        async gotoCustomerService(){
            let url = await customerService.run(1).catch(e=>{
                console.log(e)
            });
            this.$openCustomerServicePage(url)
        }
    }
}
</script>

<style lang='scss' scoped>
    .voucherEmpty_content {
        position: fixed;
        top: 0;
        bottom: 0;
        background: #fff;
        width: 750rpx;
        z-index: 1000;
        ::v-deep .empty_container{
            background: #fff;
            .empty_sort_page{
                background: #fff;
                .empty_img{
                    width: 240rpx;
                    height: 240rpx;
                }
            }
        }

        .tips{
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
        }
    }
</style>