<template>
<div class="search-container">
     <!-- 顶部的搜索栏 -->
    <div class="search-box-top">
        <div class="search-after">
            <searchComp ref='searchComp' @onInput="searchDropdownListFun" :cancelToback='cancelToback' @search="searchFun" :isDisabled="false"/> 
        </div>
    </div>
    
    <!-- 搜索联想的列表 -->
    <div v-show="searchList.length>0" class="searchList_wrap">
        <ul>
            <li @click="searchFun(item.key)" v-for="(item, index) in searchList" :key="index">
                <div class="left_key">{{item.key}}</div>
                <!-- 屏蔽掉联想搜索右侧的搜索内容，因为京东搜索会出现'京东自营'/ '三折'等我们没有的字样 -->
                <!-- <div v-if="item.tag && item.tag.length>0" class="right_tag">
                    <div v-if="!!temp.tsh" @click.stop="searchFun(temp.tse || temp.tsh)" v-for="(temp, i) in item.tag" :key="i" class="tag_item">{{temp.tsh}}</div>
                </div> -->
            </li>
        </ul>
    </div>

    <!-- 搜索历史dom模块 -->
    <div class="search-content-box"  :class="!!historySearchList && historySearchList.length > 0 ? '' : 'empty-search-page'">
        <div v-show="!!historySearchList && historySearchList.length>0">
            <searchPart @delSearchHistory='delSearchHistory' @getSearchList="getSearchList"/>
        </div>
        <div v-show="!!historySearchList && historySearchList.length<=0">
            <emptyPage tips='暂无历史搜索记录'></emptyPage>
        </div>
    </div>
</div>
</template>
<script>
import emptyPage from 'commonComp/base/emptyPage.vue';
import searchPart from 'commonComp/search/searchHistory.vue';
import searchComp from 'commonComp/search/simpleSearch.vue';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import extendUtils from 'common/lib/utils';
import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
export default {
    mixins: [tChatEventMixin],
    components:{
       searchComp,
       searchPart,
       emptyPage
    },
    data(){
        return {
           cancelToback: true,
           historySearchList: [],
           searchList: [],//搜索联想的列表
        }
    },
    // mounted(){
    //     this.initData();
    // },
    activated(){
        this.initData();
    },
    methods: {
        getSearchList(historySearchList){
            this.historySearchList = historySearchList;
        },
        /**
         * 初始化搜索历史数据，在前端缓存获取
         */
        initData(){
            let that = this;
            that.searchList = [];
            setTimeout(() => { //等动画结束了再去聚焦，否则会出现页面抖动的问题
                that.autoFocus();   
            }, 250)
            
        },  

        /**
         * 输入框自动获取焦点
         */
        autoFocus(){            
            try{
                let dom = this.$refs.searchComp.$el.getElementsByTagName('input')[0];
                dom.focus();    
            }catch(e){
                console.error(e);
            }
        },
        /**
         * 搜索结果的回调 跳转到订单列表
         * @param value 搜索的关键字
         */
        searchFun(value){
            const that = this;
            //目前最近搜索暂时放到这个地方（前端缓存）后续调整 TODO
            let searchHistoryList =  !!extendUtils.getStorage(goodsHandler.primaryKey +'_searchHistoryList') ? JSON.parse(extendUtils.getStorage(goodsHandler.primaryKey +'_searchHistoryList')) : [];
            !!value && searchHistoryList.unshift({name: value});
            //去重之后存储缓存
            extendUtils.setStorage(goodsHandler.primaryKey +'_searchHistoryList', JSON.stringify(extendUtils.repeatArray(searchHistoryList, 'name')));

            extendUtils.throttle(function() {
                this.$router.replace({
                    path: '/product/list',
                    query:{
                        keyWords:value,
                        isSearchPage:true,
                        t: new Date().getTime()
                    }
                }).catch(()=>{});//把error 抛出来
            }, that, 500); 
            
        },



        /**
         * 跳转到常购清单页面,由于目前常购清单不做，该方法暂时预留
         */
        gotoPurchasedList(){
            this.$router.push({
                path: "/purchase/list"
            })
        },

        searchDropdownListFun(keyword){
            const that = this;
            extendUtils.throttle(function() {
                let shortName = 'jd';
                try {
                    shortName = that.BMallConfig.SUPPLIER_Map[goodsHandler.supplierId].shortName;
                } catch (error) {
                    console.log(error);
                }
                if(shortName == 'jd'){
                    that.searchDropdownListJd(keyword);
                }else if(shortName == 'sn'){
                    that.searchDropdownListSn(keyword);
                }
                
            }, that, 300); 
        },

        /*****
         * 搜索关键字补全 苏宁
         */
        searchDropdownListSn(keyword){
            const that = this;
            let param = {
                key: keyword
            }
            that.$loading.show();
            goodsHandler.getdropdownSn(param).then(res=>{
                that.$loading.hide();
                if(!!res){
                    try {
                        let list = JSON.parse(res).words;
                        let newList = list.filter(item=>{ //过滤掉没有keyword字段的数据
                            return !!item.keyword;
                        })
                        //将数据整合成和京东的数据结构一致
                        that.searchList = newList.map(item=>{ 
                            let tag = [];
                            if(!!item.keywords && item.keywords.length > 0){
                                item.keywords.forEach(element => {
                                    if(!!element){
                                        tag.push({
                                            tse: element,
                                            tsh: element
                                        })
                                    }
                                });
                            }
                            return {
                                key: item.keyword,
                                tag,
                            }
                        })
                    } catch (error) {
                        console.log('调用苏宁搜索数据解析报错', error);
                    }
                }
            }).catch(e=>{ 
                that.$loading.hide();
                console.log(e);
            })
        },
        /*****
         * 搜索关键字补全 京东
         */
        searchDropdownListJd(keyword){
            const that = this;
            let url = `https://wq.jd.com/bases/searchdropdown/getdropdown?terminal=m&zip=1&newjson=1&key=${keyword}`;
            that.jsonpAjax(url, function(res){
                try {
                    if(!!res){
                        try {
                            let list = res;
                            that.searchList = list.filter(item=>{ //过滤掉没有key字段的数据
                                return !!item.key;
                            })
                        } catch (error) {
                            that.searchList = [];
                            console.log('调用京东搜索数据解析报错', error);
                        }
                    }
                } catch (error) {
                    
                }
            })
           

        },

        /****
         * jsonp请求方式实现
         */
        jsonpAjax(url, jsonpCallback){
            let jsonpDom = document.getElementById('jsonpId');
            let head = document.getElementsByTagName('head')[0];
            if(!!jsonpDom){head.removeChild(jsonpDom)}
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = 'jsonpId';
            script.src = `${url}`;
            head.appendChild(script);
            window.callback = function(response){
                jsonpCallback(response);
            }
            
        },

        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            this.$router.back();
        },
         /**
         * 子组件清空搜索历史  显示缺省页
         */
        delSearchHistory(){
            this.historySearchList = [];
        }
    }
}
</script>
<style lang="less" scoped>
@import '~themes/default/styles/search/search.less';
</style>