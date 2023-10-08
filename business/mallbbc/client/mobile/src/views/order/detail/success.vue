<!-- 交易成功页面 -->
<template>
    <scroll-view class="container" scroll-y @scrolltolower='getData'>

        <view class="main_content">
            <!-- 订单状态 start -->
            <view class="order_state">
                <image :src="imgUrl+'common/icon/dagou.png'" mode="" class="order_state_img"></image>
                <view class="order_state_text">{{$L('交易成功')}}</view>
                <view class="order_btn">
                    <text @click="backIndex">{{$L('返回首页')}}</text>
                    <text @click="lookOrder" v-if="sourceType == 'tradeSuccess'">{{$L('查看订单')}}</text>
                    <!-- <text @click="goEvaluate" v-else>{{$L('立即评价')}}</text> --><!--2022/8/22屏蔽评价功能-->
                </view>
            </view>
            <!-- 订单状态 end -->

            <!-- 推荐商品 start-->
            <!-- // 暂时屏蔽掉推荐商品列表 屏蔽日期:2022-9-22 -->
            <!-- <view class="recomment">
                <recommendGoods ref='recomment_goods' />
            </view> -->
            <!-- 推荐商品 end-->
        </view>

    </scroll-view>

</template>
<script>
import {
    mapState
} from 'vuex';
// import recommendGoods from "@/components/goods/recommend.vue";
// import uniPopup from '@/components/uni-popup/uni-popup.vue';
// import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
// import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
let startY = 0,
    moveY = 0,
    pageAtTop = true;
export default {
    components: {
        // recommendGoods
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            coverTransform: 'translateY(0px)',
            coverTransition: '0s',
            moving: false,
            orderSn:'', //订单号
            sourceType:'' //页面来源    orderDetail:订单详情    orderList:订单列表    tradeSuccess:支付成功
        }
    },
    async mounted(){
        //订单号
        this.orderSn = this.$Route.query.orderSn;
        this.sourceType =this.$Route.query.sourceType;
    },
    async onLoad() {
        // //订单号
        // this.orderSn = this.$Route.query.orderSn;
        // this.sourceType =this.$Route.query.sourceType;
    },
    computed: {
        ...mapState(['hasLogin', 'userInfo', 'userCenterData'])
    },
    methods: {
        initData() {
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
        //返回首页
        backIndex(){
            this.$Router.push('/')
        },
        //去评价页面
        goEvaluate(){
            this.$Router.replace({path:'/views/order/evaluation/publish',query:{orderSn:this.orderSn,sourceType:this.sourceType}})
        },
        //查看订单
        lookOrder(){
            this.$Router.replace('/pages/order/list')
                
        }
    }
}
</script>
<style lang='scss'>
    page {
        background: $bg-color-split;
    }

    .container {
        display: flex;
        flex: 1;
        height: 100vh;
        position: relative;
        width: 750rpx;
        margin: 0 auto;

        .main_content{
            width: 100%;
            height: 452rpx;
            background: var(--orderDetailBg);
            background-size: 100% 100%;
            padding-top: 92rpx;
            box-sizing: border-box;
            .order_state{
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-bottom: 31rpx;
                .order_state_img{
                    width: 99rpx;
                    height: 99rpx;
                }
                .order_state_text{
                    font-size: 34rpx;
                    
                    font-weight: bold;
                    color: #FFFFFF;
                    margin: 30rpx 0 50rpx;
                }
                .order_btn{
                    display: flex;
                    align-items: center;
                    text:nth-child(1){
                        width: 210rpx;
                        height: 60rpx;
                        border: 1rpx solid #FFFFFF;
                        border-radius: 30rpx;
                        font-size: 28rpx;
                        
                        font-weight: 500;
                        color: #FFFFFF;
                        text-align: center;
                        line-height: 60rpx;
                    }
                    text:nth-child(2){
                        width: 210rpx;
                        height: 60rpx;
                        background: #FFFFFF;
                        box-shadow: 0rpx 10rpx 20rpx 0rpx rgba(252, 32, 28, 0.1);
                        border-radius: 30rpx;
                        font-size: 28rpx;
                        
                        font-weight: 500;
                        color: #FC1C1C;
                        text-align: center;
                        line-height: 60rpx;
                        margin-left: 90rpx;
                    }
                }
            }
            .recomment{
                background:linear-gradient(to bottom, #FFFFFF 0%, #F5F5F5 20%, #F5F5F5 100%) ;
                box-sizing: border-box;
                border-radius: 30rpx 30rpx 0 0;
            }
        }
    }

</style>

