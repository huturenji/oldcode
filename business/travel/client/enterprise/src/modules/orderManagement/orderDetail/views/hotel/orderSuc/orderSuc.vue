<template>
    <div class="tab">
        <div class="orderSuc">
            <div class="topWrap">
                <div class="top">
                    <Icon type='icon_common_success' size='1.16' class='icon'/>
                    <div class="tit">{{tips}}</div>
                    <div class="mt10">等待确认</div>
                    <div class="text">稍后您将收到酒店确认短信</div>
                </div>
            </div>
        </div>
        <div class='btn-group'>
            <SnButton type="primary" class="submit_btn normal-btn cursorp" @click="toOrderDetail()">查看订单</SnButton>
            <div class="rightTips icon-btn cursorp" @click="toTripList"> 我的行程 </div>
        </div>
    </div>
</template>

<script>
// import extendUtils from 'orderCommon/extend.js';
import requestHandler from 'orderCommon/requestHandler.js';
const Icon = ()=>import('components/icon');
const SnButton = ()=>import('components/button');
// import CouponCard from 'components/coupon/couponCard.vue'
export default {
    components: {
        // CouponCard
        Icon,
        SnButton
    },
    mixins: [requestHandler.mixin.tChatEventMixin],
    data: function () {
        return {
            paymentType: '1',//现付预付
            tips: '付款成功！',//提示文本
            pageFrom: '',//跳转来源
            check: false//路由控制开关
        }
    },
    created: function () {
        let _this = this;
        _this.paymentType = _this.$route.query.paymentType;
        _this.pageFrom = _this.$route.query.pageFrom;
        //注册并监听t信返回事件

        // extendUtils.appBack(function (data) {//点击app返回事件
        //     extendUtils.throttle(function () {
        //         if(_this.pageFrom == 'orderList'){//订单列表支付跳转到成功页面
        //            extendUtils.closePage();
        //         }else if ('cash' == _this.pageFrom){//编辑订单过来的
        //             extendUtils.closePage('', 2);
        //         }else {//预付，从订单详情路由跳转过来的，所以回退
        //             _this.$router.back();
        //         }
        //     }, this);
        // }.bind(this));
        _this.$emit('showOff', true);
        //注册空返回事件
        // extendUtils.reFreshPage(() => {
        // });
        if (0 == _this.paymentType) {
            _this.tips = '提交成功！'
        }
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
                requestHandler.openPageLib('enterprise/index.html#/order/detail/hotel/app?orderNo='+(this.$route.query || {}).orderNo);
            } else if ('cash' == this.pageFrom) { //现付，从编辑订单跳路由过来的，所以去订单详情要路由跳转
                this.$router.push({
                    path: '/order/detail/hotel',
                    query: {
                        orderNo: (this.$route.query || {}).orderNo,
                        pageFrom: 'cash'
                    }
                })
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
</style>
