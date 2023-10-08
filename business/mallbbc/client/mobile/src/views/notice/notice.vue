<!-- 消息 -->
<template>
    <view class="container">
        <view class="notice_content_wrap" v-if="!no_data && noticeList && noticeList.length > 0">
            <view class="notice_item" v-for="(item,index) in noticeList" :key="index" @click="goNoticeDetail(item.receiveId,item.msgLinkInfo)">
                <view class="notice_time">{{item.msgSendTime}}</view>
                <view class="notice_content">
                    <view class="notice_title_wrap">
                        <view class="notice_title_left">
                            <view v-if="item.msgState==0" class="circle"></view>
                            <view v-else class="circle have_read"></view>
                            <view class="notice_title">{{item.tplName}}</view>
                        </view>
                        <view class="notice_title_right">
                            <image :src="rightUrl" mode=""></image>
                        </view>
                    </view>

                    <view class="notice_text">{{item.msgContent}}</view>
                </view>
            </view>
            <loadingState :state='loadingState' v-if="loadingState == 'first_loading'||noticeList.length > 0"/>
        </view>
        <!-- <view class="no_data" v-if="no_data" :style="{ width: windowWidth + 'rpx', 'height': windowHeight + 'rpx' }"> -->
        <view class="no_data" v-if="no_data">
            <view class="img"></view>
            <text>{{$L('暂无消息')}}~</text>
        </view>
    </view>
</template>

<script>
import loadingState from "@/components/loading/loading.vue";
import {
    mapState
} from 'vuex';
export default {
    data(){
        return {
            imgUrl: getApp().globalData.imgUrl,
            rightUrl:getApp().globalData.imgUrl+'common/icon/icon_common_rightarrow.svg',
            tplType:'', //消息类型
            current:1, //当前页数
            noticeList:[], //消息列表
            loadingState:'first_loading', //是否第一次加载
            stopPullDownRefresh: false, //是否下拉刷新中
            no_data:false,
            windowHeight:'', //屏幕的高
            windowWidth:'' //屏幕的宽
        }
    },
    components: {
        loadingState
    },
    computed:{
        ...mapState(['userInfo'])
    },
    onPullDownRefresh() {
        this.loadingState = 'first_loading';
        this.noticeList = [];
        this.current = 1;
        this.stopPullDownRefresh = true; //下拉刷新状态
        this.loadData(this.tplType);
    },
    onReachBottom(){
        this.loadData(this.tplType);
    },
    onLoad(){
        // this.tplType = this.$Route.query.tplType
        // this.loadData(this.tplType)
        // const {windowWidth,windowHeight} = uni.getSystemInfoSync();
        // this.windowWidth = windowWidth * 2;
        // this.windowHeight = windowHeight * 2;
    },
    mounted(){
        // this.loadData(this.tplType)
        const {windowWidth,windowHeight} = uni.getSystemInfoSync();
        this.windowWidth = windowWidth * 2;
        this.windowHeight = windowHeight * 2;
    },
    onShow(){
        this.tplType = this.$Route.query.tplType
        this.loadingState=''
        this.noticeList=[]
        this.current=1
        this.loadData(this.tplType);
    },
    methods:{
        //点击消息时设置消息已读
        readMessage(receiveId){
            let param = {}
            param.url = 'v3/msg/front/msg/read'
            param.method = 'POST'
            param.data = {
                receiveIds:receiveId
            }
            this.$request(param).then(res=>{
                if (res.state == 200){

                } else {
                    this.$api.msg(res.msg);
                }
            })
        },
        loadData(tplType){
            if (this.loadingState == 'loading'){
                return
            }
            if (this.loadingState == 'no_more_data'){
                return
            }
            let param = {}
            param.url = 'v3/msg/front/msg/msgList'
            param.method = 'GET'
            param.data = {
                tplType,
                pageSize:10,
                current:this.current
            }
            this.loadingState = this.loadingState == 'first_loading'?this.loadingState:'loading'
            this.$request(param).then(res=>{
                if (res.state == 200){
                    if (res.data.list && res.data.list.length > 0){
                        this.noticeList = this.noticeList.concat(res.data.list);
                        let hasMore = this.$checkPaginationHasMore(res.data.pagination); //是否还有数据
                        if (hasMore) {
                            this.current++;
                            this.loadingState = 'allow_loading_more';
                        } else {
                            this.loadingState = 'no_more_data';
                        }
                        this.no_data = false;
                    } else {
                        this.no_data = true;
                    }
                } else {
                    this.$api.msg(res.msg);
                }
                if (this.stopPullDownRefresh) {
                    this.stopPullDownRefresh = false;
                    uni.stopPullDownRefresh();
                }
            })
        },
        //消息跳转
        goNoticeDetail(receiveId,info){
            let msgLinkInfo = JSON.parse(info);
            this.readMessage(receiveId)
            if (msgLinkInfo.type == 'order_new' || msgLinkInfo.type == 'order_news'){ // 商品出库提醒  || 付款成功提醒    进入订单详情
                this.$Router.push({path:'/pages/order/detail',query:{orderSn:msgLinkInfo.orderSn}})
            } else if (msgLinkInfo.type == 'balance_change'){ //余额变动提醒    进入我的钱包
                this.$Router.push('/pages/balance/list')
            } else if (msgLinkInfo.type == 'coupon_news'){ //优惠券过期提醒    进入我的优惠券
                    
                this.$Router.push('/pages/coupon/myCoupon')
            } else if (msgLinkInfo.type == 'return_news' || msgLinkInfo.type == 'refund_news'){ //售后提醒 return_news(退货退款)  refund_news（仅退款 ）    进入我的售后列表  （afsSn）
                this.$Router.push({path:'/views/order/aftersale/list',query:{state:0}})
            } else if (msgLinkInfo.type == 'integral_change'){ //云豆变动提醒 进入我的云豆
                this.$Router.push('/pages/user/myIntegral')
            } else if (msgLinkInfo.type == 'appointment_news'){ //预约消息跳转详情
                this.$Router.push({path:'/standard/product/detail',query:{sku:msgLinkInfo.sku,spu:msgLinkInfo.spu}})
            }
        }
    }
}
</script>

<style lang="scss">
    page,.container{
        width:750rpx;
        height:100%;
        margin: 0 auto;
        .notice_content_wrap{
            padding:0 20rpx;
            .notice_item{
                margin-top:38rpx;
                .notice_time{
                    text-align: center;
                    font-size: 24rpx;
                    color:#666;
                }
                .notice_content{
                    width:100%;
                    background-color: #fff;
                    margin-top:20rpx;
                    .notice_title_wrap{
                        width:100%;
                        height:70rpx;
                        padding:0 20rpx;
                        box-sizing: border-box;
                        display:flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom:1rpx solid rgba(0,0,0,0.05);
                        .notice_title_left{
                            display:flex;
                            align-items: center;
                            .circle{
                                width:10rpx;
                                height:10rpx;
                                border-radius: 50%;
                                background: #FF1212;
                                margin-right:20rpx;
                            }
                            .have_read{
                                background-color: #999999;
                            }
                            .notice_title{
                                font-size:32rpx;
                                color:#333;
                                font-weight: 600;
                            }
                        }
                        .notice_title_right{
                            image{
                                width:14rpx;
                                height:24rpx;
                            }
                        }
                    }
                    .notice_text{
                        font-size:28rpx;
                        line-height: 1.5em;
                        color:#666;
                        font-weight: 600;
                        padding:20rpx;
                    }
                }
            }
        }
        .no_data{
            width: 750rpx;
            display: flex;
            // justify-content: center;
            padding-top: 200rpx;
            align-items: center;
            flex-direction: column;
            .img{
                width: 256rpx;
                height: 256rpx;
                background: var(--emptyImg);
                background-size: 100% 100%;
            }
            text{
                font-size: 28rpx;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: $main-third-color;
            }
        }
    }
</style>
