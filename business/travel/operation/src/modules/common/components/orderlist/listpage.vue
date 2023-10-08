<template>
    <div class="orderListPage">
        <!-- 顶部筛选区 -->
        <conditionalFilter
            :orderType="orderTypeFilter"
            :filterParam="filterParam"
            :orderStatusList="tabList"
            @onQueryClick="onQueryClick"
            @onClearClick="onClearClick"
        ></conditionalFilter>
        <!-- 上部tab区 -->
        <orderStatusTab
            :tabList="tabList"
            :specifiedIndex="specifiedIndex"
            v-model="selectTabIndex"
        >
            <div :slot="'tabPop'+ (tabList.length -1 )" v-if="orderType=='Flight'">
                <div class="line1">{{tabPopInvoiceTitleFli}}</div>
                <div class="line3">{{tabPopInvoiceContentFli}}</div>
            </div>
            <div :slot="'tabPop'+ (tabList.length -1 )" v-else-if="orderType=='Hotel'">
                <div class="line1">{{tabPopInvoiceTitleHot}}</div>
                <div class="line3">{{tabPopInvoiceContentHot}}</div>
            </div>
            <div :slot="'tabPop'+ (tabList.length -1 )" v-else-if="orderType=='Train'">
                <div class="line1">{{tabPopInvoiceTitleTra}}</div>
                <div class="line3">{{tabPopInvoiceContentTra}}</div>
            </div>
            <div :slot="'tabPop'+ (tabList.length -1 )" v-else-if="orderType=='FTH'">
                <div class="line1">{{tabPopInvoiceTitleFli}}</div>
                <div class="line3">{{tabPopInvoiceContentFli}}</div>
                <div class="line1">{{tabPopInvoiceTitleTra}}</div>
                <div class="line3">{{tabPopInvoiceContentTra}}</div>
                <div class="line1">{{tabPopInvoiceTitleHot}}</div>
                <div class="line3">{{tabPopInvoiceContentHot}}</div>
            </div>
        </orderStatusTab>
        <!-- 中下部列表区 -->
        <orderListArea
            :orderList="orderList"
            :mailPreData="mailPreData"
            :pageData="pageData"
            :isLoadData="isLoadData"
            @refreshPage="refreshPage"
            @getSenderInfos="getSenderInfos"
            @turnPage="turnPage"
        >
            <div slot="listTop" class="orderCountLabel">
                共
                <span>{{totalRecord}}</span>条订单
            </div>
        </orderListArea>
    </div>
</template>

<script>
const orderStatusTab = () => import("./comp/statustab.vue");
const orderListArea = () => import("./comp/listarea.vue");
const conditionalFilter = () => import("./comp/conditionalfilter.vue");

export default {
    props: [
        "menuIndex",
        "pageData",
        "isLoadData",
        "orderType",
        "orderList",
        "totalRecord",
        "mailPreData",
        "tabList",
        "filterParam"
    ],
    directives: {},
    components: {
        orderStatusTab,
        orderListArea,
        conditionalFilter
    },
    data() {
        return {
            selectTabIndex: 0, //选中的标签
            tabPopInvoiceTitleFli: "机票报销凭证", //
            tabPopInvoiceContentFli:
                "机票行程单、保险发票、退票手续费收据将开具纸质凭证并快递邮寄至客户，快递费用将开具增值税普通发票（电子），可在订单详情中查看。", //
            tabPopInvoiceTitleTra: "火车票购票手续费报销凭证", //
            tabPopInvoiceContentTra:
                "火车票购票手续费将开具增值税普通发票（电子），车票出票成功后可在订单详情中查看。", //
            tabPopInvoiceTitleHot: "酒店报销凭证", //
            tabPopInvoiceContentHot:
                "预付酒店报销凭证为增值税普通发票（电子），客户离店后可在订单详情中查看酒店报销凭证。现付酒店报销凭证为酒店现场开具", //
            statusList:[
                {
                    name: 0,
                    value: 'WAIT'
                },  
                {
                    name: 1,
                    value: 'PROCESSING'
                },
                {
                    name: 2,
                    value: 'SUCCESS'
                },
                {
                    name: 3,
                    value: 'FAIL'
                }
            ],
            typeList:[
                {
                    name: 1,
                    value: 'FAIL_OUT_TICKET_FLIGHT'
                },  
                {
                    name: 2,
                    value: 'FAIL_TO_INSURE_INSURANCE'
                },
                {
                    name: 3,
                    value: 'FAIL_OUT_TICKET_TRAIN'
                },
                {
                    name: 4,
                    value: 'FAIL_TO_REFUND_FLIGHT'
                },
                {
                    name: 5,
                    value: 'FAIL_TO_REFUND_TRAIN'
                },  
                {
                    name: 6,
                    value: 'FAIL_TO_REFUND_CHANGE_TRAIN'
                },
                {
                    name: 7,
                    value: 'FAIL_TO_REFUND'
                },
                {
                    name: 8,
                    value: 'FAIL_TO_REFUND_INSURANCE'
                }
            ]

        };
    },
    created() {},
    mounted() {},
    computed: {
        //条件筛选区的标识字段
        orderTypeFilter: function() {
            // ""
            if (
                this.orderType == "Flight" ||
                this.orderType == "Hotel" ||
                this.orderType == "Train" ||
                this.orderType == "Insurance"
            ) {
                //因为 机票、火车票、酒店 筛选区是一样的，特殊处理
                return "Ticket";
            }
            return this.orderType;
        }
    },

    watch: {
        selectTabIndex: {
            //监控上部tab标签的选中事件
            handler(value, oldVal) {
                if (value >= 0) {
                    this.$emit("onTabSelected", value);
                }
            }
        },
        tabList: {
            handler(val) {
                //如果有默认选中，需要及时处理一下
                if (val) {
                    for (let i = 0; i < val.length; i++) {
                        if (val[i].selected) {
                            this.specifiedIndex = i;
                            break;
                        }
                    }
                }
            },
            immediate: true,
            deep: true
        },
        orderList: {
            handler(val) {
                // this.showHasOrders = val && val.length > 0;
                this.fieldConvert();
            },
            immediate: true,
            deep: true
        }
    },

    methods: {
        /**
         * 指定页码翻页跳转
         * @param page
         */
        turnPage(page) {
            this.$emit("turnPage", page);
        },
        /**
         * 删除列表某一条Item后，刷新页面
         */
        refreshPage(pageObj) {
            this.$emit("refreshPage", pageObj);
        },
        /**
         * 查询寄件人地址信息列表
         */
        getSenderInfos() {
            this.$emit("getSenderInfos");
        },
        /**
         * 点击 查询 筛选区
         */
        onQueryClick(outData) {
            //因为筛选区 订单状态 跟 tab组件需要同步，所以这里需要有两个步骤
            this.$emit("onQueryClick", outData);
            //同步订单状态的取值 给 tab组件 显示
            if (!!outData && !!outData.orderStatus4BS) {
                this.specifiedIndex = outData.orderStatus4BS;
            } else {
                this.specifiedIndex = 0;
            }
        },
        /**
         * 点击 清空条件
         */
        onClearClick() {
            this.$emit("onClearClick");
        },
        /**
         * 对orderList 里面服务端更改的bpProductExceptionProcessedStatus,bpProductExceptionType字段做转换 
         */
        fieldConvert(){
            let that = this;
            let list = that.orderList;
            for(let i=0;i<list.length;i++){
                //bpProductExceptionProcessedStatus字段转换
                for(let j=0;j<that.statusList.length;j++){
                    if(list[i].bpProductExceptionProcessedStatus == that.statusList[j].value){
                        list[i].bpProductExceptionProcessedStatus = that.statusList[j].name;
                        continue;
                    }
                };

                //bpProductExceptionType字段转换
                for(let k=0;k<that.typeList.length;k++){
                    if(list[i].bpProductExceptionType == that.typeList[k].value){
                        list[i].bpProductExceptionType = that.typeList[k].name;
                        break;
                    }
                }
            }
        }
    }
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
@font-color: #191919;
.orderListPage {
    .flex-box;
    .flex-flow(column, nowrap);
    background: #fff;
    // padding: 43px 30px 0;
    .line1 {
        color: #333333;
        font-weight: bold;
        text-align: left;
    }
    .line3 {
        color: #7f7f7f;
        line-height: 20px;
        text-align: left;
    }
    .orderCountLabel {
        margin-bottom: 20px;
        color: @label-color;
        line-height: 34px;
        font-size: 14px;
        font-weight: bold;
        span {
            color: @font-color;
        }
    }
}
</style>

