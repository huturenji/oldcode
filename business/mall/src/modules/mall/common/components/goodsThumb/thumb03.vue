<!-- 
  展示格式如下：
  -------------【商品名】---------
  -------------------------------
  --【图片】----------------------
  -------------【价格】---【购物车】
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
            <slot name='sub-text'></slot>
            <slot name='cutDown'/>
            <div class='price-content'>
              <div class="search_prolist_price price-label">
                  <strong v-if='!!price'>
                    <priceLabel :amount='price'/>
                    <slot name='priceLabel'/>
                  </strong>
                  <strong v-else class='no-price'>
                    暂无定价
                  </strong>
              </div>
              <div class='action'>
                <slot name='action'/>
              </div>
            </div>
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
  }
};
</script>
<style scoped lang="less">
  @import '~themes/default/styles/goodsThumb/thumb03.less';
</style>