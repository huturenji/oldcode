<template>
    <div class="all-order">
        <template v-if="showSaleAuth">
            <search-header
                @on-export="onExport"
                @on-search="search"
                :order-list="orderData"
                ref="searchbox"
            ></search-header>
            <el-table
                class="list-table"
                @filter-change="filterChange"
                :data="orderData"
                default-expand-all
                :span-method="arraySpanMethod"
                :header-cell-style="{ background: '#f2f2f2' }"
                row-key="subOrderNo"
                :tree-props="{children: 'subOrderList', hasChildren: 'hasChildren'}"
            >
                <el-table-column
                    min-width="150"
                    prop="subOrderNo"
                    label="平台订单号"
                >
                    <template slot-scope="scope">
                        <div
                            v-if="scope.row.isParent"
                            class="parent-header"
                        >
                            <div style="display:flex">
                                <div style="margin-right:20px">
                                    {{
                                        "收货人：" +
                                            scope.row.name +
                                            " " +
                                            (scope.row.mobile?'（'+scope.row.mobile+'）':'-')
                                    }}
                                </div>
                                <div>
                                    {{
                                        "下单人：" +
                                            (scope.row.userName||'-') +
                                            " " +
                                            (scope.row.userMobile?'（'+scope.row.userMobile+'）':'-')
                                    }}
                                </div>
                            </div>
                            <div>
                                {{
                                    "下单时间：" +
                                        orderTime(scope.row.createTime)
                                }}
                            </div>
                        </div>
                        <div class="combind-row">
                            <div class="dynamic-row">
                                <div :style="{ display: 'flex', flex: '150' }">
                                    <div
                                        :class="
                                            scope.row.isParent
                                                ? 'parent-tag'
                                                : 'child-tag'
                                        "
                                    ></div>
                                    <div class="combind-tag">
                                        {{
                                            scope.row.isParent
                                                ? "父"
                                                : "子"
                                        }}
                                    </div>
                                    <span :style="{ width: '125px' }">
                                        {{ scope.row.subOrderNo || "--" }}
                                    </span>
                                </div>
                                <span :style="{ flex: '120' }">{{
                                    scope.row.supplierOrderNo || "--" 
                                }}</span>
                                <!-- <span :style="{ flex: '120' }">{{
                                    scope.row.thirdOrderNo || "--" 
                                }}</span> -->
                                <span :style="{ flex: '90' }">{{
                                    scope.row.supplierType | supplierTypeFormat
                                }}</span>
                                <span :style="{ flex: '90' }">{{
                                    scope.row.channelName || "--"
                                }}</span>
                                <span :style="{ flex: '100' }">{{
                                    orderAmount(scope.row.supplierOrderSettlePrice)
                                }}</span>
                                <span :style="{ flex: '90' }">{{
                                    orderAmount(scope.row.orderSettlePrice)
                                }}</span>
                                <span :style="{ flex: '90' }">
                                    {{
                                        scope.row.showState ||
                                            ""
                                    }}
                                </span>
                            </div>
                            <span
                                :style="{ width: '80px' }"
                                class="active"
                                @click="showDetail(scope.row)"
                            >详情</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    min-width="120"
                    prop="supplierOrderNo"
                    label="供应商订单号"
                >
                </el-table-column>
                <!-- <el-table-column
                    min-width="120"
                    prop="thirdOrderNo"
                    label="渠道订单号"
                >
                </el-table-column> -->
                <el-table-column
                    min-width="90"
                    :filter-multiple="false"
                    :label="SPName"
                    prop="supplierId"
                >
                    <!-- 供应商筛选 -->
                </el-table-column>
                <el-table-column
                    min-width="90"
                    column-key="channelId"
                    :filter-multiple="false"
                    :label="chanlName"
                    :filters="chanelOptions"
                    prop="channelId"
                >
                    <!-- 渠道筛选 -->
                </el-table-column>

                <el-table-column
                    prop="supplierOrderSettlePrice"
                    label="供应商结算价"
                    min-width="100"
                >
                </el-table-column>
                <el-table-column
                    prop="orderSettlePrice"
                    label="渠道价"
                    min-width="90"
                >
                </el-table-column>
                <el-table-column
                    min-width="90"
                    :filter-multiple="false"
                    :label="stateActive.title"
                    prop="orderState"
                >
                    <!-- 订单状态筛选 -->
                </el-table-column>
                <el-table-column
                    width="90"
                    prop="operate"
                    label="操作"
                >
                </el-table-column>
            </el-table>
        </template>
        <div class="pages">
            <el-pagination
                background
                v-if="
                    (showSaleAuth || showPurchaseAuth) &&
                        orderData.length
                "
                @size-change="changePageSize"
                @current-change="onPageChange"
                :current-page="currentPage"
                :page-sizes="pageSizeOptions"
                :page-size="pageSize"
                layout="total,prev,pager,next,jumper,sizes"
                :total="totalNum"
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
            // showSaleAuth: utils.hasAuth("showSaleAuth"),
            showSaleAuth: true,
            showPurchaseAuth: utils.hasAuth("showPurchaseAuth"),
            firstEnter: false,
            showPreview: false,
            sortType:  "DESC",
            dateRange: {},
            tabActive: "SALE",
            orderStateMap: utils.orderStateMap,
            keyword: "",
            loading: true,
            keyMap: { SALE: "orderStateSale", PURCHASE: "orderStatePurchase" },
            currentPage: 1, //当前页
            pageSize: 20, //当前页面size
            totalNum: 0, //总条数
            orderData: [], //订单列表数据
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
                title: "状态", value: "ALL" 
            },
            SPOptions: [], //供应商信息列表
            SPName: "供应商", //table中默认供应商标题值
            SPValue: -1, //供应商默认值（-1表示全部）
            chanelOptions: [], //渠道信息列表
            chanlName: "渠道", //table中默认渠道标题值
            chanelValue: -1 //渠道默认值（-1表示全部）
        };
    },
    computed: {
        ...mapGetters(["orderHomeRefresh"]),
        orderTime() {
            return function (time) {
                var dates = new Date(time).toJSON();
                return new Date(+new Date(dates) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/,'')
                // return this.$moment(time).format("YYYY-MM-DD HH:mm:ss");
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
            _this.dateRange.createTimeStart = data.date[0];
            _this.dateRange.createTimeEnd = data.date[1];
            _this.currentPage = 1;
            _this.getOrderList();
        });
        _this.calHeight();
        window.onresize = () => {
            _this.calHeight();
        };
        // _this.getSpInfos();//获取供应商列表用作筛选，一期不做
        _this.getChannelInfos();//获取渠道列表用作筛选
    },
    activated() {
        let _this = this;
        if (_this.firstEnter) {
            return;
        }
        // if (_this.orderHomeRefresh) {
        //     }
        _this.getOrderList(_this.tabActive);
    },
    deactivated() {
        this.firstEnter = false;
    },
    beforeDestroy() {
        this.$bus.$off("change-date");
    },
    filters:{
        supplierTypeFormat(val) {
            let mapSupplierType = {
                'JD':'京东',
                'EHSY':'西域'
            }
            if (val&&mapSupplierType[val]){
                return mapSupplierType[val]
            }
            return "--"
            
            
        }
    },
    methods: {
        ...mapMutations({
            setOrderNo: "SET_ORDERNO",
            setsubOrderNo: "SET_SUBORDERNO",
            setHomeRefresh: "SET_ORDERHOMEREFRESH",
            setOrderType: "SET_ORDERTYPE"
        }),
        /**
         * 动态计算表格内容高度
         */
        calHeight() {
            let clientHeight = document.documentElement.clientHeight;
            let domHeight = clientHeight - 108;
            domHeight = domHeight > 500 ? domHeight : 500;
            let tableMaxHeigth = domHeight - 230;
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
        search() {
            this.currentPage = 1;
            this.getOrderList();
        },
        /**
         * 查询订单列表
         */
        getOrderList() {
            let _this = this;
            let param = {
                pageSize: _this.pageSize,
                pageNum: _this.currentPage,
                keyword: _this.$refs["searchbox"].searchKey,
                startTime: _this.dateRange.createTimeStart,
                endTime: _this.dateRange.createTimeEnd,
                channelId: _this.chanelValue
            };
            _this.$iLoading.show();
            orderhandler.listByOperation(param).then((res) => {
                _this.$iLoading.hide();
                if (res.resultCode === 0) {
                    let orderList = res.result.records
                    orderList.forEach(function(item) {
                        item.subOrderNo = item.orderNo
                        item.isParent = true
                    })
                    _this.keyword = _this.$refs["searchbox"].searchKey;
                    _this.orderData = [];
                    _this.totalNum = res.result.total; //总条数
                    _this.orderData = _this.orderData.concat(
                        // res.result.records
                        orderList
                    );
                }
            })
                .catch(() => {
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
                    queryKey: _this.keyword,
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
            _this.currentPage = currentPage;
            _this.getOrderList();
        },
        /**
         * 改变每页展示数量
         */
        changePageSize(pageSize) {
            let _this = this;
            _this.pageSize = pageSize;
            _this.getOrderList();
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
            if (data.orderNo) {
                this.setOrderNo(data.orderNo);
                this.setOrderType(this.tabActive);
                this.$router.push({
                    name: `${this.tabActive.toLowerCase()}parent`
                });
            } else {
                this.setsubOrderNo(data.subOrderNo);
                this.setOrderType("child");
                this.$router.push({
                    name: `${this.tabActive.toLowerCase()}child`
                });
            }
        },
        /**
         * 切换过滤条件
         */
        filterChange(filters) {
            let _this = this;
            if (filters.supplierId) {
                //供应商筛选
                _this.SPValue = filters.supplierId.length
                    ? filters.supplierId[0]
                    : -1;
                if (!!_this.SPOptions && _this.SPValue != -1) {
                    _this.SPOptions.forEach(function (item) {
                        if (item.value == _this.SPValue) {
                            _this.SPName = item.text;
                        }
                    });
                } else {
                    _this.SPName = "供应商";
                }
            } else if (filters.channelId) {
                //渠道筛选
                _this.chanelValue = filters.channelId.length
                    ? filters.channelId[0]
                    : -1;
                if (!!_this.chanelOptions && _this.chanelValue != -1) {
                    _this.chanelOptions.forEach(function (item) {
                        if (item.value == _this.chanelValue) {
                            _this.chanlName = item.text;
                        }
                    });
                } else {
                    _this.chanlName = "渠道";
                }
            } else {
                //订单状态
                let keys = Object.keys(filters)[0];
                this.currentPage[this.tabActive] = 1;
                this.stateActive[this.tabActive] = {
                    title: this.orderStateMap[filters[keys][0]] || "状态",
                    value: filters[keys][0] || "ALL"
                };
            }
            this.getOrderList(this.tabActive);
        },
        /**
         * 时间排序
         */
        sort() {
            this.sortType = this.sortType == "DESC" ? "ASC" : "DESC";
            this.currentPage[this.tabActive] = 1;
            this.getOrderList(this.tabActive);
        },
        /**
         * 合并单元格
         */
        // eslint-disable-next-line no-unused-vars
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            //我们把整行全部合并，然后自己实现
            if (columnIndex === 0) {
                //第一个元素代表rowspan，第二个元素代表colspan
                return [1, 9];
            } else if (
                columnIndex === 1 ||
                columnIndex === 2 ||
                columnIndex === 3 ||
                columnIndex === 4 ||
                columnIndex === 5 ||
                columnIndex === 6 ||
                columnIndex === 7 ||
                columnIndex === 8
            ) {
                return [0, 0];
            }
        },
        //查询供应商列表
        getSpInfos: function () {
            let _this = this;
            var json = {
                pageSize: 1000,
                pageNum: 1,
                searchKey:""
                // showLoading: false,
            };
            orderhandler.listSupplier(json).then(function (result) {
                if (!!result && result.resultCode == 0) {
                    if (!!result.result.supplierDetailResults) {
                        result.result.supplierDetailResults.forEach(function (item) {
                            _this.SPOptions.push({
                                value: item.supplierId,
                                text: item.supplierShortName
                            });
                        });
                    }
                }
            });
        },
        //查询渠道列表
        getChannelInfos: function () {
            let _this = this;
            var json = {
                pageSize: 1000,
                pageNum: 1,
                shortName:""
            };
            orderhandler.listChannel(json).then(function (result) {
                if (!!result && result.resultCode == 0) {
                    if (!!result.result.channelVoList) {
                        result.result.channelVoList.forEach(function (item) {
                            _this.chanelOptions.push({
                                value: item.channelId,
                                text: item.name
                            });
                        });
                    }
                }
            });
        }
    }
};
</script>
<style lang="less">
@import "~styles/order.less";
.el-table__cell .cell .el-table__expand-icon,
.el-table__cell .cell .el-table__indent,
.el-table__cell .cell .el-table__placeholder{display: none;}
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
    .parent-header {
        display: flex;
        padding: 3px;
        justify-content: space-between;
        
        background: #f2f2f2;
    }
    .combind-row {
        display: flex;
        padding: 3px;
        padding-top:10px;
        // justify-content: space-between;
        .dynamic-row {
            display: flex;
            flex: auto;
            span {
                padding-left: 5px;
            }
        }
    }
    .parent-tag {
        width: 0px;
        height: 0px;
        border-color: transparent red;
        border-width: 0px 0px 25px 25px;
        border-style: solid;
    }
    .child-tag {
        width: 0px;
        height: 0px;
        border-color: transparent blue;
        border-width: 0px 0px 25px 25px;
        border-style: solid;
    }
    .combind-tag {
        width: 20px;
        height: 20px;
        color: white;
        margin-left: -25px;
        font-size: smaller;
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