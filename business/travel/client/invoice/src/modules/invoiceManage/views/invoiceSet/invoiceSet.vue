<template>
    <div>
         <swp-invoice-card class="enterpriseInvoice" ref='invoiceCard' :title = "title" :showCheck='false' :invoiceType='"enterprise"'></swp-invoice-card>
         <!-- <InvoiceCard class="enterpriseInvoice" ref='invoiceCard' :title = "title" :showCheck='false' :invoiceType='"enterprise"'></InvoiceCard> -->
    </div>
</template>
<script>    
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';
// const InvoiceCard = ()=>import('modules/invoiceManage/components/invoiceCard.vue');
export default {
    mixins: [invoiceHandler.mixin.tChatEventMixin],
    directives: {
    },
    components: {
        // InvoiceCard
    },
    data: function() {
        let managerData = invoiceHandler.stateManager.setData([], this);
        return Object.assign(managerData,{
            title:'企业发票抬头'
        })
    },
    created: function() {
        var _this = this;
        let urlTitle = decodeURI(decodeURI(_this.$route.query.title || ''));
        if ('' != urlTitle){
            _this.title = urlTitle;
        }
        document.title = _this.title;
        //注册并监听t信返回事件
        // invoiceHandler.appBack(function(){
        //     invoiceHandler.stateManager.closeTopPop(() => {
        //         invoiceHandler.goBackPage('');
        //     });                                                          
        // },this)
    },
    mounted: function() {},
    methods: {
        //注册并监听t信返回事件
        goBackFun(){
            // let that = this
            invoiceHandler.closePage('')
        }
    }
}
</script>
<style lang="less">
.enterpriseInvoice .editDetail .showReceiptList{
    height: calc(~'100vh - 2.5rem');
}
</style>
