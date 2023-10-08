<template>
    <div class="page-index-order">
        <div class="main-content">
            <!-- <header>
                <nav>
                    <ul>
                        <li class="cursorp" :class="!payStatus && 'selected'" @click="changeOrderStatus()">全部</li>
                        <li class="cursorp" :class="payStatus=='0' && 'selected'" @click="changeOrderStatus('0')">待支付
                        </li>
                        <li class="cursorp" :class="payStatus=='1' && 'selected'" @click="changeOrderStatus('1')">待出行
                        </li>
                        <li class="cursorp" :class="payStatus=='2' && 'selected'" @click="changeOrderStatus('2')">退款单
                        </li>
                    </ul>
                </nav>
            </header> -->
            <div class="search-container" v-if='!showSearch'>
                <div class='condition'>
                    <div class='search-block icon-btn' @click='openSearch'>
                        <Icon type="search" class="icon" size='.3'/>
                        <span>搜索</span>
                    </div>
                    <div class="filter icon-btn cursorp" @click="showFilterBlock=!showFilterBlock">
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
                        <div class='item-block' @click='checkOrder(orderItem)' v-for="orderItem in orderList" :key="orderItem.orderNo">
                            <OrderItem class='order-item-container' :orderItem="orderItem"></OrderItem>
                            <Icon :type='orderChecked(orderItem)?"checkbox":"checkbox-empty"' size='.44' class='check-box-icon'/>
                        </div>
                    </div>
                </mescrollVue>
            </div>
            <div class="filter-mask cursorp" v-if="showFilterBlock" @click="closeFilter"></div>
        </div>

        <div v-transfer-dom>
            <div class='footer'>
                <div class='checkAll' @click='checkAllOrder'>
                    <Icon :type='checkAll?"checkbox":"checkbox-empty"' size='.44' class='check-box-icon'/>全选
                </div>
                <div>共<span class='total'>{{(checkedOrderList||[]).length}}</span>单</div>
                <a class="btn cursorp" @click="confirm">
                    确定
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import extendUtils from 'orderCommon/extend.js';
import { Loading,TransferDom } from 'vux';
import { getStatusByCategory } from 'orderCommon/enum/orderStatusEnum.js';
import requestHandler from 'orderCommon/requestHandler.js';
import {SnRangePicker} from 'sinosun-ui';
import MescrollVue from 'mescroll.js/mescroll.vue'
const OrderItem = ()=>import('./orderItem.vue');
const Icon = ()=>import('components/icon');
// const SnLoading = ()=>import('components/loading');
const searchBar = ()=>import('components/search/searchBar')
const history = ()=>import('components/search/history')

export default {
    directives: {
        TransferDom
    },
    mixins: [extendUtils.mixin.tChatEventMixin],
    components: {SnRangePicker, Loading, OrderItem, Icon,searchBar, history,MescrollVue },
    data() {
        let orderNos = extendUtils.getUserPara('orderNos');
        let checkedOrderArr = [];
        if (!!orderNos){
            checkedOrderArr = decodeURIComponent(orderNos).split('|');
        }
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
            isSkeletonLoading:false,//骨架图加载标记
            popLoading: false,//加载loading框，是浮在内容上的那种
            checkedOrderList: [],//被选中的订单
            checkedOrderParam: checkedOrderArr,//调用者传进来的被选中的订单
            showSearch: false, 
            searchHistoryKey: 'exportOrderHistory',
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
            }
        });
    },
    created() {
        // let _this = this;
        this.payStatus = extendUtils.getUserPara('payStatus');
        // _this.notifyAppBackAndRefresh();
    },
    //调用
    mounted() {
        let that = this;
        this.initSearch()
        that.isLoading = false;
        that.isSkeletonLoading = true;
    },
    computed: {
        checkAll(){
            return this.orderList && this.orderList.length>0 && this.orderList.every(order=>{
                return this.orderChecked(order);
            })
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
        checkAllOrder(){
            if (this.checkAll){
                this.checkedOrderList = []
                return;
            }
            return this.orderList.forEach(order=>{
                this.checkOrder(order, false)
            })
        },
        orderChecked(order){
            return this.checkedOrderList.some(o=>{
                return o.orderNo == order.orderNo
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
        //                 extendUtils.goBackPage('');
        //             })
        //         }, this);
        //     }.bind(this));
        //     //重写T信上的页面刷新，只初始化数据，不重新加载页面（否则在某些情况下会出现问题）
        //     extendUtils.reFreshPage(() => {
        //         _this.reFreshPage();
        //     });

        // },
        goBackFun(){
            extendUtils.closePage('');
        },
        mescrollInit(mescroll){
            this.mescroll = mescroll
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
            } else if (_this.payStatus == '2') { //退款单
                orderStatus = orderStatus.concat(getStatusByCategory(2, _this.orderDispatch));
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
                        let time1 = order1 && order1.orderTime;
                        let time2 = order2 && order2.orderTime;
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
                    _this.orderList.forEach(order=>{
                        if (_this.checkedOrderParam.indexOf(order.orderNo)>-1){
                            _this.checkOrder(order, false)
                        }
                    })
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

        togglePopLoading(loading){
            this.popLoading = loading;
        },

        checkOrder(orderItem, toggle=true){
            let index = this.checkedOrderList.findIndex(o=>{
                return o.orderNo == orderItem.orderNo
            })
            if (index>-1){
                toggle===true && this.checkedOrderList.splice(index, 1)
                return;
            }
            let order = {};
            switch (orderItem.typeCode){
            case 'Flight': 
                order.type = orderItem.typeCode.toLowerCase()
                order.orderNo = orderItem.orderNo;
                order.departTime = (new Date(orderItem.departTime)).getTime();
                order.departCityName = orderItem.departCityName;
                order.arriveCityName = orderItem.arriveCityName;
                order.payAmount = orderItem.payAmount * 100;
                order.payMethod = orderItem.payType;
                order.payNo = orderItem.outTradeNo; 
                break;
            case 'Train': 
                order.type = orderItem.typeCode.toLowerCase()
                order.orderNo = orderItem.orderNo;
                order.departTime = (new Date(orderItem.startTime)).getTime();
                order.departCityName = orderItem.startCity;
                order.arriveCityName = orderItem.endCity;
                order.payAmount = orderItem.payAmount * 100;
                order.payMethod = orderItem.payType;
                order.payNo = orderItem.outTradeNo; 
                break;    
            case 'Hotel': 
                order.type = orderItem.typeCode.toLowerCase()
                order.orderNo = orderItem.orderNo;
                order.departTime = (new Date(orderItem.departDate)).getTime();
                order.arriveTime = (new Date(orderItem.arriveDate)).getTime();
                order.arriveCityName = orderItem.arriveCityName;
                order.hotelName = orderItem.hotelName;
                order.payAmount = orderItem.payAmount * 100;
                order.payMethod = orderItem.payType;
                order.payNo = orderItem.outTradeNo; 
                break;
            default: 
                break;    
            }
            this.checkedOrderList.push(order)
        },
        confirm(){
            let loadData = {
                orderList: this.checkedOrderList,
                uniqueId: extendUtils.getUserPara('uniqueId')
            };
            loadData = JSON.stringify(loadData);
            extendUtils.closePage('', 1, loadData);  
        }
    }
}
</script>
<style scoped lang="less" rel="stylesheet/less">
    @import '~themes/default/styles/indexOrder/indexOrder.less';
</style>
<style scoped lang='less'>
    @import '~themes/default/styles/common/index.less';
    .page-index-order{
        overflow: hidden;
        .content{
            height: calc(~"100vh - 2.48rem");
            margin-bottom: 1rem;
            
            .item-block{
                position: relative;
                /deep/ .order-summary{
                    .title{
                        padding-left: .64rem;
                    }
                }
                .check-box-icon{
                    position: absolute;
                    left: .8rem;
                    top: .28rem;
                    fill: @third-text-color;
                    color: @third-text-color; 

                    &.checkbox{
                        fill: @theme-color;
                        color: @theme-color;
                    }
                }
            }
        }
    }
    .footer{
        position: fixed;
        max-width: @max-content-width;
        bottom: 0;
        left: 0;
        right: 0;
        margin:  0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        font-size: .24rem;
        background: @sub-background-color;
        text-align: center;
        box-shadow: 0px .06rem .2rem 0px rgba(101, 112, 242, 0.12);

        .checkAll{
            margin-left: .3rem;
            display: flex;
            align-items: center;
            .icon{
                margin-right: .16rem;
                fill: @third-text-color;
                color: @third-text-color;

                &.checkbox{
                    fill: @theme-color;
                    color: @theme-color;
                }
            }
        }

        .total{
            font-size: .3rem;
        }

        .btn{
            font-size: .3rem;
            margin-left: .44rem;
            width: 2.8rem;
            height: 100%;
            background: var(--themeColor);
            text-align: center;
            color: #fff;
            line-height: 1rem;
        }
    }
</style>
<style>
.sn-range-picker-view-header .sn-range-picker-view-btn{
    padding: 0 0.3rem;
}
@media screen and (min-width: 480px){
    .sn-range-picker-view-header .sn-range-picker-view-btn {
        padding: 0 20px;
    }
}
</style>