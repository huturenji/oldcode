<template>
    <div class="page-index-order" v-if="!isPC">
        <div class="main-content">
            <header>
                <nav>
                    <ul>
                        <li class="cursorp" :class="!payStatus && 'selected'" @click="changeOrderStatus()">全部</li>

                        <li class="cursorp" :class="payStatus=='1' && 'selected'" @click="changeOrderStatus('1')">待出行
                        </li>
                        <li class="cursorp" :class="payStatus=='2' && 'selected'" @click="changeOrderStatus('2')">退款/售后
                        </li>
                    </ul>
                </nav>
            </header>
            <div class="search" :class="showFilterBlock && 'selected'">
                <div class="filter icon-btn cursorp" @click="showFilterBlock=!showFilterBlock" v-if="orderListFilterConfig">
                    <Icon type="filter" class="icon icon-btn" size='.24'/>
                    <span class="filter-content">筛选({{filterContent || '全部'}})</span>
                    <Icon type="down" class="icon icon-btn" size='.24'/>
                    </div>
                    <div class="filter-select" v-if="showFilterBlock">
                        <ul>
                        <li class="normal-btn cursorp" v-for="type in orderTypeArr" :key="type.value"
                                @click="changeOrderType(type)">
                                {{type.value}}
                            </li>
                        </ul>
                    </div>
                </div>

            <div v-transfer-dom>
                <loading :show="popLoading"></loading>
            </div>
            <SnLoading :spinning="isLoading" :turn="true" tip="数据加载中" />
            <div class="content" id="content" v-show="!isLoading && 0<orderList.length">
                <div v-infinite-scroll="loadBottom" ref="loadmore" infinite-scroll-distance="50"
                    :infinite-scroll-disabled="!canLoadmore">
                    <OrderItem class='order-item-container' v-for="orderItem in orderList" :key="orderItem.orderNo"
                        :orderItem="orderItem" :isPc="isPC" @goPage="goPage" @togglePopLoading="togglePopLoading"></OrderItem>
                </div>
                <div v-if="0!=orderList.length" @click="loadBottom" class="loadMore cursorp">{{bottomPullText}}</div>
            </div>
            <div class="noInfo" v-if="!isLoading && 0==orderList.length && !isSkeletonLoading">暂无订单</div>
            <div class="filter-mask cursorp" v-if="showFilterBlock" @click="closeFilter"></div>
        </div>

    </div>
    <pcOrderList v-else :isPc='isPC' :isFullScreen='fullScreen' :showOrg='showOrgnization' @goPage="goPage"
        :showPers='showPersion'></pcOrderList>
</template>

<script>
import extendUtils from 'orderCommon/extend.js';
import { Loading,TransferDom } from 'vux';
import { getStatusByCategory, excludeInCompanyOrder } from 'orderCommon/enum/orderStatusEnum.js';
import requestHandler from 'orderCommon/requestHandler.js';
import {getAPPCustomConfigs} from 'orderCommon/customFunctionConfigs.js';
const OrderItem = ()=>import('../orderItem/orderItem.vue');
const pcOrderList = ()=>import('../../viewsPC/orderList/orderList.vue');
const Icon = ()=>import('components/icon');    
const SnLoading = ()=>import('components/loading');    

export default {
    directives: {
        TransferDom
    },
    mixins: [requestHandler.mixin.tChatEventMixin],
    components: { SnLoading, Loading, OrderItem, pcOrderList,Icon },
    data() {
        return Object.assign(extendUtils.stateManager.setData([], this), {
            orderDispatch: 0,//订单列表类型区分 1：我的订单；0：订单管理
            initPageFlag: true,//第一次加载页面
            isForwardLeave: false,
            isLoading: true,
            canLoadmore: true,
            canLoad: false,
            bottomPullText: '',
            showFilterBlock: false,
            searchParam: null,
            filterContent: null,//筛选条件
            orderList: [],
            payStatus: this.$route.params.payStatus,//订单状态
            orderType: null,//订单分类
            pageSize: 20,
            currPage: 1,
            totalPageCount: null,
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
            isPC: false,
            fullScreen: false,
            screenWidth: document.body.clientWidth,
            showPersion: false,
            showOrgnization: false,
            orderListFilterConfig:true,//订单列表的筛选 定制功能 取值
            reimbursementConfig:true,//报销凭证 定制功能 取值
            isSkeletonLoading:false,//骨架图加载标记
            popLoading: false//加载loading框，是浮在内容上的那种
        });
    },
    beforeRouteUpdate(to) {
        this.payStatus = to.params.payStatus;
        this.reFreshPage();
    },
    activated() {
        //注册刷新返回事件，入口页面强制刷新
        // _this.notifyAppBackAndRefresh();
        document.title = '订单列表';
    },
    created() {
        let _this = this;
        _this.getMyCustomConfigs();
        _this.$emit('backIndex', 2);
        // _this.notifyAppBackAndRefresh();
        _this.isFromPC();
        document.title = '订单列表';
        //新页面关闭回到本页面时，本页面自动刷新的事件

        sinosdk.sino.onChildWindowClose(function (data) {
            try {
                console.info(data);
                data = requestHandler.analyzeWinCloseData(data);
                _this.orderList.some(data,(order) => {
                    if (order.orderNo == data.orderNo) {
                        order.orderStatus = data.orderStatus;
                        order.postSaleStatus = data.postSaleStatus;
                        if (Object.prototype.hasOwnProperty.call(order, "changeAndRefundStatus")){ //火车票特殊处理
                            order.changeAndRefundStatus = data.changeAndRefundStatus;
                        }
                        return true;
                    }
                })
            } catch (e) {
                console.error(e)
            }
        }.bind(this));
    },
    //调用
    async mounted() {
        let that = this;
        //添加骨架图
        that.isLoading = false;
        that.isSkeletonLoading = true;
        that.getData(1, 1);
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth;
                that.screenWidth = window.screenWidth;
            })()
        }
    },
    watch: {
        screenWidth(val) {
            var _this = this;
            this.screenWidth = val
            _this.isFromPC();
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
        //                     extendUtils.closePage('');
        //                 }
        //             })
        //         }, this);
        //     }.bind(this));
        //     //重写T信上的页面刷新，只初始化数据，不重新加载页面（否则在某些情况下会出现问题）
        //     extendUtils.reFreshPage(() => {
        //         _this.reFreshPage();
        //     });

        // },
        goBackFun(){
            if ('index' == this.$route.query.pageFrom) {
                this.$emit('backIndex', 0);
                this.$router.push({
                    path: '/',
                    query: {
                        isHomePage: true
                    }
                });
            } else {
                extendUtils.closePage('');
            }
        },
        /**
         * 刷新页面内容
         */
        reFreshPage() {
            this.$emit('backIndex', 2);
            this.isLoading = true;
            //1. 初始化参数
            this.initPage();
            //2. 重新获取数据
            this.getData(1);
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
            this.gotoTop();
            this.closeFilter(this.orderTypeArr.find(type=>{ return type.key == this.orderType }));
            this.initPage();//重置当前页码
            this.getData(1);
        },
        /**
         * 切换产品
         * @param orderType 订单类型
         */
        changeOrderType(orderType) {
            if (this.isLoading) {
                return;
            }
            this.canLoadmore = true;
            //回滚到顶部
            this.gotoTop();
            //关闭筛选
            this.closeFilter(orderType);
            this.initPage();//重置当前页码
            this.getData(1);
        },
        gotoTop(){
            let dom = document.getElementById('content');
            dom && (dom.scrollTop = 0);
        },
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
         * 下拉加载更多
         */
        loadBottom() {
            const _this = this;
            //下拉的节流
            //初次进页面，这里不查询
            if (_this.canLoadmore && !_this.initPageFlag) {
                _this.canLoadmore = false;
                _this.getData();
                setTimeout(() => {
                    //页面初始化时，先调用的getData，让currPage++了，所以当前的实际页码时currPage-1
                    if (!_this.totalPageCount || (_this.currPage - 1) < _this.totalPageCount) {
                        _this.canLoadmore = true;
                    }
                }, 1000);
            }
        },
        /**
         * 初始化当前页码
         */
        initPage() {
            this.currPage = 1;
            this.totalPageCount = null;
        },
        /**
         * 获取数据
         * @param isInit
         * where 调用的来源
         */
        getData(isInit, where) {
            let _this = this;
            if (_this.totalPageCount && _this.currPage > _this.totalPageCount) {
                return;
            }
            _this.bottomPullText = '';
            //where等于1标示 页面首次加载，mounted调用。显示骨架图，关闭loading
            if (isInit && where != 1) {
                _this.isLoading = true;
            }

            //默认参数，查询我的订单使用
            let param = {
                pageSize: _this.pageSize,
                pageIndex: _this.currPage++,
                departBeginTime: _this.payStatus == '1' ? (new Date().format("yyyy/MM/dd").replace(/\//g, "-")) : null//待出行的时候，需要传入当前时间，过滤已经超出出行时间的数据
            }
            !!_this.orderType ? (param.orderType = _this.orderType) : param.orderTypes = [1,2,3];
            let orderStatus = [];


            param.useType = requestHandler.USE_TYPE_ENUM.PUBLIC.code;//只查因公的
            param.productionId = _this.$route.query.prodId||undefined;
            param.payBeginTime = _this.$route.query.queryStartDate;
            param.payEndTime = _this.$route.query.queryEndDate;
            let exclude = excludeInCompanyOrder()
            if (!_this.payStatus) { //全部
                //注意,要和企业订单列表"全部"的内容一致!
                orderStatus = orderStatus.concat(getStatusByCategory(1, _this.orderDispatch, exclude), getStatusByCategory(2, _this.orderDispatch, exclude), ['ALREADY_CANCEL_HAS_REFUND']);
            } else if (_this.payStatus == '1') { //带出行
                orderStatus = orderStatus.concat(getStatusByCategory(1, _this.orderDispatch, exclude));
                param.isPrepareTravel = true;
                param.queryContentType = 1;//此参数 = 1时，服务端会根据系统时间对订单进行过滤
            } else if (_this.payStatus == '2') { //退款单
                param.postSaleOrder = true;//查询退款中和已退款的订单
                param.hasRefundOrder = true;
            }
            param.orderStatus = requestHandler.removeDuplicatedItem(orderStatus);
            
            orderStatus.length > 0 && (param.orderStatus = orderStatus);
            requestHandler.getOrderOfAllTypes(param).then(function (res) {
                _this.initPageFlag = false;
                _this.isLoading = false;

                _this.canLoad = true;
                let data = res.result;
                _this.totalPageCount = data.totalPageCount;
                let flightOrders = _this.setOrderType(data.flightOrders, 'Flight', '机票') || [];//机票订单
                let trainOrders = _this.setOrderType(data.trainOrders, 'Train', '火车票') || [];//火车票订单
                let hotelOrders = _this.setOrderType(data.hotelOrders, 'Hotel', '酒店') || [];//酒店订单
                // let carOrders = _this.setOrderType(data.carOrders, 'Car', '商务用车') || [];//用车订单废弃，接口不返回数据
                let insuranceOrders = _this.setOrderType(data.insuranceOrders, 'Insurance', '保险') || [];//保险订单
                //所有产品的订单合并，并按下单时间倒序
                let orderArr = flightOrders.concat(trainOrders).concat(hotelOrders).concat(insuranceOrders);
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
                //初始化：替换整个列表
                if (isInit) {
                    _this.orderList = orderArr;
                } else {
                    //加载更多：在列表后追加新数据
                    _this.orderList = _this.orderList.concat(orderArr)
                }
                // if (orderArr.length>3) {
                if ((_this.currPage - 1) >= _this.totalPageCount) {
                    _this.canLoad = false;
                    //延迟赋值，防止这段话比订单列表先渲染出来
                    setTimeout(()=>{
                        _this.bottomPullText = '没有更多了';
                    },200)
                } else {
                    _this.bottomPullText = '';
                }
                //列表加载完毕，发消息通知骨架图关闭
                _this.$emit('showOff', true);
                _this.isSkeletonLoading = false;

            }).catch(() => {
                _this.canLoad = false;
                _this.initPageFlag = false;
                _this.isLoading = false;
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
            const that = this;
            that.isForwardLeave = true;
            requestHandler.openPageLib('enterprise/index.html#/' + param);
        },
        /**
         * 开发票
         */
        toInvoice() {
            requestHandler.openPageLib('invoice/index.html#/index')
        },
        isFromPC: function () {
            let _this = this;
            //订单中心的才用响应式，“我的订单”暂不用
            if (_this.orderDispatch != 0) {
                return;
            }
            if (_this.screenWidth < 500) {
                _this.isPC = false;
                _this.fullScreen = false;
                _this.showPersion = false;
                _this.showOrgnization = false;
            } else if (500 <= _this.screenWidth && _this.screenWidth < 560) {
                _this.isPC = true;
                _this.fullScreen = false;
                _this.showPersion = false;
                _this.showOrgnization = false;
            } else if (560 <= _this.screenWidth && _this.screenWidth < 650) {
                _this.isPC = true;
                _this.fullScreen = false;
                _this.showPersion = true;
                _this.showOrgnization = false;
            } else if (650 <= _this.screenWidth && _this.screenWidth < 1000) {
                _this.isPC = true;
                _this.fullScreen = false;
                _this.showPersion = true;
                _this.showOrgnization = true;
            } else {
                _this.isPC = true;
                _this.fullScreen = true;
                _this.showPersion = true;
                _this.showOrgnization = true;
            }
        },

        togglePopLoading(loading){
            this.popLoading = loading;
        }
    }
}
</script>
<style scoped lang="less" rel="stylesheet/less">
    @import '~themes/default/styles/indexOrder/indexOrder.less';
</style>
