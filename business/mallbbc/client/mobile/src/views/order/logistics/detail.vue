<!-- 查看物流页面 -->
<template>
    <view class="look_logistics">
        <!-- 物流公司,及商品 start-->
        <view class="logistics_des">
            <!-- 与服务端人员确认，物流详情此处的图片暂时屏蔽掉（正常订单查看物流） ,售后的物流回退暂时保留-->
            <!-- <view v-if="!!afsSn" class="goods_image">
                <image :src="logisticsInfo.mainImage" mode="aspectFit"></image>
            </view> -->
            <view class="logistics_desc" v-if="logisticsInfo.type!='1'">
                <view class="logistics_type">{{$L('承运公司')}}：<text>{{logisticsInfo.expressName ? logisticsInfo.expressName : '--'}}</text></view>
                <!-- <view class="logistics_type">物流状态：<text>{{logisticsInfo.type ? logisticsInfo.type : '--'}}</text></view> -->
                <view class="logistics_type useselect">{{$L('物流单号')}}：<text>{{logisticsInfo.expressNumber ? logisticsInfo.expressNumber : '物流单号尚未更新，如有疑问请联系客服'}}</text><text v-if="logisticsInfo.expressNumber" @click="copyStr(logisticsInfo.expressNumber)" class="copyExpressNumber">复制</text></view>
                
            </view>
            <view class="logistics_desc" v-if="logisticsInfo.type=='1'">
                <view class="logistics_type">{{$L('联系人')}}：<text>{{logisticsInfo.expressName ? logisticsInfo.expressName : '--'}}</text></view>
                <!-- <view class="logistics_type">物流状态：<text>{{logisticsInfo.type ? logisticsInfo.type : '--'}}</text></view> -->
                <view class="logistics_type">{{$L('联系电话')}}：<text>{{logisticsInfo.expressNumber ? logisticsInfo.expressNumber : '--'}}</text></view>
            </view>
        </view>
        <!-- 物流公司,及商品 end-->

        <!-- 物流轨迹 start -->
        <template v-if="loading">
            <loadingState state="loading"></loadingState>
        </template>
        <view class="lofistics_info" v-else-if="!loading && logisticsRouteList.length > 0">
            <!-- 纵向排列 -->
            <uni-steps :options=logisticsRouteList direction="column" :active="0" activeColor="#333" deactiveColor="#949494"></uni-steps>
        </view>
        <view class="no_data" v-else-if="!loading && logisticsRouteList.length ==0&&logisticsInfo.type!='1'">
            <view class="img"></view>
            <text>{{$L('暂无物流信息，请耐心等待哦')}}~</text>
        </view>
        <!-- 物流轨迹 end -->
        <!-- 推荐商品 start-->
        <scroll-view class="recomment" scroll-y @scrolltolower='getData'>
            <recommendGoods ref='recomment_goods' />
        </scroll-view>
        <!-- 推荐商品 end-->
    </view>
</template>

<script>
import {
    mapState
} from 'vuex';
import {copyText} from '@/utils/common';
import recommendGoods from "@/components/goods/recommend.vue";
import orderHandler from '@/components/order/handler';
import uniSteps from '@/components/uni-steps/uni-steps.vue'; //步骤条
let startY = 0,
    moveY = 0,
    pageAtTop = true;
export default {
    components: {
        recommendGoods,
        uniSteps
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            coverTransform: 'translateY(0px)',
            coverTransition: '0s',
            moving: false,
            logisticsInfo:{}, //物流信息
            logisticsRouteList:[], //物流轨迹信息
            type:'',
            afsSn:'',
            loading: true,
            detailFrom: '' //通过什么方式获取物流信息详情，detailFrom = cache, 说明是从前端缓存中拿数据， 目前适用的场景是从订单列表或者订单详情只有一个包裹的时候，还有就是从多包裹页面跳过来的时候
        }
    },

    mounted(){
        //退款单号
        this.orderSn = this.$Route.query.orderSn;
        this.afsSn = this.$Route.query.afsSn;
        this.type=this.$Route.query.type
        this.detailFrom = this.$Route.query.detailFrom;
        this.traceType = this.$Route.query.traceType;
        this.loading = true;
        if (this.detailFrom && this.detailFrom == 'cache'){
            //从缓存中拿物流详情数据
            this.initDetailFromCache();
        } else {
            // 通过接口获取物流详情
            this.getLogisticsTrajectory();
        }

    },
        
    // #ifndef MP
    onNavigationBarButtonTap(e) {
        const index = e.index;
        if (index === 0) {
            this.navTo('/pages/set/set');
        } else if (index === 1) {
            // #ifdef APP-PLUS
            const pages = getCurrentPages();
            const page = pages[pages.length - 1];
            const currentWebview = page.$getAppWebview();
            currentWebview.hideTitleNViewButtonRedDot({
                index
            });
            // #endif
            this.$Router.push('/pages/notice/notice')
        }
    },
    // #endif
    computed: {
        ...mapState(['hasLogin', 'userInfo', 'userCenterData'])
    },
    onReachBottom() {
        this.$refs.recomment_goods.getMoreData();
    },
    methods: {
        /**
             * 复制字符串
             */
        copyStr (str) {
            copyText(str);
        },


        /**
             * 统一跳转接口,拦截未登录路由
             * navigator标签现在默认没有转场动画，所以用view
             */
        navTo(url) {
            let newUrl = url;
            if (!this.hasLogin) {
                newUrl = '/pages/public/login';
            }
            this.$Router.push(newUrl)
        },

        /**
             *  会员卡下拉和回弹
             *  1.关闭bounce避免ios端下拉冲突
             *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
             *    transition设置0.1秒延迟，让css来过渡这段空窗期
             *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
             */
        coverTouchstart(e) {
            if (pageAtTop === false) {
                return;
            }
            this.coverTransition = 'transform .1s linear';
            startY = e.touches[0].clientY;
        },
        coverTouchmove(e) {
            moveY = e.touches[0].clientY;
            let moveDistance = moveY - startY;
            if (moveDistance < 0) {
                this.moving = false;
                return;
            }
            this.moving = true;
            if (moveDistance >= 80 && moveDistance < 100) {
                moveDistance = 80;
            }

            if (moveDistance > 0 && moveDistance <= 80) {
                this.coverTransform = `translateY(${moveDistance}px)`;
            }
        },
        coverTouchend() {
            if (this.moving === false) {
                return;
            }
            this.moving = false;
            this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
            this.coverTransform = 'translateY(0px)';
        },
        //获取物流轨迹接口
        getLogisticsTrajectory(){
            let that = this;
            let param = {};
            let apiType;
            if (this.type && this.type=='afs'){
                apiType = "getAftersaleTrace";
            } else {
                apiType = "getTrace";
            }

            if (this.type && this.type == 'afs'){
                // 1 寄件包裹的物流（如客户发货后的物流）
                // 2. 收件包裹的物流（如京东维修后返件的物流）
                param.afsSn = this.afsSn;
                param.type = this.traceType;
            } else {
                param.orderSn = that.orderSn; //订单号
            }
            orderHandler[apiType](param).then(res => {
                this.loading = false;
                if (res.state == 200) {
                    let result = res.data;
                    that.logisticsInfo = result || {}; //物流信息
                    that.logisticsRouteList = result.routeList || []; //物流轨迹信息
                    that.logisticsRouteList = that.logisticsRouteList.map(function(item){
                        return {
                            "title":item.acceptTime,
                            "desc":item.acceptStation
                        }
                    })
                    that.loadFlag = true;
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
                this.loading = false;
            })
        },

        // 从缓存中拿物流详情数据
        initDetailFromCache(){
                
            const that = this;
            try {
                let result = this.$getStorageSync('packageItem')
                that.logisticsInfo = result.tracesResult || {}; //物流信息
                that.logisticsRouteList = result.tracesResult.routeList || []; //物流轨迹信息
                that.logisticsRouteList = that.logisticsRouteList.map(function(item){
                    return {
                        "title":item.acceptTime,
                        "desc":item.acceptStation
                    }
                })
                this.loading = false;
            } catch (error) {
                console.log(error)
                this.loading = false;
            }
        },
            
        //获取推荐商品
        getData() {
        }
    }
}
</script>

<style lang='scss'>
    page {
        background: $bg-color-split;
        width: 750rpx;
        height: 100%;
        margin: 0 auto;
    }
    .look_logistics{
        width: 100%;
        height: 100%;
        background: $bg-color-split;
        .logistics_des{
            border-top: 20rpx solid $bg-color-split;
            background-color: #FFFFFF;
            display: flex;
            padding: 20rpx;
            box-sizing: border-box;
            .goods_image{
                width: 200rpx;
                height: 200rpx;
                background: #F3F3F3;
                border-radius: 14rpx;
                image{
                    width: 200rpx;
                    height: 200rpx;
                    border-radius: 14rpx;
                }
            }
            .logistics_desc{
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin-left: 16rpx;
                .logistics_type{
                    font-size: 28rpx;
                    
                    font-weight: 500;
                    color: #949494;
                    line-height: 114%;
                    margin: 20rpx 0;
                    &.useselect{
                        user-select: text;
                    }
                    .copyExpressNumber{
                        color: var(--radioCheckedColor);
                        border: 1px solid var(--radioCheckedColor);
                        padding: 0 10rpx;
                        border-radius: 999rpx;
                        font-size: 24rpx;
                        cursor: pointer;
                        margin-left: 20rpx;
                    }
                }
            }
        }
        &::v-deep{.lofistics_info{
            width: 710rpx;
            background: #FFFFFF;
            border-radius: 15rpx;
            margin: 20rpx;
            padding-bottom: var(--safe-area-inset-bottom);
            word-break: break-all;
            .uni-steps__column-title{
                line-height: 180%;
            }
            .uni-steps__column-desc{
                line-height: 180%;
            }
        }
        }
        .no_data{
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 200rpx;
            .img {
                width: 256rpx;
                height: 256rpx;
                background: var(--emptyImg);
                background-size: 100% 100%;
            }
            text{
                font-size: 28rpx;
                font-family: Source Han Sans CN;
                color: $main-third-color;
            }
        }
        .recomment{
            margin-top: 60rpx;
        }
    }
</style>

