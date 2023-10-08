<template>
    <div class="all-order">
        <template v-if="showSaleAuth">
            <search-header
                @on-export="onExport"
                @on-search="search"
                :order-list="orderData[tabActive]"
                ref="SALE"
                type="SALE"
            ></search-header>
            <el-table
                class="list-table"
                stripe
                @filter-change="filterChange"
                :data="orderData[tabActive]"
                :header-cell-style="{ background: '#f2f2f2' }"
            >
                <el-table-column
                    width="180"
                    prop="orderNo"
                    label="销售订单号"
                >
                    <template slot-scope="scope">
                        <span
                            class="active"
                            @click="showDetail(scope.row)"
                        >{{
                            scope.row.orderNo
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    width="180"
                    prop="supplierOrderNo"
                    label="供应商订单号"
                >
                </el-table-column>
                <el-table-column
                    width="220"
                    prop="createTime"
                >
                    <template slot="header">
                        <span class="time-title">下单时间<i
                            @click="sort"
                            :class="sortType['SALE']"
                        ></i></span>
                    </template>
                    <template slot-scope="scope">
                        <span>{{ orderTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    width="220"
                    prop="receiverInfo"
                    label="收货人"
                >
                    <template slot-scope="scope">
                        <span
                            class="single"
                            :title="`${
                                scope.row.receiverInfo && scope.row.receiverInfo.name
                            } ${scope.row.receiverInfo && scope.row.receiverInfo.phone}`"
                        >{{ scope.row.receiverInfo && scope.row.receiverInfo.name }}
                            {{ scope.row.receiverInfo && scope.row.receiverInfo.phone }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="unitPrice"
                    label="销售实付金额"
                >
                    <template slot-scope="scope">
                        <span>{{ orderAmount(scope.row.paymentAmount) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    width="140"
                    column-key="orderState"
                    :filter-multiple="false"
                    :label="stateActive[tabActive].title"
                    :filters="stateList"
                    prop="orderState"
                >
                    <template slot-scope="scope">
                        <span :class="scope.row.orderState">
                            {{ orderStateMap[scope.row.orderState] || "" }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    width="90"
                    prop="operate"
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
        </template>
        <div class="pages">
            <el-pagination
                background
                v-if="(showSaleAuth || showPurchaseAuth) && orderData[tabActive].length"
                @size-change="changePageSize"
                @current-change="onPageChange"
                :current-page="currentPage[tabActive]"
                :page-sizes="pageSizeOptions"
                :page-size="pageSize[tabActive]"
                layout="total,prev,pager,next,jumper,sizes"
                :total="totalNum[tabActive]"
            >
            </el-pagination>
        </div>
        <noAuth :isShowModal="!showSaleAuth" />
    </div>
</template>
<script>
import SearchHeader from "biscomponents/order/SearchHeader";
import noAuth from "biscomponents/finance/noAuth";
import orderhandler from "bislibs/requestHandler/orderhandler";
import utils from "bislibs/utils";
import { mapMutations, mapGetters } from "vuex";
import accounting from "accounting";
export default {
    components: {
        SearchHeader,
        noAuth
    },
    data() {
        return {
            showSaleAuth: utils.hasAuth("showSaleAuth"),
            showPurchaseAuth: utils.hasAuth("showPurchaseAuth"),
            firstEnter: false,
            showPreview: false,
            sortType: { SALE: "DESC", PURCHASE: "DESC" },
            dateRange: { SALE: {}, PURCHASE: {} },
            tabActive: "SALE",
            orderStateMap: utils.orderStateMap,
            queryedKey: "",
            loading: true,
            keyMap: { SALE: "orderStateSale", PURCHASE: "orderStatePurchase" },
            currentPage: { SALE: 1, PURCHASE: 1 }, //当前页
            pageSize: { SALE: 20, PURCHASE: 20 }, //当前页面size
            totalNum: { SALE: 0, PURCHASE: 0 }, //总条数
            orderData: { SALE: [], PURCHASE: [] }, //订单列表数据
            pageSizeOptions: [5, 10, 20, 50, 100],
            stateList: [
                { text: "待付款", value: "UNPAID" },
                // { text: "待发货", value: "WAIT_FOR_DELIVERY" },
                { text: "待收货", value: "WAIT_TO_SIGN" },
                { text: "已完成", value: "COMPLETED" },
                { text: "已拆单", value: "SEPARATED" },
                // { text: "已关闭", value: "CLOSED" },
                { text: "已取消", value: "CANCELLED" }
            ],
            stateActive: {
                SALE: { title: "全部状态", value: "ALL" },
                PURCHASE: { title: "全部状态", value: "ALL" }
            }
        };
    },
    computed: {
        ...mapGetters(["orderHomeRefresh"]),
        orderTime() {
            return function (time) {
                return this.$moment(time).format("YYYY-MM-DD HH:mm:ss");
            };
        },
        orderAmount() {
            return function (amount) {
                return accounting.formatMoney(amount, "￥", 2, ",");
            };
        }
    },
    created() {
        this.showSaleAuth && (this.tabActive = "SALE");
    },
    mounted() {
        let _this = this;
        _this.firstEnter = true;
        _this.$bus.$on("change-date", (data) => {
            _this.dateRange[data.type].createTimeStart = this.$moment(data.date[0])
                .startOf("day")
                .valueOf();
            // .unix(); //当天00:00:00
            _this.dateRange[data.type].createTimeEnd = this.$moment(data.date[1])
                .endOf("day")
                .valueOf();
            // .unix(); //当天23:59:59
            _this.currentPage[data.type] = 1;
            _this.getOrderList(data.type);
        });
        _this.calHeight();
        window.onresize = () => {
            _this.calHeight();
        };
    },
    activated() {
        let _this = this;
        if (_this.firstEnter) {
            return;
        }
        if (_this.orderHomeRefresh) {
            _this.search(_this.tabActive);
        }
    },
    deactivated() {
        this.firstEnter = false;
    },
    beforeDestroy() {
        this.$bus.$off("change-date");
    },
    methods: {
        ...mapMutations({
            setOrderNo: "SET_ORDERNO",
            setHomeRefresh: "SET_ORDERHOMEREFRESH",
            setOrderType: "SET_ORDERTYPE"
        }),
        /**
     * 动态计算表格内容高度
     */
        calHeight() {
            let clientHeight = document.documentElement.clientHeight;
            let domHeight = clientHeight - 128;
            domHeight = domHeight > 500 ? domHeight : 500;
            let tableMaxHeigth = domHeight - 300;
            $(".list-table .el-table__body-wrapper").css({
                "max-height": tableMaxHeigth + "px",
                "overflow-y": "auto"
            });
            $(".all-order").css({
                height: domHeight + "px"
            });
        },
        /**
     * 获取请求url
     */
        getRequestUrl(url, type) {
            return type == "SALE" ? { url, prefix: "/order/v1/" } : url;
        },
        /**
     * 查询订单列表
     */
        search(type) {
            this.currentPage[type] = 1;
            this.getOrderList(type);
        },
        /**
     * 查询订单列表
     */
        getOrderList(type) {
            let _this = this;
            let param = {
                pageSize: _this.pageSize[type],
                pageNum: _this.currentPage[type]
            };
            let query = {
                orderType: type,
                sortRules: [
                    {
                        sortRuleKey: "createTime",
                        sortRuleValue: {
                            priority: 1,
                            sortType: this.sortType[type]
                        }
                    }
                ],
                queryKey:  _this.$refs[type] && _this.$refs[type].searchKey,
                createTimeStart: _this.dateRange[type].createTimeStart,
                createTimeEnd: _this.dateRange[type].createTimeEnd,
                orderState: _this.stateActive[type].value
            };
            type == "SALE" && (param.queryExt = query);
            type == "PURCHASE" && (param.queryExt = query);
            _this.$iLoading.show();
            const promise =
        type == "SALE"
            ? orderhandler.listByOperation(param)
            : orderhandler.listByOperation1(param);
            promise.then((res) => {
                _this.$iLoading.hide();
                if (res.resultCode === 0) {
                    _this.queryedKey = _this.$refs[type].searchKey;
                    _this.orderData[type] = [];
                    _this.totalNum[type] = res.result.total; //总条数
                    _this.orderData[type] = _this.orderData[type].concat(res.result.list);
                }
            }).catch(() => {
                _this.$iLoading.hide();
            });
        },
        /**
     * 导出订单列表
     */
        onExport(type) {
            let _this = this;
            let param = {
                pageSize: 1,
                pageNum: 1,
                queryExt: {
                    orderType: type,
                    sortRules: [
                        {
                            sortRuleKey: "createTime",
                            sortRuleValue: {
                                priority: 1,
                                sortType: this.sortType[type]
                            }
                        }
                    ],
                    queryKey: _this.queryedKey,
                    createTimeStart: _this.dateRange[type].createTimeStart,
                    createTimeEnd: _this.dateRange[type].createTimeEnd,
                    orderState: _this.stateActive[type].value
                }
                // showLoading: false
            };
            this.$refs[type].loading = true;
            const promise =
        type == "SALE"
            ? orderhandler.exportOrder(param)
            : orderhandler.exportOrder1(param);
            promise.then(
                (res) => {
                    this.$refs[type].loading = false;
                    if (res.resultCode === 0) {
                        this.downloadFile(res.result.filePath, "导出订单.csv");
                    }
                },
                () => {
                    this.$refs[type].loading = false;
                }
            );
        },
        downloadFile(url, fileName) {
            var x = new XMLHttpRequest();
            x.open("GET", url, true);
            x.responseType = "blob";
            x.onload = function () {
                var urls = window.URL.createObjectURL(x.response);
                var a = document.createElement("a");
                a.href = urls;
                a.download = fileName;
                a.click();
            };
            x.send();
        },
        /**
     * 切换页码
     */
        onPageChange(currentPage) {
            let _this = this;
            _this.currentPage[_this.tabActive] = currentPage;
            _this.getOrderList(_this.tabActive);
        },
        /**
     * 改变每页展示数量
     */
        changePageSize(pageSize) {
            let _this = this;
            _this.pageSize[_this.tabActive] = pageSize;
            _this.getOrderList(_this.tabActive);
        },
        /**
     * 切换tab
     */
        tabChange(tab) {
            this.tabActive = tab.name;
        },
        /**
     * 查看订单详情
     */
        showDetail(data) {
            this.setHomeRefresh(false);
            this.setOrderNo(data.orderNo);
            this.setOrderType(this.tabActive);
            if (data.orderState === "SEPARATED") {
                this.$router.push({
                    name: `${this.tabActive.toLowerCase()}parent`
                });
            } else {
                this.$router.push({
                    name: `${this.tabActive.toLowerCase()}child`
                });
            }
        },
        /**
     * 切换过滤条件
     */
        filterChange(filters) {
            let keys = Object.keys(filters)[0];
            this.currentPage[this.tabActive] = 1;
            this.stateActive[this.tabActive] = {
                title: this.orderStateMap[filters[keys][0]] || "全部状态",
                value: filters[keys][0] || "ALL"
            };
            this.getOrderList(this.tabActive);
        },
        /**
     * 时间排序
     */
        sort() {
            this.sortType[this.tabActive] =
        this.sortType[this.tabActive] == "DESC" ? "ASC" : "DESC";
            this.currentPage[this.tabActive] = 1;
            this.getOrderList(this.tabActive);
        }
    }
};
</script>
<style lang="less">
@import "~styles/order.less";

.all-order {
  border-radius: 8px;
  background-color: #fff;
  padding: 12px 24px 24px;
  box-sizing: border-box;
  .dropdown-link {
    cursor: pointer;
  }
  .sort {
    cursor: pointer;
  }
  .single {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .list-table {
    th {
      padding: 0;
    }
  }
  .time-title {
    display: flex;
    align-items: center;
    .DESC {
      background: url("~assets/icon_up.png") no-repeat center;
    }
    .ASC {
      background: url("~assets/icon_down.png") no-repeat center;
    }
    .ASC,
    .DESC {
      cursor: pointer;
      display: inline-block;
      width: 16px;
      height: 16px;
      background-size: contain;
    }
  }
  .UNPAID {
    color: #ff4e3a;
  }
  .WAIT_TO_SIGN {
    color: #f8a339;
  }
  .COMPLETED,
  .SEPARATED {
    color: #23b45d;
  }
  .CANCELLED {
    color: #999999;
  }
  .pages {
    padding-right: 32px;
  }
}
</style>