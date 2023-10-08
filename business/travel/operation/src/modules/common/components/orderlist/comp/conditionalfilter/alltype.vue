<template>
    <div class="conditionalFilterTicket">
        <div class="condition">
            <div>
                <label class="condition-item">预订日期</label>
                <DatePicker
                    type="date"
                    id="scheduledBeginTimeID"
                    placement="bottom-end"
                    placeholder="请选择日期"
                    class="date-picker"
                    :clearable="false"
                    :transfer="true"
                ></DatePicker>
                <span class="date-split">至</span>
                <DatePicker
                    type="date"
                    id="scheduledEndTimeID"
                    placement="bottom-end"
                    placeholder="请选择日期"
                    class="date-picker"
                    :clearable="false"
                    :transfer="true"
                ></DatePicker>
            </div>
            <div>
                <label class="condition-item">出行日期</label>
                <DatePicker
                    type="date"
                    id="departBeginTimeID"
                    placement="bottom-end"
                    placeholder="请选择日期"
                    class="date-picker"
                    :clearable="false"
                    :transfer="true"
                ></DatePicker>
                <span class="date-split">至</span>
                <DatePicker
                    type="date"
                    id="departEndTimeID"
                    placement="bottom-end"
                    placeholder="请选择日期"
                    class="date-picker"
                    :clearable="false"
                    :transfer="true"
                ></DatePicker>
            </div>
        </div>
        <div class="condition">
            <div class="conditionP">
                <label class="condition-item">订单号</label>
                <input
                    type="text"
                    v-model.trim="outData.orderNo"
                    class="condition-item"
                    placeholder="请输入订单号"
                />
            </div>
            <div class="conditionP">
                <!-- <label class="condition-item custlabel1">乘客</label> -->
                <label class="condition-item custlabel1">乘客/预订人</label>
                <input
                    type="text"
                    v-model.trim="outData.personName"
                    class="condition-item"
                    placeholder="请输入中文名/英文名"
                />
            </div>
            <div class="conditionP">
                <label class="condition-item">手机号码</label>
                <input
                    type="text"
                    v-model.trim="outData.phoneNumber"
                    class="condition-item"
                    placeholder="请输入预订用的手机号"
                />
            </div>
        </div>
        <div v-show="showMoreConfition">
            <div class="condition conditionMore2">
                <div 
                    v-if="userTypeFlag"
                    class="conditionMoreBox" >
                    <label class="condition-item">出行类型</label>
                    <Select class="inSelect" v-model="outData.useType">
                        <Option
                            v-for="type in userTypeArr"
                            :key="type.value"
                            :value="type.value"
                        >{{type.text}}</Option>
                    </Select>
                </div>
                <!-- <div class="conditionMoreBox">
                    <label class="condition-item">订单类型</label>
                    <Select class="inSelect" v-model="outData.orderType">
                        <Option
                            v-for="type in orderTypeArr"
                            :key="type.value"
                            :value="type.value"
                        >{{type.text}}</Option>
                    </Select>
                </div> -->
            </div>
            <div class="condition conditionMore2">
                <div class="conditionMoreBox">
                    <label class="condition-item">供应商</label>
                    <Select class="inSelect" v-model="outData.providerType">
                        <Option
                            v-for="type in providerTypeArr"
                            :key="type.value"
                            :value="type.value"
                        >{{type.text}}</Option>
                    </Select>
                </div>
                <div class="conditionProd">
                    <label class="condition-item">分销渠道</label>
                    <!-- <select v-model="outData.channelId">
                        <option
                            v-for="type in productTypeArr"
                            :key="type.value"
                            :value="type.value"
                        >{{type.text}}</option>
                    </select>-->
                    <Cascader
                        class="inCascader"
                        :data="productTypeArr"
                        v-model="outData.prodIdACompanyId"
                        :render-format="formatResult"
                        :load-data="loadData"
                    ></Cascader>
                </div>
                <div class="conditionP conditionPay">
                    <label class="condition-item">支付方式</label>
                    <Select
                        class="inCascader"
                        multiple 
                        :max-tag-count="3"
                        v-model="outData.payTypes"                       
                    >
                        <Option
                            v-for="type in payTypeArrNet"
                            :key="type.value"
                            :value="type.value"
                        ><div class="labelOption">{{type.label}}</div>
                        </Option>
                    </Select>
                </div>
            </div>
        </div>
        <div class="showMore cursorp" @click="showMoreClick">
            <span v-if="showMoreConfition">
                精简查询条件
                <img src="~assets//icon_lisr_up.png" />
            </span>
            <span v-else>
                更多查询条件
                <img
                    src="~assets//icon_list_down.png"
                />
            </span>
        </div>
        <div class="btn-container">
            <div class="clearButton cursorp" @click="clearAllParam">
                <span>清空查询条件</span>
            </div>
            <div class="button cursorp" @click="onQuery">查询</div>
        </div>
    </div>
</template>

<script>
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";

var defaultFullVaule = -101;

export default {
    props: ["filterParam"],
    directives: {},
    components: {},
    data() {
        return {
            outData: {
                //输出的数据
                orderNo: null, //订单号
                orderType: null, //订单类型，1. 酒店订单 2. 机票订单 3.火车票订单
                payTypes: null, //支付方式 微信1、支付宝2、企业支付3、金贝4等
                personName: null, //预订人姓名
                phoneNumber: null, //预订人手机号码
                scheduledBeginTime: null, //预订日期从，格式yyyy-MM-dd
                scheduledEndTime: null, //预订日期到，格式yyyy-MM-dd
                departBeginTime: null, //出发日期从，格式yyyy-MM-dd
                departEndTime: null, //出发日期到，格式yyyy-MM-dd
                useType: null, //因公PUBLIC = 0 因私PRIVATE = 1
                providerType: null,
                prodIdACompanyId: null //分销渠道，渠道ID加上公司ID
            },
            orderTypeArr: [
                {
                    value: defaultFullVaule,
                    text: "全部"
                },
                // {
                //     value: 1,
                //     text: "机票"
                // },
                // {
                //     value: 2,
                //     text: "酒店"
                // },
                // {
                //     value: 3,
                //     text: "火车票"
                // },
                // {
                //     value: 5,
                //     text: "保险"
                // }
            ],
            userTypeArr: [
                {
                    value: defaultFullVaule,
                    text: "全部"
                },
                {
                    value: 0,
                    text: "因公"
                },
                {
                    value: 1,
                    text: "因私"
                }
            ],
            payTypeArrNet: [
                // {
                //     label: "全部",
                //     value: defaultFullVaule
                // }
            ],
            payTypeOffLine: {
                label: "到店付",
                value: "PAY_IN_CASH"
            },           
            providerTypeArr: [
                {
                    value: defaultFullVaule,
                    text: "全部"
                }
            ],
            productTypeArr: [
                {
                    value: defaultFullVaule,
                    label: "全部"
                }
            ],
            companyArrDefault: {
                value: defaultFullVaule,
                text: "全部"
            },
            companyArr: [
                {
                    value: defaultFullVaule,
                    text: "全部"
                }
            ],
            emptyCpy: {
                value: defaultFullVaule,
                label: "无企业"
            },
            showMoreConfition: false, //是否显示全部条件
            userTypeFlag: utils.userTypeSwitch,
        };
    },
    created() {
        //给选择器参数添加默认值
        this.initParamData();
    },
    mounted() {
        // console.info("orderlist.mounted.oncreateGoing="+this.oncreateGoing);
        //日期控件选中样式监听
        $(".ivu-date-picker")
            .on("focus", ".ivu-input", function(event) {
                let $icon = $(event.currentTarget).siblings(".ivu-input-icon");
                $icon.addClass("selected");
            })
            .on("blur", ".ivu-input", function(event) {
                let $icon = $(event.currentTarget).siblings(".ivu-input-icon");
                $icon.removeClass("selected");
            });

        //为日期控件加上placeholder（自带的不生效）
        $(".ivu-date-picker .ivu-input").attr("placeholder", "选择日期");

        this.refreshOrdersHasQuery();
    },

    watch: {
        filterParam: {
            handler(val) {
                //当入参发送变化的时候？
                this.clearAllParam();
                this.initSelectValue();
                this.refreshOrdersHasQuery();
            },
            deep: true
            // immediate: true
        },
        "outData.prodIdACompanyId": {
            handler(val, oldVal) {
                // "";
                if (
                    (!!val && !!oldVal && val[0] != oldVal[0]) ||
                    (oldVal == null && !!val && val.length > 0)
                ) {
                    if (oldVal != null) {
                        //渠道ID切换之后，除了首次默认赋值“全部”选项，需要重新拉取支付方式,
                        this.getPaymentPlatforms(val[0]);
                    }
                    //渠道ID切换之后,清空除了当前选择的渠道之外的 所有的企业数据，企业数据需要重新拉取。
                    for (var i = 0; i < this.productTypeArr.length; i++) {
                        if (this.productTypeArr[i].value != val[0]) {
                            this.productTypeArr[i].children = [];
                        }
                    }
                }
            },
            deep: true
        }
    },

    methods: {
        initParamData() {
            this.initSelectValue();
            //获取分销商列表
            this.getOrderProdIds();
            //获取查询供应商列表
            this.getProviderInfos();
            //获取支付方式列表
            this.getPaymentPlatforms();
        },
        /**
         * //给选择器参数添加默认值
         */
        initSelectValue() {
            //给选择器参数添加默认值
            this.outData.useType = this.userTypeArr[0].value;
            this.outData.orderType = this.orderTypeArr[0].value;
            this.outData.payTypes = [];
            // this.outData.payTypes = [this.payTypeArrNet[0].value];
            this.outData.providerType = this.providerTypeArr[0].value;
            this.outData.prodIdACompanyId = [this.productTypeArr[0].value];
        },
        /**
         * 根据入参，决定是否有显示预制数据
         */
        refreshOrdersHasQuery() {
            const that = this;
            setTimeout(() => {
                let hasQuery = false;
                if (that.filterParam && that.filterParam.orderBeginTime) {
                    $("#scheduledBeginTimeID .ivu-input").val(
                        that.filterParam.orderBeginTime + ""
                    );
                } else {
                    $("#scheduledBeginTimeID .ivu-input").val("");
                }
                if (that.filterParam && that.filterParam.orderEndTime) {
                    $("#scheduledEndTimeID .ivu-input").val(
                        that.filterParam.orderEndTime + ""
                    );
                } else {
                    $("#scheduledEndTimeID .ivu-input").val("");
                }

                // "";
                if (that.filterParam && that.filterParam.useType) {
                    hasQuery = true;
                    that.outData.useType =
                        parseInt(that.filterParam.useType) == -1
                            ? defaultFullVaule
                            : parseInt(that.filterParam.useType);
                } else {
                    that.outData.useType = that.userTypeArr[0].value;
                }
                //proid一定要放到companyID之前
                if (that.filterParam && that.filterParam.channelId) {
                    hasQuery = true;
                    that.outData.prodIdACompanyId = [
                        parseInt(that.filterParam.channelId) == -1
                            ? defaultFullVaule
                            : parseInt(that.filterParam.channelId)
                    ];
                    //start：因为渠道和企业合并筛选框，入参有渠道和企业默认选中，需要手动发起接口调用企业列表
                    var item;
                    for (let i = 0; i < that.productTypeArr.length; i++) {
                        if (
                            that.productTypeArr[i].value ==
                            that.outData.prodIdACompanyId[0]
                        ) {
                            item = that.productTypeArr[i];
                            break;
                        }
                    }
                    if (item) {
                        that.loadData(item);
                    }
                    //end：因为渠道和企业合并筛选框，入参有渠道和企业默认选中，需要手动发起接口调用企业列表
                    if (that.filterParam && that.filterParam.companyId) {
                        hasQuery = true;
                        that.outData.prodIdACompanyId.push(
                            parseInt(that.filterParam.companyId) == -1
                                ? defaultFullVaule
                                : parseInt(that.filterParam.companyId)
                        );
                    } else {
                        that.outData.prodIdACompanyId.push(defaultFullVaule);
                    }
                } else {
                    that.outData.prodIdACompanyId = [
                        this.productTypeArr[0].value
                    ];
                }
                //proid一定要放到companyID之前
                if (hasQuery && !that.showMoreConfition) {
                    that.showMoreClick();
                } else if (!hasQuery && that.showMoreConfition) {
                    that.showMoreClick();
                }
                //触发一次 查询点击
                that.onQuery();
            }, 500);
        },

        /**
         * 展开或者收缩 复杂条件
         */
        showMoreClick() {
            let that = this;
            that.showMoreConfition = !that.showMoreConfition;
        },

        /**
         * 查询分销商渠道
         */
        getOrderProdIds() {
            let that = this;
            travelfun.getAllChannels().then(
                function(res) {
                    if (0 == res.resultCode && !!res.result.channelInfos) {
                        that.productTypeArr = that.productTypeArr.concat(
                            travelfun.getCascaderList(res.result.channelInfos)
                        );
                    }
                },
                function(error) {
                    console.info(error);
                }
            );
        },

        /**
         * 查询供应商渠道
         */
        getProviderInfos() {
            let that = this;
            travelfun.getProviderInfos4Net({GetProviderInfosRequest:{}}).then(
                function(res) {
                    if (0 == res.resultCode && !!res.result.providerInfos) {
                        let providerList = res.result.providerInfos;
                        providerList.forEach(provider => {
                            let item = {
                                value: provider.providerType,
                                text: provider.providerShortName
                            };
                            that.providerTypeArr.push(item);
                        });
                    }
                },
                function(error) {
                    console.info(error);
                }
            );
        },

        /**
         * 查询支付方式
         */
        getPaymentPlatforms(productionChannelId) {
            let that = this;
            let request = {
                productionChannelId:
                    !!productionChannelId && parseInt(productionChannelId) > 0
                        ? productionChannelId
                        : undefined
            };
            tmHandler.getPaymentPlatforms(request).then(
                function(res) {
                    if (0 == res.resultCode && !!res.result) {
                        let paymentList = res.result.payTypes;
                        //先清除列表，添加默认的 全部 选项卡
                        that.payTypeArrNet.splice(0, that.payTypeArrNet.length);
                        // let defaultFull = {
                        //     label: "全部",
                        //     value: defaultFullVaule
                        // };
                        // that.payTypeArrNet.push(defaultFull);
                        // that.outData.payTypes = [that.payTypeArrNet[0].value];
                        that.outData.payTypes = [];
                        //全部的默认
                        paymentList.forEach(payment => {
                            //1=开启才是有效的
                            let arrItem = {};
                            arrItem.label = payment.payTypeName;
                            arrItem.value = payment.payType;

                            that.payTypeArrNet.push(arrItem);
                        });
                        //没有获取到渠道的支付方式，不添加 到店付 选择
                        if (that.payTypeArrNet.length > 1) {
                            that.payTypeArrNet.push(that.payTypeOffLine);
                        }                
                    }
                },
                function(error) {
                    console.info(error);
                }
            );
        },
        /**
         * 清空查询条件
         */
        clearAllParamClick() {
            let that = this;
            that.clearAllParam();
            //TODO:理论上 清空条件 属于 筛选组件 内部的业务，不需要暴露出去。这里先这样写，防止有后续的扩展需要
            that.$emit("onClearClick");
        },
        /**
         * 清空查询条件
         */
        clearAllParam() {
            let that = this;

            $("#scheduledBeginTimeID .ivu-input").val("");
            $("#scheduledEndTimeID .ivu-input").val("");
            $("#departBeginTimeID .ivu-input").val("");
            $("#departEndTimeID .ivu-input").val("");

            that.initSelectValue();
            that.outData.orderNo = null;
            that.outData.personName = null;
            that.outData.phoneNumber = null;
            that.outData.scheduledBeginTime = null;
            that.outData.scheduledEndTime = null;
            that.outData.departBeginTime = null;
            that.outData.departEndTime = null;
        },
        /**
         * 点击查询按钮
         */
        onQuery() {
            let that = this;
            //iview的DatePicker在这里使用有点问题，如果用v-model的话会出现很怪异的现象，其他的事件也使用不正常
            //所以暂用这种笨方式获取时间
            that.outData.scheduledBeginTime = $(
                "#scheduledBeginTimeID .ivu-input"
            ).val();
            that.outData.scheduledEndTime = $(
                "#scheduledEndTimeID .ivu-input"
            ).val();
            that.outData.departBeginTime = $(
                "#departBeginTimeID .ivu-input"
            ).val();
            that.outData.departEndTime = $("#departEndTimeID .ivu-input").val();

            // "";
            let theOutput = JSON.parse(JSON.stringify(that.outData));

            (theOutput.providerType == defaultFullVaule ||
                theOutput.providerType == null) &&
                delete theOutput["providerType"];
            (theOutput.useType == defaultFullVaule ||
                theOutput.useType == null) &&
                delete theOutput["useType"];
            (theOutput.orderType == defaultFullVaule ||
                theOutput.orderType == null) &&
                delete theOutput["orderType"];

            theOutput.payTypes.length == 0 || theOutput.payTypes == null
                ? delete theOutput["payTypes"]
                :theOutput.payTypes

            if (
                theOutput.prodIdACompanyId[0] == defaultFullVaule ||
                theOutput.prodIdACompanyId == null
            ) {
                delete theOutput["prodIdACompanyId"];
            } else {
                theOutput.channelId = theOutput.prodIdACompanyId[0];
                let companyId =
                    theOutput.prodIdACompanyId[
                        theOutput.prodIdACompanyId.length - 1
                    ];
                if (!(companyId == null || companyId == defaultFullVaule || companyId == -2)) {
                    theOutput.companyId = companyId;
                }
                delete theOutput["prodIdACompanyId"];
            }

            !theOutput.orderNo && delete theOutput["orderNo"];
            !theOutput.personName && delete theOutput["personName"];
            !theOutput.phoneNumber && delete theOutput["phoneNumber"];
            !theOutput.scheduledBeginTime &&
                delete theOutput["scheduledBeginTime"];
            !theOutput.scheduledEndTime && delete theOutput["scheduledEndTime"];
            !theOutput.departBeginTime && delete theOutput["departBeginTime"];
            !theOutput.departEndTime && delete theOutput["departEndTime"];

            //点击查询按钮，输出当前的筛选条件 对象
            that.$emit("onQueryClick", theOutput);
        },
        /**
         * 级联操作的选择结果显示内容和方式
         */
        formatResult(labels, selectedData) {
            let result = "";
            for (let i = 0; i < labels.length; i++) {
                result += (i > 0 ? "--" : "") + labels[i];
            }
            return result;
        },
        /**
         * 异步加载数据
         */
        loadData(item, callback) {
            const that = this;

            item.loading = true;
            var itemChild = [{ value: defaultFullVaule, label: "全部企业" }];
            travelfun.getOrderCompanyList4Net(item.value).then(
                function(res) {
                    if (0 == res.resultCode && !!res.result.companyNames) {
                        if (res.result.companyNames.length == 0) {
                            itemChild.splice(0, 1, that.emptyCpy);
                        } else {
                            itemChild = itemChild.concat(
                                travelfun.getCascaderList(res.result.companyNames, false)
                            );
                        }
                    }
                    item.children = itemChild;
                    item.loading = false;
                    if (!!callback) {
                        callback();
                    }
                },
                function(error) {
                    console.info(error);
                    item.children = itemChild;
                    item.loading = false;
                    if (!!callback) {
                        callback();
                    }
                }
            );
        }
    }
};
</script>

<style scoped lang="less">
@import "~styles/common.less";
@line-height: 32px;
@font-color: #191919;
@placeholder-color: #b2b2b2;
.conditionalFilterTicket {
    .flex-box;
    .flex-flow(column, nowrap);
    background: #fff;
    padding: 0px 30px;
    .condition {
        .flex-box;
        .flex-wrap(wrap);
        justify-content: space-between;
        &:nth-of-type(1) {
            margin-top: 0.1rem;
            label:nth-of-type(1) {
                padding-right: 0px;
            }
            label:nth-of-type(2) {
                padding-right: 14px;
            }
        }
        &:nth-of-type(2) {
            margin-top: 16px;
        }
        &:nth-of-type(3) {
            margin-top: 12px;
        }
        .conditionP {
            width: auto;
        }
        .conditionMoreBox {
            width: auto;
            display: flex;
            .inSelect {
                width: 170px;
                margin: 0 4px;
            }
        }
        .conditionPay {
            display: flex;
            margin-left: 85px;
            .inCascader {
                margin-left: 3px;
                width: 230px;
            }
            .labelOption{
                white-space: normal;
                width: 198px;
                padding-right: 8px;
            }
        }
        .conditionProd {
            display: flex;
            margin-left: 85px;
            .inCascader {
                margin-left: 3px;
                width: 230px;
            }
        }
        .custlabel1 {
            width: 80px;
        }
        label {
            .flex(none);
            font-size: 14px;
            margin-left: 38px;
            margin-right: 14px;
            line-height: @line-height;
            display: inline-block;
            text-align: end;
            width: 60px;
            &:first-child {
                margin-left: 0;
            }
        }
        input[type="text"] {
            .flex(none);
            height: @line-height;
            line-height: @line-height;
            padding: 0px 12px;
            font-size: 14px;
            border: 1px solid #c4c4cc;
            border-radius: @radius-small;
            color: @font-color;
            background-color: initial;

            &:nth-of-type(1) {
                width: 170px;
            }
            &:nth-of-type(2) {
                width: 170px;
            }
            &:nth-of-type(3) {
                width: 170px;
            }
        }
        .date-picker {
            width: 125px;
        }

        select {
            .flex(none);
            background: initial;
            padding: 0px 12px;
            font-size: 14px;
            border: 1px solid #c4c4cc;
            color: @font-color;
            border-radius: @radius-small;
            height: @line-height;
            outline: none;
            &:nth-of-type(1) {
                width: 170px;
            }
            &:nth-of-type(2) {
                width: 170px;
            }
            &:nth-of-type(3) {
                width: 170px;
            }
        }
        .date-split {
            .flex(none);
            margin: 0 14px;
            line-height: @line-height;
        }
        .date-range {
            .flex(none);
            .flex-box;
            margin-left: 32px;
            label {
                color: @label-color;
                font-size: 14px;
            }
            label,
            ul {
                .flex(none);
                .flex-box;
                line-height: normal;
                margin: 6px 0;
            }
            li {
                margin: 0 12px 0 5px;
                width: 42px;
                cursor: pointer;
                border-bottom: 2px solid transparent;
                text-align: center;
                &:hover,
                &.selected {
                    color: @primary;
                    border-bottom: 2px solid @primary;
                }
                &:first-child {
                    margin-left: 0px;
                }
                &:nth-of-type(3) {
                    margin-left: 12px;
                }
            }
        }
    }
    .conditionMore1 {
        justify-content: space-between;
    }
    .conditionMore2 {
        justify-content: start;
    }
    .showMore {
        margin-top: 16px;
        height: 30px;
        line-height: 30px;
        span {
            color: #6782f5;
        }
        img {
            width: 16px;
            vertical-align: middle;
        }
    }

    .btn-container {
        .flex(auto);
        .flex-box;
        .justify-content(flex-end);
        .button {
            text-align: center;
            cursor: pointer;
            border-radius: @radius;
            white-space: nowrap;
            margin-top: 0.1rem;
            line-height: 36px;
            width: 153px;
            height: 36px;
            font-size: 14px;
            color: #fff;
            background-color: @primary;
            &:hover {
                background-color: #6782f5;
            }
        }
        .clearButton {
            display: flex;
            margin-right: 10px;
            span {
                color: #6782f5;
                align-self: flex-end;
            }
        }
    }

    input::-webkit-input-placeholder {
        color: @placeholder-color;
    }
    input::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: @placeholder-color;
    }
    input:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: @placeholder-color;
    }
    input:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: @placeholder-color;
    }
}
</style>
<style lang="less">
//因为iview是第三方组件，修改他的样式，不能使用scoped标记，需要单独一个style标签。
@import "~styles/myiview.less";
</style>
