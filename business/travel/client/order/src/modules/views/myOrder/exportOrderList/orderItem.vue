<template>
    <div>
        <!-- 动态组件，根据订单类型Code加载相应的item组件 -->
        <component :is="currentOrderItem" :orderItem="orderItem" :useTypeConfig='useTypeConfig'></component>
    </div>
</template>

<script>
import orderItemFlight from '../orderItem/orderItemFlight';
import orderItemTrain from '../orderItem/orderItemTrain';
import orderItemHotel from '../orderItem/orderItemHotel';
import orderItemCar from '../orderItem/orderItemCar';
import extendUtils from 'orderCommon/extend.js';
export default {
    components: { orderItemFlight, orderItemTrain, orderItemHotel,orderItemCar },
    props: ['orderItem'],
    data() {
        return {
            useTypeConfig: null
        }
    },
    async created(){
        this.useTypeConfig = await extendUtils.useTypeConfig()
    },
    computed: {
        /**
             * 根据产品Code拼接组件名字
             */
        currentOrderItem: function () {
            return 'orderItem' + this.orderItem.typeCode;
        }
    },
    methods: {
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/indexOrder/orderItem.less';
</style>
