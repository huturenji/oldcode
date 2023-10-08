<template>
    <view class="container">
        <w-loading ref="loading"></w-loading>
        <view class="gap"></view>
        <view class="is_need_invoice">是否开具发票</view>
        <view class="select_invoice">
            <!-- 只有下单的时候才显示不需要的选项 发票补开 换开 修改都不需要展示该选项-->
            <view v-if="isConfirmOrderInvoice" class="not_need_wrap" @click="selectInvoice(false)">
                <text :class="{item_check:true, iconfont:true, icon_checked_radio:not_need}" v-if="not_need == true"></text>
                <text :class="{iconfont:true, icon_check_radio:!not_need}" v-if="not_need == false"></text>
                <text>不需要</text>
            </view>

            <view class="is_need_wrap" @click="selectInvoice(true)">
                <text :class="{item_check:true, iconfont:true, icon_checked_radio:is_need}" v-if="is_need"></text>
                <text :class="{iconfont:true, icon_check_radio:!is_need}" v-else></text>
                <text>需要</text>
            </view>
        </view>
        <view v-if="is_need == true">
            <view class="gap"></view>
            <view class="is_need_invoice">发票内容</view>
            <view class="select_invoice">
                <view class="not_need_wrap" @click="selectInvoiceContent(1)">
                    <text class="item_check iconfont" :class="{icon_checked_radio: isGoodsDetail}" v-if="isGoodsDetail"></text>
                    <text class="iconfont" :class="{icon_check_radio:!isGoodsDetail}" v-else></text>
                    <text>商品明细</text>
                </view>
                <view class="is_need_wrap" @click="selectInvoiceContent(2)">
                    <text class="item_check iconfont" :class="{icon_checked_radio: isGoodsType}" v-if="isGoodsType"></text>
                    <text class="iconfont" :class="{icon_check_radio:!isGoodsType}" v-else></text>
                    <text>商品类别</text>
                </view>
            </view>
            <view class="invoice_content_tip">
                {{isGoodsDetail?'发票内容将显示商品详情名称与价格信息，发票金额为实际支付金额，不含优惠等扣减金额。':'发票内容将显示本单商品所属类别及价格信息，发票金额为实际支付金额，不含优惠等扣减金额。'}}
            </view>

            <!-- 有发票记录 -->
            <view class="invoice_history">
                <view class="is_need_invoice">发票抬头信息</view>
                <view @click="choosedInvoiceFun" class="choosed_invoice_item">
                    <view v-if="!choosedInvoice.name" class="add">选择发票抬头</view>
                    <view v-else class="choosed">
                        <view class="name">{{choosedInvoice.name}}</view>
                        <view class="tax" v-if="choosedInvoice.tax">税号：{{choosedInvoice.tax}}</view>
                    </view>
                    <img src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_rightarrow_gray.svg" alt="">
                </view>
            </view>

            <!-- 收票人信息 -->
            <view class="invoice_receiver">
                <view class="is_need_invoice">收票人信息</view>
                <view class="receiver">
                    <view class="receiver_item">
                        <view class="title required">收票人手机</view>
                        <input v-model="receiverInfo.phone" type="number" maxlength="11" placeholder="请填写收票人手机号">
                    </view>
                    <view class="receiver_item">
                        <view class="title">收票人邮箱</view>
                        <input v-model="receiverInfo.email" type="text" placeholder="请填写收票人邮箱">
                    </view>
                </view>
            </view>

        </view>

        <!-- 底部确定按钮 -->
        <view class="confirm_btn_wrap">
            <view class="confirm_btn" @click="invoiceSubmit">确定</view>
        </view>
    </view>
</template>

<script>
import invoiceHandler from '@/views/components/invoice/handler';
import { getStorageSync,setStorageSync } from '@/utils/common.js'

export default {
    data() {
        return {
             
            not_need: true, //是否开具发票，暂不需要
            is_need: false, //是否开具发票，需要
            invoiceContent: 1, //发票内容 默认是1    1=商品明细 2=商品类别         
            applyType: '', //区分是补开发票（add） 换开发票（change） 下单选择发票（confirmOrder）
            orderSn: '', //订单编号 为了发票换开和补开
            choosedInvoice: {},// 选择的发票抬头对象
            receiverInfo: {
                phone: '', //手机号
                email: '' //邮箱
            } //收票人相关信息
        }
    },
    computed: {
        // 是否是补开发票 
        isAddInvoice(){
            return this.applyType == 'add'
        },

        // 是否是换开发票 
        isChangeInvoice(){
            return this.applyType == 'change'
        },

        // 是否是下单页选择发票
        isConfirmOrderInvoice(){
            return this.applyType == 'confirmOrder'
        },

        isGoodsDetail(){
            return this.invoiceContent == 1
        },
        isGoodsType(){
            return this.invoiceContent == 2
        }
    },

    beforeDestroy(){
        setStorageSync('is_need_invoice', this.is_need);
    },
        
    mounted(){
        this.applyType = this.$Route.query.applyType || '';
        this.orderSn = this.$Route.query.orderSn || '';
        // eslint-disable-next-line no-eval
        this.needInvoice = JSON.parse(this.$Route.query.needInvoice || false);//url传递boolean值会被转字符串
        this.invoiceContent = this.$Route.query.invoiceContent || 1; //更新发票内容
        
        if (this.needInvoice){
            this.is_need = true;
            this.not_need = false;
        }

        // 初始化获取收票人信息
        this.initReceiverInfo();
            
            
    },

    // 获取选择的发票
    onShow(){
        let choosedInvoice = getStorageSync('choosedInvoice'); //取缓存中的存入的选择的发票
        this.choosedInvoice = choosedInvoice || {};
    },

    methods: {

        // 初始化获取收票人信息
        initReceiverInfo(){
            return new Promise(() => {
                this.$refs?.loading?.open();
                invoiceHandler.getInvoiceReceiver().then(res => {
                    if (res.state == 200 && !!res.data) { //说明存在收票人信息，此时更新变量
                        this.$set(this.receiverInfo, 'id', res.data.id);
                        this.$set(this.receiverInfo, 'phone', res.data.phone);
                        this.$set(this.receiverInfo, 'email', res.data.email);
                    }
                }).finally(()=>{
                    this.$refs?.loading?.close();
                })
            })
        },

        // 保存收票人信息
        saveReceiverInfo(){
            return new Promise((resolve) => {
                let apiType = !!this.receiverInfo.id ? 'updateInvoiceReceiver' : 'addInvoiceReceiver';
                let param = {
                    phone: this.receiverInfo.phone || '',
                    email: this.receiverInfo.email || ''
                }                    
                this.$refs?.loading?.open();
                invoiceHandler[apiType](param).then(res => {
                    if (res.state == 200) { //说明存在收票人信息，此时更新变量
                        resolve(true)
                            
                    } else {
                        resolve(false)
                    }
                }).catch(()=>{
                    resolve(false)
                }).finally(()=>{
                    this.$refs?.loading?.close();
                })
            })
        },


        selectInvoice(prop) {
            if (this.is_need == prop || this.not_need == !prop) {
                return
            }
            this.not_need = this.not_need == true ? false : true
            this.is_need = this.is_need == true ? false : true
        },

        // 选择发票内容
        selectInvoiceContent(type) {

            this.invoiceContent = type; //更新发票内容
        },
    
        
        //跳转到选择发票抬头的页面
        choosedInvoiceFun(){
            this.$Router.push({
                path: "/views/invoice/list",
                query: {
                    showCheck: 'showCheck', //显示选择功能 
                    choosedTitleId: this.choosedInvoice.titleId || ''
                }
            })
        },


        // 保存发票
        async invoiceSubmit() {
                
                
            if (this.is_need) { //需要发票
                if (!this.choosedInvoice.name) {
                    uni.showToast({
                        title: '请选择发票！',
                        icon: 'none'
                    })
                    return false
                }

                if (!this.receiverInfo.phone){
                    uni.showToast({
                        title: '请填写收票人手机号',
                        icon: 'none'
                    })
                    return false
                }
                let regPhone = /(1[3-9]\d{9}$)/;
                let regEmail = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
                if (!!this.receiverInfo.phone && !regPhone.test(this.receiverInfo.phone)){
                    uni.showToast({
                        title: '收票人手机号格式错误',
                        icon: 'none'
                    })
                    return false
                }
                if (!!this.receiverInfo.email && !regEmail.test(this.receiverInfo.email)){
                    uni.showToast({
                        title: '收票人邮箱格式错误',
                        icon: 'none'
                    })
                    return false
                }

                //保存或者更新收票人信息
                let flag = await this.saveReceiverInfo();
                if (!!flag){ //说明收票人信息变更成功
                    if (this.isConfirmOrderInvoice){ //下单选择发票
                        setStorageSync('is_need_invoice', this.is_need); //是否需要开发票存入缓存
                        setStorageSync('invoice_info', this.choosedInvoice); //抬头信息存入缓存
                        setStorageSync('invoice_content', this.invoiceContent); //发票内容存入缓存
                        this.$Router.back(1);
    
                    } else if (this.isAddInvoice){ //补开发票
                        let newFlag = await this.addInvoiceFun();
                        if (newFlag){
                            uni.$emit('forceUpdatePage');
                            this.$Router.back(1)
                        }
                    } else if (this.isChangeInvoice){ //换开发票
                        let newFlag = await this.reInvoiceFun();
                        if (newFlag){
                            uni.$emit('forceUpdatePage');
                            this.$Router.back(1)
                        }
                    }
                } else {
                    uni.showToast({
                        title: '更新收票人信息失败',
                        icon: 'none'
                    })
                }

            } else { //不需要发票（只有下单的时候才有不需要发票的场景）
                setStorageSync('is_need_invoice', this.is_need);
                this.$Router.back(1)
            }
        },    

        //换开发票接口
        reInvoiceFun(){
            return new Promise((resolve) => {
                let param = {
                    invoiceId: this.choosedInvoice.titleId,
                    orderSn: this.orderSn,
                    invoiceContent: this.invoiceContent
                }
                this.$refs?.loading?.open();
                invoiceHandler.reInvoice(param).then(res => {
                    if (res.state == 200) {
                        uni.showToast({
                            title: '发票换开成功',
                            icon:'none'
                        })
                        uni.$emit('reInvoiceOk');
                        resolve(true);
                    } else {
                        uni.showToast({
                            title: '发票换开失败',
                            icon:'none'
                        })
                        resolve(false);
                    }
                }).finally(()=>{
                    this.$refs?.loading?.close();
                })
            })
        },

        //补开发票接口
        addInvoiceFun(){
            return new Promise((resolve) => {
                let param = {
                    invoiceId: this.choosedInvoice.titleId,
                    orderSn: this.orderSn,
                    invoiceContent: this.invoiceContent
                }
                this.$refs?.loading?.open();
                invoiceHandler.addInvoice(param).then(res => {
                    if (res.state == 200) {
                        uni.showToast({
                            title: '发票补开成功',
                            icon:'none'
                        })
                        uni.$emit('addInvoiceOk');
                        resolve(true);
                    } else {
                        uni.showToast({
                            title: '发票补开失败',
                            icon:'none'
                        })
                        resolve(false);
                    }
                }).finally(()=>{
                    this.$refs?.loading?.close();
                })
            })
        }
    }
}
</script>

<style lang="scss">
    .container {
        width: 750rpx;
        margin: 0 auto;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        flex-direction: column;
    }

    .gap {
        width: 750rpx;
        height: 20rpx;
        background-color: $uni-bg-color;
    }

    .is_need_invoice {
        padding-left: 20rpx;
        height: 100rpx;
        line-height: 100rpx;
        font-size: 30rpx;
        font-weight: 600;
        color: #999;
    
    }

    .select_invoice {
        display: flex;
        height: 100rpx;
        align-items: center;
        padding-left: 20rpx;
        font-size: 28rpx;

        .not_need_wrap {
            margin-right: 163rpx;

            &.margin {
                margin-right: 48rpx;
            }

            &.noMargin {
                margin-right: 0rpx;
            }
        }
    }

    .iconfont {
        font-size: 32rpx;
        color: #BBBBBB;
        margin-right: 20rpx;

        &.item_check {
            color: #F30300 !important;
        }
    }

    .confirm_btn_wrap {
        width: 750rpx;
        height: 168rpx;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        z-index: 99;

        .confirm_btn {
            width: 668rpx;
            height: 88rpx;
            text-align: center;
            line-height: 88rpx;
            font-size: 36rpx;
            letter-spacing: 4rpx;
            color: #fff;
            background: #F30300;
            // box-shadow: 0px 10px 20px 0px rgba(252, 31, 28, 0.2);
            border-radius: 44px;
        }
    }

    .invoice_content_tip {
        font-size: 24rpx;
        color: #999;
        padding: 20rpx;
        box-sizing: border-box;
        background: $uni-bg-color;
    }

    .goods_type {
        height: 100rpx;
        display: flex;
        padding-left: 20rpx;
        box-sizing: border-box;
        align-items: center;
        font-size: 28rpx;
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
    }

    .invoice_content_wrap {
        margin: 20rpx;
        // height:298rpx;
        font-size: 28rpx;
        border: 1rpx solid rgba(0, 0, 0, 0.1);
        border-radius: 6rpx;
        box-sizing: border-box;

        .invoice_content_title {
            height: 95rpx;
            display: flex;

            .content_title_item {
                flex: 1;
                color: #666;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        .invoice_content_item {
            display: flex;
            height: 101rpx;
            justify-content: space-between;
            align-items: center;
            padding: 0 20rpx;
            color: #333;
            border-top: 1rpx solid rgba(0, 0, 0, 0.1);
            box-sizing: border-box;

            .invoice_item_right {
                color: #999;
                font-size: 26rpx;
                text-align: right;
            }

            input {
                text-align: right;
            }

            input {
                text-align: right;
            }
        }
    }

    .selected_content {
        background: $uni-bg-color;
    }

    .invoice_content_item ::v-deep .uni-input-wrapper ::v-deep .uni-input-input {
        width: 500rpx;
    }

    /* #ifdef MP */
    .invoice_content_item input {
        width: 500rpx;
    }

    /* #endif */
    .default_invoice {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: #333;
        font-size: 28rpx;
        padding-right: 20rpx;
    }

    .history_item {
        height: 100rpx;
        font-size: 32rpx;
        color: #333;
        padding-left: 20rpx;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
        position: relative;
        transition: all 0.3s;

        .delete_btn {
            width: 160rpx;
            height: 100rpx;
            background-color: #FC1C1C;
            color: #fff;
            font-size: 28rpx;
            font-weight: 600;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0;
            right: -160rpx;
            transition: all 0.3s;
            box-sizing: border-box;
        }
    }

    
    .show_del {
        display: flex;
    }

    .hide_del {
        display: none;
    }

    // 选择发票
    .invoice_history{
        padding-bottom: 50rpx;
    }
    .choosed_invoice_item{
        cursor: pointer;
        padding: 30rpx;
        padding-right: 5rpx;
        margin: 0 20rpx;
        border: 1rpx solid #e8e8e8;
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        img{
            width: 24rpx;
            height: 24rpx;
        }
        .add{
            color: #222222;
            font-size: 26rpx;
            width: 100%;
            text-align: center;
        }
        .choosed{
            .name{
                font-size: 28rpx;
                color: #000;
            }
            .tax{
                color: #a4acb2;
                font-size: 26rpx;
                margin-top: 24rpx;
            }
        }
    }


    // 收票人信息
    .invoice_receiver{
        padding-bottom: 168rpx;
        font-size: 26rpx;
        .receiver_item{
            padding: 0 20rpx;
            display: flex;
            align-items: center;
            margin-bottom: 10rpx;
            .title{
                width: 200rpx;
                min-height: 40rpx;
                line-height: 150%;
                position: relative;
                &.required::after{
                    content: "*";
                    color: red;
                }
            }
            input{
                min-height: 40rpx;
                flex: 1;
                font-size: 26rpx;
            }
        }
    }
</style>
