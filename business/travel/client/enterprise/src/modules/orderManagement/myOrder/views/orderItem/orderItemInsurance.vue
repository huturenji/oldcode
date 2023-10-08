<template>
    <div class="order-item" :class="{disable: disable}">
        <div class="order-person" v-if='!changePassengers'>
            <div><span>预定人：</span><span>{{orderItem.scheduledPersonName}}</span></div>
            <div @click="beyondClick">
                <span>被保人：</span>
                <span>{{orderItem.passengers}}</span>
            </div>
        </div>
        <div class="spread-person" v-if='changePassengers'>
            <div><span>预定人：</span><span>{{orderItem.scheduledPersonName}}</span></div>
            <div @click="beyondClick">
                <span>被保人：</span>
                <span>{{orderItem.passengers.length>6?orderItem.passengers.substring(0,6)+'...':orderItem.passengers}}</span>
            </div>
        </div>
        <div class="order-summary">
            <div class="title">
                <div class="icon icon-insurance" :class="{disable: disable}"></div>
                <div><span>{{orderItem.typeName}}</span><span v-if="userType"
                    :class="['userType'+orderItem.useType,{disable: disable}]"></span></div>
            </div>
            <div class="status" :style="{color: statusColor}">{{orderStatus}}
                <!-- <template v-if="showSubStatus(orderItem.orderStatus)">
                    <span v-if="orderItem.isHasTui && !orderItem.isHasGai">（有退票）</span>
                    <span v-if="orderItem.isHasGai && !orderItem.isHasTui">（有改签）</span>
                    <span v-if="orderItem.isHasGai && orderItem.isHasTui">（有退改）</span>
                </template> -->
            </div>
        </div>
        <div class="order-detail cursorp" @click="goDetail">
            <div class="amount" :class="{disable: disable}">
                <span>￥</span>{{orderItem.payAmount || '暂无价格'}}
            </div>
            <div class="position">
                {{orderItem.productShortName}}
            </div>
            <div class="roomName">
                {{orderItem.departCityName+"-"+orderItem.arriveCityName+" "+(orderItem.airLineName || '')+" "+(orderItem.flightNo || '')}}
            </div>
            <div class="time">
                {{travelDate}}<span class="diff-date" :class="{disable: disable}"
                                    v-if="diffDate>0">{{"+"+diffDate+'天'}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { getInsuranceOrderStatus, getInsuranceOrderStatusColor } from 'orderCommon/enum/orderStatusEnum.js'
import extendUtils from 'orderCommon/extend.js';
export default {
    props: ['orderItem', 'role', 'useTypeConfig'],
    data() {
        return {
            changePassengers:true
        }
    },
    computed: {
        /**
         * 是否加载disable状态
         * @returns {boolean}
         */
        disable: function () {
            return this.orderItem.orderStatus == 'ALREADY_CANCEL';
        },
        /**
         * 因公因私的状态
         * @returns {string}
         */
        userType: function () {
            if (!this.useTypeConfig || !this.useTypeConfig.isBoth()){
                return null;
            }
            if (this.orderItem.useType == extendUtils.USE_TYPE_ENUM.PUBLIC.code) {
                return extendUtils.USE_TYPE_ENUM.PUBLIC.text;
            } else if (this.orderItem.useType == extendUtils.USE_TYPE_ENUM.PRIVATE.code) {
                return extendUtils.USE_TYPE_ENUM.PRIVATE.text;
            }
            return null;
        },
        /**
         * 返回订单状态中文名
         * @returns {*}
         */
        orderStatus: function () {
            return getInsuranceOrderStatus(this.orderItem.orderStatus);
        },
        /**
         * 订单状态对应的颜色
         * @returns {*}
         */
        statusColor: function () {
            return getInsuranceOrderStatusColor(this.orderItem.orderStatus);
        },
        /**
         * 时间格式化
         * @returns {string}
         */
        travelDate: function () {
            let startTime = (new Date(this.orderItem.departTime).format("yyyy/MM/dd HH:mm").replace(/\//g, '-'));
            let endTime = new Date(this.orderItem.arriveTime).format("HH:mm");
            return startTime + "-" + endTime
        },
        /**
         * 航班耗时
         * @returns {string}
         */
        diffDate: function () {
            let diffTime = (new Date(new Date(this.orderItem.arriveTime).format("yyyy/MM/dd")).getTime() - new Date(new Date(this.orderItem.departTime).format("yyyy/MM/dd")).getTime()) / 1000 / 3600 / 24;//开始和离开时间的间隔天数
            return parseInt(diffTime);//精确到天
        }
    },
    methods: {
        /**
         * 当前订单状态是否是有票的状态
         */
        // showSubStatus(statu) {
        //     return showInsuranceSubStatus(statu);
        // },
        /**
         * 跳转到订单详情页面，调用父组件的公共方法，并传入跳转的url
         */
        goDetail() {
            // this.$emit("goPage", "flight/orderDetail?OrderNo=" + this.orderItem.orderNo + "&pageFrom=orderList&role=" + this.role);
        },
        /**
        乘车人超出时添加点击效果
        */
        beyondClick(){
            let _this = this;
            if (_this.orderItem.passengers.length>6){
                _this.changePassengers=!_this.changePassengers;
            }
        }
    },
    mounted() {
    }
}
</script>
<style scoped lang="less">
    /* @import '../orderItem/orderItem.less'; */
</style>
