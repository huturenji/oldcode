<template>
    <component
        v-bind:is="currentOrderItem"
        :bpProductType="bpProductType"
        :filterParam="filterParam"
        :orderStatusList="orderStatusList"
        @onQueryClick="onQueryClick"
        @onClearClick="onClearClick"
    ></component>
</template>

<script>
//快递的筛选区
const conditionalFilterExpress = () => import("./conditionalfilter/express.vue");
//因为 机票、火车票、酒店 筛选区是一样的，特殊处理
const conditionalFilterTicket = () => import("./conditionalfilter/onetype.vue");
//全部 合并的筛选区
const conditionalFilterFTH = () => import("./conditionalfilter/alltype.vue");
//机票、保险、酒店、火车票 异常订单的筛选区
const conditionalFilterAbnormal = () => import("./conditionalfilter/abnormal.vue");

export default {
    components: {
        conditionalFilterFTH,
        conditionalFilterTicket,
        conditionalFilterExpress,
        conditionalFilterAbnormal,
    },
    props: ["orderType", "filterParam","orderStatusList"],
    data() {
        return {
            currentOrderItem: "",
            bpProductType:1,
        };
    },
    computed: {},
    watch: {
        orderType: {
            handler(val) {
                if(val.indexOf("Abnormal") != -1){
                    if(val == "AbnormalFlight"){
                        this.bpProductType = 1
                    }else if(val == "AbnormalHotel"){
                        this.bpProductType = 2
                    }else if(val == "AbnormalTrain"){
                        this.bpProductType = 3
                    }else if(val == "AbnormalInsurance"){
                        this.bpProductType = 5
                    }                    
                    this.currentOrderItem = "conditionalFilterAbnormal";
                }else{
                    this.currentOrderItem = "conditionalFilter" + val;
                }
                // console.info("filter=" + this.currentOrderItem);
            },
            immediate: true
        }
    },
    methods: {
        onQueryClick(outData) {
            this.$emit("onQueryClick", outData);
        },
        onClearClick() {
            this.$emit("onClearClick");
        }
    }
};
</script>
<style scoped lang="less">
</style>
