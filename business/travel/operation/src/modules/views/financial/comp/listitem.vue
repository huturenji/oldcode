<template>
    <div class="statisticsListRow">
        <div
            v-for="column in headerItemData"
            :key="column"
            :cloumn="getColumnWidth(column)"
            v-show="isInSelectedList(column)"
            :class="{'rowDarkbg':isDarkbg(ItemDataUI)}"
        >
            <!-- table的header不需要tip标签 -->
            <div class="no-wrap textHeader" v-if="ItemDataUI.position==0">{{ItemDataUI[column]}}</div>
            <Tooltip v-else :content="ItemDataUI[column]" placement="bottom" :transfer="true">
                <div class="no-wrap textContent">{{ItemDataUI[column]}}</div>
            </Tooltip>
        </div>
    </div>
</template>

<script>
import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";

export default {
    props: [
        "headerItemData",
        "selectedColumns",
        "lineNum",
        "itemData",
        "orderTypeList"
    ],
    directives: {
        // TransferDom
    },
    components: {
        // Popup,
        // XDialog,
        // Popover,
    },
    data() {
        return {
            itemStatusList: [
                {
                    value: 0,
                    text: "已出票"
                },
                {
                    value: 1,
                    text: "已退票"
                },
                {
                    value: 2,
                    text: "已改签"
                },
                {
                    value: 3,
                    text: "已退保"
                },

                {
                    value: 4,
                    text: "已确认"
                },
                {
                    value: 5,
                    text: "已结账"
                },
                {
                    value: 6,
                    text: "已取消"
                }
            ],
            emptyItem: "---" //默认占位符
        };
    },
    computed: {
        /**
         * UI显示的列表数据
         */
        ItemDataUI: function() {
            let result = {};
            if (!!this.headerItemData && !!this.itemData && !!this.lineNum) {
                //说明是row对象，
                for (let i = 0; i < this.headerItemData.length; i++) {
                    let value = utils.getConditionsValues(this.headerItemData[i]);
                    if (i == 0) {
                        result[this.headerItemData[i]] = this.lineNum;
                    } else if (
                        utils.getConditionsValueType(this.headerItemData[i]) == 1
                    ) {
                        result[this.headerItemData[i]] =
                            this.itemData[value[0]] || this.emptyItem;
                    } else if (
                        utils.getConditionsValueType(this.headerItemData[i]) == 2
                    ) {
                        result[this.headerItemData[i]] = this.isNotEmpty(
                            this.itemData[value[0]]
                        );
                    } else if (
                        utils.getConditionsValueType(this.headerItemData[i]) == 3
                    ) {
                        result[
                            this.headerItemData[i]
                        ] = this.getPaymentName4Item(
                            this.itemData[value[0]],
                            this.itemData[value[1]]
                        );
                    } else if (
                        utils.getConditionsValueType(this.headerItemData[i]) == 4
                    ) {
                        result[this.headerItemData[i]] =
                            travelfun.getUserType(this.itemData[value[0]]) || this.emptyItem;
                    } else if (
                        utils.getConditionsValueType(this.headerItemData[i]) == 5
                    ) {
                        result[this.headerItemData[i]] = this.getOrderTypeName(
                            this.itemData[value[0]]
                        );
                    } else {
                        console.log("get error");
                        result[this.headerItemData[i]] = "get error";
                    }
                }
                result.position = this.lineNum;
            } else if (!!this.headerItemData) {
                //说明是header对象，
                for (let i = 0; i < this.headerItemData.length; i++) {
                    result[this.headerItemData[i]] = this.headerItemData[i];
                }
                result.position = 0;
            }
            return result;
        },
        /**
         * 根据字段 确认 宽度
         */
        ItemDataUIColumnWidth: function() {
            let result = {};
            for (let i = 0; i < this.headerItemData.length; i++) {
                if (utils.isConditionDivWidth3(this.headerItemData[i])) {
                    //默认 序号、出行类型、订单类型、供应商
                    result[this.headerItemData[i]] = 3;
                } else if (utils.isConditionDivWidth2(this.headerItemData[i])) {
                    //默认 序号、出行类型、订单类型、供应商
                    result[this.headerItemData[i]] = 2;
                } else if (utils.isConditionDivWidth0(this.headerItemData[i])) {
                    //默认 序号
                    result[this.headerItemData[i]] = 0;
                } else {
                    result[this.headerItemData[i]] = 1;
                }
            }
            return result;
        }
    },
    created() {},
    mounted() {},

    watch: {
        //选中的字段发生改变,控制隐藏或者显示
        selectedColumns: function(val, oldVal) {
            let that = this;
            if (val != oldVal && !!val) {
            }
        }
    },
    methods: {
        /**
         * 是否是双号的一行 控制背景的颜色
         */
        isDarkbg(itemData) {
            if (!!itemData) {
                return parseInt(itemData.position) % 2 == 0;
            }
            return false;
        },
        /**
         * 某一个字段是否需要显示，否则隐藏
         */
        isInSelectedList(val) {
            return this.selectedColumns.indexOf(val) != -1;
        },
        /**
         * 根据column字段获取宽度
         */
        getColumnWidth(key) {
            return this.ItemDataUIColumnWidth[key];
        },
        /**
         * 获取订单类型
         */
        getOrderTypeName(type) {
            if (!!this.orderTypeList) {
                for (let i = 0; i < this.orderTypeList.length; i++) {
                    if (
                        parseInt(this.orderTypeList[i].value) == parseInt(type)
                    ) {
                        return this.orderTypeList[i].text;
                    }
                }
            }
            return this.emptyItem;
        },
        getOrderStatus(status) {
            let result = this.emptyItem;
            this.itemStatusList.forEach(element => {
                if (parseInt(element.value) == parseInt(status)) {
                    result = element.text;
                }
            });
            return result;
        },
        isNotEmpty(param) {
            if (typeof param == "undefined" || param + "" == "null") {
                return this.emptyItem;
            } else {
                return param + "";
            }
        },
        getPaymentName4Item(payType, payment) {
            if (payType == "PAY_IN_CASH") {
                return "到店付";
            } else {
                return travelfun.getPaymentName(payment);
            }
        }
    }
};
</script>
<style scoped lang="less">
@import "~styles/mixins/mixins.less";
.statisticsListRow {
    background: white;
    color: #333333;
    display: -webkit-box;
    [cloumn="0"] {
        width: 50px;
    }
    [cloumn="1"] {
        width: 120px;
    }
    [cloumn="2"] {
        width: 200px;
    }
    [cloumn="3"] {
        width: 300px;
    }
    > div {
        flex-shrink: 0;
        text-align: center;
        padding: 10px 0px;
    }
    .textHeader {
        font-weight: bold;
    }
    .textContent {
        font-size: 12px;
        display: block;
    }
}
.rowDarkbg {
    background: #ebebeb;
    color: #666666;
}
</style>
<style>
.ivu-tooltip-arrow {
    display: none !important;
}
/* ivu-tooltip-popper ivu-tooltip-dark */
.ivu-tooltip-inner {
    background-color: #fff !important;
    color: #191919 !important;
    border-radius: 2px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    white-space: normal;
    word-break: break-all;
}
</style>

