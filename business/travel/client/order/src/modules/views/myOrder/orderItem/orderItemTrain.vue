<template>
    <div class="order-item" :class="{disable: disable}">
        <div class="order-summary">
            <div class="title">
                <div class="icon icon-train" :class="{disable: disable}"></div>
                <div><span>{{orderItem.typeName}}</span><span v-if="userType"
                        :class="['userType'+orderItem.useType,{disable: disable}]"></span></div>
            </div>
            <div class="status" :style="{color: statusColor}">{{orderStatus}}
                <template v-if="showSubStatus(orderItem.orderStatus)">
                     <span>{{getTrainPostSaleStatus(orderItem.postSaleStatus)}}</span>
                </template>
            </div>
        </div>
        <div class="order-detail cursorp" @click="goDetail">
            <div class="left-block">
                <div class="position">
                    {{orderItem.startCity}} - {{orderItem.endCity}}
                </div>
                <div class="roomName">
                    {{"车次 "+ (orderItem.trainNo || '暂无')}}
                </div>
                <div class="time">
                    {{travelDate}}<span class="diff-date" :class="{disable: disable}"
                        v-if="diffDate>0">{{"+"+diffDate+'天'}}</span>
                </div>
            </div>
            <div class="right-block">
                <div class="amount num-font" :class="{disable: disable}">
                    <span>￥</span>{{orderItem.payAmount || '暂无价格'}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getTrainOrderStatus, getTrainOrderStatusColor, showTrainSubStatus, getTrainPostSaleStatus } from 'orderCommon/enum/orderStatusEnum.js'
import extendUtils from 'orderCommon/extend.js'
export default {
    props: ['orderItem', 'useTypeConfig'],
    data() {
        return {
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
            return getTrainOrderStatus(this.orderItem.orderStatus, this.orderItem.invoiceDone);
        },
        /**
             * 订单状态对应的颜色
             * @returns {*}
             */
        statusColor: function () {
            return getTrainOrderStatusColor(this.orderItem.orderStatus);
        },
        /**
             *  行程耗时
             */
        diffDate: function () {
            let diffTime = (new Date(new Date(this.orderItem.endTime).format("yyyy/MM/dd")).getTime() - new Date(new Date(this.orderItem.startTime).format("yyyy/MM/dd")).getTime()) / 1000 / 3600 / 24;//开始和离开时间的间隔天数
            return parseInt(diffTime);//精确到天
        },
        /**
             *  时间格式化
             */
        travelDate: function () {
            let startTime = (new Date(this.orderItem.startTime).format("yyyy/MM/dd HH:mm").replace(/\//g, '-'));
            let endTime = new Date(this.orderItem.endTime).format("HH:mm");
            return startTime + "-" + endTime;
        }
    },
    methods: {
        /**
             * 当前订单状态是否是有票的状态
             */
        showSubStatus(statu) {
            return showTrainSubStatus(statu);
        },
        getTrainPostSaleStatus(statu){
            let res = getTrainPostSaleStatus(statu);
            return !!res ? `(${res})` : '';
        },
        /**
             * 跳转到订单详情页面，调用父组件的公共方法，并传入跳转的url
             */
        goDetail() {
            this.$emit("goPage", "train/orderDetail?orderNo=" + this.orderItem.orderNo + "&pageFrom=orderList");
        }
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/indexOrder/orderItem.less';
</style>