<template>
  <view>
    <block v-if="!openState">
      <notOpen></notOpen>
    </block>
    <block v-else>
      <!-- #ifdef APP-PLUS -->
      <view class="fixed_top_bar"></view>
      <!-- #endif -->
      <view
        class="nav_label"
        :style="{ backgroundImage: 'url(' + bgImg + ')' }"
      >
        <view class="back_icon1" @click="goBack">
          <image :src="imgUrl + 'common/icon/return.png'" mode=""></image>
        </view>
        <scroll-view scroll-x class="nav" v-if="list.length">
          <view
            :class="'nav_item ' + (active == '0' ? 'on' : '')"
            @tap="changeNav"
            data-id="0"
          >
            <text>首页</text>
          </view>
          <view
            v-for="(item, index) in list"
            :key="index"
            :class="'nav_item ' + (active == item.labelId ? 'on' : '')"
            @tap="changeNav"
            :data-id="item.labelId"
          >
            <text>{{ item.labelName }}</text>
          </view>
        </scroll-view>
      </view>

      <view class="goods_list" v-if="goodsList.length">
        <navigator
          v-for="(item, index) in goodsList"
          :key="index"
          class="goods_item"
          :url="
            '/standard/product/detail?sku=' +
            item.sku +
            '&promotionId=' +
            item.groupId
          "
          hover-class="none"
        >
          <view class="item_left">
            <!-- <image :src="item.mainImage" mode="aspectFit"></image> -->
            <!-- <coverImage :src="item.mainImage" width="270" height="270"></coverImage> -->
            <view
              class="image"
              :style="'background-image:url(' + item.mainImage + ')'"
            ></view>
          </view>
          <view class="item_right">
            <view class="goods_name">
              <view class="goods_name_img">
                <image :src="icon" mode="widthFix"></image>
              </view>
              <text>{{ item.skuName }}</text>
            </view>
            <view class="goods_info">
              <!-- <view class="goods_price">
                  <text>￥<text>{{item.goods_price}}</text></text>
                  <text>已拼{{item.sales}}件</text>
                </view> -->
              <view class="price">
                <view class="small_price"
                  >￥<text class="big_price">{{
                    $getPartNumber(item.spellPrice, "int")
                  }}</text
                  >.<text class="small_price" style="margin-right: 10rpx">{{
                    $getPartNumber(item.spellPrice, "decimal").split(".")[1]
                  }}</text>
                </view>
                <text class="num"
                  >￥{{ $getPartNumber(item.productPrice, "int") }}
                  {{ $getPartNumber(item.productPrice, "decimal") }}</text
                >
              </view>
              <view class="group_now">
                <view
                  class="group_now_left"
                  :style="{
                    backgroundImage:
                      'url(' + imgUrl + 'activity/ladder_regiment.png)',
                  }"
                >
                  {{ $L("马上拼") }} ></view
                >
                <view class="group_now_right"
                  >{{ $L("已团") }}{{ item.saleNum }}{{ $L("件") }}</view
                >
              </view>
              <!-- <view class="goods_btn">去拼团
                  <image :src="imgUrl+'addons/ico_011.png'" mode="widthFix"></image>
                </view> -->
            </view>
          </view>
        </navigator>
      </view>
      <view class="empty" v-if="!goodsList.length && loading">
        <view class="img"></view>
        <text>{{ $L("暂无商品") }}</text>
      </view>
      <view class="top_wrap" v-show="isShowTopBtn == true">
        <image :src="topImg" mode="" @click="top"></image>
      </view>
      <!-- <common title="阶梯团"></common> -->
    </block>
  </view>
</template>

<script>
import goodsHandler from '@/components/goods/handler';
export default {
    data() {
        return {
            list: [],
            active: "0",
            goodsList: [],
            autoplay: true,
            interval: 5000,
            duration: 1000,
            indicatorDots: true,
            loading: false,
            imgUrl: getApp().globalData.imgUrl, //图片地址
            home_info: "",
            bgImg: getApp().globalData.imgUrl + "activity/ladder_bg.png",
            icon: getApp().globalData.imgUrl + "activity/icon2.png",
            topImg: getApp().globalData.imgUrl + "activity/top.png",
            isShowTopBtn: false,
            ifOnShow: false,
            openState: true
        };
    },

    components: {},
    props: {},
    mounted() {
        this.getClassList();
        // this.getIndexData();
        this.getGoodsList();
    },
    onLoad: function () {
    // this.getClassList();
    // // this.getIndexData();
    // this.getGoodsList()
    },

    onReachBottom() {
        if (this.hasmore) {
            this.getGoodsList();
        }
    },

    methods: {
        // 获取阶梯团分类
        getClassList() {
            let param = {};
            goodsHandler.getLadderList(param).then((res) => {
                if (res.state == 200) {
                    this.list = res.data.labelList;
                }
            });
        },

        // 获取商品列表
        getGoodsList() {
            let param = {
                labelId: this.active,
                current: this.pn
            };
            goodsHandler.getLadderList(param).then((res) => {
                if (res.state == 200) {
                    this.openState = true;
                    if (this.pn == 1) {
                        this.goodsList = res.data.goodsList;
                    } else {
                        this.goodsList = this.goodsList.concat(res.data.goodsList);
                    }
                    this.loading = true;
                    this.hasmore = this.$checkPaginationHasMore(res.data.pagination);
                    if (this.hasmore) {
                        this.pn++;
                    }
                } else if (res.state == 259) {
                    this.openState = false;
                }
            });
        },

        //
        changeNav(e) {
            let id = e.currentTarget.dataset.id;
            let { active } = this;
            if (active == id) {
                return;
            }
            this.active = id;
            this.loading = false;
            this.pn = 1;
            this.hasmore = true;
            this.getGoodsList();
        },
        // 获取滚动距离
        onPageScroll(e) {
            //根据距离顶部距离是否显示回到顶部按钮
            if (e.scrollTop > 600) {
                //当距离大于600时显示回到顶部按钮
                this.isShowTopBtn = true;
            } else {
                //当距离小于600时隐藏回到顶部按钮
                this.isShowTopBtn = false;
            }
        },
        // 回到顶部
        top() {
            uni.pageScrollTo({
                scrollTop: 0,
                duration: 300
            });
        },
        goBack() {
            this.$Router.back(1);
        }
    }
};
</script>
<style lang="scss">
page {
  background-color: #f5f5f5;
  padding-top: 80rpx;
  width: 750rpx;
  margin: 0 auto;
}

/* #ifdef H5 */
page {
  padding-top: 0rpx;
}

/* #endif */

.nav {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  z-index: 9999;
  background-size: 100% 100%;
}

.back_icon1 {
  display: flex;
  align-items: center;
  padding-left: 10rpx;

  image {
    width: 52rpx;
    height: 49rpx;
  }
}

/* #ifdef APP-PLUS */
.fixed_top_bar {
  width: 100%;
  height: var(--status-bar-height);
  background-color: #fff;
  position: fixed;
  top: 0;
  z-index: 9999;
}

/* #endif */

.nav_label {
  display: flex;
  position: relative;
  position: fixed;
  top: var(--titleBarFillHeight, 0px);
  /* #ifdef APP-PLUS */
  top: calc(var(--status-bar-height));
  /* #endif */
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 750rpx;
  height: 88rpx;
  z-index: 9999;
}

.nav_item {
  display: inline-block;
  line-height: 86rpx;
  text-align: center;
  color: #fff;
  font-size: 30rpx;
  padding: 0 30rpx;
  overflow: hidden;
}

.nav_item.on {
  font-weight: bold;
  font-size: 32rpx;
}

.goods_list {
  padding: 88rpx 20rpx 20rpx;
  /* #ifdef APP-PLUS */
  padding-top: var(--status-bar-height);
  /* #endif */
}

.goods_list .goods_item {
  width: 100%;
  height: 310rpx;
  display: flex;
  background-color: #fff;
  border-radius: 15rpx;
  box-sizing: border-box;
  margin-top: 20rpx;
  padding: 20rpx;
}

.goods_item .item_left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 270rpx;
  height: 270rpx;
  margin-right: 20rpx;
  border-radius: 15rpx;
  overflow: hidden;
}

.goods_item .item_left .image {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 270rpx;
  background-color: #f7f7f7;
  border-radius: 15rpx;
}

.goods_item .item_right {
  display: flex;
  min-height: 200rpx;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
}

.goods_item .item_right .goods_name {
  width: 370rpx;
  font-size: 28rpx;
  line-height: 44rpx;
  font-weight: 600;
  color: #2d2d2d;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin-top: -20px;
}

.goods_name_img {
  display: inline-block;
  box-sizing: border-box;
}

.goods_item .item_right .goods_name image {
  display: inline-block;
  width: 122rpx;
  height: 31rpx;
  margin-bottom: -5rpx;
  margin-right: 10rpx;
}

.item_right .goods_info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.goods_info .price {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #fc1c1c;
  margin-top: 20rpx;
  margin-right: 10rpx;
  position: absolute;
  bottom: 82rpx;
  left: 0;
}

.goods_info .small_price {
  font-size: 24rpx;
}

.goods_info .big_price {
  font-size: 34rpx;
}

/* .goods_info .goods_price>text:nth-child(1) {
  color: #EE1B21;
  font-size: 34rpx;
}

.goods_info .goods_price>text text{
  font-size: 50rpx;
}

.goods_info .goods_price text:nth-child(2) {
  color: #808080;
  font-size: 24rpx;
  margin-left: 30rpx;
  margin-top: 20rpx;
} */
.group_now {
  position: absolute;
  bottom: 10rpx;
  left: 0;
  width: 270rpx;
  height: 50rpx;
  line-height: 50rpx;
  border-radius: 25px;
  display: flex;
  align-items: center;
  border: 1rpx solid #ffa63d;
  box-sizing: border-box;
}

.group_now .group_now_left {
  font-size: 26rpx;
  color: #fff;
  width: 148rpx;
  text-align: center;
  border-radius: 25rpx 0 0 25rpx;
  /* background:#FE9A22; */
  background-size: 100% 100%;
  box-sizing: border-box;
  margin-left: -1rpx;
}

.group_now .group_now_right {
  width: 122rpx;
  text-align: center;
  font-size: 22rpx;
  color: #fe9a22;
  font-weight: 400;
  box-sizing: border-box;
}

.goods_info .price .num {
  font-weight: 500;
  color: #9a9a9a;
  font-size: 24rpx;
  text-decoration: line-through;
}

.goods_info .goods_btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 172rpx;
  height: 64rpx;
  border-radius: 32rpx;
  color: #fff;
  font-size: 28rpx;
  background: #ed6307;
}

.goods_info .goods_btn image {
  width: 10rpx;
  height: 18rpx;
  margin-left: 15rpx;
  transform: rotate(180deg);
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 70vh;
}

.empty .img {
  width: 256rpx;
  height: 256rpx;
  background: var(--emptyImg);
  background-size: 100% 100%;
}

.empty text {
  color: $main-third-color;
  font-size: 28rpx;
}

.top_wrap {
  position: fixed;
  right: 46rpx;
  bottom: 66rpx;
  width: 85rpx;
  height: 85rpx;
  left: 0;
  right: 0;
  margin: 0 auto;
  transform: translateX(286rpx);
}

.top_wrap image {
  width: 85rpx;
  height: 85rpx;
}
</style>
