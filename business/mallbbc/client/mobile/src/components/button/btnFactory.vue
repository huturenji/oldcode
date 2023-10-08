<template>
    <view class="btnFactory" v-if="btnName[btnInfo.type] && btnName[btnInfo.type].load()">
        <view 
            class="flex_row_center_center"
            :class="[`btn-${size}`, 'btn']"
            @click.stop='clickBtn($event, btnInfo.type)'
            :style="{
                'color': textColor,
                'borderColor': borderColor,
                'backgroundColor': bgColor
            }"
        >
            <view class="btn_eclipse">{{ btnName[btnInfo.type].text }}</view>
        </view>
    </view>
</template>

<script>
import { isTransferPay } from '@/utils/common.js'
import orderMixin from '@/common/mixin/orderMixin' //订单混入
import orderHandler from '@/components/order/handler';
import giftHandler from "@/components/gift/handler";
import { giftStatusMap } from '@/views/gift/common/lib/enum.js';
import { getEmaoqingShareInfo, getAppInfo } from '@/views/gift/common/lib/until';
import shareHandler from '@/utils/shareHandler.js';

export default {
    mixins: [orderMixin],
    props: {
        // 按钮类型，可由这个来改变按钮样式
        btnInfo: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 列表项信息
        info: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 背景色
        bgColor: {
            type: String,
            default: '#f30300'
        },
        // 文字颜色
        textColor: {
            type: String,
            default: '#fff'
        },
        // 边框颜色
        borderColor: {
            type: String,
            default: '#f30300'
        },
        // 大小，small 小按钮 normal 普通大小，big 单个占满整行
        size: {
            type: String,
            default: 'normal'
        },
        // 其他参数
        otherProps: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            shareOptions: {}, //分享的相关配置
            appInfo: getAppInfo(), // app相关的信息
            channelOptions: {} // 渠道配置信息
        };
    },
    created() {
        this.initChannelOptions();
    },
    computed: {
        btnName() {
            let that = this;
            return {
                // 鹅毛情相关按钮
                detail: {
                    text: "查看详情",
                    onClick: () => {
                        that.viewDetailFun();
                    },
                    load: ()=>{
                        return true
                    }
                },
                viewGiftDetail: {
                    text: "查看物流详情",
                    onClick: () => {
                        that.viewDetailFun();
                    },
                    load: ()=>{
                        return true
                    }
                },
                address: {
                    text: "请朋友填写地址",
                    onClick: () => {
                        that.writeAddressFun()
                    },
                    load: ()=>{
                        return true
                    }
                },
                weixin: {
                    text: "微信送礼单",
                    onClick: () => {
                        that.shareFun('wechat');
                    },
                    load: () => {
                        // 只有移动端才显示用微信送礼单的按钮 
                        return !SnUtils.isPC();
                    }
                },
                bizmate: {
                    text: `${that.appInfo.name}送礼单`,
                    onClick: () => {
                        that.shareFun('bizmate')
                    },
                    load: ()=>{
                        return true
                    }
                },
                returnGift: {
                    text: '去回礼',
                    onClick: () => {
                        that.giftAgaginFun()
                    },
                    load: ()=>{
                        return true
                    }
                },
                addInvoice: {
                    text: "补开发票",
                    onClick: () => {
                        that.addInvoice(that.info)
                    },
                    load: ()=>{ //按钮的组件是否加载，也就是用v-if来控制的
                        return that.info.orderDetailVO && !that.info.orderDetailVO.invoice && that.info.orderDetailVO.actualPayment>0
                    }
                },
                resInvoice: {
                    text: "换开发票",
                    onClick: () => {
                        that.resInvoice(that.info, 'gift')
                    },
                    load: ()=>{
                        return that.info.orderDetailVO && !!that.info.orderDetailVO.invoiceApplyInfo && !!that.info.orderDetailVO.invoiceApplyInfo.invoiceState && that.info.orderDetailVO.invoiceApplyInfo.invoiceState == 'INVOICED'
                    }
                },
                viewInvoice: {
                    text: "查看发票",
                    onClick: () => {
                        that.viewInvoice()
                    },
                    load: ()=>{
                        return that.info.orderDetailVO && !!that.info.orderDetailVO.invoiceApplyInfo && !!that.info.orderDetailVO.invoiceApplyInfo.invoiceUrls && that.info.orderDetailVO.invoiceApplyInfo.invoiceUrls.length > 0
                    }
                },
                agagin: {
                    text: "再次送礼",
                    onClick: () => {
                        that.giftAgaginFun()
                    },
                    load: ()=>{
                        return true
                    }
                },
                goGiveGift: {
                    text: "我要送礼",
                    onClick: () => {
                        that.giftAgaginFun()
                    },
                    load: ()=>{
                        return true
                    }
                },
                refund: {
                    text: "退款详情",
                    onClick: () => {
                        that.refundDetailFun()
                    },
                    load: ()=>{
                        return true
                    }
                },
                pay: {
                    text: "去支付",
                    onClick: () => {
                        that.goToPayFun(that.info)
                    },
                    load: ()=>{
                        return true
                    }
                },
                pay_detail: {
                    text: "去支付",
                    onClick: () => {
                        that.goToPayFun(that.info, 'detail')
                    },
                    load: ()=>{
                        return true
                    }
                },                
                cancel: {
                    text: "取消送礼",
                    onClick: () => {
                        that.cancelPayFun()
                    },
                    load: ()=>{
                        return true
                    }
                },
                
                // 1.鹅毛情列表我收到的填写地址领取礼物按钮。2.领取index页的‘填写地址领取礼物’（跳转到填写地址页面，和收下礼物功能一样）
                fillAddress: {
                    text: "填写地址",
                    onClick: () => {
                        that.fillAddressFun()
                    },
                    load: ()=>{
                        return true
                    }
                },
                receive: {
                    text: "领取心意",
                    onClick: () => {

                    },
                    load: ()=>{
                        return true
                    }
                },
                havedKnow: {
                    text: "我知道了",
                    onClick: () => {
                        that.goToGiftIndex()
                    },
                    load: ()=>{
                        return true
                    }
                },

                // 普通订单按钮
                editAddress: {
                    text: '修改地址',
                    onClick: () => {
                        that.viewDetailFun();
                    },
                    load: () => { return true }
                },
                logistics: {
                    text: '查看物流',
                    onClick: () => {
                        that.lookLogistics(that.info.orderSn);
                    },
                    load: () => { return true }
                },
                delOrder: {
                    text: '删除订单',
                    onClick: () => {
                        that.orderEvents('delOrder')
                    },
                    load: () => { return true }
                },
                confirmOrder: {
                    text: '确认收货',
                    onClick: () => {
                        that.orderEvents('confirmOrder')
                    },
                    load: () => { return true }
                },
                cancelOrder: {
                    text: '取消订单',
                    onClick: () => {
                        that.orderEvents('cancelOrder')
                    },
                    load: () => { return true }
                },
                payOrder: {
                    text: '立即支付',
                    onClick: () => {
                        that.goPay(that.info, 'list')
                    },
                    load: () => { return true }
                },
                shareOrder: {
                    text: "邀请朋友一起买",
                    onClick: () => {
                        that.orderEvents('goShare')
                    },
                    load: () => { return true }
                },
                buyAgain: {
                    text: "再次购买",
                    onClick: () => {
                        that.orderEvents('buyAgain')
                    },
                    load: () => { return true }
                },
                customer: {
                    text: "联系客服退款",
                    onClick: () => {
                        that.contactCustomerRefund('list')
                    },
                    load: () => { return true }
                },
                addInvoice_l: {
                    text: '补开发票',
                    onClick: () => {
                        that.addInvoice(that.info)
                    },
                    load: () => { 
                        return !!!that.info.invoice && that.info.actualPayment != 0
                    }
                },
                resInvoice_l: {
                    text: "换开发票",
                    onClick: () => {
                        that.resInvoice(that.info, 'normal')
                    },
                    load: ()=>{
                        return that.otherProps.showReInvoiceBtn
                    }
                },
                viewInvoice_l: {
                    text: "查看发票",
                    onClick: () => {
                        that.orderEvents('viewInvoice')
                    },
                    load: ()=>{
                        return that.otherProps.showViewInvoiceBtn
                    }
                },

                // 普通订单详情按钮
                cancelOrder_d1: {
                    text: '取消订单',
                    onClick: () => {
                        that.orderEvents('cancelOrder')
                    },
                    load: () => { 
                        return !isTransferPay(that.info.paymentCode)
                    }
                },
                cancelOrder_d2: {
                    text: '取消订单',
                    onClick: () => {
                        that.orderEvents('cancelOrder')
                    },
                    load: () => { 
                        return !isTransferPay(that.info.paymentCode) || (that.info.orderType == 106 && that.info.promotionStatus == 0)
                    }
                },
                payOrder_d: {
                    text: '立即支付',
                    onClick: () => {
                        that.goPay(that.info, 'detail')
                    },
                    load: () => { 
                        return !(
                            that.info.orderType == 105 &&
                            that.info.orderSubState == 102 &&
                            (that.info.orderType == 103 && that.info.orderSubState==102 && that.info.presellInfo.remainEndTime > 0)
                        )
                    }
                },
                addInvoice_d: {
                    text: '补开发票',
                    onClick: () => {
                        that.addInvoice(that.info)
                    },
                    load: () => { 
                        return !!!that.info.invoice && that.info.actualPayment != 0 && !that.otherProps.isGift
                    }
                },
                customer_d: {
                    text: '联系客服退款',
                    onClick: () => {
                        that.contactCustomerRefund('detail')
                    },
                    load: () => { 
                        return !(that.info.orderType==106) && !that.otherProps.isGift
                    }
                },
                buyAgain_d: {
                    text: "再次购买",
                    onClick: () => {
                        that.orderEvents('buyAgain')
                    },
                    load: () => {
                        return !that.otherProps.isGift
                    }
                },
                resInvoice_d: {
                    text: "换开发票",
                    onClick: () => {
                        that.resInvoice(that.info, 'normal')
                    },
                    load: ()=>{
                        return that.otherProps.showReInvoiceBtn
                    }
                },
                viewInvoice_d: {
                    text: "查看发票",
                    onClick: () => {
                        that.orderEvents('viewInvoice')
                    },
                    load: ()=>{
                        return that.otherProps.showViewInvoiceBtn
                    }
                }
            }
        }
    },
    methods: {
        // 初始化渠道信息
        async initChannelOptions(){
            this.channelOptions = await window.getChannelOptions;
        },
        // 点击按钮
        clickBtn($event, type) {
            this.btnName[type].onClick($event);
            this.$emit('click', this.btnName[type]);
        },

        //#region 鹅毛情相关事件
        // 查看详情
        viewDetailFun() {
            this.$Router.push({ path: '/views/gift/detail/index', query: { featherId: this.info.featherId } })
        },
        // 请朋友填地址
        writeAddressFun() {
            uni.$emit('giftShare', this.info.featherId)
        },
        // 再次送礼
        giftAgaginFun() {
            sinosdk.sino.openApplet({
                url:window.location.origin+window.location.pathname+'#/',
                appId: '268435729'
            });
        },

        // 用微信送礼单的按钮方法
        /*****
         * @param type 分享方式 type='bizmate' = 伴正事分享  type='wechat' = 微信分享
         */
        async shareFun(type){
            let that = this;
            try {
                that.shareOptions = await that.getEmaoqingShareInfoFun(this.info.featherId, this.otherProps.choosedCardIndex);
                this.share(type);
            } catch (error) {
                console.log('分享失败',error)
            }
        },
        /**
        * 获取鹅毛情分享的相关参数
        */
        getEmaoqingShareInfoFun(id, cardIndex){
            return new Promise(async resolve => {
                try {
                    let options = await getEmaoqingShareInfo(id, cardIndex);
                    resolve(options);
                } catch (error) {
                    resolve(null);
                }
            })
        },
        /**
         * 分享操作
         * @param option 分享的类型
         */ 
        async share(type){
            let that = this;
            // 调用分享的方法
            shareHandler.share(type, that.shareOptions)
        },
        // 退款详情
        refundDetailFun() {
            this.$Router.push({ path: '/gift/refund', query: { featherId: this.info.featherId } })
        },
        async checkGift(featherId){
            if (!featherId){
                return false;
            }
            try {
                const {data, state} = await giftHandler.getGiftDetail({featherId})
                return state == 200 && data.status != giftStatusMap['CANCEL'];

            } catch (error) {
                console.error(error); 
            }
            return false     
        },
        // 去支付
        async goToPayFun(item, page = 'list') {
            const {featherId, featherOrderInfoVO} = item;
            let flag = await this.checkGift(featherId);
            if (!flag){
                // 跳转到鹅毛情首页
                window.featherObj = {
                    type: 'del',
                    featherId
                }
                this.$emit('giftCanceled')
                
                return; // 当前函数退出执行栈
            }
            //订单优化需求 去掉payInfo接口，订单列表和详情 去支付 必须 带参数过去 amount payMethodType
            let orderObj = page == 'detail' ? item.orderDetailVO : featherOrderInfoVO          
            this.$Router.replace({
                path: '/views/pay/giftPay',
                query: {
                    paySn: orderObj.paySn,
                    amount: orderObj.orderAmount,
                    orderSn: orderObj.orderSn,
                    payMethodType: 'orderList',
                    featherId
                }
            })
        },
        // 取消送礼
        cancelPayFun() {
            uni.showModal({
                content: '确认取消送礼吗？',
                cancelText: '取消',
                confirmText: '确定',
                success: res => {
                    if (res.confirm) {
                        this.cancel();
                    }
                }
            })

        },
        // 取消送礼实体方法
        async cancel() {
            let flag = await this.checkGift(this.info.featherId)            
            if (!flag){
                // 跳转到鹅毛情首页
                window.featherObj = {
                    type: 'del',
                    featherId: this.info.featherId
                }
                this.$emit('giftCanceled');
                return; // 当前函数退出执行栈
            }
            let param = {};
            let result;
            let data = {};
            param.orderSn = this.info?.featherOrderInfoVO?.parentSn || '';
            param.cancelReason = '鹅毛情订单取消';
            orderHandler.cancel(param).then(res => {
                if (res.state == 200) {
                    try {
                        result = true;

                    } catch (error) {
                        result = false;
                        console.log(error)
                    }
                    this.$api.msg(res.msg);

                } else {
                    result = false;
                    this.$api.msg(res.msg);
                }
                data = { result: result, featherId: this.info.featherId }
                this.$emit('cancelResult', data)
            }).catch(() => {
                //异常处理
            })
        },
        // 填写地址领取礼物
        fillAddressFun() {
            this.$Router.push({ path: '/views/gift/exchange/index', query: { featherId: this.info.featherId } })
        },
        // 我知道了
        goToGiftIndex() {
            if (this.otherProps.goToIndexType == 'receive') {
                this.$Router.push({ path: '/gift', query: { tabIndex: 1 } })
            } else {
                this.$Router.back(1);
            }

        },
        addInvoice(item) {
            this.$Router.push({
                path: '/pages/invoice/myInvoice',
                query: {
                    isVatInvoice: 0, // 是否可以开增值税发票,0-不可以， 1-可以
                    applyType: 'add', // 补开发票
                    needInvoice: true, //需要发票
                    invoiceContent: 1, // 默认商品明细
                    orderSn: item.orderSn // 
                }
            })
        },
        viewInvoice(){
            this.$emit('viewInvoice')
        },
        // 换开发票
        resInvoice(item, type){
            let invoiceContent = 1
            if (type === 'gift') {
                if (item.orderDetailVO.invoice && item.orderDetailVO.invoice.invoiceContent){
                    invoiceContent = item.orderDetailVO.invoice.invoiceContent
                }

                // 如果需要换开发票，此时跳转到我的发票页面此时需要显示和当前订单一致的发票信息，
                //将选择的发票存入缓存 为了订单详情页面和我的发票页面显示的发票一致, 同时要更新字段 因为订单这里的字段和发票的字段不一致
                this.$setStorageSync('choosedInvoice', {
                    titleId: item.orderDetailVO.invoice.invoiceId,
                    name: item.orderDetailVO.invoice.invoiceTitle
                });
            } else if (type === 'normal') {
                if (item.invoice && item.invoice.invoiceContent){
                    invoiceContent = item.invoice.invoiceContent
                }

                this.$setStorageSync('choosedInvoice', {
                    titleId: item.invoice.invoiceId,
                    name: item.invoice.invoiceTitle
                }); 
            }
            
            this.$Router.push({
                path: '/pages/invoice/myInvoice',
                query: {
                    applyType: 'change',
                    orderSn: item.orderSn, //订单编号
                    needInvoice: true, //需要开发票
                    invoiceContent
                }
            })
        },
        //#endregion

        //#region 普通订单事件
        // 触发订单列表事件
        orderEvents(type) {
            this.$emit('orderEvents', { type: type, data: this.info })
        },
        // 修改地址
        editAddress() {
            this.$emit('orderEvents', { type: 'showState' })

            this.$Router.push({
                path:'/pages/address/list',
                query:{ source:2, orderSn: this.info.orderSn }
            })
        },
        // 联系客服退款
        contactCustomerRefund(type) {
            this.gotoCustomerService(this.info, type);
        },
        // 评价
        remainEvaluated() {
            this.$emit('orderEvents', { type: 'showState' })

            this.$Router.push({
                path:'/views/order/evaluation/publish',
                query:{ orderSn: this.info.orderSn }
            })
        },
        // 去支付
        goPay(val, type) {
            let goodsInfo
            if (type == 'list') {
                this.$emit('orderEvents', { type: 'showState' })
                goodsInfo = val.orderProductListVOList[0];
            } else if (type == 'detail') {
                let storeInfo = val.childOrdersVOS[0];
                goodsInfo = storeInfo.orderProductListVOList[0]
            } else {
                return
            }

            // 整合商品相关的参数
            let products = [
                {
                    number: goodsInfo.productNum,
                    sku: goodsInfo.sku
                }
            ];
            if (val.orderType == 105 && val.orderSubState == 102 && val.depositRemainTime == 0) {
                //阶梯团付尾款
                this.$Router.push({
                    path:'/views/order/confirm/normal',
                    query:{
                        products: JSON.stringify(products),
                        ifcart:2,
                        orderSn:val.orderSn
                    }
                })
            } else if (val.orderType == 103 && val.orderSubState == 102 && val.depositRemainTime == 0) {
                this.$Router.push({
                    path: '/views/order/confirm/normal',
                    query: {
                        products: JSON.stringify(products),
                        ifcart:2,
                        orderSn:val.orderSn
                    }
                })
            } else {
                this.$Router.push({
                    path: '/pages/order/pay',
                    query: {
                        amount: val.orderAmount,
                        orderSn: val.orderSn,
                        paySn: val.paySn,
                        payMethodType: 'orderList'
                    }
                })
            }
        }
        //#endregion
    }
}
</script>

<style lang="scss" scoped>
.btnFactory {
    .btn_eclipse{
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .btn-small {
        cursor: pointer;
        height: 50rpx;
        line-height: 50rpx;
        padding: 0 20rpx;
        margin-left: 16rpx;
        border-radius: 25rpx;
        font-size: 24rpx;
        font-weight: 400;
        text-align: center;
    }
    .btn-normal {
        cursor: pointer;
        height: 64rpx;
        line-height: 64rpx;
        padding: 0 26rpx;
        margin-left: 20rpx;
        border-radius: 34rpx;
        font-size: 28rpx;
        font-weight: bold;
        text-align: center;
    }

    .btn-big {
        cursor: pointer;
        height: 80rpx;
        margin: 0;
        padding: 0;
        font-size: 30rpx;
        font-weight: bold;
        border-radius: 40rpx;
    }

    .btn {
        cursor: pointer;
        background: #f30300;
        color: #fff;
        border: 2rpx solid #f30300;
    }
}
</style>
