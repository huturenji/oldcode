<template>
    <div class="order-item" :class="{disable: disable}">
        <div class="order-summary">
            <div class="title">
                <div class="icon icon-car" :class="{disable: disable}"></div>
                <div><span>{{orderItem.typeName}}{{orderItem.carType | carType}}</span><span v-if="userType"
                                                              :class="['userType'+orderItem.useType,{disable: disable}]"></span></div>
            </div>
            <div class="status" :style="{color: statusColor}">{{orderStatus}}
            </div>
        </div>
        <div class="order-detail cursorp" @click="goDetail">
            <div class="amount" :class="{disable: disable}" v-if="orderItem.payAmount!=null && orderItem.payAmount!=undefined">
                <span>￥</span>{{orderItem.payAmount}}
            </div>
            <div class="position">
                <div>
                    起点：{{orderItem.startName}}
                </div>
                <div>
                    终点：{{orderItem.endName}}
                </div>
            </div>
            <div class="time">
                {{orderItem.orderTime}}
            </div>
        </div>
    </div>
</template>

<script>
import { carOrderStatus } from 'orderCommon/enum/orderStatusEnum.js'
import {carTypeData} from 'orderCommon/enum/carInfoEnum.js'
import extendUtils from 'orderCommon/extend.js';
export default {
    props: ['orderItem', 'role', 'useTypeConfig'],
    data() {
        return {
        }
    },
    filters: {
        carType(value){
            let carTypeObj = carTypeData[value];
            if (!carTypeObj){
                return '';
            }
            return ' - '+carTypeObj.name;
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
            return null
        },
        /**
         * 返回订单状态中文名
         * @returns {*}
         */
        orderStatus: function () {
            return (carOrderStatus[this.orderItem.orderStatus] || {}).text;
        },
        /**
         * 订单状态对应的颜色
         * @returns {*}
         */
        statusColor: function () {
            return (carOrderStatus[this.orderItem.orderStatus] || {}).color;
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
         * 跳转到订单详情页面，调用父组件的公共方法，并传入跳转的url
         */
        goDetail() {
            this.$emit("goPage", "order/detail/car/app?OrderNo=" + this.orderItem.orderNo + "&pageFrom=orderList&role=" + this.role);
        }
    },
    mounted() {
    }
}
</script>
<style scoped lang="less">
    /* @import './orderItem.less';
    .order-item .order-detail .position{
        font-size: .3rem;
    } */
</style>
