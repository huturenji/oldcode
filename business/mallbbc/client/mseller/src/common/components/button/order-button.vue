<template>
    <view class="btn" :class="[{ 'plain-btn': plain }]" @click.stop='clickBtn' v-if="btn[type].load()">
        <block v-if="btn[type].text">
            {{ text || btn[type].text }}
        </block>
        <block v-else>
            <slot>button</slot>
        </block>
    </view>
</template>

<script>
import cartHandler from '@/views/components/cart/handler';
import orderHandler from '@/views/components/order/handler';
import orderMixin from '@/common/mixin/orderMixin'; //订单混入
import payHandler from '@/views/components/pay/handler';

import { setStorageSync } from '@/utils/common.js'
import { ORDER_STATE, BUTTON_TYPES } from "@/common/lib/enum/order.js";

export default {
    mixins: [orderMixin],
    props: {
        interval: {
            type: Number,
            default: 1
        },
        remainTime: {
            type: Number,
            default: 0
        },
        order: {
            type: Object,
            default: () => { }
        },
        orderSn: {
            type: String,
            default: ''
        },
        orderProductList: {
            type: Array,
            default: () => []
        },
        type: { //按钮类型
            type: String,
            default: ''
        },
        text: { // 按钮文字
            type: String,
            default: ''
        },
        // 按钮是否镂空
        plain: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            btn: {
                reInvoice: {
                    text: "换开发票",
                    onClick: () => {
                        this.reInvoice()
                    },
                    load: () => {
                        return this.order && !!this.order.invoiceApplyInfo && !!this.order.invoiceApplyInfo.invoiceState && this.order.invoiceApplyInfo.invoiceState == 'INVOICED'
                    }
                },
                addInvoice: {
                    text: '补开发票',
                    onClick: () => {
                        this.addInvoice();
                    },
                    load: () => {
                        return this.order && !this.order.invoice && this.order.actualPayment > 0;
                    }
                },
                updateAddress: {
                    text: '修改地址',
                    onClick: () => {
                        this.updateAddress();
                    },
                    load: () => true
                },
                cancel: {
                    text: '取消订单',
                    onClick: () => {
                        this.cancel();
                    },
                    load: () => true
                },
                pay: {
                    text: '立即支付',
                    timer: {
                        timerName: '支付定时器',
                        timerId: null,
                        remainTime: this.remainTime // 秒
                    },

                    onClick: function () {
                        this.pay();
                    },
                    load: () => true
                },
                finish: {
                    text: '确认订单',
                    onClick: () => {
                        this.finish();
                    },
                    load: () => true
                },
                viewLogistic: {
                    text: '查看物流',
                    onClick: () => {
                        this.viewLogistic();
                    },
                    load: () => true
                },
                buyAgain: {
                    text: '再次购买',
                    onClick: () => {
                        this.buyAgain();
                    },
                    load: () => true
                },
                delete: {
                    text: '删除订单',
                    onClick: () => {
                        this.delete();
                    },
                    load: () => true
                }
            }
        }
    },
    beforeDestroy() {
        clearInterval(this.btn[this.type].timer?.timerId);
    },
    mounted() {
        if (this.type === BUTTON_TYPES.PAY && this.remainTime > 0 && this.interval > 0) {
            // 每个类型为pay 的button都会创建一个定时器
            this.createTimer(this.interval);
        }
    },
    methods: {
        /**
         * @param {定时器间隔} interval 
         * 定时器会抛出两个事件：每次时间发出变更、倒计时结束 
         */
        createTimer(interval) {
            let timer = this.btn[this.type].timer;
            if (timer.timerId) {
                clearInterval(timer.timerId);
                timer.timerId = null;
                console.log(timer.timerId, '清除了')
            }

            timer.timerId = setInterval(() => {

                timer.remainTime -= interval;
                this.$emit('timing', { type: this.type, remainTime: timer.remainTime, orderSn: this.order.orderSn });
                // 倒计时结束
                if (timer.remainTime <= 0) {
                    clearInterval(timer.timerId);
                    this.$emit('timeout', { type: this.type, orderSn: this.order.orderSn });
                }
                // 倒计时进入interval范围，缩小倒计时间隔为1s
                if (interval != 1 && timer.remainTime <= interval) {
                    // 按秒定时
                    this.createTimer(1);
                }
            }, 1000 * interval);
        },
        // 点击按钮
        clickBtn($event) {
            if (!this.type) {
                this.$emit('click', $event)
            } else {
                this.btn[this.type].onClick.call(this);
            }
        },
        // 修改地址
        updateAddress() {
            this.$Router.push({ path: '/views/address/list', query: { source: 3, orderSn: this.orderSn } })
        },

        // 立即支付
        async pay() {
            let oldOrderState = this.order.orderState;

            let payData = {
                totalAmount: this.order.orderAmount,
                paySn: this.order.paySn
            }
            uni.showLoading({
                title: '支付中',
                mask: true
            })
            let payResult = await payHandler.pay(payData);
            let timer = null;
            // 微信返回支付成功
            if (payResult.state == payHandler.payState.SUCCESS) {
                if (timer) {
                    clearInterval(timer);
                }
                timer = setInterval(() => {
                    orderHandler.getPayInfo({
                        paySn: this.order.paySn
                    }).then(res => {
                        // 订单支付完成
                        if (res.state == 267) {
                            clearInterval(timer);
                            timer = null;
                            uni.hideLoading();
                            this.$emit('order-pay-success', this.orderSn, oldOrderState);
                        }
                    })
                }, 1000)
            } else if (payResult.state == payHandler.payState.FAIL) {
                uni.hideLoading();
                // 支付失败
                uni.showToast({
                    icon: 'error',
                    title: '支付失败'
                })
            } else if (payResult.state == payHandler.payState.CANCLE) {
                uni.hideLoading();
                uni.showToast({
                    icon: 'none',
                    title: '支付取消'
                })
            }
            

        },
        // 取消订单
        cancel() {
            this.$emit('order-cancel', {
                orderSn: this.orderSn,
                parentSn: this.order.parentSn,
                oldOrderState: this.order.orderState
            });
        },
        // 完成订单
        finish() {
            let oldOrderState = this.order.orderState;
            console.log('oldOrderState', oldOrderState);
            const params = {
                orderSn: this.orderSn
            }
            uni.showModal({
                confirmColor: '#f30300',
                cancelColor: '#999',
                title: '提示',
                content: '是否确认该订单',
                success: ({ confirm }) => {
                    if (confirm) {

                        orderHandler.receive(params).then(res => {
                            if (res.state == 200) {
                                this.$emit('order-confirm', this.orderSn, oldOrderState, ORDER_STATE.FINISHED);
                            } else {

                            }
                        })
                    }
                }
            })
        },
        viewLogistic() {
            this.lookLogistics();
        },
        // 删除订单
        delete() {
            let oldOrderState = this.order.orderState;
            console.log('oldOrderState', oldOrderState);

            uni.showModal({
                confirmColor: '#f30300',
                cancelColor: '#999',
                title: '提示',
                content: '是否删除该订单',
                success: ({ confirm }) => {
                    if (confirm) {

                        orderHandler.delete({
                            orderSn: this.orderSn
                        }).then(res => {
                            if (res.state == 200) {
                                this.$emit('order-delete', this.orderSn, oldOrderState, ORDER_STATE.DELETED);

                            } else {
                                uni.showToast({
                                    icon: 'error',
                                    title: res.msg
                                })
                            }
                        })
                    }
                }

            })
        },
        // 调用 加入购物车接口， 成功后跳转到购物车
        buyAgain() {
            //暂时跳详情
            this.$Router.push({
                path: '/views/goods/detail/index',
                query: {
                    sku: this.orderProductList[0].sku
                }
            })
            // let cartInfoList = this.orderProductList.filter(item => { // 目前只有主商品才能加入购物车 即 productType=0 的时候
            //     item.number = item.productNum
            //     return item.productType == 0;
            // })

            // const params = {
            //     cartInfoList
            // }
            // cartHandler.addCarts(params).then(res => {
            //     if (res.state == 200) {
            //         this.$Router.push({
            //             path: '/views/cart/index',
            //             query: {

            //             }
            //         })
            //     } else {
            //         uni.showToast({
            //             title: '商品已失效'
            //         })
            //     }
            // })
        },
        addInvoice() {
            this.$Router.push({
                path: '/views/invoice/myInvoice',
                query: {
                    isVatInvoice: 0, // 是否可以开增值税发票,0-不可以， 1-可以
                    applyType: 'add', // 补开发票
                    needInvoice: true, //需要发票
                    invoiceContent: 1, // 默认商品明细
                    orderSn: this.orderSn // 
                }
            })
        },
        // 换开发票
        reInvoice() {
            let invoiceContent = 1
            if (this.order.invoice && this.order.invoice.invoiceContent) {
                invoiceContent = this.order.invoice.invoiceContent
            }
            // 如果需要换开发票，此时跳转到我的发票页面此时需要显示和当前订单一致的发票信息，
            setStorageSync('choosedInvoice', { titleId: this.order.invoice.invoiceId, name: this.order.invoice.invoiceTitle }); //将选择的发票存入缓存 为了订单详情页面和我的发票页面显示的发票一致, 同时要更新字段 因为订单这里的字段和发票的字段不一致

            this.$Router.push({
                path: '/views/invoice/myInvoice',
                query: {
                    applyType: 'change',
                    orderSn: this.orderSn, //订单编号
                    needInvoice: true, //需要开发票
                    invoiceContent
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.btn {
    border-radius: 28px;
    background-color: $main-color;
    border: $main-color 1px solid;
    text-align: center;
    color: #fff;
}

.plain-btn {
    border-radius: 28px;
    border: $main-color 1px solid;
    text-align: center;
    color: $main-color;
    background-color: #fff;
    padding: 2px 10px;
}
</style>
