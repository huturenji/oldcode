<template>
    <div class="context product">
        <div class="merchupdownshelfMgr">
            <div 
                class="merchupdownshelfMgr_center loading-area product_content"
                v-if="!isShowModal"
            >
                <div class="queryLine">
                    <div class="searchLine">
                        <el-input 
                            v-model="searchKeyWord" 
                            placeholder="供应商/渠道/商品分类/SKU编号/规则名称" 
                            @keyup.enter.native="searchRule"
                            clearable
                        ></el-input>
                        <el-button 
                            slot="append" 
                            type="primary" 
                            size="mini"
                            icon="el-icon-search"
                            @click="searchRule"
                        ></el-button>
                    </div>
                </div>
                <div class="commodity_filter_tip">
                    <div class="commodity_filter_tip_box">
                        <i class="el-icon-warning commodity_filter_tip_warning"></i>
                        <p class="commodity_filter_tip_text">
                            <span>1.当未设置规则时，默认供应商下所有产品全部上架</span>
                        </p>
                    </div>
                </div>
                <div>
                    <div 
                        class="batchBtnLine"
                        v-if="hasAddOffShelfAuth()"
                    >
                        <el-button 
                            type="primary" 
                            size="medium"
                            @click="addRule"
                        >+新增</el-button>
                    </div>
                    <el-table
                        ref="multipleTable"
                        :data="forbidRuleList"
                        class="filterTableBox_content el-table--scrollable-y el-table--enable-row-transition el-table--fluid-height"
                        :stripe="true"
                        style="width: 100%;"
                        @filter-change="changeData"
                    >
                        <el-table-column 
                            prop="ruleName" 
                            label="规则名称"
                            min-width="200"
                            :show-overflow-tooltip="true"
                        >
                        </el-table-column>
                        <el-table-column 
                            :label="channelName"
                            min-width="200"
                            label-class-name="filterTableBox_pointer"
                            :filters="channelOptions"
                            :filter-multiple="false"
                            :column-key="'channelId'"
                        >
                            <template slot-scope="scope">
                                <div class="filterTableBox_item">
                                    <!-- <img 
                                        :src="scope.row.spLogo"
                                        class="filterTableBox_item_logo" 
                                    /> -->
                                    <span class="filterTableBox_item_text">
                                        {{ scope.row.channelName }}
                                    </span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column 
                            prop="scopeValueStr" 
                            label="商品范围"
                            min-width="200"
                            :show-overflow-tooltip="true"
                        >
                        </el-table-column>
                        <el-table-column 
                            :label="stateTitleName"
                            min-width="120"
                            label-class-name="filterTableBox_pointer"
                            :filters="stateOptions"
                            :filter-multiple="false"
                            :column-key="'state'"
                        >
                            <template slot-scope="scope"> 
                                <span :class="[(scope.row.state==1||scope.row.state)?'filterTableBox_content_started':'filterTableBox_content_stop']">
                                    {{ (scope.row.state==1||scope.row.state)?'已启用':'已停用' }}</span></template>
                        </el-table-column>
                        <el-table-column
                            label="启用/停用时间"
                            min-width="200"
                            :formatter="formatter"
                        >
                        </el-table-column>
                        <el-table-column 
                            label="操作"
                            min-width="60"
                        >
                            <template slot-scope="scope">
                                <el-button 
                                    type="text"
                                    @click="ruleDetail(scope.row.ruleId)"
                                >详情 </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="merchupdownshelfMgr_bottom">
                    <el-pagination
                        background
                        @size-change="pSizeChange"
                        @current-change="changePage"
                        :current-page="pageNum"
                        :page-sizes="pageSizeOpts"
                        :page-size="pageSize"
                        layout="total, prev, pager, next, jumper, sizes"
                        :total="totalNum"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>        
        <noAuth :isShowModal="isShowModal" />
    </div>
</template>


<script>
import noAuth from "biscomponents/product/noAuth";
import producthandler from "bislibs/requestHandler/producthandler";
import utils from "bislibs/utils";

export default {
    components: {
        noAuth
    },
    data() {
        return {
            searchKeyWord: "", //搜索关键字
            state: -1, //启用状态
            ruleType: -1, //规则方式
            pageSize: 5, //分页大小
            pageNum: 1, //当前页码
            pageSizeOpts: [5, 10, 20, 50, 100], //分页可选页面大小
            totalNum: 0, //总记录数
            totalPages: 0, //总页数
            forbidRuleList: [], //下架规则列表
            channelList: [], //渠道信息列表
            channelValue: -1, //渠道默认值（-1表示全部）
            channelOptions: [], //供应商信息列表
            // channelValue: -1, //供应商默认值（-1表示全部）
            stateOptions: [
                { value: 0, text: "已停用" },
                { value: 1, text: "已启用" }
            ], //停启用状态列表
            stateValue: -1, //停启用默认状态值（-1表示全部）
            isShowModal: false, //判断是否显示弹出框
            channelName: "适用渠道", //table中默认供应商标题值
            stateTitleName: "全部状态" //table中默认状态标题值
        };
    },
    beforeCreate() {},
    created() {
        var _this = this;
        this.hasSeeOffShelfAuth();
        if (utils.hasAuth('hasSeeOffShelfAuth')){
            _this.getChannels();
            _this.getRuleList();
        }
    },
    mounted: function() {},
    methods: {
        //判断是否有查看规则详情权限
        hasSeeOffShelfAuth() {
            this.isShowModal = !utils.hasAuth('hasSeeOffShelfAuth');
        },
        //判断是否有新增规则权限
        hasAddOffShelfAuth() {
            return utils.hasAuth('hasAddOffShelfAuth');
        },
        //格式化时间
        formatter(row) {
            return utils.dateFormater("YYYY-MM-DD HH:mm:ss", row.updateTime);
        },
        //切换筛选条件
        changeData(value) {
            let _this = this;
            if (value.channelId) {
                //切换供应商
                _this.channelValue = value.channelId.length
                    ? value.channelId[0]
                    : -1;
                if (!!_this.channelOptions && _this.channelValue != -1) {
                    _this.channelOptions.forEach(function(item) {
                        if (item.value == _this.channelValue) {
                            _this.channelName = item.text;
                        }
                    });
                } else {
                    _this.channelName = "适用渠道";
                }
            } else {
                //切换状态
                this.stateValue = value.state.length
                    ? value.state[0]
                    : -1;

                if (!!_this.stateOptions && _this.stateValue != -1) {
                    _this.stateOptions.forEach(function(item) {
                        if (item.value == _this.stateValue) {
                            _this.stateTitleName = item.text;
                        }
                    });
                } else {
                    _this.stateTitleName = "全部状态";
                }
            }
            _this.pageNum = 1;
            _this.getRuleList();
        },
        //搜索规则
        searchRule: function() {
            this.getRuleList(true);
        },
        //查询规则列表
        getRuleList: function(isFromSearch) {
            let _this = this;
            if (isFromSearch) {
                _this.pageNum = 1;
            }
            _this.pageSize = Number(localStorage.getItem("shelfPageSize")) || 5;
            var json = {         
                pageSize: _this.pageSize,
                pageIndex: _this.pageNum
            };
            if (!!_this.searchKeyWord.trim()) {
                json["keyword"] = _this.searchKeyWord.trim();
            }
            if (_this.channelValue != -1){
                json.channelId = _this.channelValue;
            }
            if (_this.stateValue != -1){
                json.state = _this.stateValue;
            }
            _this.$iLoading.show();
            producthandler.listOffShelfRule(json).then(function(result) {
                _this.$iLoading.hide();
                if (!!result && result.resultCode == 0) {
                    _this.forbidRuleList = result.result.listPriceRuleVos;
                    _this.totalNum = result.result.totalItems;
                    _this.totalPages = result.result.totalPages;
                    _this.forbidRuleList.forEach(function(item) {       
                        item["scopeValueStr"] = utils.getScopeStr(item);        
                    });
                }
            }).catch(() => {
                _this.$iLoading.hide();
            });
        },
        //查询渠道列表
        getChannels: function() {
            let _this = this;
            var json = {
                pageSize: 1000,
                pageNum: 1,
                showLoading: false
            };
            producthandler.listChannel(json).then(function(result) {
                if (!!result && result.resultCode == 0) {
                    if (!!result.result.channelVoList) {
                        result.result.channelVoList.forEach(function(item) {
                            _this.channelOptions.push({
                                value: item.channelId,
                                text: item.shortName || item.name
                            });
                        });
                    }
                }
            });
        },
        //每页显示条数变化
        pSizeChange: function(pSize) {
            var _this = this;
            _this.pageSize = pSize;
            utils.setStorage("shelfPageSize", pSize);
            _this.pageNum = 1;
            _this.getRuleList();
        },
        //页码变化
        changePage: function(page) {
            var _this = this;
            _this.pageNum = page;
            _this.getRuleList();
        },
        //跳转添加规则页面
        addRule: function() {
            let _this = this;
            _this.$router.push({ path: "/product/shelves/add" });
            utils.setStorage("ruleViewType", "ruleAdd");
        },
        //规则详情页面
        ruleDetail: function(ruleId) {
            let _this = this;
            _this.$router.push({ path: "/product/shelves/detail" });
            utils.setStorage("ruleViewType", "ruleDetail");
            utils.setStorage("ruleId", ruleId);
        },
        //删除规则
        delRule: function(ruleId) {
            let _this = this;
            var json = {
                ruleId: ruleId
            };
            producthandler.deleteOffShelfRule(json).then(function(result) {
                if (!!result && result.resultCode == 0) {
                    _this.getRuleList();
                }
            });
        }
    },
    filters: {},
    watch: {}
};
</script>

<style lang="less" scoped>
@import "./search.less";
</style>
<style lang="less" >
.merchupdownshelfMgr_center {
    .el-button--primary {
        background-color: #478aee;
        border-color: #478aee;
    }
    .el-button--text {
        color: #478aee;
        &:hover,
        &:focus {
            opacity: 0.8;
            text-decoration: underline;
        }
    }
    .el-table {
        color: #333;
        &__body-wrapper {
            max-height: ~"calc(100vh - 504px)";
            min-height: 80px;
        }
        tr {
            th {
                height: 36px;
                padding: 0;
                font-size: 14px;
                color: #666666;
                background-color: #f2f2f2;
                height: 36px;
                &:first-child {
                    .cell {
                        padding-left: 32px;
                    }
                }
                .cell {
                    &.highlight {
                        color: #666 !important;
                    }
                }
            }
            td {
                height: 80px;
                &:first-child {
                    .cell {
                        padding-left: 32px;
                    }
                }
            }
            th.is-leaf,
            td {
                border: none;
            }
        }

        &--striped {
            .el-table__body {
                tr {
                    &.el-table__row--striped {
                        td {
                            background: #f8f8f8;
                        }
                    }
                }
            }
        }
        &::before {
            height: 0;
        }

        &-filter__list {
            max-height: 300px;
            overflow-y: auto;
        }
    }
    .el-button--primary:focus,
    .el-button--primary:hover {
        background-color: #478aee;
        border-color: #478aee;
        opacity: 0.8;
    }
}
.merchupdownshelfMgr_bottom {
    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #478aee;
    }
    .el-pagination.is-background .el-pager li:not(.disabled):hover {
        color: #478aee;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
        color: #fff;
    }
}
.searchLine {
    display: flex;

    .el-input {
        input {
            border-radius: 8px 0 0 8px !important;
            width: 359px !important;
            height: 36px !important;
            margin-left: 32px !important;
            padding: 0 12px;
            line-height: 36px;
        }
    }
    .el-button--mini,
    .el-button--mini.is-round {
        padding: 7px 13px;
    }
}
.filterTableBox_pointer {
    cursor: pointer;
}
// .el-table-filter__list-item.is-active {
//     background-color: #478aee !important;
// }
// .el-table-filter__list {
//     max-height: 380px;
//     overflow: auto;
// }
</style>