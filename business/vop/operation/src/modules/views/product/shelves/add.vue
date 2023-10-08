<template>
    <div
        class="downshelfMgr product"
        v-if="!isShowModal"
    >
        <div class="downshelfMgr_center product_content">
            <div class="addruleDefineContext">
                <div class="addRuleDefineLine">
                    <div class="addRuleConditionTitle">
                        <i class="addRuleConditionTitle_img">*</i>
                        <span>规则名称</span>
                        <span>:</span>
                    </div>
                    <el-input
                        maxlength="64"
                        v-model="ForbidRule.ruleName"
                        placeholder="请输入规则名称"
                        class="ruleNameInput"
                        clearable
                    />
                </div>
            </div>
            <div class="addruleDefineContext">
                <div class="addRuleDefineLine">
                    <div class="addRuleConditionTitle">
                        <i class="addRuleConditionTitle_img">*</i>
                        <span>适用渠道</span>
                        <span>:</span>
                    </div>
                    <el-select
                        style="width: 402px"
                        :disabled="readOnly"
                        v-model.trim="channelSelect"
                        placeholder="请选择渠道全称"
                    >
                        <el-option
                            v-for="item in allChannels"
                            :key="item.value"
                            :label="item.label"
                            :value="item"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div v-if="!!channelSelect">
                <productRange
                    ref="productRange"
                    @getSelectedClassifyList="getSelectedClassifyList"
                    @getSelectedSKUList="getSelectedSKUList"
                    @getSelectedSPList="getSelectedSPList"
                    @getRangeType="getRangeType"
                    :channelId="channelSelect"
                    :rangeTypeList="rangeTypeList"
                    :parRangeType="rangeType"
                    :selectedClassifyList="selectedClassifyList"
                    :selectedSKUList="selectedSKUList"
                    :readOnly="readOnly"
                    :parActiveNames="activeNames"
                    :supplierLsit="supplierLsit"
                    :supplierSelects="supplierSelects"
                    :notEnableObj="notEnableObj"
                ></productRange>
            </div>
            <div class="addruleDefineTextArea">
                <div class="addRuleDefineLine">
                    <div class="addRuleConditionTitle">
                        备注:
                    </div>
                    <el-input
                        maxlength="200"
                        show-word-limit
                        v-model="ForbidRule.remark"
                        resize="none"
                        :autosize="{ minRows: 2, maxRows: 6 }"
                        placeholder="请输入备注"
                        type="textarea"
                        class="ruleNameTextarea"
                    />
                </div>
            </div>
        </div>
        <div class="btnLine">
            <el-button
                type="primary"
                size="medium"
                class="confirmBtn"
                :loading="btnLoading"
                @click="confirmAddRule"
            >保存</el-button>
            <el-button
                plain
                class="cancelBtn"
                size="medium"
                @click="cannelAddRule"
            >
                取消
            </el-button>
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
            pageUrlBack: [], //页面返回地址
            pageTitle: "", //页面标题
            channelSelect: null, //选中的渠道
            ForbidRule: {
                ruleName: "", //下架规则名称
                channelName: "",
                channelId: "",
                remark: "" //下架规则备注
            }, //下架规则
            selectedSPList: [],
            selectedSKUList: [], //已选中的SKU信息列表
            selectedSKUListResult: [], //已选中的最终的SKU信息列表
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
            selectedClassifyList: [], //初始化选中的分类信息
            selectedClassifyListResult: [], //最终选中的分类信息
            readOnly: false, //判断是编辑还是详情页面
            ruleId: "", //下架规则Id
            activeNames: ["1"],
            currentRangeType: 0, //当前产品范围分类
            isShowModal: false, //判断是否显示弹出框
            btnLoading: false, //btn加载状态
            allChannels: [], //渠道的列表
            supplierLsit: [], //供应商的列表
            supplierSelects: [], //供应商的结果集
            notEnableObj: null //商品范围不能选择的集合
        };
    },
    beforeCreate() {},
    created() {
        //判断是新增还是编辑页面
        this.ruleViewType = utils.getStorage("ruleViewType");
        if (this.ruleViewType == "ruleAdd") {
            this.pageUrlBack = [
                {
                    dec: "下架管理",
                    url: "/product/shelves"
                },
                {
                    dec: "新建下架规则"
                }
            ];
            this.pageTitle = "新建下架规则";
            this.hasAddOffShelfAuth();
        } else {
            this.pageUrlBack = [
                {
                    dec: "下架管理",
                    url: "/product/shelves"
                },
                {
                    dec: "编辑规则"
                }
            ];
            this.pageTitle = "编辑规则";
            this.hasEditOffShelfAuth();
        }
        if (!this.isShowModal) {
            this.initData();
        }
    },
    mounted: function () {},
    methods: {
        //判断是否有添加下架规则权限
        hasAddOffShelfAuth() {
            this.isShowModal = !utils.hasAuth("hasAddOffShelfAuth");
        },
        //判断是否有编辑下架规则权限
        hasEditOffShelfAuth() {
            this.isShowModal = !utils.hasAuth("hasSeeOffShelfAuth");
        },
        //页面初始化
        initData: function () {
            let _this = this;
            if (_this.ruleViewType == "ruleAdd") {
                _this.listChannelInfos();
                _this.getSPList();
            } else {
                _this.getSPList();
                _this.ruleId = utils.getStorage("ruleId");
                _this.getRuleById();
            }
        },
        //查询规则列表,这里逻辑要上根据选择的渠道来操作。
        getRuleList: function () {
            let _this = this;
            var json = {
                pageSize: 1000,
                pageIndex: 1
            };

            //我们需要的是选中的并且已启用的渠道
            _this.$iLoading.show();
            producthandler
                .listOffShelfRule(json)
                .then(function (result) {
                    _this.$iLoading.hide();
                    if (!!result && result.resultCode == 0) {
                        let listPriceRuleVos = result.result.listPriceRuleVos;
                        for (let i = 0; i < listPriceRuleVos.length; i++) {
                            //不是当前选择的渠道，不是所有渠道，删除掉
                            if (
                                listPriceRuleVos[i].channelId !=
                                    _this.channelSelect.value &&
                                listPriceRuleVos[i].channelId != 9999
                            ) {
                                listPriceRuleVos.splice(i, 1);
                                i--;
                            }
                        }
                        let cateNotEnable = [];
                        let skuNotEnable = [];
                        let spNotEnable = [];
                        //编辑的时候，删除自己规则的数据
                        if (_this.ruleViewType != "ruleAdd") {
                            let findIndex = listPriceRuleVos.findIndex(
                                (item) => {
                                    return item.ruleId == _this.ruleId;
                                }
                            );
                            findIndex != -1 &&
                                listPriceRuleVos.splice(findIndex, 1);
                        }
                        //遍历数据
                        listPriceRuleVos.forEach((item) => {
                            if (item.scopeLevel == 0) {
                                item.scopes.forEach((scope) => {
                                    spNotEnable.push(scope.scopeValue);
                                });
                            } else if (item.scopeLevel == 1) {
                                item.scopes.forEach((scope) => {
                                    cateNotEnable.push(scope.scopeValue);
                                });
                            } else if (item.scopeLevel == 2) {
                                item.scopes.forEach((scope) => {
                                    skuNotEnable.push(scope.scopeValue);
                                });
                            }
                        });
                        _this.notEnableObj = {
                            categoryList: utils.uniqArray(
                                cateNotEnable,
                                (a, b) => {
                                    return a == b;
                                }
                            ),
                            skuList: utils.uniqArray(skuNotEnable, (a, b) => {
                                return a == b;
                            }),
                            spList: utils.uniqArray(spNotEnable, (a, b) => {
                                return a == b;
                            })
                        };
                    }
                })
                .catch(() => {
                    _this.$iLoading.hide();
                });
        },
        //查询规则详情
        getRuleById: function () {
            let _this = this;
            var json = {
                ruleId: _this.ruleId
            };
            _this.$iLoading.show();
            producthandler
                .getOffShelfRule(json)
                .then(function (result) {
                    _this.$iLoading.hide();
                    if (!!result && result.resultCode == 0) {
                        _this.ForbidRule.ruleName = result.result.ruleName;
                        _this.ForbidRule.channelName =
                            result.result.channelName;
                        _this.ForbidRule.channelId = result.result.channelId;
                        _this.ForbidRule.remark = result.result.remark;

                        _this.listChannelInfos();

                        let forbidRule = result.result;
                        let ruleScops = forbidRule.scopes;
                        if (forbidRule.scopeLevel == 1) {
                            //分类= scopeLevel  = 1
                            _this.rangeType = 1;
                            if (ruleScops.length > 0) {
                                producthandler
                                    .getCategories({ categoryId: 0 })
                                    .then(function (results) {
                                        if (results.resultCode == 0) {
                                            //获取分类树
                                            _this.selectedClassifyList =
                                                utils.treeToScops(
                                                    ruleScops,
                                                    results.result
                                                        .productCategoryList
                                                );
                                        }
                                    });
                            }
                        } else if (forbidRule.scopeLevel == 2) {
                            //sku= scopeLevel  =2
                            _this.rangeType = 2;
                            let tempList = [];
                            ruleScops.forEach((scopItem) => {
                                tempList.push(scopItem.scopeValue);
                            });
                            _this.selectedSKUList = tempList;
                        } else if (forbidRule.scopeLevel == 0) {
                            //供应商= scopeLevel  =0
                            _this.rangeType = 3;
                            _this.getSPList(ruleScops);
                        }
                    }
                })
                .catch(() => {
                    _this.$iLoading.hide();
                });
        },
        //获取已选择的分类信息
        getSelectedClassifyList: function (json) {
            this.currentRangeType = json.rangeType;
            if (
                json.categoryTreeData &&
                json.categoryTreeData.length &&
                json.selectedClassifyList &&
                json.selectedClassifyList.length
            ) {
                this.selectedClassifyListResult = utils.treeResult2Scops(json);
            }
        },
        //获取已选中的SKU信息
        getSelectedSKUList: function (json) {
            let _this = this;
            _this.selectedSKUListResult = [];
            _this.currentRangeType = json.rangeType;
            let tempSelectedSKUListResult = json.selectedSKUList;
            if (
                !!tempSelectedSKUListResult &&
                tempSelectedSKUListResult.length > 0
            ) {
                tempSelectedSKUListResult.forEach(function (item) {
                    _this.selectedSKUListResult.push(item.sku);
                });
            }
        },
        //获取已选中的SP信息
        getSelectedSPList: function (json) {
            let _this = this;
            _this.currentRangeType = json.rangeType;
            _this.selectedSPList = json.selectedSPList;
            // console.log(8980, _this.selectedSPList);
        },
        //获取当前产品范围分类信息
        getRangeType: function (json) {
            //0-供应商，1-商品分类，2-商品编号
            this.currentRangeType = json.rangeType;
        },
        //查询Sp列表
        getSPList: function (ruleScops) {
            let _this = this;
            var json = {
                pageSize: 1000,
                pageNum: 1,
                searchKey: ""
            };
            producthandler.listSupplier(json).then(function (result) {
                if (!!result && result.resultCode == 0) {
                    let tempList = result.result.supplierDetailResults;
                    _this.supplierLsit=[];
                    tempList.forEach(item=>{
                        if (item.supplierState == "1"){ //只展示开启的供应商
                            _this.supplierLsit.push(item);
                        } 
                    });

                    if (!!ruleScops) {
                        let resultArr = [];
                        ruleScops.forEach((scopItem) => {
                            resultArr.push(scopItem.scopeValue);
                        });
                        _this.supplierSelects = resultArr;
                    }
                }
            });
        },
        //查询渠道
        listChannelInfos: function () {
            let _this = this;
            var json = {
                pageSize: 100,
                pageNum: 1,
                showLoading: false
            };
            _this.$iLoading.show();
            producthandler
                .listChannel(json)
                .then(function (result) {
                    _this.$iLoading.hide();
                    if (!!result && result.resultCode == 0) {
                        let tempChannelList = result.result.channelVoList;
                        _this.allChannels.splice(0, _this.allChannels.length);
                        _this.allChannels.push({
                            value: 9999,
                            label: "所有渠道"
                        });
                        //初始化下拉框列表
                        tempChannelList.forEach((element) => {
                            _this.allChannels.push({
                                value: element.channelId,
                                label: element.shortName
                            });
                        });
                        //编辑页面赋值选中渠道
                        if (_this.ruleViewType == "ruleEdit") {
                            _this.channelSelect = _this.allChannels.find(
                                (item) => {
                                    return (
                                        item.value + "" ==
                                        _this.ForbidRule.channelId + ""
                                    );
                                }
                            );
                        }
                    }
                })
                .catch(() => {
                    _this.$iLoading.hide();
                });
        },
        //新增下架规则
        confirmAddRule: function () {
            let _this = this;
            if (!_this.ForbidRule.ruleName.trim().length) {
                utils.showToast("规则名称不能为空，请输入规则名称！");
                return;
            }
            if (!_this.channelSelect) {
                utils.showToast("适用渠道不能为空，请选择适用渠道！");
                return;
            }
            if (
                _this.currentRangeType == 1 &&
                !_this.selectedClassifyListResult.length
            ) {
                utils.showToast("产品范围分类信息不能为空，请选择分类！");
                return;
            }
            if (
                _this.currentRangeType == 2 &&
                !_this.selectedSKUListResult.length
            ) {
                utils.showToast("产品范围SKU信息不能为空，请选择SKU！");
                return;
            }
            if (_this.currentRangeType == 3 && !_this.selectedSPList.length) {
                utils.showToast("产品范围供应商信息不能为空，请选择供应商！");
                return;
            }

            _this.ForbidRule.channelId = _this.channelSelect.value;
            _this.ForbidRule.channelName = _this.channelSelect.label;

            let tempScops = [];
            if (_this.currentRangeType == 1) {
                _this.selectedClassifyListResult.forEach((item) => {
                    tempScops.push(item);
                });
            } else if (_this.currentRangeType == 2) {
                _this.selectedSKUListResult.forEach((item) => {
                    tempScops.push({
                        scopeValue: item,
                        scopeValueDescription: item
                    });
                });
            } else if (_this.currentRangeType == 3) {
                _this.selectedSPList.forEach((item) => {
                    let find = _this.supplierLsit.find((ele) => {
                        return ele.supplierType == item;
                    });
                    find &&
                        tempScops.push({
                            scopeValue: find.supplierType,
                            scopeValueDescription: find.supplierShortName
                        });
                });
            }
            var json = {
                ruleName: _this.ForbidRule.ruleName,
                state: 0, //默认状态未开启
                defaultRule: 0, //是否为渠道默认规则，0-不是，1-是,默认不是
                channelId: _this.ForbidRule.channelId,
                channelName: _this.ForbidRule.channelName,
                scopeLevel:
                    _this.currentRangeType == 1 || _this.currentRangeType == 2
                        ? _this.currentRangeType
                        : 0,
                scopes: tempScops,
                remark: _this.ForbidRule.remark,
                creator: producthandler.userInfo.mgrName,
                showLoading: false
            };
            if (_this.ruleViewType == "ruleEdit") {
                json["ruleId"] = _this.ruleId;
                _this.btnLoading = true;
                producthandler
                    .updateOffShelfRule(json)
                    .then(function (result) {
                        _this.btnLoading = false;
                        if (!!result && result.resultCode == 0) {
                            if (_this.ruleViewType == "ruleEdit") {
                                utils.showToast("编辑成功！");
                                _this.$router.push({
                                    path: "/product/shelves"
                                });
                            } else {
                                utils.showToast("添加成功！");
                                _this.$router.push({
                                    path: "/product/shelves"
                                });
                            }
                        } else if (result.resultCode == 88105001) {
                            let msg = JSON.parse(result.resultMessage);
                            utils.showToast(
                                "操作失败，商品范围(" +
                                    msg.scopeValueDescription +
                                    ")已在规则(" +
                                    msg.ruleName +
                                    ")被下架"
                            );
                        } else {
                            utils.showToast(result.resultMessage);
                        }
                    })
                    .catch(() => {
                        _this.btnLoading = false;
                    });
            } else {
                _this.btnLoading = true;
                producthandler
                    .addOffShelfRule(json)
                    .then(function (result) {
                        _this.btnLoading = false;
                        if (!!result && result.resultCode == 0) {
                            if (_this.ruleViewType == "ruleEdit") {
                                utils.showToast("编辑成功！");
                                _this.$router.push({
                                    path: "/product/shelves"
                                });
                            } else {
                                utils.showToast("添加成功！");
                                _this.$router.push({
                                    path: "/product/shelves"
                                });
                            }
                        } else if (result.resultCode == 88105001) {
                            let msg = JSON.parse(result.resultMessage);
                            utils.showToast(
                                "操作失败，商品范围(" +
                                    msg.scopeValueDescription +
                                    ")已在规则(" +
                                    msg.ruleName +
                                    ")被下架"
                            );
                        } else {
                            utils.showToast(result.resultMessage);
                        }
                    })
                    .catch(() => {
                        _this.btnLoading = false;
                    });
            }
        },
        //取消新增规则
        cannelAddRule: function () {
            let _this = this;
            if (_this.ruleViewType == "ruleEdit") {
                _this.$router.go(-1);
            } else {
                _this.$router.push({ path: "/product/shelves" });
            }
        }
    },
    filters: {},
    watch: {
        channelSelect: {
            handler: function () {
                this.getRuleList();
            },
            immediate: true
        }
    }
};
</script>
<style lang="less" scoped>
@import "./add.less";
</style>
<style lang="less">
.ruleNameTextarea {
    border: 1px solid #dcdfe6;
    .el-textarea__inner:focus {
        border-color: #478aee;
    }
    .el-input__count {
        background: none;
    }
    textarea {
        border: none !important;
        font-family: "Microsoft Yahei", "微软雅黑", "Hiragino Sans GB", "宋体",
            Tahoma, Arial, Helvetica, STHeiti, sans-serif !important;
        margin-bottom: 20px;
    }
}
</style>
