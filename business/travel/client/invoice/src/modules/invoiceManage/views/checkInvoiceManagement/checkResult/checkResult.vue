<template>
    <div class="check-result">
        <div v-if="loading">
            <LoadingX tip='获取查验详情中，请稍后...' :spinning="true" :turn="true" />
        </div>
        <!-- 查验成功dom -->
        <div v-else class="check_success">
            <div class="result_icon">
                <img src="~themes/default/img/icon_invoice_success@2x.svg">
                <p>发票查验通过</p>
            </div>
            <div  class="des_wrap">

                <div class="des_box">
                    <div class="des_item">
                        <div class="left">{{invoiceItemDetail.invoiceType==2?'承运人名称':'购买方名称'}}</div>
                        <div class="right">{{invoiceItemDetail.purchaserName}}</div>
                    </div>
                    <div class="des_item">
                        <div class="left">{{invoiceItemDetail.invoiceType==2?'承运人税号':'购买方税号'}}</div>
                        <div class="right">{{invoiceItemDetail.purchaserTaxNo}}</div>
                    </div>
                    <div class="des_item">
                        <div class="left">{{invoiceItemDetail.invoiceType==2?'受票方名称':'销售方名称'}}</div>
                        <div class="right">{{invoiceItemDetail.salesName}}</div>
                    </div>
                    <div class="des_item">
                        <div class="left">{{invoiceItemDetail.invoiceType==2?'受票方税号':'销售方税号'}}</div>
                        <div class="right">{{invoiceItemDetail.salesTaxNo}}</div>
                    </div>
                    <div class="des_item">
                        <div class="left">发票类型</div>
                        <div class="right">{{transferInvoiceTypeToText(invoiceItemDetail.invoiceType)}}</div>
                    </div>
                    <div class="des_item">
                        <div class="left">发票代码</div>
                        <div class="right">{{invoiceItemDetail.invoiceCode}}</div>
                    </div>
                    <div class="des_item">
                        <div class="left">发票号码</div>
                        <div class="right">{{invoiceItemDetail.invoiceNumber}}</div>
                    </div>
                    <div class="des_item">
                        <div class="left">开票日期</div>
                        <div class="right">{{invoiceItemDetail.billingDate}}</div>
                    </div>
                </div>
                <div class="des_box bottom_part">
                    <div class="des_item">
                        <div class="left">合计金额</div>
                        <div class="right">￥{{invoiceItemDetail.totalAmount}}</div>
                    </div>
                    <div class="des_item">
                        <div class="left">合计税额</div>
                        <div class="right">￥{{invoiceItemDetail.totalTax}}</div>
                    </div>
                    <!-- <div class="des_item">
                        <div class="left">税额</div>
                        <div class="right">￥{{invoiceItemDetail.totalTax}}</div>
                    </div> -->
                    <div class="des_item">
                        <div class="left">价税合计</div>
                        <div class="right">￥{{invoiceItemDetail.amountTax}}</div>
                    </div>
                </div>
                <!-- 继续查验的按钮 -->
                <div v-if="showBtn=='yes'" @click="continueCheck" class="continue_checkbtn">继续查验</div>
            </div>
            <!-- 查验失败dom -->
            <!-- <div v-if="false" class="check_fail">
                <div class="result_icon_fail">
                    <img src="~assets/img/invoice/check_fail.png">
                    <p>发票查验异常</p>
                    <div>该发票查验异常，请勿将其作为财务报销凭证，如有需要请持发票原件至当地税务机关进行鉴定</div>
                </div>
            </div> -->
           
        </div>
        
    </div>
</template>

<script>
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';
import mixin from '../common/checkInvoiceMixin.js';
import LoadingX from "components/loading/index";

export default {
    mixins:[mixin,invoiceHandler.mixin.tChatEventMixin],
    components:{
        LoadingX
    },
    data(){
        return {
            verRecordId:'',//主键ID
            showBtn:'',//主键ID
            invoiceItemDetail:{},//单条的发票查验信息
            loading:true
        }
    },
    created(){
        let that = this;
        //注册并监听t信返回事件
        // invoiceHandler.appBack(function(){
        //     invoiceHandler.stateManager.closeTopPop(()=>{
        //         that.$router.back(); 
        //     });
        // },that);
        that.verRecordId = that.$route.query.verRecordId;
        that.showBtn = that.$route.query.showBtn;
      
    },
    mounted(){
        this.initData();
    },
    methods:{
        //注册并监听t信返回事件
        goBackFun(){
            let that = this
            that.$router.back()
        },
        continueCheck(){
            this.$router.back();    
        },
        //初始化数据
        initData(){
            let that = this;
            let param = {
                id:that.verRecordId
            };
            invoiceHandler.verInvoiceResult(param).then(res=>{
                if (res.resultCode==0 && res.result){
                    that.loading = false;
                    that.invoiceItemDetail = res.result;
                }
            }).catch(e=>{
                that.loading = false;
                console.log(e);
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import '~themes/default/styles/checkResult.less';
</style>
