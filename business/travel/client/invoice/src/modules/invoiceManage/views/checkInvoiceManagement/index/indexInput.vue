<template>
    <div class="check-invoice-management">
        <!-- pc端显示的dom及样式 -->
        <div class="all_style">
            <div v-if='isPc' class="tips">
                提示：当日开具的发票最快可于次日进行查验
                <a @click="showCheckRulesFun">更多查验规则</a>
            </div>
            <!-- 单选部分 -->
            <div class="invoiceType">
                <popup-radio title="发票类型" :options="invoiceTypeList" v-model="chooseInvoiceType"></popup-radio>
            </div>
            <!-- 中间input部分 -->
            <div class="input_item clearfix" v-if="checkInvoiceTypeParam('invoiceCode')">
                <div class="fl_item required">发票代码</div>
                <div class="fr_item">
                    <SnTextarea v-model.trim="invoiceCode" type="text" placeholder="请输入10或12位数字" maxlength="12"/>
                </div>
            </div>
            <div class="input_item clearfix" v-if="checkInvoiceTypeParam('invoiceNumber')">
                <div class="fl_item required">发票号码</div>
                <div class="fr_item">
                    <SnTextarea v-model.trim="invoiceNumber" type="text" placeholder="请输入8或20位数字" maxlength="20"/>
                </div>
            </div>
            <div class="input_item clearfix" v-if="checkInvoiceTypeParam('billingDate')">
                <div class="fl_item required">开票日期</div>
                <div class="fr_item">
                    <SnDatetimePicker v-show="!!billingDate" ref="SnDatetimePicker" v-model="billingDate" />
                    <div class="date_placeholder" v-show="!!!billingDate">
                        <span @click="showPicker">请选择开票日期</span>
                    </div>
                </div>
            </div>
            <div class="input_item clearfix" v-if="checkInvoiceTypeParam('totalAmount')">
                <div class="fl_item required">{{getInvoiceTypeMapObj().totalAmountName}}<span>{{getInvoiceTypeMapObj().totalAmountNameTips}}</span></div>
                <div class="fr_item">
                       <!-- v-on:blur="blurNumFrtValue($event.target.value)" -->
                    <SnTextarea v-model.trim="totalAmount" 
                        v-on:focus="focusNumFrtValue($event.target.value)"
                        v-on:input="frtInputDot($event.target.value)"
                        type="text" 
                        :placeholder="getInvoiceTypeMapObj().totalAmountPlaceholder"/>
                </div>
            </div>
            <div class="input_item clearfix" v-if="checkInvoiceTypeParam('checkCode')">
                <div class="fl_item required">{{getInvoiceTypeMapObj().checkCodeName}}<span>{{getInvoiceTypeMapObj().checkCodeNameTips}}</span></div>
                <div class="fr_item">
                    <SnTextarea v-model.trim="checkCode" type="text" :placeholder="getInvoiceTypeMapObj().checkCodePlaceholder" maxlength="6"/>
                </div>
            </div>
            <div class="input_item clearfix" v-if="checkInvoiceTypeParam('orderNo')">
                <div class="fl_item required">订单号</div>
                <div class="fr_item">
                    <SnTextarea v-model.trim="orderNo" type="text" placeholder="请输入订单号" maxlength="32"/>
                </div>
            </div>
            <div class="input_item last_input clearfix"  v-if="checkInvoiceTypeParam('salesTaxNo')">
                <div class="fl_item required">销方税号</div>
                <div class="fr_item">
                    <SnTextarea v-model.trim="salesTaxNo" type="text" placeholder="请输入销方税号" maxlength="20"/>
                </div>
            </div>
            <div v-if='!isPc' class="tips">
                <span><icon type="icon_common_prompt" size=".28"/></span>
                <span>当日开具的发票最快可于次日进行查验</span>
            </div>
            <!-- 查验按钮 -->
            <div @click="gotoCheckResult" class="checkBtn">查验</div>

            <!-- 查验记录 -->
            <div v-if='isPc' @click="gotoCheckRecord" class="check_recording">
                <span>查验记录</span>
            </div>
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
import icon from 'components/icon/index';
import {
    TransferDom,
    Popup,
    Loading,
    PopupRadio
} from 'vux';
import {
    SnDatetimePicker,SnTextarea
} from 'sinosun-ui';
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';
import checkRules from "../checkRule/checkRule";
import {isInvoiceCode, isInvoiceNumber, invoiceTypeMap} from '../common/checkInvoiceManagement'; // eslint-disable-line
import mixin from '../common/checkInvoiceMixin.js';
export default {
    directives: {TransferDom},
    components: {
        Popup,
        checkRules,
        Loading,
        icon,
        SnDatetimePicker,
        SnTextarea,
        PopupRadio
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
        return Object.assign(managerData, {
            isPc:invoiceHandler.isPC(),
            invoiceCode:'',//发票代码
            invoiceNumber:'',//发票号码
            billingDate: '',//开票日期：YYYY-MM-DD
            totalAmount:'',//合计金额（不含税）
            checkCode:'',//校验码后6位
            orderNo:'',//订单号
            salesTaxNo:'',//销方税号
            showLoading:false, //查验的loading
            chooseInvoiceType:0,//发票类型
            invoiceTypeMap: invoiceTypeMap,//发票类型map
            invoiceTypeList: [
                {
                    key: 0,
                    value: '增值税专票'
                },
                {
                    key: 1,
                    value: '增值税普票'
                },
                {
                    key: 2,
                    value: '区块链发票'
                },
                {
                    key: 3,
                    value: '电子发票'
                },
                {
                    key: 4,
                    value: '全电纸票 (普票)'
                },
                {
                    key: 5,
                    value: '通用电子发票'
                }
            ]
        })
        
    },
    watch:{
        chooseInvoiceType(val, oldVal) {
            const that = this;
            if (val != oldVal){
                that.clearParam();
            }
        }
    },
    created: function () {
    //注册并监听t信返回事件
    //   invoiceHandler.appBack(function(){
    //       invoiceHandler.stateManager.closeTopPop(()=>{
    //         if(that.$route.query.fromPage && that.$route.query.fromPage == 'invoiceAssist'){
    //                 that.$router.back();  
    //         }else{
    //             //当为小应用配置时直接回退
    //             invoiceHandler.goBackPage('-13454', 1, null);
    //         }   
    //       });
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
        //不同类型发票对应的字段检查
        checkInvoiceTypeParam(key){
            let index = this.invoiceTypeMap[this.chooseInvoiceType].needParams.indexOf(key)
            return index!=-1;
        },
        //获取当前发票类型配置项
        getInvoiceTypeMapObj(){
            return this.invoiceTypeMap[this.chooseInvoiceType];
        },
        closeDesc(){
            this.showCheckRules = false;
        },
        showCheckRulesFun(){
            this.showCheckRules = true;
        },

        showPicker() {
            this.$refs.SnDatetimePicker.onClick();
        },
        //验证表单输入
        verifyOptions(){
            //验证必填项
            let flag = true
            //发票代码
            if (this.checkInvoiceTypeParam('invoiceCode') && this.invoiceCode == ''){
                invoiceHandler.showToast('请输入发票代码');
                flag = false;
                return;
            }
            //发票代码格式
            if (this.checkInvoiceTypeParam('invoiceCode') && !isInvoiceCode(this.invoiceCode)){
                invoiceHandler.showToast('发票代码格式输入错误');
                flag = false;
                return
            }              
            //发票号码
            if (this.checkInvoiceTypeParam('invoiceNumber') && this.invoiceNumber == ''){
                invoiceHandler.showToast('请输入发票号码');
                flag = false;
                return;
            }
            //发票号码格式
            if (this.checkInvoiceTypeParam('invoiceNumber') && !isInvoiceNumber(this.invoiceNumber)){
                invoiceHandler.showToast('发票号码格式输入错误');
                flag = false;
                return
            } 
            //开票日期
            if (this.checkInvoiceTypeParam('billingDate') && this.billingDate == ''){
                invoiceHandler.showToast('请选择开票日期');
                flag = false;
                return;
            }
            //金额
            if (this.checkInvoiceTypeParam('totalAmount') && this.totalAmount == ''){
                invoiceHandler.showToast(`请输入${this.getInvoiceTypeMapObj().totalAmountName}`);
                flag = false;
                return;
            }
            //金额格式
            if (this.checkInvoiceTypeParam('totalAmount') && !this.blurNumFrtValue(this.totalAmount)){
                invoiceHandler.showToast(`${this.getInvoiceTypeMapObj().totalAmountName}格式错误，请重新输入`);
                flag = false;
                return;
            }            
            //校验码
            if (this.checkInvoiceTypeParam('checkCode') && this.checkCode == ''){
                invoiceHandler.showToast(`请输入${this.getInvoiceTypeMapObj().checkCodeName}`);
                flag = false;
                return;
            }
            //订单号
            if (this.checkInvoiceTypeParam('orderNo') && this.orderNo == ''){
                invoiceHandler.showToast(`请输入订单号}`);
                flag = false;
                return;
            }
            //销方税号
            if (this.checkInvoiceTypeParam('salesTaxNo') && this.salesTaxNo == ''){
                invoiceHandler.showToast(`请输入销方税号`);
                flag = false;
                return;
            }
            return flag;
        },
        //跳转到查询结果页面
        gotoCheckResult(){
            let that = this;
            //验证输入必填和格式校验
            if (that.verifyOptions()){
                //调取mixin里面的查验接口
                that.verInvoiceFun();
            }
        },
        //跳转到查验记录
        gotoCheckRecord(){
            this.$router.push('/check/record');
        },
        focusNumFrtValue(){
            this.totalAmount = '';
        },
        blurNumFrtValue(){
            let flag = true;
            let reg=/^\d+(\.\d{0,2})?$/;
            if (!reg.test(this.totalAmount)){
                flag = false;
                return flag;
            }
            var xsd = this.totalAmount.toString().split(".");
            if (xsd.length == 1) {
                this.totalAmount = this.totalAmount.toString() + ".00";
            }
            if (xsd.length > 1) {
                if (xsd[1].length < 2) {
                    if (xsd[1].length == '1'){
                        this.totalAmount = this.totalAmount.toString() + "0";
                    } else {
                        this.totalAmount = this.totalAmount.toString() + "00";
                    }
                }
            }
            Number(this.totalAmount);
            return flag;
        },
        //输入的时候如果发现有小数点 就只能限制输入两位小数
        frtInputDot(){  
            let reg=/^[0-9.]{1,}$/;
            if (reg.test(this.totalAmount)){
                let strArr = this.totalAmount.split('.');
                if (strArr.length >= 2){
                    this.totalAmount = strArr[0] + '.' + strArr[1].substring(0,2);
                }
            }
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
        }
    }
}

</script>
<style lang="less" scoped>
@import '~themes/default/styles/indexInput.less';
</style>
