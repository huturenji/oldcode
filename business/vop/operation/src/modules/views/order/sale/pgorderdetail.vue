<script>
import OrderDetail from "biscomponents/order/orderdetail";
// import utils from "bislibs/utils";
import { mapMutations } from "vuex";
// const urlParams = utils.getUrlParams();
// const orderNo = urlParams.orderNo;
// const orderType = urlParams.orderType;
export default {
    extends: OrderDetail,
    created() {
        const { orderNo, orderType } = this.$route.query;
        this.setOrderNo(orderNo);
        this.setOrderType(orderType);
    },
    methods: {
        ...mapMutations({
            setOrderNo: "SET_ORDERNO",
            setOrderType: "SET_ORDERTYPE"
        })
    }
};
</script>