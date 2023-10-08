<template>
<div v-if="historySearchList.length > 0" class="search-history-container">
        <div class="title">
            <span>搜索历史</span>
            <Icon @click.native="deleteSearchHistory" type='icon_delete' class="delete" size='.32'></Icon>
        </div>
        
        <!-- 最近搜索的列表 -->
        <ul id='search_history_list'>
            <li @click="clickKeyWords(item, index)" v-for="(item, index) in getVisibleList()" :key="index">
                <p class="search-item">{{item.name}}</p>
            </li>
        </ul>
        <div class="view-more" v-show="historySearchList.length >= limitNumber && historySearchList.length!=limitMax">
            <div @click="viewMore" class="text-box" :class="{active: (getVisibleList().length >= historySearchList.length)}">
                <span class="more-text">更多历史搜索</span>
                <Icon type='icon_common_downarrow' size='.22'></Icon>
            </div>
        </div>
</div>

</template>
<script>
import Icon from 'common/components/base/Icon';
import {SnModal} from 'sinosun-ui';
import extendUtils from 'common/lib/utils';
import BaseHandler from 'common/lib/requestHandler/base.js';
let baseHandler = new BaseHandler();
export default {
    name:'SearchHistoryComp',
    props:{

    },
    components:{
        Icon,
    },
    data(){
        return {
            historySearchList:[], //搜索历史 即最近的搜索
            limitMax:9,//固定的超出隐藏限制
            limitNumber: 9, //超过9个筛选项后显示更多历史搜索项
            maxWidth:document.body.clientWidth - 60,  //单条记录最大宽度 = 屏幕宽度 - 两边padding
            max: 20,//最多显示搜索历史的条目，目前与UE沟通是20
        }
    },
    computed:{

    },
    created(){

    },
    activated(){
        this.initData();
    },
    methods:{
        /**
         * 获取可见的搜索历史条目
         */
        getVisibleList(){
           let list =  this.historySearchList.filter((item, index)=>{
               return index < this.limitNumber;
           })
           return list;
        },

        /**
         * 初始化搜索历史数据，在前端缓存获取
         */
        async initData(){
            try{
                //等授权完成后再去取搜索历史的缓存
                await extendUtils.authInterceptor(); 
                this.limitNumber = 9; //更新下拉展开的显示数量
                let newSearchListKey = `${baseHandler.primaryKey}_searchHistoryList`; 
                let list = !!extendUtils.getStorage(newSearchListKey) ? JSON.parse(extendUtils.getStorage(newSearchListKey)) : [];
                this.historySearchList = list.slice(0, this.max); //只显示最新的20条搜索的历史记录

                //更新搜索历史的缓存(因为数量更新了)
                extendUtils.setStorage(newSearchListKey, JSON.stringify(this.historySearchList));
                this.$emit('getSearchList', this.historySearchList);
            }catch(e){
                console.log('初始化搜索历史记录报错', e);
            }
        },

        /**
         * 删除最近的搜索历史缓存
         */
        deleteSearchHistory(){
            let that = this;
            SnModal({
                message: '确定要清空吗？',
                showCancelButton: true,
            }).then(res => {
                that.historySearchList = [];
                //更新缓存
                that.delHistory();
            }).catch(rej => {
                console.log('rej === ', rej);
            });
        },
        
        /**
         * 清空历史搜索记录并告知父组件
         */
        delHistory(){
            extendUtils.removeStorage(baseHandler.primaryKey + '_searchHistoryList');
            this.$emit('delSearchHistory');
        },
        /**
         * 点击搜索历史的每一项进入商品列表页面
         * @param item 搜索历史每一项item
         */
        clickKeyWords(item){
            extendUtils.setSession('fromSearchHistary','forward');  //这个参数用于商品列表页某些时候由于保活不请求数据的标识
            
            //将该搜索历史选项移到第一个排序
            this.updateSearchHistoryList(item);
            this.$router.replace({
                path: '/product/list',
                query: {
                    keyWords: item.name,
                }
            })
        },

        /*****
         * 更新缓存
         */
        updateSearchHistoryList(item){
            let searchHistoryList =  !!JSON.parse(extendUtils.getStorage(baseHandler.primaryKey +'_searchHistoryList')) ? JSON.parse(extendUtils.getStorage(baseHandler.primaryKey +'_searchHistoryList')) : [];
            searchHistoryList.unshift({name: item.name});
            //去重之后存储缓存
            extendUtils.setStorage(baseHandler.primaryKey +'_searchHistoryList', JSON.stringify(extendUtils.repeatArray(searchHistoryList, 'name')));
        },

        /**
         * 查看更多历史搜索功能
         */
        viewMore(){
            this.limitNumber = this.limitNumber==this.historySearchList.length ? 9 : this.historySearchList.length;
        }
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.search-history-container{
    .title{
       display: flex;
       justify-content: space-between;
       font-size: 0.28rem;
       margin-top: 0.1rem;
       color: @text-color;
       .delete{
          color: @placeholder-color;   
       }
    }
    ul{
        .clear();
        display: flex;
        flex-wrap: wrap;
        li{
            margin:0.2rem 0.2rem 0 0;
            padding: 0.05rem 0.3rem;
            background-color: #F5F5F5;
            border-radius: 0.3rem;
            font-size: 0.26rem;
            min-height: 0.52rem;
            display: flex;
            justify-content: center;
            align-items: center;
            max-width: 100%;
            .search-item{
                max-width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            &:active{
                color: #fff;
                background-color: @theme-color;
            }
        }
    }
    .view-more{
        width: 100%;
        display: flex;
        justify-content: center;
        font-size: 0.24rem;
        margin-top: .36rem;
        .text-box{
            cursor: pointer;
            display: flex;
            align-items: center;
            .icon_common_downarrow{
                transition: all 0.3s;  
            }
            .more-text{
                padding-right: 0.05rem;
            }
            &.active{
                .icon_common_downarrow{
                    transform: rotate(180deg);
                }
            }
        }
       
    }
}
</style>