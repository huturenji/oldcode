<!-- 商品组件：横向展示，一行一个，商品列表页面
    点击进入商品详情页
    加入购物车事件
-->
<template name="goodsCollectItemH">
    <view class="goods_h_item flex_row_start_start" @click="goGoodsDetail(goods_info)">
        <view class="goods-img" :style="{backgroundImage: 'url('+(goods_info.mainImage)+')'}"></view>
        <view class="right flex_column_between_start">
            <view class="top flex_column_start_start" style="width: 100%;">
                <view class="goodsNameWrap">
                    <view class="goods-name" v-html="goods_info.skuName">
                    </view>
                </view>
                <text class="goods-brief">{{goods_info.goodsBrief}}</text>
            </view>
            <view class="activity_con" v-if="goods_info.activityList&&goods_info.activityList.length>0 && activityShow">
                <block v-for="(item,index) in goods_info.activityList" :key="index">
                    <view class="act_label ladder_group" v-if="item.promotionType==105">
                        {{item.promotionName}}
                    </view>
                    <view class="act_label discounts"
                        v-if="item.promotionType==201||item.promotionType==202||item.promotionType==203||item.promotionType==204">
                        {{item.promotionName}}
                    </view>

                    <view class="act_label secKill" v-if="item.promotionType==104">
                        {{item.promotionName}}
                    </view>

                    <view class="act_label preSale" v-if="item.promotionType==103">
                        {{item.promotionName}}
                    </view>

                    <view class="act_label spellGroup" v-if="item.promotionType==102">
                        {{item.promotionName}}
                    </view>
                </block>
            </view>
            
            <view class="bottom flex_column_start_between">
                <view class="goods-price flex_row_start_center">
                    <view class="left flex_row_start_center">
                        <view class="left_price num-font" :style="{ color: priceColor }">
                            <text class="unit">￥</text>
                            <text class="price_int">{{$getPartNumber(goods_info.salePrice,'int')}}</text>
                            <text class="price_decimal">{{$getPartNumber(goods_info.salePrice,'decimal')}}</text>
                        </view>
                    </view>
                </view>
                <view class="store_enter flex_row_center_center">
                    <view class="storeImg" v-if="showStoreIcon">
                        <view class="ownStoreLogo" v-if="goods_info.storeId=='6'"></view>
                        <img :src="goods_info.storeLogo" alt="" v-else>
                    </view>
                    <text class="stroe_name">{{goods_info.storeName}}</text>
                </view>
            </view>
            <slot name="right" />
        </view>
    </view>
</template>

<script>

export default {
    name: "thumb-goods-h",
    components: {
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
        }
    },
    props: {
        goods_info: {
            type: Object,
            value: {}
        },
        showStoreIcon: {
            type: Boolean,
            default: false
        },
        activityShow: {
            type: Boolean,
            default: true
        },
        priceColor: {
            type: String,
            default: 'ff4e3a'
        }
    },
    created() {

    },
    methods: {
        //进入商品详情页
        goGoodsDetail(goods_info) {
            this.$Router.push({
                path: '/standard/product/detail',
                query: {
                    sku: goods_info.sku
                }
            })
        }

    }
}
</script>

<style lang='scss'>
    .goods_h_item {
        width: 100%;
        background: #fff;
        padding: 32rpx 26rpx 32rpx 21rpx;
        overflow: hidden;
        background: #fff;
        border-top: 1rpx solid #f5f5f5;
        display: flex;
        min-height: 272rpx;
        max-height: 330rpx;
        align-items: center;
        /* &:first-child {
            padding-top: 20rpx;
        } */

        .goods-img {
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            width: 206rpx;
            height: 206rpx;
            overflow: hidden;
            border-radius: 16rpx;
            background-color: #F8F6F7;
            flex-shrink: 0;
        }

        .right {
            min-height: 208rpx;
            flex: 1;
            padding-left: 25rpx;
            position: relative;
        }
        .goodsNameWrap{
            max-height: 0.76rem;
            overflow: hidden;
        }
        .goods-name {
            font-size: 28rpx;
            color: #333333;
            line-height: 135%;
            height: 100rpx;
            font-weight: 400;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
            font-weight: bold;
            .highlight{
                color: red;
            }
        }

        .goods-brief {
            color: $main-third-color;
            font-size: 22rpx;
            margin-top: 10rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
        }

        .goods-price {
            width: 100%;

            .left {
                color: var(--confirmBtnBgColor2);
            
                
                .unit{
                    font-size: 30rpx;
                    letter-spacing: -2px;
                    font-weight: normal;
                }

                .price_int,
                .price_decimal {
                    font-size: 40rpx;
                    font-weight: normal;
                }

                .sales {
                    color: $main-third-color;
                    font-size: 22rpx;
                    margin-left: 26rpx;
                    margin-top: 2rpx;
                }
            }

            image {
                width: 42rpx;
                height: 42rpx;
            }
        }
    }

    .activity_con {
        display: flex;
        font-size: 22rpx;
        color: #ffffff;

        .act_label {
            padding: 2rpx 8rpx;
            border: 2rpx solid $main-color;
            border-radius: 6rpx;
            color: $main-color;
            font-size: 20rpx;
            margin-right: 12rpx;
        }

        .ladder_group {
            
        }

        .discounts {
            
        }

        .secKill {
            
        }

        .preSale {
            
        }

        .spellGroup {
            
        }

    }

    .store_enter {
        display: flex;
        font-size: 26rpx;
        align-items: center;
        height: 60rpx;
        line-height: 60rpx;
    }

    .storeImg img {
        width: 36rpx;
        height: 36rpx;
        vertical-align: top;
        margin-top: 12rpx;
        margin-right: 8rpx;
    }
    .storeImg .ownStoreLogo {
        width: 36rpx;
        height: 36rpx;
        margin-top: 12rpx;
        margin-right: 8rpx;
        background: var(--storeLogo);
        background-size: 100% 100%;
    }

    .stroe_name {
        max-width: 400rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #333333;
    }

    .store_enter_btn {
        color: #333333;
        font-weight: bold;
        margin-left: 10rpx;

    }

    .store_enter_image {
        width: 11rpx;
        height: 19rpx;
        margin-left: 10rpx;
    }
    

</style>
