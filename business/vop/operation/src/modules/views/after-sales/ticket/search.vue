<template>
    <div class="servicemanagement">
        <service-header
            type="small"
            :header-list="headerList"
        ></service-header>
        <div class="content">
            <el-row class="header-row">
                <el-col
                    :span="4"
                    class="search-input"
                >
                    <el-input
                        @keyup.enter.native="search"
                        v-model.trim="subOrderNo"
                        clearable
                        placeholder="订单号"
                    >
                        <template slot="append">
                            <el-button
                                icon="el-icon-search"
                                @click.native="search"
                                type="primary"
                            ></el-button>
                        </template>
                    </el-input>
                </el-col>
                <el-col
                    :span="4"
                    class="search-input line1"
                >
                    <el-input
                        @keyup.enter.native="search"
                        v-model.trim="postSaleNo"
                        clearable
                        placeholder="售后单号"
                    >
                        <template slot="append">
                            <el-button
                                icon="el-icon-search"
                                @click.native="search"
                                type="primary"
                            ></el-button>
                        </template>
                    </el-input>
                </el-col>
                <date-picker
                    ref="datePicker"
                    @change-date="changeDate"
                    placeholder="请选择申请时间"
                    title="申请时间:"
                >
                </date-picker>
            </el-row>
            <div class="servicList">
                <el-table
                    stripe
                    id="cal-table"
                    class="list-table"
                    :data="servicList"
                    :highlight-current-row="true"
                    :header-cell-style="{ background: '#f2f2f2' }"
                    @filter-change="filterChange"
                    style="
                        width: 100%;
                        border: 1px solid #ebeef5;
                        border-bottom: 0;
                    "
                >
                    <el-table-column
                        prop="id"
                        label="任务ID"
                        min-width="60"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="subOrderNo"
                        label="订单号"
                        min-width="140"
                    >
                        <template slot-scope="scope">
                            <span
                                style="font-size: small"
                                :class="{ active: showSaleAuth }"
                                @click="
                                    showSaleAuth
                                        ? showOrderDetail(scope.row.subOrderNo)
                                        : ''
                                "
                            >{{ scope.row.subOrderNo }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="postSaleNo"
                        label="售后单号"
                        min-width="140"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="productName"
                        label="商品名称"
                    >
                        <template slot-scope="scope">
                            <span
                                :title="scope.row.productName"
                                style="
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    font-size: small;
                                "
                            >{{ scope.row.productName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="applyReason"
                        label="申请原因"
                        min-width="90"
                    >
                        <template slot-scope="scope">
                            <span
                                :title="scope.row.applyReason"
                                style="
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                "
                            >{{ scope.row.applyReason || "--" }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        min-width="90"
                        prop="postSaleType"
                        column-key="postSaleType"
                        :filter-multiple="false"
                        :label="typeActive['postSaleType'].title"
                        :filters="filter['postSaleType']"
                    >
                        <template slot-scope="scope">
                            <span>{{
                                postSaleTypeMap[scope.row.postSaleType]
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="90"
                        prop="classify"
                        column-key="classify"
                        :filter-multiple="false"
                        :label="typeActive['classify'].title"
                        :filters="filter['classify']"
                    >
                        <template slot-scope="scope">
                            <span
                                :title="classifyMap[scope.row.classify]"
                                style="
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                "
                            >{{ classifyMap[scope.row.classify] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="90"
                        prop="applyDate"
                        label="申请时间"
                    >
                        <template slot-scope="scope">
                            <span>{{
                                scope.row.applyDate &&
                                    scope.row.applyDate.substring(0, 10)
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="90"
                        prop="state"
                        :label="typeActive['state'].title"
                        column-key="state"
                        :filters="filter['state']"
                        :filter-multiple="false"
                    >
                        <template slot-scope="scope">
                            <span :class="`state${scope.row.state}`">
                                {{ statusMap[scope.row.state] }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="userName"
                        min-width="90"
                        label="处理人"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.userName || "--" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop=""
                        width="60"
                        label="操作"
                    >
                        <template slot-scope="scope">
                            <span
                                class="active"
                                @click="showDetail(scope.row)"
                            >详情</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pages">
                    <el-pagination
                        background
                        v-show="totals > 0"
                        @size-change="changePageSize"
                        @current-change="onPageChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizeOpt"
                        :page-size="pageSize"
                        layout="total, prev, pager, next, jumper,sizes"
                        :total="totals"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>
        <noAuth :isShowModal="!showTaskAuth" />
    </div>
</template>

<script>
import customerservicehandler from "bislibs/requestHandler/customerservicehandler";
import DatePicker from "biscomponents/after-sales/DatePicker";
import ServiceHeader from "biscomponents/after-sales/ServiceHeader";
import utils from "bislibs/utils";
import noAuth from "biscomponents/product/noAuth";
import { mapMutations, mapGetters } from "vuex";
export default {
    components: {
        DatePicker,
        ServiceHeader,
        noAuth
    },
    data() {
        return {
            showSaleAuth: utils.hasAuth("showSaleAuth"),
            showTaskAuth: utils.hasAuth("showServiceListAuth"),
            dateRange: {},
            totals: 0,
            firstEnter: false,
            pageSize: 20,
            currentPage: 1,
            postSaleTypeMap: { 10: "退货", 20: "换货", 30: "维修" },
            classifyMap: {
                1: "客服确认",
                2: "填写寄回地址",
                3: "填写商家返件运单信息",
                4: "确认退款"
            },
            statusMap: { 1: "待处理", 2: "处理中", 3: "已完成" },
            typeActive: {
                state: { title: "任务状态", value: null },
                postSaleType: { title: "售后类型", value: null },
                classify: { title: "任务分类", value: null }
            },
            filter: {
                postSaleType: [
                    { text: "退货", value: 10 },
                    { text: "换货", value: 20 },
                    { text: "维修", value: 30 }
                ],
                classify: [
                    { text: "客服确认", value: 1 },
                    { text: "填写寄回地址", value: 2 },
                    { text: "填写商家返件运单信息", value: 3 },
                    { text: "确认退款", value: 4 }
                ],
                state: [
                    { text: "待处理", value: 1 },
                    { text: "处理中", value: 2 },
                    { text: "已完成", value: 3 }
                ]
            },
            pageSizeOpt: utils.pageSizeOpts,
            subOrderNo: "",
            postSaleNo: "",
            servicList: [],
            statisticType: {
                waitDealtNum: 0,
                todayDealtNum: 0,
                todayCompleteNum: 0
            }
        };
    },
    created() {
        let _this = this;
        _this.firstEnter = true;
        if (_this.showTaskAuth) {
            _this.initData();
        }
    },
    mounted() {
        this.calHeight();
        window.onresize = () => {
            this.calHeight();
        };
    },
    activated() {
        let _this = this;
        if (_this.firstEnter) {
            return;
        }
        if (_this.showTaskAuth) {
            _this.initData();
        }
    },
    deactivated() {
        this.firstEnter = false;
    },
    computed: {
        ...mapGetters(["homeRefresh"]),
        applyTime() {
            return function (time) {
                return this.$moment(time * 1000).format("YYYY-MM-DD");
                // return this.$moment(time * 1000).format("YYYY-MM-DD HH:mm:ss");
            };
        },
        headerList() {
            return [
                {
                    title: "待处理任务单",
                    value: this.statisticType["waitDealtNum"]
                },
                {
                    title: "今日已处理任务单",
                    value: this.statisticType["todayDealtNum"]
                },
                {
                    title: "今天已完成任务单",
                    value: this.statisticType["todayCompleteNum"]
                }
            ];
        }
    },
    methods: {
        ...mapMutations({
            setServiceId: "SET_SERVICEID",
            setHomeRefresh: "SET_HOMEREFRESH",
            setServiceStatus: "SET_SERVICESTATUS",
            setOrderNo: "SET_ORDERNO",
            setOrderType: "SET_ORDERTYPE",
            setsubOrderNo: "SET_SUBORDERNO"
        }),
        initData() {
            this.getServiceList();
            this.getStatisticsServiceNumber();
        },
        /**
         * 动态计算表格内容高度
         */
        calHeight() {
            let clientHeight = document.documentElement.clientHeight;
            let domHeight = clientHeight - 128;
            domHeight = domHeight > 500 ? domHeight : 500;
            let tableMaxHeigth = domHeight - 200;
            $("#cal-table .el-table__body-wrapper").css({
                "max-height": tableMaxHeigth + "px",
                "overflow-y": "auto"
            });
            $(".servicemanagement").css({
                height: domHeight + "px"
            });
        },
        /**
         * 模糊查询
         */
        search() {
            this.currentPage = 1;
            this.getServiceList();
        },
        /**
         * 切换日期
         */
        changeDate(date) {
            this.dateRange.createTimeStart = this.$moment(date[0])
                .startOf("day")
                .format("yyyy-MM-DD HH:mm:ss");
            this.dateRange.createTimeEnd = this.$moment(date[1])
                .endOf("day")
                .format("yyyy-MM-DD HH:mm:ss");
            this.currentPage = 1;
            this.getServiceList();
        },

        /**
         * 切换页码
         */
        onPageChange(currentPage) {
            let _this = this;
            _this.currentPage = currentPage;
            _this.getServiceList();
        },
        /**
         * 改变每页展示数量
         */
        changePageSize(pageSize) {
            let _this = this;
            _this.pageSize = pageSize;
            _this.getServiceList();
        },
        /**
         * 查看订单详情
         */
        showOrderDetail(orderId) {
            if (orderId) {
                this.setsubOrderNo(orderId);
                this.setOrderType("child");
                this.$router.push({
                    name: `salechild`
                });
            }
        },
        /**
         * 查看详情
         */
        showDetail(data) {
            this.setHomeRefresh(false);
            this.setServiceStatus(data.classify);
            this.setServiceId(data.postSaleNo);

            this.$router.push({
                path: "/aftersales/ticketdetail"
            });
        },
        /**
         * 查看服务单列表
         */
        getServiceList() {
            let _this = this;

            let json = {
                //格式为：yyyy-MM-dd HH:mm:ss
                applyStartTime: _this.dateRange.createTimeStart,
                applyEndTime: _this.dateRange.createTimeEnd,
                pageNum: _this.currentPage,
                pageSize: _this.pageSize
            };
            if (!!_this.typeActive["postSaleType"].value) {
                json.postSaleType = _this.typeActive["postSaleType"].value;
            }
            if (!!_this.typeActive["state"].value) {
                json.state = _this.typeActive["state"].value;
            }
            if (!!_this.typeActive["classify"].value) {
                json.classify = _this.typeActive["classify"].value;
            }
            if (!!_this.subOrderNo) {
                json.subOrderNo = _this.subOrderNo;
            }
            if (!!_this.postSaleNo) {
                json.postSaleNo = _this.postSaleNo;
            }

            let loadingInstance = this.$loading({
                lock: true,
                text: "加载中...",
                target: document.querySelector(".loading-area") //设置加载动画区域
            });

            customerservicehandler
                .listServiceRequest(json)
                .then((result) => {
                    loadingInstance.close();
                    if (result.resultCode === 0) {
                        _this.servicList = result.result.taskInfoList;
                        _this.totals = result.result.total;
                    }
                })
                .catch(() => {
                    loadingInstance.close();
                });
        },
        /**
         * 切换过滤条件
         */
        filterChange(filters) {
            let keys = Object.keys(filters)[0];
            if (keys == "postSaleType") {
                this.typeActive[keys] = {
                    title: this.postSaleTypeMap[filters[keys][0]] || "售后类型",
                    value: filters[keys][0] || null
                };
            } else if (keys == "classify") {
                this.typeActive[keys] = {
                    title: this.classifyMap[filters[keys][0]] || "任务分类",
                    value: filters[keys][0] || null
                };
            } else if (keys == "state") {
                this.typeActive[keys] = {
                    title: this.statusMap[filters[keys][0]] || "任务状态",
                    value: filters[keys][0] || null
                };
            }
            this.currentPage = 1;
            this.getServiceList();
        },
        /**
         * 客服服务单统计查询
         */
        getStatisticsServiceNumber: function () {
            var json = {
                // userId: '',
            };
            customerservicehandler
                .getServiceStatistics(json)
                .then((response) => {
                    if (!!response && response.resultCode == 0) {
                        let serviceStatisticsInfo = response.result;
                        if (!!serviceStatisticsInfo) {
                            this.statisticType["waitDealtNum"] =
                                serviceStatisticsInfo.waitDealtNum;
                            this.statisticType["todayDealtNum"] =
                                serviceStatisticsInfo.todayDealtNum;
                            this.statisticType["todayCompleteNum"] =
                                serviceStatisticsInfo.todayCompleteNum;
                        }
                    }
                });
        }
    }
};
</script>

<style scoped lang="less">
.servicemanagement {
    padding: 0 15px;
    box-sizing: border-box;
    // min-height: calc(~"100vh - 128px");
    background-color: #f4f4f4;
    .content {
        margin-top: 16px;
        background-color: #fff;
        padding: 24px;
        .line1 {
            margin: 0 10px;
        }
    }
    .servicList {
        margin-top: 24px;
    }
    .status1 {
        color: #f8a339;
    }
    .status2 {
        color: #23b45d;
    }
}
</style>
<style lang="less">
@import "~styles/cusomer.less";
.servicemanagement {
    .el-col-10 {
        margin-right: 50px;
    }
    .pages {
        padding-right: 32px;
    }
}
</style>
