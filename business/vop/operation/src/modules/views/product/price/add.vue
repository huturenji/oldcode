<!--
 * @Author: chengMingRui
 * @Date: 2020-03-05 13:50:35
 * @LastEditTime: 2020-04-24 17:06:01
 * @Description: 定价管理新增主页面
 -->
<template>
    <div class="addPrice product">
        <div
            class="addPrice_back"
            v-if="!isShowModal"
        ></div>
        <div
            class="addPrice_content product_content"
            v-if="!isShowModal"
        >
            <div class="addruleDefineContext">
                <div class="addRuleDefineLine">
                    <div class="addRuleConditionTitle">
                        <i class="addRuleConditionTitle_img">*</i>
                        <span>规则名称</span>
                        <span>:</span>
                    </div>
                    <el-input
                        maxlength="64"
                        v-model="priceRuleName"
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
                            v-for="item in cleanChannels"
                            :key="item.value"
                            :label="item.label"
                            :value="item"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>
            <ruleModel
                :isShow="false"
                :PType="1"
                :priceType="priceType"
                :pTitle="'渠道价'"
                :pricePercentage="pricePercentage"
                :priceFloatingValue="priceFloatingValue"
                @updataPriceData="updataPriceData"
            />
            <div class="addPrice_content_sellerPrice">
                建议零售价=MAX（供应商建议零售价，渠道价）
            </div>
            <div
                class="addPrice_content_rule"
                v-if="!!channelSelect"
            >
                <productRange
                    ref="productRange"
                    @getSelectedClassifyList="getSelectedClassifyList"
                    @getSelectedSKUList="getSelectedSKUList"
                    @getProductRangeType="getProductRangeType"
                    :rangeTypeList="rangeTypeList"
                    :parRangeType="rangeType"
                    :selectedClassifyList="selectedClassifyList"
                    :selectedSKUList="selectedSKUList"
                    :readOnly="false"
                    :parActiveNames="['1']"
                    needCalPrice
                    :notEnableObj="notEnableObj"
                />
            </div>
            <otherNote
                @updataNoteInfo="updataNoteInfo"
                :remark="priceRemark"
            />
        </div>
        <div class="addPrice_content_footer">
            <el-button
                class="saveBtn footerBtn"
                type="primary"
                size="medium"
                :loading="isAddLoading"
                @click="saveInfo"
            >
                保存
            </el-button>
            <el-button
                class="footerBtn cancelBtn"
                plain
                size="medium"
                @click="gotoBack"
            >
                取消
            </el-button>
        </div>
        <noAuth :isShowModal="isShowModal" />
    </div>
</template>

<script>
import noAuth from "biscomponents/product/noAuth";
import producthandler from "bislibs/requestHandler/producthandler";
import utils from "bislibs/utils";
import { productBaseUrl } from "modules/config";

import productRange from "biscomponents/product/productRange/productRange";
import ruleModel from "biscomponents/product/ruleModel/ruleModel"; // 定价规则
import otherNote from "biscomponents/product/otherNote/otherNote"; // 其他备注

export default {
    components: {
        ruleModel,
        otherNote,
        productRange,
        noAuth
    },
    data: function () {
        return {
            pageUrlBack: [
                {
                    dec: "定价管理",
                    url: "/commodity"
                },
                {
                    dec: "新增定价规则"
                }
            ],
            pageTitle: "",
            rangeTypeList: [
                {
                    rangeTypeName: "分类",
                    type: 1
                },
                {
                    rangeTypeName: "SKU",
                    type: 2
                }
            ],
            rangeType: 0,
            selectedClassifyList: [], // 选中的分类id列表二维数组
            selectedSKUList: [], // 选中的skuid列表
            priceDetailInfo: {}, // 规则详情
            selectedSupplier: {}, // 选中的供应商
            pricingRuleId: null, //规则id
            priceRuleName: "", // 规则名称
            priceType: 1, //销售价格类型 0为销售价 1为结算价
            pricePercentage: 100, // 类型价格比例
            priceFloatingValue: 0, // 价格浮动
            maxPriceType: 0, // 最高限价价格类型
            maxPricePercentage: 100, // 最高限价类型价格比例
            maxPriceFloatingValue: 0, // 最高限价价格浮动
            minPriceType: 0, // 最低限价价格类型
            minPricePercentage: 100, // 最低限价类型价格比例
            minPriceFloatingValue: 0, // 最低限价价格浮动
            priceRemark: "", // 特别备注
            productBaseUrl: productBaseUrl, // 商品基础路径
            isPreview: false, // 预览弹框是否展示
            productList: [], // 产品预览列表
            profit: "0%", // 分类下的总毛利率利
            isLoading: false, // 是否加载loading
            tableKeyObject: {
                imageUrl: "imageUrl",
                skuId: "sku",
                profit: "profit",
                providerUnitPrice: "providerUnitPrice",
                providerSettleUnitPrice: "providerSettleUnitPrice",
                unitPrice: "unitPrice",
                desc: "name"
            },
            titleList: [],
            selectedSkuInfoList: [], //sku信息列表
            productSKUInfoList: [], // sku查询的商品列表
            selectCategoryList: [], // 选中的分类范围
            isShowModal: false,
            isAddLoading: false, //添加按钮是否展示loading
            channelSelect: null,
            cleanChannels: [], //渠道的列表
            notEnableObj: null //商品范围不能选择的集合
        };
    },
    created() {
        this.setHeaderTitle();
        // console.log(this.$route.params.isEdit)
    },
    methods: {
        hasAddPriceRuleAuth() {
            this.isShowModal = !utils.hasAuth("hasAddPriceRuleAuth");
        },
        hasEditPriceRuleAuth() {
            this.isShowModal = !utils.hasAuth("hasEditPriceRuleAuth");
        },
        // 初始化设置头部面包屑
        setHeaderTitle() {
            let isEdit = true;
            if (
                this.$route.params.isEdit == false ||
                this.$route.params.isEdit == "false"
            ) {
                isEdit = false;
                this.hasAddPriceRuleAuth();
            } else {
                this.hasEditPriceRuleAuth();
            }
            // console.log(isEdit);
            this.pageTitle = isEdit ? "编辑定价规则 " : "新增定价规则";
            this.pageUrlBack[1].dec = isEdit ? "编辑定价规则 " : "新增定价规则";
            this.pricingRuleId = isEdit
                ? this.$route.query.pricingRuleId
                : null;

            //初始化页面数据
            if (!this.isShowModal) {
                if (isEdit) {
                    this.getPriceRuleInfo();
                } else {
                    this.listChannelInfos();
                }
            }
        },
        // 根据规则id查询详情回显
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
                        _this.priceDetailInfo = res.result;
                        _this.setValueByData(); // 将值赋给页面数据
                        _this.listChannelInfos();
                    } else {
                        _this.$iLoading.hide();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    _this.$iLoading.hide();
                });
        },

        // 取消返回
        gotoBack() {
            this.$router.go(-1);
        },
        // 查询详情的时候，将值初始化
        setValueByData() {
            let _this = this;
            // 销售价格
            _this.priceType = Number(_this.priceDetailInfo.priceType);
            _this.pricePercentage =
                Number(_this.priceDetailInfo.settlePricePercentage) || 100;
            _this.priceFloatingValue =
                Number(_this.priceDetailInfo.settlePriceFloatingValue) || 0;
            // 规则名称
            _this.priceRuleName = _this.priceDetailInfo.ruleName;
            // 规则描述-->备注
            _this.priceRemark = _this.priceDetailInfo.remark;
            //sku和分类组件数据初始化
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
                                _this.selectedClassifyList = utils.treeToScops(
                                    ruleScops,
                                    result.result.productCategoryList
                                );
                            }
                        });
                }
            } else if (_this.priceDetailInfo.scopeLevel == 2) {
                //sku= scopeLevel  =2
                _this.rangeType = 2;
                let tempList = [];
                ruleScops.forEach((scopItem) => {
                    tempList.push(scopItem.scopeValue);
                });
                _this.selectedSKUList = tempList;
            }
        },
        updataNoteInfo(newData) {
            this.priceRemark = newData;
        },
        // 保存规则
        saveInfo() {
            let _this = this;
            if (!this.priceRuleName.trim().length) {
                utils.showToast("请输入规则名称");
                return;
            }
            if (!_this.channelSelect) {
                utils.showToast("适用渠道不能为空，请选择适用渠道！");
                return;
            }
            if (_this.rangeType == 1 && !_this.selectCategoryList.length) {
                utils.showToast("产品范围分类信息不能为空，请选择分类！");
                return;
            }
            if (_this.rangeType == 2 && !_this.selectedSkuInfoList.length) {
                utils.showToast("产品范围SKU信息不能为空，请选择SKU！");
                return;
            }

            let tempScops = [];
            if (_this.rangeType == 1) {
                _this.selectCategoryList.forEach((item) => {
                    tempScops.push(item);
                });
            } else if (_this.rangeType == 2) {
                _this.selectedSkuInfoList.forEach((item) => {
                    tempScops.push({
                        scopeValue: item.sku,
                        scopeValueDescription: item.sku
                    });
                });
            }
            let requestData = {
                ruleName: _this.priceRuleName,
                state: 0, //默认状态未开启
                defaultRule: 0, //是否为渠道默认规则，0-不是，1-是,默认不是
                channelId: this.channelSelect.value,
                channelName: this.channelSelect.label,
                scopeLevel:
                    _this.rangeType == 1 || _this.rangeType == 2
                        ? _this.rangeType
                        : 0,
                scopes: tempScops,
                priceType: 1, // 0-供应商销售价，1-供应商结算价
                settlePricePercentage: this.pricePercentage, // 定销售价格百分比比例
                settlePriceFloatingValue: this.priceFloatingValue, // 定销售价格浮动
                remark: this.priceRemark, // 备注
                creator: producthandler.userInfo.mgrName,
                showLoading: false
            };
            this.isAddLoading = true;
            if (_this.$route.params.isEdit) {
                requestData.ruleId = this.pricingRuleId;
                this.updateAddRule(requestData);
            } else {
                this.saveAddRule(requestData);
            }
        },
        // 保存新增
        updateAddRule(requestData) {
            producthandler
                .updatePriceRule(requestData)
                .then((res) => {
                    if (res.resultCode == 0) {
                        this.$router.push("/product/price");
                    } else if (res.resultCode == 88105001) {
                        let msg = JSON.parse(res.resultMessage);
                        utils.showToast(
                            "操作失败，商品范围(" +
                                msg.scopeValueDescription +
                                ")已在规则(" +
                                msg.ruleName +
                                ")被定价"
                        );
                    } else {
                        utils.showToast(res.resultMessage);
                    }
                    this.isAddLoading = false;
                })
                .catch((err) => {
                    utils.showToast(err);
                    this.isAddLoading = false;
                });
        },
        // 保存新增
        saveAddRule(requestData) {
            producthandler
                .addPriceRule(requestData)
                .then((res) => {
                    if (res.resultCode == 0) {
                        this.$router.push("/product/price");
                    } else if (res.resultCode == 88105001) {
                        let msg = JSON.parse(res.resultMessage);
                        utils.showToast(
                            "操作失败，商品范围(" +
                                msg.scopeValueDescription +
                                ")已在规则(" +
                                msg.ruleName +
                                ")被定价"
                        );
                    } else {
                        utils.showToast(res.resultMessage);
                    }
                    this.isAddLoading = false;
                })
                .catch((err) => {
                    utils.showToast(err);
                    this.isAddLoading = false;
                });
        },
        // 更新销售价格数据
        updataPriceData({
            // priceRuleName,
            // priceType,
            pricePercentage,
            priceFloatingValue
        }) {
            // console.log(
            //     "updataPriceData",
            //     priceRuleName,
            //     priceType,
            //     pricePercentage,
            //     priceFloatingValue
            // );
            // this.priceRuleName = priceRuleName; // 规则名称
            // this.priceType = priceType; //销售价格类型 0为销售价 1为结算价
            this.pricePercentage = pricePercentage || 100; // 类型价格比例
            this.priceFloatingValue = priceFloatingValue || 0; // 价格浮动
        },
        getSelectedSKUList(json) {
            this.productSKUInfoList = json.selectedSKUList;
            this.selectedSkuInfoList = json.selectedSKUList.length
                ? json.selectedSKUList.map((item) => {
                    return {
                        categoryId1: item.categoryId1,
                        categoryId2: item.categoryId2,
                        categoryId3: item.categoryId3,
                        sku: item.sku
                    };
                })
                : [];
            this.rangeType = json.rangeType;
        },
        getSelectedClassifyList(json) {
            this.rangeType = json.rangeType;
            if (
                json.categoryTreeData &&
                json.categoryTreeData.length &&
                json.selectedClassifyList &&
                json.selectedClassifyList.length
            ) {
                this.selectCategoryList = utils.treeResult2Scops(json);
            }
        },
        getProductRangeType(value) {
            this.rangeType = value;
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
                        _this.cleanChannels.splice(
                            0,
                            _this.cleanChannels.length
                        );
                        _this.cleanChannels.push({
                            value: 9999,
                            label: "所有渠道"
                        });
                        //初始化下拉框列表
                        tempChannelList.forEach((element) => {
                            _this.cleanChannels.push({
                                value: element.channelId,
                                label: element.shortName
                            });
                        });

                        //编辑页面赋值选中渠道
                        if (_this.$route.params.isEdit) {
                            _this.channelSelect = _this.cleanChannels.find(
                                (item) => {
                                    return (
                                        item.value + "" ==
                                        _this.priceDetailInfo.channelId + ""
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
        // 获取定价管理列表
        getRuleList() {
            let _this = this;
            var json = {
                pageSize: 1000,
                pageIndex: 1
            };

            this.$iLoading.show();
            producthandler
                .listPriceRule(json)
                .then((result) => {
                    this.$iLoading.hide();
                    if (result.resultCode === 0) {
                        let listPriceRuleVos = result.result.listPriceRuleVos;
                        for (let i = 0; i < listPriceRuleVos.length; i++) {
                            //不是当前选择的渠道，不是所有渠道，删除掉
                            if (!!_this.channelSelect &&
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
                        if (_this.$route.params.isEdit) {
                            let findIndex = listPriceRuleVos.findIndex(
                                (item) => {
                                    return item.ruleId == _this.pricingRuleId;
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
                    } else {
                        console.log(result);
                    }
                })
                .catch((err) => {
                    this.$iLoading.hide();
                    console.log(err);
                });
        }
    },
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

<style lang="less">
@import "./add.less";
</style>