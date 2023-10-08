<template>
    <div class='search-page'>
        <searchBar ref='searchBar' class='search-bar' v-model='searchWord' statu='search' :autoFocus='true' :defaultKeyWord='currHotWord' :placeholder='currHotWord' @search='search' @focus='focusSearch' @cancel='cancelSearch'/>
        <div class='shorcut' v-show='!showSearchList'>
            <history class='shortcut-list' :keyword='searchWord' @click='search'/>
            <hotSearch class='shortcut-list hotSearch' v-if='hotSearchList && hotSearchList.length>0' :dataList='hotSearchList' @click='search'/>
        </div>
        <listTemplate ref='listTemplate' v-show='showSearchList' class="search-list" :mescrollUpConfig="mescrollUpConfig"
        :pageConfig='{size: GlobalConfig.PAGE_SIZE.DEFAULT}' :getDataFunc='getDataList' :keyword="searchWord"></listTemplate>
    </div>
</template>
<script>
import extendUtils from 'common/lib/utils';
import newsHandler from 'common/lib/requestHandler/newsHandler';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import listTemplate from 'commonComp/listTemplate';

const history = () => import('commonComp/search/history');
const hotSearch = () => import('commonComp/search/hotSearch');
const searchBar = () => import('commonComp/search/searchBar');
export default {
    mixins: [tChatEventMixin],
    components: {
        searchBar,history,hotSearch,listTemplate
    },
    data: function () {
        return Object.assign(extendUtils.stateManager.setData([
            'showSearchList'
        ], this), {
            searchWord: null,//搜索关键字
            hotSearchList: null,//热门搜索数据
            currHotWord: null,//当前显示的热门关键字
            mescrollUpConfig: {
                auto: false,
                loadFull: {use : true},
                empty: {
                    tip: '抱歉，没有搜到相关内容'
                }
            },
            cursor:null // // 资讯列表接口返回的页面索引ID
        })
    },
    created: function () { 
        this.getHotSeach();
    },
    mounted: function () { },
    watch: {},
    methods: {
        /**
             * 搜索
             */ 
        search(keyword){
            this.searchWord = keyword;
            this.showSearchList = true;
            this.$nextTick(()=>{
                this.$refs.listTemplate.init(true);
            })
        },
        getDataList(page){
            return new Promise((resolve, reject)=>{
                //判断当前页  若 num == 1 两种情况 分别是 首页刷新 下拉刷新 这时要求cursor为null 从第二页开始要求根据cursor查询资讯列表
                if(page.num == 1){
                    this.cursor = null;
                }
                let param = {
                    companyId: newsHandler.getCompanyId,
                    userId: newsHandler.getUserId,
                    channelId: newsHandler.getChannelId,
                    keyword: this.searchWord,
                    pageIndex: page.num,
                    pageSize: page.size,
                    //查询时 若num == 1 cursor = null  若num !=1 cursor == this.cursor 
                    cursor:this.cursor
                }
                newsHandler.getNewsList(param).then((res) => {
                    //获取接口返回的cursor
                    this.cursor = res.result.cursor;
                    resolve(res.result)
                }).catch((err) => {
                    console.log(err);
                    reject();
                });
            })
        },
        getHotSeach(){
            //只显示6条热门
            newsHandler.hotSearchKeyword({count: 6}).then(res=>{
                this.hotSearchList = res.result && res.result.keywords || [];
                this.setRandomHotWord();
            })
        },
        setRandomHotWord(){
            try{
                if(!this.hotSearchList || this.hotSearchList.length==0){
                    return;
                }
                const SESSION_KEY = 'hotWord';
                let currHotWord = this.hotSearchList[extendUtils.randomNum(0, this.hotSearchList.length-1)];
                let preHotWord = extendUtils.getSession(SESSION_KEY);
                if(!!preHotWord && preHotWord == currHotWord){
                    this.setRandomHotWord()
                }else{
                    this.currHotWord = currHotWord;
                    extendUtils.setSession(SESSION_KEY, currHotWord);
                }
            }catch(e){
                console.error(e);
            }
        },
        /**
            * 取消搜索
            */
        cancelSearch(type){
            this.setRandomHotWord();
            //如果点的是取消按钮
            if(type=='cancel'){
                if(this.showSearchList){
                    this.showSearchList = false;
                }else{
                    extendUtils.closePage('');
                }
            }else if(type=='clear'){//如果是点的“清空”按钮，则需要再次获取焦点
                this.$refs.searchBar.focus();
            }
        },
        /**
            * 搜索栏获取焦点
            */
        focusSearch(){
            this.showSearchList = false;
        },
        goBackFun(){
            extendUtils.closePage('');
        }
        // refresh(){
        //     this.getHotSeach();
        // }
    }
}
</script>
<style lang="less" scoped>
    @import "~themes/default/styles/search/index.less";
</style>