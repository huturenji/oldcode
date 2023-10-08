<!--
 * @Author: chengMingRui
 * @Date: 2020-03-05 13:50:35
 * @LastEditTime: 2020-04-24 17:07:12
 * @Description: 定价管理页面
 -->
<template>
    <div class="commodity product">
        <div
            class="product_content commodity_content loading-area"
            v-show="!isShowModal"
        >
            <div class="commodity_filter">
                <div class="commodity_filter_search">
                    <el-input
                        placeholder="渠道/商品分类/SKU编号/规则名称"
                        v-model="searchTrim"
                        :clearable="true"
                        @keyup.enter.native="searchRules"
                        class="commodity_filter_search_input"
                    >
                        <template slot="append">
                            <el-button
                                type="primary"
                                class="commodity_filter_search_button"
                                @click="searchRules"
                            >
                                <i class="el-icon-search"></i>
                            </el-button>
                        </template>
                    </el-input>
                </div>
                <div class="commodity_filter_tip">
                    <div class="commodity_filter_tip_box">
                        <i
                            class="el-icon-warning commodity_filter_tip_warning"
                        ></i>
                        <p class="commodity_filter_tip_text">
                            <!-- <span>
                                1.当对同一品类/产品制定了不同的规则，且其生效时间存在交集时，则按规则的生效时间排序，后生效的规则优先于前面制定的规则
                            </span> -->
                            <span>
                                1.规则的优先级为指定SKU定价>
                                指定分类定价>默认定价
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="commodity_table">
                <FilterTable
                    :detailUrl="seeDetailUrl"
                    @pageChange="pageChange"
                    @pageSizeChange="pageSizeChange"
                    :pageObject="pageObject"
                    :spFilters="channelList"
                    :tableList="tableDataList"
                    :gotoAddUrl="gotoAddUrl"
                    @filterChange="changeData"
                />
            </div>
        </div>
        <noAuth :isShowModal="isShowModal" />
    </div>
</template>
<script>
import FilterTable from "biscomponents/product/filterTable/filterTable"; // 筛选结果展示表格
import noAuth from "biscomponents/product/noAuth";
import producthandler from "bislibs/requestHandler/producthandler";
import utils from "bislibs/utils";

export default {
    name: "Commodity",
    components: {
        FilterTable,
        noAuth
    },
    data: () => {
        return {
            seeDetailUrl: {
                name: "priceDetail"
            },
            gotoAddUrl: {
                name: "priceAdd",
                params: {
                    isEdit: false
                }
            },
            tableDataList: [], // 表格数据
            channelList: [], // 渠道数据
            searchTrim: "", // 搜索的内容
            selectedSp: null, // 供应商筛选条件
            selectedState: null, // 状态筛选条件
            pageObject: {}, // 分页参数
            isShowModal: false
        };
    },
    created() {
        this.hasSeePriceRuleAuth();
        // 获取列表数据
        if (utils.hasAuth('hasSeePriceRuleAuth')){
            this.getChannels();
            this.getRuleList();
        }        
    },
    methods: {
        hasSeePriceRuleAuth() {
            this.isShowModal = !utils.hasAuth('hasSeePriceRuleAuth');
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
                            _this.channelList.push({
                                value: item.channelId,
                                text: item.shortName || item.name
                            });
                        });
                    }
                }
            });
        },        
        // 获取定价管理列表
        getRuleList(pageIndex) {
            let pageSize = Number(localStorage.getItem("priceBoard")) || 10;
            let requestData = {
                pageIndex: pageIndex || 1,
                pageSize: pageSize
            };
            this.selectedState && (requestData.state = parseInt(this.selectedState)) ; //增加状态筛选条件
            this.selectedSp && (requestData.channelId = this.selectedSp) ; // 增加供应商筛选条件
            this.searchTrim.trim() && (requestData.keyword = this.searchTrim.trim());
            this.$iLoading.show();
            producthandler.listPriceRule(requestData)
                .then(res => {
                    this.$iLoading.hide();
                    if (res.resultCode === 0) {
                        this.tableDataList = res.result.listPriceRuleVos;
                        this.setPageObjectByData({
                            totalItems: res.result.totalItems,
                            totalPages: res.result.totalPages,
                            pageSize,
                            pageIndex
                        });
                    } else {
                        console.log(res);
                    }
                })
                .catch(err => {
                    this.$iLoading.hide();
                    console.log(err);
                });
        },
        // 改变筛选条件重新请求数据
        changeData: function(value) {
            this.selectedSp = value.sp;
            this.selectedState = value.state;
            this.getRuleList();
        },
        // 输入框变动搜索
        searchRules() {
            this.getRuleList();
        },
        // 设置分页数据
        setPageObjectByData({ totalPages, totalItems, pageSize, pageIndex }) {
            this.$set(this.pageObject, "pageCount", totalPages);
            this.$set(this.pageObject, "totalNum", totalItems);
            this.$set(this.pageObject, "currentPage", pageIndex || 1);
            this.$set(this.pageObject, "pageSize", pageSize);
        },
        // 当前页码变化请求数据
        pageChange(currentPage) {
            this.getRuleList(currentPage);
        },
        // 每页数量改变时
        pageSizeChange(pageSize) {
            localStorage.setItem("priceBoard", pageSize);
            this.getRuleList(1);
        }
    }
};
</script>
<style lang='less'>
@import "./search.less";
</style>
