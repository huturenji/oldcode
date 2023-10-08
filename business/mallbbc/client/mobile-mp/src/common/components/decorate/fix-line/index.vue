<template>
  <!--搭配组件 以后改为商品组合-->
  <view
    class="subline_wrap"
  >
    <view
      class="subline"
      :style="{
        height: decoItem.styles[0].margin?(decoItem.styles[0].margin[0] + 'px'):'10px',
        borderBottomColor: decoItem.props.color,
        borderBottomStyle: decoItem.props.val,
      }"
    >
    </view>
    <view :style="{ height: decoItem.styles[0].margin?(decoItem.styles[0].margin[0] + 'px'):'10px' }"></view>
  </view>
</template>

<script>
export default {
  name: "deco-fix-line",
  components: {},
  props: {
    // 装修数据
    decoItem: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.subline_wrap {
  background-color: #fff;

  // margin: 20rpx 20rpx 0 20rpx;
  .subline {
    width: 100%;
    border-bottom: 1px dotted #fff;
  }
}
</style>