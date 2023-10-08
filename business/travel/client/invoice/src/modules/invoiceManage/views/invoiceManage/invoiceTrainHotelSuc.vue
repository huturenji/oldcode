<template>
    <div class="order-success">
        
        <div class="tab" v-if="pageFrom === 'multi'">
            <div class="orderSuc">
                <div class="topWrap">
                    <div class="icon-wrap">
                         <icon type="service" size="1.12"/>
                    </div>
                    <div class="">
                        <div class="textTrain" v-if="tripType === 'car'">已为您开具商务用车发票，请在订单详情查看开票状态</div>
                        <div class="textTrain" v-else-if="tripType === 'train'">已为您开具火车票购票手续费发票，请在订单详情查看开票状态</div>
                        <div class="textTrain" v-else-if="tripType === 'hotel'">我们将在您离店后1-2个工作日内开具发票，届时请在订单详情中查看开票状态</div>
                    </div>
                </div>
            </div>
            <div class="submit_btn cursorp" @click="toOrderDetail"> 知道了 </div>
        </div>
        
    </div>
</template>

<script>
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';
import icon from 'components/icon/index';
export default {
    mixins: [invoiceHandler.mixin.tChatEventMixin],
    name: 'invoiceSuc',
    components: {
        icon
    },
    props:{

    },
    data(){
        return {
            tripType: '',
            pageFrom: ''
        }
    },
    mounted () {
        this.tripType = this.$route.query.tripType;
        this.pageFrom = this.$route.query.pageFrom;
    },
    methods: {
        //注册并监听t信返回事件
        goBackFun(){
            let that = this
            that.goBack();
        },

        toOrderDetail () {
            this.goBack();
        },
        goBack(){
            // 如果是从订单详情过来的，回到订单详情页去，关窗口即可，如果是批量开发票过来了，回到选择发票页，路由回退
            if (this.pageFrom == 'orderDetail') {
                //退回到订单
                let loadData = JSON.stringify({refresh:true});
                invoiceHandler.closePage('', 1, loadData);
            } else {
                this.$router.go(-2);
            } 
        }
    }
}
</script>

<style lang="less" scoped>
@import '~themes/default/styles/invoiceSuc.less';
</style>

