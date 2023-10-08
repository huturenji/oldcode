<template>
  <div class="bottom-btn">
      <div @click="clearAll" class="btn clear">一键清空</div>
      <div @click="deleteItem" class="btn delete">删除</div>
  </div>
</template>

<script>

export default {
    name: 'bottom-btn',
    props: {},
    components:{},
    methods: {
    /** 
    * 一键清空的回调
    */
        clearAll(){
            this.$emit('clearAll');
        },

        /** 
    * 删除的回调
    */
        deleteItem(){
            this.$emit('deleteItem');
        }
    }
}
</script>
<style lang="less" scoped>
@import '~newsStyles/themes/default.less';
@import '~newsStyles/mixins/mixinsStyle.less';
.bottom-btn{
  background-color: #fff;
  height: 1.28rem;
  padding: .2rem .3rem;
  display: flex;
  justify-content: space-between;
  .btpx();
  .btn{
      width: 48%;
      height: .88rem;
      line-height: .88rem;
      font-size: .32rem;
      text-align: center;
      border-radius: .2rem;
      cursor: pointer;
      border: 1px solid @price-color;
      &:active{
          opacity: .6;
      }
      &.clear{
          color: @price-color;
      }
      &.delete{
          background-color: @price-color;
          color: #fff;
      }
  }
}
</style>