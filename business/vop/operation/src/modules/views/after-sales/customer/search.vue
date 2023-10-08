<template>
    <div class="serviceSeats">
        <service-header
            type="small"
            :header-list="headerList"
        ></service-header>
        <div>
            <div class="serviceheader">
                <div
                    class="tab"
                    :class="{
                        tabSelect: tabSelect == tab.value,
                        tabNoSelect: tabSelect != tab.value,
                    }"
                    v-for="(tab, index) in tabArr"
                    :key="index"
                    @click="onTabClick(tab)"
                >
                    {{ tab.name }}
                </div>
            </div>
            <div class="tabline"></div>
        </div>
        <div class="seversList">
            <el-row>
                <el-col
                    :span="24"
                    class="tableList"
                >
                    <el-table
                        stripe
                        class="list-table"
                        max-height="500"
                        :data="dealedList"
                        :highlight-current-row="true"
                        @filter-change="filterChange"
                        :header-cell-style="{ background: '#f2f2f2' }"
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
                            min-width="140"
                            prop="subOrderNo"
                            label="订单号"
                        >
                            <template slot-scope="scope">
                                <span
                                    style="font-size: small"
                                    :class="{ active: showVopOrderAuth }"
                                    @click="
                                        showVopOrderAuth
                                            ? showOrderDetail(
                                                scope.row.subOrderNo
                                            )
                                            : ''
                                    "
                                >{{ scope.row.subOrderNo }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            min-width="140"
                            prop="postSaleNo"
                            label="售后单号"
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
                                <span>{{
                                    classifyMap[scope.row.classify]
                                }}</span>
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
                            label="任务状态"
                        >
                            <template slot-scope="scope">
                                <span>{{ statusMap[scope.row.state] }}</span>
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
                            width="60"
                            prop=""
                            label="操作"
                        >
                            <template slot-scope="scope">
                                <div
                                    class="active"
                                    @click="showDetail(scope.row)"
                                >
                                    详情
                                </div>
                                <div v-if="updateTaskAuth">
                                    <div
                                        v-if="scope.row.state == 1"
                                        class="active"
                                        @click="opeTaskStaut(scope.row, 1)"
                                    >
                                        领单
                                    </div>
                                    <div
                                        v-else-if="scope.row.state == 2"
                                        class="active"
                                        @click="opeTaskStaut(scope.row, 2)"
                                    >
                                        退单
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col
                    :span="24"
                    class="pagebox"
                >
                    <el-pagination
                        background
                        v-if="totals"
                        @size-change="changePageSize"
                        @current-change="onPageChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizeOpt"
                        :page-size="pageSize"
                        layout="total, prev, pager, next, jumper,sizes"
                        :total="totals"
                    >
                    </el-pagination>
                </el-col>
            </el-row>
        </div>
        <noAuth :isShowModal="!showTaskAuth" />
    </div>
</template>

<script>
import utils from "bislibs/utils";
import ServiceHeader from "biscomponents/after-sales/ServiceHeader";
import customerservicehandler from "bislibs/requestHandler/customerservicehandler";
import noAuth from "biscomponents/product/noAuth";

import { mapMutations, mapGetters } from "vuex";
export default {
    components: {
        ServiceHeader,
        noAuth
    },
    data() {
        return {
            updateTaskAuth: utils.hasAuth("serviceOrderupdateAuth"),
            // updateTaskAuth: true,
            showVopOrderAuth: utils.hasAuth("showSaleAuth"),
            showTaskAuth: utils.hasAuth("showServiceListAuth"),
            firstEnter: false,
            loading: false,
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
                ]
                // state: [
                //     { text: "待处理", value: 1 },
                //     { text: "处理中", value: 2 },
                //     { text: "已完成", value: 3 },
                // ],
            },
            statisticType: {
                waitDealtNum: 0,
                todayDealtNum: 0,
                todayCompleteNum: 0
            },
            pageSizeOpt: utils.pageSizeOpts,
            totals: 0,
            pageSize: 10,
            currentPage: 1,
            dealedList: [],
            tabSelect: 1,
            tabArr: [
                { name: "我处理的", value: 1 },
                { name: "待处理的", value: 2 }
            ]
        };
    },
    computed: {
        ...mapGetters(["homeRefresh"]),
        applyTime() {
            return function (time) {
                return this.$moment(time).format("YYYY-MM-DD HH:mm:ss");
            };
        },
        headerList() {
            return [
                {
                    title: "待处理任务单",
                    value: this.statisticType["waitDealtNum"]
                },
                {
                    title: "今日我已处理任务单",
                    value: this.statisticType["todayDealtNum"]
                },
                {
                    title: "今天总完成任务单",
                    value: this.statisticType["todayCompleteNum"]
                }
            ];
        }
    },
    created() {
        this.firstEnter = true;
        this.initData();
        if (this.showTaskAuth) {
            this.initData();
        }
    },
    activated() {
        if (this.firstEnter) {
            return;
        }
        // _this.$route.query &&
        //     _this.$route.query.forceUpdate &&
        //     _this.resetConditions();
        if (this.showTaskAuth) {
            this.initData();
        }
    },
    deactivated() {
        this.firstEnter = false;
    },
    methods: {
        ...mapMutations({
            setServiceId: "SET_SERVICEID",
            setServiceStatus: "SET_SERVICESTATUS",
            setHomeRefresh: "SET_HOMEREFRESH",
            setOrderNo: "SET_ORDERNO",
            setOrderType: "SET_ORDERTYPE",
            setsubOrderNo: "SET_SUBORDERNO"
        }),
        /**
         * 初始化数据
         */
        initData() {
            this.currentPage = 1;
            this.getServiceList();
            this.getStatisticsServiceNumber();
        },
        /**
         * 统计服务单任务数
         */
        getStatisticsServiceNumber() {
            let param = {
                userId: customerservicehandler.userInfo.userId
            };
            customerservicehandler
                .getServiceStatistics(param)
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
        },
        /**
         * 查询服务单列表
         */
        getServiceList() {
            let _this = this;

            let json = {
                pageNum: _this.currentPage,
                pageSize: _this.pageSize
            };
            if (!!_this.typeActive["postSaleType"].value) {
                json.postSaleType = _this.typeActive["postSaleType"].value;
            }
            if (!!_this.typeActive["classify"].value) {
                json.classify = _this.typeActive["classify"].value;
            }

            if (_this.tabSelect == 1) {
                //我领取的，需要入参userId
                json.userId = customerservicehandler.userInfo.userId;
            } else if (_this.tabSelect == 2) {
                //待领取的，需要入参state
                json.state = 1;
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
                        _this.dealedList = result.result.taskInfoList;
                        _this.totals = result.result.total;
                    }
                })
                .catch(() => {
                    loadingInstance.close();
                });
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
         * 查看服务单详情
         */
        showDetail(data) {
            this.setHomeRefresh(false);

            this.setServiceStatus(data.classify);
            this.setServiceId(data.postSaleNo);

            let puhsTarget = {
                path: "/aftersales/ticketdetail",
                query: {}
            };

            if (this.tabSelect == 1 &&data.state==2) {
                puhsTarget.query = {
                    customerTab: 1, //我处理的
                    taskId:data.id
                };
            }
            this.$router.push(puhsTarget);
        },

        opeTaskStaut(record, type) {
            if (type == 1) {
                //领单
                this.updateTaskState(record, 2);
            } else if (type == 2) {
                //退单
                this.updateTaskState(record, 1);
            } else {
            }
        },

        /**
         * 一键领取服务单
         */
        updateTaskState(record, state) {
            let _this = this;
            let param = {
                taskId: record.id,
                state: state
            };
            let loadingInstance = this.$loading({
                lock: true,
                text: "加载中...",
                target: document.querySelector(".loading-area") //设置加载动画区域
            });

            customerservicehandler
                .updateTaskState(param)
                .then((res) => {
                    loadingInstance.close();
                    if (res.resultCode === 0) {
                        if (state == 1) {
                            utils.showToast("退单成功");
                        } else if (state == 2) {
                            utils.showToast("领单成功");
                        }
                    } else {
                        utils.showToast(res.resultMessage);
                    }
                    _this.initData();
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
            this.typeActive[keys] =
                keys == "postSaleType"
                    ? {
                        title:
                              this.postSaleTypeMap[filters[keys][0]] ||
                              "售后类型",
                        value: filters[keys][0] || null
                    }
                    : {
                        title:
                              this.classifyMap[filters[keys][0]] || "任务分类",
                        value: filters[keys][0] || null
                    };

            this.currentPage = 1;
            this.getServiceList();
        },
        //切换标签页
        onTabClick(tab) {
            this.tabSelect = tab.value;

            this.typeActive = {
                postSaleType: { title: "售后类型", value: null },
                classify: { title: "任务分类", value: null }
            };
            this.currentPage = 1;
            this.getServiceList();
            this.getStatisticsServiceNumber();
        }
    }
};
</script>

<style scoped lang="less">
.serviceSeats {
    background-color: #f4f4f4;
    padding: 0 15px;
    .serviceheader {
        padding-top: 10px;
        display: flex;
        .tab {
            width: 120px;
            padding: 10px 20px;
            margin-right: 10px;
            text-align: center;
            color: #333;
        }
        .tabSelect {
            background: white;
        }
        .tabNoSelect {
            background: #e4e4e4;
        }
    }
    .tabline {
        background: white;
        height: 10px;
        width: 100%;
    }
    .seversList {
        min-height: calc(~"100vh - 264px");
        border-radius: 8px;
        box-sizing: border-box;
        padding: 24px 0;
        // margin-top: 16px;
        background-color: #fff;
    }
    .list-header {
        display: flex;
        align-items: center;
        padding: 0 56px;
    }
    .tableList {
        padding: 0px 24px 0 24px;
    }
    .deal-num {
        color: #478aee;
    }
}
</style>
<style lang="less">
@import "~styles/cusomer.less";
.pagebox {
    text-align: right;
    padding: 0 56px;
}
</style>
