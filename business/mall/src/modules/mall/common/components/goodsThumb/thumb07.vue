<!--
  展示格式如下：
  -------------【商品名】---------
  -------------------------------
  --【图片】----------------------
  -------------【价格】---【数量加减部分（base里面的counter组件）】
  -------------------------------
 -->
<template>
  <div class="thumb-container">
    <div class="search_prolist_item">
      <div class="search_prolist_item_inner">
        <div class="search_prolist_cover">
            <thumbnail :src="img" :status='status'/>
        </div>
        <div class="search_prolist_info">
            <div class="search_prolist_title">
              {{title}}
            </div>
            <slot name='sub-text'></slot>
            <div class='price-content'>
              <div class="search_prolist_price price-label">
                  <strong v-if='!!price'>
                    <priceLabel :amount='price' :camelCase="false"/>
                    <priceLabel v-if="!!oldPrice" class="oldPrice" :amount='oldPrice' :camelCase="false"/>
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
  props: {
      noPriceTips: {//无价格时的提示信息
          type: String,
          default: '暂无定价'
      },
      oldPrice:{

      }

  },
  extends: thumbBase,
  methods: {}
};
</script>
<style scoped lang="less">
  @import '~themes/default/styles/goodsThumb/thumb07.less';
</style>
