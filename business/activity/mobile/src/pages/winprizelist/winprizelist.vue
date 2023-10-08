<!-- 我的奖品页面 -->
<template>
  <view class="container">
    <view class="prize_list" v-if="isLoaded">
      <view class="list_item" v-for="(item, index) in winPrizeList" :key="index" :winPrizeList="item">
        <view class="prize_img" style="width: 150rpx; height: 150rpx">
          <image :src="item.imgUrl" @load="loadImage" @error="errImage"
            style="width: 150rpx; height: 150rpx; border-radius: 10rpx"></image>
        </view>
        <view class="prize_info">
          <view class="prize_name">
            {{ `${item.prizeName}` }}
          </view>
          <view class="prize_time">中奖时间：{{ item.createTime | prize_time }}
          </view>
        </view>
        <view class="award">
          <view :id="item.id" class="unreceive" v-if="item.state == 1" @click="checkPrizeDetail">去领奖
            <image :src="imgUrl + 'winPrizeList/btn_common_rightarrow_white.svg'"></image>
          </view>
          <view v-if="item.state == 2">
            <image class="received" style="width: 120rpx; height: 120rpx"
              :src="imgUrl + 'winPrizeList/icon_common_yilingjiang.svg'" @click="checkPrizeDetail" :id="item.id">
            </image>
          </view>
        </view>
      </view>
      <!-- loading -->
      <loadingState v-if="
        loadingState != 'first_loading' || loadingState == 'first_loading'
      " :state="loadingState" stateColor="#aaa" loadingImg="icon_common_wprocess.png"
        :class="loadingState == 'first_loading' ? 'change' : 'noChange'" mTop="500rpx" />
    </view>
    <!-- 奖品信息为空的缺省页 -->
    <view v-else class="emptyBox">
      <image class="emptyImg" :src="this.imgUrl + 'images/icon_defpage_zwnr.png'" mode="widthFix" />
      <view>未查询到抽奖品信息</view>
    </view>
  </view>
</template>
<script>
import {
  myWinList,
  checkPaginationHasMore,
  getPrizeDetailByRecordId,
} from "@/common/lib/handler.js";
import loadingState from "@/components/loading/loading.vue";
import { throttle, setDefaultImage } from "@/utils/common.js";

export default {
  name: "prizeList",
  components: {
    loadingState,
    checkPaginationHasMore,
  },
  data() {
    return {
      imgUrl: getApp().globalData.imgUrl,
      activityId: "",
      isLoading: true,
      loadImageFlag: false,
      winPrizeList: [], //奖品列表
      pageIndex: 1,
      pageSize: 10,
      total: "",
      pageCount: "",
      id: "",
      winCertificate: "",
      hasmore: true, //是否还有数据
      loadingState: "first_loading",
      hasMore: true, //是否还有数据
      isLoaded: true,
      openType: false, // 该页面打开方式，true 标识扫码打开，如果为扫自己保存的凭证打开则不显示保存凭证按钮
    };
  },
  onLoad({ activityId }) {
    this.activityId = activityId;
    this.channelId = getApp().globalData.userParams.channelId;
  },
  onShow() {
    this.getPrizeList();
  },
  mounted() {
    this.pageIndex = 1;
    this.loadingState = "first_loading";
  },
  methods: {
    // 图片加载是否完毕
    loadImage(e) {
      this.loadImageFlag = true;
    },
    // 图片加载失败
    errImage() {
      this.loadImageFlag = false;
    },
    // 获取奖品列表信息
    getPrizeList() {
      let params = {
        pagesize: this.pageSize,
        pageIndex: this.pageIndex,
        activityId: this.activityId,
      };
      this.loadingState =
        this.loadingState == "first_loading" ? this.loadingState : "loading";
      myWinList(params)
        .then((res) => {
          if (res.resultCode == 0) {
            if (!res.result.list) {
              this.isLoaded = false;
              return;
            } else {
              res.result.list.forEach((item) => setDefaultImage(item));
            }
            if (this.pageIndex == 1) {
              this.winPrizeList = res.result.list;
            } else {
              this.winPrizeList = this.winPrizeList.concat(res.result.list);
            }
            this.hasMore = checkPaginationHasMore(
              res.result.pageIndex,
              res.result.pageSize,
              res.result.total
            ); //是否还有数据
            if (this.hasMore) {
              this.pageIndex++;
              this.loadingState = "allow_loading_more";
            } else {
              this.loadingState = "no_more_data";
            }
          } else {
            this.loadingState = "";
            this.isLoaded = false;
          }
        })
        .catch((e) => {
          console.log(e);
          uni.showToast({
            title: "获取奖品信息失败",
            icon: "none",
          });
        });
    },
    //uniapp页面生命周期函数页面滚动到底部的事件
    onReachBottom() {
      if (this.hasMore == false) {
      } else {
        this.getPrizeList();
      }
    },
    // 根据id获取奖品详情
    checkPrizeDetail(e) {
      throttle(() => {
        getPrizeDetailByRecordId({ id: e.target.id })
          .then((res) => {
            let url = "";
            if (res.resultCode == 0) {
              if (res.result.winCertificate) {
                const winCertificate = res.result.winCertificate;
                url = `/pages/redeem-page/redeem-page?winCertificate=${winCertificate}&activityId=${this.activityId}`;
                uni.navigateTo({ url });
              }
            }
          })
          .catch((e) => {
            console.log(e);
            uni.showToast({
              title: "获取奖品信息失败",
              icon: "none",
            });
          });
      });
    },
  },
  filters: {
    prize_time(el) {
      // 时间截取到天
      return el.length > 10 ? `${el.slice(0, 10)}` : el;
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  .prize_list {
    margin: 20rpx 30rpx 0px 30rpx;

    .list_item {
      position: relative;
      margin: 20rpx 0rpx 0rpx 0rpx;
      padding: 20rpx;
      border-radius: 20rpx;
      background: #fff;
      display: flex;
      align-items: center;

      .prize_info {
        height: 150rpx;
        width: 100%;
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .prize_name {
          font-size: 28rpx;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          word-break: break-all;
        }

        .prize_time {
          font-size: 24rpx;
          align-items: center;
          display: flex;
          justify-content: space-between;
          color: #999999;
          font-weight: lighter;
          margin-bottom: 25rpx;
        }
      }

      .award {
        position: absolute;

        .unreceive {
          width: 100%;
          display: flex;
          flex-direction: row;
          font-size: 28rpx;
          padding: 10rpx 20rpx;
          border-radius: 40rpx;
          margin-top: 30rpx;
          justify-content: center;
          align-items: baseline;
          color: #fff;
          position: relative;
          top: 35rpx;
          left: 515rpx;
          // background: #ff2c25;
          background: radial-gradient(#f60000, #ff0000);

          image:first-child {
            width: 20rpx;
            height: 20rpx;
          }

          image:last-child {
            width: 20rpx;
            height: 20rpx;
          }

          text {
            margin: 0 4rpx 0 8rpx;
            font-size: 28rpx;
            font-weight: bold;
            color: #ffffff;
          }
        }

        .received {
          top: 45rpx;
          left: 550rpx;
        }
      }
    }
  }

  .emptyBox {
    background-color: #fff;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 200rpx;

    .emptyImg {
      width: 280rpx;
      height: 280rpx;
    }

    view {
      text-align: center;
      font-size: PingFangSC;
      color: #999;
      margin-top: 40rpx;
    }
  }
}
</style>