<!-- 订单详情页面 -->
<template>
    <scroll-view class="container" scroll-y @scrolltolower='getData' v-if="allData && isShow">
        <w-loading ref="loading"></w-loading>
        <view class="main_content">
            <view class="bg_red"></view>
            <!-- 订单状态 start -->
            <view class="order_state">
                <!-- 待付款 start orderState == 10-->
                <block v-if="allData.orderState == 10">
                    <view class="state_title">
                        <image :src="toPayImage" mode=""></image>
                        <text>{{allData.orderStateValue}}</text>
                    </view>

                    <!-- 定金预售 已付定金 还未到付尾款阶段 start -->
                    <view class="state_time"
                        v-if="allData.orderType == 103&&allData.orderSubState == 102&&!(allData.presellInfo&&allData.presellInfo.isStartRemainPay)">
                        {{allData.presellInfo.remainStartTime}} 开始付尾款
                    </view>

                    <view class="state_time" v-else-if="allData.orderType == 104">
                        剩余{{stateTime}}自动关闭
                    </view>

                    <!-- 定金预售 已付定金 还未到付尾款阶段 end -->
                    <view class="state_time" v-else-if="stateTime">
                        剩余{{stateTime}}{{allData.orderType==105&&allData.orderSubState==102&&allData.ladderGroupDetailInfo.depositRemainTime>0?'生成':'自动关闭'}}
                    </view>

                </block>
                <!-- 待付款 end-->
                <!-- 待发货  orderState == 20-->
                <block v-if="allData.orderState == 20">
                    <view class="state_title">
                        <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/order/delivered.png" mode=""></image>
                        <text>{{allData.orderStateValue}}</text>
                    </view>
                    <!-- 预售展示发货时间 start -->
                    <view v-if="allData.orderType==103&&allData.presellInfo.deliverTime" class="state_time">
                        {{allData.presellInfo.deliverTime}} 开始发货</view>
                    <!-- 预售展示发货时间 end -->
                </block>
                <!-- 待发货 end-->
                <!-- 待收货 -->
                <block v-if="allData.orderState == 30">
                    <view class="state_title">
                        <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/order/wait_receive.png" mode="" style="width: 71rpx;height: 45rpx;">
                        </image>
                        <text>{{allData.orderStateValue}}</text>
                    </view>
                    <view class="state_time" v-if="stateTime">还剩{{stateTime}}自动确认</view>
                </block>
                <!-- 待评价 -->
                <block v-if="allData.orderState == 40">
                    <view class="state_title await">
                        <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/order/success.png" mode="" style="width: 46rpx;height: 51rpx;">
                        </image>
                        <text>{{allData.orderStateValue}}</text>
                    </view>
                </block>
                <!-- 待收货 end-->
                <!-- 取消订单，交易关闭 start orderState == 0 -->
                <block v-if="allData.orderState == 0">
                    <view class="state_title">
                        <image :src="toPayImage" mode=""></image>
                        <text>{{allData.orderStateValue}}</text>
                    </view>
                    <view class="state_reason">{{allData.refuseReason}}</view>
                    <!-- 注： allData.cancelRemark 不为空 时为平台取消  否则为会员取消 -->
                    <view class="state_remark" v-if="allData.refuseRemark">{{allData.refuseRemark}}</view>
                </block>
                <!-- 取消订单，交易关闭 end-->

                <block v-if="allData.orderState==50">
                    <view class="state_title await">
                        <image :src="toPayImage" mode="">
                        </image>
                        <text>{{allData.orderStateValue}}</text>
                    </view>
                </block>

            </view>
            <!-- 订单状态  -->

            <!-- 物流信息  -->
            <view class="logistics_information"
                v-if="allData.orderState >= 30 && allData.routeList && allData.routeList.length > 0">
                <image :src="imgUrl+'order/wuliu.png'" mode="" class="logistics_image"></image>
                <view class="logistics_des_right">
                    <view class="logistics_info">
                        <view class="logistics_des">{{allData.routeList[0].acceptStation}}</view>
                        <view class="logistics_time">{{allData.routeList[0].acceptTime}}</view>
                    </view>
                    <image :src="rightArrowGray" mode="" class="right_down"
                        @click="lookLogistics()"></image>
                </view>
            </view>
            <!-- 物流信息 end -->

            <!-- 买家个人信息 start-->
            <view class="buyer_info">
                <image :src="imgUrl+'common/icon/map.png'" mode="" class="buyer_map"></image>
                <view class="info_det">
                    <view class="info_detail">
                        <view class="info_name">
                            <text class="buyer_namer">{{allData.receiverName}}</text>
                            <text class="buyer_phone">{{allData.receiverMobile}}</text>
                        </view>
                        <view class="info_address">{{allData.receiverAreaInfo+allData.receiverAddress}}</view>
                    </view>
                </view>
            </view>
            <!-- 买家个人信息 end-->

            <!-- 订单内商品信息 start -->
            <view class="order_goods">
                <view class="goods_list">
                    <view v-for="(store,index) in orderProductList" :key="index" class="store_item">
                        <view class="store_name">
                            <image class="store_logo" :src="storeLogo"></image>
                            <text class="store_name_text">{{store.storeName}}</text>
                            <!-- <text class="iconfont icon_arrow_right"></text> -->
                        </view>
                        <view class="goods_pre" v-for="(item,indexChild) in store.orderProductListVOList"
                            :key="indexChild">
                            <!-- #ifdef MP-WEIXIN || APP-PLUS -->
                            <view class="goods_image">
                                <image :src="item.mainImage" mode="aspectFill"></image>
                            </view>
                            <!-- #endif -->
                            <!-- #ifdef H5 -->
                            <view class="goods-img"
                                :style="{backgroundImage: 'url('+(item.mainImage||defaultImage)+')'}">
                                <view class="no-goods" v-if="item.productNum==0"></view>
                            </view>
                            <!-- #endif -->
                            <view class="goods_pre_right">
                                <view class="goods_des">
                                    <view class="goods_name">{{item.skuName}}</view>
                                    <view class="goods_spec" v-if="item.specValues">{{item.specValues}}</view>
                                </view>
                                <view :class="{'goods_prices':true,'justify':item.productType==0}">
                                    <view class="goods_price" v-if="item.productType==0">
                                        <text class="unit">¥</text>
                                        <text class="price_int">{{ getPartNumber(item.productShowPrice,'int') }}</text>
                                        <text class="price_decimal">{{ getPartNumber(item.productShowPrice,'decimal')
                                        }}</text>
                                    </view>
                                    <view class="goods_num_give" v-else>{{ item.productType==1 ? '附件' : '赠品' }}</view>
                                    <view class="goods_num">*{{item.productNum}}</view>
                                    <block v-if="(allData.orderState == 40 && item.serviceList)">
                                        <view v-if="item.productType == 0"
                                            @click.stop="selectService(allData.orderSn, item.orderProductId, item.serviceList)">
                                            申请售后
                                        </view>
                                    </block>
                                </view>
                            </view>
                            <view class="store_remark"
                                v-if="indexChild==(store.orderProductListVOList.length-1) && store.orderRemark">
                                <text>买家留言:</text>
                                <text>{{store.orderRemark}}</text>
                            </view>
                        </view>
                        <!-- 订单内商品信息 end -->
                        <view class="store_price_info no_top"
                            v-if="allData.orderState != 10&&allData.orderState != 0&&allData.orderType!=105">
                            <view class="freight">
                                <text class="freight_title">{{'商品合计'}}</text>
                                <text class="freight_price">￥{{allData.totalMoney}}</text>
                            </view>
                            <view class="freight" v-if="allData.fullDiscountAmount">
                                <text class="freight_title">满优惠</text>
                                <text class="freight_price">-￥{{allData.fullDiscountAmount}}</text>
                            </view>
                            <view class="freight">
                                <text class="freight_title">运费</text>
                                <text class="freight_price">￥{{allData.totalExpress}}</text>
                            </view>
                            <view class="freight" v-if="allData.platformVoucherAmount">
                                <text class="freight_title">{{'平台优惠券'}}</text>
                                <text class="freight_price">-￥{{allData.platformVoucherAmount}}</text>
                            </view>
                            <view class="freight" v-if="allData.storeVoucherAmount">
                                <text class="freight_title">{{'店铺优惠券'}}</text>
                                <text class="freight_price">-￥{{allData.storeVoucherAmount}}</text>
                            </view>
                            <view class="freight" v-if="allData.integralCashAmount">
                                <text class="freight_title">{{'云豆抵扣优惠'}}</text>
                                <text class="freight_price">-￥{{allData.integralCashAmount}}</text>
                            </view>

                            <view class="actual_payment">
                                <view class="actual_payment_title">
                                    <text>实付款</text>
                                    <text>(含运费)</text>
                                </view>
                                <view class="actual_payment_price">
                                    <text class="unit">¥</text>
                                    <text>{{getPartNumber(allData.orderAmount,'int')}}</text>
                                    <text>{{getPartNumber(allData.orderAmount,'decimal')}}</text>
                                </view>
                            </view>
                        </view>
                        <!-- 联系商家，拨打电话 start-->
                        <view class="share_btn">
                            <view class="share_btn_pre" @click="goCall(store)">
                                <image :src="imgUrl+'order/dadianhua.png'" mode=""></image>
                                <text>拨打电话</text>
                            </view>
                        </view>
                        <!-- 联系商家，拨打电话 end-->

                    </view>
                </view>

            </view>

            <!-- 订单信息  start-->
            <view class="order_des">
                <view class="order_des_title">订单信息</view>
                <view class="order_des_pre">
                    <text class="invoice">发票：</text>
                    <text
                        v-if="allData && allData.invoice && allData.invoice.invoiceTitle">{{allData.invoice.invoiceTitle}}</text>
                    <text v-else>--</text>
                </view>
                <!-- 收票人手机号 -->
                <view class="order_des_pre">
                    <text class="invoice">收票人手机：</text>
                    <text
                        v-if="allData && allData.invoice && allData.invoice.receiverMobile">{{allData.invoice.receiverMobile}}</text>
                    <text v-else>--</text>
                </view>
                <!-- 收票人邮箱 -->
                <view class="order_des_pre">
                    <text class="invoice">收票人邮箱：</text>
                    <text
                        v-if="allData && allData.invoice && allData.invoice.receiverEmail">{{allData.invoice.receiverEmail}}</text>
                    <text v-else>--</text>
                </view>


                <view class="order_des_pre" v-if="allData.orderTypeValue">
                    <text>订单类型：</text>
                    <text>{{allData.orderTypeValue}}订单</text>
                </view>
                <view class="order_des_pre">
                    <text>订单编号：</text>
                    <div class="orderNo">
                        <div>{{allData.orderSn}}</div>
                    </div>


                </view>
                <!-- 根据测试建议,备注改到item买家留言 -->
                <!-- <view class="order_des_pre" v-if="allData.orderRemark">
                    <text>订单备注：</text>
                    <text>{{allData.orderRemark}}</text>
                </view> -->
                <block v-if="orderLogs && orderLogs.length > 0">
                    <view class="order_des_pre" v-for="(item,index) in orderLogs" :key="index">
                        <text>{{item.orderStateLog == 10 ? '创建时间：' : item.orderStateLog == 20 ? '付款时间：' :
                        item.orderStateLog == 30 ? '发货时间：' : item.orderStateLog == 40 ? '完成时间：' :item.orderStateLog
                        == 102?'定金支付时间：':'取消时间：'}}</text>
                        <text>{{item.logTime}}</text>
                    </view>
                </block>

                <block v-if="productPromiseCalendars&&productPromiseCalendars.length>1&&!isGift">
                    <view class="order_des_pre">
                        <text>配送时间:</text>
                        <block>
                            <text>
                                <view style="display:block" v-for="(item, index) in productPromiseCalendars"
                                    :key="index">
                                    <text style="color:#343434;display:block"
                                        v-if="item.skuClassify==1">中小件:{{setdeliveryTimeStr(item.calendarDay)}}</text>
                                    <text style="color:#343434;display:block" v-if="item.skuClassify==2">大件
                                        配送:{{setdeliveryTimeStr(item.calendarDay)}}</text>
                                    <text style="color:#343434;display:block"
                                        v-if="item.skuClassify==2&&item.installDay">大件
                                        安装:{{setdeliveryTimeStr(item.installDay)}}</text>

                                </view>
                            </text>
                        </block>
                    </view>
                </block>
                <block v-else-if="productPromiseCalendars.length==1&&!isGift">
                    <view class="order_des_pre">
                        <text>配送时间:</text>
                        <text>
                            <view>
                                <text style="color:#343434;display:block"
                                    v-if="productPromiseCalendars[0].skuClassify==1">{{setdeliveryTimeStr(productPromiseCalendars[0].calendarDay)}}</text>
                                <text style="color:#343434;display:block"
                                    v-if="productPromiseCalendars[0].skuClassify==2">大件
                                    配送:{{setdeliveryTimeStr(productPromiseCalendars[0].calendarDay)}}</text>
                                <text style="color:#343434;display:block"
                                    v-if="productPromiseCalendars[0].skuClassify==2&&productPromiseCalendars[0].installDay">大件
                                    安装:{{setdeliveryTimeStr(productPromiseCalendars[0].installDay)}}</text>
                            </view>
                        </text>
                    </view>
                </block>
                <block v-else-if="!isGift&&curOrderStore.storeId==1">
                    <view class="order_des_pre">
                        <text>配送时间:</text>
                        <text>工作日、双休日与节假日均可送货</text>
                    </view>
                </block>

            </view>
            <!-- 订单信息  end-->

        </view>
        <!-- 详情底部操作按钮 start-->
        <view class="order_det_bottom"
            v-if="(allData.orderState == 10||allData.orderState == 20||allData.orderState == 30||allData.orderState == 40||allData.orderState == 0||allData.orderState == 50)">
            <!-- 待付款 -->
            <block v-if="allData.orderState == 10">
                <view class="edit_address_btn" @click="editAddress" v-if="false">修改地址</view>
                <view class="cancel_order fontScaleIgnore" v-if='!$isTransferPay(allData.paymentCode)'
                    @click="cancelPopup()">取消订单</view>
                <template
                    v-if="!(allData.orderType == 105&&allData.orderSubState==102&&allData.ladderGroupDetailInfo.depositRemainTime>0||(allData.orderType == 103&&allData.orderSubState==102&&allData.presellInfo.remainEndTime>0))||(allData.presellInfo&&allData.presellInfo.isStartRemainPay)">
                </template>
            </block>
            <!-- 待发货 -->
            <block v-if="allData.orderState == 20">
                <view v-if="false" class="edit_address_btn" @click="editAddress">修改地址</view>
            </block>
            <!-- 待收货 -->
            <block v-if="allData.orderState == 30">
                <view class="cancel_order fontScaleIgnore" @click="lookLogistics()">查看物流</view>
            </block>
            <!-- 待评价 -->
            <block v-if="allData.orderState == 40">
                <view class="cancel_order fontScaleIgnore" @click="lookLogistics()">查看物流</view>
            </block>
        </view>
        <!-- 详情底部操作按钮 end-->

        <!-- 取消订单选择原因弹框 -->
        <bottomPopup ref="cancelPopup" type="bottom" height="980rpx" text="取消原因">
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
                        <switch :checked="isAddCart" @change="switchChange" color="#f30300" />
                    </view>
                </view>
                <view class="cancel_popup_btn">
                    <text class="" @click="notCancel()">暂不取消</text>
                    <text class="" @click="confirmCancel()">确定取消</text>
                </view>
            </view>
        </bottomPopup>

        <!-- 商品全部，部分无货弹窗 start-->
        <view id="store_no_good" v-if="store_show_no_good">
            <view class="content">
                <view class="content_title">
                    <text> {{"以下主商品无货,加入购物车失败"}}</text>
                    <image @tap="hide_good_dialog" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/store_no_good_cancel.png" mode=""></image>
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
                    <view class="btn tocart" @click="toCart">
                        去购物车
                    </view>
                    <view class="btn return" @click="hide_good_dialog">
                        返回订单详情
                    </view>
                </view>
            </view>
        </view>
        <!-- 商品全部，部分无货弹窗 end-->
    </scroll-view>

</template>
<script>
import { selectAfsService, afsCheck, cancelReason } from "@/views/components/aftersale/handler";
import { toChinesNum, getPartNumber } from '@/utils/common';
import uniPopup from '@/common/components/uni-popup/uni-popup.vue';
import uniPopupDialog from '@/common/components/uni-popup/uni-popup-dialog.vue';
import bottomPopup from '@/common/components/uni-popup/uni-popup-bottom.vue'
import config from '@/common/lib/config.js';
import orderHandler from '@/views/components/order/handler';
import mixin from '@/common/mixin/orderMixin' //订单混入


let startY = 0,
    moveY = 0,
    pageAtTop = true;
export default {
    mixins: [mixin],
    components: {
        uniPopup,
        uniPopupDialog,
        bottomPopup
    },
    data() {
        return {
            rightArrowGray: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_rightarrow_gray.svg',
            storeLogo: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/store_logo.png',
            toPayImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/order/to_pay.png',
            getPartNumber,
             
            coverTransform: 'translateY(0px)',
            coverTransition: '0s',
            moving: false,
            orderSn: '', //订单号
            parentSn: '',
            allData: {}, //订单详细信息
            orderProductList: [], //订单商品列表,
            isGift: false,//判断单个商品是否是赠品或附件
            curOrderStore: {},//当前的店铺
            cancelList: [], //取消原因列表
            current: '0', //取消原因当前点击的是第0项
            reasonId: -1, //取消原因当前点击的原因id
            stateTime: '', //等待买家付款的剩余时间
            isShow: false,
            orderLogs: [], //订单日志
            productPromiseCalendars: [],//配送日历
            secInterval: '', //定时器
            ladderInfo: [],//阶梯团信息
            presaleInfo: [],//定金预售信息
            ladderGroupDisplayStatus: true, //立即支付按钮显示状态(此变量只在阶梯团商品下起作用)
            pdfUrl: "",
            defaultImage: './static/shared/order/icon_mall_liwu.png',
            no_good_info: [],
            store_show_no_good: false,
            isAddCart: true, //取消订单的时候 是否加入购物车
            cancleOrderInfo: {} //要取消订单的该订单的订单详情 目前的用处是取消订单的时候 有加入购物车的功能
        }
    },
    async mounted() {
        //订单号
        this.orderSn = this.$Route.query.orderSn;
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

    methods: {

        // 将阿拉伯数字改为汉字
        toChinesNumFun(string) {
            return toChinesNum(string)
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
            this.$refs?.loading?.open();
            let that = this;
            let param = {};
            param.orderSn = that.orderSn;
            orderHandler.getOrderDetail(param).then(async res => {
                if (res.state == 200) {
                    // 获取可售后性
                    // let serviceCheckList = await this.getAfsServiceCheck()
                    this.getAfsServiceCheck()
                    this.$refs?.loading?.close();
                    let result = res.data;
                    // 根据 orderProductId 组装每个商品的可售性
                    // result.childOrdersVOS.forEach(element=>{
                    //     element.orderProductListVOList.forEach(item=>{
                    //         item.serviceList = serviceCheckList.find(e=>e.orderProductId == item.orderProductId)
                    //     })
                    // });
                    that.orderProductList = result.childOrdersVOS;
                    that.orderLogs = result.orderLogs.reverse();
                    that.productPromiseCalendars = result.productPromiseCalendars
                    that.allData = result || {};
                    that.isShow = true;
                    that.parentSn = res.data.parentSn

                    let productList = []
                    result.childOrdersVOS.forEach(element => {
                        element.orderProductListVOList.forEach(item => {
                            productList.push(item)
                        })
                    });

                    if (productList[0] && productList[0].isGift != 0 && result.totalMoney == 0) { that.isGift = true }
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
                            this.countDownBySecond(result.remainTime, result);
                        } else if (ladderInfo.orderSubState > 101) {
                            tmpData[0].title = '阶段1：已完成';
                            tmpData.push({
                                key: 1,
                                title: ladderInfo.orderSubState == 102 ? '阶段2：等待买家付' : '阶段2：已完成',
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
                                this.countDownBySecond(ladderInfo.depositRemainTime + 60);
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
                    } else if (result.orderType == 104 && result.orderState == 10) {
                        if (result.remainTime > 0) {
                            this.countDownBySecond(result.remainTime, result)
                        } else if (!this.allData.refuseReason) {
                            this.allData.orderState = 0
                            this.allData.orderStateValue = '交易关闭'
                            this.allData.refuseReason = "支付超时系统自动取消秒杀订单"
                        }
                    } else {
                        that.countup(result.orderType == 1 ? result.remainTime * 1000 : 86400000);//86400000是1天的
                    }
                } else {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            })
        },

        // 可售后性列表 ,服务端拆服务了 ,售后和订单接口做了解耦
        getAfsServiceCheck() {
            return new Promise((resolve) => {
                let param = {};
                param.orderSn = this.orderSn;

                afsCheck(param).then(res => {
                    if (res.state == 200) {
                        // 根据 orderProductId 组装每个商品的可售性
                        this.setServiceList(res.data)
                        resolve(res.data)
                    } else {
                        (this.$Route.path == '/views/order/detail/index') && uni.showToast({
                            title: res.msg,
                            icon: 'none'
                        })
                        this.setServiceList([])
                        resolve([])
                    }
                }).catch(() => {
                    this.setServiceList([])
                    resolve([])
                })
            })
        },
        setServiceList(data) {
            this.orderProductList.forEach((element) => {
                element.orderProductListVOList.forEach(item => {
                    let serviceList = data.find(e => e.orderProductId == item.orderProductId)
                    this.$set(item, 'serviceList', serviceList)
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
        countDownBySecond(second, goodsInfo) {
            let that = this;
            //创建定时器前先清除定时器
            clearInterval(that.secInterval);
            let diffrentTimeStamp = second * 1000;
            that.secInterval = setInterval(() => {
                if (diffrentTimeStamp == 0) {
                    that.stateTime = '';
                    clearInterval(that.secInterval);
                    if (!(goodsInfo && goodsInfo.orderType === 105 && goodsInfo.orderSubState === 101) || goodsInfo.orderType === 102) {
                        //非 商品为阶梯团&&定金未付款 情况下才会重新请求商品详情
                        that.getOrderDetail();
                    } else {
                        //阶梯团&&定金未付款商品 倒计时结束后主动隐藏支付按钮
                        that.ladderGroupDisplayStatus = false;
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
            return seconds + '秒'

        },
        //获取推荐商品
        getData() {
            // this.$refs.recomment_goods.getMoreData();
        },
        //拨打电话
        goCall(store) {
            let phone = config.SERVICE_PHONE;
            uni.makePhoneCall({
                phoneNumber: phone
            })
        },
        //打开取消订单弹框
        cancelPopup() {
            if ((this.allData.orderType == 105 && !this.allData.ladderGroupDetailInfo.isRefundDeposit) || this.allData.orderType == 103) {
                this.$refs.popup.open()
            } else {
                this.$refs.cancelPopup.open();
                this.getCancelList();
            }

        },

        // 预售,阶梯团的提示确认
        acDialog(type) {
            if (type == true) {
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
            param.type = 104;
            cancelReason(param).then(res => {
                if (res.state == 200) {
                    this.cancelList = res.data || [];
                    this.cancelList && this.cancelList.map((item, index) => item.value = '' + index);
                    this.reasonId = this.cancelList[0].reasonId;
                } else {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            }).catch(() => {
                //异常处理
            })
        },
        //取消原因单选框切换
        radioChange(e) {
            for (let i = 0; i < this.cancelList.length; i++) {
                if (this.cancelList[i].value === e.target.value) {
                    this.reasonId = this.cancelList[i].reasonId;
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
                confirmColor: '#f30300',
                cancelColor: '#999',
                title: '提示',
                content: '确定取消该订单?',
                success: function (modalres) {
                    if (modalres.confirm) {
                        let param = {};
                        param.parentSn = that.parentSn;
                        param.reasonId = that.reasonId;
                        orderHandler.cancel(param).then(res => {
                            if (res.state == 200) {
                                uni.showToast({
                                    title: res.msg,
                                    icon: 'none'
                                })

                                that.$refs.cancelPopup.close();
                                that.goRefresh();
                            } else {
                                uni.showToast({
                                    title: res.msg,
                                    icon: 'none'
                                })
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

        //修改地址
        editAddress() {
            // this.$Router.push({ path: '/views/address/list', query: { source: 3, orderSn: this.orderSn } })
        },
        //查看退款详情  换货详情
        lookRefundDetail(afsSn, afsButton) {
            if (afsButton == 403 || afsButton == 404) { //可查看换货详情
                let sourceType = 'exchange';
                this.$Router.push({ path: '/views/gift/afterSale/detail', query: { afsSn, sourceType } })
            } else {
                let sourceType = '';
                this.$Router.push({ path: '/views/gift/afterSale/detail', query: { afsSn, sourceType, orderState: this.allData.orderState } })
            }

        },
        //选择服务
        selectService(orderSn, orderProductId, serviceList) {
            if (serviceList && serviceList.num != 0 && serviceList.afterSaleTypes.length != 0) {
                // todo
            } else {
                uni.showToast({
                    title: '该商品无法售后!',
                    icon: 'none'
                })
                return false;
            }
            let param = {};
            param.orderSn = orderSn; //订单号
            param.orderProductId = orderProductId; //订单明细id
            selectAfsService(param).then(res => {
                if (res.state == 200) {
                    const len = this.orderProductList[0].orderProductListVOList.filter((item) => { return item.productType == 0 }).length;
                    this.$Router.push({ path: '/views/gift/afterSale/index', query: { orderSn, orderProductId, sourceType: 'orderDetail', orderListLen: len } });
                } else {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            }).catch(() => {
                //异常处理
            })
        },



        //更新当前页面方法
        goRefresh() {
            let pages = getCurrentPages();
            let currPage = pages[pages.length - 1]; //当前页面
            let beforePage = pages[pages.length - 2]; //上一页
            currPage.$vm.getOrderDetail(); //更新当前页面数据
            beforePage.$vm.loadData(); //更新上一页数据
        },
        // 隐藏商品无货弹窗
        hide_good_dialog() {
            this.store_show_no_good = false;
        },
        // 配送时间的字符串显示
        setdeliveryTimeStr(dataJson) {
            let str = "", timeStr = ""
            if (!dataJson) {
                str = "工作日、双休日与节假日均可送货"
                return str
            }
            let startDate = new Date(dataJson.dateStr.replace(/\-/g, '/'));
            let dateStr = startDate.format("MM月dd日");
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
    }
}
</script>
<style lang='scss'>
page {
    // background: $uni-bg-color;
    width: 750rpx;
    margin: 0 auto;
}

.content {
    position: relative;
}

.container {
    display: flex;
    flex: 1;
    width: 100%;
    position: relative;
    background-color: #FFFFFF;

    .main_content {
        width: 100%;
        min-height: calc(var(--status-bar-height) + 452rpx);
        padding-top: var(--status-bar-height);
        padding-bottom: 90rpx;
        position: relative;

        .bg_red {
            position: absolute;
            background: #F30300;
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
            padding-top: 96rpx;
            /* #ifdef MP */
            padding-top: 0;
            /* #endif */
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            margin-bottom: 19rpx;
            height: 296rpx;
            padding-left: 20rpx;
            padding-right: 20rpx;

            .state_title {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;

                image {
                    width: 45rpx;
                    height: 45rpx;
                    margin-right: 20rpx;
                }

                text {
                    font-size: 38rpx;
                    font-family: PingFang SC;
                    font-weight: bold;
                    color: #FFFFFF;
                    line-height: 32rpx;
                }
            }

            .state_reason {
                font-size: 24rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #FFFFFF;
                line-height: 32rpx;
                margin: 20rpx 0;
            }

            .state_remark {
                font-size: 24rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #FFFFFF;
                line-height: 32rpx;
            }

            .await {
                margin-bottom: 139rpx;
            }

            .state_time {
                font-size: 24rpx;
                font-family: PingFang SC;
                color: #FFFFFF;
                line-height: 32rpx;
                margin: 22rpx 0 32rpx;
            }
        }

        .logistics_information {
            display: flex;
            background: #FFFFFF;
            box-shadow: 1rpx 3rpx 30rpx 0rpx rgba(102, 102, 102, 0.1);
            width: 710rpx;
            margin: 0 auto;
            padding: 40rpx 0 30rpx 20rpx;
            border-radius: 15rpx 15rpx 0 0;
            border-bottom: 1rpx solid #F4F4F4;
            position: relative;
            z-index: 100;

            .logistics_image {
                width: 34rpx;
                height: 28rpx;
                margin-right: 18rpx;
            }

            .logistics_des_right {
                display: flex;
                align-items: center;

                .logistics_info {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    width: 565rpx;

                    .logistics_des {
                        font-size: 28rpx;
                        font-family: PingFang SC;
                        font-weight: 500;
                        color: #333333;
                        line-height: 39rpx;
                        width: 519rpx;
                        text-overflow: -o-ellipsis-lastline;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        line-clamp: 2;
                        -webkit-box-orient: vertical;
                        margin-bottom: 21rpx;
                    }

                    .logistics_time {
                        font-size: 26rpx;
                        font-family: PingFang SC;
                        font-weight: 500;
                        color: #949494;
                        line-height: 45rpx;
                    }
                }

                .right_down {
                    width: 46rpx;
                    height: 46rpx;
                }
            }
        }

        .buyer_info {
            width: 710rpx;
            background: #FFFFFF;
            box-shadow: 1rpx 3rpx 30rpx 0rpx rgba(102, 102, 102, 0.1);
            border-radius: 15rpx;
            margin: 0 auto;
            display: flex;
            padding: 41rpx 20rpx;
            position: relative;
            z-index: 100;
            box-sizing: border-box;

            .buyer_map {
                width: 34rpx;
                height: 34rpx;
                margin-right: 20rpx;
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
                        font-size: 28rpx;
                        font-family: PingFang SC;
                        font-weight: 500;
                        color: #2E2E2E;
                        line-height: 28rpx;

                        .buyer_namer {
                            color: #2E2E2E;
                        }

                        .buyer_phone {
                            color: #666666;
                            margin-left: 20rpx;
                        }
                    }

                    .info_address {
                        width: 560rpx;
                        font-size: 28rpx;
                        font-family: PingFang SC;
                        font-weight: 500;
                        color: #343434;
                        line-height: 39rpx;
                        margin-top: 28rpx;
                        word-break: break-all;
                    }
                }
            }
        }

        .order_goods {
            .goods_list {
                padding: 20rpx 0 0 0;

                .store_item:not(:first-child) {
                    border-top: 20rpx solid #F5F5F5;
                }

                .goods_pre {
                    display: flex;
                    padding: 0 20rpx;
                    box-sizing: border-box;
                    padding-bottom: 22rpx;
                    border-bottom: 1rpx solid #f2f2f2;
                    width: 750rpx;
                    flex-wrap: wrap;

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
                        width: 200rpx;
                        height: 200rpx;
                        overflow: hidden;
                        background-color: #F8F6F7;
                        border-radius: 14rpx;
                        flex-shrink: 0;
                        position: relative;

                        .no-goods {
                            position: absolute;
                            width: 124rpx;
                            height: 124rpx;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background-image: url(https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/order/bg_soldout.png);
                            background-size: contain;
                        }
                    }

                    .goods_pre_right {
                        display: flex;
                        justify-content: space-between;
                        flex: 1;

                        .goods_des {
                            margin-left: 25rpx;
                            padding-top: 8rpx;
                            box-sizing: border-box;
                            flex: 1;

                            .goods_name {
                                font-size: 28rpx;
                                font-family: PingFang SC;
                                font-weight: 500;
                                color: #343434;
                                line-height: 139%;
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
                                font-family: PingFang SC;
                                font-weight: 400;
                                color: #949494;
                                line-height: 32rpx;
                                margin-top: 20rpx;
                                width: 280rpx;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        }

                        .goods_num_give {
                            color: #2D2D2D;
                            font-size: 26rpx;
                            /* font-weight: bold; */
                        }

                        .goods_prices {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: flex-end;
                            min-width: 200rpx;

                            .goods_price {

                                margin-top: 20rpx;

                                text {
                                    display: inline-block;
                                    font-family: PingFang SC;
                                    font-weight: 500;
                                    color: #343434;
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
                                font-size: 24rpx;
                                font-family: PingFang SC;
                                font-weight: 500;
                                color: #2D2D2D;
                                line-height: 30rpx;
                            }

                            .refund_btn {
                                padding: 12rpx 15rpx;
                                box-sizing: border-box;
                                border: 1rpx solid #fc1c1c;
                                border-radius: 25rpx;
                                font-size: 26rpx;
                                line-height: 26rpx;
                                font-family: PingFang SC;
                                font-weight: 400;
                                color: #fc1c1c;
                                margin-top: 22rpx;
                            }

                            .refund_btn_disabled {
                                padding: 12rpx 15rpx;
                                box-sizing: border-box;
                                border: 1rpx solid #eeeeee;
                                border-radius: 25rpx;
                                font-size: 26rpx;
                                line-height: 26rpx;
                                font-family: PingFang SC;
                                font-weight: 400;
                                color: #333333;
                                margin-top: 22rpx;
                            }
                        }

                        .justify {
                            justify-content: flex-start;
                        }
                    }

                    ;

                    .store_remark {

                        width: 100%;
                        font-size: 26rpx;
                        font-family: PingFang SC;
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
            }
        }

        .order_des {
            user-select: text;
            border-top: 20rpx solid #F5F5F5;
            padding: 29rpx 40rpx 0 20rpx;
            box-sizing: border-box;

            .order_des_title {
                font-size: 28rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #343434;
                line-height: 32rpx;
                margin-bottom: 19rpx;
            }

            .order_des_pre {
                width: 100%;
                font-size: 26rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #9A9A9A;
                // line-height: 34rpx;
                // height: 34rpx;
                display: flex;
                // flex-wrap: wrap;
                margin-bottom: 24rpx;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                user-select: auto;

                text:nth-child(1) {
                    color: #9A9A9A;
                }

                text:nth-child(2) {
                    width: 488rpx;
                    color: #343434;
                    word-break: break-all;
                }

                .orderNo {
                    width: 488rpx;
                    display: flex;
                    justify-content: space-between;
                    color: #343434;
                }
            }
        }

        .share_btn {
            width: 100%;
            height: 86rpx;
            background: #FFFFFF;
            /* border-top: 1rpx solid #EDEDED; */
            display: flex;
            align-items: center;
            padding: 0 118rpx;
            box-sizing: border-box;
            justify-content: space-between;

            .share_btn_pre {
                display: flex;
                align-items: center;

                image {
                    width: 28rpx;
                    height: 28rpx;
                    margin-right: 9rpx;
                }

                image:nth-of-type(2) {
                    width: 24rpx;
                    height: 29rpx;
                }

                text {
                    font-size: 26rpx;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #333333;
                    line-height: 24rpx;
                }
            }
        }

        .recomment {
            background: #F5F5F5;
            box-sizing: border-box;
        }
    }

    .order_det_bottom {
        position: fixed;
        bottom: 0;
        width: 100%;
        max-width: 750rpx;
        padding-bottom: env(safe-area-inset-bottom);
        height: calc(env(safe-area-inset-bottom) + 90rpx);
        background: #FFFFFF;
        box-shadow: 1rpx 1rpx 20rpx 0rpx rgba(86, 86, 86, 0.11);
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 20rpx;
        box-sizing: border-box;

        .edit_address_btn.fontScaleIgnore {
            width: 131rpx;
            height: 50rpx;
            border: 1rpx solid #eeeeee;
            border-radius: 25rpx;
            font-size: 24rpx;
            font-family: PingFang SC;
            font-weight: 400;
            color: #343434;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .contact_customer_btn {
            padding: 0 8rpx;
            height: 50rpx;
            border: 1rpx solid #eeeeee;
            border-radius: 25rpx;
            font-size: 24rpx;
            font-family: PingFang SC;
            font-weight: 400;
            color: #343434;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        .cancel_order.fontScaleIgnore {
            min-width: 131rpx;
            min-height: 50rpx;
            padding: 0 5rpx 0 5rpx;
            border: 1rpx solid #eeeeee;
            border-radius: 25rpx;
            font-size: 24rpx;
            font-family: PingFang SC;
            font-weight: 400;
            color: #343434;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 10rpx;
        }

        .go_pay.fontScaleIgnore {
            width: 142rpx;
            height: 50rpx;
            background: #F30300;
            box-shadow: 1rpx 3rpx 15rpx 0rpx rgba(252, 28, 28, 0.26);
            border-radius: 25rpx;
            font-size: 24rpx;
            font-family: PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 10rpx;
        }

        .confirm_receipt.fontScaleIgnore {
            width: 140rpx;
            height: 50rpx;
            background: #F30300;
            border-radius: 25rpx;
            font-size: 24rpx;
            font-family: PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}

.cancel_popup {
    width: 100%;
    background: #FFFFFF;
    width: 100% !important;
    padding-bottom: 120rpx;

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

    .cancle_tips {
        width: 100%;
        padding: 13rpx 30rpx;

        .tips_bg {
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

            ::v-deep {
                .uni-switch-input {
                    width: 86rpx;
                    height: 44rpx;
                    border-radius: 28rpx;

                    &::after {
                        width: 36rpx;
                        height: 36rpx;
                        border-radius: 50%;
                        box-shadow: 0px 2rpx 4rpx 0rpx #d5dce6;
                        top: 50%;
                        margin-top: -18rpx;
                    }

                    &::before {
                        width: 36rpx;
                        height: 36rpx;
                        border-radius: 50%;
                        box-shadow: 0px 2rpx 4rpx 0rpx #d5dce6;
                        top: 50%;
                        margin-top: -18rpx;
                    }

                    &.uni-switch-input-checked {
                        &::after {
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
        height: 120rpx;
        justify-content: center;
        align-items: center;
        padding: 0 30rpx;

        text:nth-child(1) {
            flex: 1;
            height: 80rpx;
            background: #fff;
            border-radius: 40rpx 0 0 40rpx;
            font-size: 30rpx;
            font-family: PingFang SC;
            font-weight: 600;
            color: #F30300;
            line-height: 40rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2rpx solid #f30300;
            cursor: pointer;
        }

        text:nth-child(2) {
            flex: 1;
            height: 80rpx;
            background: #F30300;
            border-radius: 0 40rpx 40rpx 0;
            font-size: 30rpx;
            font-family: PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            line-height: 40rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
    }
}

.store_name {
    padding-left: 20rpx;
    padding-bottom: 30rpx;
    margin-top: 30rpx;
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

.store_price_info {
    border-top: 10px solid #F5F5F5;

    .store_price_all {
        margin: 18rpx 0;
    }

    .freight {
        display: flex;
        padding: 10rpx 20rpx;
        box-sizing: border-box;
        justify-content: space-between;

        .freight_title {
            font-size: 26rpx;
            font-family: PingFang SC;
            font-weight: 500;
            color: #343434;
            line-height: 115%;
        }

        .freight_price {
            font-size: 24rpx;
            font-family: PingFang SC;
            font-weight: 500;
            color: #2E2E2E;
            line-height: 30rpx;
        }
    }

    .actual_payment {
        display: flex;
        justify-content: space-between;
        padding: 0 20rpx;
        box-sizing: border-box;
        margin: 20rpx 0;

        .actual_payment_title {
            display: flex;
            font-size: 26rpx;
            font-family: PingFang SC;
            font-weight: 500;
            line-height: 30rpx;
            color: #343434;

            text:nth-child(2) {
                color: #949494;
            }
        }

        .actual_payment_price {
            font-size: 24rpx;
            font-weight: 500;
            color: #FC1C1C;
            line-height: 30rpx;

            text:nth-child(2) {
                font-size: 32rpx;
            }
        }
    }
}

.no_top {
    border-top: none;
    margin-top: 20rpx;
}

.Giveaway {
    width: 100rpx;
    height: 40rpx;
    border: 1rpx solid red;
    line-height: 40rpx;
    text-align: center;
    color: red;
    font-size: 25rpx;
    border-radius: 10rpx;
}

.view_invoice_list {
    min-height: 200rpx;
    max-height: 800rpx;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 30rpx 0;
    background: #fff;
    font-size: 28rpx;

    .item {
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

    .btn {
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
