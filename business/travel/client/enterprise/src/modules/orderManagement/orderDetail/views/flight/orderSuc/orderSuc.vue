<template>
    <div>
        <div class="tab">
            <div class="orderSuc">
                <div class="topWrap">
                    <div class="top">
                        <Icon type='icon_common_success' size='1.16' class='icon'/>
                        <div class="tit">付款成功</div>
                        <div class="mt10">预计30分钟内出票，请耐心等待</div>
                        <div class="text">出票成功将会以短信方式发送至您的手机，请您注意查收</div>
                    </div>
                </div>
            </div>
            <div class='btn-group'>
                <SnButton type="primary" class="submit_btn normal-btn cursorp" @click="toOrderDetail()">查看订单</SnButton>
                <div class="rightTips icon-btn cursorp" @click="openTrip"> 我的行程 </div>
            </div>
        </div>

        <!-- <div class='card-container'>
            <CouponCard productType='1' />
        </div> -->
        <HotelMarketing></HotelMarketing>
    </div>
</template>

<script>
import requestHandler from 'orderCommon/requestHandler.js';
// import extendUtils from 'orderCommon/extend.js';
// import CouponCard from 'components/coupon/couponCard.vue'
import HotelMarketing from 'components/hotelrecommendation/HotelMarketing.vue'
const Icon = ()=>import('components/icon');
const SnButton = ()=>import('components/button');
export default {
    components: {
        // CouponCard,
        HotelMarketing,
        Icon,
        SnButton
    },
    mixins: [requestHandler.mixin.tChatEventMixin],
    data: function () {
        return {
            check: false,
            pageFrom: (this.$route.query || {}).pageFrom
        }
    },
    created: function () {
        let _this = this;
        //注册并监听t信返回事件

        // extendUtils.appBack(function (data) {//点击app返回事件
        //     extendUtils.throttle(function () {
        //         if(_this.pageFrom == 'orderList'){//订单列表支付跳转到成功页面
        //             extendUtils.closePage();
        //         }else{
        //             _this.$router.back();
        //         }
        //     }, this);
        // }.bind(this));
        _this.$emit('showOff', true);
        // extendUtils.reFreshPage();
    },
    mounted: function () { },
    watch: {},
    methods: {
        goBackFun(){
            if (this.pageFrom == 'orderList'){ //订单列表支付跳转到成功页面
                extendUtils.closePage();
            } else {
                this.$router.back();
            }
        },
        toOrderDetail() {
            if (this.pageFrom == 'orderList'){ //订单列表支付跳转到成功页面
                requestHandler.openPageLib('enterprise/index.html#/order/detail/flight/app?orderNo='+(this.$route.query || {}).orderNo);
            } else {
                this.$router.back();
            }
        },
        openTrip() {
            let that = this;
            that.check = true;
            setTimeout(() => {
                requestHandler.openPageLib('trip/index.html#/')
            }, 500)
        }
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/orderDetail/flight/orderSuc.less';
</style>
