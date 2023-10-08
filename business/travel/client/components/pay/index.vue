<template>
    <div class='travel-pay'>
        <div v-transfer-dom>
            <popup v-model="showPayType" class="payType" height="100%">
                <div class="pay-list">
                    <div class="order_info flex_column_start_start">
                        <div class="order_amount">
                            <span class="unit">￥</span>
                            <span class="price_amount">
                                {{ getPriceByUnit }}
                            </span><!--{{payInfo.needPay}}-->
                        </div>
                    </div>
                    <div class="content">
                        <div v-for="(item,index) in payMethod" :key='item.id'  @click="selData=item" :class="{item:true, b_b:index<payMethod.length-1}">
                            <div class="left">
                                <img class="pay_icon" :src="item.icon" />
                                <span class="tit">{{item.alias}}</span>
                                
                            </div>
                            <div class="right">
                                <span :class="{iconfont:true, icon_checked_radio:selData.payType == item.payType,icon_check_radio:selData.payType != item.payType,has_sel:selData.payType == item.payType}"></span>
                            </div>
                            <div class="coupon-label" v-if="supportCashCoupon(item.code)" @click.stop="openCouponList(item)">
                                <div class="amount">
                                    {{cashCoupon!=null?`优惠券减${cashCoupon.amount}`:`请选择代金券`}}
                                </div>
                                <div class="red_block"></div>
                            </div>
                        </div>
                    </div>

                    <div class="clickPay" :class='{"disabled": !availablePay}' @click="selectPayMethod(selData)">支付</div>
                    
                </div>
            </popup>
        </div>   

        <div v-transfer-dom>
            <popup v-if='showPayResult' v-model="showPayResult" height="100%" width="100%" position="right" class="pay-result-container">
                <div class='content' v-if='operationStage != OPERATION_STAGE.SUCCESS'>
                    <div class='top'>
                        <div class='icon' :class="resultText.class">
                            <img :src='resultText.img'/>
                        </div>
                        <div class="label">{{resultText.body}}</div>
                        <div v-if="!!resultText.tip" class='info'>{{resultText.tip}}</div>
                    </div>
                    <template v-if="resultText.showBtn">
                        <div class="btn cursorp" v-if='operationStage == OPERATION_STAGE.FAILED' @click='rePay'>重新支付</div>
                        <div class="btn cursorp" v-else @click='closePay'>查看订单</div>
                    </template>
                </div>
                <slot v-else name='result' :closePay="closePay">
                    <div class='content'>
                        <div class='top'>
                            <div class='icon' :class="resultText.class">
                                <img :src='resultText.img'/>
                            </div>
                            <div class="label">{{resultText.body}}</div>
                            <div v-if="!!resultText.tip" class='info'>{{resultText.tip}}</div>
                        </div>
                        <template v-if="resultText.showBtn">
                            <div class="btn cursorp" v-if='operationStage == OPERATION_STAGE.FAILED' @click='rePay'>重新支付</div>
                            <div class="btn cursorp" v-else @click='closePay'>查看订单</div>
                        </template>
                    </div>
                </slot>
            </popup>
        </div>     

        <div v-transfer-dom>
            <div class='coupon-popup-mask' :class="{'show': showCouponList}" @click='showCouponList=false'></div>
            <div class="coupon-list-container pcDialog" :class="{'show': showCouponList}">
                <div class='header'>
                    选择代金券
                    <div class='back' @click='showCouponList=false;showPayType=true'></div>
                    <div class='close' @click='showCouponList=false;'></div>
                </div>
                <div class="content">
                    <template v-for="(coupon,index) in cashCouponList">
                        <div :key='index' class="coupon-item cursorp" @click='selectCoupon(coupon,index)'>
                            <couponItem class='coupon-comp' :couponItem='coupon'/>
                            <div class='radio' :class="{disabled: !coupon.enable, 'selected': selectedCouponId == index}"></div>
                        </div>
                    </template>
                </div>
                <div class="footer" @click="confirmCoupon(coupon)">
                    <SnButton  type="primary" @click.native="confirmCoupon(coupon)">确定</SnButton>
                </div>
            </div>
        </div> 
    </div>
</template>

<script>
import {
    TransferDom,
    Popup
} from 'vux';
const SnButton = ()=>import('components/button');
import requestHandler from './requestHandler'
import couponItem from '@/components/cashcoupon/useItem'
var extendUtils = SnTravel.functional;
var handler = new extendUtils.baseRequestHandler();
export default {
    name: 'travel-pay',
    directives: {
        TransferDom
    },
    components: {
        Popup,
        couponItem,
        SnButton
    },
    props: {
        limitTime: {
            type: Number
        },
        tradeType: {
            type: String
        },
        orderNo: {
            type: String
        },
        orderNoList: {
            type: Array
        },
        amount: {
            type: [Number , String],
            require: true
        },
        goodsDesc: {
            type: String
        }
    },
    data(){
        let that = this;
        let title = document.title;
        return Object.assign(
            extendUtils.stateManager.setData([
                //支付方式弹窗
                {
                    name: 'showPayType',
                    parent: '$refs.payComp'
                },
                {
                    name: 'showPayResult',
                    parent: '$refs.payComp',
                    show: {
                        callback(){
                            title = document.title
                            document.title = '支付中'
                        }
                    },
                    hide: {
                        title: title,
                        callback(){
                            document.title = title;
                            //如果是iframe模式的H5支付，需要先关闭iframe
                            if (that.isH5Pay){
                                that.isH5Pay = false;
                                that.payInstance.stopPay()
                                that.closeH5Pay();
                            }
                            that.payInstance.stopTracking();
                            !that.closed && that.closePay();//如果不是被动关闭支付，则自动关闭支付
                        }
                    }
                }
            ]),
            {
                payMethod: [],//支付列表
                payInstance: null,//支付对象
                operationStage: null,//支付状态
                h5PayBack: false,
                isH5Pay: false,
                loadingTimer: null,
                resultText: {
                    body: '付款确认中，请稍候', 
                    tip: '',
                    img: require('./img/loading_gray.png'),
                    class: 'loading-icon',
                    icon: null
                },
                OPERATION_STAGE: {},//支付操作状态，由sinopay提供
                loadResolve: null,
                closed: false,//表示支付已关闭；在重新use支付方式时，需要将其打开
                cashCouponList: [],//支付代金券列表
                cashCoupon: null,//当期选中的代金券
                supportCashCouponPayType: [],//支持代金券的支付方式
                showCouponList: false,
                selData: null,//当期选中的支付方式
                selectedCouponId: null, // 选中代金券的索引
                failInfo: '' //支付失败的原因
            }
        )
    },
    beforeRouteLeave(to, from, next) {
        this.destroy();
        next();
    },
    beforeDestroy(){
        this.destroy();
    },
    created(){
        this.h5PayBack = this.isH5PayBack();
        this.getCashCouponList();
        this.installPay().then(()=>{
            //微信h5支付回来
            if (this.h5PayBack){
                this.continueH5Pay();
            }
        }).catch(e=>{
            console.error(e)
        });
    },
    computed: {
        //微信H5支付的缓存key
        h5PayCacheKey(){
            return `${handler.primaryKey}_h5Pay_`;
        },
        supportCashCoupon(){
            return (code) => {
                return this.supportCashCouponPayType.indexOf(code) > -1 && this.cashCouponList.length > 0
            }
        },
        getPriceByUnit(){
            return this.amount.toFixed(2).toString()
        },
        availablePay(){
            return !!this.selData && Object.keys(this.selData).length!=0;
        }
    },
    watch: {
        operationStage(_new){
            this.changeState(_new)
        },
        limitTime(_new){
            this.payInstance && this.payInstance.updateLimitTime(_new * 1000);
        }
    },
    methods: {
        async dynamicLoadPay(onload){
            let type = 'pay';
            const src = extendUtils.HTTP_CONT.ORIGIN + extendUtils.APP_URL_MAP.swplib.path + extendUtils.APP_URL_MAP.swplib.child[type].prefix + 
                            (extendUtils.APP_URL_MAP.swplib.child[type].version || '') + extendUtils.APP_URL_MAP.swplib.child[type].entry;
            extendUtils.loadScript({
                id: 'travelPay',
                src: src,
                onload: onload
            })
        },
        /**
             * 获取支付列表
             */
        async getPayTypeList(){
            await this.loadResolve;//等待加载完成
            this.payMethod = await this.payInstance.getPayMethod();
            this.selData = this.payMethod[0];
            this.showPayType = true;
        },
        installPay(){
            let that = this;
            let installed = null;
            this.loadResolve = new Promise(resolve => installed = resolve)
            return new Promise(resolve=>{
                this.dynamicLoadPay(async ()=>{
                    try {
                        this.loadResolve = installed();
                        this.loadResolve = null;
                        this.OPERATION_STAGE = sinopay.OPERATION_STAGE;
                        let bsl = Object.assign(extendUtils.BSL_CONF, await extendUtils.getBslConfig());
                        this.payInstance = await sinopay.install({
                            config: {
                                validPayType: !extendUtils.MINIPROGRAM_CONFIG.IN_MINIPROGRAM, //目前只有微信小程序环境才不拉支付列表 此时传false,非小程序环境传true
                                weixinMiniParam: {url: that.getMiniPagePay()},
                                origin: location.origin + '/',
                                api: {
                                    payTypeList: {
                                        path: '/travel/channel/v1/getPaymentMethods',
                                        method: 'get'
                                    },
                                    createPay: {
                                        path: '/travel/payment/v1/makePayment'
                                    },
                                    getPaymentInfo: {
                                        path: '/travel/payment/v1/getPaymentInfo',
                                        method: 'get',
                                        responseResolver(res){
                                            // 轮询支付状态，如果是支付失败了，并且有支付原因，此时显示支付失败的原因
                                            if(!!res && !!res.result && !!res.result.payState && res.result.payState.toUpperCase() == that.OPERATION_STAGE.FAILED.toUpperCase() && !!res.result.payFailReason){
                                                that.failInfo = res.result.payFailReason || ''
                                            }
                                            return res.result.payState
                                        }
                                    },
                                    payNotify: {
                                        path: '/travel/payment/v1/getPayState',
                                        method: 'get'
                                    }
                                },
                                networkCheck: false,
                                token(){
                                    return handler.getUserToken();
                                },
                                commonParams: {
                                    userId: handler.userId,
                                    companyId: handler.companyId,
                                    channelId: handler.channelId,
                                },
                                redirectUri: `${location.origin}/travel/static/pay/h5TransitPage.html#/`,
                                bslConfig: bsl,
                                cutdown: false
                            }
                        })
                        this.supportCashCouponPayType = [sinopay.PAY_TYPE.QUICK_PAY.code, sinopay.PAY_TYPE.INBANK_PAY.code]
                        resolve(this.payInstance);
                    } catch (e){
                        console.error(e);
                        resolve();
                    }
                })
            })
                
        },
        /**
             * 设置支付参数
             */
        setPayData(){
            let that = this;
            let payData = {} //额外的创建预付单支付参数
            let inMiniprogram = extendUtils.MINIPROGRAM_CONFIG.IN_MINIPROGRAM; // 判断运行环境
            if(inMiniprogram){ // 微信小程序环境
                let {appId, openId} = extendUtils.getBpParam()
                payData = {
                    jsAppid: appId,
                    openId: openId,
                }
            }
            this.payInstance.initData({
                orderNoList: this.orderNoList,
                amount: this.amount,
                goodsDesc: this.goodsDesc,
                tradeType: this.tradeType,
                getBusinessParams(){
                    if(extendUtils.isEmpty(that.cashCoupon) || !that.supportCashCoupon(that.selData.code)){
                        return {
                            ...payData
                        }
                    }
                    return {
                        cashcouponCode: that.cashCoupon.cashcouponCode,
                        cashcouponAmount: that.cashCoupon.amount,
                        ...payData
                    }
                }
            });
            return this.payInstance;
        },
        /**
             * 选择支付方式
             */
        selectPayMethod(method){
            let that = this;
            this.closed = false;
            this.isH5Pay = false;//初始化状态
            this.showPayType = false;//关闭支付列表
            this.selData = method;
            this.setPayData().use(method.payType);
            this.payInstance.on('onOperationEnd', ()=>{
                //1. 先打开结果面板
                that.showPayResult = true;
                //2. 再打开frame
                //说明：打开的弹窗需要用popStateManager管理，因此需要按顺序打开，否则关闭顺序会不正确
                this.payInstance.isOnH5Pay() && this.$emit('openFrame')
            })
            .on('onListenlingState', state=>{
                that.operationStage = state.toString();//用Number类型时，值为0导致result页面无法渲染，不报错也未找到原因。 暂且用String
            })
            .on('onBeforeH5Pay', leavePage=>{
                //如果H5支付离开了当前页面，则保存一个flag用户后面可自动打开支付状态页面
                if (leavePage){
                    //H5支付可能会重定向离开当前页面，需要加一个flag记住这个状态
                    extendUtils.setSession(this.h5PayCacheKey, '1');
                    extendUtils.setSession('redirectUri', location.href);
                    this.isH5Pay = true;
                }
            })
            .on('onH5PayOperaEnd', ()=>{
                let frame = document.getElementById('h5PayFrame')
                if (frame){
                    const navigatorData = SnUtils.getAppVersion();
                    let titleBarHeight = parseInt((navigatorData.titleBarHeight || 75) / window.devicePixelRatio);
                    frame.style.top = -titleBarHeight + 'px';
                    frame.style.height = frame.offsetHeight + titleBarHeight + 'px'
                }
            })
            .on('onConfirmUnknown', ()=>{
                that.$emit('closePayType')
            });
        },
        isH5PayBack(){
            let result = extendUtils.getSession(this.h5PayCacheKey) == '1';
            if (result){
                extendUtils.removeSession(this.h5PayCacheKey)
            }
            return result;
        },
        /**
             * 从微信H5支付回来，继续监听支付状态
             */
        continueH5Pay(){
            let that = this;
            this.setPayData().getPayResult();//继续获取支付结果
            that.showPayResult = true;
            this.payInstance.on('onListenlingState', state=>{
                that.operationStage = state.toString();//用Number类型时，值为0导致result页面无法渲染，不报错也未找到原因。 暂且用String
            })
        },
        stopTimeout(){
            clearTimeout(this.loadingTimer);
            this.loadingTimer = null;
        },
        /**
             * 监听支付状态变化
             */
        changeState(value){
            let that = this;
            switch (value){
            case this.OPERATION_STAGE.FAILED:
                this.stopTimeout();
                if (this.showPayResult){
                    document.title = '结果'
                }
                this.resultText = {body: '支付失败', img: require('./img/icon_common_failure.png'), class: 'failed', showBtn: true, tip: that.failInfo};
                this.$emit('payComplete', -1);
                this.closeH5Pay();
                break;
            case this.OPERATION_STAGE.SUCCESS:      
                this.stopTimeout();
                if (this.showPayResult){
                    document.title = '结果' 
                }
                this.resultText = {body: '支付成功', img: require('./img/icon_common_success.png'), class: 'success', showBtn: true};  
                this.$emit('payComplete', 0);
                this.closeH5Pay();
                break;
            case this.OPERATION_STAGE.PAYING:
            case this.OPERATION_STAGE.WAITING:
                //每次变化时都重置定时器
                this.stopTimeout();
                this.loadingTimer = setTimeout(() => {
                    //双重保障，支付终结态了一定不能再更改状态
                    if (this.operationStage == this.OPERATION_STAGE.SUCCESS || this.operationStage == this.OPERATION_STAGE.FAILED){
                        return;
                    }
                    that.resultText = {
                        body: '正在查询您的付款结果，请稍候', 
                        tip: '如确认付款成功，请5分钟后刷新订单详情',
                        img: require('./img/loading_gray.png'),
                        class: 'loading-icon',
                        showBtn: true
                    }
                }, 10*1000);
                this.resultText = {
                    body: '付款确认中，请稍候', 
                    img: require('./img/loading_gray.png'),
                    class: 'loading-icon'
                }
                break;
            default: 
                break;
            }
        },
        /**
             * 重新支付
             */
        rePay(){
            this.showPayResult = false;
        },
        /**
             * 销毁支付组件
             */
        destroy(){
            extendUtils.removeSession(this.h5PayCacheKey);//防止意外退出，清理缓存
            sinopay && sinopay.destroy();
        },
        /**
             * 跳转订单详情
             * 这里可能写的比如绕，在这里说明一下：
             * 1. 外界不提供slot内容时，使用payResult的后备内容，后备内容中有“查看订单详情”按钮，点击后触发本函数
             * 2. 外界提供了slot内容，slot中的内容如果需要跳转到其他页面（比如“订单详情”），需使用slot-scope中的closePay函数，该函数再触发父页面的事件。 
             * 以保证可以在本组件内将成功页面关掉，或先执行本组件内的其他逻辑，再执行父组件的业务逻辑
             */
        closePay(closeResult=true){
            this.closed = true;
            if (closeResult){
                this.showPayResult = false;
            }
            this.$emit('closePay')
        },
        closeH5Pay(){
            extendUtils.removeSession(this.h5PayCacheKey)
            return this.payInstance.closeH5Pay();
        },

        /**
         * 获取代金券
         */
        async getCashCouponList(){
            const response = await requestHandler.getCashCouponList()
            if(response.resultCode!=0 || extendUtils.isEmpty(response.result.cashcoupons)){
                return;
            }
            let cashCouponList = response.result.cashcoupons
            this.cashCouponList = cashCouponList.sort((a, b) => b.amount - a.amount).map(cashCoupon => {
                cashCoupon.enable = cashCoupon.amount < this.amount
                return cashCoupon
            })
            if(extendUtils.isNotEmpty(this.cashCouponList)){
                this.cashCouponList.some((coupon, index) => {
                    if(coupon.enable){
                        this.cashCoupon = coupon
                        this.selectedCouponId = index
                        return true
                    }
                    return false;
                })
            }
        },
        openCouponList(method){
            this.showCouponList = true;
            this.showPayType = false;
            this.selData = method
        },
        selectCoupon(coupon,index){
            if(!coupon.enable){
                return
            }
            if(this.selectedCouponId !== index){
                this.cashCoupon = coupon
                this.selectedCouponId = index
            } else {
                this.cashCoupon = null
                this.selectedCouponId = null
            }
        },
        confirmCoupon(){
            this.selectPayMethod(this.selData);
            this.showCouponList=false;
            this.showPayType=false
        },
        wxMiniPay(type){
            this.setPayData().use(type);
            this.payInstance.on('onOperationEnd', ()=>{
                //微信小程序支付需要监听缓存中的支付状态
                this.onPayState();
            })
        },
        /**
         * 获取小程序支付页面
         */
        getMiniPagePay(){
            try {
                let redirectUrl = encodeURIComponent(this.getRedirectUrl()) //小程序的支付结果页面
                let miniPayPage = `${extendUtils.MINIPROGRAM_CONFIG.MINIPROGRAM_PAYPAGE}?redirectUrl=${redirectUrl}`;
                return miniPayPage;
            } catch (error) {
                console.log('获取小程序支付页面失败', error);
                return ''
            }
        },
        /***
         * 获取小程序完结后的重定向的支付结果页面
         */
        getRedirectUrl(){
            let key = 'order/index.html';
            let preUrl = extendUtils.OPENPAGE_MAP[key]
            let path = '/miniprogram/pay/result'
            let bpParam = extendUtils.getSession(extendUtils.BP_PARAM_KEY) //bp-param 参数，为了防止小程序支付成功页面 新打开的webview页面，session缓存里面的bp-param参数丢失
            return `${extendUtils.HTTP_CONT.ORIGIN}${preUrl}${key}#${path}?bp-param=${bpParam}`
        },
        /***
         * 轮询监听缓存里面的支付状态
         */
        onPayState(){
            let that = this;
            let timer = setInterval(() => {
                console.log('轮询localstorage缓存中微信小程序的的支付状态');
                let payState = SnUtils.getStorage(extendUtils.MINIPROGRAM_CONFIG.MINIPROGRAM_PAYSTATE_CACHEKEY);
                if (!!payState){
                    SnUtils.removeStorage(extendUtils.MINIPROGRAM_CONFIG.MINIPROGRAM_PAYSTATE_CACHEKEY);
                    clearInterval(timer)
                    if (payState == extendUtils.MINIPROGRAM_CONFIG.MINIPROGRAM_PAYSTATE.SUCCESS){ //支付成功
                        that.$emit('miniPayDone', payState)
                    } else if (payState == extendUtils.MINIPROGRAM_CONFIG.MINIPROGRAM_PAYSTATE.CANCLE){ //支付取消
                        that.$emit('miniPayDone', payState)
                    } else if (payState == extendUtils.MINIPROGRAM_CONFIG.MINIPROGRAM_PAYSTATE.FAIL){ //支付失败
                        that.$emit('miniPayDone', payState)
                    }
                }
            }, 1000)
        }
    }
}
</script>

<style lang="less" scoped>
@import '~styles/core/common.less';
@import '~styles/mixins/hairLine.less';
@import './css/icon.css';

.payType{
    background-color: #F6F9FD !important;
    padding: 0.3rem;
    z-index: 955;

    .pay-list {
        position: relative;
        height: 100%;

        .order_info {
            width: 100%;
            height: 2.24rem;
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 0.2rem;
            .order_amount{
                .unit{
                    font-size: 0.36rem;
                    font-weight: bold;
                    color: #FF4E3A;
                }
                .price_amount{
                    font-size: 0.64rem;
                    font-weight: bold;
                    color: #FF4E3A;
                }
            }
        }

        .content {
            width: 100%;
            padding: 0;
            background: #ffffff;
            border-radius: .1rem;

            .title {
                color: #333;
                font-size: 0.32rem;
                padding-left: 0.2rem;
            }

            .item {
                height: 1.1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.34rem 0.3rem;
                border-bottom: 0.02rem solid rgba(0, 0, 0, 0.1);
                position: relative;

                .left {
                    display: flex;
                    align-items: center;
                    .pay_icon {
                        width: 0.4rem;
                        height: 0.4rem;
                    }

                    .tit {
                        color: #222;
                        font-size: 0.28rem;
                        margin-left: 0.3rem;
                        font-weight: 400;
                    }

                }

                .right {
                    .balance_available {
                        font-size: 0.28rem;
                        color: #999;
                        margin-right: 0.2rem;
                    }

                    .iconfont {
                        color: #999;
                        font-size: 0.32rem;
                    }

                    .has_sel {
                        color: rgb(6, 199, 195);
                    }
                }

                .coupon-label {
                    height: 0.32rem;
                    position: absolute;
                    top:0.38rem;
                    left:2.3rem;
                    border-radius: 0.08rem;
                    background-color: #F30300;
                    overflow: hidden;
                    font-size: 0.22rem;
                    display: flex;
                    align-items: center;

                    .amount {
                        height: 0.28rem;
                        border-bottom-left-radius: 0.06rem;
                        border-top-left-radius: 0.06rem;
                        background-color: #fff;
                        padding:0 0.13rem;
                        margin-left: 0.02rem;
                        color: #F30300;

                    }

                    .red_block {
                        width: 0.28rem;
                        height: 0.28rem;
                        background: url('./img/icon_common_rightarrow_red.svg') center no-repeat;
                        background-size: 50% 50%;
                        transform: rotate(90deg);
                    }
                }

        }

        .paybg {
            padding-left: 1.2rem;
            background-position: .3rem center;
            background-repeat: no-repeat;
            background-size: 0.56rem 0.56rem;
            &:active {
                background-color: #ecf3fd;
                border-radius: .1rem;
            }
        }

        }

        .clickPay{
            position: absolute;
            bottom: 0.4rem;
            left:50%;
            transform: translateX(-50%);
            width: 6.6rem;
            height: 0.88rem;
            background: #262DD9;
            color: #fff;
            font-size: 0.32rem;
            text-align: center;
            line-height: 0.88rem;
            border-radius: 0.1rem;
            box-shadow: 0px 0.8rem 1.12rem 0px rgba(161,161,161,0.10); 
            &.disabled{
                opacity: 0.4;
                cursor: not-allowed;
            }
        }
        
    }
    .lineBorderB:last-of-type:after{
        display: none;
    }

    .footer {
        width: auto;
        font-size: .32rem;
        line-height: .9rem;
        margin-top: .3rem;
        border-radius: .1rem;
        background: #ffffff;
        text-align: center;

        &:active {
            background-color: #ecf3fd;
            border-radius: .1rem;
        }
    }
}
.coupon-popup-mask{
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    opacity: 0;
    tap-highlight-color: transparent;
    z-index: -1;
    transition: opacity .4s;
    cursor: pointer;
    &.show{
        opacity: 100;
        z-index: 99;
    }
}
.coupon-list-container{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0;
    background: #EFF2F5;
    z-index: 501;
    transition-property: height;
    transition-duration: .3s;
    max-height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-radius: .2rem .2rem 0 0 ;
    overflow: hidden;
    &.show{
        height: 70%;
    }
    .header{
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: .88rem;
        line-height: .88rem;
        text-align: center;
        font-weight: bold;
        font-size: .32rem;
        border-radius: .2rem .2rem 0 0 ;
        .close{
            position: absolute;
            right: .3rem;
            top: 50%;
            transform: translateY(-50%);
            width: .4rem;
            height: .4rem;
            background: url('./img/close.svg') center no-repeat;
            background-size: contain;
            cursor: pointer;
        }
        .back{
            position: absolute;
            left: .3rem;
            top: 50%;
            transform: translateY(-50%) rotate(180deg);
            width: .32rem;
            height: .32rem;
            background: url('./img/icon_common_rightarrow.svg') center no-repeat;
            background-size: contain;
            cursor: pointer;
        }
    }
    .content{
        width: 100%;
        height: calc(100% - 0.88rem - .2rem - .9rem - .2rem);
        overflow-y: auto;
        &::-webkit-scrollbar{
            display: none;
        }
        .coupon-item{
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: .2rem;
            &:first-of-type{
                margin-top: .2rem;
            }
            &:last-of-type{
                margin-bottom: .2rem;
            }
            .coupon-comp{
                flex: auto;
                margin: 0 .2rem;
                /deep/ .coupon_pre_cen{
                    padding-right: .8rem;
                }
            }
            .radio{
                position: absolute;
                right: .32rem;
                top: 1.18rem;
                flex: none;
                width: .42rem;
                height: .42rem;
                margin: 0 .2rem;
                background: url('./img/btn_common_radio_nor.svg') center no-repeat;
                background-size: contain;

                &.selected{
                    background: url('./img/btn_common_radio_sel2.svg') center no-repeat;
                    background-size: contain;
                }

                &.disabled{
                    background: url('./img/btn_common_radio_dis1.svg') center no-repeat;
                    background-size: contain;
                }
            }
        }
    }
    .footer {
        width: 100%;
        font-size: .32rem;
        line-height: .9rem;
        border-radius: .1rem;
        padding: .2rem .3rem;
        background: #ffffff;
        text-align: center;

        &:active {
            background-color: #ecf3fd;
            border-radius: .1rem;
        }
    }
}
.pay-result-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 999;
    .content{
        height: 100%;
        display: flex;
        flex-direction: column;
        text-align: center;

        .top{
            padding-top: 1.28rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .icon{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1.2rem;
            height: 1.2rem;

            img{
                width: 100%;
                height: 100%;
            }

            &.success{
                color: #23cda7;
            }

            &.failed{
                color: #ff4e3a;
            }

            &.loading-icon{
                border-radius: .6rem;
                background-color: #F6F9FD;
                img{
                    animation: cricelLoading 1s steps(12, end) infinite;
                    width: .64rem;
                    height: .64rem;
                }
            }
        }
        .label{
            color: #222;
            font-size: .32rem;
            font-weight: bold;
            margin-top: .56rem;
        }
        .info{
            font-size: .28rem;
            margin-top: .08rem;
        }

        .btn{
            position: absolute;
            left: .3rem;
            right: .3rem;
            top: 50%;
            transform: translateY(-50%);
            background: @theme-color;
            height: .88rem;
            line-height: .88rem;
            font-size: .3rem;
            text-align: center;
            color: #fff;
            border-radius: .2rem;
        }
    }

    @-webkit-keyframes cricelLoading {
        0% {
            transform: rotate3d(0,0,1,0deg);
        }
        100% {
            transform: rotate3d(0,0,1,360deg);
        }
        }
        @keyframes cricelLoading {
        0% {
            transform: rotate3d(0,0,1,0deg);
        }
        100% {
            transform: rotate3d(0,0,1,360deg);
        }
    }
}
</style>

<style lang="less">
.unPaid-tips {
    .weui-dialog {
        border-radius: .3rem;
        z-index: 902;
    }
}
.concatCust{
  text-decoration: underline;
  font-weight: bold;
  color: #262DD9;
}

</style>