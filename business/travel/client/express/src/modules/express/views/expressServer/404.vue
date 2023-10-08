<template>
    <EmptyX type="error" position="center" tipsText='页面不见了'/>
</template>
<script>
    import expressHandler from './js/expressHandler.js';
    import EmptyX from "components/empty/EmptyX.vue";
    export default {
        mixins: [expressHandler.mixin.tChatEventMixin],
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
                expressHandler.closePage('');              
            }
        }
    }
</script>