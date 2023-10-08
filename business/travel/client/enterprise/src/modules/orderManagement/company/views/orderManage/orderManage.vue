<template>
    <div class="orderManage_container">
        <div class="loadingMask" v-if="loading">
            <LoadingX tipsText="页面加载中" />
        </div>
        <!--日期选择弹出窗-->
        <div v-transfer-dom>
            <van-calendar v-model="calendarShow" type="range" :min-date='new Date(-1)' 
                :max-date='nowDate' :default-date='rangeDate' color="#262DD9" @confirm="commitDate" />
        </div>
        <div class="res550" v-if='isPC'>
            <!--此处可能需要滚动-->
            <p class="tips">
                <Icon type='icon_common_prompt'/>
                <span>以下数据来源于{{ENABLE_USE_TYPE ? '因公出行' : '企业支付'}}的已交易订单</span>
            </p>
            <div class="pickWrap">
                <div class="ReserveDate">
                    <p class="smTitle">交易日期</p>
                    <ul>

                        <li class="cursorp" @click.stop="pcCalendarBoxShow0">
                            <p>{{startPcCalendarDate}}</p>
                            <img src="~assets/img/company/company_icon_calendar.png" alt>
                            <img src="~assets/img/company/company_icon_calendar_hov.png" alt>
                        </li>
                        <li>—</li>
                        <li class="cursorp" @click.stop="pcCalendarBoxShow1">
                            <p>{{endPcCalendarDate}}</p>
                            <img src="~assets/img/company/company_icon_calendar.png" alt>
                            <img src="~assets/img/company/company_icon_calendar_hov.png" alt>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="componentBox">
                <orderTotalMsg :dataStatistics="dataStatistics" :changeFilter='changeFilter'
                    :formatValue="formatValue" :startPcCalendarDate="startPcCalendarDate"
                    :endPcCalendarDate="endPcCalendarDate" :startDate="startDate" :QueryDate="QueryDate"
                    :endDate="endDate" :departmentSelect="departmentSelect" :departmentId="departmentId">
                </orderTotalMsg>
            </div>
        </div>
        <div class="topWrap resNormal" v-else>
            <div class="selectWrap">
                <!--按月-->
                <div class='filter-type'>
                    <span class="cursorp" v-if="changeFilter" @click="changeFilter=!changeFilter">
                        按月
                        <Icon type='sort' size='.24'/>
                    </span>
                    <span class="cursorp" v-else @click="changeToMonthFilter">
                        按日
                        <Icon type='sort' size='.24'/>
                    </span>
                </div>
                <div class="iconArray" v-if="changeFilter" @click='openSnDatePicker'>
                    <!--按月-->
                    <span>{{formatValue | formatValueFunction}}</span>    
                    <SnDatetimePicker ref='datetimePicker' v-show='false' v-model="formatValueArr" mode="year-month" @change="change" :disabled-date='disabledDate1'/>
                    <Icon type='down' size='.24'/>
                </div>
                <div class="iconArray" v-else @click="calendarShowThis">
                    <!--按日-->
                    <p class="cursorp" >
                        {{startDate}}至{{endDate}}
                    </p>
                    <Icon type='down' size='.24'/>
                </div>
            </div>
            <div class="componentBox">
                <orderTotalMsg :dataStatistics="dataStatistics" :changeFilter='changeFilter'
                    :formatValue="formatValue" :startPcCalendarDate="startPcCalendarDate"
                    :endPcCalendarDate="endPcCalendarDate" :startDate="startDate" :QueryDate="QueryDate"
                    :endDate="endDate" :departmentSelect="departmentSelect"
                    :departmentId="departmentId"></orderTotalMsg>
            </div>
        </div>
        <div class="pushSetting550">
            <div class="pushSettingWrap">
                <div class="pushDesc">月底推送提醒核对财务报表</div>
                <div class="setIcon" :class="pushSettingStatus?'checked':'unChecked'" @click="startPushSeeeting()">
                </div>
            </div>
        </div>
        <div class="pushSetting pushSettingNormal">
            <div class="pushSettingWrap">
                <div class="pushDesc">月底推送提醒核对财务报表</div>
                <div class="setIcon" :class="pushSettingStatus?'checked':'unChecked'" @click="startPushSeeeting()">
                </div>
            </div>
        </div>
        <section class="chartContent">
            <ul>
                <!--饼形图-->
                <li v-for="(item,index) in chartBoxPie" :key="item.chartType+index">
                    <p class="chartTitle clearfix">
                        {{item.chartType}}
                    </p>
                    <div class="chartBox">
                        <PieChart :index="index" :pieData="pieData[index]" :pieId="'pieId'+index"
                            :circleColor="item.color" :chartType="item.chartType" :loadingFlagPie="loadingFlagListPie"
                            ref="chart"></PieChart>
                    </div>
                    <div class='chart-label'>
                        <div class="chartBoxBott" v-if="item.chartType=='总支出'">
                            <p v-for="(value,key,index) in payTypeList" :key="index+value">
                                <span class="no-wrap">{{key}}</span>
                                <span><span class='rmb'>&yen;</span>{{value}}</span>
                            </p>
                        </div>
                    </div>
                </li>
                <!--柱形图-->
                <li v-for="(item,index) in chartBoxPillar" :key="index">
                    <p class="chartTitle clearfix">
                        {{item.chartType}}
                    </p>
                    <v-touch v-on:swipeleft="leftChange(index)" style="width:100%;height:100%"
                        v-on:swiperight="rightChange(index)" :swipe-options="{direction: 'horizontal'}">
                        <div class="pillarChartBox">
                            <p class="btnLeft cursorp" v-if="isPillarPageShowL[index]"
                                @click="changePillarPageL(index)">
                                <img class="img1" src="~assets/img/company/arr_left_nor.png" alt="">
                                <img class="img2" src="~assets/img/company/arr_left_pre.png" alt="">
                            </p>
                            <p class="btnRight cursorp" v-if="isPillarPageShowR[index]"
                                @click="changePillarPageR(index)">
                                <img class="img1" src="~assets/img/company/arr_right_nor.png" alt="">
                                <img class="img2" src="~assets/img/company/arr_right_pre.png" alt="">
                            </p>
                            <PillarChart :pillarData="pillarData[index]" :PillarId="'PillarId'+index"
                                :PillarColor="item.color" ref="chart" :loadingFlag="loadingFlagList"
                                :pillarCityY="pillarCityY" :pillarDateY="pillarDateY" @clickSeries='param=>clickSeries(index,param)'></PillarChart>
                        </div>
                    </v-touch>
                </li>
            </ul>
        </section>
        <!--选择起始日期弹出框-->
        <SnDatetimePicker v-show="false" ref="startDateTimePicker" v-model="startPcCalendarDate"
            :disabled-date="disabledDate1" @change="checkStartDate" />
        <!--选择结束日期弹出框-->
        <SnDatetimePicker v-show="false" ref="endDateTimePicker" v-model="endPcCalendarDate"
            :disabled-date="disabledDate1" @change="checkEndDate" />
    </div>
</template>

<script>
// import CalendarX from "components/calendar/CalendarX.vue";
import extendUtils from 'orderCommon/extend.js';
import LoadingX from "components/loading/LoadingX.vue";
import { SnDatetimePicker } from "sinosun-ui";
import PieChart from "./components/pieChart.vue";
import PillarChart from "./components/myChart.vue";
import orderTotalMsg from "./components/orderTotalMsg.vue";
import requestHandler from 'orderCommon/requestHandler.js';
import { TransferDom} from "vux";
// import { setTimeout } from 'timers';
import Icon from "components/icon";
function nowDate() { 
    var date = new Date();
    return date.format('yyyy/MM/dd');
}
    

function nowDateOne() { // 当前月份第一天
    // var date = new Date();
    return new Date().format('yyyy/MM') + '/' + '01'
}

// 转换日期格式
function addZero(numdate, type) {
    return numdate.format('yyyy/MM/dd').replace(/\//g, type)
}

function addZeroEasy(numdate, type) {
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

// 刷新图表 启动loading
function refreshCharts(that) {
    that.$refs.chart.map((item) => {
        return item.drawChart && item.drawChart();
    });
}

function setSessionBox(that) { // 存储时间节点和部门信息
    requestHandler.setSession('startPcCalendarDate', that.startPcCalendarDate)
    requestHandler.setSession('endPcCalendarDate', that.endPcCalendarDate)
    requestHandler.setSession('OstartDate', that.startDate)
    requestHandler.setSession('OendDate', that.endDate)
    requestHandler.setSession('formatValue', that.formatValue)
    requestHandler.setSession('manageDepartmentId', that.departmentId)
    requestHandler.setSession('manageDepartmentSelect', that.departmentSelect)
}

// that**this
// timeSet**[0,1,2,3,4]
// Timestamp Boolean
// others  []  增加方法
// except  []  去除方法
async function getDataXsetData(that, timeSet, others, except) {
    if (timeSet) { // 设置时间
        let arr = [
            change => that.startDate = change,
            change => that.endDate = change,
            change => that.startPcCalendarDate = change,
            change => that.endPcCalendarDate = change,
            change => that.QueryDate = change
        ]
        for (var i = 0; i < arr.length; i++) {
            if (timeSet[i]) {
                arr[i](timeSet[i])
            }
        }
    }
    let methods = [ // 对比待使用函数
        that.getDataStatistics, // 查总数据
        that.getApartmentData, // 查部门数据
        that.getCityAmount, // 查城市数据
        that.getDateRange, // 查月份数据
        setSessionBox, // 存储时间
        refreshCharts // 刷新图表
    ]
    if (except) { // 去掉不调用函数部分 []
        for (var h = 0; h < methods.length; h++) {
            for (var j = 0; j < except.length; j++) {
                if (methods[h] == except[j]) {
                    methods.splice(h, 1)
                    h--
                }
            }
        }
    }
    methods.forEach((item, index) => {
        if (index == (methods.length - 1) || index == (methods.length - 2)) {
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
        // Datetime,
        // TransferDom,
        // Group,
        // PopupRadio,
        orderTotalMsg,
        PillarChart,
        PieChart,
        // CalendarX,
        SnDatetimePicker,
        // Popup,
        Icon
    },
    props: {},
    data() {
        // let that = this;
        let managerData = requestHandler.stateManager.setData(['departmentPopup', 'calendarShow'], this);
        let Color = {
            month: {
                default: new echarts.graphic.LinearGradient(
                    0, 0, 1, 1,
                    [
                        {offset: 0, color: '#CFD8FE'},
                        {offset: 1, color: '#A9ACF0'}
                    ]
                ),
                selected: new echarts.graphic.LinearGradient(
                    0, 0, 1, 1,
                    [
                        {offset: 0, color: '#8CA5FF'},
                        {offset: 1, color: '#262DD9'}
                    ]
                )
            },
            city: {
                default: new echarts.graphic.LinearGradient(
                    0, 0, 1, 1,
                    [
                        {offset: 0, color: '#D0FDEE'},
                        {offset: 1, color: '#A7EBDB'}
                    ]
                ),
                selected: new echarts.graphic.LinearGradient(
                    0, 0, 1, 1,
                    [
                        {offset: 0, color: '#8EFAD7'},
                        {offset: 1, color: '#23CDA7'}
                    ]
                )
            }
        }
        return Object.assign(managerData, {
            isPC:requestHandler.isPC(),
            pillarCityY: 'dataMax',
            pillarDateY: 'dataMax',
            rangeDate: [],
            loadingFlagList: { 'PillarId0': true, 'PillarId1': true }, // 图表loading
            loadingFlagListPie: { 'pieId0': true, 'pieId1': true, 'pieId2': true },
            loading: false,// 界面loading
            centerCityDataValue: [], // 城市数据中转
            centerCityDataName: [],
            centerDataValue: [], //  月份范围数据中转
            centerDataName: [],
            isPillarPageShowL: { 0: false, 1: false },
            isPillarPageShowR: { 0: false, 1: false },
            cityDataListPage: 0,
            dateRangeListPage: 0,
            departmentId: "",
            QueryDate: "2019-01-01", //  按月选择默认值
            dataStatistics: "",
            payTypeList: '',
            nonePay: 0,
            companyPay: 0,
            wechatPay: 0,
            aliPay: 0,
            beiPay: 0,
            startPcCalendarDate: nowDateOne(),
            endPcCalendarDate: nowDate(),
            startDate: nowDateOne().replace(/\//g, '-'),
            endDate: nowDate().replace(/\//g, '-'),
            departmentSelect: 0, // 部门切换index
            departmentList: false,
            departmentActiveBG: {
                backgroundImage:
                        "url(" + require("assets/img/hotel/check2.png") + ")"
            },
            changeFilter: true,
            showMonthCalendarPop: false,
            screenWidth: "",
            departmentData: [
                { name: "全部部门", departmentId: "" }
            ],
            chartBoxPie: [
                {
                    chartType: "订单数",
                    color: [
                        "rgba(38, 45, 217,1) ",
                        "rgba(38, 45, 217,.6)",
                        "rgba(38, 45, 217,.3)"
                    ]
                },
                {
                    chartType: "总支出",
                    color: [
                        "rgba(255, 78, 58, 1) ",
                        "rgba(255, 78, 58,.6)",
                        "rgba(255, 78, 58,.3)"
                    ]
                },
                {
                    chartType: "退款",
                    color: [
                        "rgba(255, 165, 1, 1) ",
                        "rgba(255, 165, 1,.6)",
                        "rgba(255, 165, 1,.3)"
                    ]
                }
            ],  
            chartBoxPillarColorL: [],
            chartBoxPillarColorR: [],
            chartBoxPillar: [
                { chartType: "总支出趋势", color: [Color.month.default, Color.month.default, Color.month.default, Color.month.default, Color.month.default, Color.month.default], selectedColor: Color.month.selected, defaultColor:Color.month.default },
                { chartType: "出差城市", color: [Color.city.default, Color.city.default, Color.city.default, Color.city.default, Color.city.default, Color.city.default], selectedColor: Color.city.selected, defaultColor:Color.city.default }
            ],
            pillarData: [
                {
                    // name: ["6月", "7月", "8月", "9月", "10月", "11月"],
                    // value: [128, 366, 788, 222, 333, 676]
                    name: [],
                    value: []
                },
                {
                    // name: ["北京", "上海", "广州", "深圳", "武汉", "西安"],
                    // value: [600, 420, 330, 320, 280, 200]
                    name: [],
                    value: []
                }
            ],
            pieData: [
                // 订单数
                [
                    { value: 0, name: "火车票" },
                    { value: 0, name: "机票" },
                    { value: 0, name: "酒店" }
                ],
                // 支出
                [
                    { value: 0, name: "火车票" },
                    { value: 0, name: "机票" },
                    { value: 0, name: "酒店" }
                ],
                // 退款部分
                [
                    { value: 0, name: "火车票" },
                    { value: 0, name: "机票" },
                    { value: 0, name: "酒店" }
                ]
            ],
            // formatValue: "2019-02",
            formatValue: requestHandler.getStorage('formatValue') ? requestHandler.getStorage('formatValue') : new Date().format('yyyy/MM').replace(/\//g, '-'),
            formatValueArr: [],
            setEndDate: setEndDate(),
            pushSettingStatus: false,//当前登录人的推送设置状态，默认关闭的。
            dateValue: nowDateOne(),
            nowDate: new Date(nowDate()),
            ENABLE_USE_TYPE: requestHandler.ENABLE_USE_TYPE
        });
    },
    created: function () {

        let _this = this;
        //注册刷新返回事件，入口页面强制刷新
        _this.notifyAppBackAndRefresh();
    },
    activated() {
        let _this = this;
        //注册刷新返回事件，入口页面强制刷新
        _this.notifyAppBackAndRefresh();

    },
    filters: {
        formatValueFunction(val) {
            // 格式化插件时间
            var arr = val.split("-");
            if (arr.length == 0) {
                return;
            }
            return arr[0] + '年' + (arr.length > 1 ? arr[1] + '月' : '');
        }
    },
    methods: {
        checkStartDate(val) {
            let that = this;
            let timestamp1 = new Date(val).getTime()
            let timestamp2 = new Date(that.endPcCalendarDate).getTime()
            if (timestamp1 <= timestamp2) {
                that.startPcCalendarDate = new Date(val).format('yyyy/MM/dd')
            } else {
                requestHandler.showToast('预定日期查询条件开始时间不能晚于结束时间')
            }
        },
        checkEndDate(val) {
            let that = this;
            let timestamp1 = new Date(that.startPcCalendarDate).getTime()
            let timestamp2 = new Date(val).getTime()
            if (timestamp1 <= timestamp2) {
                that.endPcCalendarDate = new Date(val).format('yyyy/MM/dd')
            } else {
                requestHandler.showToast('预定日期查询条件开始时间不能晚于结束时间')
            }
        },
        /**
            * 注册刷新返回事件
            */
        notifyAppBackAndRefresh() {
            //如果是伴正事的浏览器，进入首页的时候应该取小应用配置的名称做为title
            this.initTitle();
        },
        goBackFun(){
            extendUtils.closePage('');
        },
        //获取小应用配置的名称做为title
        async initTitle(){
            let baseTitle = '商旅订单统计';
            if (!!requestHandler.getBizMateVersion()){ //限制伴正事的浏览器
                let appConfig = await requestHandler.getAppConfig();
                console.log('appConfig', appConfig)
                if (!!appConfig && !!appConfig.whereMsgFrom){
                    baseTitle = appConfig.whereMsgFrom
                }
            }
            document.title = baseTitle;
        },


        leftChange(index) { // 移动端滑动
            let that = this
            let screenWidth = document.body.clientWidth
            if (that.isPillarPageShowR[index] && screenWidth < 550) {
                that.changePillarPageR(index)
            }
        },
        rightChange(index) { // 移动端滑动
            let that = this
            let screenWidth = document.body.clientWidth
            if (that.isPillarPageShowL[index] && screenWidth < 550) {
                that.changePillarPageL(index)
            }
        },
        calendarShowThis() { // 弹出日历窗 设置时间焦点
            this.calendarShow = true
            this.rangeDate = [new Date(this.startDate.replace(/-/g, '/')), new Date(this.endDate.replace(/-/g, '/'))];
        },
        // 左切换按钮
        changePillarPageL(index) {
            var that = this
            if (index == 0) { // 图1左按钮
                that.dateRangeListPage-- // 显示上6个月数据
                that.isPillarPageShowL[0] = false
                that.isPillarPageShowR[0] = true
                let arrTemporName = []
                let arrTemporValue = []
                for (var i = 0; i < 6; i++) { // 传入临时显示数据
                    let arrLocation = (that.dateRangeListPage + 1) * 6 + i
                    arrTemporName.push(that.centerDataName[arrLocation])
                    arrTemporValue.push(that.centerDataValue[arrLocation])
                }
                that.pillarData[0].value = arrTemporValue
                that.pillarData[0].name = arrTemporName
            } else { // 图2左按钮
                var arrTemporName = []
                var arrTemporValue = []
                if ((that.centerCityDataValue.length - (6 * (that.cityDataListPage - 1))) <= 6) { // 右边页剩余城市数小于等于6
                    that.isPillarPageShowL[1] = false // 不可向左翻页
                    that.isPillarPageShowR[1] = true // 可向右翻页
                    that.cityDataListPage--
                    var restLength = that.centerCityDataValue.length - (6 * that.cityDataListPage) // 判断下页数据数量
                    for (var k = 0; k < restLength; k++) {
                        arrTemporName.push(that.centerCityDataName[6 * (that.cityDataListPage) + k])
                        arrTemporValue.push(that.centerCityDataValue[6 * (that.cityDataListPage) + k])
                    }
                    for (var l = 0; l < 6 - restLength; l++) {
                        arrTemporName.push("")
                        arrTemporValue.push("")
                    }
                    that.pillarData[1].name = arrTemporName
                    that.pillarData[1].value = arrTemporValue
                } else {
                    that.isPillarPageShowL[1] = true
                    that.isPillarPageShowR[1] = true
                    that.cityDataListPage--
                    // var arrTemporName = []
                    // var arrTemporValue = []
                    for (var n = 0; n < 6; n++) {
                        arrTemporName.push(that.centerCityDataName[6 * (that.cityDataListPage) + n])
                        arrTemporValue.push(that.centerCityDataValue[6 * (that.cityDataListPage) + n])
                    }
                    that.pillarData[1].name = arrTemporName
                    that.pillarData[1].value = arrTemporValue
                }
                if (that.cityDataListPage == 0) { // 为第0页的时候隐藏右边按钮
                    that.isPillarPageShowL[1] = false
                }
            }
        },
        // 右切换按钮
        changePillarPageR(index) {
            var that = this
            if (index == 0) { // 图1右按钮
                that.dateRangeListPage++ // 显示这6个月数据
                that.isPillarPageShowL[0] = true
                that.isPillarPageShowR[0] = false
                let arrTemporName = []
                let arrTemporValue = []
                for (var i = 0; i < 6; i++) { // 传入临时显示数据
                    arrTemporName.push(that.centerDataName[(that.dateRangeListPage + 1) * 6 + i])
                    arrTemporValue.push(that.centerDataValue[(that.dateRangeListPage + 1) * 6 + i])
                }

                that.pillarData[0].value = arrTemporValue
                that.pillarData[0].name = arrTemporName
            } else { // 图2右按钮
                let restCityNum = that.centerCityDataValue.length - (6 * (that.cityDataListPage + 1))
                var arrTemporName = []
                var arrTemporValue = []
                if (restCityNum <= 6) { // 判断剩余城市数是否小于等于6
                    that.isPillarPageShowL[1] = true // 可向左翻页
                    that.isPillarPageShowR[1] = false // 不可向右翻页
                    that.cityDataListPage++
                    var restLength = that.centerCityDataValue.length - (6 * that.cityDataListPage)
                    for (var j = 0; j < restLength; j++) {
                        let arrLocation = 6 * (that.cityDataListPage) + j
                        arrTemporName.push(that.centerCityDataName[arrLocation])
                        arrTemporValue.push(that.centerCityDataValue[arrLocation])
                    }
                    for (var k = 0; k < 6 - restLength; k++) {
                        arrTemporName.push("")
                        arrTemporValue.push("")
                    }
                    that.pillarData[1].name = arrTemporName
                    that.pillarData[1].value = arrTemporValue

                } else {
                    that.isPillarPageShowL[1] = true
                    that.isPillarPageShowR[1] = true
                    that.cityDataListPage++
                    // var arrTemporName = []
                    // var arrTemporValue = []
                    for (var l = 0; l < 6; l++) {
                        let arrLocation = 6 * (that.cityDataListPage) + l
                        arrTemporName.push(that.centerCityDataName[arrLocation])
                        arrTemporValue.push(that.centerCityDataValue[arrLocation])
                    }
                    that.pillarData[1].name = arrTemporName
                    that.pillarData[1].value = arrTemporValue
                }
            }
        },
        openSnDatePicker(){
            this.$refs.datetimePicker.onClick()
        },
        change(value) { // 按月选择
            var that = this
            value = value[0]+'-'+value[1];//更换组件后兼容旧逻辑，避免大量改动
            this.formatValueArr = value;
            this.formatValue = value;
            // 取选择月最后一天
            var endMounth = value.split("-")[1].replace(/0/g, '')
            var endYear = value.split("-")[0]
            let timeSet = [
                value + "-01",// that.startDate,
                value + '-' + requestHandler.getLastDay(endYear, endMounth), // that.endDate,
                (value + "-01").replace(/-/g, '/'), // that.startPcCalendarDate,
                (value + '-' + requestHandler.getLastDay(endYear, endMounth)).replace(/-/g, '/'), // that.endPcCalendarDate,
                value + "-01" // that.QueryDate
            ]
            getDataXsetData(that, timeSet, "", [that.getApartmentData])
        },
        changeToMonthFilter() {
            var that = this
            this.changeFilter = true
            this.formatValue = new Date().format('yyyy/MM').replace(/\//g, '-')
            // 取选择月最后一天
            var endMounth = this.formatValue.split("-")[1].replace(/0/g, '')
            var endYear = this.formatValue.split("-")[0]
            let endDate = this.formatValue + '-' + requestHandler.getLastDay(endYear, endMounth)
            var toDay = new Date().toLocaleDateString()
            var chooseDate = endYear + '/' + endMounth + '/' + requestHandler.getLastDay(endYear, endMounth)
            if (Date.parse(toDay) < Date.parse(chooseDate)) {
                endDate = addZeroEasy(toDay, '-')
            }
            let timeSet = [
                that.formatValue + "-01",// that.startDate,
                endDate, // that.endDate,
                (that.formatValue + "-01").replace(/-/g, '/'), // that.startPcCalendarDate,
                endDate.replace(/-/g, '/'), // that.endPcCalendarDate,
                that.formatValue + "-01" // that.QueryDate
            ]
            let except = [that.getApartmentData, that.getDateRange] // 去掉部门查询，12月份数据查询
            getDataXsetData(that, timeSet, "", except)
        },
        commitDate(date) { // 按日
            var that = this
            if (!date[0] || !date[1]) {
                requestHandler.showToast('请选择完整的日期区间')
            } else {
                this.formatValue = date[0].format('yyyy/MM').replace(/\//g, '-')
                this.calendarShow = false;
                let timeSet = [
                    addZero(date[0], "-"),// that.startDate,
                    addZero(date[1], "-"), // that.endDate,
                    addZero(date[0], "-").replace(/-/g, '/'), // that.startPcCalendarDate,
                    addZero(date[1], "-").replace(/-/g, '/'), // that.endPcCalendarDate,
                    "" // that.QueryDate
                ]
                let except = [that.getApartmentData, that.getDateRange] // 去掉部门查询，12月份数据查询
                getDataXsetData(that, timeSet, "", except)
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
        chooseDepartment(index, departmentId) {
            var that = this
            this.departmentSelect = index;
            this.departmentPopup = false;
            this.departmentList = false;
            this.departmentId = departmentId
            getDataXsetData(that, "", "", [that.getApartmentData])
            requestHandler.setStorage('manageDepartmentId', that.departmentId)
            requestHandler.setStorage('manageDepartmentSelect', that.departmentSelect)
        },
        getDataStatistics() {
            var that = this;
            that.loadingFlagListPie['pieId0'] = false // 饼图加载状态
            that.loadingFlagListPie['pieId1'] = false
            that.loadingFlagListPie['pieId2'] = false
            const obj = {
                // 'departmentId': departmentId ? departmentId : that.departmentId,
                'queryBeginDate': that.startDate,
                'queryEndDate': that.endDate,
                'pageIndex':1,
                'pageSize':20
            };
            obj.useType = requestHandler.ENABLE_USE_TYPE ? requestHandler.USE_TYPE_ENUM.PUBLIC.code : requestHandler.USE_TYPE_ENUM.PRIVATE.code
            requestHandler.getDataStatistics(obj).then(res => {
                let data = res.result;
                if (data) {
                    // 订单数
                    var arrOrderList = []
                    arrOrderList.push({ 'value': data.trainOrderNum, name: '火车票' })
                    arrOrderList.push({ 'value': data.flightOrderNum, name: '机票' })
                    arrOrderList.push({ 'value': data.hotelOrderNum, name: '酒店' })
                    that.pieData[0] = arrOrderList
                    // 订单金额
                    var arrPaynumList = []
                    arrPaynumList.push({ 'value': data.trainOrderAmount, name: '火车票' })
                    arrPaynumList.push({ 'value': data.flightOrderAmount, name: '机票' })
                    arrPaynumList.push({ 'value': data.hotelOrderAmount, name: '酒店' })
                    that.pieData[1] = arrPaynumList
                    // 退款金额
                    var refundPayList = []
                    refundPayList.push({ 'value': data.trainRefundAmount, name: '火车票' })
                    refundPayList.push({ 'value': data.flightRefundAmount, name: '机票' })
                    if (!data.hotelRefundAmount) {
                        data.hotelRefundAmount = 0
                    }
                    refundPayList.push({ 'value': data.hotelRefundAmount, name: '酒店' })
                    that.pieData[2] = refundPayList
                    // 支付方式金额
                    if (data.payAmountByPayType) {
                        // [{'未支付':123},{'微信支付':666},{'企业代':852}]
                        // that.payTypeList={'未支付':3333,'微信支付':4444,'企业代':5555,'hahah':8888,'yeyeyey':10000}
                        that.payTypeList = JSON.parse(data.payAmountByPayType)
                        let lengthArr = []
                        for (var item in that.payTypeList) {
                            lengthArr.push(item)
                        }
                    }
                    that.loadingFlagListPie['pieId0'] = true // 关闭饼形图表加载状态
                    that.loadingFlagListPie['pieId1'] = true
                    that.loadingFlagListPie['pieId2'] = true
                    that.dataStatistics = data;
                    that.loading = false // 关闭页面loading
                } else {
                    console.log("order data err")
                }
            }).catch(() => {
            });
        },
        getApartmentData() {
            // var that = this;
            // requestHandler.downloadCpyOrganization().then(({ data }) => {
            //     var arr = [];
            //     data.orgList.map((item, index) => {
            //         if (item.orgId > 0 && item.pOrgId == -1) {
            //             //排除跟部门，跟部门不能加人，不会有统计数据
            //             console.log("pOrgId == -1,delete");
            //         } else {
            //             arr.push({ name: item.orgName, departmentId: item.orgId });
            //         }
            //     });
            //     arr.unshift({ name: "全部部门", departmentId: '' });
            //     that.departmentData = arr;
            // }).catch(e => {
            // });
        },
        getDateRange() {
            var that = this;
            that.loadingFlagList['PillarId0'] = false // 图表loading
            that.isPillarPageShowL[0] = false // 隐藏按钮
            that.isPillarPageShowR[0] = false
            // *****************获取最近12个月的传入数据*************************↓↓↓↓↓↓↓
            // 分页就一次性查询所有数据
            var QueryDateRangeList = [];
            // 当前年月
            let endMounth = ''
            if (nowDate().split("/")[1] != '10') {
                endMounth = Number(nowDate().split("/")[1].replace(/0/g, ''))
            } else {
                endMounth = 10
            }
            var endYear = Number(nowDate().split('/')[0])
            let tempPillarDataName = []
            for (var i = 0; i < 12; i++) {
                // 赋值响应数值
                tempPillarDataName[11 - i] = endMounth + '月'
                var QueryDateRange = {}
                // 起日期
                var startDateInner = endYear + '-' + (endMounth < 10 ? '0' + endMounth : endMounth)
                // 传起止日期   xxxx-xx-xx:xxxx-xx-xx
                // 2019-04-01
                let riqiArr = []
                riqiArr[0] = startDateInner.split('-')[0]
                riqiArr[1] = startDateInner.split('-')[1]
                QueryDateRange[startDateInner] = riqiArr.join('-')
                // 赋值
                for (var item in QueryDateRange) {
                    QueryDateRangeList.push(QueryDateRange[item])
                }
                endMounth--;
                if (endMounth == 0) {
                    endYear--;
                    endMounth = 12
                }
            }
            that.pillarData[0].name = tempPillarDataName
            // *****************获取最近12个月的传入数据**对应到相应月份*************************↑↑↑↑↑↑
            const obj = {
                // 'departmentId': departmentId ? departmentId : that.departmentId,
                'queryDateRange': QueryDateRangeList
            }
            obj.useType = requestHandler.ENABLE_USE_TYPE ? requestHandler.USE_TYPE_ENUM.PUBLIC.code : requestHandler.USE_TYPE_ENUM.PRIVATE.code
            requestHandler.getPayAmountStatisticByDateRange(obj).then( res => {
                let data = res.result;
                if (data) {
                    // 提取数据 ： 左边key部分日期
                    var sortArr = []
                    // let dateAmountArr = []
                    let maxAmount = 0
                    if (!!data.payAmountOfDateRange && Object.keys(data.payAmountOfDateRange).length > 0) {
                        for (var dateTime in data.payAmountOfDateRange) {
                            sortArr.push(dateTime)
                            if (maxAmount <= data.payAmountOfDateRange[dateTime]) { // 取最大值
                                maxAmount = data.payAmountOfDateRange[dateTime]
                            }
                        }
                    }
                    that.pillarDateY = maxAmount
                    // sortArr.sort()
                    // 筛选日期对应月份，判断数量，判断位置，判断是否需要翻页 （对象无排序，匹配月份名填入）
                    let indexFlag = false
                    let indexFlagLeftBtn = false
                    var mmm;
                    that.pillarData[0].name.forEach((item1, index) => { // 匹配12个月名称和数据名称
                        for (var k = 0; k < sortArr.length; k++) {
                            var mounth = sortArr[k].split(':')[0].split('-')[1] // 取接收数据的月份  xx
                            // var year = sortArr[i].split(':')[0].split('-')[0] // 取接收数据的年份   xxxx
                            // var yearAndMonth = year + '-' + mounth //  xxxx-xx
                            if (parseInt(item1) < 10) { // 格式化准备好的12个月月名
                                mmm = '0' + parseInt(item1)
                            } else {
                                mmm = parseInt(item1) + ''
                            }
                            if (mmm == mounth) { // 匹配数据到月名
                                Object.keys(data.payAmountOfDateRange).forEach((dateTime1, keyIndex)=>{
                                    if ((dateTime1 == sortArr[i]) && data.payAmountOfDateRange[dateTime1] != 0) { // 匹配数据名位置
                                        if (index <= 5) { // 上6个月有数据 则左按钮显示
                                            that.isPillarPageShowL[0] = true
                                            indexFlagLeftBtn = true
                                        } else { // 是否有最近6个月有数据
                                            indexFlag = true
                                        }
                                        if (indexFlag) {
                                            that.dateRangeListPage = 0 // 先显示最近六个月数据
                                        } else {
                                            that.dateRangeListPage = -1 //  最近六个月无数据则显示上六个月数据
                                            if (!indexFlagLeftBtn) {
                                                that.isPillarPageShowL[0] = false // 左按钮不显示
                                            }
                                        }
                                        // 传入对应位置index的数据
                                        that.pillarData[0].value[index] = data.payAmountOfDateRange[dateTime1]
                                    }
                                    if (keyIndex == Object.keys(data.payAmountOfDateRange).length-1){
                                        this.updateSeriesColor(0, this.chartBoxPillar[0].color.length-1)
                                    }
                                })
                            }
                        }
                    })
                    for (var n = 0; n < 12; n++) {
                        that.centerDataName.push(that.pillarData[0].name[n])
                        that.centerDataValue.push(that.pillarData[0].value[n])
                    }
                    let arrTemporName = []
                    let arrTemporValue = []
                    for (var o = 0; o < 6; o++) { // 传入临时显示数据
                        arrTemporName.push(that.centerDataName[(that.dateRangeListPage + 1) * 6 + o])
                        arrTemporValue.push(that.centerDataValue[(that.dateRangeListPage + 1) * 6 + o])
                    }
                    that.pillarData[0].value = arrTemporValue
                    that.pillarData[0].name = arrTemporName
                    that.loadingFlagList['PillarId0'] = true // 柱表一loading关闭
                } else {
                    console.log("preiod data err")
                }
            }).catch(() => {
            });
        },
        getCityAmount() {
            var that = this;
            that.isPillarPageShowL[1] = false // 隐藏按钮
            that.isPillarPageShowR[1] = false
            that.loadingFlagList['PillarId1'] = false
            const obj = {
                // 'departmentId': departmentId ? departmentId : that.departmentId,
                'queryBeginDate': that.startDate,
                'queryEndDate': that.endDate
            }
            obj.useType = requestHandler.ENABLE_USE_TYPE ? requestHandler.USE_TYPE_ENUM.PUBLIC.code : requestHandler.USE_TYPE_ENUM.PRIVATE.code
            requestHandler.getPayAmountOfCity(obj).then( res => {
                var cityDataArrName = []
                var cityDataArrValue = []
                let data = res.result;
                if (data) {
                    // 模拟城市数据
                    //    data.payAmountOfCity=Object.assign({},{延安: 1450, 上海: 320, 武汉: 26,读懂多多都督: 100,天津:188,撒霍夫刷卡:67,河北:85,西安:58,南京:42,大连:333,乌鲁木齐:666,新疆:222,广州:555,珠海:123,洛阳:45})
                    for (var cityData in data.payAmountOfCity) {
                        cityDataArrName.push(cityData)
                        cityDataArrValue.push(data.payAmountOfCity[cityData])
                    }
                    that.pillarCityY = cityDataArrValue[0] // 设定y轴最大值
                    // 分页截取 不够就插入空位
                    that.centerCityDataValue = cityDataArrValue
                    that.centerCityDataName = cityDataArrName
                    let restLength = cityDataArrValue.length
                    if (restLength <= 6) {
                        that.isPillarPageShowL[1] = false
                        that.isPillarPageShowR[1] = false
                        for (var i = 0; i < (6 - restLength); i++) {
                            that.centerCityDataName.push('')
                            that.centerCityDataValue.push('')
                        }
                        that.pillarData[1].name = that.centerCityDataName
                        that.pillarData[1].value = that.centerCityDataValue
                    } else {
                        that.isPillarPageShowL[1] = false
                        that.isPillarPageShowR[1] = true
                        var arrTemporName = []
                        var arrTemporValue = []
                        for (var p = 0; p < that.centerCityDataName.length; p++) {
                            if (p < 6) {
                                arrTemporName.push(that.centerCityDataName[p])
                                arrTemporValue.push(that.centerCityDataValue[p])
                            }
                        }
                        that.pillarData[1].value = arrTemporValue
                        that.pillarData[1].name = arrTemporName
                    }
                    that.loadingFlagList['PillarId1'] = true // 柱形图二loading关闭
                } else {
                    console.log("city pay data err")
                }
            });
        },
        clickSeries(index, seriesData){
            this.updateSeriesColor(index, seriesData.dataIndex)
        },
        updateSeriesColor(chartIndex, seriesIndex){
            let newColorArr = [];
            let item = this.chartBoxPillar[chartIndex];
            item.color.forEach((color, i)=>{
                if (i == seriesIndex){
                    newColorArr.push(item.selectedColor);
                } else {
                    newColorArr.push(item.defaultColor);
                }
            })
            this.$set(this.chartBoxPillar[chartIndex], 'color', newColorArr)
        },
        /**
             * 获取推送提示人的当前设置状态
             */
        getPushSetStatus() {
            let that = this
            let sendObj = {}
            requestHandler.financeInfoPushStatus(sendObj).then(res => {
                if (res.resultCode == 0) {
                    that.pushSettingStatus = res.result.status;
                } else {
                    //showToast(res.desc||"设置失败")
                }
            })
        },
        /**
             * 设置当前人的推送
             */
        startPushSeeeting() {
            let that = this
            let sendObj = {}
            requestHandler.addUaidToFinanceInfo(sendObj).then(res => {
                if (res.resultCode == 0) {
                    that.pushSettingStatus = !that.pushSettingStatus;
                } else {
                    requestHandler.showToast(res.desc || "设置失败")
                }
            })
        },
        /*
            不可选时间段
            */
        disabledDate1(current) {
            return current > new Date().getTime();
        }
    },
    watch: {
        startPcCalendarDate(val) {
            let that = this
            let timeSet = [new Date(val).format('yyyy/MM/dd').replace(/\//g, '-'), '', val]
            let except = [that.getApartmentData, that.getDateRange] // 去掉部门查询，12月份数据查询
            getDataXsetData(that, timeSet, "", except)
        },
        endPcCalendarDate(val) {
            let that = this
            let timeSet = ['', new Date(val).format('yyyy/MM/dd').replace(/\//g, '-'), '', val]
            let except = [that.getApartmentData, that.getDateRange] // 去掉部门查询，12月份数据查询
            getDataXsetData(that, timeSet, "", except)
        }
    },
    mounted() {
        nowDate();
        var that = this;

        function setDefaultDate() { //  格式化datetime初始选择时间为当前月份
            that.formatValue = new Date().format('yyyy/MM').replace(/\//g, '-')
        }

        setDefaultDate();
        if (requestHandler.getSession('startPcCalendarDate')) {
            that.startPcCalendarDate = requestHandler.getSession('startPcCalendarDate')
        }
        if (requestHandler.getSession('endPcCalendarDate')) {
            that.endPcCalendarDate = requestHandler.getSession('endPcCalendarDate')
        }
        if (requestHandler.getSession('OstartDate')) {
            that.OstartDate = requestHandler.getSession('OstartDate')
        }
        if (requestHandler.getSession('OendDate')) {
            that.OendDate = requestHandler.getSession('OendDate')
        }
        if (requestHandler.getSession('formatValue')) {
            that.formatValue = requestHandler.getSession('formatValue')
        }
        if (requestHandler.getSession('manageDepartmentId')) {
            that.departmentId = requestHandler.getSession('manageDepartmentId')

        }
        if (requestHandler.getSession('manageDepartmentSelect')) {
            that.departmentSelect = requestHandler.getSession('manageDepartmentSelect')
        } else {
            that.departmentSelect = 0
        }
        getDataXsetData(that) // 初始化查询设置

        //  挂载window.onresize
        // window.onresize = () => {
        //   return (() => {
        //     window.screenWidth = document.body.clientWidth;
        //     that.screenWidth = window.screenWidth;
        //   })();
        // };
        that.getPushSetStatus();
    }
};
</script>
<style scoped lang="less" type="text/less">
    @import "~themes/default/styles/common/index.less";
    @import "~styles/mixins/mixinsStyle.less";
    .icon_common_prompt{
        fill: #A9ACF0;
        vertical-align: middle;
        height: 16px;
        width: 16px;
        margin-right: .1rem;
    }
    .loadingMask {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 1000000000;
        background-color: @background-color;
    }

    /*响应式排布550-1080*/
    @media screen and (min-width: @screen-sm) and (max-width: @screen-md) {
        .orderManage_container {
            .resNormal {
                display: none;
            }
            .res550 {
                display: block !important;
                width: 100%;
                margin: 0 auto;
                padding: 0 .3rem;
                .tips {
                    font-size: 12px;
                    color: @theme-color;
                    width: 100%;
                    display: flex;
                    align-items: flex-start;
                    padding: 12px 0;
                    img {
                        margin-right: 10px;
                        width: 15px;
                        height: 15px;
                    }
                    span {
                        /*省略*/
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
                .pickWrap {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
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
                                    width: 126px;
                                    border-radius: 4px;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                }
                                &:last-child {
                                    border: 1px solid #d2d2d2;
                                    width: 126px;
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
                                padding: 0 10px;
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
                .componentBox {
                    padding: 24px 0;
                }
            }
            .pushSetting550{
                display: block !important;
                width: 100%;
                margin: 0.4rem auto;
                .pushSettingWrap{
                    padding: 0 .3rem;
                    display: flex;
                    justify-content: space-between;
                    .pushDesc{
                        font-size: 14px;
                        color: #999999;                
                    }
                    .setIcon{
                        width: 0.9rem;
                        height: 0.5rem;
                    }
                    .checked{
                        background: url(~assets/img/dataStatistics/icon_open.png) no-repeat 0 0 transparent;
                        background-size: contain;
                    }
                    .unChecked{
                        background: url(~assets/img/dataStatistics/icon_unopen.png) no-repeat 0 0 transparent;
                         background-size: contain;
                    }
                }             
            }
            .pushSettingNormal{
                display: none;
            }
            section.chartContent {
                width: 100%;
                margin: 0 auto;
                ul {
                    li {
                        p.chartTitle {
                            span {
                                font-size: 16px;
                                line-height: 16px;
                                &:first-child {
                                    width: 3px;
                                    height: 16px;
                                    margin-right: 8px;
                                    border-radius: 2px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /*响应式排布>1080*/
    @media screen and (min-width: @screen-md) {
        .orderManage_container {
            .resNormal {
                display: none;
            }
            .res550 {
                display: block !important;
                width: 100%;
                margin: 0 auto;
                padding: 0 .3rem;
                .tips {
                    font-size: 12px;
                    color: @theme-color;
                    width: 100%;
                    display: flex;
                    align-items: flex-start;
                    padding: 12px 0;
                    img {
                        margin-right: 10px;
                        width: 15px;
                        height: 15px;
                    }
                    span {
                        /*省略*/
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
                .pickWrap {
                    display: flex;
                    /*选项部分不变*/
                    max-width: 62%;
                    justify-content: space-between;
                    align-items: center;
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
                                    border-radius: 4px;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                }
                                &:last-child {
                                    border: 1px solid #d2d2d2;
                                    border-radius: 4px;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                }
                                p {
                                    padding: 0 10px;
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
                                padding: 0 10px;
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
                .componentBox {
                    padding: 24px 0 30px 0;
                }
            }
            .pushSetting550{
                display: block !important;
                width: 100%;
                margin: 0.4rem auto;
                padding: 0 30px;
                .pushSettingWrap{
                    display: flex;
                    justify-content: space-between;
                    .pushDesc{
                        font-size: 14px;
                        color: #999999;                
                    }
                    .setIcon{
                        width: 0.9rem;
                        height: 0.5rem;
                    }
                    .checked{
                        background: url(~assets/img/dataStatistics/icon_open.png) no-repeat 0 0 transparent;
                        background-size: contain;
                    }
                    .unChecked{
                        background: url(~assets/img/dataStatistics/icon_unopen.png) no-repeat 0 0 transparent;
                         background-size: contain;
                    }
                }
            }
            .pushSettingNormal{
                display: none;
            }            
            section.chartContent {
                width: 100%;
                margin: 0 auto;
                ul {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    li {
                        width: 33.33%;
                        border-bottom: 1px dashed #c2c2c2;
                        margin-bottom: 40px;
                        &:nth-child(4) {
                            width: 50%;
                            border-bottom: 0;
                        }
                        &:last-child {
                            width: 50%;
                            border-bottom: 0;
                        }
                        .chartBoxBott {

                            padding-bottom: 40px !important;
                        }
                        p.chartTitle {
                            span {
                                font-size: 16px;
                                line-height: 16px;
                                &:first-child {
                                    width: 3px;
                                    height: 16px;
                                    margin-right: 8px;
                                    border-radius: 2px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /*初始状态*/
    .departmentActive {
        color: @theme-color;
    }

    /*遮罩*/
    .popMask {
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 998;
    }

    .departmentPopup {
        ul {
            padding: 0 0.3rem;
            li {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                border-bottom: 0.01rem solid #c2c2c2;
                padding: 0.3rem 0;
                background-repeat: no-repeat;
                background-position: right;
                -webkit-background-size: 0.39rem 0.3rem;
                background-size: 0.39rem 0.3rem;
            }
        }
    }

    .popupCalendar {
        padding-bottom: 15px;
    }

    .orderManage_container {
        background-color: #fff;
        .res550 {
            display: none;
        }
        height: 100%;
        display: flex;
        flex-direction: column;
        .topWrap {
            position: relative;
            height: 2.24rem;
            padding: 0 0.2rem;
            background-color: @theme-color;
            margin-bottom: 1.85rem;
            .selectWrapResNO {
                display: none;
            }
            .selectWrap {
                position: relative;
                width: 100%;
                color: #ffffff;
                height: 0.88rem;
                line-height: 0.88rem;
                font-size: 0.28rem;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .sort{
                    fill: #fff;
                }

                &:after{
                    content: '';
                    display: block;
                    flex: 1;
                }

                .filter-type{
                    width: 1rem;
                    flex: none;
                }

                .iconArray {
                    position: absolute;
                    right: 0px;
                    flex: 1;
                    display: flex;
                    align-items: center;

                    &:nth-of-type(1){
                        justify-content: flex-start;
                    }
                    &:nth-of-type(2){
                        justify-content: center;
                    }

                    .down{
                        fill: #fff;
                        margin-left: .04rem;
                    }

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
                        width: 0.3rem;
                        height: 0.3rem;
                        vertical-align: middle;
                        margin-left: 0.08rem;
                    }
                }
                .department{
                    max-width:100px;
                }
            }
        }
        .pushSetting550{
            display: none;
        }
        .pushSetting{
            margin:0 0.3rem 0.4rem;
            .pushSettingWrap{
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #F6F9FD;
                height: .84rem;
                line-height: .84rem;
                border-radius: .84rem;
                padding: 0 .3rem;
                .pushDesc{
                    font-size: 14px;
                }
                .setIcon{
                    width: 0.86rem;
                    height: 0.44rem;
                }
                .checked{
                    background: url(~assets/img/dataStatistics/icon_open.png) no-repeat 0 0 transparent;
                    background-size: contain;
                }
                .unChecked{
                    background: url(~assets/img/dataStatistics/icon_unopen.png) no-repeat 0 0 transparent;
                        background-size: contain;
                }
            }
        }
        section {
            flex: 1;
            overflow-y: auto;
            background-color: #F8FAFC;
            ul {
                li {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: #fff;
                    margin-bottom: .2rem;
                    padding: .42rem 0 .6rem;
                    &:nth-child(2) {
                        .chartBox {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            padding-bottom: 0.2rem;
                        }
                    }
                    .chart-label{
                        width: calc(~'100% - .6rem');
                        overflow-x: auto;
                        overflow-y: hidden;
                        margin: 0 .3rem;
                        background: #FDF6F6;
                    }
                    .chartBoxBott {
                        padding: 0 .3rem;
                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;
                        width: 100%;
                        position: relative;
                        top: 2px;
                        p {
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            align-items: flex-start;
                            flex: none;
                            width: 33%;
                            margin: .24rem 0;

                            &:before{
                                content: '';
                                position: absolute;
                                left: 0;
                                right: 0;
                                bottom: -.24rem;
                                width: 100%;
                                border-bottom: 1px dashed #C2C2C2;
                            }

                            &:nth-of-type(3n+1){
                                align-items: flex-start;

                            }

                            &:nth-of-type(3n+2){
                                align-items: center;
                            }

                            &:nth-of-type(3n){
                                align-items: flex-end;
                            }

                            span {
                                &:first-child {
                                    font-size: 0.24rem;
                                    color: #666666;
                                    margin-bottom: 0.14rem;
                                }
                                &:last-child {
                                    font-size: 0.32rem;
                                    font-weight: bold;
                                }
                            }
                            &:last-child {
                                border-right: 0;
                            }
                        }
                    }
                    .pillarChartBox {
                        width: 100%;
                        height: 5rem;
                        position: relative;
                        .btnLeft {
                            cursor: pointer;
                            width: .44rem;
                            height: .44rem;
                            position: absolute;
                            left: .22rem;
                            top: 40%;
                            z-index: 10000000;
                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .img2 {
                            display: none;
                        }
                        .btnLeft:hover .img2 {
                            display: block;
                        }
                        .btnLeft:hover .img1 {
                            display: none;
                        }
                        .btnRight:hover .img2 {
                            display: block;
                        }
                        .btnRight:hover .img1 {
                            display: none;
                        }
                        .btnRight {
                            cursor: pointer;
                            width: .44rem;
                            height: .44rem;
                            position: absolute;
                            right: .22rem;
                            top: 40%;
                            z-index: 10000000;
                            img {
                                width: 100%;
                                height: 100%;
                            }

                        }
                    }
                    .chartBox {
                        width: 100%;
                        height: 4.5rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .chartTitle {
                        width: 100%;
                        font-size: 0.34rem;
                        padding-left: .3rem;
                        font-weight: bold;
                    }
                }
            }
        }
    }
</style>

<style type="text/less" lang="less">
    .orderManage_container {
        .weui-cell__ft, .vux-cell-primary, .vux-datetime-value {
            /deep/ .vux-cell-value{
                color: #fff !important;
            }
            &:after{
                border-color: #fff !important;
            }
        }
        .date-filter {
            /deep/ .weui-cell_access:active{
                background: none;
            }
            /deep/ .weui-cell__ft:after{
                content: '';
            }
        }
    }
</style>