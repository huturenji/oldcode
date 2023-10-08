<template>
    <div class="page-index-order" :class="{footerBar:showFooter}">
        <div class="main-content">
            <Platform name="serviceReminders"></Platform>
            <header>
                <nav>
                    <ul>
                        <li class="cursorp" :class="!payStatus && 'selected'" @click="changeOrderStatus()">全部</li>
                        <li class="cursorp" :class="payStatus=='0' && 'selected'" @click="changeOrderStatus('0')">待支付<div class="redpPoint" v-if="orderCounts[0]>0">{{orderCounts[0]>99?'99+':orderCounts[0]}}</div></li>
                        <li class="cursorp" :class="payStatus=='1' && 'selected'" @click="changeOrderStatus('1')">待出行<div class="redpPoint" v-if="orderCounts[1]>0">{{orderCounts[1]>99?'99+':orderCounts[1]}}</div></li>
                        <li class="cursorp" :class="payStatus=='2' && 'selected'" @click="changeOrderStatus('2')">退款/售后<div class="redpPoint" v-if="orderCounts[2]>0">{{orderCounts[2]>99?'99+':orderCounts[2]}}</div></li>
                    </ul>
                </nav>
            </header>
            <div class="search-container" v-if='!showSearch'>
                <div class='condition'>
                    <div class='search-block icon-btn' @click='openSearch'>
                        <Icon type="search" class="icon" size='.3'/>
                        <span>搜索</span>
                    </div>
                    <div class="filter icon-btn cursorp" @click="showFilterBlock=!showFilterBlock" v-if="orderListFilterConfig">
                        <Icon type="filter" class="icon" size='.3'/>
                        <span class="filter-content">筛选</span>
                    </div>
                </div>
                <div class="filter-select" v-if="showFilterBlock">
                    <div class="header">
                        <Icon type="filter" class="icon" size='.3'/>
                        <span class="filter-content">筛选</span>
                    </div>
                    <div class='block'>
                        <div class='title'>订单类型</div>
                        <ul>
                            <li class="normal-btn cursorp" :class='{"selected": orderTypeChecked(type.key)}' v-for="type in orderTypeArr" :key="type.value"
                                @click="chechOrderType(type.key)">
                                {{type.value}}
                                <Icon type='icon_select' size='.3' v-if="orderTypeChecked(type.key)"/>
                            </li>
                        </ul>
                    </div>
                    <div class='block'>
                        <div class='title'>下单日期</div>
                        <ul>
                            <li class="normal-btn cursorp" :class='{"selected": dateFilterChoose==type.value}' v-for="type in dateFilterArr" :key="type.value"
                                @click="chechDateFilter(type)">
                                {{type.text}}
                                <Icon type='icon_select' size='.3' v-if="dateFilterChoose==type.value"/>
                            </li>
                        </ul>
                        <div v-if="dateFilterChoose=='cust'" class='cust-date cursorp'>
                            {{searchCondition.scheduledTime[0] | dateFormat }} <span class='split'></span> {{searchCondition.scheduledTime[1] | dateFormat}}
                        </div>
                        <SnRangePicker v-show='false' ref='datePicker' :disabled-date='disabledDate' v-model="searchCondition.scheduledTime"  separator='\/'/>
                    </div>
                    <div class='btn-group cursorp'>
                        <div class='reset btn' @click='resetFilter'>重置</div>
                        <div class='confirm btn' @click='search'>确定</div>
                    </div>
                </div>
            </div>
            <div v-if='showSearch' class='search-page'>
                <searchBar ref='searchBar' placeholder='出发地、目的地、航司、酒店、订单号' v-model="searchCondition.keyword" @search='search' @cancel='cancelSearch' @focus="onSearchFocus"/>
            </div>
            <history v-if='showSearch && showSearchHistory' :historyKey='searchHistoryKey' @choose='chooseHistory'/>

            <div v-transfer-dom>
                <loading :show="popLoading"></loading>
            </div>

            <!--结果列表-->
            <div class="content" id="content" v-show='!showSearchHistory'>
                <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
                    <div id='dataList'>
                        <OrderItem class='order-item-container' v-for="orderItem in orderList" :key="orderItem.orderNo"
                            :orderItem="orderItem" @goPage="goPage" @togglePopLoading="togglePopLoading" @refreshOrderDetail="getListOrderCount()"></OrderItem>
                    </div>
                </mescrollVue>
            </div>
            <div class="filter-mask cursorp" v-if="showFilterBlock" @click="closeFilter"></div>
        </div>
        <div>
            <div class="invoice-btn icon-btn cursorp" :class="{footerBar:showFooter}" @click="toInvoice" v-if="reimbursementConfig">
                <div>报销</div>
                <div>凭证</div>
            </div>
        </div>
    <div>
        <footerBar v-if='showFooter' :activeType="'order'"/>
    </div>          
    </div>
</template>

<script>
import extendUtils from 'orderCommon/extend.js';
import { Loading,TransferDom } from 'vux';
import { getStatusByCategory } from 'orderCommon/enum/orderStatusEnum.js';
import requestHandler from 'orderCommon/requestHandler.js';
import {getAPPCustomConfigs} from 'orderCommon/customFunctionConfigs.js';
import {SnRangePicker} from 'sinosun-ui';
import MescrollVue from 'mescroll.js/mescroll.vue'
const OrderItem = ()=>import('../orderItem/orderItem.vue');
const Platform = ()=>import('components/announcement/index');
const footerBar = ()=>import('components/footerBar/footerBar.vue');
const Icon = ()=>import('components/icon');
// const SnLoading = ()=>import('components/loading');
const searchBar = ()=>import('components/search/searchBar')
const history = ()=>import('components/search/history')

export default {
    directives: {
        TransferDom
    },
    mixins: [extendUtils.mixin.tChatEventMixin],
    components: {SnRangePicker, Loading, OrderItem, Platform,Icon,searchBar, history,MescrollVue,footerBar },
    data() {
        return Object.assign(extendUtils.stateManager.setData([], this), {
            orderDispatch: 1,//订单列表类型区分 1：我的订单；0：订单管理
            initPageFlag: true,//第一次加载页面
            isLoading: true,
            showFilterBlock: false,
            searchParam: null,
            filterContent: null,//筛选条件
            orderList: [],
            payStatus: this.$route.params.payStatus,//订单状态
            orderType: null,//订单分类
            orderTypeArr: [
                {
                    key: null,
                    value: '全部订单'
                },
                {
                    key: "1",
                    value: '机票'
                },
                {
                    key: "2",
                    value: '酒店'
                },
                {
                    key: "3",
                    value: '火车票'
                }
                // {
                //     key: "6",
                //     value: '商务用车',
                // }
            ],
            dateFilterArr: [
                {
                    text: '不选择',
                    value: null
                },
                {
                    text: '近一周',
                    value: -7,
                    type: 'day'
                },
                {
                    text: '近一个月',
                    value: -1,
                    type: 'month'
                },
                {
                    text: '近三个月',
                    value: -3,
                    type: 'month'
                },
                {
                    text: '近半年',
                    value: -6,
                    type: 'month'
                },
                {
                    text: '自定义',
                    value: 'cust'
                }
            ],
            fullScreen: false,
            screenWidth: document.body.clientWidth,
            showPersion: false,
            showOrgnization: false,
            orderListFilterConfig:true,//订单列表的筛选 定制功能 取值
            reimbursementConfig:true,//报销凭证 定制功能 取值
            popLoading: false,//加载loading框，是浮在内容上的那种
            showSearch: false, 
            searchHistoryKey: 'orderHistory',
            showSearchHistory: false,//在输入焦点上
            searchTimestamp: null,//搜索时间，用于区分两次请求的先后次序
            dateFilterChoose: null,
            searchCondition: {
                keyword: null,
                orderType: [null],//默认全部
                scheduledTime: []
            },
            mescroll: null,
            mescrollDown: {
                use: false
            }, //下拉刷新的配置.
            mescrollUp: { // 上拉加载的配置.
                auto: false,
                scrollbar: false,
                callback: this.getData,
                noMoreSize: 0,
                loadFull: {
                    use : false,
                    timeout: 10//连续翻页n秒后停止该功能
                },
                page: {
                    num: 0,
                    size: 20
                },
                htmlNodata: '<p class="mescroll-upwarp-nodata" style="font-size: .3rem;>没有更多了</p>',
                empty: {
                    warpId: 'dataList',
                    icon: require('themes/default/img/defaultPage/img_defpage_nocontent@2x.png'),
                    tip: '暂无订单'
                },
                htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip" style="font-size: .3rem;>正在加载中...</p>'
            },
            showFooter:false,//是否展示底部导航栏
            orderCounts:[0,0,0]//订单数量
        });
    },
    // 无路由跳转 
    // beforeRouteUpdate(to, from, next) {
    //     this.payStatus = to.params.payStatus;
    //     this.reFreshPage();
    // },
    activated() {
        let _this = this;
        _this.initPayStatus();
        //注册刷新返回事件，入口页面强制刷新
        // _this.notifyAppBackAndRefresh();
            
        document.title = '我的订单';
    },
    created() {
        let _this = this;
        if (!!this.$route.query.pageFrom && this.$route.query.pageFrom=='footBar'){
            _this.showFooter = true;
        }
        //查询订单数量
        _this.getListOrderCount();
        _this.initPayStatus();
        _this.getMyCustomConfigs();
        _this.$emit('backIndex', 2);
        // _this.notifyAppBackAndRefresh();
        // 初始化payStatus状态
        document.title = '我的订单';
        //新页面关闭回到本页面时，本页面自动刷新的事件
        sinosdk.sino.onChildWindowClose(function (data) {
            try {
                if(sinosdk.sino.getPlatform()==sinosdk.sino.constant.RUN_ENV.WEBOA){//注册下一个页面返回到当前页面，如果是WEBOA，则重新设置title
                    document.title = '我的订单';
                }
                //重新查询订单数量
                _this.getListOrderCount();
                console.info(data);
                data = requestHandler.analyzeWinCloseData(data);
                _this.orderList.some((order) => {
                    if (order.orderNo == data.orderNo) {
                        order.orderStatus = data.orderStatus;
                        order.postSaleStatus = data.postSaleStatus;
                        /* eslint-disable */
                        if (order.hasOwnProperty('changeAndRefundStatus')){ //火车票特殊处理
                            order.changeAndRefundStatus = data.changeAndRefundStatus;
                        }
                        /* eslint-enable */
                        return true;
                    }
                    return true
                })
            } catch (e) {
                console.error(e)
            }
        }.bind(this));
    },
    //调用
    mounted() {
        let that = this;
        this.initSearch()
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth;
                that.screenWidth = window.screenWidth;
            })()
        }
    },
    watch: {
        screenWidth(val) {
            // var _this = this;
            this.screenWidth = val
        }
    },
    filters: {
        dateFormat(value){
            if (!value){
                return ''
            }
            return new Date(value).format('yyyy年MM月dd日')
        }
    },
    methods: {
        /**
             * 每次进入页面，自动拉取一次 定制业务的配置数据，用于 不同的渠道， 
             * 控制定制业务的显示与否
             */
        getMyCustomConfigs(){
            let that = this;
            //每次进入页面，自动拉取配置数据
            getAPPCustomConfigs().then(response=>{
                //订单列表的筛选 定制功能 取值
                that.orderListFilterConfig = response && response.orderListFilter ? response.orderListFilter.disPlay : true;
                //报销凭证 定制功能 取值
                that.reimbursementConfig = response && response.reimburse ? response.reimburse.disPlay : true;
               
            }).catch(error=>{
                console.log(error);
            })                
        },            
        /**
             * 注册刷新返回事件
             */
        // notifyAppBackAndRefresh() {
        //     let _this = this;
        //     //注册并监听t信返回事件，解决T信上返回事件不正确的问题，改用vue的路由来回退

        //     extendUtils.appBack(function (data) {//点击app返回事件
        //         extendUtils.throttle(function () {
        //             extendUtils.stateManager.closeTopPop(()=>{
        //                 if ('index' == _this.$route.query.pageFrom) {
        //                     _this.$emit('backIndex', 0);
        //                     _this.$router.push({
        //                         path: '/',
        //                         query: {
        //                             isHomePage: true
        //                         }
        //                     });
        //                 } else {
        //                     extendUtils.goBackPage('');
        //                 }
        //             })
        //         }, this);
        //     }.bind(this));
        //     //重写T信上的页面刷新，只初始化数据，不重新加载页面（否则在某些情况下会出现问题）
        //     extendUtils.reFreshPage(() => {
        //         _this.reFreshPage();
        //         location.reload()
        //     });

        // },

        goBackFun(){
            let _this = this;
            if ('index' == _this.$route.query.pageFrom) {
                _this.$emit('backIndex', 0);
                _this.$router.push({
                    path: '/',
                    query: {
                        isHomePage: true
                    }
                });
            } else {
                extendUtils.closePage('');
            }
        },

        mescrollInit(mescroll){
            this.mescroll = mescroll
        },
        /**
             * 初始化payStatus参数
             */
        initPayStatus(){
            let enumType = this.$route.query.enumType;
            if (enumType!=undefined && enumType!=null && enumType!=''){ //此分支是从 商云首页的跳转到我的商旅后点击订单条转过来的
                this.payStatus = enumType;
            } else {
                this.payStatus = this.$route.params.payStatus;
            }
        },
        /**
             * 打开搜索输入框
             */
        openSearch(){
            this.showSearch = true;
        },
        /**
             * 焦点在搜索框时，需要打开搜索历史，隐藏搜索结果
             */
        onSearchFocus(){
            this.showSearchHistory = true;
        },
        /**
             * 取消搜索，重新查询
             */
        cancelSearch(){
            this.showSearchHistory = false;
            this.showSearch = false;
            this.initSearch();
        },
        initSearch(){
            this.orderList = []
            this.mescroll.resetUpScroll();
        },
        /**
             * 搜索。同时关闭搜索历史和筛选面板（搜索框此时不一定需要关闭）
             */
        search(){
            this.addStorage(this.searchCondition.keyword);
            this.showSearchHistory = false;
            this.showFilterBlock = false;
            this.initSearch();
        },
        /**
             * 点击搜索历史
             */
        chooseHistory(value){
            this.searchCondition.keyword = value;
            this.search();
        },
        /**
             * 添加搜索历史
             */
        addStorage(value){
            if (value==null || value==undefined || value==''){
                return;
            }
            const MAX_HISTORY_LENGTH = 20;
            let historyKey = `${requestHandler.primaryKey}_${this.searchHistoryKey}`
            let historySearchList = !!extendUtils.getStorage(historyKey) ? JSON.parse(extendUtils.getStorage(historyKey)) : []
            if (!historySearchList){
                historySearchList = [];
            }
            let index = historySearchList.indexOf(value);
            if (index>-1){
                historySearchList.splice(index, 1);
            }
            historySearchList.unshift(value);
            //最多存MAX_LENGTH条
            if (historySearchList.length > MAX_HISTORY_LENGTH){
                historySearchList.length = MAX_HISTORY_LENGTH;
            }
            extendUtils.setStorage(`${requestHandler.primaryKey}_${this.searchHistoryKey}`, JSON.stringify(historySearchList));
        },
        /**
             * 判断订单类型是否被选中
             */
        orderTypeChecked(type){
            return this.searchCondition.orderType.indexOf(type)>-1
        },
        /**
             * 选中筛选中的订单类型
             */
        chechOrderType(type){
            if (type==null || type==undefined){
                this.searchCondition.orderType = [type]
                return;
            }
            //如果选择的不是“全部”，则需要反选“全部”
            let allTypeIndex = this.searchCondition.orderType.indexOf(null);
            let index = this.searchCondition.orderType.indexOf(type);
            if (allTypeIndex>-1){
                this.searchCondition.orderType.splice(index, 1);
            }
            if (index == -1){
                this.searchCondition.orderType.push(type)
            } else {
                this.searchCondition.orderType.splice(index, 1);
            }
        },
        /**
             * 选择下单时间过滤
             */
        chechDateFilter(filter){
            let lastChoose = this.dateFilterChoose;//上一次选择的日期类型
            this.dateFilterChoose = filter.value;
            let today = new Date()
            if (filter.value == null){
                this.searchCondition.scheduledTime = [];
            } else if (filter.value == 'cust'){
                if (lastChoose != 'cust'){
                    this.searchCondition.scheduledTime = [today.format('yyyy/MM/dd'), today.format('yyyy/MM/dd')];
                }
                this.$refs.datePicker.onClick();
            } else {
                if (filter.type == 'day'){
                    today.setDate(today.getDate() + filter.value);
                } else if (filter.type == 'month'){
                    today.setMonth(today.getMonth() + filter.value);
                }
                this.searchCondition.scheduledTime = [today.format('yyyy/MM/dd'), new Date().format('yyyy/MM/dd')]
            }
        },
        disabledDate(current){
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            return current > new Date(year, month, day).getTime();
        },
        /**
             * 重置筛选
             */
        resetFilter(){
            this.dateFilterChoose = null;
            this.searchCondition = {
                keyword: null,
                orderType: [null],//默认全部
                scheduledTime: []
            }
        },
        /**
             * 刷新页面内容
             */
        reFreshPage() {
            this.$emit('backIndex', 2);
            this.initSearch();
        },
        /**
             * 切换订单状态
             * @param payStatus 支付状态
             */
        changeOrderStatus(payStatus) {
            if (this.isLoading) {
                return;
            }
            this.payStatus = payStatus;
            this.canLoadmore = true;
            // this.gotoTop();
            this.closeFilter();//关闭筛选面板
            this.showSearch = false;//关闭搜索框
            this.showSearchHistory = false;//关闭搜索历史
            this.resetFilter()//重置搜索条件
            this.initSearch();
        },
        // gotoTop(){
        //     let dom = document.getElementById('content');
        //     dom && (dom.scrollTop = 0);
        // },
        /**
             * 关闭筛选层（不查询）
             * @param orderType 订单类型
             */
        closeFilter(orderType) {
            this.showFilterBlock = false;
            this.orderType = orderType ? orderType.key : null;
            this.filterContent = orderType ? orderType.value : this.orderTypeArr[0].value;
        },
        /**
             * 获取数据
             */
        getData(page, mescroll) {
            let _this = this;
            if (_this.totalPageCount && _this.currPage > _this.totalPageCount) {
                return;
            }
            _this.isLoading = true;
            let orderTypes = _this.searchCondition.orderType.filter(type=>type!=null)
            //默认参数，查询我的订单使用
            let param = {
                pageSize: page.size,
                pageIndex: page.num,
                departBeginTime: _this.payStatus == '1' ? (new Date().format("yyyy/MM/dd").replace(/\//g, "-")) : null,//待出行的时候，需要传入当前时间，过滤已经超出出行时间的数据
                queryType: _this.orderDispatch//表示订单场景，此处传1，表示查询“我的订单”
            }
            if (orderTypes.length>0){
                param.orderTypes = orderTypes;
            } else {
                //不选时，需要传所有type。防止“保险”订单被查出来
                param.orderTypes = _this.orderTypeArr.filter(t=>t.key!=null).map(t=>t.key);
            }
            if (_this.searchCondition.keyword!=null && _this.searchCondition.keyword!=''){
                param.keyword = _this.searchCondition.keyword
            }
            if (_this.searchCondition.scheduledTime.length>0){
                if (_this.searchCondition.scheduledTime[0]){
                    param.scheduledBeginTime = _this.searchCondition.scheduledTime[0].replace(/\//g, '-')
                }
                if (_this.searchCondition.scheduledTime.length>1 && _this.searchCondition.scheduledTime[1]){
                    param.scheduledEndTime = _this.searchCondition.scheduledTime[1].replace(/\//g, '-')
                }
            }

            let orderStatus = [];

            //将各个产品的状态码传给服务器，服务器针对这些状态进行过滤
            if (_this.payStatus == '0') { //待支付
                orderStatus = orderStatus.concat(getStatusByCategory(0, _this.orderDispatch));
            } else if (_this.payStatus == '1') { //带出行
                orderStatus = orderStatus.concat(getStatusByCategory(1, _this.orderDispatch));
                param.prepareTravel = true;
                param.queryContentType = 1;//此参数 = 1时，服务端会根据系统时间对订单进行过滤
            } else if (_this.payStatus == '2') { //退款单
                param.postSaleOrder = true;//查询退款中和已退款的订单
                param.hasRefundOrder = true;
            }
            orderStatus.length > 0 && (param.orderStatus = orderStatus);

            let timestamp = (new Date()).getTime();
            this.searchTimestamp = timestamp;

            requestHandler.getOrderOfAllTypes(param).then(function (res) {
                _this.isLoading = false;
                let data = res.result;
                if (timestamp == _this.searchTimestamp){
                    _this.totalPageCount = data.totalPageCount;
                    let flightOrders = _this.setOrderType(data.flightOrders, 'Flight', '机票') || [];//机票订单
                    let trainOrders = _this.setOrderType(data.trainOrders, 'Train', '火车票') || [];//火车票订单
                    let hotelOrders = _this.setOrderType(data.hotelOrders, 'Hotel', '酒店') || [];//酒店订单
                    let carOrders = _this.setOrderType(data.carOrders, 'Car', '商务用车') || [];//用车订单
                    //所有产品的订单合并，并按下单时间倒序
                    let orderArr = flightOrders.concat(trainOrders).concat(hotelOrders).concat(carOrders);
                    orderArr && orderArr.sort(function (order1, order2) {
                        //退款售后单并且时间不相等的情况下用退款售后操作时间排序，否则用下单时间排序
                        let time1 = (_this.payStatus == '2' && order1.postSaleLastApplyTime!=order2.postSaleLastApplyTime)?order1 && order1.postSaleLastApplyTime:order1 && order1.orderTime;
                        let time2 = (_this.payStatus == '2' && order1.postSaleLastApplyTime!=order2.postSaleLastApplyTime)?order2 && order2.postSaleLastApplyTime:order2 && order2.orderTime;
                        if (!time1 || !time2) {
                            return 0;
                        }
                        if (time1 < time2) {
                            return 1;
                        } else if (time1 > time2) {
                            return -1;
                        } 
                        return 0;
                            
                    });
                    //加载更多：在列表后追加新数据
                    if (page.num == 1){
                        _this.orderList = []
                    }
                    _this.orderList = _this.orderList.concat(orderArr)
                }
                //列表加载完毕，发消息通知骨架图关闭
                _this.$emit('showOff', true);
                mescroll.endByPage(_this.orderList.length, data.totalPageCount);
            }).catch(() => {
                _this.isLoading = false;
                mescroll.endErr();
            });

        },
        /**
             * 设置订单类型，便于后面根据订单类型做处理
             * @param arr 订单列表
             * @param typeCode 订单类型的code（自定义的）
             * @param typeName 订单类型的中文名
             * @returns {*} 返回新的订单列表
             */
        setOrderType(arr, typeCode, typeName) {
            if (!arr) {
                return arr;
            }
            for (let i in arr) {
                arr[i].typeName = typeName;
                arr[i].typeCode = typeCode;
            }
            return arr;
        },
        /**
             * 去订单详情
             * @param index
             */
        goPage: function (param) {
            // const that = this;
            requestHandler.openPage('order/index.html#/' + param);
        },
        /**
             * 开发票
             */
        toInvoice() {
            requestHandler.openPage('invoice/index.html#/index')
        },

        togglePopLoading(loading){
            this.popLoading = loading;
        },
        /**
             * 获取订单数量
             */    
        getListOrderCount(){
            let that = this;
            requestHandler.getListOrderCount({}).then(res => {
                if (res.resultCode == 0){
                    that.orderCounts = res.result.orderCounts || [0,0,0];
                }
            }).catch(e => {
                console.log('获取订单列表失败', e)
            })
        }            
    }
}
</script>
<style scoped lang="less" rel="stylesheet/less">
    @import '~themes/default/styles/indexOrder/indexOrder.less';
</style>
<style>
.sn-range-picker-view-header .sn-range-picker-view-btn{
    padding: 0 0.3rem;
    font-size: 15px;
}
.sn-range-picker-view-header .sn-range-picker-view-tabs-item{
    font-size: 15px;
    padding-right: 5px;
}
.sn-range-picker-view-header .sn-range-picker-view-tabs.range-date .sn-range-picker-view-tabs-item{
    min-width: 130px;
}
@media screen and (min-width: 480px){
    .sn-range-picker-view-header .sn-range-picker-view-btn {
        padding: 0 20px;
    }
}
</style>