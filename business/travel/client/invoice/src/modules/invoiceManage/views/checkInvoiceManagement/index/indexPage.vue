<template>
<!-- 作为中转页 -->
    <div class="index-page">
        
    </div>
</template>
<script>

import {
    TransferDom
} from 'vux';
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';

// import {isInvoiceCode, isInvoiceNumber, isCheckCode} from '../common/checkInvoiceManagement';
import mixin from '../common/checkInvoiceMixin.js';
export default {
    directives: {TransferDom},
    components: {
    },
    mixins:[mixin],
    data(){
        let managerData = invoiceHandler.stateManager.setData([
           
        ], this);
        return Object.assign(managerData, {
            
        })
        
    },
    watch:{
    },
    created: function () {
        let that = this;
        //注册并监听t信返回事件
        sinosdk.sino.onBack(function(){
            invoiceHandler.stateManager.closeTopPop(()=>{
            
            });
        },that);
 
      
    },
    mounted: function () {
    },
    methods: {
        
    }
}

</script>
<style lang="less" scoped>
@import '~themes/default/styles/indexPage.less';
</style>
