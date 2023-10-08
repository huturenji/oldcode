<!-- 
(暂不使用)
  展示格式如下：
  -------------【商品名】---------
  -------------------------------
  --【图片】----------------------
  -------------【价格】---【商品数量】
  -------------------------------
 -->
<template>
  <div class="thumb-container">
    <div class="search_prolist_item" @click='goDetail'>
      <div class="search_prolist_item_inner">
        <div class="search_prolist_cover">
            <thumbnail :src="img" :status='status'/>
        </div>
        <div class="search_prolist_info">
            <div class="search_prolist_title">
              {{title}}
            </div>
            <div class='price-content'>
              <div class="search_prolist_price price-label">
                  <strong v-if='!!price'>
                    <priceLabel :amount='price'/>
                  </strong>
                  <strong v-else class='no-price'>
                    暂无定价
                  </strong>
              </div>
            </div>
            <span v-if="number > 0" class="pd-buycar">
              <span class="buy-car-icon">×{{number}}</span>
            </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import thumbBase from "./thumbBase";
export default {
  extends: thumbBase,
  methods: {
      goDetail(){
        this.$emit('goDetail');
      },
      addCart(){
        this.$emit('addCart');
      }
  }
};
</script>
<style scoped lang="less">
  @import '~themes/default/styles/goodsThumb/thumb02.less';
</style>