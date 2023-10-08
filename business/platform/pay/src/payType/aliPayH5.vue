<template>
</template>

<script>
    import mixin from './mixin';
    import h5PayUtil from '../h5Pay'
    import Utils from '../utils/utils'

    export default {
        mixins: [mixin],
        created: function () {
            this.payTypeCase = this.payType.ALI_PAY_H5;
             //更新config中支付的参数
            if(Utils.isNotEmpty(this.config.redirectUri)){
                this.currPayType.thirdPayInfo.frontUrl = this.config.redirectUri;
            }
            //激活时立即创建预付单
            this.notifyCreatePay();
        },
        methods: {
            afterCreateOrder(data){
                this.lockPage(false);
                this.beforeH5Pay();
                this.h5Pay(data.content);
            },
            /**
             * h5支付
             */
            h5Pay(thirdPayResult){
                if(h5PayUtil.innerHTMLForm(thirdPayResult)){
                     this.h5PayOperaEnd()
                }
            },
        },
    }

</script>
