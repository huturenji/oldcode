<!-- 商品组件：横向展示，一行一个，商品大图比价列表
点击进入商品详情页
-->
<template name="goodsCollectItemH">
    <view class="goods_h_item_wrap">
        <view class="bigImg" @click="goGoodsDetail(goodsItem)">
            <imgThumb :showWatermark="false" :imgSrc="goodsItem.mainImage || ''" showThumbTips :noSale="judgeNoSale(goodsItem)" :borderRadius="borderRadius" />
        </view>
        <view class="contentWrap">
            <view class="goods_h_bigImg">
                <view class="right">
                    <view class="top flex_column_start_start">
                        <view class="goodsNameWrap">
                            <view class="goods-name">
                                <!-- 实惠icon -->
                                <tagIcon v-if="isShowJdLable(goodsItem)" /> 
                                {{ dealSkuName }}
                            </view>
                        </view>
                    </view>
                    
                    <activityTags :goods_info="goodsItem"></activityTags>

                    <block v-if="isShowJdLable(goodsItem)">
                        <discountPriceTag 
                            :showVsIcon="true" 
                            :supplierReferencePrice="goodsItem.supplierReferencePrice" 
                            :showPrice="dealPrice">
                        </discountPriceTag>
                    </block>
                        
                    <view class="bottom">
                        <view class="goods-price flex_column_center_start" v-if="!isShowJdLable(goodsItem)">
                            <view class="left flex_row_start_center">
                                <view class="left_price num-font">
                                    <text class="unit firstunit">￥</text>
                                    <text class="price_int firstprice_int">{{ getPartNumber(dealPrice, "int") }}</text>
                                    <text class="price_decimal firstprice_decimal">{{ getPartNumber(dealPrice, "decimal") }}</text>
                                </view>
                            </view>
                            <!-- <view class="net-price num-font" v-if="isShowJdLable(goodsItem)">
                                京东到手价 <text> ¥{{getPartNumber(goodsItem.supplierReferencePrice,'int')}}{{getPartNumber(goodsItem.supplierReferencePrice,'decimal')}}</text>
                            </view> -->
                        </view>
                        <view class="flex_row_start_center goodsStore goods_store_nochart">
                            <view  class="supplier-wrapper">
                                <!-- <image class="store-logo" :src="goodsItem.storeLogo" /> -->
                                <text class="store-name">{{ goodsItem.storeName }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import { getPartNumber, isNotEmpty } from '@/utils/common';
import imgThumb from '@/common/components/thumb/imgThumb.vue';
import tagIcon from '@/common/components/tagIcon';
import discountPriceTag from '@/common/components/thumb-goods-tags/discount-price-tag.vue';
import activityTags from '@/common/components/thumb-goods-tags/activity-tags.vue';
import goodsHandler from "@/views/components/goods/handler.js";
import activityMinxin from './minxin/activity.js'

export default {
    name: "thumb-decorate-big-h",
    components: {
        imgThumb,
        tagIcon,
        discountPriceTag,
        activityTags
    },
    mixins:[activityMinxin],
    data() {
        return {
            getPartNumber
        };
    },
    props: {
        goodsItem: {
            type: Object,
            default: () => {}
        },
        borderRadius: {
            type: [Number, String],
            default: 0
        }
    },
    mounted() {
        
    },
    computed: {
        dealPrice() {
            let price = this.goodsItem.salePrice;
            let promotionPrice = this.goodsItem.promotionPrice;
            if(isNotEmpty(promotionPrice) && !!this.goodsItem.promotionStarted){
                price = promotionPrice;
            }
            return price;
        },
        dealSkuName() {
            let skuName = "";
            skuName = this.goodsItem.skuName;
            return skuName;
        },
        dealMainImage() {
            let mainImage = "";
            // todo 兼容旧商品图片 优先级 新-旧-原商品图片
            if (this.goodsItem) {
                mainImage = this.goodsItem.uploadImage || this.goodsItem.uploadmage || this.goodsItem.mainImage;
            }
            return mainImage;
        }
    },
    methods: {
        //进入商品详情页
        goGoodsDetail({ sku, storeId, mainImage }) {
          try {
                this.$Router.push({
                    path: '/views/goods/detail/index',
                    query: {
                        sku, 
                        storeId, 
                        mainImage
                    }
                });
            } catch (error) {
                console.log("跳转到商品详情出错", error);
            }
        },
        isShowJdLable(goods) {
            return goodsHandler.isShowJdLable(goods);
        }
    }
};
</script>

<style lang='scss' scoped>
.goods_h_item_wrap {
    margin-top: 30rpx;
    background: #fff;
    border-radius: 16rpx;
    width: 100%;
    ::v-deep .u-wrap {
        background-position: center center !important;
    }
    .bigImg {
        position: relative;
        max-height: 1000rpx;
        min-height: 600rpx;
        margin-bottom: -80rpx;
        overflow: hidden;

        &:before{
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/goods-watermark-big.png") left top no-repeat;
            background-size: 100%;
            z-index: 1;
        }

        ::v-deep .u-lazy-item {
            border-radius: 16rpx 16rpx 0 0 !important;
        }

        ::v-deep .imgThumb_container .mask{
            bottom: 80rpx;
        }
    }
}
.contentWrap {
    position: relative;
    background-color: rgba(255, 255, 255,0.4);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    padding-bottom: 40rpx;
    border-radius: 0 0 16rpx 16rpx;
    overflow: hidden;
    z-index: 1;
    &.pad20 {
        padding-bottom: 20rpx;
    }
    .goods_h_bigImg {
        padding: 0 30rpx 0;
        display: flex;
        position: relative;

        .firstunit {
            color: #f30300;
            font-size: 28rpx;
        }
        .firstprice_int {
            color: #f30300;
            font-size: 40rpx;
        }
        .firstprice_decimal {
            color: #f30300;
            font-size: 28rpx;
        }

        .right {
            flex: 1;
        }

        .goodsNameWrap {
            height: 76rpx;
            word-break: break-all;
        }
        .goods-name {
            font-size: 28rpx;
            color: #222;
            line-height: 76rpx;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            word-break: break-all;
            font-weight: bold;
            &.goods_name_nochart{
                line-height: unset;
                margin-top: 22rpx;
            }
        }

        .bottom {
            display: flex;
            align-items: flex-end;   
            justify-content: space-between;
        }

        .supplier-wrapper {
            margin-top: 8rpx;
            display: flex;
            align-items: center;

            &>.store-logo {
                width: 16px;
                height: 16px;
                margin-right: 10px;
            }

            &>.store-name {
                height: 34rpx;
                font-size: 24rpx;
                font-weight: 400;
                text-align: justify;
                color: #999;
                line-height: 34rpx;
            }
        }
    }
}

@media screen and (min-width: 550px) {
    ::v-deep ::-webkit-scrollbar {
        height: 4px !important;
        display: inline-block !important;
    }

    ::v-deep ::-webkit-scrollbar-thumb {
        border-radius: 10px !important;
        background: #ccc !important;
    }

    ::v-deep ::-webkit-scrollbar-track {
        border-radius: 10px !important;
        background: rgba(0, 0, 0, 0.1) !important;
    }
}
</style>
