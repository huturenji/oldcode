<template>
    <div class="order-item" :class="{disable: disable}">
        <div class="order-person" v-if='!changePassengers'>
            <div><span>预定人：</span><span>{{orderItem.scheduledPersonName}}</span></div>
            <div @click="beyondClick">
                <span>入住人：</span>
                <span>{{orderItem.customers}}</span>
            </div>
        </div>
        <div class="spread-person" v-if='changePassengers'>
            <div><span>预定人：</span><span>{{orderItem.scheduledPersonName}}</span></div>
            <div @click="beyondClick">
                <span>入住人：</span>
                <span>{{orderItem.customers.length>6?orderItem.customers.substring(0,6)+'...':orderItem.customers}}</span>
            </div>
        </div>
        <div class="order-summary">
            <div class="title">
                <div class="icon icon-hotel" :class="{disable: disable}"></div>
                <div><span>{{orderItem.typeName}}</span><span v-if="userType"
                        :class="['userType'+orderItem.useType,{disable: disable}]"></span></div>
            </div>
            <div class="status" :style="{color: statusColor}">{{orderStatus}}</div>
        </div>
        <div class="order-detail cursorp" @click="goDetail">
            <div class="left-block">
                <div class="position">
                    {{orderItem.hotelName}}
                </div>
                <div class="roomName">
                    {{(orderItem.roomTypeName || '')+"  "+orderItem.roomCount+"间"}}
                </div>
                <div class="time">
                    {{formatTimeStamp(orderItem.arriveDate)+"  至  "+formatTimeStamp(orderItem.departDate)+"  "+inDays+"晚"}}
                </div>
            </div>
            <div class="right-block">
                <div class="amount" :class="{disable: disable}">
                    <span>￥</span>{{orderItem.payAmount || '暂无价格'}}
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { getHotelOrderStatus, getHotelOrderStatusColor } from 'orderCommon/enum/orderStatusEnum.js'
import extendUtils from 'orderCommon/extend.js';
export default {
    props: ['orderItem', 'useTypeConfig'],
    data() {
        return {
            inDays: (new Date(this.orderItem.departDate) - new Date(this.orderItem.arriveDate)) / (24 * 60 * 60 * 1000),
            changePassengers:true
        }
    },
    computed: {
        /**
         * 是否加载disable状态
         * @returns {boolean}
         */
        disable: function () {
            return this.orderItem.orderStatus == 'ALREADY_CANCEL' || this.orderItem.orderStatus == 'ALREADY_CANCEL_HAS_REFUND';
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
            return getHotelOrderStatus(this.orderItem.orderStatus, this.orderItem.invoiceDone);
        },
        /**
         * 订单状态对应的颜色
         * @returns {*}
         */
        statusColor: function () {
            return getHotelOrderStatusColor(this.orderItem.orderStatus);
        }
    },
    methods: {
        /**
         * 跳转到订单详情页面，调用父组件的公共方法，并传入跳转的url
         */
        goDetail() {
            this.$emit("goPage", "order/detail/hotel/app?orderNo=" + this.orderItem.orderNo + "&pageFrom=orderList");
        },
        /**
         * 时间格式化
         * @param value
         * @returns {*}
         */
        formatTimeStamp(value) {
            try {
                return (new Date(value).format("yyyy/MM/dd").replace(/\//g, '-'));
            } catch (e) {
            }
        },
        /**
        乘车人超出时添加点击效果
        */
        beyondClick(){
            let _this = this;
            if (_this.orderItem.customers.length>6){
                _this.changePassengers=!_this.changePassengers;
            }
        }
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/indexOrder/orderItem.less';
</style>
