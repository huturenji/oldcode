<template>
    <div class="industry-wrap">
       <div class="search-content">
           <!-- <searchBar class='search-bar' placeholder="输入行业名称"/> -->
           <!-- 模拟搜索组件实现 -->
           <div class='mask' @click='gotoSearchIndustry'>
               <div class="virtual-search">
                   <Icon type='icon_search_default' size=".28"/>
                   <span>输入行业名称</span>
               </div>
           </div>
       </div>
       <div v-if="showEmpty" class="empty-page">
            <emptyPage />
       </div>  
       <div v-else class="industry-box">
           <template v-for="(item, index) in industryList">
                <div 
                    v-if="item.type=='btn'"
                    class="industry-item"
                    :key="index"
                    :class="{active: showResourceIndex == index}"
                    @click="clickIndustryItem(item, index)"

                >
                    <div class="itemName">{{item.industry}}</div>
                </div>
                <div 
                    v-else
                    :key="index"
                    class="resource-item"
                >
                    <industryItem 
                        v-for="(temp, i) in item.site" 
                        :key="i" 
                        :item="temp"
                    ></industryItem>
                </div>  
           </template>
       </div>
    </div>
</template>
<script>

import Icon from 'commonComp/icon';
import emptyPage from 'commonComp/emptyPage';
// import searchBar from 'commonComp/search/searchBar';
import newsHandler from 'common/lib/requestHandler/newsHandler';
import industryItem from 'commonComp/industry/industryItem';
import extendUtils from 'common/lib/utils';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';

export default {
    name:'industry',
    mixins: [tChatEventMixin],
    components: {
        Icon,
        // searchBar,
        industryItem,
        emptyPage
    },
    data(){
        let that = this;
        return Object.assign(extendUtils.stateManager.setData([
               
        ], that), {
            showResourceIndex: -1,
            industryList:[],
            loading: true
        })
    },
    created(){
        //获取所有的行业资源列表数据
        this.listAppIndustrySite();
    },
    computed:{
        showEmpty(){
            return !this.loading && this.industryList.length <= 0;
        }
    },
    methods:{
        /*
        * 点击每一个行业的item
        */
        clickIndustryItem(item, index){
            let key = this.getResourceDetail();//获取当前数据中type为detail的数据（有且只有一个）
            //首先只保留type为btn的数据，目的是为了清空插入的资源数据
            this.industryList = this.industryList.filter(temp=>{
                return temp.type == 'btn'
            });

            //如果点击的item是在当前type为detail的后面，此时需要index-1
            if(key > -1 && index > key){
                index = index - 1;
            }
            if(index == this.showResourceIndex){ //取消选中
                this.showResourceIndex = -1;
            }else{ //选中
                this.showResourceIndex = index
               
                let objDetail = {
                    type: 'detail',
                    site: item.site
                }
                let row = parseInt(index/3) + 1; //获取在第几行插入对应的dom
                let insetIndex = row*3;//数组需要
                //再需要的位置引入对应的detai数据，做到数据驱动dom
                this.industryList.splice(insetIndex, 0, objDetail)
            } 
        },

        //获取当前industryList中，非btn的部分
        getResourceDetail(){
            return this.industryList.findIndex(temp=>{
                return temp.type == 'detail'
            });
        },

       
        /** 
        * 获取所有的行业资源列表数据
        */
        listAppIndustrySite(){
            let that = this;
            that.$loading.show();
            that.loading = true;
            return new Promise((resolve, reject) => {
                let param = {
                }
                newsHandler.listAppIndustrySite(param).then(res=>{
                    that.$loading.hide();
                    that.loading = false;
                    if(res.resultCode == 0 && res.result.industrySite.length > 0){
                        let list = res.result.industrySite;
                        //给所有的行业数据新增type = btn字段
                        that.industryList = list.map(item => {
                            item = Object.assign({}, item, {
                                type: 'btn'
                            })
                            return item;
                        });
                        resolve(that.industryList);
                    }else{
                        resolve([]);
                    }
                }).catch(e=>{
                    console.log(e);
                    that.$loading.hide();
                    that.loading = false;
                    reject(false);
                })
            })
        },
        
        /**
         * T信回退事件的注册回调 必须是goBackFun
         * 此时回退一步
         */
        goBackFun(){
            extendUtils.closePage(null, 1);                       
        },


        /*** 
         * 跳转到搜索行业的页面 
        */
        gotoSearchIndustry(){
            this.$router.push({
                path: '/searchIndustry'
            })
        }   
    }

}
</script>
<style lang="less" scoped>
@import "~themes/default/styles/industry/index.less";
</style>
