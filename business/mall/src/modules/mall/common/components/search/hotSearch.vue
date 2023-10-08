<template>
<div class="hot-search-container">
    <div class="title">
        <span>热门搜索</span>
        <span @click="isShowHot = !isShowHot" class="show-and-hide">{{isShowHot?'显示':'隐藏'}}</span>
    </div>
    <div>
        <div v-if="isShowHot" class="hide-hot">已隐藏搜索发现</div>
        <ul v-else>
            <li @click="clickKeyWords(item, index)" v-for="(item, index) in hotSearchList" :key="index">{{item.name}}</li>
        </ul>
    </div>
</div>
</template>
<script>
export default {
    name:'hotSearchComp',
    props:{
       
    },
    data(){
        return {
            hotSearchList:[ //热门搜索列表
                {name: '援助士大夫武汉'},
                {name: '援助发士大夫武汉'},
                {name: '武汉'},
                {name: '援助武汉'},
                {name: '援助汉'},
                {name: '援助武汉'},
                {name: '援助武天涯汉'},
                {name: '援助武汉'},
                {name: '援助武汉的手机话费'},
            ],
            isShowHot: false, //是否隐藏热门搜索
        }
    },
    computed:{
       
    },
    methods:{
        //点击最近搜索的item
        clickKeyWords(item, index){
            this.$router.push({
                path: '/product/list',
                query: {
                    keyWords: item.name
                }
            })
        }
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.hot-search-container{
   .title{
       display: flex;
       justify-content: space-between;
       font-size: 0.3rem;
       margin-top: 0.3rem;
       .show-and-hide{
           color: @third-text-color;
       }
    }
    ul{
        .clear();
        li{
            float: left;
            margin:0.2rem 0.2rem 0 0;
            padding: 0.1rem 0.2rem;
            background-color: #f0f2f5;
            border-radius: 0.1rem;
            font-size: 0.24rem;
        }
    }
    .hide-hot{
        font-size: 0.24rem;
        color: @third-text-color;
        text-align: center;
        margin-top: 0.5rem;
    }
}
</style>