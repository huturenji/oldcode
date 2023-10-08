<template>
  <view class="svideo" v-margin="decoItem">
    <view class="svideo_title">
      <view class="svideo_title_l">{{ decoItem.data[0].title }}</view>
      <view class="svideo_title_r" @click="skipTo('svideo_center')">更多视频</view>
    </view>


    <!-- 方案一 -->
    <view
      class="svideo_main"
      v-if="decoItem.props.show_style == 'one' && decoItem.props.is_show == true"
    >
      <view
        class="svideo_main_block svideo_main_block_l"
        v-for="(item, index) in decoItem.data[0].data.info"
        :key="index"
        @click="skipTo(decoItem.type, item)"
        :style="{ borderRadius: decoItem.props.border_radius + 'px' }"
      >
        <view class="svideo_main_block_w">
          <view class="svideo_main_block_t">
            <image
              class="svideo_block_t_img svideo_block_t_img2s svideo_block_t_img0"
              :src="imgUrl + 'svideo/zx_play.png'"
            ></image>
            <text class="svideo_block_t_text">{{ item.clickNum }}人观看</text>
          </view>
        </view>
        <image class="video_bg1" :src="item.videoImage"></image>
        <view class="svideo_main_block_b">{{ item.videoName }}</view>
      </view>
    </view>
    <!-- 方案2 -->
    <view
      class="svideo_main2"
      v-if="decoItem.props.show_style == 'two' && decoItem.props.is_show == true"
    >
      <scroll-view
        class="scroll-view svideo2_wrap"
        scroll-x="true"
        show-scrollbar="false"
      >
        <block v-for="(item, index) in decoItem.data[0].data.info" :key="index">
          <view
            class="svideo_main_block2 svideo_main_block_l2"
            @click="skipTo(decoItem.type, item)"
            :style="{ borderRadius: decoItem.props.border_radius + 'px' }"
          >
            <image class="video_bg1" :src="item.videoImage"></image>
            <view class="svideo_main_block_w">
              <view class="svideo_main_block_t">
                <image
                  class="svideo_block_t_img svideo_block_t_img2 svideo_block_t_img0"
                  :src="imgUrl + 'svideo/zx_play.png'"
                ></image>
                <text class="svideo_block_t_text"
                  >{{ item.clickNum }}人观看</text
                >
              </view>
            </view>
            <view class="svideo_main_block_b2">{{ item.videoName }}</view>
          </view>
        </block>
      </scroll-view>
    </view>
    <!-- 方案3 -->
    <view
      class="svideo_main5"
      v-if="decoItem.props.show_style == 'three' && decoItem.props.is_show == true"
    >
      <block v-for="(item, index) in decoItem.data[0].data.info" :key="index">
        <view
          class="svideo_main_block5 svideo_main_block50"
          @click="skipTo(decoItem.type, item)"
          :style="{ borderRadius: decoItem.props.border_radius + 'px' }"
        >
          <image class="video_bg3" :src="item.videoImage"></image>
          <view class="svideo_bg_img"></view>
          <view class="svideo_block_bgimg0">
            <view class="svideo_block_t5_w">
              <view class="svideo_block_t5">{{ item.clickNum }}人观看</view>
            </view>
            <view class="svideo_block_bgimg1_wrap">
              <view class="svideo_block_bgimg1">
                <image class="video_bg" :src="item.videoImage"></image>
                <image
                  class="svideo_block_bgimg3 svideo_block_t_img0 svideo_block_t_img0"
                  :src="imgUrl + 'svideo/zx_play.png'"
                ></image>
              </view>
            </view>
          </view>
          <view class="svideo5_b">
            <view class="svideo5_b_title">{{ item.videoName }}</view>
            <view class="svideo5_b_text">{{ item.introduction }}</view>
          </view>
        </view>
      </block>
    </view>
    <!-- 方案4 -->
    <view
      class="svideo_main3"
      v-if="decoItem.props.show_style == 'four' && decoItem.props.is_show == true"
      style="padding-bottom: 30rpx"
    >
      <swiper
        class="swiper-block"
        :current="1"
        :circular="true"
        :autoplay="true"
        @change="swiperChange2"
        previous-margin="120rpx"
        next-margin="120rpx"
      >
        <block
          v-for="(item, index) in decoItem.data[0].data.info"
          :key="index"
          :index="index"
        >
          <swiper-item
            :style="{ left: 71 + index * 63 + 'rpx' }"
            :class="swiperIndex1 == index ? 'swiper-item1' : 'swiper-item'"
          >
            <view
              class="optionBox"
              style="text-align: center"
              @click="skipTo(decoItem.type, item)"
            >
              <image
                mode="aspectFill"
                :src="item.videoImage"
                :class="swiperIndex1 == index ? 'active1' : 'active2'"
                :style="{
                  height: '345rpx',
                  borderRadius: decoItem.props.border_radius + 'px',
                }"
              ></image>
              <view class="svideo_main_block_sw">
                <view class="">
                  <image
                    class="svideo_block_t_img svideo_person_num"
                    :src="imgUrl + 'svideo/play_video.png'"
                  ></image>
                </view>
              </view>
              <view class="svideo_main_block_b3_w">
                <view class="svideo_main_block_b3"
                  >{{ item.clickNum }}人观看</view
                >
              </view>
            </view>
          </swiper-item>
        </block>
      </swiper>
    </view>
    <!-- 方案5 -->
    <view
      class="svideo_main4"
      v-if="decoItem.props.show_style == 'five' && decoItem.props.is_show == true"
    >
      <scroll-view
        class="scroll-view svideo4_wrap"
        scroll-x="true"
        show-scrollbar="false"
      >
        <block v-for="(item, index) in decoItem.data[0].data.info" :key="index">
          <view
            class="svideo_main_block4"
            @click="skipTo(decoItem.type, item)"
            :style="{ borderRadius: decoItem.props.border_radius + 'px' }"
          >
            <image
              class="video_bg"
              :src="item.videoImage"
              :style="{ borderRadius: decoItem.props.border_radius + 'px' }"
            ></image>
            <view class="svideo_main_block_w svideo_main_block_t svideo_main_block_t0">
              <image
                class="svideo_block_t_img svideo_block_t_img24 svideo_block_t_img0"
                :src="imgUrl + 'svideo/zx_play.png'"
              ></image>
              <text class="svideo_block_t_text4"
                >{{ item.clickNum }}人观看</text
              >
            </view>
            <view
              class="svideo_main_block_b4 svideo_main_block_b40"
              :style="{
                borderRadius: [
                  0,
                  0,
                  decoItem.props.border_radius + 'px',
                  decoItem.props.border_radius + 'px',
                ],
              }"
            >
              <image
                class="video_bg"
                :style="{
                  borderRadius: [
                    0,
                    0,
                    decoItem.props.border_radius + 'px',
                    decoItem.props.border_radius + 'px',
                  ],
                }"
                :src="imgUrl + 'svideo/zx_v_bg' + (index + 1) + '.png'"
              ></image>
              <view class="svideo_main_block_b4_text">{{item.videoName}}</view>
            </view>
          </view>
        </block>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { skipTo } from "@/utils/common.js";
export default {
    name: "deco-short-video",
    components: {},
    props: {
    // 装修数据
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
        }
    }
};
</script>

<style lang="scss" scoped>
/* 短视频模块 */
/* 方案1 */
.svideo {
  background-color: #ffffff;
  box-sizing: border-box;
}

.svideo_title {
  width: 100%;
  
  color: #2d2d2d;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 20rpx 20rpx 20rpx;
  box-sizing: border-box;
}

.svideo_title_l {
  font-size: 32rpx;
  font-weight: bold;
}

.svideo_title_r {
  font-size: 26rpx;
  color: #666666;
  font-weight: 600;
}

.svideo_main {
  width: 100%;
  padding: 0 20rpx 20rpx;
  box-sizing: border-box;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
}

.svideo_main_block {
  border-radius: 16rpx;
  overflow: hidden;
  background-color: #3a4db8;
  position: relative;
  height: 345rpx;
  width: 345rpx;
}

.svideo_main_block_l {
  margin-left: 0;
}

.svideo_main_block_r {
  margin-right: 0;
}

.svideo_main_block_t {
  margin: 10rpx 0 0 10rpx;
  height: 36rpx;
  line-height: 36rpx;
  font-size: 20rpx;
  background: rgba(0, 0, 0, 0.2);
  padding-right: 10rpx;
  border-radius: 16rpx;
  position: relative;
  display: inline-block;
  display: flex;
  align-items: center;
}

.svideo_main_block_lt {
  height: 100%;
  font-size: 18rpx;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 3rpx 10rpx 3rpx 6rpx;
  border-radius: 0 0 16rpx 0;
  position: relative;
  display: flex;
  align-items: center;
}

.svideo_main_block_t0 {
  margin: 0 16rpx 16rpx 0;
  border-radius: 0rpx 0rpx 20rpx 0;
  padding: 5rpx 15rpx 5rpx 0rpx;
}

.svideo_block_t_img {
  width: 36rpx;
  height: 36rpx;
}
.svideo_person_num {
  width: 40rpx;
  height: 40rpx;
  border-radius: 0 0 50% 0;
}

.svideo_block_t_img0 {
  width: 24rpx;
  height: 24rpx;
  margin-left: 6rpx;
  margin-right: 7rpx;
}

.svideo_block_t_img1 {
  width: 22rpx;
  height: 22rpx;
}

.svideo_block_t_img2zb {
  margin-top: -1rpx;
  margin-left: 4rpx;
}

.svideo_block_t_img24 {
  margin-top: 1rpx;
}

.svideo_main_block_b {
  font-size: 26rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  position: absolute;
  bottom: 20rpx;
  padding: 0 20rpx;
  width: 100%;
}

.svideo_block_t_text2 {
  padding-left: 6rpx;
  font-size: 22rpx;
}

/* 方案2 */
.svideo_main2 {
  color: #ffffff;
  flex-direction: row;
  overflow: auto;
  flex-wrap: nowrap;
  width: auto;
  box-sizing: border-box;
  padding: 0 20rpx;
}

.svideo_main_block2 {
  margin: 0 20rpx 10rpx 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background-color: #3a4db8;
  position: relative;
  height: 224rpx;
  width: 224rpx;
  display: inline-block;
}

.svideo_main2_scroll {
  min-width: 100%;
}

.svideo_main_block_c2 {
  margin: 20rpx 0;
}

.svideo_main_block_l2 {
  margin-left: 0;
}

.svideo_main_block_b2 {
  font-size: 24rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  position: absolute;
  bottom: 0rpx;
  box-sizing: border-box;
  padding-left: 10rpx;
  padding-right: 8rpx;
  width: 100%;
  height: 40rpx;
  line-height: 40rpx;
  background-color: rgba(0, 0, 0, 0.3);
}

.svideo_main_block_b2_zb text {
  width: 85%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  display: inline-block;
}

/* 方案三 */
.svideo_main3 {
  color: #ffffff;
  flex-direction: row;
  overflow: hidden;
  flex-wrap: nowrap;
  width: auto;
}

// 短视频3d轮播
.swiper-block {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 346rpx;
  margin: 0;
}
.swiper-item {
  color: #fff;
  overflow: hidden;
  left: 40rpx !important;
  right: 20rpx;
  top: 20rpx;
  bottom: 20rpx;
  width: 80% !important;
  height: 280rpx !important;
  // transform: translate(80%, 0px) translateZ(0px);
}

.swiper-item1 {
  color: #fff;
  box-sizing: border-box;
  height: 346rpx;
  width: 346rpx !important;
  top: 0rpx;
  bottom: 0rpx;
  overflow: hidden;
  left: 80rpx;
}
.active1 {
  /* transform: scale(1.44); */
  transition: all 0.2s ease-in 0s;
  height: 100%;
  width: 100%;
  border-radius: 16rpx;
}

.active2 {
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
}

.svideo_main_block_b3 {
  font-size: 26rpx;
  background: rgba(1, 1, 1, 0.2);
  padding: 0 24rpx;
  color: #ffffff;
  border-radius: 24rpx;
  height: 100%;
}

.svideo_main_block_b3_w {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  bottom: 20rpx;
  right: 0;
  height: 48rpx;
  line-height: 48rpx;
}

/* 方案4  */
.svideo_main4 {
  color: #ffffff;
  flex-direction: row;
  overflow: auto;
  flex-wrap: nowrap;
  width: auto;
  padding: 0 20rpx;
}

.svideo_main_block4 {
  margin: 0 20rpx 20rpx 20rpx;
  margin-left: 0;
  border-radius: 16rpx;
  overflow: hidden;
  background-color: #3a4db8;
  position: relative;
  height: 300rpx;
  width: 300rpx;
  display: inline-block;
}

.scroll-view {
  width: 100%;
  white-space: nowrap;
}

.svideo_main_block_b4 {
  font-size: 24rpx;
  position: absolute;
  bottom: 0rpx;
  box-sizing: border-box;
  margin-left: 30rpx;
  margin-right: 30rpx;
  width: 100%;
  height: 90rpx;
  line-height: 110rpx;
  /* 换图片 */
}

.svideo_main_block_b4_text {
  position: absolute;
  left: 20rpx;
  top: 0;
  right: 20rpx;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  z-index: 683;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  box-sizing: border-box;
  margin-top: 16rpx;
  font-size: 24rpx;
}

.svideo_main_block_b40 {
  margin-left: 0;
  margin-right: 0;
}

.svideo_block_t_text4 {
  font-size: 20rpx;
}

/* -------------方案5--------- */
.svideo_main5 {
  width: 100%;
  color: #ffffff;
  display: flex;
  flex-direction: row;
  overflow: auto;
  flex-wrap: nowrap;
  width: auto;
  background-color: #f8f8f8;
  padding: 0 20rpx;
  box-sizing: border-box;
  justify-content: space-between;
}

.svideo_main_block5 {
  display: inline-block;
  border-radius: 16rpx;
  overflow: hidden;
  width: 345rpx;
}

.svideo_main_block50 {
  position: relative;
}

.svideo_block_bgimg0 {
  height: 274rpx;
  width: 346rpx;
}

.svideo5_b {
  background-color: #fff;
  height: 146rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.svideo5_b_title {
  width: 290rpx;
  color: #333333;
  font-size: 28rpx;
  font-weight: bold;
  margin-top: 16rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.svideo5_b_text {
  width: 290rpx;
  color: #666666;
  font-size: 26rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.svideo_block_t5_w {
  display: flex;
  justify-content: center;
  margin-top: 32rpx;
}

.svideo_block_t5 {
  margin: 16rpx;
  height: 32rpx;
  line-height: 34rpx;
  font-size: 20rpx;
  background-color: rgba(1, 1, 1, 0.7);
  padding: 0 20rpx;
  border-radius: 16rpx;
  position: relative;
  display: inline-block;
  color: #ffffff;
  opacity: 0.7;
  margin-bottom: 30rpx;
  z-index: 99;
}

.svideo_block_bgimg1_wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}

.svideo_block_bgimg1 {
  width: 230rpx;
  height: 230rpx;
  border-radius: 115rpx;
  overflow: hidden;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.svideo_block_bgimg2 {
  width: 40rpx;
  height: 40rpx;
}

.svideo_block_bgimg3 {
  position: absolute;
  width: 60rpx;
  height: 60rpx;
}

/* ------------- 直播列表/短视频列表*/
.svideo_main_block_zb {
  font-size: 26rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  position: absolute;
  bottom: 10rpx;
  padding: 0 20rpx;
  width: 80%;
}

.live_list_b {
  width: 346rpx;
  border-radius: 16rpx;
  overflow: hidden;
  margin: 10rpx 0 10rpx 0;
}

.live_list_b_img {
  width: 100%;
  height: 346rpx;
  overflow: hidden;
  position: relative;
}

.live_list_b_img_img {
  position: absolute;
  width: 346rpx;
  height: 346rpx;
}

.live_list_b_img_hua {
  position: absolute;
  width: 90rpx;
  height: 300rpx;
  right: 5rpx;
  bottom: 3rpx;
  z-index: 990;
}

.live_list_b_img_hua1 {
  bottom: 10rpx;
}

.live_list_b_text {
  font-size: 20rpx;
  color: #fff;
  margin-left: 30rpx;
}

.live_list_b_tip2 {
  padding: 4rpx 10rpx;
  height: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("http://site7.55jimu.com/data/upload/mall/store/goods/301/301_06506538074418754.jpg");
  /* 换地址，要用服务器地址 */
  border-radius: 16rpx;
  margin-left: 12rpx;
  margin-top: 10rpx;
  position: relative;
}

.live_list_img_bottom1 {
  font-size: 30rpx;
  padding: 10rpx 10rpx 4rpx 10rpx;
  color: #2d2d2d;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.live_list_main5 {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  overflow: auto;
  width: auto;
  justify-content: space-between;
  padding: 20rpx;
  background-color: #fff;
}

.live_list_text3 {
  border-radius: 15rpx;
  background-color: red;
  font-size: 22rpx;
  padding: 0 10rpx;
  color: #fff;
  line-height: 30rpx;
  position: absolute;
  right: -1rpx;
  top: 4rpx;
}

.live_list_text30 {
  background-color: #bcaefe;
}

.live_panic_buy3 {
  border: none;
  position: relative;
}

.live_panic_time_i {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  width: 35%;
  color: #9a9a9a;
  margin: 0 8rpx;
}

.live_panic_time_v {
  width: 60%;
}

.active_panic_time_img2 {
  width: 40rpx;
  height: 40rpx;
  margin-right: 5rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

/* ------ */
.active_panic_text2 {
  margin: 0 5rpx;
}

.active_top_tip20 {
  font-size: 22rpx;
  padding-top: 0;
  padding-bottom: 0;
  line-height: 30rpx;
}

.active .tab_nav_block_t {
  color: #fc1c1c;
  font-size: 30rpx;
  border-bottom: 2px solid #fc1c1c;
  font-weight: bold;
}

.active .tab_nav_block_i {
  color: #fc1c1c;
  font-size: 22rpx;
}

.video_bg {
  width: 100%;
  height: 100%;
  z-index: 99;
}

.video_bg1 {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-position: center center;
  // background-size: contain;
  background-size: cover;
  background-repeat: no-repeat;
}

.svideo_main_block_w {
  z-index: 99;
  position: absolute;
  top: 0;
  left: 0;
}

.svideo_main_block_sw {
  z-index: 3;
  position: absolute;
  top: 0;
  left: 0;
  width: 40rpx;
  height: 50rpx;
}

.svideo_main_block_lw {
  z-index: 3;
  position: absolute;
  top: 0;
  left: 0;
}

.video_bg3 {
  z-index: 3;
  position: absolute;
  top: 0;
  left: 0;
  width: 184px;
  height: 163px;
  // opacity: 0.2;
}

.svideo_main5 > view:nth-child(1) .svideo_bg_img {
  position: absolute;
  top: 0;
  left: 0;
  background: #b9e5ff;
  opacity: 0.7;
  width: 184px;
  height: 163px;
  z-index: 10;
}

.svideo_main5 > view:nth-child(2) .svideo_bg_img {
  position: absolute;
  top: 0;
  left: 0;
  background: #ffceb9;
  opacity: 0.7;
  width: 184px;
  height: 163px;
  z-index: 10;
}

.svideo2_wrap
  ::v-deep
  .uni-scroll-view
  ::v-deep
  .uni-scroll-view
  ::v-deep
  .uni-scroll-view-content
  > view:nth-last-child(1) {
  margin-right: 0 !important;
}

.svideo4_wrap
  ::v-deep
  .uni-scroll-view
  ::v-deep
  .uni-scroll-view
  ::v-deep
  .uni-scroll-view-content
  > view:nth-last-child(1) {
  margin-right: 0 !important;
}
</style>