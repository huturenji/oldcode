<template>
  <view class="store_introduction">
    <view class="content">
      <view
        class="store_con"
        :style="
          'background-image:url( ' +
          store_banner +
          ');background-size:100% 100%;background-repeat:no-repeat'
        "
      >
        <!--  店铺详情  -->
        <view class="info_left" v-if="vender_detail">
          <image
            class="avat"
            :src="vender_detail.storeLogoUrl"
            mode="aspectFill"
          ></image>
          <view class="info_des">
            <view class="info_top">
              <text>{{ vender_detail.storeName }}</text>
              <text v-if="vender_detail.isOwnShop == 1">{{ $L("自营") }}</text>
            </view>
            <!-- 暂时屏蔽 -->
            <view class="info_bot" v-if="false">
              <image :src="imgUrl + 'goods/renqizhi.png'"></image>
              <text>人气：{{ vender_detail.followNumber }}</text>
            </view>
          </view>
        </view>
        <!-- 店铺二维码 -->
        <view class="store_code">
          <view class="store_code_top">
            <text>{{ $L("店铺二维码") }}</text>
            <image
              :src="imgUrl + 'goods/erweima.png'"
              @tap="handleShare"
            ></image>
          </view>
          <view class="store_code_des">
            <view class="des_pre">
              <text>{{ $L("描述相符") }}</text>
              <text>{{
                vender_detail.descriptionScore
                  ? vender_detail.descriptionScore
                  : ""
              }}</text>
            </view>
            <view class="des_pre">
              <text>{{ $L("服务态度") }}</text>
              <text>{{
                vender_detail.serviceScore ? vender_detail.serviceScore : ""
              }}</text>
            </view>
            <view class="des_pre">
              <text>{{ $L("发货速度") }}</text>
              <text>{{
                vender_detail.deliverScore ? vender_detail.deliverScore : ""
              }}</text>
            </view>
          </view>
        </view>
        <!-- 公司相关 -->
        <view class="company_related">
          <view class="related_pre">
            <text>{{ $L("公司名称") }}</text>
            <text>{{
              vender_detail.companyName ? vender_detail.companyName : "--"
            }}</text>
          </view>
          <view class="related_pre">
            <text>{{ $L("公司所在地") }}</text>
            <text>{{
              vender_detail.address ? vender_detail.address : "--"
            }}</text>
          </view>
          <view class="related_pre">
            <text>{{ $L("开店时间") }}</text>
            <text>{{
              vender_detail.createTime ? vender_detail.createTime : "--"
            }}</text>
          </view>
          <view class="related_yewu">
            <text>{{ $L("主营商品") }}</text>
            <text>{{
              vender_detail.mainBusiness ? vender_detail.mainBusiness : "--"
            }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 遮罩层 -->
    <view
      class="mask"
      catchtouchmove="preventTouchMove"
      v-if="modalDlg"
      @tap="close"
    ></view>
    <!-- 二维码分享弹框 -->
    <view class="modalDlg" v-if="modalDlg">
      <text>{{ vender_detail.storeName }}</text>
      <text>{{ $L("邀请好友来扫一扫分享店铺给TA") }}</text>
      <image
        :src="'data:image/png;base64,' + vender_detail.storeQRCode"
      ></image>
    </view>
  </view>
</template>

<script>
export default {
    data() {
        return {
            bid: "",
            vid: "",
            store_list: [],
            vender_detail: "",
            //店铺详情
            modalDlg: false,
            //模态框
            imgUrl: getApp().globalData.imgUrl,
            //图片地址
            store_banner: "", //店铺首页banner图
            city_site_open: "",
            searchList: [],
            show: false
        };
    },

    components: {},
    props: {},
    mounted() {
        this.vid = this.$Route.query.vid;
        this.$bbcStatEvent({ behaviorType: "spv", storeId: this.vid });
        this.venderDetail(); //店铺详情
    },
    methods: {
    // 商铺详情
        venderDetail() {
            let that = this;
            let { vid } = that;
            if (vid) {
                let param = {};
                param.data = {};
                param.data.storeId = vid;
                param.url = "v3/seller/front/store/detail";
                this.$request(param)
                    .then((res) => {
                        if (res.state == 200) {
                            let vender_detail = res.data;
                            this.vender_detail = vender_detail;
                            this.store_banner = vender_detail.storeBackdropUrl;
                        } else {
                            this.$api.msg(res.msg);
                        }
                    })
                    .catch(() => {
                        //异常处理
                    });
            }
        },

        //点击二维码分享
        handleShare() {
            this.modalDlg = true;
        },

        // 禁止屏幕滚动
        preventTouchMove: function () {},

        //关闭弹框
        close() {
            this.modalDlg = false;
        },

        back() {
            // (this.searchList = []), (this.show = false);
            this.searchList = [];
            this.show = false;
            this.searchPn = 1;
            this.search_hasmore = true;
        }
    }
};
</script>
<style>
.store_introduction {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}
.content {
  width: 751rpx;
  height: 100%;
  background-size: 100%;
  background: #f5f5f5;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.store_top {
  width: 100%;
  height: 47rpx;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 18rpx;
  box-sizing: border-box;
  position: fixed;
  top: 0;
}
.store_top text {
  font-size: 36rpx;
  
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 32rpx;
}
.store_top image {
  width: 48rpx;
  height: 40rpx;
  margin-left: 239rpx;
}
.store_con {
  width: 100%;
  height: 566rpx;
  padding-top: 40rpx;
  background: #f8f8f8;
  padding-left: 21rpx;
  box-sizing: border-box;
}
.info_left {
  width: 100%;
  display: flex;
  align-items: center;
}
.info_left .avat {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 16rpx;
}
.info_des {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: space-between;
}
.info_top {
  display: flex;
  align-items: center;
}
.info_top text:nth-of-type(1) {
  font-size: 30rpx;
  
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  line-height: 32rpx;
  margin-right: 20rpx;
}
.info_top image {
  width: 40rpx;
  height: 40rpx;
  margin-right: 14rpx;
}
.info_top text:nth-of-type(2) {
  min-width: 60rpx;
  min-height: 30rpx;
  background: rgba(252, 28, 28, 1);
  border-radius: 15rpx;
  font-size: 24rpx;
  
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 30rpx;
  text-align: center;
  padding: 4.4rpx 6rpx;
}
.info_bot {
  display: flex;
  align-items: center;
  margin-top: 13rpx;
}
.info_bot image {
  width: 40rpx;
  height: 40rpx;
  margin-right: 8rpx;
}
.info_bot text {
  font-size: 24rpx;
  
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 32rpx;
}
.store_code {
  width: 710rpx;
  height: 283rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 15rpx;
  margin: 30rpx 0 20rpx;
}
.store_code_top {
  /* width: 100%; */
  height: 89rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #f2f2f2;
  border-radius: 15rpx 15rpx 0 0;
}
.store_code_top text {
  font-size: 28rpx;
  
  font-weight: bold;
  color: rgba(45, 45, 45, 1);
  line-height: 32rpx;
}
.store_code_top image {
  width: 35rpx;
  height: 35rpx;
}
.store_code_des {
  width: 100%;
  height: 193rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 25rpx 0;
  box-sizing: border-box;
}
.des_pre {
  display: flex;
  align-items: center;
  padding-left: 20rpx;
  box-sizing: border-box;
}
.des_pre text:nth-child(1) {
  font-size: 26rpx;
  
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
  line-height: 32rpx;
}
.des_pre text:nth-child(2) {
  font-size: 26rpx;
  
  font-weight: 500;
  color: #fe811c;
  line-height: 32rpx;
  margin-left: 200rpx;
}
.company_related {
  width: 710rpx;
  /* height:476rpx; */
  padding-bottom: 29rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 15rpx;
}
.related_pre {
  /* width: 100%; */
  /* height: 89rpx; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 20rpx;
  padding-right: 20rpx;
  padding-top: 30rpx;
  padding-bottom: 30rpx;
  box-sizing: border-box;
  border-bottom: 1rpx solid #f2f2f2;
  white-space: nowrap;
}
.related_pre text:nth-child(1) {
  font-size: 28rpx;
  
  font-weight: bold;
  color: rgba(45, 45, 45, 1);
  line-height: 32rpx;
}
.related_pre text:nth-child(2) {
  font-size: 26rpx;
  
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  line-height: 32rpx;
  width: 500rpx;
  /* white-space: nowrap; */
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  text-align: right;
}
.related_yewu {
  display: flex;
  flex-direction: column;
  padding: 0 20rpx;
  box-sizing: border-box;
}
.related_yewu text:nth-child(1) {
  font-size: 28rpx;
  
  font-weight: bold;
  color: rgba(45, 45, 45, 1);
  line-height: 32rpx;
  display: flex;
  height: 88rpx;
  padding: 32rpx 0 0 0;
  box-sizing: border-box;
}
.related_yewu text:nth-child(2) {
  font-size: 26rpx;
  
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  line-height: 36rpx;
}
.mask {
  width: 750rpx;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  background: #000;
  z-index: 9000;
  opacity: 0.5;
}
/* 弹出层 */
.modalDlg {
  width: 620rpx;
  height: 650rpx;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(187, 187, 187, 1);
  border-radius: 15px;
  position: fixed;
  top: 359rpx;
  left: 0;
  right: 0;
  z-index: 9999;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modalDlg text:nth-child(1) {
  font-size: 30rpx;
  
  font-weight: bold;
  color: rgba(45, 45, 45, 1);
  line-height: 32rpx;
  margin: 48rpx 0 20rpx;
}
.modalDlg text:nth-child(2) {
  font-size: 26rpx;
  
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
  line-height: 32rpx;
}
.modalDlg image {
  width: 388rpx;
  height: 389rpx;
  margin-top: 59rpx;
}
</style>
