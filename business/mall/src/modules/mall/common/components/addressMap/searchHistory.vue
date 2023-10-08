<template>
<div v-if="historySearchList.length > 0" class="search-history-container">
        <div class="title">
            <span>搜索历史</span>
            <Icon @click.native="deleteSearchHistory" type='icon_delete' class="delete" size='.32'></Icon>
        </div>
        
        <!-- 最近搜索的列表 -->
        <ul id='search_history_list'>
            <li @click="clickKeyWords(item, index)" v-for="(item, index) in getVisibleList()" :key="index" class='normal-btn'>
                <p class="search-item">{{item.name}}</p>
            </li>
        </ul>
        <div class="view-more" v-show="historySearchList.length > limitMax">
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

const MAX_LENGTH = 20;

export default {
    name:'MapSearchHistoryComp',
    props:{
        historyKey: {
            type: String,
            default: '',
        }
    },
    components:{
        Icon,
    },
    data(){
        return {
            historySearchList:[], //搜索历史 即最近的搜索
            limitMax:9,//固定的超出隐藏限制
            showAll: false
        }
    },
    created(){
        this.initData();
    },
    methods:{
        /**
         * 获取可见的搜索历史条目
         */
        getVisibleList(){
            if(this.showAll){
                return this.historySearchList;
            }else{
                return this.historySearchList.slice(0, this.limitMax)
            }
        },

        /**
         * 初始化搜索历史数据，在前端缓存获取
         */
        async initData(){
            try{
                //等授权完成后再去取搜索历史的缓存
                await extendUtils.authInterceptor(); 
                let newSearchListKey = `${baseHandler.primaryKey}_${this.historyKey}`; 
                this.historySearchList = !!extendUtils.getStorage(newSearchListKey) ? JSON.parse(extendUtils.getStorage(newSearchListKey)) : [];
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
            extendUtils.removeStorage(baseHandler.primaryKey + '_' + this.historyKey);
        },
        /**
         * 点击搜索历史的每一项进入商品列表页面
         * @param item 搜索历史每一项item
         */
        clickKeyWords(item){
            this.$emit('choose', item)
        },

        /**
         * 查看更多历史搜索功能
         */
        viewMore(){
            this.showAll = !this.showAll
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