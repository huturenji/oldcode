<!-- 鹅毛情礼物详情页面 -->
<template>
    <view class="container">
        <view class="zhanwei" :style="{opacity:opacity}"></view>
        <view v-if="requestStatus" class="content">
            <view class="tab-wrapper" v-if="navList.length > 1">
                <text>您的礼物被拆成了多个订单</text>
                <tabs 
                    class="tab"
                    :list="navList"
                    :current="tabCurrentIndex" 
                    keyName="text" 
                    :itemStyle="{height: '88rpx', width: tabItemWidth}"
                    :inactiveStyle="{color: '#222222', transform: 'scale(1)',fontSize:'28rpx',padding:'0 18rpx'}"
                    :activeStyle="{color: '#F30300', transform: 'scale(1.1)', transformOrigin:'center bottom', fontWeight:'bold',transition: 'transform .3s',fontSize:'32rpx',padding:'0 18rpx'}"     
                    lineWidth="40rpx"
                    lineHeight="8rpx"    
                    @tabChange="handleNav"                        
                ></tabs>
            </view>
            
            <swiper :disable-touch="navList.length == 1" :current="tabCurrentIndex" class="swiper" :class="navList.length == 1 ? 'no-tab-swiper':'tab-swiper'" duration="300" @change="tabChange">
                <swiper-item v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
                    <scroll-view class="scroll-content" scroll-y>
                        <view class="status-wrapper" v-if="isGiver">
                            <view class="status">
                                <text>{{ statusValue }}</text>
                            </view>
                            <view class="desc" v-if="isCancel">
                                <text>礼物超时已自动取消</text>
                            </view>
                            <view class="desc-special" v-else-if="isToPay">
                                <text>
                                    需付款：
                                    <text class="actual_payment_price">
                                        <text class="unit">¥</text>
                                        <text>{{$getPartNumber(tabItem.orderDetail.chargeInfo.orderAmount,'int')}}</text>
                                        <text>{{$getPartNumber(tabItem.orderDetail.chargeInfo.orderAmount,'decimal')}}</text>
                                    </text>
                                    剩余:<text class="count-down num-font">{{ time.timeRemainStr || '00:00:00'}}</text> 
                                    自动关闭
                                </text>
                            </view>
                            <view class="desc-special" v-else-if="isToReceive">
                                <text>剩余 <text class="count-down num-font"> {{ time.timeRemainStr || '00:00:00'}}</text> 未收礼，将自动失效</text>
                            </view>
                            <view class="desc" v-else-if="isExpired">
                                <text>超时未收礼，已经自动失效</text>
                            </view>
                            <!-- ui 说没有这句话 (无语) -->
                            <!-- <view class="desc" v-else-if="isReceived">
                                <text>对方已经收到你的鹅毛情</text>
                            </view> -->

                        </view>
                        <!-- 收礼人信息 -->
                        <receiveInfo v-if="isReceiver && isToBeDelivered && tabItem.orderDetail.receiveInfo"
                            :receiveInfo="tabItem.orderDetail.receiveInfo" />

                        <gift-delivery-traces v-if="isGiver && giftDeliveryTraces.length" :traces="giftDeliveryTraces"/>
                        <!--  当前订单物流详情 -->
                        <logistics v-if="isReceiverUsed && tabItem.orderDetail.orderState >= 30" :orderSn="tabItem.orderDetail.orderSn"/>

                        <!-- 遍历每个订单下的子订单 -->
                        <view class="detail-wrapper" v-for="(childOrder, childOrderIndex) in tabItem.orderDetail.childOrdersVOS" :key="childOrderIndex">

                            <!-- 礼物列表信息 -->
                            <giftInfo v-if="requestStatus" :orderState="tabItem.orderDetail.orderState" :gift="childOrder.gift"
                                :orderSn="tabItem.orderDetail.orderSn" :isGiver="isGiver" :isReceiverUsed="isReceiverUsed" />
                            
                            <view class="store_price_info">
                                <view class="yt_list_cell" v-if="isGiver">
                                    <view class="cell_tit">
                                        <!-- <text v-if="tabItem.orderDetail.chargeInfo.payState == 0">待支付金额</text> -->
                                        <!-- <text v-if="tabItem.orderDetail.chargeInfo.payState == 1">实付金额</text> -->
                                        <text>实付金额</text>
                                    </view>
                                    <view class="cell_tip actual_payment_price num-font">
                                        <text class="unit">¥</text>
                                        <text>{{$getPartNumber(tabItem.orderDetail.chargeInfo.orderAmount,'int')}}</text>
                                        <text>{{$getPartNumber(tabItem.orderDetail.chargeInfo.orderAmount,'decimal')}}</text>
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
                                            <view class="cell_tip num-font">
                                                <text class="unit">¥{{$getPartNumber(tabItem.orderDetail.chargeInfo.goodsAmount,'int')}}{{$getPartNumber(tabItem.orderDetail.chargeInfo.goodsAmount,'decimal')}}</text>
                                            </view>
                                        </view>
                                        <view class="yt_list_cell" v-if="tabItem.orderDetail.chargeInfo.fullDiscountAmount">
                                            <text class="cell_tit">立减</text>
                                            <text class="cell_tip num-font">-¥{{tabItem.orderDetail.chargeInfo.fullDiscountAmount}}</text>
                                        </view>
                                        <view class="yt_list_cell">
                                            <text class="cell_tit">优惠券</text>
                                            <text class="cell_tip num-font">-¥{{tabItem.orderDetail.chargeInfo.totalCouponDiscount}}</text>
                                        </view>
                                        <view class="yt_list_cell">
                                            <text class="cell_tit">红包</text>
                                            <text class="cell_tip num-font">-¥{{tabItem.orderDetail.chargeInfo.redpacketAmount || 0}}</text>
                                        </view>
                                        <view class="yt_list_cell" >
                                            <text class="cell_tit">云豆抵现</text>
                                            <text class="cell_tip num-font">-¥{{tabItem.orderDetail.chargeInfo.integralCashAmount}}</text>
                                        </view>
                                        <view class="yt_list_cell">
                                            <text class="cell_tit">运费券</text>
                                            <text class="cell_tip num-font">-¥{{tabItem.orderDetail.chargeInfo.freightCashAmount || 0}}</text>
                                        </view>
                                        <view class="yt_list_cell">
                                            <text class="cell_tit">运费总额</text>
                                            <text class="cell_tip num-font">
                                                <text v-if="tabItem.orderDetail.chargeInfo.totalExpress">{{('+¥' + $getPartNumber(tabItem.orderDetail.chargeInfo.totalExpress,'int') + $getPartNumber(tabItem.orderDetail.chargeInfo.totalExpress,'decimal'))}}</text>
                                                <text v-else>{{$L('免运费')}}</text>
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
                                    
                                    <view class="yt_list_cell" v-if="isGiver && tabItem.orderDetail.orderState >= 20 && tabItem.orderDetail.chargeInfo.orderAmount+tabItem.orderDetail.chargeInfo.integralCashAmount>0">
                                        <text class="cell_tit">支付方式</text>
                                        <text class="cell_tip">{{ tabItem.orderDetail.chargeInfo.orderAmount>0?tabItem.orderDetail.chargeInfo.paymentName:'' }}</text>
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
                                    <view class="yt_list_cell" v-if="isReceiver">
                                        <text class="cell_tit">配送时间</text>
                                        <text class="cell_tip">
                                            <text v-if="productPromiseCalendars && productPromiseCalendars.length>1">
                                                <text style="display:block" v-for="(item, index) in productPromiseCalendars" :key="index" >
                                                    <text style="color:#343434;display:block" v-if="item.skuClassify==1">中小件:{{setdeliveryTimeStr(item.calendarDay)}}</text>
                                                    <text style="color:#343434;display:block" v-if="item.skuClassify==2">大件 配送:{{setdeliveryTimeStr(item.calendarDay)}}</text>
                                                    <text style="color:#343434;display:block" v-if="item.skuClassify==2&&item.installDay">大件 安装:{{setdeliveryTimeStr(item.installDay)}}</text>
                                                </text>
                                            </text>
                                            <text v-else-if="productPromiseCalendars.length==1">
                                                <text style="color:#343434;display:block" v-if="productPromiseCalendars[0].skuClassify==1">{{setdeliveryTimeStr(productPromiseCalendars[0].calendarDay)}}</text>
                                                <text style="color:#343434;display:block" v-if="productPromiseCalendars[0].skuClassify==2">大件 配送:{{setdeliveryTimeStr(productPromiseCalendars[0].calendarDay)}}</text>
                                                <text style="color:#343434;display:block" v-if="productPromiseCalendars[0].skuClassify==2&&productPromiseCalendars[0].installDay">大件 安装:{{setdeliveryTimeStr(productPromiseCalendars[0].installDay)}}</text>
                                            </text>
                                            <view v-else>
                                                <text>工作日、双休日与节假日均可送货</text>
                                            </view>
                                        </text>
                                    </view>
                                    <view class="yt_list_cell order_remark" v-if="isGiver">
                                        <view class="cell_tit">订单备注</view>
                                        <view class="cell_tip" v-if="childOrder.orderInfo.orderRemark" style="word-break: break-all;">
                                            <view>
                                                {{ childOrder.orderInfo.orderRemark.slice(0, 16) }}
                                                <image
                                                    v-if="childOrder.orderInfo.orderRemark.length > 16 && !childOrder.orderInfo.isOpen"
                                                    :src="imgUrl + 'common/icon/btn_common_downarrow1.svg'"
                                                    @click="$set(childOrder.orderInfo, 'isOpen', !childOrder.orderInfo.isOpen)"
                                                />
                                            </view>
                                            <view v-if="childOrder.orderInfo.orderRemark.length > 16 && childOrder.orderInfo.isOpen">
                                                {{ childOrder.orderInfo.orderRemark.slice(16) }}
                                                <image
                                                    :src="imgUrl + 'common/icon/btn_common_uparrow1.svg'"
                                                    @click="$set(childOrder.orderInfo, 'isOpen', !childOrder.orderInfo.isOpen)"
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
                                        :src="imgUrl + 'common/icon/btn_common_downarrow5.svg'"
                                    />
                                </view>
                            </view>

                            <!-- 客服、售后、拨打电话按钮 -->
                            <contactBtnGroup :orderDetailVO="tabItem.orderDetail.orderDetailVO" :childOrderVO="childOrder.childOrderVO" showTitle style="margin-bottom: 56rpx;" />
                        </view>
                    </scroll-view>
                </swiper-item>
            </swiper>

            <view class="bottom-btn-wrapper">
                <btnGroup
                    v-if="isGiver"
                    :btnTypes="giverBtnTypes"
                    :info="currentOrderDetail.giftInfo"
                    @cancelResult="cancelResult"
                    @viewInvoice="viewInvoiceFun"
                />
                <btnGroup
                    v-else
                    :btnTypes="giftEnum[giverOrReceiver][giftStatusMap['RECEIVED']][used].btnConfigDetail"
                    :info="currentOrderDetail.giftInfo"
                />
            </view>
        </view>
        <!-- 暂时不需要 -->
        <!-- <view v-if="requestStatus && expiredPayFlag" class="no-empty">
            <view class="none-wrapper flex_row_center_start">
                <view class="none-wrapper_content flex_column_start_center">
                    <view class="top flex_column_center_center">
                        <image :src="imgUrl + 'gift/icon_defpage_liwuchaoshi.png'"></image>
                        <text>{{ $L('礼物超时已自动取消') }}</text>
                    </view>
                    <view class="bottom flex_row_center_center">
                        <btnFactory type="havedKnow" size="big"></btnFactory>
                        <btnFactory type="agagin" size="big"></btnFactory>
                    </view>
                </view>
            </view>
        </view> -->
        <!-- 分享弹框 start -->
        <view class="share_model" v-if="share_model" @touchmove.stop.prevent="() => { }">
            <view class="bizmateshareWrap">
                <share @close="share_model = false" :shareOptions="shareOptions" :supportTypes="supportTypes"
                    :showCopy="false"></share>
            </view>
        </view>
        <!-- 分享弹框 end -->

        <!-- 如果发票存在多个发票的时候显示发票列表的弹窗 -->
        <uni-popup ref="invoicePopup" type="bottom" :prevent="false">
                <view class="view_invoice_list">
                    <view @click="previewInvoice(item)" v-for="(item, index) in invoiceUrls" :key="index" class="item">发票{{toChinesNumFun(++index)}}</view>
                </view>
        </uni-popup>
        <!-- 预览发票pdf -->
        <template v-if="pdfUrl">
            <viewInvoice :pdfUrl="pdfUrl"/>
        </template>
    </view>
</template>

<script>
import giftHandler from "@/components/gift/handler";
import Logistics from '@/components/gift/detail/logistics.vue';
import giftDeliveryTraces from '@/components/gift/detail/traces.vue';
import ReceiveInfo from '@/components/gift/detail/receiveInfo.vue';
import GiftInfo from "@/components/gift/detail/giftInfo.vue";
import BtnGroup from "@/components/button/btnGroup.vue";
import ContactBtnGroup from "@/components/gift/detail/contactBtnGroup.vue";
import share from '@/components/share/index.vue';
import { getEmaoqingShareInfo } from '@/views/gift/common/lib/until';
// import btnFactory from "@/components/button/btnFactory.vue";
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import viewInvoice from "@/components/invoice/view";
import { giftEnum, giftType, giftStatusMap, giftUsedMap, FLUSH_PATH } from '@/views/gift/common/lib/enum.js';
import { toChinesNum,copyText } from '@/utils/common';
import tabs from "@/components/tab/base";

export default {
    components: {
        tabs,
        Logistics,
        ReceiveInfo,
        GiftInfo,
        BtnGroup,
        share,
        ContactBtnGroup,
        giftDeliveryTraces,
        uniPopup,
        viewInvoice

    },
    data() {
        return {
            productPromiseCalendars:[],//配送日历
            giftDeliveryTraces: '礼物配送物流',
            imgUrl: getApp().globalData.imgUrl,
            share_model: false,//分享弹框控制
            shareOptions: {},//分享所需的参数
            supportTypes: ['bizmate'],//当前渠道下支持的H5 sharetype
            /**
             * 鹅毛情状态枚举
             */
            giftEnum,
            giftStatusMap,

            expiredTime:null, // 礼物失效时间
            tabCurrentIndex: 0,
            orderStates:[], // 各个订单的状态，索引值取tabCurrentIndex
            navList: [], // 导航数据：item中有对应订单的信息
            /**
             * 鹅毛情礼物状态信息
             */
            used: 0, //是否已兑换： 0-未兑换， 1-已兑换
            status: 0, // 鹅毛情礼品状态: 待收礼，已收礼，已失效: 0,1,2
            giverOrReceiver: 0, // 0：送礼人，1：收礼人
            
            featherId: '', // 鹅毛情id：可能有多个订单
            // 时间
            time: {
                timeToPay: null, //支付截止时间
                timeToReceive: null, // 收礼的截止时间
                timeRemainStr: ''
            },
            // 统一管理定时器
            timer: {
                payTimer: null,
                receiveTimer: null
            },
            // 数据是否请求成功
            requestStatus: false,
            // 加一个计数器，防止页面多次拉取数据
            counter: 0,
            expiredPayFlag: false, //支付是否超时 true:超时,false:没超时 暂时去掉，礼物状态直接变成已取消
            opacity: 0, //为了做沉浸式加的占位图的透明度
            pdfUrl:'', //查看发票地址
            showMore: true
        }
    },
    computed: {
        // 顶部tab的宽度，动态等分变化，最多分为4份
        tabItemWidth(){
            let widthPercent = 100 / this.navList.length
            if (widthPercent < 25){
                widthPercent = 25;
            }
            return widthPercent + '%'
        },
        // 礼物状态的值
        statusValue(){
            if (this.isToPay){
                return giftEnum[this.giverOrReceiver][giftStatusMap['UNPAY']].text;
            }
            
            return giftEnum[this.giverOrReceiver][this.status].text;
        },
        // 判断是送礼人
        isGiver() {
            return this.giverOrReceiver === giftType['GIVED'];
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
        // 待支付
        isToPay() {
            return this.isGiver && this.status !== giftStatusMap['CANCEL'] && this.currentOrderDetail?.orderState === giftStatusMap['UNPAY'];
        },
        // 已取消
        isCancel() {
            return this.isGiver && this.status === giftStatusMap['CANCEL'];
        },
        // 待领取
        isToReceive() {
            return this.isGiver && this.status === giftStatusMap['TO_RECEIVE'];
        },
        //已收礼
        isReceived() {
            return this.isGiver && this.status === giftStatusMap['RECEIVED'];
        },
        // 已失效
        isExpired() {
            return this.isGiver && this.status === giftStatusMap['EXPIRED'];
        },
        // 待发货状态判断
        isToBeDelivered() {
            return this.currentOrderDetail.orderState === 20
        },
        // 送礼人当前礼物状态的按钮组
        giverBtnTypes() {
            if (this.isToPay){
                return giftEnum[this.giverOrReceiver][giftStatusMap['UNPAY']].btnConfigDetail;
            }
            return giftEnum[this.giverOrReceiver][this.status].btnConfigDetail;
        },
        // 开出来的发票数
        invoiceUrls(){
            if (this.currentOrderDetail?.orderDetailVO && !!this.currentOrderDetail?.orderDetailVO?.invoiceApplyInfo && !!this.currentOrderDetail?.orderDetailVO?.invoiceApplyInfo.invoiceUrls && this.currentOrderDetail?.orderDetailVO.invoiceApplyInfo.invoiceUrls.length > 0){
                return this.currentOrderDetail?.orderDetailVO.invoiceApplyInfo.invoiceUrls;
            }
            return [];     
        },
        isIOS(){
            return SnUtils.getNavigatorType() == 'ios';
        },
        // 当前tab 下的订单详情
        currentOrderDetail(){
            return this.navList[this.tabCurrentIndex]?.orderDetail;
        }
    },
    watch: {
        $route(to,from) {
            // 特别地监听一下路由是否从补开发票页面过来的，刷新页面
            if (FLUSH_PATH.includes(from.path)) {
                this.getGiftDetail();
            }
        }
    },
    created() {
        this.getGiftDetail();

        uni.$off('afsCheck');
        uni.$on('afsCheck', () => this.getAfsServiceCheck()); // 监听事件，进行售后检查：当 申请售后成功 和 取消售后成功时会触发此事件
        uni.$off('giftShare', this.setShareInfo);
        uni.$on('giftShare', this.setShareInfo);
    },
    beforeDestroy() {
        this.clearTimer(this.timer.receiveTimer, this.timer.payTimer);
    },
    onPageScroll(e){
        if (e.scrollTop >= 0 && e.scrollTop <= window.titleBarHeight){
            this.opacity = e.scrollTop / window.titleBarHeight;
        } else {
            this.opacity = 1;
        }
    },
    methods: {
        // 清除定时器
        clearTimer(...timers){
            timers.forEach((timer) => {
                clearInterval(timer)
                timer = null;
            })
        },
        tabChange({detail}){
            this.tabCurrentIndex = detail.current;
        },
        handleNav({index}){
            this.tabCurrentIndex = index;
        },
        // 将阿拉伯数字改为汉字
        toChinesNumFun(string){
            return toChinesNum(string)
        },
        // 为当前订单状态创建定时器
        createTimer(){
            // 待支付
            if (this.isToPay){
                this.time.timeToPay = new Date(Date.now() + this.currentOrderDetail?.remainTime * 1000);
                this.activeTimer(this.time.timeToPay, 'payTimer');
                return; // 当前订单未支付，直接返回
            }
            // 待收礼
            if (this.isToReceive){
                this.time.timeToReceive = new Date(String(this.expiredTime?.replaceAll('-', '/')));
                this.activeTimer(this.time.timeToReceive, 'receiveTimer')
            }
        },
        // 获取礼物详情
        getGiftDetail() {
            uni.showLoading();
            let featherId = this.$Route.query.featherId;
            if (!featherId) {
                return;
            }
            const params = {
                featherId
            };

            giftHandler.getGiftDetail(params).then(res => {
                if (res.state == 200 && res.data) {
                    window.featherObj = {   
                        featherId:this.$Route.query.featherId,
                        status:res.data.status,
                        used:res.data.used,
                        type: 'change'
                    }
                    // 重新组装数据
                    this.transformData(res);
                
                    // 激活待支付、待领取计数器
                    this.createTimer();

                    // 如果是接收者，调用售后是否可用接口
                    if (this.isReceiver) {
                        this.getAfsServiceCheck();
                    }
                    // 获取配送日历
                    this.productPromiseCalendars = res.data.orderDetailVOs[0].childOrdersVOS[0].productPromiseCalendars
                    if (this.currentOrderDetail.remainTime == 0 && this.currentOrderDetail?.orderState == 0 && this.currentOrderDetail.payState != '1') { //超时未付款
                        // this.expiredPayFlag = true; 暂时不要
                        window.featherObj = {
                            type: 'del',
                            featherId: this.$Route.query.featherId
                        }
                    } else {
                        // this.expiredPayFlag = false;  暂时不要
                    }
                    // 请求的状态，控制页面是否显示dom
                    this.requestStatus = true
                } 
            }).catch((e) => {
                console.error('error:', e);
            }).finally(() => {
                uni.hideLoading();
            })


        },
        // 重新组装数据
        transformData({ data }) {
            this.giverOrReceiver = data.giverOrReceiver; //0, 1 送礼人 收礼人 
            this.status = data.status; // 礼物状态0、1、2、99 礼物状态和鹅毛情id一一对应，但是该礼物的订单中如果未支付，则礼物状态显示为待支付
            this.used = data.used;
            this.expiredTime = data.expiredTime;
            this.giftDeliveryTraces = data.giftDeliveryTraces || [];
            // 构造以下数据结构
            let orderDetails = data.orderDetailVOs.map(orderDetail => {
                let {
                    actualPayment, totalExpress, goodsAmount, totalCouponDiscount, fullDiscountAmount, integralCashAmount, orderAmount, redpacketAmount,freightCashAmount,
                    finishTime, remainTime, payTime,
                    orderTypeValue, orderSn, orderState, parentSn, paySn, payState,
                    receiverAddress, receiverAreaInfo, receiverMobile, receiverName, paymentName
                } = orderDetail;

                let childOrdersVOS = orderDetail.childOrdersVOS.map(childOrder=>{
                    return {
                        childOrderVO: childOrder,
                        // 订单信息
                        orderInfo : {
                            invoiceInfo:childOrder.invoiceInfo,
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
                        gift:  {
                            storeName: childOrder.storeName,
                            storeLogo: childOrder.storeLogo,
                            // 目前主商品和附件均平铺在这个数组中
                            products: childOrder.orderProductListVOList,
                            storeId: childOrder.storeId
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
                    chargeInfo : {
                        actualPayment,
                        totalExpress,
                        goodsAmount,
                        totalCouponDiscount,
                        redpacketAmount,
                        freightCashAmount,
                        fullDiscountAmount,
                        integralCashAmount,
                        orderAmount,
                        paymentName
                    },
                    // 按钮回调使用参数
                    giftInfo : {
                        featherId: data.featherId,
                        orderSn,
                        featherOrderInfoVO: {
                            parentSn,
                            goodsSettleAmount: actualPayment,
                            paySn
                        },
                        orderDetailVO: orderDetail
                    },
                    // 收礼人信息
                    receiveInfo : {
                        receiverName,
                        receiverAddress,
                        receiverAreaInfo,
                        receiverMobile
                    }
                }
            })
            // 将数据存到navList中，点击不同的订单切换显示
            this.navList = orderDetails.map((orderDetail, index)=>{
                return {
                    text: `订单${index + 1}`,
                    orderDetail
                }
            })
        },
        // 开启支付或已收礼定时器
        activeTimer(deadline, timerName) {
            this.time.timeRemainStr = this.getRemainTimeStr(deadline, timerName);
            // 创建之前先清除定时器
            this.timer[timerName] && this.clearTimer(this.timer[timerName]);

            this.timer[timerName] = setInterval(() => {
                this.time.timeRemainStr = this.getRemainTimeStr(deadline, timerName);
            }, 1000);
        },
        // 获取剩余时间的字符串表示形式
        getRemainTimeStr(deadline, timerName) {
            let rangeTime = deadline - Date.now();
            // 到期切换状态，清除定时器
            if (rangeTime <= 0) {
                rangeTime = 0;
                clearInterval(this.timer[timerName]);
                this.timer[timerName] = null;
                // 正常情况下不需要this.counter，为了防止开发环境下有脏数据，导致死循环请求数据
                if (this.counter === 0) {
                    this.counter += 1;
                    
                    // 支付时间 到期
                    if (timerName == 'payTimer'){
                        // 放一个del标记，鹅毛情首页会根据这个type来修改数据状态
                        window.featherObj = {
                            type: 'del',
                            featherId: this.$Route.query.featherId
                        }
                        // 前端直接修改，避免接口延迟
                        this.status = 99 // 直接修改礼物状态，99=已取消，并且不拉取数据
                    } else {
                        // 重新拉取数据
                        this.getGiftDetail();
                    }
                }


                return `00:00:00`;
            }
            rangeTime /= 1000;
            // 应当是截止时间-当前时间
            let day = this.addZero(parseInt(rangeTime / 60 / 60 / 24));
            let hour = this.addZero(parseInt(rangeTime / 60 / 60 % 24));
            let minute = this.addZero(parseInt(rangeTime / 60 % 60));
            let second = this.addZero(parseInt(rangeTime % 60));
            if (day === '00') {
                return `${hour}:${minute}:${second}`;
            }
            return `${day}天 ${hour}:${minute}:${second}`;

        },
        // 取消送礼结果
        cancelResult() {
            // 跳转到鹅毛情首页1
            window.featherObj = {
                type: 'del',
                featherId: this.$Route.query.featherId
            }
            this.$Router.back(1);
        },
        // 补0
        addZero(i) {
            return i < 10 ? "0" + i : i + "";
        },
        /**
         * 处理分享所需数据
         * @param number featherId
         */
        async setShareInfo(featherId) {
            let that = this;
            try {
                that.shareOptions = await getEmaoqingShareInfo(featherId);
                that.share_model = true;
            } catch (error) {
                console.error('分享失败', error)
            }
        },
        // 可售后性列表 ,服务端拆服务了 ,售后和订单接口做了解耦
        getAfsServiceCheck() {
            this.navList.forEach(nav => {
                let param = {};
                param.url = 'v3/postsale/front/after/sale/apply/afsServiceCheck';
                param.data = {};
                param.data.orderSn = nav.orderDetail.orderSn;

                this.$request(param).then(res => {
                    if (res.state == 200) {
                        this.setServiceList(nav, res.data)
                    } else {
                        (this.$Route.path == '/pages/order/detail') && this.$api.msg(res.msg);
                        this.setServiceList(nav, [])
                    }
                }).catch(() => {
                    this.setServiceList(nav, [])
                })
            })                
        },
        // 将售后可用列表缝合到商品数据中
        setServiceList(nav, data) {
            nav.orderDetail.childOrdersVOS.forEach(childOrder=>{
                childOrder.gift.products.forEach(product => {
                    let serviceList = data.find(ele => ele.orderProductId == product.orderProductId)
                    this.$set(product, 'serviceList', serviceList)
                }) 
            })
        },
        //查看发票
        viewInvoiceFun() {
            if (this.invoiceUrls.length > 1){ //说明有多张发票
                // 此时显示多张发票的弹窗
                this.$refs.invoicePopup.open();
            } else { //此时说明只有一张发票
                this.previewInvoice(this.invoiceUrls[0]);
            }
        },
        previewInvoice(path){
            if (!path){ return }
            if (this.isIOS){ //ios的话调用jsbridge预览
                let previemJson = {
                    "fileId": new Date().getTime(),
                    "previewUrl": path,
                    "downloadUrl": path,
                    "fileSize": parseFloat(35),
                    "fileName": 'invoice' + new Date().format('yyyy/MM/dd HH:mm:ss') + '.pdf'
                }
                sinosdk.sino.filePreview(previemJson);
            } else { //安卓和pc用iframe预览
                this.pdfUrl = path;
                //TODO 先清空pdfUrl, 防止下载完后面点击查看发票不反应的问题（因为iframe的src没有变更，导致再次点击查看发票页面没反应）
                setTimeout(()=>{
                    this.pdfUrl = ''
                }, 800)
            }
        },
        /**
         * 复制字符串
         */
        copyStr (str) {
            copyText(str);
        }

    }
}
</script>

<style lang="scss" scoped>
.container {
    height: 100%;
    padding-top: var(--titleBarHeight);

    .content{
        overflow: hidden;
        height: 100%;
        // display: flex;
        // flex-direction: column;

        .tab-wrapper {
            height: 140rpx;
            background-color: #EFF2F5; 
            display: flex;
            justify-content: space-between;
            flex-direction: column;

            position: fixed;
            z-index: 999;
            width: 750rpx;
            padding: 0 20rpx;
            left: calc((100% - 750rpx) / 2);
            border-bottom-left-radius: 20rpx;
            border-bottom-right-radius: 20rpx;

            &>text{
                margin-left: 28rpx;
                color: #222222;
                font-size: 28rpx;
                height: 40rpx;
                line-height: 40rpx;
            }
            .tab{
                height: 88rpx;
                margin-top: 8rpx;
                background-color: #fff;
                border-radius: 20rpx;
            }

        }

        .swiper {
            // flex: 1;
            .scroll-content {   
                height: 100%;
            }
        }
        .no-tab-swiper{
            height: calc(100% - 120rpx - var(--safe-area-inset-bottom));
            margin-top: 0rpx;
        }
        .tab-swiper{
            height: calc(100% - 260rpx - 20rpx);
            margin-top: 160rpx;
        }
    }

    .no-empty {
        height: 100%;
    }
}

page {
    height: 100%;
}

.zhanwei{
    width: 750rpx;
    height: var(--titleBarHeight);
    position: fixed;
    top: 0;
    z-index: 10;
    background: #222;
    opacity: 0;
}
.detail-wrapper{
    padding: 0 20rpx 20rpx;

    .store_price_info {
        background-color: #fff;
        border-radius: 20rpx;
        padding-top: 12rpx;
        margin: 20rpx 0;

        .cell_tip.actual_payment_price {
            font-size: 24rpx;
            font-weight: normal;
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
                font-weight: bold;
            }
        }
    }

    .order_remark {
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

    .info_line {
        height: 2rpx;
        background-color: #e8e8e8;
        margin: 20rpx 32rpx;
    }
}
.none-wrapper {
    height: 100%;
    background: #fff;

    &_content {
        width: 100%;
        margin-top: calc(var(--titleBarHeight) + 102rpx);

        .top {
            image {
                width: 256rpx;
                height: 256rpx;
            }

            text {
                margin-top: 28rpx;
                font-size: 32rpx;
                font-weight: bold;
                color: #222222;
            }
        }

        .bottom {
            width: 100%;
            margin-top: 128rpx;
            padding: 0 40rpx;

            ::v-deep .btnFactory {
                flex: 1;

                &:first-of-type {
                    margin-right: 16rpx;

                    .btn {
                        border: 2rpx solid #999999;
                        color: #222222;
                        background: #fff;
                    }
                }

                &:last-of-type {
                    margin-left: 16rpx;
                }
            }
        }
    }
}

.status-wrapper {
    color: #222222;
    padding: 20rpx 32rpx 0 32rpx;

    .status {
        font-size: 40rpx;
        font-weight: bold;
    }

    .desc,
    .desc-special {
        margin-top: 6rpx;
        font-size: 28rpx;
    }

    .desc {
        font-weight: 500;
        color: #999;
    }

    .desc-special {
        .count-down {
            color: #F30300;
            margin: 0 10rpx;
            font-weight: normal;
        }

        .actual_payment_price {
            font-size: 24rpx;
            font-weight: 600;
            color: #f30300;
            line-height: 30rpx;
            margin-right: 16rpx;

            text:nth-child(2) {
                font-size: 32rpx;
            }
        }
    }
}

.bottom-btn-wrapper {
    background-color: #fff;
    height: calc(120rpx + var(--safe-area-inset-bottom));
    padding-top: 28rpx;
    padding-bottom: calc(28rpx + var(--safe-area-inset-bottom));
    padding-right: 40rpx;
    position: fixed;
    bottom: 0;
    left: calc((100% - 750rpx) / 2);
    width: 750rpx;
}

.share_model {
    width: 750rpx;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
}

.bizmateshareWrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
