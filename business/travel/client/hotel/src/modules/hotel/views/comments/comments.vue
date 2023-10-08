<template>
<div class='commentsWrap'>
    <iframe :src='src' class='commentsIframe' @load="initAppBackFun"></iframe>
</div>
</template>
<script>
import hotelHandler from 'hotelHandler/hotelHandler.js'
export default {
    mixins: [hotelHandler.mixin.tChatEventMixin],
    directives: {
    },
    components: {
    },
    props:{
    },
    data() {
        return {
            src:'https://m.elong.com/hotel/'+(this.$route.query.hid || 90600121)+'/review/?sswbv_multipage=false'
        }
    },
    created() {
        let _this = this;  
        _this.$emit('showOff', true);
    },
    mounted() {
    },
    methods: { 
        /**
            * T信回退事件的注册回调 必须是goBackFun
            */
        goBackFun(){
            hotelHandler.closePage('');              
        }
    }
}
</script>
<style scoped lang="less">
.commentsWrap{
    margin-top: -0.8rem;
    height: 110%;
}
.commentsIframe{
    width: 100%;
    height: 100%;
    border: none;
}
</style>

