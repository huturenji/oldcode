<template>
    <!-- 我的收藏页面 -->
    <div class="favorite-wrap">   
        <div @click="operationFun" class="operation" v-if="!noInfo">
            <span>{{this.showCheck ? '取消' : '编辑'}}</span>
        </div>
        <!-- 下部的列表和批量删除相关的功能 -->
        <div class="list-wrap">
            <div class="news-list" :class="{showCheck:showCheck}">
                <listTemplate 
                    ref='listTemplate' 
                    class="contentWrap" 
                    :listItemConfig="listItemConfig" 
                    :mescrollUpConfig="mescrollUpConfig"
                    :pageConfig='{size: GlobalConfig.PAGE_SIZE.DEFAULT}' 
                    :getDataFunc='getRecord'
                    :showCheck="showCheck"
                    v-model="choosedNewsList"
                    @onEmpty='empty=true'
                    @onLoadData='empty=false'
                ></listTemplate>
            </div>
            
            <!-- 底部的删除和清空按钮 -->
            <template v-if="showCheck">
                <bottomBtn 
                    @clearAll="clearAll"
                    @deleteItem="deleteItem"
                />
            </template>
            <div class="emptyButWrap" v-if="empty">
                <div class="emptyBut icon-btn" @click="gotoIndex">去要闻看看</div>
            </div>
        </div>
    </div>
</template>
<script>
import extendUtils from 'common/lib/utils';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import personalMixin from 'common/lib/mixin/personalMixin.js';
// import titleBarMixin from 'common/lib/mixin/titleBarMixin';
// import newsHandler from 'common/lib/requestHandler/newsHandler';
// import Icon from 'commonComp/icon';
import listTemplate from 'commonComp/listTemplate';
import { TransferDom } from 'vux';
import { bottomBtn } from 'commonComp/multiDel'; //批量选择的组件底部的清空和删除按钮
export default {
    name:'myFavorite',
    mixins: [tChatEventMixin,personalMixin],
    directives: {
        TransferDom
    },
    components: {
        // Icon,
        listTemplate,
        bottomBtn
    },
    data(){
        let that = this;
        return Object.assign(extendUtils.stateManager.setData([
               
        ], that), {
            listType: 'HISTORY',//阅读历史
            clearAllText: '确定删除所有阅读记录吗？',//确认删除提示语
            mescrollUpConfig:{ //列表的相关配置
                empty: {
                    warpId: null,
                    tip: '暂无阅读历史'
                }
            },
            empty:false//
            
        })
    },
    created(){
       
    },
    mounted(){
        
    },

    watch:{

    },
    methods:{
        /**
         * 跳转首页
         */
        gotoIndex(){
            extendUtils.openPage('')
        }
    }
}
</script>
<style lang="less" scoped>
@import "~themes/default/styles/favorite/index.less";
</style>