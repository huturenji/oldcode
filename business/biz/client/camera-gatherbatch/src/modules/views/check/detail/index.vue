<template>
    <div class="check-detail-list">
        <div class="check">
            <Header :text="detailTitle"></Header>
            <div class="content-wrap">
                <div class="el-table-wrap">
                    <el-table :data="tableData" ref="table" :cell-style="cellStyle"  height=440 :key="toggleIndex" @cell-click="cellClick" v-loading="loading" :empty-text="emptyText">
                        <el-table-column prop="Index" label="序号" width="200">
                        </el-table-column>
                        <el-table-column prop="LabelId" label="标签内容" width="200">
                            <template slot-scope="scope">
                                <span v-if="scope.row.Status==LABEL_STATE.TO_INDENTIFY">正在获取中。。。</span>
                                <div v-else-if="scope.row.Status==LABEL_STATE.IDENTIFY_FAILED" class="label-failed">
                                    <div class="label-failed-text">
                                        <span>获取失败,请手动输入</span>
                                        <i  class="el-icon-edit-outline"></i>
                                    </div>
                                   <el-input placeholder="请输入标签内容" v-model="scope.row.LabelId" @blur="blur($event,scope.$index,scope.row)"></el-input>
                                </div>
                                <span v-else>{{scope.row.LabelId}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="IssuedTime" label="采集时间" width="400">
                            <template slot-scope="scope">
                                <span>{{new Date(scope.row.IssuedTime*1000).format('yyyy/MM/dd HH:mm:ss')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="img" label="采集图像" width="200">
                            <template slot-scope="scope">
                                <div class="img-wrap">
                                    <img @click="openViewer(scope.row.ImgUrl)" class='img' :src="scope.row.ImgUrl+'?imgtype=thumbnail'"/>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="button" :class="{active:active}">
                    <div class="btn"  @click="toConfirm(OPERATION_STATE.INVALID)">作废本批次</div>
                    <div class="btn"  @click="toConfirm(OPERATION_STATE.CHECK)">审核通过</div>
                </div>
            </div>
        </div>
        <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[imageUrl]"/>
        <Modal :show.sync="showModal" cancelText="取消" confirmText="确认" @confirm="check" @close="close"  class="modal-detail">
            <div class="tips">
                {{confirmTips[operationState]}}
            </div>
        </Modal>
    </div>
</template>
<script>
import {BATCH_STATE,LABEL_STATE,OPERATION_STATE} from 'common/constants'
import Header from 'components/header'
import Modal from 'components/modal'
import request from 'utils/requestHandler.js'
const m = (e) => { e.preventDefault() };
export default {
    components:{
        Header,
        Modal,
        'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
    },
    data(){
        return{
            active:false,//按钮激活标识
            showViewer:false,//预览页面
            showModal:false,//确认框
            imageUrl:'',//预览图片url
            batchId:-1,
            detailTitle:'',//详情title
            OPERATION_STATE:OPERATION_STATE,//操作类型状态
            LABEL_STATE:LABEL_STATE,//label标签状态
            confirmTips:{//用户提示语
                [OPERATION_STATE.INVALID]:'作废后本批次采集的全部数据将会清除且不可恢复，确认作废本批次采集的纸纹标签吗？',
                [OPERATION_STATE.CHECK]:'确认审核通过该批次采集的纸纹标签吗？'
            },
            operationState:OPERATION_STATE.INVALID,//操作状态 1表示作废 2表示审核通过
            tableData:[],//table加载数据
            toggleIndex:0,//table索引
            editProps: ['LabelId'],//table可编辑属性列表
            loading:false,//tableloading
            pageNumber:0,//分页页数
            pageSize:20,//分页每页条数
            emptyText:'数据加载中。。。',//table加载数据提示语
            
        }
    },
    created(){
        this.batchId = this.$route.query.batchId;
        this.detailTitle = `${this.batchId}批次采集详情(${this.$route.query.totalCount}张)`;//拼接显示数据
    },
    mounted(){
        this.loadData();//加载数据
        this.scrollDom = this.$refs.table.bodyWrapper;//获取当前table对象，用来计算监听滚动高度
        this.scrollDom.addEventListener('scroll',this.handleScroll,true)//监听滚动事件
    },
    destroyed(){
        window.removeEventListener('scroll',this.handleScroll,true)//移除监听滚动事件
    },
    methods:{
        /**
         * 加载数据
         */
        async loadData(){
            this.loading = true;
            const response = await this.getOneBatchDetail(this.batchId,this.pageNumber,this.pageSize);
            if(0==response.ErrCode && 0 < response.Data.TotalCount && 0< response.Data.LabelInfos.length){
                this.labelsTotalCount = response.Data.TotalCount;
                this.tableData.push(...response.Data.LabelInfos)
                this.pageNumber++
                let LabelInfos = response.Data.LabelInfos;
                let active_temp = true;//按照操作状态 临时变量
                for (let index = 0; index < LabelInfos.length; index++) {
                    const element = LabelInfos[index];
                    if(element.Status===LABEL_STATE.IDENTIFY_FAILED||element.Status===LABEL_STATE.TO_INDENTIFY){
                        active_temp = false;
                        break;
                    }
                }
                this.active = active_temp;
            }else{
                this.emptyText = '暂无数据';
            }
            this.loading = false
            
        },
        /**
         * 获取单批次详情
         * @param {*} batchId 
         * @param {*} offset 
         * @param {*} limit 
         */
        async getOneBatchDetail(batchId,offset,limit){
            return  request.post('/api/v1/batchcapture/getonebatchdetail',{
                BatchId:batchId,
                Offset:offset,
                Limit:limit
            });

        },
        /**
         * 分页滚动
         */
        handleScroll(){
            if(this.loading || this.tableData.length >= this.labelsTotalCount){
                return;
            }
            let clientHeight = this.scrollDom.clientHeight;
            let scrollTop = this.scrollDom.scrollTop;
            let scrollHeight = this.scrollDom.scrollHeight;
            if(clientHeight + scrollTop >= scrollHeight){
                this.loadData();
            }
        },
        /**
         * 审核记录
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
                this.pageNumber = 0;
                this.loadData();
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
         * 点击作废或者审核按钮操作
         * @param {string} state 当前操作类型
         */
        toConfirm(state){
            if(!this.active){
                return
            }
            this.operationState = state;
            this.showModal = true;
        },

        /**
         * 修改标签值
         * @param {*} batchId 批次号
         * @param {*} index 序号
         * @param {*} labelId 标签值
         */
        modifyLabelid(batchId,index,labelId){
            return  request.post('/api/v1/batchcapture/modifylabelid',{
                BatchId:batchId,
                Index:index,
                LabelId:labelId
            });
        },
        /**
         * 关闭预览图片器
         */
        closeViewer(){
            this.showViewer = false;
            document.body.style.overflow = 'auto';
            document.removeEventListener('touchmove',m,true);
        },
        /**
         * 打开预览图片器
         * @param {string} url 图片地址 
         */
        openViewer(url){
            this.showViewer = true;
            document.body.style.overflow = 'hidden';
            document.addEventListener('touchmove',m,false)
            this.imageUrl = url;
        },
        /**
         * 设置表格单元样式
         */
        cellStyle({row,column,rowIndex,columnIndex}){
            if(columnIndex===3||columnIndex===1){//设置第4列图片样式
                return "padding:5px 0 5px 0;"
            }else{
                return ''
            }
        },
        /**
         * 单元格点击
         * @param {*} row 当前行数据
         * @param {*} column 当前列
         * @param {*} cell 当前单元格
         * @param {*} event 事件
         */
        cellClick(row,column,cell,event){
            if(this.editProps.includes(column.property)){
                if(row.Status==LABEL_STATE.IDENTIFY_FAILED){//状态为上传失败，则需要编辑
                    cell.querySelector('.label-failed-text').style.display = 'none';
                    cell.querySelector('.el-input').style.display = 'block';
                    this.$nextTick(()=>{
                        cell.querySelector('input').focus()//聚焦
                    })
                }
            }
        },
        /**
         * input框失去焦点后事件
         * @param {Event} e 当前事件 
         * @param {int} index 数据在table中的索引值
         * @param {Obejct} row 行数据
         */
         async blur(e,index,row){
            //TODO请求编辑标签接口 返回成功后显示数据
            
            if(this.tableData[index].LabelId==0||!this.tableData[index].LabelId){//labelId不允许为0
                return
            }
            let response = await this.modifyLabelid(this.batchId,row.Index,row.LabelId);
            if(0==response.ErrCode){
                this.tableData[index].Status = LABEL_STATE.TO_UPLOAD;//TODO 是否重新加载list数据
            }else{
                this.$message({
                    message:'操作失败',
                    offset:125,
                    type:'error'
                })
            }
        },
        /**
         * 关闭弹框
         */
         close(){
           this.showModal = false;
        }
    }
}
</script>
<style lang="less" scoped>
.check-detail-list{
    .check{
        margin: auto;
        .title{
            margin: auto;
            padding: 60px 0 31px 0;
            width: 500px;
            height: 120px;
            color: #fff;
            font-size: 20px;
            text-align: center
        }
        .content-wrap{
            width: 1000px;
            height: 560px;
            margin: auto;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            .el-table-wrap{
                padding: 16px 0 0 0;
                /deep/.el-table{
                    width: 1000px;
                    margin: auto;
                    border-radius: 8px;
                    th.el-table__cell>.cell,.cell{
                        text-align: center;
                        font-size: 14px;
                        color:#222
                    }
                    .label-failed{
                        span{
                            color:#ff4343;
                        }
                        .el-input{
                            display: none;
                        }
                    }
                    .img-wrap{
                        width:100%;
                        height: 40px;
                        display: flex;
                        vertical-align: middle;
                        justify-content: center;
                        .img{
                            width:76px;
                            height: 40px;
                        }
                    }
                    
                }
            }
            .button{
                display: flex;
                margin:32px auto 0 auto;
                justify-content: center;
                
                opacity: 0.3;
                .btn{
                    width: 114px;
                    height: 40px;
                    line-height: 40px;
                    font-size: 16px;
                    background-color: #1145FF;
                    border-radius: 8px;
                    text-align: center;
                    color: #FFF;
                    cursor:pointer;
                }
                .btn:nth-child(1){
                    background-color: #ff4343;
                }
                .btn:nth-child(2){
                    margin: 0 0 0 48px;
                }

            }
            .button.active{
                opacity: 1;
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