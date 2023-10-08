
<template>
    <div class="fold productRange">
        <div
            v-if="readOnly"
            class="fold_item_range_title"
            :class="{
                titleUnExpanded: !isExpanded,
                'is-active': activeNames.length,
            }"
        >
            <strong class="strong">商品范围-</strong>
            <span v-if="options.length > 0">分类</span>
            <span v-if="options.length == 0 && tableData.length > 0">SKU</span>
            <span
                v-if="
                    options.length == 0 &&
                        tableData.length == 0 &&
                        supplierLsit4UI.length > 0
                "
            >供应商</span>
        </div>
        <div
            v-else
            class="fold_item_range_title"
            :class="{
                titleUnExpanded: !isExpanded,
                'is-active': activeNames.length,
            }"
        >
            <i class="mustbeimg">*</i>
            <strong class="fold_item_range_radio strong">商品范围</strong>
            <el-radio
                v-for="item in rangeTypeList"
                :key="item.type"
                v-model="rangeType"
                @change="changeSelected"
                :label="item.type"
            >{{ item.rangeTypeName }}</el-radio>
        </div>
        <el-collapse
            v-model="activeNames"
            class="fold_list"
        >
            <el-collapse-item
                name="1"
                class="fold_item fold_item_range unExpanded"
            >
                <div
                    class="fold_item_content"
                    v-if="
                        (rangeType == 1 && !readOnly) ||
                            (readOnly && options.length > 0)
                    "
                >
                    <div
                        class="product_range_item_left"
                        :class="{
                            product_range_item_isEmpty:
                                !isSupplierSelected || options.length == 0,
                        }"
                    >
                        <ul
                            class="product_range_selectAll"
                            v-if="!readOnly"
                        >
                            <li class="product_range_selectAll_itemOne"></li>
                            <li
                                class="product_range_selectAll_item"
                                v-if="showSelectedBox_1 && options.length > 0"
                            >
                                <el-checkbox
                                    :indeterminate="isIndeterminate_1"
                                    v-model="checked_1"
                                    @change="changeList1"
                                >全选</el-checkbox>
                            </li>
                            <li
                                class="product_range_selectAll_item"
                                v-if="showSelectedBox_2 && options.length > 0"
                            >
                                <el-checkbox
                                    :indeterminate="isIndeterminate_2"
                                    v-model="checked_2"
                                    @change="changeList2"
                                >全选</el-checkbox>
                            </li>
                        </ul>
                        <el-cascader-panel
                            v-if="!readOnly && options.length > 0"
                            :options="options"
                            class="selectedList"
                            :props="props_1"
                            v-model="selected"
                            ref="cascaderAddr"
                            @expand-change="changeCasFun_1"
                            @change="changeCasFun_1"
                        ></el-cascader-panel>
                        <div
                            v-if="options.length == 0 && !isLoading"
                            class="noClassify"
                        >
                            暂无数据
                        </div>
                        <el-cascader-panel
                            v-if="readOnly"
                            :options="options"
                            :props="props_2"
                            ref="cascaderAddr"
                            @expand-change="changeCasFun_1"
                        >
                        </el-cascader-panel>
                    </div>
                    <div
                        class="
                            fold_item_content_count_selected
                            fold_item_content_box
                        "
                    >
                        <div class="fold_item_content_box_top">
                            <span class="fold_item_content_box_selectedDec">已选择</span>
                            <strong class="fold_item_content_box_selecteNum">
                                {{ checkedOneSortList.length }}
                            </strong>
                            <span class="fold_item_content_box_selectedDec">项</span>
                        </div>
                        <div class="fold_item_content_box_bottom">
                            <ul class="fold_item_content_box_bottom_list">
                                <li
                                    class="fold_item_content_box_bottom_item"
                                    v-for="(item, index) in checkedOneSortList"
                                    :key="index"
                                    :class="{ checkedStyle: item.checked }"
                                    @click="showClassifyTree(item)"
                                >
                                    {{ item.categoryName }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div
                    class="fold_item_content"
                    :class="{
                        fold_item_content_view: readOnly,
                        fold_item_content_hieght: !readOnly,
                    }"
                    v-if="
                        (rangeType == 2 && !readOnly) ||
                            (readOnly &&
                                options.length == 0 &&
                                tableData.length > 0)
                    "
                >
                    <div
                        class="fold_item_content_box fold_item_content_box_sku"
                        v-if="!readOnly"
                    >
                        <!-- <p class="fold_item_content_box_title">SKU</p> -->
                        <div
                            class="fold_item_content_box_search"
                            v-clickoutside="channelHandleClose"
                        >
                            <el-input
                                placeholder="SKU编号/商品名称"
                                v-model="searchSKU"
                                @keyup.enter.native="searchProduct"
                                clearable
                            >
                                <el-button
                                    slot="append"
                                    type="primary"
                                    size="mini"
                                    icon="el-icon-search"
                                    @click="searchProduct()"
                                ></el-button>
                            </el-input>
                            <div
                                class="productListStyle"
                                v-if="
                                    showSKUSelect &&
                                        !!productList &&
                                        productList.length > 0
                                "
                            >
                                <div
                                    v-for="(item, index) in productList"
                                    :key="index"
                                    class="productSelectItem"
                                    :class="{
                                        productSelectItemNo: item.disabled,
                                    }"
                                    @click="productCheck(item)"
                                >
                                    <div class="SKUcontext">
                                        {{ item.skuName }}
                                    </div>
                                    <img
                                        class="productCheckedImg"
                                        v-if="item.checked"
                                        :src="
                                            require('assets/icon_choosed.png')
                                        "
                                    />
                                </div>
                            </div>
                            <div
                                v-if="
                                    showSKUSelect &&
                                        !!productList &&
                                        productList.length == 0
                                "
                                class="searchEmpty"
                            >
                                <img
                                    class="emptyResultImg"
                                    :src="require('assets/noSearchResult.png')"
                                />
                                <div class="emptyResult">
                                    搜索结果为空
                                </div>
                            </div>
                            <div
                                class="historyListStyle"
                                v-if="
                                    !showSKUSelect &&
                                        !searchSKU &&
                                        historySearchKeys.length > 0
                                "
                            >
                                <div class="historyTitle">
                                    历史记录
                                </div>
                                <div
                                    class="historyText"
                                    v-for="(
                                        searchKey, index
                                    ) in historySearchKeys"
                                    :key="index"
                                    @click="selectHistorySearchKey(searchKey)"
                                >
                                    {{ searchKey }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="fold_item_content_table">
                        <p
                            class="fold_item_content_box_title"
                            v-if="!readOnly"
                        >
                            <span class="fold_item_content_box_selectedDec">已选中</span>
                            <strong class="fold_item_content_box_selecteNum">
                                {{ tableData.length }}
                            </strong>
                            <span class="fold_item_content_box_selectedDec">项</span>
                        </p>
                        <el-table
                            v-if="!readOnly"
                            :data="tableData"
                            class="table"
                            :stripe="!readOnly"
                            header-row-class-name="commodityInfo_header"
                            height="276"
                            max-height="276"
                        >
                            <el-table-column
                                label="商品信息"
                                show-overflow-tooltip
                                min-width="200"
                            >
                                <template slot-scope="scope">
                                    <div class="commodityInfo_box">
                                        <img
                                            class="commodityInfo_img"
                                            :src="scope.row.mainImage"
                                        />
                                        <div class="commodityInfo_box_right">
                                            <span>{{ scope.row.sku }}</span>
                                            <span
                                                class="
                                                    commodityInfo_box_right_name
                                                "
                                            >{{ scope.row.skuName }}</span>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="supplierSettlePrice"
                                label="供应商结算价"
                                min-width="100"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="settlePrice"
                                label="渠道价"
                                min-width="100"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="supplierSalePrice"
                                label="供应商建议零售价"
                                min-width="100"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="salePrice"
                                label="建议零售价"
                                min-width="100"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="profit"
                                label="毛利率"
                            >
                            </el-table-column>
                            <el-table-column v-if="!readOnly">
                                <template slot-scope="scope">
                                    <span
                                        class="delSku"
                                        @click="delSkuFun(scope.row)"
                                    >删除</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-table
                            v-else
                            :data="tableData"
                            class="tableView"
                            :stripe="readOnly"
                            header-row-class-name="commodityInfo_header"
                            max-height="276"
                        >
                            <el-table-column
                                label="商品信息"
                                show-overflow-tooltip
                                min-width="100"
                            >
                                <template slot-scope="scope">
                                    <div class="commodityInfo_box">
                                        <img
                                            class="commodityInfo_img"
                                            :src="scope.row.mainImage"
                                        />
                                        <div class="commodityInfo_box_right">
                                            <span>{{ scope.row.sku }}</span>
                                            <span
                                                class="
                                                    commodityInfo_box_right_name
                                                "
                                            >{{ scope.row.skuName }}</span>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="supplierSettlePrice"
                                label="供应商结算价"
                                min-width="100"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="settlePrice"
                                label="渠道价"
                                min-width="100"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="supplierSalePrice"
                                label="供应商建议零售价"
                                min-width="100"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="salePrice"
                                label="建议零售价"
                                min-width="100"
                            ></el-table-column>
                            <el-table-column
                                prop="profit"
                                label="毛利率"
                            >
                            </el-table-column>
                            <el-table-column v-if="!readOnly">
                                <template slot-scope="scope">
                                    <span
                                        class="delSku"
                                        @click="delSkuFun(scope.row)"
                                    >删除</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div
                    class="fold_item_content"
                    :class="{
                        fold_item_content_view: readOnly,
                        fold_item_content_hieght: !readOnly,
                    }"
                    v-if="
                        (rangeType == 3 && !readOnly) ||
                            (readOnly &&
                                options.length == 0 &&
                                tableData.length == 0 &&
                                supplierLsit4UI.length > 0)
                    "
                >
                    <div v-if="supplierLsit4UI.length == 0">
                        暂无数据
                    </div>
                    <div
                        v-else
                        class="fold_item_content_supplierLay"
                    >
                        <div class="fold_item_content_supplierItems">
                            <div
                                v-for="(supplier, index) in supplierLsit4UI"
                                :key="index"
                                class="fold_item_content_spItem"
                            >
                                <el-checkbox
                                    :value="isChecedSP(supplier)"
                                    :disabled="supplier.disabled"
                                    @change="
                                        (value) => {
                                            handleCheckSP(value, supplier);
                                        }
                                    "
                                />
                                <span>{{ supplier.supplierShortName }}</span>
                            </div>
                        </div>
                        <div class="fold_item_content_supplierEmpty"></div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import { productBaseUrl } from "modules/config";
import producthandler from "bislibs/requestHandler/producthandler";
import utils from "bislibs/utils";
const clickoutside = {
    // 初始化指令
    bind(el, binding) {
        function documentHandler(e) {
            // 这里判断点击的元素是否是本身，是本身，则返回
            if (el.contains(e.target)) {
                return false;
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
                // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                binding.value(e);
            }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener("click", documentHandler);
    },
    unbind(el) {
        // 解除事件监听
        document.removeEventListener("click", el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    }
};

export default {
    props: {
        rangeTypeList: {
            type: Array,
            default: () => {
                return [];
            }
        }, // 范围类型列表
        parRangeType: {
            type: Number,
            default: 0
        },
        needCalPrice: {
            type: Boolean,
            default: false
        }, // 是否需要定价规则，只有 定价规则需要，下架不需要，也无法获取到,
        readOnly: {
            type: Boolean,
            default: false
        }, // 是否可选择可编辑
        selectedClassifyList: {
            type: Array,
            default: () => {
                return [];
            }
        }, // 选中的分类列表，为二维数组[[一级分类id,二级分类id，三级分类id]]
        selectedClassifyTreeList: {
            type: Array,
            default: () => {
                return [];
            }
        }, //分类树列表，针对详情只返回一部分分类列表而言
        selectedSKUList: {
            type: Array,
            default: () => {
                return [];
            }
        }, // 选中的skuId列表
        supplierLsit: {
            // 供应商列表
            type: Array,
            default: () => {
                return [];
            }
        },
        supplierSelects: {
            // 供应商结果集 [spId,spId]
            type: Array,
            default: () => {
                return [];
            }
        },
        parActiveNames: {
            type: Array,
            default: () => {
                return [];
            }
        }, // 折叠面板是否展开
        notEnableObj: {
            // 不能操作的数据 设置为disable
            type: Object,
            default: null
        },
        channelId: {
            type: Object,
            default: null
        }// 渠道ID
    },
    data: function () {
        return {
            activeNames: this.parActiveNames, // 折叠面板展开项
            classifyTreeList: [], //分类树列表信息
            classifyList: [], //分类列表信息
            checkedOneSortList: [], //选中的一级分类
            searchSKU: "", // 搜索sku编号
            rangeType: 0, //范围选中的类型
            tableData: [], //SKU商品表格信息
            productList: [], //商品信息列表
            showSKUSelect: false, //是否显示商品搜索展示框
            props_1: {
                multiple: true,
                value: "categoryId",
                label: "categoryName",
                children: "childrenCategories",
                disabled: "disabled"
            }, //设置可编辑级联属性
            props_2: {
                disabled: "disabled",
                value: "categoryId",
                label: "categoryName",
                children: "childrenCategories"
            }, //设置只读级联属性
            selected: [], //已选中分类信息
            options: [], //供应商信息
            checked_1: false, //判断二级分类是否全选
            checked_2: false, //判断三级分类是否全选
            isIndeterminate_1: false, //判断二级分类是否半选
            isIndeterminate_2: false, //判断三级分类是否半选
            showSelectedBox_1: false, //判断是否显示二级分类全选框
            showSelectedBox_2: false, //判断二级分类是否全选
            selectedSkuIdAndCategoryIdList: [], //选中的skuid跟对应分类id列表
            selectCount: 0, //选择个数
            historySearchKeys: [], //历史搜索关键字
            productBaseUrl: productBaseUrl, //图片显示根路径
            isLoading: true, //判断是否在加载
            supplierCheckedCount: 0, //已选择供应商数量
            productInitSupplierId: -1, //初始化供应商id
            hasInitProductInfo: false, //判断是否初始化商品信息
            isExpanded: true, //判断是否展开
            selectSuppliers: [], //选中的供应商
            supplierLsit4UI: [] //UI上组件使用的供应商列表
        };
    },
    directives: { clickoutside },
    created() {},
    mounted() {
        this.activeNames = JSON.parse(
            JSON.stringify(this.$props.parActiveNames)
        );
        if (!!this.activeNames && this.activeNames.length > 0) {
            this.isExpanded = true;
        } else {
            this.isExpanded = false;
        }
    },
    methods: {
        //查询供应商下面的分类信息
        getOptions: function () {
            let _this = this;
            let json = { categoryId: 0 };
            producthandler.getCategories(json).then(function (result) {
                if (!!result && result.resultCode == 0) {
                    _this.isLoading = false;

                    _this.options = _this.getUICategoryList(
                        result.result.productCategoryList
                    );
                    _this.filterSelectedOneLevel(
                        result.result.productCategoryList
                    );
                    //因为获取分类是异步接口，会存在编辑规则的时候，已选数据准备好了，但是列表数据没有准备好的情况。
                    //需要在这里手动调用一下。其余的场景，直接从 selected 的watch里面走
                    _this.emitDataToParent(1);
                }
            });
        },
        //将分类原始数据处理成 UI显示数据
        getUICategoryList(optionsList) {
            let _this = this;
            let tempOptions = [];
            //过滤state,1表示显示，0表示不显示，这里只要显示的分类数据
            if (!!optionsList && optionsList.length > 0) {
                optionsList.forEach(function (level1Item) {
                    if (
                        _this.notEnableObj &&
                        utils.isTreeNodeEqual(
                            _this.notEnableObj.categoryList,
                            level1Item,
                            1
                        )
                    ) {
                        level1Item.disabled = true;
                    } else {
                        level1Item.disabled = false;
                    }
                    if (level1Item.state == 1) {
                        if (
                            !!level1Item.childrenCategories &&
                            level1Item.childrenCategories.length > 0
                        ) {
                            let tempLevel2List = [];
                            level1Item.childrenCategories.forEach(function (
                                level2Item
                            ) {
                                if (
                                    _this.notEnableObj &&
                                    utils.isTreeNodeEqual(
                                        _this.notEnableObj.categoryList,
                                        level2Item,
                                        2
                                    )
                                ) {
                                    level2Item.disabled = true;
                                } else {
                                    level2Item.disabled = false;
                                }
                                if (level2Item.state == 1) {
                                    if (
                                        !!level2Item.childrenCategories &&
                                        level2Item.childrenCategories.length > 0
                                    ) {
                                        let tempLevel3List = [];
                                        level2Item.childrenCategories.forEach(
                                            function (level3Item) {
                                                if (
                                                    _this.notEnableObj &&
                                                    utils.isTreeNodeEqual(
                                                        _this.notEnableObj
                                                            .categoryList,
                                                        level3Item,
                                                        3
                                                    )
                                                ) {
                                                    level3Item.disabled = true;
                                                } else {
                                                    level3Item.disabled = false;
                                                }
                                                if (level3Item.state == 1) {
                                                    tempLevel3List.push(
                                                        level3Item
                                                    );
                                                }
                                            }
                                        );
                                        level2Item.childrenCategories = [];
                                        level2Item.childrenCategories =
                                            tempLevel3List;
                                        tempLevel2List.push(level2Item);
                                    } else {
                                        tempLevel2List.push(level2Item);
                                    }
                                }
                            });
                            level1Item.childrenCategories = [];
                            level1Item.childrenCategories = tempLevel2List;
                            tempOptions.push(level1Item);
                        } else {
                            tempOptions.push(level1Item);
                        }
                    }
                });
            }
            return tempOptions;
        },
        //向父组件抛出数据
        emitDataToParent(type) {
            let _this = this;
            if (type == 1) {
                //分类数据结果集
                _this.$emit("getSelectedClassifyList", {
                    selectedClassifyList: JSON.parse(
                        JSON.stringify(this.selected)
                    ),
                    categoryTreeData: _this.options,
                    rangeType: _this.rangeType
                });
            } else if (type == 2) {
                //SKU数据结果集
                _this.$emit("getSelectedSKUList", {
                    selectedSKUList: _this.tableData,
                    rangeType: _this.rangeType
                });
            } else if (type == 3) {
                //供应商-数据结果集
                _this.$emit("getSelectedSPList", {
                    selectedSPList: _this.selectSuppliers,
                    rangeType: _this.rangeType
                });
            } else if (type == 4) {
                //切换分类-数据结果集
                _this.$emit("getRangeType", {
                    rangeType: _this.rangeType
                });
            }
        },
        isChecedSP(supplier) {
            return this.selectSuppliers.indexOf(supplier.supplierType) != -1;
        },
        isSPDisable(supplier) {
            return (
                this.readOnly ||
                (this.notEnableObj &&
                    this.notEnableObj.spList.indexOf(
                        supplier.supplierType + ""
                    ) != -1)
            );
        },
        //选择供应商，单选
        handleCheckSP(value, supplier) {
            if (value) {
                this.selectSuppliers.splice(
                    0,
                    this.selectSuppliers.length,
                    supplier.supplierType
                );
            } else {
                this.selectSuppliers.splice(0, 1);
            }
        },
        /**
         * 获取分类级联组件的三级节点
         * nodeLevel 0,1,2 从左到右3级列表
         */
        getCascaderNodes(nodeLevel) {
            return this.$refs["cascaderAddr"]
                ? [
                    ...[
                        ...this.$refs["cascaderAddr"].$el.querySelectorAll(
                            ".el-cascader-menu"
                        )
                    ][nodeLevel].querySelectorAll("li")
                ]
                : [];
        },
        /**
         * 获取分类级联组件的菜单对象
         */
        getCascaderMenus() {
            return (
                (this.$refs["cascaderAddr"] &&
                    this.$refs["cascaderAddr"].menus) ||
                []
            );
        },
        /**
         * 代码点击，分类级联组件的某条数据
         */
        clickCascaderItem(node) {
            node && node.querySelector(".el-cascader-node__label").click();
        },
        //选择或取消一级全选
        changeList1() {
            let _this = this;
            _this.selectCount = 0;
            let nodes = _this.getCascaderNodes(1);
            let menus = _this.getCascaderMenus();
            if (!!menus[1] && menus[1].length > 0) {
                _this.selectCount = menus[1].length + 1;
                menus[1].forEach(function (item, index) {
                    _this.selectCount--;
                    if (
                        (_this.checked_1 && !item.checked) ||
                        (!_this.checked_1 && item.checked)
                    ) {
                        nodes[index].querySelector(".el-checkbox").click();
                    }
                });
            }
        },
        //选择或取消二级全选
        changeList2() {
            let _this = this;
            let nodes = _this.getCascaderNodes(2);
            let menus = _this.getCascaderMenus();
            if (!!menus[2] && menus[2].length > 0) {
                menus[2].forEach(function (item, index) {
                    if (
                        (_this.checked_2 && !item.checked) ||
                        (!_this.checked_2 && item.checked)
                    ) {
                        nodes[index].querySelector(".el-checkbox").click();
                    }
                });
            }
        },
        //分类级联树展开或选中状态发生变化时触发方法
        changeCasFun_1: function () {
            let _this = this;
            this.$nextTick(() => {
                let nodes = _this.getCascaderNodes(0);
                if (!!nodes && nodes.length > 0) {
                    nodes.forEach((nodeItem) => {
                        if (!!nodeItem.getAttribute("aria-expanded")) {
                            let tempCheckedOneSortList =
                                _this.checkedOneSortList.map((item) => {
                                    if (
                                        item.categoryName ==
                                        nodeItem.textContent
                                    ) {
                                        item["checked"] = true;
                                    } else {
                                        item["checked"] = false;
                                    }
                                    return item;
                                });
                            _this.checkedOneSortList = tempCheckedOneSortList;
                        }
                    });
                }
            });
            if (_this.selectCount <= 1 && !_this.readOnly) {
                _this.selectCount--;
                _this.setAllCheckComp();
            }
        },
        //分类级联树变化时触发方法（改变全选状态）
        setAllCheckComp: function () {
            let _this = this;
            this.$nextTick(() => {
                let menus = _this.getCascaderMenus();
                if (!!menus && menus.length > 0) {
                    if (
                        menus.length > 1 &&
                        menus.length <= 2 &&
                        menus[1].length > 0
                    ) {
                        _this.showSelectedBox_1 = true;
                        _this.showSelectedBox_2 = false;
                    } else if (menus.length > 2) {
                        if (menus[2].length > 0) {
                            _this.showSelectedBox_1 = true;
                            _this.showSelectedBox_2 = true;
                        } else {
                            _this.showSelectedBox_1 = true;
                            _this.showSelectedBox_2 = false;
                        }
                    } else {
                        _this.showSelectedBox_1 = false;
                        _this.showSelectedBox_2 = false;
                    }
                    if (
                        !!menus[1] &&
                        menus[1].length > 0 &&
                        _this.selectCount < 0
                    ) {
                        let checkedCount_1 = 0;
                        menus[1].forEach(function (menuitem_1) {
                            if (menuitem_1.checked) {
                                checkedCount_1++;
                            }
                        });
                        if (
                            checkedCount_1 > 0 &&
                            checkedCount_1 < menus[1].length
                        ) {
                            _this.checked_1 = false;
                            _this.isIndeterminate_1 = true;
                        } else if (checkedCount_1 == menus[1].length) {
                            _this.checked_1 = true;
                            _this.isIndeterminate_1 = false;
                        } else {
                            _this.checked_1 = false;
                            _this.isIndeterminate_1 = false;
                        }
                    }
                    if (!!menus[2] && menus[2].length > 0) {
                        let checkedCount_2 = 0;
                        menus[2].forEach(function (menuitem_2) {
                            if (menuitem_2.checked) {
                                checkedCount_2++;
                            }
                        });
                        if (
                            checkedCount_2 > 0 &&
                            checkedCount_2 < menus[2].length
                        ) {
                            _this.checked_2 = false;
                            _this.isIndeterminate_2 = true;
                        } else if (checkedCount_2 == menus[2].length) {
                            _this.checked_2 = true;
                            _this.isIndeterminate_2 = false;
                        } else {
                            _this.checked_2 = false;
                            _this.isIndeterminate_2 = false;
                        }
                    }
                }
            });
        },
        //判断是否全选
        isAllSelected() {
            let _this = this;
            this.$nextTick(() => {
                let menus = _this.getCascaderMenus();
                if (!!menus[1] && menus[1].length > 0) {
                    let level_2_count = 0;
                    menus[1].forEach(function (Item) {
                        if (Item.checked) {
                            level_2_count++;
                        }
                    });
                    if (level_2_count == menus[1].length) {
                        _this.checked_1 = true;
                        _this.isIndeterminate_1 = false;
                    } else {
                        _this.checked_1 = false;
                        if (level_2_count > 0) {
                            _this.isIndeterminate_1 = true;
                        } else {
                            _this.isIndeterminate_1 = false;
                        }
                    }
                }
                if (!!menus[2] && menus[2].length > 0) {
                    let level_3_count = 0;
                    menus[2].forEach(function (Item) {
                        if (Item.checked) {
                            level_3_count++;
                        }
                    });
                    if (level_3_count == menus[2].length) {
                        _this.checked_2 = true;
                        _this.isIndeterminate_2 = false;
                    } else {
                        _this.checked_2 = false;
                        if (level_3_count > 0) {
                            _this.isIndeterminate_2 = true;
                        } else {
                            _this.isIndeterminate_2 = false;
                        }
                    }
                }
            });
        },
        //过滤一级分类选中节点
        filterSelectedOneLevel: function (filterOneLevelClassifyList) {
            let _this = this;
            let selectedOneLevelItem = [];
            if (!!_this.selected && _this.selected.length > 0) {
                _this.selected.forEach(function (item) {
                    if (!selectedOneLevelItem.includes(item[0])) {
                        selectedOneLevelItem.push(item[0]);
                    }
                });
            }

            _this.checkedOneSortList = [];
            if (
                !!filterOneLevelClassifyList &&
                filterOneLevelClassifyList.length > 0
            ) {
                filterOneLevelClassifyList.forEach(function (item) {
                    if (selectedOneLevelItem.includes(item.categoryId)) {
                        _this.checkedOneSortList.push(item);
                    }
                });
            }
        },
        //点击右边已选择分类信息，联动展开右边的节点树
        showClassifyTree: function (item) {
            let _this = this;
            let nodes = _this.getCascaderNodes(0);
            let menus = _this.getCascaderMenus();
            if (!!menus[0] && menus[0].length > 0) {
                menus[0].forEach(function (menuItem, menuIndex) {
                    if (item.categoryId == menuItem.data.categoryId) {
                        _this.clickCascaderItem(nodes[menuIndex]);
                        setTimeout(() => {
                            if (
                                !!menuItem.children &&
                                menuItem.children.length > 0
                            ) {
                                let nodes1 = _this.getCascaderNodes(1);
                                //只读模式默认打开第一个目录就可以。编辑模式下，打开已经选中的目录
                                if (_this.readOnly) {
                                    _this.clickCascaderItem(nodes1[0]);
                                } else {
                                    for (let i = 0; i < nodes1.length; i++) {
                                        if (
                                            nodes1[i].innerHTML.indexOf(
                                                "is-checked"
                                            ) != -1
                                        ) {
                                            _this.clickCascaderItem(nodes1[i]);
                                            break;
                                        }
                                    }
                                }
                            }
                        }, 100);
                    }
                });
            }
            if (
                !!_this.checkedOneSortList &&
                _this.checkedOneSortList.length > 0
            ) {
                let tempCheckedOneSortList = _this.checkedOneSortList.map(
                    function (tempItem) {
                        if (tempItem.categoryId == item.categoryId) {
                            tempItem["checked"] = true;
                        } else {
                            tempItem["checked"] = false;
                        }
                        return tempItem;
                    }
                );
                _this.checkedOneSortList = tempCheckedOneSortList;
            }
        },
        //搜索商品
        searchProduct: function () {
            if (this.needCalPrice && !this.$parent.channelSelect) {
                utils.showToast("请选择渠道");
                return;
            }
            var _this = this;
            if (
                !!_this.searchSKU &&
                _this.historySearchKeys.indexOf(_this.searchSKU) < 0
            ) {
                _this.historySearchKeys.unshift(_this.searchSKU);
                if (_this.historySearchKeys.length > 10) {
                    _this.historySearchKeys.splice(
                        10,
                        _this.historySearchKeys.length - 10
                    );
                }
            }
            // 下架管理 channelId 用props的值  定价管理传9999 
            var json = {
                keyword: _this.searchSKU.trim(),
                pageSize: 20,
                pageIndex: 1,
                channelId: this.channelId?this.channelId.value:9999,
                showLoading: false
            };
            _this.$iLoading.show();
            producthandler
                .productSearch(json)
                .then(function (result) {
                    _this.$iLoading.hide();
                    if (!!result && result.resultCode == 0) {
                        _this.isLoading = false;
                        _this.showSKUSelect = true;

                        _this.productList = _this.getUISearchProducts(
                            result.result.hitResultVOList
                        );

                        let productInfos = [];
                        if (
                            !!_this.productList &&
                            _this.productList.length > 0
                        ) {
                            _this.productList.forEach(function (item) {
                                let tempItem = _this.newParamObj(item);

                                let isIncluded = false;
                                if (
                                    !!_this.tableData &&
                                    _this.tableData.length > 0
                                ) {
                                    _this.tableData.forEach(function (
                                        dataItem
                                    ) {
                                        if (item.sku == dataItem.sku) {
                                            isIncluded = true;
                                        }
                                    });
                                }
                                if (isIncluded) {
                                    tempItem["checked"] = true;
                                } else {
                                    tempItem["checked"] = false;
                                }

                                productInfos.push(tempItem);
                            });
                        }
                        if (productInfos.length > 0) {
                            _this.listProductPrice(
                                _this.productList,
                                productInfos
                            );
                        }
                    }
                })
                .catch(() => {
                    _this.$iLoading.hide();
                });
        },
        //商品价格
        listProductPrice: function (
            pruductSourceList,
            productParams,
            initTableData
        ) {
            let _this = this;

            let paramJson = {
                productPriceInfos: productParams,
                showLoading: false
            };
            //渠道ID也不是必选的，因为有可能用户没有选择渠道
            // console.log(
            //     777,
            //     this.$parent.channelSelect,
            //     this.$parent.ForbidRule
            // );

            if (!!this.$parent.channelSelect || !!this.$parent.ForbidRule) {
                paramJson.channelId =
                    (this.$parent.channelSelect &&
                        this.$parent.channelSelect.value) ||
                    (this.$parent.ForbidRule.channel &&
                        this.$parent.ForbidRule.channel.value);
            }
            if (this.needCalPrice) {
                //是否需要最新价格。定价规则需要 传输。下架规则是不关心这个的，只需要channelId即可
                paramJson.priceRuleFormula = {
                    priceType: 1,
                    settlePriceFloatingValue: this.$parent.priceFloatingValue,
                    settlePricePercentage: this.$parent.pricePercentage
                };
            }
            _this.$iLoading.show();
            producthandler
                .getProductPrices(paramJson)
                .then(function (result) {
                    _this.$iLoading.hide();
                    if (!!result && result.resultCode == 0) {
                        let productPriceInfos = result.result.productPrices;
                        if (
                            !!pruductSourceList &&
                            pruductSourceList.length > 0 &&
                            !!productPriceInfos &&
                            productPriceInfos.length > 0
                        ) {
                            if (initTableData) {
                                //有要初始化的商品，填充列表数据
                                _this.tableData = [];
                                _this.hasInitProductInfo = true;
                            }
                            pruductSourceList.forEach(function (proItem) {
                                productPriceInfos.forEach(function (item) {
                                    if (proItem.sku == item.sku) {
                                        proItem.mainImage =
                                            proItem.mainImage &&
                                            proItem.mainImage
                                                .toLowerCase()
                                                .indexOf("http") == 0
                                                ? proItem.mainImage
                                                : productBaseUrl +
                                                  proItem.mainImage;
                                        proItem["supplierSalePrice"] =
                                            _this.priceFormat(
                                                item.supplierSalePrice
                                            );
                                        proItem["supplierSettlePrice"] =
                                            _this.priceFormat(
                                                item.supplierSettlePrice
                                            );
                                        proItem["salePrice"] =
                                            _this.priceFormat(item.salePrice);
                                        proItem["settlePrice"] =
                                            _this.priceFormat(item.settlePrice);
                                        proItem["profit"] = item.profit;
                                    }
                                });
                                if (initTableData) {
                                    //有要初始化的商品，填充列表数据
                                    _this.tableData.push(proItem);
                                    // console.log(
                                    //     "initTableData",
                                    //     _this.tableData
                                    // );
                                }
                            });
                            if (initTableData) {
                                //有要初始化的商品，填充列表数据
                                utils.setStorage(
                                    "InitProductTableData",
                                    JSON.stringify(_this.tableData)
                                );
                            }
                        }
                    }
                })
                .catch(() => {
                    _this.$iLoading.hide();
                });
        },
        /**
         * 处理搜索sku的结果集，给UI使用
         */
        getUISearchProducts(searchResultVOList) {
            let _this = this;
            if (!!searchResultVOList && searchResultVOList.length) {
                //过滤掉本渠道不能编辑的sku
                searchResultVOList.forEach((item) => {
                    if (
                        _this.notEnableObj &&
                        utils.isArrSKUEqual(
                            _this.notEnableObj.skuList,
                            item.sku
                        )
                    ) {
                        item.disabled = true;
                    } else {
                        item.disabled = false;
                    }
                });
            }
            return searchResultVOList;
        },
        //选择历史搜索关键字
        selectHistorySearchKey: function (searchKey) {
            let _this = this;
            _this.searchSKU = searchKey;
        },
        //通过skuIdList批量查询商品信息
        listDetailWithSupplierInfo: function (selectedSKUList) {
            let _this = this;
            var json = {
                //这个场景都是 详情 和编辑，都已经有了channelId，不是选择的啦
                // channelId:"110",
                channelId:
                    (this.$parent.ForbidRule &&
                        this.$parent.ForbidRule.channelId) ||
                    (this.$parent.priceDetailInfo &&
                        this.$parent.priceDetailInfo.channelId),
                skus: selectedSKUList,
                showLoading: false
            };

            _this.$iLoading.show();
            producthandler
                .listDetailWithSupplierInfo(json)
                .then(function (result) {
                    _this.$iLoading.hide();
                    if (!!result && result.resultCode == 0) {
                        let selectedProductList = result.result.productDetails;

                        if (!selectedProductList) {
                            return;
                        }
                        for (let i = 0; i < selectedProductList.length; i++) {
                            if (selectedProductList[i].notInPool) {
                                selectedProductList.splice(i, 1);
                                i--;
                            }
                        }
                        if (selectedProductList.length == 0) {
                            utils.showToast("商品不在商品池");
                            return;
                        }

                        let productInfos = [];
                        if (
                            !!selectedProductList &&
                            selectedProductList.length > 0
                        ) {
                            selectedProductList.forEach(function (item) {
                                productInfos.push(_this.newParamObj(item));
                            });
                        }
                        if (productInfos.length > 0) {
                            _this.listProductPrice(
                                selectedProductList,
                                productInfos,
                                true
                            );
                        }
                    }
                })
                .catch(() => {
                    _this.$iLoading.hide();
                });
        },
        newParamObj(item) {
            let tempCategory = item.cidPath.split("/");
            return {
                sku: item.sku,
                supplierType: item.productSupplierInfo.supplierType,
                categoryId1: tempCategory[0],
                categoryId2: tempCategory[1],
                categoryId3: tempCategory[2],
                supplierSalePrice: item.supplierSalePrice.salePrice,
                supplierSettlePrice: item.supplierSalePrice.settlePrice
            };
        },
        //初始化规则详情
        ruleDetailInit: function () {
            let _this = this;
            if (!!_this.selectedSKUList && _this.selectedSKUList.length > 0) {
                _this.listDetailWithSupplierInfo(_this.selectedSKUList);
            }
        },
        /**
         * 处理供应商数据，获取UI组件需要使用的数据
         */
        getUISPlist() {
            let _this = this;
            _this.supplierLsit4UI.forEach((item) => {
                item.disabled = _this.isSPDisable(item);
            });
        },
        //选择商品
        productCheck: function (item) {
            let _this = this;
            if (item.disabled) {
                utils.showToast("已加入其他规则，不能选择");
                return;
            }
            if (!!_this.productList && _this.productList.length > 0) {
                _this.productList.forEach(function (tempItem) {
                    if (tempItem.sku == item.sku) {
                        if (tempItem.checked) {
                            tempItem.checked = false;
                            let tempTableData = [];
                            if (
                                !!_this.tableData &&
                                _this.tableData.length > 0
                            ) {
                                _this.tableData.forEach(function (dataItem) {
                                    if (dataItem.sku != tempItem.sku) {
                                        tempTableData.push(dataItem);
                                    }
                                });
                            }
                            _this.tableData = tempTableData;
                        } else {
                            tempItem.checked = true;
                            let isIncluded = false;
                            if (
                                !!_this.tableData &&
                                _this.tableData.length > 0
                            ) {
                                _this.tableData.forEach(function (dataItem) {
                                    if (dataItem.sku == tempItem.sku) {
                                        isIncluded = true;
                                    }
                                });
                            }
                            if (!isIncluded) {
                                _this.tableData.push(tempItem);
                            }
                        }
                    }
                });
            }
        },
        //删除sku
        delSkuFun: function (item) {
            let _this = this;
            let tempTableData = [];
            if (!!_this.tableData && _this.tableData.length > 0) {
                _this.tableData.forEach(function (dataItem) {
                    if (item.sku != dataItem.sku) {
                        tempTableData.push(dataItem);
                    }
                });
            }
            _this.tableData = tempTableData;
            if (!!_this.productList && _this.productList.length > 0) {
                _this.productList.forEach(function (productItem) {
                    if (productItem.sku == item.sku) {
                        productItem.checked = false;
                    }
                });
            }
        },
        //关闭搜索商品展示框
        channelHandleClose: function () {
            var _this = this;
            _this.showSKUSelect = false;
        },
        //格式化金钱
        priceFormat: function (num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        changeSelected(value) {
            this.$emit("getProductRangeType", value);
        },
        updateCompData() {
            let _this = this;
            //刷新组件当前的显示数据
            if (_this.rangeType == 1) {
                _this.options = _this.getUICategoryList(_this.options);
            } else if (_this.rangeType == 2) {
                _this.productList = _this.getUISearchProducts(
                    _this.productList
                );
            } else if (_this.rangeType == 3) {
                _this.getUISPlist();
            } else {
                console.error("error,type=" + _this.rangeType);
            }
        },
        //组件初始化数据业务
        onChangeRangeType() {
            let _this = this;
            if (_this.rangeType == 1) {
                if (!this.readOnly) {
                    //如果分类不是只读的，调用接口
                    if (this.needCalPrice && !this.$parent.channelSelect) {
                        utils.showToast("请选择渠道");
                    } else if (!(_this.options && _this.options.length > 0)) {
                        this.getOptions();
                    }
                }
                if (_this.selectedClassifyList.length == 0) {
                    _this.showSelectedBox_1 = false;
                    _this.showSelectedBox_2 = false;
                } else {
                    _this.$nextTick(() => {
                        let menus = _this.getCascaderMenus();
                        if (!!menus[1] && menus[1].length > 0) {
                            _this.showSelectedBox_1 = true;
                        }
                        if (!!menus[2] && menus[2].length > 0) {
                            _this.showSelectedBox_2 = true;
                            _this.checked_2 = true;
                        }
                    });
                }
            }

            if (this.rangeType === 2 && this.hasInitProductInfo) {
                this.tableData =
                    JSON.parse(utils.getStorage("InitProductTableData")) || [];
            }
        }
    },
    watch: {
        selectedClassifyList() {
            let _this = this;
            _this.selected = _this.selectedClassifyList;
            if (!!_this.selected && _this.selected.length > 0) {
                _this.showSelectedBox_1 = true;
                _this.showSelectedBox_2 = true;
                _this.isAllSelected();
            } else {
                _this.showSelectedBox_1 = false;
                _this.showSelectedBox_2 = false;
            }
            _this.changeCasFun_1();
        },
        selectedClassifyTreeList: {
            handler: function () {
                let _this = this;
                _this.options = _this.selectedClassifyTreeList;
                _this.checkedOneSortList = _this.selectedClassifyTreeList;
                if (
                    !!_this.checkedOneSortList &&
                    _this.checkedOneSortList.length > 0
                ) {
                    _this.checkedOneSortList[0]["checked"] = true;
                    _this.$nextTick(() => {
                        let nodes = _this.getCascaderNodes(0);
                        let menus = _this.getCascaderMenus();
                        if (!!menus[0] && menus[0].length > 0) {
                            menus[0].forEach(function (menuItem, menuIndex) {
                                if (menuItem.hasChildren && menuIndex == 0) {
                                    _this.clickCascaderItem(nodes[menuIndex]);
                                    setTimeout(() => {
                                        if (
                                            !!menuItem.children &&
                                            menuItem.children.length > 0
                                        ) {
                                            let nodes1 =
                                                _this.getCascaderNodes(1);
                                            _this.clickCascaderItem(nodes1[0]);
                                        }
                                    }, 100);
                                }
                            });
                        }
                    });
                }
            },
            immediate: true
        },
        tableData() {
            let _this = this;
            _this.emitDataToParent(2);
        },
        //选择供应商回调接口
        selectSuppliers() {
            let _this = this;
            _this.emitDataToParent(3);
        },
        selectedSKUList: {
            handler: function () {
                let _this = this;
                // console.log("selectedSKUList", this.selectedSKUList);
                _this.ruleDetailInit();
            },
            immediate: true
        },
        supplierLsit: {
            handler: function (value) {
                let _this = this;
                // console.log("selectedSKUList", this.selectedSKUList);
                _this.supplierLsit4UI = JSON.parse(JSON.stringify(value));
                _this.getUISPlist();
            },
            immediate: true
        },
        selected() {
            let _this = this;
            // console.log("selected", newData);
            _this.isAllSelected();
            _this.filterSelectedOneLevel(_this.options);
            _this.emitDataToParent(1);
        },
        parRangeType: {
            handler: function () {
                // console.log("parRangeType", this.$props.parRangeType);
                this.rangeType = this.$props.parRangeType;
            },
            immediate: true
        },
        rangeType: {
            handler: function () {
                let _this = this;
                _this.emitDataToParent(4);
                _this.onChangeRangeType();
            },
            immediate: true
        },
        notEnableObj: {
            //每次重新切换渠道，这个数据都会变化，要及时刷新组件的数据
            handler: function () {
                this.updateCompData();
            },
            immediate: true
        },
        parActiveNames() {
            this.activeNames = JSON.parse(
                JSON.stringify(this.$props.parActiveNames)
            );
            if (!!this.activeNames && this.activeNames.length > 0) {
                this.isExpanded = true;
            } else {
                this.isExpanded = false;
            }
            return this.$props.parActiveNames;
        },
        activeNames() {
            let _this = this;
            if (!!_this.activeNames && _this.activeNames.length > 0) {
                _this.isExpanded = true;
            } else {
                _this.isExpanded = false;
            }
        },
        supplierSelects: {
            handler: function (newObj) {
                if (!!newObj && newObj.length > 0) {
                    this.selectSuppliers = JSON.parse(JSON.stringify(newObj));
                }
            },
            immediate: true
        },

        deep: true,
        immediate: true
    }
};
</script>
<style lang="less">
//  用于修改组件样式，需要用自定义类名包裹
.product {
    .fold_item {
        .el-collapse-item__header {
            background-color: #f8f8f8;
            padding-left: 8px;
            font-size: 14px;
            font-weight: 550;
            height: 36px;
            line-height: 36px;
        }
    }
    .fold_item_range {
        .el-collapse-item__content {
            padding: 0;
        }
    }
    .fold {
        .el-checkbox-button .el-checkbox-button__inner {
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .el-checkbox-button.is-checked .el-checkbox-button__inner {
            background-color: #fff;
            color: #478aee;
            border-color: #478aee;
        }
    }
    .fold_item_content_box_search {
        .el-input__inner {
            width: 239px !important;
            height: 36px !important;
            border-radius: 8px 0 0 8px !important;
        }
        .el-input-group__append,
        .el-input-group__prepend {
            background-color: #478aee;
            color: #fff;
            border: 1px solid #478aee;
            border-radius: 0 8px 8px 0;
        }
    }
}
.productRange {
    .el-table th {
        height: 36px;
        padding: 0;
        font-size: 14px;
        color: #666666;
        background-color: #f2f2f2;
    }
    .el-table::before {
        height: 0;
    }
    .el-table td {
        height: 80px;
        color: #333;
    }
    .el-collapse-item__header {
        height: 37px;
        line-height: 36px;
        margin-top: -1px;
    }
    .el-collapse-item__arrow {
        display: none;
    }
    .el-radio__input.is-checked + .el-radio__label {
        color: #478aee;
    }
    .el-radio__label {
        color: #666;
    }
    .el-radio__input.is-checked .el-radio__inner {
        border-color: #478aee;
        background: #478aee;
    }
    .el-radio__inner {
        width: 16px;
        height: 16px;
    }
    .el-checkbox__input {
        &.is-checked,
        &.is-indeterminate {
            .el-checkbox__inner {
                background-color: #478aee;
                border-color: #478aee;
                width: 16px;
                height: 16px;
            }
        }
        .el-checkbox__inner {
            width: 16px;
            height: 16px;
        }
    }
    .el-cascader-node.in-active-path,
    .el-cascader-node.is-active,
    .el-cascader-node.is-selectable.in-checked-path {
        color: #478aee;
    }
    .el-cascader-node {
        padding: 0 30px 0 24px;
    }
    .el-cascader-node__label {
        padding: 0 16px;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #478aee;
    }
    table tr td:first-child .cell,
    table tr th:first-child .cell {
        padding-left: 32px;
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td {
        background: #f8f8f8;
    }
}
.el-tooltip__popper {
    max-width: 300px;
}
.product_range_item_left {
    .el-cascader-menu {
        color: #333;
        .el-cascader-menu__wrap {
            height: 450px !important;
        }
    }

    .el-cascader-menu {
        width: 33.3% !important;
    }
    .el-cascader-node.is-disabled {
        color: #303133 !important;
    }
}
.productRange {
    .el-collapse-item__header {
        border-radius: 0 8px 0 0;
        border: none;
    }
    .headerUnexpand {
        border-radius: 0 8px 8px 0;
    }
    .el-collapse-item:last-child {
        margin-bottom: 0;
    }
    .el-button--mini {
        width: 40px;
    }
    .el-icon-search {
        margin-left: -4px;
    }
}
</style>
<style lang="less" scoped>
@import "./productRange.less";
</style>