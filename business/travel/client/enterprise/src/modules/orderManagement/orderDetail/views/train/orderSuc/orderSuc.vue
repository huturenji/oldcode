<template>
    <div>
        <div class="wrap">
            <div class="orderSuc">
                <div class="topWrap">
                    <div class="top">
                        <icon type="icon_common_success" size="1.15"/>
                        <div class="tit">付款成功</div>
                        <div class="text">预计30分钟内出票，请耐心等待</div>
                        <div class="tips">{{tipMsg}}</div>
                    </div>
                </div>
            </div>
            <div class="submit_btn cursorp" @click="toOrderDetail"> 查看订单 </div>
            <div v-if="productChannel == 99" class="rightTips icon-btn cursorp" @click="toTripList"> 我的行程 </div>
        </div>
        <!-- <div class='card-container'>
            <CouponCard productType='3' />
        </div> -->
        <HotelMarketing></HotelMarketing>
    </div>
</template>

<script>
import icon from "components/icon/index.vue";
import extendUtils from 'orderCommon/extend.js';
// import CouponCard from 'components/coupon/couponCard.vue'
import requestHandler from 'orderCommon/requestHandler.js';
import HotelMarketing from 'components/hotelrecommendation/HotelMarketing.vue'
export default {
    components: {
        // CouponCard,
        HotelMarketing,
        icon
    },
    mixins: [requestHandler.mixin.tChatEventMixin],
    data: function () {
        return {
            check: false,
            productChannel: 99,
            tipMsg:'',
            pageFrom: (this.$route.query || {}).pageFrom
        }
    },
    created: function () {
        let _this = this;
        //注册并监听t信返回事件

        // extendUtils.appBack(function (data) {//点击app返回事件
        //     extendUtils.throttle(function () {
        //         _this.goBack();
        //     }, this);
        // }.bind(this));
        _this.$emit('showOff', true);
        _this.productChannel = extendUtils.getStorage('productChannel') || 99;
        // extendUtils.reFreshPage(() => {
        // });
    },
    mounted: function () { },
    watch: {},
    methods: {
        goBackFun(){
            this.goBack()
        },
        //判断供应商方法 如果供应商为同程即ProviderType==4 即tipMsg为''
        chargeProduct(){
            let providerType = this.$route.query.providerType;
            if (providerType=='4'){
                this.tipMsg='';
            } else {
                this.tipMsg='出票成功将会以短信方式发送至您的手机，请您注意查收';
            }
        },
        toOrderDetail() {
            if (this.pageFrom == 'orderList'){ //订单列表支付跳转到成功页面
                requestHandler.openPageLib('enterprise/index.html#/order/detail/train/app?orderNo='+(this.$route.query || {}).orderNo);
            } else {
                this.goBack();
            }
        },
        toTripList() {
            const that = this;
            that.check = true;
            setTimeout(() => {
                requestHandler.openPageLib('trip/index.html#/')
            }, 500)
        },
        goBack(){
            if (this.pageFrom == 'orderList'){ //订单列表支付跳转到成功页面
                extendUtils.closePage();
            } else {
                this.$router.back();
            }
        }
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/orderDetail/train/orderSuc.less';  
</style>
