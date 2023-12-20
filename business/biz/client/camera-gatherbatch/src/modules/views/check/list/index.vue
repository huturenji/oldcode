<template>
    <div class="check-list">
        <div class="check">
            <Header text="审核"></Header>
            <div class="content-wrap">
                <div class="label">
                    <span :class="{choosed:labelState=='TO_CHECK'}" @click="changeLabelState('TO_CHECK',BATCH_BIZ_STATE.TO_CHECK_INDEX)">待审核</span>
                    <span :class="{choosed:labelState=='CHECKED'}" @click="changeLabelState('CHECKED',BATCH_BIZ_STATE.CHECKED_INDEX)">已审核</span>
                </div>
                <div class="el-table-wrap">
                    <el-table :data="tableData[toggleIndex]"  ref="table"
                        height=505 :key="toggleIndex" v-loading="loading" :empty-text="emptyText">
                        <el-table-column prop="index" label="序号" width="160">
                            <template slot-scope="scope">
                                <span>{{scope.$index<9?`0${scope.$index+1}`:scope.$index}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="BatchId" label="批次号" width="160"></el-table-column>
                        <el-table-column prop="TotalCount" label="标签数量" width="160"></el-table-column>
                        <el-table-column prop="CaptureTime" label="采集时间" width="200">
                            <template slot-scope="scope">
                                <span>{{new Date(scope.row.CaptureTime*1000).format('yyyy/MM/dd HH:mm:ss')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column  v-if="labelState=='TO_CHECK'" prop="operation" label="操作" width="320">
                            <template slot-scope="scope">
                                <span class="red-text pointer" @click="toConfirm(scope.$index, scope.row,OPERATION_STATE.INVALID)">作废本批次</span>
                                <span class="blue-text pointer" @click="toConfirm(scope.$index, scope.row,OPERATION_STATE.CHECK)">审核通过</span>
                                <span class="blue-text pointer" @click="toDetail(scope.$index, scope.row)">查看详情</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="labelState=='CHECKED'" prop="Status" label="状态" width="160">
                            <template slot-scope="scope">
                                <span :class="{'red-text':scope.row.Status==BATCH_STATE.TO_UPLOAD}">{{BATCH_BIZ_STATE_TEXT[scope.row.Status]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="labelState=='CHECKED'" prop="operation" label="操作" width="160">
                            <template slot-scope="scope">
                                <span class="blue-text pointer" v-if="scope.row.Status==BATCH_STATE.TO_UPLOAD" @click="toGather(scope.$index, scope.row)">重新上传</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <Modal :show.sync="showModal" cancelText="取消" confirmText="确认" @confirm="check" class="modal-detail">
            <div class="tips">
                {{confirmTips[operationState]}}
            </div>
        </Modal>
    </div>
</template>
<script>
import {BATCH_STATE,BATCH_BIZ_STATE,OPERATION_STATE,BATCH_BIZ_STATE_TEXT} from 'common/constants'
import Header from 'components/header'
import request from 'utils/requestHandler.js'
import Modal from 'components/modal'
export default {
    data(){
        return{
            labelState:'TO_CHECK',//页面标签状态 默认为待审核
            BATCH_STATE,//批次状态
            OPERATION_STATE,//操作状态
            BATCH_BIZ_STATE_TEXT,//批次状态对应文本信息
            BATCH_BIZ_STATE,//批次状态
            confirmTips:{//弹框提示语
                [OPERATION_STATE.INVALID]:'作废后本批次采集的全部数据将会清除且不可恢复，确认作废本批次采集的纸纹标签吗？',
                [OPERATION_STATE.CHECK]:'确认审核通过该批次采集的纸纹标签吗？'
            },
            operationState:OPERATION_STATE.INVALID,//操作状态 1表示作废 2表示审核通过
            batchId:-1,//操作的当前记录id
            batchesTotalPageSize:0,//服务返回总数据页数
            showModal:false,//显示模态弹框
            tableData:{//table 数据
                [BATCH_BIZ_STATE.TO_CHECK_INDEX]:[],
                [BATCH_BIZ_STATE.CHECKED_INDEX]:[]
            },
            toggleIndex:0,//table索引
            pageNumber:{//table分页 有两个table 分页用对象表示 0表示待审核 1表示已审核
                [BATCH_BIZ_STATE.TO_CHECK_INDEX]:0,
                [BATCH_BIZ_STATE.CHECKED_INDEX]:0
            },
            pageSize:20,//table每页数量
            emptyText:'数据加载中。。。',
            loading:false,//table loading
        }
    },
    components:{
        Header,
        Modal
    },
    mounted(){
        this.loadData(BATCH_BIZ_STATE[this.labelState],this.pageNumber[this.toggleIndex],this.pageSize,this.toggleIndex);
        this.scrollDom = this.$refs.table.bodyWrapper;
        this.scrollDom.addEventListener('scroll',this.handleScroll,true)
    },
    destroyed(){
        window.removeEventListener('scroll',this.handleScroll,true)
    },
    methods:{
        /**
         * 切换页面标签
         * @param {*} state 
         */
        changeLabelState(state,index){
            if(this.labelState===state)return;
            setTimeout(() => {
                this.labelState != state?this.labelState = state:'';
                this.toggleIndex = index //加上table索引避免table切换时页面抖动
                if(this.pageNumber[this.toggleIndex]==0){//切换页面状态时，只加载第一页
                    this.loadData(BATCH_BIZ_STATE[this.labelState],this.pageNumber[this.toggleIndex],this.pageSize,this.toggleIndex);//label切换时只需要查询第一页
                }
            }, 100);
            
        },
        /**
         * 获取页面批次数据
         * @param {Array} state 批次状态
         * @param {int} pageNumber 分页页数
         * @param {int} pageSize 每页条数
         * @param {int} toggleIndex table索引
         */
        async loadData(state,pageNumber,pageSize,toggleIndex){
            this.loading = true;
            const response = await this.getBatches(state,pageNumber,pageSize);
            this.batchesTotalPageSize = response.Data.TotalPageSize;
            if(0==response.ErrCode && this.pageNumber[toggleIndex] < response.Data.TotalPageSize){
                this.tableData[toggleIndex].push(...response.Data.AllBatches) //TODO 来回切换服务端返回的数据会导致数据会重复
                this.pageNumber[toggleIndex]++
            }else{
                this.emptyText = '暂无数据';
            }
            this.loading = false
        },
        /**
         * 获取批量采集批次列表
         * @param {*} status 批次整体状态
         * @param {*} offset 分页页数 默认为0
         * @param {*} limit  每页条数 最大100
         */
        async getBatches(status,offset,limit){
            return  request.post('/api/v1/batchcapture/getallbatches',{
                Status:status,
                Offset:offset,
                Limit:limit
            });
        },
        /**
         * 滚动控制
         */
        handleScroll(){
            if(this.loading || this.pageNumber[this.toggleIndex] >= this.batchesTotalPageSize){
                return;
            }
            let clientHeight = this.scrollDom.clientHeight;
            let scrollTop = this.scrollDom.scrollTop;
            let scrollHeight = this.scrollDom.scrollHeight;
            if(clientHeight + scrollTop >= scrollHeight){
                this.loadData(BATCH_BIZ_STATE[this.labelState],this.pageNumber[this.toggleIndex],this.pageSize,this.toggleIndex);
            }
        },
        /**
         * 对单条记录进行审核操作
         * @param {*} index 
         * @param {*} row 
         * @param {*} state 
         */
        toConfirm(index,row,state){
            if(BATCH_STATE.TO_IDENTIFY==row.Status||BATCH_STATE.IDENTIFY_FAILED==row.Status){
                return
            }
            this.batchId = row.BatchId;
            this.operationState = state;
            this.showModal = true;
        },
        /**
         * 审核记录
         * @param {*} index 
         * @param {*} row 
         * @param {*} state 
         */
        async check(){
            let response =  await request.post('/api/v1/batchcapture/checkresult',{
                BatchId:this.batchId,
                Result:this.operationState
            });
            if(0==response.ErrCode){//成功
                //给出成功的toast
                this.$message({
                    message:'操作成功',
                    offset:125,
                    type:'success'
                })
                this.pageNumber[this.toggleIndex] = 0;
                this.loadData(BATCH_BIZ_STATE[this.labelState],this.pageNumber[this.toggleIndex],this.pageSize,this.toggleIndex);
            }else{//失败
                //给出失败的toast
                this.$message({
                    message:'操作失败',
                    offset:125,
                    type:'error'
                })
            }
        },
        
        /**
         * 
         * @param {string} path 详情路由path
         */
        toDetail(index,row){
            this.$router.push({
                path:'check/detail',
                query:{
                    batchId:row.BatchId,
                    totalCount:row.TotalCount
                }
            })
        },
        /**
         * 重新采集
         */
        toGather(){
            this.$router.push({
                path:'gather'
            })
        },
    }
}
</script>
<style lang="less" scoped>
.check-list{
    .check{
        margin: auto;      
        .content-wrap{
            width: 1000px;
            height: 560px;
            margin: auto;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            .label{
                margin: 16px 0 0 40px;
                height: 39px;
                font-size: 16px;
                color: #666;
                span{
                    cursor:pointer;
                }
                span:nth-child(2){
                    margin-left: 24px;
                }
                .choosed{
                    color:#1145ff;
                    font-weight: 500;
                    border-bottom: 2px solid #1145ff;
                    padding-bottom: 3px;
                }
            }
            .el-table-wrap{
                /deep/.el-table{
                    width: 1000px;
                    margin: auto;
                    border-radius: 8px;
                    th.el-table__cell>.cell,.cell{
                        text-align: center;
                        font-size: 14px;
                        color:#222
                    }
                    .cell{
                        .red-text{
                            color:#ff4343
                        }
                        .pointer{
                            cursor: pointer;
                        }
                        .blue-text{
                            color:#1145ff;
                        }
                        span:nth-child(n+1){
                            margin-left: 24px;
                        }
                    }
                }
            }
        }
    }
    .modal-detail{
        .tips{
            margin:64px 0 0 50%;
            transform: translateX(-50%);
            width: 368px;
            color: #222;
            font-size: 16px;
            font-weight: 500;
        }
    }
    /deep/.overlay .modal .modal-context{
        width: 420px;
        height: 256px;
        .modal-footer{
            bottom: 64px ;
            .btn-confirm{
                margin: 0 0 0 64px;
            }
        }
    }
}
</style>