<template>
    <div class="invoice-history-wrap">
        <div v-if="loading">
            <LoadingX tip='获取发票信息中，请稍后...' :spinning="true" :turn="true" />
        </div>
        <EmptyX v-else-if="!loading && tripAllList.all.length == 0" tipsText='暂无可开发票' />
        <div v-else class="invoiceList">
            <div class="tabList">
                <span class="tabItem cursorp" :class="{active: orderType === 'all'}" @click="changeOrderType('all')">全部</span>
                <span class="tabItem cursorp" :class="{active: orderType === 'flight'}" @click="changeOrderType('flight')">机票</span>
                <span class="tabItem cursorp" :class="{active: orderType === 'hotel'}" @click="changeOrderType('hotel')">酒店</span>
                <span class="tabItem cursorp" :class="{active: orderType === 'train'}" @click="changeOrderType('train')">火车票</span>
                <!-- <span class="tabItem cursorp" :class="{active: orderType === 'car'}" @click="changeOrderType('car')">商务用车</span> -->
            </div>

            <!-- 开票历史列表 -->
            <div class="content_item">
                <div class="tripList cursorp" v-for='(trip, index) in tripList' :key="trip.orderNo + index">
                    <!-- pc显示删除开票历史 -->
                    <div v-if="isPC" class="is_PC">
                        <div>
                            <span :style="{color: getInvoiceDoneColor(trip)}">{{handleInvoiceDone(trip)}}</span> 
                            <span @click="openDeleteConfirm(trip)" class="delete">删除</span> 
                        </div>
                    </div>

                    <swipeout>
                        <swipeout-item :ref='"swipeoutItem"+index' @on-open="handleSwipeoutOpen(index)" :disabled='isPC'>
                            <div slot="right-menu">
                                <swipeout-button class="cursorp" @click.native="openDeleteConfirm(trip)" background-color="#FF4E3A">删除</swipeout-button>
                            </div>
                            <div slot="content" class="cursorp" @click="goOrderDetail(trip)">

                                <!-- 机票 -->
                                <div class="content" v-if="trip.orderType=='ORDER_TYPE_FLIGHT'">
                                    <div class="main">
                                        <div class="detail">
                                            <div class="trip">
                                                <i><icon type="icon_plane_plane" size=".32"/></i>
                                                <span>{{trip.startCity}} — {{trip.endCity}}</span>
                                            </div>
                                            <div class="No">{{trip.travelMessage}}</div>
                                            <div class="date"> 
                                                <span>{{handle2Date(trip.startDate)}}</span> &nbsp;
                                                {{handleTime(trip.startDate)}}-{{handleTime(trip.endDate)}}
                                                {{trip.addDay ? ('+' + trip.addDay + '天')  : ''}}
                                            </div>
                                        </div>
                                        <div class="price">
                                            <div v-if="!isPC" class="invoiceType"  :style="{color: getInvoiceDoneColor(trip)}">{{handleInvoiceDone(trip)}}</div>
                                            <div class="fee num-font"><span class="biao">￥</span>{{trip.price}}</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 火车票 -->
                                <div class="content" v-else-if="trip.orderType=='ORDER_TYPE_TRAIN'">
                                    <div class="main">
                                        <div class="detail">
                                            <div class="trip">
                                                <i><icon type="icon_train_train" size=".32"/></i>
                                                <span>{{trip.startCity}} — {{trip.endCity}}</span>
                                            </div>
                                            <div class="No">车次{{trip.travelMessage}}</div>
                                            <div class="date"> 
                                                <span>{{handle2Date(trip.startDate)}}</span> &nbsp;
                                                {{handleTime(trip.startDate)}}-{{handleTime(trip.endDate)}}
                                                {{!!trip.addDay ? ('+' + trip.addDay + '天')  : ''}}
                                            </div>
                                        </div>
                                        <div class="price">
                                            <div v-if="!isPC" class="invoiceType" :style="{color: getInvoiceDoneColor(trip)}">{{handleInvoiceDone(trip)}}</div>
                                            <div class="fee num-font"><span class="biao">￥</span>{{trip.price?trip.price:'--'}}</div>
                                            <div class="taxtitle">购票手续费</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 酒店 -->
                                <div class="content" v-else-if="trip.orderType=='ORDER_TYPE_HOTEL'" >
                                    <div class="main">
                                        <div class="detail">
                                            <div class="trip hotelName">
                                                <i><icon type="icon_hotel_hotel" size=".32"/></i>
                                                <span>{{trip.travelMessage}}</span>
                                            </div>
                                            <div class="No"> {{(trip.roomType || '')+" "+trip.roomNum+"间"}}</div>
                                            <div v-if="!!trip.startDate && !!trip.endDate" class="date">
                                                {{handle2Date(trip.startDate)+"至"+handle2Date(trip.endDate)}}</div>
                                        </div>
                                        <div class="price">
                                            <div v-if="!isPC" class="invoiceType" :style="{color: getInvoiceDoneColor(trip)}">{{handleInvoiceDone(trip)}}</div>
                                            <div class="fee num-font"><span class="biao">￥</span>{{trip.price || '暂无价格'}}</div> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </swipeout-item>
                    </swipeout>
                </div>
                <EmptyX v-if="tripList.length == 0" tipsText='暂无开票历史' />
            </div>
        
        </div>
    </div>
</template>

<script>
import icon from 'components/icon/index';
import {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
} from 'vux';
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';
import LoadingX from "components/loading/index";
import EmptyX from "components/empty/EmptyX.vue";

export default {
    mixins: [invoiceHandler.mixin.tChatEventMixin],
    name: 'chooseOrder',
    components: {  
        LoadingX,
        EmptyX,   
        Swipeout,
        SwipeoutItem,
        SwipeoutButton,
        icon
    },
    computed: {

    },
    data () {
        let managerData = invoiceHandler.stateManager.setData([], this)
        let data = {
            isPC: invoiceHandler.isPC(),
            orderType: 'all', // 发票历史的订单类型
            tripList: [], // 订单列表数据
            tripAllList: {
                all: [],
                flight: [],
                hotel: [],
                train: []
            },
            loading: true, // loading标识
            invoiceDoneColor:'@text-color' //发票状态的颜色 默认是@text-color
        }
        data = Object.assign(managerData, data)
        return data
    },
    created () {
        /**
         * 获取可开发票的订单列表，选择需要开发票的订单，然后跳转到开票确认页面
         */
        // let that = this
        this.getTripList()
        // //注册并监听t信返回事件
        // invoiceHandler.appBack(function(){
        //     invoiceHandler.stateManager.closeTopPop(() => {
        //         that.$router.back()
        //     });
        // },that)
       
    },
    methods: {
        //注册并监听t信返回事件
        goBackFun(){
            let that = this
            that.$router.back()
        },
        /***
         * 处理发票显示的
         * trip.invoiceDone == 0 待开发票
         * trip.invoiceDone == 1 已开发票
         * trip.invoiceDone == 2 取消发票
         */
        handleInvoiceDone(trip){
            let str = '';
            if (trip.invoiceDone=='1'){
                str = '已开发票';
                this.invoiceDoneColor = '#25CB67';
            } else if (trip.invoiceDone=='2'){
                str = '取消开票';
                this.invoiceDoneColor = '#999';
            } else if (trip.invoiceDone=='0'){
                str = '待开发票';
                this.invoiceDoneColor = '#FFB843';
            } 
            return str;        
        },
        /***
         * 处理发票显示的状态对应的颜色
         * trip.invoiceDone == 0 待开发票
         * trip.invoiceDone == 1 已开发票
         * trip.invoiceDone == 2 取消发票
         */
        getInvoiceDoneColor(trip){
            let color = '@text-color';
            if (trip.invoiceDone=='1'){
                color = '#23cda7';
            } else if (trip.invoiceDone=='2'){
                color = '#999';
            } else if (trip.invoiceDone=='0'){
                color = '#f49939';
            } 
            return color;   
        },


        /**
         * 切换订单类型 发票历史才有
         */
        changeOrderType (type) {
            this.orderType = type
            this.tripList = this.tripAllList[type]
        },

        handle2Date(date) {
            if (!date){ return '' }
            // const that = this;
            date = date.replace(/\-/g, "/");
            return new Date(date).format('yyyy-MM-dd') + ''
        },
        handleTime(date) {
            // const that = this;
            date = date.replace(/\-/g, "/");
            const minute = new Date(date).getMinutes() < 10 ? ('0' + new Date(date).getMinutes()) : new Date(date).getMinutes();
            const hours = new Date(date).getHours() < 10 ? ('0' + new Date(date).getHours()) : new Date(date).getHours();
            const time = hours + ':' + minute;
            return time
        },


        /**
         * 获取订单列表
         */
        getTripList(type) {
            const that = this;
            that.loading = true;
            let obj = {
                "pageSize": 10000,
                "pageIndex": 1
            };
            invoiceHandler.getInvoiceHistories(obj).then((res) => {      
                that.loading = false;
                if (res.resultCode == 0) {
                    that.tripList = res.result.invoiceApplyResponses;
                    that.tripAllList = {
                        all: [],
                        flight: [],
                        hotel: [],
                        train: [],
                        car:[]
                    }
                    that.tripAllList.all = res.result.invoiceApplyResponses;
                    res.result.invoiceApplyResponses.forEach(el => {
                        if (el.orderType === 'ORDER_TYPE_FLIGHT') {
                            that.tripAllList.flight.push(el)
                        } else if (el.orderType === 'ORDER_TYPE_HOTEL') {
                            that.tripAllList.hotel.push(el)
                        } else if (el.orderType === 'ORDER_TYPE_CAR') {
                            that.tripAllList.car.push(el)
                        } else if (el.orderType === 'ORDER_TYPE_TRAIN'){
                            that.tripAllList.train.push(el)
                        }
                    })

                    //如果是删除订单，记住当前选中的tab 
                    if (type && type == 'type'){
                        that.changeOrderType(that.orderType);
                    }
                }
            }).catch((err) => {
                that.loading = false;
                console.error(err);
            });
        },

        //处理s实现一个swiperout打开其他的会关闭
        /*@chooseIndex被操作的swipe
        */
        handleSwipeoutOpen(chooseIndex) {
            const that = this;
            if (chooseIndex > -1) {
                that.tripList.forEach((val, index) => {
                    if (index != chooseIndex && that.$refs['swipeoutItem' + index][0].isOpen == true) {
                        that.$refs['swipeoutItem' + index][0].close();
                    }
                })
            }
        },
        // 打开删除确认弹窗
        openDeleteConfirm (item) {
            let that = this;
            invoiceHandler.showConfirm('确定删除该条开票记录', function(){
                that.deleteInvoice(item)
            }, 2, null, null, null, null, true);
        },
        // 删除发票记录
        deleteInvoice (item) {
            let param = {
                orderNo: item.orderNo
            }
            invoiceHandler.deleteInvoiceHistory(param).then(res => {
                if (res.resultCode == 0) {
                    this.getTripList('type');
                } else {
                    invoiceHandler.showToast('删除失败')
                }
            }).catch(err => {
                console.error(err)
                invoiceHandler.showToast('删除失败')
            })
        },
        // 跳转订单详情
        goOrderDetail (item) {
            let that = this;
            let url = '';
            if (item.orderType === 'ORDER_TYPE_FLIGHT') {
                url = 'order/index.html#/detail/flight';
            } else if (item.orderType === 'ORDER_TYPE_TRAIN') {
                url = 'order/index.html#/detail/train';
            } else if (item.orderType === 'ORDER_TYPE_HOTEL') {
                url = 'order/index.html#/detail/hotel';
            } else if (item.orderType === 'ORDER_TYPE_CAR') {
                url = 'order/index.html#/detail/car';
            }
            url = url + '?orderNo=' + item.orderNo + '&pageFrom=invoiceHistory';
            //判断酒店已取消查看订单详情 弹窗提示
            if (that.judgeHotelCancle(item)){
                invoiceHandler.showConfirm('酒店订单已取消，商旅通将不再开具报销凭证', function(){
                    that.openDeleteConfirm(item)
                }, 2, '查看订单详情', '删除该条记录', null, function(){
                    invoiceHandler.openPageLib(url);
                }, true);
                return
            }

            invoiceHandler.openPageLib(url);
        },
        /*  
        * 判断是否是酒店取消的 酒店取消订单，不再开具报销凭证 
        *item.orderType == 'ORDER_TYPE_HOTEL' 代表酒店发票
        *item.invoiceDone == '2' 代表取消发票
        **/
        judgeHotelCancle(item){
            let flag = false;
            if (item.orderType == 'ORDER_TYPE_HOTEL' && item.invoiceDone == '2'){
                flag = true;
            }
            return flag;
        }
    }
}
</script>

<style lang='less' scoped>
@import '~themes/default/styles/invoiceHistory.less';
</style>

