<template>
  <div class="index-skeleton">
      <!-- 搜索部分 -->
       <div id="skeletonBg">
           <div class='bgbar bgFlex'>
               <div class='leftIcon'></div>
               <div class='bgitem'><div class='inIcon'></div>搜索</div>
               <div class='rightIcon'></div>
            </div>
        </div>
      <!-- tab部分 -->
      <ul class="tabs">
        <li v-for="(item, index) in tabList" :class="{active:index==0}" :key="index">{{item}}</li>
      </ul>

      <!-- 下面的新闻列表 -->
      <ul class="list" v-for="(item, index) in 6" :key="index">
        <li>
          <div class="type1"></div>
          <div class="type1"></div>
          <div class="type2"></div>
        </li>
      </ul>
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
            tabList:['要闻','视频','财经','娱乐']
        }
    },
    mounted(){
    },
    methods:{
    /**
    * 跳转到“我的”页面
    */
        goMyCenter(){
            extendUtils.openPage('personal')
        }   
    }
}
</script>
<style lang="less" scoped>
@import './style/index.less';
</style>