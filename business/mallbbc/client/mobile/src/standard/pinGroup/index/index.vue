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
                <scroll-view class="nav-container" scroll-x>
                    <view :class="'item ' + (tid==0?'on':'')" data-id="0" @tap="changeNav">{{$L("首页")}}</view>
                    <view v-for="(item, index) in NavData" :key="index" :class="'item ' + (tid==item.spellLabelId?'on':'')" :data-id="item.spellLabelId"
                     @tap="changeNav">{{item.spellLabelName}}</view>
                </scroll-view>
            </view>
            
            <view class="goods-list" v-if="goodsList.length" :style="'padding-bottom:'+bottomSateArea">
                <view v-for="(item, index) in goodsList" :key="index" class="item">
                    <view class="goods-list-top">
                        <view class="img">
                            <view class="image" :style="'background-image:url('+item.mainImage+')'"></view>
                        </view>
            
                        <view class="goods-info">
                            <view class="info">
                                <view class="goods_nameBox">
                                    <text class="goods_nameText">{{item.skuName}}</text>
                                </view>
                            <!--     <view class="p">已参与{{item.incom_num}}人</view> -->
                                <view class="goods_price_wrap">
                                    <view class="now_price">
                                        <text class="small_price">￥</text><text class="big_price">{{item.spellPrice.toFixed(2).toString().split('.')[0]}}.</text><text
                                         class="small_price">{{item.spellPrice.toFixed(2).toString().split('.')[1]}}</text>
                                    </view>
                                    <view class="old_price">￥{{item.productPrice}}</view>
                                </view>
                                <navigator :url="'/standard/product/detail?sku=' + item.sku + '&promotionId='+item.spellId" hover-class="none">
                                    <view class="group_num_wrap">
                                        <image :src="iconImg" mode="" class="iconImg"></image>
                                        <text>{{item.requiredNum}}{{$L("人团")}}</text>
                                        <view class="go_to_group">{{$L("去拼团")}}</view>
                                    </view>
                                    
                                
                                </navigator>
                            </view>
                        </view>
                    </view>
            
                    <view class="activity-info">
                        <image :src="saveImg" mode="" class="save_img"></image>
                        <text class="group_bottom_text">{{$L("拼团购买立省")}}{{item.spellDiscount}}<block v-if="item.leaderDiscount!=0">,{{$L("团长优惠")}}{{item.leaderDiscount}}{{$L("元")}}</block>;{{$L("单独购买价")}}{{item.productPrice}}</text>
                    </view>
                </view>
            </view>
            
            <view class="empty" v-if="!goodsList.length && isLoading">
                <view class="img">
                </view>
                <view class="tip">{{$L("暂无商品")}}</view>
                <text>{{$L("选择其他分类试试吧!")}}</text>
            </view>
            
            <view class="top_wrap" v-show="isShowTopBtn == true">
                <image :src="topImg" mode="" @click="top"></image>
            </view>
        </block>
    </view>
</template>

<script>
import notOpen from '@/components/empty'
import goodsHandler from '@/components/goods/handler';
export default {
    data() {
        return {
            key: '',
            tid: '',
            isLoading: false,
            NavData: "",
            goodsList: "",
            pn: 1,
            hasmore: true,
            img_url: getApp().globalData.imgUrl,
            bgImg: getApp().globalData.imgUrl + 'activity/group_bg.png',
            iconImg: getApp().globalData.imgUrl + 'activity/icon.png',
            saveImg: getApp().globalData.imgUrl + 'activity/save.png',
            topImg: getApp().globalData.imgUrl + 'activity/top.png',
            isShowTopBtn: false,
            bottomSateArea: 0, //iphone手机底部一条黑线的高度
            gids: [],
            openState:true
        };
    },

    components: {
        notOpen
    },
    props: {},
    mounted(){
        this.initData();
    },
    onLoad: function() {
        // this.initData();
    },

    onReachBottom() {
        if (this.hasmore) {
            this.getList();
        }
    },

    methods: {
        initData() {
            this.getNavData();
            this.getList();
        },

        getNavData() {
            let param ={};
            goodsHandler.getSpellList(param).then(res=>{
                if (res.state==200){
                    this.isLoading = true    
                    this.NavData = res.data.labelList
                }
            })
        },

        getList() {
            let param = {
                labelId:this.tid,
                current:this.pn
            }
            goodsHandler.getSpellList(param).then(res=>{
                if (res.state == 200){
                    this.openState = true
                    if (this.pn==1){
                        this.goodsList = res.data.goodsList
                    } else {
                        this.goodsList = this.goodsList.concat(res.data.goodsList)
                    }
                    this.loading = true
                    this.hasmore = this.$checkPaginationHasMore(res.data.pagination)
                    if (this.hasmore){
                        this.pn++
                    }
                } else if (res.state==259){
                    this.openState = false
                }
            })
        },

        changeNav(e) {
            let newTid = e.currentTarget.dataset.id;
            let {
                tid
            } = this;
            if (newTid == tid) { return; }
            this.pn = 1;
            this.hasmore = true;
            this.tid = newTid
                
            this.getList();
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
            });
        },
        goBack(){
            this.$Router.back(1)
        } 
    }
};
</script>
<style lang="scss">
    /* integral/activity/pin_index/pin_index.wxss */

    page {
        // background-color: #f5f5f5;
        padding-top: 90rpx;
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

    .nav-container {
        white-space: nowrap;
        z-index: 999;
        background-size: 100% 100%;
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

    .nav-container .item {
        display: inline-block;
        color: #fff;
        font-size: 30rpx;
        margin: 0 30rpx;
        line-height: 40rpx;
        margin-top: 25rpx;

    }

    .nav-container .item.on {
        font-weight: bold;
        font-size: 32rpx;
        padding-bottom: 8rpx;
        box-sizing: border-box;
    }

    .goods-list {
        padding: 88rpx 20rpx;
        /* #ifdef APP-PLUS */
        padding-top: var(--status-bar-height);
        /* #endif */
        
        
    }

    .goods-list .item {
        height: 382rpx;
        display: flex;
        flex-direction: column;
        border-radius: 15rpx;
        box-sizing: border-box;
        background-color: #fff;
        font-size: 24rpx;
        color: #999;
        margin-top: 20rpx;
        padding: 20rpx 20rpx 0 20rpx;
    }

    .goods-list-top .img {
        position: relative;
        width: 270rpx;
        height: 270rpx;
        margin-right: 20rpx;
        background-color: #f8f8f8;
        border-radius: 15rpx;
    }

    .img .image {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        width: 270rpx;
        height: 270rpx;
        border-radius: 15rpx;
    }

    .img .activity-info {
        position: absolute;
        bottom: 30rpx;
        left: 30rpx;
        width: 120rpx;
        height: 80rpx;
        background-color: #EF1B21;
        border-radius: 4rpx;
        color: #fff;
        line-height: 30rpx;
        text-align: center;
    }

    .goods-list .item {
        display: flex;
        flex-direction: column;
    }

    .goods-list-top {
        display: flex;
    }

    .activity-info .t {
        display: block;
        margin: 6rpx;
        height: 36rpx;
        line-height: 36rpx;
        color: #EF1B21;
        background-color: #fff;
    }

    .goods-info {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 100%;
    }

    .goods-info .info view {
        margin-bottom: 5rpx;
    }

    .goods-info .goods_price_wrap {
        display: flex;
        align-items: flex-end;
        margin-top: 30rpx;
    }

    .goods_price_wrap .now_price {
        /* display: flex; */
        font-size: 24rpx;
        font-weight: 600;
        color: #FC1C1C;
        font-weight: bold;
    }

    .now_price .big_price {
        font-size: 34rpx;

    }

    .goods-info .info .old_price {
        color: #9A9A9A;
        font-size: 20rpx;
        margin-left: 10rpx;
        text-decoration: line-through;
        padding-bottom: 4rpx;
    }

    .goods-info .info .p {
        font-size: 24rpx;
        color: #666;
        display: flex;
        align-items: center;
    }

    .goods-info .p .line {
        display: block;
        width: 1rpx;
        height: 20rpx;
        margin: 0 15rpx;
        background-color: #999;
    }

    .goods-info navigator {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50rpx;
        color: #fff;
        font-size: 28rpx;
        border-radius: 38rpx;
        position: absolute;
        bottom: 0;
        left: 0;
    }

    .group_num_wrap {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 46rpx;
        color: #FC1C1C;
        font-size: 25rpx;
        border-radius: 25rpx 0 0 25rpx;
        border: 1rpx solid #FC1C1C;
        padding-left: 10rpx;
        padding-right: 30rpx;
    }

    .goods-info .iconImg {
        width: 31rpx;
        height: 27rpx;
        margin-right: 10rpx;
    }

    .go_to_group {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 148rpx;
        height: 50rpx;
        font-size: 26rpx;
        color: #fff;
        background-color: #FC1C1C;
        border-radius: 0 25rpx 25rpx 25rpx;
        margin-left: 10rpx;
        position: absolute;
        right: -128rpx;
    }

    .empty {
        display: flex;
        width: 750rpx;
        height: calc(100vh - 100rpx);
        flex-direction: column;
        align-items: center;
        /* justify-content: center; */
        margin-top: 200rpx;
    }

    .empty .img {
        width: 256rpx;
        height: 256rpx;
        background: var(--emptyImg);
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .empty .tip {
        color: #999;
        font-size: 28rpx;
        margin: 30rpx 0;
    }

    .empty text {
        font-size: 26rpx;
        color: #999;
    }

    .goods_nameBox {
        margin-top: 20rpx;
    }

    .goods_nameText {
        color: #2E2E2E;
        font-size: 29rpx;
        font-weight: 600;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .activity-info {
        width: 100%;
        height: 70rpx;
        display: flex;
        align-items: center;
        font-size: 26rpx;
        color: #666;
        margin-top: 20rpx;
        border-top: 1rpx solid #F2F2F2;
    }

    .activity-info .save_img {
        width: 30rpx;
        height: 30rpx;
        margin-right: 20rpx;
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

    .group_bottom_text {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>

