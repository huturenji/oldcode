<!-- 提交订单页面的选择发票信息弹窗页-->
<template>
    <div class="bill-detail-container">
        <template>
            <div class="title-box">
                <AddressTitle title="发票" @closePopup='closePopup' :showBottomBorder='true'></AddressTitle>
            </div>
        </template>
        <template>
            <section class="bill-box">
                <div class="sub-part isinvoice">
                    <p class="sub-part-title">是否开发票</p>
                    <div class="btn-select-con">
                        <span class="btn-item" :class="needInvoice?'active':''" @click="needInvoice=true; $emit('changeHeight', needInvoice)">开发票</span>
                        <span class="btn-item" :class="!needInvoice?'active':''" @click="needInvoice=false; $emit('changeHeight', needInvoice)">不开发票</span>
                    </div>
                </div>
                <template v-if="needInvoice">
                    <div class="sub-part invoice-title">
                        <p class="sub-part-title apart">
                            <span>发票抬头信息</span>
                            <!-- 导入企业发票抬头 -->
                            <span>
                                <importInvoice @import="importInvoiceFun" v-if="showImportInvoice"/>
                            </span>
                        </p>
                        <div class="invoice-choose" @click="showInvoicePop">
                            <div v-if="!!invoiceDetail.name" class="invoice-choose-box">
                                <div class="title">
                                    <p class="name">
                                        <symbolComp v-if="invoiceDetail.type == 2" symbol="公司" class='symbol-company'></symbolComp>
                                        <symbolComp v-if="invoiceDetail.defaultFlag" symbol="默认" class='symbol-default'></symbolComp>
                                        <span>{{invoiceDetail.name}}</span>
                                    </p>
                                    <p v-if="invoiceDetail.type == 2" class="tax">
                                        <span>税号：{{invoiceDetail.tax}}</span>
                                    </p>
                                </div>
                                <div class="right-icon">
                                    <Icon type='icon_common_rightarrow' size='.24'></Icon>
                                </div>
                            </div>
                            <div v-else class="no-title">
                                <Icon type='icon_mall_add' size='.48'></Icon>
                                <span>新增发票抬头</span>
                            </div>
                        </div>
                    
                    </div>
                    <div class="sub-part">
                        <p class="sub-part-title">收票人信息</p>
                        <div class="sbu-part-form top-padding">
                            <div class='sbu-part-form-item'>
                                <div class="form-item">
                                    <span class="form-label isrequired">收票人手机</span>
                                    <input class="form-input" ref="inputComp" @focus="onfocusInput" @input='inputFun'  @blur="blurInput" maxlength="11" type="tel" v-model="showphone" placeholder="请填写收票人手机号"/>
                                    <div v-show="showCleanBtn" class="close-icon weui-icon-clear" @click="cleanFun"></div>
                                </div>
                                <div class="form-item">
                                    <span class="form-label">收票人邮箱</span>
                                    <input class="form-input" ref="inputEmailComp" @focus="onfocusEmail" @input='onfocusEmail' @blur="blurEmailInput" maxlength="29" type="text" v-model="billInfo.email" placeholder="请填写收票人邮箱"/>
                                    <div v-show="showEmailCleanBtn" class="close-icon weui-icon-clear" @click="cleanEmailFun"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="sub-part">
                        <p class="sub-part-title">发票内容</p>
                        <div class="btn-select-con">
                            <span class="btn-item" :class="orderInvoiceCopy.invoiceContent==1?'active':''" @click="toggleType('invoiceContent',1)">商品明细</span>
                            <span class="btn-item" :class="orderInvoiceCopy.invoiceContent==2?'active':''" @click="toggleType('invoiceContent',2)">商品类别</span>
                        </div>
                        <div class="sbu-part-tips">
                            <p>发票内容将详细显示{{orderInvoiceCopy.invoiceContent==1?'商品名称':'所属类别'}}及价格信息，发票金额为实际支付金额，不含虚拟资产、优惠等扣减金额</p>
                        </div>
                    </div>
                </template>
            </section>
        </template>
        <template>
            <div class="btn-box" v-show="showBtn">
                <div class="btn-handler cursor-btn normal-btn" @click="confirm">
                    <span class="btn-text">确定</span>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import invoiceHandler from 'common/lib/requestHandler/invoiceHandler.js';
import Icon from 'common/components/base/Icon';
import importInvoice from 'common/components/base/importInvoice';
import symbolComp from 'common/components/base/symbol';
import AddressTitle from 'common/components/base/AddressTitle.vue';
import extendUtils from 'common/lib/utils';
import scrollLockMixin from 'common/lib/mixin/scrollLockMixin.js';
import baseHandler from 'common/lib/requestHandler/base.js'
export default {
    name:'billDetail',
    components: {
        AddressTitle,
        symbolComp,
        Icon,
        importInvoice
    },
    mixins: [scrollLockMixin],
    props: {
        invoiceDetail: { //发票抬头对象
            type: Object,
            default(){
                return {}
            }
        },
        invoiceReceiver: { //收票人手机号，邮箱
            type: Object,
            default(){
                return {}
            }
        },
        orderInvoice: { //发票内容，发票状态，发票种类
            type: Object,
            default(){
                return {}
            }
        },
        showBillDetailModel:{ //弹窗的显隐
            type: Boolean,
        },
        isInvoice: {//是否需要开发票
            type: Boolean,
        },
        showImportInvoice: {//是否显示导入企业发票抬头的按钮
            type: Boolean,
        }
    },
    data(){
        return {
            domHeight: document.documentElement.clientHeight,  //默认屏幕高度
            showHeight: document.documentElement.clientHeight,   //实时屏幕高度
            showBtn:true, //默认显示底部按钮
            billInfo:{},
            orderInvoiceCopy:{},
            showphone:'',
            showCleanBtn:false,
            showEmailCleanBtn: false,
            needInvoice: this.isInvoice, //标识是否开发票
        } 
    },
    created(){
        window.onresize = () => {
            return (() => {
                this.showHeight = document.documentElement.clientHeight;//这里需要注意一下可视区高度。
            })();
        };
        if(this.isIOS){
            let flag = false;
            let pageBackNormFunc;
            // 聚焦后，键盘弹起
            document.body.addEventListener('focusin', () => {
                flag = true;
                pageBackNormFunc && clearTimeout(pageBackNormFunc)
            });
            // 失焦后，键盘关闭
            document.body.addEventListener('focusout', () => {
                if (flag) {
                    // 页面滚动回原来的位置
                    pageBackNormFunc = setTimeout(() => {
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                    }, 200);
                }
                flag = false;
            });
        }
    },
    computed:{
        isIOS(){
            const u = navigator.userAgent;
            const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            return isiOS;
        },
    },
    watch:{
        showHeight() {
            if (this.domHeight > this.showHeight) {
                this.showBtn = false;
            } else {
                this.showBtn = true;
            }
        },
        showphone(val){
            
            if(val.includes('*')){
                return;
            }
            this.showCleanBtn = !!val ? true : false;
            this.billInfo.phone = val;
        },
        showBillDetailModel(val){
            this.needInvoice = this.isInvoice;
            this.$emit('changeHeight', this.needInvoice);
            if(val){
                this.billInfo = JSON.parse(JSON.stringify(this.invoiceReceiver)) //深拷贝invoiceReceiver
                this.orderInvoiceCopy = JSON.parse(JSON.stringify(this.orderInvoice)) //深拷贝orderInvoice
                if(!!this.billInfo.phone){
                    this.showphone = this.dealxing(this.billInfo.phone);
                }
            }
        }
    },
    methods: {

        //延时取消显示清空按钮
        blurInput(){
            setTimeout(()=>{
                this.showCleanBtn = false;
            }, 100)
        },

        //延时取消显示清空按钮
        blurEmailInput(){
            setTimeout(()=>{
                this.showEmailCleanBtn = false;
            }, 100)
        },

        /** 
        * 显示显示发票选择的弹窗
        */
        showInvoicePop(){
            this.$emit('showInvoicePop')
        },

        /**
         * input变化的时候触发
         */
        inputFun(){
           this.showCleanBtn = !!this.showphone ? true : false;
        },

        cleanFun(){
            this.showphone = '';
            this.$refs.inputComp.focus();
        },

        cleanEmailFun(){
            this.billInfo.email = '';
            this.$refs.inputEmailComp.focus();
        },

        //脱敏编辑时，先清空
        onfocusInput(){
            
            if(this.showphone.includes('*')){
                this.showphone = '';
            }
            this.showCleanBtn = !!this.showphone ? true : false;
        },

        onfocusEmail(){
            this.showEmailCleanBtn = !!this.billInfo.email ? true : false;
        },

        /**
         * 电话号码显示的脱敏处理
         * @param str 完整的电话号码字符串
         */
        dealxing(str){
            return extendUtils.sensitiveHide(str);
        },

        //关闭弹窗
        closePopup(){
            this.$emit('closeInvoicePopup');
        },
        //切换类型
        toggleType(type, value){
            this.orderInvoiceCopy[type] = value;
        },

        /** 
        * 新增或者保存发票收件人的相关信息
        */
        addOrUpdateInvoiceReceiver(){
            let that = this;
            let param = {
                channelId: invoiceHandler.channelId,
                companyId: invoiceHandler.companyId,
                userId: invoiceHandler.userId,
                phone: this.billInfo.phone || '',
                email: this.billInfo.email || '',
            }      
            let type = 'addInvoiceReceiver'; //新增
            if(!!this.invoiceReceiver.id){ //更新
                type = 'updateInvoiceReceiver'
            }
            return new Promise((resolve, reject) => {
                invoiceHandler[type](param).then(res=>{
                    if(res.resultCode == 0){
                        resolve(true);
                    }else{
                        resolve(false)
                    }
                }).catch(e=>{
                    resolve(false)
                    console.log('保存收票人信息失败');
                    console.log(e);
                })
            })
        },

        /*
        * 点击确定的处理,回传弹窗里面的表单数据,当前返回整个数据对象，后期根据需求组装返回的数据
        */
        confirm(){
            if(this.needInvoice){//下单开发票
                if(this.checkAvailable()){
                    this.addOrUpdateInvoiceReceiver().then(res => {
                        if(!!res){
                            this.$emit('getBillDetail', this.needInvoice, this.billInfo, this.orderInvoiceCopy);
                        }else{
                            extendUtils.showToast('保存收票人信息失败')
                        }
                    }).catch(e=>{
                        console.log(e)
                    })
                }
            }else{//下单不开发票
                this.$emit('getBillDetail', this.needInvoice);
            }

        },

        //点击导入企业发票抬头的回调
        importInvoiceFun(){
            this.$emit('import');
        },

        //判断一个字符串是否为空
        isEmpty(param){
            if(typeof param == "undefined" || param == null || param == ""){
                return true;
            }else{
                return false;
            }
        },
        

        //判断手机号格式正确性
        isTel(TEL) {
            var strTemp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
            if (strTemp.test(TEL)) {
                return true;
            }
            return false;
        },

        //对提交的表单数据判空且手机号格式是否正确
        checkAvailable(){
            if(this.isEmpty(this.billInfo.phone)){
                extendUtils.showToast('请填写收票人手机号');
                return false;
            }
            if(!this.isTel(this.billInfo.phone.trim())){
                extendUtils.showToast('请核对手机号格式');
                return false;
            }

            if(!this.isEmpty(this.billInfo.email)){
                if(!extendUtils.checkEmail(this.billInfo.email.trim())){
                    extendUtils.showToast('请核对邮箱格式');
                    return false;
                }
            }
            return true;
        },
    }
};
</script>

<style scoped lang="less">
@import '~themes/default/styles/order/confirm/billDetail.less';
</style>