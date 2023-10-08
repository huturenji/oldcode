<template>
    <div class="goods-wrap">       
        <!-- 分类展示页面dom -->
        <loadingComp v-if="loading"></loadingComp>
        <emptyPage v-else-if="!loading && categoryList.length <= 0" tips='暂无内容'/>
        <div v-else class="sorts-container">
            <div class="left-part">
                <div class="typeItem" @click="changeCategory(item, index)" :class="{active:index == activeIndex}" v-for="(item, index) in categoryList" :key="index">{{item.productCategoryName}}</div>
            </div>
            <div class="right-part">
                <template v-for="(item, index) in categorySecondList" >
                    <div  class="item" :key="index" v-if="1==item.state">
                        <p class="title">{{item.productCategoryName}}</p>
                        <ul class="type-list">
                            <template v-for="(temp, indexTemp) in item.productChildrenCategories">
                                <li @click="chooseSortItem(temp, indexTemp)" v-if="1==temp.state" :key="indexTemp">
                                    <div class='text'>{{temp.productCategoryName}}</div>
                                    <p><Icon type='icon_select' size='.3'/></p>
                                </li>
                            </template>
                        </ul>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
const loadingComp = ()=>import('commonComp/base/LoadingComp.vue');
const emptyPage = ()=>import('common/components/base/emptyPage.vue');
import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
import extendUtils from 'common/lib/utils';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import Icon from 'common/components/base/Icon.vue';
export default {
    mixins: [tChatEventMixin],
    name: 'category',
    components: {
        loadingComp,
        emptyPage,
        Icon
    },
    data(){
        return {
            activeIndex: 0,
            loading: true,
            categoryList: [], //商品一级分类列表
            categorySecondList: [], //商品二级分类列表
        }
    },
    watch:{
      
    },
    created(){
        /****
         * 初始化商品商品分类的数据
         */
        this.initData();
    },
    methods:{

         /****
         * 更改分类的回调
         */
        changeCategory(item, index){
            this.activeIndex = index;
            this.categorySecondList = item.productChildrenCategories;
        },

        /****
         * 初始化商品商品分类的数据
         */
        initData(){
            const that = this;
            //目前的处理方式是在前端缓存取，然后去服务器拿最新的数据
            that.categoryList = !!JSON.parse(extendUtils.getStorage(goodsHandler.primaryKey + '_categoryList')) ? JSON.parse(extendUtils.getStorage(goodsHandler.primaryKey + '_categoryList')) :[] ;
            if(that.categoryList.length > 0){
                that.loading = false; 
                that.categorySecondList = that.categoryList[0].productChildrenCategories;
            }else{
                that.loading = true; 
            }
            that.getCategoryList();
        },

         /****
         * 查询B+平台商品分类 并赋值给商品一级分类列表和二级分类列表
         */
        getCategoryList(){
            const that = this;
            let param = {
            }
            if(!!goodsHandler.supplierId){
                param['supplierId'] = goodsHandler.supplierId
            }
            goodsHandler.getCategoryList(param).then(res=>{
                if(res.resultCode == 0 && res.result){

                    //默认显示8个类型
                    let tempList = [];
                    //只有state为1的分类消息才展示
                    for(let i=0;i<res.result.productCategoryList.length;i++){
                        if(1==res.result.productCategoryList[i].state){
                            tempList.push(res.result.productCategoryList[i]);
                        }
                    }
                    that.categoryList = tempList;
                    that.categorySecondList = that.categoryList[0].productChildrenCategories;
                    that.loading = false;
                    //将获取的产品分类存储缓存或者更新前端分类缓存
                    extendUtils.setStorage(goodsHandler.primaryKey + '_categoryList', JSON.stringify(that.categoryList));
                }
            }).catch(e=>{ 
                console.log(e);
                that.loading = false;
            })
        },

        /****
         * 选择具体的二级分类跳转到搜索列表页面
         * @param item 选择的分类项
         */
        chooseSortItem(item){
            extendUtils.setSession('backPath', '/category');
            this.$router.push({
                path:'/product/list',
                query:{
                    keyWords: item.productCategoryName,
                    catId: item.productCategoryId
                }
            })
        },

        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            this.$router.push({
                path: "/index"
            });            
        },
    }
}
</script>
<style scoped lang="less">
  @import '~themes/default/styles/category/category.less';
</style>