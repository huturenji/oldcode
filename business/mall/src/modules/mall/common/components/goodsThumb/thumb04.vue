<!-- 
  订单列表
 -->
<template>
  <div class="thumb-container" v-if='order'>
    <!-- 订单详情部分 -->
    <div class='content'>
      <div class="order-box">
        <!-- 图片、名称和规格dom模块 -->
        <div class="left-content">
          <div ref='imgContainer' :class="{moreImg: productLength > 1}" class='img'>
            <thumbnail ref='thumbnail' class='img-comp' v-for='(product, index) in order.products||[]' :key='index' :src='dealImgSrc(product)'/>
          </div>
          <div v-if='hideMoreImg' class='shadow'></div>
          <div v-if="productLength <= 1" class="des">
            <div class='title no-wrap'>{{order.products[0].name}}</div>
            <div v-if="!!order.products[0].specification" class='format'>{{dealSpecificationKeys(order.products[0].specification)}}</div>
          </div>
        </div>
        
        <!-- 订单状态dom模块 -->
        <div class='right-content'>
          <div v-if="isOrderComplete" class="complete">
            <Icon type='icon_mall_yiwancheng' size=".85"/>
          </div>
          <div v-else class='statu' :class='getOrderStatus(order.orderState).classLabel'>{{orderStateText}}</div>
        </div>
      </div>

      <!-- 价格数量dom模块 -->
      <div class='price-part'>
        <span class='count' v-if='order.products && order.products.length>1'>共{{order.products.length}}件</span>
        <priceLabel :amount='order.paymentAmount'/>
      </div>
    </div>
    <!-- 插槽部分，目前已知的有底部的操作按钮 -->
    <slot/>
  </div>
</template>
<script>
import {getOrderStatusEnum, OrderState, getOrderStatus} from 'common/lib/enum/orderStatusEnum';
import Icon from 'commonComp/base/Icon.vue';
import extendUtils from 'common/lib/utils'
import thumbBase from "./thumbBase";
export default {
  extends: thumbBase,
  props: {
    order: {
      type: Object,
      default: null,
    }
  },
  components:{
    Icon
  },
  data(){
    return {
      hideMoreImg: false,
    }
  },
  mounted(){
    this.hideMoreImgFunc();
  },
  computed:{
    /**
     * 获取订单状态是否完成 
     */
    isOrderComplete(){
      return getOrderStatus(this.order.orderState).state == OrderState.COMPLETE.code;
    },

    /**
     * 订单状态的文字显示
     */
    orderStateText(){
        return getOrderStatus(this.order.orderState, {paymentType: this.order.paymentType}).name;
    },

    /**
     * 获取一个订单中是否有多个商品 目前暂时用img的数组length判断的 
     */
    productLength(){
      return this.order.products.length;
    }
  },
  methods: {
    /****
     * 当商品的赠品和附件没有图片时，此时src特殊处理。
     */
    dealImgSrc(product){
      if(!!!product.imageUrl && product.productType != 0){
        return 'GIFT_NO_IMG'
      }else{
        return product.imageUrl;
      }
    },

    /**
     * 代理函数：获取订单状态对象
     */
    getOrderStatus(code){
      return getOrderStatus(code);
    },
    /**
     * 是否添加阴影遮住图片
     */
    hideMoreImgFunc(){
      let img = this.$refs.thumbnail;
      let container = this.$refs.imgContainer;
      if(extendUtils.domOverflow(container, img)){
        this.hideMoreImg = true;
      }
    },
  }
};
</script>
<style scoped lang="less">
@import "~themes/default/styles/goodsThumb/thumb04.less";
</style>