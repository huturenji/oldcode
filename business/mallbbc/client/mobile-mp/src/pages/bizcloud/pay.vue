<template>
    <view>
        <web-view :src="link"> </web-view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            link: '', 
            redirectUrl: '', 
            payState: {
                'SUCCESS': 1,
                'CANCLE': 2,
                'FAIL': 3
            }
        }
    },
    onLoad(options) {
        let payData = decodeURIComponent(options.payData) 
        this.redirectUrl = decodeURIComponent(options.redirectUrl)
        this.requestPay(payData)
    },
    methods: {
        /***
         * 拉起微信小程序的支付
         * @param payData 拉起支付需要的参数
         */
        requestPay(payData){
            let that = this;
            try {
                let params = JSON.parse(payData)
                uni.requestPayment({
                    ...params,
                    success(res){
                        that.payDone(that.payState.SUCCESS)    
                    },
                    fail(res){
                        if(res.errMsg == 'requestPayment:fail cancel'){
                            that.payDone(that.payState.CANCLE)  
                        } else {
                            that.payDone(that.payState.FAIL) 
                        }
                    },
                    complete(res){}
                })
            } catch (error) {
                that.payDone(that.payState.FAIL);
            }
        },
        /**
         * 支付完成后回调 包括支付成功，支付取消，支付失败三个场景
         * @param {*} state 支付状态
         */
        payDone(payState){
            if(this.redirectUrl){
                this.link = `${this.redirectUrl}${this.redirectUrl.indexOf('?') > -1 ? '&' : '?'}payState=${payState}`;
            }
        }
        
    }
}
</script>