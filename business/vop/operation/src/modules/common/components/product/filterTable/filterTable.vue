<!--
 * @Author: chengMingRui
 * @Date: 2020-03-16 10:13:59
 * @LastEditTime: 2020-04-26 09:45:19
 * @Description: 定价管理页列表表格
 -->
<template>
    <div class="filterTableBox">
        <div
            class="filterTableBox_header"
            v-if="hasAddPriceRuleAuth()"
        >
            <div class="filterTableBox_header_left">
            </div>
            <div class="filterTableBox_header_right">
                <el-button
                    type="primary" 
                    icon="el-icon-plus" 
                    @click="gotoAddPrice"
                >新增</el-button>
            </div>
        </div>
        <el-table
            ref="multipleTable"
            :data="tableList"
            class="filterTableBox_content el-table--scrollable-y el-table--enable-row-transition el-table--fluid-height"
            :stripe="true"
            @filter-change="changeData"
            tooltip-effect="dark"
        >
            <el-table-column 
                prop="ruleName" 
                label="规则名称"
                :show-overflow-tooltip="true"
                min-width="120"
            >
            </el-table-column>
            <el-table-column 
                :label="filterSpLabel"
                min-width="120"
                label-class-name="filterTableBox_content_label"
                :filters="spFilters"
                :filter-multiple="false"
                :column-key="'channelId'"
            >
                <template slot-scope="scope">
                    <div class="filterTableBox_item">
                        <!-- <el-image
                            class="filterTableBox_item_logo"
                            :src="scope.row.logo||errorImage"
                            fit="cover">
                        </el-image> -->
                        <span class="filterTableBox_item_text">
                            {{ scope.row.channelName }}
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column 
                prop="productCategory" 
                label="商品范围"
                min-width="150"
                :show-overflow-tooltip="true"
            >
                <template slot-scope="scope">
                    {{ getCategoryOneName(scope.row) }}
                </template>    
            </el-table-column>
            <el-table-column
                label="价格规则"
                align="center"
                width="170"
                :formatter="getRuleInfo"
            >
            </el-table-column>
            <el-table-column 
                :label="filterStatusLabel"
                align="center"
                min-width="70"
                label-class-name="filterTableBox_content_label"
                :filters="statusList"
                :filter-multiple="false"
                :column-key="'state'"
            >
                <!-- 规则状态：0-未启用，1-启用 -->
                <template slot-scope="scope">
                    <span :class="[scope.row.state==1?'filterTableBox_content_started':'filterTableBox_content_stop']">
                        {{ scope.row.state==1?'已启用':'已停用' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="启用/停用时间"
                align="center"
                min-width="140"
                :formatter="formatter"
            >
            </el-table-column>
            <el-table-column 
                align="center"
                label="操作"
                min-width="60"
            >
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="seeDetail(scope.row)"
                    >
                        详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div 
            class="filterTableBox_pagination"
            v-if="pageObject.totalNum"
        >
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pageObject.currentPage"
                :page-sizes="[5,10,20,50,100]"
                :pager-count="5"
                :page-count="pageObject.pageCount"
                :page-size="pageObject.pageSize"
                layout="total,prev, pager, next,jumper,sizes"
                :total="pageObject.totalNum"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import utils from "bislibs/utils";

export default {
    props: {
        detailUrl: {
            type: [String, Object],
            default: ""
        },
        gotoAddUrl: {
            type: [String, Object],
            default: ""
        },
        spFilters: {
            type: Array,
            default: () => {
                return [];
            }
        },
        tableList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        pageObject: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            currentPage: 1,
            pageCount: 1,
            pageSize: 10,
            totalNum: 0,
            statusList: [
                {
                    value: "0",
                    text: "已停用"
                },
                {
                    value: "1",
                    text: "已启用"
                }
            ],
            selectedState: null, //选中的状态
            selectedSp: null, // 选中的供应商
            errorImage:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAASKADAAQAAAABAAAASAAAAACQMUbvAAADUElEQVR4Ae2ZV2/rMAxGlb3H//+DeclD9h4XR7gEDKMtnZqqnYB8qBvTlaWjj0NpY7FYPIPbtwSa33rcEQk4IEUIDsgBKQQUtyvIASkEFLcryAEpBBS3K8gBKQQUtyvIASkEFLcryAEpBBS3K8gBKQQUtyvIASkEFLcryAEpBBR3W/EXdjcajTCZTEK/3w/NZjXCfDwe4XQ6he12G55Pm/9FmAECznA4LAw0xYNsjMxhs9mYvMJsq1FOXcxyLmaAqgqrrzbFci5mgL6a6CfcSw7ofr+H2+32tqzMknSeABWFRClwkD2JvNPp5B+t9edkCqLUAqfdbodutxsAZll+/4pqEkDAuF6vodVqhfl8HqbTaej1ehES99/JkgB6JwDaXJPkIPINuQa1rFar2FlfLpd49Rz0f0tIyOQf8pDA4R5HkneyJAoCACoi/1DmORcBq4wB+Xg8RuCMTbc8GAzKDFnob8vNusArSNRlbb/fRziMgwKBzj2gUQBSqjI5oLJwdrtdPKGjmvF4HFsGANEykOPW63WYzWbJINW6igGBry+Ag1LopzBUCRQSPjmOQkBrkcJqCwg45/M5wgFGPocRVtwHGopCSSkgJQeEAjhysADyRpFF8DxwpNH8KY9JEwoklMTV0pLlICoXC812zvwOMMq9hEt2Mdm/kTAivDST9oGx2QigWVkSQOwicLgSGqPRKIYKC6BU4+ObP/n2j8UAh8XJ+e3VxEsCx0Sx8YPBD3NAqIT8QShx/mJ3xQBFYsV/OBwiDPyiHODg/23pBhK5iU2wMlNA7B55hgXnFSITJrRoIFERfQyq4XnUVgaOjM8mAInxLUwP8IJvAQw9C4YqsuGTH0KSL7BQDXD4/dWwyo8rn396tzxT9GqmIGRNQgUOStCMXSaUCDXMclHau1/xmwF6pepkJ1hXMDJHM0DkFVTxaWaWgz4RDpttBujTlCPrMQNEqa6LWc7FDBA9TV3Mci5mgGjM6GmqNuZg1SSyFrMqRrO3XC7j2avIATMFSI431ptkBkgWbD1BGbeqq1mIVbWA1O91QAphB+SAFAKK2xXkgBQCitsV5IAUAorbFeSAFAKK2xXkgBQCitsV5IAUAorbFeSAFAKK2xXkgBQCivsfyCJpfDr7XA0AAAAASUVORK5CYII=",
            filterSpLabel: "适用渠道",
            filterStatusLabel: "全部状态"
        };
    },
    created() {
        // this.userCoInf = userCoInf;
    },
    methods: {
        hasAddPriceRuleAuth() {
            return utils.hasAuth('hasAddPriceRuleAuth');
        },
        handleSizeChange(val) {
            this.$emit("pageSizeChange", val);
        },
        // 当前页码发生变化
        handleCurrentChange(val) {
            this.$emit("pageChange", val);
        },
        // 跳转到新增定价页面
        gotoAddPrice() {
            let _this = this;
            let gotoAddUrl = this.$props.gotoAddUrl;
            typeof gotoAddUrl == "string"
                ? _this.$router.push(gotoAddUrl)
                : gotoAddUrl.params
                    ? _this.$router.push({
                        name: gotoAddUrl.name,
                        params: gotoAddUrl.params
                    })
                    : _this.$router.push({
                        name: gotoAddUrl.name
                    });
        },
        // 查看规则详情
        seeDetail({ ruleId }) {
            let _this = this;
            let { name } = _this.$props.detailUrl;
            _this.$router.push({ name: name, query: { ruleId } });
        },
        /**
         * 获取一级分类名称
         * @param {Array} list 每一行分类范围数据
         * @returns
         */
        getCategoryOneName(object) {
            return utils.getScopeStr(object);
        },

        /**
         * 格式化时间
         * @param {Object} row 表格每一行的数据
         * @returns
         */
        formatter(row) {
            return utils.dateFormater("YYYY-MM-DD HH:mm:ss", row.updateTime);
        },
        // 获取定价规则详情
        getRuleInfo({ priceType, settlePricePercentage, settlePriceFloatingValue }) {
            //结算价格基数：0-供应商销售价，1-供应商结算价
            let typeTemp = new Map([
                [0, "供应商销售价"],
                [1, "供应商结算价"]
            ]);
            let tempStr =
                settlePriceFloatingValue >= 0
                    ? ` ${typeTemp.get(
                        Number(priceType)
                    )}*${settlePricePercentage}%+${settlePriceFloatingValue}`
                    : ` ${typeTemp.get(
                        Number(priceType)
                    )}*${settlePricePercentage}%${settlePriceFloatingValue}`;
            return tempStr;
        },
        // 改变筛选条件触发请求
        changeData(value) {
            if (value.channelId) {
                let defaultSp = [
                    {
                        value: null,
                        text: "适用渠道"
                    }
                ];
                let tempObject = value.channelId.length
                    ? this.spFilters.filter(item => item.value == value.channelId[0])
                    : defaultSp;
                this.selectedSp = tempObject[0].value;
                this.filterSpLabel = tempObject[0].text;
            } else {
                let defaultStatus = [
                    {
                        value: null,
                        text: "全部状态"
                    }
                ];
                let tempObject = value.state.length
                    ? this.statusList.filter(
                        item => item.value == value.state[0]
                    )
                    : defaultStatus;
                this.selectedState = tempObject[0].value;
                this.filterStatusLabel = tempObject[0].text;
            }
            this.$emit("filterChange", {
                sp: this.selectedSp,
                state: this.selectedState
            });
        }
    },
    watch: {
        tableList() {
            return this.$props.tableList;
        },
        spFilters() {
            return this.$props.spFilters;
        },
        pageObject() {
            return this.$props.pageObject;
        }
    }
};
</script>

<style lang="less">
@import "./filterTable.less";
</style>