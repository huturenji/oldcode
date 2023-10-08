<template>
    <div class="orderDetail">
        <!--tab-->
        <SnLoading v-if="loading" :spinning="loading" :turn="true" tip="数据加载中" />
        <div v-else class="tab" :class="{showPriceDetail:showPriceDetail,bigPaddingt:(orderInfo.orderStatus == 'WAIT_FOR_CONFIRM' || orderInfo.orderStatus == 'ALREADY_PAY_WAIT_CONFIRM') || (orderInfo.orderStatus == 'WAIT_FOR_PAY' && limitTime && limitTime>=0)}">
            <div class="topbgWrap">
                <div class="topbg"></div>
            </div>
            <div class="contectOutWrap">
                <div class="head">
                    <div class="summary">
                        <div class="status">{{custOrderStatus}}</div>
                        <div class="amount cursorp num-font" @click="showPriceDetail=true">
                            <span class="roomTypeTips">{{orderInfo.roomType == 1?'在线付':'到店付'}}</span>
                            <span class="unit">￥</span>
                            <span class="amountNum">{{orderInfo.orderAmount}}</span>
                            <Icon type='right' class="amountRight normal-btn" size=".24"/>
                        </div>
                    </div>
                    <div class="summary-note" v-if="orderInfo.orderStatus == 'WAIT_FOR_CONFIRM' || orderInfo.orderStatus == 'ALREADY_PAY_WAIT_CONFIRM'">
                        请您耐心等待，我们正在帮您加急确认中！
                    </div>
                    <div class="summary-note"
                        v-if="orderInfo.orderStatus == 'WAIT_FOR_PAY' && limitTime && limitTime>=0">
                        请在<span>{{limitTime | limitTimeFilter}}</span>内完成支付，超时订单将取消
                    </div>
                    <div class="order-no">
                        <span>订单号</span><span>{{orderInfo.providerOrderNo || orderInfo.orderNo}}</span>
                    </div>
                </div>
                <HotelCard :orderInfo="orderInfo" @openIntroduction="openIntroduction" />
                <!-- 预付型酒店、已支付、已取消 -->
                <div class="refundTextWrap cursorp normal-btn"
                    v-if="orderInfo.roomType == 1 && orderInfo.orderStatus == 'ALREADY_CANCEL' && orderInfo.payState == 'PAID' "
                    @click="showCancelOrderBut = false;showCancelOrder = true;">
                    <div class="refundTit ">取消成功</div>
                    <div class="refundtwxtWrap">
                        <div class="refundText nowrap"><Icon type='icon_common_prompt' class="refundTips normal-btn" size=".26"/>退款<span>（￥{{orderInfo.refundInfo.refundAmount}}）</span>将在1-7个工作日内原路退回</div>
                        <Icon type='right' class="refundRight normal-btn" size=".24"/>
                    </div>
                </div>
                <!-- 现付型酒店、需担保、已取消、已支付 -->
                <div class="refundTextWrap"
                    v-if="orderInfo.roomType == 0 && orderInfo.guarantee && orderInfo.orderStatus == 'ALREADY_CANCEL' && orderInfo.payState == 'PAID'">
                    <div class="refundTit ">取消成功</div>
                    <div class="refundtwxtWrap">
                        <div class="refundText nowrap"><Icon type='icon_common_prompt' class="refundTips normal-btn" size=".26"/>酒店已扣取您预付的担保金<span>（￥{{orderInfo.refundInfo.penaltyAmount || ''}}）</span></div>
                    </div>
                </div>
                <!-- 取消规则 -->
                <div class="lineTextWrap cursorp normal-btn" @click="showCancelDescription=true">
                    <div class="lineInWrap">
                        <div class="lineText nowrap">取消规则：{{orderInfo.cancelDescription}}</div>
                        <Icon type='right' class="lineTextRight normal-btn" size=".24"/>
                    </div> 
                </div>
                <!-- 再次预订 -->
                <!-- <div class="reOrderWrap">
                    <Button class="primaryButton" type="primary" v-if="orderInfo.orderStatus=='ALREADY_CANCEL' || orderInfo.orderStatus=='HOTEL_REJECT_ORDER'" @click="judgeOrderBook() && orderAgain()">再次预订</Button>
                </div> -->
                <!-- 酒店信息 -->
                <HotelOrderCard class="hotelOrderCard" :inDate='inDate' :outDate='outDate' :inDays='inDays' :roomName='orderInfo.roomName'
                    :orderInfo="orderInfo" :passengers='orderInfo.passengers' hasName=true @showMap="showMap"
                    @openIntroduction="openIntroduction" />
                <!-- 预订人信息 -->    
                <div class="orderCustomerInfo">
                    <div class="textLineShow textTitle bbpxs">
                        <div class="leftitem">预订信息</div>
                    </div>
                    <div class="textLineShow bbpxsl">
                        <div class="leftitem font-info">入住人</div>
                        <div class="rightItem" onclick="return false">
                            {{orderInfo.passengers && orderInfo.passengers.replace(/,/g,'  ')}}</div>
                    </div>
                    <div class="textLineShow">
                        <div class="leftitem font-info">联系电话</div>
                        <div class="rightItem" onclick="return false">
                            {{orderInfo.contactMobile}}</div>
                    </div>
                </div>
                <!-- 报销凭证 -->   
                <div v-if="orderInfo.orderStatus != 'ALREADY_CANCEL'">
                    <div v-if="orderInfo.roomType=='1' && 'BusinessTrip' == orderInfo.invoiceMode" class="cursorp">
                        <div @click="judgeOrderBook() && viewInvoiceFun()" v-if="orderInfo.invoiceDone=='1' || orderInfo.invoiceFlag=='1'" class="rightWrap reimburse">
                            <div class="left">
                                报销凭证
                            </div>
                            <div>
                                增值税普通发票（电子）
                            </div>
                            <div class="rightButtonWrap">
                                详情
                                <Icon type='right' class="rightButton normal-btn" size=".24"/>
                            </div>
                        </div>
                    </div>
                    <div v-else class="rightWrap hotel-reimburse">
                        <div class="left">
                            报销凭证
                        </div>
                        <div>
                            如需报销凭证，请向酒店前台索取
                        </div>
                    </div>
                </div>
                <!--积分模块-->
                <!-- <div class='rightWrap no-padding'>
                    <scoreItem productType='hotel' :orderScore='orderScore'></scoreItem>
                </div> -->
            </div>
            <!-- 价格明细 -->
            <div v-transfer-dom>
                <div class="price-detail-modal cursorp" v-if="showPriceDetail" @click="showPriceDetail=false">
                    <div class="total-price">
                        <div>价格明细</div>
                        <div><span class="unit">￥</span>{{orderInfo.orderAmount}}</div>
                    </div>
                    <div class="price-detail">
                        <ul>
                            <li>
                                <div class="fLeft">{{orderInfo.roomName}}</div>
                                <div class="fRight">￥{{orderInfo.orderAmount}}</div>
                            </li>
                            <li v-for="(item) in orderInfo.nightlyRates" :key="item.currentDate">
                                <div class="fLeft">{{item.currentDate}} {{item.breakfastDesc}}</div>
                                <div class="fRight">￥{{item.amount}} *
                                    {{!!orderInfo.passengers && orderInfo.passengers.split(',').length}}</div>
                            </li>
                            <!-- <li v-if="!!orderInfo.coupons&&orderInfo.coupons.length>0">
                                <div class="fLeft">优惠券</div>
                                <div class="fRight ft-red">-￥{{orderInfo.coupons[0].couponValue}}</div>
                            </li> -->
                        </ul>
                    </div>
                    <a class="modal-close-btn" @click="showPriceDetail=false"></a>
                </div>
            </div>
            <!-- 取消酒店界面 -->
            <div v-transfer-dom>
                <div class="price-detail-modal cancelOrder" v-if="showCancelOrder">
                    <div class="cancelOrderLine lineBorderB">
                        <div class="left">
                            <!-- <div class="cancelOrderTit">订单金额： 个人实付￥{{orderInfo.refundInfo.payAmount}}（{{getPayTypeName(orderInfo.payType )}}）</div> -->
                            <div class="cancelOrderTit">订单金额：
                                个人实付￥{{orderInfo.refundInfo.payAmount}}
                                <!-- +优惠券￥{{orderInfo.refundInfo.refCouponAmount || 0}} -->
                            </div>
                        </div>
                    </div>
                    <div class="cancelOrderLine lineBorderB">
                        <div class="left">
                            <div class="cancelOrderTit">酒店扣费： ￥{{orderInfo.refundInfo.penaltyAmount}}</div>
                            <div class="cancelOrderText"
                                v-if="!(orderInfo.orderStatus == 'ALREADY_CANCEL' && orderInfo.payState == 'PAID')">
                                实际扣费以酒店审核为准</div>
                        </div>
                        <div class="right cursorp normal-btn" @click="showCancelDescription = true">查看规则</div>
                    </div>
                    <div class="cancelOrderLine lineBorderB">
                        <div class="left">
                            <div class="cancelOrderTit">应退金额： ￥{{orderInfo.refundInfo.refundAmount}}</div>
                            <div class="cancelOrderText">退款将在1-7个工作日内退回原支付账户</div>
                        </div>
                    </div>
                    <div class="cancleTipsWrap">
                        <div class="cancleTipsTit">退款说明：</div>
                        <div class="cancleTips">1.优惠券使用后不予折现退款；</div>
                        <div class="cancleTips">2.实退金额=个人实付—酒店扣费，如酒店扣费大于个人实付金额，则实退金额为0元；</div>
                    </div>
                    <div class="cancelButton cursorp normal-btn" v-if="showCancelOrderBut" @click="onConfirm">确认</div>
                </div>
            </div>
            <div v-transfer-dom>
                <loading :show="cancelLoading" text="正在取消预订，请稍候"></loading>
            </div>
            <!-- 取消规则 -->
            <div v-transfer-dom>
                <div class="price-detail-modal cancelDescription" v-if="showCancelDescription">
                    <div class="cancelTit">取消规则</div>
                    <div class="cancelText">{{orderInfo.cancelDescription}}</div>
                    <div class="cancelTit">入住离店</div>
                    <div class="cancelText">入住请在当日14点以后办理，早到店可能需要等待，离店请在当日12点以前办理</div>
                    <div class="cancelTit">膳食安排</div>
                    <div class="cancelText">{{orderInfo.nightlyRates[0].breakfastDesc}}</div>
                </div>
            </div>

            <div v-transfer-dom>
                <loading :show="popLoading" text="加载中"></loading>
            </div>
        </div>
    </div>
</template>

<script>
import requestHandler from 'orderCommon/requestHandler.js';
import mixin from 'orderCommon/orderMixin.js';
import {
    TransferDom,
    Loading
} from 'vux';
import HotelCard from 'hotelComp/HotelCard.vue';
import HotelOrderCard from 'hotelComp/HotelOrderCard.vue';
// import LoadingX from "components/loading/LoadingX.vue";
import * as factory from 'hotelComp/js/orderDetailFactory.js';
import Icon from "components/icon";
import Button from 'components/button';
const SnLoading = ()=>import('components/loading');
export default {
    directives: {
        TransferDom
    },
    mixins: [mixin,requestHandler.mixin.tChatEventMixin],
    components: {
        HotelCard,
        HotelOrderCard,
        Loading,
        Icon,
        Button,
        SnLoading
    },
    // eslint-disable-next-line vue/no-shared-component-data
    data: factory.data,
    computed: factory.computed,
    filters: factory.filters,
    created: factory.created,
    mounted: factory.mounted,
    beforeRouteLeave: factory.beforeRouteLeave,
    methods: factory.methods
}
</script>
<style lang="less">
    @import './orderDetail.less';
</style>
<style lang="less">
    .body-noscroll,
    .body-noscroll body {
        overflow: hidden;
    }
    .body-noscroll body {
        position: relative;
    }
    .child-view {
        min-height: 100vh;
        height: auto;
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
