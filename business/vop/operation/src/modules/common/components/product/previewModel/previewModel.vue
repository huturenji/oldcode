<!--
 * @Author: chengMingRui
 * @Date: 2020-03-27 09:42:50
 * @LastEditTime: 2020-04-24 09:45:10
 * @Description: 规则定价新增编辑详情预览弹框
 -->
<template>
    <div class="previewModel">
        <el-dialog 
            title="预览"
            width="95vw"
            :center="true" 
            :modal-append-to-body="false"
            :visible.sync="dialogTableVisible"
            @close="closePreviewModel"
            custom-class="previewModel_dialog product"
        >
            <p class="product_title">
                产品范围-{{ previewType==1?'分类':previewType==2?'SKU':'' }}
            </p>
            <div class="product_content_table">
                <ul
                    class="product_tab"
                    v-if="previewType==1"
                >
                    <div
                        class="product_tab_left"
                        ref="productTab"
                    >
                        <li 
                            class="product_tab_item"
                            :class="activeIndex==index?'product_tab_active':''"
                            v-for="(item,index) in categroyTitleList"
                            :key="item.productCategroyId"
                            @click="clickTabItem(item,index)"
                        >
                            {{ item.productCategoryName }}
                        </li>
                    </div>
                    <span 
                        class="product_tab_right"
                        v-if="categroyTitleList.length"
                    >
                        毛利率：{{ profit }}
                    </span>
                </ul>
                <el-table 
                    :data="rangeList"
                    ref="previewModel"
                    max-height="360"
                    style="width:100%"
                    :stripe="true"
                    class="product_list"
                >
                    <el-table-column 
                        label="商品信息" 
                        min-width="240"
                        class="product_item"
                        :show-overflow-tooltip="true"
                    >
                        <template slot-scope="scope">
                            <div class="product_info">
                                <el-image
                                    class="product_info_logo"
                                    :src="scope.row[tableKeyObject.imageUrl]"
                                    fit="cover"
                                >
                                </el-image>
                                <div class="product_info_text">
                                    <span>{{ scope.row[tableKeyObject.skuId] }}</span>
                                    <p>{{ scope.row[tableKeyObject.desc] }}</p>
                                </div>
                            </div> 
                        </template>
                    </el-table-column>
                    <el-table-column 
                        :property="tableKeyObject.providerUnitPrice"
                        align="center"
                        label="供应商销售价"
                    >
                    </el-table-column>
                    <el-table-column 
                        :property="tableKeyObject.providerSettleUnitPrice"
                        align="center"
                        label="结算价"
                    >
                    </el-table-column>
                    <el-table-column 
                        :property="tableKeyObject.unitPrice"
                        align="center"
                        label="销售价"
                    >
                    </el-table-column>
                    <el-table-column 
                        :property="tableKeyObject.profit"
                        align="center"
                        label="毛利率"
                    >
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { productBaseUrl } from "modules/config";
import Vue from 'vue';
export default {
    props: {
        // 是否展示预览弹框
        isPreview: {
            type: Boolean,
            default: false
        },
        // 分类头部菜单列表
        titleList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        // 是分类还是sku展示 1为分类 2为SKU
        previewType: {
            type: Number,
            default: 0
        },
        // 产品列表
        productList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        // 分类下的汇总的毛利率
        profit: {
            type: String,
            default: ""
        },
        tableKeyObject: {
            type: Object,
            default: () => {
                return {};
            }
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            rangeList: this.$props.productList,
            categroyTitleList: [], //选择的一级分类头部信息
            privewTitle: "",
            productUrl: productBaseUrl,
            dialogTableVisible: false,
            activeIndex: 0,
            loadingObj:{},
            fullscreenLoading: false
        };
    },
    created() {},
    methods: {
        showLoading () {
            this.loadingObj = Vue.prototype.$loading({
                lock: true,
                text: '加载中……',
                target: document.querySelector('.previewModel_dialog')//设置加载动画区域
            })
        },
        // 关闭预览框
        closePreviewModel() {
            this.activeIndex = 0;
            this.$emit("closeModel");
            this.tableScrollTop();
            if (this.$refs.productTab) {
                this.$refs.productTab.scrollTop = 0;
            }
        },
        //切换tab
        clickTabItem(item, index) {
            this.$emit("clickTabItem", item);
            this.activeIndex = index;
            this.tableScrollTop();
        },
        tableScrollTop() {
            this.$refs.previewModel.bodyWrapper.scrollTop = 0;
        }
    },
    watch: {
        isPreview() {
            this.dialogTableVisible = this.$props.isPreview;
            return this.$props.isPreview;
        },
        titleList() {
            this.categroyTitleList = this.$props.titleList;
            return this.$props.titleList;
        },
        productList() {
            this.rangeList = JSON.parse(
                JSON.stringify(this.$props.productList)
            );
            return this.$props.productList;
        },
        profit() {
            return this.$props.profit;
        },
        isLoading() {
            this.fullscreenLoading = this.$props.isLoading;
            if (this.fullscreenLoading) {
                this.showLoading();
            } else if (!!this.loadingObj.close){
                this.loadingObj.close()
            }
            return this.$props.isLoading;
        },
        previewType() {
            return this.$props.previewType;
        }
    }
};
</script>

<style lang="less">
@import "./previewModel.less";
</style>
