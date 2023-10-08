<template>
    <div>
        <!-- 动态组件，根据订单类型Code加载相应的item组件 -->
        <component :is="currentOrderItem" :orderItem="orderItem" :isPc='isPC' :isFullScreen='fullScreen'
                   :showPers='showPersion' :showOrg='showOrgnization' :useTypeConfig='useTypeConfig' @goPage="goPage"></component>
        <btnGroup :orderItem="orderItem" @togglePopLoading="togglePopLoading" @refreshOrderDetail="$emit('refreshOrderDetail','')"></btnGroup>
    </div>
</template>

<script>
import btnGroup from './btnGroup';
import orderItemFlight from './orderItemFlight';
import orderItemTrain from './orderItemTrain';
import orderItemHotel from './orderItemHotel';
import orderItemCar from './orderItemCar';
import extendUtils from 'orderCommon/extend.js';
export default {
    components: { orderItemFlight, orderItemTrain, orderItemHotel,orderItemCar,btnGroup },
    props: ['orderItem', 'isPc', 'isFullScreen', 'showOrg', 'showPers'],
    data() {
        return {
            isPC: this.isPc,
            fullScreen: this.isFullScreen,
            showPersion: this.showPers,
            showOrgnization: this.showOrg,
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
            let _this = this;
            return _this.isPC ? 'orderItem' + this.orderItem.typeCode + "PC" : 'orderItem' + this.orderItem.typeCode;
        }
    },
    watch: {
        isFullScreen(val) {
            var _this = this;
            _this.fullScreen = val;
        },
        showPers(val) {
            var _this = this;
            _this.showPersion = val;
        },
        showOrg(val) {
            var _this = this;
            _this.showOrgnization = val;
        }

    },
    methods: {
        /**
             * Item子组件公共的跳转订单详情的方法，这里再调用订单列表的跳转方法
             * @param index
             */
        goPage(index) {
            this.$emit("goPage", index);
        },

        togglePopLoading(loading){
            this.$emit('togglePopLoading', loading);
        }
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/indexOrder/orderItem.less';
</style>
