<template>
    <div class='mall-pay'>
        <div class="pay-type-list-container">
            <section class='num-font'>
                <span class='rmb'>&yen;</span>{{amount | amountFormat}}
            </section>
            <ul>
                <li :class='type.className' v-for="type in payMethod" :key='type.payType' @click='currPayType=type'>
                    <div>
                        <img :src='type.icon'/>{{type.alias}}
                    </div>
                    <Icon size='.4' :type="currPayType.payType==type.payType ? 'icon_mall_checkbox_sel' : 'icon_mall_checkbox_nor'"/>
                </li>
            </ul>
            <div class='btn-group'>
                <div class='btn normal-btn' :class='{"disabled": !availablePay}' @click='selectPayMethod'>支付</div>
            </div>
        </div>

        <div v-transfer-dom class='exit-confirm'>
            <Confirm v-model='exitConfirm' confirm-text="确认离开" cancel-text="继续支付" @on-confirm="leavePage" mask-z-index="901">
                <div class='title'>确认离开支付页面？</div>
                <div class='content' v-if='!!limitTime'>您的订单在{{limitTime | limitTimeFormat}}内未支付将被取消，请尽快完成支付</div>
            </Confirm>
        </div>

        <div v-transfer-dom class='overtime-confirm'>
            <Confirm v-model='overtimeConfirm' :show-cancel-button='false' @on-confirm="closePay" mask-z-index="901">
                订单已取消
            </Confirm>
        </div>

        <div v-transfer-dom>
            <popup v-if='showPayResult' v-model="showPayResult" height="100%" width="100%" position="right" id='payResultContainer' class="pay-result-container">
                <div class='content'>
                    <div class='top'>
                        <div class='icon' :class="resultText.class">
                            <img :src='resultText.img'/>
                        </div>
                        <div class="label">{{resultText.body}}</div>
                        <div class='info'>{{resultText.tip}}</div>
                    </div>
                    <template v-if="resultText.showBtn">
                        <div class="btn cursorp" v-if='operationStage == OPERATION_STAGE.FAILED' @click='rePay'>重新支付</div>
                        <div class="btn cursorp" v-else @click='closePay'>查看订单</div>
                    </template>
                </div>
            </popup>
        </div>     
    </div>
</template>

<script>
    import {
        TransferDom,
        Popup,
        Confirm
    } from 'vux';
    import Icon from 'common/components/base/Icon';
    import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
    import extendUtils from 'common/lib/utils';
    import config from 'common/lib/config'; 
    import baseHandler from 'common/lib/requestHandler/base.js';

    var handler = new baseHandler();
    const PRIMARY_COLOR = '#E82B29';

    export default {
        name: 'mall-pay',
        mixins: [tChatEventMixin],
        directives: {
            TransferDom
        },
        components: {
            Popup,
            Icon,
            Confirm
        },
        data(){
            let that = this;
            let title = document.title;
            return Object.assign(
                extendUtils.stateManager.setData([
                    {
                        name: 'showPayResult',
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
                                if(that.isH5Pay){
                                    that.isH5Pay = false;
                                    that.closeH5Pay();
                                }
                                that.payInstance.stopTracking();
                                !that.closed && that.closePay();//如果不是被动关闭支付，则自动关闭支付
                            }
                        }
                    }
                ], this),
                {
                    pageFrom: this.$route.query.pageFrom,
                    expiredTime: this.$route.query.expiredTime,
                    tradeType: this.$route.query.tradeType,
                    orderNo: this.$route.query.orderNo,
                    amount: this.$route.query.amount,
                    goodsDesc: this.$route.query.goodsDesc,
                    limitTime: null,
                    exitConfirm: false,
                    overtimeConfirm:false,
                    currPayType: {},
                    payMethod: [],//支付列表
                    payInstance: null,//支付对象
                    operationStage: null,//支付状态
                    h5PayBack: false,
                    isH5Pay: false,
                    loadingTimer: null,
                    resultText: {
                        body: '付款确认中，请稍候', 
                        tip: '',
                        img: require('themes/default/img/pay/loading_gray.png'),
                        class: 'loading-icon',
                        icon: null,
                    },
                    OPERATION_STAGE: {},//支付操作状态，由sinopay提供
                    loadResolve: null,
                    closed: false,//表示支付已关闭；在重新use支付方式时，需要将其打开
                }
            )
        },
        beforeRouteLeave(to, from, next) {
            this.destroy();
            next();
		},
        beforeDestroy(){
        },
        created(){
            this.limitTime = this.expiredTime - new Date().getTime();
            this.countdownStart();
            this.h5PayBack = this.isH5PayBack();
            this.installPay().then(()=>{
                //微信h5支付回来
                if(this.h5PayBack){
                    this.continueH5Pay();
                }
                this.getPayTypeList()
            }).catch(e=>{
                console.error(e)
            });
        },
        filters: {
            /**
             * 数字格式化
             */
            amountFormat(val){
                val = val.toString();
                let index = val.indexOf('.');
                let point = '00';
                if(index>-1){
                    point = val.substring(index+1, val.length);
                    if(point.length==1){
                        point += '0';
                    }else if(point.length==0){
                        point += '00';
                    }
                }
                return parseInt(val).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + point;
            },
            limitTimeFormat(value) {
                if (value && value >= 0) {
                    let days = parseInt(value / (1000 * 60 * 60 * 24));
                    let hours = parseInt((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    let minutes = parseInt((value % (1000 * 60 * 60)) / (1000 * 60));
                    let seconds = parseInt((value % (1000 * 60)) / 1000);
                    let text = '';
                    days && (text += `${days}天`);
                    hours && (text += `${hours}小时`);
                    minutes && (text += `${minutes}分`);
                    !days && (text += `${seconds}秒`);
                    return text || 0;
                }
                return '';
            },
        },
        computed: {
            //微信H5支付的缓存key
			h5PayCacheKey(){
				return `${handler.primaryKey}_h5Pay_`;
			},
            availablePay(){
                return !!this.currPayType && Object.keys(this.currPayType).length!=0;
            },
		},
        watch: {
            operationStage(_new){
                this.changeState(_new)
            },
            limitTime(_new){
                this.payInstance && this.payInstance.updateLimitTime(_new);
            }
        },
        methods: {
            async dynamicLoadPay(onload){
                let type = 'pay';
                const src = './thirdparty/pay/sinopay.js';
                extendUtils.loadScript({
                    id: 'mallPay',
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
            },
            installPay(){
                let installed = null;
                this.loadResolve = new Promise(resolve => installed = resolve)
                return new Promise(resolve=>{
                    this.dynamicLoadPay(async ()=>{
                        try{
                            this.loadResolve = installed();
                            this.loadResolve = null;
                            this.OPERATION_STAGE = sinopay.OPERATION_STAGE;
                            let bsl = Object.assign(config.BSL_CONF, await extendUtils.getBslConfig());
                            this.payInstance = await sinopay.install({
                                config: {
                                    origin: location.origin + '/',
                                    api: {
                                        payTypeList: {
                                            path: '/mall/channel/v1/getPaymentMethods',
                                            method: 'get'
                                        },
                                        createPay: {
                                            path: '/mall/payment/v1/makePayment'
                                        },
                                        getPaymentInfo: {
                                            path: '/mall/payment/v1/getPaymentInfo',
                                            method: 'get',
                                        },
                                    },
                                    networkCheck: false,
                                    token(){
                                        return handler.getUserToken();
                                    },
                                    commonParams: {
                                        userId: handler.userId,
                                        companyId: handler.companyId,
                                        channelId: handler.channelId
                                    },
                                    redirectUri: location.href,
                                    bslConfig: bsl,
                                    primaryColor: PRIMARY_COLOR,
                                    cutdown: false,
                                    appExtraData: {
                                        orderUrl: encodeURIComponent(location.origin + location.pathname + `#/order/snapshot/${this.orderNo}?userId=${handler.userId}&companyId=${handler.companyId}&channelId=${handler.channelId}`),
                                        expiredTime: this.expiredTime / 1000
                                    }
                                }
                            })
                            resolve(this.payInstance);
                        }catch(e){
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
				this.payInstance.initData({
					orderNoList: [this.orderNo],
					amount: this.amount,
					goodsDesc: this.goodsDesc,
					tradeType: this.tradeType,
				});
				return this.payInstance;
			},
			/**
			 * 选择支付方式
			 */
			selectPayMethod(){
				let that = this;
                this.closed = false;
                this.isH5Pay = false;//初始化状态
				this.setPayData().use(this.currPayType.payType);
				this.payInstance.on('onOperationEnd', payType=>{
					that.showPayResult = true;
				})
				.on('onListenlingState', state=>{
					that.operationStage = state.toString();//用Number类型时，值为0导致result页面无法渲染，不报错也未找到原因。 暂且用String
				})
				.on('onBeforeH5Pay', payType=>{
                    //微信支付会重定向离开当前页面，需要加一个flag记住这个状态
                    if(payType.code == 'WX_PAY'){
                        extendUtils.setSession(this.h5PayCacheKey, '1');
                    }
                    this.isH5Pay = true;
				})
                .on('onConfirmUnknown', ()=>{
                    that.closePay()
                });
			},
			isH5PayBack(){
				let result = extendUtils.getSession(this.h5PayCacheKey) == '1';
				if(result){
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
				switch(value){
				    case this.OPERATION_STAGE.FAILED:
                        this.stopTimeout();
                        if(this.showPayResult){
    				        document.title = '结果'
                        }
				        this.resultText = {body: '支付失败', img: require('themes/default/img/pay/icon_common_failure.png'), class: 'failed', showBtn: true,};
                        this.payComplete(-1);
				        break;
				    case this.OPERATION_STAGE.SUCCESS:      
                        this.stopTimeout();
                        if(this.showPayResult){
				            document.title = '结果' 
                        }
				        this.resultText = {body: '支付成功', img: require('themes/default/img/pay/icon_common_success.png'), class: 'success', showBtn: true,};  
                        this.payComplete(0);
				        break;
                    default: 
				        //每次变化时都重置定时器
				        this.stopTimeout();
				        this.loadingTimer = setTimeout(() => {
                            //双重保障，支付终结态了一定不能再更改状态
                            if(this.operationStage == this.OPERATION_STAGE.SUCCESS || this.operationStage == this.OPERATION_STAGE.FAILED){
                                return;
                            }
				            that.resultText = {
				                body: '正在查询您的付款结果，请稍候', 
				                tip: '如确认付款成功，请5分钟后刷新订单详情',
				                img: require('themes/default/img/pay/loading_gray.png'),
				                class: 'loading-icon',
				                showBtn: true,
				            }
				        }, 10*1000);
				        this.resultText = {
				            body: '付款确认中，请稍候', 
				            img: require('themes/default/img/pay/loading_gray.png'),
				            class: 'loading-icon'
				        }
				        break;
				}
			},
			/**
			 * 重新支付
			 */
			rePay(){
				that.showPayResult = false;
			},
            /**
             * 销毁支付组件
             */
            destroy(){
                extendUtils.removeSession(this.h5PayCacheKey);//防止意外退出，清理缓存
			    sinopay && sinopay.destroy();
            },
            /**
             * 支付状态完结
             */
            payComplete(state){
                this.payInstance.stopPay();//停止支付
                this.closeH5Pay();//关闭H5支付
            },
            /**
             * 关闭支付
             * 离开支付页面使用
             */
			closePay(closeResult=true){
                this.closed = true;
                if(closeResult){
                    this.showPayResult = false;
                }
                if(this.pageFrom.indexOf('/order/detail')==-1){
                    this.toOrderDetail();
                }else{
                    this.$router.back();
                }
			},
            /**
             * 关闭H5支付
             * 回退页面时使用
             */
            closeH5Pay(){
                this.payInstance.stopPay();
                return this.payInstance.closeH5Pay();
            },
            /**
             * 清空倒计时
             */
            countdownClear(){
                !!this.timeInterval && clearInterval(this.timeInterval);
            },
            /**
             * 待支付倒计时
             */
            countdownStart(){
                let that = this;
                if(!!that.limitTime && that.limitTime > 0){
                    that.countdownClear();
                    that.timeInterval = setInterval(function () {
                        if (!!that.limitTime) {
                            if (that.limitTime <= 1000) {
                                that.limitTime = null;
                                that.countdownClear();
                                that.overtimeConfirm = true;
                            } else {
                                that.limitTime = that.limitTime - 1000;//注意单位是毫秒ms
                            }
                        } else {
                            that.countdownClear();
                        }
                    }, 1000);
                }
            },
            toOrderDetail(){
                this.$router.replace({
                    path: '/order/detail/'+this.orderNo,
                    query: {
                        pageFrom: this.pageFrom
                    }
                })
            },
            goBackFun(){
                let that = this;
                this.exitConfirm = true;
                this.leavePage = ()=>{
                    if(that.pageFrom.indexOf('/order/confirm') > -1){
                        that.toOrderDetail();
                    }else{
                        that.$router.back();
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/hairLine.less'; 
.pay-type-list-container {
    background: #F6F9FD;
    height: 100%;
    z-index: 955;
    overflow-y: auto;

    section{
        height: 2.24rem;
        line-height: 2.24rem;
        text-align: center;
        background: #fff;
        font-size: .56rem;
        color: @danger-color-light;
        .rmb{
            font-size: .36rem;
            margin-right: .04rem;
        }
    }

    ul{
        margin-top: .2rem;
        margin-bottom: 3rem;
        li{
            .bbpx(1px, #e8e8e8, .9rem);
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 1.1rem;
            padding: 0 .3rem;
            background: #fff;

            .icon_mall_checkbox_sel{
                color: @theme-color;
            }

            img{
                height: .4rem;
                width: .4rem;
                margin-right: .2rem;
            }

            div{
                display: flex;
                align-items: center;
            }

            &.bosspay{
                margin-bottom: .2rem;
                &:after{
                    display: none;
                }
            }

            &:last-child{
                 &:after{
                    display: none;
                }
            }
        }
    }
    .btn-group{
        position: absolute;
        bottom: .6rem;
        left: .3rem;
        right: .3rem;

        .btn{
            height: .88rem;
            line-height: .88rem;
            border-radius: .44rem;
            background: @theme-color;
            color: #fff;
            text-align: center;

            &.disabled{
                opacity: 0.4;
                cursor: not-allowed;
            }
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
    z-index: 1000;
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
                color: @success-color;
            }

            &.failed{
                color: @danger-color-light;
            }

            &.loading-icon{
                border-radius: .6rem;
                background-color: @background-color;
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
.exit-confirm{
    /deep/ .weui-dialog__bd{
        padding: 0.4rem 0.4rem 0.6rem 0.4rem;
        color: @text-color;
        .content{
            margin-top:.3rem;
            text-align: left;
            line-height: 0.4rem;
            font-size: 0.28rem;
        }
    }
    
    /deep/ .weui-dialog__ft{
        font-size: 0.3rem;
        .weui-dialog__btn_default{
            color: @third-text-color!important;
        }
        .weui-dialog__btn_primary{
            color: @theme-color!important;
            background-color: #fff!important;
        }
    }
    .title{
        font-size: .3rem;
        color: @text-color;
        font-weight: bold;
        margin: 0 auto;
    }
}
</style>

<style lang="less">
@import '~themes/default/styles/common/variable.less';
.unPaid-tips {
    .weui-dialog {
        border-radius: .3rem;
        z-index: 902;
    }
}
.concatCust{
  text-decoration: underline;
  font-weight: bold;
  color: @theme-color;
}

</style>