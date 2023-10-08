<!-- 
  展示格式如下：
  ----------------------
  -------【图片】--------
  ----------------------
  -------【商品名】------
  --【金额】--【购物车】--
 -->
<template>
  <div class="thumb-container">
    <div class="product-item expo" target="_self" :class="{showYGTH:showYGTH}">
      <section class="pic">
        <div :class="{before:before}"></div>
        <div :class="{end:end}"></div>
        <thumbnail :src="img" :status='status'/>
      </section>
      <section class="pd-info" :class="{showYGTH:showYGTH}">
        <h4 class="title-section pd-title">{{title}}</h4>
        <div class="pd-info-left">
          <section class="price-section old-price-section pd-price">
            <span class="curr-price price-label" v-show="!!price">
              <priceLabel  :amount='price' v-if="!!price"/>
            </span>
            <span class="nei-price" v-if="tag">{{tag}}</span>
          </section>
        </div>
        <div class="mh-goods__tags" v-if='goodsTag && Object.keys(goodsTag).length>0'>
          <div class="mh-goods__tags-item" v-if='goodsTag.gift'>
              赠品
          </div>
        </div>
        <div class="goodspr" v-if="goodsOriginal">
            <span  class="goodsOriginal rmb" >¥ {{priceInt(goodsOriginal)}}{{priceFloat(goodsOriginal, toFixed)}}</span>
            <span class="jingD">京东价</span>
        </div>
        <button @click.stop='addCart($event)' class="addCart-icon-section" v-if="!hideAddCart">
          <span class="cart-icon"></span>
        </button>
      </section>
      <section class="discount" v-if="!!discount && ''!=discount">
          <div class="itemTips">{{discount}}</div>
      </section>
    </div>
  </div>
</template>
<script>
import thumbBase from "./thumbBase";
import extendUtils from 'common/lib/utils';
export default {
  extends: thumbBase,
  data(){
      return{
        before:false,
        end:false
      }
  },
  props: {
    goodsTag: {
      type: Object,
      default: ()=>{}
    },
    tag: {
      type: String,
      default: null
    },
    goodsOriginal:{
        type: Number,
        default: null
    },
    goodsLand:{
        type: Object,
        default: ()=>{}
    },
    toFixed:{
        type: String,
        default: '2',
    },
    format:{
        type: Boolean,
        default: true,
    },
    before:{
        type: Boolean,
        default: false,
    },
    end:{
        type: Boolean,
        default: false,
    },
    showYGTH:{
        type: Boolean,
        default: false,
    },
  },
  methods: {
    addCart($event){
        this.$emit('addCart', $event);
    },
    priceFloat(val, toFixed){
        return extendUtils.priceFloat(val, toFixed);
    },
    priceInt(val){
        let result = extendUtils.priceInt(val);
        if(this.format){
            result = this.toThousands(result);
        }
        return result;
    },
    toThousands(num) {
        var num = (num || 0).toString(), result = '';
        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) { result = num + result; }
        return result;
    },

  },
};
</script>
<style scoped lang="less">
  @import '~themes/default/styles/goodsThumb/thumb01.less';
</style>