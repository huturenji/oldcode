<!-- 鹅毛情礼物详情页面 -->
<template>
    <view class="gift-container">
        <w-loading ref="loading"></w-loading>
        <u-navbar title="礼物详情" bgColor="#fff" :titleStyle="{ color: '#222', 'font-weight': 'bold' }">
            <template slot="left">
                <u-icon name="arrow-left" size="18" color="#222" @click="goBack"></u-icon>
            </template>
        </u-navbar>
        <view :style="[holdStyle]"></view>
        <block v-if="requestStatus">
            <view class="status-wrapper">
                <view class="status">
                    <text>{{ statusValue }}</text>
                </view>
                <view class="desc" v-if="isCancel && timingCancelFlag">
                    <text>礼物超时已取消</text>
                </view>
                <view class="desc-special" v-else-if="isToPay">
                    <text>需付款：</text>
                    <text class="actual_payment_price" style="margin-right: 12rpx;color: #f30300;font-weight: 600;">
                        <text class="unit">¥</text>
                        <text style="font-size: 28rpx">{{ getPartNumber(currentOrderDetail.chargeInfo.orderAmount,'int') }}</text>
                        <text>{{ getPartNumber(currentOrderDetail.chargeInfo.orderAmount,'decimal') }}</text>
                    </text>
                    <text>剩余</text>
                    <text class="time num-font" v-if="formatRemainTime.days != '00'" style="margin-right: 0;">{{ formatRemainTime.days }} 天</text>
                    <text class="time num-font">{{ formatRemainTime.hours }} 小时 {{ formatRemainTime.minutes}} 分</text>
                    <text>自动关闭</text>
                </view>
                <view class="desc-special" v-else-if="isToReceive">
                    <text>剩余</text>
                    <text class="time num-font" v-if="formatRemainTime.days != '00'" style="margin-right: 0;">{{ formatRemainTime.days }}天</text>
                    <text class="time num-font">{{ formatRemainTime.hours }}小时{{ formatRemainTime.minutes }}分</text>
                    <text>未收礼，将自动失效</text>
                </view>
                <view class="desc" v-else-if="isExpired">
                    <text>超时未收礼，已经自动失效</text>
                </view>
            </view>
            <view class="top" v-if="navList.length > 1 && isReceiver">
                <view class="orderTips">您的礼物被拆成多个订单</view>
                <view class="tab-wrapper">
                    <view v-for="(item, index) in navList" :key="index" class="itemWrap" @click="handleNav(index)">
                        <view class="tabText" :class="{ active: tabCurrentIndex == index }">{{ item.text }}</view>
                        <image class="lineImg" v-if="tabCurrentIndex == index"
                            src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/icon_common_line.svg"></image>
                    </view>
                </view>
            </view>
            <swiper v-if="navList.length > 1 && isReceiver" :current="tabCurrentIndex" class="swiper"
                :class="navList.length == 1 ? 'swiperHeight' : 'swiperHeight_'" duration="300" @change="tabChange">
                <swiper-item v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
                    <scroll-view class="scroll-content" scroll-y>
                        <view class="detail-content">
                            <delivery-traces v-if="isGiver && giftDeliveryTraces.length" :traces="giftDeliveryTraces" />
                            <!-- 收礼人信息 -->
                            <receiveInfo :receiveInfo="tabItem.orderDetail.receiveInfo"
                                v-if="isReceiver && tabItem.orderDetail.orderState == 20 && tabItem.orderDetail.receiveInfo" />
                            <!--  物流详情 -->
                            <logistics v-if="isReceiverUsed && tabItem.orderDetail.orderState >= 30"
                                :orderSn='tabItem.orderDetail.orderSn' />

                            <!-- 遍历每个订单下的子订单 -->
                            <view v-for="(childOrder, childOrderIndex) in tabItem.orderDetail.childOrdersVOS"
                                :key="childOrderIndex" class="childOrder">
                                <view class="gift_info">
                                    <!-- 礼物列表信息 -->
                                    <giftInfo
                                        v-if="requestStatus"
                                        ref="giftInfoComp"
                                        :gift="childOrder.gift"
                                        @viewGoodsDetail="viewGoodsDetail"
                                        :orderSn="tabItem.orderDetail.orderSn"
                                        :isGiver="isGiver"
                                        :isReceiverUsed="isReceiverUsed"
                                        :orderState="tabItem.orderDetail.orderState"
                                    />
                                </view>

                                <view class="store_price_info">
                                    <view class="yt_list_cell" v-if="isGiver">
                                        <view class="cell_tit">
                                            <text>实付金额</text>
                                        </view>
                                        <view class="cell_tip actual_payment_price">
                                            <text class="unit">¥</text>
                                            <text>{{ getPartNumber(tabItem.orderDetail.chargeInfo.orderAmount,'int') }}</text>
                                            <text>{{ getPartNumber(tabItem.orderDetail.chargeInfo.orderAmount,'decimal') }}</text>
                                        </view>
                                    </view>
                                    <view class="yt_list_cell">
                                        <view class="cell_tit clamp">订单编号</view>
                                        <view class="cell_tip orderSn">
                                            <text>{{ childOrder.orderInfo.orderSn || '--' }}</text>
                                            <text class="copytextbut" @click="copyStr(childOrder.orderInfo.orderSn)">复制</text>
                                        </view>
                                    </view>
                                    <!-- 可收起区域 -->
                                    <view v-show="showMore">
                                        <view v-if="isGiver">
                                            <view class="yt_list_cell">
                                                <view class="cell_tit">
                                                    <text>商品金额</text>
                                                </view>
                                                <view class="cell_tip bold">
                                                    <text class="unit">¥{{ tabItem.orderDetail.orderDetailVO.goodsAmount }}</text>
                                                </view>
                                            </view>
                                            <view class="yt_list_cell" v-if="tabItem.orderDetail.chargeInfo.fullDiscountAmount">
                                                <text class="cell_tit">立减</text>
                                                <text class="cell_tip bold">-￥{{tabItem.orderDetail.chargeInfo.fullDiscountAmount}}</text>
                                            </view>
                                            <view class="yt_list_cell">
                                                <text class="cell_tit">优惠券</text>
                                                <text class="cell_tip bold">-￥{{tabItem.orderDetail.orderDetailVO.totalCouponDiscount}}</text>
                                            </view>
                                            <view class="yt_list_cell">
                                                <text class="cell_tit">红包</text>
                                                <text class="cell_tip bold">-￥{{tabItem.orderDetail.chargeInfo.redpacketAmount || 0}}</text>
                                            </view>
                                            <view class="yt_list_cell" >
                                                <text class="cell_tit">云豆抵现</text>
                                                <text class="cell_tip bold">-￥{{tabItem.orderDetail.chargeInfo.integralCashAmount}}</text>
                                            </view>
                                            <view class="yt_list_cell">
                                                <text class="cell_tit">运费券</text>
                                                <text class="cell_tip bold">-￥{{tabItem.orderDetail.chargeInfo.freightCashAmount || 0}}</text>
                                            </view>
                                            <view class="yt_list_cell">
                                                <text class="cell_tit">运费总额</text>
                                                <text class="cell_tip">
                                                    {{tabItem.orderDetail.chargeInfo.totalExpress ? ('+￥' + getPartNumber(tabItem.orderDetail.chargeInfo.totalExpress,'int') + getPartNumber(tabItem.orderDetail.chargeInfo.totalExpress,'decimal')) : '免运费'}}
                                                </text>
                                            </view>
                                            <view class="info_line"></view>
                                            <view class="yt_list_cell">
                                                <text class="cell_tit">发票</text>
                                                <text class="cell_tip" v-if="childOrder.orderInfo.invoiceInfo && childOrder.orderInfo.invoiceInfo.invoiceTitle">
                                                    {{ childOrder.orderInfo.invoiceInfo.invoiceTitle }}
                                                </text>
                                                <text class="cell_tip" v-else>--</text>
                                            </view>
                                            <view class="yt_list_cell">
                                                <text class="cell_tit">收票人手机</text>
                                                <text class="cell_tip" v-if="childOrder.orderInfo.invoiceInfo && childOrder.orderInfo.invoiceInfo.receiverMobile">
                                                    {{ childOrder.orderInfo.invoiceInfo.receiverMobile }}
                                                </text>
                                                <text class="cell_tip" v-else>--</text>
                                            </view>
                                            <view class="yt_list_cell">
                                                <text class="cell_tit">收票人邮箱</text>
                                                <text class="cell_tip" v-if="childOrder.orderInfo.invoiceInfo && childOrder.orderInfo.invoiceInfo.receiverEmail">
                                                    {{ childOrder.orderInfo.invoiceInfo.receiverEmail }}
                                                </text>
                                                <text class="cell_tip" v-else>--</text>
                                            </view>
                                            <view class="yt_list_cell">
                                                <text class="cell_tit">订单类型</text>
                                                <text class="cell_tip">{{ childOrder.orderInfo.orderTypeValue }}订单</text>
                                            </view>
                                        </view>
                                        <view class="yt_list_cell" v-if="isGiver && childOrder.orderInfo.createTime">
                                            <text class="cell_tit">创建时间</text>
                                            <text class="cell_tip">{{ childOrder.orderInfo.createTime }}</text>
                                        </view>
                                        <view class="yt_list_cell" v-if="isReceiverUnused && childOrder.orderInfo.receivedTime">
                                            <text class="cell_tit">收礼时间</text>
                                            <text class="cell_tip">{{ childOrder.orderInfo.receivedTime }}</text>
                                        </view>
                                        <view class="yt_list_cell" v-if="isReceiverUsed && childOrder.orderInfo.usedTime">
                                            <text class="cell_tit">领取时间</text>
                                            <text class="cell_tip">{{ childOrder.orderInfo.usedTime }}</text>
                                        </view>
                                        <view class="yt_list_cell" v-if="isReceiverUsed && childOrder.orderInfo.deliverTime">
                                            <text class="cell_tit">发货时间</text>
                                            <text class="cell_tip">{{ childOrder.orderInfo.deliverTime }}</text>
                                        </view>
                                        <view class="yt_list_cell" v-if="(isToReceive || isReceived || isReceiverUsed) && childOrder.orderInfo.payTime">
                                            <text class="cell_tit">付款时间</text>
                                            <text class="cell_tip">{{ childOrder.orderInfo.payTime }}</text>
                                        </view>
                                        <view class="yt_list_cell" v-if="isReceived && childOrder.orderInfo.finishTime">
                                            <text class="cell_tit">完成时间</text>
                                            <text class="cell_tip">{{ childOrder.orderInfo.finishTime }}</text>
                                        </view>
                                        <view class="yt_list_cell" v-if="isExpired && childOrder.orderInfo.expiredTime">
                                            <text class="cell_tit">失效时间</text>
                                            <text class="cell_tip">{{ childOrder.orderInfo.expiredTime }}</text>
                                        </view>
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

                                <!-- 客服、拨打电话按钮 -->
                                <view class="customer_service">
                                    <view class="service_title">客户服务</view>
                                    <view class="btn_service">
                                        <btn-customer
                                            class="btn-customer"
                                            :showCard="true"
                                            name="订单号："
                                            :title="tabItem.orderDetail.orderSn"
                                            :path='path'
                                            :image="childOrder.gift.products[0].mainImage"
                                        >
                                        </btn-customer>
                                        <view @click="callPhone" class="btn-call">
                                            <image :src="phoneImage" mode=""></image>
                                            <text>客服电话</text>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </swiper-item>
            </swiper>
            <block v-else>
            <view v-for="(tabItem, tabIndex) in navList" :key="tabIndex" class="detail-content">
                <delivery-traces v-if="isGiver && giftDeliveryTraces.length" :traces="giftDeliveryTraces" />
                <!-- 收礼人信息 -->
                <receiveInfo :receiveInfo="tabItem.orderDetail.receiveInfo"
                    v-if="isReceiver && tabItem.orderDetail.orderState == 20 && tabItem.orderDetail.receiveInfo" />
                <!--  物流详情 -->
                <logistics v-if="isReceiverUsed && tabItem.orderDetail.orderState >= 30"
                    :orderSn='tabItem.orderDetail.orderSn' />

                <!-- 遍历每个订单下的子订单 -->
                <view v-for="(childOrder, childOrderIndex) in tabItem.orderDetail.childOrdersVOS" :key="childOrderIndex" class="childOrder">
                    <view class="gift_info">
                        <!-- 礼物列表信息 -->
                        <giftInfo
                            v-if="requestStatus"
                            ref="giftInfoComp"
                            :gift="childOrder.gift"
                            @viewGoodsDetail="viewGoodsDetail"
                            :orderSn="tabItem.orderDetail.orderSn"
                            :isGiver="isGiver"
                            :isReceiverUsed="isReceiverUsed"
                            :orderState="tabItem.orderDetail.orderState"
                        />
                    </view>

                    <view class="store_price_info">
                        <view class="yt_list_cell" v-if="isGiver">
                            <view class="cell_tit">
                                <text>实付金额</text>
                            </view>
                            <view class="cell_tip actual_payment_price">
                                <text class="unit">¥</text>
                                <text>{{ getPartNumber(tabItem.orderDetail.chargeInfo.orderAmount,'int') }}</text>
                                <text>{{ getPartNumber(tabItem.orderDetail.chargeInfo.orderAmount,'decimal') }}</text>
                            </view>
                        </view>
                        <view class="yt_list_cell">
                            <view class="cell_tit clamp">订单编号</view>
                            <view class="cell_tip orderSn">
                                <text>{{ childOrder.orderInfo.orderSn || '--' }}</text>
                                <text class="copytextbut" @click="copyStr(childOrder.orderInfo.orderSn)">复制</text>
                            </view>
                        </view>
                        <!-- 可收起区域 -->
                        <view v-show="showMore">
                            <view v-if="isGiver">
                                <view class="yt_list_cell">
                                    <view class="cell_tit">
                                        <text>商品金额</text>
                                    </view>
                                    <view class="cell_tip bold">
                                        <text class="unit">¥{{ tabItem.orderDetail.orderDetailVO.goodsAmount }}</text>
                                    </view>
                                </view>
                                <view class="yt_list_cell" v-if="tabItem.orderDetail.chargeInfo.fullDiscountAmount">
                                    <text class="cell_tit">立减</text>
                                    <text class="cell_tip bold">-￥{{tabItem.orderDetail.chargeInfo.fullDiscountAmount}}</text>
                                </view>
                                <view class="yt_list_cell">
                                    <text class="cell_tit">优惠券</text>
                                    <text class="cell_tip bold">-￥{{tabItem.orderDetail.orderDetailVO.totalCouponDiscount}}</text>
                                </view>
                                <view class="yt_list_cell">
                                    <text class="cell_tit">红包</text>
                                    <text class="cell_tip bold">-￥{{tabItem.orderDetail.chargeInfo.redpacketAmount || 0}}</text>
                                </view>
                                <view class="yt_list_cell" >
                                    <text class="cell_tit">云豆抵现</text>
                                    <text class="cell_tip bold">-￥{{tabItem.orderDetail.chargeInfo.integralCashAmount}}</text>
                                </view>
                                <view class="yt_list_cell">
                                    <text class="cell_tit">运费券</text>
                                    <text class="cell_tip bold">-￥{{tabItem.orderDetail.chargeInfo.freightCashAmount || 0}}</text>
                                </view>
                                <view class="yt_list_cell">
                                    <text class="cell_tit">运费总额</text>
                                    <text class="cell_tip">
                                        {{tabItem.orderDetail.chargeInfo.totalExpress ? ('+￥' + getPartNumber(tabItem.orderDetail.chargeInfo.totalExpress,'int') + getPartNumber(tabItem.orderDetail.chargeInfo.totalExpress,'decimal')) : '免运费'}}
                                    </text>
                                </view>
                                <view class="info_line"></view>
                                <view class="yt_list_cell">
                                    <text class="cell_tit">发票</text>
                                    <text class="cell_tip" v-if="childOrder.orderInfo.invoiceInfo && childOrder.orderInfo.invoiceInfo.invoiceTitle">
                                        {{ childOrder.orderInfo.invoiceInfo.invoiceTitle }}
                                    </text>
                                    <text class="cell_tip" v-else>--</text>
                                </view>
                                <view class="yt_list_cell">
                                    <text class="cell_tit">收票人手机</text>
                                    <text class="cell_tip" v-if="childOrder.orderInfo.invoiceInfo && childOrder.orderInfo.invoiceInfo.receiverMobile">
                                        {{ childOrder.orderInfo.invoiceInfo.receiverMobile }}
                                    </text>
                                    <text class="cell_tip" v-else>--</text>
                                </view>
                                <view class="yt_list_cell">
                                    <text class="cell_tit">收票人邮箱</text>
                                    <text class="cell_tip" v-if="childOrder.orderInfo.invoiceInfo && childOrder.orderInfo.invoiceInfo.receiverEmail">
                                        {{ childOrder.orderInfo.invoiceInfo.receiverEmail }}
                                    </text>
                                    <text class="cell_tip" v-else>--</text>
                                </view>
                                <view class="yt_list_cell">
                                    <text class="cell_tit">订单类型</text>
                                    <text class="cell_tip">{{ childOrder.orderInfo.orderTypeValue }}订单</text>
                                </view>
                            </view>
                            <view class="yt_list_cell" v-if="isGiver && childOrder.orderInfo.createTime">
                                <text class="cell_tit">创建时间</text>
                                <text class="cell_tip">{{ childOrder.orderInfo.createTime }}</text>
                            </view>
                            <view class="yt_list_cell" v-if="isReceiverUnused && childOrder.orderInfo.receivedTime">
                                <text class="cell_tit">收礼时间</text>
                                <text class="cell_tip">{{ childOrder.orderInfo.receivedTime }}</text>
                            </view>
                            <view class="yt_list_cell" v-if="isReceiverUsed && childOrder.orderInfo.usedTime">
                                <text class="cell_tit">领取时间</text>
                                <text class="cell_tip">{{ childOrder.orderInfo.usedTime }}</text>
                            </view>
                            <view class="yt_list_cell" v-if="isReceiverUsed && childOrder.orderInfo.deliverTime">
                                <text class="cell_tit">发货时间</text>
                                <text class="cell_tip">{{ childOrder.orderInfo.deliverTime }}</text>
                            </view>
                            <view class="yt_list_cell" v-if="(isToReceive || isReceived || isReceiverUsed) && childOrder.orderInfo.payTime">
                                <text class="cell_tit">付款时间</text>
                                <text class="cell_tip">{{ childOrder.orderInfo.payTime }}</text>
                            </view>
                            <view class="yt_list_cell" v-if="isReceived && childOrder.orderInfo.finishTime">
                                <text class="cell_tit">完成时间</text>
                                <text class="cell_tip">{{ childOrder.orderInfo.finishTime }}</text>
                            </view>
                            <view class="yt_list_cell" v-if="isExpired && childOrder.orderInfo.expiredTime">
                                <text class="cell_tit">失效时间</text>
                                <text class="cell_tip">{{ childOrder.orderInfo.expiredTime }}</text>
                            </view>
                            <view class="yt_list_cell order_remark" v-if="isGiver">
                                <view class="cell_tit">订单备注</view>
                                <view class="cell_tip" v-if="childOrder.orderInfo.orderRemark" style="word-break: break-all;">
                                    <view>
                                        {{ childOrder.orderInfo.orderRemark.slice(0, 16) }}
                                        <image
                                            v-if="childOrder.orderInfo.orderRemark.length > 16 && !childOrder.orderInfo.isOpen"
                                            src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_downarrow1.svg"
                                            @click="toggleRemark(childOrder.orderInfo, true)"
                                        />
                                    </view>
                                    <view v-show="childOrder.orderInfo.orderRemark.length > 16 && childOrder.orderInfo.isOpen">
                                        {{ childOrder.orderInfo.orderRemark.slice(16) }}
                                        <image
                                            src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_uparrow1.svg"
                                            @click="toggleRemark(childOrder.orderInfo, false)"
                                        />
                                    </view>
                                </view>
                                <view class="cell_tip" v-else></view>
                            </view>
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

                    <!-- 客服、拨打电话按钮 -->
                    <view class="customer_service">
                        <view class="service_title">客户服务</view>
                        <view class="btn_service">
                            <btn-customer
                                class="btn-customer"
                                :showCard="true"
                                name="订单号："
                                :title="tabItem.orderDetail.orderSn"
                                :path='path'
                                :image="childOrder.gift.products[0].mainImage"
                            >
                            </btn-customer>
                            <view @click="callPhone" class="btn-call">
                                <image :src="phoneImage" mode=""></image>
                                <text>客服电话</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            </block>
            <view class="bottom-btn-wrapper">
                <button v-if="isToReceive" class="share-btn" open-type="share">
                    微信分享送礼单
                </button>
                <!-- 送礼人按钮 -->
                <btnGroup ref="btnGroup" :btnTypes="btnTypes" :giftInfo="currentOrderDetail.giftInfo" :remainTime="remainTime"
                    @order-pay-success="orderPaySuccess" @timing="timing" @timeout="timeout"
                    @cancelResult="cancelResult" @viewInvoice="viewInvoice">
                </btnGroup>

            </view>
        </block>

        <!-- 如果发票存在多个发票的时候显示发票列表的弹窗 -->
        <!-- 如果发票存在多个发票的时候显示发票列表的弹窗 -->
        <BottomPopup ref="invoicePopup" type="bottom" height="600rpx" text="发票列表" :prevent="false">
            <scroll-view :scroll-y="true" class="view_invoice_list" :class="[iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
                <view @click="previewInvoice(item)" v-for="(item, index) in invoiceUrls" :key="index" class="item">
                    发票{{ toChinesNumFun(++index) }}</view>
            </scroll-view>
        </BottomPopup>

    </view>
</template>

<script>
import BottomPopup from '@/common/components/uni-popup/uni-popup-bottom';
import btnGroup from '@/views/components/button/btnGroup';
import { getGiftDetail } from "@/views/components/gift/handler";
import BtnCustomer from '@/common/components/button/btn-customer'
import { afsCheck } from "@/views/components/aftersale/handler";
import Logistics from '@/views/components/gift/detail/logistics.vue';
import DeliveryTraces from '@/views/components/gift/detail/traces.vue';
import ReceiveInfo from '@/views/components/gift/detail/receiveInfo.vue';
import ChargeInfo from '@/views/components/gift/detail/chargeInfo.vue';
import GiftInfo from "@/views/components/gift/detail/giftInfo.vue";
import uniPopup from '@/common/components/uni-popup/uni-popup.vue';
import systemMixin from '@/common/mixin/system.js'
import { giftType, giftUsedMap, giftEnum, giftStatusMap } from '@/common/lib/enum/gift.js';
import config from '@/common/lib/config.js';
import { copyText, getStorageSync, setStorageSync, removeStorageSync, getAllTime, toChinesNum, getPartNumber } from "@/utils/common";
import orderMixin from '@/common/mixin/orderMixin' //订单混入
import shareMixin from '@/common/mixin/share';
export default {
    mixins: [systemMixin, orderMixin, shareMixin],
    components: {
        Logistics,
        ReceiveInfo,
        GiftInfo,
        BtnCustomer,
        btnGroup,
        DeliveryTraces,
        uniPopup,
        ChargeInfo,
        BottomPopup
    },
    data() {
        return {
            phoneImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_phone.png',
            kefuImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_wode_kefu.svg',
            timingCancelFlag: true, // 默认为倒计时取消，点击取消按钮置为false
            giftDeliveryTraces: [], // 礼物配送物流
            remainTime: 0,
            getPartNumber,
             
            show: true,
            used: 0, //是否已兑换： 0-未兑换， 1-已兑换
            status: 0, // 鹅毛情礼品状态: 待收礼，已收礼，已失效, 待支付
            giverOrReceiver: 0, // 0：送礼人，1：收礼人
            navList: [], // 导航数据：item中有对应订单的信息

            // 礼物列表信息
            products: [],

            // 订单信息
            orderInfo: {},
            // 收货人信息
            receiveInfo: {},
            // 子订单号
            orderSn: '',
            // 鹅毛情id：可能有多个商品
            featherId: '',
            // 数据是否请求成功
            requestStatus: false,
            tabCurrentIndex: 0,//当前选中的订单
            showMore: true
        }
    },
    beforeDestroy() {
        uni.$off('addInvoiceOK');
        uni.$off('reInvoiceOK');
        getStorageSync('afsCheckCache') && removeStorageSync('afsCheckCache')
    },
    onLoad() {
        this.featherId = this.$Route.query.featherId;
        this.fromConfirmOrder = this.$Route.query.fromConfirmOrder;
        this.getGiftDetail();
        uni.$off('addInvoiceOK');
        uni.$on('addInvoiceOk', this.getGiftDetail);
        uni.$off('reInvoiceOK');
        uni.$on('reInvoiceOk', this.getGiftDetail);
    },
    onShow() {
        this.isReceiver && this.getAfsServiceCheck();
        // 遍历子组件，重新拉取数据
        this.isReceiver && this.$refs?.giftInfoComp?.forEach(ele => {
            ele.fetchAfsList();
        })
        // hideHomeButton();
    },
    // 设置当前页面分享到朋友
    onShareAppMessage(option) {
        let shareMessage = {
            imageUrl: config.GIFT_SHARE_IMAGE
        }
        if (option.from === 'button') {
            shareMessage.path = `/views/gift/receive/index?featherId=${this.featherId}`
        } else if (option.from === 'menu' && this.isToReceive) {
            shareMessage.path = `/views/gift/receive/index?featherId=${this.featherId}`
        } else {
            shareMessage.path = `/views/gift/list/index`
            shareMessage.imageUrl = config.JU_SHARE_IMAGE
        }
        // 全局混入share.js
        let share = this.setShareAppMessage(shareMessage)

        return share;
    },
    computed: {
        holdStyle(){
            return {
                height: this.navHeight + 'px',
                flexShrink: 0
            }
        },
        // 已失效
        isExpired() {
            return this.isGiver && this.status === giftStatusMap['EXPIRED'];
        },
        // 待领取
        isToReceive() {
            return this.isGiver && !this.isToPay && this.status === giftStatusMap['TO_RECEIVE'];
        },
        // 已取消
        isCancel() {
            return this.isGiver && this.status === giftStatusMap['CANCEL'];
        },
        // 已收礼
        isReceived() {
            return this.isGiver && this.status == giftStatusMap.RECEIVED;
        },
        // 礼物状态的值
        statusValue() {
            if (this.isToPay) {
                return giftEnum[this.giverOrReceiver][giftStatusMap['UNPAY']].text;
            }

            return giftEnum[this.giverOrReceiver][this.status].text;
        },
        formatRemainTime() {
            return getAllTime(this.remainTime);
        },
        path() { return `/views/gift/detail/index?featherId=${this.$Route.query.featherId}` },
        // 判断是送礼人
        isGiver() {
            return this.giverOrReceiver === giftType['GIVED'];
        },
        // 待支付
        isToPay() {
            return this.isGiver && this.status !== giftStatusMap['CANCEL'] && this.currentOrderDetail?.orderState === giftStatusMap['UNPAY'];
        },
        // 判断是收礼人
        isReceiver() {
            return this.giverOrReceiver === giftType['RECEIVED'];
        },
        // 判断接收方是否已兑换礼物
        isReceiverUsed() {
            return this.isReceiver && this.used === giftUsedMap['USED'];
        },
        // 判断接收方是否未兑换礼物
        isReceiverUnused() {
            return this.isReceiver && this.used === giftUsedMap['UNUSED'];
        },
        navStyle() {
            return {
                'padding-top': (this.navHeight + 10) + 'px', // 该变量在system.js 混入里面
            }
        },
        // 开出来的发票数
        invoiceUrls() {
            return this.orderDetail?.invoiceApplyInfo?.invoiceUrls;
        },
        // 送礼人当前礼物状态的按钮组
        btnTypes() {
            if (this.isToPay) {
                return giftEnum[this.giverOrReceiver][giftStatusMap['UNPAY']].btnConfigDetail;
            }
            return giftEnum[this.giverOrReceiver][this.status].btnConfigDetail;
        },
        // 当前tab 下的订单详情
        currentOrderDetail() {
            return this.navList[this.tabCurrentIndex]?.orderDetail;
        }
    },
    methods: {
        toggleRemark(childOrder, flag) {
            this.$set(childOrder, 'isOpen', flag)
        },
        // 取消支付->取消送礼 ->礼物变成已取消状态 99
        cancelResult({ featherId }) {
            this.status = giftStatusMap.CANCEL;
            this.timingCancelFlag = false;
            uni.$emit('payTimeout', { featherId });
        },
        // 剩余时间, 时间名称  
        timing({ remainTime, type }) {
            this.remainTime = remainTime
        },
        // 超时未支付，礼物变成已取消状态 99
        // 超时未收礼 礼物变成已失效状态 2
        timeout({ type, featherId }) {

            if (type == 'pay') {
                this.status = giftStatusMap.CANCEL;
                uni.$emit('payTimeout', { featherId });
            } else if (type == 'weixinShare') {
                this.status = 2;
                uni.$emit('weixinTimeout', { featherId });
            }
            // 重新拉取数据
            // this.getGiftDetail()

        },

        //拨打电话
        callPhone() {
            let phone = config.SERVICE_PHONE;
            uni.makePhoneCall({
                phoneNumber: phone
            })
        },
        // 将阿拉伯数字改为汉字
        toChinesNumFun(string) {
            return toChinesNum(string)
        },

        /**
         * 复制字符串
         */
        copyStr(data) {
            copyText(data);
        },
        getGiftDetail() {
            this.$refs?.loading?.open();
            let params = {}
            params.featherId = this.featherId;
            getGiftDetail(params).then(res => {
                if (res.state == 200 && res.data) {
                    this.dispatchData(res);
                    this.requestStatus = true
                    this.isReceiver && this.getAfsServiceCheck();
                } else {
                    uni.showToast({
                        title: '订单信息查询失败，请稍后重试',
                        icon: 'none'
                    })
                }
            }).catch((e) => {
                console.log('error:', e);
            }).finally(() => {
                this.$refs?.loading?.close();
            })


        },
        handleNav(index) {
            this.tabCurrentIndex = index;
        },
        tabChange({ detail }) {
            this.tabCurrentIndex = detail.current;
        },
        // 分发数据到不同的内存变量
        dispatchData({ data }) {
            this.giverOrReceiver = data.giverOrReceiver; //0, 1 送礼人 收礼人 
            this.status = data.status; // 礼物状态0、1、2、10 礼物状态和鹅毛情id一一对应，但是该礼物的订单中如果未支付，则礼物状态显示为待支付
            this.used = data.used;
            this.giftDeliveryTraces = data.giftDeliveryTraces || [];

            let orderDetails = data.orderDetailVOs.map(orderDetail => {
                let {
                    actualPayment, totalExpress, totalMoney, platformVoucherAmount, fullDiscountAmount, storeVoucherAmount, integralCashAmount, activityDiscountAmount, orderAmount,
                    finishTime, remainTime, payTime,
                    orderTypeValue, orderSn, orderState, parentSn, paySn, payState,
                    receiverAddress, receiverAreaInfo, receiverMobile, receiverName
                } = orderDetail;

                let childOrdersVOS = orderDetail.childOrdersVOS.map(childOrder => {
                    return {
                        childOrderVO: childOrder,
                        // 订单信息
                        orderInfo: {
                            invoiceInfo: childOrder.invoiceInfo,
                            orderTypeValue,
                            orderSn,
                            finishTime,
                            payTime,
                            createTime: data.createTime,
                            expiredTime: data.expiredTime,
                            receivedTime: data.receivedTime,
                            usedTime: data.usedTime,
                            deliverTime: childOrder.deliverTime,
                            orderRemark: childOrder.orderRemark
                        },
                        // 礼物
                        gift: {
                            storeId: childOrder.storeId,
                            storeName: childOrder.storeName,
                            storeLogo: childOrder.storeLogo,
                            // 目前主商品和附件均平铺在这个数组中
                            products: childOrder.orderProductListVOList
                        }
                    }
                })

                return {
                    orderDetailVO: orderDetail,
                    childOrdersVOS,
                    orderSn,
                    orderState,
                    payState,
                    remainTime,
                    // 费用信息
                    chargeInfo: {
                        actualPayment,
                        totalExpress,
                        totalMoney,
                        platformVoucherAmount,
                        fullDiscountAmount,
                        storeVoucherAmount,
                        integralCashAmount,
                        activityDiscountAmount,
                        orderAmount
                    },
                    // 按钮回调使用参数
                    giftInfo: {
                        featherId: data.featherId,
                        orderSn,
                        featherOrderInfoVO: {
                            goodsSettleAmount: actualPayment,
                            paySn,
                            orderAmount,
                            parentSn,
                            orderSn,
                            orderState
                        },
                        orderDetailVO: orderDetail
                    },
                    // 收礼人信息
                    receiveInfo: {
                        receiverName,
                        receiverAddress,
                        receiverAreaInfo,
                        receiverMobile
                    }
                }
            })

            this.navList = orderDetails.map((orderDetail, index) => {
                return {
                    text: `订单${index + 1}`,
                    orderDetail
                }
            })


            let expiredTime = data.expiredTime;
            if (this.isToReceive && expiredTime != null) {
                this.remainTime = Math.round((new Date(expiredTime?.replaceAll('-', '/')).getTime() - Date.now()) / 1000);

            } else if (this.isToPay) {
                this.remainTime = this.currentOrderDetail.remainTime;
            }
        },
        // 通过 afsCheckCache获取订单orderSn 的售后检查 
        getAfsCheckFromCache(orderSn) {
            let afsCheckData = getStorageSync('afsCheckCache')
            if (afsCheckData?.orderSn == orderSn) {
                return afsCheckData.data;
            }
            return null;
        },
        // 可售后性列表 ,服务端拆服务了 ,售后和订单接口做了解耦
        getAfsServiceCheck() {
            this.navList.forEach(nav => {

                const params = {
                    orderSn: nav.orderDetail.orderSn
                };
                let cacheData = this.getAfsCheckFromCache(nav.orderDetail.orderSn);
                if (cacheData) {
                    this.setServiceList(nav, cacheData)

                } else {

                    afsCheck(params).then(res => {
                        if (res.state == 200) {
                            setStorageSync('afsCheckCache', { orderSn: nav.orderDetail.orderSn, data: res.data });
                            this.setServiceList(nav, res.data)
                        } else {
                            this.setServiceList(nav, [])
                        }
                    }).catch(() => {
                        this.setServiceList(nav, [])
                    })
                }


            })

        },
        // 将售后可用列表缝合到商品数据中
        setServiceList(nav, data) {
            nav.orderDetail.childOrdersVOS.forEach(childOrder => {
                childOrder.gift.products.forEach(product => {
                    let serviceList = data.find(ele => ele.orderProductId == product.orderProductId)
                    this.$set(product, 'serviceList', serviceList)
                })
            })
        },
        //查看发票
        viewInvoice(previewCallback) {
            this.previewInvoice = previewCallback;
            this.$refs.invoicePopup.open();
        },
        /**
        * @param {*} payResult 支付成功、支付取消、支付失败
        */
        orderPaySuccess() {
            this.currentOrderDetail.orderState = giftStatusMap.PAY; // 已支付
            this.status = giftStatusMap.TO_RECEIVE; // 待收礼
            uni.$emit('forceUpdatePage')
        },
        /***
         * 点击自定义回退按钮
         */
        toBack() {
            this.$Router.back(1);
        },

        viewGoodsDetail(sku, storeId, mainImage) {
            this.$Router.push({
                path: '/views/goods/detail/index',
                query: {
                    sku, storeId, mainImage
                }
            })
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
                            this.$refs.btnGroup?.$refs?.btnFactory[0]?.pay();
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
.gift-container {
    padding: 20rpx;

    background-color: #eff2f5;
    height: 100%;
    display: flex;
    flex-direction: column;

    .top {
        margin-bottom: 20rpx;
    }

    .swiper {
        flex: 1;

        .scroll-content {
            height: 100%;
            overflow-y: scroll;
        }
    }
}

.status-wrapper {
    padding: 10rpx 10rpx 20rpx;

    .status {
        font-size: 36rpx;
        font-weight: bold;
    }

    .desc-special {
        margin-top: 10rpx;

            >.time {
            color: #f30300;
            font-size: 13px;
            margin: 0 4px;
        }
    }
}

.customer-service-wrapper {
    background-color: #fff;
    padding: 0 32rpx;
    display: flex;


    .item {
        flex: 1;
        background: #f6f8f9;
        height: 80rpx;
        display: flex;
        justify-content: center; //水平居中
        align-items: center; // 垂直居中

        .content {
            display: flex;
            font-size: 28rpx;
            align-items: center;

            image {
                width: 36rpx;
                height: 36rpx;
                margin-right: 10rpx;
            }

            &>text {
                font-size: 28rpx;
            }
        }

    }

    .itemLeft {
        border-radius: 16rpx 0 0 16rpx;
        margin-right: 5rpx;

        .btn-customer {
            .btn-content {
                display: flex;
                align-items: center;

                .icon {
                    width: 18px;
                    height: 18px;
                    margin-right: 4px;
                }

                .btn-txt {
                    font-size: 14px;
                }
            }
        }
    }

    .itemRight {
        border-radius: 0 16rpx 16rpx 0;
        margin-left: 5rpx;
    }
}

.none-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100rpx;
}

.orderTips {
    font-size: 28rpx;
    color: #222;
    margin-left: 10rpx;
    margin-bottom: 6rpx;
}

.childOrder {
    .gift_info {
        background-color: #fff;
        padding-bottom: 20rpx;
        border-radius: 20rpx;
    }

    .store_price_info {
        background-color: #fff;
        border-radius: 20rpx;
        padding-top: 12rpx;
        margin: 20rpx 0;

        .cell_tip.actual_payment_price {
            font-size: 24rpx;
            font-weight: 600;
            color: #f30300;
            line-height: 30rpx;

            text:nth-child(2) {
                font-size: 32rpx;
            }
        }

        .orderSn {
            > text:first-child {
                position: relative;
                margin-right: 20rpx;

                &::after {
                    content: '';
                    position: absolute;
                    width: 2rpx;
                    height: 20rpx;
                    right: -10rpx;
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
            height: 2rpx;
            background-color: #e8e8e8;
            margin: 20rpx 32rpx;
        }

        .toggleMoreInfo {
            line-height: 32rpx;
            text-align: center;
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
}



.yt_list_cell {
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

        &.bold {
            font-weight: 700;
        }
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

.integer,
.mark {
    font-weight: bold;
}

.mark,
.decimal {
    font-size: 24rpx;
}

.integer {
    font-size: 28rpx;
}

.tab-wrapper {
    margin-top: 10rpx;
    // margin-bottom: 20rpx;
    display: flex;
    justify-content: space-around;
    background-color: #fff;
    border-radius: 20rpx;
    height: 88rpx;
    line-height: 88rpx;
    width: auto;

    .itemWrap {
        position: relative;
    }

    .tabText {
        font-size: 28rpx;
        color: #222222;
    }

    .active {
        font-size: 32rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #f30300;
    }

    .lineImg {
        position: absolute;
        top: 68rpx;
        left: 22rpx;
        width: 40rpx;
        height: 8rpx;
    }
}

.detail-content {
    padding-bottom: 110rpx;
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
                    width: 18px;
                    height: 18px;
                    margin-right: 5px;
                }

                text {
                    font-size: 16px;
                }
            }
        }
    }

.bottom-btn-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20rpx 40rpx 40rpx;
    background-color: #fff;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;

    ::v-deep .btnGroup {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
    }

    ::v-deep .btn {
        margin-left: 4px;
    }

    ::v-deep .share-btn {
        border-radius: 28px;
        background-color: #fc3030;
        border: #fc3030 1px solid;
        text-align: center;
        color: #fff;
        min-width: 86px;
        box-sizing: border-box;
        margin-left: 10px;
        font-size: 14px;
        font-weight: 600;
        padding: 0 10px;
        margin: 0;
        margin-left: 10px;
        height: 29px;
        line-height: 29px;
        text-align: center;
    }
}

.nav-slot {
    display: flex;
    align-items: center;

    ::v-deep .u-icon {
        padding-right: 14rpx;
    }

    .tips {
        font-size: 28rpx;
    }
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
