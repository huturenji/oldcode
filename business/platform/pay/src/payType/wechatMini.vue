<script>
    import mixin from './mixin';
    
    export default {
        mixins: [mixin],
        created: function () {
            this.payTypeCase = this.payType.WX_MINI_PAY;
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
                let url = this.config.weixinMiniParam.url;
                let split = '?'
                if(url.indexOf('?') > -1){
                    split = '&'
                }
                url += `${split}payData=${encodeURIComponent(data.content)}`
                wx.miniProgram.navigateTo({
                    url: url
                });
                this.operationEnd();
            },
        },
    }

</script>
