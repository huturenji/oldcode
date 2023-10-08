<template>
</template>

<script>
    import h5PayUtil from '../h5Pay'
    import mixin from './mixin';
    export default {
        mixins: [mixin],
        components: {
        },
        props: {
        },
        data() {
            return {
            };
        },
        created: function () {
            this.payTypeCase = this.payType.UNION_PAY;
            //更新config中银联支付的参数
            this.currPayType.thirdPayInfo.frontUrl = this.config.redirectUri;
            this.setCurrPayType(this.currPayType)
            //激活时立即创建预付单
            this.notifyCreatePay();
        },
        activated(){
        },
        mounted() {
        },
        watch: {
        },
        filters: {
        },
        methods: {
            afterCreateOrder(data){
                this.lockPage(false);
                this.beforeH5Pay();
                if(h5PayUtil.innerHTMLForm(data.content)){
                     this.h5PayOperaEnd()
                }
            }
        },
    }

</script>
