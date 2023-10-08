<!-- 支付页面 -->
<template>
    <view class="container">
        <view class="order_info flex_column_start_start">
                <view class="order_amount">
                    <text class="unit">￥</text>
                    <text class="price_int">{{$getPartNumber(payInfo.needPay,'int')}}</text>
                    <text class="price_decimal">{{$getPartNumber(payInfo.needPay,'decimal')}}</text>
                </view>
        </view>
        <view class="pay_part flex_column_start_start">
            <view class="pay_part_con">
            <text class="title">{{$L('选择支付方式')}}</text>
            <block v-if="payMethod && payMethod.length">
                <view v-for="(item,index) in payMethod" :key='index'  @click='selData=item'
                    :class="{item:true, b_b:index<payMethod.length-1, flex_row_between_center:true}">
                    <view class="left flex_row_start_center">
                        <image class="pay_icon" :src="item.icon" />
                        <text class="tit">{{item.alias}}</text>
                    </view>
                    <view class="right">
                        <text
                            :class="{iconfont:true, icon_checked_radio:selData.payType == item.payType,icon_check_radio:selData.payType != item.payType,has_sel:selData.payType == item.payType}"></text>
                    </view>
                </view>
            </block>
            <block v-else-if="payMethod && !payMethod.length">
                <view class="no_payMth">
                    <view class="img"></view>
                    <text>暂无支付方式</text>
                </view>
            </block>
            </view>
        </view>
        <!-- 立即付款 -->
        <view class="clickPayBox">
            <view class="clickPay" :class='{"disabled": !availablePay}' @click="selectPayMethod()">支付</view>
        </view>
    </view>
</template>
<script>
import {
    getCacheUserInfo
} from '@/utils/auth.js'
import {isEmpty} from '@/utils/common.js'
import {bslConfig} from '@/utils/safeRequest'    

export default {
    name: 'cash-register',
    data() {
        let imgUrl = getApp().globalData.imgUrl;
        return {
            paySn: this.$Route.query.paySn, //支付单号
            payInfo: {needPay: this.$Route.query.amount}, //订单信息
            selData: {},
            payMethod: null, //支付方式
            payMethodType: 'create', //从哪里进入支付，create 下单，orderList 订单列表 orderDetail 订单详情 recharge 充值
            sinoPayInstance: null,//支付对象
            operationStage: null,//支付状态
            orderSn: this.$Route.query.orderSn,//订单号
            h5PayBack: false,
            imgUrl: imgUrl
        }
    },
    computed: {
        //微信H5支付的缓存key
        h5PayCacheKey(){
            return 'h5Pay_' + this.paySn
        },
        availablePay(){
            return !!this.selData && Object.keys(this.selData).length!=0;
        }
    },
    mounted(){
        this.h5PayBack = this.isH5PayBack();
        this.payMethodType = this.$Route.query.payMethodType != undefined ? this.$Route.query.payMethodType : this.payMethodType;
        this.initPayInfo();
    },
    beforeRouteLeave(to, from, next) {
        this.$removeSession(this.h5PayCacheKey);//防止意外退出，清理缓存
        window.sinopay && window.sinopay.destroy();
        next();
    },
    watch: {
        operationStage(_new){
            this.$emit('changeState', _new)
        }
    },
    methods: {
        initPayInfo(){
            let that = this;
            SnUtils.loadScript({
                src: './thirdparty/pay/sinopay.js',
                id: 'sinoPay',
                onload: async function() {
                    that.installPay().then(async ()=>{
                        //微信h5支付回来
                        if (that.h5PayBack){
                            that.continueH5Pay();
                        }
                        that.payMethod = await that.sinoPayInstance.getPayMethod();
                        that.setDefaultPayType();
                    });
                }
            });
            this.getPayInfo();
        },
        async installPay(){
            let that = this;
            let origin = getApp().globalData.apiUrl;
            let userParams = getApp().globalData.userParams;
            this.sinoPayInstance = await window.sinopay.install({
                config: {
                    api: {
                        payTypeList: {
                            path: origin + 'v3/channel/front/getPaymentMethods',
                            method: 'get'
                        },
                        createPay: {
                            path: origin + 'v3/payment/front/pay'
                        },
                        getPaymentInfo: {
                            path: origin + 'v3/business/front/orderPay/payInfo',
                            method: 'get',
                            param: {
                                paySn: this.paySn,
                                payFrom: this.payMethodType == 'create' ? 1 : 2
                            },
                            responseResolver(res){
                                //订单支付状态 0-未支付 1-已支付 2-支付中 3-交易失败
                                that.payInfo.orderPayState = res.data.orderPayState
                                let payState = (res.data.orderPayState == 1 ? window.sinopay.PAY_RESULT_STATUS.PAID : (res.data.orderPayState == 2 ? window.sinopay.PAY_RESULT_STATUS.PAYING : window.sinopay.PAY_RESULT_STATUS.FAILED))
                                if(payState == window.sinopay.PAY_RESULT_STATUS.FAILED){ // 支付失败
                                    that.$emit('failInfo', res.data.payFailReason || '')
                                }
                                return payState
                            }
                        }
                    },
                    bslConfig,
                    networkCheck: false,
                    async token(){
                        return (await getCacheUserInfo()).access_token;
                    },
                    commonParams: {userId: userParams.userId, channelId: userParams.channelId, companyId: userParams.companyId},
                    responseAdapter: {
                        dataKey: 'data',
                        codeKey: 'state',
                        messageKey: 'msg',
                        isSuccess(response){
                            return response.state == 200;
                        }
                    },
                    primaryColor: '#E82B29',
                    zIndex: 900
                }
            })
            this.$emit('load', this.sinoPayInstance)
        },
        setDefaultPayType(){
            try {
                if (isEmpty(this.payMethod)){
                    return;
                }
                let defaultPayType = this.$getStorageSync('defaultPayType')
                if (isEmpty(defaultPayType)){
                    defaultPayType = this.payMethod[0]
                } else {
                    defaultPayType = this.payMethod.find(type => type.payType == defaultPayType);
                }
                this.selData = defaultPayType || {};
            } catch (e){
                console.error('设置默认支付方式失败:'+e)
            }
        },
        /**
             * 设置支付参数
             */
        setPayData(){
            this.sinoPayInstance.initData({
                orderNo: this.payInfo.paySn,
                amount: this.payInfo.needPay,
                goodsDesc: '支付单号: ' + this.payInfo.paySn,
                tradeType: 4
            });
            return this.sinoPayInstance;
        },
        /**
             * 选择支付方式
             * @param {Object} method
             */
        async selectPayMethod(){
            let that = this;
            if (!this.availablePay){
                return;
            }
            if (this.payInfo.orderPayState == 1){
                uni.showToast({
                    title: '订单已支付，请勿重复支付',
                    icon: 'none'
                })
                return;
            }
            this.$setStorageSync('defaultPayType', this.selData.payType)
            this.setPayData().use(this.selData.payType);
            this.sinoPayInstance.on('onOperationEnd', ()=>{
                that.$emit('openResultPanel');
            })
                .on('onListenlingState', state=>{
                    that.operationStage = state;
                })
                .on('onBeforeH5Pay', leavePage=>{
                //如果H5支付离开了当前页面，则保存一个flag用户后面可自动打开支付状态页面
                    if (leavePage){
                        that.$setSession(this.h5PayCacheKey, '1');
                    }
                }).on('onH5PayOperaEnd', ()=>{
                    let frame = document.getElementById('h5PayFrame')
                    if (frame){
                        frame.style.top = window.statusHeight + 'px';
                    }
                });
        },
        /**
             * 是否是H5支付导致的页面重载（主要指微信H5支付）
             */
        isH5PayBack(){
            let result = this.$getSession(this.h5PayCacheKey) == '1';
            if (result){
                this.$removeSession(this.h5PayCacheKey)
            }
            return result;
        },
        /**
             * 从微信H5支付回来，继续监听支付状态
             */
        continueH5Pay(){
            let that = this;
            this.setPayData().getPayResult();//继续获取支付结果
            this.$emit('openResultPanel');
            this.sinoPayInstance.on('onListenlingState', state=>{
                that.operationStage = state.toString();//用Number类型时，值为0导致result页面无法渲染，不报错也未找到原因。 暂且用String
            })
        },
           
        //获取支付信息
        getPayInfo(){
            this.payInfo.paySn = this.paySn;
            this.payInfo.orderType = this.$Route.query.orderType
            this.payInfo.orderSourceInfo = {orderSource:this.$Route.query.orderSource, expiredToReceive:this.$Route.query.expiredToReceive}
            // 将支付信息给父页面，鹅毛情分享需要用到
            this.$emit('getPayInfo', this.payInfo);
        }
    }
}
</script>

<style lang="scss" scoped>
    .container {
        display: flex;
        flex-direction: column;
        flex: 1;

        .order_info {
            // border-top: 20rpx solid #F5F5F5;
            width: 750rpx;
            height: 224rpx;
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            .order_amount{
                .unit{
                    font-size: 36rpx;
                    font-weight: bold;
                    color: var(--confirmBtnBgColor2);
                }
                .price_int,.price_decimal{
                    font-size: 64rpx;
                    font-weight: bold;
                    color: var(--confirmBtnBgColor2);
                }
            }
        }

        .pay_part {
            width: 100%;
            border-top: 20rpx solid #F5F5F5;
            max-height: calc(100vh - 224rpx - 128rpx - 20rpx - 20rpx - var(--titleBarFillHeight, 0px));
            overflow-y: scroll;
            .pay_part_con{
                width: 100%;
                background: #fff;
                flex: 1;
            }
            .title {
                color: $main-font-color;
                font-size: 32rpx;
                margin: 30rpx 20rpx;
            }

            .item {
                width: 100%;
                padding: 20rpx;
                position: relative;

                .left {
                    .pay_icon {
                        width: 80rpx;
                        height: 80rpx;
                    }

                    .tit {
                        color: $main-font-color;
                        font-size: 28rpx;
                        margin-left: 20rpx;
                    }

                }

                .right {
                    .balance_available {
                        font-size: 28rpx;
                        color: #999;
                        margin-right: 20rpx;
                    }

                    .active {
                        color: var(--tagColor);
                    }

                    .iconfont {
                        color: $main-third-color;
                        font-size: 32rpx;
                    }

                    .has_sel {
                        color: var(--tagColor);
                    }

                    &.b_b:after {
                        left: 20rpx;
                    }
                }

            }

            .no_payMth {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                padding-top: 30%;

                .img {
                    width: 256rpx;
                    height: 256rpx;
                    background: var(--emptyImg);
                    background-size: 100% 100%;
                }

                text {
                    font-size: 28rpx;
                    color: $main-third-color;
                }
            }

        }
        .clickPayBox{
            width: 750rpx;
            display: flex;
            justify-content: center;
            position: fixed;
            bottom: 40rpx;
            .clickPay{
                width: 690rpx;
                height: 88rpx;
                background: var(--confirmBtnBgColor2);
                color: var(--confirmBtnTextColor);
                font-size: 32rpx;
                text-align: center;
                line-height: 88rpx;
                border-radius: 44rpx;
                box-shadow: 0px -4px 56px 0px rgba(161,161,161,0.10); 
                &.disabled{
                    opacity: 0.4;
                    cursor: not-allowed;
                }
            }
        }
    }
</style>
