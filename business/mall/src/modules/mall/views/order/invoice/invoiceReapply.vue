<!-- 发票换开申请页-->
<template>
    <div class="invoice-container">
        <section class="bill-box">
            <!-- 导入企业发票抬头 -->
            <p v-if="showImportInvoice" class="import"><importInvoice @import="importInvoiceFun"/></p>
            <!-- 发票抬头部分 -->           
            <div @click="showInvoiceTitle=true" class="sub-part title-box">
                <template v-if="!!invoiceDetail.name">
                    <div class="invoice-title">
                        <p class="title">
                            <span>{{invoiceDetail.name}}</span>
                        </p>
                        <p v-if="invoiceDetail.type == 2" class="tax">税号：{{invoiceDetail.tax}}</p>
                    </div>
                    <div class="right-icon">
                        <Icon type='icon_common_rightarrow' size='.24'></Icon>
                    </div>
                </template>

                <div v-else class="no-title">
                    <Icon type='icon_mall_add' size='.48'></Icon>
                    <span>新增发票抬头</span>
                </div>
            </div>
            
            
            <!-- 订单编号和商品明细部分 -->
            <div class="sub-part">
                <div class="sub-part-item line">
                    <span class="label">订单编号</span>
                    <span class="content">{{orderInfo.orderNo}}</span>    
                </div>
                <div class="sub-part-item">
                    <span class="label">发票内容</span>
                    <div class="content" @click="showBillContent">
                        <span class="content-type">{{invoiceInfo.invoiceContent}}</span>     
                        <div class="right-icon">
                            <Icon type='icon_common_rightarrow' size='.24'></Icon>
                        </div>
                    </div>    
                </div>
            </div>

            <!-- 手机号码和电子邮箱部分 -->
            <div class="sub-part phone-email">
                <div class="sbu-part-form">
                    <div class='sbu-part-form-item'>
                        <div class="form-item line">
                            <span class="form-label isrequired">手机号码</span>
                            <!-- <x-input 
                                v-model="invoiceInfo.showphone"
                                @on-focus='onfocusInput'
                                :max="11" 
                                :show-clear="true" 
                                text-align="left" 
                                placeholder="请填写收票人手机号"
                            ></x-input> -->
                            <input class="phone-number" 
                                v-model="invoiceInfo.showphone" 
                                ref="inputComp"
                                @focus='onfocusInput' 
                                @blur="blurInput"
                                maxlength="11" 
                                text-align="left"  
                                type="tel" 
                                placeholder="请填写收票人手机号"
                            >
                            <div v-show="showCleanBtn" class="close-icon weui-icon-clear" @click="cleanFun"></div>
                        </div>
                        <div class="form-item">
                            <span class="form-label">电子邮箱</span>
                            <!-- <x-input 
                                v-model="invoiceInfo.email"
                                :max="29" 
                                :show-clear="true" 
                                text-align="left" 
                                placeholder="请填写收票人邮箱"
                            ></x-input> -->
                            <input class="phone-number" 
                                v-model="invoiceInfo.email" 
                                maxlength="29" 
                                text-align="left"  
                                type="text" 
                                placeholder="请填写收票人邮箱"
                            >
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <div v-transfer-dom>
            <popup class="invoice-content" v-model="showPopupContent" height='40%'>
                <div class="invoice-content">
                    <AddressTitle title='发票内容' @closePopup='closePopup' :showBottomBorder='showBottomBorder'></AddressTitle>
                    <section class="select-content">
                        <P class="select-item" v-for="(item,index) in invoiceContent" :key="index" @click="selectContent(item)">
                            <span class="item-left">{{item.name}}</span>
                            <Icon :type="invoiceContentID == item.id?'icon_mall_checkbox_sel':'icon_mall_checkbox_nor'" size=".36"/>
                        </P>
                    </section>
                </div>
            </popup>
        </div>
        <div v-transfer-dom>
            <popup v-model="showInvoiceTitle" height='100%' width='100%'>
                <Invoice
                    ref="invoiceComp" 
                    :showCheck="true"
                    v-model="invoiceDetail"
                    @showImportInvoiceFun="checkImportInvoiceBtn"
                    @closeInvoiceList="closeInvoiceList"
                ></Invoice>
            </popup>
        </div>
       
        <div class="btn-box" v-show="showBtn">
            <div class="btn-handler cursor-btn normal-btn" @click="comfirmReadd">
                <span class="btn-text">确定</span>
            </div>
        </div>
    </div>
</template>

<script>
import importInvoice from 'common/components/base/importInvoice';
import Invoice from 'commonComp/invoice/invoice.vue';
import {Popup, TransferDom, XInput} from 'vux';
import extendUtils from 'common/lib/utils';
import invoiceHandler from 'common/lib/requestHandler/invoiceHandler.js';
import { SnModal } from 'sinosun-ui';
const Icon = ()=>import('common/components/base/Icon.vue');
const AddressTitle = ()=>import('common/components/base/AddressTitle.vue');
import orderHandler from 'common/lib/requestHandler/orderHandler.js';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';


export default {
    components: {
        Icon,
        Popup,
        AddressTitle,
        XInput,
        Invoice,
        importInvoice
    },
    directives: {
        TransferDom,
    },
    mixins: [tChatEventMixin], 
    props: {
    
    },
    data(){
        let that = this;
        let title = document.title;
        return Object.assign(extendUtils.stateManager.setData([
            'showPopupContent', //发票内容的弹窗
            {
                name: 'showInvoiceTitle',
                show:{
                    title: '发票抬头'
                },
                hide:{
                    callback(){
                        document.title = that.documentTitle
                    }
                },
            }
        ], this), {
            showmore:true,
            showBottomBorder:true,
            orderInfo:{},
            invoiceInfo:{},
            invoiceDetail:{}, //双向绑定的发票抬头
            invoiceContentID:1,
            invoiceContent:[
                {
                    id:'1',
                    name:'商品明细'
                },
                {
                    id:'2',
                    name:'商品类别'
                }
            ],
            documentTitle: '',
            domHeight: document.documentElement.clientHeight,  //默认屏幕高度
            showHeight: document.documentElement.clientHeight,   //实时屏幕高度
            showBtn:true, //默认显示底部按钮
            editReceiverInfo: false, //是否是编辑收件人信息
            showCleanBtn: false,
            baseTitle: document.title,
            showImportInvoice: false, //是否显示导入企业发票抬头的按钮 变量 true=显示 false=不显示 默认是false
        })
    },
    created(){
        this.invoiceInfo = JSON.parse(this.$route.query.invoiceInfo);        
        //更新invoiceDetail
        this.initInvoiceDetail();
        //拉取收票人的手机号和邮箱信息
        this.initInvoiceInfo();
        this.orderInfo = JSON.parse(this.$route.query.orderInfo);
        
        if(this.$route.query.flag == 'reapply'){
            document.title = this.documentTitle = '补开发票';
            this.$set(this.invoiceInfo, 'invoiceContent', '商品明细'); //补开的时候默认是商品明细
            this.$set(this.invoiceInfo, 'invoiceState', 0); //补开的时候默认是0
            this.invoiceContentID = 1;
        }else{
            if(this.invoiceInfo.invoiceState == 0){
                document.title = this.documentTitle = '修改发票';
            }
            if(this.invoiceInfo.invoiceState == 1){
                document.title = this.documentTitle = '换开申请';
            }
            this.invoiceContentID = this.invoiceInfo.invoiceContent == '商品明细'? 1 : 2
        }
        
        window.onresize = () => {
            return (() => {
                this.showHeight = document.documentElement.clientHeight;//这里需要注意一下可视区高度。
            })();
        };

        this.resetView();
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
        'invoiceInfo.showphone': {
            handler(val){
                if(val.includes('*')){
                    return;
                }
                this.showCleanBtn = !!val ? true : false;
                this.invoiceInfo.phone = val;
            }
        },
    },
    methods: {
        //延时取消显示清空按钮
        blurInput(){
            setTimeout(()=>{
                this.showCleanBtn = false;
            }, 100)
        },
        cleanFun(){
            this.invoiceInfo.showphone = '';
            this.$refs.inputComp.focus();
        },

        //关闭发票抬头选择的弹窗
        closeInvoiceList(){
            this.showInvoiceTitle = false;
        },

        //根据运维后台是否配置了企业发票抬头的地址url来判断，导入企业发票抬头按钮是否显示 
        checkImportInvoiceBtn(flag){
            this.showImportInvoice = flag;
        },

        /** 
        * 初始化发票收件人的电话和邮箱
        */
        initInvoiceInfo(){
            let param = {
                channelId: invoiceHandler.channelId,
                companyId: invoiceHandler.companyId,
                userId: invoiceHandler.userId,
            }
            invoiceHandler.getInvoiceReceiverInfo(param).then(res=>{
                if(res.resultCode == 0 && !!res.result && Object.keys(res.result).length > 0){
                    if(!!res.result.id){
                        this.editReceiverInfo = true;//此时说明是编辑收票人信息
                    }else{
                        this.editReceiverInfo = false;//此时说明是新增收票人信息
                    }

                    if(this.$route.query.flag == 'reapply'){ //是有补开发票的时候才更新invoiceInfo数据
                        this.invoiceInfo = Object.assign({}, this.invoiceInfo, res.result);
                    }
                }else{
                    this.editReceiverInfo = false;//此时说明是新增收票人信息
                }
         
              
                //电话号码脱敏处理的显示值
                this.$set(this.invoiceInfo, 'showphone', !!this.invoiceInfo.phone?this.dealxing(this.invoiceInfo.phone):'')
            }).catch(e=>{
                console.log(e);
            })
        },
        



        //初始化抬头的对象
        initInvoiceDetail(){
            if(Object.keys(this.invoiceInfo).length > 0){
                this.invoiceDetail = Object.assign({}, this.invoiceDetail, {
                    name: this.invoiceInfo.invoiceTitle,
                    type: this.invoiceInfo.invoiceType,
                })
               if(this.invoiceInfo.invoiceType == 2){ //企业
                   this.invoiceDetail = Object.assign({}, this.invoiceDetail, {
                       account: this.invoiceInfo.account,
                       bank: this.invoiceInfo.bank,
                       address: this.invoiceInfo.registerAddress,
                       phone: this.invoiceInfo.registerPhone,
                       tax: this.invoiceInfo.taxNo,
                   })
               }
            }
        },


        //ios顶起视图不自动复原的bug  下面代码手动复原视图
        resetView(){
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
        //脱敏编辑时，先清空
        onfocusInput(){
            if(this.invoiceInfo.showphone.includes('*')){
                this.invoiceInfo.showphone = '';
            }
        },
        /**
         * 电话号码显示的脱敏处理
         * @param str 完整的电话号码字符串
         */
        dealxing(str){
            return extendUtils.sensitiveHide(str);
        },

        //选择发票内容
        selectContent(item){
            this.invoiceContentID = item.id;
            this.invoiceInfo.invoiceContent = item.name;
            this.closePopup();
        },
   
        //打开发票内容选择框
        showBillContent(){
            this.showPopupContent = true;
        },

        //关闭弹窗
        closePopup(){
            this.showPopupContent = false;
        },
        //点击确定按钮事件处理，判断是修改发票还是换开发票 this.invoiceInfo.invoiceState  1=换开发票  
        comfirmReadd(){
            let that = this;
            let isReaddFlag = this.invoiceInfo.invoiceState == 1 ? true : false;
            if(this.checkEmpty()){
                SnModal({
                    message: this.$route.query.flag == 'reapply'?'确定要补开发票吗？': (isReaddFlag?'确定要换开发票吗？':'确定要修改发票吗？'),
                    showCancelButton: true,
                }).then(res => {
                    //保存收货人信息后，再去更新发票
                    that.addOrUpdateInvoiceReceiver().then(flag => {
                        if(!!flag){
                            if(isReaddFlag){
                                this.confirm();
                            }else{
                                this.update();
                            }
                        }else{
                            extendUtils.showToast('保存收票人信息失败')
                        }
                    }).catch(e => {
                        console.log(e)
                        console.log('保存收票人信息失败');
                    })
                    
                }).catch(rej => {
                    console.log('rej === ', rej);
                });
            }
        },

        /** 
        * 新增或者保存发票收件人的相关信息
        */
        addOrUpdateInvoiceReceiver(){
            let param = {
                channelId: invoiceHandler.channelId,
                companyId: invoiceHandler.companyId,
                userId: invoiceHandler.userId,
                phone: this.invoiceInfo.phone || '',
                email: this.invoiceInfo.email || '',
            }
            let type = 'addInvoiceReceiver'; //新增
            if(!!this.editReceiverInfo){ //更新
                type = 'updateInvoiceReceiver'
            }
            return new Promise((resolve, reject) => {
                invoiceHandler[type](param).then(res=>{
                    if(res.resultCode == 0){
                        resolve(true)
                    }else{
                        resolve(false)
                    }
                }).catch(e=>{
                    reject('保存收票人信息失败');
                    console.log(e);
                })
            })
        },


        /* 点击确定的处理,回传弹窗里面的表单数据,当前返回整个数据对象，后期根据需求组装返回的数据
        *  根据业务  选择不同的发票类型  返回的数据应做对应处理  TODO
        */
        async confirm(){
            this.$loading.show(); 
            let param = await this.getParam();
            invoiceHandler.counteractInvoice(param).then(res=>{
                this.$loading.hide(); 
                this.$router.back();
            })
            .catch(e=>{
                console.log(e);
                this.$loading.hide(); 
            })
        },
        //修改发票请求
        update(){
            let param = this.getUpdateParam();
            this.$loading.show(); 
            orderHandler.updateOrderDetail(param).then(res=>{
                this.$loading.hide(); 
                this.$router.back();
            }).catch(e=>{
                console.log(e)
                this.$loading.hide(); 
            })
        },

        //保存收票人手机号和电子邮箱的接口
        


        //拼接修改发票参数
        getUpdateParam(){
            let obj = {
                orderNo:this.orderInfo.orderNo,
                orderState:this.orderInfo.orderState,
                orderInvoice: {
                    invoiceType: this.invoiceDetail.type,
                    invoiceCategory: this.invoiceInfo.invoiceCategory ? this.invoiceInfo.invoiceCategory : '3', //默认电子发票
                    invoiceTitle: this.invoiceDetail.name,
                    invoiceContent: this.invoiceInfo.invoiceContent,
                    invoiceState: this.invoiceInfo.invoiceState,
                    phone: this.invoiceInfo.phone.trim(),
                    email: this.invoiceInfo.email,
                    invoiceProcess: "订单下单，订单完成，发票开具"
                },
            }
            if(this.invoiceDetail.type == 2){
                obj.orderInvoice = Object.assign({}, obj.orderInvoice, {
                    taxNo: this.invoiceDetail.tax,
                    registerAddress: this.invoiceDetail.address,
                    registerPhone: this.invoiceDetail.phone,
                    account: this.invoiceDetail.account,
                    bank: this.invoiceDetail.bank,
                })
            }

            return obj;
        },
        //根据发票抬头拼装参数（发票换开参数）
        async getParam(){
            let details = await this.getGoodsDetails();
            let obj = {
                "userId":orderHandler.userId,
                "companyId":orderHandler.companyId,
                "channelId":orderHandler.channelId,
                "orderNo":this.orderInfo.orderNo,
                "content": this.invoiceInfo.invoiceContent,
                "invoiceType": this.invoiceInfo.invoiceCategory,
                "phone":this.invoiceInfo.phone,
                "email":this.invoiceInfo.email,
                "title":{
                    "type":this.invoiceDetail.type,
                    "name":this.invoiceDetail.name,
                },
                "details":details
            }
            if(2 == this.invoiceDetail.type){ //企业
               obj.title = Object.assign({}, obj.title, {
                    "tax": this.invoiceDetail.tax,
                    "address": this.invoiceDetail.address,
                    "phone": this.invoiceDetail.phone,
                    "account": this.invoiceDetail.account,
                    "bank": this.invoiceDetail.bank
               })
            }
            return obj;
        },
        //获取商品信息参数
        async getGoodsDetails(){
            let arr = this.orderInfo.products || [];
            console.log('this.orderInfo.products', this.orderInfo.products)
            let newArray = [];
            arr.map(item=>{
                newArray.push({
                    'categoryId':item.categoryId,
                    'name':item.name,
                    'type':item.specification,
                    'number':item.quantity,
                    'price':item.unitPrice,
                    'unit':item.saleUnit || ''
                })
            })
            let param = {
                orderNo: this.orderInfo.orderNo
            }
            let res = await orderHandler.getOrderDetail(param);
            let data = res.result;
            let discountAmount = data.order.discountAmount;

            let freight = data.order.freightAmount;

            
            //添加运费
            newArray.push({
                'categoryId':'',
                'name':'服务费',
                'type':'',
                'number':1,
                'price':freight,
                'unit':''
            })
            
            //添加折扣金额
            if(!!discountAmount){
                newArray.push({
                    'categoryId':'',
                    'name':'优惠金额',
                    'type':'',
                    'number':1,
                    'price':discountAmount,
                    'unit':''
                })
            }
            return newArray;
        },
        //判断一个字符串是否为空
        isEmpty(param){
            if(typeof param == "undefined" || param == null || param == ""){
                return true;
            }else{
                if(param.trim() == ''){
                    return true;
                }
                return false;
            }
        },
        //检查必填项是否都填了  且格式是否正确
        checkEmpty(){
            if(!this.invoiceDetail.name){
                extendUtils.showToast('请选择发票抬头');
                return false;
            }
            if(this.isEmpty(this.invoiceInfo.phone)){
                extendUtils.showToast('请填写手机号码');
                return false;
            }else{
                if(!this.isTel(this.invoiceInfo.phone.trim())){
                    extendUtils.showToast('请核对手机号格式');
                    return false;
                }
            }
            if(!this.isEmpty(this.invoiceInfo.email)){
                if(!extendUtils.checkEmail(this.invoiceInfo.email.trim())){
                    extendUtils.showToast('请核对邮箱格式');
                    return false;
                }
            }
            return true;
        },

        //判断手机号格式正确性
        isTel(TEL) {
            var strTemp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
            if (strTemp.test(TEL)) {
                return true;
            }
            return false;
        },

        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            document.title = this.baseTitle;
            this.$router.back();
        },

        //导入企业发票抬头
        async importInvoiceFun(){
            let flag = await this.$refs.invoiceComp.gotoImportInvoice('single');
        }
    }
};
</script>

<style scoped lang="less">
@import '~themes/default/styles/order/orderDetail/invoiceReapply.less';
</style>