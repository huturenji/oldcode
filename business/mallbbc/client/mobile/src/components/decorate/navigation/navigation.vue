<template>
  <!--导航组件-->
  <view class="nav_wrap" v-margin="decoItem">
    <!--导航（不显示图标）-->
    <view
      class="cate-section"
      v-if="decoItem.props.style_set === 'nav' && decoItem.props.icon_set === 'no-icon'"
      :style="{
        justifyContent: decoItem.data.length > 4 ? 'flex-start' : 'space-around',
      }"
    >
      <view
        class="cate-item"
        v-for="(item, index) in decoItem.data"
        :key="index"
        @click="skipTo(item)"
      >
        <text>{{ filters.toSubstring(item.name, 0, 9) }}</text>
      </view>
    </view>

    <!-- 导航（图标在左）-->
    <view
      class="cate-section"
      v-if="decoItem.props.style_set === 'nav' && decoItem.props.icon_set === 'left'"
      style="justify-content: flex-start; padding: 20rpx 2rpx"
    >
      <view
        class="cate-item2"
        v-for="(item, index) in decoItem.data"
        :key="index"
        @click="skipTo(item)"
      >
        <image
          :src="item.img"
          mode="aspectFit"
          :style="[dealStyle(decoItem.props.slide)]"
        >
        </image>
        <view class="cate_name">{{
          filters.toSubstring(item.name, 0, 9)
        }}</view>
      </view>
    </view>

    <!-- 导航（图标在上） -->
    <scrollListNav
      v-if="decoItem.props.style_set === 'nav' && decoItem.props.icon_set === 'up'"
      :list="decoItem.data"
      :textStyle="{ color: '#fff', fontSize: '14px' }"
      :indicatorWidth="30"
      :indicatorBarWidth="13"
      :indicatorActiveColor="decoItem.props.indicatorActiveColor"
      :indicatorColor="decoItem.props.indicatorColor"
    >
    </scrollListNav>

    <!-- 导航分组 -->
    <view class="nav_group" v-if="decoItem.props.style_set === 'tag-nav'">
      <view
        class="nav_group_item"
        v-for="(item, index) in decoItem.data"
        :key="index"
        @click="skipTo(item)"
      >
        <image :src="item.img"></image>
        <view class="nav_group_name">{{ item.name }}</view>
      </view>
    </view>
  </view>
</template>

<script module="filters" lang="wxs" src="@/utils/filter.wxs"></script>
<script>
import scrollListNav from "@/components/navigation";
import { skipTo } from "@/utils/common.js";
export default {
  name: "deco-navigation",
  components: {
    scrollListNav,
  },
  props: {
    decoItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {
    // 相关跳转
    skipTo(item) {
      skipTo(item, this);
    },

    dealStyle(imgSize){
      try {
        return {
          'margin-right': '10rpx',
          'width': `${imgSize * 2}rpx`,
          'height': `${imgSize * 2}rpx`
        }
      } catch (error) {}
    },
  },
};
</script>

<style lang="scss" scoped>
.nav_wrap {
  // width: 100%;
  box-sizing: border-box;
  position: relative;
  // 导航弹性盒子
  .cate-section {
    position: relative;
    z-index: 5;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20rpx 0 26rpx 52rpx;
    overflow-x: auto;
    flex-wrap: nowrap;
    width: 100%;
    .cate-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 28upx;
      color: #303133;
      flex-shrink: 0;
      margin-right: 64rpx;
      image {
        overflow: visible;
      }
    }

    .cate-item2 {
      display: flex;
      align-items: center;
      font-size: 26upx;
      color: #303133;
    }

    // .cate_name {
    //   -webkit-writing-mode: vertical-rl;
    //   writing-mode: vertical-rl;
    // }

    /* 原图标颜色太深,不想改图了,所以加了透明度 */
    image {
      //   width: 100upx;
      //   height: 100upx;
      margin-bottom: 14upx;
      border-radius: 50%;
      border: 6upx solid #ffffff;
    }
  }

  // 导航分组
  .nav_group {
    padding: 0 86rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .nav_group_item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 40rpx;
      margin-bottom: 40rpx;

      image {
        width: 90rpx;
        height: 90rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }

      .nav_group_name {
        font-size: 26rpx;
        color: #333;
      }
    }

    .nav_group_item:nth-last-child(1) {
      margin-right: 0;
    }
  }

  .nav_group > view:nth-child(2n) {
    margin-right: 0;
  }
}
.nav_wrap::-webkit-scrollbar {
  display: none;
}
// 导航分组end
</style>
