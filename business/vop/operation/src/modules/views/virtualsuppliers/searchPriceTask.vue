<template>
    <div 
        class="priceTask" 
        @click="hideDeleteBtn"
    >
        <div class="add_task">
            <el-button
                type="primary"
                @click="addTask"
            >
                +新建任务
            </el-button>
        </div>
        <div class="task_main">
            <div class="left">
                <el-input
                    class="skuList"
                    placeholder="任务名称/任务ID"
                    maxlength="-1"
                    suffix-icon="el-icon-search"
                    v-model="searchInput"
                >
                </el-input>
                <div class="task_list">
                    <div 
                        v-for="(item,index) in taskList"
                        :key="item.taskId"
                        class="task_item"
                        :class="{active:currentIndex==index}"
                        @click="selectTask(index)"
                    >
                        <div class="task_id_box">
                            <div class="task_id">
                                ID:{{ item.taskId }}
                            </div>
                            <div 
                                class="delete_task" 
                                @click.stop="showDeleteBtn(item.taskId)"
                            >...</div>
                            <div 
                                class="delete_message" 
                                v-show="currentId==item.taskId"
                                @click.stop="deleteTask(item.taskId, index)"
                            >
                                删除
                            </div>
                        </div>
                        <div class="task_name">
                            {{ item.taskName }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="right">
                <div
                    class="task_title"
                    v-if="taskList.length>0"
                >
                    {{ taskList[currentIndex].taskName }}
                </div>
                <div
                    class="task_info"
                    v-if="taskList.length>0"
                >
                    <div class="info_item">
                        <div class="left_title">
                            任务ID：
                        </div>
                        <div class="right_con">
                            {{ taskList[currentIndex].taskId }}
                        </div>
                    </div>
                    <div class="info_item">
                        <div class="left_title">
                            创建时间：
                        </div>
                        <div class="right_con">
                            {{ formatter(taskList[currentIndex].createTime) }}
                        </div>
                    </div>
                    <div class="info_item">
                        <div class="left_title">
                            更新时间：
                        </div>
                        <div class="right_con">
                            {{ formatter(taskList[currentIndex].updateTime) }}
                        </div>
                    </div>
                </div>
                <div class="operate_btn">
                    <el-button
                        type="primary"
                        @click="setTaskState(taskList[currentIndex].state)"
                    >
                        {{ taskList.length>0?taskList[currentIndex].state=="DISABLE"?"启动更新":"暂停更新":'启动更新' }}
                    </el-button>
                    <el-button
                        type="primary"
                        class="export_btn"
                        @click="exportTaskSkuInfo"
                    >
                        导出数据
                    </el-button>
                </div>
                <div class="invalid_tips">
                    注：红色标注的为失效商品
                </div>
                <div class="goods_info">
                    <el-table
                        :data="showGoodsData"
                        :highlight-current-row="true"
                        :row-class-name="tableRowClassName"
                    >
                        <el-table-column
                            prop="skuName"
                            label="商品名称"
                            width="200"
                            show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                            prop="sku"
                            label="SKU编号"
                            width="150"
                            show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                            prop="mallPrice"
                            label="商城销售价"
                            width="80"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="settlementPrice"
                            label="结算价"
                            width="80"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="referPrice"
                            label="参考价"
                            width="80"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="recentPrice"
                            label="最近更新京东售价"
                            width="100"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="lastPrice"
                            label="上次更新京东售价"
                            width="100"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="changeHint"
                            label="变动提示"
                            width="200"
                            show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                            prop="recentDiscountInfo"
                            label="最近更新优惠信息"
                            width="300"
                            show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                            prop="lastDiscountInfo"
                            label="上次更新优惠信息"
                            show-overflow-tooltip
                        >
                        </el-table-column>
                    </el-table>
                    <div 
                        class="pagingBox" 
                        v-show="goodsData.length>0"
                    >
                        <el-pagination
                            background
                            @size-change="pSizeChange"
                            @current-change="changePage"
                            :current-page="currentPage"
                            :page-sizes="pageSizeOpts"
                            :page-size="pageSize"
                            layout="total, prev, pager, next, jumper,sizes"
                            :total="totalNum"
                        >
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            title="新建任务"
            :visible.sync="dialogVisible"
            width="600px"
            top="20vh"
            :modal-append-to-body="false"
        >
            <div class="add_con">
                <div class="add_item">
                    <div class="add_title">
                        任务ID
                    </div>
                    <el-input
                        placeholder="系统自动分配"
                        :disabled="true"
                    >
                    </el-input>
                </div>
                <div class="add_item">
                    <div class="add_title red">
                        任务名称
                    </div>
                    <el-input
                        placeholder="请输入任务名称，最多15个字"
                        v-model="taskName"
                    >
                    </el-input>
                </div>
                <div class="add_item">
                    <div class="add_title red">
                        上传文件
                    </div>
                    <div class="importExcel">
                        <label
                            for="excel_file"
                            class="add_file"
                        >
                            上传
                        </label>
                        <input
                            type="file"
                            id="excel_file"
                            @change="importFile"
                            multiple
                            v-show="false"
                        />
                    </div>
                    <div class="fileNameBox">
                        <div class="fileName">
                            {{ fileSheet && fileSheet.name || '暂未选择上传文件' }}
                        </div>
                        <div
                            class="cancel"
                            v-if="fileSheet.name"
                            @click="cancelFile"
                        >
                            <i class="el-icon-circle-close"></i>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div slot="footer">
                <el-button   
                    @click="cancelAdd()"
                >取消</el-button>
                <el-button  
                    type="primary" 
                    @click="confirm()"
                >确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import XLSX from 'xlsx'
import virtualHandler from "bislibs/requestHandler/virtualhandler.js";
import extendUtils from "bislibs/utils";
// import systemhandler from "bislibs/requestHandler/systemhandler";

export default {
    data() {
        return {
            currentIndex:0,
            currentId:'', //当前选中的任务id
            pageSize: 10, //表分页参数
            currentPage: 1,
            totalNum: 0,
            pageSizeOpts: [5, 10, 20, 50, 100],
            dialogVisible:false,
            inputFormats: [".xls", ".xlsx"],
            fileSheet:{
                type:XLSX
            },
            taskName:'', //新建的任务名称
            fileData:[],//上传文件转成的列表数据
            goodsData:[],
            showGoodsData:[],
            taskList:[],
            initTaskList:[],
            searchInput:'' //搜索内容
            
        };
    },
    
    components: {},
    props: {},   
    mounted(){
        this.searchTaskList()
        
    },
    watch: {
        searchInput: {
            handler: function(newVal) {
                this.search(newVal)
            },
            immediate: true,
            deep:true
        }
    },
        
    
    methods: {
        tableRowClassName({row}){
            if (row.state == 0) {
                return 'warning-row';
            }
        },
        search(val){
            if (val.trim()!='') {
                let tempArr = JSON.parse(JSON.stringify(this.initTaskList))
                this.taskList = tempArr.filter(item=>{
                    return item.taskId.toString().includes(val.trim()) || item.taskName.includes(val.trim())
                })
            } else {
                this.taskList = JSON.parse(JSON.stringify(this.initTaskList))
            }
        },
        // 启动/暂停更新
        setTaskState(state){
            let taskId = this.taskList[this.currentIndex].taskId;
            virtualHandler.setTaskState({taskId:taskId,state:state=="DISABLE"?"ENABLE":"DISABLE"}).then((res) => {
                this.$iLoading.hide();
                if (res.resultCode==0) {
                    this.searchTaskList()
                }
                extendUtils.showToast(res.resultMessage);
            }).catch(() => {
                    
            }).finally(()=>{
                this.$iLoading.hide();
            });
        },
        addTask(){
            this.fileSheet = {};
            this.taskName = '';
            this.dialogVisible = true;
        },
        cancelAdd(){
            this.dialogVisible = false;
        },
        // 新增任务
        confirm(){
            if (this.taskName.trim() == '') {
                extendUtils.showToast('请填写任务名称');
                return
            }
            if (this.fileData.length==0) {
                extendUtils.showToast('请上传文件');
                return
            }
            if (!Object.prototype.hasOwnProperty.call(this.fileData[0],'sku') || !Object.prototype.hasOwnProperty.call(this.fileData[0],'skuName')) {
                extendUtils.showToast("表格内部模板格式错误");
                return
            }
            this.dialogVisible = false;
            let param = {};
            param.skuBasicInfoList = this.fileData;
            param.supplierType = 'JD';
            param.taskName = this.taskName;
            virtualHandler.addTask(param).then((res) => {
                this.$iLoading.hide();
                if (res.resultCode==0) {
                    this.searchTaskList();
                }
                extendUtils.showToast(res.resultMessage);
            }).catch(() => {
                    
            }).finally(()=>{
                this.$iLoading.hide();
            }); 
        },
        // 查询任务列表
        searchTaskList(isCurrentIndexDel) {
            this.$iLoading.show();
            return new Promise(async (resolve, reject) => {
                virtualHandler.listTask({}).then(async (res) => {
                    this.$iLoading.hide();
                    if (res.resultCode==0) {
                        if (isCurrentIndexDel || res.result.taskInfoList.length < this.currentIndex + 1) {
                            this.currentIndex = 0
                        }
                        if (res.result.taskInfoList.length == 0) {
                            this.goodsData = []
                            this.showGoodsData = []
                        }
                        this.taskList = res.result.taskInfoList;
                        this.initTaskList = res.result.taskInfoList;
                        await this.searchTaskInfo();
                        resolve()
                    } else {
                        extendUtils.showToast(res.resultMessage);
                    }
                    
                }).catch(() => {
                    reject([])
                }).finally(()=>{
                    this.$iLoading.hide();
                }); 
            });
        },
        // 查询任务对应的商品信息
        searchTaskInfo(){
            if (this.taskList.length == 0 || !this.taskList[this.currentIndex].taskId) {
                return
            }
            this.$iLoading.show();
            let taskId = this.taskList[this.currentIndex].taskId;
            virtualHandler.listTaskSkuInfo({taskId:taskId}).then((res) => {
                this.$iLoading.hide();
                if (res.resultCode==0) {
                    this.goodsData = res.result.taskSkuInfoList;
                    this.showGoodsData = this.goodsData.slice(this.pageSize*(this.currentPage-1),this.pageSize*this.currentPage)
                    this.totalNum = res.result.taskSkuInfoList.length; //总条数
                } else {
                    extendUtils.showToast(res.resultMessage);
                }
            }).catch(() => {
                    
            }).finally(()=>{
                this.$iLoading.hide();
            });
        },
        // 时间格式化
        formatter(time) {
            return extendUtils.dateFormater("YYYY-MM-DD HH:mm:ss", time,false);
        },
        // 点击任务item
        selectTask(index) {
            this.currentIndex = index;
            this.searchTaskInfo();
        },
        // 删除任务
        deleteTask(taskId, index) {
            this.currentId = '';
            this.$confirm('删除后不可恢复，确定删除任务？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                this.deleteTaskFun(taskId, index === this.currentIndex)
            }).catch(() => {
                         
            });
        },
        deleteTaskFun(taskId, isCurrentIndexDel){
            this.$iLoading.show();
            // if (this.currentIndex == this.taskList.length - 1) {
            //     this.currentIndex = this.currentIndex - 1;
            // }
            virtualHandler.deleteTask({taskId:taskId}).then(async (res) => {
                this.$iLoading.hide();
                if (res.resultCode==0) {
                    await this.searchTaskList(isCurrentIndexDel)
                    // if (this.taskList.length == 0) {
                    //     this.goodsData = []
                    // }
                }
                extendUtils.showToast(res.resultMessage);
            }).catch(() => {
                    
            }).finally(()=>{
                this.$iLoading.hide();
            });
        },
        // 显示删除按钮
        showDeleteBtn(taskId){
            this.currentId = taskId;
        },
        // 隐藏删除按钮
        hideDeleteBtn(){
            this.currentId = '';
        },
        //每页显示条数变化
        pSizeChange(pSize) {
            var _this = this;
            _this.pageSize = pSize;
            _this.currentPage = 1;
            _this.showGoodsData = _this.goodsData.slice(_this.pageSize*(_this.currentPage-1),_this.pageSize*_this.currentPage)
        },
        //页码变化
        changePage(page) {
            var _this = this;
            _this.currentPage = page;
            _this.showGoodsData = _this.goodsData.slice(_this.pageSize*(_this.currentPage-1),_this.pageSize*_this.currentPage)
        },
        // 清空导入表格文件
        cancelFile(){
            this.fileSheet = {};
        },
        // 导入表格
        importFile(obj){
            if (!obj || !obj.target.files) {
                return;
            }
            const that = this;
            that.fileData = [];
            var wb; //读取完成的数据
            var f = obj.target.files[0];
            this.fileSheet = f;
            //格式校验
            if (
                f.name &&
                f.name.split(".").length > 1 &&
                that.inputFormats.indexOf("." + f.name.split(".")[1]) == -1
            ) {
                extendUtils.showToast("仅支持Excel格式");
                return;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                wb = XLSX.read(data, {
                    type: "binary"
                });
                let strs = JSON.stringify(
                    XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
                );
                let tempData = JSON.parse(strs.replaceAll("\\\\", "")); //去掉转义符号\);
                tempData.forEach(item=>{
                    that.fileData.push({
                        sku:item['sku'] || item['SKU'],
                        skuName:item['商品名称'],
                        mallPrice:item['商城销售价'] || null
                    })
                })
                // console.log("上传完成读取");
            };
            reader.readAsBinaryString(f);
            //默认清空value，否则多次上传一个没反应
            obj.target.value = "";
            extendUtils.showToast("导入成功")
        },
        // 导出生成链接
        exportTaskSkuInfo(){
            let that = this;
            if (this.taskList.length == 0 || !this.taskList[this.currentIndex].taskId) {
                return
            }
            that.$iLoading.show();
            let taskId = this.taskList[this.currentIndex].taskId;
            virtualHandler.exportTaskSkuInfo({taskId:taskId}).then((res) => {
                that.$iLoading.hide();
                if (res.resultCode==0){
                    let aDom = document.createElement('a');
                    aDom.style.display = 'none';
                    aDom.href = res.result;
                    aDom.setAttribute('download', res.result);
                    document.body.appendChild(aDom);
                    aDom.click();
                    document.body.removeChild(aDom);
                } else {
                    extendUtils.showToast(res.resultMessage);
                }
                
            }).catch(() => {     
            }).finally(()=>{
                that.$iLoading.hide();
            });
        }
    }
}
</script>

<style scoped lang="less">
.priceTask {
    padding: 20px 0 0 10px;
    .add_task{
        margin-bottom: 10px;
    }
    .task_main {
        display: flex;
    }
    .left {
        width: 200px;
        height: 700px;
        padding: 20px 5px;
        border-radius: 6px;
        border: 1px solid #e4e4e4;
        .task_item {
            padding: 10px;
            margin: 10px 0;
            background: #f2f2f2;
            &.active {
                background: #d7d7d7;
            }
            .task_id_box {
                position: relative;
                padding-bottom: 8px;
                font-size: 12px;
                .delete_task {
                    width: 20px;
                    position: absolute;
                    right: 0;
                    top: -10px;
                    text-align: right;
                    cursor: pointer;
                }
                .delete_message {
                    position: absolute;
                    right: 0;
                    top: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 50px;
                    height: 30px;
                    background: #fff;
                    border-radius: 4px;
                    font-size: 13px;
                }
                .task_id {
                    white-space: nowrap;
                    overflow: hidden;//文本超出隐藏
                    text-overflow: ellipsis;
                }
            }
            .task_name {
                font-size: 13px;
            }
        }
    }
    .right {
        flex: 1;
        padding-left: 10px;
        .task_title {
            padding-bottom: 15px;
            font-size: 14px;
        }
        .task_info {
            display: flex;
            font-size: 14px;
            padding-bottom: 20px;
            .info_item {
                display: flex;
                padding-right: 30px;
                .left_title {
                    color: #999999;
                }
            }
        }
        .operate_btn {
            padding-bottom: 10px;
        }
        .export_btn {
            background: #fff;
            color: #409EFF;
        }
        .invalid_tips {
            color: #f30300;
        }
        .goods_info {
            .pagingBox {
                margin-top: 20px;
                text-align: right;
            }
            /deep/ .el-table .warning-row {
                color: #f30300;
            }
        }
    }
    .add_con {
        .add_item {
            display: flex;
            padding: 10px 0;
            .add_title {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                width: 200px;
                padding-right: 20px;
                font-weight: bold;
                &.red::before {
                    content: "*";
                    display: inline-block;
                    color: #f30300;
                }
            }
            /deep/ .el-input__inner {
                width: 85% !important;
            }
            .add_file {
                display: block;
                width: 80px;
                height: 100%;
                line-height: 30px;
                color: #409EFF;
                border-radius: 4px;
                border: 1px solid #409EFF;
                text-align: center;
            }
            .el-input {
                flex: 1;
            }
            .fileNameBox {
                display: flex;
                align-items: center;
                padding-left: 15px;
                max-width: 230px;
                .fileName {
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;//文本超出隐藏
                    text-overflow: ellipsis;
                }
                .cancel{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 16px;
                    height: 16px;
                    font-size: 16px;
                }
            }
        }
    }
    /deep/ .el-table__header-wrapper {
        // border: 1px solid #EBEEF5;
        tr {
            .el-table__cell {
                background: #fafafa !important;
                border-bottom: none;
                color: #222;
                font-weight: bold;
            }
        }
    }
    /deep/ .el-tooltip {
        white-space:unset !important;
    }
}
</style>

