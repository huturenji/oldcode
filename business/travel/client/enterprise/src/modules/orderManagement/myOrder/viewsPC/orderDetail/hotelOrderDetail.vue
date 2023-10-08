<template>
    <div class="detailContainer">
        <div class="detailContent">
            <div class="detailHead">
                <div class="headState">
                    <div class="stateOne" :style="{color: orderStatusColor}">{{custOrderStatus}}</div>
                    <div class="stateTwo">
                        <span>订单号 {{orderInfo.providerOrderNo || orderInfo.orderNo}}</span>
                        <span>总金额<span class="money">￥{{orderInfo.orderAmount}}</span>
                            <!--<span class="detail">明细</span>-->
                        </span>
                    </div>
                </div>
                <div class="headInfo">
                    <div class="infoOne">
                        <span class="left">预订人：</span>
                        <span
                            class="right">{{orderInfo && orderInfo.founderInfo && orderInfo.founderInfo.founderName || '无'}}</span>
                    </div>
                    <div class="infoOne">
                        <span class="left">联系电话：</span>
                        <span class="right">{{orderInfo.contactMobile}}</span>
                    </div>
                    <!-- <div class="infoOne">
                        <span class="left">部门：</span>
                        <span
                            class="right">{{orderInfo && orderInfo.founderInfo && orderInfo.founderInfo.founderDepartment || '无'}}</span>
                    </div> -->
                    <div class="infoOne">
                        <span class="left">支付方式：</span>
                        <span class="right">{{orderInfo || payTypeFilter(orderInfo) || '无'}}</span>
                    </div>
                </div>
            </div>
            <div class="detailCenterHotel">
                <div class="centerHotel">
                    <div class="hotelTop">
                        <div class="top1">{{orderInfo.hotelName}}</div>
                        <div class="top2">{{orderInfo.address}}</div>
                    </div>
                    <div class="hotelLeft">
                        <div class="stateOne"> {{orderInfo.roomName}} </div>
                        <div class="stateTwo">
                            <div class="infoOne">
                                <span class="left">入住
                                    <span>{{new Date(InDate).format('yyyy/MM/dd') | getWeekDay}}</span></span>
                                <span class="right">离店
                                    <span>{{new Date(OutDate).format('yyyy/MM/dd') | getWeekDay}}</span></span>
                            </div>
                        </div>
                        <div class="stateTwo">
                            <div class="infoTwo">
                                <span class="left">{{new Date(InDate).format('MM月dd日')}}</span>
                                <span class="center">共{{InDays}}晚</span>
                                <span class="right">{{new Date(OutDate).format('MM月dd日')}}</span>
                            </div>
                        </div>
                        <div class="stateOne"> <span class="info11"> {{orderInfo.roomName}} </span> <span
                                class="info11"> 免费wifi {{orderInfo.breakfastType}}</span> </div>
                        <table cellspacing="0" cellpadding="0" class="botTabel">
                            <tr>
                                <th>日期</th>
                                <th v-for="(item,index) in orderInfo.nightlyRates" :key="index">{{item.currentDate}}</th>
                            </tr>
                            <tr>
                                <td>每日房价</td>
                                <td v-for="(item,index) in orderInfo.nightlyRates" :key="index">{{item.amount}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="detailFootHotel">
                <div class="footHotelLeft">
                    <div class="title"> 入住人信息 </div>
                    <div class="content" v-if="orderInfo.passengers">
                        <div class="infoOne" v-for="(psg,index) in orderInfo.passengers.split(',')" :key="index">
                            <div class="left"><img src="~assets/img/myOrder/room.png" />房间</div>
                            <div class="right">
                                <div class="infoR">{{psg}}</div>
                                <div class="infoR"><span class="tel">联系电话：</span><span>{{orderInfo.contactMobile}}</span></div>
                                <!--<div class="infoR"><span class="tel">部门：</span><span></span></div>-->
                                <div class="infoR"><span
                                        class="tel">房费：</span><span>￥{{orderInfo.orderAmount / orderInfo.passengers.split(',').length}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="detailFoot" v-if="orderInfo.invoiceFlag=='1' || orderInfo.invoiceDone=='1'">
                <div class="footLeft">
                    <div class="title"> 报销凭证 </div>
                    <div class="content">
                        <div class="infoOne">
                            <span class="left">发票类型</span>
                            <span class="right">增值税普通发票（电子）</span>
                        </div>
                        <div class="infoOne">
                            <span class="left">发票内容</span>
                            <span class="right">服务费</span>
                        </div>
                        <div class="infoOne">
                            <span class="left">发票抬头</span>
                            <span class="right" v-if="!!orderInfo.invoiceInfo">
                                {{orderInfo.invoiceInfo.name || ''}}
                                <template v-if="orderInfo.invoiceInfo.tax">
                                    ({{orderInfo.invoiceInfo.tax}})
                                </template>
                            </span>
                        </div>
                        <div class="infoOne">
                            <span class="left">发票备注</span>
                            <span class="right"
                                v-if="!!orderInfo.invoiceRemarks">{{orderInfo.invoiceRemarks || ''}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="detailBtn"> 本产品由{{orderInfo.providerShortName}}提供服务--联系电话<span
                    class="tel">{{orderInfo.providerPhone}}</span> </div>
        </div>
    </div>
</template>
<script>
import {
    TransferDom
} from 'vux';
import requestHandler from 'orderCommon/requestHandler.js';

//订单详情有多套UI，共用一套js逻辑
//如果在某套UI上需要定制化扩展，在引入js后再对factory添加函数或方法
//如果是公共的功能，需在orderDetailFactory.js中扩展
import * as factory from 'hotelComp/js/orderDetailFactory.js';

factory.methods.endDate = function () {
    if (!this.orderDetail || !this.orderDetail.startDate) {
        return '';
    }
    let endTime = (new Date(this.orderDetail.startDate + " " + this.orderDetail.startTime).getTime()) + this.orderDetail.runtime * 1000 * 60;
    return new Date(endTime).format("yyyy/MM/dd");
}

export default {
    directives: {
        TransferDom
    },
    mixins: [requestHandler.mixin.tChatEventMixin],
    components: {
    },
    data: function() {
        return factory.data;
    },
    created: factory.created,
    methods: factory.methods,
    filters: {
        ...factory.filters,
        payTypeFilter: function (value) {
            if (value.roomType == 0) { //现付订单展示到店付
                return '到店付';
            }
            return value.payName;
        },
        getWeekDay(value) {
            if (!value) {
                return '';
            }
            let date = new Date(value);
            return requestHandler.indexToWeek(date.getDay(), 3);
        }
    }
}
</script>
<style scoped lang="less">
    @import 'OrderDetail.less';
</style>
