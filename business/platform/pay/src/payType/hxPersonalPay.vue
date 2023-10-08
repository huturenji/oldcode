<template>
</template>

<script>
    /**
     * 华兴银行个人付
     */
    import mixin from './mixin';

    export default {
        mixins: [mixin],
        created: function () {
            this.payTypeCase = this.payType.GDHX_PAY;
            //激活时立即创建预付单
            this.notifyCreatePay();
        },
        methods: {
            afterCreateOrder(data){
                this.lockPage(false);
                this.toThreePayDo(this.payTypeCase.appFuncName, data.content).then(()=>{
                    this.operationWaiting();
                })
            }
        },
    }

</script>
