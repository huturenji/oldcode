<!-- 商品组件：横向展示，一行一个，商品大图比价列表
点击进入商品详情页
-->
<template name="goodsCollectItemH">
  <view class="goods_h_item_wrap">
    <view class="bigImg" @click="goGoodsDetail(goods_info, null)">
      <imgThumb :showWatermark="false" :imgSrc="dealMainImage" :noSale="judgeNoSale(goods_info)" :showThumbTips="showThumbTips"/>
    </view>
    <view
      class="contentWrap"
      :class="{ backgroundfff: !filterFlag }"
    >
      <view class="goods_h_bigImg" @click="goGoodsDetail(goods_info, null)">
        <view class="right">
          <view class="top flex_column_start_start">
            <view class="goodsNameWrap">
              <view
                class="goods-name goods_name_nochart"
              >
                <discount-tag :type="goods_info.tags && goods_info.tags[0]" source="list"  v-if="isShowJdLable(goods_info)" />
                {{ goods_info.skuName }}
              </view>
            </view>
            <text
              v-if="goods_info.goodsBrief && goods_info.goodsBrief != ''"
              class="goods-brief"
              >{{ goods_info.goodsBrief }}</text
            >
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
                    <view class="activeLabelWrap" v-if="item.promotionType == 104 || item.promotionType == 106 || item.promotionType == 107">
                        <activeLabel :promotionType="item.promotionType" :activeName="item.promotionName" :startTime="item.startTime" :endTime="item.endTime" ></activeLabel>
                    </view>
                  <view
                    class="act_label preSale"
                    v-if="item.promotionType == 103"
                  >
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
              <view
                class="bottom flex_row_start_end goodsPrice flex-between flex_between"
              >
                <view class="goods-price flex_column_center_start">
                  <view class="left flex_row_start_center">
                    <view class="left_price num-font">
                      <text class="unit firstunit">￥</text>
                      <text class="price_int firstprice_int">{{
                        $getPartNumber(dealPrice, "int")
                      }}</text>
                      <text class="price_decimal firstprice_decimal">{{
                        $getPartNumber(dealPrice, "decimal")
                      }}</text>
                      <text v-if="ifAttendSckillAcitivity(goods_info.activityList) && ifStarted" class="price_title">{{
                        " (秒杀价)"
                      }}</text>
                    </view>
                    <!-- 京东到手价 -->
                    <view class="net-price num-font" v-if="isShowJdLable(goods_info)">
                        京东到手价 <text> ¥{{ $getPartNumber(goods_info.supplierReferencePrice, "int") }}{{ $getPartNumber(goods_info.supplierReferencePrice, "decimal") }}</text>
                    </view>
                  </view>
                </view>
                <view class="flex_row_start_center goodsStore goods_store_nochart">
                  <!-- <view
                                    class="compareListItemImg"
                                    :style="{ backgroundImage: 'url(' + goods_info.storeLogo + ')' }"
                                    ></view> -->
                  <!-- <view v-if="item.saleNum>0" class="compareListItemNum">已售{{item.saleNum}}</view> -->
                   <view class="goods_info_name">
                    {{ goods_info.storeName }}
                  </view>
                </view>
              </view>
              <!--秒杀前价显示-->
            <view
              class="price_after_seckill"
              v-if="ifAttendSckillAcitivity(goods_info.activityList) && ifStarted"
            >
              <text class="price_content num-font"
                >¥{{ $getPartNumber(goods_info.originalSalePrice, "int")
                }}{{
                  $getPartNumber(goods_info.originalSalePrice, "decimal")
                }}</text
              >
            </view>
            </view>
            <view v-else>
              <view class="first-animated-background animated-price"></view>
              <view class="animated-background animated-storeLogo"></view>
              <view class="animated-background animated-storeLogo"></view>
            </view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import imgThumb from "@/components/goods/thumb/imgThumb.vue";
import { repeatArray, filterFlag } from "@/utils/common.js";
import activityMinxin from './minxin/activity.js'
import goodsHandler from '@/components/goods/handler';
import activeLabel from "@/components/activeLabel/activeLabel.vue"
import discountTag from '@/components/goods/discountTag.vue'
export default {
    name: "thumb-decore-big",
    components: {
        imgThumb,
        activeLabel,
        discountTag
    },
    mixins:[activityMinxin],
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            limitNum: 3,
            sku: this.goods_info.sku, //sku
            echartsKey: this.goods_info.sku + Math.round(Math.random() * 10000000), //避免重复
            fontFamily:'Sinosun Font, Hiragino Sans GB, Microsoft Yahei, 宋体, Tahoma, Arial, Helvetica, STHeiti, sans-serif',//fontFamily
            myChart:null,//myChart对象
            filterFlag: true //是否支持高斯模糊
        };
    },
    props: {
        goods_info: {
            type: Object,
            default: () => {}
        }
    },
    mounted() {
        this.filterFlag = filterFlag();
    },
    computed: {
    //todo 经与服务端沟通，此时商品列表展示的商品价格 为groupItems里面的第一个，服务端针对价格已经做了排序
        dealPrice() {
            let price = "";
            price = this.goods_info.salePrice;
            return price;
        },
        dealMainImage() {
            let mainImage = "";
            // todo 兼容旧商品图片 优先级 新-旧-原商品图片
            if (this.goods_info) {
                mainImage = this.goods_info.uploadImage || this.goods_info.uploadmage || this.goods_info.mainImage;
            }
            return mainImage;
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
        }
    },
    watch: {
        'goods_info.activityList':{
            handler(val){
                if (val){
                    const sckillInfo = val.filter(item=>item.promotionType === 104);
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
        
    },
    methods: {
        //判断数组元素是否全部相同
        isAllEqual(array) {
            if (array.length > 0) {
                return !array.some(function (value) {
                    return value !== array[0];
                });
            }
            return true;
        },
        //进入商品详情页
        goGoodsDetail(goods_info) {
            try {
                let sku = goods_info.sku;

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
.goods_h_item_wrap {
  margin-top: 30rpx;
  background: #fff;
  border-radius: 16rpx;
  width: 100%;
  ::v-deep .u-wrap{
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
        background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/goods-watermark-g2-big.png") left top no-repeat;
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
  &.backgroundfff {
    background: #fff;
    position: relative;
  }
  .goods_h_bigImg {
    padding: 0 30rpx 0;
    display: flex;
    position: relative;
    .firstunit {
      color: var(--confirmBtnBgColor2) !important;
      font-size: 28rpx !important;
    }
    .firstprice_int {
      color: var(--confirmBtnBgColor2) !important;
      font-size: 40rpx !important;
    }
    .firstprice_decimal {
      color: var(--confirmBtnBgColor2) !important;
      font-size: 28rpx !important;
    }

    .right {
      flex: 1;
      .arrow {
        margin-top: 12rpx;
        width: 100%;
        display: flex;
        justify-content: center;
        cursor: pointer;
        transition: all 0.7s;
        img {
          width: 44rpx;
          height: auto;
        }
      }
    }
    .flex-between{
      &.flex_between{
        justify-content: space-between;
      }
    }

    .goodsNameWrap {
      height: 76rpx;
      word-break: break-all;
    }
    .goods-name {
      font-size: 30rpx;
      color: #222;
      line-height: 76rpx;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      word-break: break-all;
      &.goods_name_nochart{
        line-height: unset;
        margin-top: 22rpx;
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
      .left {
        color: var(--confirmBtnBgColor2);
        align-items: baseline !important;

        .unit {
          font-size: 28rpx;
          letter-spacing: -2px;
          font-weight: normal;
          color: #222;
        }
        .left_price {
          .price_int,
          .price_decimal {
            font-size: 40rpx;
            font-weight: normal;
            color: #222;
            margin-right: 4rpx;
          }
          .price_title {
            font-size: 20rpx;
            color: #f30300;
            position: relative;
            left: 4rpx;
            top: -4rpx;
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
}
.activity_con {
  display: flex;
  font-size: 22rpx;
  color: #ffffff;
  flex-wrap: wrap;
//   margin-top: 30rpx;
  .act_label {
    margin-right: 12rpx;
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

.goodsStore {
  // margin-top: 18rpx;
  padding-left: 36rpx;
  background: url("@/static/shared/goods/storenNme_line.png") no-repeat 18rpx center;
  background-size: 2rpx 20rpx;
  &.goods_store_nochart{
    background-size:0rpx 0rpx;
  }
  .goods_info_name {
    font-size: 0.26rem;
    color: #222;
    display: flex;
    align-items: center;
    .store_logo{
      width: 36rpx;
      height: 36rpx;
      margin-right: 8rpx;
    }
    .ownStoreLogo {
        margin-right: 12rpx;
        border-radius: 50%;
        width: 40rpx;
        height: 40rpx;
        background: var(--storeLogo);
        background-size: 100% 100%;
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
