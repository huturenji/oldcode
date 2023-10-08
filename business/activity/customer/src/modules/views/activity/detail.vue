<template>
    <div class="">
        <div class="card_box">
            <headBreadcrumb
                title="抽奖活动详情"
                :showbtn="false"
                @goback="gotoBack"
            ></headBreadcrumb>
            <div class="headTit">基础信息</div>
            <div class="formArea">
                <namedcomp compName="活动名称">
                    <span slot="component">{{ detailObj.name }}</span>
                </namedcomp>
                <namedcomp compName="抽奖形式">
                    <span slot="component">{{formStatus[detailObj.toolId]  }}</span>
                </namedcomp>
                <!-- <namedcomp compName="重复中奖" v-if="isXCKActivity(detailObj.toolId)">
                    <span slot="component">{{ detailObj.repeatDraw == 2? '允许': '不允许' }}</span>
                </namedcomp>                 -->
                
                <namedcomp compName="抽奖资格" v-if="!!detailObj.limitUserList">
                    <span slot="component">
                        <el-link @click="showInviteUserList=true" type="primary">抽奖资格</el-link>
                    </span>
                </namedcomp>
                <namedcomp compName="中奖率" v-if="isYingxiaoActivity(detailObj.toolId)">
                    <span slot="component">{{ detailObj.winRate }}%</span>
                </namedcomp>
                <namedcomp compName="抽奖限制次数" v-if="isYingxiaoActivity(detailObj.toolId)">
                    <span slot="component">总限制{{ detailObj.drawCount | countFmt }}；每日限制{{detailObj.dayDrawCount | countFmt}}</span>
                </namedcomp>
                <namedcomp compName="中奖限制次数" v-if="isYingxiaoActivity(detailObj.toolId)">
                    <span slot="component">总限制{{ detailObj.winCount | countFmt }}；每日限制{{detailObj.dayWinCount | countFmt}}</span>
                </namedcomp>
                <namedcomp compName="活动规则">
                    <span slot="component">
                        <el-link @click="showTips=true" type="primary">活动规则</el-link>
                    </span>
                </namedcomp>
                <namedcomp compName="创建时间">
                    <span slot="component">{{ detailObj.createTime | dateFmt }}</span>
                </namedcomp>
                <namedcomp compName="启用时间">
                    <span slot="component">{{ detailObj.startTime | dateFmt}}</span>
                </namedcomp>
                <namedcomp compName="结束时间">
                    <span slot="component">{{ detailObj.endTime | dateFmt}}</span>
                </namedcomp>
            </div>
        </div>
        <div class="content_box">
            <div class="headTit">{{ tableTitle }}</div>
            <div class="formArea no_padding">
                <el-table
                    :header-cell-style="{ background: '#F2F3F5',color:'#1D2129',height:'40px' }"
                    :data="detailObj.prizes"
                    >
                    <el-table-column
                        v-if="isXCKActivity()"
                        show-overflow-tooltip
                        align="center"
                        prop="gradeName"
                        label="奖项名称"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="name"
                        label="奖品名称"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="img"
                        label="奖品"
                        width="300">
                        <template slot-scope="scope">
                            <div class="goods">
                                <el-image class="img" :src="scope.row.imgUrl | urlFilter"  fit="cover">
                                    <div slot="error" class="image-slot">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image>
                                <span class="no_wrap skuname">{{scope.row.skuName||scope.row.name}}</span>
                            </div>
                        </template>
                    </el-table-column>
                   
                    <el-table-column
                        align="center"
                        prop="type"
                        label="奖品类型"
                        :formatter="prizeTypeFmt">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="price"
                        label="价格">
                        <template slot-scope="scope">
                            <span>{{scope.row.price?`￥${scope.row.price}`:'/' }}</span>
                        </template>    
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="effectedCount"
                        label="已生效奖品">
                        <template slot-scope="scope">
                            <span v-if="scope.row.type == '1'">{{scope.row.effectedCount||"0"}}</span>
                            <span v-if="scope.row.type == '2'">{{scope.row.count}}</span>
                        </template> 
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="effectingCount"
                        label="未生效奖品">
                        <template slot-scope="scope">
                            <span>{{scope.row.effectingCount||"0"}}</span>
                        </template> 
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="remainingCount"
                        label="剩余奖品"
                        :formatter="remcountFmt">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- <headline headTxt="操作日志"></headline> -->
        <div class="foot">
           <el-button v-if="isYingxiaoActivity()" type="default" @click="preview">{{qrcodeDetail[qRcode].tittle}}</el-button>
           <el-button v-if="detailObj.state=='2' && isXCKActivity()" type="default" @click="toOperation">去操作台</el-button>
           <el-link class="abtn" v-if="detailObj.state=='2' && isXCKActivity()" :underline="false" :href="projectionLink" target="_blank">去投屏页</el-link>
           <el-button v-if="detailObj.state!='3' && isYingxiaoActivity()" type="default" @click="toEdit">补充奖品</el-button>
           <el-button v-if="detailObj.state=='1'" type="primary" @click="turnOn">启用</el-button>
           <el-button v-if="detailObj.state!='1'" type="default" @click="toWinerlist">中奖名单</el-button>
           <el-button v-if="detailObj.state=='2'" type="primary" @click="turnOff">结束</el-button>
           <el-button v-if="detailObj.state=='2' && isXCKActivity()" type="default" @click="toRegisters">报名用户</el-button>
        </div>
        <el-dialog
            :title="qrcodeDetail[qRcode].tittle"
            :visible.sync="showPreview"
            :modal-append-to-body="false"
            :destroy-on-close="true"
            width="60%"
            center>
            <div class="qrcodeWarp" v-if='qRcode==1'>
                <div>{{qrcodeDetail[qRcode].des}}</div>
                <div id='qrcode' ref="qrcode" class="qrcode"></div>
                <div v-if="qrcodeDetail[qRcode].showBtn">
                    <el-button type="default" @click="downloadQrcode"><i class="el-icon-download"></i>下载二维码</el-button>
                    <div>抽奖链接：{{link}}</div>
                    <el-button type="primary" @click="copyStr(link)">复制链接</el-button>
                </div>
                <div>{{qrcodeDetail[qRcode].tips}}</div>
            </div>
             <div class="warp" v-if='qRcode==2'>
                <div class="qrcodeWarp">
                    <div>H5抽奖地址</div>
                    <div>{{qrcodeDetail[qRcode].des}}</div>
                    <div id='qrcode' ref="qrcode" class="qrcode"></div>
                    <div v-if="qrcodeDetail[qRcode].showBtn">
                        <el-button type="default" @click="downloadQrcode"><i class="el-icon-download"></i>下载二维码</el-button>
                        <div>抽奖链接：{{link}}</div>
                        <el-button type="primary" @click="copyStr(link)">复制链接</el-button>
                    </div>
                    <div>{{qrcodeDetail[qRcode].tips}}</div>
                </div>
                <div class="qrcodeWarp">
                    <div>小程序抽奖地址</div>
                    <div>{{qrcodeDetail[qRcode].des}}</div>
                    <div id='wxqrcode' ref="wxqrcode" class="qrcode"></div>
                    <div v-if="qrcodeDetail[qRcode].showBtn">
                        <el-button type="default" @click="downloadQrcode('wx')"><i class="el-icon-download"></i>下载二维码</el-button>
                        <div>抽奖链接：{{wxLink}}</div>
                        <el-button type="primary" @click="copyStr(wxLink)">复制链接</el-button>
                    </div>
                    <div>{{qrcodeDetail[qRcode].tips}}</div>
                </div>
             </div>
        </el-dialog>
        <el-dialog
            title="活动规则"
            :visible.sync="showTips"
            :modal-append-to-body="false"
            width="480px"
            center>
            <div class="decbox">
                <p v-html="detailObj.desc"></p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showTips = false">取 消</el-button>
                <el-button type="primary" @click="showTips = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="抽奖资格"
            :visible.sync="showInviteUserList"
            :modal-append-to-body="false"
            width="700px"
            center>
            <div class="codeDatabox">
                <el-table
                    :data="detailObj.limitUserList"
                    stripe
                    :header-cell-style="{ background: '#F7F8FA',color:'#1d2129' }"
                    size="mini"
                    >
                    <el-table-column
                    align="center"
                    prop="userId"
                    label="用户ID">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    prop="companyId"
                    label="企业ID">
                    </el-table-column>
                    <el-table-column
                    width="120"
                    align="center"
                    prop="channelId"
                    label="渠道ID">
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showInviteUserList = false">取 消</el-button>
                <el-button type="primary" @click="showInviteUserList = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { utils } from "opcl";
import apihandler from "bislibs/requestHandler/activityhandler";
import QRCode from 'qrcodejs2';
import { allbuildinIcons } from "bislibs/home/newlottery-lifecycle";
const headBreadcrumb = () => import("biscomponents/activity/head-breadcrumb.vue");
// 线下奖品类型：1-商云优惠券；2-实物奖品；3-虚拟奖品
const offPrizeTypeEumn = {
    '1':'商云优惠券',
    '2':'实物奖品',
    '3':'虚拟奖品',
    '4':'商云红包'
}
export default {
    components: {
        headBreadcrumb
    },
    data() {
        return {
            activityId:this.$route.query.activityId||utils.getStorage("customer_activityId"),
            detailObj: {},//订单详情对象
            showPreview: false, //是否显示预览的弹框
            showTips:false,//是否显示活动规则的弹框
            showInviteUserList:false,//是否显示抽奖资格的弹框
            link:'https://bplusdev.sinosun.com:18180/activitystudio/static/mobile/index.html#/pages/luck-draw/preview-luck-draw?activityId='+this.$route.query.activityId||utils.getStorage("customer_activityId"),
            wxLink:'', // 微信抽奖地址
            listOperations: [],
            pageObj: {
                totalRecord: 1,
                totalPages: 1,
                currPage: 1
            },
            showbtn:false,//是否展示顶部按钮
            formStatus :{"-10":"全部抽奖形式", "1": "大转盘","2": "砸金蛋","3": "九宫格","4": "红包雨","5": "现场开奖"},
            qrcodeDetail:{
                1:{
                    tittle:"预览",
                    des:"扫一扫即可试用抽奖活动",
                    showBtn:false,
                    tips:"因抽奖活动尚未发布，所以抽奖结果仅为体验效果，不作为领取奖品的凭证"
                },
                2:{
                    tittle:"活动链接",
                    des:"扫码二维码或打开活动链接，即可参与抽奖",
                    showBtn:true,
                    tips:"因抽奖活动已发布，所以抽奖结果真实有效，请慎重使用"
                }
            },
            qRcode:1,  // 1是预览 2 是启用
            tableTitle:"奖品信息"
        };
    },
    filters: {
        //格式化次数
        countFmt(val){
            if(val=='-1'){return "不限制"}
            return ` ${val} 次`
        },
        /**
         * 格式化日期
        */
        dateFmt(val){
            let startDate = val? new Date(val):"";
            return startDate?startDate.format('yyyy/MM/dd HH:mm:ss'):"--";
        },

        urlFilter(val){
            if(val.indexOf('http')>-1){
                return val
            }else{
                let ele = allbuildinIcons.find((item)=>item.key == val)
                return ele.src
            }

        }
    },
    watch: {},
    created() {},
    mounted() {
        this.getPageData();
    },
    methods: {
        getPageData() {
            const that = this;
            let reqData = {
                activityId: that.activityId
            };
            that.$iLoading.show();
            apihandler
                .detailActivity(reqData)
                .then((response) => {
                    if (response && response.result) {
                        that.detailObj = JSON.parse(JSON.stringify(response.result));
                        
                        that.detailObj.winRate = that.detailObj.winRate&&(that.detailObj.winRate*100).toFixed(2)
                        // console.log(that.detailObj.winRate)
                        that.qRcode = that.detailObj.state=="1"?1:2
                        that.setLink();
                        that.setProjection()
                        //如果是现场开奖项，需要调整一些显示
                        if(that.isXCKActivity(that.detailObj.toolId)){
                            that.tableTitle = "奖项信息"
                        }
                    }
                })
                .catch((e) => {
                    console.log(e)
                }).finally(() => {
                    that.$iLoading.hide();
                });
        },
        //跳转补充奖品页面
        async toEdit() {
            await utils.setStorage("customer_prizes",JSON.stringify(this.detailObj.prizes));
            this.$router.push({
                path: "/activity/addprize",
                query: {
                    activityId: this.activityId
                }
            });
        },
        //现场开奖，跳转去 操作台
        toOperation() {
            this.$router.push({
                path: "/raffle/liveRaffle/manager",
                query: {
                    activityId: this.activityId
                }
            });
        },
         //现场开奖，跳转去 报名用户
        toRegisters() {
            this.$router.push({
                path: "/activity/registeredlist",
                query: {
                    activityId: this.activityId
                }
            });
        },
        //跳转中奖名单页面
        toWinerlist() {
            this.$router.push({
                path: "/activity/winerlist",
                query: {
                    activityId: this.activityId
                }
            });
        },
        //返回
        gotoBack() {
            this.$router.go(-1);
        },
        //弹出预览二维码
        preview(){
            this.showPreview = true
            this.$nextTick(() => {//等待弹窗渲染再生成二维码，不然会报错
                this.qrcode();
            });
        },
        //生成二维码
        qrcode(){
            let that = this
            let qrcode = that.$refs.qrcode
            qrcode = new QRCode('qrcode',{
                width:200,
                height:200,
                text:that.link
            })
            // 增加微信二维码
            if(that.qRcode==2){
                new QRCode('wxqrcode',{
                width:200,
                height:200,
                text:that.wxLink
            })
            }
        },
        //启用活动
        turnOn() {
            let that = this
            that.$confirm('确定要启用该活动吗？')
            .then(_ => {
                that.editActivity(1)
            })
            .catch(_ => {});
        },
        //结束活动
        turnOff() {
            let that = this
            that.$confirm('确定要结束该活动吗？')
            .then(_ => {
                that.editActivity(2)
            })
            .catch(_ => {});
        },
        //改变活动状态
        editActivity(val){
            let that = this
            let reqData = {
                activityId: that.activityId,
                state: val,
                "channelId": "",
                "companyId": "",
                "userId": apihandler.userInfo.userId,
            }
            let toastval = val==1?"启用":"结束"
            that.$iLoading.show();
            apihandler
                .editActivity(reqData)
                .then((response) => {
                    if (response && response.resultCode == "0") {
                        utils.showToast(`${toastval}成功`);
                        that.$router.push({
                            path: "/activity/list"
                        });
                    }else if(val==1){
                        utils.showToast(`${toastval}失败,您的活动订单尚未审核通过，如有疑问，请联系客服400-855-6588`);
                    }else{
                        utils.showToast(`${toastval}失败`);
                    }
                })
                .catch((e) => {
                    console.log(e)
                }).finally(() => {
                    that.$iLoading.hide();
                });
        },
        //格式化奖品类型
        prizeTypeFmt(val) {
            if(val.type=="1"){
                return "线上奖品"
            }else if(val.type=="2"){
                return `线下奖品(${offPrizeTypeEumn[val.offPrizeType]})`
            }
        },
        //处理剩余奖品数量的展示
        remcountFmt(row){
            if(row.type=="1"){
                return row.effectedCount?row.remainingCount:"--"
            }else{
                return row.remainingCount
            }
        },
        //下载二维码
        downloadQrcode(client){
            let qrcode = this.$refs.qrcode
            if(client=='wx'){
                qrcode = this.$refs.wxqrcode
            }
            let a = document.createElement("a")
            a.href = qrcode.childNodes[1].src
            a.download = "活动二维码"
            a.click()
        },
        //设置二维码链接
        setLink(){
            let hostname = window.location.hostname;
            let hostMap={
                "bplusdev.sinosun.com":"https://bplusdev.sinosun.com:18180",
                "bplussit.sinosun.com":"https://bplussit.sinosun.com:18380",
                "bplus-uat.sinosun.com":"https://bplus-uat.sinosun.com",
                "cloud.sinosun.com":"https://cloud.sinosun.com"
            }

            let origin = this.detailObj.state=="1"?"pages/luck-draw/preview-luck-draw":""
            let link = (hostMap[hostname]||"https://cloud.sinosun.com")+"/activitystudio/static/mobile/index.html#/"+origin+"?activityId="+this.$route.query.activityId||utils.getStorage("customer_activityId");
            this.link = link

            let wxhostMap = {
                "bplusdev.sinosun.com":'https://bplusdev.sinosun.com',
                "bplussit.sinosun.com":'https://bplussit.sinosun.com',
                "bplus-uat.sinosun.com":'https://bplus-uat.sinosun.com',
                "cloud.sinosun.com":'https://cloud.sinosun.com'
            }
            let wx_link = `${wxhostMap[hostname]||'https://cloud.sinosun.com'}/activitystudio-index?activityId=${this.$route.query.activityId||utils.getStorage("customer_activityId")}`
            this.wxLink = wx_link
        },
        /**
         * 复制字符串
         */
        copyStr (str) {
            var save = function (e){
                e.clipboardData.setData('text/plain',str);//下面会说到clipboardData对象
                e.preventDefault();//阻止默认行为
            }
            document.addEventListener('copy',save);
            document.execCommand("copy");//使文档处于可编辑状态，否则无效
            utils.showToast('复制成功');
            document.removeEventListener('copy',save);
        },
        //判断是否是营销类活动
        isYingxiaoActivity(activityType){
            let toolId = !!activityType ? activityType: this.detailObj.toolId
            return toolId ==1 || toolId ==2|| toolId ==3|| toolId ==4
        },
        //判断是否是现场开奖活动
        isXCKActivity(activityType){
            let toolId = !!activityType ? activityType: this.detailObj.toolId
            return toolId ==5
        },
        //现场开奖，跳转去 投屏页
        setProjection () {
            //现场开奖，这里的链接地址是 投影的大屏地址
            let hostname = window.location.hostname;
            let hostMap={
                "bplusdev.sinosun.com":"https://bplusdev.sinosun.com:18180",
                "bplussit.sinosun.com":"https://bplussit.sinosun.com:18380",
                "bplus-uat.sinosun.com":"https://bplus-uat.sinosun.com",
                "cloud.sinosun.com":"https://cloud.sinosun.com"
            }

            let origin = "raffle/liveRaffle/preview"
            let link = (hostMap[hostname]||"https://cloud.sinosun.com")+"/activitystudio/static/customer/index.html#/"+origin+"?activityId="+this.$route.query.activityId||utils.getStorage("customer_activityId");
            this.projectionLink = link
        },        
    }
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
.headbreadcrumb{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 25px;
    font-size: 16px;
    color: #1D2129;
    border-bottom: 1px solid #E5E6E8;
    .lefttit{
        display: flex;
        align-items: center;
        font-weight: 600;
        .icon{padding-right: 10px;}
    }
}
.headTit{
    color: #1D2129;
    font-size: 14px;
    padding:  15px 25px;
    position: relative;
    font-weight: 700;
}
.formArea {
    padding: 10px 25px;
    display: flex;flex-wrap: wrap;
    /deep/.namedcomp{
        width: 33%;
        color: #1D2129;
        .compNameA{text-align: left;color: #4E5969;}
    }
    .img {
        width: 70px;
        height: 70px;
        margin: 0 10px 0 10px;
        flex-grow:auto;
    }
    .skuname{max-width: 130px;}
    .img .el-icon-picture-outline{font-size: 70px;}
    .spanRight {
        margin-right: 15px;
    }
    .agreement {
        border: 1px solid #e2e2e2;
        border-radius: 5px;
        background: white;
        margin: 10px 0;
        .agreementindex {
            border: 1px solid #e2e2e2;
            border-radius: 5px;
            background: #e2e2e2;
            color: black;
            padding: 5px;
        }
    }
    .goods{
        display: flex;
        align-items: center;
        text-align: left;
        flex: 0 0 auto;
    }
}
.no_padding{padding: 0;}
.warp{
    width: 100%;
    display: flex;
}
.qrcodeWarp{
    width: 100%;
    height: 480px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: #e4e4e4 solid 1px;
    padding-top: 15px;
    div{
        width: 100%;
        text-align: center;
        margin-bottom: 15px;
    }
    .qrcode{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .qrcodetitle{
        font-size: 18px;
        font-weight: bold;
    }
}
.decbox{
    max-height: 670px;
    min-height: 100px;
    overflow-y: auto;
}
.codeDatabox{
    max-height: 470px;
    min-height: 100px;
    overflow-y: auto; 
}
.foot {
    text-align: center;
    width: calc(100% - 200px);
    height: 80px;
    position: fixed;
    bottom: 0;
    left: 200px;
    right: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    .backBtn {
        background: #e2e2e2;
        color: white;
        width: 91px;
        margin: 0 15px;
        font-size: 14px;
    }
    .abtn{
        padding: 9px 16px;
        border: 1px solid #DCDFE6;
        background: white;
        border-radius: 4px;
        margin: 0 10px;
    }
    .abtn:hover{
        border-color: #c6e2ff;
        background-color: #ecf5ff;
    }
}
</style>


