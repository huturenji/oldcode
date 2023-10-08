<!-- 商品卡片页 -->
<template>
    <view class="goods-box" @click="goDetail">
        <!-- 横向 -->
        <view class="left-part">
            <imgThumb :imgSrc="goods.mainImage||''" showThumbTips :noSale="judgeNoSale(goods)" :borderRadius="borderRadius" />
        </view>
        <view class="right-part">
            <view class="sku-name text-ellipsis">
                <!-- 实惠icon -->
                <tagIcon v-if="isShowJdLable" :iconArr="['discount']" />
                <text>{{goods.skuName}}</text>
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
                <view v-else class="price-wrapper num-font" :class="{promotion: isShowActivity}">
                    <text>￥</text>
                    <text class="int">{{ getPartNumber(goods.salePrice, 'int') }}</text>
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

                <view class="supplier-wrapper">
                    <!-- <image class="store-logo" :src="goods.storeLogo" /> -->
                    <text class="store-name">{{goods.storeName}}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { getPartNumber, isNotEmpty, accSub } from '@/utils/common';
import imgThumb from '@/common/components/thumb/imgThumb.vue';
import tagIcon from '@/common/components/tagIcon';
// import logisticsIcon from '@/common/components/thumb-goods-tags/logistics-icon.vue';
import discountPriceTag from '@/common/components/thumb-goods-tags/discount-price-tag.vue';
import activityTags from '@/common/components/thumb-goods-tags/activity-tags.vue';
import activityMinxin from './minxin/activity.js'
import goodsHandler from "@/views/components/goods/handler.js";

export default {
    name: 'thumb-goods',
    components: {
        imgThumb,
        tagIcon,
        // logisticsIcon,
        discountPriceTag,
        activityTags
    },
    mixins:[activityMinxin],
    data() {
        return {
            getPartNumber
        }
    },
    props: {
        goods: {
            type: Object,
            default: () => {}
        },
        borderRadius: {
            type: [Number, String],
            default: 0
        }
    },
    mounted(){},
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
        goDetail() {
            const { sku, storeId, mainImage } = this.goods;
            this.$Router.push({
                path: '/views/goods/detail/index',
                query: {
                    sku, 
                    storeId, 
                    mainImage
                }
            })
        },
        // isShowJdLable(goods) {
        //     return goodsHandler.isShowJdLable(goods);
        // },
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
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
}


.goods-box {
    overflow: hidden;
    border-radius: 16rpx;
    transform: translateY(0);
    padding: 20rpx 0px 20rpx 20rpx;
    width: 100%;
    display: flex;
    margin-bottom: 20rpx;
    background-color: #fff;
    
    .left-part {
        width: 204rpx;
        height: 204rpx;
        margin-right: 20rpx;
        border-radius: 12rpx;
        .main-image {
          width: 204rpx;
          height: 204rpx;
          border-radius: 12rpx;
        }
    }

    .right-part {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      padding-right: 28rpx;
      .gosale{
        position: absolute;
        right: -20rpx;
        bottom: -20rpx;
        width: 160rpx;
        height: 96rpx;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/bgprice.png') no-repeat;
        background-size: 100% auto;
        font-size: 28rpx;
        color: #fff;
        text{
            position: absolute;
            font-weight: bold;
            left: 42rpx;
            top: 17rpx;      
        }
      }
      .sku-name {
          color: #222222;
          font-size: 28rpx;
          font-weight: bold;
      }

      .price-wrapper {
        overflow: hidden;
        font-size: 28rpx;
        color: #222222;
        &.promotion {
            color: #f30300;
        }
        .int{
            font-size: 40rpx;
        }
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
</style>
