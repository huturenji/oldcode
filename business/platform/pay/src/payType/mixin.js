import { mapState, mapMutations, mapGetters } from 'vuex';
import Utils from '../utils/utils'
import { getPayTypeConfig, OPERATION_STAGE } from '../constant'

export default {
    props: {
        amount: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            payType: getPayTypeConfig(),
            payTypeCase: null,//当前支付方式(父类属性，在子类填充，【子类一定要初始化】)
        }
    },
    computed: {
        ...mapGetters(['zIndex', 'isBizMateEnv']),
        ...mapState({
            limitTime: 'limitTime',
            config: 'config',
            currPayType: "currPayType",
            sinosdk: (state) => state.depends.sinosdk,
			snutils: (state) => state.depends.snutils,
        })
    },
    watch: {
    },
    created() {
        //触发组件加载完成事件
        this.loadComplete();
    },
    watch: {
        limitTime(newValue, oldValue) {
            if (this.limitStop(newValue)) {
                this.stopPay();
            }
        },
    },
    filters: {
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
    methods: {
        ...mapMutations(['setCurrPayType', 'setOperationStage', 'lockPage', 'useQRCode']),
        /**
         * 抽象接口方法
         * 通知: 开始创建预付单
         */
        notifyCreatePay() {
            this.$emit('createPay');
        },

        noticeServerAfterPay(){
            this.$emit('noticeServerAfterPay')
        },
        
        /**
         * 事件：组件加载/激活完成
         */
        loadComplete() {
            this.$emit('loadComplete');
        },
        
        /**
         * 抽象接口方法
         */
        beforeCreateOrder() {},
        
        /**
         * 抽象接口方法
         */
        afterCreateOrder() {},
        
        /**
         * 停止支付
         */
        stopPay() {
            this.setOperationStage(OPERATION_STAGE.BREAK)
        },
        /**
         * 未知支付结果
         */
        payUnknown() {
            this.setOperationStage(OPERATION_STAGE.UNKNOW)
        },

        /**
         * 操作完成，如果：调用app支付返回成功，已打开H5支付，已打开二维码
         */
        operationWaiting() {
            this.setOperationStage(OPERATION_STAGE.WAITING)
        },

        /**
         * 操作进行中
         */
        operationSucc() {
            this.setOperationStage(OPERATION_STAGE.SUCCESS)
        },

        /**
         * 操作进行中
         */
        operationEnd() {
            this.setOperationStage(OPERATION_STAGE.END)
        },

        /**
         * 事件： 即将触发h5pay
         * @leavePage[boolean]: 是否会离开当前页面
         */
        beforeH5Pay(leavePage = false){
            this.$emit('beforeH5Pay', leavePage)
        },

        /**
         * h5支付操作完成（即已打开H5页面）
         */
        h5PayOperaEnd(){
            this.$emit('h5PayOperaEnd')
        },

        /**
         * 判断倒计时是否停止
         */
        limitStop(limitTime) {
            return limitTime && limitTime <= 0;
        },

        /**
         * 执行第三方支付客服端
         * @param type 支付类型
         * @param json 支付参数
         */
        toThreePayDo(funcName, json) {
            const that = this;
            const defaultErrorMsg = '支付失败，请稍后重试';
            return new Promise((res, rej) => {
                if(!this.isBizMateEnv){
                    Utils.showConfirm({
                        content: '不支持该支付方式',
                        showCancelButton: false
                    })
                    rej();
                }
                this.sinosdk[funcName](json).then(function (data) {
                    if (!data || data.ret != 0) {
                        that.stopPay();//中断轮询
                        if (!!data && data.ret != -2) { //-2为用户手动取消支付，不提示
                            Utils.showConfirm({
                                content: '支付方式不可用<br/>原因：' + (data.errorMsg || defaultErrorMsg),
                                showCancelButton: false
                            })
                        }
                        rej(data);
                    } else {
                        res(data);
                    }
                }).catch((e) => {
                    that.stopPay();//中断轮询
                    this.snutils.showToast(defaultErrorMsg);
                    rej(e);
                });
            })
        },
    },
}

