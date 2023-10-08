<template>
    <div class="context product">
        <div
            class="downshelfMgr"
            v-if="!isShowModal"
        >
            <div v-show="!loading">
                <div
                    class="editRuleType"
                    v-if="hasStopUsingOffShelfAuth() || hasEditOffShelfAuth()"
                >
                    <el-button
                        v-if="!ForbidRule.state && hasStopUsingOffShelfAuth()"
                        plain
                        size="medium"
                        class="enabledState"
                        @click="showConfirmFun(true)"
                    >启用</el-button>
                    <el-button
                        v-if="ForbidRule.state && hasStopUsingOffShelfAuth()"
                        plain
                        size="medium"
                        class="unabledState"
                        @click="showConfirmFun(false)"
                    >停用</el-button>
                    <el-button
                        class="editRuleBtn"
                        v-if="hasEditOffShelfAuth()"
                        type="primary"
                        size="medium"
                        @click="editRule"
                    >编辑</el-button>
                </div>
                <div class="product_content downshelfMgr_center">
                    <div class="addruleDefineContext">
                        <div class="addRuleDefineLine">
                            <div class="enableRuleConditionTitle">
                                状态:
                            </div>
                            <div
                                :class="{
                                    textStateStyle_1: ForbidRule.state,
                                    textStateStyle_2: !ForbidRule.state,
                                }"
                            >
                                {{ ForbidRule.state ? "已启用" : "已停用" }}
                            </div>
                        </div>
                    </div>
                    <div class="addruleDefineContext">
                        <div class="addRuleDefineLine">
                            <div class="addRuleConditionTitle">
                                规则名称:
                            </div>
                            <div class="textStyle">
                                {{ ForbidRule.ruleName }}
                            </div>
                        </div>
                    </div>
                    <div class="addruleDefineContext">
                        <div class="addRuleDefineLine">
                            <div class="addRuleConditionTitle">
                                适用渠道:
                            </div>
                            <div class="textStyle">
                                {{ ForbidRule.channelName }}
                            </div>
                        </div>
                    </div>
                    <productRange
                        ref="productRange"
                        :rangeTypeList="rangeTypeList"
                        :ParangeType="rangeType"
                        :selectedSKUList="selectedSKUList"
                        :readOnly="readOnly"
                        :parActiveNames="activeNames"
                        :selectedClassifyTreeList="classifyTreeList"
                        :supplierLsit="supplierLsit"
                    ></productRange>
                    <div class="addruleDefineContext">
                        <div class="addRuleDefinecontextLine">
                            <div class="enableRuleConditionTitle">
                                备注:
                            </div>
                            <div class="textStyle">
                                {{ ForbidRule.remark }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="product_content logContext">
                    <div class="logLine">
                        <div class="logTitle">
                            操作日志
                        </div>
                        <div class="logTable">
                            <el-table
                                :data="operationRecord"
                                :stripe="true"
                                header-row-class-name="log_header"
                            >
                                <el-table-column
                                    label="时间"
                                    min-width="355"
                                    :formatter="formatter"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="creator"
                                    label="操作人"
                                    min-width="355"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="content"
                                    label="内容"
                                    min-width="355"
                                >
                                </el-table-column>
                            </el-table>
                        </div>

                        <div class="merchupdownshelfMgr_log">
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
                <!-- 二次确认弹框开始 -->
                <el-dialog
                    class="usingBulletBox"
                    :title="confirmTitle"
                    :visible.sync="showConfirm"
                    width="30%"
                    :modal-append-to-body="false"
                    center
                >
                    <p class="usingBulletBox_tip">
                        {{ confirmMsg }}
                    </p>
                    <span
                        slot="footer"
                        class="usingBulletBox-footer"
                    >
                        <el-button @click="doCancel">取 消</el-button>
                        <el-button
                            type="primary"
                            :loading="btnLoading"
                            @click="doConfirm"
                        >确 定</el-button>
                    </span>
                </el-dialog>
                <!-- 二次确认弹框结束 -->
            </div>
        </div>
        <noAuth :isShowModal="isShowModal" />
    </div>
</template>


<script>
import productRange from "biscomponents/product/productRange/productRange.vue";
import noAuth from "biscomponents/product/noAuth";
import producthandler from "bislibs/requestHandler/producthandler";
import utils from "bislibs/utils";

export default {
    components: {
        productRange,
        noAuth
    },
    data() {
        return {
            ForbidRule: {
                ruleId: "", //下架规则id
                ruleName: "", //下架规则名称
                comment: "", //下架规则备注
                SPList: [], //下架规则关联供应商
                channelList: [], //下架规则关联渠道
                categoryList: [], //下架规则关联分类
                SKUList: [] //下架规则关联SKU
            }, //下架规则
            selectedSKUList: [], //已选中的SKU信息列表
            selectedChannelListList: [], //已选中的渠道信息列表
            ruleViewType: "", //判断是新增还是编辑页面
            rangeTypeList: [
                {
                    rangeTypeName: "分类",
                    type: 1
                },
                {
                    rangeTypeName: "SKU",
                    type: 2
                },
                {
                    rangeTypeName: "供应商",
                    type: 3
                }
            ], //产品范围类别信息
            rangeType: 0, //产品范围分类
            showConfirm: false, //是否显示确认框
            confirmMsg: "", //确认提示信息
            confirmTitle: "", //确认框标题
            isStart: false,
            ruleId: "", //规则id
            readOnly: true, //判断是否是详情页面
            activeNames: ["1"],
            activeNames_2: ["1"],
            activeNames_3: ["1"],
            pageSize: 5, //分页大小
            pageNum: 1, //分页页数
            pageSizeOpts: [5, 10, 20, 50, 100], //分页可选页面大小
            totalNum: 0, //总记录数
            operationRecord: [], //操作记录
            classifyTreeList: [], //规则信息中分类信息树
            isShowModal: false, //判断是否显示弹出框
            loading: true,
            supplierId: 0, //供应商信息
            btnLoading: false, //btn加载状态
            supplierLsit: [] //供应商的列表
        };
    },
    beforeCreate() {},
    created() {
        // 初始化
        this.hasSeeOffShelfAuth();
        this.ruleId = utils.getStorage("ruleId");
        utils.hasAuth("hasSeeOffShelfAuth") && this.getRuleById();
        utils.hasAuth("hasSeeOffShelfAuth") && this.getListRuleLogs();
    },
    mounted: function () {},
    methods: {
        //判断是否有查看规则详情权限
        hasSeeOffShelfAuth() {
            this.isShowModal = !utils.hasAuth("hasSeeOffShelfAuth");
        },
        //判断是否有编辑规则权限
        hasEditOffShelfAuth() {
            return utils.hasAuth("hasEditOffShelfAuth");
        },
        //判断是否有停启用规则权限
        hasStopUsingOffShelfAuth() {
            return utils.hasAuth("hasStopUsingOffShelfAuth");
        },
        //查询规则详情
        getRuleById: function () {
            let _this = this;
            var json = {
                ruleId: _this.ruleId
                // showLoading: false
            };
            _this.$iLoading.show();
            producthandler
                .getOffShelfRule(json)
                .then(function (result) {
                    _this.$iLoading.hide();
                    if (!!result && result.resultCode == 0) {
                        setTimeout(function () {
                            _this.loading = false;
                        }, 1000);
                        _this.ForbidRule = result.result;

                        let ruleScops = _this.ForbidRule.scopes;
                        if (_this.ForbidRule.scopeLevel == 1) {
                            //分类= scopeLevel  = 1
                            _this.rangeType = 1;
                            if (ruleScops.length > 0) {
                                producthandler
                                    .getCategories({ categoryId: 0 })
                                    .then(function (results) {
                                        if (results.resultCode == 0) {
                                            //获取分类树
                                            _this.classifyTreeList =
                                                utils.scopsToTree(
                                                    ruleScops,
                                                    results.result
                                                        .productCategoryList
                                                );
                                        }
                                    });
                            }
                        } else if (_this.ForbidRule.scopeLevel === 2) {
                            //sku= scopeLevel  =2
                            _this.rangeType = 2;
                            let tempList = [];
                            // _this.$nextTick(() => {
                            ruleScops.forEach((scopItem) => {
                                tempList.push(scopItem.scopeValue);
                            });
                            _this.selectedSKUList = tempList;
                        } else if (_this.ForbidRule.scopeLevel === 0) {
                            //供应商= scopeLevel  =0
                            _this.rangeType = 3;
                            _this.supplierLsit = [];
                            ruleScops.forEach((scopItem) => {
                                _this.supplierLsit.push({
                                    supplierId: scopItem.scopeValue,
                                    supplierShortName:
                                        scopItem.scopeValueDescription
                                });
                            });
                        }
                    }
                })
                .catch(() => {
                    _this.$iLoading.hide();
                });
        },
        //编辑添加规则页面
        editRule: function () {
            let _this = this;
            _this.ruleViewType = "ruleEdit";
            _this.$router.push({ path: "/product/shelves/edit" });
            utils.setStorage("ruleViewType", "ruleEdit");
        },
        //停/启用规则
        updateUseState: function () {
            let _this = this;
            let enabledState = false;
            if (_this.isStart) {
                enabledState = true;
            }
            var json = {
                ruleId: _this.ruleId,
                ruleType: 1, //规则类型：0-价格，1-下架
                state: enabledState ? 1 : 0,
                creator: producthandler.userInfo.mgrName,
                showLoading: false
            };
            _this.btnLoading = true;
            producthandler.enableRule(json).then(function (result) {
                _this.btnLoading = false;
                if (!!result && result.resultCode == 0) {
                    _this.ForbidRule.state = json.state;
                    _this.getListRuleLogs();
                }
            });
        },
        //查询规则操作日志
        getListRuleLogs: function () {
            let _this = this;
            _this.pageSize =
                Number(localStorage.getItem("shelfLogPageSize")) || 5;
            var json = {
                ruleId: _this.ruleId,
                pageSize: _this.pageSize,
                pageIndex: _this.pageNum,
                showLoading: false
            };
            producthandler.listRuleLogs(json).then(function (result) {
                if (!!result && result.resultCode == 0) {
                    _this.operationRecord = result.result.listPriceRuleVos;
                    _this.totalNum = result.result.total;
                }
            });
        },
        //弹出停/启用规则确认框
        showConfirmFun: function (isStart) {
            let _this = this;
            _this.isStart = isStart;
            _this.showConfirm = true;
            if (isStart) {
                _this.confirmTitle = "启用规则";
                _this.confirmMsg = "确认启用该规则?";
            } else {
                _this.confirmTitle = "停用规则";
                _this.confirmMsg = "确认停用该规则?";
            }
        },
        //确认停/启用规则
        doConfirm: function () {
            let _this = this;
            _this.showConfirm = false;
            _this.updateUseState();
        },
        //取消停/启用规则
        doCancel: function () {
            let _this = this;
            _this.showConfirm = false;
        },
        //每页显示条数变化
        pSizeChange: function (pSize) {
            var _this = this;
            _this.pageSize = pSize;
            utils.setStorage("shelfLogPageSize", pSize);
            _this.pageNum = 1;
            _this.getListRuleLogs();
        },
        //页码变化
        changePage: function (page) {
            var _this = this;
            _this.pageNum = page;
            _this.getListRuleLogs();
        },
        //格式化时间
        formatter(row) {
            return utils.dateFormater("YYYY-MM-DD HH:mm:ss", row.updateTime);
        }
    },
    filters: {},
    watch: {}
};
</script>
<style lang="less" scoped>
@import "./detail.less";
</style>
<style lang="less">
.logTable {
    .log_header {
        background-color: #f2f2f2 !important;
        height: 32px;
        font-weight: 500;
    }
    table tr td:first-child .cell,
    table tr th:first-child .cell {
        padding-left: 32px;
    }
}
.merchupdownshelfMgr_log {
    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #478aee !important;
    }
    .el-pagination.is-background .el-pager li:not(.disabled):hover {
        color: #478aee;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
        color: #fff;
    }
}
.usingBulletBox {
    &_tip {
        text-align: center;
        color: #333;
        font-size: 16px;
    }
    .el-dialog__title {
        color: #333;
    }
    .el-dialog {
        border-radius: 8px;
        position: absolute !important;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        margin: 0 !important;
        &__header {
            font-weight: 600;
            border-bottom: 1px solid #ebebeb;
        }
        &__title {
            font-size: 16px;
        }
        &__footer {
            padding-bottom: 48px;
            .el-button {
                width: 144px;
                height: 48px;
                color: #fff;
                transition: none;
                & + .el-button {
                    margin-left: 24px;
                }
            }
            .el-button--default {
                background-color: #c2c2c2;
                &:hover,
                &:focus {
                    background-color: #478aee;
                    opacity: 0.8;
                }
            }
            .el-button--primary {
                background-color: #478aee;
                &:hover,
                &:focus {
                    opacity: 0.8;
                }
            }
        }
    }
    .el-button {
        border-radius: 8px !important;
    }
}
.logLine {
    .el-table th,
    .el-table tr {
        color: #333;
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td {
        background-color: #f6f6f6;
    }
}
</style>
