<template>
    <view class="order-detail-container">
        <u-navbar title="订单详情" :bgColor="bgColor" :titleStyle="{ color: '#222', 'font-weight': 'bold' }">
            <template slot="left">
                <u-icon name="arrow-left" size="18" color="#222" @click="goBack"></u-icon>
            </template>
        </u-navbar>
        <w-loading ref="loading"></w-loading>
        <template v-if="orderDetail">
            <view class="top-style" :style="[topStyle]">
                <!-- 订单状态信息 -->
                <view class="status-wrapper">
                    <view class="order_state">
                        <view class="state_title">{{ orderDetail.orderStateValue }}</view>
                        <!-- 取消订单，交易关闭 原因 -->
                        <view class="state_time" v-if="isCanceled && orderDetail.refuseReason">
                            {{ orderDetail.refuseReason }}
                        </view>
                        <view class="state_time" v-if="orderDetail.orderState == ORDER_STATE.WAIT_PAY">
                            需付款：
                            <text class="actual_payment_price num-font" style="margin-right: 12rpx;">
                                <text class="unit">¥</text>
                                <text>{{ getPartNumber(orderDetail.orderAmount,'int') }}</text>
                                <text>{{ getPartNumber(orderDetail.orderAmount,'decimal') }}</text>
                            </text>
                            剩余
                            <text style="margin: 0 10rpx;">
                                <text v-if="formateTime.days != '00'" style="margin-right: 8rpx;">{{ formateTime.days }} 天 </text>
                                {{ formateTime.hours }} 小时 {{ formateTime.minutes }} 分
                            </text>
                            自动关闭
                        </view>
                    </view>
                </view>
    
                <!-- 收货人信息 -->
                <view class="receive-info-wrapper" v-if="orderDetail.receiverName">
                    <view>
                        <image class="img" :src="weizhi" mode=""></image>
                    </view>
                    <view>
                        <view class="base">
                            <text>{{ orderDetail.receiverName || ''}}</text>
                            <text>{{ orderDetail.receiverMobile || '' }}</text>
                        </view>
                        <view class="address text-ellipsis">
                            <text>{{ orderDetail.receiverAreaInfo || '' }}</text>
                            <text>{{ orderDetail.receiverAddress || ''}}</text>
                        </view>
                    </view>
    
                </view>
            </view>
            <view class="content-style">
                <!-- 订单商品信息 -->
                <view class="product-wrapper" v-for="(childOrder, childOrderIndex) in orderDetail.childOrdersVOS" :key="childOrderIndex">
                    <view class="product_item">
                        <view class="store-info">
                            <image class="store-logo" :src="childOrder.storeLogo || storeLogo" />
                            <text class="store-name">{{ childOrder.storeName }}</text>
                        </view>
                        <block v-for="(orderProduct, productIndex) in childOrder.orderProductListVOList"
                            :key="productIndex">
                            <thumb-order-product class="product" :orderProduct="orderProduct"
                                @viewGoodsDetail="viewGoodsDetail">
                                <template #bottom-part v-if="isFinished && orderProduct.productType === 0">
                                    <view class="afs-btn-wrapper">
                                        <view class="afs-btn"
                                            :class="{ 'afs-btn-active': canAfs(orderProduct.afsCheckRes) }"
                                            @click.stop="selectService(orderDetail.orderSn, orderProduct.orderProductId, orderProduct.afsCheckRes, childOrder.orderProductListVOList)">
                                            <text>申请售后</text>
                                        </view>
                                        <view class="afs-btn" v-if="afsList && afsList.length > 0"
                                            @click.stop="toAfsList(orderDetail.orderSn)">
                                            <text>售后详情</text>
                                        </view>
                                    </view>
                                </template>
                            </thumb-order-product>
                        </block>
                    </view>
                        

                    <!-- 配送信息 -->
                    <block v-if="childOrder.productPromiseCalendars && childOrder.productPromiseCalendars.length > 1 && !isGift">
                        <view class="yt_list_cell">
                            <text class="cell_tit clamp">配送时间</text>
                            <text class="cell_tip" v-for="(item, index) in childOrder.productPromiseCalendars"
                                :key="index">
                                <text style="color:#343434;display:block" v-if="item.skuClassify == 1">
                                    中小件:{{ setDeliveryTimeStr(item.calendarDay) }}
                                </text>
                                <text style="color:#343434;display:block" v-if="item.skuClassify == 2">
                                    大件配送:{{ setDeliveryTimeStr(item.calendarDay) }}
                                </text>
                                <text style="color:#343434;display:block" v-if="item.skuClassify == 2 && item.installDay">
                                    大件 安装:{{ setDeliveryTimeStr(item.installDay) }}
                                </text>
                            </text>
                        </view>
                    </block>
                    <block v-else-if="childOrder.productPromiseCalendars && childOrder.productPromiseCalendars.length == 1 && !isGift">
                        <view class="yt_list_cell">
                            <text class="cell_tit clamp">配送时间</text>
                            <text class="cell_tip">
                                <text style="color:#343434;display:block" v-if="childOrder.productPromiseCalendars[0].skuClassify == 1">
                                    {{ setDeliveryTimeStr(childOrder.productPromiseCalendars[0].calendarDay) }}
                                </text>
                                <text style="color:#343434;display:block" v-if="childOrder.productPromiseCalendars[0].skuClassify == 2">
                                    大件配送:{{ setDeliveryTimeStr(childOrder.productPromiseCalendars[0].calendarDay) }}
                                </text>
                                <text style="color:#343434;display:block" v-if="childOrder.productPromiseCalendars[0].skuClassify == 2 && childOrder.productPromiseCalendars[0].installDay">
                                    大件安装:{{ setDeliveryTimeStr(childOrder.productPromiseCalendars[0].installDay) }}
                                </text>
                            </text>
                        </view>
                    </block>
                    <view class="yt_list_cell">
                        <text class="cell_tit clamp">运费</text>
                        <text class="cell_tip num-font" v-if="childOrder.expressFee">
                            <text>￥</text>
                            <text>{{ getPartNumber(childOrder.expressFee, 'int') }}</text>
                            <text>{{ getPartNumber(childOrder.expressFee, 'decimal') }}</text>
                        </text>
                        <view class="cell_tip" v-else>免运费</view>
                    </view>
                    <view class="yt_list_cell">
                        <text class="cell_tit clamp">小计</text>
                        <text class="cell_tip bold num-font">
                            ￥{{ getPartNumber(childOrder.totalAmount,'int') }}{{ getPartNumber(childOrder.totalAmount,'decimal') }}
                        </text>
                    </view>
                    <view class="yt_list_cell order_remark">
                        <view class="cell_tit">订单备注</view>
                        <view class="cell_tip" v-if="childOrder.orderRemark" style="word-break: break-all;">
                            <view>
                                {{ childOrder.orderRemark.slice(0, 16) }}
                                <image
                                    v-if="childOrder.orderRemark.length > 16 && !childOrder.isOpen"
                                    src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_downarrow1.svg"
                                    @click="toggleRemark(childOrder, true)"
                                />
                            </view>
                            <view v-show="childOrder.orderRemark.length > 16 && childOrder.isOpen">
                                {{ childOrder.orderRemark.slice(16) }}
                                <image
                                    src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_uparrow1.svg"
                                    @click="toggleRemark(childOrder, false)"
                                />
                            </view>
                        </view>
                        <view class="cell_tip" v-else></view>
                    </view>

                    <view class="customer_service" style="margin-bottom: 0;padding-bottom: 0;" v-if="orderDetail.childOrdersVOS.length > 1">
                        <view class="btn_service">
                            <btn-customer class="btn-customer" :showCard="true" name="订单号：" :title="orderDetail.orderSn"
                                :path='`/views/order/detail/index?orderSn=${orderDetail.orderSn}`'
                                :image="orderProductListVOList[0].mainImage">
                            </btn-customer>
                            <view @click="callPhone" class="btn-call">
                                <image :src="phoneImage" mode=""></image>
                                <text>客服电话</text>
                            </view>
                        </view>
                    </view>
                </view>
                
                <!-- 订单各项金额信息 -->
                <view class="store_price_info">
                    <view class="yt_list_cell">
                        <view class="cell_tit">
                            <!-- <text v-if="orderDetail.payState == 0">待支付金额</text> -->
                            <!-- <text v-if="orderDetail.payState == 1">实付金额</text> -->
                            <text>实付金额</text>
                        </view>
                        <view class="cell_tip actual_payment_price num-font">
                            <text class="unit">¥</text>
                            <text>{{getPartNumber(orderDetail.orderAmount,'int')}}</text>
                            <text>{{getPartNumber(orderDetail.orderAmount,'decimal')}}</text>
                        </view>
                    </view>
                    <view class="yt_list_cell">
                        <view class="cell_tit clamp">订单编号</view>
                        <view class="cell_tip orderSn">
                            <text>{{ orderDetail.orderSn }}</text>
                            <text class="copytextbut" @click="copyStr(orderDetail.orderSn)">复制</text>
                        </view>
                    </view>
                    <!-- 可收起区域 -->
                    <view v-show="showMore">
                        <view class="yt_list_cell">
                            <view class="cell_tit">
                                <text>商品金额</text>
                            </view>
                            <view class="cell_tip bold num-font">
                                <text class="unit">¥{{ orderDetail.goodsAmount }}</text>
                            </view>
                        </view>
                        <view class="yt_list_cell" v-if="orderDetail.fullDiscountAmount">
                            <text class="cell_tit">立减</text>
                            <text class="cell_tip bold num-font">-￥{{orderDetail.fullDiscountAmount}}</text>
                        </view>
                        <view class="yt_list_cell">
                            <text class="cell_tit">优惠券</text>
                            <text class="cell_tip bold num-font">-￥{{orderDetail.totalCouponDiscount}}</text>
                        </view>
                        <view class="yt_list_cell">
                            <text class="cell_tit">红包</text>
                            <text class="cell_tip bold num-font">-￥{{orderDetail.redpacketAmount || 0}}</text>
                        </view>
                        <view class="yt_list_cell" >
                            <text class="cell_tit">云豆抵现</text>
                            <text class="cell_tip bold num-font">-￥{{orderDetail.integralCashAmount}}</text>
                        </view>
                        <view class="yt_list_cell">
                            <text class="cell_tit">运费券</text>
                            <text class="cell_tip bold num-font">-￥{{orderDetail.freightCashAmount || 0}}</text>
                        </view>
                        <view class="yt_list_cell">
                            <text class="cell_tit">运费总额</text>
                            <text class="cell_tip num-font">
                                {{orderDetail.totalExpress ? ('+￥' + getPartNumber(orderDetail.totalExpress,'int') + getPartNumber(orderDetail.totalExpress,'decimal')) : '免运费'}}
                            </text>
                        </view>
                        <view class="info_line"></view>
                        <view class="yt_list_cell">
                            <text class="cell_tit">发票</text>
                            <text class="cell_tip" v-if="orderDetail && orderDetail.invoice && orderDetail.invoice.invoiceTitle">
                                {{ orderDetail.invoice.invoiceTitle }}
                            </text>
                            <text class="cell_tip" v-else>--</text>
                        </view>
                        <view class="yt_list_cell">
                            <text class="cell_tit">收票人手机</text>
                            <text class="cell_tip" v-if="orderDetail && orderDetail.invoice && orderDetail.invoice.receiverMobile">
                                {{ orderDetail.invoice.receiverMobile }}
                            </text>
                            <text class="cell_tip" v-else>--</text>
                        </view>
                        <view class="yt_list_cell">
                            <text class="cell_tit">收票人邮箱</text>
                            <text class="cell_tip" v-if="orderDetail && orderDetail.invoice && orderDetail.invoice.receiverEmail">
                                {{ orderDetail.invoice.receiverEmail }}
                            </text>
                            <text class="cell_tip" v-else>--</text>
                        </view>
                        <view class="yt_list_cell">
                            <text class="cell_tit">订单类型</text>
                            <text class="cell_tip">{{ orderDetail.orderTypeValue }}订单</text>
                        </view>
                        <view class="yt_list_cell" v-if="orderDetail.orderState >= 20 && orderDetail.orderAmount+orderDetail.integralCashAmount>0">
                            <text class="cell_tit">支付方式</text>
                            <text class="cell_tip">{{ orderDetail.orderAmount>0?orderDetail.paymentName:'' }}</text>
                        </view>
                        <block v-if="orderDetail.orderLogs && orderDetail.orderLogs.length > 0">
                            <view class="yt_list_cell" v-for="(item,index) in orderDetail.orderLogs" :key="index">
                                <text class="cell_tit">
                                    {{item.orderStateLog == 10 ? '创建时间' : item.orderStateLog == 20 ? '付款时间' :
                                    item.orderStateLog == 30 ? '发货时间' : item.orderStateLog == 40 ? '完成时间' :item.orderStateLog == 102?'定金支付时间':'取消时间'}}
                                </text>
                                <text class="cell_tip">{{ item.logTime }}</text>
                            </view>
                        </block>
                    </view>
                    <!-- 展开按钮 -->
                    <view class="toggleMoreInfo" @click="showMore = !showMore">
                        {{ showMore ? '收起' : '展示完整信息' }}
                        <image
                            :style="{ transform: showMore ? 'rotate(180deg)' : 'rotate(0)' }"
                            src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_downarrow5.svg"
                        />
                    </view>
                </view>

                <view class="customer_service" v-if="orderDetail.childOrdersVOS.length === 1">
                    <view class="service_title">客户服务</view>
                    <view class="btn_service">
                        <btn-customer class="btn-customer" :showCard="true" name="订单号：" :title="orderDetail.orderSn"
                            :path='`/views/order/detail/index?orderSn=${orderDetail.orderSn}`'
                            :image="orderProductListVOList[0].mainImage">
                        </btn-customer>
                        <view @click="callPhone" class="btn-call">
                            <image :src="phoneImage" mode=""></image>
                            <text>客服电话</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 底部按钮组 -->
            <view class="btn-wrapper" v-if="ORDER_ENUM[orderDetail.orderState]" :class="[iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
                <!-- 按钮超过三个显示更多 -->
                <tooltip v-if="showOrderDetailBtns.moreBtns.length > 0" ref="tooltip">
                    <view class="more-btn">更多</view>
                    <template v-slot:content>
                        <block v-for="type in showOrderDetailBtns.moreBtns" :key="type">
                            <block v-if="type == BUTTON_TYPES.CUSTOMER_SERVICE">
                                <btn-customer class="btn-customer-more" :showCard="true" :title="orderDetail.orderSn"
                                    :path='`/views/order/detail/index?orderSn=${orderDetail.orderSn}`'
                                    :image="orderProductListVOList[0].mainImage">
                                    <text class="btn-content-kefu">
                                        联系客服退款
                                    </text>
                                </btn-customer>
                            </block>
                            <block v-else>
                                <order-button ref="orderButton" class="order-button-more" :orderSn="orderDetail.orderSn" :type="type"
                                    :order="orderDetail" :orderProductList="orderProductListVOList"
                                    :plain="false"
                                    @clickBtn="clickMoreBtn"
                                    @viewInvoice="viewInvoice"
                                    @order-pay-success="orderPaySuccess" @order-confirm="orderConfirm"
                                    @order-cancel="orderCancel" @order-delete="orderDelete" @timing="timing"
                                    @timeout="timeout" :remainTime="remainTime" interval="1" />
                            </block>
                        </block>
                    </template>
                </tooltip>
                <block v-for="(type, btnIndex) in showOrderDetailBtns.showBtns"
                    :key="type">
                    <block v-if="type == BUTTON_TYPES.CUSTOMER_SERVICE">
                        <btn-customer class="btn-customer" :showCard="true" :title="orderDetail.orderSn"
                            :path='`/views/order/detail/index?orderSn=${orderDetail.orderSn}`'
                            :image="orderProductListVOList[0].mainImage">
                            <text class="btn-content-kefu">
                                联系客服退款
                            </text>
                        </btn-customer>
                    </block>
                    <block v-else>
                        <order-button ref="orderButton" class="order-button" :orderSn="orderDetail.orderSn" :type="type"
                            :order="orderDetail" :orderProductList="orderProductListVOList"
                            :plain="btnIndex < showOrderDetailBtns.showBtns.length - 1"
                            @viewInvoice="viewInvoice"
                            @order-pay-success="orderPaySuccess" @order-confirm="orderConfirm"
                            @order-cancel="orderCancel" @order-delete="orderDelete" @timing="timing"
                            @timeout="timeout" :remainTime="remainTime" interval="1" />
                    </block>
                </block>
            </view>

        </template>
        <!-- 取消订单选择原因弹框 -->
        <bottomPopup ref="cancelPopup" type="bottom" height="unset" conBackground="#fff" text="取消原因">
            <view class="cancel_popup" :class="[iosHairPhone ? 'ios_cancel_popup' : '']">
                <!-- 待发货订单取消显示温馨提示 -->
                <view class="order-tips" v-if="cancel.oldOrderState == ORDER_STATE.WAIT_DELIVER">
                    <text class="title">温馨提示：</text>
                    <text class="des">因当前订单已付款，可能因商品已发货而导致取消订单失败。如取消订单失败，您可联系客服申请拦截物流，或在快递派送时拒收即可。</text>
                </view>
                <view class="popup_tips">
                    <text>请选择取消订单的原因 (必选) :</text>
                </view>
                <scroll-view class="uni-list cancel_list" scroll-y="true">
                    <radio-group @change="radioChange">
                        <label class="cancle_pre" v-for="(item, index) in cancel.cancelList" :key="index">
                            <radio :value="item.content" :checked="index === cancel.current" color="#fc1c1c"
                                style="transform:scale(0.8);margin-right:0;" />
                            <text>{{ item.content }}</text>
                        </label>
                    </radio-group>
                </scroll-view>
                <view class="add-cart-tip flex_row_around_center">
                    <text>确认取消后, 将本单商品放回购物车中</text>
                    <switch :checked="isAddCart" @change="isAddCart = !isAddCart" color="#f30300"/>
                </view>
                <view class="cancel_popup_btn" :class="[iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
                    <text class="" @click="notCancel()">暂不取消</text>
                    <text class="" @click="confirmCancel()">确定取消</text>
                </view>
            </view>
        </bottomPopup>

        <view class="model" v-if="showModal">
            <view class="mask"></view>
            <view class="bodyWrap">
                <view class="title">{{cencelData[cancelFlag].title}}</view>
                <view class="body">{{cencelData[cancelFlag].body}}</view>
                <view class="foot">
                    <view class="cancel" @click="closeModel(false)" v-if="cencelData[cancelFlag].cancelText">{{cencelData[cancelFlag].cancelText}}</view>
                    <view class="ok"  @click="closeModel(true)" v-if="cancelFlag=='success'">{{cencelData[cancelFlag].confirmText}}</view>
                    <btn-customer class="btn-customer ok" :showCard="true" :title="order.orderSn"
                        :path='`/views/order/detail/index?orderSn=${order.orderSn}`'
                        v-if="cancelFlag=='failed'"
                    >
                        <text class="btn-content-kefu">
                            联系客服
                        </text>
                    </btn-customer>
                </view>
            </view>
        </view>

        <!-- 如果发票存在多个发票的时候显示发票列表的弹窗 -->
        <BottomPopup ref="invoicePopup" type="bottom" height="600rpx" text="发票列表" :prevent="false">
            <scroll-view :scroll-y="true" class="view_invoice_list" :class="[iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
                <view @click="previewInvoice(item)" v-for="(item, index) in invoiceUrls" :key="index" class="item">
                    发票{{ toChinesNumFun(++index) }}</view>
            </scroll-view>
        </BottomPopup>

        <uni-popup ref="cancelErrorPopup" type="dialog">
            <uni-popup-dialog :showCancel="false" confirmText="我知道了" type="input" title="提示" content="因当前订单已付款，可能因商品已发货而导致取消订单失败。如取消订单失败，您可联系客服申请拦截物流，或在快递派送时拒收即可。" :duration="2000"
                @confirm="confirmCancelError"></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script>
import OrderButton from "@/common/components/button/order-button";
import CustomInput from '@/views/components/input/custom-input';
import thumbOrderProduct from '@/views/components/order/thumb-order-product'
import BtnCustomer from '@/common/components/button/btn-customer'
import BottomPopup from '@/common/components/uni-popup/uni-popup-bottom';
import tooltip from '@/views/components/uni-tooltip/index';
import uniPopup from '@/common/components/uni-popup/uni-popup.vue';
import uniPopupDialog from '@/common/components/uni-popup/uni-popup-dialog.vue';
import { getPartNumber, getAllTime, copyText, toChinesNum, deepClone } from '@/utils/common';
import config from '@/common/lib/config.js';
import { ORDER_ENUM, ORDER_STATE, ORDER_STATE_VAlUE, BUTTON_TYPES } from "@/common/lib/enum/order.js";
import orderHandler from '@/views/components/order/handler';
import cartHandler from '@/views/components/cart/handler';
import { afsCheck, selectAfsService, getAfsList } from "@/views/components/aftersale/handler";
import { mapMutations } from 'vuex';
import systemMixin from '@/common/mixin/system.js';

export default {
    mixins: [systemMixin],
    components: { OrderButton, CustomInput, thumbOrderProduct, BtnCustomer, BottomPopup, tooltip },
    data() {
        return {
            phoneImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_phone.png',
            toPayImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/order/to_pay.png',
            cancel: {
                reasonId: -1, // 订单取消原因id
                content: '',
                parentSn: '', // 当前取消订单号
                cancelList: [], // 取消原因列表
                current: 0, // 订单取消原因下标
            },
             
            getPartNumber,
            ORDER_STATE,
            ORDER_ENUM,
            BUTTON_TYPES,
            orderDetail: null,
            remainTime: 0,
            afsList: null, // 售后列表
            showLoadingFlag: true,
            weizhi: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_weizhi.svg',
            storeLogo: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/store_logo.png',
            showMore: false,
            isAddCart: true, // 是否加入购物车
            bgColor: 'transparent',
            cencelData:{
                failed:{
                    title:'取消失败',
                    body: '您可联系客服处理。', 
                    confirmText:'联系客服',
                    cancelText:'返回'
                },
                success:{
                    title:'取消成功',
                    body: '相关款项将在1-2个工作日内退回原支付账户。', 
                    confirmText:'我知道了',
                }
            },
            cancelFlag:'',
            showModal:false,
            num:0,
            loadingTimer:null,    
        }
    },
    onLoad(){
        this.orderSn = this.$Route.query.orderSn;
        this.fromConfirmOrder = this.$Route.query.fromConfirmOrder;
    },
    onShow() {
        this.getOrderDetail();
    },
    onPageScroll({ scrollTop }) {
        if(scrollTop > 3){
            let opacity = scrollTop / 100;
            opacity = opacity > 1 ? 1 : opacity;
            this.bgColor = `rgba(255, 255, 255, ${opacity})`;
        }else{
            this.bgColor = 'transparent';
        }
    },
    computed: {
        // 已取消
        isCanceled() {
            return this.orderDetail?.orderState == ORDER_STATE.CANCELED;
        },
        // 待支付
        isToPay() {
            return this.orderDetail?.orderState == ORDER_STATE.WAIT_PAY;
        },
        // 已完成
        isFinished() {
            return this.orderDetail?.orderState == ORDER_STATE.FINISHED;
        },
        // 待发货
        isWaitDeliver() {
            return this.orderDetail?.orderState == ORDER_STATE.WAIT_DELIVER;
        },
        // 待收货
        isDelivered() {
            return this.orderDetail?.orderState == ORDER_STATE.DELIVERED;
        },
        isGift() {
            let product = this.orderDetail?.childOrdersVOS[0]?.orderProductListVOList[0];
            //判断单个商品是否是赠品或附件
            return product && product.isGift != 0 && this.orderDetail.totalMoney == 0;
        },
        formateTime() {
            return getAllTime(this.remainTime);
        },
        productPromiseCalendars(){
            return this.orderDetail?.childOrdersVOS[0]?.productPromiseCalendars;
        },
        invoiceUrls(){
            return this.orderDetail?.invoiceApplyInfo?.invoiceUrls;
        },
        showOrderDetailBtns() {
            // const isGift = this.orderDetail.orderProductListVOList[0] && this.orderDetail.orderProductListVOList[0].productType != 0;
            let moreBtns = [], showBtns = [];
            if (this.orderDetail?.orderState) {
                const key = this.isGift ? 'btnTypesGift' : 'btnTypesDetail';
                const btnTypesDetail = JSON.parse(JSON.stringify(ORDER_ENUM[this.orderDetail.orderState][key] || []));
                if (this.invoiceUrls?.length <= 0 || !this.invoiceUrls) {
                // 不展示查看发票
                    const index = btnTypesDetail.indexOf(BUTTON_TYPES.VIEW_INVOICE);
                    index > -1 && btnTypesDetail.splice(index, 1);
                } 
                if (this.orderDetail?.invoiceApplyInfo?.invoiceState !== 'INVOICED') {
                // 不展示换开发票
                    const index = btnTypesDetail.indexOf(BUTTON_TYPES.RE_INVOICE);
                    index > -1 && btnTypesDetail.splice(index, 1);
                } 
                if (this.orderDetail?.invoice || this.orderDetail?.actualPayment <= 0) {
                // 不展示补开发票
                    const index = btnTypesDetail.indexOf(BUTTON_TYPES.ADD_INVOICE);
                    index > -1 && btnTypesDetail.splice(index, 1);
                }
                const len = btnTypesDetail.length;
                if (len > 3) {
                    moreBtns = btnTypesDetail.slice(0, len - 3)
                }
                showBtns = btnTypesDetail.slice(len - 3 < 0 ? 0 : len - 3, len)
            }
            return {
                moreBtns,
                showBtns
            }
        },
        orderProductListVOList() {
            return this.orderDetail?.childOrdersVOS?.map(item => item.orderProductListVOList).flat()
        },
        topStyle(){
            return {
                marginTop: this.navHeight + 'px'
            }
        }
    },
    methods: {
        ...mapMutations(['addGoods']),
        toggleRemark(childOrder, flag) {
            this.$set(childOrder, 'isOpen', flag)
        },
        getOrderDetail() {
            this.loadData().then(orderDetail => {
                this.orderDetail = orderDetail;
                this.remainTime = orderDetail.remainTime;   // 订单支付剩余时间，单位：秒
                this.syncAfsCheck();
                this.fetchAfsList();
            })
        },
        // 取消的商品重新加入购物车
        addCart(orderDetail) {
            let cartInfoList = [];
            orderDetail.childOrdersVOS?.forEach(e => {
                // 主商品才加入购物车
                e.orderProductListVOList?.forEach(item => {
                    if (item.productType == 0) {
                        item.number = item.productNum
                        cartInfoList.push({
                            isChecked: 1,
                            number: item.productNum,
                            sku: item.sku,
                            storeId: item.storeId,
                        })
                        this.addGoods(item)
                    }
                })
            })
            cartHandler.addCarts({ cartInfoList }).then(() => {
                this.$store.dispatch('getCartList');
            })
        },
        // 拉取数据
        async loadData() {
            if (!this.orderSn) {
                return
            }
            if (this.showLoadingFlag) {
                this.$refs?.loading?.open();
            }
            this.showLoadingFlag = false;
            try {

                let res = await orderHandler.getOrderDetail({
                    orderSn: this.orderSn
                });
                if (res.state == 200) {
                    return Promise.resolve(res.data)
                } else {
                    Promise.resolve(res.data)
                }
            } catch (error) {
                console.error(error);
            } finally {
                this.$refs?.loading?.close();
            }

        },
        // 将阿拉伯数字改为汉字
        toChinesNumFun(string) {
            return toChinesNum(string)
        },
        //拨打电话
        callPhone() {
            let phone = config.SERVICE_PHONE;
            uni.makePhoneCall({
                phoneNumber: phone
            })
        },
        // 同步可售后性結果到对应商品上
        syncAfsCheck() {
            afsCheck({ orderSn: this.orderDetail.orderSn }).then(res => {
                if (res.state == 200) {
                    this.setServiceList(res.data)
                } else {
                    this.setServiceList([])
                }
            }).catch(() => {
                this.setServiceList([])
            })
        },
        // 将售后可用列表缝合到商品数据中
        setServiceList(data) {
            this.orderDetail.childOrdersVOS.forEach(childOrder => {
                childOrder.orderProductListVOList.forEach(product => {
                    let afsCheckRes = data.find(ele => ele.orderProductId == product.orderProductId)
                    this.$set(product, 'afsCheckRes', afsCheckRes)
                })
            })
        },
        // 跳转到售后列表页
        toAfsList(orderSn) {
            // 暂时使用鹅毛情订单的售后列表
            this.$Router.push({ path: '/views/gift/afterSale/list', query: { orderSn, sourceType: 'orderDetail' } })
        },
        // 判断时候可以进行售后
        canAfs(afsCheckRes) {
            return afsCheckRes?.num > 0 && afsCheckRes.afterSaleTypes?.length > 0;
        },

        // 选择售后服务
        selectService(orderSn, orderProductId, afsCheckRes, products) {
            if (!this.canAfs(afsCheckRes)) {
                uni.showToast({
                    title: '该商品无法售后',
                    icon: 'none'
                })
                return;
            }

            const param = {
                orderSn: orderSn, //订单号
                orderProductId: orderProductId //订单明细id 
            };

            selectAfsService(param).then(res => {
                if (res.state == 200) {
                    const len = products.filter((item) => { return item.productType == 0 }).length;
                    this.$Router.push({
                        path: '/views/gift/afterSale/index',
                        query: { orderSn, orderProductId, sourceType: 'orderDetail', orderListLen: len }
                    });
                } else {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            })
        },
        // 配送时间的字符串显示
        setDeliveryTimeStr(dataJson) {
            let str = "", timeStr = ""
            if (!dataJson) {
                str = "工作日、双休日与节假日均可送货"
                return str
            }
            let startDate = new Date(dataJson.dateStr.replace(/\-/g, '/'));
            let dateStr = this.formatDate(startDate.getTime(), 'MM月dd日')
            let weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
            let week = weekday[startDate.getDay()];
            dateStr = `${dateStr}(${week})`;
            if (!!dataJson.timeRangeList && dataJson.timeRangeList.length > 0) {
                let timeArr = dataJson.timeRangeList.filter(item => {
                    return item.selected;
                })
                if (timeArr.length >= 1 && !!timeArr[0].timeRange) {
                    timeStr = `${timeArr[0].timeRange}`
                }
            }
            str = `${dateStr} ${timeStr}`;

            return str
        },
        copyStr(str) {
            copyText(str);
        },
        fetchAfsList() {
            this.$refs?.loading?.open();
            getAfsList({
                orderSn: this.orderDetail.orderSn
            }).then(res => {
                if (res.state === 200) {
                    this.afsList = res.data.list;
                }
            }).catch((e) => {
                console.error('error:', e);
            }).finally(() => {
                this.$refs?.loading?.close();
            })
        },
        /**
         * @param {*}支付成功
         */
        orderPaySuccess() {
            // 支付成功，刷新页面数据 订单状态刷新为待发货
            this.orderDetail.orderState = ORDER_STATE.WAIT_DELIVER;
            this.orderDetail.orderStateValue = ORDER_STATE_VAlUE[ORDER_STATE.WAIT_DELIVER];
            uni.$emit('forceUpdatePage');
        },
        //暂不取消订单
        notCancel() {
            this.$refs.cancelPopup.close();
        },
        //确定取消订单
        confirmCancel() {
            uni.showModal({
                confirmColor: '#f30300',
                cancelColor: '#999',
                title: '提示',
                content: '确定取消该订单?',
                success: ({ confirm, cancel }) => {
                    if (confirm) {
                        const param = {
                             cancelReason: this.cancel.content
                        };
                        
                        // 42880 前端开发-小程序相关订单场景优化
                        if(this.cancel.oldOrderState == ORDER_STATE.WAIT_PAY){
                            param.orderSn = this.cancel.parentSn;
                        }else{
                            param.orderSn = this.cancel.orderSn;
                        }
                        this.$refs?.loading?.open();
                       
                        orderHandler.cancel(param).then(res => {
                            if(res.state == 200){
                                // 商品取消需要重新加入购物车
                                if (this.isAddCart) {
                                    this.addCart(deepClone(this.orderDetail));
                                }
                                if(this.cancel.oldOrderState == 20){
                                    this.getCancelResult()
                                }else{
                                    uni.showLoading({
                                        title: '取消成功',
                                        icon:'none'
                                    })
                                    this.getOrderDetail();
                                    uni.$emit('forceUpdatePage'); 
                                    this.$refs.cancelPopup.close();
                                    setTimeout(()=>{
                                        uni.hideLoading()
                                    },3000)
                                }
                            }
                            else if (res.state == 1002){ //取消订单失败
                                this.cancelFlag = 'failed'
                                this.showModal = true
                                this.$refs?.loading?.close();
                            }
                        }).finally(() => {
                            this.$refs?.loading?.close();
                        })
                    } else {
                        this.$refs.cancelPopup.close();
                    }
                }
            })
        },

        closeModel(flag){
            if(flag){
                this.getOrderDetail();
                uni.$emit('forceUpdatePage'); 
            }
            // 强制刷新订单列表页
            this.$refs.cancelPopup.close();
            this.showModal = false
        },
        //获取订单取消结果
        getCancelResult(){
            let param = {}
            // 42880 前端开发-小程序相关订单场景优化
            if(this.cancel.oldOrderState == ORDER_STATE.WAIT_PAY){
                param.orderSn = this.cancel.parentSn;
            }else{
                param.orderSn = this.cancel.orderSn;
            }
            uni.showLoading({
                title: '取消中...',
                icon:'none'
            })
            orderHandler.cancelOrderResult(param).then(res => {
                if(res.state == 200){
                    uni.hideLoading()
                    if(!res.data.cancelFlag){
                        if(this.num<10){
                            clearInterval(this.loadingTimer);
                            this.loadingTimer = setInterval(()=>{
                                this.num++
                                this.getCancelResult()
                            },1000)
                        }else{
                            uni.hideLoading()
                            clearInterval(this.loadingTimer);
                            this.loadingTimer = null;
                            this.cancelFlag = 'failed'
                            this.showModal = true
                        }
                    }else{
                        uni.hideLoading()
                        if(this.loadingTimer){
                            clearInterval(this.loadingTimer);
                            this.loadingTimer = null;
                        }
                        this.cancelFlag = 'success'
                        this.showModal = true
                    }
                }else{
                    uni.hideLoading()
                    this.cancelFlag = 'failed'
                    this.showModal = true
                }                     
            })
        },
        confirmCancelError() {
            this.$refs.cancelErrorPopup.close();
            this.$Router.back();
        },

        //取消原因单选框切换
        radioChange(e) {
            for (let i = 0; i < this.cancel.cancelList.length; i++) {
                if (this.cancel.cancelList[i].content === e.target.value) {
                    this.cancel.reasonId = this.cancel.cancelList[i].reasonId;
                    this.cancel.content = this.cancel.cancelList[i].content;
                    break;
                }
            }
        },
        viewInvoice(previewCallback){
            this.previewInvoice = previewCallback;
            this.$refs.invoicePopup.open();
        },
        // 取消订单
        // 捕获 order-button抛出的取消事件
        orderCancel({ parentSn, orderSn, orderState }) {
            this.cancel.parentSn = parentSn;
            this.cancel.orderSn = orderSn;
            this.cancel.oldOrderState = orderState;

            orderHandler.getCancelList({
                type: 104
            }).then(res => {
                if (res.state == 200) {
                    this.cancel.cancelList = res.data;
                    this.cancel.reasonId = this.cancel.cancelList[0]?.reasonId; // 默认第一个
                    this.cancel.content = this.cancel.cancelList[0]?.content; // 默认第一个
                    this.$refs.cancelPopup.open();
                } else {
                    uni.showToast({
                        title: res.msg
                    })
                }
            })
        },
        /*
         * 三个方法分开写，应对不同操作的改动
         */
        // 删除订单
        orderDelete(orderSn, oldOrderState, newOrderState) {
            uni.$emit('forceUpdatePage');
            this.$Router.back();
        },
        // 确认订单
        orderConfirm(orderSn, oldOrderState, newOrderState) {
            this.orderDetail.orderState = newOrderState;
            this.orderDetail.orderStateValue = ORDER_STATE_VAlUE[newOrderState];
            uni.$emit('forceUpdatePage');
        },
        // 定时器按照定时时间每次抛出事件
        timing({ remainTime }) {
            this.remainTime = remainTime;
        },
        // 倒计时结束
        timeout({ type }) {
            if (type == 'pay') {
                uni.$emit('forceUpdatePage');
                this.getOrderDetail(); //重新拉取数据
            }
        },
        viewGoodsDetail(sku, storeId, mainImage) {
            this.$Router.push({
                path: '/views/goods/detail/index',
                query: {
                    sku, storeId, mainImage
                }
            })
        },
        /**
         * 点击更多tooltip按钮 关闭tooltip
         */
        clickMoreBtn() {
            let tooltips = this.$refs.tooltip
            if (tooltips) {
                tooltips = Array.isArray(tooltips) ? tooltips : [tooltips]
                tooltips.forEach((tooltip) => {
                    tooltip.closeTooltip()
                })
            }
        },
        /**
         * 
         * @param {时间戳} timestamp 
         * @param {指定格式模板} pattern 
         *  yyyy	2020	输入几个y就是几位数字的年份
            M MM	7 07	月份数字，复数的M当小于10则会追加0
            d dd	3 03	月的某天，复数的d当小于10则会追加0
            H HH	0..23	小时（24小时制），复数的h当小于10则会追加0
            h hh	1..12	小时（12小时制），复数的h当小于10则会追加0
            m mm	0..59	分钟，复数的m当小于10则会追加0
            s ss	0..59	秒数，复数的s当小于10则会追加0
            S SS SSS	0..999	带分数的秒钟，复数的S当小于10则会追加0
            w ww	1..7	指定日期的星期中的第几天，复数的w当小于10则会追加0
            W	一..天	指定日期的星期中的第几天，汉字一 二 三 四 五 六 天
            q	1..4	季度
        * @returns format(date, 'yyyy年MM月dd日 HH时mm分ss秒 第w天 第q季度') ： 2022年10月27日 08时45分02秒 第4天 第4季度
        */
        formatDate(timestampOrDate, pattern){
            let d = new Date(timestampOrDate);
            const date = {
                "M+": d.getMonth() + 1,
                "d+": d.getDate(),
                "H+": d.getHours(),
                "h+": (d.getHours() + 1) % 12 || 12,
                "m+": d.getMinutes(),
                "s+": d.getSeconds(),
                "q+": Math.floor((d.getMonth() + 3) / 3),
                "w+": d.getDay()
            };
            if (/(y+)/i.test(pattern)) {
                pattern = pattern.replace(
                    RegExp.$1,
                    (d.getFullYear() + "").substring(4 - RegExp.$1.length)
                );
            }
            if (/(S+)/.test(pattern)) {
                const ms = d.getMilliseconds();
                pattern = pattern.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1
                        ? ms
                        : ("000" + ms).substring(("" + ms).length)
                );
            }
            if (/(W+)/.test(pattern)) {
                const weeks = { 1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六", 0: "天" };
                pattern = pattern.replace(RegExp.$1, weeks[date["w+"]]);
            }
            for (const k in date) {
                if (new RegExp("(" + k + ")").test(pattern)) {
                    pattern = pattern.replace(
                        RegExp.$1,
                        RegExp.$1.length === 1
                            ? date[k]
                            : ("00" + date[k]).substring(("" + date[k]).length)
                    );
                }
            }
            return pattern;
        },
        goBack(){
            // 从下单页来，并且是待支付
            if(this.fromConfirmOrder == 1 && this.isToPay){
                uni.showModal({
                    content: '确认放弃付款吗？',
                    confirmText: '继续支付',
                    confirmColor: '#333333',
                    cancelColor: '#f30300',
                    cancelText: '确认放弃',
                    success: ({ confirm, cancel }) => {
                        if (confirm) {
                            // 继续支付，有多个按钮，默认选第一个（随意）
                            this.$refs.orderButton[0]?.pay();
                        }else if (cancel){
                            this.$Router.back();
                        }
                    }
                })
            }else{
                this.$Router.back();
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.model{
    width: 100%;
    height: 100%;
    .mask{
        position: fixed;
        z-index: 999;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(0,0,0,.5);
    }
    .bodyWrap{
        position: fixed;
        z-index: 999;
        width: 80%;
        max-width: 600rpx;
        top: 44%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        background-color: #fff;
        text-align: center;
        overflow: hidden;
        border-radius: 20rpx;
    }
    .title{
        padding: 74rpx 32rpx 30rpx;
        word-wrap: break-word;
        word-break: break-all;
        white-space: pre-wrap;
        font-weight: 400;
        font-size: 36rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-weight: bold;
    }
    .body{
        padding:0 30rpx 58rpx 30rpx;
        min-height: 80rpx;
        font-size: 30rpx;
        line-height: 1.4;
        color: #999;
        max-height: 800rpx;
        overflow-x: hidden;
        overflow-y: auto;
        word-wrap: break-word;
        word-break: break-all;
        white-space: pre-wrap;
    }
    .foot{
        display: flex;
        border-top:2rpx solid #d5d5d5;
        font-size: 32rpx;
        line-height: 100rpx;
        .ok{
            flex: 1;
            color: #f30300;
            font-weight: bold;
        }
        .cancel{
            flex: 1;
            color: #b6b6b6;
            font-weight: bold;
            border-right: #d5d5d5 solid 2rpx;
        }
        .btn-content-kefu{
            color: #f30300;
        }
    }
}
.divider {
    border-top: 1px solid #dddcdc;
}

.text-ellipsis {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
}

.order-detail-container {
    padding: 0 20rpx;
    .top-style {
        position: relative;
    }

    .content-style {
        padding-bottom: 130rpx;
    }

    .status-wrapper {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;

        .order_state {
            position: relative;

            box-sizing: border-box;
            width: 100%;
            padding: 20rpx 12rpx 0 12rpx;
            margin-bottom: 18rpx;

            .state_title {
                font-size: 40rpx;
                color: #222;
                font-weight: 600;
                font-family: PingFang SC;
                width: 100%;
            }

            .state_time {
                font-size: 26rpx;
                font-family: PingFang SC;
                color: #666;
                line-height: 32rpx;
                margin-top: 10rpx;
                padding-left: 2rpx;

                text {
                    font-weight: 700;
                    color: #f30300;
                }

                .actual_payment_price {
                    margin-right: 8rpx;
                    font-size: 24rpx;
                    line-height: 30rpx;

                    text:nth-child(2) {
                        font-size: 32rpx;
                    }
                }
            }
        }
    }

    .receive-info-wrapper {
        padding: 20rpx;
        background-color: #fff;
        border-radius: 20rpx;
        display: flex;

        .img {
            width: 40rpx;
            height: 40rpx;
            margin-right: 10rpx;
            margin-top: 4rpx;
        }

        .base {
            font-size: 30rpx;
            color: #2e2e2e;
            font-weight: 600;
            &>text {
                margin-right: 20rpx;
            }
        }

        .address {
            margin-top: 8rpx;
            font-size: 28rpx;
            color: #343434
        }
    }

    .product-wrapper {
        background-color: #fff;
        padding: 28rpx 0 18rpx 0;
        overflow: hidden;
        margin-top: 20rpx;
        border-radius: 20rpx;

        .product_item {
            padding: 0 32rpx;
        }

        .store-info {
            display: flex;
            align-items: center;

            &>.store-logo {
                width: 40rpx;
                height: 40rpx;
                margin-right: 10rpx;
            }

            &>.store-name {
                height: 40rpx;
                font-size: 30rpx;
                font-weight: 400;
                text-align: justify;
                color: #222;
                line-height: 40rpx;
            }
        }

        .product {
            .afs-btn-wrapper {
                display: flex;

                .afs-btn {
                    border-radius: 20px;
                    border: 1px solid #222;
                    padding: 1px 4px;
                    font-size: 13px;
                    color: #222;
                    margin-left: 5px;
                }

                .afs-btn-active {
                    border: 1px solid $main-color;
                    font-size: 13px;
                    color: $main-color;
                }

            }

            ::v-deep .order-product-box {
                background-color: #fff;
            }
            ::v-deep .right-part {
                justify-content: flex-start !important;
            }
            ::v-deep .price-wrapper {
                margin-top: 0 !important;
            }
        }
    }

    .store_price_info {
        background-color: #fff;
        border-radius: 20rpx;
        padding-top: 12rpx;
        margin: 20rpx 0;

        .cell_tip.actual_payment_price {
            font-size: 24rpx;
            color: #f30300;
            line-height: 30rpx;

            text:nth-child(2) {
                font-size: 32rpx;
            }
        }

        .orderSn {
            > text:first-child {
                position: relative;
                margin-right: 34rpx;

                &::after {
                    content: '';
                    position: absolute;
                    width: 2rpx;
                    height: 20rpx;
                    right: -16rpx;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: #a4acb2;
                }
            }

            > text:last-child {
                display: inline-block;
                width: 74rpx;
                height: 36rpx;
                line-height: 36rpx;
                text-align: center;
                background-color: #eff2f5;
                border-radius: 18rpx;
                font-size: 24rpx;
                color: #222;
                font-weight: 600;
                cursor: pointer;
            }
        }

        .info_line {
            height: 1rpx;
            background-color: #e8e8e8;
            margin: 20rpx 32rpx;
        }

        .toggleMoreInfo {
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 32rpx;
            font-size: 26rpx;
            color: #222;
            font-weight: 600;
            padding: 32rpx 0;

            image {
                width: 26rpx;
                height: 26rpx;
                margin-left: 8rpx;
            }
        }
    }

    .yt_list_cell{
        display: flex;
        align-items: center;
        margin-top: 20rpx;
        padding: 0 32rpx;
        line-height: 40rpx;
        position: relative;

        .cell_tit {
            flex: 1;
            min-width: 140rpx;
            font-size: 28rpx;
            color: #999;
            margin-right: 20rpx;
        }

        .cell_tip {
            font-size: 28rpx;
            color: #222;
        }

        &.order_remark {
            align-items: start;

            .cell_tip {
                text-align: right;

                image {
                    width: 24rpx;
                    height: 24rpx;
                    cursor: pointer;
                    margin-left: 8rpx;
                }
            }
        }
    }

    .actual_payment_price {
        margin-right: 8rpx;
        font-size: 24rpx;
        line-height: 30rpx;

        text:nth-child(2) {
            font-size: 32rpx;
        }
    }

    .customer_service {
        border-radius: 20rpx;
        background: #fff;
        padding: 12rpx 32rpx 32rpx;
        margin: 20rpx 0 56rpx 0;
        
        .service_title {
            font-size: 32rpx;
            height: 44rpx;
            line-height: 44rpx;
            font-weight: 600;
            color: #222;
            margin: 10rpx 0 20rpx 0;
        }

        .btn_service {
            display: flex;
            justify-content: space-between;

            .btn-customer {
                width: 318rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: #f6f8f9;
                margin-right: 10rpx;
                border-radius: 16rpx 0 0 16rpx;
            }

            .btn-call {
                width: 318rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #f6f8f9;
                border-radius: 0 16rpx 16rpx 0;

                image {
                    width: 36rpx;
                    height: 36rpx;
                    margin-right: 10rpx;
                }

                text {
                    font-size: 28rpx;
                    font-family: PingFang SC, PingFang SC-Regular;
                    font-weight: 400;
                    color: #222222;
                }
            }
        }
    }

    .btn-wrapper {
        box-sizing: border-box;
        width: 100%;
        padding: 20rpx 20rpx 40rpx;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        background-color: #fff;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 1;

        .order-button-more, .btn-customer-more {
            ::v-deep .btn {
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 160rpx;
                height: 76rpx;
                background-color: unset !important;
                margin: 0 18rpx;
                color: #fff !important;
                /* min-width: 160rpx; */
                width: auto;
                font-size: 26rpx;
                font-weight: 600;
                padding: 20rpx 0;
                border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
                border-left: 0;
                border-top: 0;
                border-right: 0;
                white-space: nowrap;
            }
            .btn-content-kefu {
                font-size: 26rpx;
            }

            &:last-child {
                 ::v-deep .btn {
                    border-bottom: 0;
                }
            }
        }

        /**
            客服按钮:单独的按钮
        */
        .btn-customer {
            ::v-deep button {
                background: none;
                // height: 60rpx;
                // line-height: 52rpx;
            }

            .btn-content-kefu {
                // border-radius: 28px;
                // padding: 4px 10px;
                // font-size: 14px;
                // color: $main-color;
                // border: 1px solid $main-color;
                display: flex;
                box-sizing: border-box;
                justify-content: center;
                align-items: center;
                height: 64rpx;
                border-radius: 34rpx;
                padding: 0 24rpx;
                font-size: 28rpx;
                font-weight: 600;
                background-color: #fff;
                color: #222222;
                border: #c2c2c2 2rpx solid;
            }
        }

        .order-button {
            ::v-deep .btn {
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                min-width: 168rpx;
                height: 64rpx;
                margin-left: 28rpx;
                // margin-left: 16rpx;
                font-size: 28rpx;
                font-weight: 600;
                padding: 0 24rpx;
                background-color: #f30300;
                border-radius: 34rpx;
                border: #f30300 2rpx solid;
                color: #fff;
                &.plain-btn {
                    background-color: #fff;
                    border: #c2c2c2 2rpx solid;
                    color: #222222;
                }
            }
        }

        ::v-deep .more-btn {
            font-size: 28rpx;
            font-weight: 600;
            margin-right: 26rpx;
        }
       
    }

}

.cancel_popup {
    width: 100%;
    background: #FFFFFF;
    width: 100% !important;
    padding-bottom: calc(120rpx);
    &.ios_cancel_popup {
        padding-bottom: 148rpx;
    }
    .popup_top {
        height: 100rpx;
        width: 100%;
        display: flex;
        padding: 0 39rpx 0 69rpx;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1rpx solid #F8F8F8;

        text {
            flex: 1;
            text-align: center;
            font-size: 32rpx;
            font-family: PingFang SC;
            font-weight: 500;
            color: #333;
            line-height: 32rpx;
        }

        image {
            width: 30rpx;
            height: 30rpx;
        }
    }

    .order-tips {
        display: flex;
        flex-direction: column;
        width: 686rpx;
        height: 182rpx;
        margin: 0 auto;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/order/bg_order_prompt.png');
        background-size: cover;
        padding: 16rpx 18rpx;
        .title {
            font-size: 28rpx;
            font-weight: 400;
            text-align: left;
            color: #222222;
        }
        .des {
            font-size: 24rpx;
            color: #666;
        }
    }

    .popup_tips {
        height: 100rpx;
        width: 100%;
        display: flex;
        padding: 0 30rpx;
        align-items: center;

        text {
            font-size: 32rpx;
            font-family: PingFang SC;
            font-weight: 500;
            color: #333;
            line-height: 32rpx;
        }

    }

    .cancel_list {
        box-sizing: border-box;
        height: 550rpx;

        .cancle_pre {
            width: 100%;
            padding: 29rpx 40rpx;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;

            text {
                flex: 1;
                font-size: 28rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #333;
                line-height: 32rpx;
            }
        }
    }

    .add-cart-tip {
        width: 690rpx;
        height: 80rpx;
        background: #f6f9fd;
        border-radius: 40rpx;
        margin: 20rpx auto;
        text {
            color: #222;
            font-size: 28rpx;
            text-align: center;
        }
        switch {
            transform: scale(.5);
        }
    }

    .cancel_popup_btn {
        background: #fff;
        position: fixed;
        bottom: 0rpx;
        z-index: 30;
        display: flex;
        width: 100%;
        height: calc(120rpx);
        justify-content: center;
        align-items: center;
        padding: 0 30rpx 30rpx;
        &.iosBottomPadding {
            height: 148rpx;;
        }

        text:nth-child(1) {
            flex: 1;
            height: 80rpx;
            background: #fff;
            border-radius: 40rpx 0 0 40rpx;
            font-size: 30rpx;
            font-family: PingFang SC;
            font-weight: 600;
            color: $main-color;
            line-height: 40rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2rpx solid $main-color;
            cursor: pointer;
        }

        text:nth-child(2) {
            flex: 1;
            height: 80rpx;
            background: $main-color;
            border-radius: 0 40rpx 40rpx 0;
            font-size: 30rpx;
            font-family: PingFang SC;
            font-weight: 600;
            color: #fff;
            border: 2rpx solid $main-color;
            line-height: 40rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
    }
}
::v-deep .content{
    display: flex;
    flex-direction: column;
}
.view_invoice_list{
    box-sizing: border-box;
    padding: 20rpx;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;

    .item {
        padding: 20rpx;
        font-size: 30rpx;
        color: #222;
    }
}
</style>