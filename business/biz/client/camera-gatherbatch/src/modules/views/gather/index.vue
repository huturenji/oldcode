<template>
    <div class="gather-wrap">
        <Header text="采集"></Header>
        <div class="gather">
            <div class="info-wrap">
                <div class="num">
                    <span>批次号：</span>
                    <input placeholder="请输入批次号（必填）" v-model="batchId"/>
                </div>
                <div class="count">
                    <span>标签总数：</span>
                    <input placeholder="请输入标签总数（必填）" type="number"  v-model="totalLabelNum" oninput="if(value<1)value=''"/>
                </div>
                <div class="button" :class="{active:active}">
                    <div class="btn"  @click="gather">开始采集</div>
                </div>
            </div>
        </div>
        <Modal :show.sync="showModal" :title="gatherInfo.titleText"  @confirm="confirm" @close="close" :cancelText="gatherInfo.cancelText" :confirmText="gatherInfo.confirmText">
            <div class="gather-count">
                <div class="img" :class="rotate"></div>
                <div class="count">
                    {{gatherCount}}
                </div>
                <div class="tips">
                    已采集个数
                </div>
            </div>
            <div v-if='!loading' class="gather-tips" :class="{error:!gatherInfo.confirmText}">
                {{gatherInfo.gatherTips}}
            </div>
        </Modal>
    </div>
</template>
<script>
import request from 'utils/requestHandler.js'
import Header from 'components/header'
import Modal from 'components/modal'
export default {
    components:{
        Header,
        Modal
    },
    data(){
        return {
            gatherCount:1,//已采集个数
            showModal:false,//弹框
            batchId:null,//批次号
            totalLabelNum:null,//标签总数
            labelPageNum:0,//页数 标签页数 默认为0 检查批次状态一次最多只能检查100条，需要将标签按照100进行分类
            labelPageSize:100,//每页数据量
            pageCount:1,//页数计数器 用来判断是否为最后一页 默认为1
            loading:false,//loading
            interval:null,//采集动画定时器
            interval_status:null//轮询采集状态
        }
    },
    computed:{
        /**
         * 图片旋转
         */
        rotate(){
            return{
                rotate:this.loading
            }
        },
        /**
         * 提示给用户的信息
         */
        gatherInfo:{//与采集状态相关数据
            get:function(){
                return {
                    titleText:this.loading?'批量采集中...':'采集完成',
                    cancelText:this.loading?'':'重新采集',
                    confirmText:this.loading?'':'提交审核',
                    gatherTips:this.loading?'':'请确认本批次采集数据是否准确'
                }
            }
        },
        /**
         * 按钮是否能点击 默认不能
         */
        active(){
            return (this.batchId||this.batchId===0)&&this.totalLabelNum
        }
    },
    destroyed(){
        this.interval&&clearInterval(this.interval);
    },
    methods:{
        /**
         * 开始采集
         */
        async gather(){
            if(!this.active){//非激活状态
                return
            }
            this.gatherCount = 0
            this.showModal = true;
            this.loading = true;

            let response = await this.batchCapture(this.batchId,Number(this.totalLabelNum));
            if(0==response.ErrCode){
                this.labelPageNum = Math.ceil(Number(this.totalLabelNum)/this.labelPageSize);
                this.batchStatusResult = this.checkBatchSatus(this.batchId);
            }else{
                this.loading = false;
                this.gatherInfo.titleText = '采集失败'
                this.gatherInfo.gatherTips = response.ErrMsg
                this.gatherInfo.confirmText = null
            }
            
           
        },
        /**
         * 查询采集状态
         * @param {string} batchId 批次号
         */
        async checkBatchSatus(batchId){
            if(!this.showModal)return;
            let response = await request.post('/api/v1/batchcapture/checkstatus',{ BatchId:batchId});
            if(0==response.ErrCode){
                this.gatherCount =  (this.pageCount-1)*this.labelPageSize+response.Data.CapturedLabelsNum;
                if(response.Data.Status==1){//未采集完成，继续采集
                    this.checkBatchSatus(batchId)
                }else{
                    if(response.Data.Status==2&&this.pageCount<this.labelPageNum){//某一页采集完成，翻页后继续采集
                        this.pageCount++
                        this.checkBatchSatus(batchId)
                    }else{
                        this.loading = false;//采集完成
                    }
                }
            }else{
                this.loading = false;
                this.gatherCount = 0;
                this.gatherInfo.titleText = '采集失败'
                this.gatherInfo.gatherTips = response.ErrMsg
                this.gatherInfo.confirmText = null
            }
        },
        /**
         * 批量上传
         * @param {string} batchId  批次号
         * @param {number} totalLabelNum  总数
         */
        batchCapture(batchId,totalLabelNum){
            return  request.post('/api/v1/batchcapture/start',{
                            BatchId:batchId,
                            TotalLabelNum:totalLabelNum
                        });
        },
        close(){
            this.interval&&clearInterval(this.interval)
        },
        /**
         * 提交审核
         */
        confirm(){
            this.$router.push({
                path:'check'
            })
        }
    }
}
</script>

<style scoped lang="less">

@keyframes  img-rotate  {
    0% {
        transform:rotateZ(0deg)
    }
    100% {
       transform: rotateZ(360deg);
    }
}
.gather-wrap{
    .gather{
        margin: auto;
        width: 600px;
        .info-wrap{
            overflow: hidden;//解决子元素margin-top塌陷问题
            margin: 91px 0 0 0;
            width: 600px;
            height: 360px;
            background: #fff;
            border-radius: 8px;
            .num{
                margin: 85px 0 0 0;
                display: flex;
            }
            .count{
                margin: 32px 0 0 0;
                display: flex;
            }
            span{
                width: 156px;
                height: 32px;
                line-height: 32px;
                text-align: right;
            }
            input{
                margin: 0 0 0 32px;
                background-color: #ddd;
                width: 320px;
                height: 32px;
                line-height: 32px;
                font-size: 16px;
                text-indent: 8px;
            }
            ::placeholder{
                color: #999;
            }
            .button{
                display: flex;
                margin:48px auto 0 auto;
                justify-content: center;
                opacity: 0.3;
                .btn{
                    width: 114px;
                    height: 40px;
                    line-height: 40px;
                    font-size: 16px;
                    background-color: #1145FF;
                    border-radius: 4px;
                    text-align: center;
                    color: #FFF;
                    cursor:pointer;
                }
            }
            .button.active{
                opacity: 1;
            }

        }
            
    }
    .gather-count{
        margin: 48px 0 0 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 200px;
        overflow: hidden;
        .img{
            position: absolute;
            width: 200px;
            height: 200px;
            background: url('@/themes/default/img/gather/loading.png') no-repeat;
            background-size: cover;
        }
        .img.rotate{
            animation:  img-rotate 3s linear infinite;
        }
        .count{
            margin: 54px 0 0 0;
            height: 58px;
            font-size: 60px;
            font-weight: bold;
            color: #666;
        }
        .tips{
            margin: 12px 0 0 0;
            height: 24px;
            line-height: 24px;
            font-size: 16px;
            color: #666;
        }
    }
    .gather-tips{
        font-size: 16px;
        color: #222;
        margin: 32px 0 0 0;
        font-family: PingFang SC Regular;
    }
    .gather-tips.error{
        color:#ff4343
    }
}
</style>