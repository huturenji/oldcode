<template>
  <!--公告组件-->
  <view class="notice_box" :style="[styles]">
    <view
      :class="noticeSetting[decoItem.props.show_style].notice_wrap_class"
      @click="skipTo(decoItem.data[0])"
    >
      <image
        :src="noticeSetting[decoItem.props.show_style].notice_img_url"
        mode=""
        :class="noticeSetting[decoItem.props.show_style].notice_img_class"
      ></image>
      <marquee
        scrollamount="2"
        :class="noticeSetting[decoItem.props.show_style].notice_content_wrap_class"
        :broadcastData="[decoItem.data[0].text]"
        :broadcastStyle="noticeSetting[decoItem.props.show_style].notice_style_object"
      ></marquee>
      <view :class="noticeSetting[decoItem.props.show_style].notice_wrap_line_class"></view>
      <view class="notice_more">>></view>
    </view>
  </view>
</template>

<script>
import marquee from "@/common/components/marquee";
import { skipTo, isEmpty } from "@/utils/common.js";
import indexMixin from "@/common/components/decorate/common/mixin";

export default {
    name: "deco-notice",
    mixins: [indexMixin],
    components: {
        marquee
    },
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        }
    },
    watch: {
        decoItem: {
            handler(val, oldVal) {
                if (isEmpty(val) || JSON.stringify(val) == JSON.stringify(oldVal)) {
                    return;
                }
                // 初始化背景和margin padding
                this.initBackgroud(val);
                this.initSpace(val);
            },
            immediate: true
        }   
    },
    data() {
        return {
            noticeSetting: {
                one: {
                    notice_wrap_class: "notice_wrap1",
                    notice_img_class: "notice_img1",
                    notice_content_wrap_class: "notice_content_wrap",
                    notice_wrap_line_class: "notice_wrap1_line",
                    notice_img_url: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/decorate/notice1.png",
                    notice_style_object: {
                        //滚动文字样式设置
                        speed: 1, //每秒30px
                        font_size: "24", //字体大小(rpx)
                        text_color: "#666", //字体颜色
                        back_color:
              "linear-gradient(to right,rgba(250,244,244,0.2) 0%, rgba(255,244,244,1) 50%, rgba(250,244,244,0.2) 100%);" //背景色
                    }
                },
                two: {
                    notice_wrap_class: "notice_wrap2",
                    notice_img_class: "notice_img2",
                    notice_content_wrap_class: "notice_content_wrap2",
                    notice_wrap_line_class: "notice_wrap2_line",
                    notice_img_url: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/decorate/notice2.png",
                    notice_style_object: {
                        //滚动文字样式设置
                        speed: 1, //每秒30px
                        font_size: "24", //字体大小(rpx)
                        text_color: "#fff", //字体颜色
                        back_color: "#3A3A3A" //背景色
                    }
                }
            }
        };
    },
    computed: {},
    methods: {
    // 相关跳转
        skipTo(item) {
            skipTo(item, this);
        }
    }
};
</script>

<style lang="scss" scoped>
.notice_box {
  background: #ffffff;
  border-radius: 14rpx;

  // 公告one样式
  .notice_wrap1 {
    width: 100%;
    height: 80rpx;
    background-color: #fff;
    display: flex;
    align-items: center;
    border-radius: 14rpx;

    // border-radius: 6px;
    .notice_img1 {
      width: 127rpx;
      height: 80rpx;
      border-radius: 6px 0 0 6px;
    }

    .notice_content_wrap {
      font-size: 28rpx;
      font-weight: 600;
      width: 530rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-left: -16rpx;

      .notice_content_title {
        color: #e1261c;
      }

      .notice_content {
        color: #666666;
      }
    }

    .notice_wrap1_line {
      width: 1rpx;
      height: 34rpx;
      background-color: rgba(0, 0, 0, 0.1);
      margin-left: 6rpx;
    }

    .notice_more {
      width: 80rpx;
      text-align: center;
      font-size: 29rpx;
      color: #2e2e2e;
      font-weight: 600;
    }
  }

  // 公告two样式
  .notice_wrap2 {
    width: 100%;
    height: 80rpx;
    // margin-bottom: 20rpx;
    background-color: #3a3a3a;
    display: flex;
    align-items: center;
    box-shadow: 1px 6px 19px 1px rgba(86, 86, 86, 0.1);

    // border-radius: 6px;
    .notice_img2 {
      width: 138rpx;
      height: 80rpx;
      border-radius: 6px 0 0 6px;
    }

    .notice_content_wrap2 {
      font-size: 26rpx;
      font-weight: 600;
      width: 510rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: #fff;
      margin-left: 5rpx;
    }

    .notice_wrap2_line {
      width: 1rpx;
      height: 38rpx;
      background-color: #fff;
      margin-left: 2rpx;
    }

    .notice_more {
      width: 80rpx;
      text-align: center;
      font-size: 26rpx;
      color: #fff;
      font-weight: 600;
    }
  }
}
</style>