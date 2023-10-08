<template>
    <div class='page-order-detail'>
        <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <div v-if='!loading' class="order-detail-container" :class="{filterBlur: showPriceDetail}">
            <div>
                <div class="header">
                    <div class="summary">
                        <div class="status">{{custOrderStatus}}
                            <template v-if="showSubStatus(orderDetail.orderStatus)">
                                <span>{{chargeChangeAndRefundStatus(orderDetail.postSaleStatus)}}</span>
                            </template>
                        </div>
                        <div class="amount num-font cursorp" @click="showPriceDetail=true">
                            <span class="unit">￥</span>{{orderDetail.orderAmount}}
                            <icon type="right" size='.24' />
                        </div>
                    </div>
                    <div class="summary-note" v-if="limitTime && limitTime>=0 && orderDetail.orderStatus=='UNPAID'">
                        席位已锁定，请在<span>{{limitTime | limitTimeFilter}}</span>内完成支付，超时订单将取消
                    </div>
                    <div class="summary-note" v-if="orderDetail.orderStatus == 'ALREADY_PAID'">
                        正在出票，预计{{orderExtraInfo.providerOutTicketExpire}}分钟内告知出票结果
                    </div>
                    <div class="order-no">
                        <span>订单号</span><span>{{orderDetail.providerOrderNo || orderDetail.orderNo}}</span>
                    </div>

                    <!-- 再次预订的按钮 -->
                    <div class="btn-again-cancle cursorp" v-if="orderDetail.orderStatus=='ALREADY_CANCEL' || orderDetail.orderStatus=='FAILED_OUT_TICKET'" @click="judgeOrderBook() && orderAgain()">再次预订</div>
                </div>

                <!-- 改签单渲染改签模块的详情DOM -->
                <div v-if='gaiOrderObj.length>0'>
                    <section class="order-card" v-for="(item,index) in gaiOrderObj" :key="index">
                        <TrainTimesComp :trainDetail="item" :hasChangeOrder="true"  @getTrainLineByTrainNo="getTrainLineByTrainNo(item.trainNo)" />
                        <section>
                            <div class="customer-info">
                                <div>
                                    <div class="name fLeft">
                                        {{item.psgName}}
                                    </div>
                                    <div class="car-no fRight">
                                        {{item.seatNo}}
                                    </div>
                                </div>
                                <div>
                                    <div class="id-card fLeft">
                                        {{item.cardType}}:{{desensitization(item.cardNo)}}
                                    </div>
                                    <div class="seat-info fRight">
                                        <span class="seat-lv">{{item.seatType}}</span>
                                        <span class="seat-amount">￥{{item.seatPrice}}</span>
                                    </div>
                                </div>
                                <!-- 按钮组、乘客状态 -->
                                <div class="cust-btn-group">
                                    <div class="fLeft">

                                        <div class="change-tips-success" v-if="item.changeOrderStatus == 'CHANGE_SUCCESS'">改签成功</div>
                                        <div class="change-tips-success" v-if="item.changeOrderStatus == 'AFTER_CHANGE_REFUND_SUCCESS'">退票成功</div>
                                        <div class="change-tips-failed" v-if="item.changeOrderStatus == 'AFTER_CHANGE_REFUND_FAILED'">退票失败</div>
                                        <div class="change-tips-wait" v-if="item.changeOrderStatus == 'AFTER_CHANGE_REFUNDING'">退票中</div>
                                        <div class="change-tips-wait" v-if="item.changeOrderStatus=='CHANGING'">正在为您办理改签，请稍候...</div>
                                        <div class="change-tips-wait" v-if="item.changeOrderStatus=='SEAT_TAKING'">占座中，请稍候...</div>
                                    </div>

                                    <!-- 改签成功和改签成功后退票失败显示退票按钮 -->
                                    <div class="fRight">
                                        <SnButton inline ghost
                                            v-if="item.changeOrderStatus == 'CHANGE_SUCCESS' || item.changeOrderStatus == 'AFTER_CHANGE_REFUND_FAILED'"
                                            :disabled='psgStatuState(item.status) == StateStyle.INPROCESS || !judgeOrderBook()'
                                            @click.native="judgeOrderBook() && cancelChangeTicket(item)"
                                            type="warning" size="small" shape="round">
                                            退票
                                        </SnButton>
                                    </div>
                                </div>
                                
                                <!-- 低改高改签票 -->
                                <template v-if="item.priceDiffNeedPaying > 0">
                                    <div class="status-message change-info" v-if="(item.changeOrderStatus=='SEAT_TAKEN_SUCCESS')">
                                        <icon type="icon_common_prompt" size=".3"/>支付新票款￥{{item.seatPrice}}，退还原票款￥{{item.oldSeatPrice}}
                                    </div>
                                    <div class="status-message" v-if="item.changeOrderStatus=='CHANGE_SUCCESS'" @click="showChangeDetails(item)" >
                                        <icon type="icon_common_prompt" size=".3"/>退还原票款（￥{{item.oldSeatPrice}}）将在1-7个工作日内原路退回
                                    </div>
                                </template>
                                <!-- 高改低改签票 -->
                                <template v-if="item.priceDiffNeedPaying < 0">
                                    <div class="status-message-gai change-info" v-if="(item.changeOrderStatus=='SEAT_TAKEN_SUCCESS')">
                                        <!-- 高改低要显示改签手续费 -->
                                        <p v-if="item.changePoundage > 0">手续费：￥{{Math.abs(item.changePoundage)}}</p>    
                                        <p>改签成功后将退还改签差额：￥{{Math.abs(item.priceDiffNeedPaying)}}</p>    
                                    </div>
                                    <div @click="showChangeDetails(item)" class="status-message" v-if="item.changeOrderStatus=='CHANGE_SUCCESS'">
                                        <icon type="icon_common_prompt" size=".3"/>改签差额（￥{{Math.abs(item.priceDiffNeedPaying)}}）将在1-7个工作日内原路退回
                                    </div>
                                </template>
                                <!-- 0差价改签票 -->
                                <template v-if="item.priceDiffNeedPaying==0">
                                    <div class="status-message change-info"
                                        v-if="(item.changeOrderStatus=='SEAT_TAKEN_SUCCESS')">
                                        <icon type="icon_common_prompt" size=".3"/>改签待支付：￥0
                                    </div>
                                </template>

                                <!-- 该状态为改签成功之后退票成功的提示 -->
                                <div  @click="showRefundDetailPop(item)" class="status-message" v-if="(item.changeOrderStatus=='AFTER_CHANGE_REFUND_SUCCESS')">
                                    <icon type="icon_common_prompt" size=".3"/>退款 （￥{{!!item.refTicketAmount?item.refTicketAmount:item.seatPrice}}） 将在1-7个工作日内原路退回        
                                </div>

                                <!-- 该状态为改签成功之后退票失败的提示 -->
                                <div class="status-message tui-failed-info" v-if="(item.changeOrderStatus=='AFTER_CHANGE_REFUND_FAILED')">
                                    <icon type="icon_common_prompt" size=".3"/>因铁路系统繁忙，请持购票有效证件到火车站办理
                                </div>

                                <div v-if="psgStatuState(item.changeOrderStatus)==StateStyle.INPROCESS && item.changeOrderStatus=='SEAT_TAKEN_SUCCESS'"
                                    class="option-btn">
                                    <div :class="{disabled:!judgeOrderBook()}" class="cancel-option" @click="judgeOrderBook() && cancelChange(item)">取消改签</div>
                                    <div :class="{disabled:!judgeOrderBook()}" class="confirm-option" @click="judgeOrderBook() && confirmChange(item)">确认改签<span v-if="trainRemaining[item.newOrderNo]>0">{{trainRemaining[item.newOrderNo] | limitTimeFilterChange}}</span></div>
                                </div>
                            </div>
                        </section>
                    </section>
                </div>

                <!-- 真正原始订单DOM开始 -->
                <section class="order-card">
                    <TrainTimesComp :trainDetail="orderDetail" @getTrainLineByTrainNo="getTrainLineByTrainNo" />
                    <section v-for="item in orderPsgs" :key="item.psgId"
                        :class="{disabled:psgStatuState(item.status) == StateStyle.SUCCESS}">
                        <div class="customer-info">
                            <div>
                                <div class="name fLeft">
                                    {{item.psgName}}
                                </div>
                                <div class="car-no fRight">
                                    {{item.seatNo}}
                                </div>
                            </div>
                            <div>
                                <div class="id-card fLeft">
                                    {{item.cardType}}:{{desensitization(item.cardNo)}}
                                </div>
                                <div class="seat-info fRight">
                                    <span class="seat-lv">{{item.seatType}}</span>
                                    
                                    <span class="seat-amount" v-if="item.newGaiOrder">￥{{item.newGaiOrder.oldSeatPrice}}</span>
                                    <span class="seat-amount" v-else>￥{{item.seatPrice}}</span>
                                </div>
                            </div>
                            <!-- 按钮组、乘客状态 -->
                            <div class="cust-btn-group">
                                <div class="fLeft">
                                    <div class="tips-wait" v-if="orderDetail.orderStatus=='ALREADY_PAID' && psgStatuState(item.status)== StateStyle.NORMAL">正在出票，请稍候...</div>
                                    <div class="tips-wait" v-if="orderDetail.orderStatus=='UNPAID'">待支付</div>
                                    <template v-if="!item.newTuiOrder&&!item.newGaiOrder">
                                        <!-- 该状态为已取票，此时不能申请改签，即改签按钮为空的 -->
                                        <div class="tips-wait" v-if="psgStatuState(item.status)== StateStyle.PICKED">{{getTrainPsgStatusName(item.status)}}</div> 
                                        <div class="tips-success" v-else-if="orderDetail.orderStatus=='ALREADY_OUT_TICKET' || orderDetail.orderStatus=='PARTIAL_ALREADY_REFUND'">出票成功</div>
                                        <div class="tips-failed" v-if="orderDetail.orderStatus=='FAILED_OUT_TICKET'">出票失败</div>
                                        <div class="tips-cancel" v-if="orderDetail.orderStatus=='ALREADY_CANCEL'">已取消</div>
                                    </template>
                                   
                                    <div v-else class="psg-status" :style="{color: getTrainPsgStatusColor(item.status)}" >
                                        {{getTrainPsgStatusName(item.status)}}
                                        <template v-if="psgStatuState(item.status)== StateStyle.UNKNOW && orderExtraInfo.lastUpdateTime">
                                            （{{orderExtraInfo.lastUpdateTime}}）
                                        </template>
                                    </div>
                                </div>

                                <!-- 原始订单退票改签按钮 -->
                                <div class="btn-wrap fRight">
                                    <SnButton inline ghost
                                        v-if="showSubStatus(orderDetail.orderStatus) && psgStatuState(item.status) != StateStyle.SUCCESS && psgStatuState(item.status) != StateStyle.PICKED && psgStatuState(item.status) != StateStyle.INPROCESS && endorseTrainConfig"
                                        :disabled='psgStatuState(item.status) == StateStyle.INPROCESS || !judgeOrderBook()'
                                        @click.native="judgeOrderBook() && changeTicket(item,orderDetail)"
                                        type="primary" size="small" shape="round">
                                        改签
                                    </SnButton>
                                    <SnButton inline ghost
                                        v-if="showSubStatus(orderDetail.orderStatus) && psgStatuState(item.status)!=StateStyle.SUCCESS"
                                        :disabled='psgStatuState(item.status) == StateStyle.INPROCESS || !judgeOrderBook()'
                                        @click.native="judgeOrderBook() && cancelTicket(item)"
                                        type="primary" size="small" shape="round">
                                        退票
                                    </SnButton>
                                </div>
                               
                            </div>
                            <!-- <div class="status-message ticket-failed-info"
                             v-if="orderDetail.orderStatus=='ALREADY_OUT_TICKET'&&orderDetail.payAmount>orderDetail.orderAmount&&!item.newTuiOrder&&!item.newGaiOrder" @click="showSpread(orderDetail)"
                             ><icon type="icon_common_prompt" size=".3"/>购票差额（￥{{orderDetail.payAmount-orderDetail.orderAmount}}）将在1-7个工作日内原路退回
                             </div> -->

                            <div class="status-message ticket-failed-info" v-if="psgStatuState(item.status)== StateStyle.UNKNOW">请联系客服确认出票结果或以短信通知为准</div>
                            <div class="status-message ticket-failed-info"
                                v-if="orderDetail.orderStatus=='FAILED_OUT_TICKET'">
                                <icon type="icon_common_prompt" size=".3"/>因铁路系统繁忙，出票失败；退款将在1-7个工作日内原路退回
                            </div>
                            <div class="status-message ticket-failed-info" v-if="orderDetail.orderStatus=='UNKNOWN'">
                                <icon type="icon_common_prompt" size=".3"/>无法获取出票结果，请<a @click="callPhone">联系客服</a>确认或以短信通知为准
                            </div>

                            <!-- 乘客状态提示文字 -->
                            <template v-if="item.newTuiOrder||item.newGaiOrder">
                                <div class="status-message tui-success-info cursorp"
                                    v-if="psgStatuState(item.status)==StateStyle.SUCCESS && getPsgStatuType(item.status)=='0' && !!item.newTuiOrder && !item.newGaiOrder"
                                    @click="showRefundDetailPop(item)">
                                    <icon type="icon_common_prompt" size=".3"/>退款（￥{{item.newTuiOrder.refTicketAmount}}） 将在1-7个工作日内原路退回
                                </div>
                                <div class="status-message tui-failed-info"
                                    v-if="getPsgStatuType(item.status)=='0' && psgStatuState(item.status)== StateStyle.FAILED && item.newTuiOrder">
                                    <icon type="icon_common_prompt" size=".3"/>因铁路系统繁忙，请持购票有效证件到火车站办理
                                </div>
                                <div class="status-message tui-failed-info"
                                    v-if="getPsgStatuType(item.status)=='0' && psgStatuState(item.status)== StateStyle.CANCEL && item.newGaiOrder && item.changeOrderInfoList.length>0 &&  item.newGaiOrder.cancelReasonType=='USER_CANCEL' " >
                                    <icon type="icon_common_prompt" size=".3"/>您已取消改签申请，如有需要可重新提交
                                </div>
                                <div class="status-message tui-failed-info"
                                    v-if="getPsgStatuType(item.status)=='0' && psgStatuState(item.status)== StateStyle.CANCEL && item.newGaiOrder && item.changeOrderInfoList.length>0 && item.newGaiOrder.cancelReasonType=='PAY_TIME_EXPIRED_CANCEL'" >
                                    <icon type="icon_common_prompt" size=".3"/>您超时未确认改签
                                </div>
                                <div class="status-message tui-failed-info"
                                    v-if="getPsgStatuType(item.status)=='0' && psgStatuState(item.status)== StateStyle.CANCEL && item.newGaiOrder && item.changeOrderInfoList.length>0 && item.newGaiOrder.cancelReasonType=='PAY_FAIL_CANCEL'" >
                                    <icon type="icon_common_prompt" size=".3"/>很抱歉您支付失败，改签申请已取消，如有需要可重新提交
                                </div>
                                <div class="status-message tui-failed-info"
                                    v-if="getPsgStatuType(item.status)=='0' && psgStatuState(item.status)== StateStyle.FAILED && item.newGaiOrder && item.changeOrderInfoList.length>0">
                                    <icon type="icon_common_prompt" size=".3"/>因铁路系统繁忙，改签失败，如有需要可重新提交
                                </div>
                            </template>
                        </div>
                    </section>
                </section>
                <div class="explanation fRight cursorp" @click="showDescription=true">
                    <icon type="icon_common_prompt" size=".32"/>取票、退票、改签说明
                </div>
            </div>

            <ul class="items">
                <!-- orderDetail.changeAndRefundStatus!='NONE' -->
                <li class="customer-service clear" v-if="orderPsgs[0].newTuiOrder||orderPsgs[0].newGaiOrder||orderDetail.payAmount>orderDetail.orderAmount"  @click="gotoRefundAndChange()" >
                    <div class="fLeft">
                        <div>退改进度</div>
                    </div>
                    
                    <div class="fRight cursorp">
                        <span class="icon-arrow"><icon type="right" size=".24"/></span>
                    </div>
                </li>
                <li class="clear" v-if="reimbursementConfig" @click="judgeOrderBook() && checkInvoice()" :class="{'cursorp': hasReimburse()}">
                    <div class="fLeft">
                        <div>购票手续费</div>
                        <div class="invoice-tips" v-if='ableReimburse()'>
                            下单后30天内可补开报销凭证
                        </div>
                    </div>
                    <div class="fLeft">
                        ￥{{orderPsgs.length>0 && orderPsgs[0].outTicketPoundage || 0}} x {{orderPsgs.length}}
                    </div>
                    <div class="fRight" v-if='notHasReimburse()'>
                        <div class="reimburse-btn cursorp" @click="judgeOrderBook() && toReimburse()">
                            <SnButton inline ghost :disabled='!judgeOrderBook()' type="primary" size="small" shape="round">
                                补开报销凭证
                            </SnButton>
                        </div>
                    </div>
                    <div class="fRight cursorp" v-else-if="hasReimburse()">
                        <!-- 待支付和已支付的订单显示，已申请报销凭证 -->
                        <span v-if='orderDetail.orderStatus == "UNPAID" || orderDetail.orderStatus == "ALREADY_PAID"'>已申请报销凭证</span> 
                        <span v-else>已开报销凭证</span>
                        <span class="icon-arrow"><icon type="right" size=".24"/></span>
                    </div>
                </li>
                <!--todo 暂时屏蔽掉积分模块-->
                <!-- <li class='no-padding'>
                    <scoreItem productType='train' :orderScore='orderScore'></scoreItem>
                </li> -->
                <li class="customer-service clear"
                    v-if="orderDetail.orderStatus!='ALREADY_CANCEL' && orderDetail.orderStatus!='UNPAID'">
                    <div class="fLeft">
                        本产品由{{orderDetail.providerShortName}}提供服务
                    </div>
                </li>
            </ul>

        </div>
        </mescrollVue>
        <div v-transfer-dom>
            <div class="btn-group" :class="{otherBook:!judgeOrderBook(), shadow: orderDetail.orderStatus=='UNPAID'}" v-if='!loading'>
                <a class="btn-cancel cursorp" v-if="orderDetail.orderStatus=='UNPAID'" @click="judgeOrderBook() && cancelOrder()">取消订单</a>
                <a class="btn-pay cursorp" v-if="orderDetail.orderStatus=='UNPAID'" @click="judgeOrderBook() && orderPay()">去支付<span class='time'><icon type="time" size=".3"/><span class="limit-time">{{limitTime | limitTimeFilterChange}}</span></span></a>
               
            </div>
        </div>
        <!-- 联系客服 -->
        <div v-transfer-dom>
            <div class='contact-bp cursorp' @click='gotoCustomerService'
                v-if="!!orderDetail.orderStatus && orderDetail.orderStatus!='UNPAID' && orderDetail.orderStatus!='ALREADY_CANCEL'">
                <div class="top-circle">
                    <icon type="service" size=".72" class="icon"/>
                </div>
                联系客服
                <icon size=".38" type="icon_common_prompt" class="icon-tips icon-btn cursorp"  @click.native.stop="showPhoneTips"/> 
            </div>
        </div>
        <div v-transfer-dom>
            <div class="price-detail-modal cursorp" v-if="showPriceDetail" @click="showPriceDetail=false">
                <div class="total-price num-font">
                    <div>价格明细</div>
                    <div><span class="unit">￥</span>{{orderDetail.orderAmount}}</div>
                </div>
                <div class="price-detail">
                    <ul>
                        <li v-for="seat in seatPriceList" :key="seat.type">
                            <div class="fLeft">{{seat.type}}</div>
                            <div class="fRight">￥<span class="num-font">{{seat.amount}}</span> x {{seat.count}}</div>
                        </li>
                        <li v-if="orderPsgs.length>0 && orderPsgs[0].outTicketPoundage">
                            <div class="fLeft">购买手续费</div>
                            <div class="fRight">￥<span class="num-font">{{orderPsgs.length>0 && orderPsgs[0].outTicketPoundage || 0}}</span> x {{orderPsgs.length}}</div>
                        </li>
                    </ul>
                </div>
                <a class="modal-close-btn" @click="showPriceDetail=false">
                    <icon type="btn_common_close"  size=".72"/>
                </a>
                
            </div>
        </div>
        <!-- 支付组件 :checkSign="checkSign"-->
        <Pay ref="payComp" 
            v-if="loadPay"
            tradeType='2'
            :limitTime="limitTime"
            :orderNoList="orderNoList" 
            :amount="payChangeAmount || orderDetail.orderAmount"
            :goodsDesc="getGoodsDesc"
            @closePay='paySucToDetail'
            @closePayType='paySucToDetail'
            @payComplete='payComplete'
        >
            <div slot='result' slot-scope="{closePay}">
                <payResult v-if='orderDetail && Object.keys(orderDetail).length>0'
                    :orderNo = 'orderDetail.orderNo'
                    :providerType = 'orderDetail.providerType'
                    :endCity = 'orderDetail.endCity || ""'
                    :arriveTime = 'new Date(orderDetail.endDate).getTime()+(24*3600*1000)'
                    :departTime = 'new Date(orderDetail.endDate).getTime()'
                    :useType = 'orderDetail.useType'
                    :tripNo = 'orderDetail.tripNo || ""'
                    pageFrom='order'
                    @toOrderDetail='closePay'/>
            </div>
        </Pay>
        <!-- 卧铺有差价弹窗 -->
        <!-- <div v-transfer-dom>
            <confirm v-model="showSpreadPop" :hide-on-blur="true" :show-cancel-button="false" 
                @on-confirm="showSpreadPop=false;" class="confirm_tui">
                <div class="refundDetailTrain">
                    <div class="title_all">差价明细</div>
                    <ul>
                        <li v-if="showTuiStatus">
                            <span class="title">乘车人</span> 
                            <span class="content">{{spreadDetailDes.contactName}}</span>
                        </li>
                        <li >
                            <span class="title">实付金额</span> 
                            <span class="content">{{spreadDetailDes.payAmount}}元</span>
                        </li>
                        <li>
                            <span class="title">订单金额</span> 
                            <span class="content">{{spreadDetailDes.orderAmount}}元</span>
                        </li>
                        <li>
                            <span class="title">实退金额</span> 
                            <span class="content">{{spreadDetailDes.payAmount-spreadDetailDes.orderAmount}}元</span>
                        </li>
                    </ul>
                    <div class="tips">
                        <icon type="icon_common_prompt" size=".3"/>退款将在1-7个工作日内原路退回
                    </div>
                </div>
            </confirm>
        </div> -->
        <!-- 退票弹窗 -->
        <div v-transfer-dom>
            <confirm v-model="showRefundPop" :hide-on-blur="true" :show-cancel-button="showTuiStatus" @on-cancel="showRefundPop=false;newOrderNo=''"
                @on-confirm="onConfirm" class="confirm_tui">
                <div class="refundDetailTrain">
                    <div class="title_all">{{showTuiStatus?'确定退票':'退款明细'}}</div>
                    <ul>
                        <li v-if="showTuiStatus">
                            <span class="title">乘车人</span> 
                            <span class="content">{{choosedPsg.psgName}}</span>
                        </li>
                        <li>
                            <span class="title">车票票款</span> 
                            <span class="content">{{choosedPsg.seatPrice}}元</span>
                        </li>
                        <li v-if="choosedPsg.refPoundage >= 0">
                            <span class="title">退票手续费</span> 
                            <span class="content">{{choosedPsg.refPoundage}}元
                                <span class="rate">{{choosedPsg.refPoundageRate >= 0?('（退票费率:'+(choosedPsg.refPoundageRate.toFixed(2)*100 + '%')+'）'):''}}</span>
                            </span>
                        </li>
                        <!-- <li v-if="!!choosedPsg.refCouponAmount">
                            <span class="title">返还商旅通优惠</span> 
                            <span class="content">{{choosedPsg.refCouponAmount}}元</span>
                        </li> -->
                        <li v-if="!!choosedPsg.refTicketAmount">
                            <span class="title">实退票款</span> 
                            <span class="content">{{choosedPsg.refTicketAmount}}元</span>
                        </li>
                    </ul>
                    <div class="tips">
                        <icon type="icon_common_prompt" size=".3"/>退款将在1-7个工作日内原路退回
                    </div>
                </div>
            </confirm>
        </div>
        <!-- 查看改签高改低改签差额明细弹窗 -->
        <div v-transfer-dom>
            <confirm v-model="showChangeDetailPop" :hide-on-blur="true" :show-cancel-button="false" @on-confirm="showChangeDetailPop=false;" class="confirm_tui">
                <div class="refundDetailTrain">
                    <div class="title_all">改签差额明细</div>
                    <ul>
                        <li v-if="!!changeDetailDes.oldSeatPrice">
                            <span class="title">原票票款</span> 
                            <span class="content">{{changeDetailDes.oldSeatPrice}}元</span>
                        </li>
                        <li v-if="!!changeDetailDes.seatPrice">
                            <span class="title">改签票票款</span> 
                            <span class="content">{{changeDetailDes.seatPrice}}元</span>
                        </li>
                        <li v-if="!!changeDetailDes.changePoundage&&changeDetailDes.priceDiffNeedPaying<0">
                            <span class="title">改签手续费</span> 
                            <span class="content">2元</span>
                            <!-- <span class="content">{{changeDetailDes.changePoundage}}元</span> -->


                            <!-- <span class="content">{{changeDetailDes.refPoundage}}元
                                <span class="rate">{{changeDetailDes.refPoundageRate >= 0?('（改签费率:'+(changeDetailDes.refPoundageRate*100 + '%')+'）'):''}}</span>
                            </span> -->


                        </li>
                        <li v-if="changeDetailDes.priceDiffNeedPaying < 0">
                            <span class="title">退还改签差额</span> 
                            <span class="content">{{Math.abs(changeDetailDes.priceDiffNeedPaying)}}元</span>
                        </li>
                        <li v-if="changeDetailDes.priceDiffNeedPaying > 0">
                            <span class="title">退还原票款</span> 
                            <span class="content">{{Math.abs(changeDetailDes.priceDiffNeedPaying)}}元</span>
                        </li>
                    </ul>
                </div>
            </confirm>
        </div>
        <div v-transfer-dom>
            <popup v-model="showTravelByPop" height="100%" width="100%" position="right" class="travelList">
                <div class="title">
                    <span>车站名称</span>
                    <span>到站时间</span>
                    <span>发车时间</span>
                    <span>停留</span>
                </div>
                <div v-for="item in tavelList" :key="item.stationNo" class="list">
                    <span>{{item.stationName}}</span>
                    <span>{{item.arriveTime}}</span>
                    <span>{{item.startTime}}</span>
                    <span>{{item.stopoverTime > 0 ? (item.stopoverTime + '分钟') : '----'}}</span>
                </div>
            </popup>
        </div>
        <div v-transfer-dom>
            <popup v-model="showDescription" height="90%" width="100%" position="bottom" class="trainticketrule-des">
                <Description v-if="showDescription" @closeDesc="showDescription = false" />
            </popup>
        </div>
       
        <div v-transfer-dom>
            <loading :show="popLoading" :text="loadingText"></loading>
        </div>
    </div>
</template>

<script>
import extendUtils from 'orderCommon/extend.js';
import SnButton from "components/button";
import icon from "components/icon/index.vue";
import mixin from 'orderCommon/orderMixin.js';
import mescrollMixin from 'orderCommon/mescrollMixin'
import {
    TransferDom,
    Popup,
    Confirm,
    Loading
} from 'vux';
import TrainTimesComp from 'trainComp/trainTimesComp.vue';
import Description from 'components/trainticketrule/description.vue';
import * as factory from 'trainComp/orderDetailFactory.js';
// import scoreItem from 'components/score/scoreItem.vue';
import MescrollVue from 'mescroll.js/mescroll.vue'
// const SnLoading = ()=>import('components/loading');
const Pay = ()=>import('components/pay')
const payResult = ()=>import('../orderSuc/orderSuc');

export default {
    directives: {
        TransferDom
    },
    mixins: [mixin,extendUtils.mixin.tChatEventMixin,mescrollMixin],
    components: {
        MescrollVue,
        Popup,
        Confirm,
        // SnLoading,
        TrainTimesComp,
        Description,
        // scoreItem,
        Loading,
        icon,
        SnButton,
        Pay,
        payResult
    },
    // eslint-disable-next-line vue/no-shared-component-data
    data:factory.data(),
    created: factory.created,
    mounted: factory.mounted,
    computed: factory.computed,
    filters: factory.filters,
    methods: factory.methods,
    activated: factory.activated
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/orderDetail/train/trainOrderDetail.less';  
</style>
<style lang="less">
    .body-noscroll
    .body-noscroll body {
        overflow: hidden;
    }
    .body-noscroll body {
        position: relative;
    }

    .confirm_tui /deep/ .weui-dialog{
        border-radius: 0.3rem; 
    }
</style>
