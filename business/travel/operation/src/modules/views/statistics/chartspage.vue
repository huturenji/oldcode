
<template>
    <div class="page">
        <div v-if="isLoadData" class="loading-container">
            <span>{{ loadingPrompt }}</span>
        </div>
        <section v-else>
            <ul>
                <!--饼形图-->
                <li v-for="(item, index) in chartBoxPie" :key="index">
                    <p>
                        <span>{{ item.chartType }}</span>
                        <span
                            class="cursorp"
                            v-if="hasOrderCenterAuth(index)"
                            @click="gotoDetail(index)"
                        >
                            查看详情
                            <img
                                src="~assets//icon_array_right.png"
                                alt
                            />
                        </span>
                    </p>
                    <h4 :style="{ color: item.color[0] }">
                        <span v-if="index != 0">￥</span>
                        {{ item.amount }}
                    </h4>
                    <div class="chartBox">
                        <PieChart
                            :index="index"
                            :pieData="pieData[index]"
                            :pieId="'pieId' + index"
                            :circleColor="item.color"
                            :chartType="item.chartType"
                            :loadingFlagPie="loadingFlagListPie"
                            ref="chartPie"
                        ></PieChart>
                    </div>
                </li>
            </ul>
            <div class="destinationAmount amountBox">
                <p>目的地消费</p>
                <div class="pillarChartBox">
                    <i
                        v-if="isPillarPageShowDesL"
                        @click="changePillarPageDesL"
                        class="btnLeft cursorp"
                    ></i>
                    <i
                        v-if="isPillarPageShowDesR"
                        @click="changePillarPageDesR"
                        class="btnRight cursorp"
                    ></i>
                    <PillarChartDes
                        :pillarData="pillarDataDes"
                        :pillarColor="['#3398DB']"
                        ref="chartCity"
                        :loadingFlag="loadingFlagPillarCity"
                        :pillarCityY="pillarCityY"
                    ></PillarChartDes>
                </div>
            </div>
            <div class="paymentTrend amountBox">
                <p>营业趋势</p>
                <div class="pillarChartBox">
                    <PillarChartTrend
                        :pillarData="pillarDataTrend"
                        :pillarColor="PillarColorTrend"
                        :trendHiglightIndex="trendHiglightIndex"
                        ref="chartTrend"
                        :loadingFlag="loadingFlagPillarTrend"
                    ></PillarChartTrend>
                </div>
            </div>
        </section>
    </div>
</template>
<script>
import PieChart from "./charts/pie.vue";
import PillarChartTrend from "./charts/pillartrend.vue";
import PillarChartDes from "./charts/pillardes.vue";
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import utils from "bislibs/utils";
import {
    placeChartData,
    chartBtnClickPre,
    chartBtnClickNext,
} from "./charts/pillarmethods.js";
import { setTimeout } from "timers";
// function refreshCharts(that) {
//     // 绘制图表
//     that.$refs.chartPie.map((item, index) => {
//         item.drawChart();
//     });
//     that.$refs.chartTrend.drawChart();
//     that.$refs.chartCity.drawChart();
// }
export default {
    components: {
        PieChart,
        PillarChartTrend,
        PillarChartDes,
    },
    props: {
        channelId: { default: "" },
        useTypeId: { default: "" },
        payTypes: { default: [] },
        companyId: { default: "" },
        dateStart: { default: new Date() },
        dateEnd: { default: new Date() },
        searchStatus: { default: "" },
    },
    data() {
        return {
            isLoadData: true,
            loadingPrompt: "数据加载中...",
            isPillarPageShowDesL: false, // 左按钮
            isPillarPageShowDesR: false, // 右按钮
            loadingFlagPillarTrend: true,
            loadingFlagPillarCity: true,
            loadingFlagListPie: { pieId0: true, pieId1: true, pieId2: true },
            chartBoxPie: [
                {
                    chartType: "订单数",
                    color: [
                        "rgba(37,203,103,1) ",
                        "rgba(37,203,103,.4)",
                        "rgba(37,203,103,.2)",
                        "rgba(37,203,103,.6)",
                    ],
                    amount: 0,
                },
                {
                    chartType: "销售金额",
                    color: [
                        "rgba(255,184,67,1) ",
                        "rgba(255,184,67,.4)",
                        "rgba(255,184,67,.2)",
                        "rgba(255,184,67,.6)",
                    ],
                    amount: 0,
                },
                {
                    chartType: "退款金额",
                    color: [
                        "rgba(246,86,73,1) ",
                        "rgba(246,86,73,.4)",
                        "rgba(246,86,73,.2)",
                        "rgba(246,86,73,.6)",
                    ],
                    amount: 0,
                },
            ],
            pieData: [
                // 订单数
                [
                    { value: 0, name: "火车票" },
                    { value: 0, name: "机票" },
                    { value: 0, name: "酒店" },
                ],
                // 支出
                [
                    { value: 0, name: "火车票" },
                    { value: 0, name: "机票" },
                    { value: 0, name: "酒店" },
                ],
                // 退款部分
                [
                    { value: 0, name: "火车票" },
                    { value: 0, name: "机票" },
                    { value: 0, name: "酒店" },
                ],
            ],
            PillarColorTrend: ["#FFD591", " #FA9A93", "#F6564A"],
            trendHiglightIndex: [], // 趋势图高亮下标
            pillarDataTrend: {
                // 营业趋势数据
                month: [
                    "1月",
                    "2月",
                    "3月",
                    "4月",
                    "5月",
                    "6月",
                    "7月",
                    "8月",
                    "9月",
                    "10月",
                    "11月",
                    "12月",
                ],
                salesAmount: [],
                refundAmount: [],
                orderNum: [],
            },
            cityDataListPage: 0,
            centerCityDataValue: [], // 城市数据中转
            centerCityDataName: [],
            pillarDataDes: {
                // 目的地消费数据
                name: [],
                value: [],
            },
            authDataCacheKey: "authData", //权限列表缓存额key
        };
    },
    created: function () {
         console.log("alive.charts.created");
    },
    methods: {
        refreshChartPie(that) {
            // 绘制图表
            that.$nextTick(() => {
                that.$refs.chartPie && that.$refs.chartPie.map((item, index) => {
                    item.drawChart();
                });
            });
        },
        refreshChartTrend(that) {
            that.$nextTick(() => {
                that.$refs.chartTrend && that.$refs.chartTrend.drawChart();
            });
        },
        refreshChartCity(that) {
            that.$nextTick(() => {
                that.$refs.chartCity && that.$refs.chartCity.drawChart();
            });
        },
        /**
         * 判断是否显示跳转按钮，订单列表按钮没有 权限是不显示的
         */
        hasOrderCenterAuth(index) {
            const that = this;
            if (index > 0) {
                return true;
            }
            let result = false;
            if (!!utils.getSession(that.authDataCacheKey)) {
                var authData = JSON.parse(
                    utils.getSession(that.authDataCacheKey)
                );
                let fullAuth = []; //用户所有的权限
                for (let i = 0; i < authData.length; i++) {
                    fullAuth = fullAuth.concat(authData[i]);
                }
                //如果有root权限，或者有 订单中心-飞机票菜单权限，显示 按钮
                if (
                    fullAuth.indexOf("1_-1_root") != -1 ||
                    (fullAuth.indexOf("1_-1_orderCenter") != -1 &&
                        fullAuth.indexOf("1_-1_orderCenterFlight") != -1)
                ) {
                    result = true;
                }
            }
            return result;
        },
        changePillarPageDesL() {
            // 左按钮
            let that = this;
            chartBtnClickPre(
                that,
                "pillarDataDes",
                "centerCityDataName",
                "centerCityDataValue",
                12,
                "isPillarPageShowDesL",
                "isPillarPageShowDesR",
                "cityDataListPage"
            );
        },
        changePillarPageDesR() {
            // 右按钮
            let that = this;
            chartBtnClickNext(
                that,
                "pillarDataDes",
                "centerCityDataName",
                "centerCityDataValue",
                12,
                "isPillarPageShowDesL",
                "isPillarPageShowDesR",
                "cityDataListPage"
            );
        },
        gotoDetail(index) {
            let that = this;
            // utils.setSession("prodIdHome", that.channelId);
            // utils.setSession("useTypeIdHome", that.useTypeId);
            // utils.setSession("payTypesHome", JSON.stringify(that.payTypes));
            // utils.setSession("companyIdHome", that.companyId);
            // utils.setSession("dateStartHome", that.dateStart.getTime());
            // utils.setSession("dateEndHome", that.dateEnd.getTime());
            let companyId = "";
            if (this.companyId == "wuqiye") {
                companyId = -2;
            } else if (!this.companyId) {
                companyId = -1;
            } else {
                companyId = this.companyId;
            }
            if (index == 0) {
                // 存储订单中心外部跳转判断值
                utils.setSession("outpage", "outpage");
            } else {
                utils.removeSession("outpage");
            }
            switch (index) {
                case 0:
                    return this.$router.push({
                        path: "/mainPage/orderList",
                        // return this.$router.push({path:'/mainPage/orderListPageFlight',
                        query: {
                            orderBeginTime: this.dateStart.format("yyyy-MM-dd"),
                            orderEndTime: this.dateEnd.format("yyyy-MM-dd"),
                            channelId: this.channelId ? this.channelId : -1,
                            useType: this.useTypeId ? this.useTypeId : -1,
                            companyId: companyId,
                        },
                    });
                case 1:
                    return this.$router.push({
                        path: "salesAmount",
                        query: { pageType: "salesAmount" },
                    });
                case 2:
                    return this.$router.push({
                        path: "refundAmount",
                        query: { pageType: "refundAmount" },
                    });
            }
        },
        getDataStatistics() {
            // 查询饼图数据
            let that = this;
            that.loadingFlagListPie["pieId0"] = false; // 饼图加载状态
            that.loadingFlagListPie["pieId1"] = false;
            that.loadingFlagListPie["pieId2"] = false;
            let dataInsert = {
                companyId: that.companyId == "wuqiye" ? "" : that.companyId,
                queryBeginDate: that.dateStart.format("yyyy-MM-dd"),
                queryEndDate: that.dateEnd.format("yyyy-MM-dd"),
                channelId: that.channelId,
                useType: that.useTypeId,
                payTypes: that.payTypes,
            };
            for (var key in dataInsert) {
                if (!dataInsert[key] || dataInsert[key].length == 0) {
                    delete dataInsert[key];
                }
            }

            tmHandler.getDataStatistics(dataInsert).then(
                (data) => {
                    that.isLoadData = false;
                    that.refreshChartPie(that);
                    if (data.result && Object.keys(data.result).length > 0) {
                        that.loadingFlagListPie["pieId0"] = true; // 饼图加载状态
                        that.loadingFlagListPie["pieId1"] = true;
                        that.loadingFlagListPie["pieId2"] = true;
                        if (data.result.totalOrderNum) {
                            that.chartBoxPie[0].amount =
                                data.result.totalOrderNum;
                        } else {
                            that.chartBoxPie[0].amount = 0;
                        }
                        if (data.result.spendingAmount) {
                            that.chartBoxPie[1].amount =
                                data.result.spendingAmount;
                        } else {
                            that.chartBoxPie[1].amount = 0;
                        }

                        if (data.result.totalRefundAmount) {
                            that.chartBoxPie[2].amount =
                                data.result.totalRefundAmount;
                        } else {
                            that.chartBoxPie[2].amount = 0;
                        }

                        // 订单数
                        var arrOrderList = [];
                        arrOrderList.push({
                            value: data.result.trainOrderNum,
                            name: "火车票",
                        });
                        arrOrderList.push({
                            value: data.result.flightOrderNum,
                            name: "机票",
                        });
                        arrOrderList.push({
                            value: data.result.hotelOrderNum,
                            name: "酒店",
                        });
                        arrOrderList.push({
                            value: data.result.insuranceOrderNum,
                            name: "保险",
                        });
                        that.pieData[0] = arrOrderList;
                        // 销售
                        var arrPaynumList = [];
                        arrPaynumList.push({
                            value: data.result.trainOrderAmount,
                            name: "火车票",
                        });
                        arrPaynumList.push({
                            value: data.result.flightOrderAmount,
                            name: "机票",
                        });
                        arrPaynumList.push({
                            value: data.result.hotelOrderAmount,
                            name: "酒店",
                        });
                        arrPaynumList.push({
                            value: data.result.insuranceOrderAmount,
                            name: "保险",
                        });
                        that.pieData[1] = arrPaynumList;
                        // 退款金额
                        var refundPayList = [];
                        refundPayList.push({
                            value: data.result.trainRefundAmount,
                            name: "火车票",
                        });
                        refundPayList.push({
                            value: data.result.flightRefundAmount,
                            name: "机票",
                        });
                        if (!data.result.hotelRefundAmount) {
                            data.result.hotelRefundAmount = 0;
                        }
                        refundPayList.push({
                            value: data.result.hotelRefundAmount,
                            name: "酒店",
                        });
                        refundPayList.push({
                            value: data.result.insuranceRefundAmount,
                            name: "保险",
                        });
                        that.pieData[2] = refundPayList;
                    }
                },
                (err) => {
                    that.isLoadData = false;
                    that.refreshChartPie(that);
                    console.info(err);
                }
            );
        },
        getTrendData() {
            // 查询营业趋势数据
            let that = this;
            that.loadingFlagPillarTrend = false;
            let thisMonth = new Date().format("M");
            let thisYear = new Date().format("yyyy");
            let queryDateRange = [];
            that.trendHiglightIndex = [];
            let thisMonthHas0 = 0;
            for (let i = 0; i < 12; i++) {
                // 设置x轴值
                that.pillarDataTrend.month[11 - i] = thisMonth + "月";
                if (thisMonth < 10) {
                    // 获取传入月份
                    queryDateRange.unshift(thisYear + "-0" + thisMonth);
                    thisMonthHas0 = "0" + thisMonth;
                } else {
                    queryDateRange.unshift(thisYear + "-" + thisMonth);
                    thisMonthHas0 = thisMonth;
                }
                let instantTimeStampA = new Date(
                    thisYear +
                        "/" +
                        thisMonthHas0 +
                        "/" +
                        utils.getLastDay(thisYear, thisMonth)
                ).getTime();
                let instantTimeStampB = new Date(
                    thisYear + "/" + thisMonthHas0 + "/" + "01"
                ).getTime();
                if (
                    instantTimeStampB <= that.dateEnd.getTime() &&
                    instantTimeStampA >= that.dateStart.getTime()
                ) {
                    that.trendHiglightIndex.push(11 - i); // 匹配高亮月份下标
                }
                thisMonth--;
                if (thisMonth == 0) {
                    thisYear = thisYear - 1;
                    thisMonth = 12;
                }
            }
            let dataInsert = {
                companyId: that.companyId == "wuqiye" ? "" : that.companyId,
                queryDateRange: queryDateRange,
                channelId: that.channelId,
                useType: that.useTypeId,
                payTypes: that.payTypes,
            };
            for (var key in dataInsert) {
                if (!dataInsert[key] || dataInsert[key].length == 0) {
                    delete dataInsert[key];
                }
            }

            tmHandler.getPayAmountStatisticByDateRange(dataInsert).then(
                (data) => {
                    that.isLoadData = false;
                    that.refreshChartTrend(that);
                    if (data) {
                        that.loadingFlagPillarTrend = true;
                        //  let trendIndex=11
                        let salesAmountTemp = [];
                        let refundAmountTemp = [];
                        let orderNumTemp = [];
                        if (
                            !!data.result
                                .payAmountOfDateRangeForTravelManagement &&
                            Object.keys(
                                data.result
                                    .payAmountOfDateRangeForTravelManagement
                            ).length > 0
                        ) {
                            // 非空
                            for (let respose in data.result
                                .payAmountOfDateRangeForTravelManagement) {
                                for (
                                    let i = 0;
                                    i < queryDateRange.length;
                                    i++
                                ) {
                                    if (queryDateRange[i] == respose) {
                                        if (
                                            data.result
                                                .payAmountOfDateRangeForTravelManagement[
                                                respose
                                            ].totalAmount
                                        ) {
                                            salesAmountTemp[i] =
                                                data.result.payAmountOfDateRangeForTravelManagement[
                                                    respose
                                                ].totalAmount;
                                        }

                                        if (
                                            data.result
                                                .payAmountOfDateRangeForTravelManagement[
                                                respose
                                            ].refundAmount
                                        ) {
                                            refundAmountTemp[i] =
                                                data.result.payAmountOfDateRangeForTravelManagement[
                                                    respose
                                                ].refundAmount;
                                        }

                                        if (
                                            data.result
                                                .payAmountOfDateRangeForTravelManagement[
                                                respose
                                            ].totalOrderNum
                                        ) {
                                            orderNumTemp[i] =
                                                data.result.payAmountOfDateRangeForTravelManagement[
                                                    respose
                                                ].totalOrderNum;
                                        }
                                    }
                                }
                            }
                        }
                        for (let i = 0; i < queryDateRange.length; i++) {
                            if (!salesAmountTemp[i]) {
                                salesAmountTemp[i] = 0;
                            }
                            if (!refundAmountTemp[i]) {
                                refundAmountTemp[i] = 0;
                            }
                            if (!orderNumTemp[i]) {
                                orderNumTemp[i] = 0;
                            }
                        }
                        that.pillarDataTrend.salesAmount = salesAmountTemp;
                        that.pillarDataTrend.refundAmount = refundAmountTemp;
                        that.pillarDataTrend.orderNum = orderNumTemp;
                    }
                },
                (err) => {
                    that.isLoadData = false;
                    that.refreshChartTrend(that);
                    console.info(err);
                }
            );
        },
        getDesData() {
            let that = this;
            that.loadingFlagPillarCity = false;
            // let data={
            //     "payAmountOfCity": {
            //         "上海": 9470,
            //         "武汉": 6416.5,
            //         "北京": 5817.5,
            //         "深圳": 4664,
            //         "西安": 3035,
            //         "成都": 2902,
            //         "延安": 2192,
            //         "天津": 570,
            //         "乌鲁木齐左": 450,
            //         "襄阳": 58,
            //         "汉川": 22,
            //         "黄石": 19,
            //         "你们": 22,
            //         "我们": 19,
            //     }
            // }
            // 设值
            let dataInsert = {
                companyId: that.companyId == "wuqiye" ? "" : that.companyId,
                queryBeginDate: that.dateStart.format("yyyy-MM-dd"),
                queryEndDate: that.dateEnd.format("yyyy-MM-dd"),
                channelId: that.channelId,
                useType: that.useTypeId,
                payTypes: that.payTypes,
            };
            for (var key in dataInsert) {
                if (!dataInsert[key] || dataInsert[key].length == 0) {
                    delete dataInsert[key];
                }
            }
            tmHandler.getPayAmountOfCity(dataInsert).then(
                (data) => {
                    that.isLoadData = false;
                    that.refreshChartCity(that);
                    if (!!data.result && !!data.result.payAmountOfCity) {
                        placeChartData(
                            that,
                            data.result.payAmountOfCity,
                            "pillarDataDes",
                            "centerCityDataName",
                            "centerCityDataValue",
                            12,
                            "isPillarPageShowDesL",
                            "isPillarPageShowDesR",
                            "pillarCityY"
                        );
                        that.loadingFlagPillarCity = true; // 城市图表loading关闭
                    }
                },
                (err) => {
                    that.isLoadData = false;
                    that.refreshChartCity(that);
                    console.info(err);
                }
            );
        },
    },
    mounted() {
         console.log("alive.charts.mounted");
        let that = this;
        that.loadingFlagListPie["pieId0"] = false; // 饼图加载状态
        that.loadingFlagListPie["pieId1"] = false;
        that.loadingFlagListPie["pieId2"] = false;
        that.loadingFlagPillarCity = false;
        that.loadingFlagPillarTrend = false;
        // if (utils.getSession("dateStartHome") != undefined) {
        //     that.$parent.dateStart = new Date(
        //         parseInt(utils.getSession("dateStartHome"))
        //     );
        //     tmHandler.removeSession("dateStartHome");
        // }
        // if (utils.getSession("dateEndHome") != undefined) {
        //     that.$parent.dateEnd = new Date(
        //         parseInt(utils.getSession("dateEndHome"))
        //     );
        //     tmHandler.removeSession("dateEndHome");
        // }
        // if (utils.getSession("useTypeIdHome") != undefined) {
        //     that.$parent.useTypeId = utils.getSession("useTypeIdHome");
        //     tmHandler.removeSession("useTypeIdHome");
        // }

        //如果不是订单中心跳转过来
        // if (!!utils.getSession("outpage")) {
            // if (utils.getSession("prodIdHome") != undefined) {
            //     if (
            //         that.$parent.channelId == utils.getSession("prodIdHome")
            //     ) {
            //         // 监听渠道无变化 直接改变企业 并查询
            //         that.$parent.companyId = utils.getSession(
            //             "companyIdHome"
            //         );
            //         // 监听渠道无变化 直接改变支付类型 并查询
            //         that.$parent.payTypes = JSON.parse(utils.getSession(
            //             "payTypesHome"
            //         )) ;
            //         that.$parent.searchStatus++;
            //     } else {
            //         // 渠道有变化 重新查询渠道赋值存储企业
            //         that.$parent.channelId = utils.getSession("prodIdHome");
            //         tmHandler.removeSession("prodIdHome");
            //     }
            // }else {
                that.getDataStatistics();
                that.getTrendData();
                that.getDesData();
            // }
        // }   
        // refreshCharts(that);
    },
    // useTypeId:{default:null},companyId:{default:null},dateStart:{default:new Date()},dateEnd:{default:new Date()},searchStatus:{default:''}
    watch: {
        searchStatus(val) {
            this.isLoadData = true;

            this.getDataStatistics();
            this.getTrendData();
            this.getDesData();
        },
    },
    filters: {},
};
</script>
<style scoped lang="less" type="text/less">
@import "~styles/common.less";
@import "~styles/mixins/mixins.less";
.page {
    margin-top: 16px;
}
.loading-container {
    text-align: center;
    height: 60px;
    font-size: 20px;
    line-height: 30px;
    padding-bottom: 160px;
    span {
        margin-top: 34px;
        height: 30px;
        text-align: center;
        padding-left: 35px;
        color: #7f7f7f;
        display: inline-block;
        background: url(~assets//loading.gif) no-repeat left;
        background-size: contain;
    }
}
section {
    box-sizing: border-box;
    padding: 0 24px 65px;
    // height: 750px;
    width: 100%;
    // margin-top: 195px;
    background-color: #fff;
    border-radius: 2px;
    ul {
        display: flex;
        justify-content: space-between;
        padding-top: 54px;
        li {
            box-sizing: border-box;
            padding: 16px;
            width: 330px;
            height: 360px;
            background: #ffffff;
            border: 1px solid #f7f7f7;
            box-shadow: 0 14px 13px 0 rgba(235, 235, 235, 0.76);
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            p {
                display: flex;
                justify-content: space-between;
                span {
                    &:first-child {
                        font-weight: bold;
                        font-size: 14px;
                        color: @fc-normal;
                    }
                    &:last-child {
                        font-size: 12px;
                        color: @font-blue;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        img {
                            margin-left: 7.5px;
                            width: 6px;
                            height: 10px;
                        }
                    }
                }
            }
            h4 {
                text-align: center;
                line-height: 82px;
                height: 82px;
                border-bottom: 1px dashed #ebebeb;
                font-size: 24px;
                font-weight: bold;
                span {
                    font-size: 14px;
                }
            }
        }
        .chartBox {
            width: 100%;
            flex: 1;
            // display: flex;
            // justify-content: center;
            // align-items: center;
        }
    }
    .amountBox {
        box-sizing: border-box;
        padding: 16px;
        margin-top: 48px;
        width: 100%;
        height: 408px;
        background: #ffffff;
        border: 1px solid #f7f7f7;
        box-shadow: 0 14px 13px 0 rgba(235, 235, 235, 0.76);
        border-radius: 4px;
        p {
            font-weight: bold;
            font-size: 14px;
            color: @fc-normal;
        }
    }
    .paymentTrend {
        display: flex;
        flex-direction: column;
        p {
            padding-bottom: 35px;
        }
        .pillarChartBox {
            flex: 1;
            width: 100%;
        }
    }
    .destinationAmount {
        display: flex;
        flex-direction: column;
        p {
            padding-bottom: 40px;
        }
        .pillarChartBox {
            flex: 1;
            width: 100%;
            position: relative;
            i {
                position: absolute;
                top: 50%;
                z-index: 1000;
                margin-top: -12px;
                width: 24px;
                height: 24px;
            }
            i.btnLeft {
                left: 50px;
                background: url("~assets//icon_turn_left_nor.png")
                    no-repeat;
                background-size: 100% 100%;
                &:hover {
                    background: url("~assets//icon_turn_left_hov.png")
                        no-repeat;
                }
            }
            i.btnRight {
                right: 50px;
                background: url("~assets//icon_turn_right_nor.png")
                    no-repeat;
                background-size: 100% 100%;
                &:hover {
                    background: url("~assets//icon_turn_right_hov.png")
                        no-repeat;
                }
            }
        }
    }
}
</style>



