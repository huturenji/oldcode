<template>
    <div class="priceRuleDetail product">
        <div
            class="priceRuleDetail_buttom"
            v-if="Object.keys(priceDetailInfo).length"
        >
            <div
                class="priceRuleDetail_buttom_change"
                v-if="!priceDetailInfo.defaultRule"
            >
                <el-button
                    v-if="!isStart && hasStopUsingPriceRuleAuth()"
                    type="primary"
                    plain
                    size="medium"
                    @click="showDialog"
                >启用</el-button>
                <el-button
                    v-else-if="hasStopUsingPriceRuleAuth()"
                    type="danger"
                    plain
                    size="medium"
                    @click="showDialog"
                >停用</el-button>
            </div>
            <el-button
                v-if="!priceDetailInfo.defaultRule && hasEditPriceRuleAuth()"
                type="primary"
                size="medium"
                class="priceRuleDetail_buttom_edit"
                @click="gotoEdit"
            >编辑</el-button>
        </div>
        <div
            class="priceRuleDetail_content product_content"
            v-if="!isShowModal"
        >
            <div class="priceRuleDetail_rule_list">
                <li class="priceRuleDetail_rule_item">
                    <span class="priceRuleDetail_rule_item_label">状态：</span>
                    <strong :class="isStart ? 'startStatus' : 'stopStatus'">{{
                        setRuleState
                    }}</strong>
                </li>
                <li class="priceRuleDetail_rule_item">
                    <span class="priceRuleDetail_rule_item_label">规则名称：</span>
                    <p class="priceRuleDetail_rule_item_dec">
                        {{ priceDetailInfo.ruleName }}
                    </p>
                </li>
                <li class="priceRuleDetail_rule_item">
                    <span class="priceRuleDetail_rule_item_label">适用渠道：</span>
                    <p class="priceRuleDetail_rule_item_dec">
                        {{ priceDetailInfo.channelName }}
                    </p>
                </li>
                <li class="priceRuleDetail_rule_item">
                    <span class="priceRuleDetail_rule_item_label">渠道价=</span>
                    <p>
                        {{
                            setRuleBytype({
                                type: priceDetailInfo.priceType,
                                percentage:
                                    priceDetailInfo.settlePricePercentage,
                                floatingValue:
                                    priceDetailInfo.settlePriceFloatingValue,
                            })
                        }}
                    </p>
                </li>
                <li class="priceRuleDetail_rule_item">
                    <p>建议零售价=MAX（供应商建议零售价，渠道价）</p>
                </li>
            </div>
            <div class="priceRuleDetail_info">
                <productRange
                    ref="productRange"
                    :rangeTypeList="rangeTypeList"
                    :ParangeType="rangeType"
                    :selectedSKUList="productSKUInfoList"
                    :readOnly="readOnly"
                    :parActiveNames="activeNames"
                    :selectedClassifyTreeList="productSortInfoList"
                    needCalPrice
                />
            </div>
            <p class="priceRuleDetail_remark">
                <em>备注： </em>
                <i>{{ priceDetailInfo.remark }}</i>
            </p>
        </div>
        <div class="product_content priceRuleDetail_note">
            <h4 class="priceRuleDetail_note_title">
                操作日志
            </h4>
            <el-table
                class="priceRuleDetail_note_table"
                :data="priceRuleOperations"
                :stripe="true"
                max-height="500"
                style="width: 100%"
            >
                <el-table-column
                    label="时间"
                    :formatter="setOperationTime"
                >
                </el-table-column>
                <el-table-column
                    prop="creator"
                    label="操作人"
                >
                </el-table-column>
                <el-table-column
                    prop="content"
                    label="内容"
                >
                </el-table-column>
            </el-table>
            <div
                class="priceRuleDetail_note_pagination"
                v-if="operationsRulePaging.totalNum"
            >
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="operationsRulePaging.currentPage"
                    :page-sizes="[5, 10, 20, 50, 100]"
                    :pager-count="5"
                    :page-count="operationsRulePaging.pageCount"
                    :page-size="operationsRulePaging.pageSize"
                    layout="total,prev, pager, next,jumper,sizes"
                    :total="operationsRulePaging.totalNum"
                ></el-pagination>
            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="centerDialogVisible"
            width="30%"
            custom-class="adduserdialog"
            :modal-append-to-body="false"
            center
        >
            <p class="tipContent">
                {{ dialogTitle }}
            </p>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="cancelChangeRule">取 消</el-button>
                <el-button
                    type="primary"
                    :loading="isChangeLoading"
                    @click="fixChangeRule"
                >确 定</el-button>
            </span>
        </el-dialog>
        <noAuth :isShowModal="isShowModal" />
        <Dropdown
            transfer
            ref="contentMenu"
            style="display: none"
            trigger="click"
            placement="right-start"
        >
            <DropdownMenu
                slot="list"
                ref="copyItems"
                style="min-width: 80px"
            >
                <DropdownItem><a @click="copyContent(1)">复制链接</a></DropdownItem>
                <DropdownItem><a @click="copyContent(2)">复制标题</a></DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
import noAuth from "biscomponents/product/noAuth";
import productRange from "biscomponents/product/productRange/productRange.vue";
import producthandler from "bislibs/requestHandler/producthandler";
import utils from "bislibs/utils";
// import previewModel from "biscomponents/product/previewModel/previewModel";

export default {
    components: {
        // previewModel,
        noAuth,
        productRange
    },
    data: function () {
        return {
            pageUrlBack: [
                {
                    dec: "定价管理",
                    url: "/commodity"
                },
                {
                    dec: "定价规则详情"
                }
            ],
            pageTitle: "定价规则详情",
            centerDialogVisible: false,
            isStart: null,
            startTitle: "确定要启用该规则",
            stopTitle: "确定要停用该规则",
            dialogTitle: null,
            pricingRuleId: null, // 规则Id,
            priceDetailInfo: {}, // 规则详情
            priceRuleOperations: [], // 操作日志
            operationsRulePaging: {
                currentPage: 1,
                pageCount: 0,
                pageSize: 10,
                totalNum: 0
            }, //操作日志分页

            productSKUInfoList: [], // sku商品列表
            productSortInfoList: [], // 商品分类列表
            rangeType: 0, // 选择的范围
            readOnly: true, //判断是否是详情页面
            activeNames: ["1"],
            rangeTypeList: [
                {
                    rangeTypeName: "分类",
                    type: 1
                },
                {
                    rangeTypeName: "SKU",
                    type: 2
                }
            ], //商品范围类别信息

            isShowModal: false,
            isChangeLoading: false,
            rightPopItem: null,

            pricePercentage: 100, // 类型价格比例
            priceFloatingValue: 0 // 价格浮动            
        };
    },
    created() {
        this.hasSeePriceRuleAuth();
        this.dialogTitle = this.startTitle;
        this.pricingRuleId = this.$route.query.ruleId;
        utils.hasAuth("hasStopUsingPriceRuleAuth") && this.getListRuleLogs();
        utils.hasAuth("hasStopUsingPriceRuleAuth") && this.getPriceRuleInfo();
    },
    methods: {
        hasEditPriceRuleAuth() {
            return utils.hasAuth("hasEditPriceRuleAuth");
        },
        hasStopUsingPriceRuleAuth() {
            return utils.hasAuth("hasStopUsingPriceRuleAuth");
        },
        hasSeePriceRuleAuth() {
            this.isShowModal = !utils.hasAuth("hasStopUsingPriceRuleAuth");
        },
        // 打开提示框
        showDialog() {
            this.centerDialogVisible = true;
            this.dialogTitle = this.isStart ? this.stopTitle : this.startTitle;
        },
        // 取消改变规则停起用
        cancelChangeRule() {
            this.centerDialogVisible = false;
        },
        // 确定改变规则停起用
        fixChangeRule() {
            this.changeRuleState();
        },
        // 去编辑定价页面
        gotoEdit() {
            this.$router.push({
                name: "priceEdit",
                path: "/product/price/edit",
                params: {
                    isEdit: true
                },
                query: {
                    pricingRuleId: this.pricingRuleId
                }
            });
        },
        // 获取用户操作日志信息
        getListRuleLogs(pageIndex) {
            let _this = this;
            let pageSize = Number(localStorage.getItem("priceBoard")) || 10;

            let requestData = {
                ruleId: this.pricingRuleId,
                pageIndex: pageIndex || 1,
                pageSize: pageSize,
                showLoading: false
            };
            producthandler
                .listRuleLogs(requestData)
                .then((res) => {
                    if (res.resultCode == 0) {
                        _this.priceRuleOperations = res.result.listPriceRuleVos;
                        // 设置分页
                        this.operationsRulePaging.currentPage = pageIndex || 1;
                        this.operationsRulePaging.pageCount =
                            res.result.totalPages;
                        this.operationsRulePaging.pageSize = pageSize;
                        this.operationsRulePaging.totalNum = res.result.total;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        // 获取规则详情
        getPriceRuleInfo() {
            let _this = this;

            let requestData = {
                ruleId: this.pricingRuleId,
                showLoading: false
            };
            _this.$iLoading.show();
            producthandler
                .getPriceRule(requestData)
                .then((res) => {
                    if (res.resultCode == 0) {
                        _this.priceDetailInfo = res.result || {};
                        _this.isStart =
                            this.priceDetailInfo.state == 1 ? true : false;
                        //用于计算最新的sku价格
                        _this.pricePercentage = _this.priceDetailInfo.settlePricePercentage;
                        _this.priceFloatingValue = _this.priceDetailInfo.settlePriceFloatingValue;

                        let ruleScops = _this.priceDetailInfo.scopes;
                        if (_this.priceDetailInfo.scopeLevel == 1) {
                            //分类= scopeLevel  = 1
                            _this.rangeType = 1;
                            if (ruleScops.length > 0) {
                                producthandler
                                    .getCategories({ categoryId: 0 })
                                    .then(function (result) {
                                        if (result.resultCode == 0) {
                                            //获取分类树
                                            _this.productSortInfoList =
                                                utils.scopsToTree(
                                                    ruleScops,
                                                    result.result
                                                        .productCategoryList
                                                );
                                        }
                                    });
                            }
                        } else if (_this.priceDetailInfo.scopeLevel === 2) {
                            //sku= scopeLevel  =2
                            _this.rangeType = 2;
                            let tempList = [];
                            ruleScops.forEach((scopItem) => {
                                tempList.push(scopItem.scopeValue);
                            });
                            _this.productSKUInfoList = tempList;
                        }
                    }
                    this.$iLoading.hide();
                })
                .catch((err) => {
                    console.log(err);
                    _this.$iLoading.hide();
                });
        },
        // 设置操作时间格式
        setOperationTime({ updateTime }) {
            return utils.dateFormater("YYYY-MM-DD HH:mm:ss", updateTime);
        },
        //设置定价规则
        setRuleBytype({ type = 0, percentage = 100, floatingValue = 0 }) {
            let typeTemp = new Map([
                [0, "供应商销售价"],
                [1, "供应商结算价"]
            ]);
            let str =
                floatingValue >= 0
                    ? ` ${typeTemp.get(
                        Number(type)
                    )} × ${percentage}% + ${floatingValue}`
                    : ` ${typeTemp.get(
                        Number(type)
                    )} × ${percentage}%${floatingValue}`;
            return str;
        },
        // 改变规则停启用
        changeRuleState() {
            let _this = this;

            this.isChangeLoading = true;
            let requestData = {
                ruleId: _this.pricingRuleId,
                ruleType: 0, //规则类型：0-价格，1-下架
                state: _this.isStart ? 0 : 1,
                creator: producthandler.userInfo.mgrName,
                showLoading: false
            };
            producthandler
                .enableRule(requestData)
                .then((res) => {
                    if (res.resultCode == 0) {
                        _this.isStart = !_this.isStart;
                        _this.getListRuleLogs();
                    }
                    this.isChangeLoading = false;
                    this.centerDialogVisible = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.isChangeLoading = false;
                    this.centerDialogVisible = false;
                });
        },
        handleSizeChange(size) {
            localStorage.setItem("priceBoard", size);
            this.getListRuleLogs();
        },
        handleCurrentChange(pageIndex) {
            this.getListRuleLogs(pageIndex);
        },
        copyProDetail(detail) {
            let urlPath =
                utils.getCopyHost() +
                "/mallvop/static/shop/index.html#/product/detail?";
            utils.copyToClipboard(
                urlPath +
                    "sku=" +
                    detail.sku +
                    "&supplierId=" +
                    detail.supplierId
            );
            utils.showToast("复制成功");
        },
        /**
         * 右键菜单复制
         **/
        copyContent(type) {
            if (type == 1) {
                //复制链接
                this.copyProDetail(this.rightPopItem);
            } else if (type == 2) {
                //复制标题
                utils.copyToClipboard(this.rightPopItem.name);
                utils.showToast("复制成功");
            } else {
                console.log("出错了");
            }
        }
    },
    watch: {},
    computed: {
        setRuleState() {
            return this.isStart ? "已启用" : "已停用";
        }
    }
};
</script>

<style lang="less">
@import "./detail.less";
</style>