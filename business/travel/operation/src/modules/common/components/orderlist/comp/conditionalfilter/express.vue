<template>
    <div class="conditionalFilterTicket">
        <div class="condition">
            <div>
                <label>下单日期</label>
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
            <div class="conditionP">
                <label class="condition-item">快递订单编号/运单号</label>
                <input
                    type="text"
                    v-model.trim="outData.orderNo"
                    class="condition-item"
                    placeholder="请输入订单编号"
                    max="64"
                />
            </div>
        </div>
        <div class="condition">
            <div class="conditionP">
                <label class="condition-item">寄件人/收件人联系电话</label>
                <input
                    type="text"
                    v-model.trim="outData.phoneNumber"
                    class="condition-item"
                    placeholder="请输入联系电话"
                    max="64"
                />
            </div>
            <div class="conditionP">
                <label class="condition-item custlabel1">寄件人/收件人姓名</label>
                <input
                    type="text"
                    v-model.trim="outData.personName"
                    class="condition-item"
                    placeholder="请输入中文名/英文名"
                    max="64"
                />
            </div>
            <div class="conditionMoreBox">
                <label>供应商</label>
                <Select class="inSelect" v-model="outData.providerType">
                    <Option
                        v-for="type in providerTypeArr"
                        :key="type.value"
                        :value="type.value"
                    >{{type.text}}</Option>
                </Select>
            </div>
        </div>
        <div class="condition">
            <div class="conditionMoreBox" v-if="showStatus4BS">
                <label>订单状态</label>
                <Select class="inSelect" v-model="outData.orderStatus4BS">
                    <Option
                        v-for="type in orderStatusArr"
                        :key="type.value"
                        :value="type.value"
                    >{{type.text}}</Option>
                </Select>
            </div>
            <div v-else class="conditionMoreBoxEmpty"></div>
            <div class="conditionProd">
                <label>分销渠道</label>
                <Cascader
                    class="inCascader"
                    :data="productTypeArr"
                    v-model="outData.prodIdACompanyId"
                    :render-format="formatResult"
                    :load-data="loadData"
                ></Cascader>
            </div>
            <div class="conditionMoreBoxEmpty"></div>
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
import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";

var defaultFullVaule = -101;

export default {
    props: ["filterParam", "orderStatusList"],
    directives: {},
    components: {},
    data() {
        return {
            showStatus4BS: true, //订单状态筛选框是否显示
            outData: {
                //输出的数据
                orderNo: null, //订单号
                orderStatus4BS: null, //订单状态，不同的业务数据不一样，根据UE来，并且需要跟 tab切换 保持一致。
                personName: null, //预订人姓名
                phoneNumber: null, //预订人手机号码
                scheduledBeginTime: null, //预订日期从，格式yyyy-MM-dd
                scheduledEndTime: null, //预订日期到，格式yyyy-MM-dd
                providerType: null,
                prodIdACompanyId: null //分销渠道，渠道ID加上公司ID
            },
            orderStatusArr: [
                {
                    value: defaultFullVaule,
                    text: "全部"
                }
            ],
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

            emptyCpy: {
                value: -2,
                label: "无企业"
            }
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
        orderStatusList: {
            handler(val) {
                //当入参发送变化的时候,更新订单状态列表
                if (val) {
                    this.orderStatusArr = val;
                }
            },
            deep: true,
            immediate: true
        },
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
        },
        /**
         * //给选择器参数添加默认值
         */
        initSelectValue() {
            //给选择器参数添加默认值
            this.outData.orderStatus4BS = this.orderStatusArr[0].value;
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
                //触发一次 查询点击
                that.onQuery();
            }, 500);
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
            travelfun.getProviderInfos4Net().then(
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

            that.initSelectValue();
            that.outData.orderNo = null;
            that.outData.personName = null;
            that.outData.phoneNumber = null;
            that.outData.scheduledBeginTime = null;
            that.outData.scheduledEndTime = null;
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

            // "";
            let theOutput = JSON.parse(JSON.stringify(that.outData));

            (theOutput.providerType == defaultFullVaule ||
                theOutput.providerType == null) &&
                delete theOutput["providerType"];
            (theOutput.orderStatus4BS == defaultFullVaule ||
                theOutput.orderStatus4BS == null) &&
                delete theOutput["orderStatus4BS"];

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
                if (!(companyId == null || companyId == defaultFullVaule)) {
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
            if (!!callback) {
                item.loading = true;
            }
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
                    if (!!callback) {
                        item.loading = false;
                        callback();
                    }
                },
                function(error) {
                    console.info(error);
                    item.children = itemChild;
                    if (!!callback) {
                        item.loading = false;
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
        .conditionMoreBoxEmpty {
            width: 252px;
            display: flex;
        }
        .conditionPay {
            display: flex;
            // margin-left: 125px;
            .inCascader {
                margin-left: 3px;
                width: 230px;
            }
        }
        .conditionProd {
            display: flex;
            margin-left: 0px;
            .inCascader {
                margin-left: 3px;
                width: 230px;
            }
        }
        .custlabel1 {
            width: 80px;
        }
        .condition-item {
            width: 150px;
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
