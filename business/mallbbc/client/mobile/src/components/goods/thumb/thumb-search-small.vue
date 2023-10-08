<template name="goodsItem">
  <view class="goods_item" @click="goGoodsDetail(goodsItem)">
    <view class="goods-img">
      <imgThumb :imgSrc="goodsItem.mainImage" />
    </view>
    <view class="goodsNameWrap">
      <view :title="goodsItem.skuName" class="goods_name">
        <discount-tag :type="goodsItem.tags && goodsItem.tags[0]" source="list" v-if="isShowJdLable(goodsItem)"/>
        <text>{{ goodsItem.skuName }}</text>
      </view>
    </view>

    <!-- 活动和优惠信息 -->
    <view class="activity_con" v-if="goodsItem.activityList && goodsItem.activityList.length > 0">
      <template v-for="(item, index) in goodsItem.activityList">
        <block :key="index">
          <view class="act_label ladder_group" v-if="item.promotionType == 105">
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
              <!-- <view class="circle left_circle"></view>
              <view class="circle right_circle"></view> -->
          </view>

          <view class="act_label preSale" v-if="item.promotionType == 103">
            {{ item.promotionName }}
          </view>
          <view class="activeLabelWrap" v-if="item.promotionType == 104 || item.promotionType == 106 || item.promotionType == 107">
            <activeLabel :promotionType="item.promotionType" :activeName="item.promotionName" :startTime="item.startTime" :endTime="item.endTime" ></activeLabel>
          </view>
          <view class="act_label spellGroup" v-if="item.promotionType == 102">
            {{ item.promotionName }}
          </view>
        </block>
      </template>
    </view>

    <!-- 价格区域 -->
    <view class="bottom_wrap">
      <view class="price num-font sh_price" v-if="isShowJdLable(goodsItem)">
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
      <view class="price num-font" v-if="!isShowJdLable(goodsItem)">
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
    </view>
    <!--秒杀前价显示-->
    <view
      class="price_after_seckill"
      v-if="acitivityType(goodsItem.activityList) && ifStarted"
    >
      <text class="price_content num-font">
        ¥{{ $getPartNumber(goodsItem.originalSalePrice, "int") }}{{ $getPartNumber(goodsItem.originalSalePrice, "decimal") }}
      </text>
    </view>
    <!-- 京东物流标签 -->
    <view class="service_con" v-if="goodsItem.jdLogistics === 1 && false">
      <view class="jd_logistics">
        <view>
          <img :src="imgUrl + 'goods/icon_xq_feiji.svg'" />
        </view>
        京东物流
      </view>
    </view>
    <!-- 店铺名称 -->
    <view class="storeInfo" v-if="goodsItem.storeName">{{ goodsItem.storeName }}</view>
  </view>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import activeLabel from "@/components/activeLabel/activeLabel.vue"
import imgThumb from "@/components/goods/thumb/imgThumb.vue";
import discountTag from '@/components/goods/discountTag.vue'
import { accSub } from "@/utils/common.js";
import activityMinxin from './minxin/activity.js'
import goodsHandler from '@/components/goods/handler';

export default {
    name: "thumb-union-v",
    mixins:[activityMinxin],
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
            default: () => {}
        }
    },
    mounted() {},
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
                    const sckillInfo = val.filter(item=>[104, 106, 107].includes(item.promotionType));
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
.goods_item {
  margin: 10rpx;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: -2rpx 0rpx 40rpx -4rpx rgba(156, 159, 169, 0.1);
  overflow: hidden;
  padding-bottom: 28rpx;
  .goods-img {
    width: 100%;
    height: 340rpx;
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
    word-break: break-all;
  }

  .activity_con {
    margin-left: 20rpx;
    display: flex;
    font-size: 22rpx;
    color: #ffffff;
    flex-wrap: wrap;
    .act_label {
      padding: 2rpx 8rpx;
      border: 2rpx solid $main-color;
      border-radius: 6rpx;
      color: $main-color;
      font-size: 20rpx;
      margin-right: 12rpx;
    }
    .activeLabelWrap{
        width: 100%;
        display: flex;
        margin-bottom: 16rpx;
    }
  }
  .goodsNameWrap .goods_name {
    max-height: 76rpx;
    width: 100%;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #222222;
    line-height: 40rpx;
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

  .bottom_wrap {
    padding: 0rpx 20rpx 0rpx 20rpx;
    position: relative;

    .price {
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
  }
  .price_after_coupon,.price_after_seckill {
    margin: 0rpx 20rpx 0rpx 20rpx;
    .price_content {
      font-size: 24rpx;
      color: #A4ACB2;
      text-decoration: line-through;
    }
  }
  .service_con {
    display: flex;
    flex-wrap: wrap;
    margin-top: 12rpx;
    padding: 0 20rpx;

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
  
  .storeInfo{
    margin: 8rpx 20rpx 0rpx 20rpx;
    width: 153px;
    height: 34rpx;
    font-size: 24rpx;
    
    font-weight: 400;
    text-align: justify;
    color: #999999;
    line-height: 34rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
