<template>
  <div class="multiDel">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'multiDel'
}
</script>

<style lang="less" scoped>
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.multiDel{
  width: 100%;
  overflow: hidden;
}

</style>