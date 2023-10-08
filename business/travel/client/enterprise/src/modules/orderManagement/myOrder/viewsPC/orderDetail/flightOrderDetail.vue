<template>
    <div class="detailContainer">
        <div class="detailContent">
            <div class="detailHead">
                <div class="headState">
                    <div class="stateOne" :style="{color: orderStatusColor}">{{custOrderStatus}}
                        <template v-if="orderDetail.orderStatus=='ALREADY_OUT_TICKET'">
                            <span v-if="orderDetail.hasTui && !orderDetail.hasGai">（有退票）</span>
                            <span v-if="orderDetail.hasGai && !orderDetail.hasTui">（有改签）</span>
                            <span v-if="orderDetail.hasGai && orderDetail.hasTui">（有退改）</span>
                        </template>
                    </div>
                    <div class="stateTwo">
                        <span>订单号 {{orderDetail.providerOrderNo || orderDetail.orderNo}}</span>
                        <span>总金额<span class="money">￥{{orderDetail.amount}}</span>
                            <!--<span class="detail">明细</span>-->
                        </span>
                    </div>
                </div>
                <div class="headInfo">
                    <div class="infoOne">
                        <span class="left">预订人：</span>
                        <span
                            class="right">{{orderDetail && orderDetail.contactName || '无'}}</span>
                    </div>
                    <div class="infoOne">
                        <span class="left">联系电话：</span>
                        <span class="right">{{orderDetail.contactTel}}</span>
                    </div>
                    <!-- <div class="infoOne">
                        <span class="left">部门：</span>
                        <span
                            class="right">{{orderDetail && orderDetail.founderInfo && orderDetail.founderInfo.founderDepartment || '无'}}</span>
                    </div> -->
                    <div class="infoOne">
                        <span class="left">支付方式：</span>
                        <span class="right">{{orderDetail.payName}}</span>
                    </div>
                </div>
            </div>
            <div class="detailCenterFly" v-for="(airline,index) in airLineList" :key="index" :class="{disable: airline.disableStyle}">
                <div class="centerState" v-if="airline.isGaiOrder">
                    <img src="~assets/img/myOrder/gai.png" />
                </div>
                <div class="centerTop">
                    <div class="topLeft airline-info">
                        <div class="stateOne">
                            <span class="state">
                                 <airlogo class="logo" :airCode="airline.airLineCode"/>
                                {{airline.airLineName}}
                            </span>
                        </div>
                        <div class="stateTwo">
                            <div class="infoOne">
                                <span class="left">{{airline.sCityName}} - {{airline.eCityName}}</span>
                                <span class="right">{{airline.cabinName}}</span>
                            </div>
                            <div class="infoOne">
                                <span class="left">{{airline.departDate}}</span>
                                <span></span>
                                <!--<span class="right smColor">超标</span>-->
                            </div>
                        </div>
                    </div>
                    <!--<div class="topBorder"></div>-->
                    <div class="topRight">
                        <div class="stateTwo">
                            <div class="infoOne">
                                <span class="left">{{airline.beginTime}}</span>
                                <span class="center jtBg">{{countTime(airline)}}</span>
                                <span class="right">{{airline.arriveTime}}</span>
                            </div>
                            <div class="infoOne infoSec">
                                <span class="left">{{airline.sAirportName+airline.sTerminal}}</span>
                                <span class="center">
                                    <template v-if="airline.stopNum>0">
                                        经停{{airline.stopItems[0].stopCityName}}{{airline.stopItems.length>1?(','+airline.stopItems[1].stopCityName):''}}
                                    </template>
                                </span>
                                <span class="right">{{airline.eAirportName+airline.eTerminal}}</span>
                            </div>
                        </div>
                        <div class="stateOne smFont">
                            <span class="state">{{airline.planeType}} | {{airline.isHasMeal?'有餐饮':'无餐饮'}}</span>
                        </div>

                    </div>
                </div>
                <div class="centerBot">
                    <div class="botLeft" v-for=" (passenger,index) in airline.passengers" :key="index"
                        :class="{disable: !airline.isGaiOrder && psgStatuState(passenger.status)==StateStyle.SUCCESS && getPsgStatuType(passenger.status)=='1'}">
                        <div class="stateOne">
                            <span>{{passenger.psgName}} {{airline.cabinName}}</span>
                            <!--<span class="state">{{custOrderStatus}}</span>-->
                        </div>
                        <div class="stateTwo">
                            <div class="infoOne">
                                <span class="left">{{strIdType(passenger.cardType)}}：</span>
                                <span class="right">{{passenger.cardNo}}</span>
                            </div>
                            <div class="infoOne">
                                <span class="left">联系电话：</span>
                                <span class="right">{{passenger.mobile}}</span>
                            </div>
                            <div class="infoOne">
                                <!--<span class="left">部门：</span>
                                <span class="right">部门</span>-->
                            </div>
                        </div>
                        <div class="cust-btn-group">
                            <div>
                                <div class="passenger-status" :style="{color: getPsgStatusColor(passenger.status)}"
                                    v-if="getPsgStatusName(passenger.status, airline.isGaiOrder)">
                                    {{getPsgStatusName(passenger.status, airline.isGaiOrder)}}</div>

                                <template v-if="!airline.isGaiOrder">
                                    <div class="tips-wait" v-if="orderDetail.orderStatus=='ALREADY_PAID'">正在出票，请稍候</div>
                                    <div class="tips-wait" v-if="orderDetail.orderStatus=='UNPAID'">待支付</div>
                                    <div class="tips-wait"
                                        v-if="orderDetail.orderStatus=='ALREADY_OUT_TICKET' && psgStatuState(passenger.status)==StateStyle.NORMAL">
                                        出票成功</div>
                                    <div class="tips-failed" v-if="orderDetail.orderStatus=='FAILED_OUT_TICKET'">出票失败
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="tips-wait"
                                        v-if="getPsgStatuType(passenger.status)=='1' && psgStatuObj(passenger.status).ticketStatus== 'ALREADY_PAID'">
                                        正在出票，请稍候</div>
                                </template>

                            </div>
                        </div>
                        <table cellspacing="0" cellpadding="0" class="botTabel"
                            :class="{disable: psgStatuState(passenger.status)==StateStyle.SUCCESS && getPsgStatuType(passenger.status)=='0'}"
                            v-if="(airline.isGaiOrder && psgStatuState(passenger.status)==StateStyle.SUCCESS)
                                        || (!airline.isGaiOrder && !(getPsgStatuType(passenger.status)=='1' &&  psgStatuState(passenger.status)!=StateStyle.SUCCESS))">
                            <tr>
                                <th>机票价格</th>
                                <th>机建燃油</th>
                                <th>保险费</th>
                                <th>改签费</th>
                                <th>服务费</th>
                                <th>总消费</th>
                            </tr>
                            <tr>
                                <td>{{passenger.fare}}<span class="disCount">(6.5折)</span></td>
                                <td>{{priceFormat(passenger.tax,passenger.oil)}}</td>
                                <td>{{priceFormat(passenger.insFareAmount)}}
                                    <!--<img src="~assets/img/myOrder/ti.png" class="tipsImg">-->
                                </td>
                                <td>{{priceFormat(passenger.gaiQianAddAmount)}}</td>
                                <td>{{priceFormat(passenger.serFee)}}</td>
                                <td>{{priceFormat(passenger.fare,passenger.tax,passenger.oil,passenger.insFareAmount,passenger.gaiQianAddAmount,passenger.serFee )}}
                                </td>
                            </tr>
                        </table>

                        <div class="message-contanier">
                            <div class="status-message ticket-failed-info"
                                v-if="orderDetail.orderStatus=='FAILED_OUT_TICKET'">
                                因航司系统繁忙，出票失败；退款将在1-7个工作日内原路返回
                            </div>
                            <div class="status-message gai-failed-info"
                                v-if="getPsgStatuType(passenger.status)=='1' && psgStatuState(passenger.status)== StateStyle.FAILED">
                                您改签的航班{{passenger.endorseShortInfo && '（'+passenger.endorseShortInfo+'）'}}由于航司系统繁忙改签失败，如有需要可重新提交
                            </div>
                            <template v-if="!!passenger.tuiOrderList && passenger.tuiOrderList.length>0">
                                <div class="status-message tui-failed-info"
                                    v-if="getPsgStatuType(passenger.status)=='0' && psgStatuState(passenger.status)== StateStyle.FAILED">
                                    {{passenger.tuiOrderList[0].platformRemarks || '因航司系统繁忙，请持购票有效证件到机场值机柜台办理'}}
                                </div>
                                <div class="status-message tui-success-info"
                                    v-if="psgStatuState(passenger.status)==StateStyle.SUCCESS && getPsgStatuType(passenger.status)=='0' && !!passenger.tuiOrderList && passenger.tuiOrderList.length>0">
                                    退款{{passenger.tuiOrderList[0] | calcPrice}} 将在1-7个工作日内原路退回
                                    <div class="link-btn normal-btn cursorp" @click="showRefundDetailPop(airline)">退款明细</div>
                                </div>
                            </template>
                        </div>
                        <div class="gai-process-info" v-if="showGaiProcessInfo(airline)">
                            正在为您办理改签，请稍候...
                        </div>
                    </div>
                </div>
            </div>
            <!--<div class="detailTips"> <img src="~assets/img/myOrder/ti.png" />-->
            <!--取票、退票、改签说明 </div>-->
            <div class="detailFoot" v-if="invoiceFlag=='1' || invoiceDone=='1'">
                <div class="footLeft">
                    <div class="title"> 报销凭证 </div>
                    <div class="content">
                        <div class="infoOne">
                            <span class="left">报销凭证</span>
                            <span class="right">含行程单、快递费发票</span>
                        </div>
                        <div class="infoOne">
                            <span class="left">配送方式</span>
                            <span class="right">快递<span>￥{{expressFee}}</span></span>
                        </div>
                        <div class="infoOne">
                            <span class="left">发票抬头</span>
                            <span class="right">
                                {{orderTax.name}}
                                <template v-if="orderTax.tax">
                                    ({{orderTax.tax}})
                                </template>
                            </span>
                        </div>
                        <div class="infoOne">
                            <span class="left">配送地址</span>
                            <div class="right">
                                <div>{{orderAddress.area + orderAddress.address}}</div>
                                <div>{{orderAddress.name}}(收) 联系电话:{{orderAddress.phone}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="detailBtn"> 本产品由{{orderDetail.providerShortName}}提供服务--联系电话<span
                    class="tel">{{orderDetail.providerPhone}}</span> </div>
        </div>
    </div>
</template>
<script>
import {
    TransferDom
} from 'vux';
import { getFlightPsgStatusName, getFlightPsgStatusColor, getFlightPsgStatusObj } from 'orderCommon/enum/psgStatusEnum.js'
//订单详情有多套UI，共用一套js逻辑
//如果在某套UI上需要定制化扩展，在引入js后再对factory添加函数或方法
//如果是公共的功能，需在orderDetailFactory.js中扩展
import * as factory from 'flightComp/js/orderDetailFactory.js';
import { getCardTypeName } from 'orderCommon/enum/custInfoEnum.js';
import airlogo from 'components/airlogo/airlogo.vue'
import requestHandler from 'orderCommon/requestHandler.js';
let data = {
    showRefundDetail: false,
    refundOrder: {}
}

/**
     * 更改证件显示文字
     * @param type 证件id
     * @returns {*}
     */
factory.methods.strIdType = function (type) {
    return getCardTypeName(type);
};
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
factory.methods.showRefundDetailPop = function (airline) {
    requestHandler.openPageLib('enterprise/index.html#/order/refund/flight?orderNo=' + this.orderDetail.orderNo + '&airLineId=' + airline.airLineID );
};
/**
     * 获取出行人的状态名字
     * @param status 状态码
     * @returns {*}
     */

factory.methods.getPsgStatusName = function (status, isGaiOrder) {
    //改签单取分组1的状态名称
    return getFlightPsgStatusName(status, isGaiOrder ? 1 : null);
};
/**
     * 获取出行人的状态颜色
     * @param status 状态码
     * @returns {*}
     */
factory.methods.getPsgStatusColor = function (status) {
    return getFlightPsgStatusColor(status);
};
/**
     * 获取出行人的状态State
     * @param status 状态码
     * @returns {*}
     */
factory.methods.psgStatuState = function (status) {
    //非改签单，才显示disable的样式
    try {
        return this.psgStatuObj(status).state;
    } catch (e) {
        return null;
    }
};
/**
     * 获取出行人的状态Obj
     * @param status 状态码
     * @returns {*}
     */
factory.methods.psgStatuObj = function (status) {
    //非改签单，才显示disable的样式
    try {
        return getFlightPsgStatusObj(status);
    } catch (e) {
        return {};
    }
};
/**
     * 获取乘机人对象类型
     * @param status
     * @returns 0：退票，1：改签；-1：正常
     */
factory.methods.getPsgStatuType = function (status) {
    try {
        return this.psgStatuObj(status).type;
    } catch (e) {
        return -1;
    }
};
/**
     * 是否展示“正在为您办理改签，请稍候”文字...
     * @param airline 航班信息
     */
factory.methods.showGaiProcessInfo = function (airline) {
    if (!airline.isGaiOrder) {
        return false;
    }
    let flag = false;
    airline.passengers.forEach((passenger) => {
        //如果需要补款，就不显示这段话
        if (!airline.gaiOrder.isNeedAddMoney && getFlightPsgStatusObj(passenger.status).state == this.StateStyle.INPROCESS) {
            flag = true;
                
        }
    })
    return flag;
};

factory.filters.calcPrice = function (tuiOrder) {
    let amount = (tuiOrder.refTicketAmount || 0) + (tuiOrder.refInsAmount || 0);
    return amount ? "（￥" + amount + "）" : "";
}

export default {
    directives: {
        TransferDom
    },
    mixins: [requestHandler.mixin.tChatEventMixin],
    components: {
        airlogo
    },
    data: function() {
        return factory.data(data);
    },
    computed: factory.computed,
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
