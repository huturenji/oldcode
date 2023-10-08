<!-- 
    竖向的商品列表里面的每一个item组件
    目前在用的位置包括如下位置：

    1.首页比N家页面最底部的商品列表
    2.装修的推荐商品样式一的商品列表
    3.推荐列表（比如说购物车页面和订单列表页面的推荐列表）
    
-->
<template name="goodsItem">
  <view class="goods_item" @click="goGoodsDetail(goodsItem)">
    <view class="goods-img">
      <imgThumb :imgSrc="goodsItem.mainImage" :noSale="judgeNoSale(goodsItem)" :showThumbTips="showThumbTips"/>
    </view>
    <view class="goodsNameWrap">
      <view class="goods-name">
        <discount-tag :type="goodsItem.tags && goodsItem.tags[0]" source="list" v-if="isShowJdLable(goodsItem)" />
        {{ goodsItem.skuName }}
      </view>
    </view>

    <template v-if="goodsItem.salePrice">
      <!-- 店铺信息 -->
      <view class="storeInfo" v-if="isInOffcanvas" style="padding-left: 20rpx;">{{ goodsItem.storeName }}</view>
      
      <!-- 活动信息 -->
      <view class="activity_con" v-if="goodsItem.activityList && goodsItem.activityList.length > 0">
          <block v-for="(item, index) in goodsItem.activityList" :key="index">
              <view
                class="act_label ladder_group"
                v-if="item.promotionType == 105"
              >
                {{ item.promotionName }}
              </view>
              <view
                class="discount-label"
                v-if="
                  item.promotionType == 201 || 
                  item.promotionType == 202 ||
                  item.promotionType == 203 ||
                  item.promotionType == 204
                "
              >
                {{ getDiscountContent(item.promotionType,item.descriptionList) }}
              </view>
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

      <!-- 商品价格 -->
      <view class="bottom_wrap">
        <!-- 非侧边导航栏内使用新样式 -->
        <template v-if="!isInOffcanvas">
          <view class="new_price num-font sh_price" v-if="isShowJdLable(goodsItem)">
            <view :class="{ 'price_sheng': true, 'filled': shPrice.length > 5 }">
              <text class="unit">￥</text>
              <text class="price_int">{{ $getPartNumber(shPrice, "int") }}</text>
              <text class="price_decimal">{{ $getPartNumber(shPrice, "decimal") }}</text>
            </view>
            <view class="net-price num-font">
              京东到手价 
              <text> ¥{{ $getPartNumber(goodsItem.supplierReferencePrice, "int") }}{{ $getPartNumber(goodsItem.supplierReferencePrice, "decimal") }}</text>
            </view>
            <view
              v-if="goodsItem.salePrice"
              :class="{ 'price_box': true, 'filled': (goodsItem.salePrice + '').length > 6 }"
            >
              <text class="sh_label" v-if="isShowJdLable(goodsItem)">实惠价</text>
              <text class="unit">￥</text>
              <text class="price_int">{{ $getPartNumber(goodsItem.salePrice, "int") }}</text>
              <text class="price_decimal">{{ $getPartNumber(goodsItem.salePrice, "decimal") }}</text>
            </view>
          </view>
          <view class="new_price num-font" v-if="!isShowJdLable(goodsItem)">
            <view v-if="goodsItem.salePrice" :class="{'price_box': true, 'promotion': acitivityType(goodsItem.activityList) && ifStarted }">
              <text class="unit">￥</text>
              <text class="price_int">{{ $getPartNumber(goodsItem.salePrice, "int") }}</text>
              <text class="price_decimal">{{ $getPartNumber(goodsItem.salePrice, "decimal") }}</text>
              <text class="promotion_sheng" v-if="acitivityType(goodsItem.activityList) && ifStarted">
                <img :src="imgUrl + 'goods/icon_sousuo_jiangjia.svg'" alt="">
                降 ¥{{ Number(accSub(goodsItem.originalSalePrice, goodsItem.salePrice)).toFixed(2) }}
              </text>
            </view>
          </view>
          <!--活动前价显示-->
          <view class="price_after_seckill" v-if="acitivityType(goodsItem.activityList) && ifStarted">
              <text class="price_content num-font">
                  ¥{{$getPartNumber(goodsItem.originalSalePrice, "int")}}{{$getPartNumber(goodsItem.originalSalePrice, "decimal")}}
              </text>
          </view>
          <view class="storeInfo">{{ goodsItem.storeName }}</view>
        </template>

        <!-- 侧边导航栏内使用旧样式 -->
        <template v-if="isInOffcanvas">
          <view class="old_price num-font">
            <template v-if="goodsItem.salePrice">
              <text class="unit">￥</text>
              <text class="price_int">{{ $getPartNumber(goodsItem.salePrice, "int") }}</text>
              <text class="price_decimal">{{ $getPartNumber(goodsItem.salePrice, "decimal") }}</text>
              <text v-if="acitivityType(goodsItem.activityList) && ifStarted" class="price_title">{{`(${promotionMap[acitivityType(goodsItem.activityList)]})`}}</text>
            </template>
            <!-- 京东到手价 -->
            <view class="net-price num-font" v-if="isShowJdLable(goodsItem)">
                京东到手价 <text> ¥{{ $getPartNumber(goodsItem.supplierReferencePrice, "int") }}{{ $getPartNumber(goodsItem.supplierReferencePrice, "decimal") }}</text>
            </view>
            <!--活动前价显示-->
            <view class="price_after_seckill" v-if="acitivityType(goodsItem.activityList) && ifStarted">
                <text class="price_content num-font">
                    ¥{{$getPartNumber(goodsItem.originalSalePrice, "int")}}{{$getPartNumber(goodsItem.originalSalePrice, "decimal")}}
                </text>
            </view>
          </view>
        </template>
      </view>
    </template>

    <template v-else>
      <view class="sketch_wrap">
        <view class="first-animated-background animated-price"></view>
        <view class="animated-background animated-storeLogo"></view>
      </view>
    </template>
  </view>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import cartMixin from "@/common/mixin/cartMixin";
import imgThumb from "@/components/goods/thumb/imgThumb.vue";
import { accSub } from "@/utils/common.js";
import activityMinxin from './minxin/activity.js'
import goodsHandler from '@/components/goods/handler';
import activeLabel from "@/components/activeLabel/activeLabel.vue"
import discountTag from '@/components/goods/discountTag.vue'

export default {
    name: "thumb-waterfall-v",
    mixins: [cartMixin, activityMinxin],
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            accSub
        };
    },
    components: {
        imgThumb,
        activeLabel,
        discountTag
    },
    computed: {
        ...mapState(["userInfo", "hasLogin"]),
        ...mapGetters(["disabledModule"]),
        // 实惠省的价格
        shPrice() {
            return accSub(this.goodsItem.supplierReferencePrice, this.goodsItem.salePrice)
        }
    },
    props: {
        // 商品item对象
        goodsItem: {
            type: Object,
            value: {}
        },
        // 是否在侧边导航栏内
        isInOffcanvas: {
            type: Boolean,
            default: true
        }
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
    },
    watch:{
        'goodsItem.activityList':{
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

<style scoped lang='scss'>
@import './css/activity.scss';
.sketch_wrap {
  padding: 0 20rpx 32rpx 20rpx;
}
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
  margin-top: 32rpx;
  width: 100%;
  height: 28rpx;
  border-bottom: 1px solid #ededed;
  border-radius: 10rpx;
}

.goods_item {
  // 瀑布流中用到了这个5px，不需要改为10rpx
  margin: 5px;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: -2rpx 0rpx 40rpx -4rpx rgba(156, 159, 169, 0.1);
  overflow: hidden;
  ::v-deep .u-wrap{
    background-position: center top !important; 
  }
  .goods-img {
    width: 100%;
    min-height: 280rpx;
    overflow: hidden;
    ::v-deep uni-image {
      border-radius: 20rpx 20rpx 0 0 !important;
    }
    ::v-deep img {
      width: 100%;
      height: auto;
      display: block;
    }
  }
  .goodsNameWrap {
    max-height: 76rpx;
    overflow: hidden;
    margin: 20rpx 0;
  }

  .goodsNameWrap .goods-name {
    max-height: 76rpx;
    width: 100%;
    padding: 0 20rpx;
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
  }
  .storeInfo {
    margin-top: 10rpx;
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 26rpx;
    line-height: 36rpx;
    height: 36rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: 8rpx;
    color: #a4acb2;
  }

  .activity_con {
    display: flex;
    font-size: 22rpx;
    color: #ffffff;
    margin-top: 20rpx;
    padding: 0 0 0 20rpx;
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

  .bottom_wrap {
    padding: 4rpx 20rpx 32rpx;
    position: relative;

    .old_price {
      color: var(--confirmBtnBgColor2);
      min-height: 48rpx;
      .unit {
        letter-spacing: -2px;
        font-size: 32rpx;
      }
      .price_int {
        font-size: 40rpx;
      }
      .price_decimal {
        font-size: 40rpx;
      }
      .price_title {
        font-size: 20rpx;
        color: #f30300;
        position: relative;
        left: 4rpx;
        top:-4rpx
      }
    }

    .new_price {
      color: var(--confirmBtnBgColor2);
      min-height: 48rpx;
      position: relative;
      &.sh_price {
        background-color: #ffede7;
        border-radius: 4rpx;
        height: 80rpx;
        padding: 0 10rpx;

        .price_sheng {
          position: absolute;
          top: -6rpx;
          right: 0;
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

        .net-price {
          color: #9e6060;
        }

        .price_box {
          color: #f30300;
        }
      }
      .net-price {
        font-size: 18rpx;
        margin-top: 2rpx;

        text {
          font-weight: normal;
          font-size: 22rpx;
        }
      }
      .price_box {
        color: #222;
        font-size: 28rpx;
        .sh_label {
          font-size: 20rpx;
        }
        .unit {
          letter-spacing: -2px;
        }
        .price_int {
          font-size: 40rpx;
        }

        &.filled {
          font-size: 24rpx;

          .price_int {
            font-size: 34rpx;
          }
        }

        &.promotion {
          color: #f30300;
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

    .price_after_seckill {
      position: relative;
      left: 4rpx;
      .price_content {
        font-size: 24rpx;
        color: #666666;
        text-decoration: line-through;
      }
    }
  }
}
</style>
