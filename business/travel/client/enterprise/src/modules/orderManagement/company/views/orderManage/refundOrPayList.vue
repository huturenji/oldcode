<template>
    <div class="refundOrPayList_container">
        <!--筛选popup弹出窗-->
        <div v-transfer-dom>
            <popup v-model="filterDataPopup" height="50%">
                <div class="departmentPopup">
                    <ul>
                        <li class="cursorp"
                            v-for="(item,index) in filterData"
                            :key='index'
                            :class="{departmentActive:filterSelect==index}"
                            :style="filterSelect==index?departmentActiveBG:''"
                            @click="choosefilterData(index)"
                        >{{item.name}}
                        </li>
                    </ul>
                </div>
            </popup>
        </div>
        <!--部门popup弹出窗-->
        <!-- <div v-transfer-dom>
            <popup v-model="departmentPopup" height="100%">
                <div class="departmentPopup">
                    <ul>
                        <li class="cursorp"
                            v-for="(item,index) in departmentData"
                            :key="index"
                            :class="{departmentActive:departmentSelect==index}"
                            :style="departmentSelect==index?departmentActiveBG:''"
                            @click="chooseDepartment(index,item.departmentId)"
                        >
                            {{item.name?item.name:'全部部门'}}
                        </li>
                    </ul>
                </div>
            </popup>
        </div> -->
        <!--日期选择弹出窗-->
        <div v-transfer-dom>
            <van-calendar v-model="calendarShow" type="range" :min-date='new Date(-1)' 
            :max-date='nowDate' :default-date='rangeDate' color="#262DD9" @confirm="commitDate" />
        </div>
        <div class="res550">
            <div class="pickWrap">
                <div class="ReserveDate">
                    <p class="smTitle">交易日期</p>
                    <ul>
                        <li class="cursorp" @click="pcCalendarBoxShow0">
                            <p>{{startPcCalendarDate}}</p>
                            <img src="~assets/img/company/company_icon_calendar.png" alt="">
                            <img src="~assets/img/company/company_icon_calendar_hov.png" alt="">
                        </li>
                        <li>—</li>
                        <li class="cursorp" @click="pcCalendarBoxShow1">
                            <p>{{endPcCalendarDate}}</p>
                            <img src="~assets/img/company/company_icon_calendar.png" alt="">
                            <img src="~assets/img/company/company_icon_calendar_hov.png" alt="">
                        </li>
                    </ul>
                </div>
                <!-- <div class="ReserveDepartment">
                    <p class="smTitle">部门</p>
                    <div class="chooseDepartment cursorp" @click.stop="departmentList=!departmentList">
                        下拉框
                        <ul v-if="departmentList">
                            <li class="cursorp"
                                v-for="(item,index) in departmentData"
                                :key="index"
                                :class="{departmentActive:departmentSelect==index}"
                                @click.stop="chooseDepartment(index,item.departmentId)"
                            >
                                {{item.name?item.name:'全部部门'}}
                            </li>
                        </ul>
                        <p>{{departmentData[departmentSelect].name?departmentData[departmentSelect].name:'全部部门'}}</p>
                        <img src="~assets/img/company/company_icon_spread.png" alt="">
                        <img src="~assets/img/company/company_icon_spread_hov.png" alt="">
                    </div>
                </div> -->
            </div>
            <div class="numTitle">
                <span v-if="isTotalData">总支出：</span>
                <span v-else>退款：</span>
                <span v-if="isTotalData">￥{{spendingAmount}}</span>
                <span v-else>{{totalRefundAmount}}</span>
            </div>
            <ul class="tipTitle">
                <li>类型</li>
                <li>时间</li>
                <li v-if="isTotalData">支出(元)</li>
                <li v-else>退款(元)</li>
                <li>支付方式</li>
                <li>详情</li>
            </ul>
        </div>
        <div class="topWrap resNormal">
            <div class="selectWrap">
                <div class="left">
                    <!--按月-->
                    <p class="iconArray">
                        <span class="cursorp" v-if="changeFilter" @click="changeFilter=!changeFilter">按月</span>
                        <span class="cursorp" v-else @click="changeToMonthFilter">按日</span>
                        <img src="~assets/img/company/company_icon_array.png" alt="">
                    </p>
                    <!-- <div class="iconArray" v-if="changeFilter" @click='showMonthCalendar'> -->
                    <div class="iconArray" v-if="changeFilter">
                        <!--按月-->
                        <datetime
                            format="YYYY-MM"
                            v-model="formatValue"
                            :display-format="formatValueFunction"
                            @on-change="change"
                            :min-year=2000
                            :end-date="setEndDate"
                        >
                        </datetime>
                        <!-- {{formatValueFunction(formatValue)}} -->
                        <!-- <img src="~assets/img/company/company_icon_array_down.png" alt=""> -->
                    </div>
                </div>
                <div class="iconArray" v-if="!changeFilter">
                    <!--按日-->
                    <p class="cursorp" @click="calendarShowThis"><span>{{startDate}}</span>至<span>{{endDate}}</span>
                    </p>
                    <!-- <img src="~assets/img/company/company_icon_array_down.png" alt=""> -->
                </div>
                <!-- <p @click="departmentPopup=true" class="iconArray cursorp department"> -->
                    <!--<popup-radio :options="departmentData" v-model="department"></popup-radio>-->
                    <!-- <span>{{departmentData[departmentSelect].name?departmentData[departmentSelect].name:'全部部门'}}</span>
                    <img src="~assets/img/company/company_icon_array_down.png" alt="">
                </p> -->
            </div>
            <div class="filter">
                <p>
                    <span v-if="isTotalData">总支出：</span>
                    <span v-else>退款：</span>
                    <span v-if="isTotalData">￥{{spendingAmount}}</span>
                    <span v-else>{{totalRefundAmount}}</span>
                </p>
                <p class="cursorp" @click="filterDataPopup=true">
                    <img src="~assets/img/company/company_icon_filter.png" alt="">
                    <span style="font-size: .32rem">筛选</span>
                    <span>({{filterData[filterSelect].name}})</span>
                    <img src="~assets/img/company/company_icon_array_down2.png" alt="">
                </p>
            </div>
        </div>
        <section>
            <LoadingX tipsText="订单加载中" v-if="loading"/>
            <div class="noInfo" v-if="noOrder">暂无订单</div>
            <div v-infinite-scroll="loadMore" :infinite-scroll-disabled="false" infinite-scroll-distance="5">
                <TicketCard
                    v-for="(item,index) in refundOrPayList"
                    :key="index"
                    :PayTypeName="item.alias || item.payTypeName"
                    :MoneyAmount="isTotalData?item.payAmount:item.refundAmount"
                    :OrderTime="item.refDate?item.refDate:item.orderTime"
                    :OrderType="item.orderType"
                    :PaymentPlatformName="item.paymentPlatformName"
                    :OrderNo="item.orderNo"
                    v-show="!loading"
                ></TicketCard>
            </div>
        </section>
        <!--选择起始日期弹出框-->
        <SnDatetimePicker
            v-show="false" 
            ref="startDateTimePicker"
            v-model="startPcCalendarDate"
            :disabled-date="disabledDate1"
            @change="checkStartDate"
        />
        <!--选择结束日期弹出框-->
        <SnDatetimePicker
            v-show="false" 
            ref="endDateTimePicker"
            v-model="endPcCalendarDate"
            :disabled-date="disabledDate1"
            @change="checkEndDate"
        />
    </div>
</template>

<script>
// import InfiniteScroll from 'orderCommon/third/infinite-scroll/infinite-scroll.js'
// import CalendarX from "components/calendar/CalendarX.vue";
import LoadingX from "components/loading/LoadingX.vue";
import { SnDatetimePicker } from "sinosun-ui";
// import TicketCard from './components/ticketCard.vue'
import requestHandler from 'orderCommon/requestHandler.js';
import {
    TransferDom,
    Datetime,
    Popup
} from 'vux'
// import {setTimeout} from 'timers';

function nowDate() { // 当前日期
    var date = new Date();
    return date.format('yyyy/MM/dd');
}

// 转换日期格式 加0换-
function addZero(numdate, type) {
    return numdate.format('yyyy/MM/dd').replace(/\//g, type)
}

function addZeroEasy(numdate, type) { // eslint-disable-line
    var arr = numdate.split("/");
    if (arr[1] * 1 < 10 && arr[1].length < 2) {
        arr[1] = "0" + arr[1];
    }
    if (arr[2] * 1 < 10) {
        arr[2] = "0" + arr[2];
    }
    return arr.join(type);

}

function setEndDate() {
    //  格式化终止选择时间
    return nowDate().replace(/\//g, '-')
}

// that**this
// timeSet**[0,1,2,3,4]
// Timestamp Boolean
// others  []  增加方法
// except  []  去除方法
// getDataXsetData
function getDataXsetData(that, timeSet, others, except) {
    if (timeSet) { // 设置时间
        let arr = [
            change => that.startDate = change,
            change => that.endDate = change,
            change => that.startPcCalendarDate = change,
            change => that.endPcCalendarDate = change,
            change => that.queryDate = change
        ]
        for (var i = 0; i < arr.length; i++) {
            if (timeSet[i]) {
                arr[i](timeSet[i])
            }
        }
    }
    let methods = [ // 对比待使用函数
        that.clearPage,
        that.getRefundOrPayList // 查支出退款
    ]
    if (except) { // 去掉不调用函数部分 []
        for (var k = 0; k < methods.length; k++) {
            for (var j = 0; j < except.length; j++) {
                if (methods[k] == except[j]) {
                    methods.splice(k, 1)
                    k--
                }
            }
        }
    }

    methods.forEach((item, index) => {
        if (index == (methods.length - 1)) {
            item(that)
        } else {
            item();
        }
    })

    if (others) { // 额外函数调用 []
        others.forEach((item) => {
            item();
        })
    }
}

export default {
    directives: {
        TransferDom
    },
    mixins: [requestHandler.mixin.tChatEventMixin],
    components: {
        LoadingX,
        Datetime,
        SnDatetimePicker,
        Popup
    },
    props: {},
    data() {
        let that = this;
        let managerData = requestHandler.stateManager.setData(['departmentPopup', 'calendarShow', 'filterDataPopup'], this);
        return Object.assign(managerData, {
            filterSelect: 0,
            filterData: [
                {name: "全部订单"},
                {name: "机票"},
                {name: "酒店"},
                {name: "火车票"},
                {name: "快递"}
            ],
            page: {
                currPage: 1,
                totalPageCount: 1
            },
            rangeDate: [],
            busy: false,
            loadMoreFlag: false,
            queryOrderType: 0, // 筛选类型
            loading: false,
            noOrder: false,
            refundNum: "",
            PayNum: "",
            totalRefundAmount: 0,
            spendingAmount: 0,
            refundOrPayList: [], // 退款支付列表
            departmentId: "",
            queryDate: "", // 按月显示值 传入
            startPcCalendarDate: null,
            endPcCalendarDate: null,
            startDate: '',
            endDate: '',
            departmentSelect: 0,
            departmentList: false,
            departmentActiveBG: {
                backgroundImage: 'url(' + require('assets/img/hotel/check2.png') + ')'
            },
            changeFilter: true,
            showMonthCalendarPop: false,
            screenWidth: '',
            departmentData: [
                {name: "全部部门", departmentId: ""}

            ],
            formatValue: that.$route.query.formatValue,
            setEndDate: setEndDate(),
            nowDate: new Date(nowDate())
        })
    },
    computed:{
        isTotalData(){
            return this.$route.query.title=='totalPay'
        }
    },
    created: function () {
            
    },
    methods: {
        goBackFun(){
            this.$router.back();
        },
        checkStartDate(val){
            let that = this;
            let timestamp1 = new Date(val)
            let timestamp2 = new Date(that.endPcCalendarDate)
            if (timestamp1 <= timestamp2) {
                that.startPcCalendarDate = new Date(val).format('yyyy/MM/dd')
            } else {
                requestHandler.showToast('预定日期查询条件开始时间不能晚于结束时间')
            }
        },
        checkEndDate(val){
            let that = this;
            let timestamp1 = new Date(that.startPcCalendarDate)
            let timestamp2 = new Date(val)
            if (timestamp1 <= timestamp2) {
                that.endPcCalendarDate = new Date(val).format('yyyy/MM/dd')
            } else {
                requestHandler.showToast('预定日期查询条件开始时间不能晚于结束时间')
            }
        },
        /*
            不可选时间段
            */
        disabledDate1(current) {
            return current > new Date().getTime();
        },
        formatValueFunction(val) {
            // 格式化插件时间
            var arr = val.split("-");
            if (arr.length == 0) {
                return;
            }
            return arr[0] + '年' + (arr.length > 1 ? arr[1] + '月' : '');
        },
        /**
             * 弹出按月日历
             */
        showMonthCalendar() {
            let that = this;
            that.$vux.datetime.show({
                value: that.formatValue,
                format: "YYYY-MM",
                onChange: "change",
                minYear: "2000",
                endDate: that.setEndDate,
                confirmText: '确定',
                cancelText: '取消',
                onConfirm(value) {
                    that.change(value);
                    that.formatValue = value;
                },
                onHide() {
                    that.showMonthCalendarPop = false
                },
                onShow() {
                    that.showMonthCalendarPop = true;
                }
            })
        },
        calendarShowThis() {
            this.calendarShow = true
            this.rangeDate = [new Date(this.startDate.replace(/-/g, '/')), new Date(this.endDate.replace(/-/g, '/'))];
        },
        change(value) {
            var that = this;
            var endMounth = value.split("-")[1].replace(/0/g, '')
            var endYear = value.split("-")[0]
            let timeSet = [
                value + "-01", // that.startDate
                value + '-' + requestHandler.getLastDay(endYear, endMounth), //that.endDate
                (value + "-01").replace(/-/g, '/'), // that.startPcCalendarDate
                (value + '-' + requestHandler.getLastDay(endYear, endMounth)).replace(/-/g, '/'), // that.endPcCalendarDate
                value + "-01" // that.queryDate
            ]
            getDataXsetData(that, timeSet)
        },
        changeToMonthFilter() {
            var that = this
            this.changeFilter = true
            this.formatValue = new Date().format('yyyy/MM').replace(/\//g, '-')
            var endMounth = that.formatValue.split("-")[1].replace(/0/g, '')
            var endYear = that.formatValue.split("-")[0]
            let timeSet = [
                that.formatValue + "-01", // that.startDate
                that.formatValue + '-' + requestHandler.getLastDay(endYear, endMounth), //that.endDate
                (that.formatValue + "-01").replace(/-/g, '/'), // that.startPcCalendarDate
                (that.formatValue + '-' + requestHandler.getLastDay(endYear, endMounth)).replace(/-/g, '/'), // that.endPcCalendarDate
                that.formatValue + "-01" // that.queryDate
            ]
            getDataXsetData(that, timeSet)
        },
        commitDate(date) {
            var that = this;
            if (!date[0] || !date[1]) {
                requestHandler.showToast('请选择完整')
            } else {
                this.calendarShow = false;
                let timeSet = [
                    addZero(date[0], "-"), // that.startDate
                    addZero(date[1], "-"), //that.endDate
                    (addZero(date[0], "-")).replace(/-/g, '/'), // that.startPcCalendarDate
                    (addZero(date[1], "-")).replace(/-/g, '/'), // that.endPcCalendarDate
                    '' // that.queryDate
                ]
                getDataXsetData(that, timeSet)
                this.formatValue = new Date(this.startPcCalendarDate).format('yyyy/MM').replace(/\//g, '-')
            }
        },
        pcCalendarBoxShow0() {
            let that = this
            that.$refs.startDateTimePicker.onClick()
        },
        pcCalendarBoxShow1() {
            let that = this
            that.$refs.endDateTimePicker.onClick()
        },
        /**
             * 修改部门
             */
        chooseDepartment(index, departmentId) {
            let that = this
            this.departmentSelect = index;
            this.departmentPopup = false;
            this.departmentList = false;
            this.departmentId = departmentId
            this.clearPage()
            this.getRefundOrPayList();
            requestHandler.setStorage('manageDepartmentId', that.departmentId)
            requestHandler.setStorage('manageDepartmentSelect', that.departmentSelect)
        },
        /**
             * 移动端切换
             */
        choosefilterData(index) {
            var that = this
            this.filterSelect = index
            this.filterDataPopup = false
            that.queryOrderType = index
            this.clearPage()
            that.getRefundOrPayList();
        },
        /**
             * 初始化页面与加载内容
             */
        clearPage() {
            let that = this
            that.page.currPage = 1
            that.page.totalPageCount = 1
            that.loadMoreFlag = false
        },
        loadMore() {
            var that = this
            //延迟了1秒，防止滚动条滚动时的频繁请求数据
            if (that.loadMoreFlag) {
                that.page.currPage++
                console.log(that.page.currPage, that.page.totalPageCount)
                if (that.page.currPage <= that.page.totalPageCount) { // 有更多内容
                    that.getRefundOrPayList()
                }
                //  alert(5555)
                //     setTimeout(() => {
                //     that.loadMoreFlag= true
                //   }, 1000);
            }
            that.loadMoreFlag = false
        },
        async getRefundOrPayList() {
            var that = this
            if (that.page.currPage == 1) {
                that.refundOrPayList = []
                that.loading = true
            }
            that.noOrder = false
            let func = requestHandler.getRefOrders;
            if (that.$route.query.title == 'totalPay') {
                func = requestHandler.getOrdersByAmount;
            }// 支出或退款切换接口
            const obj = {
                'queryOrderType': that.queryOrderType,
                // 'departmentId': that.departmentId,
                'queryBeginDate': that.startDate,
                'queryEndDate': that.endDate,
                'pageSize': 20,
                'pageIndex': that.page.currPage
            }
            obj.useType = requestHandler.ENABLE_USE_TYPE ? requestHandler.USE_TYPE_ENUM.PUBLIC.code : requestHandler.USE_TYPE_ENUM.PRIVATE.code
            func.call(requestHandler,obj).then( res => {
                let data = res.result;
                if (data && data.orders && data.orders.length > 0) {
                    if (that.page.currPage != 1) {
                        that.refundOrPayList = that.refundOrPayList.concat(data.orders)
                        that.loadMoreFlag = true
                    } else {
                        that.page.totalPageCount = data.totalPageCount
                        that.refundOrPayList = data.orders
                        that.loadMoreFlag = true
                    }
                    if (data.totalRefCount) {
                        that.totalRefundAmount = data.totalRefCount
                    }
                    if (data.totalPayAmount) {
                        that.spendingAmount = data.totalPayAmount
                    }
                    if (data.totalRefCount == 0 || data.totalRecord == 0) {
                        that.totalRefundAmount = 0
                        that.spendingAmount = 0
                    }
                    that.loading = false
                } else {
                    if (that.refundOrPayList.length == 0) {
                        that.noOrder = true
                        that.totalRefundAmount = 0
                        that.spendingAmount = 0
                    }
                    that.loading = false
                    console.log("data none")
                }
            }).catch(()=>{})

        },
        getApartmentData() {
            console.log("search apartment List");
            // departmentData
            // var that = this;
            // requestHandler.downloadCpyOrganization().then(({data}) => {
            //     var arr = [];
            //     data.orgList.map((item, index) => {
            //         if(item.orgId > 0 && item.pOrgId == -1){
            //             //排除跟部门，跟部门不能加人，不会有统计数据
            //             console.log("pOrgId == -1,delete");
            //         }else{                        
            //             arr.push({name: item.orgName, departmentId: item.orgId});
            //         }
            //     });
            //     arr.unshift({name: "全部部门", departmentId: ''});
            //     that.departmentData = arr;
            //     // 查完部门查订单数据
            //     that.getRefundOrPayList()
            // });
        }
    },
    mounted() {
        var that = this;
        // 设置title为支出或者退款
        if (this.$route.query.title == 'totalPay') {
            document.getElementsByTagName("title")[0].innerHTML = '总支出'
            this.spendingAmount = this.$route.query.SpendingAmount
            that.PayNum = that.spendingAmount
        } else {
            document.getElementsByTagName("title")[0].innerHTML = '退款'
            this.totalRefundAmount = this.$route.query.totalRefundAmount
            that.refundNum = that.totalRefundAmount
        }
        let query = that.$route.query
        that.queryDate = query.queryDate
        that.startDate = query.startDate
        that.endDate = query.endDate
        that.startPcCalendarDate = query.startPcCalendarDate
        that.endPcCalendarDate = query.endPcCalendarDate
        that.departmentSelect = query.departmentSelect
        that.changeFilter = query.changeFilter
        that.departmentId = query.departmentId
        that.getApartmentData()
    },
    watch: {
        startPcCalendarDate(val) {
            let that = this
            let timeSet = [new Date(val).format('yyyy/MM/dd').replace(/\//g, '-'), '', val]
            getDataXsetData(that, timeSet)
        },
        endPcCalendarDate(val) {
            let that = this
            let timeSet = ['', new Date(val).format('yyyy/MM/dd').replace(/\//g, '-'), '', val]
            getDataXsetData(that, timeSet)
        }
    },
    filters: {}
}
</script>
<style scoped lang="less" type="text/less">
    @import '~themes/default/styles/common/index.less';
    @import '~styles/mixins/mixinsStyle.less';
    // @import '~styles/animate.min.css';

    /*响应式排布550-1080*/
    @media screen and (min-width: @screen-sm) and (max-width: @screen-md) {
        .refundOrPayList_container {
            .resNormal {
                display: none;
            }
            .res550 {
                display: block !important;
                width: 92%;
                margin: 0 auto;
                .pickWrap {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                    padding: 16px 0;
                    border-bottom: 1px dashed #e5e5e5;
                    position: relative;
                    .smTitle {
                        font-size: 12px;
                        color: #7f7f7f;
                    }
                    .ReserveDate {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        ul {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            li {
                                cursor: pointer;
                                margin-left: 12px;
                                &:hover img {
                                    display: none;
                                }
                                &:hover img:last-child {
                                    display: block;
                                }

                                &:first-child {
                                    border: 1px solid #d2d2d2;
                                    width: 120px;
                                    border-radius: 4px;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                }
                                &:last-child {
                                    border: 1px solid #d2d2d2;
                                    width: 120px;
                                    border-radius: 4px;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                }
                                p {
                                    padding-left: 10px;
                                }

                                img {
                                    width: 28px;
                                    height: 26px;
                                    &:last-child {
                                        display: none;
                                    }

                                }

                            }
                        }
                    }
                    .ReserveDepartment {

                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .chooseDepartment {
                            position: relative;
                            cursor: pointer;
                            margin-left: 12px;
                            border: 1px solid #d2d2d2;
                            min-width: 116px;
                            border-radius: 4px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            ul {
                                position: absolute;
                                background-color: #fff;
                                top: 28px;
                                left: 0;
                                max-height: 336px;
                                overflow-y: auto;
                                z-index: 999;
                                border: 1px solid #eff2f5;
                                li {
                                    line-height: 28px;
                                    padding-left: 12px;
                                    box-sizing: border-box;
                                    &:last-child {
                                        border-bottom: 0;
                                    }
                                    &:hover {
                                        background-color: #eff2f5;
                                    }
                                }
                            }
                            &:hover img {
                                display: none;
                            }
                            &:hover img:last-child {
                                display: block;
                            }

                            p {
                                padding-left: 10px;
                            }
                            img {
                                width: 28px;
                                height: 26px;
                                &:last-child {
                                    display: none;
                                }
                            }
                        }
                    }
                }
                .numTitle {
                    font-size: 20px;
                    padding: 16px 0 20px;
                    color: #333333;
                }
                .tipTitle {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 14px;
                    color: #7f7f7f;
                    li {
                        &:first-child {
                            width: 100px;
                        }
                        &:nth-child(2) {
                            width: 150px;
                        }
                        &:nth-child(3) {
                            width: 92px;
                        }
                        &:nth-child(4) {
                            width: 70px;
                        }
                        &:nth-child(5) {
                            width: 70px;
                        }
                    }
                }
            }
        }

    }

    @media screen and (min-width: @screen-md) {
        /*响应式排布>1024*/
        .refundOrPayList_container {
            .resNormal {
                display: none;
            }
            .res550 {
                display: block !important;
                width: 92%;
                margin: 0 auto;
                .pickWrap {
                    /*选项部分不变*/
                    max-width: 62%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                    padding: 16px 0;
                    border-bottom: 1px dashed #e5e5e5;
                    position: relative;
                    .smTitle {
                        font-size: 12px;
                        color: #7f7f7f;
                    }
                    .ReserveDate {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        ul {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            li {
                                cursor: pointer;
                                margin-left: 12px;
                                &:hover img {
                                    display: none;
                                }
                                &:hover img:last-child {
                                    display: block;
                                }

                                &:first-child {
                                    border: 1px solid #d2d2d2;
                                    width: 120px;
                                    border-radius: 4px;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                }
                                &:last-child {
                                    border: 1px solid #d2d2d2;
                                    width: 120px;
                                    border-radius: 4px;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                }
                                p {
                                    padding-left: 10px;
                                }

                                img {
                                    width: 28px;
                                    height: 26px;
                                    &:last-child {
                                        display: none;
                                    }

                                }

                            }
                        }
                    }
                    .ReserveDepartment {

                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .chooseDepartment {
                            position: relative;
                            cursor: pointer;
                            margin-left: 12px;
                            border: 1px solid #d2d2d2;
                            min-width: 116px;
                            border-radius: 4px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            ul {
                                position: absolute;
                                background-color: #fff;
                                top: 28px;
                                left: 0;
                                max-height: 336px;
                                overflow-y: auto;
                                z-index: 999;
                                border: 1px solid #eff2f5;
                                li {
                                    line-height: 28px;
                                    padding-left: 12px;
                                    box-sizing: border-box;
                                    &:last-child {
                                        border-bottom: 0;
                                    }
                                    &:hover {
                                        background-color: #eff2f5;
                                    }
                                }
                            }
                            &:hover img {
                                display: none;
                            }
                            &:hover img:last-child {
                                display: block;
                            }

                            p {
                                padding-left: 10px;
                            }
                            img {
                                width: 28px;
                                height: 26px;
                                &:last-child {
                                    display: none;
                                }
                            }
                        }
                    }
                }
                .numTitle {
                    font-size: 20px;
                    padding: 16px 0 20px;
                    color: #333333;
                }
                .tipTitle {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 14px;
                    color: #7f7f7f;
                    li {
                        &:first-child {
                            width: 100px;
                        }
                        &:nth-child(2) {
                            width: 150px;
                        }
                        &:nth-child(3) {
                            width: 92px;
                        }
                        &:nth-child(4) {
                            width: 70px;
                        }
                        &:nth-child(5) {
                            width: 70px;
                        }
                    }
                }
            }
        }

    }

    /*初始
    状态
    */
    .noInfo {
        margin-top: 1.5rem;
        height: 0.5rem;
        padding-top: 3rem;
        text-align: center;
        font-size: 0.32rem;
        line-height: 0.42rem;
        color: #b2b2b2;
        background: url(~assets/img/company/empty.png) no-repeat center;
        background-size: 1.62rem 1.83rem;
    }

    /*部门选择pop样式*/
    .departmentPopup {
        ul {
            padding: 0 .3rem;
            li {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                border-bottom: .01rem solid #e5e5e5;
                padding: .3rem 0;
                background-repeat: no-repeat;
                background-position: right;
                -webkit-background-size: .39rem .3rem;
                background-size: .39rem .3rem;
            }
        }
    }

    /*部门选择点击样式*/
    .departmentActive {
        color: #262DD9;
    }

    .refundOrPayList_container {
        background-color: #fff;
        .res550 {
            display: none;
        }
        display: flex;
        flex-direction: column;
        .topWrap {
            .selectWrap {
                background-color: #262DD9;
                color: #FFFFFF;
                /*padding-top: .3rem;*/
                padding: 0 .3rem;
                height: .6rem;
                font-size: .28rem;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .left {
                    display: flex;
                    justify-content: space-between;
                    .iconArray:first-child {
                        margin-right: .24rem;
                    }
                }
                .iconArray {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    /deep/ .vux-datetime{
                        color: #fff;
                        .vux-cell-value{
                            color: #fff;
                        }
                    }
                    span{
                        /* width: 60px; */
                        display: inline-block;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    img {
                        width: .3rem;
                        height: .3rem;
                        vertical-align: middle;
                        margin-left: .08rem;
                    }

                }
                .department{
                    max-width: 83px;
                }
                p {
                    &:first-child {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                }

            }
            .filter {
                margin-bottom: .2rem;
                padding: 0 .3rem;
                background-color: #ffffff;
                color: #333333;
                height: .94rem;
                font-size: .32rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                p {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    &:first-child {
                        font-weight: bold;
                    }
                    &:last-child {
                        span {
                            font-size: .22rem;
                            margin-left: .08rem;
                            color: @secondary-text-color;
                        }
                        img {
                            width: .22rem;
                            height: .22rem;
                            vertical-align: middle;
                            margin-left: .08rem;
                        }
                        img:first-child {
                            width: .3rem;
                            height: .3rem;
                        }
                    }
                }
            }
        }
        section {
            flex: 1;
            overflow-y: scroll;

        }
    }

</style>
<style type="text/less" lang="less">
    .weui-cell__ft, .vux-cell-primary, .vux-datetime-value{
        /deep/ .vux-cell-value{
            color: #fff !important;
        }
        &:after{
            border-color: #fff !important;
        }
    }

</style>
