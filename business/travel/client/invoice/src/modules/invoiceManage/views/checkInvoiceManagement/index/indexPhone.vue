<template>
    <div class="index-phone">
        <div class="scan_it_bg">
            <!-- 判断pc还是移动端显示不同的图片 -->
            <template v-if="isPC">
                <div @click="sacnIt" class="scan_item scan_item_pc">
                    <img src="~themes/default/img/icon_invoice_file.svg"/>
                </div>
                <div class="tips_pc">选择发票文件</div>
            </template>
            <template v-else>
                <div @click="sacnIt" class="scan_item">
                    <img src="~themes/default/img/icon_invoice_scancode_nor@2x.svg"/>
                </div>
            </template>
              
            <div @click="showCheckRules = true" class="check_rule">
                <!-- <icon type="icon_common_prompt" size=".28"/> -->
                查验规则
            </div>
                
            
        </div>
        <div @click="gotoInput" class="input">
            <span class="title_part">
                <icon type="icon_common_edit" size=".32"/><span>手动输入查验</span>
            </span>
            <span><icon type="icon_common_rightarrow" size=".24"/></span>
        </div>

        <div @click="gotoCheckRecord" class="input">
            <span class="title_part">
                <icon type="icon_invoice_check" size=".32"/><span>查验记录</span>
            </span>
            <span><icon type="icon_common_rightarrow" size=".24"/></span>
        </div>

         <!--查验规则弹窗-->
        <div v-transfer-dom>
            <popup @click.native="closeDesc" v-model="showCheckRules" height='100%' :style="{background:'#fff'}">
                <checkRules @closeDesc="closeDesc"/>
            </popup>
        </div>
         <!--查验loading-->
         <div v-transfer-dom>
            <Loading :show="showLoading" text='查验中，请稍后...'/>
        </div>        
    </div>
</template>
<script>
import icon from 'components/icon';
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';
import {invoiceTypeMap} from '../common/checkInvoiceManagement'; // eslint-disable-line
import {
    TransferDom,
    Popup,
    Loading
} from 'vux';
import checkRules from "../checkRule/checkRule";
import mixin from '../common/checkInvoiceMixin.js';
export default {
    directives: {TransferDom},
    components: {
        Popup,
        checkRules,
        Loading,
        icon
    },
    mixins:[mixin,invoiceHandler.mixin.tChatEventMixin],
    data(){
        let managerData = invoiceHandler.stateManager.setData([
            {
                name: 'showCheckRules',
                show: {
                    title: '查验规则'
                },
                hide: {
                    callback: function () {},
                    title: '发票查验'
                }
            }
        ], this);
        return Object.assign(managerData,{
            invoiceCode:'',//发票代码
            invoiceNumber:'',//发票号码
            billingDate:'',//开票日期：YYYY-MM-DD
            totalAmount:'',//合计金额（不含税）
            checkCode:'',//校验码后6位
            orderNo:'',//订单号
            salesTaxNo:'',//销方税号
            showLoading: false,//查验的loading
            isPC: invoiceHandler.isPC(),
            chooseInvoiceType:null,//发票类型
            invoiceTypeMap: invoiceTypeMap//发票类型map
        })     
    },
    created: function () {
      
        //注册并监听t信返回事件
        //   invoiceHandler.appBack(function(){
        //     invoiceHandler.throttle(function() {
        //         invoiceHandler.stateManager.closeTopPop(()=>{
        //             if(that.$route.query.fromPage && that.$route.query.fromPage == 'invoiceAssist'){
        //                  that.$router.back();  
        //             }else{
        //                 //当为小应用配置时直接回退
        //                 invoiceHandler.goBackPage('-13454', 1, null);
        //             }
                    
        //         });
        //     }.bind(this));
        //   },that);
        //显示返回按钮
        //   invoiceHandler.toggleReturnBtn(true);
     
    },
    mounted: function () {
    },
    methods: {
        //注册并监听t信返回事件
        goBackFun(){
            let that = this;
            if (that.$route.query.fromPage && that.$route.query.fromPage == 'invoiceAssist'){
                that.$router.back();  
            } else {
                //当为小应用配置时直接回退
                invoiceHandler.closePage('', 1, null);
            }
        },
        closeDesc(){
            this.showCheckRules = false;
        },
        //跳转到手动查验
        gotoInput(){
            this.$router.push({
                path: '/check/pc',
                query: {
                    fromPage:'invoiceAssist'
                }
            });
        },
        //跳转到查验记录
        gotoCheckRecord(){
            this.$router.push('/check/record');
        },
        //调取T信扫一扫的功能
        sacnIt(){        
            let that = this;
            let Json = {
                action: 'action_common_qrcode_scan',
                responseKeyList: [{
                    key: 'qrcode',
                    value: '',
                    type: 'string'
                }]
            };
            sinosdk.sino.execAction(Json).then(res=>{
                //扫描到的内容
                console.log('res', res)
                if (!!res && !!res[0] && !!!res[0].value){
                    invoiceHandler.showToast('未检测到二维码，请选择正确的发票文件');
                } else {

                    let scanContent = res[0].value;
                    //alert(scanContent);
                    //    return
                    //验证扫描到的是不是发票的二维码
                    let invoiceArr = scanContent.split(',');
                    if (invoiceArr.length > 1){
                        that.AnalysisParam(invoiceArr);
                    } else {
                        that.wrongErWeiMa();
                    }
                }
            })
        },
        //错位的二维码也就是非发票的二维码 弹窗提示
        wrongErWeiMa(){
            invoiceHandler.showConfirm('二维码识别错误，请使用手动输入查验', function(){}, 1, null, '确定', null, null, true);
            return; // eslint-disable-line
        },
        //获取查询条件失败 弹窗提示
        wrongErWeiMaOption(){
            invoiceHandler.showConfirm('获取查询条件失败，请使用手动输入查验', function(){}, 1, null, '确定', null, null, true);
            return; // eslint-disable-line
        },
        //通过发票代码判断发票类型
        getInvoiceType(invoiceCode){
            //通过发票代码确认发票类型
            let subType = null;
            let invoiceCodeSub = "";
            if (invoiceCode.length == 10) {
                invoiceCodeSub = invoiceCode.substring(7, 8);
                if (invoiceCodeSub == "1" || invoiceCodeSub == "5") {
                    subType = "01";
                } else if (invoiceCodeSub == "6" || invoiceCodeSub == "3") {
                    subType = "04";
                } else if (invoiceCodeSub == "7" || invoiceCodeSub == "2") {
                    subType = "02";
                }
            }
            if (invoiceCode.length == 12) {
                var fpdmAddNum = invoiceCode.substring(1, 5);
                invoiceCodeSub = invoiceCode.substring(0, 1);
                if (invoiceCodeSub == "0" && invoiceCode.substring(10, 12) == "11") {
                    subType = "10";
                } else if (invoiceCodeSub == "0" && (invoiceCode.substring(10, 12) == "04"
                        || invoiceCode.substring(10, 12) == "05")) {
                    subType = "04";
                } else if (invoiceCodeSub == "0" && (invoiceCode.substring(10, 12) == "06" || invoiceCode.substring(10, 12) == "07")) {
                    subType = "11";
                } else if (invoiceCodeSub == "0" && invoiceCode.substring(10, 12) == "12") {
                    subType = "14";
                } else if (invoiceCodeSub == "0" && invoiceCode.substring(10, 12) == "17") {
                    subType = "15";
                } else if (!invoiceCodeSub == "0" && invoiceCode.substring(7, 8) == "2") {
                    subType = "03";
                } else if (invoiceCodeSub == "0" && invoiceCode.substring(10, 12) == "13") {
                    subType = "08";
                } 
                if (invoiceCodeSub=="1"&&(invoiceCode.substring(10, 12)=="10"||invoiceCode.substring(10, 12)=="00")){
                    subType = "21";
                }
                if (fpdmAddNum == "3300") {
                    subType = "36";
                }
            }
            return subType;
        },
        /**
         * 日期格式添加斜线分隔
        */
        clearParam(){
            this.invoiceCode='';//发票代码
            this.invoiceNumber='';//发票号码
            this.billingDate='';//开票日期：YYYY-MM-DD
            this.totalAmount='';//合计金额（不含税）
            this.checkCode='';//校验码后6位
            this.orderNo='';//订单号
            this.salesTaxNo='';//销方税号
        },        
        /**
         * 日期格式添加斜线分隔
        */
        dateAddBias(date){
            date = date.replace(/\//g, '');
            date = date.replace(/-/g, '');
            let y = date.slice(0, 4);
            let m = date.slice(4, 6);
            let d = date.slice(6, 8);
            return `${y}/${m}/${d}`
        },
        /**
         * 解析出发票二维码需要的参数 扫描发票二维码返回的格式是一定的
         * 增值税专用发票01
         * 增值税专用发票（电子）08
         * 机动车销售统一发票03
         * 二手车销售统一发票15
         * 全电纸票（增值税专用发票）91
         * 增值税普通发票04
         * 增值税普通发票（电子）10
         * 增值税普通发票（卷式）11
         * 增值税普通发票（通行费）14
         * 区块链发票21
         * 电子发票（增值税专用发票）09
         * 电子发票（普通发票）83
         * 全电纸票（普票）92
         * 通用电子发票36
        */
        AnalysisParam(invoiceArr){
            this.clearParam();
            let length = invoiceArr.length;
            let subType = null;
            let invoiceCode = '';
            //通过数组确定发票类型
            if (length==4){ //电子发票（增值税专用发票）长度为4
                this.chooseInvoiceType = 3;
                subType = '09';
                this.invoiceNumber = invoiceArr[1];
                this.billingDate = this.dateAddBias(invoiceArr[2]);
                this.totalAmount = invoiceArr[3];
            } else if (length==5){ //浙江通用（电子）发票长度为5
                this.chooseInvoiceType = 5;
                subType = '36';
                //二维码不包含订单号信息，无法扫码查验
                this.wrongErWeiMaOption();
                return;
            } else if ((length==8 || length==9) && (invoiceArr[2]=='' || invoiceArr[2]==' ')){ //电子发票（普通发票）没有发票代码
                this.chooseInvoiceType = 3;
                subType = '83';
                this.invoiceNumber = invoiceArr[3];
                this.billingDate = this.dateAddBias(invoiceArr[5]);
                this.totalAmount = invoiceArr[4];
            } else {
                //其他类型的二维码数据
                invoiceCode = invoiceArr[2];
                if (invoiceCode=='' || !!!invoiceCode){
                    this.wrongErWeiMaOption();
                    return
                }
                subType = this.getInvoiceType(invoiceCode);
                if (!subType){
                    this.wrongErWeiMaOption();
                    return
                }
                let invoiceType0subTypes = ['01','08','03','15'];//91暂不支持
                let invoiceType1subTypes = ['04','10','14'];//11二维码没有检验码信息
                let invoiceType4subTypes = [];//92暂不支持
                if (invoiceType0subTypes.indexOf(subType) > -1){
                    this.chooseInvoiceType = 0;
                    this.invoiceCode = invoiceArr[2];
                    this.invoiceNumber = invoiceArr[3];
                    this.billingDate = this.dateAddBias(invoiceArr[5]);
                    this.totalAmount = invoiceArr[4];
                } else if (invoiceType1subTypes.indexOf(subType) > -1){
                    this.chooseInvoiceType = 1;
                    this.invoiceCode = invoiceArr[2];
                    this.invoiceNumber = invoiceArr[3];
                    this.billingDate = this.dateAddBias(invoiceArr[5]);
                    this.checkCode = invoiceArr[6].substring(invoiceArr[6].length-6);
                } else if (invoiceType4subTypes.indexOf(subType) > -1){
                    this.chooseInvoiceType = 4;
                } else {
                    this.wrongErWeiMaOption();
                    return
                }
            }
            this.verInvoiceFun();
        }
      
    }
}

</script>
<style lang="less" scoped>
@import '~themes/default/styles/indexPhone.less';
</style>
