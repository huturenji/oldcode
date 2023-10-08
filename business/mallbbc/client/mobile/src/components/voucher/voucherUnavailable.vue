<!-- 商品check失败时，兑换券不可用的缺省页 -->
<template>
    <view class="voucherUnavailable_content" >
        <view class="img_box" >
            <image :src="imgUrl+'order/icon_common_success.png'" mode="widthFix" style="width: 50px; height: 50px;"/>
        </view>
        <view class="tips">商品已兑换</view>
        <view class="btn_wrap">
            <view class="btn" @click="gotoCustomerService">联系客服</view>
        </view>
    </view>
</template>

<script>

import customerService from '@/common/lib/customer-service';
export default {
    name: 'voucher-unavailable',
    components: {
        
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
        }
    },
    methods: {
        // 跳转到客服系统
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
    .voucherUnavailable_content{
        position: fixed;
        top: 0;
        bottom: 0;
        background: #fff;
        width: 750rpx;
        z-index: 1000;
        ::v-deep .activity_not_open{
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
            .btn{
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