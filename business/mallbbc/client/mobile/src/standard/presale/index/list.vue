<template>
    <view>
        <block v-if="!openState">
           <notOpen></notOpen>
        </block>
        <block v-else>
            <!-- #ifdef APP-PLUS -->
            <view class="fixed_top_bar"></view>
            <!-- #endif -->
            <view class="nav_label" :style="{backgroundImage:'url('+ bgImg +')'}">
                <view class="back_icon1" @click="goBack">
                    <image :src="img_url+'common/icon/return.png'" mode=""></image>
                </view>
                <scroll-view scroll-x class="nav" v-if="labelList.length" >
                 <view class="nav_item" @tap="changeNav(0)" :class="{on:curPresellLabelId == 0}">
                     <text>{{$L('首页')}}</text>
                 </view>
                  <view v-for="(item, index) in labelList" :key="index"
                      :class="'nav_item ' + (curPresellLabelId==item.presellLabelId?'on':'')"
                      @tap="changeNav(item.presellLabelId)">
                      <text>{{item.presellLabelName}}</text>
                  </view>
                </scroll-view>
            </view>
            <view class="goods_list" v-if="goodsList.length">
                <navigator v-for="(item, index) in goodsList" :key="index" class="goods_item"
                    :url="'/standard/product/detail?sku=' + item.sku + '&type=presale'" hover-class="none">
                    <view class="item_left">
                        <!-- <coverImage :src="item.mainImage" class="image"></coverImage> -->
                        <view class="image" :style="'background-image:url('+item.mainImage+')'"></view>
                    </view>
                    <view class="item_right">
                        <text class="goods_name">{{item.skuName}}</text>
                        <view class="goods_info">
                            <view class="goods_price">
                                <view class="now_price">
                                    <text class="small_price">￥</text>
                                    <text class="big_price">{{filters.toSplit(filters.toFix(item.presellPrice))[0]}}.</text>
                                    <text
                                        class="small_price">{{filters.toSplit(filters.toFix(item.presellPrice))[1]}}</text>
                                </view>
                                <view class="old_price">￥{{item.productPrice}}</view>
                            </view>
                        </view>
                        <view class="presale_btn_wrap">
                            <view class="presale_num_wrap">
                                <image :src="iconImg" mode="" class="iconImg"></image>
                                <text>{{$L('已预定')}}{{item.saleNum}}人</text>
                            </view>
                            <view class="goods_btn">{{$L('立即预定')}}</view>
                        </view>
                    </view>
                </navigator>
            </view>
            <loadingState v-if="loadingState == 'first_loading'||goodsList.length > 0" :state='loadingState' />
            <view class="empty" v-if="!goodsList.length && loading">
                <view class="img"></view>
                <text>{{$L('暂无商品')}}</text>
            </view>
            <view class="top_wrap" v-show="isShowTopBtn == true">
                <image :src="topImg" mode="" @click="top"></image>
            </view>
            <common title="预售" :gids="gids" v-if="gids.length"></common>
        </block>
    </view>
</template>
<script module="filters" lang="wxs" src="../../../utils/filter.wxs"></script>
<script>
    import goodsHandler from '@/components/goods/handler';
    import loadingState from "@/components/loading/loading.vue";
    import notOpen from '@/components/empty'
    const app = getApp();
    export default {
        data() {
            return {
                list: [],
                active: '0',
                autoplay: true,
                interval: 5000,
                duration: 1000,
                indicatorDots: true,
                img_url: app.globalData.imgUrl,
                loading: false,
                home_info: "",
                pn: 1,
                hasmore: true,
                isShowTopBtn: false,
                bgImg: getApp().globalData.imgUrl + 'activity/presale_bg.png',
                iconImg: getApp().globalData.imgUrl + 'activity/icon4.png',
                topImg: getApp().globalData.imgUrl + 'activity/top.png',
                gids: [],
                current: 1,
                pageSize: 10,
                labelList: [],
                goodsList: [],
                curPresellLabelId: 0, //当前选中的labelId
                loadingState: 'first_loading',
                openState: true
            };
        },

        components: {
            loadingState,
            notOpen
        },
        props: {},
        mounted(){
            this.getPreSaleList();
        },
        onLoad: function (options) {
            // this.getPreSaleList();
        },

        onReachBottom() {
            if (this.hasmore) {
                this.getPreSaleList();
            }
        },

        methods: {
            //获取预售列表
            getPreSaleList() {
                let that = this;
                let param = {};
                param.current = that.current;
                param.pageSize = that.pageSize;
                param.labelId = that.curPresellLabelId;
                that.loadingState = that.loadingState == 'first_loading' ? that.loadingState : 'loading';
                goodsHandler.getPreSaleList(param).then(res => {
                    if (res.state == 200) {
                        this.loading = true
                        this.openState = true
                        let result = res.data;
                        that.labelList = result.labelList;
                        if (that.current == 1) {
                            that.goodsList = result.goodsList;
                        } else {
                            that.goodsList = that.goodsList.concat(result.goodsList);
                        }
                        that.hasMore = that.$checkPaginationHasMore(res.data.pagination);
                        if (that.hasMore) {
                            that.current++;
                            that.loadingState = 'allow_loading_more';
                        } else {
                            that.loadingState = 'no_more_data';
                        }
                    } else if (res.state == 259) {
                        this.openState = false
                    } else {
                        that.$api.msg(res.msg);
                    }
                }).catch((e) => {
                    //异常处理
                })
            },
            bigPrice(val) {
                return val.split('.')[0]
            },
            smallPrice(val) {
                return val.split('.')[1]
            },
            changeNav(presellLabelId) {
                let that = this;
                that.curPresellLabelId = presellLabelId;
                that.current = 1;
                that.getPreSaleList();
            },
            // 获取滚动距离
            onPageScroll(e) { //根据距离顶部距离是否显示回到顶部按钮
                if (e.scrollTop > 600) { //当距离大于600时显示回到顶部按钮
                    this.isShowTopBtn = true
                } else { //当距离小于600时隐藏回到顶部按钮
                    this.isShowTopBtn = false
                }
            },
            // 回到顶部
            top() {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                })
            },
            goBack(){
                this.$Router.back(1)
            }
        }
    };
</script>
<style lang="scss">
    /* addons/pages/presaleIndex.wxss */
    page {
        background-color: #F5F5F5;
        padding-top: 82rpx;
        width: 750rpx;
        margin: 0 auto;
    }

    /* #ifdef H5 */
    page {
        padding-top: 0rpx;
    }

    /* #endif */
    /* #ifdef APP-PLUS */
    .fixed_top_bar{
        width: 100%;
        height: var(--status-bar-height);
        background-color: #fff;
        position: fixed;
        top: 0;
        z-index: 9999;
    }
    /* #endif */
    
    
    .nav_label{
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
    
    
    .nav {
        height: 88rpx;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        z-index: 9999;
        right: 0;
        margin: 0 auto;
    }
    
    .back_icon1{
        display: flex;
        align-items: center;
        padding-left: 10rpx;
        image{
            width: 52rpx;
            height: 49rpx;
        }
    }

    .nav_item {
        display: inline-block;
        line-height: 86rpx;
        text-align: center;
        color: #fff;
        font-size: 30rpx;
        padding: 0 20rpx;

    }

    .nav_item.on {
        font-size: 30rpx;
    }

    .nav_item.on text {
        font-weight: bold;
        font-size: 32rpx;
        display: inline-block;
        padding: 0 10rpx;
        line-height: 50rpx;
    }

    .goods_list {
        padding: 0 20rpx;
        background-color: white;
        /* #ifdef APP-PLUS */
        padding-top: var(--status-bar-height);
        /* #endif */
        /* #ifdef H5 */
        padding-top: 88rpx;
        /* #endif */
    }

    .goods_list .goods_item {
        height: 334rpx;
        display: flex;
        align-items: center;
        border-bottom: 1rpx solid #F2F2F2;
    }

    .goods_list navigator:nth-last-child(1) {
        border-bottom: none;
    }

    .goods_item .item_left {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 294rpx;
        height: 294rpx;
    }

    .goods_item .item_left .image {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        width: 294rpx;
        height: 294rpx;
        border-radius: 15rpx;
    }

    .goods_item .item_right {
        flex: 1;
        display: flex;
        min-height: 200rpx;
        flex-direction: column;
        margin-left: 20rpx;
        justify-content: space-between;
        height: 100%;
        padding-bottom: 20rpx;
        box-sizing: border-box;
        position: relative;
    }

    .goods_item .item_right .goods_name {
        margin-top: 43rpx;
        font-size: 28rpx;
        color: #2D2D2D;
        font-weight: 600;
        line-height: 142%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .item_right .goods_info {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .goods_info .goods_price {
        display: flex;
        align-items: flex-end;
        position: absolute;
        bottom: 100rpx;
    }

    .now_price {
        color: #FE006D;
        font-weight: bold;
    }

    .now_price .small_price {
        font-size: 24rpx;
    }

    .now_price .big_price {
        font-size: 34rpx;
    }

    .goods_price .old_price {
        color: #999;
        font-size: 24rpx;
        text-decoration: line-through;
        margin-left: 10rpx;
        padding-bottom: 4rpx;
    }

    .presale_btn_wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50rpx;
        color: #333;
        font-size: 24rpx;
        border-radius: 25rpx;
        position: absolute;
        bottom: 40rpx;
        left: 0;
    }

    .presale_num_wrap {
        display: flex;
        align-items: center;
        height: 46rpx;
        color: #333333;
        font-size: 25rpx;
        border-radius: 25rpx 0 0 25rpx;
        border: 1rpx solid #A92DC9;
        padding-right: 40rpx;
        padding-left: 20rpx;
        white-space: nowrap;
    }

    .presale_num_wrap .iconImg {
        width: 29rpx;
        height: 34rpx;
        margin-right: 10rpx;
    }

    .goods_btn {
        min-width: 140rpx;
        height: 50rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0 25rpx 25rpx 25rpx;
        color: #fff;
        font-size: 26rpx;
        background: linear-gradient(90deg, #EC0093 0%, #FF085B 100%);
        margin-left: -30rpx;
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
        margin-bottom: 30rpx;
        background: var(--emptyImg);
        background-size: 100% 100%;
    }

    .empty text {
        color: #999;
        font-size: 28rpx;
    }

    .top_wrap {
        position: fixed;
        right: 46rpx;
        bottom: 66rpx;
        width: 85rpx;
        height: 85rpx;
    }

    .top_wrap image {
        width: 85rpx;
        height: 85rpx;
    }
</style>