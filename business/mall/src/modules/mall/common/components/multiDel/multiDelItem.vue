<template>
  <div class="multiDelItem">
    <div  v-show="showCheck" class="multiDelItem-btn">
      <slot name="left-check"></slot>
    </div>
    <div class="multiDelItem-content">
      <slot></slot>
    </div>
    <div  v-show="showDel" class="multiDelbtn">
      <slot name="right-del"></slot>
    </div>    
  </div>
</template>

<script>
export default {
  name: 'multiDelItem',
  props: {
   showCheck:{ //是否显示批量选择的check
     type: Boolean,
     default: true,
   },
   showDel:{ //是否显示删除按钮
     type: Boolean,
     default: false,
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
    width: .66rem;
    background: #fff;
    display: flex;
    align-items: center;
  }
  .multiDelbtn{
    width: .66rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content:flex-end;

  }
  .multiDelItem-content{
    flex: 1;
  }
}
</style>
