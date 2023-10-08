import request from '@/utils/request';
import config from '@/common/lib/config';
import orderHandler from '@/views/components/order/handler';
import { isNotEmpty } from '@/utils/common';
import { subscribeMessage } from '@/views/subscribe/index.js';
import { SUB_PUB_KEY } from '@/views/subscribe/enum.js';
export default {
    // 微信支付状态
    payState: {
        'SUCCESS': 1,
        'FAIL': 2,
        'CANCEL': 3,
    },
    // 本系统订单支付状态 0-未支付 1-已支付 2-支付中 3-交易失败
    orderPayState: {
        NOT_PAY: 0,
        PAY_SUCCESS: 1,
        PAYING: 2,
        PAY_FAIL: 3
    },
    /**
     * 创建预支付单
     * @param {*} param 
    */
    payRequest(param) {
        return request({
            url: '/v3/payment/front/pay',
            method: 'POST',
            header: { "Content-Type": "application/json" },
            data: param
        })
    },

    /***
     * 支付功能
     * @param {*} param 
     */
    wxPay(data, needSubscribe) {
        let that = this;
        return new Promise(resolve => {
            if (!!!data || Object.keys(data).length <= 0) {
                resolve({
                    state: that.payState['FAIL'], //支付失败
                    msg: '支付参数有误'
                })
            }
            let userParams = getApp().globalData.userParams;
            let params = {
                payType: "WX_PAY",
                payMethod: "JS_PAY",
                totalAmount: data.orderAmount,
                goodsDesc: `支付单号: ${data.paySn}`,
                orderNo: data.paySn,
                userId: userParams.userId,
                channelId: userParams.channelId,
                companyId: userParams.companyId,
                openId: userParams.openId,
                ipAddress: "127.0.0.1",
                macAddress: "02:00:00:00:00:00",
                t: new Date().getTime(),
                jsAppid: config.MINI_CONFIG.APPID
            }
            that.payRequest(params).then(res => {
                if (res.data && res.data.content) {
                    let payObj = JSON.parse(res.data.content)
                    // 调用小程序支付
                    uni.requestPayment({
                        provider: 'wxpay',
                        timeStamp: payObj.timeStamp,
                        nonceStr: payObj.nonceStr,
                        package: payObj.package,
                        signType: payObj.signType,
                        paySign: payObj.paySign,
                        success(res) {
                            console.log('res_success', res);
                            // needSubscribe: 支付成功后需要订阅消息
                            needSubscribe && subscribeMessage(uni, [SUB_PUB_KEY.PAYMENT_SUCCESS_REMINDER, SUB_PUB_KEY.GOODS_DELIVERY_REMINDER], () => {
                                uni.$emit('paySuccessSubscrible')
                            });
                            resolve({
                                state: that.payState['SUCCESS'], //支付成功
                                msg: '小程序支付成功'
                            })
                        },
                        fail(res) {
                            console.log('res_fail', res);
                            if (res.errMsg == 'requestPayment:fail cancel') {
                                resolve({
                                    state: that.payState['CANCEL'], //支付成功
                                    msg: '小程序支付取消'
                                })
                            } else {
                                resolve({
                                    state: that.payState['FAIL'], //支付失败
                                    msg: '小程序支付失败'
                                })
                            }
                        },
                        complete(res) {
                        }

                    })
                } else {
                    resolve({
                        state: that.payState['FAIL'], //支付失败
                        msg: '创建预付单失败【获取预支付id失败】'
                    })
                }
            }).catch(e => {
                console.log(e);
                resolve({
                    state: that.payState['FAIL'], //支付失败
                    msg: '创建预付单接口报错'
                })
            })
        })
    },
    /**
     * 调用微信支付接口，处理微信支付结果逻辑
     * @param {*} ctx 上下文
     * @param {*} param1 支付参数（paySn，orderAmount必传，鹅毛情订单必传featherId）
     * @param {*} successCallback 支付成功，轮询结果为已支付后的回调
     * @param {*} failCallback 支付失败回调
     * @param {*} cancelCallback 支付取消回调
     * @returns 
     */
    async pay(ctx, { orderAmount, paySn, orderSnList = [], orderPayState, orderSourceInfo }, successCallback, failCallback, cancelCallback) {
        let featherId = orderSourceInfo?.orderSourceId;

        // 零元订单，submit后直接是已支付状态
        if (orderAmount == 0 && orderPayState == this.orderPayState.PAY_SUCCESS) {
            // 跳转到支付结果页
            ctx.$Router.replace({
                path: '/views/pay/result',
                query: { featherId, state: 1 }
            })
            return
        }

        uni.showLoading({
            title: '支付中',
            mask: true
        });
        let payResult = await this.wxPay({ orderAmount, paySn }, !isNotEmpty(featherId));
        uni.hideLoading();

        if (!payResult) {
            return
        }

        const payFailMessage = () => {
            uni.showToast({
                icon: 'error',
                title: '支付失败'
            })
        }

        const payCancelMessage = () => {
            uni.showToast({
                icon: 'none',
                title: '支付取消'
            })
        }

        // 微信支付成功，但是还要去轮询getPayInfo
        const defaultSuccessCallback = () => {
            ctx.timer = setInterval(() => {
                if (ctx.timer) {
                    this.getPayInfo(ctx, { orderAmount, paySn, orderSnList, featherId }, successCallback);
                }
            }, 1000);
        }

        // 支付失败
        const defaultFailCallback = () => {
            // 跳转到支付结果页
            ctx.$Router.replace({
                path: '/views/pay/result',
                query: { featherId, state: 2 }
            })
        }

        // 支付取消
        const defaultCancelCallback = () => {
            let path;
            let query = {
                fromConfirmOrder: 1
            }
            // 鹅毛情订单
            if (isNotEmpty(featherId)) {
                path = '/views/gift/detail/index';
                query.featherId = featherId;
            } else {
                path = '/views/order/detail/index'
                query.orderSn = orderSnList[0]
            }

            // 跳转到待支付订单详情页
            ctx.$Router.replace({
                path,
                query
            })
        }

        const arrageCallback = (...fns) => {
            return () => {
                fns.forEach(fn => {
                    try {
                        if (typeof fn == 'function') {
                            fn.call()
                        } else {
                            throw TypeError(`type of ${fn} is ${typeof fn}, not a function`)
                        }
                    } catch (error) {
                        console.error(error)
                    }
                })
            }
        }

        // 对应不同支付状态的策略方法
        const payResultStrategy = {
            [this.payState.SUCCESS]: defaultSuccessCallback,
            [this.payState.FAIL]: arrageCallback(payFailMessage, failCallback || defaultFailCallback),
            [this.payState.CANCEL]: arrageCallback(payCancelMessage, cancelCallback || defaultCancelCallback),
        }

        payResultStrategy[payResult.state]?.call();
    },
    // 获取支付后信息： 轮询
    getPayInfo(ctx, { paySn, featherId }, successCallback) {

        const defaultSuccessCallback = () => {
            // 鹅毛情下单送礼人没有消息推送弹窗，不会触发paySuccessSubscrible
            if (isNotEmpty(featherId)) {
                // 跳转到支付结果页
                ctx.$Router.replace({
                    path: '/views/pay/result',
                    query: { featherId, state: 1 }
                })
            } else {
                // 用户点击订阅事件，目前写死，如果后台关闭了发货消息推送，这里就炸了
                uni.$off('paySuccessSubscrible')
                uni.$on('paySuccessSubscrible', () => {
                    // 跳转到支付结果页
                    ctx.$Router.replace({
                        path: '/views/pay/result',
                        query: { featherId, state: 1 }
                    })
                })
            }
        }

        const executeSuccessCallback = successCallback || defaultSuccessCallback;

        orderHandler.getPayInfoApi({
            paySn,
            payFrom: 1
        }).then(res => {
            if (res.state == 200) {
                // 已支付
                if (res.data?.orderPayState == this.orderPayState.PAY_SUCCESS) {
                    if (ctx.timer) {
                        clearInterval(ctx.timer);
                        ctx.timer = null;
                    }        
                    executeSuccessCallback.call();
                }
            } else {
                if (ctx.timer) {
                    clearInterval(ctx.timer);
                    ctx.timer = null;
                }
                uni.showToast({
                    title: res.msg,
                    icon: 'none'
                })
                ctx.openOrderLock();
            }
        }).catch((e) => {
            console.error(e)
            if (ctx.timer) {
                clearInterval(ctx.timer);
                ctx.timer = null;
            }
            //异常处理
        }).finally(() => {
        });

    },
};