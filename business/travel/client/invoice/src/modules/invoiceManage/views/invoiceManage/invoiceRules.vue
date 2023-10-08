<template>
    <div>
        <div class="content">
            <h3 class="title">机票</h3>
            <p class="text">1.机票行程单、保险发票、退票手续费收据将一并快递邮寄，快递费用将开具电子发票，请在订单详情中查看；兆日国际旅行社将在行程结束后为您寄送相关报销凭证，每单快递费用￥15元</p>
            <p class="text">2.机票报销凭证请于订单支付成功至航班起飞后30天内开具，超时将无法补开</p>
        </div>
        <div class="content">
            <h3 class="title">火车票</h3>
            <p class="text">1.火车票报销凭证即为您购买成功的实名制火车票，如您直接用二代身份证检票乘车，可在自乘车日期起至31天内，凭购票时所使用的二代居民身份证原件，到车站自动售(取)票机、售票窗口换取纸质车票作为报销凭证，逾期不可办理</p>
            <p class="text">2.兆日国际旅行社在您购票成功后将为您开具火车票购票手续费发票（电子），届时请在订单详情中查看</p>
            <p class="text">3.火车票购票手续费发票请在购票成功后30天内开具，超时将无法补开</p>
        </div>
        <div class="content">
            <h3 class="title">酒店</h3>
            <p class="text">1.预订酒店时，支付方式如为在线支付，兆日国际旅行社将为您开具增值税普通发票（电子），离店后可在订单详情中查看；支付方式如为到店支付，请在离店时于酒店前台索取</p>
            <p class="text">2.酒店报销凭证请于订单支付成功至离店后30天内开具，超时将无法补开</p>
        </div>
        <!-- <div class="content">
            <h3 class="title">商务用车</h3>
            <p class="text">1.根据相关政策规定，发票内容仅支持开具“*旅游服务*交通费”</p>
            <p class="text">2.行程中发生的过路过桥费、高速费、停车费等，请您及时向收费站和停车场索取相关发票，根据国家税收相关法规规定，不得开具以上项目的发票</p>
            <p class="text">3.行程中消费的各种形式的折扣券金额不支持开票</p>
            <p class="text">4.如您开具的增值税普通发票用于企业报销，根据国家税务相关政策要求填写纳税人识别号；如您的单位是非企业性质或您要求开具给人名义抬头，您可以选择“个人/非企业单位”的开票选项，则无需填写纳税人识别号</p>
        </div> -->
        <div class="tips">如有疑问，请联系客服 <a class='tel-btn' @click='callPhone()'> {{BIS_CUSTOMER_SERVICE_PHONE}}</a></div>
    </div>
</template>

<script>
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';
export default {
    mixins: [invoiceHandler.mixin.tChatEventMixin],
    name: 'invoiceRules',

    data () {
        return {
            BIS_CUSTOMER_SERVICE_PHONE: invoiceHandler.BIS_CUSTOMER_SERVICE_PHONE
        }
    },
    created () {
        // let that = this
        // invoiceHandler.appBack(function(){
        //     invoiceHandler.stateManager.closeTopPop(() => {
        //         that.$router.back()
        //     });
        // },that)
    },
    methods: {
        //注册并监听t信返回事件
        goBackFun(){
            let that = this
            that.$router.back()
        },
        callPhone () {
            sinosdk.sino.callTel(this.BIS_CUSTOMER_SERVICE_PHONE)
        }
    }
}
</script>

<style lang='less' scoped>
@import '~themes/default/styles/common/index.less';
@import '~styles/mixins/mixinsStyle.less';
.content {
    padding: 0 .3rem;
    .title {
        font-size: .38rem;
        font-weight: bold;
        padding: .3rem 0;
    }
    .text {
        padding-bottom: .2rem;
    }
}
.tips {
    margin-top: 1rem;
    text-align: center;
    .tel-btn{
        cursor:pointer;
        color: @theme-color;
        &:active{
           opacity: .8;
        }
    }
}
</style>
