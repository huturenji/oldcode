<template>
    <div class="AmountStatistics">
        <div class="content">
            <div class="unitDiv">单位：元</div>
            <div class="StatisticsConent">
                <div
                    v-for="(dataItem,index) in AmountStatisticsList"
                    :key="dataItem.name"
                    class="StatisticsItem"
                    :class="{'StatisticsItem1':(index+1)==AmountStatisticsList.length}"
                >
                    <div class="firstLine">
                        <span>{{dataItem.name}}</span>
                        <span class="amount">{{dataItem.amount}}</span>
                    </div>
                    <div class="secondLine">
                        <div class="Y2Y">
                            <span>同比</span>
                            <span class="data" :title="dataItem.Y2Y">{{dataItem.Y2Y}}</span>
                            <img :src="dataItem.Y2Yincrease" v-if="!!dataItem.Y2Yincrease">
                        </div>
                        <div class="splice">
                            <span>环比</span>
                            <span class="data" :title="dataItem.M2M">{{dataItem.M2M}}</span>
                            <img :src="dataItem.M2Mincrease" v-if="!!dataItem.M2Mincrease">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["AmountStatisticsData"],
    directives: {
        // TransferDom
    },
    components: {
        // Popup,
        // XDialog,
        // Popover
    },
    data() {
        return {
            emptyItem: "---" //默认占位符
        };
    },
    created() {
        //给选择器参数添加默认值
        this.initPageData();
    },
    computed: {
        AmountStatisticsList: function() {
            return this.getUIDataList(this.AmountStatisticsData);
        }
    },
    mounted() {},

    watch: {
        AmountStatisticsData: function(val, oldVal) {
            let that = this; //选择了不同的查询条件，AmountStatisticsData会刷新。
            // ""
            that.AmountStatisticsList = that.getUIDataList(val);
        }
    },
    methods: {
        initPageData() {},
        getUIDataList(statisticsData) {
            let result = [];
            // if (!!statisticsData) {
            let item = {
                name: "应收金额",
                amount: this.getAmountDisplay(
                    !!statisticsData ? statisticsData.totalAmountReceivable : ""
                ),
                Y2Y: this.getRateDisplay(
                    !!statisticsData ? statisticsData.amountReceivableY2Y : ""
                ),
                Y2Yincrease: this.getAmountIncrease(
                    !!statisticsData ? statisticsData.amountReceivableY2Y : ""
                ),
                M2M: this.getRateDisplay(
                    !!statisticsData ? statisticsData.amountReceivableM2M : ""
                ),
                M2Mincrease: this.getAmountIncrease(
                    !!statisticsData ? statisticsData.amountReceivableM2M : ""
                )
            };
            result.push(item);

            item = {
                name: "应付金额",
                amount: this.getAmountDisplay(
                    !!statisticsData ? statisticsData.totalAmountPayable : ""
                ),
                Y2Y: this.getRateDisplay(
                    !!statisticsData ? statisticsData.amountPayableY2Y : ""
                ),
                Y2Yincrease: this.getAmountIncrease(
                    !!statisticsData ? statisticsData.amountPayableY2Y : ""
                ),
                M2M: this.getRateDisplay(
                    !!statisticsData ? statisticsData.amountPayableM2M : ""
                ),
                M2Mincrease: this.getAmountIncrease(
                    !!statisticsData ? statisticsData.amountPayableM2M : ""
                )
            };
            result.push(item);

            item = {
                name: "利润",
                amount: this.getAmountDisplay(
                    !!statisticsData ? statisticsData.totalProfit : ""
                ),
                Y2Y: this.getRateDisplay(
                    !!statisticsData ? statisticsData.profitY2Y : ""
                ),
                Y2Yincrease: this.getAmountIncrease(
                    !!statisticsData ? statisticsData.profitY2Y : ""
                ),
                M2M: this.getRateDisplay(
                    !!statisticsData ? statisticsData.profitM2M : ""
                ),
                M2Mincrease: this.getAmountIncrease(
                    !!statisticsData ? statisticsData.profitM2M : ""
                )
            };
            result.push(item);
            // }
            return result;
        },
        getRateDisplay(amount) {
            if (!this.isEmpty(amount)) {
                return Math.abs(amount) + "%";
            } else {
                return this.emptyItem;
            }
        },
        getAmountDisplay(amount) {
            return this.isEmpty(amount) ? this.emptyItem : amount;
        },
        getAmountIncrease(amount) {
            if (!this.isEmpty(amount) && Number(amount) > 0) {
                return require("assets//icon_arror_up.png");
            } else if (!this.isEmpty(amount) && Number(amount) < 0) {
                return require("assets//icon_arror_down.png");
            } else {
                return null;
            }
        },
        isEmpty(param) {
            if (typeof param == "undefined") {
                return true;
            } else if (param + "" == "null") {
                return true;
            } else {
                return false;
            }
        }
    }
};
</script>
<style scoped lang="less">
.AmountStatistics {
    // height: 100px;
    width: 100%;
    padding: 20px 32px;
    background: white;
    .content {
        border: 1px solid #ebebeb;
        border-radius: 4px;
        .unitDiv {
            margin: 5px 0 0 10px;
        }
        .StatisticsConent {
            display: flex;
            justify-content: space-around;
            color: #999999;
            margin: 20px 0px;
            .StatisticsItem {
                border-right: solid #ebebeb 1px;
                padding: 0 35px;

                .firstLine {
                    display: flex;
                    align-items: baseline;

                    .amount {
                        color: #478aee;
                        font-size: 18px;
                        margin-left: 10px;
                    }
                }
                .secondLine {
                    display: flex;
                    .splice {
                        margin-left: 20px;
                        display: flex;
                        align-items: baseline;                        
                    }
                    .Y2Y {
                        display: flex;
                        align-items: baseline;                        
                    }
                    .result {
                        color: #333333;
                        margin: 0px 5px;
                        width: 70px;
                        word-break: break-all;
                    }
                    img {
                        height: 6px;
                    }
                }
            }
            .StatisticsItem1 {
                border: none;
            }
        }
    }
}
</style>

