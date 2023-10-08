<template>
    <div id="refundTrainTicketBox">
        <div id="refundTrainTicketBoxbg"></div>
        <div id="refundTrainTicketContent">
            <div class="closeBtn" @click.stop="close"></div>
            <p class="boxhead">{{ title }}</p>
            <div class="refundDetail">
                <div class="amountDetailList">
                    <div class="amountDetail">
                        <div class="headerName">乘机人：</div>
                        <div class="amount">
                            <span>{{ passenger.psgName }}</span>
                            <span>{{
                                getCardTypeName(passenger.cardType)
                            }}</span>
                            <span>{{ getCardNo(passenger.cardNo) }}</span>
                        </div>
                    </div>
                    <div class="amountDetail">
                        <div class="headerName">航班信息：</div>
                        <div class="amount">
                            <span>{{
                                ticket.airLineName + ticket.flightNo
                            }}</span>
                            <span>{{
                                ticket.beginDate + "    " + ticket.beginTime
                            }}</span>
                            <span
                                >{{ ticket.sAirportName + ticket.sTerminal }}-{{
                                    ticket.eAirportName + ticket.eTerminal
                                }}</span
                            >
                        </div>
                    </div>
                    <div
                        class="bookBtnWrap"
                        v-if="insuranceOrders && insuranceOrders.length"
                    >
                        <div class="amountDetail">
                            <div class="headerName">已购保险：</div>
                            <div class="amount">
                                <div v-for="ins in insuranceOrders" :key="ins">
                                    {{ ins.insuranceProduct.productShortName }}
                                </div>
                            </div>
                            <div class="addReceodShow content">
                                <div class="htitle">机票退票后保险如何处理</div>
                                <div class="content">
                                    {{ insuranceRefundTips }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="amountDetail">
                        <div class="headerName">退票原因：</div>
                        <div class="amount">
                            <Select class="inSelect" v-model="refundReason">
                                <Option
                                    v-for="reason in refundReasonList"
                                    :key="reason.id"
                                    :value="reason.id"
                                    >{{ reason.text }}</Option
                                >
                            </Select>
                        </div>
                    </div>
                    <div
                        class="amountDetail"
                        v-if="refundReasonList[refundReason].attachment"
                    >
                        <div class="headerName">上传凭证：</div>
                        <div class="amount">
                            <uploadfile
                                :uploadUrl="uploadUrl"
                                type="img"
                                :uploadOnce="false"
                                layout="2"
                                :defaultList="uploadDefault"
                                @onUploadChange="fileUpChange"
                            ></uploadfile>
                            <div class="uploadtips">
                                {{
                                    refundReasonList[
                                        refundReason
                                    ].tips.toString()
                                }}
                            </div>
                        </div>
                    </div>
                    <div class="amountDetail">
                        <div class="headerName">预估可退金额：</div>
                        <div class="amount">以航空公司审核为准</div>
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
const uploadfile = () => import("components/uploadfile/uploadfile.vue");

export default {
    props: ["ticket", "passenger", "orderBase", "insuranceOrders", "toGetMsg"],
    directives: {},
    components: { uploadfile },
    data() {
        return {
            uploadUrl: utils.uploadUrl,
            isLoading: false,
            loadingText: "退票中...", //提交加载框提示语
            title: "退票申请",
            refundMoneyTip:
                "退票须知：退票申请一经提交将会取消机位，如因航班变动或病退原因提交申请，则具体审核结果以航空公司为准，如航空公司审核不过，将直接按照自愿退票申请进行退款。",
            insuranceRefundTips:
                "1、保险和机票一起购买，并在我司申请的机票自愿改签（改期），若此时保险并未生效，为保证保险能够顺利退保重出，您需先支付改签航班保险费用，待改签成功后，原航班保险费用将按原路退回至您的支付账户；若改签时保险已生效，则无法办理退保，您可根据需要再次购买新的保险。若机票改签仅为升舱，则保险可以正常使用，无需变更。\n" +
                "2、保险和机票一起购买，但您在航司或机场操作改签时，保险无法自动更改，请您联系客服协助处理。\n" +
                "3、如您单独购买的保险，请您联系出保方核实处理。\n" +
                "4、保险和机票一起购买，并在我司申请的机票自愿退票，如已购买保险服务并且还未生效，保险费用将自动退还。", //退票按钮提示语
            refundReason: 0,
            refundReasonList: {
                0: {
                    id: 0,
                    text: "我的行程有变，不飞了",
                    attachment: 0, //不需要凭证
                    refundType: 1, //自愿退票
                },
                1: {
                    id: 1,
                    text: "填错名字、选错日期、选错航班",
                    attachment: 0,
                    refundType: 1, //自愿退票
                },
                2: {
                    id: 2,
                    text: "航班延误或取消，航班时刻变更",
                    attachment: 1, //需要凭证
                    tips: [
                        "请上传航变资料，如：航司开具的延误证明，截图上传即可",
                        "证明资料以航空公司的规定为准，提交成功后我们会尽快处理，请您耐心等待",
                        `凭证大小不能超过1MB`,
                    ],
                    refundType: 2, //非自愿退票
                },
                3: {
                    id: 3,
                    text: "身体原因且有相关医院证明",
                    attachment: 1,
                    tips: [
                        "凭证内容说明：",
                        "二甲医院以上病例、诊断证明书、不适宜乘机证明",
                        `凭证总大小不能超过1MB`,
                    ],
                    refundType: 2, //非自愿退票
                },
            },
            uploadDefault: [],
            uploadResult: [],
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
        getCardTypeName(cardType) {
            return utils.getCardTypeName(parseInt(cardType));
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
         * 确认退票
         */
        saveData() {
            let that = this;
            if (
                this.refundReasonList[this.refundReason].attachment &&
                (!this.uploadResult ||
                    this.uploadResult.filter((file) => {
                        return file.status != "finished";
                    }).length == 0)
            ) {
                utils.showToast("请上传凭证");
                return;
            }
            travelfun.showConfirm(
                "确定提交退票申请？",
                function () {
                    that.submitRefund();
                },
                2,
                "取消",
                "确定",
                null,
                function () {},
                true
            );
        },
        submitRefund() {
            let that = this;
            let sucessMsg = "退票成功";
            let obj = {
                actorId: tmHandler.userInfo.userId,
                actorName: tmHandler.userInfo.mgrName,
                orderNo: that.orderBase.orderNo,
                psgIDs: that.passenger.psgId,
                psgNames: that.passenger.psgName,
                refundType: that.refundReasonList[that.refundReason].refundType,
                airLineIDs: that.ticket.isGaiOrder
                    ? that.ticket.gaiOrder.oldAirlineIds
                    : that.ticket.airLineID, //改签航班也要用原始航班的id
                remark: that.refundReasonList[that.refundReason].text,
                path: that.uploadResult,
                chaAirLineIDs: that.ticket.isGaiOrder
                    ? that.ticket.airLineID
                    : null, //如果是改签单，传入改签航班id，腾邦要用
                chaOrderNo: that.ticket.isGaiOrder
                    ? that.ticket.gaiOrder.chaOrderNo
                    : null, //如果是改签单，传入改签单号，腾邦要用
            };
            const defaultErrorMsg = "退票失败";
            that.isLoading = true;
            tmHandler
                .applyFlightRefund(obj)
                .then((res) => {
                    that.isLoading = false;
                    if (res.result.success) {
                        that.$emit("submitManualRefund");
                        utils.showToast(sucessMsg);
                    } else {
                        utils.showToast(
                            !!res.rdesc ? res.rdesc : defaultErrorMsg
                        );
                    }
                })
                .catch((error) => {
                    that.isLoading = false;
                    console.info(error);
                    utils.showToast(defaultErrorMsg);
                });
        },
        /**
         * 上传组件的输出，当有文件上传或者删除的时候会自动触发
         */
        fileUpChange(uploadFileList, index) {
            if (uploadFileList && uploadFileList.length > 0) {
                this.uploadResult = [];
                uploadFileList.forEach((element) => {
                    this.uploadResult.push(element.url);
                });
            } else {
                this.uploadResult = [];
            }
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
                .inSelect {
                    width: 350px;
                }
                .uploadtips {
                    word-break: break-all;
                    color: #888b8c;
                }
            }
            .amountTotal {
                color: #888b8c;
                border: solid 1px #e2e2e2;
                border-radius: 5px;
                background: #f6fbfe;
            }
        }
        .bookBtnWrap {
            position: relative;
            margin-bottom: 10px;
            .addReceodShow {
                position: absolute;
                display: none;
                top: 25px;
                left: -360px;
                // height: 35px;
                line-height: 20px;
                width: 360px;
                padding: 15px;
                box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
                background: #fff;
                z-index: 1;
                border-radius: 5px;
                .htitle {
                    font-weight: 600;
                    font-size: 16px;
                }
                .content {
                    color: #7f7f7f;
                    text-align: center;
                    font-size: small;
                }
            }
        }
        .bookBtnWrap:hover .addReceodShow {
            display: block;
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




