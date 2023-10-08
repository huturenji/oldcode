<template>
    <div class="searchIndustry-wrap">
       <div class="search-content">
           <searchBar 
                class='search-bar' 
                v-model='searchWord' 
                statu='search' 
                :autoFocus='true' 
                placeholder='输入行业名称'
                @search='search' 
                @cancel='cancelSearch'/>
       </div>
       <div v-if="showEmpty" class="empty-page">
            <emptyPage tips="暂无搜索结果" />
       </div>  
       <div v-else class="search-result">
           <div v-for="(item, index) in searchList" :key="index" class="content">
               <p class="industry" v-html="setTitleHeightLight(item.industry,searchWord)"></p>
               <ul>
                   <li v-for="(temp, i) in item.site" :key="i" class="resource">
                       <industryItem :item="temp" direction='row' :keyword="searchWord"></industryItem>
                   </li>
                  
               </ul>
           </div>
       </div>
    </div>
</template>
<script>
import emptyPage from 'commonComp/emptyPage';
import industryItem from 'commonComp/industry/industryItem';
import newsHandler from 'common/lib/requestHandler/newsHandler';
import searchBar from 'commonComp/search/searchBar';
import extendUtils from 'common/lib/utils';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
export default {
    name:'searchIndustry',
    mixins: [tChatEventMixin],
    components: {
        searchBar,
        industryItem,
        emptyPage
    },
    data(){
        let that = this;
        return Object.assign(extendUtils.stateManager.setData([
               
        ], that), {
            searchWord:'', //搜索的关键字
            searchList:[], //搜索的行业资源的列表
            firstLoad: true //是否是第一进入页面
        })
    },
    created(){

    },
    computed:{
        showEmpty(){
            return !this.firstLoad && this.searchList.length <= 0;
        }
    },
    methods:{
        
        /**
         * T信回退事件的注册回调 必须是goBackFun
         * 此时回退一步
         */
        goBackFun(){
            this.$router.back();                       
        },

        /**
        * 取消搜索
        */
        cancelSearch(type){
            if(type == 'cancel'){ //此时是点击取消按钮的操作
                this.goBackFun();
            }
        },
        
        /** 
        * 搜索的回调 
        */
        search(keyword){
            this.searchWord = keyword;
            this.getSearchList();
        },

        /** 
        * 获取所有的行业资源列表数据
        */
        getSearchList(){
            let that = this;
            that.$loading.show();
            return new Promise((resolve, reject) => {
                let param = {
                    keyword: that.searchWord
                }
                newsHandler.listAppIndustrySite(param).then(res=>{
                    that.$loading.hide();
                    this.firstLoad = false;
                    if(res.resultCode == 0 && res.result.industrySite.length >= 0){
                        that.searchList = res.result.industrySite;
                        resolve(that.searchList);
                    }else{
                        that.searchList = [];
                        resolve([]);
                    }
                }).catch(e=>{
                    console.log(e);
                    that.$loading.hide();
                    this.firstLoad = false;
                    reject(false);
                })
            })
        },
        /**
         * title高亮处理
         * @param str 字符串
         * @param keyWord 高亮关键字
         */
        setTitleHeightLight(str,keyword){
            let titleText = str
            if(''!=keyword){
                titleText = titleText.replace(new RegExp(keyword, 'g'),'<span class="highlight">'+keyword+'</span>')
            }
            return titleText;
        }
    }

}
</script>
<style lang="less" scoped>
@import "~themes/default/styles/searchIndustry/index.less";
</style>
