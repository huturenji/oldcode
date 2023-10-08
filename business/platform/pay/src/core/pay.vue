<template>
	<div class="pay-container" id='sinoPayEl'>
        <loading
            class="popLoading"
            :show="loadingState!==false"
            :text="loadingText"
            :style='{zIndex: zIndex(5)}'
        ></loading>

        <component
            ref="payType"
            :is="payTypeComponent"
            :amount="amount"
            :limitTime="limitTime"
            @loadComplete='loadComplete'
            @createPay='createPay'
            @noticeServerAfterPay='noticeServerAfterPay'
            @beforeH5Pay='beforeH5Pay'
            @h5PayOperaEnd='h5PayOperaEnd'
        ></component>
	</div>
</template>

<script>
import { mapState,mapGetters, mapMutations } from "vuex";
import Utils from "../utils/utils";
import { Loading, Confirm } from "vux";
import { PAY_RESULT_STATUS, getPayTypeConfig, LOADING_STATE, OPERATION_STAGE } from '../constant'
import Request from '../requestHandler'
import h5Pay from '../h5Pay'
let request = null;

export default {
	name: "swp-pay",

	components: {
		Loading,
		Confirm,
	},
	props: {
        //操作完成（非二维码支付才出发）
        onOperationEnd: {
            type: Function,
        },
        //支付状态变化事件
		onListenlingState: {
			type: Function,
		},
        //待确认弹窗： 确认未收到结果
        onConfirmUnknown: {
            type: Function,
        },
        //待确认弹窗： 取消弹窗，并继续等待支付结果
        onCancelUnknown: {
            type: Function,
        },
		orderNo: {
			type: String | Number,
			default: null,
		},
		orderNoList: {
			//多订单id集合，服务器用于关联多个订单（比如机票订单+保险订单）
			type: Array,
			default: null,
		},
		amount: {
            type: String | Number,
			default: 0,
		},
		limitTime: {
			type: Number,
			default: null,
		},
		goodsDesc: {
			type: String,
			default: "",
		},
		tradeType: {
			type: String,
		},
        //获取业务参数
        getBusinessParams: {
            type: Function,
        },
	},
	data() {
		return {
			payTypeComponent: null, //支付方式的动态异步组件
		};
	},
	created: function () {
        request = new Request();
	},
	mounted() {},
	computed: {
        ...mapGetters(['zIndex', 'isBizMateEnv']),
		...mapState({
            isQRCode: 'isQRCode',
            loadingState: 'loadingState',
            operationStage: 'operationStage',
			currPayType: "currPayType",
			config: "config",
			payTypeList: "payTypeList",
            responseAdapter: (state) => state.config.responseAdapter,
			sinosdk: (state) => state.depends.sinosdk,
			snutils: (state) => state.depends.snutils,
		}),
        /**
         * loading文字
         */
        loadingText(){
            if(!this.loadingState){
                return ''
            }
            switch(this.loadingState){
                case 'loading': 
                    return '';
                case 'submit':
                    if (Utils.isEmpty(this.currPayType)) {
                        return '提交中';
                    }
                    return `正在前往${this.currPayType.alias || '支付'}`;
                case 'confirm':
                    return '付款确认中，请稍候'
                default:
                    return ''    
            }
        }
	},
	watch: {
        operationStage(_new, _old){
            if(Utils.isNotEmpty(_new) && _new != _old){
                //非二维码的支付动作已做完
                if((_new == OPERATION_STAGE.WAITING && !this.isQRCode)
                    || _new == OPERATION_STAGE.END  
                    || (this.isQRCode && (_new == OPERATION_STAGE.SUCCESS || _new == OPERATION_STAGE.FAILED))    //二维码支付成功/失败
                ){
                    this.dispatchEvent('onOperationEnd', this.currPayType);
                }
                if(_new == OPERATION_STAGE.UNKNOW){
                    Utils.showConfirm({
                        content: `抱歉，当前未收到${(this.currPayType || {}).alias}的确认结果，为避免重复支付，请再次确认是否已扣款，如已扣款请联系客服${this.config.serviceHotline}进行处理`,
                        confirmText: "知道了",
                        cancelText: "再次确认",
                        onConfirm: this.stopGetPayStatu,
                        onCancel: this.continueConfirm,
                    })
                }
                if(_new == OPERATION_STAGE.WAITING){//操作完成，打开轮询支付结果
                    this.reqPayStatuByLoop();
                }
            }
            //同步支付状态。如果上一个状态已经“成功”或“失败”了，则不再同步
            if(_old != OPERATION_STAGE.FAILED && _old != OPERATION_STAGE.SUCCESS && _old != OPERATION_STAGE.END){
                this.dispatchEvent('onListenlingState', _new);
            }
        }
	},
	beforeDestroy() {
		document.getElementById("payComp") &&
			document.getElementById("payComp").remove();
	},
	methods: {
		...mapMutations(['setPayTypeList', 'lockPage', 'setCurrPayType', 'setOperationStage', 'setLimitTime']),

        /**
         * 设置支付参数
         */
        initData(data){
            if(Utils.isNotEmpty(data)){
                Object.keys(data).forEach(key=>{
                    if(Object.prototype.toString.call(this[key]) == "[object Object]"){
                        this[key] = Utils.merge(this[key], data[key])
                    }else{
                        this[key] = data[key];
                    }
                })
            }
            return this;
        },

		/**
		 * 获取支付方式列表
         * 
		 */
		async getPayMethod() {
			//获取支付方式配置
			return await this._getPayMethod();
		},

        /**
         * 获取可用的支付方式
         * @return {Promise}
         */
        _getPayMethod() {
            const that = this;
            return new Promise((resolve, reject) => {
                this.lockPage(LOADING_STATE.LOADING);
                //根据channelId获取支付方式。
                request.send(that.config.api.payTypeList.path, that.config.commonParams, { method: that.config.api.payTypeList.method }).then((res) => {
                    this.lockPage(false)
                    if (!!that.responseAdapter.isSuccess(res)) {
                        let payTypeList = that.payTypeListFilter(res[that.responseAdapter.dataKey].paymentMethods)
                        that.setPayTypeList(payTypeList);
                        resolve(payTypeList);
                    } else {
                        reject();
                    }
                }).catch((e) => {
                    console.error(e);
                    this.lockPage(false)
                    reject();
                });
            })
        },

        /**
		 * 选择支付类型
		 * @param type 支付类型
		 */
		async use(option) {
            if(Utils.isEmpty(option)){
                throw '请提供期望执行的支付对象，或其code!'
            }
            if(this.config.validPayType){
                if (!this.payTypeList || this.payTypeList.length == 0) {
                    try {
                        await this._getPayMethod();
                    } catch (e) {
                        console.error(e);
                    }
                }
                if(Utils.isObject(option)){
                    if(!this.payTypeList.find(type=>type.code == option.code)){
                        throw '不可用的支付方式'
                    }
                }
                if(Utils.isString(option)){
                    option = this.payTypeList.find(type=>type.payType == option);
                    if(Utils.isEmpty(option)){
                        throw '未找到该支付方式'
                    }
                }
            }
            //如果是调用者自己封装的option，可能缺失一些关键参数，因此这里做一个merge
            let payTypeConfig = getPayTypeConfig();
            let singlePayConfig = Object.values(payTypeConfig).find(_config=>_config.code == option.code)
            option = Object.assign({}, singlePayConfig, option);
            if(Utils.isEmpty(option.payType)){
                option.payType = option.code
            }
			this.setCurrPayType(option);
            this.lockPage()
			//加载组件
            this.renderPayType(option.moduleName);
            return this;
		},

        /**
         * 处理支付方式的数据，判断在当前场景是否可用，并排序
         * @param payTypes
         * @return {Array}
         */
        payTypeListFilter(payTypes) {
            let payTypeConfig = getPayTypeConfig();//支付方式基础配置
            return payTypes.map(type=>{
                let config = Object.values(payTypeConfig).find(conf => conf.code == type.basePayType)
                return Object.assign({}, config, type);//用服务器的数据，覆盖默认数据
            }).sort((pay1, pay2) => {
                //根据orderby属性排序，升序
                if (!!pay1.orderby && !!pay2.orderby) {
                    if (pay1.orderby > pay2.orderby) {
                        return 1;
                    } else if (pay1.orderby < pay2.orderby) {
                        return -1;
                    } else {
                        return 0;
                    }
                } else if (!pay1.orderby && !!pay2.orderby) { //没有orderby属性的统一放后面
                    return 1;
                }
                return 0;
            })
        },

		/**
		 * 调用支付接口
		 */
		async createPay() {
            let payType = this.currPayType;
			try {
                this.lockPage(LOADING_STATE.SUBMIT)
                let param = {
                    totalAmount: this.amount,
                    payType: payType.payType,
                    goodsDesc: this.goodsDesc,
                    payMethod: payType.payMethod,
                    tradeType: this.tradeType,
                }
                if(this.orderNo){
                    param.orderNo = this.orderNo;
                }
                if(this.orderNoList && this.orderNoList.length>0){
                    param.orderNoList = this.orderNoList;
                }
                //合并第三方支付参数
                param = Object.assign({}, param, payType.thirdPayInfo, this.getBusinessParams ? await this.getBusinessParams() : {});
                //获取ip和mac地址
                Object.assign(param, await this.getIpAddress());
                //1.生成预付单
                request.send(this.config.api.createPay.path, param, { method: this.config.api.createPay.method }).then(res => {
                    //2.异步开始轮询
                    this.setOperationStage(OPERATION_STAGE.PAYING);//初始化支付状态
                    let responseData = res[this.responseAdapter.dataKey];
                    //如果cpyPaySuccess为true，说明直接支付成功，不用唤起第三方支付(测试专用支付)
                    if (responseData && responseData.cpyPaySuccess) {
                        this.setOperationStage(OPERATION_STAGE.WAITING);
                        this.reqPayStatuByLoop();
                        return;
                    }
                    //如果没有就再渲染一次。 当快速切换支付方式时，可能会进入payBreak将$refs.payType清空。
                    if(!this.$refs.payType){
                        this.renderPayType(this.currPayType.moduleName);
                    }
                    this.$nextTick(()=>{
                        this.$refs.payType && this.$refs.payType.afterCreateOrder && this.$refs.payType.afterCreateOrder(responseData)
                    })
                }).catch(e => {
                    this.lockPage(false);
                    // this.payError();
                    console.error(e);
                });
            } catch (e) {
                this.lockPage(false);
                // this.payError();
                console.error(e);
            }
		},

        /**
         * 对外提供接口，可单独使用，轮询结果
         */
        getPayResult(){
            this.setOperationStage(OPERATION_STAGE.PAYING);//设置为支付中状态
            this.reqPayStatuByLoop();
        },

        /**
         * 循环拉取订单信息，判断是否支付成功 
         * @param delay 每次查询的延迟时间
         * @param errorCout 错误次数（最多错3次）
         * @param loopCount 轮询次数
         */
        reqPayStatuByLoop(delay = 0, errorCout = 0, loopCount = null) {
            const that = this;
            setTimeout(function () {
                //中断轮询
                if (!(that.operationStage == OPERATION_STAGE.PAYING || that.operationStage == OPERATION_STAGE.WAITING)) {
                    that.payBreak()
                    return;
                }

                //最高试错机制 （停用该机制）
                // if (!!errorCout && errorCout >= 3) {
                //     that.payFailed('unknown')
                //     return;
                // }

                //如果有限制轮询次数
                if (loopCount !== null && loopCount !== undefined) {
                    if (loopCount <= 0) {
                        that.payBreak('countLimit')
                        return;
                    } else {
                        //每次减1
                        loopCount = !!loopCount && --loopCount;
                    }
                }

                //递归查询方法间隔，2秒一次
                let nextExecDelay = 3 * 1000;
                request.send(that.config.api.getPaymentInfo.path, {...that.config.api.getPaymentInfo.param, "orderNo": that.orderNo || (Utils.isNotEmpty(that.orderNoList) ? that.orderNoList[0] : '') }, { method: that.config.api.getPaymentInfo.method }).then((res) => {
                    //异常处理，如果已经决定中断了，就不执行响应结果。否则可能出现两次错误提示或成功提示
                    if (!(that.operationStage == OPERATION_STAGE.PAYING || that.operationStage == OPERATION_STAGE.WAITING)) {
                        that.payBreak()
                        return;
                    }
                    //responseResolver是由业务侧解析response并返回标准状态
                    let result = that.config.api.getPaymentInfo.responseResolver ? that.config.api.getPaymentInfo.responseResolver(res) : res[that.responseAdapter.dataKey].payState;
                    //支付成功
                    if (result == PAY_RESULT_STATUS.PAID || result == PAY_RESULT_STATUS.REFUNDED_PARTIAL || result == PAY_RESULT_STATUS.REFUNDED) {
                        that.paySuccess();//如果支付异常了，即使已成功了，也不跳转，否则用户体验不好
                    } else if (result == PAY_RESULT_STATUS.FAILED || result == PAY_RESULT_STATUS.CLOSED) { //支付失败
                        that.payFailed()
                    } else { //其他情况，继续轮询
                        that.reqPayStatuByLoop(nextExecDelay, 0, loopCount);
                    }
                }).catch((e) => {
                    console.error(e);
                    //如果请求失败或者依然是未支付，则继续轮询获取状态
                    that.reqPayStatuByLoop(nextExecDelay, ++errorCout, loopCount);
                });
            }, delay);
        },

        /**
         * APP支付完成后，通知服务器主动拉取支付状态
         * （现在服务器端只有老板付在用）
         */
        noticeServerAfterPay() {
            if (!this.config.api.payNotify || !this.config.api.payNotify.path) {
                return;
            }
            request.send(this.config.api.payNotify.path, { orderNo: this.orderNo || (Utils.isNotEmpty(this.orderNoList) ? this.orderNoList[0] : '') }, { method: this.config.api.payNotify.method })
        },

		/**
		 * 支付组件
		 * @param type
		 */
		renderPayType(type) {
			try{
                this.payTypeComponent = (resolve) => ({
                    component: import(`../payType/${type}.vue`),
                    delay: 0,
                    timeout: 10000,
                });
            }catch(e){
                console.error(e);
                this.lockPage(false);
                this.snutils.showToast('加载支付模块失败')
            }
		},

        beforeH5Pay(...param){
            this.dispatchEvent('onBeforeH5Pay', ...param);
        },

        /**
         * h5支付操作完成，已打开h5页面
         */
        h5PayOperaEnd(){
            this.dispatchEvent('onH5PayOperaEnd');
        },

		/**
		 * 给客服打电话
		 */
		concatUs() {
            if(this.isBizMateEnv){
                this.sinosdk.callNativeTel(this.config.serviceHotline);
            }
		},

		/**
		 * 继续确认支付状态
		 */
		async continueConfirm() {
            //如果调用端返回false，则不继续轮询结果
            if(!(await this.dispatchEvent('onCancelUnknown'))){
                return;
            }
            this.lockPage(LOADING_STATE.CONFIRM)
            this.noticeServerAfterPay();
            this.reqPayStatuByLoop();
		},

		/**
		 * 停止确认支付状态
		 */
		stopGetPayStatu() {
            this.dispatchEvent('onConfirmUnknown');
		},

		/**
		 * 组件加载完成事件
		 */
		loadComplete() {
			//执行创建预付单之前的事件
			this.$refs.payType && this.$refs.payType.beforeCreateOrder && this.$refs.payType.beforeCreateOrder();
		},

        /**
         * （对外暴露函数）停止轮询支付状态
         */
        stopTracking(){
            this.stopPay();
        },

        /**
         * 停止支付
         */
        stopPay() {
            //如果非终结态，则设置为break
            if(this.operationStage != OPERATION_STAGE.SUCCESS || this.operationStage != OPERATION_STAGE.FAILED){
                this.setOperationStage(OPERATION_STAGE.BREAK)
            }
        },

        /**
         * 支付成功
         */
        paySuccess(){
            this.payTypeComponent = null;
            this.setOperationStage(OPERATION_STAGE.SUCCESS);
        },

		/**
		 * 支付出错：支付过程中抛出异常
		 */
		payError() {
            this.payTypeComponent = null;
            this.setOperationStage(OPERATION_STAGE.FAILED);
		},

		/**
		 * 支付失败：支付回调返回失败
         * @param reason 失败原因
		 */
		payFailed(reason) {
            this.payTypeComponent = null;
            this.setOperationStage(OPERATION_STAGE.FAILED);
		},

		/**
		 * 轮询中断
		 * @param reason 中断原因
		 */
		payBreak(reason) {
            this.payTypeComponent = null;
		},

        /**
         * 获取ip和mac地址
         */
        getIpAddress() {
            let mac = '02:00:00:00:00:00';
            let ip = '127.0.0.1'
            return new Promise((resolve, reject) => {
                if(!this.isBizMateEnv){
                    resolve({
                        ipAddress: ip,
                        macAddress: mac
                    });
                    return;
                }
                this.sinosdk.getNetInfo({ isLocalInfo: 2 }).then(res => {
                    resolve({
                        ipAddress: res.ip || ip,
                        macAddress: res.macAddress || mac
                    })
                }).catch((e) => {
                    resolve({
                        ipAddress: ip,
                        macAddress: mac
                    })
                })
            })
        },

        /**
         * 代理函数，不直接将setLimitTime暴露给业务侧
         */
        updateLimitTime(value){
            this.setLimitTime(value);
        },

        /**
         * 触发事件
         */
        async dispatchEvent(name, ...value){
            return this[name] && Utils.isFunction(this[name]) ? await this[name](...value) : true;
        },

        /**
         * 监听事件
         */
        on(name, callback){
            this[name] = callback;
            return this;
        },

        /**
         * 离开支付
         */ 
        destroy(){
            this.stopPay();
            this.closeH5Pay();
            this.$destroy();
        },

        /**
         * H5支付页面是否正显示在最前端（一般是指iframe打开的H5支付）
         */
        isOnH5Pay(){
            return h5Pay.holdingOn;
        },

        /**
         * 结束H5支付
         */
        closeH5Pay(){
            //摧毁H5支付生成的frame
            return this.destroyH5Frames();
        },

        /**
         * 摧毁H5支付生成的frame
         */
        destroyH5Frames(){
            return h5Pay.resetFrames();
        }
	},
};
</script>
<style scoped lang="less">
@import "~style/variable.less";

* {
	box-sizing: border-box;
}
.popLoading{
    /deep/ .weui-toast{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
    }
}
</style>
<style lang="less">
@import "~style/variable.less";
.concatCust {
	text-decoration: underline;
	font-weight: bold;
}
</style>
