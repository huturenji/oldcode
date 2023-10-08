<template>
    <div class="navigation">
        <loadingComp v-if="loading"></loadingComp>
        <emptyPage v-else-if="spInfoList.length <= 0"></emptyPage>
        <div v-else>
            <div class="entryListGroupWrap">
                <div class="entryListWrap">       
                    <template v-for="(spInfo,idx) in spInfoList">
                        <div class="entryItem icon-btn"  @click="openEntry(spInfo)" :key="idx">
                            <div class="iconWrap" v-bind:style="{backgroundImage: 'url(' + spInfo.logo + ')'}"></div>
                        </div>
                    </template>
                </div>					
            </div>
        </div>
    </div>
</template>
<script>
import extendUtils from 'common/lib/utils';
import navigationHandler from 'common/lib/requestHandler/navigationHandler.js';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
const emptyPage = ()=>import('commonComp/base/emptyPage.vue');
const loadingComp = ()=>import('commonComp/base/LoadingComp.vue');
export default {
    mixins: [tChatEventMixin],
    components:{
        emptyPage,
        loadingComp
    },
    data(){
        return {
            loading:true,//loading
            spInfoList:[],//供应商信息
        }
    },
    created(){
        this.getSupplierList();
    },
    methods: {
        /**
         * 查询供应商列表
         */
        getSupplierList(){
            const that = this;
            let param = {
                pageNum : 1,
                pageSize : 9999,
            }
            that.loading = true;
            navigationHandler.getSupplierList(param).then(res=>{
                //如果只有一个供应商的话直接跳转重定向，并且直接显示loading
                if(res.resultCode == 0 && res.result && !!res.result.spInfoList){
                    that.spInfoList = res.result.spInfoList.filter(item => 1==item.supplierState);
                    if(!!that.spInfoList && that.spInfoList.length == 1){
                        that.redirectMallIndex(that.spInfoList);
                    }else{
                        that.loading = false;
                    }
                    
                }else{
                     that.loading = false;
                }
            }).catch(e=>{
                that.loading = false;
                console.log(e);
            })
        }, 
        
        /** 
        * 当前供应商如果是一个的话，此时不显示该页面，直接重定向
        */
        redirectMallIndex(arr){
            
            let item = arr[0];
            this.$router.push({
                path: '/home',
                query:{
                    supplierId: item.supplierId
                }
            })
        },

        /**
         * 打开入口
         * @param spInfo {}供应商入口参数对象
         */        
        openEntry(spInfo){
            extendUtils.openPage('index.html#/home?supplierId='+spInfo.supplierId)

            // 暂时屏蔽掉用jsbridge打开小应用的方法
            // let hash = window.location.hash;
            // let newHash = '#/home?supplierId=' + spInfo.supplierId;
            // let url = window.location.href;
            // url = url.replace(hash, newHash);
            // //用jsbridge的方法打开页面
            // extendUtils.openApplet({
            //     appId: this.BMallConfig.SUPPLIER_Map[spInfo.supplierId].appId,
            //     url
            // })
        },

        

		/**
		 * 页面刷新入口函数
		 */
		// refresh(){
        //     this.getSupplierList();
		// },
        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            extendUtils.goBackPage('');
        },
    }
}
</script>
<style lang="less" scoped>
    @import '~themes/default/styles/navigation/navigation.less';
</style>
