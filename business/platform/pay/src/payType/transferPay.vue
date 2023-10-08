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
            this.payTypeCase = this.payType.TRANSFER_PAY;
            //激活时立即创建预付单
            this.notifyCreatePay();
        },
        mounted() {
        },
        activated(){
        },
        methods: {
            afterCreateOrder(data){
                let that = this;
                this.lockPage(false);
                let content = (data || {}).content;
                this.toThreePayDo(this.payTypeCase.appFuncName, this.reloadExtraData(content)).then(data=>{
                    //用户提交表单，审批页面会返回固定参数。否则表明是页面回退
                    if((data.responseData || {}).result == 'applyOver'){
                        this.operationEnd(); //本支付方式不是实时的，不需要轮询支付结果。
                    }
                })
            },
            reloadExtraData(data){
                if(!data){
                    return null;
                }
                data = JSON.parse(data);
                return JSON.stringify(Object.assign({}, data, {
                    extra: JSON.stringify({
                        paymentNo: data.paymentNo,
                        ...this.config.appExtraData
                    })
                }))
            },
        },
    }

</script>
