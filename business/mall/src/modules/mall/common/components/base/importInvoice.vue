<template>
    <!-- 导入企业发票抬头组件 -->
    <div @click="importInvoiceFun" class="import_invoice_container">
        <Icon class='icon-btn' type='icon_invoice_invoicetitle' size='.32' />
        <span>导入企业发票抬头</span>
    </div>
</template>
<script>
import Icon from 'common/components/base/Icon';
export default {
    components:{
        Icon
    },
    props:{
       
    },
    data(){
        return {
           
        }

    },
    methods:{
        importInvoiceFun(){
            this.$emit('import')
        }
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.import_invoice_container{
    display: flex;
    align-items: center;
    font-size: .26rem;
    color: @theme-color;
    font-weight: normal;
    cursor: pointer;
    &:active{
        opacity: .8;
    }
    span{
        margin-left: .06rem;
    }
}
</style>