<template>
  <div class="check">
    <Icon :type="!isChecked?'btn_common_checkbox_nor':'btn_common_checkbox_sel'" size=".42" />
  </div>
</template>

<script>
import Icon from 'commonComp/icon';
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
@import '~newsStyles/themes/default.less';
@import '~newsStyles/mixins/mixinsStyle.less';
.check{
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .btn_common_checkbox_sel{
    fill: @theme-color;
  }
  .btn_common_checkbox_nor{
    fill: @third-text-color;
  }
}
</style>