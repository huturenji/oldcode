<!-- 商品组件：横向展示，一行一个，商品列表页面
点击进入商品详情页
加入购物车事件
-->
<template name="goodsCollectItemH">
  <view
    class="goods_h_item flex_row_start_start"
    @click="goGoodsDetail(goods_info, 0)"
  >
    <view class="goods-img">
      <imgThumb :imgSrc="goods_info.mainImage" :noSale="judgeNoSale(goods_info)" :showThumbTips="showThumbTips" />
    </view>
    <view class="right">
      <view class="flex_column_start_start">
        <view class="goodsNameWrap">
          <view class="goods-name">
            <discount-tag :type="goods_info.tags && goods_info.tags[0]" source="list" v-if="isShowJdLable(goods_info)"/>
            {{ goods_info.skuName }}
          </view>
        </view>
      </view>
      <template>
        <view v-if="!!dealPrice">
          <view
            class="activity_con"
            v-if="goods_info.activityList && goods_info.activityList.length > 0"
          >
            <block v-for="(item, index) in goods_info.activityList" :key="index">
              <view
                class="act_label ladder_group"
                v-if="item.promotionType == 105"
              >
                {{ item.promotionName }}
              </view>

              <!-- 满优惠 -->
              <view
                class="discount-label num-font"
                v-if="
                  item.promotionType == 201 || 
                  item.promotionType == 202 ||
                  item.promotionType == 203 ||
                  item.promotionType == 204
                "
              >
                {{ getDiscountContent(item.promotionType,item.descriptionList) }}
              </view>
              <!-- 活动标签 -->
              <view class="activeLabelWrap" v-if="item.promotionType == 104 || item.promotionType == 106 || item.promotionType == 107">
                  <activeLabel :promotionType="item.promotionType" :activeName="item.promotionName" :startTime="item.startTime" :endTime="item.endTime" ></activeLabel>
              </view>

              <view class="act_label preSale" v-if="item.promotionType == 103">
                {{ item.promotionName }}
              </view>

              <view
                class="act_label spellGroup"
                v-if="item.promotionType == 102"
              >
                {{ item.promotionName }}
              </view>
            </block>
          </view>

          <!-- 非侧边导航栏内使用新样式 -->
          <template v-if="!isInOffcanvas">
            <!-- 价格区域 -->
            <view
              class="bottom flex_column_start_between"
              :style="{ marginTop: (activityList && activityList.length > 0) ? '0' : '72rpx' }"
            >
              <!-- 实惠价格区域 -->
              <view class="price_sh_container" v-if="isShowJdLable(goods_info)">
                <!-- 京东到手价 -->
                <view class="net_price num-font">
                  <img :src="imgUrl + 'goods/vs.svg'" alt="">
                  京东到手价
                  <text> ¥{{ $getPartNumber(goods_info.supplierReferencePrice, "int") }}{{ $getPartNumber(goods_info.supplierReferencePrice, "decimal") }}</text>
                </view>
                <view class="goods_price">
                  <text class="price_title">实惠价</text>
                  <text class="unit">￥</text>
                  <text class="price_int">{{ $getPartNumber(dealPrice, "int") }}</text>
                  <text class="price_decimal">{{ $getPartNumber(dealPrice, "decimal") }}</text>
                </view>
                <view :class="{ 'price_sheng': true, 'filled': shPrice.length > 5 }">
                  <text class="unit">￥</text>
                  <text class="price_int">{{ $getPartNumber(shPrice, "int") }}</text>
                  <text class="price_decimal">{{ $getPartNumber(shPrice, "decimal") }}</text>
                </view>
              </view>
              <!-- 非实惠价格区域 -->
              <view class="price_container" v-if="!isShowJdLable(goods_info)">
                <view :class="{'goods_price': true, 'promotion': acitivityType(goods_info.activityList) && ifStarted }">
                  <text v-if="promotionMap[acitivityType(goods_info.activityList)] && ifStarted" class="price_title">
                    {{ promotionMap[acitivityType(goods_info.activityList)] }}
                  </text>
                  <text class="unit">￥</text>
                  <text class="price_int">{{ $getPartNumber(dealPrice, "int") }}</text>
                  <text class="price_decimal">{{ $getPartNumber(dealPrice, "decimal") }}</text>

                  <text class="promotion_sheng" v-if="acitivityType(goods_info.activityList) && ifStarted">
                    <img :src="imgUrl + 'goods/icon_sousuo_jiangjia.svg'" alt="">
                    降 ¥{{ Number(accSub(goods_info.originalSalePrice, goods_info.salePrice)).toFixed(2) }}
                  </text>
                </view>
                <!--活动前价显示-->
                <view
                  class="price_after_seckill"
                  v-if="acitivityType(goods_info.activityList) && ifStarted"
                >
                  <text class="price_content num-font">
                    ¥{{ $getPartNumber(goods_info.originalSalePrice, "int") }}{{ $getPartNumber(goods_info.originalSalePrice, "decimal") }}
                  </text>
                </view>
              </view>
            </view>

            <!-- 京东物流 -->
            <view class="service_con" v-if="goods_info.jdLogistics === 1 && false">
              <view class="jd_logistics">
                <view>
                  <img :src="imgUrl + 'goods/icon_xq_feiji.svg'" />
                </view>
                京东物流
              </view>
            </view>
          </template>

          <!-- 侧边导航栏内使用旧样式 -->
          <template v-if="isInOffcanvas">
            <view
              class="bottom flex_column_start_between goodsPrice"
              :style="{ marginTop: (activityList && activityList.length > 0) ? '0' : '72rpx' }"
            >
              <view class="goodsPrice flex_column_center_start">
                <view class="left flex_row_start_center">
                  <view class="left_price num-font">
                    <text class="unit firstunit">￥</text>
                    <text class="price_int firstprice_int">{{ $getPartNumber(dealPrice, "int") }}</text>
                    <text class="price_decimal firstprice_decimal">{{ $getPartNumber(dealPrice, "decimal") }}</text>
                    <text v-if="acitivityType(goods_info.activityList) && ifStarted" class="price_title">{{`(${promotionMap[acitivityType(goods_info.activityList)]})`}}</text>
                  </view>
                </view>
                <!-- 京东到手价 -->
                <view class="net-price num-font" v-if="isShowJdLable(goods_info)">
                    京东到手价 
                    <text> ¥{{ $getPartNumber(goods_info.supplierReferencePrice, "int") }}{{ $getPartNumber(goods_info.supplierReferencePrice, "decimal") }}</text>
                </view>
              </view>

              <!--秒杀前价显示-->
              <view
                class="price_after_seckill"
                v-if="acitivityType(goods_info.activityList) && ifStarted"
              >
                <text class="price_content num-font">
                  ¥{{ $getPartNumber(goods_info.originalSalePrice, "int") }}{{ $getPartNumber(goods_info.originalSalePrice, "decimal") }}
                </text>
              </view>
            </view>
          </template>
          
          <!-- 店铺名称 -->
          <view class="goodsStore">{{ goods_info.storeName }}</view>
        </view>
        <!-- 骨架图 -->
        <view v-else>
          <view class="first-animated-background animated-price"></view>
          <view class="animated-background animated-storeLogo"></view>
          <view class="animated-background animated-storeLogo"></view>
        </view>
      </template>
    </view>
  </view>
</template>

<script>
import activeLabel from "@/components/activeLabel/activeLabel.vue"
import imgThumb from "@/components/goods/thumb/imgThumb.vue";
import discountTag from '@/components/goods/discountTag.vue'
import { repeatArray, accSub } from "@/utils/common.js";
import activityMinxin from './minxin/activity.js'
import goodsHandler from '@/components/goods/handler';
export default {
    name: "thumb-union-bijia-h",
    components: {
        imgThumb,
        activeLabel,
        discountTag
    },
    mixins:[activityMinxin],
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            accSub
        };
    },
    props: {
        goods_info: {
            type: Object,
            default: () => {}
        },
        isInOffcanvas: {
            type: Boolean,
            default: false
        }
    },
    created() {},
    mounted() {},
    computed: {
        dealPrice() {
            return this.goods_info.salePrice;
        },
        activityList() {
            let activityList = [];
            if (
                !!this.goods_info &&
                !!this.goods_info.activityList &&
                !!this.goods_info.activityList.length
            ) {
                activityList = repeatArray(
                    this.goods_info.activityList,
                    "promotionName"
                );
            }
            return activityList;
        },
        // 实惠省的价格
        shPrice() {
            return accSub(this.goods_info.supplierReferencePrice, this.goods_info.salePrice)
        }
    },

    methods: {
        //进入商品详情页
        goGoodsDetail(goods_info, index) {
            let goodsItem = {
                ...goods_info,
                index
            };

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
    },
    watch:{
        'goods_info.activityList':{
            handler(val){
                if (val){
                    const sckillInfo = val.filter(item=> [104, 106, 107].includes(item.promotionType));
                    
                    if (sckillInfo.length > 0){
                        let seckillSeconds = this.calcRemainingSeconds(sckillInfo[0].startTime,sckillInfo[0].endTime);
                    
                        this.getSeckillTimeNotice(seckillSeconds);
                        this.timer = setInterval(()=>{
                            if (seckillSeconds <= 0){
                                clearInterval(this.timer);
                            } else {
                                this.getSeckillTimeNotice(seckillSeconds);
                                seckillSeconds--;
                            }
                        },1000)
                    }
                }
            },
            immediate:true
        }
    }
};
</script>

<style lang='scss' scoped>
@import './css/activity.scss';

.animated-background {
  animation-name: placeHolderShimmer;
  animation-duration: 0.75s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease;
  background: #eaeff4;
  position: relative;
}
@keyframes placeHolderShimmer {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.15;
  }
}
.first-animated-background {
  animation-name: placeHolderShimmer;
  animation-duration: 0.75s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease;
  background: var(--skeletonBg);
  position: relative;
}
.animated-price {
  width: 132rpx;
  height: 28rpx;
  margin-top: 16rpx;
  border-bottom: 1px solid #ededed;
  border-radius: 10rpx;
}
.animated-storeLogo {
  margin-top: 24rpx;
  width: 100%;
  height: 28rpx;
  border-bottom: 1px solid #ededed;
  border-radius: 10rpx;
}
.goods_h_item {
  margin-top: 20rpx;
  background: #fff;
  padding: 28rpx;
  overflow: hidden;
  background: #fff;
  display: flex;
  min-height: 272rpx;
  border-radius: 16rpx;
  width: 100%;
  .goods-img {
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    width: 240rpx;
    height: 240rpx;
    overflow: hidden;
    border-radius: 16rpx;
    background-color: #f8f6f7;
    flex-shrink: 0;
    margin-right: 24rpx;
  }
  

  .right {
    min-height: 240rpx;
    flex: 1;
    min-width:0;
  }
  .goodsNameWrap {
    word-break: break-all;
  }
  .goods-name {
    height: 76rpx;
    width: 100%;
    font-size: 28rpx;
    color: #222222;
    line-height: 38rpx;
    font-weight: bold;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    .highlight {
      color: red;
    }
  }

  .price_sh_container {
    background-color: #ffede7;
    border-radius: 12rpx;
    height: 80rpx;
    padding: 4rpx 10rpx;
    position: relative;

    .net_price {
      display: flex;
      align-items: center;
      font-size: 20rpx;
      color: #9e6060;

      img {
        width: 24rpx;
        height: 24rpx;
        margin-right: 4rpx;
      }

      text {
        font-size: 24rpx;
        font-weight: 600;
        margin-left: 4rpx;
      }
    }

    .goods_price {
      color: #f30300;
      font-size: 22rpx;
      font-weight: 600;
      .price_title {
        font-size: 20rpx;
        color: #f30300;
        margin-right: 6rpx;
      }

      .price_int {
        font-size: 32rpx;
      }
    }

    .price_sheng {
      position: absolute;
      top: -6rpx;
      right: 8rpx;
      width: 100rpx;
      height: 86rpx;
      background: url('@/static/shared/goods/icon_sousuo_sheng.svg') center/100% 100% no-repeat;
      color: #fff;
      font-size: 20rpx;
      text-align: center;
      padding-right: 8rpx;

      .price_int {
        font-size: 24rpx;
      }

      &.filled {
        font-size: 18rpx;
        .price_int {
          font-size: 22rpx;
        }
      }
    }
  }
  .price_container {
    width: 100%;
    .goods_price {
      color: var(--confirmBtnBgColor2);
      align-items: baseline;
      white-space: nowrap;

      &.promotion .unit,
      &.promotion .price_decimal,
      &.promotion .price_int {
        color: #f30300;
      }

      .unit {
        font-size: 28rpx;
        letter-spacing: -2px;
        font-weight: normal;
        color: #222;
      }

      .price_int,
      .price_decimal {
        font-size: 40rpx;
        font-weight: normal;
        color: #222;
        margin-right: 4rpx;
      }

      .price_decimal {
        font-size: 28rpx;
      }

      .price_title {
        font-size: 20rpx;
        color: #f30300;
        margin-right: 4rpx;
      }

      .promotion_sheng {
        position: relative;
        height: 32rpx;
        background-color: #f30300;
        white-space: nowrap;
        font-size: 22rpx;
        color: #fff;
        padding: 0 6rpx 0 20rpx;
        margin-left: 6rpx;
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
  }

  .goodsPrice {
    width: 100%;
    .left {
      color: var(--confirmBtnBgColor2);
      align-items: baseline !important;

      .left_price {
        .unit {
          font-size: 28rpx;
          letter-spacing: -2px;
          font-weight: normal;
          color: #222;
        }

        .price_int,
        .price_decimal {
          font-size: 40rpx;
          font-weight: normal;
          color: #222;
          margin-right: 4rpx;
        }
        .price_qi {
          font-size: 20rpx;
          font-weight: 400;
          text-align: left;
          color: #222222;
          line-height: 28rpx;
          margin-left: 8rpx;
        }
        .sales {
          color: $main-third-color;
          font-size: 22rpx;
          margin-left: 26rpx;
          margin-top: 2rpx;
        }
        .price_title {
          font-size: 20rpx;
          color: #f30300;
          position: relative;
          left: 4rpx;
          top: -2rpx;
        }
      }
    }

    image {
      width: 42rpx;
      height: 42rpx;
    }
  }

  .price_after_coupon,.price_after_seckill {
    .price_content {
      font-size: 24rpx;
      color: #666666;
      text-decoration: line-through;
    }
  }
}

.activity_con {
  display: flex;
  font-size: 22rpx;
  color: #ffffff;
  margin-top: 18rpx;
  flex-wrap: wrap;
  .act_label {
    margin-right: 12rpx;
    margin-bottom: 4rpx;
    line-height: 32rpx;
    padding: 0 8rpx;
    font-size: 20rpx;
    color: #f30300;
    border: 2rpx solid #f30300;
    border-radius: 6rpx;
  }
    .activeLabelWrap{
        width: 100%;
        display: flex;
    }
}

.service_con {
  display: flex;
  flex-wrap: wrap;
  margin-top: 12rpx;

  .jd_logistics {
    position: relative;
    height: 32rpx;
    display: flex;
    align-items: center;
    border: 2rpx solid #f30300;
    color: #f30300;
    font-size: 22rpx;
    border-radius: 6rpx;
    padding-right: 10rpx;

    > view {
      width: 34rpx;
      height: 32rpx;
      background-color: #f30300;
      margin-right: 8rpx;
      margin-left: -2rpx;
      border-radius: 6rpx 0 0 6rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.goodsStore {
  margin-top: 10rpx;
  color: #c2c2c2;
  font-size: 24rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 60rpx);
}
</style>
