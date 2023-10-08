<template>
  <!--客服-->
  <view class="service_wrap" @click="callUp(decoItem.props.tel)" :style="[styles]">
    <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/mobile.png" mode=""></image>
    <text>{{ decoItem.props.text }}{{ decoItem.props.tel }}</text>
  </view>
</template>

<script>
import { isNotEmpty } from "@/utils/common.js";
import indexMixin from "@/common/components/decorate/common/mixin";
export default {
    name: "deco-customer-service",
    components: {},
    mixins: [indexMixin],
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
        };
    },
    watch: {
        decoItem: {
            handler(val) {
                if (isNotEmpty(val)) {
                    // 初始化margin padding
                    this.initBackgroud(val);
                    this.initSpace(val);
                }
            },
            deep: true,
            immediate: true
        }
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