<template>
    <div class="order-success"> 
        <div class="tab">
            <div class="orderSuc">
                <div class="topWrap">
                    <div class="top">
                        <icon type="icon_common_success" size="1.16"/>
                        <div class="tit">付款成功</div>
                        <div class="text" v-if="pageFrom === 'multi'">我们将在行程结束后为您寄送行程单，届时请在订单详情中查看开票状态</div>
                        <div class="text" v-else-if="pageFrom === 'orderDetail'">我们将在行程结束后为您寄送报销凭证</div>
                    </div>
                </div>
            </div>
            <div class="submit_btn cursorp" @click="toOrderDetail"> 完成 </div>
        </div> 
    </div>
</template>

<script>
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';
import icon from 'components/icon/index';
export default {
    name: 'invoiceSuc',
    components: {
        icon
    },
    props:{
        pageFrom: {
            type: String
        }
    },
    created () {
    },
    methods: {
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
                this.$router.go(-1);
            } 
        }
    }
}
</script>

<style lang="less" scoped>
@import '~themes/default/styles/invoiceSuc.less';
</style>

