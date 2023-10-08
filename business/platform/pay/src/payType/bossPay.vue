<template>
</template>

<script>

    import mixin from './mixin';

    export default {
         mixins: [mixin],
        components: {
        },
        props: {
        },
        data() {
            return {
            }
        },
        created: function () {
            this.payTypeCase = this.payType.INBANK_PAY;
            //激活时立即创建预付单
            this.notifyCreatePay();
        },
        mounted() {
        },
        activated(){
        },
        methods: {
            afterCreateOrder(data){
                this.lockPage(false);
                this.toThreePayDo(this.payTypeCase.appFuncName, (data || {}).content).then(()=>{
                    this.noticeServerAfterPay();
                    this.operationWaiting();
                })
            }
        },
    }

</script>
