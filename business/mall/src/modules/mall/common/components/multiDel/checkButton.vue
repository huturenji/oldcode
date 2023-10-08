<template>
  <div class="check">
    <Icon :type="!isChecked?'icon_mall_checkbox_nor':'icon_mall_checkbox_sel'" size=".42" />
    <slot></slot>
  </div>
</template>

<script>
import Icon from '../base/Icon';
export default {
  name: 'checkButton',
  props: {
    isChecked:{
      type: Boolean,
      default: false
    }
  },
  components:{
    Icon
  },
  methods: {
   
  }
}
</script>
<style lang="less" scoped>
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.check{
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .btn_common_checkbox_sel{
    color: @theme-color;
  }
  .btn_common_checkbox_nor{
    color: @third-text-color;
  }
  .icon_mall_checkbox_sel{
    color: @theme-color;
    }
}
</style>