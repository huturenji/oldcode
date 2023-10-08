<!-- 商品详情页涉及天天专场价格模块的显示组件 -->
<template>
    <view v-if="show" class="goods_detail_thumb">
        <view class="daily_price num-font">
            <view class="price">
                <view>
                    <text class="unit">¥ </text>
                    <text class="price_int">{{$getPartNumber(priceInfo.salePrice,'int')}}</text>
                    <text class="price_decimal">{{$getPartNumber(priceInfo.salePrice,'decimal')}}</text>
                </view>
            </view>
            <view class="tips">专场价</view>
        </view>
        <view v-if="priceInfo.originalSalePrice" class="origin_price num-font">
            <text class="unit">¥ </text>
            <text class="price_int">{{$getPartNumber(priceInfo.originalSalePrice,'int')}}</text>
            <text class="price_decimal">{{$getPartNumber(priceInfo.originalSalePrice,'decimal')}}</text>
        </view>
    </view>
</template>

<script>
export default {
    components: {
       
    },
    props:{
        // 价格信息
        priceInfo: {
            type: Object,
            default: ()=>{}
        }
    },
    data() {
        return {
            
        };
    },
    created() {
    },
    mounted(){
       
    },
   
    computed: {
        show(){
            return !!this.priceInfo.salePrice
        }
    },
    
    methods: {

    }
        
}
</script>

<style lang='scss' scoped>
.goods_detail_thumb{
    background-color: #fff;
    padding: 22rpx 30rpx 0 30rpx;
    display: flex;
    align-items: flex-end;
    border-radius: 20rpx 20rpx 0 0;
    .daily_price{
        display: flex;
        align-items: center;
        
        .price{   
            display: flex;
            align-items: center;
            height: 56rpx;
            overflow: hidden;
            border-radius: 12rpx 0 0 12rpx;
            background: #222;
            color: #fff;
            padding: 0 40rpx 0 20rpx;
            
            .unit{
                font-size: 28rpx;
            }
            .price_int{
                min-height: 44rpx;
                font-size: 36rpx;
            }
            .price_decimal{
                font-size: 24rpx;
            }
        }
        .tips{
           
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 56rpx;
            color: #222;
            font-size: 26rpx;
            padding: 0 20rpx;
            width: 162rpx;
            background: url('@/static/shared/promotion/price_right.png') center no-repeat;
            background-size: auto 100%;
            margin-left: -32rpx;
        }
    }
    .origin_price{
        display: flex;
        align-items: center;
        height: 42rpx;
        font-size: 30rpx;
        color: #999;
        margin-left: 14rpx;
        margin-bottom: 4rpx;
    }
}
</style>
