<!--大屏幕抽奖后台操作页-->
<template>
	<div class="manager-container">
		<div class="left">
            <div class='prize'>
                <div class='level'>
                    <div class='pre' :class='{disabled: disableOption("switch")}' @click='changeLevel(-1)'></div>
                    <div>{{currPrize.gradeName}}</div>
                    <div class='next' :class='{disabled: disableOption("switch")}' @click='changeLevel(1)'></div>
                </div>
                <div class='name' style='-webkit-box-orient: vertical;'>
                    {{currPrize.name}}
                </div>
                <img class='pic' :src='imgFilter(currPrize.imgUrl)'/>
                <div class='number'>
                    奖品数量：{{currPrize.remainingCount}}
                </div>
                <div class='notic' v-if='currPrize.remainingCount==0'>奖品已抽完</div>
            </div>
            <div class='operation'>
                <div class='action' :class='{disabled: disableOption("background")}' @click='openChangeBgDialog'>
                    <div class='icon background'></div>
                    <div>背景图</div>
                </div>
                
                <div class='action' :class='{disabled: disableOption("qrcode")}' @click='openQrcodeDialog'>
                    <div class='icon qrcode'></div>
                    <div>二维码</div>
                </div>
                <div class='action' :class='{disabled: disableOption("award-list")}' @click='openAwardListDialog'>
                    <div class='icon award-list'></div>
                    <div>中奖名单</div>
                </div>
            </div>
            <div class='btn-group'>
                <!--初始状态-->
                <template v-if='state == 0'>
                    <el-popconfirm  v-if='currPrize.remainingCount!=0'
                        title="确认开始投屏吗？"
                        @confirm='changeState(1)'
                    >
                        <el-button type="primary" slot="reference">
                        开始投屏
                        </el-button>
                    </el-popconfirm>
                    <el-button v-else type="info" plain disabled>
                    开始投屏
                    </el-button>
                </template>
                <!--配置完成准备抽奖-->
                <template v-else-if='state == 1'>
                    <el-button @click='changeState(0)'>返回编辑</el-button>
                    <el-popconfirm
                        title="确认开始抽奖吗？"
                        @confirm='changeState(2)'
                    >
                        <el-button type="primary" slot="reference">开始抽奖</el-button>
                    </el-popconfirm>
                </template>
                <!--开始抽奖-->
                <template v-else-if='state == 2'>
                    <el-popconfirm
                        title="确认停止抽奖吗？"
                        @confirm='changeState(3)'
                    >
                        <el-button type="primary" slot="reference">停止</el-button>
                    </el-popconfirm>
                </template>
                <!--抽奖完成-->
                <template v-else>
                    <el-button type="primary" @click='changeState(0)'>配置抽奖</el-button>
                </template>
            </div>
        </div>
		<div class="preview">
            <Preview :isChild='true' :screenConfigProp='screenConfig' :currPrizeProp="currPrize"/>
        </div>

        <el-dialog
            class='bg-dialog'
            title='上传图片'
            :visible.sync="showBgDialog"
            :modal-append-to-body="false"
            width="40%">
            <div>
                <el-upload
                class="upload-bg"
                accept='image/*'
                :show-file-list='false'
                :before-upload="file=>bgUpload(file)"
                >
                    <div class='content'>
                            <div class="btn show">
                                <div class='text'>重新上传图片</div>
                            </div>
                        <div class='img' :style='{background: `url(\"${screenConfig.background || bgUrl}\") center/contain no-repeat`}'/>
                        <div class='tips'>
                            <div>1. 建议上传1920*1080分辨率以上的图片</div>
                            <div>2. 建议图片尺寸不要大于5M，否则会影响图片加载速度</div>
                        </div>
                    </div>
                </el-upload>
            </div>
        </el-dialog>
        
	</div>
</template>
<script>
import { utils, cloudservices } from "opcl";
import apihandler from "bislibs/requestHandler/liveRafflehandler";
import Preview from "./preview.vue";
import { allbuildinIcons } from "bislibs/home/newlottery-lifecycle";

export default {
    components: {Preview},
	data() {
		return {
            activityId: this.$route.query.activityId,//活动id
            activityDetail: {},//活动详情
            currPrizeIndex: 0,//当前选中的奖项的索引
            currPrize: {},//当期选中的奖项
            screenConfig: {},//大屏配置
            state: 0,//抽奖状态 0: 初始; 1: 配置完成准备抽奖; 2: 抽奖开始; 3: 抽奖完成
            showBgDialog: false,//设置背景弹框
            bgUrl: require('@/themes/default/img/liveRaffle/pic_bg.png'),//大屏背景
            awardList: [],//中奖名单
        };
	},
	created() {
        //同时获取活动详情和活动配置，并得到当期活动
        window.Promise.allSettled([this.getScreenConfig(), this.getActivityDetail()]).then(res => {
            //前提：成功获取活动详情
            if(res[1].status == 'fulfilled'){
                if(!this.activityDetail || Object.keys(this.activityDetail).length == 0){
                    return;
                }
                //1. 默认使用活动详情中的第一个奖项
                this.currPrize = this.activityDetail.prizes.length > 0 ? this.activityDetail.prizes[0] : {}
                //2. 如果配置中已设置过当期奖项，则使用配置中的奖项
                if(res[0].status == 'fulfilled'){
                    switch(this.screenConfig.showWhat){
                        case 1: 
                            if(this.screenConfig.prizeId != null && this.screenConfig.prizeId != ''){
                                this.state = 1;
                            }else{
                                this.state = 0;
                            }
                            break;
                        case 2:
                            break;
                        case 3:
                            this.state = 2;
                            break;
                        case 4:
                            this.state = 3;
                            break;  
                        default:
                            this.state = 0;     
                    }
                    let drawPrizeGrade = this.screenConfig.drawPrizeGrade
                    if(drawPrizeGrade != null && drawPrizeGrade != ''){
                        //配置的奖项在prizes中的索引
                        this.currPrizeIndex = this.activityDetail.prizes.findIndex(prize => {
                            return String(prize.grade) == String(drawPrizeGrade)
                        })
                        this.currPrize = this.activityDetail.prizes.length > 0 ? this.activityDetail.prizes[this.currPrizeIndex] : {}
                    }
                }
            }
        })
    },
	methods: {
        /**
         * 获取活动详情
         */
        async getActivityDetail(){
            try{
                const response = await apihandler.getActivityDetail({activityId: this.activityId});
                this.activityDetail = response.result
            }catch(e){
                console.error('获取活动信息失败！');
            }
        },
        /**
         * 获取大屏配置
         */
        async getScreenConfig(){
            try{
                const response = await apihandler.getScreenConfig({activityId: this.activityId});
                this.screenConfig = response.result;
            }catch(e){
                console.error('获取大屏配置失败！', e);
            }
        },
        /**
         * 切换抽奖状态
         */
        async changeState(newState){
            //抽奖状态 0: 初始; 1: 配置完成准备抽奖; 2: 抽奖开始; 3: 抽奖完成
            switch(newState){
                case 0://配置奖项
                    //此时什么也不用做
                    break;  
                case 1://配置完成准备抽奖
                    if(this.currPrize.remainingCount == 0){
                        return;
                    }
                    this.setScreenConfig({showWhat: 1});
                    break;
                case 2://抽奖开始
                    const signUpUserList = await this.getSignUpUserList()
                    const _startDraw = async () => {
                        await this.startDraw();
                        this.getScreenConfig();//更新大屏配置，给子页面用
                    }
                    //所有中奖者列表
                    const awardList = await this.getAwardList();
                    const userCount = signUpUserList.length - awardList.length;//剩余可抽奖人数
                    //没人参加不让开始
                    if(userCount == 0){
                        this.$message.warning('参与本轮抽奖的人数为0，无法开奖')
                        return;
                    }
                    //参加人数不够，给出提示
                    if(userCount < this.currPrize.remainingCount){
                        this.$msgbox({
                            message: '参与本轮抽奖的人数少于奖品数量，是否继续开奖？',
                            showCancelButton: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                        }).then(action => {
                            _startDraw();
                            this.state = newState;
                        });
                        return;
                    }
                    _startDraw();
                    break;
                case 3://抽奖开始
                    await this.liveDraw();
                    this.getScreenConfig();//更新大屏配置，给子页面用
                    await this.getActivityDetail();//更新活动信息
                    if(this.activityDetail.prizes.length > 0){
                        this.currPrize = this.activityDetail.prizes[this.currPrizeIndex]
                    }
                    break;    
            }
            this.state = newState;
        },

        /**
         * 切换奖项
         */
        async changeLevel(direction){
            if(this.disableOption('switch')){
                return;
            }
            this.currPrizeIndex += direction
            if(this.currPrizeIndex >= this.activityDetail.prizes.length){
                this.currPrizeIndex = 0
            }
            if(this.currPrizeIndex < 0){
                this.currPrizeIndex = this.activityDetail.prizes.length - 1;
            }
            this.currPrize = this.activityDetail.prizes[this.currPrizeIndex]
        },
        /**
         * 切换背景图
         */
        openChangeBgDialog(){
            if(this.disableOption('background')){
                return;
            }
            this.showBgDialog = true;
        },
        /**
         * 上传背景图
         */
        bgUpload(file) {
            let that = this;
            file.businessType = "logo";
            file.uid = new Date().getTime();
            cloudservices.upload2Ceph('/activitystudio/presign/v1/getUploadUrl',[file]).then(async (allRes) => {
                that.screenConfig.background = allRes[0].downLoadUrl;
                await that.setScreenConfig({background: that.screenConfig.background})
            })
            .catch(e => {
                console.error('上传图片出错', e)
            });
            return false;
        },
        /**
         * 打开二维码弹框
         */
        async openQrcodeDialog(){
            if(this.disableOption('qrcode')){
                return;
            }
            if(this.screenConfig.showWhat != 2){
                this.screenConfig.showWhat = 2;//修改状态，在preview页面中展示
            }else{
                this.screenConfig.showWhat = 1
            }
            await this.setScreenConfig({showWhat: this.screenConfig.showWhat});
        },
        
        /**
         * 展示中奖名单
         */
        openAwardListDialog(){
            if(this.disableOption('award-list')){
                return;
            }
            //修改状态，在preview页面中展示
            let showWhat = this.screenConfig.showWhat != 4 ? 4 : 1;
            this.setScreenConfig({showWhat: showWhat});//更新配置
        },

        /**
         * 获取所有中奖者列表
         */
        async getAwardList(){
            const param = {
                activityId: this.activityId,
                pageIndex: 1,
                pageSize: 1000//不分页，查所有
            }
            try{
                const response = await apihandler.getAwardList(param);
                return response.result.list || [];
            }catch(e){
                console.error('获取中奖名单失败！' + e);
                return []
            }
        },

        /**
         * 设置大屏状态
         * {background, showWhat}
         */
        async setScreenConfig(param){
            try{
                param = Object.assign({
                    activityId: this.activityId,
                    prizeId: this.currPrize.prizeId
                }, param)
                await apihandler.setScreenConfig(param)
                this.getScreenConfig();//设置完后重新获取
            }catch(e){
                console.error(e)
            }
        },

        /**
         * 开始抽奖
         */
        async startDraw(){
            try{
                const param = {
                    activityId: this.activityId,
                    prizeId: this.currPrize.prizeId
                }
                await apihandler.startDraw(param);//服务端状态流转：showWhat=3
            }catch(e){
                console.error(e)
            }
        },

        /**
         * 开奖
         */
        async liveDraw(){
            try{
                const param = {
                    activityId: this.activityId,
                    prizeId: this.currPrize.prizeId
                }
                await apihandler.liveDraw(param);//服务端状态流转：showWhat=4
            }catch(e){
                console.error(e)
            }
        },

        /**
         * 获取参加者名单
         */
        async getSignUpUserList(){
            try{
                const response = await apihandler.getSignUpUserList({activityId: this.activityId });
                return response.result.userList
            }catch(e){
                return []
            }
        },
        /**
         * 禁用操作
         */
        disableOption(type){
            switch(type){
                case 'switch':
                    return this.state != 0
                case 'background':  
                    return this.state != 0
                case 'qrcode': 
                case 'award-list': 
                    return this.state == 2
            }
        },
        imgFilter(val){
            if(!val){
                return val
            }
            if(val.indexOf('http://')>-1 || val.indexOf('https://')>-1){
                return val
            }else{
                let ele = allbuildinIcons.find((item)=>item.key == val)
                return ele.src
            }
        },
    }
};
</script>
<style lang="less">
html{
    font-size: 100px;
}
</style>
<style lang="less" scoped>
.manager-container{
    position: relative;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: .2rem;
    min-width: 1140px;
    color: #1A1C31;
    overflow-y: auto;

    .left{
        flex: none;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 20%;
        padding: .3rem .16rem;
        background-color: #fff;

        .prize{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 70%;

            .level{
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                font-size: .2rem;
                .pre, .next{
                    flex: none;
                    padding: .03rem .05rem;
                    width: .06rem;
                    height: .1rem;
                    cursor: pointer;

                    &.disabled{
                        cursor: not-allowed;
                    }
                }
                .pre{
                    background: url('@/themes/default/img/liveRaffle/btn_left.png') center no-repeat;
                    background-size: contain;
                }
                .next{
                    background: url('@/themes/default/img/liveRaffle/btn_right.png') center no-repeat;
                    background-size: contain;
                }
            }

            .name{
                font-size: .16rem;
                font-weight: bold;
                max-height: 40%;
                margin: .1rem 0;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                line-clamp: 3;
                word-break: break-all;
            }

            .pic{
                width: 80%;
                object-fit: contain;
            }

            .number{
                font-size: .14rem;
            }
            .notic{
                font-size: .12rem;
                color: #F53F3F;
            }
        }

        .operation{
            flex: none;
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            height: 20%;
            border-top: 1px solid #E5E6E8;
            border-bottom: 1px solid #E5E6E8;
            margin: .2rem 0;
            padding: .1rem 0;

            .action{
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                cursor: pointer;
                .icon{
                    width: .24rem;
                    height: .24rem;
                    margin-bottom: .1rem;

                    &.background{
                        background: url('@/themes/default/img/liveRaffle/btn_bgimage_nor.png') center no-repeat;
                        background-size: contain;

                        &.disabled{
                            background: url('@/themes/default/img/liveRaffle/btn_bgimage_dis.png') center no-repeat;
                            background-size: contain;
                            cursor: not-allowed;
                        }
                    }

                    &.qrcode{
                        background: url('@/themes/default/img/liveRaffle/btn_qrcode_nor.png') center no-repeat;
                        background-size: contain;

                        
                        &.disabled{
                            background: url('@/themes/default/img/liveRaffle/btn_qrcode_dis.png') center no-repeat;
                            background-size: contain;
                            cursor: not-allowed;
                        }
                    }

                    &.award-list{
                        background: url('@/themes/default/img/liveRaffle/btn-winnerslist_nor.png') center no-repeat;
                        background-size: contain;

                        
                        &.disabled{
                            background: url('@/themes/default/img/liveRaffle/btn_winnerslist_dis.png') center no-repeat;
                            background-size: contain;
                            cursor: not-allowed;
                        }
                    }
                }

                &.disabled{
                    cursor: not-allowed;
                    .background{
                        background: url('@/themes/default/img/liveRaffle/btn_bgimage_dis.png') center no-repeat;
                        background-size: contain;
                    }

                    .qrcode{
                        background: url('@/themes/default/img/liveRaffle/btn_qrcode_dis.png') center no-repeat;
                        background-size: contain;
                    }

                    .award-list{
                        background: url('@/themes/default/img/liveRaffle/btn_winnerslist_dis.png') center no-repeat;
                        background-size: contain;
                    }
                }
            }
        }

        .btn-group{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 10%;

            /deep/ .el-button{
                margin-right: .05rem;

                &.el-button--primary{
                    background-color: #565CF1;
                }
            }
        }
    }

    .preview{
        flex: auto;
        width: 80%;
        height: 100%;
    }
}

.bg-dialog{
    /deep/ .el-upload{
        width: 100%;
        height: 100%;
    }
    .upload-bg{
        .content{
            position: relative;
            .img{
                width: 100%;
                height: 2rem;
            }
            .tips{
                font-size: .12rem;
                color: #666;
                text-align: left;
                margin-top: .2rem;
            }
            .btn{
                position: absolute;
                left: 0;
                top: 0;
                display: none;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, .3);
                cursor: pointer;
                
                .text{
                    width: 100%;
                    height: .2rem;
                    line-height: .2rem;
                    text-align: center;
                    background-color: rgba(255, 255, 255, .8);
                }
    
                &.show{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }
}
</style>