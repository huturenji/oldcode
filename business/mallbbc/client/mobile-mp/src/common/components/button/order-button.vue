<template>
    <view class="btn" :class="[{ 'plain-btn': plain }, type]" @click.stop='clickBtn' v-if="btn[type].load()">
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
import { mapMutations } from 'vuex';

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
                viewInvoice: {
                    text: "查看发票",
                    onClick: () => {
                        this.viewInvoice(this.order?.invoiceApplyInfo?.invoiceUrls)
                    },
                    load: () => {
                        return this.order?.invoiceApplyInfo?.invoiceUrls?.length > 0
                    }
                },
                reInvoice: {
                    text: "换开发票",
                    onClick: () => {
                        this.reInvoice()
                    },
                    load: () => {
                        return this.order?.invoiceApplyInfo?.invoiceState == 'INVOICED'
                    }
                },
                addInvoice: {
                    text: '补开发票',
                    onClick: () => {
                        this.addInvoice();
                    },
                    load: () => {
                        return !this.order?.invoice && this.order.actualPayment > 0;
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
                        remainTime: this.remainTime, // 秒
                    },

                    onClick: function () {
                        this.pay();
                    },
                    load: () => true
                },
                finish: {
                    text: '确认收货',
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
        ...mapMutations(['addGoods']),
        /**
         * @param {定时器间隔} interval 
         * 定时器会抛出两个事件：每次时间发出变更、倒计时结束 
         */
        createTimer(interval) {
            let timer = this.btn[this.type].timer;
            if (timer.timerId) {
                clearInterval(timer.timerId);
                timer.timerId = null;
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
            this.$emit('clickBtn')
        },
        // 修改地址
        updateAddress() {
            this.$Router.push({ path: '/views/address/list', query: { source: 3, orderSn: this.orderSn } })
        },
        async pay() {
            let oldOrderState = this.order.orderState;
            let payData = {
                orderAmount: this.order.orderAmount,
                paySn: this.order.paySn,
            }

            const successCallback = () => {
                this.$emit('order-pay-success', this.orderSn, oldOrderState);
            }
            payHandler.pay(this, payData, successCallback, () => { }, () => { });
        },
        // 取消订单
        cancel() {
            this.$emit('order-cancel', this.order);
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
                title: '确认货收到了吗？',
                content: '为了保证你的售后权益,请收到商品确认无误后再确认收货',
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
                title: '确认删除订单吗？',
                content: '删除之后订单无法恢复，无法处理你的售后问题，请慎重考虑',
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
            let cartInfoList = this.orderProductList.filter(item => { // 目前只有主商品才能加入购物车 即 productType=0 的时候
                let num = item.productNum;
                item.number = num
                item.num = num;
                return item.productType == 0;
            })

            const params = {
                cartInfoList
            }

            cartHandler.addCarts(params).then(res => {
                // 255 购物车已满，无法添加 267 商品状态有问题(不可买，库存不足，活动失效了 但是仍会加入购物车
                if (res.state == 200 || res.state == 267) {
                    this.$store.dispatch('getCartList');
                    cartInfoList.forEach(e => {
                        this.addGoods(e)
                    })
                    this.$Router.push({
                        path: '/views/cart/index',
                    })
                } else {
                    uni.showToast({
                        title: res.msg || '商品已失效'
                    })
                }
            })
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
        },
        // 查看发票
        viewInvoice(invoiceUrls = []) {
            if (invoiceUrls.length > 1) { //说明有多张发票
                this.$emit('viewInvoice', this.previewInvoice, invoiceUrls);
            } else { //此时说明只有一张发票
                this.previewInvoice(invoiceUrls[0]);
            }
        },
        // 预览发票
        previewInvoice(url = '') {
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
.btn {
    border-radius: 28px;
    background-color: $main-color;
    border: $main-color 1px solid;
    text-align: center;
    color: #fff;

    &.cancel {
        background: #FFF !important;
        border-color: #c2c2c2 !important;
        color: #666 !important;
    }
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
