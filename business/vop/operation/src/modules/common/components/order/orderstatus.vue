<template>
    <div class="order-status">
        <div class="status">
            <div class="bp-status">
                <div class="status-top">
                    <label class="title">订单状态</label>
                    <div
                        class="right-btn smaller-btn"
                        v-if="orderType=='SALE'&&showUpdateAuth"
                    >
                        <el-button
                            plain
                            v-if="orderState.orderState=='UNPAID'"
                            @click.native="showAmount=true"
                        >
                            修改价格
                        </el-button>
                        <!-- <el-button @click.native="showState=true" type="primary">修改状态</el-button> -->
                    </div>
                </div>
                <div class="status-bottom">
                    <!-- <label :class="orderState.orderState">{{ orderStateMap[orderState.orderState] }}</label>
                    <span v-if="orderState.orderStateRemark" class="state-remark">{{ orderState.orderStateRemark }}</span> -->
                    <!-- <label :class="orderState.orderState">{{ orderStateMap[orderState.orderState] }}</label> -->
                    <span class="state-remark">{{ orderState.orderState }}</span>
                    <span>{{ orderState.updateTime }}</span>
                </div>
            </div>             
        </div>
        <el-dialog
            title="修改状态"
            @close="cancel('ORDER_STATE')"
            :visible.sync="showState"
            class="custom-dialog"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
        >
            <el-form 
                label-width="110px" 
                ref="ORDER_STATE" 
                :model="validate['ORDER_STATE']" 
                :rules="ruleStateValidate"
            >
                <el-form-item
                    label="B+订单状态:"
                    prop="ORDER_STATE"
                >
                    <el-select v-model="validate['ORDER_STATE'].ORDER_STATE">
                        <el-option
                            v-for="item in stateList"
                            :label="item.title"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input 
                        maxlength="200"
                        show-word-limit
                        v-model="remark.ORDER_STATE" 
                        type="textarea" 
                        :rows="3" 
                        placeholder="请输入备注"
                    />
                </el-form-item>
            </el-form>
            <div
                slot="footer"
                class="big-btn"
            >
                <el-button
                    type="primary"
                    @click="confirmModify('ORDER_STATE')"
                >
                    确定
                </el-button>
                <el-button
                    type="info"
                    @click="cancel('ORDER_STATE')"
                >
                    取消
                </el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="修改金额"
            @close="cancel('DISCOUNT_AMOUNT')"
            :visible.sync="showAmount"
            class="custom-dialog"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
        >
            <el-form  
                label-width="110px" 
                ref="DISCOUNT_AMOUNT" 
                :model="validate['DISCOUNT_AMOUNT']" 
                :rules="ruleAmountValidate"
            >
                <el-form-item label="销售总额:">
                    <el-input
                        class="disable"
                        v-model="totalAmount"
                        readonly
                    />
                </el-form-item>
                <el-form-item
                    label="优惠金额:"
                    prop="DISCOUNT_AMOUNT"
                >
                    <el-input 
                        autocomplete="off" 
                        v-model="validate['DISCOUNT_AMOUNT'].DISCOUNT_AMOUNT" 
                        @input="changeInput"
                        placeholder="0.00"
                    />
                </el-form-item>
                <el-form-item label="销售实付金额:">
                    <el-input
                        class="disable"
                        v-model="paymentAmount"
                        readonly
                    />
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input 
                        maxlength="200"
                        show-word-limit
                        v-model="remark.DISCOUNT_AMOUNT" 
                        type="textarea" 
                        :rows="3" 
                        placeholder="请输入备注"
                    />
                </el-form-item>
            </el-form>
            <div
                slot="footer"
                class="big-btn"
            >
                <el-button
                    type="primary"
                    :loading="loading"
                    @click="confirmModify('DISCOUNT_AMOUNT')"
                >
                    确定
                </el-button>
                <el-button
                    type="info"
                    @click="cancel('DISCOUNT_AMOUNT')"
                >
                    取消
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import utils from "bislibs/utils";
import accounting from "accounting";
import { mapGetters } from "vuex";
export default {
    props: {
        title: {
            type: String,
            default: ""
        },
        orderState: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        var checkAmount = (rule, value, callback) => {
            let pattern = /(^[\d]|^[1-9][\d]*)($|[\.][\d]{0,2}$)/;
            if (value === "") {
                callback(new Error("优惠金额不能为空"));
            } else if (!pattern.test(value)) {
                callback(new Error("请输入正确的金额,保留两位小数"));
            } else if (
                Number(value) >
                this.$math
                    .chain(this.orderState.productTotal)
                    .add(this.orderState.freight)
            ) {
                callback(new Error("优惠金额不能大于销售实付金额"));
            } else {
                callback();
            }
        };
        return {
            showUpdateAuth: utils.hasAuth('showUpdateAuth'),
            loading: false,
            showState: false,
            orderStateMap: utils.orderStateMap,
            operateAmount: {
                paymentAmount: ""
            },
            validate: {
                ORDER_STATE: { ORDER_STATE: "" },
                DISCOUNT_AMOUNT: {
                    DISCOUNT_AMOUNT: ""
                }
            },
            remark: {
                ORDER_STATE: "",
                DISCOUNT_AMOUNT: ""
            },
            stateList: [
                { title: "待付款", value: "UNPAID" },
                // { title: "待发货", value: "WAIT_FOR_DELIVERY" },
                { title: "待收货", value: "WAIT_TO_SIGN" },
                { title: "已完成", value: "COMPLETED" },
                { title: "已拆单", value: "SEPARATED" },
                // { title: "已关闭", value: "CLOSED" },
                { title: "已取消", value: "CANCELLED" }
            ],
            ruleStateValidate: {
                ORDER_STATE: [
                    {
                        required: true,
                        message: "订单状态不能为空",
                        trigger: "change"
                    }
                ]
            },
            showAmount: false,
            ruleAmountValidate: {
                DISCOUNT_AMOUNT: [
                    {
                        required: true,
                        validator: checkAmount,
                        trigger: ["blur", "change"]
                    }
                    // {
                    //     required: true,
                    //     pattern: /(^[\d]|^[1-9][\d]*)($|[\.][\d]{0,2}$)/,
                    //     message: "请输入正确的金额,保留两位小数",
                    //     trigger: ["blur", "change"]
                    // },
                    // {
                    //     required: true,
                    //     validator: checkAmount,
                    //     message: "请输入正确的金额,保留两位小数",
                    //     trigger: ["blur", "change"]
                    // }
                ]
            }
        };
    },
    computed: {
        ...mapGetters(["orderType"]),
        totalAmount() {
            return accounting.formatMoney(this.orderState.productTotal, {
                symbol: "元",
                format: "%v %s"
            });
        },
        paymentAmount() {
            return accounting.formatMoney(this.operateAmount.paymentAmount, {
                symbol: "元",
                format: "%v %s"
            });
        }
    },
    methods: {
        /**
         * 更新金额
         */
        changeInput(value) {
            if (
                (value == "" || Number(value)) &&
                Number(value) <=
                    this.$math
                        .chain(this.orderState.productTotal)
                        .add(this.orderState.freight)
            ) {
                this.operateAmount.paymentAmount = this.$math
                    .chain(this.orderState.productTotal)
                    .add(this.orderState.freight)
                    .subtract(Number(value))
                    .done();
            }
        },
        /**
         * 校验表单字段
         */
        formValidate(name) {
            return this.$refs[name].validate(valid => {
                if (valid) {
                    return true;
                } 
                return false;
                
            });
        },
        /**
         * 确定修改
         */
        confirmModify(type) {
            this.$refs[type].validate(valid => {
                if (valid) {
                    this.$emit("on-confirm", {
                        type,
                        value: this.validate[type][type],
                        remark: this.remark[type]
                    });
                } else {
                    return false;
                }
            });
        },
        /**
         * 取消
         */
        cancel(type) {
            this.close();
            setTimeout(() => {
                this.remark[type] = "";
                this.$refs[type].resetFields();
                if (type == "DISCOUNT_AMOUNT") {
                    this.operateAmount.paymentAmount = this.orderState.paymentAmount;
                    this.validate[
                        "DISCOUNT_AMOUNT"
                    ].DISCOUNT_AMOUNT = accounting.formatMoney(
                        this.orderState.discountTotal,
                        "",
                        2,
                        ""
                    );
                }
            }, 500);
        },
        /**
         * 关闭弹框
         */
        close() {
            this.showState = false;
            this.showAmount = false;
        }
    },
    watch: {
        "orderState.orderState"(newVal) {
            this.validate["ORDER_STATE"].ORDER_STATE = newVal;
        },
        "orderState.paymentAmount"(newVal) {
            this.operateAmount.paymentAmount = newVal;
        },
        "orderState.discountTotal"(newVal) {
            this.validate[
                "DISCOUNT_AMOUNT"
            ].DISCOUNT_AMOUNT = accounting.formatMoney(
                !newVal ? 0 : newVal,
                "",
                2,
                ""
            );
        }
    }
};
</script>
<style lang="less">
.order-status {
    padding: 16px 0 32px 0;
    background-color: #fff;
    margin-bottom: 16px;
    border-radius: 8px;
    .status {
        display: flex;
        .bp-status {
            flex: 1;
            .status-top {
                padding: 0 32px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }
        .status-bottom {
            margin-top: 8px;
            border-top: 1px solid #eee;
            padding: 24px 0 0 56px;
            display: flex;
            align-items: flex-end;
            // flex-direction: column;
            label {
                font-size: 18px;
            }
            .state-remark {
                margin-top: 8px;
                font-size: 36px;
                font-weight: 700;
                margin-right: 20px;
            }
        }
    }
    .custom-dialog {
        .el-dialog {
            min-width: 600px;
        }
        .el-dialog__body {
            margin: 0 auto;
        }
        .el-form-item__content {
            width: 360px;
        }
        .el-select {
            width: 360px;
        }
        .el-dialog__footer,
        .el-dialog__header {
            text-align: center;
        }
    }
    .disable {
        .el-input__inner {
            background-color: #fafafa;
        }
    }
    .UNPAID{
        color: #ff4e3a;
    }
    .WAIT_TO_SIGN {
        color: #f8a339;
    }
    .COMPLETED,
    .SEPARATED {
        color: #23b45d;
    }
    .CANCELLED {
        color: #999999;
    }
}
</style>