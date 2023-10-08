<!-- 联盟秒杀商品组件：横向展示，一行一个，商品列表页面
    点击进入商品详情页
    加入购物车事件
-->
<template name="goodsItemH">
    <view class="billboard_wrap">
        <view class="goods_billboard_item_h flex_row_start_start" @click="goGoodsDetail(goods_info)">
            <view class="goods-img" :style="{backgroundImage: 'url('+goods_info.mainImage+')'}"></view>
            <view class="right">
                <view class="goodsInfo rightTop">
                    <view class="storeLogo"><img :src="goods_info.storeLogo" class="storeLogoImg"/></view>
                    <view class="goods-name">{{goods_info.skuName}}</view>
                </view>
                <view class="rightBottom flex_row_between_center">
                    <view class="goods-price">
                        <view class="left num-font">
                            <text class="unit">￥</text>
                            <text class="price_int">{{this.$getPartNumber(goods_info.salePrice,'int')}}</text>
                            <text class="price_decimal">{{this.$getPartNumber(goods_info.salePrice,'decimal')}}</text>
                        </view>
                        <view v-if="!!goods_info.seckillInfoVO" class="old_price num-font">￥{{$getPartNumber(goods_info.seckillInfoVO?goods_info.seckillInfoVO.seckillOriPrice:'','int')}}{{$getPartNumber(goods_info.seckillInfoVO?goods_info.seckillInfoVO.seckillOriPrice:'','decimal')}}</view>
                    </view>
                    <view class="buyButton">{{$L('去抢购')}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: "thumb-seckill-union",
    data() {
        return {
            
        }
    },
    props: {
        goods_info: {
            type: Object,
            value: {}
        }
    },
    methods: {
        //进入商品详情页
        goGoodsDetail(goodsItem) {
            try {
                let sku = goodsItem.sku;
                this.$Router.push({path: '/standard/product/detail', query: {sku}});
            } catch (error) {
                console.log("跳转到商品详情出错", error);
            }
        }
    }
}
</script>

<style lang='scss'>
    .billboard_wrap{
        position:relative;
        transition: all 0.3s;
        height: 280rpx;
        padding: 30rpx 30rpx 30rpx 20rpx;
        border-radius: 16rpx;
        background-color: #fff;
        background-size: 100% auto;
    }
    .goods_billboard_item_h {
        overflow: hidden;
        .goods-img {
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            width: 220rpx;
            height: 220rpx;
            overflow: hidden;
            border-radius: 16rpx;
            background-color: #F8F6F7;
            flex-shrink: 0;
        }

        .right {
            padding-left: 30rpx;
            height: 220rpx;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .goodsInfo{
            display: flex;
            justify-content: center;
            .goods-name {
                font-size: 30rpx;
                color: $mainnew-font-color;
                line-height: 120%;
                // height: 72rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                font-weight: bold;
                word-break:break-all;
                flex: 1;
            }
            .storeLogo{
                width:36rpx;
                height: 36rpx;
                margin-right: 10rpx;
                .storeLogoImg{
                    width: 36rpx;
                    height: 36rpx;
                }
            }
        }
        .goods-price {
            .left {
                color: var(--confirmBtnBgColor2);
                // font-weight: bold;
                align-items: baseline;
                .unit,
                .price_decimal {
                    font-size: 28rpx;
                }

                .price_int {
                    font-size: 44rpx;
                    line-height: 44rpx;
                }
            }
            .old_price{
                font-size: 24rpx;
                height: 28rpx;
                line-height: 28rpx;
                // font-weight: bold;
                text-decoration:  line-through;
                color: #999999;
            }
        }
        .buyButton{
            width: 160rpx;
            height: 68rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            font-size: 30rpx;
            color: #ffffff;
            border-radius: 34rpx;
            background: var(--activeTextBg);
            box-shadow: 0px 4rpx 8rpx 0px var(--activityBtnShadow);
        }
    }
</style>
