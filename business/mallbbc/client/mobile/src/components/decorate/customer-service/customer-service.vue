<template>
  <!--客服-->
  <view class="service_wrap" @click="callUp(decoItem.props.tel)" v-margin="decoItem">
    <image :src="telImg" mode=""></image>
    <text>{{ decoItem.props.text }}{{ decoItem.props.tel }}</text>
  </view>
</template>

<script>
export default {
    name: "deco-customer-service",
    components: {},
    props: {
    // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            telImg: getApp().globalData.imgUrl + "user/mobile.png"
        };
    },
    methods: {
    // 拨打客服电话
        callUp(tel) {
            uni.makePhoneCall({
                phoneNumber: tel.toString()
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.service_wrap {
  padding: 20rpx;
  font-size: 26rpx;
  color: #333;
  background-color: #fff;
  display: flex;
  align-items: center;
  border-radius: 14rpx;

  image {
    width: 30rpx;
    height: 32rpx;
    margin-right: 10rpx;
  }
}
</style>