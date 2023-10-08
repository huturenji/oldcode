<template>
    <view v-if="btn[type] && btn[type].load()" class="btn"
        :style="{ display: type == 'weixinShare' ? 'none' : 'block' }" :class="['btn-' + type, 'btn-' + size]"
        @click.stop='clickBtn($event, type)'>
        {{ btn[type].text }}
    </view>
</template>

<script>
import orderHandler from '@/views/components/order/handler';
import payHandler from '@/views/components/pay/handler';
import { setStorageSync } from "@/utils/common";
import { ORDER_STATE } from '@/common/lib/enum/order';

export default {
    props: {
        interval: {
            type: Number,
            default: 1
        },
        remainTime: {
            type: Number,
            default: 0
        },
        type: { //按钮类型
            type: String,
            required: true
        },
        giftInfo: {
            type: Object,
            default: () => { }
        },
        // big  normal
        size: {
            type: String,
            default: 'normal'
        },
        style: {
            type: Object,
            default: () => { }
        },
    },
    data() {
        return {
            btn: {
                backGift: {
                    text: "去回礼",
                    onClick: () => {
                        this.again();
                    },
                    load: () => true
                },
                refundDetail: {
                    text: "退款详情",
                    onClick: () => {
                        this.refundDetail()
                    },
                    load: () => true
                },
                again: {
                    text: "再次送礼",
                    onClick: () => {
                        this.again()
                    },
                    load: () => true
                },
                weixinShare: {
                    text: "微信分享送礼单",
                    timer: {
                        timerName: '待收礼定时器',
                        timerId: null,
                        remainTime: this.remainTime, // 秒
                    },
                    load: () => true
                },
                detail: {
                    text: "查看详情",
                    onClick: () => {
                        this.viewGiftDetail()
                    },
                    load: () => true
                },
                viewDetail: {
                    text: "查看物流详情",
                    onClick: () => {
                        this.viewLogisticDetail()
                    },
                    load: () => true
                },
                receiveGift: {
                    text: "领取心意",
                    onClick: () => {
                        this.receiveGift()
                    },
                    load: () => true
                },
                pay: {
                    text: "去支付",
                    timer: {
                        timerName: '支付定时器',
                        timerId: null,
                        remainTime: this.remainTime, // 秒
                    },
                    onClick: () => {
                        this.pay()
                    },
                    load: () => {
                        return true
                    }
                },
                cancel: {
                    text: "取消送礼",
                    onClick: () => {
                        this.cancelPayFun()
                    },
                    load: () => {
                        return true
                    }
                },
                resInvoice: {
                    text: "换开发票",
                    onClick: () => {
                        this.resInvoice(this.giftInfo)
                    },
                    load: () => {
                        return this.giftInfo.orderDetailVO && !!this.giftInfo.orderDetailVO.invoiceApplyInfo && !!this.giftInfo.orderDetailVO.invoiceApplyInfo.invoiceState && this.giftInfo.orderDetailVO.invoiceApplyInfo.invoiceState == 'INVOICED'
                    }
                },
                viewInvoice: {
                    text: "查看发票",
                    onClick: () => {
                        this.viewInvoice(this.giftInfo?.orderDetailVO?.invoiceApplyInfo?.invoiceUrls)
                    },
                    load: () => {
                        return this.giftInfo?.orderDetailVO?.invoiceApplyInfo?.invoiceUrls?.length > 0
                    }
                },
                addInvoice: {
                    text: "补开发票",
                    onClick: () => {
                        this.addInvoice(this.giftInfo)
                    },
                    load: () => { //按钮的组件是否加载，也就是用v-if来控制的
                        return this.giftInfo.orderDetailVO && !this.giftInfo.orderDetailVO.invoice && this.giftInfo.orderDetailVO.actualPayment > 0
                    }
                },
            }
        }
    },
    beforeDestroy() {
        clearInterval(this.btn[this.type].timer?.timerId);
    },
    mounted() {
        if (this.remainTime > 0 && this.interval > 0 && (this.type == 'weixinShare' || this.type == 'pay')) {
            // 每个类型为type 指定的button都会创建一个定时器
            this.createTimer(this.interval);
        }
    },

    methods: {
        /**
         * 
         * @param {定时器间隔} interval 
         * 定时器会抛出两个事件：每次时间发出变更、倒计时结束 
         */
        createTimer(interval) {
            // 当前按钮的定时器
            let timer = this.btn[this.type].timer;

            // 创建之前先清除
            timer.timerId && clearInterval(timer.timerId);

            let id = setInterval(() => {
                timer.remainTime -= interval;
                // 每次计时抛出事件 timing
                this.$emit('timing', { type: this.type, featherId: this.giftInfo.featherId, remainTime: timer.remainTime });

                if (timer.remainTime <= 0) {

                    clearInterval(timer.timerId);
                    // 抛出超时事件
                    this.$emit('timeout', { type: this.type, featherId: this.giftInfo.featherId });
                }
            }, 1000 * interval)

            timer.timerId = id;
        },
        // 点击按钮
        clickBtn($event, type) {
            this.btn[type].onClick($event);
        },
        refundDetail() {
            this.$Router.push({
                path: '/views/gift/detail/refund',
                query: {
                    featherId: this.giftInfo.featherId
                }
            })
        },
        again() {
            uni.switchTab({
                url: '/pages/index/index'
            })
        },
        receiveGift() {
            this.$emit('receiveGift')
        },
        viewGiftDetail() {
            this.$Router.push({
                path: '/views/gift/detail/index',
                query: {
                    featherId: this.giftInfo.featherId
                }
            })
        },
        viewLogisticDetail() {
            this.$Router.push({
                path: '/views/gift/detail/index',
                query: {
                    featherId: this.giftInfo.receiverFeatherOrderVO.featherId
                }
            })
        },
        // 立即支付
        async pay() {
            let { featherId, status, giverOrReceiver } = this.giftInfo;
            let paySn = this.giftInfo.featherOrderInfoVO?.paySn;
            let orderAmount = this.giftInfo.featherOrderInfoVO?.orderAmount;

            let payData = {
                paySn,
                orderAmount,
                orderSourceInfo: {
                    orderSourceId: featherId
                }
            }

            const successCallback = () => {
                this.$emit('order-pay-success', { featherId, status, giverOrReceiver })
            }

            payHandler.pay(this, payData, successCallback, () => {}, () => {});
        },
        // 取消送礼
        cancelPayFun() {
            uni.showModal({
                confirmColor: '#f30300',
                cancelColor: '#999',
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
        // 取消送礼回调，即取消支付
        async cancel() {
            const { parentSn, orderSn, orderState }  = this.giftInfo?.featherOrderInfoVO;
            let param = {
                cancelReason: '鹅毛情礼单取消送礼'
            };
            if(orderState == ORDER_STATE.WAIT_PAY){
                param.orderSn = parentSn
            }else{
                param.orderSn = orderSn
            }

            orderHandler.cancel(param).then(res => {
                if (res.state == 200) {
                    this.$emit('cancelResult', { featherId: this.giftInfo.featherId })
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: '取消失败'
                    })
                }
            }).catch(() => {
                //异常处理
            })
        },
        // 换开发票
        resInvoice(item) {
            let invoiceContent = 1
            if (item.orderDetailVO.invoice && item.orderDetailVO.invoice.invoiceContent) {
                invoiceContent = item.orderDetailVO.invoice.invoiceContent
            }
            // 如果需要换开发票，此时跳转到我的发票页面此时需要显示和当前订单一致的发票信息，
            setStorageSync('choosedInvoice', { titleId: item.orderDetailVO.invoice.invoiceId, name: item.orderDetailVO.invoice.invoiceTitle }); //将选择的发票存入缓存 为了订单详情页面和我的发票页面显示的发票一致, 同时要更新字段 因为订单这里的字段和发票的字段不一致

            this.$Router.push({
                path: '/views/invoice/myInvoice',
                query: {
                    applyType: 'change',
                    orderSn: item.orderSn, //订单编号
                    needInvoice: true, //需要开发票
                    invoiceContent
                }
            })
        },
        // 补开发票
        addInvoice(item) {
            this.$Router.push({
                path: '/views/invoice/myInvoice',
                query: {
                    isVatInvoice: 0, // 是否可以开增值税发票,0-不可以， 1-可以
                    applyType: 'add', // 补开发票
                    needInvoice: true, //需要发票
                    invoiceContent: 1, // 默认商品明细
                    orderSn: item.orderSn // 
                }
            })
        },
        // 查看发票 demo: https://fp.aisino.com/downloadTicket/phI1DybD
        viewInvoice(invoiceUrls = []){
            if (invoiceUrls.length > 1) { //说明有多张发票
                this.$emit('viewInvoice', this.previewInvoice);
            } else { //此时说明只有一张发票
                this.previewInvoice(invoiceUrls[0]);
            }
        },
        // 预览发票
        previewInvoice(url = ''){
            const fileType = 'pdf';

            uni.downloadFile({
                url,
                success: function (res) {
                    var filePath = res.tempFilePath;
                    console.log('filePath', filePath)
                    uni.openDocument({
                        fileType,
                        filePath,
                        success: function (res) {
                            console.log('打开文档成功', res);
                        },
                    });
                },
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.btn-normal {
    width: auto;
    border-radius: 28px;
    background-color: #fc3030;
    border: #fc3030 1px solid;
    text-align: center;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    padding: 4px 10px;
}

.btn-big {
    width: 552rpx;
    height: 80rpx;
    border-radius: 56rpx;
    background-color: #f30300;
    line-height: 80rpx;
    text-align: center;
    padding: 0 30rpx;
    color: #fff;
    font-weight: bold;
    font-size: 30rpx;
}

.share-btn {
    flex: 1;
    height: 30px;
    line-height: 30px;
    color: #fff;
    background: $main-color;
    border-radius: 22px;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
    border: 1px solid #222;

}
</style>
