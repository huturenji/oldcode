<template>
    <EmptyX tipsText='页面不见了'/>
</template>
<script>
import EmptyX from "components/empty/EmptyX.vue";
import MyCouponHandler from '../../coupon/views/MyCouponHandler.js';
export default {
    mixins: [MyCouponHandler.mixin.tChatEventMixin],
    components: {
        EmptyX
    },
    data: function () {
        return {}
    },
    created: function () {
    },
    mounted: function () {},
    activated: function () {},
    deactivated: function () {},
    watch: {},
    methods: {
        /**
        * T信回退事件的注册回调 必须是goBackFun
        */
        goBackFun(){
            MyCouponHandler.closePage('');              
        }
    }
}
</script>