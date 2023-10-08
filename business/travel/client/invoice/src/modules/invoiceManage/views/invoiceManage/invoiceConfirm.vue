<template>
    <div>
        <div v-if="tripType === 'hotel'" class="editDetail">
            <div class="list">
                <div class="content">
                    <div class="title">发票数量</div>
                    <span class="text">共 <span class="num">{{checkedNum}}</span> 张</span>
                </div>
    
            </div>
            <div class="list">
                <div class="content">
                    <div class="title">发票类型</div>
                    <span class="text">增值税普通发票（电子）</span>
                </div>

            </div>
            <div class="list">
                <div class="content">
                    <div class="title">发票内容</div>
                    <span class="text">*旅游服务*代订酒店费</span>
                </div>
            </div>
            <div class="list" @click='showReceiptEdit=true'>
                <div class="content cursorp">
                    <div class="title">发票抬头</div>
                    <div class="invoice_content_hotel">
                        <span v-if="reimDetail.name" class="text">{{reimDetail.name}}</span>
                        <span v-else class="text placeholder">添加或选择发票抬头</span>
                        <!-- 定位的导入企业发票抬头的icon图标 -->
                        <div v-if="isBizMate() && showImportInvoice" @click.stop="importInvoiceFun" class="importInvoice"><icon type="svg_icon_invoice_import" size='.4' /></div>
                    </div>
                    <span class="icon-right"><icon type="icon_common_rightarrow" size=".24"/></span>
                </div>
            </div>
            <div class="list">
                <div class="content content_hotel">
                    <div class="title">发票备注</div>
                    <div class="check">
                        <span class="text">
                            注明酒店名和入离时间
                        </span>
                        <span class="check_box cursorp" @click='isCheck =!isCheck'>
                            <icon :type="isCheck?'btn_common_checkbox_sel':'btn_common_checkbox_nor'" size=".4"/>
                        </span>
                    </div>
                </div>
            </div>
            <div class="bottomBar">
                <div class="detail">
                    <div class="priceT">
                        <div class="totalPerson">共<span class="num">{{checkedNum}}</span>张</div>
                    </div>
                </div>
                <div class="submit cursorp" @click="submitHotel">
                    <span>提交</span>
                </div>
            </div>
        </div>

        <div v-else-if="tripType === 'flight'" class="editDetail">
            <div class="top">
                <div class="fee num-font"><span>￥</span>{{totalExpressFee}}</div>
                <div class='titleFee'>快递费</div>
            </div>
            <div class="list">
                <div class="content">
                    <div class="title flight_title">凭证类型<i class="tipIcon cursorp" @click="openReimburseType"><icon type="icon_common_prompt" size=".28"/></i></div>
                    <span class="text">行程单、保险发票、退票手续费收据将一并快递邮寄；快递费用将开具电子发票，请在订单详情中查看</span>
                </div>
            </div>
            <div class="list">
                <div class="content">
                    <div class="title">配送方式</div>
                    <span class="text">快递
                        <span class="num-font">￥{{expressFee}}</span>
                        <span v-if="checkedNum > 1">/单X {{checkedNum}}</span>
                    </span>
                </div>
            </div>
            <div class="list"  @click='showReceiptEdit=true'>
                <div class="content cursorp">
                    <div class="title">发票抬头</div>
                    <div class="invoice_content_flight">
                        <div class="text" v-if='!!reimDetail.name'>
                            <div class="name"> {{reimDetail.name}}</div>
                            <div class="number"> {{reimDetail.tax}}</div>
                        </div>
                        <div class='textTips' v-else>
                            添加或选择发票抬头
                        </div>
                        <!-- 定位的导入企业发票抬头的icon图标 -->
                        <div v-if="isBizMate() && showImportInvoice" @click.stop="importInvoiceFun" class="importInvoice"><icon type="svg_icon_invoice_import" size='.4' /></div>
                    </div>
                    <span class="icon-right"><icon type="icon_common_rightarrow" size=".24"/></span>
                </div>
            </div>
            <div class="list" @click='showAddressEdit=true;'>
                <div class="content cursorp" >
                    <div class="title">配送地址</div>
                    <div class="text" v-if='!!addressDetail.name'>
                        <div class="name"> {{addressDetail.name}} &nbsp;{{maskAddressPhone(addressDetail.phone)}} </div>
                        <div class="number"> {{addressDetail.area}}<span v-if='addressDetail.address'></span>{{addressDetail.address}}
                        </div>
                    </div>
                    <div class='textTips' v-else>
                        添加或选择配送地址
                    </div>
                    <span class="icon-right"><icon type="icon_common_rightarrow" size=".24"/></span>
                </div>
            </div>
            <div class="flightTip">行程结束后，我们将为您邮寄报销凭证</div>

            <!-- 底部的支付按钮 -->
            <div class="bottomBar_flight">
                <div class="submit cursorp" @click="orderPay">
                    <span>去支付（<i class="num-font">￥{{totalExpressFee}}</i>）</span>
                </div>
            </div>
        </div>
        
        <div v-else-if="tripType === 'train'" class="editDetail">
            <div class="list">
                <div class="content">
                    <div class="title">发票数量</div>
                    <span class="text">共 <span class="num">{{checkedNum}}</span> 张</span>
                </div>
            </div>
            <div class="list">
                <div class="content">
                    <div class="title">发票类型</div>
                    <span class="text">增值税普通发票（电子）</span>
                </div>
            </div>
            <div class="list">
                <div class="content">
                    <div class="title">发票内容</div>
                    <span class="text">*现代服务*服务费</span>
                </div>
            </div>
            <div class="list" @click='showReceiptEdit=true'>
                <div class="content cursorp">
                    <div class="title">发票抬头</div>
                    <div class="invoice_content_train">
                        <span v-if="reimDetail.name" class="text">{{reimDetail.name}}</span>
                        <span v-else class="text placeholder">添加或选择发票抬头</span>
                        <!-- 定位的导入企业发票抬头的icon图标 -->
                        <div v-if="isBizMate() && showImportInvoice" @click.stop="importInvoiceFun" class="importInvoice"><icon type="svg_icon_invoice_import" size='.4' /></div>
                    </div>
                    <span class="icon-right"><icon type="icon_common_rightarrow" size=".24"/></span>
                </div>
            </div>
            <div class="submit_btn cursorp" @click="submitInvoice"> 确定 </div>
        </div>
  

        <!--编辑配送地址-->
        <div v-transfer-dom>
            <popup v-model="showAddressEdit" class="editDetailPop" height='100%'>
                <swp-address v-if="swpAddressLoad" v-model="addressDetail" @closeAddressList="closeAddressList" ref='addressCard'></swp-address>
            </popup>
        </div>
        <!--编辑发票抬头-->
        <div v-transfer-dom>
            <popup v-model="showReceiptEdit" class="editDetailPop" height='100%'>
                <swp-invoice-card 
                    ref="invoiceCard" 
                    v-model="reimDetail"
                    @showImportInvoiceFun="checkImportInvoiceBtn"
                    @closeInvoiceList="showReceiptEdit=false"
                ></swp-invoice-card>
            </popup>
        </div>
        <div v-transfer-dom>
            <!-- 支付组件 -->
             <Pay ref="payComp" 
                v-if="loadPay"
                :orderNoList="[expressFeeOrderNo]" 
                :amount="totalExpressFee"
                goodsDesc="发票邮寄"
                tradeType='1'
                @closePay='paySucToDetail'
                @closePayType='paySucToDetail'
                @miniPayDone='miniPayDone'
                @payComplete='payComplete'
                @openFrame='openFrame'
            >
                <div slot='result' slot-scope="{closePay}">
                    <payResult 
                        :pageFrom='pageFrom'
                        @toOrderDetail='closePay'
                    />
                </div>
            </Pay>
        </div>
         <div v-transfer-dom>
            <loading :show="popLoading" text="加载中"></loading>
        </div>
    </div>
</template>

<script>
import icon from 'components/icon/index';
import {
    TransferDom,
    Popup,
    Loading
} from 'vux';
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';
const Pay = ()=>import('components/pay')
const payResult = ()=>import('./invoiceFlightSuc');
// let tripType = invoiceHandler.getUrlParams().tripType
let MASKING = SnUtils.DataMasking;
export default {
    mixins: [invoiceHandler.mixin.tChatEventMixin],
    name: 'invoiceConfirm',
    directives: {
        TransferDom
    },
    components: {
        Popup,
        Loading,
        icon,
        Pay,
        payResult
    },
    data () {
        let that = this;
        let managerData = invoiceHandler.stateManager.setData([
            {
                name: 'showAddressEdit',
                show: {
                    title: '配送地址'
                },
                hide: {
                    callback: function () {},
                    title: '开具报销凭证'
                }
            },
            {
                name: 'showReceiptEdit',
                show: {
                    title: '发票抬头'
                },
                hide: {
                    callback: function () {},
                    title: '开具报销凭证'
                }
            },
            {
                name: 'openH5PayFrame',//是否以frame形式打开了H5支付
                type: 'page',
                hide: {
                    callback: function () {
                        //如果H5支付正在进行，则先关闭H5支付
                        if (that.$refs.payComp && that.$refs.payComp.payInstance && that.$refs.payComp.payInstance.isOnH5Pay()){
                            that.$refs.payComp.payInstance.closeH5Pay();
                        }
                    }
                }
            }
        ], this);
        let data = {
            checkPopStatus: false,
            payType: '',//因公还是因私支付要用
            tripType: '',
            showReceiptEdit: false,
            showAddressEdit: false,
            checkedNum: 0,
            expressFee: 0,
            totalExpressFee: 0,//支付的总费用
            reimDetail: {},
            addressDetail: {},
            isCheck: true,
            choosenList: [],
            hotelInvoiceContent: '*旅游服务*代订酒店费',
            hotelInvoiceRemarks: '注明酒店名和入离时间',
            trainInvoiceContent: '*现代服务*服务费',
            flightInvoiceContent: '*现代服务*服务费',
            carInvoiceContent: '*旅游服务*交通费',
            expressFeeOrderNo: '',//支付的订单号
            pageFrom: 'multi',
            orderNo: '',
            showPayTypes: false,//弹出支付列表
            swpAddressLoad: false,//地址组件加载完成flag
            popLoading: false,
            servicePhone: invoiceHandler.BIS_CUSTOMER_SERVICE_PHONE, //商旅联系电话
            showImportInvoice: false //是否显示导入企业发票抬头的按钮 变量 true=显示 false=不显示 默认是false
        }
        data = Object.assign(managerData, data)
        return data
    },
    beforeRouteLeave (to, from, next) {
        // const that = this;
        next()
        // that.checkPopStatus ? '' : that.closeTopPop();
        // console.log(that.checkPopStatus)
        // that.checkPopStatus ? next() : next(false);
    },
    created () {
        /**
         * 该页面可以从多个入口进入 1.批量开发票页面进入 2.订单详情页进入
         * 如果从批量开发票页进入，则订单号列表从session中获取，如果从订单详情页进入，则在url上获取订单号
         * 完成表单填写，点击确认提交后，跳转到开票成功页
         */
        // let that = this
        let urlParams = invoiceHandler.getUrlParams()
        this.tripType = urlParams.tripType
        this.checkedNum = parseInt(urlParams.checkedNum)
        this.payType = urlParams.payType
        this.orderNo = urlParams.orderNo
        this.choosenList = JSON.parse(invoiceHandler.getSession('orderChoosenList'))
        if (this.orderNo) { //有订单orderNo的时候说明是从订单详情跳转过来的，如果没有说明是从批量补开发票跳转过来的 此时的pageFrom = multi
            this.pageFrom = 'orderDetail'
            this.checkedNum = 1
            this.choosenList = [this.orderNo]
        }
        //如果是机票的话需要获取快递单价的费用
        this.tripType == 'flight' && this.getExpressFee();
        // //注册并监听t信返回事件
        // invoiceHandler.appBack(function(){
        //     that.closeTopPop();
        // },this)
    },
    destroyed(){
        //组件销毁的时候移除pay.js
        this.unLoadPay();
    },
    mounted(){
        let that = this;
        //如果是飞机票需要加载支付组件
        if (that.tripType == 'flight'){
            that.loadPay = true;
            //动态加载地址组件的js文件
            invoiceHandler.loadJs('swpAddress','address',()=>{
                that.swpAddressLoad = true;
            });
        }
    },
    methods: {
        /**
         * 发票收件人手机号脱敏显示
        */
        maskAddressPhone(phone){
            let res = phone;
            try {
                if (SnTravel.functional.ISDECORATE){
                    res = MASKING.maskingText(MASKING.MASKING_TYPE.TEL,phone);
                }
            } catch (error) {
                console.log(error)
            }
            return res
        },
        //注册并监听t信返回事件
        goBackFun(){
            let that = this
            that.closeTopPop();
        },
        openFrame(){
            this.openH5PayFrame = true;
        },
        //先把payjs remove掉
        unLoadPay(){
            let payJs = document.getElementById('swpPay');
            if (payJs){
                payJs.parentNode.removeChild(payJs);
            }
        },
        /**
         * 调起支付组件
         */
        openPay(){
            let inMiniprogram = invoiceHandler.MINIPROGRAM_CONFIG.IN_MINIPROGRAM; // 判断运行环境
            if (inMiniprogram){
                this.$refs.payComp.wxMiniPay(window.sinopay.PAY_TYPE.WX_MINI_PAY)
            } else {
                this.$refs.payComp.getPayTypeList();
            }
        },
        //查询默认快递费
        getExpressFee() {
            const that = this;
            invoiceHandler.getExpressFee({}).then((res) => {
                if (res.resultCode == 0) {
                    that.expressFee = parseInt(res.result.expressFee) || 0;
                    this.totalExpressFee = this.checkedNum * this.expressFee
                }
            }).catch((err) => {
                console.error(err)
            });
        },
        // 提交酒店补开发票
        submitHotel() {
            const that = this
            if (!(!!that.reimDetail.titleId)) {
                invoiceHandler.showToast('当前报销凭证信息不完整，请修改')
                return
            }
            let params = {
                title: that.reimDetail,
                expressFee: that.expressFee,//这里是单价
                orderNos: that.choosenList,
                invoiceContent: that.hotelInvoiceContent
            }
         
            params.invoiceRemarks = that.isCheck ? that.hotelInvoiceRemarks : '';
            invoiceHandler.hotelCreateBatchInvoiceTitle(params).then((res) => {
                if (res.resultCode == 0) {
                    that.gotoWhere();
                    invoiceHandler.showToast('开票申请成功');
                } else {
                    invoiceHandler.showToast('开票申请失败');
                }
            }).catch((err) => {
                console.error(err);
            })
        },
        /**
         * 打开支付类型选择
         */
        orderPay() {
            const that = this;
            let check = true;
            if (that.tripType == 'flight') {
                if (!(!!that.addressDetail.id && !!that.reimDetail.titleId)) {
                    check = false;
                }
            } else if (!(!!that.reimDetail.titleId)){
                check = false;
            }
            if (!check) {
                invoiceHandler.showToast('当前报销凭证信息不完整，请修改');
                return
            }
            that.createExpressOrder(that.totalExpressFee).then((res) => {
                that.expressFeeOrderNo = res.result.expressOrderNo; 
                //调起支付组件
                that.$nextTick(() => {
                    that.openPay();
                })
            })
        },
 
        // 补开调用接口
        createExpressOrder(fee) {
            const that = this;
            if (!fee || that.choosenList.length <= 0){ return }
            const obj = {
                payAmount: fee,
                orderNo: that.choosenList,
                receiverInfo: that.addressDetail
            };
            return new Promise(function (resolve, reject) {
                invoiceHandler.createExpressOrder(obj).then((res) => {
                    if (res.resultCode == 0) {
                        resolve(res)
                    }
                }).catch((err) => {
                    reject('createExpressOrder接口报错')
                    console.log(err);
                });
            })
        },
        //提交火车票报销或者商务用车的报销凭证
        submitInvoice() {
            const that = this;
            if (!(!!that.reimDetail.titleId)) {
                invoiceHandler.showToast('当前报销凭证信息不完整，请修改')
                return
            }
            let params = {
                title: that.reimDetail,
                orderNos: that.choosenList,
                invoiceContent: that.tripType=='train' ? that.trainInvoiceContent : that.carInvoiceContent
            }
            let type = 'trainCreateBatchInvoiceTitle';
            if (that.tripType == 'car'){
                type = 'carCreateBatchInvoiceTitle';
            }
            invoiceHandler[type](params).then(res=>{
                if (res.resultCode == 0) {
                    that.gotoWhere();
                } else {
                    console.log('补开报销凭证失败')
                }
            }).catch((err) => {
                console.error(err);
            })
            
        },

        closeAddressList(){
            this.showAddressEdit = false;
            document.title = '开具报销凭证';
        },
        /**
         * 打开凭证类型样例页面
         */
        openReimburseType() {
            let url = 'express/index.html#/sample'
            invoiceHandler.openPageLib(url)
        },
        closeTopPop () {
            const that = this;
            invoiceHandler.stateManager.closeTopPop(() => {
                if (this.pageFrom == 'orderDetail') {
                    invoiceHandler.closePage('')
                } else {
                    that.$router.back()
                }
            });
        },
        //通过参数确定跳转哪里
        //pageFrom === 'orderDetail'时说明是从订单详情跳转过来的 此时在判断如果是tripType = train或者 hotel 或者 car 直接跳转 /InvoiceDetailIndex 路由  其他情况跳转 /invoiceSuc路由      
        gotoWhere(){
            const that = this;
            if (this.pageFrom == 'orderDetail' && this.tripType != 'flight'){
                this.$router.push({path: '/detail', query: {type: that.tripType,orderNo: that.orderNo}})
            } else {
                this.$router.push({path: '/suc', query: {tripType: that.tripType,pageFrom: that.pageFrom,orderNo: that.orderNo}})
            }
        },

        //导入企业发票抬头
        async importInvoiceFun(){
            await this.$refs.invoiceCard.gotoImportInvoice('single');
        },

        //判断是否是伴正事，是伴正事的才有导入发票的功能
        isBizMate(){
            return !!(invoiceHandler.getBizMateVersion())||!!invoiceHandler.isPC() ;
        },
        //根据运维后台是否配置了企业发票抬头的地址url来判断，导入企业发票抬头按钮是否显示 
        checkImportInvoiceBtn(flag){
            this.showImportInvoice = flag;
        },
        /**
         * 支付成功页面点击“查看订单”
         */
        paySucToDetail(){
            
        },
        miniPayDone(payState){
            let that = this
            if (payState == invoiceHandler.MINIPROGRAM_CONFIG.MINIPROGRAM_PAYSTATE.SUCCESS){ //支付成功
                that.payComplete(0); //支付成功
            } else if (payState == invoiceHandler.MINIPROGRAM_CONFIG.MINIPROGRAM_PAYSTATE.CANCLE){ //支付取消
            } else if (payState == invoiceHandler.MINIPROGRAM_CONFIG.MINIPROGRAM_PAYSTATE.FAIL){ //支付失败
            }
        },
        payComplete(state){
            if (state==0){
                const that = this
                let param = {
                    title: that.reimDetail,
                    expressFee: that.expressFee,
                    orderNos: that.choosenList,
                    invoiceContent: that.flightInvoiceContent
                }
                invoiceHandler.airCreateBatchInvoiceTitle(param).then((res) => {
                    if (res.resultCode == 0) {
                        invoiceHandler.showToast('开票申请成功');
                    } else {
                        invoiceHandler.showToast('开票申请失败');
                    }
                }).catch((err) => {
                    console.log(err);
                });

            }
        }
    },
    beforeDestroy () {
        invoiceHandler.removeSession('orderChoosenList')
    }
}
</script>

<style lang='less' scoped>
@import '~themes/default/styles/invoiceConfirm.less';
</style>
<style lang='less'>
@import '~themes/default/styles/common/index.less';
.vux-popup-dialog.editDetailPop{
    background-color: @background-color;
}
</style>

