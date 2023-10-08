<template>
<div class="search-page">
    <searchBar @search='emit("search")' @cancel='emit("cancel")' @onInput='emit("onInput")' @focusInputFun='emit("focusInputFun")'/>
    <history/>
</div>

</template>
<script>
import searchBar from './searchBar';
import history from './history';

export default {
    name:'search-page',
    components: {searchBar, history},
    props:{
        historyKey: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
        }
    },
    created(){
    },
    methods:{
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/index.less';
</style>