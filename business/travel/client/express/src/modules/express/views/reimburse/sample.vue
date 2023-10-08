<template>
    <div id="sample">
        <div class="item">
            <div class="title">行程单</div>
            <div class="description">行程单是《航空运输电子客票行程单》由国家税务总局监制并按照纳入税务机关发票管理，机票行程单正式上线是旅客购买国内航空运输电子客票的付款及报销的凭证。</div>
            <img src="~assets/img/express/icon_invoice.png">
        </div>
        <div class="item">
            <div class="title">保险发票</div>
            <div class="description">保险将会提供定额发票作为报销凭证</div>
            <img src="~assets/img/express/icon_invoice2.png">
        </div>
        <div class="item">
            <div class="title">退票手续费收据</div>
            <div class="description">退票产生的手续费，商旅通将会提供收据作为报销凭证</div>
            <img src="~assets/img/express/icon_invoice1.png">
        </div>
    </div>
</template>

<script>
import expressHandler from '../expressServer/js/expressHandler.js';
export default {
    mixins: [expressHandler.mixin.tChatEventMixin],
    name: 'sample',
    data () {
        return {
        }
    },
    created() {
        document.title = '报销凭证';
    },
    methods: {
                /**
                 * 注册app返回刷新等事件
                 */	
                registerAppfun(){
                    let _this = this;
                    //注册ios异步跳转事件
                    sinosdk.sino.overwriteWindowopen();
                },
                /**
                * T信回退事件的注册回调 必须是goBackFun
                */
                goBackFun(){
                    expressHandler.closePage('')
                },  
    }
}
</script>

<style scoped lang='less'>
@import '~themes/default/styles/reimburse/sample.less';
</style>
