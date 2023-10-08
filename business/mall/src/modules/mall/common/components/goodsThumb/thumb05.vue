<!-- 
  展示格式如下：
  -------------【商品名】---------
  ------------【数量】------------
  --【图片】----------------------
  -------------【价格】---【售后】
  -------------------------------
 -->
<template>
  <div class="thumb-container">
    <div class="search_prolist_item" @click='goDetail'>
      <div class="search_prolist_item_inner">
        <div class="search_prolist_cover">
            <thumbnail :src="dealImgSrc(img)" :status='status'/>
        </div>
        <div class="search_prolist_info">
            <div class="title no-wrap">
              {{title}}
            </div>
            <div class='sub-info no-wrap'>
              数量: {{count}}
              {{goodsDesc}}
            </div>
            <template v-if="productType==0">
              <div class='price num-font'>
                <priceLabel :amount='price'/>
              </div>
            </template>
            <template v-else>
              <div class='price num-font'>
                  <symbolGift :name="dealName()"/>
              </div>
            </template>
            <div class="btn">
              <slot />
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import thumbBase from "./thumbBase";
import symbolGift from 'common/components/base/symbolGift.vue';
export default {
  extends: thumbBase,
  components:{symbolGift},
  props: {
    goodsDesc: {
      type: String,
      default: '',
    },
    count: {
      type: Number,
      default: 1
    },
    productType: { //商品类型，0=主商品，1=附件，2=赠品
      type: Number,
      default: 0
    }
  },
  data(){
    return {
    }
  },
  created(){

  },
  methods: {
      goDetail(){
        this.$emit('goDetail');
      },

        /****
       * 当商品的赠品和附件没有图片时，此时src特殊处理。
       */
      dealImgSrc(img){
        if(!!!img){
          return 'GIFT_NO_IMG'
        }else{
          return img;
        }
      },

      dealName(){
        if(this.productType == 1){
          return  '附件';
        }else if(this.productType == 2){
          return  '赠品';
        }
      }
  }
};
</script>
<style scoped lang="less">
  @import '~themes/default/styles/goodsThumb/thumb05.less';
</style>