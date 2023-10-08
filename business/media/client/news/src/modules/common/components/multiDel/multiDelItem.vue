<template>
  <div class="multiDelItem">
    <div  v-show="showCheck" class="multiDelItem-btn">
      <slot name="left-check"></slot>
    </div>
    <div class="multiDelItem-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
    name: 'multiDelItem',
    props: {
        showCheck:{ //是否显示批量选择的check
            type: Boolean
        }
    },
    data () {
        return {
      
        }
    },
    mounted () {
   
    },
    methods: {
   
    },
    watch: {
   
    }
}
</script>
<style lang="less" scoped>
.multiDelItem{
  width: 100%;
  display: flex;
  .multiDelItem-btn{
    width: .86rem;
    background: #fff;
    display: flex;
    padding-left: .32rem;
    align-items: center;
  }
  .multiDelItem-content{
    flex: 1;
  }
}
</style>
