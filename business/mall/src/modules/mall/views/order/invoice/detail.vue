<!-- 查看发票详情页面 -->
<template>
    <div class="orderBill-wrap" v-if="!loading">
        <div class="section-box">
        <section class="m-details first-part">
            <p class="rule-text" :class="showAllText?'word-nowrap':''">{{billRules.part_one}}</p>
            <p class="rule-text" v-show="!showAllText">{{billRules.part_two}}</p>
            <div class="btn-wrap">
                <span class="btn-contral normal-btn" @click="showAllText=!showAllText">
                    <span class="btn-text cursor-btn ">{{showAllText?'展开':'收起'}}</span>
                    <span class="uparrow" :class="showAllText?'':'transformTop'">
                        <Icon type='icon_common_downarrow' size='0.22'></Icon>
                    </span>
                </span>
            </div>
        </section>
        <section class="m-details">
            <p class="text-box">
                <span class="text-label second-text">开票状态</span>  
                <span class="text-value" :class="[(invoiceInfo.invoiceState == 1||invoiceInfo.invoiceState == 3)?'actived':'unactive']">{{tranformState(invoiceInfo.invoiceState)}}</span>  
            </p>
        </section>
        <section class="m-details">
            
            <p class="text-box">
                <span class="text-label">订单状态</span>  
                <span class="text-value">{{orderStateText}}</span>  
            </p>
             <p class="text-box has-padding">
                <span class="text-label">订单编号</span>  
                <span class="text-value">{{orderInfo.orderNo}}</span>  
            </p>
             <p class="text-box has-padding">
                <span class="text-label">下单时间</span>  
                <span class="text-value">{{dealDate(orderInfo.createTime)}}</span>  
            </p>
             <p class="text-box has-padding">
                <span class="text-label">发票类型</span>  
                <span class="text-value">{{invoiceInfo.invoiceType == 1?'个人':'企业'}}</span>  
            </p>
        </section>
        <section class="m-details">
            <div class="bill-img-box">
                <div class="bill-bg-l">
                    <img class="invoice-bg" src="~themes/default/img/order/orderDetail/icon_invoice_seal@2x.svg" />
                    <div class="bill-bg-s">
                        <span class="billname-text">{{billName}}</span>
                    </div>
                </div>
            </div>
            <p class="text-box has-padding">
                <span class="text-label other-color">发票内容</span> 
                <span class="text-value">{{invoiceInfo.invoiceContent}}</span> 
                <span class="btn-contral cursor-btn normal-btn" v-show="(invoiceInfo.invoiceState==1 || invoiceInfo.invoiceState==3) && !!pdfSrcList.length"  @click="clickHandle()">查看发票</span>
            </p>
        </section>
        <section class="m-details" v-if="invoiceInfo.invoiceType == 2">
            <p class="text-box">
                <span class="text-label">单位名称</span>  
                <span class="text-value">{{invoiceInfo.invoiceTitle}}</span>  
            </p>
            <p class="text-box has-padding">
                <span class="text-label">单位税号</span>  
                <span class="text-value">{{invoiceInfo.taxNo}}</span>  
            </p>
            <p class="text-box has-padding">
                <span class="text-label">注册地址</span>  
                <span class="text-value">{{invoiceInfo.registerAddress || ''}}</span>  
            </p>
            <p class="text-box has-padding">
                <span class="text-label">注册电话</span>  
                <span class="text-value">{{invoiceInfo.registerPhone || ''}}</span>  
            </p>
            <p class="text-box has-padding">
                <span class="text-label">开户银行</span>  
                <span class="text-value">{{invoiceInfo.bank || ''}}</span>  
            </p>
            <p class="text-box has-padding">
                <span class="text-label">银行账号</span>  
                <span class="text-value">{{invoiceInfo.account || ''}}</span>  
            </p>
        </section>
        <section class="m-details" >
            <p class="text-box" v-if="invoiceInfo.invoiceType == 1">
                <span class="text-label">收票人</span>  
                <span class="text-value">{{invoiceInfo.invoiceTitle}}</span>  
            </p>
            <p class="text-box has-padding">
                <span class="text-label">联系电话</span>  
                <span class="text-value">{{dealxing(invoiceInfo.phone)}}</span>  
            </p>
            <p class="text-box has-padding">
                <span class="text-label">邮箱</span>  
                <span class="text-value">{{invoiceInfo.email}}</span>  
            </p>
        </section>
        <section class="m-details">
            <p class="text-box align-center">
                <span class="text-label">开票进度</span>  
                <span class="text-value">
                     <span>发票将在订单完成后48小时内开具</span>
                    </span>  
            </p>
            <div class="steps-box">
                <Steps :Steps='stepNo' :SetData='invoiceProcessArray'></Steps>
            </div>
        </section>
        </div>
        <!-- 发票未开出，和订单未完成的情况，可修改发票 -->
        <div class="bottom-btn-box" v-if='invoiceInfo.invoiceState == 0 && orderInfo.orderState != 5'>
            <span class="btn-apply-aftersale cursor-btn normal-btn" @click="applyAfterSale">修改发票</span>
        </div>
        <!-- 发票已开出，时间未超出一年的情况，  可换开发票 -->
        <div class="bottom-btn-box" v-if='invoiceInfo.invoiceState == 1 && reInvoiceFlag'>
            <span class="btn-apply-aftersale cursor-btn normal-btn" @click="applyAfterSale">换开申请</span>
        </div>
        <div v-transfer-dom>
            <popup v-model="showPdfPopup" height='100%' width="100%" position="right" class="popEditBox" :popup-style={zIndex:1001}>
                <iframe v-if="showPdf" :src="pdfSrc" class="iframe_dom" :style="iframeStyle" frameborder="0"></iframe>
            </popup>
        </div>


        <div v-transfer-dom>
            <popup v-model="showInvoiceList" height='37%' :popup-style="{'border-radius':'.2rem .2rem 0px 0px','z-index':'1000'}">
                <div class="invoice-content-detail">
                    <AddressTitle title=''  @closePopup='closePopup' :showBottomBorder='showBottomBorder'></AddressTitle>
                    <section class="select-content">
                        <P class="select-item" v-for="(item,index) in pdfSrcList" :key="index" @click="checkInvoce(item)">
                            <span class="item-left">发票{{toChinesNum(index+1)}}</span>
                        </P>
                    </section>
                </div>
            </popup>
        </div>
    </div>
</template>
<script>
import { Popup, TransferDom  } from 'vux';
const Steps = ()=>import('common/components/base/steps.vue');
const Icon = ()=>import('common/components/base/Icon.vue');
const AddressTitle = ()=>import('common/components/base/AddressTitle.vue');
import orderHandler from 'common/lib/requestHandler/orderHandler'
import InvoiceHandler from 'common/lib/requestHandler/invoiceHandler.js';
import extendUtils from 'common/lib/utils';
import {getOrderStatus} from 'common/lib/enum/orderStatusEnum';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
export default {
    components: {
        Steps,
        Icon,
        Popup,
        AddressTitle
    },
    directives: {
        TransferDom
    },
    mixins: [tChatEventMixin], 
    data() {
        return Object.assign(extendUtils.stateManager.setData([
            {
                name:'showPdfPopup',
                show:{
                    title:'预览',
                },
                hide:{
                    title:'发票详情',
                    callback:()=>{
                        if(this.$loading.isShow){
                            this.$loading.hide();
                        }
                        this.showPdf = false;
                    }
                }
            },
            {
                name:'showInvoiceList',
            }
        ], this), {
            stepNo:0,
            showMess:false,
            showAllText:true,
            orderInfo:{}, //订单信息
            billRules:{
                part_one:'一、发票开具规则： 1）自营订单完成后，电子发票在24小时内自动开具(如在月初1-6号则48小时内开具)；增值税专用发票(纸质)如资质审核通过，将在订单完成后3-5个工作日内为您寄出，邮寄信息详见收票人信息；2）发票开具金额为您实际支付金额，不包括、优惠券、积分、红包等支付金额；',
                part_two:'二、发票补开换开及修改规则： 1）自营订单完成前可修改发票信息，请您务必确认修改内容；发票开具成功后，1年内可支持一次发票换开；2）更换增值税专用发票，需将原票寄回兆日，邮寄地址请见收票人信息页；',
            },
            title:'发票详情',
            invoiceInfo:{},
            billName:'增值税普通发票(电子)',
            loading:true,
            pdfSrc:'',
            pdfSrcList:[],
            iframeStyle:{
                width: '100%',
                height: '100%',
            },
            iframeStyle_ios:{
                width: '100%'
            },
            invoiceProcessArray:['订单下单','订单完成','发票开具'],
            showPdf:false,
            firstLoad:true,
            showBottomBorder:true,
            reInvoiceFlag:true
        })
    },
    beforeRouteLeave(to,from,next){
        this.$loading.hide();
        this.showPdf = false;
        next();
    },
    async created(){
        //订单详情跳转过来的场景通过url传递参数
        if(!!this.$route.query.item && ''!=this.$route.query.item){
            this.orderInfo = JSON.parse(this.$route.query.item);
        //推送场景通过url传递orderNo查询订单详情
        }else if(!!this.$route.query.orderNo && ''!=this.$route.query.orderNo){
            let data;
            try {
                data = await orderHandler.getOrderDetail({orderNo: this.$route.query.orderNo});
            } catch (error) {
                console.log(error)
            }
            this.orderInfo = data.result.order; 
        }
        this.init(this.orderInfo.orderNo);
    },
    computed:{
        orderStateText(){
            return getOrderStatus(this.orderInfo.orderState, {paymentType: this.orderInfo.paymentType}).name;
        },
        isAndroid(){
            return extendUtils.getNavigatorType() == 'android';
        },
        isIOS(){
            return extendUtils.getNavigatorType() == 'ios';
        },
        isPC(){
            return extendUtils.isPC();
        }
    },
    methods: {
        //阿拉伯数字转中文数字
        toChinesNum(num){
            let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
            let unit = ["", "十", "百", "千", "万"];
            num = parseInt(num);
            let getWan = (temp) => {            
                let newNum = "";
                if(temp >= 10 && temp<=19){ //10-19特殊处理 即删掉前面的‘一’
                
                    newNum = unit[1]; //'十'
                    let strArr = temp.toString().split("");
                    newNum = newNum + ((strArr[1] == 0) ? '' : changeNum[strArr[1]]);
                }else{
                    let strArr = temp.toString().split("").reverse();
                    for (var i = 0; i < strArr.length; i++) {
                        newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
                    }
                }
                 
                return newNum;
            }   
            let overWan = Math.floor(num / 10000);
            let noWan = num % 10000;
            if (noWan.toString().length < 4) noWan = "0" + noWan;
            return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
        },

        /**
         * 电话号码显示的脱敏处理
         * @param str 完整的电话号码字符串
         */
        dealxing(str){
            return extendUtils.sensitiveHide(str);
        },
        
        //开票状态转换
        tranformState(state){
            if(state == 1){
                return '已开票'
            }else if(state == 2){
                return '换开中'
            }else if(state == 3){
                return '已换开'
            }else{
                return '待开票'
            }
        },
        //初始化获取发票详情
        init(orderNo){
            let obj = {
                orderNo:orderNo
            }
            this.$loading.show()
            InvoiceHandler.getInvoiceDetails(obj).then(res=>{
                this.$loading.hide();
                this.loading = false;
                this.invoiceInfo = res.result.orderInvoice;
                //判断是否过期  reInvoiceFlag: 0  超过一年不能换开；1 :可以换开
                if(this.invoiceInfo.reInvoiceFlag == 0){
                    //超过一年   不能换开发票
                    this.reInvoiceFlag = false;
                }
                this.stepNo = res.result.orderInvoice.invoiceProcess.length-1 || 0;
                if(this.invoiceInfo.invoiceState == 2 || this.invoiceInfo.invoiceState == 3){
                    this.invoiceProcessArray = ['已提交','财务处理','发票开具'];
                }
                if(res.result.orderInvoice.invoiceUrl.length){
                    this.pdfSrcList = res.result.orderInvoice.invoiceUrl;
                }else{
                    this.pdfSrcList = [];
                }
            }).catch(e=>{
                this.$loading.hide();
                this.loading = false;
                console.log(e);
            });
        },
        //处理pdf url地址参数，以免ios多开窗口
        dealUrl(url){
            //处理http的pdf路径请求在ios上不显示问题
            if(this.isIOS){
                if(url.includes('https')){
                    //https请求不作处理
                }else{
                    //http请求升级为https
                    if(url.includes('http')){
                        url = url.replace('http','https');
                    }
                }
            }
            if(url.includes('?')){
                return url+'&sswbv_multipage=false';
            }else{
                return url+'?sswbv_multipage=false';
            }
        },
        //关闭弹窗
        closePopup(){
            this.showInvoiceList = false
        },
        //处理时间格式
        dealDate(str){
            str = str+'';
            if(str.length == 13){
                return new Date(str*1).format('yyyy-MM-dd HH:mm:ss');
            }else{
                return str;
            }
        },
        //发票换开申请事件处理 
        applyAfterSale(){
            this.$router.push({
                path:'/invoiceReapply',
                query:{
                    invoiceInfo:JSON.stringify(this.invoiceInfo),
                    orderInfo:JSON.stringify(this.orderInfo)
                }
            })
        },
        
        // 查看发票事件处理
        clickHandle(item){
            if(this.pdfSrcList.length == 0){
                return false;
            }else if(this.pdfSrcList.length == 1){
                 //如果只有一张发票，直接查看发票
                this.checkInvoce(this.pdfSrcList[0]);
            }else{
                 //多张的情况从弹窗里面选择
                this.showInvoiceList = true;
            }
        },

        /** 
        * 预览发票
        */
        checkInvoce(path){
            if(!path){ return }
            this.pdfSrc = path;
            this.showPdf = false;
            if(this.isPC){ //pc端直接用iframe预览
                this.showPdfPopup = true;
                this.$loading.show();
                setTimeout(() => {
                    this.showPdf = true;
                    this.$loading.hide();
                }, 300)
            }else if(this.isIOS){ //ios利用jsBridge方法 FilePreviewWidget实现pdf的预览
                let previemJson = {
                    "fileId": new Date().getTime(),
                    "previewUrl": path,
                    "downloadUrl": path,
                    "fileSize": parseFloat(35),
                    "fileName": 'invoice' + new Date().format('yyyy/MM/dd HH:mm:ss') + '.pdf'
                }
                extendUtils.FilePreviewWidget(previemJson);
            }else if(this.isAndroid){ //Android直接用iframe预览 但是不展示弹窗，而是直接下载
                this.$nextTick(()=>{
                    this.showPdf = true;
                })
            }
        },

        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            //推送过来的回退1步
            if('push' == this.$route.query.pageFrom){
                extendUtils.goBackPage(null, 1);
            }else{
                this.$router.back();
            }
        },
    }
};
</script>
<style scoped lang="less">
@import "~themes/default/styles/order/orderList/orderBill.less";
</style>