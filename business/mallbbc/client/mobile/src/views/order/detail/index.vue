<!-- 订单详情页面 -->
<template>
    <scroll-view class="container" scroll-y @scrolltolower='getData' v-if="allData && isShow">

        <view class="main_content" >
            <!-- 订单状态 start -->
            <view class="order_state">
                <!-- 待付款 start orderState == 10-->
                <block v-if="allData.orderState == 10">
                    <view class="state_title">{{ allData.orderStateValue }}</view>
                    
                    <view class="state_time" v-if="stateTime">
                        需付款：
                        <text class="actual_payment_price">
                            <text class="unit">¥</text>
                            <text>{{$getPartNumber(allData.orderAmount,'int')}}</text>
                            <text>{{$getPartNumber(allData.orderAmount,'decimal')}}</text>
                        </text>
                        剩余：<text>{{ stateTime }}</text> 
                        自动关闭
                    </view>
                </block>
                <!-- 待付款 end-->
                <!-- 待发货  orderState == 20-->
                <block v-if="allData.orderState == 20">
                    <view class="state_title">{{ allData.orderStateValue }}</view>
                </block>
                <!-- 待发货 end-->
                <!-- 待收货 -->
                <block v-if="allData.orderState == 30">
                    <view class="state_title">{{ allData.orderStateValue }}</view>
                    <view class="state_time" v-if="stateTime">剩余：<text>{{ stateTime }}</text>自动确认</view>
                </block>
                <!-- 待评价 -->
                <block v-if="allData.orderState == 40">
                    <view class="state_title">{{ allData.orderStateValue }}</view>
                </block>
                <!-- 待收货 end-->
                <!-- 取消订单，交易关闭 start orderState == 0 -->
                <block v-if="allData.orderState == 0">
                    <view class="state_title">{{ allData.orderStateValue }}</view>
                    <view class="state_time">{{allData.refuseReason}}</view>
                    <!-- 注： allData.cancelRemark 不为空 时为平台取消  否则为会员取消 -->
                    <view class="state_time" v-if="allData.refuseRemark">{{allData.refuseRemark}}</view>
                </block>
                <!-- 取消订单，交易关闭 end-->
            
                <block v-if="allData.orderState==50">
                    <view class="state_title">{{ allData.orderStateValue }}</view>
                </block>
            </view>
            <!-- 订单状态 end -->

            <!-- 买家个人信息 start-->
            <view class="buyer_info">
                <view class="buyer_map"></view>
                <view class="info_det">
                    <view class="info_detail">
                        <view class="info_name">
                            <text class="buyer_namer">{{allData.receiverName}}</text>
                            <text class="buyer_phone">{{allData.receiverMobile|formateTel}}</text>
                        </view>
                        <view class="info_address">{{allData.receiverAreaInfo+allData.receiverAddress}}</view>
                    </view>
                </view>
            </view>
            <!-- 买家个人信息 end-->

            <!-- 订单内商品信息 start -->
            <view class="order_goods">
                    <view v-for="(store,index) in orderProductList" :key="index" class="store_item">
                        <view class="store_name">
                            <image class="store_logo" :src="imgUrl+'goods/store_logo.png'"></image>
                            <text class="store_name_text">{{store.storeName}}</text>
                            <!-- <text class="iconfont icon_arrow_right"></text> -->
                        </view>
                        <view class="goods_pre" v-for="(item,indexChild) in store.orderProductListVOList" :key="indexChild"
                            @click="goProductDetail(item.sku,item.spu,item.productType)">
                            <!-- #ifdef MP-WEIXIN || APP-PLUS -->
                            <view class="goods_image">
                                <image :src="item.mainImage" mode="aspectFill"></image>
                            </view>
                            <!-- #endif -->
                            <!-- #ifdef H5 -->
                            <view class="goods-img"
                                :style="{backgroundImage: 'url('+(item.mainImage||defaultImage)+')'}"><view class="no-goods" v-if="item.productNum==0"></view></view>
                            <!-- #endif -->
                            <view class="goods_pre_right">
                                <view class="goods_des">
                                    <view class="goods_name">{{item.skuName}}</view>
                                    <view class="goods_spec" v-if="item.specValues">{{item.specValues}}</view>
                                </view>
                                <view :class="{'goods_prices':true,'justify':item.productType==0}">
                                    <view class="goods_price num-font" v-if="item.productType==0">
                                        <text class="unit">¥</text>
                                        <text class="price_int">{{$getPartNumber(item.productShowPrice,'int')}}</text>
                                        <text class="price_decimal">{{$getPartNumber(item.productShowPrice,'decimal')}}</text>
                                    </view>
                                    <view class="goods_num_give" v-else>{{item.productType==1?'附件':'赠品'}}</view>
                                    <view class="goods_num num-font">*{{item.productNum}}</view>
                                    <block v-if="(allData.orderState == 40 && item.serviceList)">
                                        <!-- 退款中 可查看退款详情  售后按钮，100-退款（商家未发货），200-退款（商家发货,买家未收货），300-申请售后，401-退款中，402-退款完成,403-换货中，404-换货完成301,退款失败-平台审核失败-->
                                        <!-- <view class="refund_btn"
                                            v-if="item.afsButton == 401 || item.afsButton == 402 || item.afsButton == 403 || item.afsButton == 404 || item.afsButton == 301"
                                            @click.stop="lookRefundDetail(item.afsSn,item.afsButton)">
                                            {{item.afsButtonValue}}</view> -->
                                        <!-- 退款 可申请退款  item.afsButton == 100 || item.afsButton == 200 || -->
                                        <!-- <view class="refund_btn"
                                            v-if="item.productType == 0 && (item.afsButton == 300)"                
                                            @click.stop="selectService(allData.orderSn,item.orderProductId)">
                                            {{item.afsButtonValue}}</view> -->

                                        <view :class="item.serviceList && item.serviceList.num != 0 && item.serviceList.afterSaleTypes.length != 0?'refund_btn':'refund_btn_disabled'"
                                            v-if="item.productType == 0"                
                                            @click.stop="selectService(allData.orderSn,item.orderProductId,item.serviceList)">
                                            申请售后</view>
                                    </block>
                                </view>
                            </view>

                        </view>
                        <view class="store_info">
                            <!-- 配送信息 -->
                            <view class="yt_list_cell">
                                <text class="cell_tit clamp">配送时间</text>
                                <text class="cell_tip" v-if="store.productPromiseCalendars && store.productPromiseCalendars.length>0&&!isGift">
                                    <view style="display:block" v-for="(item, index) in store.productPromiseCalendars" :key="index" >
                                        <text style="color:#343434;display:block" v-if="item.skuClassify==1">
                                            中小件:{{setdeliveryTimeStr(item.calendarDay)}}
                                        </text>
                                        <text style="color:#343434;display:block" v-if="item.skuClassify==2">
                                            大件 配送:{{setdeliveryTimeStr(item.calendarDay)}}
                                        </text>
                                        <text style="color:#343434;display:block" v-if="item.skuClassify==2&&item.installDay">
                                            大件 安装:{{setdeliveryTimeStr(item.installDay)}}
                                        </text>
                                    </view>
                                </text>
                                <text v-else>工作日、双休日与节假日均可送货</text>
                            </view>

                            <block v-if="orderSource!='VOUCHER'">
                                <!-- 运费 -->
                                <view class="yt_list_cell">
                                    <text class="cell_tit clamp">运费</text>
                                    <text class="cell_tip">
                                        <text v-if="store.expressFee" class="num-font" :style="{'font-weight':'bold'}">{{'+¥' + $getPartNumber(store.expressFee,'int')+$getPartNumber(store.expressFee,'decimal')}}</text>
                                        <text v-else>{{$L('免运费')}}</text>
                                    </text>
                                </view>
                                <!-- 小计 -->
                                <view class="yt_list_cell">
                                    <text class="cell_tit clamp">小计</text>
                                    <text class="cell_tip bold num-font">
                                        ¥{{$getPartNumber(store.totalAmount,'int')}}{{$getPartNumber(store.totalAmount,'decimal')}}
                                    </text>
                                </view>
                           </block>
                           <view class="yt_list_cell order_remark">
                                <view class="cell_tit">订单备注</view>
                                <view class="cell_tip" v-if="store.orderRemark" style="word-break: break-all;">
                                    <view>
                                        {{ store.orderRemark.slice(0, 16) }}
                                        <image
                                            v-if="store.orderRemark.length > 16 && !store.isOpen"
                                            :src="imgUrl + 'common/icon/btn_common_downarrow1.svg'"
                                            @click="$set(store, 'isOpen', !store.isOpen)"
                                        />
                                    </view>
                                    <view v-if="store.orderRemark.length > 16 && store.isOpen">
                                        {{ store.orderRemark.slice(16) }}
                                        <image
                                            :src="imgUrl + 'common/icon/btn_common_uparrow1.svg'"
                                            @click="$set(store, 'isOpen', !store.isOpen)"
                                        />
                                    </view>
                                </view>
                                <view class="cell_tip" v-else></view>
                            </view>

                            <contactBtnGroup
                                v-if="orderProductList.length > 1"
                                :orderDetailVO="allData"
                                :childOrderVO="store"
                                style="margin-top: 10rpx;padding-bottom: 0;"
                            />
                        </view>
                    </view>
            </view>

            <!-- 订单价格信息 -->
            <view class="store_price_info">
                <view class="yt_list_cell">
                    <view class="cell_tit">
                        <!-- <text v-if="allData.payState == 0">待支付金额</text> -->
                        <!-- <text v-if="allData.payState == 1">实付金额</text> -->
                        <text>实付金额</text>
                    </view>
                    <view class="cell_tip actual_payment_price num-font">
                        <text class="unit">¥</text>
                        <text>{{$getPartNumber(allData.orderAmount,'int')}}</text>
                        <text>{{$getPartNumber(allData.orderAmount,'decimal')}}</text>
                    </view>
                </view>
                <view class="yt_list_cell">
                    <view class="cell_tit clamp">订单编号</view>
                    <view class="cell_tip orderSn">
                        <text>{{ allData.orderSn }}</text>
                        <text class="copytextbut" @click="copyStr(allData.orderSn)">复制</text>
                    </view>
                </view>
                <!-- 可收起区域 -->
                <view v-show="showMore">
                    <view class="yt_list_cell">
                        <view class="cell_tit">
                            <text>商品金额</text>
                        </view>
                        <view class="cell_tip bold num-font">
                            <text class="unit">¥{{$getPartNumber(allData.goodsAmount,'int')}}{{$getPartNumber(allData.goodsAmount,'decimal')}}</text>
                        </view>
                    </view>
                    <view class="yt_list_cell" v-if="allData.fullDiscountAmount">
                        <text class="cell_tit">立减</text>
                        <text class="cell_tip bold num-font">-¥{{allData.fullDiscountAmount}}</text>
                    </view>
                    <view class="yt_list_cell">
                        <text class="cell_tit">优惠券</text>
                        <text class="cell_tip bold num-font">-¥{{allData.totalCouponDiscount}}</text>
                    </view>
                    <view class="yt_list_cell">
                        <text class="cell_tit">红包</text>
                        <text class="cell_tip bold num-font">-¥{{allData.redpacketAmount || 0}}</text>
                    </view>
                    <view class="yt_list_cell" >
                        <text class="cell_tit">云豆抵现</text>
                        <text class="cell_tip bold num-font">-¥{{allData.integralCashAmount}}</text>
                    </view>
                    <view class="yt_list_cell">
                        <text class="cell_tit">运费券</text>
                        <text class="cell_tip bold num-font">-¥{{allData.freightCashAmount || 0}}</text>
                    </view>
                    <view class="yt_list_cell">
                        <text class="cell_tit">运费总额</text>
                        <text class="cell_tip">
                            <text v-if="allData.totalExpress" class="num-font" :style="{'font-weight':'bold'}">{{'+¥' + $getPartNumber(allData.totalExpress,'int') + $getPartNumber(allData.totalExpress,'decimal')}}</text>
                            <text v-else>{{$L('免运费')}}</text>
                        </text>
                    </view>
                    <view class="info_line"></view>
                    <view class="yt_list_cell">
                        <text class="cell_tit">发票</text>
                        <text class="cell_tip" v-if="allData && allData.invoice && allData.invoice.invoiceTitle">
                            {{ allData.invoice.invoiceTitle }}
                        </text>
                        <text class="cell_tip" v-else>--</text>
                    </view>
                    <view class="yt_list_cell">
                        <text class="cell_tit">收票人手机</text>
                        <text class="cell_tip" v-if="allData && allData.invoice && allData.invoice.receiverMobile">
                            {{ allData.invoice.receiverMobile | formateTel }}
                        </text>
                        <text class="cell_tip" v-else>--</text>
                    </view>
                    <view class="yt_list_cell">
                        <text class="cell_tit">收票人邮箱</text>
                        <text class="cell_tip" v-if="allData && allData.invoice && allData.invoice.receiverEmail">
                            {{ allData.invoice.receiverEmail }}
                        </text>
                        <text class="cell_tip" v-else>--</text>
                    </view>
                    <view class="yt_list_cell">
                        <text class="cell_tit">订单类型</text>
                        <text class="cell_tip">{{ allData.orderTypeValue }}订单</text>
                    </view>
                    <view class="yt_list_cell" v-if="allData.orderState >= 20 && allData.orderAmount+allData.integralCashAmount>0">
                        <text class="cell_tit">支付方式</text>
                        <text class="cell_tip">{{ allData.orderAmount>0?allData.paymentName:'' }}</text>
                    </view>
                    <block v-if="orderLogs && orderLogs.length > 0">
                        <view class="yt_list_cell" v-for="(item,index) in orderLogs" :key="index">
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
                        :src="imgUrl + 'common/icon/btn_common_downarrow5.svg'"
                    />
                </view>
            </view>

            <contactBtnGroup
                v-if="orderProductList.length === 1"
                :orderDetailVO="allData"
                :childOrderVO="orderProductList[0]"
                showTitle
                style="margin-bottom: 60rpx;"
            />
        </view>

        <!-- <view class="go_pay fontScaleIgnore" @click="goEvaluate()" v-if="allData.orderState == 40 && allData.evaluateState!=3">评价</view> --><!--2022/8/22屏蔽评价功能-->
        <view
            class="order_det_bottom"
            v-if="(allData.orderState == 10||allData.orderState == 20||allData.orderState == 30||allData.orderState == 40||allData.orderState == 0||allData.orderState == 50)"
        >
            <BtnGroup
                :btnTypes="orderDetailEnum(allData)"
                :info="allData"
                :otherProps="{
                    isGift: isGift,
                    showReInvoiceBtn: showReInvoiceBtn,
                    ladderGroupDisplayStatus: ladderGroupDisplayStatus,
                    showViewInvoiceBtn: showViewInvoiceBtn
                }"
                @orderEvents="orderEvents"
            />
        </view>
        <!-- 详情底部操作按钮 end-->

        <!-- 取消订单选择原因弹框 -->
        <bottomPopup ref="cancelPopup" type="bottom" height="auto" text="取消原因">
            <view class="cancel_popup">
                <view class="popup_tips">
                    <text>请选择取消订单的原因 (必选) :</text>
                </view>
                <scroll-view class="uni-list cancel_list" scroll-y="true">
                    <radio-group @change="radioChange">
                        <label class="cancle_pre" v-for="(item,index) in cancelList" :key="index">
                            <radio :value="item.value" :checked="item.value === current" color="#fc1c1c"
                                style="transform:scale(0.8);margin-right:0;" />
                            <text class="textcontent">{{item.content}}</text>
                        </label>
                    </radio-group>
                </scroll-view>
                <view class="cancle_tips">
                    <view class="tips_bg">
                        确定取消后，将本单商品放回购物车中
                        <switch :checked="isAddCart" @change="switchChange" color="#f30300"/>
                    </view>
                </view>
                <view class="cancel_popup_btn">
                    <text class="" @click="notCancel()">暂不取消</text>
                    <text class="" @click="confirmCancel()">确定取消</text>
                </view>
            </view>
        </bottomPopup>

        <!-- 预售，阶梯团定金取消订单提示 -->
        <uni-popup ref="popup" type="dialog">
            <uni-popup-dialog type="input" title ="提示" content="取消该订单定金不予退还,确定取消?" :duration="2000"  @close="acDialog(false)" @confirm="acDialog(true)"></uni-popup-dialog>
        </uni-popup>

        <!-- 如果发票存在多个发票的时候显示发票列表的弹窗 -->
        <uni-popup ref="invoicePopup" type="bottom" :prevent="false">
            <view class="view_invoice_list">
                <view @click="previemInvoice(item)" v-for="(item, index) in invoiceUrls" :key="index" class="item">发票{{toChinesNumFun(++index)}}</view>
            </view>
        </uni-popup>

        <!-- 预览发票pdf -->
        <template v-if="pdfUrl">
            <viewInvoice :pdfUrl="pdfUrl"/>
        </template>
        <!-- 商品全部，部分无货弹窗 start-->
        <view id="store_no_good" v-if="store_show_no_good">
            <view class="content">
                <view class="content_title">
                    <text> {{"以下主商品无货,加入购物车失败"}}</text>
                    <image @tap="hide_good_dialog" :src="imgUrl+'common/icon/store_no_good_cancel.png'" mode=""></image>
                </view>
                <view class="good_list">
                    <view v-for="(item,index) in no_good_info" :key='index' class="good_item">
                        <image :src="item.mainImage" mode=""></image>
                        <view class="good_info">
                            <view class="good_name">
                                {{item.skuName}}
                            </view>
                            <text class="num">*{{item.number}}</text>
                        </view>
                    </view>

                </view>
                <view class="part_no_goods_another">
                    <view class="btn tocart" @click="toCart">去购物车</view>
                    <view class="btn return" @click="hide_good_dialog">返回订单详情</view>
                </view>
            </view>
        </view>
        <!-- 商品全部，部分无货弹窗 end-->
    </scroll-view>

</template>
<script>
import {
    mapState, mapMutations
} from 'vuex';
import {toChinesNum,copyText} from '@/utils/common';
import cartHandler from "@/components/cart/handler";
// import recommendGoods from "@/components/goods/recommend.vue";
import viewInvoice from "@/components/invoice/view";
import ContactBtnGroup from "@/components/gift/detail/contactBtnGroup.vue";
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
import bottomPopup from '@/components/bottom-popup/index.vue'
import mixin from '@/common/mixin/orderMixin' //订单混入
import sobot from '@/common/mixin/sobotOut' //智齿客服
import config from '@/common/lib/config'
import orderHandler from '@/components/order/handler';
import BtnGroup from "@/components/button/btnGroup.vue";
import { orderDetailEnum } from "@/components/button/enum/order.js";
import customerService from '@/common/lib/customer-service';
// import {polyfill} from '@/utils/common.js'
// #ifdef H5
const MASKING_TYPE = SnUtils.DataMasking.MASKING_TYPE;
const maskingText = SnUtils.DataMasking.maskingText;
// #endif
const ISDECORATE = config.ISDECORATE;
let startY = 0,
    moveY = 0,
    pageAtTop = true;
export default {
    mixins:[mixin, sobot],
    components: {
        // recommendGoods,
        uniPopup,
        uniPopupDialog,
        viewInvoice,
        bottomPopup,
        BtnGroup,
        ContactBtnGroup
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            orderDetailEnum,
            coverTransform: 'translateY(0px)',
            coverTransition: '0s',
            moving: false,
            orderSn: '', //订单号
            orderSource:'',//订单来源
            parentSn: '',
            allData: {}, //订单详细信息
            orderProductList: [], //订单商品列表,
            isGift:false,//判断单个商品是否是赠品或附件
            curOrderStore:{},//当前的店铺
            cancelList: [], //取消原因列表
            current: '0', //取消原因当前点击的是第0项
            cancelReason:'',//取消原因
            stateTime: '', //等待买家付款的剩余时间
            isShow: false,
            orderLogs: [], //订单日志
            productPromiseCalendars:[],//配送日历
            secInterval: '', //定时器
            ladderInfo: [],//阶梯团信息
            presaleInfo: [],//定金预售信息
            ladderGroupDisplayStatus:true, //立即支付按钮显示状态(此变量只在阶梯团商品下起作用)
            pdfUrl:"",
            defaultImage:'./static/shared/order/icon_mall_liwu.png',
            no_good_info:[],
            store_show_no_good:false,
            isAddCart: true, //取消订单的时候 是否加入购物车
            cancleOrderInfo: {}, //要取消订单的该订单的订单详情 目前的用处是取消订单的时候 有加入购物车的功能
            showMore: false
        }
    },
    async mounted(){
        //订单号
        this.orderSn = this.$Route.query.orderSn;
    },
    async onLoad() {
        //订单号
        // this.orderSn = this.$Route.query.orderSn;
    },
    onShow() {
        this.orderSn = this.$Route.query.orderSn;
        this.getOrderDetail();
    },
    onUnload() {
        if (this.secInterval) {
            clearInterval(this.secInterval)
        }
    },
    filters:{
        //脱敏手机号
        formateTel(value){
            try {
                value = ISDECORATE?maskingText(MASKING_TYPE.TEL,value):value;
            } catch (error) {
                
            }
            return value;
        }
    },
    computed: {
        ...mapState(['hasLogin', 'userInfo', 'userCenterData']),
        showViewInvoiceBtn(){
            return !!this.allData.invoiceApplyInfo && !!this.allData.invoiceApplyInfo.invoiceUrls && this.allData.invoiceApplyInfo.invoiceUrls.length > 0;
        },
        // 开出来的发票数
        invoiceUrls(){
            if (this.showViewInvoiceBtn){
                return this.allData.invoiceApplyInfo.invoiceUrls;
            }
            return [];
                
        },
        isIOS(){
            return SnUtils.getNavigatorType() == 'ios';
        },
            
        // 是否显示换开发票的按钮 true=显示 false=不显示
        showReInvoiceBtn(){
            return !!this.allData.invoiceApplyInfo && !!this.allData.invoiceApplyInfo.invoiceState && this.allData.invoiceApplyInfo.invoiceState == 'INVOICED'
        }
    },
    methods: {
        ...mapMutations(['saveChatBaseInfo', 'addGoods']),
        orderEvents(params) {
            switch (params.type) {
            case 'cancelOrder': // 取消订单
                this.cancelPopup()
                break;

            case 'confirmOrder': // 确认收货
                this.confirmReceipt()
                break;

            case 'delOrder': // 删除订单
                this.delOrder()
                break;


            case 'buyAgain': // 再次购买
                this.orderAgain()
                break;

            case 'viewInvoice': // 再次购买
                this.viewInvoice()
                break;
                
            default:
                break;
            }
        },

        // 将阿拉伯数字改为汉字
        toChinesNumFun(string){
            return toChinesNum(string)
        },

        /**
             * 统一跳转接口,拦截未登录路由
             * navigator标签现在默认没有转场动画，所以用view
             */
        navTo(url) {
            if (!this.hasLogin) {
                url = '/pages/public/login';
            }
            this.$Router.push(url)
        },

        // 取消订单的时候，加入购物车切换switch的回调
        switchChange: function (e) {
            this.isAddCart = e.target.value
        },

        /**
             *  会员卡下拉和回弹
             *  1.关闭bounce避免ios端下拉冲突
             *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
             *    transition设置0.1秒延迟，让css来过渡这段空窗期
             *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
             */
        coverTouchstart(e) {
            if (pageAtTop === false) {
                return;
            }
            this.coverTransition = 'transform .1s linear';
            startY = e.touches[0].clientY;
        },
        coverTouchmove(e) {
            moveY = e.touches[0].clientY;
            let moveDistance = moveY - startY;
            if (moveDistance < 0) {
                this.moving = false;
                return;
            }
            this.moving = true;
            if (moveDistance >= 80 && moveDistance < 100) {
                moveDistance = 80;
            }

            if (moveDistance > 0 && moveDistance <= 80) {
                this.coverTransform = `translateY(${moveDistance}px)`;
            }
        },
        coverTouchend() {
            if (this.moving === false) {
                return;
            }
            this.moving = false;
            this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
            this.coverTransform = 'translateY(0px)';
        },
        //获取订单详情信息
        getOrderDetail() {
            uni.showLoading();
            let that = this;
            let param = {};
            param.orderSn = that.orderSn;
            orderHandler.getOrderDetail(param).then(async res => {
                uni.hideLoading();
                if (res.state == 200) {
                    // 获取可售后性
                    // let serviceCheckList = await this.getAfsServiceCheck()
                    this.getAfsServiceCheck()
                    let result = res.data;
                    // 根据 orderProductId 组装每个商品的可售性
                    // result.childOrdersVOS.forEach(element=>{
                    //     element.orderProductListVOList.forEach(item=>{
                    //         item.serviceList = serviceCheckList.find(e=>e.orderProductId == item.orderProductId)
                    //     })
                    // });
                    this.orderSource = result.orderSource
                    that.orderProductList = result.childOrdersVOS;
                    that.orderLogs = result.orderLogs.reverse();
                    that.productPromiseCalendars = result.childOrdersVOS[0].productPromiseCalendars
                    that.allData = result || {};
                    that.isShow = true;
                    that.parentSn = res.data.parentSn

                    let productList = []
                    result.childOrdersVOS.forEach(element => {
                        element.orderProductListVOList.forEach(item => {
                            productList.push(item)
                        })
                    });
                        
                    if (productList[0]&&productList[0].isGift!=0&&result.totalMoney==0){ that.isGift = true }
                    if (result.orderType == 105) {
                        //阶梯团信息
                        let ladderInfo = result.ladderGroupDetailInfo;//阶梯团信息
                        let tmpData = [];
                        tmpData.push({
                            key: 0,
                            title: '阶段1：等待买家付款',
                            goods_left: '商品定金',
                            goods_right: ladderInfo.advanceDeposit,
                            need_pay_left: '定金需付款',
                            need_pay_right: ladderInfo.needAdvanceDeposit,
                            is_cur: 0
                        });
                        if (ladderInfo.orderSubState == 101) {
                            tmpData[0].is_cur = 1;
                            this.countDownBySecond(result.remainTime,result);
                        } else if (ladderInfo.orderSubState > 101) {
                            tmpData[0].title = '阶段1：已完成';
                            tmpData.push({
                                key: 1,
                                title: ladderInfo.orderSubState == 102 ? '阶段2：等待买家付款' : '阶段2：已完成',
                                goods_left: '商品尾款',
                                goods_right: ladderInfo.remainAmount,
                                need_pay_left: '尾款需付款',
                                need_pay_right: ladderInfo.needRemainAmount,
                                is_cur: ladderInfo.orderSubState == 102 ? 1 : 0
                            });
                            if (ladderInfo.orderSubState == 102 && ladderInfo.depositRemainTime > 0) {
                                tmpData[1].title = '尾款生成中';
                                tmpData[1].goods_right = '--';
                                tmpData[1].need_pay_right = '--';
                                this.countDownBySecond(ladderInfo.depositRemainTime+60);
                            } else {
                                this.countDownBySecond(ladderInfo.remainEndTime);
                            }
                        }
                        this.ladderInfo = tmpData;
                    } else if (result.orderType == 103 && result.presellInfo.isAllPay == 0) {
                        //定金预售信息
                        let presaleInfo = result.presellInfo;//定金预售信息
                       
                        let tmpData = [];
                        tmpData.push({
                            key: 0,
                            title: '阶段1：等待买家付款',
                            goods_left: '商品定金',
                            goods_right: presaleInfo.depositAmount,
                            goods_expand_left: '定金膨胀',
                            goods_expand_right: presaleInfo.firstExpand,
                            need_pay_left: '定金需付款',
                            need_pay_right: presaleInfo.needDepositAmount,
                            is_cur: 0
                        });
                        if (presaleInfo.orderSubState == 101) {
                            tmpData[0].is_cur = 1;
                            this.countDownBySecond(result.remainTime);
                            tmpData.push({
                                key: 1,
                                title: '阶段2：未开始',
                                goods_left: '商品尾款',
                                goods_right: presaleInfo.remainAmount,
                                need_pay_left: '尾款需付款',
                                need_pay_right: presaleInfo.needRemainAmount,
                                is_cur: 0
                            });
                        } else if (presaleInfo.orderSubState > 101) {
                            tmpData[0].title = '阶段1：已完成';
                            let curTitle = '';
                            if (presaleInfo.orderSubState == 102) {
                                if (presaleInfo.isStartRemainPay) {
                                    this.countDownBySecond(presaleInfo.remainEndTime);
                                    curTitle = '阶段2：等待买家付款';
                                } else {
                                    this.stateTime = '';//清空倒计时
                                    curTitle = '阶段2：' + presaleInfo.remainStartTime + '开始付尾款';
                                }
                            } else {
                                curTitle = '阶段2：已完成';
                            }
                            tmpData.push({
                                key: 1,
                                title: curTitle,
                                goods_left: '商品尾款',
                                goods_right: presaleInfo.remainAmount,
                                need_pay_left: '尾款需付款',
                                need_pay_right: presaleInfo.needRemainAmount,
                                is_cur: presaleInfo.orderSubState == 102 ? 1 : 0
                            });
                        }
                        this.presaleInfo = tmpData;
                    } else if (result.orderType == 104&&result.orderState == 10){
                        if (result.remainTime>0){
                            this.countDownBySecond(result.remainTime,result)
                        } else if (!this.allData.refuseReason){
                            this.allData.orderState = 0
                            this.allData.orderStateValue = '交易关闭'
                            this.allData.refuseReason="支付超时系统自动取消秒杀订单"
                        }
                    } else if (result.orderType == 106 && result.orderState == 10){ 
                        if (result.remainTime > 0){
                            this.countDownBySecond(result.remainTime,result)
                        } else if (!this.allData.refuseReason){
                            this.allData.orderState = 0
                            this.allData.orderStateValue = '交易关闭'
                            this.allData.refuseReason="支付超时系统自动取消一起买订单"
                        }                        
                    } else if (result.orderType == 107 && result.orderState == 10){ // 天天专场活动待支付倒计时
                        if (result.remainTime > 0){
                            this.countDownBySecond(result.remainTime, result)
                        } else if (!this.allData.refuseReason){
                            this.allData.orderState = 0
                            this.allData.orderStateValue = '交易关闭'
                            this.allData.refuseReason="支付超时系统自动取消订单"
                        }         
                    } else {
                        that.countup(result.orderType == 1 ? result.remainTime*1000 : 86400000);//86400000是1天的
                    }
                } else {
                    this.$api.msg(res.msg);
                }
            })
        },

        // 可售后性列表 ,服务端拆服务了 ,售后和订单接口做了解耦
        getAfsServiceCheck(){
            return new Promise((resolve) => {
                let param = {};
                param.url = 'v3/postsale/front/after/sale/apply/afsServiceCheck';
                param.data = {};
                param.data.orderSn = this.orderSn;
                this.$request(param).then(res=>{
                    if (res.state==200){
                        // 根据 orderProductId 组装每个商品的可售性
                        this.setServiceList(res.data)
                        resolve(res.data)
                    } else {
                        (this.$Route.path == '/pages/order/detail') && this.$api.msg(res.msg);
                        this.setServiceList([])
                        resolve([])
                    }
                }).catch(() => {
                    this.setServiceList([])
                    resolve([])
                })
            })
        },
        setServiceList(data){
            this.orderProductList.forEach((element) => {
                element.orderProductListVOList.forEach(item => {
                    let serviceList = data.find(e=>e.orderProductId == item.orderProductId)
                    this.$set(item,'serviceList',serviceList)
                })
            });
            // this.$forceUpdate()
        },

        //计算时间差
        countup(remainTime) {
            let that = this;
            if (that.allData.orderState == 10) { //等待买家付款 ，24小时过期
                let endTimeStamp = new Date().getTime() + remainTime; //结束时间时间戳   
                that.countDown(endTimeStamp);
            } else if (that.allData.orderState == 30) { //等待买家收货
                let endTime = that.allData.autoReceiveTime; //结束时间时间戳
                let endStrs = endTime.split(" ");
                let endTimeStamp = that.strtotime(endStrs[0], endStrs[1]); //开始时间时间戳(毫秒)
                that.countDown(endTimeStamp);
            }
        },

        //倒计时(参数为：剩余秒数)
        countDownBySecond(second,goodsInfo) {
            let that = this;
            //创建定时器前先清除定时器
            clearInterval(that.secInterval);
            let diffrentTimeStamp = second * 1000;
            that.secInterval = setInterval(() => {
                if (diffrentTimeStamp <= 0) {
                    that.stateTime = '';
                    clearInterval(that.secInterval);
                    if (!(goodsInfo && goodsInfo.orderType === 105 && goodsInfo.orderSubState === 101)|| goodsInfo.orderType === 102){
                        //非 商品为阶梯团&&定金未付款 情况下才会重新请求商品详情
                        that.getOrderDetail();
                    } else {
                        //阶梯团&&定金未付款商品 倒计时结束后主动隐藏支付按钮
                        that.ladderGroupDisplayStatus=false;
                    }
                } else if (diffrentTimeStamp > 0) {
                    //将时间戳转换为天，时，分，秒 并倒计时
                    that.stateTime = that.formatDuring(diffrentTimeStamp)
                } else {
                    that.stateTime = ''
                }
                diffrentTimeStamp -= 1000; //相差时间 毫秒数
            }, 1000)
        },

        //倒计时
        countDown(endTimeStamp) {
            let that = this;
            //创建定时器前先清除定时器
            clearInterval(that.secInterval);
            that.secInterval = setInterval(() => {
                let currentTimestamp = new Date().getTime(); //当前时间时间戳 （毫秒数）
                let diffrentTimeStamp = endTimeStamp - currentTimestamp; //相差时间 毫秒数
                if (diffrentTimeStamp == 0) {
                    that.stateTime = '';
                    clearInterval(that.secInterval);
                    that.getOrderDetail();
                } else if (diffrentTimeStamp > 0) {
                    //将时间戳转换为天，时，分，秒 并倒计时
                    that.stateTime = that.formatDuring(diffrentTimeStamp)
                } else {
                    that.stateTime = ''
                }
            }, 1000)
        },
        //将标准格式（2014-08-02 11:23:12）转化为时间戳  函数   参数：time_str为（2014-08-02）   fix_time为（11:23:12）
        strtotime(time_str, fix_time) {
            let time = (new Date()).getTime();
            if (time_str) {
                let str = time_str.split('-');
                if (3 === str.length) {
                    let year = str[0] - 0;
                    let month = str[1] - 0 - 1;
                    var day = str[2] - 0;
                    if (fix_time) {
                        let fix = fix_time.split(':');
                        if (3 === fix.length) {
                            let hour = fix[0] - 0;
                            let minute = fix[1] - 0;
                            time = (new Date(year, month, day, hour, minute)).getTime();
                        }
                    } else {
                        time = (new Date(year, month, day)).getTime();
                    }
                }
            }
            return time;
        },
        //将时间戳转换为时分秒
        formatDuring(mss) {
                
            let days = parseInt(mss / (1000 * 60 * 60 * 24));
            let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            let seconds = ((mss % (1000 * 60)) / 1000).toFixed(0);
            if (days > 0) {
                return days + " 天 " + hours + " 小时 " + minutes + " 分钟 ";
            } else if (hours > 0) {
                return hours + " 小时 " + minutes + " 分钟 ";
            } else if (minutes >= 1) {
                return minutes + " 分钟 ";
            } //如果剩 1分钟之内就不让显示
            return seconds+'秒'
                
        },
        //获取推荐商品
        getData() {
            // this.$refs.recomment_goods.getMoreData();
        },

        //打开取消订单弹框
        cancelPopup() {
            if ((this.allData.orderType==105&&!this.allData.ladderGroupDetailInfo.isRefundDeposit)||this.allData.orderType==103){
                this.$refs.popup.open()
            } else {
                this.$refs.cancelPopup.open();
                this.getCancelList();
            }
                
        },
            
        // 预售,阶梯团的提示确认
        acDialog(type){
            if (type==true){
                this.$refs.popup.close()
                this.$refs.cancelPopup.open();
                this.getCancelList();
            } else {
                this.$refs.popup.close()
            }
        },
            
        //获取取消订单原因列表
        getCancelList() {
            let param = {};
            param.url = 'v3/system/front/reason/list';
            param.method = 'GET';
            param.data = {};
            param.data.type = 104;
            this.$request(param).then(res => {
                if (res.state == 200) {
                    this.cancelList = res.data || [];
                    this.cancelList && this.cancelList.map((item, index) => item.value = '' + index);
                    this.cancelReason = this.cancelList[0].content;
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        },
        //取消原因单选框切换
        radioChange(e) {
            for (let i = 0; i < this.cancelList.length; i++) {
                if (this.cancelList[i].value === e.target.value) {
                    this.cancelReason = this.cancelList[i].content;
                    break;
                }
            }
        },
        //暂不取消订单
        notCancel() {
            this.$refs.cancelPopup.close();
        },
        //确定取消订单
        confirmCancel() {
            let that = this;
            uni.showModal({
                title: '提示',
                content: '确定取消该订单?',
                success: function (modalres) {
                    if (modalres.confirm) {
                        let param = {};
                        param.orderSn = that.allData.orderState==10?that.parentSn:that.allData.orderSn;
                        param.cancelReason = that.cancelReason;
                        orderHandler.cancel(param).then(res => {
                            if (res.state == 200) {
                                that.$api.msg(res.msg);
                                //订单取消成功过之后，如果勾选了加入购物车按钮，此时需要调取加入购物车的功能，此时的功能和再次购买的功能是一致的，因为再次购买 目前也是加入购物车
                                try {
                                    if (!!that.isAddCart){
                                        that.orderAgain('cancleOrder')
                                    }
                                } catch (error) {
                                    console.log(error)
                                }
                                if(that.allData.orderState == 20){
                                    that.getCancelResult()
                                }else{
                                    uni.showLoading({
                                        title: '取消成功',
                                        icon:'none'
                                    })
                                    that.$refs.cancelPopup.close();
                                    that.goRefresh();
                                    setTimeout(()=>{
                                        uni.hideLoading()
                                    },3000)
                                }
                            } else if (res.state == 1002){ //取消订单失败
                                uni.showModal({
                                    title: '取消失败',
                                    content: '您可联系客服处理。',
                                    confirmText: '联系客服',
                                    cancelText: '返回',
                                    success: async result => {
                                        if (result.confirm) {
                                            that.goRefresh();
                                            that.$refs.cancelPopup.close();
                                            let kefuUrl = await customerService.run(1).catch(e => {
                                                console.log(e)
                                            });
                                            window.open(kefuUrl)
                                        } else {
                                        //关闭弹框
                                            that.$refs.cancelPopup.close();
                                            that.goRefresh();
                                        }
                                    }
                                })
                                uni.hideLoading();
                            } else {
                                that.$api.msg(res.msg);
                            }
                        }).catch(() => {
                            //异常处理
                        })
                    } else if (modalres.cancel) {
                        that.$refs.cancelPopup.close();
                    }
                }
            })
        },
        //获取订单取消结果
        getCancelResult(){
            let params = {}
            params.orderSn = this.allData.orderState==10?this.parentSn:this.allData.orderSn
            orderHandler.cancelOrderResult(params).then(res => {
                if(res.state == 200){
                    this.flag = true
                    uni.hideLoading()
                    if(!res.data.cancelFlag){
                        if(this.num<10){
                            uni.showLoading({
                                title: '取消中...',
                                icon:'none'
                            })
                            clearInterval(this.loadingTimer);
                            this.loadingTimer = setInterval(()=>{
                                this.num++
                                this.getCancelResult()
                            },1000)
                        }else{
                            uni.hideLoading()
                            uni.showModal({
                                title: '取消失败',
                                content: '您可联系客服处理。',
                                confirmText: '联系客服',
                                cancelText: '返回',
                                success: async result => {
                                    if (result.confirm) {
                                        this.goRefresh();
                                        this.$refs.cancelPopup.close();
                                        let kefuUrl = await customerService.run(1).catch(e => {
                                            console.log(e)
                                        });
                                        window.open(kefuUrl)
                                    } else {
                                        //关闭弹框
                                        this.goRefresh();
                                        this.$refs.cancelPopup.close();
                                    }
                                }
                            })
                            clearInterval(this.loadingTimer);
                            this.loadingTimer = null;
                        }
                    }else{
                        if(this.loadingTimer){
                            clearInterval(this.loadingTimer);
                            this.loadingTimer = null;
                        }
                        uni.hideLoading()
                        uni.showModal({
                            title: '取消成功',
                            content: '相关款项将在1-2个工作日内退回原支付账户。',
                            confirmText: '我知道了',
                            showCancel:false,
                            success: result => {
                                if (result.confirm) {
                                    this.goRefresh();
                                    this.$refs.cancelPopup.close();
                                } else {
                                    //关闭弹框
                                }
                            }
                        })
                    }
                }else{
                    uni.showModal({
                        title: '取消失败',
                        content: '您可联系客服处理。',
                        confirmText: '联系客服',
                        cancelText: '返回',
                        success:async result => {
                            if (result.confirm) {
                                this.goRefresh();
                                this.$refs.cancelPopup.close();
                                let kefuUrl = await customerService.run(1).catch(e => {
                                    console.log(e)
                                });
                                window.open(kefuUrl)
                            } else {
                                //关闭弹框
                                this.goRefresh();
                                this.$refs.cancelPopup.close();
                            }
                        }
                    })
                }                     
            })
        },
        //修改地址
        editAddress() {
            this.$Router.push({path:'/pages/address/list',query:{source:3,orderSn:this.orderSn}})
        },
        //查看退款详情  换货详情
        lookRefundDetail(afsSn, afsButton) {
            if (afsButton == 403 || afsButton == 404) { //可查看换货详情
                let sourceType = 'exchange';
                this.$Router.push({path:'/views/order/aftersale/detail',query:{afsSn,sourceType}})
            } else {
                let sourceType = '';
                this.$Router.push({path:'/views/order/aftersale/detail',query:{afsSn,sourceType,orderState:this.allData.orderState}})
            }

        },
        //选择服务
        selectService(orderSn, orderProductId,serviceList) {
            if (serviceList && serviceList.num != 0 && serviceList.afterSaleTypes.length != 0){
                // todo
            } else {
                this.$api.msg('该商品无法售后!');
                return false;
            }
            let param = {};
            param.url = 'v3/postsale/front/after/sale/apply/applyInfo';
            param.method = 'GET';
            param.data = {};
            param.data.orderSn = orderSn; //订单号
            param.data.orderProductId = orderProductId; //订单明细id
            this.$request(param).then(res => {
                if (res.state == 200) {
                    // 现在改为统一跳转到选择服务页面
                    const len = this.orderProductList[0].orderProductListVOList.filter((item)=>{ return item.productType==0 }).length;
                    this.$Router.push({path:'/views/order/aftersale/index',query:{orderSn,orderProductId,sourceType:'orderDetail',orderListLen:len}});
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        },
            
        //查看发票
        viewInvoice() {
            if (this.invoiceUrls.length > 1){ //说明有多张发票
                // 此时显示多张发票的弹窗
                this.$refs.invoicePopup.open();
            } else { //此时说明只有一张发票
                this.previemInvoice(this.invoiceUrls[0]);
            }
        },


        previemInvoice(path){
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

        //更新当前页面方法
        goRefresh() {
            let pages = getCurrentPages();
            let currPage = pages[pages.length - 1]; //当前页面
            let beforePage = pages[pages.length - 2]; //上一页
            currPage.$vm.getOrderDetail(); //更新当前页面数据
            beforePage.$vm?.loadData(); //更新上一页数据
        },
        //删除订单
        delOrder() {
            let that = this;
            uni.showModal({
                title: '提示',
                content: '确定删除该订单?',
                success: function (modalres) {
                    if (modalres.confirm) {
                        let param = {};
                        param.orderSn = that.orderSn;
                        orderHandler.delete(param).then(res => {
                            if (res.state == 200) {
                                that.$api.msg(res.msg);
                                that.appBackFun();
                                that.goRefresh();
                                //使用全局mixin提供的返回方法
                            } else {
                                that.$api.msg(res.msg);
                            }
                        }).catch(() => {
                            //异常处理
                        })
                    } else if (modalres.cancel) {

                    }
                }
            })
        },
        //确认收货
        confirmReceipt() {
            let that = this;
            uni.showModal({
                title: '确认货收到了吗？',
                content: '为了保证你的售后权益,请收到商品确认无误后再确认收货',
                success: function (modalres) {
                    if (modalres.confirm) {
                        let param = {};
                        param.orderSn = that.orderSn;
                        orderHandler.receive(param).then(res => {
                            if (res.state == 200) {
                                that.$api.msg(res.msg);
                                that.goRefresh();
                                setTimeout(() => {
                                    that.$Router.push({path:'/views/order/detail/success',query:{orderSn:that.orderSn,sourceType:'orderDetail'}})
                                }, 1000)
                            } else {
                                that.$api.msg(res.msg);
                            }
                        }).catch(() => {
                            //异常处理
                        })
                    }
                }
            })
        },
        //去商品详情页
        goProductDetail(sku, spu,productType) {
            if (productType==0){
                this.$Router.push({path:'/standard/product/detail',query:{sku,spu}})
            }
        },
        //去评价页面
        goEvaluate() {
            this.$Router.push({path:'/views/order/evaluation/publish',query:{orderSn:this.orderSn}})
        },
        /**
             * 再次购买 订单级别的 也就是再次加入购物车
             */
        orderAgain(type){
            let that = this;
                
            let goodsList = []//把订单里的商品移到一个数组中
            for (let i=0;i<that.orderProductList.length;i++){
                for (let j=0;j<that.orderProductList[i].orderProductListVOList.length;j++){
                    that.orderProductList[i].orderProductListVOList[j].number = that.orderProductList[i].orderProductListVOList[j].productNum
                    goodsList.push(that.orderProductList[i].orderProductListVOList[j])

                }
            }
            if (!!goodsList && goodsList.length > 0){
                let goodsFilter = goodsList.filter(item => { //目前只有主商品才能加入购物车 即productType为0的时候
                    return item.productType == 0;
                })
                if (goodsFilter[0]){
                    uni.showLoading()
                    that.addCart(goodsFilter, type)
                } else {
                    that.$api.msg("该商品暂不支持再次购买");
                }
            }
        },
            
        // 加入购物车
        addCart(list, type="orderAgagin"){
            if (this.hasLogin){ //登录
                let param = {
                    cartInfoList:list,
                    addressId: this.$getStorageSync('addressId')
                }
                cartHandler.addCarts(param).then(res=>{
                    uni.hideLoading();
                    if (res.state == 200){
                        this.$store.dispatch('getCartNum'); //更新购物车商品数量
                        if (type == 'orderAgagin'){ //再次预定的会跳转页面
                            list.forEach(e => {
                                const goodsItem = {
                                    sku: e.sku,
                                    goodsPic: e.mainImage,
                                    mainImage: e.mainImage,
                                    skuName: e.skuName,
                                    isChecked: 1,
                                    productPrice: e.productShowPrice,
                                    goodsPrice: e.productShowPrice,
                                    storeId: e.storeId,
                                    storeName: e.storeName
                                }
                                this.addGoods(goodsItem)
                            })
                            this.$Router.push({path:'/pages/cart/cart'})
                        }
                    } else if (res.state == 255){
                        this.$api.msg(res.msg);
                        let noGoodsList=JSON.parse(res.msg)
                        let noGoodsJson={}
                        noGoodsList.forEach(e =>{
                            noGoodsJson[e]=true
                        })
                            
                        if (noGoodsList&&noGoodsList[0]){
                            let noList = list.filter(item =>{
                                return noGoodsJson[item.sku]
                            })
                                
                            this.no_good_info = noList
                            this.store_show_no_good = true
                        } else {
                            uni.showToast({
                                title:res.msg,
                                icon:'none',
                                duration:700
                            })
                        }
                    } else {
                        uni.hideLoading();
                        uni.showToast({
                            title:"加入购物车失败",
                            icon:'none',
                            duration:700
                        })
                    }
                })
            } else {
                // uni.showToast({
                // title:"请登录",
                // icon:'none',
                // duration:700
                // })
            }
        },
        //跳转购物车
        toCart(){
            this.store_show_no_good = false;
            this.$Router.push({path:'/pages/cart/cart'})
        },
        // 隐藏商品无货弹窗
        hide_good_dialog() {
            this.store_show_no_good = false;
        },
        // 配送时间的字符串显示
        setdeliveryTimeStr(dataJson){ 
            let str="",timeStr=""
            if (!dataJson){
                str = "工作日、双休日与节假日均可送货"
                return str
            }
            let startDate = new Date(dataJson.dateStr.replace(/\-/g, '/'));
            let dateStr = startDate.format("MM月dd日");
            let weekday = ["周日","周一","周二","周三","周四","周五","周六"]
            let week = weekday[startDate.getDay()];
            dateStr = `${dateStr}(${week})`;
            if (!!dataJson.timeRangeList && dataJson.timeRangeList.length > 0){
                let timeArr = dataJson.timeRangeList.filter(item => {
                    return item.selected;
                })
                if (timeArr.length>=1 && !!timeArr[0].timeRange){
                    timeStr = `${timeArr[0].timeRange}`
                }
            }
            str = `${dateStr} ${timeStr}`;
                
            return str
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
<style lang='scss'>
    ::v-deep .uni-radio-input-checked,
    ::v-deep .uni-switch-input-checked {
        background-color: var(--radioCheckedColor) !important;
        border-color: var(--radioCheckedColor) !important;
    }

    page {
        background: $bg-color-split;
        width: 750rpx;
        margin: 0 auto;
    }
    .content{
        position: relative;
    }
    .container {
        display: flex;
        flex: 1;
        width: 100%;
        position: relative;
        background-color: #eff2f5;

        .main_content {
            width: 100%;
            min-height: calc(var(--status-bar-height) + 452rpx);
            padding: var(--status-bar-height) 20rpx 120rpx 20rpx;
            position: relative;
            .bg_red{
                position: absolute;
                background: var(--orderDetailBg);
                background-size: 100% 100%;
                left: 0;
                right: 0;
                top: 0;
                height: 452rpx;
            }

            .ladder_group {
                border-top: 10px solid #F5F5F5;
                width: 750rpx;
                background: #fff;

                .item {
                    margin-left: 20rpx;
                    width: 730rpx;
                    box-sizing: border-box;
                    padding-right: 20rpx;

                    &.split {
                        border-bottom: 1rpx solid #F2F2F2;
                    }

                    .title {
                        margin-top: 22rpx;

                        .right_split {
                            width: 5rpx;
                            height: 26rpx;
                            background: linear-gradient(360deg, #FC1D1C 0%, #FF7A18 100%);
                            border-radius: 3rpx;
                            margin-right: 18rpx;
                        }

                        .content {
                            color: #F10707;
                            font-size: 28rpx;
                        }
                    }

                    .goods_amount {
                        margin-top: 20rpx;
                        color: #666666;
                        font-size: 26rpx;
                        line-height: 30rpx;
                    }

                    .need_pay_amount {
                        margin-top: 20rpx;
                        color: #2D2D2D;
                        font-size: 26rpx;
                        line-height: 30rpx;
                        margin-bottom: 25rpx;

                        .cur {
                            color: #F10707;
                        }
                    }
                }
            }

            .order_state {
                position: relative;
                z-index: 100;
                box-sizing: border-box;
                width: 100%;
                margin-bottom: 19rpx;
                padding: 20rpx 12rpx 0 12rpx;

                .state_title {
                    font-size: 40rpx;
                    color: #222;
                    font-weight: 600;
                    
                    width: 100%;
                }

                .state_time {
                    font-size: 26rpx;
                    
                    font-weight: 500;
                    color: #666;
                    line-height: 32rpx;
                    margin-top: 10rpx;
                    padding-left: 2rpx;

                    text {
                        font-weight: 700;
                        color: var(--tagColor);
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

            .buyer_info {
                width: 710rpx;
                background: #FFFFFF;
                box-shadow: 1rpx 3rpx 30rpx 0rpx rgba(102, 102, 102, 0.1);
                border-radius: 20rpx;
                margin: 0 auto;
                display: flex;
                padding: 24rpx;
                position: relative;
                z-index: 100;
                box-sizing: border-box;

                .buyer_map {
                    width: 32rpx;
                    height: 32rpx;
                    margin-right: 12rpx;
                    margin-top: -2rpx;
                    background: url('@/static/shared/common/icon/weizhi333.svg') center no-repeat;
                    background-size: 100% 100%;
                }

                .info_det {
                    display: flex;
                    width: 100%;
                    justify-content: space-between;

                    .info_detail {
                        display: flex;
                        flex-direction: column;

                        .info_name {
                            display: flex;
                            align-items: center;
                            font-size: 30rpx;
                            
                            font-weight: 606;
                            color: #000;
                            line-height: 28rpx;

                            .buyer_phone {
                                margin-left: 20rpx;
                            }
                        }

                        .info_address {
                            width: 560rpx;
                            font-size: 26rpx;
                            
                            font-weight: 500;
                            color: #666;
                            line-height: 36rpx;
                            margin-top: 28rpx;
                            word-break: break-all;
                        }
                    }
                }
            }

            .order_goods {
                .store_item {
                    background-color: #fff;
                    border-radius: 20rpx;
                    padding: 28rpx 0;
                    margin: 20rpx 0;
                }

                .goods_pre {
                    display: flex;
                    padding: 0 32rpx;
                    box-sizing: border-box;
                    padding-bottom: 22rpx;
                    width: 100%;
                    flex-wrap:wrap;
                    .goods_image {
                        width: 200rpx;
                        height: 200rpx;
                        background: #F3F3F3;
                        border-radius: 14px;

                        image {
                            width: 200rpx;
                            height: 200rpx;
                            border-radius: 14rpx;
                        }
                    }
                        
                    .goods-img {
                        background-size: cover;
                        background-position: center center;
                        background-repeat: no-repeat;
                        width: 160rpx;
                        height: 160rpx;
                        overflow: hidden;
                        background-color: #F8F6F7;
                        border-radius: 14rpx;
                        flex-shrink: 0;
                        position: relative;
                        .no-goods{
                            position: absolute;
                            width: 124rpx;
                            height: 124rpx;
                            top:50%;
                            left:50%;
                            transform: translate(-50%,-50%);
                            background-image: url("@/static/shared/order/bg_soldout.png");
                            background-size: contain;
                        }
                    }

                    .goods_pre_right {
                        display: flex;
                        justify-content: space-between;
                        flex: 1;
                        .goods_des {
                            margin-left: 24rpx;
                            box-sizing: border-box;
                            width: 300rpx;

                            .goods_name {
                                height: 72rpx;
                                line-height: 36rpx;
                                font-size: 28rpx;
                                
                                font-weight: 600;
                                color: #222;
                                text-overflow: -o-ellipsis-lastline;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                line-clamp: 2;
                                -webkit-box-orient: vertical;
                                word-break: break-all;
                                white-space: pre-wrap;
                                width: 100%;
                            }

                            .goods_spec {
                                font-size: 24rpx;
                                
                                font-weight: 400;
                                color: #999;
                                line-height: 36rpx;
                                margin-top: 52rpx;
                                width: 100%;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        }
                            
                        .goods_num_give{
                            color: #2D2D2D;
                            font-size: 26rpx;
                            /* font-weight: bold; */
                        }

                        .goods_prices {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: flex-end;
                            flex: 1;
                            .goods_price {
                                text {
                                    display: inline-block;
                                    font-weight: bold;
                                    color: #222;
                                    line-height: 30rpx;
                                }

                                .unit {
                                    font-size: 24rpx;
                                }

                                .price_int {
                                    font-size: 32rpx;
                                }

                                .price_decimal {
                                    font-size: 24rpx;
                                }
                            }

                            .goods_num {
                                font-size: 28rpx;
                                font-weight: 600;
                                color: #222;
                                line-height: 30rpx;
                                margin-top: 8rpx;
                            }

                            .refund_btn {
                                padding: 12rpx 15rpx;
                                box-sizing: border-box;
                                border: 1rpx solid var(--tagColor);
                                border-radius: 25rpx;
                                font-size: 26rpx;
                                line-height: 26rpx;
                                
                                font-weight: 400;
                                color: var(--tagColor);
                                margin-top: 22rpx;
                            }

                            .refund_btn_disabled {
                                padding: 12rpx 15rpx;
                                box-sizing: border-box;
                                border: 1rpx solid #eeeeee;
                                border-radius: 25rpx;
                                font-size: 26rpx;
                                line-height: 26rpx;
                                
                                font-weight: 400;
                                color: #333333;
                                margin-top: 22rpx;
                            }
                        }
                        .justify{
                           justify-content: flex-start;
                        }
                    };

                    .store_remark{
                        width: 100%;
                        font-size: 26rpx;
                        
                        font-weight: 500;
                        display: flex;
                        text:nth-child(1) {
                            width: 120rpx;
                            color: #9A9A9A;
                            margin-right: 16rpx;
                        }

                        text:nth-child(2) {
                            flex: 1;
                            color: #343434;
                            word-break: break-all;
                        }
                    }
                }

                .store_info .order_remark {
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

                .store_name {
                    padding-left: 32rpx;
                    padding-bottom: 30rpx;
                    display: flex;
                    align-items: center;

                    image {
                        width: 34rpx;
                        height: 32rpx;
                    }

                    .store_name_text {
                        font-size: 32rpx;
                        color: #2d2d2d;
                        font-weight: bold;
                        margin-left: 10rpx;
                        flex: 1;
                        word-break: break-all;
                    }

                    .iconfont {
                        // width: 13rpx;
                        // height: 22rpx;
                        font-size: 24rpx;
                        margin-left: 10rpx;
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
                    font-weight: 600;
                    color: var(--tagColor);
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

                    &.bold {
                        font-weight: bold;
                    }
                }
            }
        }

        .order_det_bottom {
            position: fixed;
            bottom:0;
            width: 100%;
            max-width: 750rpx;
            padding-bottom: var(--safe-area-inset-bottom);
            height: calc(var(--safe-area-inset-bottom) + 120rpx);
            background: #FFFFFF;
            box-shadow: 1rpx 1rpx 20rpx 0rpx rgba(86, 86, 86, 0.11);
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-left: 24rpx;
            padding-right: 28rpx;
            box-sizing: border-box;
        }
    }

    .cancel_popup {
        width: 100%;
        background: #FFFFFF;
        width: 100% !important;
        padding-bottom: calc(120rpx + var(--safe-area-inset-bottom));
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
                
                font-weight: 500;
                color: #333;
                line-height: 32rpx;
            }

            image {
                width: 30rpx;
                height: 30rpx;
            }
        }
        .popup_tips{
            height: 100rpx;
            width: 100%;
            display: flex;
            padding: 0 30rpx;
            align-items: center;
            text {
                font-size: 32rpx;
                
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
                    
                    font-weight: 500;
                    color: #333;
                    line-height: 32rpx;
                }
            }
        }
        .cancle_tips{
            width: 100%;
            padding: 13rpx 30rpx;
            .tips_bg{
                height: 80rpx;
                background: #f6f9fd;
                font-size: 28rpx;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: 40rpx;
                padding: 0 24rpx;
                font-weight: 600;
                color: #222;
                ::v-deep{
                    .uni-switch-input{
                        width: 86rpx;
                        height: 44rpx;
                        border-radius: 28rpx;
                        &::after{
                            width: 36rpx;
                            height: 36rpx;
                            border-radius: 50%;
                            box-shadow: 0px 2rpx 4rpx 0rpx #d5dce6; 
                            top: 50%;
                            margin-top: -18rpx;
                        }
                        &::before{
                            width: 36rpx;
                            height: 36rpx;
                            border-radius: 50%;
                            box-shadow: 0px 2rpx 4rpx 0rpx #d5dce6; 
                            top: 50%;
                            margin-top: -18rpx;
                        }

                        &.uni-switch-input-checked{
                            &::after{
                                transform: translateX(46rpx);
                            }
                        }
                        
                    }
                }
            }
        }


        .cancel_popup_btn {
            position: fixed;
            bottom: 0rpx;
            z-index: 30;
            display: flex;
            width: 100%;
            height: calc(120rpx + var(--safe-area-inset-bottom));
            justify-content: center;
            align-items: center;
            padding: 0 30rpx var(--safe-area-inset-bottom);

            text:nth-child(1) {
                flex: 1;
                height: 80rpx;
                background: #fff;
                border-radius: 40rpx 0 0 40rpx;
                font-size: 30rpx;
                
                font-weight: 600;
                color: var(--confirmBtnBgColor2);
                line-height: 40rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2rpx solid var(--confirmBtnBgColor2);
                cursor: pointer;
            }

            text:nth-child(2) {
                flex: 1;
                height: 80rpx;
                background: var(--confirmBtnBgColor2);
                border-radius: 0 40rpx 40rpx 0;
                font-size: 30rpx;
                
                font-weight: 600;
                color: var(--confirmBtnTextColor);
                line-height: 40rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
        }
    }

    .view_invoice_list{
        min-height: 200rpx;
        max-height: 800rpx;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 30rpx 0;
        background: #fff;
        font-size: 28rpx;
        .item{
            width: 100%;
            text-align: center;
            padding: 20rpx 0;
        }
    }

    #store_no_good {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #store_no_good {
        position: fixed;
        top: 0;
        left: 0;
        width: 750rpx;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 999;
        right: 0;
        margin: 0 auto;
    }

    #store_no_good .content {
        width: 580rpx;
        height: 773rpx;
        background-color: white;
        border-radius: 15rpx;

        .content_title {
            margin-top: 24rpx;
            margin-bottom: 24rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 30rpx;
            font-size: 32rpx;
            color: #2D2D2D;

            image {
                width: 22rpx;
                height: 22rpx;
            }
        }

        .good_list {
            height: 593rpx;
            overflow-y: scroll;
            width: 100%;

            .good_item {
                display: flex;
                align-items: center;
                padding: 30rpx;
                border-top: 1rpx solid #f2f2f2;

                image {
                    width: 70rpx;
                    height: 70rpx;
                    border-radius: 6rpx;
                }

                .good_info {
                    margin-left: 20rpx;
                    position: relative;


                    .good_name {
                        width: 382rpx;
                        font-size: 26rpx;
                    }


                    .good_spec {
                        margin-top: 20rpx;
                        font-size: 22rpx;
                    }

                    .num {
                        position: absolute;
                        bottom: 0rpx;
                        right: 0rpx;
                        font-size: 24rpx;
                        color: #333333;
                    }
                }
            }

        }

        .part_no_goods {
            width: 520rpx;
            height: 60rpx;
            font-size: 30rpx;
            color: white;

            display: flex;
            align-items: center;
            margin: 0 auto;
            border-radius: 30rpx;
            margin-top: 15rpx;

            .return {
                width: 50%;
                height: 60rpx;
                line-height: 60rpx;
                background-color: #FF8809;
                text-align: center;
                border-radius: 30rpx 0 0 30rpx;
            }

            .remove {
                width: 50%;
                height: 60rpx;
                line-height: 60rpx;
                background-color: #F90208;
                text-align: center;
                border-radius: 0 30rpx 30rpx 0;
            }
        }
    }

    .part_no_goods_another {
        position: absolute;
        bottom: 50rpx;
        display: flex;
        align-items: center;
        margin: 0 auto;
        padding: 0 20rpx;
        width: 580rpx;
        .btn{
            border-radius: 30rpx;
            margin: 0 20rpx;
            width: 300rpx;
            height: 60rpx;
            line-height: 60rpx;
            font-size: 30rpx;
            text-align: center;
        }

        .return {
            color: #343434;
            border: 1px solid #eeeeee;
            
        }
        .tocart {
            background-color: #F90208;
            color: white;
        }
    }
</style>
