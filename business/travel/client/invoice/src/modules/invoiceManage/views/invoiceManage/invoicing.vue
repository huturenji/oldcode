<template>
  <div class="invocing">
        <div class="wrap">
            <div class="list"  @click='checkTrip("flight")'>
                <div class="titleContent cursorp">
                    <div class="title">
                        <icon type="icon_plane_plane" size=".32"/><span>机票</span>
                    </div>
                    <span class="subTitle">含行程单、保险发票、退票手续费收据、快递费发票（电子） </span>
                </div>
                <div class="right">
                    <icon type="icon_common_rightarrow" size=".24"/>
                </div>
            </div>
            <div class="list"  @click='checkTrip("hotel")'>
                <div class="titleContent cursorp">
                    <div class="title">
                        <icon type="icon_hotel_hotel" size=".32"/><span>酒店</span>
                    </div>
                    <span class="subTitle"> 增值税普通发票（电子）</span>
                </div>
                <div class="right">
                    <icon type="icon_common_rightarrow" size=".24"/>
                </div>
            </div>
        </div>
        <div class="bottom-wrap">
            <div class="list"  @click='gotoHistory'>
                <div class="content cursorp">
                    <div class="title">开票历史</div>
                    <icon type="icon_common_rightarrow" size=".24"/>
                </div>
            </div>
            <div class="list" @click='goInvoiceRules'>
                <div class="content cursorp">
                    <div class="title">开票规则</div>
                    <icon type="icon_common_rightarrow" size=".24"/>
                </div>
            </div>
        </div>
  </div>
</template>

<script>
import icon from 'components/icon/index';
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';
export default {
    mixins: [invoiceHandler.mixin.tChatEventMixin],
    name: 'invoicing',
    data () {
        return {

        }
    },
    components:{
        icon
    },
    created () {
        //注册并监听t信返回事件
        // invoiceHandler.appBack(function(){
        //     let that = this;
        //     invoiceHandler.stateManager.closeTopPop(() => {
        //         invoiceHandler.goBackPage('')
        //     });
        // },this)
    },
    methods: {
        //注册并监听t信返回事件
        goBackFun(){
            // let that = this
            invoiceHandler.closePage('')
        },
        // 跳转到补开报销凭证
        checkTrip (type) {
            this.$router.push({path: '/choose', query: {tripType: type}})
        },

        //跳转到开票规则
        goInvoiceRules () {
            this.$router.push({path: '/rule'})
        },

        //跳转到开票历史
        gotoHistory(){
            this.$router.push({path: '/his'})
        }
    }
}
</script>

<style lang='less' scoped>
@import '~themes/default/styles/invoicing.less';
</style>
