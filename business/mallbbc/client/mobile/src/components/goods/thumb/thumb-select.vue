<!-- 巨拾惠帮我选item组件,暂时没用
-->
<template name="goodsItem">
    <view class="thumb-select" v-if="goodsItem">
        <view class="item flex_column_center_center" @click="goGoodsDetail(goodsItem)">
            <view class="goods-img">
                <imgThumb :imgSrc="goodsItem.mainImage" :noSale="judgeNoSale(goodsItem)" :showThumbTips="showThumbTips"/>
            </view>
            <view class="desc">
                <view class="top">
                    <text class="goods-name">{{goodsItem.skuName}}</text>
                </view>
                <view class="bottom flex_row_between_start" :class="{flex_end:!goodsItem.salePrice}">
                    <view class="sale_price num-font" v-if="goodsItem.salePrice">
                        <text>¥</text>
                        <text class="big_price">{{$getPartNumber(goodsItem.salePrice,'int')}}</text>
                        <text class="small_price">{{$getPartNumber(goodsItem.salePrice,'decimal')}}</text>
                    </view>
                    <view class="btn flex_row_center_center">购买</view>
                </view>
                
            </view>
        </view>
    </view>
</template>

<script>
import imgThumb from "@/components/goods/thumb/imgThumb.vue";
import activityMinxin from './minxin/activity.js'
export default {
    name: 'thumb-select',
    props: {
        // 商品列表数据
        goodsItem:{
            type: Object,
            default:()=>{}
        }
    },
    mixins:[activityMinxin],
    components: {
        imgThumb
    },
    data() {
        return {
            
        }
    },
    computed: {
        
    },
    mounted() {

    },
    methods: {
        //进入商品详情页
        goGoodsDetail(goodsItem) {
            try {
                let sku = goodsItem.sku;
                this.$Router.push({
                    path: '/standard/product/detail',
                    query: {
                        sku
                    }
                });
            } catch (error) {
                console.log("跳转到商品详情出错", error);
            }
        } 
    }
}
</script>

<style lang='scss' scoped>
.thumb-select{
    width: 100%;
}
.item{
    width: 100%;
    border-radius: 16rpx;
    overflow: hidden;
    background: #fff;
    .goods-img {
        width: 100%;
        height: auto;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        overflow: hidden;
        background-color: #F8F6F7;
        flex-shrink: 0;
    }
    .desc{
        width: 100%;
        padding: 16rpx 28rpx 36rpx;
        .goods-name {
            font-size: 28rpx;
            color: $mainnew-font-color;
            line-height: 136%;
            min-height: 76rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-weight: bold;
            word-break:break-all;
        }
        .bottom{
            padding-top: 56rpx;
            .sale_price {
                font-size: 28rpx;
                color: #222222;
                .big_price {
                    font-size: 40rpx;
                }
            }
            .btn {
                width: 120rpx;
                height: 56rpx;
                font-size: 28rpx;
                font-weight: bold;
                color: #ffffff;
                background: var(--tagColor);
                border-radius: 8rpx;
                box-shadow: 6rpx 10rpx 20rpx var(--activityBtnShadow);
            }
            &.flex_end {
                justify-content: flex-end;
            }
        }
    }
}
</style>
