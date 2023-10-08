<!-- 消息中心 -->
<template>
    <view >
        <view class="notice_center_wrap">
            <view class="notice_item" @click="toNotice(index)" v-for="(item,index) in noticeList" :key="index">
                <view class="notice_item_left">
                    <image :src="system_news" mode="" v-if="item.tplTypeCode == 'system_news'"></image>
                    <image :src="order_news" mode="" v-if="item.tplTypeCode == 'order_news'"></image>
                    <image :src="assets_news" mode="" v-if="item.tplTypeCode == 'assets_news'"></image>
                    <image :src="appointment_news" mode="" v-if="item.tplTypeCode == 'appointment_news'"></image>
                    <image :src="after_sale_news" mode="" v-if="item.tplTypeCode == 'after_sale_news'"></image>
                    <text class="notice_text">{{item.msgName}}</text>
                </view>
                <view class="notice_item_right">
                    <view class="notice_num" v-if="item.msgNum>0">{{item.msgNum}}</view>
                    <image :src="rightUrl" mode=""></image>
                </view>
            </view>
            <view class="notice_item" @click="goNoticeSet()">
                <view class="notice_item_left">
                    <image :src="icon5" mode=""></image>
                    <text class="notice_text">{{$L('接收设置')}}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import {
    mapState
} from 'vuex';
export default {
    data() {
        return {
            assets_news:getApp().globalData.imgUrl+'member/icon10.png',
            order_news:getApp().globalData.imgUrl+'member/icon20.png',
            after_sale_news:getApp().globalData.imgUrl+'member/icon30.png',
            system_news:getApp().globalData.imgUrl+'member/icon60.png',
            appointment_news:getApp().globalData.imgUrl+'member/icon70.png',
            icon5:getApp().globalData.imgUrl+'member/receive_settings.png',
            rightUrl:getApp().globalData.imgUrl+'common/icon/icon_common_rightarrow.svg',
            noticeList:[]
        }
    },
    computed: {
        ...mapState(['userInfo'])
    },
    onLoad(){
        // this.loadData()
    },
    onShow(){
        this.loadData()
    },
    methods: {
        loadData(){
            let param = {}
            param.url = 'v3/msg/front/msg/msgListNum'
            param.method = 'GET'
            this.$request(param).then(res=>{
                if (res.state == 200){
                    this.noticeList = res.data;
                } else {
                    this.$api.msg(res.msg)
                }
            })
        },
        // 前往消息通知页
        toNotice(index){
            this.noticeList.forEach((item,index1)=>{
                if (index == index1){
                    this.$Router.push({path:'pages/notice/notice',query:{tplType:item.tplTypeCode}})
                }
            })
        },
        //去消息设置页面
        goNoticeSet(){
            this.$Router.push('/pages/notice/receivingSet')
        }
    }
}
</script>

<style lang='scss'>
    page {
        background-color: #f7f7f7;
        padding-bottom: 30rpx;
        width: 750rpx;
        margin: 0 auto;
    }
    .notice_center_wrap{
        margin-top:20rpx;
        width:100%;
        padding:0 30rpx;
        background-color: #fff;
        .notice_item{
            width:100%;
            height:140rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom:1rpx solid rgba(0,0,0,0.05);
            .notice_item_left{
                display: flex;
                align-items: center;
                image{
                    width:80rpx;
                    height:80rpx;
                    margin-right:20rpx;
                }
                .notice_text{
                    font-size:32rpx;
                    color:#343434;
                    font-weight: 600;
                }
            }
            .notice_item_right{
                display:flex;
                align-items: center;
                padding: 10rpx;
                .notice_num{
                    padding: 0 10rpx;
                    height:28rpx;
                    text-align: center;
                    line-height: 28rpx;
                    font-size:22rpx;
                    color:#fff;
                    background:#FC1E1C;
                    margin-right:20rpx;
                    border-radius: 28rpx;
                }
                image{
                    width:14rpx;
                    height:24rpx;
                }
            }
        }
    }
    .notice_center_wrap>view:nth-last-child(1){
        border-bottom:none;
    }

</style>
