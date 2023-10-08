<!--
 * @Author: chengMingRui
 * @Date: 2020-03-02 13:17:15
 * @LastEditTime: 2020-04-26 10:44:31
 * @Description: 新增定价页面定价规则模块
 -->
<template>
    <div class="releModel">
        <!-- <p  class="releModel_title" v-if="isShow">基本信息</p> -->
        <ul class="releModel_list">
            <li
                class="releModel_item"
                v-if="isShow"
            >
                <span class="releModel_item_left">
                    <i class="releModel_item_left_require">*</i>
                    <em class="releModel_item_left_dec">规则名称</em>
                    <em class="releModel_item_left_dec">：</em>
                </span>
                <div class="releModel_item_right releModel_item_name">
                    <el-input 
                        placeholder="请输入规则名称"
                        maxlength="100"
                        :disabled="isreadOnly"
                        v-model="ruleName"
                        clearable
                        @change="changeRuleData"
                    ></el-input>
                </div>
            </li>
            <li class="releModel_item">
                <span class="releModel_item_left">
                    <i class="releModel_item_left_require">*</i>
                    <em class="releModel_item_left_dec">{{ pTitle }}</em>
                    <em class="releModel_item_left_dec">=</em>
                </span>
                <div class="releModel_item_right releModel_item_type">
                    <!-- <el-select 
                        v-model="selectType"
                        @change="changeRuleData(selectType,true)"
                        placeholder="请选择" 
                        class="releModel_item_right_selecte">
                        <el-option
                            v-for="item in typeList"
                            :key="item.value"
                            :label="item.dec"
                            :value="item.label">
                        </el-option>
                    </el-select> -->
                    <div>供应商结算价</div>
                    <i class="el-icon-close releModel_item_stand"></i>
                    <div>
                        <el-input 
                            placeholder="请输入比例"
                            @change="changeRuleData(rulePercentage,false)"
                            :maxlength="rulePercentage_maxLength"
                            @input="verificationData('rulePercentage',true)"
                            @blur="resultVerificationData('rulePercentage')"
                            v-model="rulePercentage" 
                            class="releModel_item_right_input"
                        >
                            <template slot="append">
                                %
                            </template>
                        </el-input>
                        <div>不能低于 100%</div>
                    </div>
                    <i class="el-icon-plus releModel_item_stand"></i>
                    <div>
                        <el-input 
                            placeholder="请输入加价"
                            @change="changeRuleData(ruleFloatingValue,false)"
                            @blur="blurVerifiData('ruleFloatingValue')"
                            :maxlength="ruleFloatingValue_maxLength"
                            @input="verificationData('ruleFloatingValue')"
                            class="releModel_item_right_input"
                            v-model="ruleFloatingValue"
                        />                        
                        <div>不能为负数</div>                        
                    </div>
                </div>
                <span 
                    class="releModel_item_tip"
                    v-if="!priceType && Number(rulePercentage) < 100&& isShow"
                >
                    <i class="el-icon-warning releModel_item_tip_icon"></i>
                    <em>销售价≤结算价可能出现亏损</em>
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
import utils from "bislibs/utils";

export default {
    props: {
        isShow: {
            //头部菜单是否展示
            type: Boolean,
            default: true
        },
        priceRuleName: {
            type: String,
            default: ""
        },
        // 判断是销售类型，还是最大，最小销售价格类型，默认都不是
        PType: {
            type: Number,
            default: 0
        },
        // 左侧菜单名称
        pTitle: {
            type: String,
            default: ""
        },
        // 判断是销售价还是采购价
        priceType: {
            type: Number,
            default: 0
        },
        // 百分比
        pricePercentage: {
            type: [Number, String],
            default: 100
        },
        // 浮动价格
        priceFloatingValue: {
            type: [Number, String],
            default: 0
        },
        isreadOnly: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            ruleName: "",
            selectType: 0, // 单选选中的定价类型
            rulePercentage: 100,
            ruleFloatingValue: 0,
            typeList: [
                {
                    label: 0,
                    dec: "供应商结算价"
                },
                {
                    label: 1,
                    dec: "结算价"
                }
            ],
            rulePercentage_maxLength: 10,
            ruleFloatingValue_maxLength: 10
        };
    },
    methods: {
        changeRuleData() {
            let updata = {
                priceRuleName: this.ruleName,
                priceType: this.selectType,
                pricePercentage: this.rulePercentage,
                priceFloatingValue: this.ruleFloatingValue
            };
            this.PType == 1
                ? this.$emit("updataPriceData", updata)
                : this.PType == 2
                    ? this.$emit("updataMaxPriceData", updata)
                    : this.PType == 3
                        ? this.$emit("updataMinPriceData", updata)
                        : this.$emit("updataOtherPriceData", updata);
        },
        verificationData(value) {
            if (this[value] !== "" && this[value] !== 0) {
                if (this[value].indexOf(".") == 0) {
                    this[value] = 0 + this[value];
                }
                this[value] = this[value].replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
                this[value] = this[value].replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
                this[value] = this[value]
                    .replace(".", "$#$")
                    .replace(/\./g, "")
                    .replace("$#$", ".");
                this[value] = this[value].replace(
                    /^(\-)*(\d+)\.(\d\d).*$/,
                    "$1$2.$3"
                ); //只能输入两个小数
                if (this[value].indexOf(".") < 0 && this[value] != "") {
                    //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                    if (this[value].indexOf(0) == 0 && this[value].length > 1) {
                        this[value] = this[value].substr(1);
                    }
                }
            }
        },
        resultVerificationData(value) {
            if (!!this.priceType) {
                if (Number(this[value]) < 100) {
                    this[value] = "100";
                    utils.showToast("不能低于 100%");
                }
            } else if (String(this[value]) === "") {
                this[value] = "100";
            } else if (
                Number(this[value]) === 0 &&
                    String(this[value]).indexOf(".") > -1
            ) {
                this[value] = "0";
            }
            let pront =
                typeof this[value] == "string"
                    ? this[value].indexOf(".")
                    : String(this[value]).indexOf(".");
            if (!String(this[value])[pront + 1]) {
                this[value] = String(this[value]).substring(
                    0,
                    String(this[value]).length - 1
                );
            }
        },
        blurVerifiData(value) {
            if (this[value] == "" || !Number(this[value])) {
                this[value] = 0;
            }
            let pront = String(this[value]).indexOf(".");
            if (!String(this[value])[pront + 1]) {
                this[value] = String(this[value]).substring(
                    0,
                    String(this[value]).length - 1
                );
            }
        }
    },
    watch: {
        priceRuleName() {
            this.ruleName = this.$props.priceRuleName;
            return this.$props.priceRuleName;
        },
        priceType() {
            this.selectType = this.$props.priceType;
            return this.$props.priceType;
        },
        pricePercentage() {
            this.rulePercentage = this.$props.pricePercentage + "";
            return this.$props.pricePercentage;
        },
        priceFloatingValue() {
            this.ruleFloatingValue = this.$props.priceFloatingValue;
            return this.$props.priceFloatingValue;
        }
    }
};
</script>

<style lang="less">
@import "./ruleModel.less";
</style>