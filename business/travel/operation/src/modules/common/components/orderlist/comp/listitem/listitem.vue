<template>
    <component
        v-bind:is="currentOrderItem"
        :orderItem="orderItem"
        :mailPreData="mailPreData"
        @goDetail="goDetail"
        @refreshPage="refreshPage"
        @getSenderInfos="getSenderInfos"
    ></component>
</template>

<script>
const orderItemFlight = () => import("./flight.vue");
const orderItemTrain = () => import("./train.vue");
const orderItemHotel = () => import("./hotel.vue");
const orderItemExpress = () => import("./express.vue");
const orderItemInsurance = () => import("./insurance.vue");
export default {
    components: {
        orderItemFlight,
        orderItemTrain,
        orderItemHotel,
        orderItemExpress,
        orderItemInsurance
    },
    props: {
        orderItem: {
            //订单列表数据
            type: Object,
            required: true
        },
        mailPreData: {
            //邮寄报销凭证必要的数据
            type: Object,
            default: {
                proviceCityCounty: {}, //省市区数据
                senderAddressList: [], //发件人数据
                expressCompanies: [] //快递公司数据
            }
        }
    },
    data() {
        return {};
    },
    computed: {
        currentOrderItem: function() {
            // console.info('orderItem.typeCode='+this.orderItem.typeCode);
            return "orderItem" + this.orderItem.typeCode;
        }
    },
    methods: {
        goDetail(typeName, typeCode, orderNo) {
            this.$emit(
                "goPage",
                "order/orderDetail",
                typeName,
                typeCode,
                orderNo
            );
        },
        refreshPage() {
            this.$emit("refreshPage");
        },
        getSenderInfos() {
            //每次寄件人地址有更新，新建或者更新，重新刷新常用联系人数据
            this.$emit("getSenderInfos");
        }
    }
};
</script>
<style scoped lang="less">
@import "./listitem.less";
</style>



