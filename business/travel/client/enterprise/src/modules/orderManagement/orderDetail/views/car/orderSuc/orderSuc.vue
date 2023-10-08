<template>
    <div class="orderSuc">
        <div class="topWrap">
            <div class="top">
                <div class="tit">{{tips}}</div>
                <!-- <div class="text mt10">等待确认</div> -->
                <!-- <div class="text">稍后您将收到酒店确认短信</div> -->
            </div>
        </div>
        <div class="submit_btn cursorp" @click="toOrderDetail"> 查看订单 </div>
        <!-- <div class="rightTips cursorp" @click="toTripList"> 我的行程 </div> -->
        <div class='card-container'>
            <CouponCard productType='2' />
        </div>
    </div>

</template>

<script>
import extendUtils from 'orderCommon/extend.js';
import requestHandler from 'orderCommon/requestHandler.js';
import CouponCard from 'components/coupon/couponCard.vue'
export default {
    components: {
        CouponCard
    },
    mixins: [requestHandler.mixin.tChatEventMixin],
    data: function () {
        return {
            tips: '付款成功！',//提示文本
            pageFrom: '',//跳转来源
            check: false//路由控制开关
        }
    },
    created: function () {
        let _this = this;
        _this.pageFrom = _this.$route.query.pageFrom;
        //注册并监听t信返回事件

        // requestHandler.appBack(function (data) {//点击app返回事件
        //     requestHandler.throttle(function () {
        //         if(_this.pageFrom == 'orderList'){//订单列表支付跳转到成功页面
        //             requestHandler.goBackPage();
        //         }else if ('cash' == _this.pageFrom){//编辑订单过来的
        //             requestHandler.goBackPage('', 2);
        //         }else {//预付，从订单详情路由跳转过来的，所以回退
        //             _this.$router.back();
        //         }
        //     }, this);
        // }.bind(this));
        _this.$emit('showOff', true);
        //注册空返回事件
        // requestHandler.reFreshPage(() => {
        // });
    },
    mounted: function () {
    },
    watch: {},
    methods: {
        goBackFun(){
            if (this.pageFrom == 'orderList'){ //订单列表支付跳转到成功页面
                extendUtils.closePage();
            } else if ('cash' == this.pageFrom){ //编辑订单过来的
                extendUtils.closePage('', 2);
            } else { //预付，从订单详情路由跳转过来的，所以回退
                this.$router.back();
            }
        },
        toPage(){
            if (this.pageFrom == 'orderList'){ //订单列表支付跳转到成功页面
                requestHandler.openPageLib('enterprise/index.html#/order/detail/car/app?OrderNo='+(this.$route.query || {}).orderNo);
            } else { //预付，从订单详情路由跳转过来的，所以回退
                this.$router.back();
            }
        },
        /**
             * 前往订单详情
             */
        toOrderDetail() {
            const that = this;
            that.check = true;
            that.toPage();
        },
        /**
             * 前往我的行程
             */
        toTripList() {
            const that = this;
            that.check = true;
            setTimeout(() => {
                requestHandler.openPageLib('trip/index.html#/')
            }, 500)
        }
    }
}
</script>
<style scoped lang="less">
    @import './orderSuc.less';

    @media screen and (min-width: @screen-sm) {
        .card-container {
            .flex-box;
            .justify-content(space-between);

            .point-card-container {
                .flex(1)
            }
        }
    }
</style>
