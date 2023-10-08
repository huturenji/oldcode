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
@import '~newsStyles/themes/default.less';
@import '~newsStyles/mixins/mixinsStyle.less';
.multiDel{
  width: 100%;
  overflow: hidden;
}

</style>