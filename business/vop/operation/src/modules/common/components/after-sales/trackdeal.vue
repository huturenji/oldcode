<template>
    <div class="track-deal">
        <!-- <el-row class="deal-info">
            <el-col :span="3">处理方式:</el-col>
            <el-col :span="12" >
                <el-radio-group v-model="radio">
                    <el-radio label="update">更新服务单信息</el-radio>
                    <el-radio label="refund">退款</el-radio>
                    <el-radio label="exchange">换货</el-radio>
                </el-radio-group>
            </el-col>
        </el-row> -->
        <el-form
            ref="radio"
            label-width="120px"
            :model="radio"
            :rules="ruleRadioValidate"
        >
            <el-form-item
                label="处理方式:"
                prop="radio"
            >
                <el-radio-group v-model="radio.radio">
                    <el-radio label="update">
                        更新服务单信息
                    </el-radio>
                    <el-radio label="refund">
                        退款
                    </el-radio>
                    <el-radio label="exchange">
                        换货
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <el-form
            ref="update"
            label-width="120px"
            :model="dealValidate[radio.radio]"
            :rules="ruleDealValidate"
        >
            <el-form-item
                class="check-more"
                v-if="radio.radio=='update'"
            >
                <el-checkbox v-model="needUpdate">
                    无需更新处理结果和内容
                </el-checkbox>
            </el-form-item>
            <el-form-item
                v-show="!needUpdate||radio.radio!='update'"
                label="处理结果:"
                prop="operateResult"
            >
                <el-input
                    maxlength="100"
                    v-model="dealValidate[radio.radio].operateResult"
                    placeholder="请输入处理结果"
                ></el-input>
            </el-form-item> 
            <el-form-item
                v-show="!needUpdate||radio.radio!='update'"
                label="处理内容:"
                prop="operateContent"
            >
                <el-input 
                    :rows="3" 
                    maxlength="500"
                    show-word-limit 
                    v-model="dealValidate[radio.radio].operateContent" 
                    type="textarea" 
                    placeholder="请输入处理内容"
                ></el-input>
            </el-form-item>
            <el-form-item class="check-more">
                <el-checkbox v-model="dealValidate[radio.radio].needMore">
                    需用户提供更多信息
                </el-checkbox>
                <span v-if="dealValidate[radio.radio].needMore">(信息内容:<el-checkbox v-model="dealValidate[radio.radio].needMore">发运单信息</el-checkbox>)</span>
            </el-form-item>
        </el-form>
        <el-form
            ref="refund"
            v-if="radio.radio=='refund'"
            :model="dealValidate['refund']"
            :rules="ruleDealValidate"
            label-width="120px"
        >
            <el-form-item label="供应商结算金额:">
                <el-input
                    class="disable"
                    v-model="spSettleTotalText"
                    placeholder="￥0.00"
                    readonly
                ></el-input>
            </el-form-item> 
            <el-form-item label="供应商退款金额:">
                <el-input
                    class="disable"
                    v-model="spPayment"
                    readonly
                ></el-input>
            </el-form-item> 
            <el-form-item label="客户实付金额:">
                <el-input
                    class="disable"
                    v-model="customerPayment"
                    placeholder="￥0.00"
                    readonly
                ></el-input>
            </el-form-item> 
            <el-form-item
                label="退款金额:"
                prop="refundableAmount"
            >
                <el-input
                    v-model="dealValidate[radio.radio].refundableAmount"
                    placeholder="￥0.00"
                ></el-input>
            </el-form-item> 
        </el-form>
        <el-form
            ref="exchange"
            v-if="radio.radio=='exchange'"
            :model="dealValidate['exchange']"
            :rules="ruleDealValidate"
            label-width="120px"
        >
            <el-form-item label="商品名称:">
                <el-input
                    class="disable"
                    v-model="orderInfo.wareName"
                    readonly
                ></el-input>
            </el-form-item>
            <el-form-item label="销售单价:">
                <el-input
                    class="disable"
                    placeholder="￥0.00"
                    v-model="orderInfo.unitPrice"
                    readonly
                ></el-input>
            </el-form-item>  
            <el-form-item label="数量:">
                <el-input
                    class="disable"
                    v-model="transmitInfo.skuNum"
                    readonly
                ></el-input>
            </el-form-item>
            <el-form-item label="联系信息:">
                <el-row class="customer-wrapper">
                    <el-input
                        class="customer-name disable"
                        readonly
                        v-model="transmitInfo.customerContactName"
                    ></el-input><i class="to-contact">--</i><el-input
                        class="customer-contact disable"
                        readonly
                        v-model="transmitInfo.customerMobilePhone"
                    ></el-input>
                </el-row>
            </el-form-item>
            <el-form-item label="收货地址:">
                <el-input
                    class="disable"
                    v-model="transmitInfo.returnwareAddress"
                    readonly
                ></el-input>
            </el-form-item>
            <el-form-item label="供应商:">
                <el-input
                    class="disable"
                    v-model="supplierInfo.simpleName"
                    readonly
                ></el-input>
            </el-form-item>
            <el-form-item
                label="供应商订单号:"
                prop="spOrderId"
            >
                <el-input
                    placeholder="请输入供应商订单号"
                    v-model="dealValidate[radio.radio].spOrderId"
                ></el-input>
            </el-form-item>
        </el-form>
        <el-form label-width="120px">
            <el-form-item label="备注:">
                <el-input 
                    maxlength="200"
                    show-word-limit 
                    :rows="3" 
                    v-model="dealValidate[radio.radio].operateDesc" 
                    type="textarea" 
                    placeholder="请输入备注"
                ></el-input>
            </el-form-item>
            <el-form-item class="big-btn">
                <el-button
                    type="primary"
                    @click="preConfirm"
                >
                    提交
                </el-button>
                <el-button
                    type="info"
                    @click="preCancel"
                >
                    取消
                </el-button>
            </el-form-item>
        </el-form>
        <el-dialog
            title="确定提交该服务单？"
            center
            class="deal-dialog"
            :modal-append-to-body="false"
            :visible.sync="actionsever"
            :close-on-click-modal="false"
        >
            <div
                style="text-align: center;"
                slot="footer"
                class="big-btn"
            >
                <el-button
                    type="info"
                    @click="actionsever = false"
                >
                    取消
                </el-button>
                <el-button
                    :loading="loading"
                    type="primary"
                    @click="confirm"
                >
                    确定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="确定取消该服务单？"
            center
            class="deal-dialog"
            :modal-append-to-body="false"
            :visible.sync="cancelsever"
            :close-on-click-modal="false"
        >
            <p>取消后，该渠服务单将返回至服务单池中重新处理</p>
            <div
                style=" text-align: center;"
                slot="footer"
                class="big-btn"
            >
                <el-button
                    type="info"
                    @click="cancelsever = false"
                >
                    取消
                </el-button>
                <el-button
                    :loading="loading"
                    type="primary"
                    @click="cancel"
                >
                    确定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="确定不更新处理结果和内容？"
            center
            class="deal-dialog"
            :visible.sync="updateserver"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
        >
            <p>确定后，该服务单将不会更新当前进度信息</p>
            <div
                style=" text-align: center;"
                slot="footer"
                class="big-btn"
            >
                <el-button
                    type="info"
                    @click="updateserver = false"
                >
                    取消
                </el-button>
                <el-button
                    :loading="loading"
                    type="primary"
                    @click="confirm"
                >
                    确定
                </el-button>
            </div>
        </el-dialog>
        <auth-tip
            ref="authTip"
            :tips="tips"
            @confirm="confirmAuth"
        ></auth-tip>
    </div>
</template>
<script>
import accounting from "accounting";
import { mapGetters } from "vuex";
import utils from "bislibs/utils";
import AuthTip from "./AuthTip";
export default {
    components: {
        AuthTip
    },
    props: {
        orderInfo: {
            type: Object,
            default: () => {}
        },
        transmitInfo: {
            type: Object,
            default: () => {}
        },
        supplierInfo: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        var checkAmount = (rule, value, callback) => {
            let pattern = /(^[\d]|^[1-9][\d]*)($|[\.][\d]{0,2}$)/;
            if (value == "" || value == undefined) {
                callback(new Error("退款金额不能为空"));
            } else if (!pattern.test(value)) {
                callback(new Error("请输入正确的金额,保留两位小数"));
            // } else if (Number(value) == 0) { //20201230 因为赠品需要退款，所以要支持0元
            //     callback(new Error("退款金额不能为0元"));
            } else if (Number(value) > Number(this.payment)) {
                callback(new Error("退款金额不能大于客户实付金额"));
            } else {
                callback();
            }
        };
        var checkRadio = (rule, value, callback) => {
            if (value == "" || value == undefined || value == "default") {
                callback(new Error("处理方式不能为空"));
            } else {
                callback();
            }
        };
        return {
            radio: { radio: "default" },
            tips: {
                title: "权限确认",
                content: "暂无使用权限，如有需要请联系管理员开通"
            },
            actionsever: false,
            cancelsever: false,
            needUpdate: false,
            updateserver: false,
            updateValite: true,
            radioValite: true,
            dealValidate: {
                default: {
                    needMore: false
                },
                update: {
                    needMore: false
                },
                refund: {
                    needMore: false
                },
                exchange: {
                    needMore: false
                }
            },
            ruleRadioValidate: {
                radio: [
                    {
                        required: true,
                        validator: checkRadio,
                        trigger: "change"
                    }
                ]
            },
            ruleDealValidate: {
                operateResult: [
                    {
                        required: true,
                        message: "处理结果不能为空",
                        trigger: "change"
                    }
                ],
                operateContent: [
                    {
                        required: true,
                        message: "处理内容不能为空",
                        trigger: "change"
                    }
                ],
                refundableAmount: [
                    {
                        required: true,
                        validator: checkAmount,
                        trigger: ["blur", "change"]
                    }
                ],
                spOrderId: [
                    {
                        required: true,
                        message: "供应商订单号不能为空",
                        trigger: "change"
                    }
                ]
            }
        };
    },
    computed: {
        ...mapGetters(["loading"]),
        spPayment() {
            return `${accounting.formatMoney(
                this.transmitInfo.spRefundAmount,
                "",
                2,
                ""
            )}元`;
        },
        spSettleTotalMoney() {
            return `${accounting.formatMoney(
                this.$math
                    .chain(this.orderInfo.purchasePrice)
                    .multiply(this.transmitInfo.skuNum)
                    .add(this.orderInfo.freight)
                    .done(),
                "",
                2,
                ""
            )}元`;
        },
        freight() {
            return `${accounting.formatMoney(
                this.orderInfo.freight,
                "",
                2,
                ""
            )}元`;
        },
        spSettleTotalText() {
            let settle = accounting.formatMoney(
                this.$math
                    .chain(this.orderInfo.purchasePrice)
                    .multiply(this.transmitInfo.skuNum)
                    .done(),
                "",
                2,
                ""
            );
            return `${this.spSettleTotalMoney} = 结算价${settle}元 + 运费（折算后）${this.freight}`;
        },
        payment() {
            return accounting.formatMoney(
                this.$math
                    .chain(this.orderInfo.unitPrice)
                    .multiply(this.transmitInfo.skuNum)
                    .subtract(this.orderInfo.discount)
                    .add(this.orderInfo.freight)
                    .done(),
                "",
                2,
                ""
            );
        },
        customerPayment() {
            let payment = accounting.formatMoney(
                this.$math
                    .chain(this.orderInfo.unitPrice)
                    .multiply(this.transmitInfo.skuNum)
                    .subtract(this.orderInfo.discount)
                    .add(this.orderInfo.freight)
                    .done(),
                "",
                2,
                ""
            );
            let saleTotal = accounting.formatMoney(
                this.$math
                    .chain(this.orderInfo.unitPrice)
                    .multiply(this.transmitInfo.skuNum)
                    .done(),
                "",
                2,
                ""
            );
            let discount = accounting.formatMoney(
                this.orderInfo.discount,
                "",
                2,
                ""
            );
            return `${payment}元 = 销售总价${saleTotal}元 - 优惠金额（折算后）${discount}元 + 运费（折算后）${this.freight}`;
        }
    },
    methods: {
        /**
         * 提交前字段校验
         */
        preConfirm() {
            //处理服务单权限控制
            if (!utils.hasAuth('showDealServiceAuth')) {
                this.$refs.authTip.showAuth = true;
                return;
            }
            //无需更新处理结果和内容
            if (this.needUpdate && this.radio.radio == "update") {
                this.updateserver = true;
                this.$delete(this.dealValidate["update"], "operateResult");
                this.$delete(this.dealValidate["update"], "operateContent");
                return;
            }
            //校验是否选择处理方式
            this.$refs.radio.validate(valid => {
                if (valid) {
                    this.radioValite = true;
                } else {
                    this.radioValite = false;
                    return false;
                }
            });
            //校验是否填写处理结果和内容
            this.$refs.update.validate(valid => {
                if (valid) {
                    this.radioValite && (this.actionsever = true);
                    this.updateValite = true;
                } else {
                    this.updateValite = false;
                    return false;
                }
            });

            this.radio.radio !== "default" &&
                this.radio.radio !== "update" &&
                this.$refs[this.radio.radio].validate(valid => {
                    if (valid) {
                        this.radioValite &&
                            this.updateValite &&
                            (this.actionsever = true);
                    } else {
                        return false;
                    }
                });
        },
        /**
         *取消前重置字段
         */
        preCancel() {
            this.cancelsever = true;
        },
        /**
         * 确定操作
         */
        confirm() {
            this.$bus.$emit("on-confirm", {
                radio: this.radio.radio,
                dealInfo: this.dealValidate[this.radio.radio]
            });
        },
        /**
         * 权限弹框确认
         */
        confirmAuth() {
            this.$refs.authTip.showAuth = false;
        },
        /**
         * 取消操作
         */
        cancel() {
            this.$bus.$emit("on-cancel");
        }
    },
    watch: {
        "radio.radio"(newVal, oldVal) {
            this.$refs["radio"].clearValidate();
            this.$refs["update"].clearValidate();
            oldVal !== "default" && this.$refs[oldVal].clearValidate();
        }
    }
};
</script>
<style lang="less">
 
.track-deal {
    .deal-info {
        padding: 0 0 20px 49px;
        .el-col-3 {
            width: 70px;
            color: #333;
        }
        .el-col-12 {
            width: unset;
        }
    }
    .check-more {
        margin: -10px 0 10px 0;
    }
    .deal-dialog {
        .el-dialog {
            width: 500px;
        }
    }
    .customer-wrapper {
        display: flex;
        .customer-name {
            flex: 1;
        }
        .customer-contact {
            flex: 1;
        }
    }
    .to-contact {
        margin: 0 8px;
    }
    .disable {
        .el-input__inner {
            background-color: #fafafa;
        }
    }
}
</style>