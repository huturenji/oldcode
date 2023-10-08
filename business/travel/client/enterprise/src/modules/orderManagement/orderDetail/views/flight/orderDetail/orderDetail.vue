<template>
    <div class="page-order-detail" :class='{"filter-blur": showPriceDetail}'>
        <div class="loading" v-if="loading">
            <SnLoading :spinning="loading" :turn="true" tip="数据加载中" />
        </div>
        <div v-else class="order-detail-container">
            <div>
                <header>
                    <div class="summary">
                        <div class="status">{{custOrderStatus}}
                            <template v-if="showSubStatus(orderDetail.orderStatus)">
                                <span>{{chargeChangeAndRefundStatus()}}</span>
                            </template>
                        </div>
                            <div class="amount num-font cursorp" @click="showPriceDetail=true">
                                <span class="content"><span class="unit rmb">&yen;</span>{{orderDetail.amount}}</span>
                                <Icon type="right" size='.24' class="icon icon-btn cursorp"></Icon>
                        </div>
                    </div>
                    <div class="summary-note" v-if="orderDetail.orderStatus == 'UNPAID' && limitTime && limitTime>=0">
                        舱位已锁定，请在<span>{{limitTime | limitTimeFilter}}</span>内完成支付，超时订单将取消
                    </div>
                    <div class="summary-note" v-if="orderDetail.orderStatus == 'ALREADY_PAID'">
                        正在出票，预计{{orderExtraInfo.providerOutTicketExpire}}分钟内告知出票结果
                    </div>
                    <div class="order-no">
                        <span>订单号</span><span>{{orderDetail.providerOrderNo || orderDetail.orderNo}}</span>
                    </div>

                </header>

                <div class='flight-card-container'>
                    <FlightInfoCard v-for="airLine in airLineList" :key="airLine.airLineID" :selfOrder="judgeOrderBook()" ref="flightInfoCard" :orderExtraInfo="orderExtraInfo"
                        :airline="airLine" :roundTrip="airLine.specificVoyage" :orderDetail="orderDetail"
                        :flightOrderStatus="flightOrderStatus" :insuranceOrders="insuranceOrders" @changeTicketState="changeTicketState" @toPay="addMoneyPay"
                        @callPhone="callPhone" @reload='payTimeout' @cancelOrder="cancelOrder"/>
                    </div>
                </div>
                <ul class="items">
                    <li class='cursorp' @click="showDescription=true">
                        <div class="explanation icon-btn fr cursorp">
                            退改签 / 行李额详情
                        </div>
                        <Icon type="right" size='.24' class="icon icon-btn"/>
                    </li>
                <li class="insurancesOutWrap cursorp" v-if="insuredCountInfos.length > 0"  @click="gotoInsurancesList()">
                    <div class="insurancestit">
                        <div>出行保险<Icon type="icon_plane_bao" size='.3' class="icon icon-btn"/></div>
                    </div>
                    <div class="insurancesWrap">
                        <div class="text" v-for="(item,index) in insuredCountInfos" :key="index">
                            <div class='left'>{{item.insuranceName}}</div> 
                            <div class='right'>x{{item.insuredCount}}</div>
                    </div>
                </div>
                    <Icon type="right" size='.24' class="icon icon-btn"/>
                </li>
                <!--积分模块-->
                <!-- <li class='no-padding'>
                    <scoreItem productType='flight' :orderScore='orderScore'></scoreItem>
                </li> -->
            </ul>
            <div class="reimbursementVoucher cursorp"  @click="judgeOrderBook() && goReimburseDetail()"
                v-if='hasInvoice'>
                <div>
                    <div class="tripInfo">
                        <div class="tripMsg">
                            {{airLineList[0].sCityName}} - {{airLineList[0].eCityName}}
                        </div>
                        <div class="label">报销凭证</div>
                        <div class="point-icon"></div>
                    </div>
                    <div class="mailInfo nopay" v-if="orderDetail.orderStatus === 'UNPAID'">
                        <div class="message">邮寄报销凭证，快递费￥{{expressFee}}</div>
                        <div class="time">申请时间：{{orderDetail.orderTime}}</div>
                    </div>
                    <div class="mailInfo" v-else>
                        <div class="status">
                            <i class="statusIcon application" v-if="expressStatus === '已申请'"></i>
                            <i class="statusIcon mailing" v-else-if="expressStatus === '已邮寄'"></i>
                            <i class="statusIcon signing" v-else-if="expressStatus === '已签收'"></i>
                            {{expressStatus}}
                        </div>
                        <div class="message" v-if="expressStatus === '已申请'">行程结束后将为您邮寄</div>
                        <div class="message" v-else-if="expressStatus === '已邮寄'">已为您邮寄报销凭证</div>
                        <div class="message" v-else-if="expressStatus === '已签收'">已签收，签收人：{{orderAddress.name}}</div>
                        <div class="time" v-if="expressStatus === '已申请'">申请时间：{{expressStatusTime}}</div>
                        <div class="time" v-else-if="expressStatus === '已邮寄'">邮寄时间：{{expressStatusTime}}</div>
                        <div class="time" v-else-if="expressStatus === '已签收'">签收时间：{{expressStatusTime}}</div>
                    </div>
                </div>
                <Icon type="right" size='.24' class="icon icon-btn"/>
            </div>

            <div class="reimbursementTips" v-if="publicTiantian">*{{caution}}</div>

            <div class="customer-service"
                v-if="orderDetail.orderStatus!='ALREADY_CANCEL' && orderDetail.orderStatus!='UNPAID'">
                    本产品由{{orderDetail.providerShortName}}提供服务
            </div>
        </div>
        <div v-transfer-dom>
            <popup v-model="showCancelTicketSuc" height="100%" width="100%" position="right" class="cancel-ticket-suc pop-up"
                style="z-index: 502;">
                <cancelTicketSuc @closePop='showCancelTicketSuc=false'
                    @close="showCancelTicketSuc=false;showPsgPop = false;showCancelTicketInfo = false;" />
            </popup>
        </div>
        <div v-transfer-dom>
            <div class="price-detail-modal cursorp" v-if="showPriceDetail"  @click="showPriceDetail=false" @touchmove.prevent>
                <div class='content'>
                    <div class="total-price num-font">
                        <div><span class="unit">￥</span>{{orderDetail.amount}}</div>
                    </div>
                    <div class="price-detail">
                        <ul>
                            <li>
                                <div class="fl">机票价</div>
                                <div class="fr">
                                    <span class="unit rmb">&yen;</span>
                                    <span class='num-font'>{{airline.fare}}</span>
                                    <span class='split'>x</span> {{airline.passengers.length}}
                                </div>
                            </li>
                            <li v-if="airline.oil">
                                <div class="fl">燃油费</div>
                                <div class="fr">
                                    <span class="unit rmb">&yen;</span>
                                    <span class='num-font'>{{airline.oil}}</span>
                                    <span class='split'>x</span> {{airline.passengers.length}}
                                </div>
                            </li>
                            <li v-if="airline.tax">
                                <div class="fl">机建费</div>
                                <div class="fr">
                                    <span class="unit rmb">&yen;</span>
                                    <span class='num-font'>{{airline.tax}}</span>
                                    <span class='split'>x</span> {{airline.passengers.length}}
                                </div>
                            </li>
                            <li v-if="orderPsgs[0].serFee">
                                <div class="fl">手续费</div>
                                <div class="fr">
                                    <span class="unit rmb">&yen;</span>
                                    <span class='num-font'>{{orderPsgs[0].serFee}} </span>
                                    <span class='split'>x</span> {{orderPsgs.length}}
                                </div>
                            </li>
                            <li v-if="!!orderDetail && !!orderDetail.insFareAmount && 0 != orderDetail.insFareAmount">
                                <div class="fl">保险费</div>
                                <div class="fr">
                                    <span class="unit rmb">&yen;</span>
                                    <span class='num-font'>{{orderDetail.insFareAmount}}</span>
                                </div>
                            </li>
                            <li v-if="invoiceFlag=='1' || invoiceDone=='1'">
                                <div class="fl">快递费</div>
                                <div class="fr">
                                    <span class="unit rmb">&yen;</span>
                                    <span class='num-font'>{{expressFee || 0}}</span>
                                </div>
                            </li>
                            <li v-if="orderDetail && orderDetail.extraMoneyAmount">
                                <div class="fl">补款金额</div>
                                <div class="fr">
                                    <span class="unit rmb">&yen;</span>
                                    <span class='num-font'>{{orderDetail.extraMoneyAmount}}</span>
                                </div>
                            </li>
                            <!-- <li v-if="orderDetail && orderDetail.couponReduceAmount">
                                <div class="fl">优惠券</div>
                                <div class="fr ft-red">-￥{{orderDetail.couponReduceAmount}}</div>
                            </li> -->
                        </ul>
                    </div>
                    <Icon type='btn_common_close' size='.8' class='icon icon-close cursorp' @click.native="showPriceDetail=false"/>
                </div>
            </div>
        </div>
        <div v-transfer-dom>
            <div class='cust-mask' v-if='showDescription' @click='showDescription=false'></div>
            <Popup v-if='showDescription' v-model="showDescription" class='pop-up guest-rule-pop' position="bottom" :show-mask='false' height="80%" width="100%">
                <Description :cabin="{fare: airline.fare}" @closeDesc="showDescription = false" :cabinRules="airline.guestRule" :providerName="orderDetail.providerShortName" :bodyLock="showDescription" />
            </Popup>
        </div>

        <div v-transfer-dom>
            <popup v-model="showPsgPop" width="100%" position="bottom" class="pop-up">
                <psgCard :airline="choosedAirLine" :psgList="choosedAirLine.passengers || []" @orderType="orderType"
                    @onClose="showPsgPop=false" @onConfirm="confirmReturn" :popState="popState" ref="psgCard"></psgCard>
            </popup>
        </div>
        <div v-transfer-dom>
            <popup v-model="showEndorseInfo" height="100%" width="100%" :show-mask='false' position="right" class="show-endorse-info pop-up">
                <endorseInfo ref="endorseInfo" @searchFlight="onConfirm" @showDescription="showDescription=true"
                    :psgList="choosedPsgArr" :startCity="choosedAirLine.sCityName" :endCity="choosedAirLine.eCityName"
                    :startDate="choosedAirLine.beginDate" :cabinName="choosedAirLine.cabinName"
                    :cabinRank="choosedAirLine.cabinRank" :providerType='orderDetail.providerType'></endorseInfo>
            </popup>
        </div>
        <div v-transfer-dom>
            <popup v-model="showCancelTicketInfo" height="100%" width="100%" position="right" class="pop-up">
                <cancelTicketInfo ref="cancelTicketInfo" :psgList="choosedPsgArr" :airline="choosedAirLine"
                    :providerShortName="orderDetail.providerShortName" :orderDetail="orderDetail"
                    :baseConfig="baseConfig" @callPhone="callPhone" @onConfirm="onConfirm" @showInsuranceOrder="showInsuranceDetail" @showInsuranceOption="showInsuranceOptionPop = true"></cancelTicketInfo>
            </popup>
        </div>
        <!-- 保险说明 -->
        <div v-transfer-dom>
            <popup v-model="showInsurancePop" height="100%" width="100%" position="right" class=insurancePopWrap>
                <flightInsuranceDetail v-model="showInsurancePop" :insuranceDetail="insuranceDetail"
                    :haveOrderInfo="true"></flightInsuranceDetail>
            </popup>
        </div> 
        <!-- 退保说明 -->
        <div v-transfer-dom>
            <popup v-model="showInsuranceOptionPop" height="100%" width="100%" position="right" class=insurancePopWrap>
                <flightInsuranceOption v-model="showInsuranceOptionPop"></flightInsuranceOption>
            </popup>
        </div>       

        <div v-transfer-dom>
            <loading :show="popLoading" text="加载中"></loading>
        </div>
    </div>
</template>

<script>
import requestHandler from 'orderCommon/requestHandler.js';
//混入A为BCD订票后BCD 屏蔽操作的方法
import mixin from 'orderCommon/orderMixin.js';
import {
    TransferDom,
    Popup,
    Loading
} from 'vux';
import psgCard from 'psgCard/psgCard.vue'
import endorseInfo from 'flightComp/endorseInfo.vue'
import cancelTicketInfo from 'flightComp/cancelTicketInfo.vue';
// import FlightTimesComp from 'flightComp/flightTimesComp.vue';
import FlightInfoCard from 'flightComp/flightInfoCard.vue';
import cancelTicketSuc from 'flightComp/cancelTicketSuc.vue';
import Description from 'components/flightticketrule/description';
// import scoreItem from 'components/score/scoreItem.vue';
import flightInsuranceDetail from 'flightComp/flightInsuranceDetail.vue';
import flightInsuranceOption from 'flightComp/flightInsuranceOption.vue';
    
//订单详情有多套UI，共用一套js逻辑
//如果在某套UI上需要定制化扩展，在引入js后再对factory添加函数或方法
//如果是公共的功能，需在orderDetailFactory.js中扩展
import * as factory from 'flightComp/js/orderDetailFactory.js';
// let fromWhere = '';
const Icon = ()=>import('components/icon');
// const SnButton = ()=>import('components/button');
const SnLoading = ()=>import('components/loading');
export default {
    directives: {
        TransferDom
    },
    mixins: [mixin,requestHandler.mixin.tChatEventMixin],
    components: {
        Popup,
        psgCard,
        FlightInfoCard,
        Description,
        endorseInfo,
        cancelTicketInfo,
        cancelTicketSuc,
        Loading,
        // scoreItem,
        flightInsuranceDetail,
        flightInsuranceOption,
        SnLoading,
        Icon
    },
    // eslint-disable-next-line vue/no-shared-component-data
    data: factory.data(),
    watch: factory.watch,
    computed: factory.computed,
    created: factory.created,
    mounted: factory.mounted,
    beforeRouteEnter: factory.beforeRouteEnter,
    activated: factory.activated,
    filters: factory.filters,
    methods: factory.methods
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/orderDetail/flight/orderDetail.less';
</style>
<style lang="less">
    @import '~themes/default/styles/common/index.less';
    @import '~styles/mixins/mixinsStyle.less';

    .body-noscroll,
    .body-noscroll body {
        overflow: hidden;
    }
    .body-noscroll body {
        position: relative;
    }

    .weui-dialog__btn {
        font-size: .32rem;
    }


    .text-phone {
        color: @theme-color;

    }
    .bigbox{
        position: relative;
        height: 2.28rem;
        .box{
            background: url(~assets/img/compment/icon_orderdetail_reminder.svg)no-repeat;
            background-size: 100%;
            position: absolute;
            width: .72rem;
            height: .72rem;
            top: -.36rem;
            left: 2.19rem;
        }
        .orderfail{
            height: .33rem;
            font-size: .34rem;
            font-weight: 600;
            position: absolute;
            top: .53rem;
            left: 1.45rem;
        }
        .p{
            width: 3.68rem;
            height: .31rem;
            font-size: .32rem;
            line-height: .44rem;
            position: absolute;
            top: 1.24rem;
            left: .01rem;
        }
        .sp{
            width: 3.2rem;
            height: .3rem;
            font-size: .32rem;
            line-height: .44rem;
            position: absolute;
            top: 1.7rem;
            left: .1rem;
        }
    }
</style>
