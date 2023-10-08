<template>

</template>
  
<script>
import { isNotEmpty } from "@/utils/common.js";
export default {
  data(){
    return {
      styles:{}
    }
  },
  computed: {
        
  },
  methods:{
    // 初始化背景
    initBackgroud(val){
      let background = val?.styles[0]?.background
      if(isNotEmpty(background)){
        if(isNotEmpty(background.img)){
          this.styles = {
            ...this.styles,
            background: `url(${background.img}) center top no-repeat`,//背景图片
            backgroundSize: '100% auto',
          }
        }
        if(isNotEmpty(background.color)){
          this.styles = {
            ...this.styles,
            backgroundColor: background.color,//背景颜色
          }
        }
        this.styles = {
            ...this.styles,
            opacity: background.opacity/100,//背景透明度
        }
      }      
    },
    // 初始化边距
    initSpace(val){
      let margin = val?.styles[0]?.margin;
      let padding = val?.styles[0]?.padding;
      if(isNotEmpty(margin)){
        this.styles = {
          ...this.styles,
          marginTop: (!!(margin[0])?Number(margin[0])*2+'rpx':'0'),
          marginRight: (!!(margin[1])?Number(margin[1])*2+'rpx':'0'),
          marginBottom: (!!(margin[2])?Number(margin[2])*2+'rpx':'0'),
          marginLeft: (!!(margin[3])?Number(margin[3])*2+'rpx':'0'),
        }
      }
      if(isNotEmpty(padding)){
        this.styles = {
          ...this.styles,
          paddingTop: (!!(padding[0])?Number(padding[0])*2+'rpx':'0'),
          paddingRight: (!!(padding[1])?Number(padding[1])*2+'rpx':'0'),
          paddingBottom: (!!(padding[2])?Number(padding[2])*2+'rpx':'0'),
          paddingLeft: (!!(padding[3])?Number(padding[3])*2+'rpx':'0'),
        }
      }
    },
  }
 
};
</script>
  
<style lang="scss" scoped>
</style>
  