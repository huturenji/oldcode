<!-- 商品卡片页 -->
<template>
    <view class="goods-box" @click="viewGoodsDetail">
        <!-- 瀑布流 -->
        <block v-if="type == 'masonry'">
            <view class="goods-masonry">
                <view class="upper-part">
                    <imgThumb class="main-image" :imgSrc="goods.mainImage" />
                </view>
                <view class="next-part">
                    <view v-if="goods.skuName" class="sku-name text-ellipsis">
                        <!-- 实惠icon -->
                        <tagIcon v-if="isShowJdLable" />
                        {{ goods.skuName }}
                    </view>

                    <activityTags :goods_info="goods"></activityTags>
                    <!-- 价格 -->
                    <!-- 京东到手价 -->
                    <block v-if="isShowJdLable">
                        <discountPriceTag 
                            :showVsIcon="false" 
                            :supplierReferencePrice="goods.supplierReferencePrice" 
                            :showPrice="goods.salePrice">
                        </discountPriceTag>
                    </block>
                    <view v-else class="price-wrapper onsale-price-style num-font" :class="{promotion: isShowActivity}">
                        <text>￥</text>
                        <text>{{ getPartNumber(goods.salePrice, 'int') }}</text>
                        <text>{{ getPartNumber(goods.salePrice, 'decimal') }}</text>
                        <view class="promotion_sheng" v-if="isShowActivity">
                            <img src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_sousuo_jiangjia.svg" alt="">
                            降 ¥{{ Number(accSub(goods.originalSalePrice, goods.salePrice)).toFixed(2) }}
                        </view>
                    </view>

                    <view
                        class="price_after_seckill"
                        v-if="isShowActivity"
                    >
                        <text class="price_content num-font">
                            ¥{{ getPartNumber(goods.originalSalePrice, "int") }}{{ getPartNumber(goods.originalSalePrice, "decimal") }}
                        </text>
                    </view>
                    
                    <!-- 物流标签 -->
                    <!-- <logisticsIcon 
                        :showJdLogistics="isJdLogistics"
                    >
                    </logisticsIcon> -->
                    

                    <view class="supplier-wrapper">
                        <text class="store-name">{{ goods.storeName }}</text>
                    </view>
                    <view class="supplier-wrapper" v-if="false">
                        <image class="store-logo" :src="goods.storeLogo" />
                    </view>
                </view>
            </view>

        </block>
        <!-- 横向 -->
        <block v-if="type == 'horizontal'">
            <view class="goods-horizontal">
                <view class="left-part">
                    <imgThumb class="main-image" :imgSrc="goods.mainImage" />
                </view>
                <view class="right-part">
                    <view v-if="goods.skuName" class="sku-name text-ellipsis">
                        <tagIcon v-if="isShowJdLable" />
                        {{ goods.skuName }}
                    </view>
                    <view>
                        <activityTags :goods_info="goods"></activityTags>
                        <!-- 京东到手价 -->
                        <block v-if="isShowJdLable">
                            <discountPriceTag 
                                :showVsIcon="true" 
                                :supplierReferencePrice="goods.supplierReferencePrice" 
                                :showPrice="goods.salePrice">
                            </discountPriceTag>
                        </block>
                        <view v-else class="price-wrapper onsale-price-style num-font" :class="{promotion: isShowActivity}">
                            <text>￥</text>
                            <text>{{ getPartNumber(goods.salePrice, 'int') }}</text>
                            <text>{{ getPartNumber(goods.salePrice, 'decimal') }}</text>
                            <view class="promotion_sheng" v-if="isShowActivity">
                                <img src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_sousuo_jiangjia.svg" alt="">
                                降 ¥{{ Number(accSub(goods.originalSalePrice, goods.salePrice)).toFixed(2) }}
                            </view>
                        </view>

                        <view
                            class="price_after_seckill"
                            v-if="isShowActivity"
                        >
                            <text class="price_content num-font">
                                ¥{{ getPartNumber(goods.originalSalePrice, "int") }}{{ getPartNumber(goods.originalSalePrice, "decimal") }}
                            </text>
                        </view>
                        <!-- 物流标签 -->
                        <!-- <logisticsIcon 
                            :showJdLogistics="isJdLogistics" 
                        >
                        </logisticsIcon> -->
                        <view class="supplier-wrapper">
                            <text class="store-name">{{ goods.storeName }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </block>
    </view>
</template>

<script>
import { getPartNumber, isNotEmpty, accSub } from '@/utils/common';
import tagIcon from '@/common/components/tagIcon';
// import logisticsIcon from '@/common/components/thumb-goods-tags/logistics-icon.vue';
import discountPriceTag from '@/common/components/thumb-goods-tags/discount-price-tag.vue';
import activityTags from '@/common/components/thumb-goods-tags/activity-tags.vue';
import imgThumb from "@/common/components/thumb/imgThumb.vue";
import goodsHandler from "@/views/components/goods/handler.js";
import activityMinxin from '@/common/components/thumb/minxin/activity.js'

export default {
    name: 'thumb-goods',
    mixins:[activityMinxin],
    data() {
        return {
            getPartNumber,
            defaultLogo: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_logo_jingdongqiyegou_bnj.svg'
        }
    },
    components: {
        tagIcon,
        imgThumb,
        // logisticsIcon,
        discountPriceTag,
        activityTags
    },
    props: {
        goods: {
            type: Object,
            default: () => { }
        },

        type: {
            type: String,
            default: 'masonry'
        }
    },
    computed: {      
        isShowJdLable() {
            return goodsHandler.isShowJdLable(this.goods);
        },

        isJdLogistics() {
            return goodsHandler.isJdLogistics(this.goods);
        },

        isShowActivity() {
            return this.acitivityType(this.goods.activityList) && this.ifStarted
        }
    },
    methods: {
        accSub,
        viewGoodsDetail() {
            const { mainImage, sku, storeId } =  this.goods
            this.$Router.push({
                path: '/views/goods/detail/index',
                query: {
                    sku,
                    storeId,
                    mainImage
                }
            })
        }
    },
    watch:{
        'goods.activityList':{
            handler(val){
                if (val){
                    const sckillInfo = val.filter(item=>[104, 106, 107].includes(item.promotionType));
                    if (sckillInfo.length > 0){
                        let seckillSeconds = this.calcRemainingSeconds(sckillInfo[0].startTime,sckillInfo[0].endTime);
                    }
                }
            },
            immediate:true
        }
    }

}
</script>

<style lang="scss" scoped>
.text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
}

.onsale-price-style {
    &.promotion {
        &>text {
            color: #f30300;
        }
    }

    &>text {
        color: #222222;
    }

    &>text:nth-child(1) {
        font-size: 28rpx;
    }

    &>text:nth-child(2) {
        font-size: 40rpx;
    }

    &>text:nth-child(3) {
        font-size: 28rpx;
    }
}


.goods-box {
    overflow: hidden;
    background: #ffffff;
    box-shadow: -1px 0px 20px -2px rgba(156, 159, 169, 0.10);
    border-radius: 10px;
    transform: translateY(0);
    .goods-masonry {
        .upper-part {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 150px;

            .main-image {
                width: 100%;
            }
        }

        .next-part {
            padding: 24rpx 20rpx;
            .sku-name {
                color: #222222;
                font-size: 28rpx;
                font-weight: bold;
            }

            .price-wrapper {
                margin-top: 16rpx;
                line-height: 34rpx;
                text-align: left;
                .promotion_sheng {
                    position: relative;
                    display: inline-block;
                    height: 32rpx;
                    line-height: 32rpx;
                    background-color: #f30300;
                    white-space: nowrap;
                    font-size: 22rpx;
                    color: #fff;
                    padding: 0 6rpx 0 20rpx;
                    margin-left: 12rpx;
                    border-radius: 0 6rpx 6rpx 0;

                    img {
                        position: absolute;
                        width: 28rpx;
                        height: 36rpx;
                        top: -4rpx;
                        left: -6rpx;
                    }
                }
            }

            .price_after_seckill {
                .price_content {
                font-size: 24rpx;
                color: #a4acb2;
                text-decoration: line-through;
                }
            }

            .supplier-wrapper {
                display: flex;
                align-items: center;
                margin-top: 8rpx;
                &>.store-logo {
                    width: 32rpx;
                    height: 32rpx;
                    margin-right: 20rpx;
                }
            }
        }
    }

    .goods-horizontal {
        display: flex;
        margin: 14px 15px;

        .left-part {
            margin-right: 12px;
            .main-image {
                width: 120px;
                height: 120px;
            }
        }

        .right-part {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .sku-name {
                color: #222222;
                font-size: 28rpx;
                font-weight: bold;
            }

            .price-wrapper {
                line-height: 17x;
                text-align: left;
                .promotion_sheng {
                    position: relative;
                    display: inline-block;
                    height: 32rpx;
                    line-height: 32rpx;
                    background-color: #f30300;
                    white-space: nowrap;
                    font-size: 22rpx;
                    color: #fff;
                    padding: 0 6rpx 0 20rpx;
                    margin-left: 12rpx;
                    border-radius: 0 6rpx 6rpx 0;

                    img {
                        position: absolute;
                        width: 28rpx;
                        height: 36rpx;
                        top: -4rpx;
                        left: -6rpx;
                    }
                }
            }

            .price_after_seckill {
                .price_content {
                font-size: 24rpx;
                color: #a4acb2;
                text-decoration: line-through;
                }
            }

            .supplier-wrapper {
                display: flex;
                align-items: center;
                margin-top: 8rpx;
                &>.store-logo {
                    width: 34rpx;
                    height: 34rpx;
                    margin-right: 20rpx;
                }
            }
        }
    }
}
.store-name {
    height: 34rpx;
    font-size: 24rpx;
    font-weight: 400;
    text-align: justify;
    color: #999;
    line-height: 34rpx;
}
.net-price {
    margin: 0 0 8rpx;
}
</style>
