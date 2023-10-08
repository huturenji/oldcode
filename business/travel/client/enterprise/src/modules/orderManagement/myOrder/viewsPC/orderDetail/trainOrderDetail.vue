<template>
    <div class="detailContainer">
        <div class="detailContent">
            <div class="detailHead">
                <div class="headState">
                    <div class="stateOne" :style="{color: orderStatusColor}">
                        {{custOrderStatus}}
                        <template v-if="orderDetail.orderStatus=='ALREADY_OUT_TICKET'">
                            <span v-if="orderDetail.isHasTui && !orderDetail.isHasGai">（有退票）</span>
                            <span v-if="orderDetail.isHasGai && !orderDetail.isHasTui">（有改签）</span>
                            <span v-if="orderDetail.isHasGai && orderDetail.isHasTui">（有退改）</span>
                        </template>
                    </div>
                    <div class="stateTwo">
                        <span>订单号 {{orderDetail.providerOrderNo || orderDetail.orderNo}}</span>
                        <span>总金额<span class="money">￥{{orderDetail.orderAmount}}</span>
                            <!--<span class="detail">明细</span>-->
                        </span>
                    </div>
                </div>
                <div class="headInfo">
                    <div class="infoOne">
                        <span class="left">预订人：</span>
                        <span
                            class="right">{{orderDetail && orderDetail.founderInfo && orderDetail.founderInfo.userName || '无'}}</span>
                    </div>
                    <div class="infoOne">
                        <span class="left">联系电话：</span>
                        <span class="right">{{orderDetail && orderDetail.contactPhone}}</span>
                    </div>
                    <!-- <div class="infoOne">
                        <span class="left">部门：</span>
                        <span
                            class="right">{{orderDetail && orderDetail.founderInfo && orderDetail.founderInfo.departmentName || '无'}}</span>
                    </div> -->
                    <div class="infoOne">
                        <span class="left">支付方式：</span>
                        <span class="right">{{orderDetail.payName}}</span>
                    </div>
                </div>
            </div>
            <div class="detailCenterTrain">
                <!--<div class="centerState">
                    <img src="~assets/img/myOrder/gai.png" />
                </div>-->
                <div class="centerTop">
                    <div class="topLeft">
                        <div class="stateTwo">
                            <div class="infoOne">
                                <span
                                    class="left BigFone">{{orderDetail.startStation}}——{{orderDetail.endStation}}</span>
                                <span class="right BigFone">{{(orderPsgs[0] || {}).seatType || ''}}</span>
                            </div>
                            <div class="infoOne">
                                <span class="left">{{orderDetail.startDate}}</span>
                                <!--<span class="right smColor">超标</span>-->
                            </div>
                        </div>
                    </div>
                    <div class="topBorder"></div>
                    <div class="topRight">
                        <div class="stateTwo">
                            <div class="infoOne">
                                <span
                                    class="state">{{orderDetail.startDate | dataFormat}}</span><span>{{orderDetail.startDate | getWeekDay}}</span>
                                <span
                                    class="state">{{endDate()| dataFormat}}</span><span>{{endDate() | getWeekDay}}</span>
                            </div>
                            <div class="infoOne">
                                <span class="left BigFone">{{orderDetail.startTime}}</span>
                                <span class="center">{{orderDetail.trainNo}}</span>
                                <span class="right BigFone">{{orderDetail.endTime}}</span>
                            </div>
                            <div class="infoOne">
                                <div class="jtBg">
                                    <img src="~assets/img/myOrder/jt_time.png" />
                                </div>
                                <span class="left BigFone">{{orderDetail.startStation}}</span>
                                <span class="center">{{orderDetail.runtime | formatRuntime}}</span>
                                <span class="right BigFone">{{orderDetail.endStation}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="centerBot">
                    <div class="botLeft" v-for="(orderPsg,index) in orderPsgs" :key="index">
                        <div class="stateOne">
                            <span>{{orderPsg.psgName}} {{orderPsg.seatType}}</span>
                        </div>
                        <div class="stateTwo">
                            <div class="infoOne">
                                <span class="left">{{orderPsg.cardType}}：</span>
                                <span class="right">{{orderPsg.cardNo}}</span>
                            </div>
                            <div class="infoOne">
                                <span class="left">联系电话：</span>
                                <span class="right">{{orderPsg.phone}}</span>
                            </div>
                            <div class="infoOne">
                                <!--<span class="left">部门：</span>
                                <span class="right">{{}}</span>-->
                            </div>
                        </div>

                        <!-- 按钮组、乘客状态 -->
                        <div class="cust-btn-group">
                            <div class="tips-wait" v-if="orderDetail.orderStatus=='ALREADY_PAID'">正在出票，请稍候...</div>
                            <div class="tips-wait" v-if="orderDetail.orderStatus=='UNPAID'">待支付</div>
                            <template v-if="!orderPsg.newTuiOrder">
                                <div class="tips-wait" v-if="orderDetail.orderStatus=='ALREADY_OUT_TICKET'">出票成功</div>
                                <div class="tips-failed" v-if="orderDetail.orderStatus=='FAILED_OUT_TICKET'">出票失败</div>
                            </template>
                            <template v-else>
                                <div class="psg-status" :style="{color: getTrainPsgStatusColor(orderPsg.status)}"
                                    v-if="getTrainPsgStatusName(orderPsg.status)">
                                    {{getTrainPsgStatusName(orderPsg.status)}}</div>
                            </template>
                        </div>
                        <div class="status-message ticket-failed-info"
                            v-if="orderDetail.orderStatus=='FAILED_OUT_TICKET'">
                            因铁路系统繁忙，出票失败；退款将在1-7个工作日内原路退回
                        </div>

                        <table cellspacing="0" cellpadding="0" class="botTabel"
                            :class="{disable: psgStatuState(orderPsg.status)==StateStyle.SUCCESS && getPsgStatuType(orderPsg.status)=='0' && !!orderPsg.tuiOrderList && orderPsg.tuiOrderList.length>0}">
                            <tr>
                                <th>车票价格</th>
                                <th>保险费</th>
                                <th>服务费</th>
                                <th>总消费</th>
                            </tr>
                            <tr>
                                <td>{{priceFormat(orderPsg.seatPrice)}}</td>
                                <td>{{priceFormat(orderPsg.isuFarePer)}}
                                    <!--<img src="~assets/img/myOrder/ti.png" class="tipsImg">-->
                                </td>
                                <td>{{priceFormat(orderPsg.outTicketPoundage)}}</td>
                                <td>{{priceFormat(orderPsg.seatPrice,orderPsg.incAmount,orderPsg.outTicketPoundage)}}
                                </td>
                            </tr>
                        </table>
                        <div class="message-container">
                            <!-- 乘客状态提示文字 -->
                            <template v-if="orderPsg.newTuiOrder">
                                <div class="status-message tui-success-info"
                                    v-if="psgStatuState(orderPsg.status)==StateStyle.SUCCESS && getPsgStatuType(orderPsg.status)=='0' && !!orderPsg.tuiOrderList && orderPsg.tuiOrderList.length>0">
                                    退款（￥{{orderPsg.newTuiOrder.refTicketAmount}}） 将在1-7个工作日内原路退回
                                    <div class="link-btn normal-btncursorp" @click="showRefundDetailPop(orderPsg)">退款明细</div>
                                </div>
                                <div class="status-message tui-failed-info"
                                    v-if="getPsgStatuType(orderPsg.status)=='0' && psgStatuState(orderPsg.status)== StateStyle.FAILED">
                                    因铁路系统繁忙，请持购票有效证件到火车站办理
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <!--<div class="detailTips"> <img src="~assets/img/myOrder/ti.png" />-->
            <!--取票、退票、改签说明 </div>-->
            <!--<div class="detailFoot">-->
            <!--<div class="footRight">
                    <div class="title"> 出差审批信息 </div>
                    <div class="content">
                        <div class="infoOne">
                            <span class="left">申请人</span>
                            <span class="right"></span>
                        </div>
                        <div class="infoOne">
                            <span class="left">审批人</span>
                            <span class="right"><span></span></span>
                        </div>
                        <div class="infoOne">
                            <span class="left">出差单号</span>
                            <span class="right"></span>
                        </div>
                        <div class="infoOne">
                            <span class="left">出差事由</span>
                            <span class="right"></span>
                        </div>
                    </div>
                </div>-->
            <!--</div>-->
            <div class="detailBtn"> 本产品由{{orderDetail.providerShortName}}提供服务--联系电话<span
                    class="tel">{{orderDetail.providerPhone}}</span> </div>
        </div>

        <div v-transfer-dom>
            <confirm v-model="showRefundDetail" :hide-on-blur="true" :show-cancel-button="false">
                <div class="refundDetail">
                    <div class="title">退款明细</div>
                    <ul>
                        <li>
                            <span>车票票款</span> <span>{{refundOrder.ticketFareAmount}}元</span>
                        </li>
                        <li v-if="refundOrder.refPoundage!=null && refundOrder.refPoundage!=undefined">
                            <span>退票手续费</span> <span>{{refundOrder.refPoundage}}元</span>
                        </li>
                        <li v-if="refundOrder.refTicketAmount!=null && refundOrder.refTicketAmount!=undefined">
                            <span>实退票款</span> <span>{{refundOrder.refTicketAmount}}元</span>
                        </li>
                        <li v-if="refundOrder.refCouponAmount!=null && refundOrder.refCouponAmount!=undefined">
                            <span>返还平台优惠</span> <span>{{refundOrder.refCouponAmount}}元</span>
                        </li>
                        <li v-if="refundOrder.refInsAmount!=null && refundOrder.refInsAmount!=undefined">
                            <span>实退出行保险</span> <span>{{refundOrder.refInsAmount}}元</span>
                        </li>
                    </ul>
                </div>
            </confirm>
        </div>
    </div>
</template>
<script>
import {
    TransferDom,Confirm
} from 'vux';

//订单详情有多套UI，共用一套js逻辑
//如果在某套UI上需要定制化扩展，在引入js后再对factory添加函数或方法
//如果是公共的功能，需在orderDetailFactory.js中扩展
import * as factory from 'trainComp/orderDetailFactory.js';
import requestHandler from 'orderCommon/requestHandler.js';

factory.methods.priceFormat = function () {
    if (arguments) {
        let sum = 0;
        for (let i in arguments) {
            let va = arguments[i];
            va != null && va != undefined && (sum += va);
        }
        return "￥" + sum;
    }
    return '--';
}

/**
     * 展示退款明细
     * @param psg 乘机人对象
     */
factory.methods.showRefundDetailPop = function (psg) {
    this.showRefundDetail = true;
    this.refundOrder = psg.tuiOrderList[0];
};

factory.methods.endDate = function () {
    // debugger
    if (!this.orderDetail || !this.orderDetail.startDate) {
        return '';
    }
    let endTime = (new Date(this.orderDetail.startDate + " " + this.orderDetail.startTime).getTime()) + this.orderDetail.runTime * 1000 * 60;
    return new Date(endTime).format("yyyy/MM/dd");
}

export default {
    directives: {
        TransferDom
    },
    mixins: [requestHandler.mixin.tChatEventMixin],
    components: {
        Confirm
    },
    data: function() {
        return factory.data();
    },
    created: factory.created,
    mounted: factory.mounted,
    activated: factory.activated,
    filters: factory.filters,
    methods: factory.methods
}
</script>
<style scoped lang="less">
    @import 'OrderDetail.less';
</style>
