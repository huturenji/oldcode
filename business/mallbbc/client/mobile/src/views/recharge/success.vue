<!-- 充值成功页面 -->
<template>
    <rechargeResult :rechargeData="rechargeData"></rechargeResult>
</template>

<script>
import rechargeResult from "@/components/chargeresult/index.vue";
export default {
    components: {
        rechargeResult
    },
    data() {
        return {
            rechargeData: {
                resule: "success",
                icon: getApp().globalData.imgUrl + "balance/recharge_success.png",
                title: "充值成功",
                detail: [
                    {
                        key: "amount",
                        name: "交易金额",
                        value: ""
                    },
                    {
                        key: "method",
                        name: "交易方式",
                        value: "支付宝"
                    },
                    {
                        key: "time",
                        name: "交易时间",
                        value: "2019-09-05 10:55:47"
                    },
                    {
                        key: "order_sn",
                        name: "交易单号",
                        value: "54243241324324"
                    },
                    {
                        key: "trade_no",
                        name: "交易流水号",
                        value: "324324324324324"
                    }
                ]
            }
        };
    },
    mounted() {
        let tmp_data = this.rechargeData.detail;
        tmp_data.forEach((item) => {
            if (item.key == "amount") {
                item.value = "¥" + this.$Route.query.total_amount;
            } else if (item.key == "method") {
                item.value =
                    this.$Route.query.method.indexOf("alipay") > -1 ? "支付宝" : "微信";
            } else if (item.key == "time") {
                item.value = this.$Route.query.timestamp;
            } else if (item.key == "order_sn") {
                item.value = this.$Route.query.order_sn;
            } else if (item.key == "trade_no") {
                item.value = this.$Route.query.trade_no;
            }
        });
    },
    onLoad() {
        // let tmp_data = this.rechargeData.detail;
        // tmp_data.map((item,index)=>{
        //         if(item.key == 'amount'){
        //                 item.value = '¥'+this.$Route.query.total_amount;
        //         }else if(item.key == 'method'){
        //                 item.value = this.$Route.query.method.indexOf('alipay')>-1?'支付宝':'微信';
        //         }else if(item.key == 'time'){
        //                 item.value = this.$Route.query.timestamp;
        //         }else if(item.key == 'order_sn'){
        //                 item.value = this.$Route.query.order_sn;
        //         }else if(item.key == 'trade_no'){
        //                 item.value = this.$Route.query.trade_no;
        //         }
        // });
    },
    methods: {}
};
</script>

<style lang="scss">
page {
    background: $bg-color-split;

    .container {
        width: 750rpx;
        height: 100vh;

        .top_bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            width: 750rpx;
            height: 533rpx;
            background-size: contain;
            z-index: 0;
        }

        .top_content {
            width: 100%;

            .nav {
                width: 100%;
                padding: 20rpx;
                height: 90rpx;
                position: relative;
                margin-bottom: 40rpx;

                .iconfont {
                    position: absolute;
                    font-size: 26rpx;
                    left: 20rpx;
                    top: 37rpx;
                    color: #fff;
                }

                .title {
                    color: #fff;
                    font-size: 36rpx;
                }
            }

            .detail {
                width: 670rpx;
                background: #fff;
                box-shadow: 0px 0px 20px 0px rgba(86, 86, 86, 0.15);
                border-radius: 10rpx;
                z-index: 1;
                padding: 30rpx 30rpx 50rpx;

                .result_icon {
                    width: 146rpx;
                    height: 146rpx;
                    margin-top: 60rpx;
                }

                .result {
                    color: $main-third-color;
                    font-size: 28rpx;
                    width: 100%;
                    text-align: center;
                    border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
                    padding-bottom: 50rpx;
                }

                .item {
                    width: 100%;
                    color: $main-third-color;
                    font-size: 26rpx;
                    margin-top: 30rpx;
                }
            }
        }

        .operate {
            width: 670rpx;
            height: 88rpx;
            margin-bottom: 40rpx;
            background: linear-gradient(
                -90deg,
                rgba(252, 29, 28, 1) 0%,
                rgba(255, 122, 24, 1) 100%
            );
            box-shadow: 0px 3rpx 20rpx 0px rgba(252, 30, 28, 0.26);
            border-radius: 44rpx;
            color: #fff;
            font-size: 36rpx;
        }
    }
}
</style>
