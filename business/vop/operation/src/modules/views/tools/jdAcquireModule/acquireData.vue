<template>
    <div class="gather_data_box">
        <div class="filed_box">
            <div class="filed_con">
                <div class="filed_item">
                    <span>创建时间</span>
                    <el-date-picker
                        v-model="gatherDataFieldObj.createTime"
                        type="datetimerange"
                        start-placeholder="开始日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00']"
                    >
                    </el-date-picker>
                </div>
                <div class="filed_item">
                    <span>任务类型</span>
                    <el-select
                        v-model="gatherDataFieldObj.type"
                        clearable
                        placeholder="请选择任务类型"
                    >
                        <el-option
                            v-for="item in gatherDataSortObj.typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div class="filed_item">
                    <span>任务状态</span>
                    <el-select
                        v-model="gatherDataFieldObj.state"
                        clearable
                        placeholder="请选择任务状态"
                    >
                        <el-option
                            v-for="item in gatherDataSortObj.stateOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div class="filed_item">
                    <span>任务ID</span>
                    <el-input
                        placeholder="请输入任务ID"
                        maxlength="100"
                        v-model="gatherDataFieldObj.id"
                    ></el-input>
                </div>
            </div>
            
            <div>
                <el-button
                    type="primary"
                    @click="submit"
                >
                    查询
                </el-button>
                <el-button
                    @click="reset"
                >
                    重置
                </el-button>
            </div>
        </div>

        <!-- 任务列表 -->
        <div>
            <el-table
                :data="gatherTaskList"
                max-height="550px"
                style="width: 100%"
            >
                <el-table-column
                    prop="id"
                    label="任务编号"
                    min-width="100"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="任务名称"
                    min-width="90"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    min-width="120"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="任务类型"
                    min-width="60"
                    :show-overflow-tooltip="true"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.type == 1?'价格':'评论' }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="source"
                    label="任务来源"
                    min-width="60"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="count"
                    label="数据总数"
                    min-width="80"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="expectTime"
                    label="期望启动时间"
                    min-width="120"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="intervalDays"
                    label="调度间隔天数"
                    min-width="60"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="times"
                    label="调度次数"
                    min-width="60"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="state"
                    label="任务状态"
                    min-width="60"
                    :show-overflow-tooltip="true"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.state == 1?'未启动':scope.row.state == 2?'已启动':scope.row.state == 3?'已结束':'已终止' }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="priority"
                    label="任务优先级"
                    min-width="60"
                    :show-overflow-tooltip="true"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.priority == 1?'排队执行':'插队执行' }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="340"
                    :show-overflow-tooltip="true"
                >
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            class="gather_task_btn"
                            @click="searchScheduleList(scope.row.id)"
                        >
                            调度详情
                        </el-button>
                        <el-button
                            size="mini"
                            class="gather_task_btn"
                            @click="endGatherTask(scope.row)"
                            :class="{gray:(scope.row.state == 3 || scope.row.state == 4)}"
                        >
                            终止任务
                        </el-button>
                        <el-button
                            size="mini"
                            class="gather_task_btn"
                            @click="delGatherTask(scope.row.id)"
                        >
                            删除任务
                        </el-button>
                        <el-button
                            size="mini"
                            class="gather_task_btn"
                            @click="copyGatherTask(scope.row)"
                        >
                            复制任务
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div
                class="pages"
                v-if="gatherTaskList.length>0"
            >
                <el-pagination
                    background
                    @size-change="pSizeChange"
                    @current-change="changePage"
                    :current-page="gatherTaskPageObj.currentPage"
                    :page-sizes="gatherTaskPageObj.pageSizeOpts"
                    :page-size="gatherTaskPageObj.pageSize"
                    :page-count="gatherTaskPageObj.pageCount"
                    :total="gatherTaskPageObj.totalNum"
                    layout="total, prev, pager, next, jumper,sizes"
                >
                </el-pagination>
            </div>
        </div>

        <!-- 调度列表 -->
        <el-dialog
            title="调度列表"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            :visible.sync="showScheduleListFlag"
            width="1330px"
            center
        >
            <el-table
                :data="scheduleList"
                style="width: 100%"
                height="400"
            >
                <el-table-column
                    prop="id"
                    label="调度编号"
                    min-width="100"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="planTime"
                    label="计划时间"
                    min-width="100"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="startTime"
                    label="开始时间"
                    min-width="100"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="endTime"
                    label="结束时间"
                    min-width="100"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="planCount"
                    label="计划处理数据总数"
                    width="100"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="actualCount"
                    label="实际处理成功总数"
                    width="100"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="offset"
                    label="调度偏移量"
                    width="100"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="state"
                    label="调度状态"
                    width="80"
                    :show-overflow-tooltip="true"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.state == 1?'未启动':scope.row.state == 2?'已启动':scope.row.state == 3?'已挂起':scope.row.state == 4?'已结束':'已终止' }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="操作"
                    min-width="100"
                >
                    <template slot-scope="scope">
                        <!-- <el-button size="mini" class="gather_task_btn" @click="startSchedule(scope.row.id)">立即调度</el-button> -->
                        <el-button
                            size="mini"
                            class="gather_task_btn"
                            @click="endSchedule(scope.row)"
                            :class="{gray:(scope.row.state == 4 || scope.row.state == 5)}"
                        >
                            终止调度
                        </el-button>
                        <el-button
                            size="mini"
                            class="gather_task_btn"
                            @click="delSchedule(scope.row.id)"
                        >
                            删除调度
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 复制任务弹框 -->
        <el-dialog
            title="复制任务"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            :visible.sync="showCopyDialogFlag"
            width="600px"
            center
        >
            <div class="copy_dialog">
                <div class="top">
                    <div>
                        <span>任务名称</span>
                        <el-input
                            type="text"
                            maxlength="-1"
                            placeholder="请输入任务名称"
                            v-model="copyTaskObj.name"
                        >
                        </el-input>
                    </div>
                    <div>
                        <span>期望启动时间</span>
                        <el-date-picker
                            v-model="copyTaskObj.expectTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择启动时间"
                            default-time="00:00:00"
                        >
                        </el-date-picker>
                    </div>
                    <div>
                        <span>调用间隔天数</span>
                        <el-input-number
                            v-model="copyTaskObj.intervalDays"
                            :min="1"
                        ></el-input-number>
                        <span :style="{paddingLeft:'10px'}">天</span>
                    </div>
                    <div>
                        <span>调度次数</span>
                        <el-input-number
                            v-model="copyTaskObj.times"
                            :min="1"
                        ></el-input-number>
                    </div>
                </div>
                <div class="bottom">
                    <el-button
                        type="primary"
                        @click="copyTask"
                    >
                        保存
                    </el-button>
                    <el-button
                        @click="closeCopyDialog"
                    >
                        取消
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import producthandler from "bislibs/requestHandler/producthandler";
import utils from "bislibs/utils";
export default {
    data() {
        return {
            gatherDataFieldObj:{
                createTime:'',
                type:'',
                state:'',
                id:''
            },
            gatherDataSortObj:{
                typeOptions:[{value:'1',label:'根据价格查询'},{value:'2',label:'根据评论查询'}],
                stateOptions:[{value:'1',label:'未启动'},{value:'2',label:'已启动'},{value:'3',label:'已结束'},{value:'4',label:'已终止'}]
            },
            gatherTaskPageObj:{ //数据采集任务列表分页参数
                pageSize: 10, 
                currentPage: 1,
                pageCount:0,
                pageSizeOpts: [5, 10, 20, 50, 100],
                totalNum:0
            },
            currTaskId:'', //当前点击查看调度详情的任务Id
            gatherTaskList:[], //数据采集任务列表
            scheduleList:[], //调度列表
            showScheduleListFlag:false, //是否显示调度列表
            showCopyDialogFlag:false, //是否显示复制任务弹框
            copyTaskObj:{ //复制任务入参集合
                taskId:'',
                name:'',
                expectTime:'',
                intervalDays:'',
                times:''
            }
        };
    },
    
    components: {},
    props: {},
    watch:{
        
    },
    mounted(){
        this.searchGatherDataTaskList()
    },
        
    
    methods: {
        submit() {
            this.searchGatherDataTaskList()
        },
        reset() {
            this.gatherDataFieldObj = {
                createTime:'',
                type:'',
                state:'',
                id:''
            }
            this.gatherTaskPageObj.pageSize = 10;
            this.gatherTaskPageObj.currentPage = 1;
            this.gatherTaskList = []
            this.searchGatherDataTaskList()
        },
        //数据采集任务列表页码变化
        changePage(page) {
            var _this = this;
            _this.gatherTaskPageObj.currentPage = page;
            _this.searchGatherDataTaskList(false);
        },
        //数据采集任务列表每页显示条数变化
        pSizeChange(pSize) {
            var _this = this;
            _this.gatherTaskPageObj.pageSize = pSize;
            _this.gatherTaskPageObj.currentPage = 1;
            _this.searchGatherDataTaskList(false);
        },
        // 查询数据采集任务列表
        searchGatherDataTaskList(flag=true) {
            if (this.gatherDataFieldObj.id || (flag && (this.gatherDataFieldObj.createTime || this.gatherDataFieldObj.type || this.gatherDataFieldObj.state))) {
                this.gatherTaskPageObj.pageSize = 10;
                this.gatherTaskPageObj.currentPage = 1;
            }
            let params = {
                pageSize:this.gatherTaskPageObj.pageSize,
                pageIndex:this.gatherTaskPageObj.currentPage
            }
            if (this.gatherDataFieldObj.createTime) {
                params.createTimeStart = this.gatherDataFieldObj.createTime[0]
                params.createTimeEnd = this.gatherDataFieldObj.createTime[1]
            }
            if (this.gatherDataFieldObj.type) {
                params.type = this.gatherDataFieldObj.type
            }
            if (this.gatherDataFieldObj.state) {
                params.state = this.gatherDataFieldObj.state
            }
            if (this.gatherDataFieldObj.id) {
                params.id = this.gatherDataFieldObj.id
            }
            if (!/^[0-9]*$/.test(this.gatherDataFieldObj.id)) {
                utils.showToast("请输入合法的任务id");
                return
            }
            this.$iLoading.show();
            producthandler.getGatherTaskList(params).then((res) => {
                this.$iLoading.hide();
                if (!!res.result && res.resultCode == 0){
                    this.gatherTaskList = res.result.list
                    this.gatherTaskPageObj.totalNum = res.result.total
                } else {
                    utils.showToast(res.resultMessage);
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        // 终止数据采集任务
        endGatherTask(data) {
            if (data.state == 3 || data.state == 4) {
                return
            }
            let params = {
                taskId:data.id
            }
            this.$iLoading.show();
            producthandler.endTask(params).then((res) => {
                this.$iLoading.hide();
                if (res.resultCode == 0){
                    utils.showToast('终止成功');
                    if (!this.gatherDataFieldObj.state) {
                        this.gatherTaskPageObj.currentPage = 1;
                        this.gatherTaskPageObj.pageSize = 10;
                    }
                    this.searchGatherDataTaskList()
                } else {
                    utils.showToast(res.resultMessage);
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        // 删除数据采集任务
        delGatherTask(taskId) {
            let params = {
                taskId:taskId
            }
            this.$iLoading.show();
            producthandler.delTask(params).then((res) => {
                this.$iLoading.hide();
                if (res.resultCode == 0){
                    utils.showToast('删除成功');
                    this.gatherTaskPageObj.currentPage = 1;
                    this.gatherTaskPageObj.pageSize = 10;
                    this.searchGatherDataTaskList()
                } else {
                    utils.showToast(res.resultMessage);
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },

        // 查询调度列表
        searchScheduleList(taskId) {
            let params = {
                taskId:taskId
            }
            this.currTaskId = taskId
            this.$iLoading.show();
            producthandler.getScheduleList(params).then((res) => {
                this.$iLoading.hide();
                if (!!res.result && res.resultCode == 0){
                    this.scheduleList = res.result
                    this.showScheduleListFlag = true
                } else {
                    utils.showToast(res.resultMessage);
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        // 打开复制任务弹框
        copyGatherTask(data) {
            this.copyTaskObj.taskId = data.id;
            this.copyTaskObj.intervalDays = data.intervalDays;
            this.copyTaskObj.times = data.times;
            this.showCopyDialogFlag = true
        },
        // 点击保存复制任务
        copyTask() {
            let params = {
                taskId:this.copyTaskObj.taskId,
                expectTime:this.copyTaskObj.expectTime,
                name:this.copyTaskObj.name,
                intervalDays:this.copyTaskObj.intervalDays,
                times:this.copyTaskObj.times
            }
            this.$iLoading.show();
            producthandler.copyGatherTask(params).then((res) => {
                this.$iLoading.hide();
                if (!!res.result && res.resultCode == 0){
                    utils.showToast('复制成功');
                    this.gatherTaskPageObj.currentPage = 1;
                    this.gatherTaskPageObj.pageSize = 10;
                    this.searchGatherDataTaskList()
                    this.showCopyDialogFlag = false
                } else {
                    utils.showToast(res.resultMessage);
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        closeCopyDialog() {
            this.showCopyDialogFlag = false
        },
        // 立即调度
        startSchedule() {
            
        },
        // 终止调度
        endSchedule(data) {
            if (data.state == 4 || data.state == 5) {
                return
            }
            let params = {
                scheduleId:data.id
            }
            this.$iLoading.show();
            producthandler.endSchedule(params).then((res) => {
                this.$iLoading.hide();
                if (res.resultCode == 0){
                    utils.showToast('终止成功');
                    this.searchScheduleList(this.currTaskId)
                } else {
                    utils.showToast(res.resultMessage);
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        // 删除调度
        delSchedule(scheduleId) {
            let params = {
                scheduleId:scheduleId
            }
            this.$iLoading.show();
            producthandler.delSchedule(params).then((res) => {
                this.$iLoading.hide();
                if (res.resultCode == 0){
                    utils.showToast('删除成功');
                    this.searchScheduleList(this.currTaskId)
                } else {
                    utils.showToast(res.resultMessage);
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        } 
    }
}
</script>

<style scoped lang="less">
.gather_data_box {
    .filed_box {
        padding: 15px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .filed_con {
            display: flex;
            align-items: center;
            .filed_item {
                margin-left: 20px;
                display: flex;
                align-items: center;
                &:first-of-type {
                    margin-left: 10px;
                    /deep/ .el-input__icon {
                        line-height: 25px !important;
                    }
                }
                span {
                    margin-right: 10px;
                }
                /deep/ .el-input__inner {
                    height: 30px !important;
                    line-height: 30px;
                }
                .el-date-editor {
                    width: 200px !important;
                }
                .el-select {
                    width: 160px !important;
                }
                .el-input {
                    width: 160px !important;
                }
                /deep/ .el-input__icon {
                    line-height: 30px !important;
                }
            }
        }
        .el-button {
            padding: 7px 20px;
        }
        
    }
    .gather_task_btn {
        width: 60px;
        padding: 4px 0;
        &.gray {
            color: #999999 !important;
            background: #dddbdb;
            border-color: #dddbdb;
            cursor: auto;
        }
    }
    .pages{
        margin-top: 15px;
        text-align: right;
    }
}
.copy_dialog {
    .top {
        >div {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            >span {
                width: 100px;
                span {
                    color: #f30300;
                }
            }
            .el-input {
                width: 400px;
            }
        }
    }
    .bottom {
        padding: 0px 0 20px;
        text-align: center;
    }
}
    
</style>

