<template>
    <div id="refundTrainTicketBox">
        <div id="refundTrainTicketBoxbg"></div>
        <div id="refundTrainTicketContent">
            <div class="closeBtn" @click.stop="close"></div>
            <p class="boxhead">{{ title }}</p>
            <div v-if="ticket.roomType == 1" class="refundDetail">
                <div class="amountDetailList">
                    <div class="amountDetail">
                        <div class="headerName">房间票价：</div>
                        <div class="amount">
                            {{ getAmountUI(ticket.payAmount) }}
                        </div>
                    </div>
                    <div class="amountDetail">
                        <div class="headerName">酒店扣款：</div>
                        <div class="amount">
                            <span>{{ getAmountUI(ticket.expectedLossFee) }}</span>
                        </div>
                    </div>
                    <div class="amountDetail">
                        <div class="headerName">预计退款：</div>
                        <div class="amount">
                            {{ getAmountUI(ticket.expectedRefundAmount) }}
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="refundDetailEmpty">{{ cancleTip }}</div>

            <div class="boxbtn">
                <a
                    v-if="ticket.roomType != 1"
                    class="clickbtn confirm"
                    href="javascript:void(0);"
                    @click.stop="close"
                    >我不取消了</a
                >
                <a
                    class="clickbtn confirm"
                    href="javascript:void(0);"
                    @click.stop="saveData"
                    >{{ ticket.roomType == 1 ? "提交申请" : "确定取消" }}
                </a>
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
import NP from "number-precision";

export default {
    props: ["ticket", "toGetMsg"],
    directives: {},
    components: {},
    data() {
        return {
            isLoading: false,
            loadingText: "退订中...", //提交加载框提示语
            title: "退订申请",
            cancleTip: "您确定要取消房间吗，取消后不可恢复，请谨慎操作",
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
         * 确认退订
         */
        saveData() {
            const that = this;
            let sucessMsg = "退订成功";
            let failMsg = "退订失败,请稍后重试";

            let request = {
                // companyId: tmHandler.companyId,
                // "userId": requestHandler.userId,
                actorId: tmHandler.userInfo.userId,
                actorName: tmHandler.userInfo.mgrName,
                orderNo: this.ticket.orderNo,
                cancelReason: "不想订了",
            };
            that.isLoading = true;
            tmHandler.cancelHotelOrder(request).then(
                function (res) {
                    that.isLoading = false;
                    if (0 == res.resultCode && res.result.success) {
                        that.$emit("submitManualRefund");
                        utils.showToast(sucessMsg);
                    } else {
                        console.info(res);
                        utils.showToast(failMsg);
                    }
                },
                function (error) {
                    that.isLoading = false;
                    console.info(error);
                    utils.showToast(failMsg);
                }
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
    top: 20%;
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
                font-size: 14px;
                // font-weight: bold;
                // background: #e2e2e2;
                padding: 5px;
            }
            .amount {
                color: #333333;
                font-size: 14px;
                padding: 5px;
                text-align: left;
                span {
                    margin-right: 5px;
                }
            }
            .amountTotal {
                color: red;
            }
        }
    }
    .refundDetailEmpty {
        margin: 40px 0;
        font-size: 16px;
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




