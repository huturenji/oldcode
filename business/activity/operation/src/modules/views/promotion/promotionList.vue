<template>
    <div class="promotionListBox">
        <el-table v-show="isShowModal"
            :data="tableDataList"
            max-height="625"
            class="promotionListBox_content"
            @filter-change="changeData"
            @sort-change="changeSort"
            header-row-class-name="promotionListBox_content_header"
        >
            <el-table-column 
                prop="activityId"
                label="编号"
                :show-overflow-tooltip="true"
                min-width="100"
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
                label="全部客户"
                :show-overflow-tooltip="true"
                min-width="110"
            >
            </el-table-column>
            <el-table-column 
                label="抽奖活动名称"
                prop="name" 
                :show-overflow-tooltip="true"
                min-width="140"
            >
            </el-table-column>
            <el-table-column 
                prop="toolId" 
                label="全部抽奖形式"
                :show-overflow-tooltip="true"
                min-width="80"
                :filters="promotionTypeList"
                :filter-multiple="false"
                :column-key="'toolId'"
            >
            <template slot-scope="scope">
                <span>
                    {{ promotionTypes[scope.row.toolId] }}
                </span>
            </template>
            </el-table-column>
            <el-table-column 
                prop="totalDrawSum" 
                label="抽奖次数"
                :show-overflow-tooltip="true"
                min-width="50"
            >
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="创建时间"
                width="120"
                :formatter="formatterCreatTime"
                sortable='custom'
            >
            </el-table-column>
            <el-table-column
                prop="startTime"
                label="启用时间"
                width="120"
                sortable='custom'
                :column-key="'startTime'"
            >
            <template slot-scope="scope"><span>{{scope.row.startTime?formatterUseTime(scope.row):'---'}}</span></template>
            </el-table-column>
            <el-table-column 
                label="全部状态"
                min-width="70"
                label-class-name="promotionListBox_content_label"
                :filters="statusList"
                :filter-multiple="false"
                :column-key="'state'"
            >
                <template slot-scope="scope">
                    <span class="circleDot" :class="[scope.row.state==1?'promotionListBox_content_ready':scope.row.state==2?'promotionListBox_content_started':'promotionListBox_content_stop']"></span>
                    <span>
                        {{ scope.row.state==1?'待启用':scope.row.state==2?'已启用':'已结束'}}
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <div 
            class="promotionListBox_pagination"
            v-if="isShowModal && pageObject.total"
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
        <noAuth :isShowModal="!isShowModal" />
    </div>
</template>

<script>
import promotionHandler from "bislibs/requestHandler/promotionHandler";
import {dateFormater} from "bislibs/utils/utils.js"
import {eventlistenerhandler } from "opcl";
import noAuth from "biscomponents/customer/noAuth.vue"; 
export default {
    props: {
        
    },
    components: {
       noAuth
    },
    data() {
        return {
            tableDataList:[],
            statusList: [ //状态筛选值集合
                {
                    value: "1",
                    text: "待启用"
                },
                {
                    value: "2",
                    text: "已启用"
                },
                {
                    value: "3",
                    text: "已结束"
                }
            ],
            promotionTypeList: [ //抽奖活动名称筛选值集合
                {
                    value: "1",
                    text: "大转盘"
                },
                {
                    value: "2",
                    text: "砸金蛋"
                },
                {
                    value: "3",
                    text: "九宫格"
                },
                {
                    value: "4",
                    text: "红包雨"
                },
                {
                    value: "5",
                    text: "现场开奖"
                }               
            ],
            promotionTypes :{"-10":"全部抽奖形式", "1": "大转盘","2": "砸金蛋","3": "九宫格","4": "红包雨","5": "现场开奖"},
            promotionCompanyList:[], //客户筛选值集合
            selectedState: null, //状态筛选条件
            selectedType:null, //抽奖活动名称筛选条件
            selectedCompany:null, //客户筛选条件
            pageSize:10,
            pageObject:{}, //分页参数
            sorts:[], //排序字段入参
            isShowModal:true //判断是否有权限查看活动列表
        };
    },
    created() {
        this.seePromotiomList();
        if (this.isShowModal){
            this.getPromotionList();
        }
    },
    methods: {
        // 判断是否有权限查看活动列表
        seePromotiomList() {
            this.isShowModal = eventlistenerhandler.hasAuth('seePromotiomList');
        },
        // 格式化时间
        formatterCreatTime(row) {
            let tempTime = new Date(row.createTime).getTime();
            return dateFormater("YYYY/MM/DD", tempTime,false);
        },
        formatterUseTime(row){
            let tempTime = new Date(row.startTime).getTime();
            return dateFormater("YYYY/MM/DD", tempTime,false);
        },
        // 获取活动列表
        getPromotionList(pageIndex) {
            let requestData = {
                pageIndex: pageIndex || 1,
                pageSize: this.pageSize
            };
            this.selectedState && (requestData.state = parseInt(this.selectedState)) ; //增加状态筛选条件
            this.selectedType && (requestData.toolId = parseInt(this.selectedType)) ; //增加抽奖活动名称筛选条件
            this.sorts.length>0 && (requestData.sorts = this.sorts); //排序
            this.$iLoading.show();
            promotionHandler.getPromotionList(requestData).then(res => {
                    if (res.resultCode === 0) {
                        this.tableDataList = res.result.list;
                        this.setPageObjectByData({
                            totalItems: res.result.total,
                            totalPages: res.result.pageCount,
                            pageSize:this.pageSize,
                            pageIndex
                        });
                        
                    } else {
                        
                    }
                })
                .catch(err => {
                    console.log(err);
                }).finally(()=>{
                    this.$iLoading.hide();
                })
        },
    
        // 设置分页数据
        setPageObjectByData({ totalPages, totalItems, pageSize, pageIndex }) {
            this.$set(this.pageObject, "pageCount", totalPages);
            this.$set(this.pageObject, "total", totalItems);
            this.$set(this.pageObject, "currentPage", pageIndex || 1);
            this.$set(this.pageObject, "pageSize", pageSize);
        },
        // 当前页码变化请求数据
        handleCurrentChange(currentPage) {
            this.getPromotionList(currentPage);
        },
        // 每页数量改变时
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getPromotionList(1);
        },
        // 改变筛选条件触发请求
        changeData(value) {
            if (value.toolId) {
                let defaultProType = [
                    {
                        value: null,
                        text: "全部抽奖形式"
                    }
                ];
                let tempObject = value.toolId.length
                    ? this.promotionTypeList.filter(
                        item => item.value == value.toolId[0]
                    )
                    : defaultProType;
                this.selectedType = tempObject[0].value;
            } else if(value.state){
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
                
            } 
            this.getPromotionList();
        },
        // 时间排序
        changeSort(column){
            this.sorts = [];
            let tempOrder =  column.order=="descending"?'DESC':'ASC';
            this.sorts.push({direction:tempOrder,field:column.prop})
            this.getPromotionList();
        },
        // 复制链接 干掉了
        // copyId(row){
        //     let str = window.location.origin+'/activitystudio/static/mobile/index.html#/pages/luck-draw/luck-draw?activityId='+row.activityId;
        //     copyText(str);
        // }
    }
};
</script>

<style lang="less">
.promotionListBox{
    padding: 24px 0 0;
    background: #fff;
    min-height: 100%;
    .promotionListBox_header{
        margin: 20px 0;
    }
    .el-table tr th:first-child .cell {
        padding-left: 24px;
    }
    .el-table tr td:first-child .cell {
        padding-left: 24px;
    }
    .row_copy{
        padding: 0;
    }
    &_content {
        width: 100%;
        overflow-x: hidden;
        border: 1px solid #EBEEF5;
        border-radius: 4px; 
        &_started{
            background: #23C343;
        }
        &_stop{
            background: #E5E6E8;
        }
        &_ready{
            background: #FF9A2E;
        }
        .circleDot{
            margin-bottom: 2px;
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 6px;
        }
    }
    &_pagination{
        display: flex;
        justify-content: flex-end;
        margin: 22px 15px 0 0;
    }
    .promotionListBox_content_header{
        th{
            background: rgb(247,248,250);
        }   
    }

}

</style>