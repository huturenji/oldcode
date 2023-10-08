<!-- 
    装修组件的骨架图
-->
<template>
  <view class="skeleton-wrap">
    <!-- 骨架图部分 -->
    <!-- 一行两个模式的骨架图 -->
    <template v-if="showType == 'small'">
      <view class="small-part">
        <view v-for="i in quantity" :key="i" class="wrap-item">
          <view class="goods-img-skeleton animated-opacity"></view>
          <view class="sketch_wrap">
            <view class="goodsNameWrap-skeleton animated-opacity"></view>
            <view class="price-skeleton animated-opacity"></view>
            <view class="storeLogo-skeleton animated-opacity"></view>
          </view>
        </view>
      </view>
    </template>
    <template v-if="showType == 'bijia'">
      <view class="bijia-part">
        <view v-for="i in quantity" :key="i" class="wrap-item">
          <view class="goods-img-skeleton animated-opacity"></view>
          <view class="sketch_wrap">
            <view class="goodsNameWrap-skeleton animated-opacity"></view>
            <view class="price-skeleton animated-opacity"></view>
            <view class="storeLogo-skeleton animated-opacity"></view>
          </view>
        </view>
      </view>
    </template>
    <template v-if="showType == 'datubijia' || showType == 'big'">
      <view class="datubijia-part">
        <view v-for="i in quantity" :key="i" class="wrap-item">
          <view class="goods-img-skeleton animated-opacity"></view>
          <view class="sketch_wrap">
            <view class="goodsNameWrap-skeleton animated-opacity"></view>
            <view class="price-skeleton animated-opacity"></view>
            <view class="storeLogo-skeleton animated-opacity"></view>
          </view>
        </view>
      </view>
    </template>
    <template v-if="showType == 'zhexianbijia'">
      <view class="zhexianbijia-part">
        <view v-for="i in quantity" :key="i" class="wrap-item">
          <view class="goods-warp">
            <view class="goods-img-skeleton animated-opacity"></view>
            <view class="sketch_wrap">
              <view class="goodsNameWrap-skeleton animated-opacity"></view>
              <view class="price-skeleton animated-opacity"></view>
              <view class="storeLogo-skeleton animated-opacity"></view>
            </view>
          </view>
          <!-- 暂时不要 -->
          <!-- <view class="charts-wrap">
            <view class="charts-skeleton animated-opacity"></view>
            <view class="charts-skeleton animated-opacity"></view>
          </view> -->
        </view>
      </view>
    </template>

 
  </view>
</template>

<script>

export default {
    name: "thumb-skeleton",
    data() {
        return {};
    },
    components: {},
    props: {
        // 显示哪种骨架图模式 small= 一行两个; bijia=比价列表; datubijia=大图比价; zhexianbijia=折线比价
        showType: {
            type: String,
            default: 'small'
        },

        // 显示多少个骨架图
        quantity: {
            type: Number,
            default: 10
        }        
    }    
};
</script>

<style scoped lang='scss'>
$bg1: #eaeff4;
$bg2: #ffadad;
$bg3: #f7eeee;

.animated-opacity {
  animation-name: placeHolderShimmer;
  animation-duration: 0.75s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease;
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
.goods-img-skeleton {
    width: 100%;
    height: 340rpx;
    overflow: hidden;
    background: $bg1;
    border-radius: 20rpx 20rpx 0 0;
}

.goodsNameWrap-skeleton {
  width: 100%;
  height: 32rpx;
  overflow: hidden;
  margin: 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background: $bg2;
}

.price-skeleton {
  width: 132rpx;
  height: 28rpx;
  margin-top: 16rpx;
  border-bottom: 1px solid #ededed;
  border-radius: 10rpx;
  background: $bg2;
}
.storeLogo-skeleton {
  margin-top: 32rpx;
  width: 100%;
  height: 28rpx;
  border-bottom: 1px solid #ededed;
  border-radius: 10rpx;
  background: $bg1;
}

.skeleton-wrap{
  overflow: hidden;
  background: none;
  border-radius: none;
  box-shadow: none;
  padding: 0;
  width: 100%;

  .small-part{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin: 5px;

    .wrap-item{
      background: #fff;
      border-radius: 20rpx;
      box-shadow: -2rpx 0rpx 40rpx -4rpx rgba(156, 159, 169, 0.1);
      width: calc((100% - 20rpx) / 2);
      margin-bottom: 20rpx;
      &:nth-child(2n){
        margin-left: 20rpx;
      }

      .sketch_wrap {
        padding: 0 20rpx 32rpx 20rpx;
      }

    }
  }

  .bijia-part {
    width: 100%;
      .wrap-item {
        width: 100%;
        padding: 10rpx 0;
        display: flex;
        align-items: flex-start;
        background: #fff;
        border-radius: 20rpx;
        box-shadow: -2rpx 0rpx 40rpx -4rpx rgba(156, 159, 169, 0.1);
        overflow: hidden;
        padding: 28rpx 30rpx 30rpx;
        margin-top: 20rpx;

        &:first-child {
          margin-top: 0;
        }
  
        .goods-img-skeleton {
          width: 240rpx;
          height: 240rpx;
          margin-right: 24rpx;
          overflow: hidden;
          background: $bg1;
          border-radius: 20rpx;
        }
  
        .sketch_wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
  }

  .datubijia-part{
    .wrap-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        background: #fff;
        border-radius: 20rpx;
        box-shadow: -2rpx 0rpx 40rpx -4rpx rgba(156, 159, 169, 0.1);
        overflow: hidden;
        margin-top: 30rpx;
  
        .goods-img-skeleton {
          width: 750rpx;
          height: 750rpx;
          overflow: hidden;
          background: $bg1;
          border-radius: 20rpx 20rpx 0 0;
        }
  
        .sketch_wrap {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 15px 20px;
        }
      }
  }
  .zhexianbijia-part {
    .wrap-item{
      background: #fff;
      border-radius: 20rpx;
      box-shadow: -2rpx 0rpx 40rpx -4rpx rgba(156, 159, 169, 0.1);
      overflow: hidden;
      margin-top: 30rpx;
      padding: 28rpx 30rpx 30rpx;

      .goods-warp {
        display: flex;

        .goods-img-skeleton {
          margin-right: 24rpx;
          width: 240rpx;
          height: 240rpx;
          overflow: hidden;
          background: $bg1;
          border-radius: 20rpx;
        }

        .sketch_wrap{
          flex: 1;
        }
      }

      .charts-wrap {
        .charts-skeleton {
          width: 100%;
          height: 32rpx;
          overflow: hidden;
          margin: 20rpx 0 0;
          border-radius: 10rpx;
          background: $bg3;
        }
      }
    }
   
  }
}
</style>