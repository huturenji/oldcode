<template>
<!-- 组装最近搜索和热门搜索的组件 -->
<div class="history-hot-search-container">
    <div class="hostory-part">
      <searchHistory />   
    </div>

    <div class="hot-part">
      <hotSearch />   
    </div>
</div>
</template>
<script>
import hotSearch from './hotSearch.vue';
import searchHistory from './searchHistory.vue';
export default {
    name:'History-Hot-SearchComp',
    components:{
        hotSearch,
        searchHistory
    },
    props:{
       
    },
    data(){
        return {
            
        }
    },
    computed:{
       
    },
    methods:{
      
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.history-hot-search-container{
   
}
</style>