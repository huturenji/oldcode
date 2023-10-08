<!--
    订单按钮组件
-->
<template>
    <div v-show="btnName[type] && btnName[type].show()" v-if="btnName[type] && btnName[type].load()" >
        <div class='order-btn normal-btn cursorp' 
            :class="['order-btn-' + type,selfClass]"
            @click.stop='clickBtn($event, type)'
        >
            {{btnName[type].text}}
        </div>

        <!-- 确认收货的弹窗 -->
        <div v-transfer-dom>
            <confirm 
                class="confirmReceipt"
                v-model="showConfirmReceipt"
                ref="confirmReceiptPop"
                confirm-text="确认收货"
                cancel-text="取消"
                @on-confirm="onConfirmReceipt"
            >  
                <div class="goods-item-change">
                    <thumbnail :src='confirmReceiptImgSrc'/>
                </div>
                <div class="title">确认收到货了吗？</div>
                <div class="tips">为了保障您的售后权益，请收到商品检查无误后再确认收货。</div>
            </confirm>
        </div>
    </div>
</template>
<script>
    import thumbnail from 'commonComp/goodsThumb/thumbnail.vue';
    import { Confirm } from 'vux';
    import { SnModal } from 'sinosun-ui';
    import {OrderState, OrderStatusEnum, getOrderStatus} from 'common/lib/enum/orderStatusEnum';
    import extendUtils from 'common/lib/utils';
    import orderHandler from 'common/lib/requestHandler/orderHandler.js';
    import afterSaleHandler from 'common/lib/requestHandler/afterSaleHandler.js';
    export default {
        components:{
            Confirm,
            thumbnail,
        },
        props: {
            //传入特殊的字符串当做类名，做一些定制样式
            selfClass:{
                type: String,
            },
            type: {//按钮类型
                type: String,
                required: true,
            },
            singleton: {//单例 用来解决同一组件渲染两个相同的按钮 只需执行一次事件
                type: Boolean,
                default: false,
            },
            orderInfo: {//订单信息
                type: Object,
                default: ()=>{
                    return {}
                },
            },
            product: {//单个商品信息
                type: Object,
                default: ()=>{
                    return {}
                },
            },
        },
        data(){
            return {
                timeInterval: null, //待付款订单倒计时
                limitTime: null, //待付款订单剩余的支付时间 单位秒S
                orderNoList:[],  //订单号列表
                goodsDesc:[], //商品描述
                amount:0, //商品金额
                openPayPop: false,
                showConfirmReceipt: false, //是否显示确认收货的弹窗
                confirmReceiptImgSrc: '', //确认收货的弹窗显示的图片的imgSrc
            }
        },
        computed:{
            btnName(){
                let vm = this;
                let orderState = getOrderStatus(this.orderInfo.orderState).state;//订单状态类型
                return {
                    approval: {
                        text: '查看审批', //按钮的显示的名称
                        load: ()=>{  //按钮的组件是否加载，也就是用v-if来控制的
                            return [OrderState.UNAPPROVAL.code].indexOf(orderState)>-1;
                        },
                        show: ()=>{ //按钮的组件是否显示，也就是用v-show来控制的
                            return false;
                        },
                        onClick: ()=>{ //按钮的点击事件的回调
                            vm.viewApproval();
                        }
                    },
                    pay: {
                        text: '去支付',
                        load: ()=>{
                            return [OrderState.UNPAID.code].indexOf(orderState)>-1;
                        },
                        show: ()=>{
                            return true;
                        },
                        onClick: ()=>{
                            vm.toPay()
                        }
                    },
                    modifyOrder: {
                        text: '修改订单',
                        load: ()=>{
                            return [OrderState.UNPAID.code].indexOf(orderState)>-1;
                        },
                        show: ()=>{
                            return true;
                        },
                        onClick: ()=>{
                            vm.$router.push({
                                path: '/orderEdit',
                                query:{
                                    orderNo : vm.orderInfo.orderNo
                                }
                            })
                        }
                    },
                    invoiceDetail: {
                        text: '查看发票',
                        load: ()=>{
                            return [OrderState.UNPAID.code, OrderState.UNRECEIVED.code, OrderState.COMPLETE.code,OrderState.UNAPPROVAL.code].indexOf(orderState)>-1;
                        },
                        show: ()=>{
                            return ((!!vm.orderInfo.orderInvoice && !!vm.orderInfo.orderInvoice.invoiceTitle) || !!vm.orderInfo.invoiceTitleFlag) && vm.orderInfo.orderSource == 0 && !!vm.orderInfo.hasMasterSku; //hasMasterSku说明该订单是否存在主商品，用来区分订单分单后如果是只有赠品或者附件的话是不显示查看发票和补开发票的按钮的
                        },
                        onClick: ()=>{
                            vm.gotoPage('/invoice',vm.orderInfo);
                        }
                    },

                    refundDetail: {
                        text: '退款明细',
                        load: ()=>{
                            let refundStateFlag = !!vm.orderInfo.refundState;
                            return [OrderState.CANCELED.code].indexOf(orderState) > -1 && refundStateFlag;//订单状态为已取消并且有退票状态（退票中和已退票）的时候，才会显示退款明细的按钮
                        },
                        show: ()=>{
                            return true;
                        },
                        onClick: ()=>{
                            vm.gotoPage('/refundDetail',vm.orderInfo);
                        }
                    },
                    createInvoice: {
                        text: '补开发票',
                        load: ()=>{
                            return [OrderState.UNPAID.code, OrderState.UNRECEIVED.code, OrderState.COMPLETE.code,OrderState.UNAPPROVAL.code].indexOf(orderState)>-1;
                        },
                        show: ()=>{
                            return !!vm.orderInfo.orderInvoice && !vm.orderInfo.orderInvoice.invoiceTitle && !vm.orderInfo.invoiceFlag && vm.orderInfo.orderSource == 0 && !!vm.orderInfo.hasMasterSku; //hasMasterSku说明该订单是否存在主商品，用来区分订单分单后如果是只有赠品或者附件的话是不显示查看发票和补开发票的按钮的
                        },
                        onClick: ()=>{
                            vm.gotoPageInvoiceReapply('/invoiceReapply',vm.orderInfo);
                        }
                    },
                    showExpress: {
                        text: '查看物流',
                        load: ()=>{
                            return [OrderState.UNRECEIVED.code, OrderState.COMPLETE.code].indexOf(orderState)>-1;
                        },
                        show: ()=>{
                            return true;
                        },
                        onClick: ()=>{
                            let packageList = vm.orderInfo.packageList; //区分分包裹的场景
                            if(packageList.length > 1){
                                vm.gotoPackageInfor();
                            }else{
                                vm.gotoExpressTrack(packageList[0]);
                            }                           
                        }
                    },
                    orderAgain: {
                        text: '再次购买',
                        load: ()=>{
                            // 如果该订单中没有主商品（或者说只有赠品或者附） 此时不显示再次购买的按钮
                            let goodsFilter = vm.orderInfo.products.filter(item => { //过滤出主商品
                                return item.productType == 0;
                            })
                            
                            return [OrderState.UNRECEIVED.code, OrderState.COMPLETE.code, OrderState.CANCELED.code].indexOf(orderState)>-1 && goodsFilter.length > 0;
                        },
                        show: ()=>{
                            return true;
                        },
                        onClick: ()=>{
                            vm.setIntoCartOrder(vm.orderInfo);
                        }
                    },
                    addCart: {
                        text: '加购物车',
                        load: ()=>{
                            return [OrderState.UNRECEIVED.code, OrderState.COMPLETE.code, OrderState.CANCELED.code].indexOf(orderState)>-1;
                        },
                        show: ()=>{
                            return true;
                        },
                        onClick: ($event)=>{
                            vm.setIntoCartProduct($event, vm.product);
                        }
                    },
                    cancelOrder: {
                        text: '取消订单',
                        load: ()=>{
                            //公款转账支付中，不显示取消按钮
                            return [OrderState.UNPAID.code].indexOf(orderState)>-1 && (vm.orderInfo.paymentType || '').indexOf('TRANSFER_PAY')==-1;
                        },
                        show: ()=>{
                            return true;
                        },
                        onClick: ()=>{
                            vm.cancelOrderFun(vm.orderInfo);
                        }
                    },
                    afterSale: {
                        text: '申请售后',
                        load: ()=>{
                            return [OrderState.COMPLETE.code].indexOf(orderState)>-1;
                        },
                        show: ()=>{
                            return true;
                        },
                        onClick: ()=>{
                            vm.afterSaleFun();
                        }
                    },
                    // deleteOrder: {//去除删除订单按钮2021年6月28日
                    //     text: '删除',
                    //     load: ()=>{
                    //         return [OrderState.COMPLETE.code, OrderState.CANCELED.code].indexOf(orderState)>-1;
                    //     },
                    //     show: ()=>{
                    //         return false;
                    //     },
                    //     onClick: ()=>{
                    //         vm.deletetOrderFun(vm.orderInfo);
                    //     }
                    // },
                    confirmReceipt: {
                        text: '确认收货',
                        load: ()=>{
                            let canConfirm = vm.orderInfo.canConfirm; //是否能确认收货，并显示确认收货的按钮
                            return [OrderState.UNRECEIVED.code].indexOf(orderState)>-1 && canConfirm;
                        },
                        show: ()=>{
                            return true;
                        },
                        onClick: ()=>{
                            vm.confirmReceiptFun(vm.orderInfo);
                        }
                    },
                    contactCustomer: {
                        text: '联系客服',
                        load: ()=>{
                            return [OrderState.UNPAID.code, OrderState.UNRECEIVED.code, OrderState.COMPLETE.code,OrderState.UNAPPROVAL.code,OrderState.CANCELED.code].indexOf(orderState)>-1;
                        },
                        show: ()=>{
                            return true;
                        },
                        onClick: ()=>{
                            extendUtils.callNativeTel(this.BMallConfig.BIS_CUSTOMER_SERVICE_PHONE)
                        }
                    },
                }
            },
        },
        activated(){

        },
        deactivated(){
            //离开清空倒计时
            this.countdownClear();
        },
        beforeDestroy(){
            //离开清空倒计时
            this.countdownClear();
        },
        mounted(){
            //待付款或者待审批的订单初始化倒计时 
            if((this.type == 'pay' && this.btnName['pay'].load()) || (this.type == 'approval' && this.btnName['approval'].load())){
                this.countdown()
            }
        },
        methods: {
            clickBtn($event, type){
                this.btnName[type].onClick($event);
                this.$emit('click', this.btnName[type]);
            },
            gotoPage(_router, param){
                this.$router.push({
                    path: _router,
                    query: {
                        item: JSON.stringify(param)
                    }
                })
            },

            /** 
            * 补开发票的跳转页面 
            */
            gotoPageInvoiceReapply(_router, param){
                this.$router.push({
                    path: _router,
                    query:{
                        orderInfo:JSON.stringify(param),
                        invoiceInfo:JSON.stringify({}), //传递空的对象，因为暂时还没有开票，没有发票的相关信息
                        flag:'reapply' //补开发票标识
                    }
                })
            },

            /**
             * 跳转：物流跟踪
             */
            gotoExpressTrack(){
                this.$router.push({
                    path: '/expressTrack',
                    query: {
                        orderNo: this.orderInfo.orderNo,
                        needRequest: true //是否需要请求接口获取物流详情
                    }
                })
            },

            /**
             * 跳转：多个包裹的信息页面
             */
            gotoPackageInfor(){
                this.$router.push({
                    path: '/packageInfor',
                    query: {
                        orderNo: this.orderInfo.orderNo
                    }
                })
            },

            /**
             * 初始化待付款订单的
             */
            countdown(){
                //如果订单状态是待支付或者是待审批的话需要计算出remainPayTime,并执行倒计时
                if([OrderState.UNPAID.code, OrderState.UNAPPROVAL.code].indexOf(getOrderStatus(this.orderInfo.orderState).state) > -1){
                    this.countdownStart();
                }else{
                    this.countdownClear();
                }
            },

            /**
             * 清空倒计时
             */
            countdownClear(){
                !!this.timeInterval && clearInterval(this.timeInterval);
            },

            /**
             * 倒计时结束事件
             */
            countdownEnd(){
                //取消订单
                !this.singleton && this.cancelOrder(this.orderInfo);
            },

            /**
             * 待支付倒计时
             */
            countdownStart(){
                let that = this;
                //支付剩余时间计算，单位是ms毫秒
                let paymentExpiredDeadline = that.orderInfo.paymentExpiredDeadline;
                let nowDate = new Date().getTime();
                that.limitTime = (parseInt((paymentExpiredDeadline - nowDate)/1000))*1000; //毫秒取整
                that.$emit('updateLimitTime', that.limitTime);
                if(!!that.limitTime && that.limitTime > 0){
                    that.countdownClear();
                    that.timeInterval = setInterval(function () {
                        if (!!that.limitTime) {
                            if (that.limitTime <= 1000) {
                                that.limitTime = null;
                                that.countdownClear();
                                //触发倒计时结束事件
                                that.countdownEnd();
                            } else {
                                that.limitTime = that.limitTime - 1000;//注意单位是毫秒ms
                                that.$emit('updateLimitTime', that.limitTime);
                            }
                        } else {
                            that.countdownClear();
                        }
                    }, 1000);
                }else{
                    that.countdownEnd();
                }
            },


            /**
             * 整合跳转申请售后的数据
             */
            afterSaleFun(){
                let that = this;
                if(Object.keys(this.product).length > 0){ //说明是商品列表上点击的申请售后，此时跳转 /order/afterSale/serviceChoose  选择售后类型路由
                    that.applyService(that.orderInfo, that.product)
                }else{ //说明此时为底部的申请售后的按钮，此时跳转  /order/afterSale/list  列表路由
                    that.gotoPage('/order/afterSale/list');
                }
            },
            // 申请售后
            applyService(item, product) {
                const params = {
                    supplierId: product.supplierId,
                    spOrderId: item.supplierOrderNo,
                    skuId: product.sku,
                    skuNum: product.quantity,
                    cityCode: (item.receiverInfo || {}).cityCode || null,
                    districtCode: (item.receiverInfo || {}).districtCode || null,
                    parentSupplierOrderNo: item.parentSupplierOrderNo || null,
                    masterSku: product.masterSku
                };
                this.$loading.show();
                product.orderNo = item.orderNo;
                product.supplierOrderNo = item.supplierOrderNo;
                product.receiverInfo = item.receiverInfo || {};
                product.parentSupplierOrderNo = item.parentSupplierOrderNo;
                afterSaleHandler.getAvailableNumberComp(params).then(res => {
                    const result = res.result || {};
                    if(result.availableNum) {
                        product.availableNum = result.availableNum
                         //售后页面使用sessionStorage取的所以存到sessionStorage里面
                        extendUtils.setSession('afterSale/wareInfo', JSON.stringify(product));
                        this.gotoPage('/order/afterSale/serviceChoose')
                    } else {
                        extendUtils.showToast('不可售后');
                    }
                }).catch(e => {
                    console.log(e)
                }).finally(() => {
                    this.$loading.hide();
                });
            },
            /**
             * 再次购买 订单级别的 也就是再次加入购物车
             */
            setIntoCartOrder(orderInfo){
                let that = this;
                if(!!orderInfo.products && orderInfo.products.length > 0){
                    let goodsFilter = orderInfo.products.filter(item => { //目前只有主商品才能加入购物车 即productType为0的时候
                        return item.productType == 0;
                    })
                    let goods = goodsFilter.map(item => {
                        return  {
                            sku: item.sku,
                            supplierId: item.supplierId,
                            quantity: item.quantity || 1,
                            name: item.name,
                            specification: item.specification,
                            imageUrl: item.imageUrl,
                            jdCardCategoryId3: item.categoryId || '', //商品的三级分类，该字段目前用来判断实体礼品卡不能加入购物车的
                        };  
                    });
                    //加入购物车的方法在全局混入里面globalMixin.js
                    that.setIntoShopCar(goods).then(flag => {
                        !!flag && that.gotoCart();
                    }).catch(e=>{
                        console.error('加入购物车失败====', e);
                    })
                }
            },

            /**
             * 加购物车 功能 级别是单个商品的
             * @param product props传进来的单个商品信息
             */
            setIntoCartProduct($event, product){
                let that = this;
                if(!product || Object.keys(product).length <= 0){return}
                let goods = [
                    {
                        sku: product.sku,
                        supplierId: product.supplierId,
                        quantity: product.quantity || 1,
                        name: product.name,
                        specification: product.specification || product.name,
                        imageUrl: product.imageUrl, 
                        jdCardCategoryId3: product.categoryId || '', //商品的三级分类，该字段目前用来判断实体礼品卡不能加入购物车的
                    }
                ]
                this.$emit('setIntoCart', $event, goods)
            },

            /**
             * 加入购物车成功后跳转购物车页面
             */
            gotoCart(){
                this.$router.push({
                    path: '/cart'
                })
            },

            /**
             * 查看审批
             */
            async viewApproval(){
                if(!!this.orderInfo.flowId){
                    let url = this.BMallConfig.YQTDETAIL;
                    let prex = url.indexOf('?') > -1 ? ('&flowId=' + this.orderInfo.flowId) : ('?flowId=' + this.orderInfo.flowId);
                    window.open(url + prex);
                }else{
                    extendUtils.showToast('该待审批的订单信息中没有flowId，请确认！');
                }
            },

             /**
             * 取消订单confirm弹窗
             */
            cancelOrderFun(order){
                let that = this;
                SnModal({
                    message: '确定要取消订单吗？',
                    showCancelButton: true,
                }).then(res => {
                    that.cancelOrder(order, true);
                }).catch(rej => {
                    console.log('rej === ', rej);
                });
            },

            /** 
            * 确认收货的方法
            */
            confirmReceiptFun(order){
                let that = this;
                let product = order.products[0];//默认显示第一个商品的图片缩略图
                that.confirmReceiptImgSrc = product.imageUrl;
                console.log('product', that.confirmReceiptImgSrc)
                that.showConfirmReceipt = true;//显示确认收货的弹窗
            },

            /**
             * 取消订单调取接口
             * cancelByUser 是否是用户自己手动取消？只有用户自己点击的时候 传true 其他都是false
             */
            cancelOrder(order, cancelByUser=false){
                let that = this;
                that.$loading.show();
                orderHandler.cancelOrder({orderNo: order.orderNo, cancelByUser}).then(res=>{
                    that.$loading.hide();
                    if(res.resultCode == 0){
                        that.$emit('cancelOrderCompleted'); //取消订单目前有一个地方  1.订单详情取消订单
                    }
                }).catch(e=>{
                    that.$loading.hide();
                    console.log(e);
                })
            },
            /**
             * 确认收货调取接口
             */
            onConfirmReceipt(){
                let that = this;
                let order = this.orderInfo;
                that.$loading.show();
                let param = {
                    orderNo: order.orderNo,
                    applyUserId: orderHandler.userId,
                    channelId: orderHandler.channelId,
                    companyId: orderHandler.companyId,
                    userId: orderHandler.userId,
                    orderState: 5  //已完成的订单状态
                }
                orderHandler.updateOrderDetail(param).then(res=>{
                    that.$loading.hide();
                    if(res.resultCode == 0){
                        that.$emit('confirmReceiptCompleted'); 
                    }
                }).catch(e=>{
                    that.$loading.hide();
                    console.log(e);
                })
            },
             /**
             * 删除订单confirm弹窗
             */
            deletetOrderFun(order){
                let that = this;
                SnModal({
                    title:'您确定要删除订单吗？',
                    message: '订单删除后您将无法对该订单的商品申请售后服务，请谨慎操作。',
                    showCancelButton: true,
                }).then(res => {
                    that.deletetOrder(order);
                }).catch(rej => {
                    console.log('rej === ', rej);
                });
            },

            /**
             * 删除订单调取接口
             */
            deletetOrder(order){
                let that = this;
                that.$loading.show();
                orderHandler.updateOrderDetail({applyUserId:orderHandler.userId,deleteState:1,orderNo: order.orderNo}).then(res=>{
                    that.$loading.hide();
                    if(res.resultCode == 0){
                        that.$emit('deleteOrderCompleted'); 
                    }
                }).catch(e=>{
                    that.$loading.hide();
                    console.log(e);
                })
            },
            paySucToDetail(){
                if(this.$route.path.indexOf('/order/detail/')==-1){
                    this.$router.push({
                        path: '/order/detail/'+this.orderInfo.orderNo,
                    })
                }else{
                    extendUtils.reloadPage()
                }
            },
            payComplete(){
                this.countdownEnd();
            },
            /**
             * 订单列表和详情去支付
             */
            toPay(){
                this.$router.push({
                    path: '/pay',
                    query: {
                        expiredTime: this.orderInfo.paymentExpiredDeadline,
                        orderNo: this.orderInfo.orderNo,
                        amount: parseFloat(this.orderInfo.paymentAmount),
                        goodsDesc: `订单号: ${this.orderInfo.orderNo}`,
                        tradeType: '4',
                        pageFrom: this.$route.path
                    }
                })
            }
        }
    }

</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/hairLine.less';
  .order-btn{
    .bpx(1px, .28rem);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: auto;
    min-width: 1.6rem;
    height:.56rem;
    background: #fff;
    border-radius: .38rem;
    padding: 0 .12rem;
    white-space: nowrap;
    font-size: .28rem;
}
.self-width{
    min-width: auto;
    width: auto;
    padding: 0 0.2rem;
}


/* 确认收货弹窗的样式 */
.confirmReceipt{
    /deep/ .weui-dialog__btn.weui-dialog__btn_default{
        color: #999999;
        font-size: 0.3rem;
    }
    /deep/ .weui-dialog__btn.weui-dialog__btn_primary{
        color: @theme-color !important;
        background: #fff !important;
        font-size: 0.3rem;
        opacity: 1;
        &:active{
            opacity: 0.4;
        }
    }
    .goods-item-change{
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .goods-thumbnail-container{
        width: 1.28rem;
        height: 1.28rem;
    }
    .title{
        font-size: 0.3rem;
        font-weight: 600;
        margin: .24rem 0;
    }
    .tips{
        font-size: 0.28rem;
        text-align: left;
        line-height: .36rem;
    }
}
</style>
