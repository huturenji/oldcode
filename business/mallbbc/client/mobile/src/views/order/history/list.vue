<template>
    <view class="content" v-if="isShow">
        <view class="order_content">
            <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
                <swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
                    <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData" :lower-threshold="150">
                        <!-- 订单列表 -->
                        <template v-if="tabItem.orderList.length > 0">
                            <view v-for="(item,index) in tabItem.orderList" :key="index"
                                class="order-item flex_column_start_start" @click="goOrderDetail(item.orderSn)">
                                <view class="i-top">
                                    <!-- <text class="order_sn">订单编号：{{item.orderSn}}</text> -->
                                    <view class="store_name">
                                        <image class="store_logo" :src="imgUrl+'goods/store_logo.png'"></image>
                                        <text class="store_name_text">{{item.storeName}}</text>
                                    </view>
                                    <text class="state" :style="{color: item.stateTipColor}">{{item.orderStateValue}}</text>
                                </view>
                                <!-- 循环更改 -->
                                <template v-for="(goodsItem, goodsIndex) in item.orderProductListVOList">
                                    <view v-if="item.orderProductListVOList" class="goods-box flex_row_between_center" :key="goodsIndex">
                                        <view class="left flex_row_start_start">
                                            <view class="goods-img">
                                                <imgThumb :imgSrc="goodsItem.mainImage ? goodsItem.mainImage : defaultImage" />
                                                <view class="no-goods"  v-if="goodsItem.productNum==0"></view>
                                            </view>
                                            <view class='goods_info flex_column_between_start'>
                                                <view class='flex_column_start_start'>
                                                    <view class="goods_name">
                                                        <image v-if="item.orderType==106" :src="imgUrl+'order/icon_dingdan_yiqimai.png'"  class="activityLogo"/>
                                                        <text>{{goodsItem.skuName}}</text>
                                                    </view>                                                    
                                                    <text class="spec_info" v-if="goodsItem.specValues">{{goodsItem.specValues}}</text>
                                                </view>
                                                
                                                <block v-if="goodsItem.productType==0">
                                                    <view class="label_con flex_row_start_start" v-if="item.orderType==103">
                                                        <view class="act_label preSale">预售</view>
                                                        <view v-if="item.orderType==103&&item.deliverTime"
                                                            class="presale_deliver_time">{{item.deliverTime}} 开始发货</view>
                                                    </view>
                                                    <view class="label_con flex_row_start_start" v-if="item.orderType==102">
                                                        <view class="act_label pinGroup">拼团</view>
                                                        <view v-if="item.orderType==103&&item.deliverTime"
                                                            class="presale_deliver_time">{{item.deliverTime}} 开始发货</view>
                                                    </view>
                                                    <view class="label_con flex_row_start_start" v-if="item.orderType==105">
                                                        <view class="act_label ladder">阶梯团</view>
                                                    </view>
                                                    <view class="label_con flex_row_start_start" v-if="item.orderType==104">
                                                        <view class="act_label seckill">秒杀</view>
                                                    </view>
                                                </block>
                                            </view>
                                        </view>
                                        <view class="right flex_column_center_end">
                                            <block v-if="goodsItem.productType==0">
                                                <view class="price_info flex_row_end_end">
                                                    <text class="unit fontScaleIgnore">￥</text>
                                                    <text class="price_int">{{$getPartNumber(goodsItem.productShowPrice,'int')}}</text>
                                                    <text class="price_decimal">{{$getPartNumber(goodsItem.productShowPrice,'decimal')}}</text>
                                                </view>
                                                <text class="goods_num">*{{goodsItem.productNum}}</text>
                                            </block>
                                            <block v-else>
                                                <text class="goods_num_give">{{goodsItem.productType==1?'附件':'赠品'}}</text>
                                                <text class="goods_num">*{{goodsItem.productNum}}</text>
                                            </block>
                                        </view>
                                        <image class="goods_togetherbuy_state" v-if="item.orderType==106" :src="imgUrl + togetherbuyIcons[item.promotionStatus + '']" mode=""/>
                                    </view>
                                </template>
                                <view class="price-box">
                                    {{$L('共')}}{{item.goodsNum}}{{$L('件商品')}}
                                    <text class="order_mount">{{$L('合计')}} :</text>
                                    <view class="total_price flex_row_end_end">
                                        <text class="unit">¥</text>
                                        <text class="price_int">{{$getPartNumber(item.orderAmount,'int')}}</text>
                                        <text class="price_decimal">{{$getPartNumber(item.orderAmount,'decimal')}}</text>
                                    </view>
                                </view>
                                <view class="action-box" v-if="item.state != 9">
                                    <!-- 未发货 订单可以 联系退款 -->
                                    <!-- 一起买 拼团中 未发货 订单可以联系退款 -->    
                                    <button v-if="item.orderState == 20 && !(item.orderType==106)"
                                        class="action-btn flex_row_center_center"
                                        @click.stop="contactCustomerRefund(item)">{{$L('联系客服退款')}}</button>
                                    <!-- 待收货、已完成订单可以查看物流 lookLogistics的方法在订单混入里面 orderMixin-->
                                    <button v-if="item.orderState == 30||item.orderState == 40"
                                        class="action-btn flex_row_center_center"
                                        @click.stop="lookLogistics(item.orderSn)">{{$L('查看物流')}}</button>
                                    <!-- 已取消、待收货、已完成订单可以再次购买 历史订单页面不需要再次购买页面 -->
                                    <button v-if='false && (item.orderState==0||item.orderState == 30||item.orderState == 40&&item.orderProductListVOList[0].productType==0)'
                                        class="action-btn  recom flex_row_center_center"
                                        @click.stop="orderAgain(item, 'orderAgagin')">{{$L("再次购买")}}</button>
                                    <!-- 待收货订单可以确认收货 -->
                                    <button v-if="false && item.orderState == 30" class="action-btn recom flex_row_center_center"
                                        @click.stop="confirmReceipt('open',item.orderSn)">{{$L('确认收货')}}</button>
                                    <!-- 待付款订单可以取消订单 -->
                                    <!-- 一起买 拼团中 未发货 订单可以取消订单 -->
                                    <button v-if="item.orderState == 10 && !$isTransferPay(item.paymentCode) || (item.orderType==106 && item.promotionStatus==0 && item.orderState == 20)" 
                                        class="action-btn flex_row_center_center"
                                        @click.stop="cancelPopup(item)">{{$L('取消订单')}}</button>
                                    <!-- 待付款订单可以立即支付 -->
                                    <button
                                        v-if="item.orderState == 10&&!((item.orderType==105||item.orderType==103)&&item.orderSubState==102&&item.depositRemainTime>0)"
                                        class="action-btn recom flex_row_center_center"
                                        @click.stop="goPay(item)">{{$L('立即支付')}}</button>
                                    <!-- 待付款、拼团中 邀请朋友一起买 item.orderState == 20 && item.orderType==106 -->
                                    <button v-if="item.orderState == 20 && item.orderType==106 && item.promotionStatus==0"
                                        class="action-btn recom flex_row_center_center"
                                        @click.stop="goShare(item)">{{$L('邀请朋友一起买')}}</button>                                        
                                    <!-- 已取消、全部评价完成订单可以删除订单 -->
                                    <!-- <button v-if='item.orderState==0||(item.orderState==40&&item.evaluateState==3)' -->
                                        <button v-if='item.orderState==0||item.orderState==40'
                                        class="action-btn flex_row_center_center"
                                        @click.stop="delOrder(item.orderSn)">{{$L("删除订单")}}</button>
                                </view>
                            </view>
                        </template>
                        <view v-if="tabItem.loadingState != 'first_loading'&&tabItem.orderList.length == 0"
                            class="empty_part flex_column_start_center">
                            <view class="imgWrap"></view>
                            <text>{{$L('这里空空如也~快去商品中心加购商品吧！')}}</text>
                            
                        </view>
                        <loadingState v-if="tabItem.loadingState == 'first_loading'||tabItem.orderList.length > 0" :state='tabItem.loadingState' />

                    </scroll-view>


                </swiper-item>

            </swiper>
        </view>

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
                        <switch :checked="isAddCart" @change="switchChange" color="#f30300"/>
                    </view>
                </view>
                <view class="cancel_popup_btn">
                    <text class="" @click="notCancel()">{{$L('暂不取消')}}</text>
                    <text class="" @click="confirmCancel()">{{$L('确定取消')}}</text>
                </view>
            </view>
        </bottomPopup>
        
        <!-- 预售，阶梯团定金取消订单提示 -->
        <uni-popup ref="popup" type="dialog">
            <uni-popup-dialog type="input" title ="提示" content="取消该订单定金不予退还,确定取消?" :duration="2000"  @close="acDialog(false)" @confirm="acDialog(true)"></uni-popup-dialog>
        </uni-popup>
        
        
        <!-- 确认收货提示 -->
        <uni-popup ref="receivePopup" type="dialog">
            <uni-popup-dialog type="input" title ="确认货收到了吗？" content="为了保证你的售后权益,请收到商品确认无误后再确认收货" :duration="2000"  @close="acDialog(false)" @confirm="confirmReceipt('confirm')"></uni-popup-dialog>
        </uni-popup>
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
                            <!-- <view class="good_spec">
                                <text>{{item.specValues}}</text>
                            </view> -->
                            <text class="num">*{{item.number}}</text>
                        </view>
                    </view>

                </view>
                <view class="part_no_goods_another">
                    <view class="btn tocart" @click="toCart">
                        {{$L('去购物车')}}
                    </view>
                    <view class="btn return" @click="hide_good_dialog">
                        {{$L('返回订单列表')}}
                    </view>
                </view>
            </view>
        </view>
        <!-- 商品全部，部分无货弹窗 end-->
        <!-- 分享弹框 start -->
        <view class="share_model" v-if="share_model" @touchmove.stop.prevent="moveHandle">
            <view class="bizmateshareWrap">
                <share @close="share_model=false" :shareOptions="shareOptions" :supportTypes="supportTypes"></share>
            </view>
        </view>
        <!-- 分享弹框 end -->           
    </view>
</template>

<script>
import loadingState from "@/components/loading/loading.vue";
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import cartHandler from "@/components/cart/handler";
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
import mixin from '@/common/mixin/orderMixin' //订单混入
// import {polyfill} from '@/utils/common.js'
import bottomPopup from '@/components/bottom-popup/index.vue'

import imgThumb from "@/components/goods/thumb/imgThumb.vue";
import orderHandler from '@/components/order/handler';
import shareHandler from '@/utils/shareHandler.js';
import share from '@/components/share/index.vue'
import {
    mapMutations,
    mapState
} from 'vuex';
export default {
    mixins:[mixin],
    components: {
        loadingState,
        uniPopup,
        uniPopupDialog,
        imgThumb,
        share,
        bottomPopup
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            tabCurrentIndex: 0,
            navList: [{
                state: 0,
                text: this.$L('全部'),
                loadingState: 'first_loading',
                orderList: [],
                current: 1 //分页
            }],
            stopPullDownRefresh: false, //是否下拉刷新中
            current: '0', //取消原因当前点击的是第0项
            reasonId: -1, //取消原因当前点击的原因id
            cancelList: [], //取消原因列表
            curOrderSn: '', //当前订单的订单号
            isHasMore: true,
            pn: 1,
            recGoodsList: [],
            isloading: 'first_loading',
            isShow: false,
            recommendShow: false,//推荐商品是否显示
            ifOnShow: false,
            selOrderSn:'',
            showState:false,
            defaultImage:'./static/shared/order/icon_mall_liwu.png',
            no_good_info:[],
            store_show_no_good:false,
            isAddCart: true, //取消订单的时候 是否加入购物车
            cancleOrderInfo: {}, //要取消订单的该订单的订单详情 目前的用处是取消订单的时候 有加入购物车的功能
            supplierStr:'',
            onlyVop:true,
            searchCondition: {}, // 订单日期筛选条件
            ifConditionChange:false, // 记录筛选条件是否变化
            share_model: false, //分享弹框
            shareOptions:{},//分享所需的参数
            supportTypes:[],//当前渠道下支持的H5 sharetype     
            togetherbuyIcons:
            {//一起买不同的状态下的标签图 promotionStatus integer($int32)orderTyp = 106时，有效： 0-进行中，1-拼团成功，2-拼团失败。3-进行中（场次已结束，但还没有出结果，15分钟）
                0: 'order/icon_common_pintuanzhong.png',
                3: 'order/icon_common_pintuanzhong.png',
                1: 'order/icon_common_pintuanchengong.png',
                2: 'order/icon_common_pintuanshibai.png'
            }      
        };
    },
    mounted(){
        /*
         * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
         * 替换onLoad下代码即可
         */

        if (this.$Route.query.state) {
            this.tabCurrentIndex = +this.$Route.query.state;
        } else {
            this.tabCurrentIndex = this.orderTabIndex;
        }

        let index = this.tabCurrentIndex;
        let navItem = this.navList[index];
        navItem.loadingState = 'first_loading';
        navItem.orderList = [];
        navItem.current = 1;
        this.loadData();
        uni.showLoading()
    },
    onShow() {
        if (!this.$route.query.pageFrom){
            this.resetKeyword();
        }
        if (this.showState){
            let index = this.tabCurrentIndex;
            let navItem = this.navList[index];
            navItem.loadingState = 'first_loading';
            navItem.orderList = [];
            navItem.current = 1;
            this.loadData();
            this.showState = false
        }  
    },
    computed: {
        ...mapState(['userInfo', 'hasLogin','orderTabIndex','orderSearchKeyword'])
    },
    //下拉刷新
    onPullDownRefresh() {
        let index = this.tabCurrentIndex;
        let navItem = this.navList[index];
        navItem.loadingState = 'first_loading';
        navItem.orderList = [];
        navItem.current = 1;
        this.stopPullDownRefresh = true; //下拉刷新状态
        this.loadData();
    },
    methods: {
        ...mapMutations(['setOrderTabIndex','setOrderSearchKeyword']),
        //甄选推荐
        getData() {
            if (this.tabCurrentIndex != 1) {
                this.$refs['recomment_goods'+this.tabCurrentIndex][0].getMoreData();
            }
        },

        // 联系商家退款按钮 目前的处理方式就是直接跳转客服，然后把商品的卡片带过去，也就是现在的联系商家的处理逻辑 gotoCustomerService方法在orderMixin里面
        contactCustomerRefund(item){
            this.gotoCustomerService(item, 'list');
        },
        //获取订单列表
        loadData(source) {
            // if(this.recommendShow){//如果已经展示甄选推荐的话，上拉加载甄选推荐商品
            // this.getData()
            // }else{
            //将订单挂载到tab列表下,起到缓存的效果，避免多次请求
            let index = this.tabCurrentIndex;
            let navItem = this.navList.filter(item => item.state == index)[0];
            // let state = navItem.state;
            
            const ifHasCondition = Object.keys(this.searchCondition).length > 0;
            
            if (source === 'tabChange' && navItem.loadingState !== 'first_loading' && !ifHasCondition) {
                //tab切换只有第一次需要加载数据
                return;
            }
            if (navItem.loadingState === 'loading') {
                //防止重复加载
                return;
            }


            if (this.orderSearchKeyword){
                this.searchCondition = {keyword:this.orderSearchKeyword}
            }
            if (navItem.loadingState != 'no_more_data'){
                this.getOrderList()
            }

        },
        //此方法只有删除订单，取消订单等需要从列表中删除订单时调用，其余获取订单列表请调用loadData
        getOrderList() {
            let index = this.tabCurrentIndex;
            let navItem = this.navList.filter(item => item.state == index)[0];
            let param = {};
            param.pageSize = 10;
            if (Object.keys(this.searchCondition).length > 0){
                
                // 重置分页索引
                if (this.ifConditionChange){                 
                    navItem.current = 1;
                }
                
                param = {...param,...this.searchCondition};

            }
            param.current = navItem.current;
            
            navItem.loadingState = navItem.loadingState == 'first_loading' ? navItem.loadingState : 'loading';
            //状态处理
            if (navItem.state == 0) {
                param.state = ''; //全部订单
            } else if (navItem.state == 1) {
                param.orderState = 10; //待付款
            } else if (navItem.state == 2) {
                param.orderState = 20; //待发货
            } else if (navItem.state == 3) {
                param.orderState = 30; //待收货
            } else if (navItem.state == 4) {
                //待评价
                param.orderState = 40;
            }

            orderHandler.getOrderList(param).then(res => {
                if (res.state == 200) {
                    if (navItem.current == 1) {
                        navItem.orderList = res.data.list
                    } else {
                        navItem.orderList = navItem.orderList.concat(res.data.list);
                    }
                    let hasMore = this.$checkPaginationHasMore(res.data.pagination); //是否还有数据
                    if (hasMore) {
                        navItem.current++;
                        navItem.loadingState = 'allow_loading_more';

                    } else {
                        navItem.loadingState = 'no_more_data';
                        this.recommendShow = true
                    }
                    uni.hideLoading();
                    this.isShow = true;
                    this.ifConditionChange = false;
                } else {
                    this.$api.msg(res.msg);
                }
                if (this.stopPullDownRefresh) {
                    this.stopPullDownRefresh = false;
                    uni.stopPullDownRefresh();
                }
            }).catch(() => {
                //异常处理             
                // navItem.orderList = []
            })
            
        },
        //刷新当前列表
        refreshOrderList() {
            let index = this.tabCurrentIndex;
            let navItem = this.navList.filter(item => item.state == index)[0];
            navItem.current = 1
            this.getOrderList()
        },
        //swiper 切换
        changeTab(e) {
            this.tabCurrentIndex = e.target.current;
            this.isHasMore = true;
            this.pn = 1;
            this.recGoodsList = [];
            this.isloading = 'first_loading';
            this.loading = false;
            this.loadData('tabChange');
        },
        //顶部tab点击
        tabClick(index) {
            this.setOrderTabIndex(this.index);
            this.tabCurrentIndex = index;
            this.isHasMore = true;
            this.pn = 1;
            this.isloading = 'first_loading';
            this.loading = false;
            this.recGoodsList = [];
        },
        
        //跳转订单详情页
        goOrderDetail(orderSn) {
            this.showState= true
            this.$Router.push({path:'/views/order/history/detail',query:{orderSn}})
        },
        //删除订单操作
        delOrder(orderSn) {
            let that = this;
            uni.showModal({
                title: '提示',
                content: '确定删除该订单?',
                success: function (modalres) {
                    if (modalres.confirm) {
                        let param = {};
                        param.orderSn = orderSn;
                        orderHandler.delete(param).then(res => {
                            if (res.state == 200) {
                                that.refreshOrderList();
                                that.refreshOrder()
                                that.$api.msg(res.msg);
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
        /*
         * 再次购买 订单级别的 也就是再次加入购物车
         */
        orderAgain(orderInfo, type){
            let that = this;
            if (!!orderInfo.orderProductListVOList && orderInfo.orderProductListVOList.length > 0){
                let goodsFilter = orderInfo.orderProductListVOList.filter(item => { //目前只有主商品才能加入购物车 即productType为0的时候
                    item.storeId = orderInfo.storeId
                    item.number = item.productNum
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

        // 取消订单的时候，加入购物车切换switch的回调
        switchChange: function (e) {
            this.isAddCart = e.target.value
        },
            
        // 加入购物车
        addCart(list, type="orderAgagin"){
            if (this.hasLogin){ //登录
                let param = {
                    cartInfoList:list
                }
                if (!!this.$getStorageSync('addressId')){
                    param.addressId = this.$getStorageSync('addressId')
                }
                cartHandler.addCarts(param).then(res=>{
                    uni.hideLoading();
                    if (res.state == 200){
                        this.$store.dispatch('getCartNum'); //更新购物车商品数量
                        if (type == 'orderAgagin'){ //再次预定的会跳转页面
                            this.$Router.push({path:'/pages/cart/cart'})
                        }
                    } else if (res.state == 255){
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
                        uni.showToast({
                            title:res.msg,
                            icon:'none',
                            duration:700
                        })
                    }
                })
            } else {
                uni.hideLoading();
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
        //立即支付
        goPay(val) {
            let goodsInfo = val.orderProductListVOList[0];
            this.showState= true
            // 整合商品相关的参数
            let products = [
                {
                    number: goodsInfo.productNum,
                    sku: goodsInfo.sku
                }
            ];
            if (val.orderType == 105 && val.orderSubState == 102 && val.depositRemainTime == 0) {
                //阶梯团付尾款
                this.$Router.push({
                    path:'/views/order/confirm/normal',
                    query:{
                        products: JSON.stringify(products),
                        orderSn: val.orderSn
                    }
                })
            } else if (val.orderType == 103 && val.orderSubState == 102 && val.depositRemainTime == 0) {
                this.$Router.push({
                    path:'/views/order/confirm/normal',
                    query:{
                        products: JSON.stringify(products),
                        orderSn:val.orderSn
                    }
                })
            } else {
                this.$Router.push({path:'/pages/order/pay',query:{amount: val.orderAmount, orderSn: val.orderSn,paySn:val.paySn,payMethodType:'orderList'}})
            }
        },
        //打开取消订单弹框
        cancelPopup(item) {
            if (!item.isRefundDeposit&&(item.orderType==105||item.orderType==103)&&item.orderSubState==102){
                this.curOrderSn = item.parentSn;
                this.$refs.popup.open()
            } else {
                this.cancleOrderInfo = item; //给要取消的订单信息赋值给cancleOrderInfo变量
                this.$refs.cancelPopup.open();
                this.curOrderSn = item.parentSn;
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
                    this.reasonId = this.cancelList[0].reasonId;
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
                title: '提示',
                content: '确定取消该订单?',
                success: function (modalres) {
                    if (modalres.confirm) {
                        let param = {};
                        param.parentSn = that.curOrderSn;
                        param.reasonId = that.reasonId;
                        orderHandler.cancel(param).then(res => {
                            if (res.state == 200) {
                                //订单取消成功过之后，如果勾选了加入购物车按钮，此时需要调取加入购物车的功能，此时的功能和再次购买的功能是一致的，因为再次购买 目前也是加入购物车
                                try {
                                        
                                    if (!!that.isAddCart){
                                        that.orderAgain(that.cancleOrderInfo, 'cancleOrder')
                                    }
                                } catch (error) {
                                    console.log(error)
                                }

                                that.refreshOrderList()
                                that.refreshOrder()
                                that.$api.msg(res.msg);


                                that.$refs.cancelPopup.close();
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


        //更新当前页面方法
        goRefresh() {
            let pages = getCurrentPages();
            let currPage = pages[pages.length - 1]; //当前页面
            let index = this.tabCurrentIndex;
            let navItem = this.navList[index];
            navItem.loadingState = 'first_loading';
            navItem.orderList = [];
            navItem.current = 1;
            currPage.loadData(); //更新当前页面数据
        },
        
        // 确认收货
        confirmReceipt(type,orderSn) {
            switch (type){
            case 'open':{
                this.selOrderSn = orderSn
                this.$refs.receivePopup.open()
                break;
            }
            case 'confirm':{
                this.$refs.receivePopup.close()
                let param = {
                    orderSn: this.selOrderSn
                }
                orderHandler.receive(param).then(res => {
                    if (res.state == 200) {
                        uni.showToast({
                            title: '收货成功！',
                            icon: 'none',
                            duration: 700
                        })
                        this.refreshOrderList();
                        this.refreshOrder()
                    } else {
                        this.$api.msg(res.msg)
                    }
                })
                break;
            }
            default:
            }
        },
        
        //当全部的部分订单操作后，其他状态的列表要更新
        refreshOrder(){
            let index = this.tabCurrentIndex;
            if (index==0){
                this.navList[1].loadingState = 'first_loading'
                this.navList[2].loadingState = 'first_loading'
                this.navList[3].loadingState = 'first_loading'
            }
        },
        resetSearch(){
            this.resetKeyword();
            // 清除搜索关键字
            this.getOrderList();
        },
        /*
         * 重置关键字
         */        
        resetKeyword(){
            
            this.setOrderSearchKeyword('');

            this.searchCondition = {};

            // 清除未选中tab栏数据的状态
            //（修复tab栏带条件查询后，缓存了no_more_data的状态，导致清空条件后点击tab栏时不重新请求数据的问题）
            this.resetTabDataState();

        },
        // 重置tab栏数据的状态
        resetTabDataState(){
            this.navList.forEach((item,index)=>{
                let itemCopy = {...item};
                itemCopy.current = 1;
                this.$set(this.navList,index,itemCopy);
                
            })
            
        },
        /*
         * 设置筛选条件
         * filterCondition：筛选条件
         */
        setSearchCondition(filterCondition){
            this.searchCondition = filterCondition;

            // 如果是清空日期筛选条件，对应清空其它tab栏数据状态
            if (Object.keys(filterCondition).length === 0){
                this.resetTabDataState();
            }
        },
        /*
         * 筛选订单
         * filterCondition：筛选条件
         */
        filterSearchOrder(){
            this.resetTabDataState();
            this.getOrderList();
        },
        /**
         * 邀朋友一起买
         */
        goShare(order){
            //一起买的订单只有一个SKU，所以直接取值即可
            let goodData = order.orderProductListVOList[0]
            goodData.images = [goodData.mainImage]
            this.setShareInfo(goodData);
            // this.setThirdShare(goodData);
            //2022-10-28临时屏蔽商品详情的微信分享
            this.share_model = true;
        },
        /**
         * 处理分享所需数据
         */
        async setShareInfo(goodsData){
            let that = this;
            if (!!!goodsData.sku){ return } //等有数据了，才能去分享
            let location = window.location;
            let callBackUrl = location.origin+location.pathname+'#/standard/product/detail?sku='+goodsData.sku;
            let appInfo = {};
            try {
                appInfo = await shareHandler.getAppConfig();
            } catch (error) {
            }
            let appId = appInfo.appId || '268435729';
            let appName = '比N家';
            that.shareOptions = {
                title : goodsData.skuName, // 分享标题
                desc : '我在商城发现不错的商品，点击查看', // 分享描述
                link : callBackUrl, // 分享链接
                imgUrl : goodsData.images[0] || require('../../../static/shared/user/logo.png'), // 分享图标,图片绝对地址  
                appId: appId+'',//小应用Id
                appName: appInfo.appName || appName || '比N家',//小应用名字,无合法appId时使用appName
                contentType : 'link' // 分享类型,music、video或link，不填默认为link
            }
        },
        /**
         * setThirdShare
         */
        setThirdShare(goodsData){
            // #ifdef H5
            //设置第三方（微信、朋友圈等）分享信息
            let location = window.location;
            let callBackUrl = location.origin+location.pathname+'#/standard/product/detail?sku='+goodsData.sku;
            let shareInfo = {
                title:goodsData.skuName, // 分享标题
                desc:'我在商城发现不错的商品，点击查看', // 分享描述
                link:callBackUrl, // 分享链接
                imgUrl: goodsData.images[0] || require('../../../static/shared/user/logo.png') // 分享图标,图片绝对地址 
            }
            //设置二次分享
            shareHandler.setThirdShareInfo(shareInfo);
            // #endif
        }
    },
    watch:{
        searchCondition:{
            handler(){              
                // 记录筛选条件是否已经变化
                this.ifConditionChange = true; 
            },
            deep:true  
        },
        $route: {
            handler(to) {
                if (to.meta.navigationBarTitleText !== '我的订单'){
                    this.setOrderSearchKeyword('');
                }
            }
        }

    }
}
</script>

<style lang="scss">
    ::v-deep .uni-radio-input-checked,
    ::v-deep .uni-switch-input-checked {
        background-color: var(--radioCheckedColor) !important;
        border-color: var(--radioCheckedColor) !important;
    }

    ::v-deep .nav-item.current {
        color: var(--radioCheckedColor) !important;

        &::after {
            background-color: var(--radioCheckedColor) !important;
        }
    }

    page,
    .content {
        position: relative;
        background: $bg-color-split;
        height: 100%;
        width: 750rpx;
        margin: 0 auto;
    }

    .order_content {
        height: calc(100%);
        display: flex;
        flex-direction: column;
    }

    .swiper-box {
        flex: 1;
        height: 0;
    }


    .list-scroll-content {
        height: 100%;
        .flex_row_center_center_goshopping{
            display: flex;
            justify-content: center;
            align-items: center;
            width: initial;
            min-width: 240rpx; 
        };
        .right flex_column_center_end{
            background-color: red;
        }
    }

    .label_con {
        position: relative;
        left: 0;

        .act_label {
            height: 36rpx;
            border-radius: 15rpx;
            line-height: 36rpx;
            padding: 0 14rpx;
        }

        .preSale {
            // width: 38px;
            // height: 14px;
            background: linear-gradient(90deg, #EC0093 0%, #FF085B 100%);
            border-radius: 4rpx;
            color: #fff;
            font-size: 24rpx;

        }
        
        .pinGroup{
            background: linear-gradient(45deg, #FF6000 0%, #FF9C00 100%);
            border-radius: 4rpx;
            color: #fff;
            font-size: 24rpx;
        }
        
        .ladder{
            background: linear-gradient(22deg, #FE901E 0%, #FEAD28 100%);
            color: #fff;
            font-size: 24rpx;
            border-radius: 4rpx;
        }
        
        .seckill{
            background: linear-gradient(to right, #fc5300, #ff1353);
            color: #fff;
            font-size: 24rpx;
            border-radius: 4rpx;
        }
    }

    
    .uni-noticebar{
        margin-bottom: 0;
    }
    .uni-swiper-item {
        height: auto;
    }

    .order-item {
        width: 100%;
        padding-left: 20rpx;
        background: #fff;
        margin-bottom: 20rpx;

        .i-top {
            display: flex;
            align-items: center;
            padding-right: 20rpx;
            position: relative;
            width: 100%;
            margin-top: 30rpx;
            border-bottom: 1rpx solid #f2f2f2;
            padding-bottom: 30rpx;

            .store_name {
                flex: 1;
                display: flex;
                align-items: center;

                image {
                    width: 34rpx;
                    height: 32rpx;
                    transform: scale(0.9);
                }

                .store_name_text {
                    font-size: 26rpx;
                    color: #2d2d2d;
                    font-weight: bold;
                    margin-left: 10rpx;
                    flex: 1;
                    word-break: break-all;
                }

                .store_logo_right {
                    width: 13rpx;
                    height: 22rpx;
                    margin-left: 10rpx;
                }
            }

            .state {
                font-size: 26rpx;
                color: var(--tagColor);
            }
        }

        .goods-box {
            position: relative;
            padding: 20rpx 0;
            width: 100%;
            border-bottom: 1rpx solid #f2f2f2;
            .goods_return_status {
                position: absolute;
                bottom: 24rpx;
                right: 21rpx;
                font-size: 22rpx;
                color: #FC1C1C;
            }
            .goods_togetherbuy_state {
                position: absolute; 
                top: 130rpx;
                left: 25rpx;
                width: 150rpx;
                height: 150rpx;        
                z-index: 20;
            }

            .left {
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

                .goods_info {
                    margin-left: 25rpx;
                    padding-top: 10rpx;
                    height: 200rpx;
                    width: 100%;

                    .goods_name {
                        color: #2D2D2D;
                        font-size: 28rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        word-break: break-all;
                        line-height: 150%;
                        .activityLogo{
                            width: 80rpx;
                            height: 30rpx;
                            vertical-align: text-top;
                            margin-right: 10rpx;
                            margin-top: 6rpx;
                        }
                    }

                    .spec_info {
                        color: #949494;
                        font-size: 24rpx;
                        line-height: 40rpx;
                        background-color: #F8F8F8;
                        padding: 3rpx 7rpx;
                        border-radius: 6rpx;
                        margin-top: 10rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }

                    .presale_deliver_time {
                        padding: 0 6rpx;
                        border: 2rpx solid #F30303;
                        font-size: 24rpx;
                        color: #F30303;
                        position: absolute;
                        left: 90rpx;
                        white-space: nowrap;
                    }
                }
            }


            .right {
                padding: 0 30rpx 0 24rpx;
                flex-shrink: 0;

                .price_info {
                    color: $main-font-color;
                    font-weight: bold;
                    align-items: baseline;

                    .unit.fontScaleIgnore,
                    .price_decimal {
                        font-size: 24rpx;
                        line-height: 28rpx;
                    }

                    .price_int {
                        font-size: 32rpx;
                        line-height: 32rpx;
                    }
                }

                .goods_num {
                    color: #2D2D2D;
                    font-size: 24rpx;
                }
                .goods_num_give{
                    color: #2D2D2D;
                    font-size: 28rpx;
                    font-weight: bold;
                }

                .title {
                    font-size: 24rpx;
                    color: $font-color-dark;
                    line-height: 1;
                }

                .attr-box {
                    font-size: 22rpx;
                    color: $font-color-light;
                    padding: 10rpx 12rpx;
                }
            }
        }

        .price-box {
            display: flex;
            justify-content: flex-end;
            align-items: baseline;
            padding: 0 18rpx;
            font-size: 24rpx;
            color: #949494;
            width: 100%;
            margin-top: 30rpx;
            position: relative;

            .order_type {
                position: absolute;
                left: 0;
                top: 0;
                background: linear-gradient(22deg, #FE901E 0%, #FEAD28 100%);
                height: 36rpx;
                padding: 0 14rpx;
                color: #fff;
                border-radius: 18rpx;
                font-size: 22rpx;
            }

            .order_mount {
                color: #333333;
                font-size: 24rpx;
                margin-left: 20rpx;
            }

            .total_price {
                color: #2D2D2D;
                font-weight: bold;
                align-items: baseline;
                margin-left: 15rpx;

                .unit,
                .price_decimal {
                    font-size: 24rpx;
                }

                .price_int {
                    font-size: 32rpx;
                    line-height: 32rpx;
                    margin-left: 5rpx;
                }
            }

        }

        .action-box {
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
            height: 70rpx;
            position: relative;
            padding-right: 20rpx;
            width: 100%;
            padding-bottom: 20rpx;
            margin-top: 30rpx;
        }

        .action-btn {
            min-width: 125rpx;
            padding: 0 10rpx !important;
            height: 50rpx;
            margin: 0;
            margin-left: 10rpx;
            padding: 0;
            text-align: center;
            line-height: 50rpx;
            font-size: 24rpx;
            color: $main-font-color;
            background: #fff;
            border-radius: 25rpx;
            border: 1rpx solid #eeeeee;

            &:after {
                border: none;
            }

            &.recom {
                color: var(--confirmBtnTextColor);
                background: var(--confirmBtnBgColor2);
                border: none;
            }
        }
    }


    .empty_part {
        padding-top: calc((100vh - 268rpx - var(--titleBarFillHeight, 0px))*0.32 - 128rpx);

        .imgWrap {
            width: 256rpx;
            height: 256rpx;
            background: var(--emptyImg);
            background-size: 100%;
        }

        text {
            color: $main-third-color;
            font-size: 28rpx;
        }

        button {
            width: 245rpx;
            height: 66rpx;
            background: var(--confirmBtnBgColor2);
            border-radius: 33rpx;
            color: var(--buyNowColor);
            font-size: 30rpx;
            font-weight: bold;
            margin-top: 29rpx;
            border: none;
        }

        uni-button:after {
            border-radius: 200rpx;
            border-color: #fff;
        }
    }

    .cancel_popup {
        width: 100%;
        height: 100%;
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
            z-index: 150;
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
            padding: 0 30rpx;

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
    .Giveaway{
        width: 100rpx;
        height: 40rpx;
        border: 1rpx solid red;
        line-height: 40rpx;
        text-align: center;
        color: red;
        font-size: 25rpx;
        border-radius: 10rpx;
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
<style lang="scss" scoped>
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
.bizmateshareWrap{
    position: absolute;
    left: 0;
    right:0;
    bottom: 0;
}
</style>
