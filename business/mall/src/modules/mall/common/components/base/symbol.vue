

<template>
 <!---------------------------默认 和 公司相关的symbol组件 -------------------------->
<div class="symbol-container">
  {{symbol}}
</div>
</template>
<script>
  export default {
    name:'symbol-comp',
    props: {
      symbol:{ //传递过来的名称
        type: String,
        default:'默认'
      },
    },
    components: {
    },
    computed:{
    },
    data () {
        return {

        }
    },
    
    created: function () {},
    mounted: function () {
     

    },
    
    methods: {
      
    }
  }

</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.symbol-container{
  display: inline-block;
  padding: 0 0.1rem;
  max-width: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 0.28rem;
  text-align: center;
  line-height: 0.26rem;
  box-sizing: border-box;
  border-radius: 0.14rem 0 0.14rem 0;
  border: 1px solid @theme-color;
  color: @theme-color;
  font-size: 0.18rem;
  vertical-align: middle;
}

</style>
