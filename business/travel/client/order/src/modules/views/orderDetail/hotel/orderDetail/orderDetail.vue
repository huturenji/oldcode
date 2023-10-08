<template>
    <div class="orderDetail">
        <!--tab-->
        <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <div v-if='!loading' class="tab" :class="{showPriceDetail:showPriceDetail,bigPaddingt:(orderInfo.orderStatus == 'WAIT_FOR_CONFIRM' || orderInfo.orderStatus == 'ALREADY_PAY_WAIT_CONFIRM') || (orderInfo.orderStatus == 'WAIT_FOR_PAY' && limitTime && limitTime>=0) || orderInfo.payName}">
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
                    <div class="order-no" v-if="orderInfo.payName && paymentMethods.length > 0">
                        <span>支付方式</span>
                        <span>{{getPaymentName}}</span>
                    </div>
                    <div class="order-no">
                        <span>订单号</span>
                        <span>{{orderInfo.providerOrderNo || orderInfo.orderNo}}</span>
                    </div>
                </div>
                <HotelCard :orderInfo="orderInfo" @openIntroduction="openIntroduction" />
                <!-- 预付型酒店、已支付、已取消 -->
                <div class="refundTextWrap cursorp normal-btn"
                    v-if="orderInfo.roomType == 1 && orderInfo.orderStatus == 'ALREADY_CANCEL' && orderInfo.payState == 'PAID' "
                    @click="showCancelOrderBut = false;showCancelOrder = true;">
                    <div class="refundTit ">取消成功</div>
                    <div class="refundtwxtWrap">
                        <div class="refundText nowrap"><Icon type='icon_common_prompt' class="refundTips normal-btn" size=".26"/>退款将在1-7个工作日内原路退回</div>
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
                <div class="reOrderWrap" v-if="orderInfo.orderStatus=='ALREADY_CANCEL' || orderInfo.orderStatus=='HOTEL_REJECT_ORDER'">
                    <Button class="primaryButton" type="primary" @click="judgeOrderBook() && orderAgain()">再次预订</Button>
                </div>
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
                            {{passengersPhone.phone}}</div>
                    </div>
                </div>
                <!-- 报销凭证 -->   
                <div v-if="orderInfo.orderStatus != 'ALREADY_CANCEL'">
                    <div v-if="orderInfo.roomType=='1' && 'BusinessTrip' == orderInfo.invoiceMode" class="cursorp">
                        <div @click="judgeOrderBook() && viewInvoiceFun()" v-if="orderInfo.invoiceDone=='1' || orderInfo.invoiceFlag=='1'" class="rightWrap reimburse">
                            <div class="left">
                                报销凭证
                            </div>
                            <div class="mid">
                                增值税普通发票（电子）
                            </div>
                            <div class="rightButtonWrap">
                                详情
                                <Icon type='right' class="rightButton normal-btn" size=".24"/>
                            </div>
                        </div>
                        <div v-else-if="(orderInfo.orderStatus=='WAIT_FOR_CHECK_IN' || orderInfo.orderStatus=='ALREADY_FOR_CHECK_IN' || orderInfo.orderStatus=='ALREADY_FOR_CONFIRM' || orderInfo.orderStatus=='ALREADY_LEAVE')"
                            class="rightWrap noReimburse">
                            <div class="textItem">
                                <div class="textLine textTitle">
                                    报销凭证
                                </div>
                                <div class="tips">
                                    离店后30天内可补开报销凭证
                                </div>
                            </div>
                            <div class="textItem">
                                <div class="reimburse-btn cursorp" @click="judgeOrderBook() && toReimburse()">补开报销凭证</div>
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
                <!-- 支付前联系客服 -->
                <div v-if="orderInfo.roomType == 0 || (orderInfo.roomType == 1 && !!orderInfo.payState && orderInfo.payState != 'UNPAID')"
                    class="rightWrap cust-service">
                    <div class="text">本产品由{{orderInfo.providerShortName}}提供服务</div>
                </div>
                <!--取消支付按钮，0现付，1预付-->
                <div class="reOrderWrap" v-if="isCancelStatus(orderInfo.orderStatus,orderInfo.cancelable) && orderInfo.orderStatus!='WAIT_FOR_PAY'">
                    <Button type="danger" :disabled="!judgeOrderBook()"  v-if="orderInfo.roomType == 0" @click="judgeOrderBook() && cancelConfirm()">取消订单</Button>
                    <Button type="danger" :disabled="!judgeOrderBook()"  v-if="orderInfo.roomType == 1" @click="judgeOrderBook() && cancelConfirmRoomTypeOne()">取消订单</Button>
                </div>
            </div>
            <!-- 待支付时取消按钮和支付按钮 -->
            <div v-transfer-dom>
                <div class="btn-group-page" v-if="!loading && orderInfo.orderStatus=='WAIT_FOR_PAY'" :class="{otherBook:!judgeOrderBook()}">
                    <!--未支付的时候没有“联系商旅通”的卡片固定在底部，所以此时的“取消订单”按钮是固定在底部的-->
                    <a class="btn-cancel cursorp normal-btn" @click="judgeOrderBook() && cancelConfirm()">取消订单</a>
                    <a v-if="orderInfo.roomType == 1" class="btn-pay cursorp normal-btn" @click="judgeOrderBook() && orderPay()">去支付<Icon type='time' class="limitTime" size=".3"/><span>{{limitTime | limitTimeFilterChange}}</span></a>
                    <a v-if="orderInfo.roomType == 0 && orderInfo.guarantee" class="btn-pay cursorp normal-btn" @click="judgeOrderBook()&&orderguarantee()">去担保<Icon type='time' class="limitTime" size=".3"/><span>{{limitTime | limitTimeFilterChange}}</span></a>
                </div>
            </div>
            <!-- 联系客服 -->
            <div v-transfer-dom>
                <div class='contact-bp cursorp' @click='gotoCustomerService'
                 v-if="!!orderInfo.orderStatus && orderInfo.orderStatus!='WAIT_FOR_PAY' && orderInfo.orderStatus!='ALREADY_CANCEL'">
                    <div class="top-circle">
                        <Icon type="service" size='.72' class="icon"/>
                    </div>
                    联系客服
                    <Icon size='.38' type="icon_common_prompt" class="icon-tips icon-btn cursorp" @click.native.stop="showPhoneTips"/>
                </div>
            </div>
            <!-- 价格明细 -->
            <div v-transfer-dom>
                <div class="price-detail-modal cursorp" v-if="showPriceDetail" @click="showPriceDetail=false">
                    <div class="total-price">
                        <div>价格明细</div>
                        <div class="num-font"><span class="unit">￥</span>{{orderInfo.orderAmount}}</div>
                    </div>
                    <div class="price-detail">
                        <ul>
                            <li>
                                <div class="fLeft">{{orderInfo.roomName}}</div>
                                <div class="fRight num-font">￥{{orderInfo.orderAmount}}</div>
                            </li>
                            <li v-for="(item,index) in orderInfo.nightlyRates" :key="index">
                                <div class="fLeft">{{item.currentDate}} {{item.breakfastDesc}}</div>
                                <div class="fRight num-font">￥{{item.amount}} *
                                    {{!!orderInfo.passengers && orderInfo.passengers.split(',').length}}</div>
                            </li>
                            <li v-if="orderInfo && orderInfo.cashcouponAmount" class="btp">
                                <div class="fLeft">优惠</div>
                                <div class="fRight redfont">
                                    <span class="unit rmb">-&yen;</span>
                                    <span class='num-font'>{{orderInfo.cashcouponAmount}}</span>
                                </div>
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
            <!--日历选择-->
        <div v-transfer-dom>
            <popup
                v-model="showCalendar"
                position="bottom"
                :show-mask="true"
                hide-on-blur
                style="min-height: 10rem;background: #ffffff "
            >
                <div class="calendar">
                    <CalendarX
                        ref="calendar"
                        @changeMonth="choseDay"
                        :agoDayHide="agoDayHideDate"
                        :displayMode=5
                    ></CalendarX>
                </div>
            </popup>
        </div>
            <!-- 支付组件 -->
             <Pay ref="payComp" 
                v-if="loadPay"
                :limitTime="limitTime"
                :orderNoList="[orderInfo.orderNo]" 
                :amount="orderInfo.orderAmount"
                :goodsDesc="getGoodsDesc"
                tradeType='3'
                @closePay='paySucToDetail'
                @miniPayDone='miniPayDone'
                @closePayType='paySucToDetail'
                @payComplete='payComplete'
                @openFrame='openFrame'
            >
                <div slot='result' slot-scope="{closePay}">
                    <payResult 
                        :orderNo = 'orderInfo.orderNo'
                        pageFrom='order'
                        @toOrderDetail='closePay'
                    />
                </div>
            </Pay>
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
                        <div class="cancleTips">1.退款金额小于订单实付金额，退现金；</div>
                        <div class="cancleTips">2.如果退款金额大于实付金额，小于(实付金额+优惠券) ，只退实付金额；</div>
                        <div class="cancleTips">3.退款金额等于(实付金额+优惠券)，实付金额和优惠券一起退；</div>
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
            <!-- <CardInfo :showguarantee="showguarantee" :orderNo='orderInfo.orderNo' :outDate='orderInfo.outDate'/> -->
            <div v-transfer-dom>
                <div
                    class="price-detail-modal cancelDescription guaranteeModal"
                    v-if="showguarantee"
                >
                    <div class="tabtit bbpxs">
                        信用卡担保
                    </div>
                    <div class="hotel_form">
                        <div class="panel pd3 bbpxs">
                            <flexbox class="panel_flex">
                                <flexbox-item :span="titleFlex">
                                    <div class="form_input_title">信用卡号</div>
                                </flexbox-item>
                                <flexbox-item>
                                    <div class="form_input">
                                        <input
                                            type="text"
                                            maxlength="32"
                                            v-model="creditCard.number"
                                            placeholder="有效信用卡号码"
                                        />
                                    </div>
                                </flexbox-item>
                            </flexbox>
                        </div>

                        <div class="panel pd3 bbpxs">
                            <flexbox class="panel_flex">
                                <flexbox-item :span="titleFlex">
                                    <div class="form_input_title">有效期</div>
                                    <!--时间选择控件-->
                                </flexbox-item>
                                <flexbox-item class="rightBut">
                                    <div class="form_input">
                                        <input
                                            type="text"
                                            class="cursorp"
                                            @click="showCalendarDo"
                                            v-model="expiration"
                                            readonly="readonly"
                                            placeholder="请选择信用卡有效期"
                                        />
                                    </div>
                                </flexbox-item>
                            </flexbox>
                        </div>
                        <div class="panel pd3 bbpxs">
                            <flexbox class="panel_flex">
                                <flexbox-item :span="titleFlex">
                                    <div class="form_input_title">CVV2码</div>
                                </flexbox-item>
                                <flexbox-item>
                                    <div class="form_input">
                                        <input
                                            type="text"
                                            maxlength="3"
                                            v-model="creditCard.cvv"
                                            placeholder="卡背后末3位数字"
                                        />
                                    </div>
                                </flexbox-item>
                            </flexbox>
                        </div>
                        <div class="panel pd3 bbpxs">
                            <flexbox class="panel_flex">
                                <flexbox-item :span="titleFlex">
                                    <div class="form_input_title">持卡人</div>
                                </flexbox-item>
                                <flexbox-item>
                                    <div class="form_input">
                                        <input
                                            type="text"
                                            maxlength="30"
                                            v-model="creditCard.holderName"
                                            placeholder="持卡人姓名"
                                        />
                                    </div>
                                </flexbox-item>
                            </flexbox>
                        </div>
                        <div class="panel pd3 bbpxs paddportType">
                            <flexbox class="panel_flex">
                                <flexbox-item :span="titleFlex">
                                    <div class="form_input_title">证件类型</div>
                                </flexbox-item>
                                <flexbox-item>
                                    <div class="form_input">
                                        <input
                                            type="text"
                                            maxlength="18"
                                            readonly="readonly"
                                            v-model="
                                                idTypeListMap[creditCard.idType]
                                            "
                                            placeholder="请选择证件类型"
                                        />
                                    </div>
                                </flexbox-item>
                                <flexbox-item class="rightBut rightBut_tips">
                                    <popup-radio
                                        :options="idTypeList"
                                        v-model="creditCard.idType"
                                        @on-change="onIdTypeChange"
                                        class
                                    ></popup-radio>
                                </flexbox-item>
                            </flexbox>
                        </div>
                        <div class="panel pd3">
                            <flexbox class="panel_flex">
                                <flexbox-item :span="titleFlex">
                                    <div class="form_input_title">证件号码</div>
                                </flexbox-item>
                                <flexbox-item>
                                    <div class="form_input">
                                        <input
                                            maxlength="18"
                                            type="text"
                                            v-model="creditCard.idNo"
                                            placeholder="信用卡开卡使用的证件类型号码"
                                        />
                                    </div>
                                </flexbox-item>
                            </flexbox>
                        </div>
                        <div class="panel_tips">
                            <div class="panel pd3 bbpxs">
                                <flexbox class="panel_flex">
                                    <flexbox-item :span="titleFlex">
                                        <div class="form_input_title">手机号码</div>
                                    </flexbox-item>
                                    <flexbox-item>
                                        <div class="form_input">
                                            <input
                                                type="text"
                                                maxlength="11"
                                                v-model="creditCard.mobile"
                                                placeholder="填写银行预留的手机号码"
                                            />
                                        </div>
                                    </flexbox-item>
                                </flexbox>
                            </div>
                            <div class="panel pd3 bbpxs">
                                <flexbox class="panel_flex">
                                    <flexbox-item :span="titleFlex">
                                        <div class="form_input_title">验证码</div>
                                    </flexbox-item>
                                    <flexbox-item>
                                        <div class="form_input form_input_smsCode">
                                            <input
                                                class="Captcha"
                                                type="text"
                                                maxlength="6"
                                                v-model="smsCode"
                                                placeholder="请输入验证码"
                                            />
                                            <span class="getCaptcha" @click="getCaptcha()" v-if="flag">获取验证码</span>
                                            <span class="sendCode" v-else>再次发送({{ countdown }}s)</span>
                                        </div>
                                    </flexbox-item>
                                </flexbox>
                            </div>
                        </div>
                        <div class="infoMsg">
                            <!-- 目前十分钟为写死状态，后续根据服务返回数据修改 -->
                            <div>
                                *由于银行方面的原因，信用卡担保需要在10分钟内输入收到的验证码，否则将下单不成功，无法为您保留酒店信息。
                            </div>
                            <div>
                                *修改担保信息后需要重新发送验证码才可生效
                            </div>
                        </div>
                        <div class="primaryBtn">
                            <SnButton  type="primary" @click.native="goToGuarantee">提交</SnButton>
                        </div>
                    </div>
                </div>
            </div>
            <div v-transfer-dom>
                <loading :show="popLoading" text="加载中"></loading>
            </div>
        </div>
        </mescrollVue>
    </div>
</template>

<script>
import extendUtils from 'orderCommon/extend.js';
import mixin from 'orderCommon/orderMixin.js';
import mescrollMixin from 'orderCommon/mescrollMixin'
import {
    // Confirm,
    TransferDom,
    Popup,
    Loading,
    Flexbox,
    FlexboxItem,
    PopupRadio
} from 'vux';
import HotelCard from 'hotelComp/HotelCard.vue';
import HotelOrderCard from 'hotelComp/HotelOrderCard.vue';
import CalendarX from "components/calendar/CalendarX.vue";
// import LoadingX from "components/loading/LoadingX.vue";
import * as factory from 'hotelComp/js/orderDetailFactory.js';
import Icon from "components/icon";
import Button from 'components/button';
import sobotOutMixin from "components/customer-service/sobotOutMixin"; // 智齿客服结束当前会话
// const SnLoading = ()=>import('components/loading');
const SnButton = ()=>import('components/button');
const Pay = ()=>import('components/pay')
const payResult = ()=>import('../orderSuc/orderSuc');

export default {
    directives: {
        TransferDom
    },
    mixins: [mixin,extendUtils.mixin.tChatEventMixin,mescrollMixin,sobotOutMixin],
    components: {
        PopupRadio,
        HotelCard,
        HotelOrderCard,
        // LoadingX,
        // Confirm,
        Popup,
        Loading,
        Icon,
        Button,
        // SnLoading,
        Flexbox,
        FlexboxItem,
        CalendarX,
        SnButton,
        Pay,
        payResult
    },
    // eslint-disable-next-line vue/no-shared-component-data
    data: factory.data,
    computed: factory.computed,
    filters: factory.filters,
    created: factory.created,
    mounted: factory.mounted,
    methods: factory.methods
}
</script>
<style lang="less" scoped>
    @import '~themes/default/styles/orderDetail/hotel/orderDetail.less';
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
    .weui-dialog__bd:first-child{
        padding: 1em 20px 1.7em;
    }
    .bigbox{
        text-align: center;
        color: #222222;
        .box{
            margin: 0 auto;
            background: url(~assets/img/compment/icon_orderdetail_reminder.svg)no-repeat;
            background-size: 100%;
            width: .72rem;
            height: .72rem;
            margin-bottom: .1rem;
        }
        .orderfail{
            line-height: .44rem;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: .3rem;
        }
        .p{
            font-size: 15px;
            line-height: .42rem;
        }
    }
    .rightBut_tips .weui-cell__ft{
        display: none !important;
    }
</style>
