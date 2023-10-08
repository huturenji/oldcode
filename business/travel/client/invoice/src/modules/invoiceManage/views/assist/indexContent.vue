<template>
    <div>
        <Platform name="serviceReminders"></Platform>
        <div class="topMenu">
            <span class="menuItem" @click="goMyInvoice"><i class="icon my"></i>我的发票</span>
            <span class="menuItem" @click="testInvoice"><i class="icon isTrue"></i>发票查验</span>
        </div>
        <div class="bottom-wrap">
          <div class="assit-title">发票抬头</div>
          <swp-invoice-card class="InvoiceCard" ref='invoiceCard' :showCheck='false' title="发票助手" @showOff="showOff"></swp-invoice-card>
          <!-- <InvoiceCard class="InvoiceCard" ref='invoiceCard' :isAssist="true" :showCheck='false' title="发票助手" @showOff="showOff"></InvoiceCard> -->
        </div>
    </div>
</template>
<script>
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';
// const InvoiceCard = ()=>import('modules/invoiceManage/components/invoiceCard.vue');
const Platform = ()=>import('components/announcement/index');
export default {
    mixins: [invoiceHandler.mixin.tChatEventMixin],
    directives: {},
    components: {
        Platform
        // InvoiceCard
    },
    data: function () {
        return Object.assign(this.setData(), {

        })
    },
    activated(){

    },
    beforeRouteLeave () {},
    created: function () {
        // const that = this;
    //   that.invoiceBackFun();
    },
    mounted: function () {},
    methods: {
        setData(){
            return invoiceHandler.stateManager.setData([], this)
        },
        //发票助手列表保活方法注册实现
        // invoiceBackFun(){
        //   let that = this;
        //    //注册并监听t信返回事件
        //   invoiceHandler.appBack(function(){
        //     invoiceHandler.stateManager.closeTopPop(()=>{
        //       invoiceHandler.goBackPage('');
        //     });
        //   },this);
        // },
        goBackFun(){
            invoiceHandler.closePage('');
        },
        goMyInvoice () {
            this.$router.push({path: '/mine'})
        },
        testInvoice () {
            let path = '/check/app';
            if (invoiceHandler.isPC()){ //如果是pc的话直接跳转手动输入的
                path = '/check/pc'
            }
            this.$router.push({
                path,
                query:{
                    fromPage:'invoiceAssist'
                }
            });
        },
        showOff(type) {
            let _this = this;
            _this.$emit('showOff', type);
        }             
    }
}

</script>
<style lang="less" scoped>
@import '~themes/default/styles/common/index.less';
@import '~styles/mixins/mixinsStyle.less';

.topMenu {
    width: 100%;
    background: url(~themes/default/img/bg_invoice_top2.png) no-repeat top;
    background-size: 100% auto;
    background-color: @theme-color;
    box-sizing: border-box;
    padding: .44rem 0 .74rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .menuItem {
        width: 50%;
        font-size: 0.26rem;
        text-align: center;
        cursor: pointer;
        color: #fff;
        .icon {
            display: block;
            width: .8rem;
            height: .8rem;
            margin: 0 auto 0.14rem;
            &.my {
                background: url(~themes/default/img/icon_invoice_myinvoice@2x.svg) no-repeat center;
                background-size: 100% auto;
            }
            &.isTrue {
                background: url(~themes/default/img/icon_invoice_myinvoice@2x.svg) no-repeat center;
                background-size: 100% auto;
            }
        }
    }
}
.bottom-wrap{
    margin-top: -.3rem;
    padding-top: .3rem;
    background-color: @background-color;
    border-radius: .2rem .2rem 0 0 ;
    width: 100%;
    .assit-title{
      padding-left: .3rem;
      padding-bottom: .1rem;
      font-size: .36rem;
      line-height: .50rem;
      font-weight: bold;
    }
    /deep/ .editDetail{
      height: calc(~'100vh - 3.08rem');;
    }
}
</style>
 