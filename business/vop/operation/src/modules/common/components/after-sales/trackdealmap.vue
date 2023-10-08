<template>
    <div class="track-deal">
        <!-- 确认或取消售后申请 -->
        <el-form
            ref="confirm"
            v-if="serviceStatus=='1'"
            label-width="120px"
            :model="dealValidate['update']"
            :rules="ruleDealValidate"
        >
            <div>客服确认</div>
            <el-form-item label="售后意见:">
                <el-input 
                    :rows="3" 
                    v-model="remark" 
                    type="textarea" 
                    placeholder="请输入售后意见"
                ></el-input>
            </el-form-item>
            <el-form-item class="big-btn">
                <el-button
                    type="primary"
                    @click="setApplytype(1)"
                >
                    确认受理
                </el-button>
                <el-button
                    type="info"
                    @click="setApplytype(0)"
                >
                    取消受理
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 退款的售后申请 -->
        <el-form
            ref="refund"
            v-if="serviceStatus=='4' && refundTaskAuth"
            :rules="ruleDealValidate"
            label-width="120px"
        >
            <div>确认退款</div>
            <el-form-item label="商品名称:">
                <el-input
                    v-if="orderInfo.refundDetailInfoList"
                    class="disable"
                    v-model="orderInfo.refundDetailInfoList[0].productName"
                    readonly
                ></el-input>
            </el-form-item> 
            <el-form-item label="退款金额:">
                <el-input
                    v-if="orderInfo.refundDetailInfoList"
                    class="disable"
                    v-model="orderInfo.refundDetailInfoList[0].refundPrice"
                    placeholder="￥0.00"
                    readonly
                ></el-input>
            </el-form-item> 
            <el-form-item label="退款方式:">
                <el-input
                    v-if="orderInfo.refundDetailInfoList"
                    class="disable"
                    v-model="orderInfo.refundDetailInfoList[0].refundWayName"
                    placeholder="￥0.00"
                    readonly
                ></el-input>
            </el-form-item> 
            <el-form-item label="状态:">
                <el-input
                    v-if="orderInfo.refundDetailInfoList"
                    class="disable"
                    v-model="orderInfo.refundDetailInfoList[0].statusName"
                    readonly
                ></el-input>
            </el-form-item> 
            <el-form-item class="big-btn">
                <el-button
                    type="primary"
                    @click="showReactivate = true"
                >
                    退款
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 换货的售后申请，填写商家收货信息 -->
        <el-form
            ref="exchange"
            v-if="serviceStatus=='2'"
            :rules="ruleDealValidate"
            label-width="120px"
        >
            <div>填写寄回地址</div>
            <el-form-item
                label="联系人:"
                required
            >
                <el-input v-model="sendBackDetail.contactName"></el-input>
            </el-form-item>
            <el-form-item
                label="手机号:"
                required
            >
                <el-input v-model="sendBackDetail.mobilePhone"></el-input>
            </el-form-item>  
            <el-form-item
                label="售后地址:"
                required
            >
                <el-input v-model="sendBackDetail.address"></el-input>
            </el-form-item>
            <el-form-item label="邮编:">
                <el-input v-model="sendBackDetail.postcode"></el-input>
            </el-form-item> 
            <el-form-item class="big-btn">
                <el-button
                    type="primary"
                    @click="preConfirm(2)"
                >
                    确认提交
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 商家的运单信息 -->
        <el-form
            ref="exchange"
            v-if="serviceStatus=='3'"
            :rules="ruleDealValidate"
            label-width="120px"
        >
            <div>填写商家返件运单信息</div>

            <el-form-item
                label="承运快递:"
                required
            >
                <!-- <el-input placeholder="请输入快递公司" v-model="expressCompany"></el-input> -->
                <el-select
                    style="width: 402px"
                    v-model.trim="expressCompanyCode"
                    value-key="code"
                    filterable
                    clearable 
                    placeholder="请选择快递公司"
                >
                    <el-option
                        v-for="item in expressInfoList"
                        :key="item.code"
                        :label="item.name"
                        :value="item"
                    >
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item
                label="运单号:"
                required
            >
                <el-input
                    placeholder="请输入运单号"
                    v-model="expressCode"
                ></el-input>
            </el-form-item>
            <el-form-item label="发货日期:">
                <el-date-picker
                    v-model="deliverDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择发货日期"
                >
                </el-date-picker>
            </el-form-item>
            
            <el-form-item class="big-btn">
                <el-button
                    type="primary"
                    @click="preConfirm(3)"
                >
                    确认提交
                </el-button>
            </el-form-item>
        </el-form>

        <el-dialog
            title="确定提交该服务单？"
            center
            class="deal-dialog"
            :modal-append-to-body="false"
            :visible.sync="applyPostSaletype"
            :close-on-click-modal="false"
        >
            <div
                style="text-align: center;"
                slot="footer"
                class="big-btn"
            >
                <el-button
                    type="info"
                    @click="applyPostSaletype = false"
                >
                    取消
                </el-button>
                <el-button
                    :loading="loads"
                    type="primary"
                    @click="applyPostSale"
                >
                    确定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="确认退款？"
            center
            class="deal-dialog"
            :modal-append-to-body="false"
            :visible.sync="showReactivate"
            :close-on-click-modal="false"
        >
            
            <div
                style="text-align: center;"
                slot="footer"
            >
                <el-button @click="showReactivate = false">
                    取消
                </el-button>
                <el-button
                    :loading="loads"
                    type="primary"
                    @click="confirmRefund"
                >
                    确定
                </el-button>
            </div>
        </el-dialog> 
        <el-dialog
            title="确定提交寄回地址？"
            center
            class="deal-dialog"
            :modal-append-to-body="false"
            :visible.sync="addresssever"
            :close-on-click-modal="false"
        >
            <div
                style=" text-align: center;"
                slot="footer"
                class="big-btn"
            >
                <el-button
                    type="info"
                    @click="addresssever = false"
                >
                    取消
                </el-button>
                <el-button
                    :loading="loads"
                    type="primary"
                    @click="submitSendBackAddress"
                >
                    确定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="确定提交返件运单信息？"
            center
            class="deal-dialog"
            :visible.sync="expresssever"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
        >
            <div
                style=" text-align: center;"
                slot="footer"
                class="big-btn"
            >
                <el-button
                    type="info"
                    @click="expresssever = false"
                >
                    取消
                </el-button>
                <el-button
                    :loading="loads"
                    type="primary"
                    @click="submitReturnExpress"
                >
                    确定
                </el-button>
            </div>
        </el-dialog>
        <!-- <auth-tip ref="authTip" :tips="tips" @confirm="confirmAuth"></auth-tip> -->
    </div>
</template>
<script>
import customerservicehandler from "bislibs/requestHandler/customerservicehandler";
import accounting from "accounting";
import { mapGetters } from "vuex";
import utils from "bislibs/utils";
// import AuthTip from "./AuthTip";
export default {
    components: {
        // AuthTip
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
        },
        taskId: {
            type: String,
            default: null
        }
        // ,
        // expressInfoList: {
        //     type: Array,
        //     default: () => []
        // }
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
            refundTaskAuth: utils.hasAuth("serviceOrderRefundAuth"), //退款权限
            radio: { radio: "exchange" },
            tips: {
                title: "权限确认",
                content: "暂无使用权限，如有需要请联系管理员开通"
            },
            applyPostSaletype:false,//确认售后单弹窗
            applyType:"",//确认或取消售后申请
            remark:"",//售后意见
            showReactivate:false,//退款弹窗
            sendBackDetail:{//寄回地址
                // postSaleNo 售后单号
                // taskId 任务ID
                address:"",
                contactName:"",
                mobilePhone:"",
                postcode:""
            },
            expressInfoList:[],
            addresssever: false,//寄回地址弹窗
            expresssever:false,//运单信息弹窗

            expressCompany:"",//快递公司
            expressCompanyCode:null,//快递公司code
            expressCode:"",//快递单号
            deliverDate:"",//发货日期，格式为yyyy-MM-dd HH:mm:ss
            actionsever: false,
            cancelsever: false,
            needUpdate: false,
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
                expressCompany: [
                    {
                        required: true,
                        message: "处理结果不能为空",
                        trigger: ["blur", "change"]
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
            },
            loads:false//确认按钮loading
        };
    },
    created(){
        this.getExpressList()
    },
    computed: {
        ...mapGetters(["loading","serviceStatus"]),
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
        setApplytype(type){
            this.applyPostSaletype = true;
            this.applyType = type;
        },
        /**
         * 确认或取消售后申请
         */
        applyPostSale(){
            this.loads = true
            let param = {
                postSaleNo: this.orderInfo.postSaleNo,
                taskId: this.taskId,
                confirmOrCancelFlag: this.applyType,
                remark: this.remark
            };
            customerservicehandler.confirmOrCancelApplyPostSale(param).then(
                (res) => {
                    if (res.resultCode === 0) {
                        
                        window.history.go(-1);
                    }
                },
                () => {
                }
            ).finally(()=>{
                this.loads = false
            });
        
        },
        /**
         * 确认退款
         */
        confirmRefund(){
            let param = {
                postSaleNo: this.orderInfo.postSaleNo,
                taskId: this.taskId
            };
            this.loads = true
            customerservicehandler.refund(param).then(
                (res) => {
                    if (res.resultCode === 0) {
                        
                        window.history.go(-1);
                    }
                },
                () => {
                }
            ).finally(()=>{
                this.loads = false
            });
        
        },
        /**
         * 填写寄回地址
         */
        submitSendBackAddress(){
            let param = this.sendBackDetail;
            param["postSaleNo"] = this.orderInfo.postSaleNo;
            param["taskId"] = this.taskId;
            this.loads = true
            customerservicehandler.submitSendBackAddress(param).then(
                (res) => {
                    if (res.resultCode === 0) {
                        
                        window.history.go(-1);
                    }
                },
                () => {
                }
            ).finally(()=>{
                this.loads = false
            });
        
        },
        /**
         * 填写返件运单信息
         */
        submitReturnExpress(){
            let param = {
                postSaleNo: this.orderInfo.postSaleNo,
                taskId: this.taskId,
                expressCompany: this.expressCompanyCode.name,
                expressCompanyCode: this.expressCompanyCode.code,
                // expressCompanyCode: this.expressCompanyCode,
                expressCode: this.expressCode,
                deliverDate: this.deliverDate
            };
            this.loads = true
            customerservicehandler.submitReturnExpressInfo(param).then(
                (res) => {
                    if (res.resultCode === 0) {
                        
                        window.history.go(-1);
                    }
                },
                () => {
                }
            ).finally(()=>{
                this.loads = false
            });
        
        },
        /**
         * 提交前字段校验
         */
        preConfirm(type) {
            //填写商家寄回地址
            if (type == 2){
                if (!this.sendBackDetail.address){ this.$message.error('请填写寄回地址'); return }
                if (!this.sendBackDetail.contactName){ this.$message.error('请填写联系人'); return }
                if (!this.sendBackDetail.mobilePhone){ this.$message.error('请填写联系方式'); return }
                this.addresssever = true
            }
            //商家提交运单
            if (type == 3){
                if (!this.expressCompanyCode){ this.$message.error('请选择快递公司'); return }
                if (!this.expressCode){ this.$message.error('请填写运单号'); return }
                this.expresssever = true
            }
            
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
        },
        /**
         * 查询快递公司列表
         */
        getExpressList() {
            let param = {
                expressName: "",
                firstLetter: ""
            };
            customerservicehandler.getExpressList(param).then(
                (res) => {
                    if (res.resultCode === 0) {
                        this.expressInfoList = res.result.expressInfoList;
                    }
                },
                () => {
                }
            );
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
 .el-form-item__label {
    text-align: left;
}
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