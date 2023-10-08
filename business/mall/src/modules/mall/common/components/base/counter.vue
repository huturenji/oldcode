<!--选择商品件数的计数器， 传入v-model即可-->
<template>
  <div class="counter-container">
    <div class="select-count">
      <label v-if="showLable">数量</label>
      <div class="num_wrap_v2">
        <span class="minus" :class='Number(val)<=min && "disable"' @click="Number(val)>min && val-- && $emit('input', val)">
          <i class="minus-icon"></i>
        </span>
        <div class="text_wrap">
          <input class="text" type="number" pattern="[0-9]*" v-model="val" @blur="onBlur" @input="onInput"/>
        </div>
        <span class="plus" :class='Number(val)>=max && "disable"' @click="plusFun">
          <i class="minus-icon"></i>
          <i class="plus-icon"></i>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import extendUtils from 'common/lib/utils'
export default {
  name: "counter",
  props: {
      min: {
        type: Number,
        default: 1
      },
      max: {
        type: Number,
        default: function(){return this.BMallConfig.GOODS.MAX_COUNT }
      },
      value: [String, Number],
      showLable:{
        type:Boolean,
        default:true
      }
  },
  data(){
    return {
      val:this.value
    }
  },
  updated(){
    // this.val = this.value;
  },
  computed:{
    // val:{
    //   get(){
    //     return this.value;
    //   },
    //   set(newValue){
    //     this.value = newValue;
    //   }
    // }
  },
  watch:{
    value(val){
      this.val = val;
    }
  },
  methods: {
    onBlur($event){
      //如果为空，认为是 误删除，
      if(!this.val){
        this.val = this.min;
        this.$emit('input', parseInt(this.val))
      }
    },
    onInput($event){
      let newVal = $event.target.value;
      newVal = parseInt(newVal);
      //边界值溢出处理,此时_val不会为空
      if(!!newVal && Number(newVal) > this.max){
        newVal = this.max;
      }
      if(!!newVal && Number(newVal) < this.min){
        newVal = this.min;
      }
      this.val = !!newVal ? newVal : '';
      !!this.val && this.$emit('input', parseInt(newVal)); 
    },
    plusFun(){
      if(Number(this.val)<this.max){
        this.val++ && this.$emit('input', this.val)
      }else{
        this.$emit('disableFun');
      }
    }

  }
};
</script>
<style scoped lang="less">
.counter-container {
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"]{
        -moz-appearance: textfield;
    }
  .select-count {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > label {
      font-size: 0.28rem;
    }

    .num_wrap_v2 {
      display: flex;
      align-items: center;
      position: relative;
      z-index: 0;
      width: 2.2rem;
      float: right;
      vertical-align: middle;
      .minus, .text_wrap, .plus{
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 0.22rem;
        // overflow: hidden;
      }
      .minus-icon{
        display: inline-block;
        height: 0.03rem;
        width: 0.22rem;
        border-radius: 0.02rem;
        background:#999;
      }
      .plus-icon{
        display: inline-block;
        width: 0.03rem;
        height: 0.22rem;
        border-radius: 0.02rem;
        background:#999;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
      }
      .text_wrap {
        position: relative;
        width: 0.8rem;
        height: 0.4rem;
        z-index: 0;
        margin: 0 0.02rem;
        flex: 1;

        .text {
          width: 0.8rem;
          border-radius: 0.06rem;
          height: 0.4rem;
          line-height: 0.4rem;
          width: 100%;
          color: #333;
          font-size: 0.26rem;
          text-align: center;
          border: none;
          background: #F6F9FD;
        }
      }

      span {
        position: relative;
        width: 0.6rem;
        text-align: center;
        color: #999;
        font-size: 0.26rem;
        font-weight: bold;
        &.disable {
         color:#E8E8E8;
         i{
           background: #E8E8E8;
         }
        }
      }
    }
  }
}
</style>