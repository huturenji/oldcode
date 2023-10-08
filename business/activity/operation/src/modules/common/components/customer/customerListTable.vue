<template>
    <div class="customerListBox">
        <div class="customerListBox_header" v-if="isShowAddCount">
            <div class="customerListBox_header_right">
                <el-button
                    type="primary" 
                    icon="el-icon-plus" 
                    @click="gotoAddCount"
                    class="addCount"
                >新增账号</el-button>
            </div>
        </div>
        <el-table
            :data="tableList"
            max-height="625"
            class="customerListBox_content"
            @filter-change="changeData"
            header-row-class-name="customerListBox_content_header"
        >
            <el-table-column 
                prop="index"
                label="序号"
                min-width="60"
            >
            </el-table-column>
            <el-table-column 
                prop="mobile" 
                label="手机号"
                min-width="100"
                :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column 
                prop="companyName" 
                label="企业名称"
                :show-overflow-tooltip="true"
                min-width="130"
            >
            </el-table-column>
            
            <el-table-column
                prop="createTime"
                label="创建时间"
                min-width="130"
                :show-overflow-tooltip="true"
                :formatter="formatter"
            >
            </el-table-column>
            <el-table-column 
                label="全部状态"
                min-width="70"
                label-class-name="customerListBox_content_label"
                :filters="statusList"
                :filter-multiple="false"
                :column-key="'state'"
            >
                <template slot-scope="scope">
                    <span class="circleDot" :class="[scope.row.state==0?'customerListBox_content_unChecked':scope.row.state==1?'customerListBox_content_normal':'customerListBox_content_havedFreezed']"></span>
                    <span>
                        {{ scope.row.state==0?'待审核':scope.row.state==1?'正常':'已冻结'}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column 
                label="操作"
                min-width="60"
            >
                <template slot-scope="scope">
                    <el-button class="row_detail"
                        type="text"
                        @click="seeDetail(scope.row)"
                    >
                        详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div 
            class="customerListBox_pagination"
            v-if="pageObject.total"
        >
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pageObject.currentPage"
                :page-sizes="[10,20,30,40,50,100]"
                :pager-count="5"
                :page-count="pageObject.pageCount"
                :page-size="pageObject.pageSize"
                layout="total,prev, pager, next,jumper,sizes"
                :total="pageObject.total"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import {dateFormater} from "bislibs/utils/utils.js"
import {eventlistenerhandler } from "opcl";
export default {
    props: {
        tableList: { //表格数据
            type: Array,
            default: () => {
                return [];
            }
        },
        pageObject: { //分页参数
            type: Object,
            default: () => {
                return {};
            }
        },
        detailUrl: { //去详情路由
            type: [String, Object],
            default: ""
        },
        gotoAddUrl: { //去新增页面路由
            type: [String, Object],
            default: ""
        },
    },
    data() {
        return {
            statusList: [ //状态筛选值集合
                {
                    value: "0",
                    text: "待审核"
                },
                {
                    value: "1",
                    text: "正常"
                },
                {
                    value: "2",
                    text: "已冻结"
                }
            ],
            selectedState: null, //状态筛选条件
            isShowAddCount:true, //判断是否有显示新增客户
        };
    },
    created() {
        this.hasAddCountAuth();
    },
    methods: {
        // 判断是否有权限新增客户
        hasAddCountAuth() {
            this.isShowAddCount = eventlistenerhandler.hasAuth('hasAddCountAuth');
        },
        // 每页数量改变时
        handleSizeChange(val) {
            this.$emit("pageSizeChange", val);
        },
        // 当前页码发生变化
        handleCurrentChange(val) {
            this.$emit("pageChange", val);
        },
        // 改变筛选条件触发请求
        changeData(value) {
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
            this.$emit("filterChange", {
                state: this.selectedState
            });
        },
        // 查看账户详情
        seeDetail({ userId }) {
            let _this = this;
            let { name } = _this.$props.detailUrl;
            _this.$router.push({ name: name, query: { userId } });
        },
        // 跳转到新增账号页面
        gotoAddCount() {
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
        // 格式化时间
        formatter(row) {
            return dateFormater("YYYY/MM/DD", row.createTime,false);
        },
    },
    watch: {
        
    }
};
</script>

<style lang="less">
.customerListBox{
    background: #ffffff;
    height: 100%;
    .customerListBox_header{
        padding: 24px 0 12px 24px;
        .addCount{
            background: #409EFF;
        }
    }
    .el-table tr th:first-child .cell {
        padding-left: 24px;
    }
    .el-table tr td:first-child .cell {
        padding-left: 24px;
    }
    &_content {
        width: 100%;
        overflow-x: hidden;
        border: 1px solid #EBEEF5;
        border-radius: 4px; 
        &_unChecked{
            // color: #f0ba09;
            background: #C9CDD4;
        }
        &_normal{
            // color: #008000;
            background: #23C343;
        }
        &_havedFreezed{
            // color: #FB6041;
            background: #F76560;
        }
        .circleDot{
            margin-bottom: 2px;
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 6px;
        }
    }
    .row_detail{
        padding: 0;
    }
    &_pagination{
        display: flex;
        justify-content: flex-end;
        margin: 22px 15px 0 0;
    }
    .customerListBox_content_header{
        th{
            background: rgb(247,248,250);
        } 
    }
}


</style>