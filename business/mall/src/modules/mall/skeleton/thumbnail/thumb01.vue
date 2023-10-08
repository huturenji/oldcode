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
    <div class="product-item">
      <section class="pic">
        <img class="photo" :src="BMallConfig.GOODS.DEFAULT_THUMBNAIL">
      </section>
      <section class="content">
        <div class='line'></div>
        <div class='line'></div>
        <div class='btn'></div>
      </section>
    </div>
  </div>
</template>
<script>
export default {
};
</script>
<style scoped lang="less">
  @import '~themes/default/styles/skeleton/thumbnail/thumb01.less';
</style>