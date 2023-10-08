<!-- 巨拾惠折扣专区item组件
-->
<template name="goodsItem">
    <view class="thumb-normal-small" v-if="goodsItem">
        <view class="item flex_column_center_center" @click="goGoodsDetail(goodsItem)">
            <view class="goods-img">
                <imgThumb :imgSrc="goodsItem.mainImage" :noSale="judgeNoSale(goodsItem)" :showThumbTips="showThumbTips"/>
            </view>
            <view class="desc">
                <view class="top">
                    <text class="goods-name">
                        <discount-tag :type="goodsItem.tags && goodsItem.tags[0]" source="list" v-if="isShowJdLable(goodsItem)" />
                        {{goodsItem.skuName}}
                    </text>
                </view>
                <view class="bottom flex_row_between_center" :class="{flex_end:!goodsItem.salePrice}">
                        <view class="sale_price num-font" v-show="goodsItem.salePrice">
                            <text>¥</text>
                            <text class="big_price">{{$getPartNumber(goodsItem.salePrice,'int')}}</text>
                            <text class="small_price">{{$getPartNumber(goodsItem.salePrice,'decimal')}}</text>
                    </view>
                    <view class="btn flex_row_center_center">购买</view>
                </view>
                <!-- 京东到手价 -->
                <view class="net-price num-font" v-if="isShowJdLable(goodsItem)">
                    京东到手价 <text> ¥{{ $getPartNumber(goodsItem.supplierReferencePrice, "int") }}{{ $getPartNumber(goodsItem.supplierReferencePrice, "decimal") }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import imgThumb from "@/components/goods/thumb/imgThumb.vue";
import discountTag from '@/components/goods/discountTag.vue'
import activityMinxin from './minxin/activity.js'
import goodsHandler from '@/components/goods/handler';
export default {
    name: 'thumb-normal-small',
    props: {
        // 商品列表数据
        goodsItem:{
            type: Object,
            default:()=>{}
        }
    },
    mixins:[activityMinxin],
    components: {
        imgThumb,
        discountTag
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
        },

        isShowJdLable(goods){
            return goodsHandler.isShowJdLable(goods)
        }
    }
}
</script>

<style lang='scss' scoped>
.thumb-normal-small{
    width: 100%;
}
.item{
    width: 100%;
    border-radius: 16rpx;
    overflow: hidden;
    background: #fff;
    .goods-img {
        width: 100%;
        min-height: 280rpx;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        overflow: hidden;
        background-color: #F8F6F7;
        flex-shrink: 0;
    }
    .desc{
        width: 100%;
        padding: 16rpx 0 28rpx 20rpx;
        .top {
            padding-right: 20rpx;
        }
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
                width: 108rpx;
                height: 56rpx;
                font-size: 28rpx;
                font-weight: bold;
                color: #ffffff;
                background: var(--tagColor);
                border-radius: 200rpx 0px 0px 200rpx;
                box-shadow: 6rpx 10rpx 20rpx var(--activityBtnShadow);
            }
            &.flex_end {
                justify-content: flex-end;
            }
        }
        .net-price {
            margin-top: 6rpx;
        }
    }
}
</style>
