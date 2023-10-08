<template>
    <div class="preheat_price">
        <div class="now_supplier_price">
            <div class="now_price"><priceLabel :format="false" :amount='goodsDetailsObj.price' :floatMin="true"/></div> 
            <div @click="gotoJD" class="supplier_price">
                <span class="first">京东价</span>
                <span class="sec"><priceLabel :format="false" :amount='goodsDetailsObj.supplierPrice'/></span>
                <Icon type='icon_common_rightarrowthemes' size='.18'></Icon>
                <img class="angle" src="~themes/default/img/index/bg_mall_jdprice.png" alt="">
            </div>
        </div> 
        <div class="data_price">
            <span>{{goodsDetailsObj.marketingStartTime | formatTime}}</span>
            <span>优惠价：<priceLabel :format="false" :amount='goodsDetailsObj.promotionalPrice'/></span>
        </div> 
    </div> 
</template>
<script>
const Icon = ()=>import('common/components/base/Icon.vue');
const priceLabel = ()=>import('common/components/base/priceLabel.vue');
export default {
    components:{
        Icon,
        priceLabel
    },
    props:{
      //传递的商品详情
      goodsDetailsObj:{
          type: Object,
          required: true,
      },
    },
    filters:{
      formatTime(val){
        return new Date(val).format('MM月dd日 HH:mm:ss')
      }
    },
    methods:{
      gotoJD(){
        this.$emit('showJdPop')
      },
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
// 活动预热阶段商品价格模块

.preheat_price{
  padding: .3rem;
  padding-bottom: 0;
  background-color: #fff;
  .now_supplier_price{
    display: flex;
    align-items: center;
    margin-bottom: .2rem;
    .now_price{
      color: @danger-color-light;
      font-size: .56rem;
    }
    .supplier_price{
      height: .56rem;
      position: relative;
      margin-left: .2rem;
      line-height: .56rem;
      background-size: auto 100%;
      border-radius: .06rem 0 0 .06rem;
      background-color: rgba(232,43,41,.05);
      color: @danger-color-light;
      font-size: 0;
      margin-top: .1rem;
      cursor: pointer;
      .angle{
        position: absolute;
        height: .56rem;
        width: auto;
        top: 0;
        right: -.44rem;
        z-index: 10;
      }
      &:active{
          opacity: .8;
      }
      span{
        font-size: .26rem;
        display: inline-block;
        padding-left: .1rem;        
      }
      .sec{
        margin-right: .03rem;
      }
    }
    
  }

  .data_price{
    font-size: .3rem;
    color: @warning-color-light;
  }
}
</style>