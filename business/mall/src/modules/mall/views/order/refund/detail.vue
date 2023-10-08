<!-- 查看退票明细的页面 -->
<template>
    <div class="refund-detail">
        <!-- 订单号dom部分 -->
       <div class="block-part order-no">
           <div class="item">
               <span class="title">订单号：</span>
               <span class="content">{{orderInfo.orderNo}}</span>
           </div>
           <div class="item margint16">
               <span class="title">退款进度：</span>
               <span class="content">{{refundText}}</span>
           </div>
       </div>
       <!-- 退款明细dom部分 -->
       <template v-if="refundState == 'REFUNDED'">
            <div class="block-part margint20">
                <div class="part paddingb30" :class="{paddingb0: !!!orderInfo.refundDeduction}">
                    <div class="item bold">
                        <span class="title ">退款明细</span>
                    </div>
                    <div class="item margint24">
                        <span class="title">退款总额<i class="tips">（退款将在1-7个工作日内到账）</i></span>
                        <span class="content">
                            <priceLabel :amount="orderInfo.refundAmount" toFixed='2' :camelCase="false"></priceLabel>
                        </span>
                    </div>
                    <div class="item margint16">
                        <span class="title">{{orderInfo.paymentTypeName}}</span>
                        <span class="content special">
                            <priceLabel :amount="orderInfo.paymentAmount" toFixed='2' :camelCase="false"></priceLabel>
                        </span>
                    </div>
                </div>
                <div class="part paddingt30" v-if="!!orderInfo.refundDeduction">
                    <div class="item bold">
                        <span class="title ">扣减项</span>
                    </div>
                    <div class="item margint24">
                        <span class="title">扣除运费</span>
                        <span class="content special">
                            <i>-</i><priceLabel :amount="orderInfo.refundDeduction" toFixed='2' :camelCase="false"></priceLabel>
                        </span>
                    </div>
                </div>
            </div>
          
       </template>
    </div>
</template>
<script>
import Icon from 'common/components/base/Icon.vue';
import priceLabel from 'commonComp/base/priceLabel.vue';
import extendUtils from 'common/lib/utils';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
export default {
    components: {
        priceLabel,
        Icon
    },
    mixins: [tChatEventMixin], 
    data() {
        return Object.assign(extendUtils.stateManager.setData([
            
        ], this), {
           orderInfo:{}, //订单想详情
           refundState: '',//退票的状态
        })
    },
    filters:{
        dealTime(val){
           return new Date(val*1).format('yyyy年MM月dd日 ');
        }
    },
    computed:{
      refundText(){
          let text = '';
          if(this.refundState == "REFUNDING" || this.refundState == "REFUND_FAIL"){ //退票中
            text = '退款中'
          }else if(this.refundState == "REFUNDED"){ //已退票
            text = '已退款'
          }
          return text;
      }
    },
    created(){
        this.initData();
    },
    methods: {
        /** 
        * 初始化相关的数据
        */
        initData(){
            let item = this.$route.query.item;
            this.orderInfo = !!item ? JSON.parse(item) : {};
            this.refundState = this.orderInfo.refundState;
        },

        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            this.$router.back();
        },
    }
};
</script>
<style scoped lang="less">
@import "~themes/default/styles/order/refund/refundDetail.less";
</style>