<template>
</template>

<script>

    import mixin from './mixin';
    export default {
        mixins: [mixin],
        created: function () {
            this.payTypeCase = this.payType.XMGJ_PAY;
            //更新config中支付的参数
            this.currPayType.thirdPayInfo.frontUrl = this.config.redirectUri;
            this.setCurrPayType(this.currPayType)
            //激活时立即创建预付单
            this.notifyCreatePay();
        },
        methods: {
            afterCreateOrder(data){
                this.lockPage(false);
                this.beforeH5Pay();
                let form = this.submitForm(JSON.parse(data.content))
                if(h5PayUtil.innerHTMLForm(form)){
                     this.h5PayOperaEnd()
                }
            },
            /**
            * 厦门网关支付调用接口返回的url传入对应的msg参数
            * @para data:{
            *       url:'',
            *       merSignMsg:''   
            *     }
            */
            submitForm(data){
                var tempForm = document.createElement('form');
                tempForm.id = 'payForm';
                tempForm.method = "POST";
                tempForm.action = data.url;
                document.body.appendChild(tempForm);
                var input = document.createElement('input');
                input.type = "hidden";
                input.name = "merSignMsg";
                input.value = data.merSignMsg;
                tempForm.appendChild(input);
                return tempForm.outerHTML;
            }
        },
    }

</script>
