<template>
    <div class="service-deal">
        <label class="title">{{ title }}</label>
        <el-row class="deal-info">
            <el-col :span="3">
                处理方式:
            </el-col>
            <el-col :span="12">
                <el-radio-group v-model="radio">
                    <el-radio label="transmit">
                        转交供应商
                    </el-radio>
                    <el-radio label="approve">
                        审批未通过
                    </el-radio>
                </el-radio-group>
            </el-col>
        </el-row>
        <el-form
            ref="transmit"
            class="form-info"
            label-position="right"
            v-if="radio=='transmit'"
            :model="dealInfo['transmit']"
            :rules="ruleTransmitValidate"
            label-width="100px"
        >
            <el-form-item
                class="input-padding"
                label="申请原因:"
                prop="applyReasonType"
            >
                <el-input
                    maxlength="100"
                    v-model="dealInfo['transmit'].applyReasonType"
                    placeholder="请输入申请原因"
                ></el-input>
            </el-form-item>
            <el-form-item
                class="input-padding"
                label="原因描述:"
                prop="questionDesc"
            >
                <el-input 
                    maxlength="500"
                    show-word-limit 
                    v-model="dealInfo['transmit'].questionDesc" 
                    type="textarea" 
                    :rows="3" 
                    placeholder="请输入原因描述"
                ></el-input>
            </el-form-item>
            <el-form-item
                class="photo-wrapper"
                label="凭证:"
            >
                <preview :data="dealInfo['transmit'].questionPic"></preview>
            </el-form-item>
            <el-form-item
                class="input-padding"
                label="商品返回方式:"
            >
                <el-input
                    class="disable"
                    v-model="dealInfo['transmit'].pickwareType"
                    readonly
                ></el-input>
            </el-form-item>
            <el-form-item
                class="input-padding"
                label="收货地址:"
            >
                <el-input
                    class="disable"
                    v-model="dealInfo['transmit'].returnwareAddress"
                    readonly
                ></el-input>
            </el-form-item>
            <el-form-item
                v-if="dealInfo['transmit'].pickwareType!='客户发货'"
                class="input-padding"
                label="取件地址:"
            >
                <el-input
                    v-model="dealInfo['transmit'].pickwareAddress"
                    readonly
                ></el-input>
            </el-form-item>
            <el-form-item
                class="input-padding"
                label="联系信息:"
                prop="customerContactName"
            >
                <el-row class="customer-wrapper">
                    <el-input
                        class="customer-name"
                        placeholder="请输入联系人姓名"
                        v-model="dealInfo['transmit'].customerContactName"
                    ></el-input><i class="to-contact">--</i><el-input
                        ref="phone"
                        class="customer-contact"
                        placeholder="请输入联系人电话"
                        v-model="dealInfo['transmit'].customerMobilePhone"
                    ></el-input>
                </el-row>
            </el-form-item>
        </el-form>
        
        <el-form
            ref="approve"
            class="approval-form"
            v-if="radio=='approve'"
            label-width="100px"
            :model="dealInfo['approve']"
            :rules="ruleApproveValidate"
        >
            <el-form-item
                class="deal-result"
                label="处理结果:"
                prop="operateResult"
            >
                <el-input
                    maxlength="100"
                    v-model="dealInfo['approve'].operateResult"
                    placeholder="请输入处理结果"
                ></el-input>
            </el-form-item> 
            <el-form-item
                label="处理原因:"
                prop="operateReason"
            >
                <el-input 
                    maxlength="500"
                    show-word-limit 
                    :rows="3"
                    v-model="dealInfo['approve'].operateReason" 
                    type="textarea" 
                    placeholder="请输入处理原因"
                ></el-input>
            </el-form-item>
        </el-form>
        
        <el-form
            class="note-form"
            label-width="100px"
        >
            <el-form-item
                label="备注:"
                :class="{'note-wrapper':radio=='transmit'}"
            >
                <el-input 
                    maxlength="200"
                    show-word-limit 
                    v-model="dealInfo[radio].operateDesc" 
                    :rows="3"
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
            class="deal-dialog"
            center
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
            <p>取消后，该服务单将返回至服务单池中重新处理</p>
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
        <auth-tip
            ref="authTip"
            :tips="tips"
            @confirm="confirmAuth"
        ></auth-tip>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import utils from "bislibs/utils";
import AuthTip from "./AuthTip";
import Preview from "./Preview";
export default {
    components: {
        AuthTip,
        Preview
    },
    props: {
        title: {
            type: String,
            default: ""
        },
        dataList: {
            type: Array,
            default: () => []
        },
        transmitInfo: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        var checkCustomer = (rule, value, callback) => {
            let phone = this.$refs.phone.value;
            if (value && phone) {
                callback();
            } else {
                if (!value) {
                    callback(new Error("联系信息不能为空"));
                }
                if (!phone) {
                    callback(new Error("联系信息不能为空"));
                }
            }
        };

        return {
            tips: {
                title: "权限确认",
                content: "暂无使用权限，如有需要请联系管理员开通"
            },
            cancelsever: false,
            actionsever: false,
            radio: "transmit",
            dealInfo: {
                transmit: Object.assign({}, this.transmitInfo),
                approve: {}
            },
            ruleApproveValidate: {
                operateReason: [
                    {
                        required: true,
                        message: "处理原因不能为空",
                        trigger: "change"
                    }
                ],
                operateResult: [
                    {
                        required: true,
                        message: "处理结果不能为空",
                        trigger: "change"
                    }
                ]
            },
            ruleTransmitValidate: {
                applyReasonType: [
                    {
                        required: true,
                        message: "申请原因不能为空",
                        trigger: "change"
                    }
                ],
                questionDesc: [
                    {
                        required: true,
                        message: "原因描述不能为空",
                        trigger: "change"
                    }
                ],
                customerContactName: [
                    {
                        required: true,
                        validator: checkCustomer,
                        trigger: "change"
                    }
                ]
            }
        };
    },
    computed: {
        ...mapGetters(["loading"])
    },
    methods: {
        /**
         * 提交前字段校验
         */
        preConfirm() {
            if (!utils.hasAuth('showDealServiceAuth')) {
                this.$refs.authTip.showAuth = true;
                return;
            }
            this.$refs[this.radio].validate(valid => {
                if (valid) {
                    this.actionsever = true;
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
         * 权限弹框确认
         */
        confirmAuth() {
            this.$refs.authTip.showAuth = false;
        },
        /**
         * 确定操作
         */
        confirm() {
            this.$bus.$emit("on-confirm", {
                radio: this.radio,
                dealInfo: this.dealInfo[this.radio]
            });
        },
        /**
         * 取消操作
         */
        cancel() {
            this.$bus.$emit("on-cancel");
        }
    },
    watch: {
        radio(newVal, oldVal) {
            this.$refs[oldVal].clearValidate();
        }
    }
};
</script>
<style lang="less">
 
.service-deal {
    flex: 1;
    border-left: 1px solid #f0f2f5;
    .title {
        padding: 0 32px;
    }
    .deal-info {
        padding: 20px 56px 10px 56px;
        .el-col-3 {
            width: 70px;
        }
    }
    .photo-wrapper {
        padding: 6px 0 8px 0;
        .el-form-item__content {
            line-height: normal;
        }
    }
    .form-info {
        padding: 0 26px;
        .el-form-item {
            margin-bottom: 0;
        }

        .note {
            padding: 11px 0 22px 0;
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
        .input-padding {
            padding: 11px 0;
        }
    }
    .approval-form {
        padding: 0 26px;
        .deal-result {
            padding-top: 15px;
        }
    }
    .note-form {
        padding: 0 26px;
    }
    .to-contact {
        margin: 0 8px;
    }
    .deal-dialog {
        .el-dialog {
            width: 500px;
        }
    }
    .disable {
        .el-input__inner {
            background-color: #fafafa;
        }
    }
    .note-wrapper {
        margin-top: 11px;
    }
    // .operate-btn {
    //     padding: 16px 57px;
    // }
}
</style>