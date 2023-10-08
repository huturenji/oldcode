<template>
    <view @click="clickMoreBtn">
        <w-loading ref="loading"></w-loading>
        <view class="top-wrapper">
            <view class="top-input-wrapper">
                 <!-- 订单搜索组件 -->
                <searchPanel 
                    panelTitleName="订单筛选"
                    :keyword="keyword"
                    @resetKeyword="resetSearch"
                    @setSearchCondition="setSearchCondition"
                    @filterSearchOrder="filterSearchOrder"
                >
				    <custom-input slot="input" class="input" v-model="keyword" placeholder="商品名称/订单编号" :disabled="true" @search="toSearchPage" />
                </searchPanel>
            </view>

            <view class="tab-wrapper">
                <!-- 点击后会触发事件，参数为当前点击的tab的 index -->
                <tabs :list="navList" :current="currentIndex" @clickTab="clickTab" />
            </view>
        </view>
        <!-- 订单列表展示部分 -->
        <swiper class="swiper" :current="currentIndex" duration="300" @change="changeTab">
            <swiper-item class="swiper-item" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
                <scroll-view class="scroll-view" scroll-y @scrolltolower="getMoreOrderList" lower-threshold="150">
                    <view class="order-container" v-for="(order, orderIndex) in tabItem.orderList" :key="orderIndex">
                        <view class="order-head">
                            <view class="store-info">
                                <image class="store-logo" :src="storeLogo" />
                                <text class="store-name">{{ order.storeName }}</text>
                            </view>
                            <view class="wait-pay" v-if="order.orderState == 10">
                                <view class="left-order-state">待付款</view>
                                <view class="right-state-time">
                                    剩
                                    <text>
                                        <text v-if="formatRemainTimeMap[order.orderSn].days != '00'">{{ formatRemainTimeMap[order.orderSn].days || '00' }}天</text>
                                        <text v-if="formatRemainTimeMap[order.orderSn].hours != '00'">{{ formatRemainTimeMap[order.orderSn].hours || '00' }}时</text>
                                        {{ formatRemainTimeMap[order.orderSn].minutes != '00' || formatRemainTimeMap[order.orderSn].hours != '00' ? formatRemainTimeMap[order.orderSn].minutes : '01' }}分
                                    </text>
                                </view>
                            </view>
                            <view v-else class="order-state" :style="{color: ORDER_STATE_COLOR[order.orderState]}">{{ order.orderStateValue }}</view>
                        </view>
                        <view class="order-body">
                            <view @click="toOrderDetail(order.orderSn)"
                                v-for="(orderProduct, productIndex) in order.orderProductListVOList"
                                :key="productIndex">
                                <thumb-order-product class="order-product" :orderProduct="orderProduct" />
                                <view class="divider"></view>
                            </view>

                        </view>
                        <view class="order-foot">
                            <view class="fee-info">
                                <text class="num">共{{ order.goodsNum }}件商品</text>
                                <view class="amount">
                                    <!-- 需付款/实付款/应付款 -->
                                    <text>{{ORDER_ENUM[order.orderState].totalText}}：</text>
                                    <view class="price-wrapper num-font">
                                        <text>￥</text>
                                        <text>{{ getPartNumber(order.orderAmount, 'int') }}</text>
                                        <text>{{ getPartNumber(order.orderAmount, 'decimal') }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>

                        <view class="btn-wrapper" v-if="ORDER_ENUM[order.orderState]">
                            <!-- 按钮超过三个显示更多 -->
                            <tooltip v-if="order.moreBtns.length > 0" ref="tooltip">
                                <view class="more-btn">更多</view>
                                <template v-slot:content>
                                    <block v-for="type in order.moreBtns" :key="type">
                                        <block v-if="type == BUTTON_TYPES.CUSTOMER_SERVICE">
                                            <btn-customer class="btn-customer-more" :showCard="true" :title="order.orderSn"
                                                :path='`/views/order/detail/index?orderSn=${order.orderSn}`'
                                                :image="order.orderProductListVOList[0].mainImage">
                                                <text class="btn-content-kefu">
                                                    联系客服退款
                                                </text>
                                            </btn-customer>
                                        </block>
                                        <block v-else>
                                            <order-button class="order-button-more" :orderSn="order.orderSn" :type="type"
                                                :order="order" :orderProductList="order.orderProductListVOList"
                                                :plain="false"
                                                @clickBtn="clickMoreBtn"
                                                @order-pay-success="orderPaySuccess" @order-confirm="orderConfirm"
                                                @order-cancel="orderCancel" @order-delete="orderDelete" @timing="timing"
                                                @timeout="timeout" :remainTime="order.remainTime || 0" interval="1" />
                                        </block>
                                    </block>
                                </template>
                            </tooltip>
                            <block v-for="(type, btnIndex) in order.showBtns"
                                :key="type">
                                <block v-if="type == BUTTON_TYPES.CUSTOMER_SERVICE">
                                    <btn-customer class="btn-customer" :showCard="true" :title="order.orderSn"
                                        :path='`/views/order/detail/index?orderSn=${order.orderSn}`'
                                        :image="order.orderProductListVOList[0].mainImage">
                                        <text class="btn-content-kefu">
                                            联系客服退款
                                        </text>
                                    </btn-customer>
                                </block>
                                <block v-else>
                                    <order-button class="order-button" :orderSn="order.orderSn" :type="type"
                                        :order="order" :orderProductList="order.orderProductListVOList"
                                        :plain="btnIndex < order.showBtns.length - 1"
                                        @order-pay-success="orderPaySuccess" @order-confirm="orderConfirm"
                                        @order-cancel="orderCancel" @order-delete="orderDelete" @timing="timing"
                                        @timeout="timeout" :remainTime="order.remainTime || 0" interval="1" />
                                </block>
                            </block>
                        </view>

                    </view>
                    <block v-if="tabItem.loaded && tabItem.orderList.length == 0">
                        <view class="empty-wrapper">
                            <image class="empty-image" :src="emptyImage" />
                            <text class="empty-dec">这里空空如也~快去商品中心加购商品吧！</text>
                            <view class="empty-btn" @click="toGoodsList">马上去逛逛</view>
                        </view>
                    </block>
                    <block v-else>
                        <block v-if="tabItem.loadingState == 'loading'">
                            <loadingState state='loading' />
                        </block>
                        <block v-if="tabItem.loadingState == 'noMore'">
                            <noMoreDataDivider color="#999999" />
                        </block>
                    </block>

                </scroll-view>
            </swiper-item>
        </swiper>

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
        <bottomPopup ref="invoicePopup" type="bottom" height="600rpx" text="发票列表" :prevent="false">
            <scroll-view :scroll-y="true" class="view_invoice_list" :class="[iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
                <view @click="previewInvoice(item)" v-for="(item, index) in invoiceUrls" :key="index" class="item">
                    发票{{ toChinesNumFun(++index) }}</view>
            </scroll-view>
        </bottomPopup>
    </view>
</template>

<script>
import OrderButton from "@/common/components/button/order-button";
import BottomPopup from '@/common/components/uni-popup/uni-popup-bottom';
import Tabs from '@/views/components/tab/tabs';
import searchPanel from '@/views/components/search-input/index';
import CustomInput from '@/views/components/input/custom-input';
import orderHandler from '@/views/components/order/handler';
import cartHandler from '@/views/components/cart/handler';
import thumbOrderProduct from '@/views/components/order/thumb-order-product'
import BtnCustomer from '@/common/components/button/btn-customer';
import loadingState from "@/common/components/loading/loading";
import noMoreDataDivider from "@/common/components/division/index";
import tooltip from '@/views/components/uni-tooltip/index';
import { getPartNumber, getAllTime, toChinesNum } from '@/utils/common';
import { ORDER_ENUM, ORDER_STATE, ORDER_STATE_VAlUE, EXCLUDE_ORDER_STATE, BUTTON_TYPES, ORDER_STATE_COLOR } from "@/common/lib/enum/order.js";
import shareMixin from '@/common/mixin/share';
import { mapMutations, mapState } from 'vuex';

export default {
    mixins:[shareMixin],
    components: {
        OrderButton,
        Tabs,
        searchPanel,
        CustomInput,
        thumbOrderProduct,
        BtnCustomer,
        loadingState,
        noMoreDataDivider,
        BottomPopup,
        tooltip
    },
    data() {
        return {
            cancel: {
                reasonId: -1, // 订单取消原因id
                content: '', // 取消原因
                parentSn: '', // 当前取消订单号
                cancelList: [], // 取消原因列表
                current: 0, // 订单取消原因下标
            },
            keyword: '',
            emptyImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwnr.png',
            getPartNumber,
            ORDER_ENUM,
            ORDER_STATE,
            ORDER_STATE_COLOR,
            BUTTON_TYPES,
            currentIndex: 0, // tab切换绑定的索引
            navList: [],
            storeLogo: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/store_logo.png',
            isAddCart: true, // 取消订单后是否加回购物车
            order: null, // 操作的订单
            remainTimeMap: {},
            searchCondition: {}, // 订单日期筛选条件
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
            invoiceUrls: [], // 预览发票
        }
    },

    computed: {
        currentTab() {
            return this.navList[this.currentIndex]
        },
        formatRemainTimeMap() {
            const formatRemainTimeMap = {}
            Object.keys(this.remainTimeMap).forEach(key => {
                formatRemainTimeMap[key] = getAllTime(this.remainTimeMap[key])
            })
            return formatRemainTimeMap
        }
    },
    beforeDestroy() {
        uni.$off('forceUpdatePage')
    },
    onShow() {
        uni.$off('forceUpdatePage')
        uni.$on('forceUpdatePage', this.forceUpdatePage)
    },
    onLoad(options) {
		if (options) {
			this.keyword = decodeURIComponent(options.keyword || '');
		}
        this.initNavList();
        this.navTab();
        this.getOrderList();
    },
    methods: {
        ...mapMutations(['addGoods']),
        getAllTime,
        navTab() {
            let orderState = this.$Route.query.orderState;
            if (!orderState) {
                return
            }
            for (let index = 0; index < this.navList.length; index++) {
                const element = this.navList[index];
                if (element.orderState == orderState) {
                    this.currentIndex = index;
                    break;
                }
            }
        },
        initNavList() {
            let arr = Object.keys(ORDER_STATE).map(key => {
                let orderState = ORDER_STATE[key];
                let orderStateValue = ORDER_STATE_VAlUE[orderState];
                if (EXCLUDE_ORDER_STATE.includes(orderState)) {
                    return null
                }
                return {
                    orderState,
                    orderList: [],
                    orderStateValue,
                    name: orderStateValue,
                    loadingState: null, //初始值为空，所有状态都不会显示loading
                    loaded: false, // 是否加载过了
                    pageSize: 10,
                    pageIndex: 1 // 分页查询参数
                }
            });
            arr = arr.filter(ele => ele !== null);

            arr.unshift({
                name: '全部',
                orderState: ORDER_STATE.ALL,
                orderList: [],
                loaded: false,
                pageIndex: 1,
                pageSize: 10,
                loadingState: null
            });
            this.navList = arr;
        },

        changeTab(event) {
            this.currentIndex = event.detail.current;
            this.getOrderList();
        },
        clickTab(index) {
            this.currentIndex = index;
        },
        reset() {
            this.currentIndex = 0; // 初始化到全部tab
            for (let index = 0; index < this.navList.length; index++) {
                const tabElement = this.navList[index];
                tabElement.loaded = false;
                tabElement.pageIndex = 1; // 分页初始化
                tabElement.loadingState = null, //初始值为空，所有状态都不会显示loading
                tabElement.orderList = []
            }
        },
        getOrderList(isSearchByKeyword) {
            if (!isSearchByKeyword && this.currentTab.loaded) {
                return
            }
            // 输入搜索的时候初始化数据状态
            if (isSearchByKeyword) {
                // 搜索时保持当前tab
                let tempIndex = this.currentIndex;
                // 重置
                this.reset();
                this.currentIndex = tempIndex;
            }

            this.$refs?.loading?.open();
            this.assignOrUpdateOrderList();
        },

        // 加载更多
        getMoreOrderList() {
            if (this.currentTab.loadingState === 'noMore') return;
            this.currentTab.pageIndex += 1;
            this.assignOrUpdateOrderList({ loadMore: true });
        },

        // 赋值或者更新列表数据
        async assignOrUpdateOrderList(options = {}) {
            try {
                this.currentTab.loaded && (this.currentTab.loadingState = 'loading');
                let data = await this.loadData();
                this.currentTab.loadingState = null;

                if (!data) {
                    return
                }
                
                if (data && data.list.length < this.currentTab.pageSize) {
                    this.currentTab.loadingState = 'noMore';
                }
                
                const orderList = data.list.map((item) => {
                    this.$set(this.remainTimeMap, item.orderSn, item.remainTime) 
                    return Object.assign({}, item, this.getOrderBtnList(item))
                })
                if (options.loadMore) {
                    this.currentTab.orderList = this.currentTab.orderList.concat(orderList);

                } else {
                    this.currentTab.orderList = orderList;
                }

                this.currentTab.loaded = true;

            } catch (error) {
                console.error(error);
            } finally {
                this.$refs?.loading?.close();
            }
        },

        // 只负责拉取数据，不写业务逻辑,返回一个载有数据的promise
        async loadData() {
            const params = {
                keyword: this.keyword,
                pageSize: this.currentTab.pageSize,
                current: this.currentTab.pageIndex,
                orderState: this.currentTab.orderState == ORDER_STATE.ALL ? undefined : this.currentTab.orderState,
                ...this.searchCondition
            }

            try {
                let res = await orderHandler.getOrderList(params);
                if (res.state == 200) {
                    return Promise.resolve(res.data)
                } else {
                    Promise.resolve(res.data)
                }
            } catch (error) {
                console.error(error);
            } finally {
            }

        },
        timing({ type, remainTime, orderSn }) {
            this.remainTimeMap[orderSn] = remainTime;
        },
        timeout({ type, orderSn }) {
            if (type == 'pay') {
                // this.forceUpdatePage()
                this.fakeUpdatePage(orderSn, ORDER_STATE.WAIT_PAY, ORDER_STATE.CANCELED)
            }
        },
        /**
         * @param {*}  支付成功
         */
        orderPaySuccess(orderSn, oldOrderState) {
            console.log(orderSn, oldOrderState)
            // 支付成功，刷新页面数据 订单状态刷新为待发货
            this.fakeUpdatePage(orderSn, oldOrderState, ORDER_STATE.WAIT_DELIVER);

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
                        console.log(this.cancel);
                        this.$refs?.loading?.open();
                        orderHandler.cancel(param).then(res => {
                            if(res.state == 200){
                                // 选择了添加购物车才加入
                                if (this.isAddCart) {
                                    this.addCart();
                                }
                                if(this.cancel.oldOrderState == 20){
                                    this.getCancelResult()
                                }else{
                                    uni.showLoading({
                                        title: '取消成功',
                                        icon:'none'
                                    })
                                    this.fakeUpdatePage(this.cancel.orderSn, this.cancel.oldOrderState, ORDER_STATE.CANCELED);
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
                this.fakeUpdatePage(this.cancel.orderSn, this.cancel.oldOrderState, ORDER_STATE.CANCELED);
            }
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
        // 捕获 order-button抛出的取消事件
        orderCancel(item) {
            this.order = item;
            const { parentSn, orderSn, orderState } = item;
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

        orderDelete(orderSn, oldOrderState, newOrderState) {
            this.fakeUpdatePage(orderSn, oldOrderState, newOrderState);
        },
        orderConfirm(orderSn, oldOrderState, newOrderState) {
            this.fakeUpdatePage(orderSn, oldOrderState, newOrderState);
        },
        // 在保证数据完整的情况下，前端假刷新
        /**
         * @param {订单号} orderSn 
         * @param {旧状态} oldOrderState 
         * @param {新的状态} newOrderState 
         */
        fakeUpdatePage(orderSn, oldOrderState, newOrderState) {

            // 遍历tab
            for (let i = 0; i < this.navList.length; i++) {

                let nav = this.navList[i];
                // 筛选出全部tab，和符合orderState的tab
                if (nav.name != '全部' && nav.orderState != oldOrderState) {
                    continue;// 下一个tab
                }

                // 遍历tab下的orderList
                for (let j = 0; j < nav.orderList.length; j++) {
                    let order = nav.orderList[j];
                    if (order.orderSn != orderSn) continue;
                    // 删除操作
                    if (newOrderState == ORDER_STATE.DELETED) {
                        nav.orderList.splice(j, 1);
                        continue;
                    }

                    // 订单信息状态更新
                    order.orderState = newOrderState;
                    order.orderStateValue = ORDER_STATE_VAlUE[newOrderState];
                    const { moreBtns, showBtns} = this.getOrderBtnList(order);
                    order.moreBtns = moreBtns;
                    order.showBtns = showBtns;
                    // 全部
                    if (nav.name != '全部') {
                        // 当前订单状态下的订单信息应该移动到下一个订单状态的tab下

                        // 从当前状态的tab下移除
                        nav.orderList.splice(j, 1);
                        let targetTab = this.navList.find(item => item.orderState == newOrderState);

                        // 在符合状态下的tab下添加
                        targetTab && (targetTab.orderList.unshift(order));
                    }
                }
            }
        },

        /**
         * 强制刷新全部tab
         */
        forceUpdatePage() {
            let tempIndex = this.currentIndex;
            // 重置
            this.reset();
            this.currentIndex = tempIndex;
            this.assignOrUpdateOrderList();
        },

        toOrderDetail(orderSn) {
            this.$Router.push({
                path: '/views/order/detail/index',
                query: {
                    orderSn
                }
            })
        },
        toGoodsList() {
            this.$Router.push({
                path: '/views/goods/list/index'
            })
        },
        // 取消商品加入购物车
        addCart() {
            let cartInfoList = [];
            // 主商品才加入购物车
            this.order.orderProductListVOList?.forEach(item => {
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
            cartHandler.addCarts({ cartInfoList }).then(() => {
                this.$store.dispatch('getCartList');
            })
        },
        getOrderBtnList(orderDetail) {
            const isGift = orderDetail.orderProductListVOList[0] && orderDetail.orderProductListVOList[0].productType != 0;
            const key = isGift ? 'btnTypesGift' : 'btnTypes';
            const btnTypes = JSON.parse(JSON.stringify(ORDER_ENUM[orderDetail.orderState][key] || []));
            const invoiceUrls = orderDetail.invoiceApplyInfo?.invoiceUrls;
            let moreBtns = [], showBtns = [];
            if (invoiceUrls?.length <= 0 || !invoiceUrls ) {
            // 不展示查看发票
                const index = btnTypes.indexOf(BUTTON_TYPES.VIEW_INVOICE);
                index > -1 && btnTypes.splice(index, 1);
            } 
            if (orderDetail.invoiceApplyInfo?.invoiceState !== 'INVOICED') {
            // 不展示换开发票
                const index = btnTypes.indexOf(BUTTON_TYPES.RE_INVOICE);
                index > -1 && btnTypes.splice(index, 1);
            } 
            if (orderDetail.invoice || orderDetail.actualPayment <= 0) {
            // 不展示补开发票
                const index = btnTypes.indexOf(BUTTON_TYPES.ADD_INVOICE);
                index > -1 && btnTypes.splice(index, 1);
            }
            const len = btnTypes.length;
            if (len > 3) {
                moreBtns = btnTypes.slice(0, len - 3)
            }
            showBtns = btnTypes.slice(len - 3 < 0 ? 0 : len - 3, len)
            return {
                moreBtns,
                showBtns
            }
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
        /*
         * 跳转搜索页面
         */
        toSearchPage(){
            let option = {
                path: '/views/search/index',
                query: {
                    ifFromOrderPage: true,
                    keyword: this.keyword,
                    orderState: this.currentTab.orderState
                }
            }
            this.$Router.replace(option)
        },
        resetSearch(){
            this.resetKeyword();
            // 清除搜索关键字
            this.filterSearchOrder();
        },
        /*
         * 重置关键字
         */        
        resetKeyword(){
            this.keyword = ''
            this.searchCondition = {};
            // 清除未选中tab栏数据的状态
            //（修复tab栏带条件查询后，缓存了no_more_data的状态，导致清空条件后点击tab栏时不重新请求数据的问题）
            // this.resetTabDataState();

        },
        // 重置tab栏数据的状态
        resetTabDataState(){
            this.navList.forEach((item, index)=>{
                let itemCopy = {...item};
                itemCopy.pageIndex = 1;
                itemCopy.loaded = false;
                itemCopy.loadingState = null;
                this.$set(this.navList, index, itemCopy);
            })
            
        },
        /*
         * 设置筛选条件
         * filterCondition：筛选条件
         */
        setSearchCondition(filterCondition){
            this.searchCondition = filterCondition;

            // 如果是清空日期筛选条件，对应清空其它tab栏数据状态
            // if (Object.keys(filterCondition).length === 0){
            //     this.resetTabDataState();
            // }
        },
        /*
         * 筛选订单
         * filterCondition：筛选条件
         */
        filterSearchOrder(){
            this.resetTabDataState();
            this.getOrderList();
        },

        viewInvoice(previewCallback, invoiceUrls){
            this.previewInvoice = previewCallback;
            this.invoiceUrls = invoiceUrls;
            this.$refs.invoicePopup.open();
        },

        // 将阿拉伯数字改为汉字
        toChinesNumFun(string) {
            return toChinesNum(string)
        },
    }
}
</script>

<style lang="scss" scoped>
$top-bar-height: 160rpx;
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
.top-wrapper {
    height: $top-bar-height;
    background: #ffffff;
    border-radius: 0 0 16rpx 16rpx;
    display: flex;
    flex-direction: column;

    .top-input-wrapper {
        padding: 10rpx 20rpx;
        display: flex;
        align-items: center;

        .input {
            flex-grow: 1;
        }

        .filter_btn {
            width: 32px;
            margin-right: 10px;
        }
    }

    .tab-wrapper {
        flex: 1;
        margin-top: 10rpx;
    }
}


.swiper {
    height: calc(100vh - #{$top-bar-height});

    .swiper-item {
        .scroll-view {
            height: 100%;
        }

        .empty-wrapper {
            display: flex;
            flex-direction: column;
            height: 100%;
            align-items: center;
            justify-content: center;

            .empty-image {
                margin-top: -200rpx;
                width: 256rpx;
                height: 256rpx;
            }

            .empty-dec {
                font-size: 15px;
                color: #999;
            }

            .empty-btn {
                padding: 8px 15px;
                border-radius: 28px;
                margin-top: 10px;
                background-color: $main-color;
                color: #fff;
                font-weight: bold;
                font-size: 16px;
            }
        }
    }
}


.order-container {
    background-color: #fff;
    padding: 0 26rpx;
    /* margin-top: 10px; */
    margin: 20rpx;
    border-radius: 20rpx;
}

.order-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    position: relative;


    .store-info {
        display: flex;
        align-items: center;
        padding-top: 24rpx;

        &>.store-logo {
            width: 32rpx;
            height: 32rpx;
            margin-right: 12rpx;
        }

        &>.store-name {
            height: 34rpx;
            font-size: 30rpx;
            font-weight: 600;
            text-align: justify;
            color: #222222;
            line-height: 34rpx;
        }
    }

    .order-state {
        color: $main-color;
        font-size: 28rpx;
        font-weight: 600;
    }

    .wait-pay {
        display: flex;
        border-radius: 6rpx;
        align-items: center;
        margin-right: -44rpx;
        .left-order-state {
            width: 84rpx;
            height: 34rpx;
            line-height: 34rpx;
            background: linear-gradient(148deg,#fb8453 6%, #ff0000 91%);
            clip-path: polygon(0% 0%, 100% 0%, 76rpx 100%, 0% 100%);
            border-radius: 6rpx 0rpx 0rpx 6rpx;
            text-align: left;
            color: #FFF;
            border: none;
            font-size: 22rpx;
            padding-left: 8rpx;
        }
        .right-state-time {
            font-size: 22rpx;
            font-weight: 600;
            color: #F30300;
            height: 34rpx;
            border: 0.8rpx solid #f30300;
            transform: translateX(-44rpx) rotateZ(360deg);
            border-left: 0;
            padding-left: 52rpx;
            padding-right: 8rpx;
            border-radius: 0rpx 6rpx 6rpx 0rpx;
        }
    }

    // &::after {
    //     content: '';
    //     position: absolute;
    //     width: 100%;
    //     left: 0;
    //     bottom: 0;
    //     border-top: 1px rgb(238, 234, 234) solid;
    // }
}

.order-body {
    .divider {
        // border-top: 1px solid rgb(238, 234, 234);
    }
}


.order-foot {
    .fee-info {
        // padding: 5px 0;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        .num {
            color: #222;
            font-size: 24rpx;
            margin-right: 24rpx;
        }

        .amount {
            font-size: 24rpx;
            color: #222;

            display: flex;
            align-items: flex-end;

            .price-wrapper {
                &>text {
                    color: #222222;
                }

                &>text:nth-child(1) {
                    font-size: 24rpx;
                }

                &>text:nth-child(2) {
                    font-size: 32rpx;
                }

                &>text:nth-child(3) {
                    font-size: 20rpx;
                }
            }
        }
    }
}

.btn-wrapper {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 32rpx 0 36rpx 0;

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

    ::v-deep .more-btn {
        font-size: 28rpx;
        font-weight: 600;
        margin-right: 10rpx;
    }
       

}

.cancel_popup {
    width: 100%;
    background: #FFFFFF;
    width: 100% !important;
    padding-bottom: 120rpx;
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
            height: 148rpx;
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
        }
    }
}
</style>