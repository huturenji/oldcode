<template>
    <div id="refundTrainTicketBox">
        <div id="refundTrainTicketBoxbg"></div>
        <div id="refundTrainTicketContent">
            <div class="closeBtn" @click.stop="close"></div>
            <p class="boxhead">{{ title }}</p>
            <div class="refundDetail">
                <div class="amountDetailList">
                    <div class="amountDetail">
                        <div class="headerName">乘车人：</div>
                        <div class="amount">
                            <span>{{ passenger.psgName }}</span>
                            <span>{{ passenger.cardType }}</span>
                            <span>{{ getCardNo(passenger.cardNo) }}</span>
                        </div>
                    </div>
                    <div class="amountDetail">
                        <div class="headerName">车次信息：</div>
                        <div class="amount">
                            <span
                                >{{ ticket.startStation }}—{{
                                    ticket.endStation
                                }}</span
                            >
                            <span>{{ ticket.startTime }}</span>
                            <span>{{ passenger.seatNo }}</span>
                            <span>{{ passenger.seatType }}</span>
                        </div>
                    </div>
                    <div class="amountDetail">
                        <div class="headerName">车票票款：</div>
                        <div class="amount">
                            {{ getAmountUI(passenger.seatPrice) }}
                        </div>
                    </div>
                    <div class="amountDetail">
                        <div class="headerName">退票手续费：</div>
                        <div class="amount">
                            <span>{{
                                getAmountUI(passenger.refPoundage)
                            }}</span>
                            <span class="feetip">
                                {{
                                    "（退票费率：" +
                                    getRateUI(passenger.refPoundageRate) +
                                    "）"
                                }}
                            </span>
                        </div>
                    </div>
                    <div class="amountDetail">
                        <div class="headerName">实退票费：</div>
                        <div class="amount">
                            {{ getAmountUI(passenger.refTicketAmount) }}
                        </div>
                    </div>
                    <div class="amountDetail">
                        <div class="headerName"></div>
                        <div class="amount amountTotal">
                            {{ refundMoneyTip }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="boxbtn">
                <a
                    class="clickbtn confirm"
                    href="javascript:void(0);"
                    @click.stop="saveData"
                    >提交申请</a
                >
            </div>
        </div>
        <div v-transfer-dom :show="isLoading">
            <Loading
                :show="isLoading"
                :text="loadingText"
                class="couponLoading"
            ></Loading>
        </div>
    </div>
</template>

<script>
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import utils from "bislibs/utils";
import * as travelfun from "bislibs/traveloperationfun.js";
import NP from "number-precision";

export default {
    props: ["ticket", "passenger", "toGetMsg"],
    directives: {},
    components: {},
    data() {
        return {
            isLoading: false,
            loadingText: "退票中...", //提交加载框提示语
            title: "退票申请",
            refundMoneyTip: "退款将在1-7个工作日内原路退回",
        };
    },
    watch: {
        /**
         * 监听prop动态更新，刷新当前页面数据
         */
        toGetMsg: function (val, oldVal) {
            let that = this;
            if (val != oldVal && !!val) {
                that.initPageForm();
                that.getInfoDetail();
            }
        },
    },
    computed: {},
    created() {
        this.initPageForm();
    },
    mounted() {},
    methods: {
        initPageForm() {
            // this.refendPsg = "";
        },
        getCardNo(cardNo) {
            return utils.getFormatCardNo(cardNo);
        },
        //金额的UI显示格式化
        getAmountUI(fee) {
            return "￥" + NP.round(fee || 0, 2) + "元";
        },
        //百分比的UI显示格式化
        getRateUI(fee) {            
            if (fee == undefined || fee == null) {
                return "未知";
            }
            return NP.times(fee, 100) + "%";
        },
        //计算退款扣减
        getServiceFee(fee, rate) {
            return (
                "￥" + NP.round(NP.times(fee, NP.divide(rate, 100)), 2) + "元"
            );
        },
        //计算实际退款额度
        getLastRefundAmount(fee, rate) {
            return (
                "￥" +
                NP.round(NP.times(fee, NP.minus(1, NP.divide(rate, 100))), 2) +
                "元"
            );
        },
        /**
         * 接口调用 获取显示数据，
         */
        getInfoDetail() {},

        /**
         * 关闭当前的弹框
         */
        close() {
            this.$emit("closeTheDialog");
        },
        /**
         * 确认退票
         */
        saveData() {
            const that = this;
            let sucessMsg = "退票成功";
            let failMsg = "退票失败,请稍后重试";

            let request = {
                // companyId: tmHandler.companyId,
                // "userId": tmHandler.userId,
                actorId: tmHandler.userInfo.userId,
                actorName: tmHandler.userInfo.mgrName,
                orderNo: that.ticket.newOrderNo || that.ticket.orderNo,
                psgIds: that.passenger.psgId,
                psgNames: that.passenger.psgName,
            };
            that.isLoading = true;
            tmHandler.applyTrainRefund(request).then(
                function (res) {
                    that.isLoading = false;
                    if (0 == res.resultCode && res.result.success) {
                        that.$emit("submitManualRefund");
                        utils.showToast(sucessMsg);
                    } else {
                        console.info(res);
                        that.onHasException(res, failMsg);
                    }
                },
                function (error) {
                    that.isLoading = false;
                    console.info(error);
                    that.onHasException(error, failMsg);
                }
            );
        },
        onHasException(res, failMsg) {
            this.close();
            if (this.showErrorTips(res)) {
            } else {
                utils.showToast(failMsg);
            }
        },
        showErrorTips(res) {
            let that = this;
            let result = false;
            if (res.resultCode == "46020002") {
                //46020002
                that.showStopServering();
                result = true;
            } else if (
                res.resultCode == "46020020" ||
                res.resultCode == "46020026"
            ) {
                //46020020 46020026
                that.showOverTimeShort();
                result = true;
            } else if (res.resultCode == "46020022") {
                //46020022
                that.showOverTimePop();
                result = true;
            } else if (res.resultCode == "46020040") {
                //46020040
                that.showOverTime1Pop();
                result = true;
            } else if (res.resultCode == "46020019") {
                //46020019
                that.showOverTickOut();
                result = true;
            } else if (res.resultCode == "46020021") {
                utils.showToast("订单中存在正在进行改签的乘客");
                result = true;
            }
            return result;
        },
        showStopServering() {
            let text =
                "铁路网上购票系统将在23:00-次日06:00进行系统维护，期间暂停服务；如您需办理购票、改签或退票，请到铁路车站窗口办理，谢谢";
            this.showConfirmTemplet(text);
        },
        showOverTickOut() {
            let text =
                '<div class="overTimePop">客户已取票，无法办理网络退票，如有需要请前往车站售票窗口办理</div>';
            this.showConfirmTemplet(text);
        },
        showOverTimeShort() {
            let text =
                '<div class="overTimePop">距离发车时间不足35分钟，已停止网络退票，如有需要请前往车站售票窗口办理</div>';
            this.showConfirmTemplet(text);
        },
        showOverTimePop() {
            let text =
                '<div class="overTimePop">已过发车时间，无法办理网络退票，如有需要请前往车站售票窗口办理</div>';
            this.showConfirmTemplet(text);
        },
        showOverTime1Pop() {
            let text =
                '<div class="overTimePop">列车已发车，已停止退票，详情请查看退改签规则！</div>';
            this.showConfirmTemplet(text);
        },
        showConfirmTemplet(text) {
            travelfun.showConfirm(
                text,
                function () {},
                1,
                null,
                "知道了",
                null,
                null,
                true
            );
        },
    },
};
</script>
<style lang="less">
@import "~styles/common.less";
@import "~styles/variables.less";
@import "~styles/mixins/mixins.less";
@line-height: 32px;
@font-color: #333333;
@placeholder-color: #b2b2b2;
#refundTrainTicketBox {
    background: transparent;
    z-index: 199;
}
#refundTrainTicketBoxbg {
    position: fixed;
    left: 0px;
    top: 0px;
    bottom: 0px;
    background-color: #000;
    width: 100%;
    /*宽度设置为100%，这样才能使隐藏背景层覆盖原页面*/
    height: 100%;
    filter: alpha(opacity=60);
    /*设置透明度为60%*/
    opacity: 0.6;
    /*非IE浏览器下设置透明度为60%*/
    z-index: 200;
}

#refundTrainTicketContent {
    position: fixed;
    _position: absolute;
    margin: 0;
    width: 600px;
    height: fit-content;
    top: 10%;
    left: 30%;
    background-color: #fff;
    cursor: pointer;
    z-index: 201;
    text-align: center;
    .closeBtn {
        background: url(~assets//icon_close_simple.png) no-repeat right #fff;
        height: 20px;
        margin: 5px 5px 0 0;
        background-size: contain;
    }
    .boxhead {
        color: #333333;
        font-weight: bold;
        // margin: 10px;
        font-size: 16px;
        text-align: center;
    }
    .refundDetail {
        margin: 10px;
        background: white;
        padding: 20px 50px;

        .amountDetailList {
            padding: 3px;
            // display: flex;
            // justify-content: flex-start;
        }
        .amountDetail {
            // width: 150px;
            display: flex;
            .headerName {
                color: #333333;
                font-size: small;
                // font-weight: bold;
                // background: #e2e2e2;
                padding: 5px;
                flex: none;
            }
            .amount {
                color: #333333;
                font-size: small;
                padding: 5px;
                text-align: left;
                span {
                    margin-right: 5px;
                }
                .feetip {
                    color: #999;
                }
            }
            .amountTotal {
                color: red;
            }
        }
    }
    .boxbtn {
        margin-bottom: 30px;
        display: flex;
        justify-content: space-evenly;
        .clickbtn {
            padding: 5px 25px;
            border: 1px solid #e2e2e2;
            border-radius: 2px;
            color: white;
        }
        .cancel {
            background: #bbbbbb;
        }
        .confirm {
            background: #478aee;
        }
    }
}
</style>
<style lang="less">
//因为iview是第三方组件，修改他的样式，不能使用scoped标记，需要单独一个style标签。
@import "~styles/myiview.less";
.ivu-select-selected-value,
.ivu-select-placeholder,
.ivu-select-item {
    text-align: left;
}
</style>




