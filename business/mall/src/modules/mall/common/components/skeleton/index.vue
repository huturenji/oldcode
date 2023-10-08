<template>
    <div class="index-skeleton">
        <div class='bgFlex'><p>无需垫付</p><p>发票保障</p><p>合规透明</p></div><div class='search_box'><div class='search_bar'>输入商品名称搜索</div></div>
    </div>
</template>

<script>
import extendUtils from 'common/lib/utils';
export default {
  name: 'index-skeleton',
  components:{
  },
  props:{
  },
  computed:{
  },
  data(){
    return {
        
    }
  },
  mounted(){
  },
  methods:{
     
  }
}
</script>
<style lang="less" scoped>
.index-skeleton{padding:0 .3rem; background: #fff; width: 100vw; height: 100vh;}
.index-skeleton .bgFlex{display: flex;-webkit-box-align: center;align-items: center;height:.6rem;justify-content: space-around;font-size:.24rem;color:#999;}
.index-skeleton .search_box{padding:.24rem 0;}
.index-skeleton .search_bar{padding-left:.6rem;height: .68rem;border-radius: .2rem;background-color: #f5f5f5; color: #fff;line-height: .68rem;font-size:.24rem;}
</style>