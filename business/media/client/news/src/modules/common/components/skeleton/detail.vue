<template>
  <div class="detail-skeleton">
      <div class="title">
        <div class="list"></div>
        <div class="list list2"></div>
      </div>
      <div class="detail">
        <div class="list" v-for="(item, index) in 15" :key="index"></div>
      </div>
  </div>
</template>

<script>
// import extendUtils from 'common/lib/utils';
export default {
    name: 'detail-skeleton',
    props:{
    
    },
    data(){
        return {

        }
    },
    methods:{
    
    }
}
</script>

<style lang="less">
@import './style/detail.less';
</style>