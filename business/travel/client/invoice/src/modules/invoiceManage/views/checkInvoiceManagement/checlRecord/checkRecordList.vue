<template>
    <div class="checkRecordList" :class="{noScroll:showFilter}">
        <!-- 顶部的搜索和筛选部分 -->
        <div v-transfer-dom>
            <div class="top_wrap">
                <div class="search_and_filter_container">
                    <!-- 标题操作搜索和筛选 -->
                    <div v-if="showOptionTitle" class="option_part">
                        <div @click="showOptionTitle = false" v-show="!showFilter" class="item search">
                            <i><icon type="icon_search_glass" size=".28"/></i>
                            <span>搜索</span>
                        </div>
                        <div @click="showFilterFun" class="item filter" :class="{bbpx:showFilter}">
                            <i><icon type="icon_filter_screen" size=".28"/></i>
                            <span>筛选</span>
                        </div>
                    </div>

                    <!-- 搜索框 -->
                    <div v-else class="search_part">
                        <i class="search_icon"><icon type="icon_search_glass" size=".28"/></i>
                        <input class="search_input"  ref="InvoiceCodeInput" v-model="invoiceCode" type="text" placeholder="发票代码">
                        <span @click="showOptionTitle = true; invoiceCode=''" class="cancle_btn">取消</span>
                    </div>

                    <div v-show="showFilter" class="filter_wrap">
                        <checkRecordFilter ref="FilterCom" @confirmFilter="confirmFilter" @clearInvoiceCode="clearInvoiceCode"></checkRecordFilter>
                    </div>

                </div>
            </div>
        </div>
        <div v-show="!showFilter" class="content_box">
            <div v-if="loading">
                <LoadingX tip='获取查验记录中，请稍后...' :spinning="true" :turn="true" />
            </div>
            <EmptyX v-else-if="!loading && verInvoiceList.length == 0" tipsText='未查到查验记录' />
            <!-- 底部查询记录列表 -->
            <div v-else class="record_box" v-infinite-scroll="loadBottom" infinite-scroll-distance="10" :infinite-scroll-disabled="!canLoadmore">
                <div @click="gotoDetail(item)" v-for="(item,index) in verInvoiceList" :key="index" class="record_item">
                    <div class="record_content">
                        <div class="top_title">
                            <span>查验日期：{{item.verDate}}</span>
                            <span class="status">查验通过</span>
                        </div>
                        <p class="title">发票代码 {{item.invoiceCode}}</p>
                        <p class="des">发票类型：{{transferInvoiceTypeToText(item.invoiceType)}}</p>
                    </div>
                </div>
                <div class="noMore" v-show="pageIndex >= totalPageCount">- 没有更多查验记录了哦 - </div>
            </div>
           
        </div>
    </div>
</template>
<script>
import icon from 'components/icon';
import checkRecordFilter from './checkRecordListFilter.vue';
import {
    TransferDom
} from 'vux';
import LoadingX from "components/loading/index";
import EmptyX from "components/empty/EmptyX.vue";
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';
import mixin from '../common/checkInvoiceMixin.js';

export default {
    directives: {TransferDom},
    components:{
        checkRecordFilter,
        LoadingX,
        EmptyX,
        icon
    },
    mixins:[mixin,invoiceHandler.mixin.tChatEventMixin],
    data(){
        return {
            showFilter:false, //是否显示筛选组件
            pageSize:20,//查询每页数量，不传默认20
            pageIndex:1,//当前页数，不传默认为1
            invoiceType:'',//筛选参数
            invoiceTypeArr:[''],//筛选参数数组 和 筛选子组件的selectedOption一致
            invoiceCode:'',//发票代码(支持模糊匹配)
            loading:true,
            verInvoiceList:[],//查验记录列表
            totalPageCount:'',
            canLoadmore: true,
            showOptionTitle: true
        }
    },
    watch:{
        invoiceCode(){
            if (!this.showFilter){
                this.init('search');
            }
        }
    },
    created(){
        // //注册并监听t信返回事件
        // invoiceHandler.appBack(function(){
        //     invoiceHandler.stateManager.closeTopPop(()=>{
        //         that.$router.back();   
        //     });
        // }, that)
        
    },
    mounted(){
        this.init();
    },
    methods:{
        //注册并监听t信返回事件
        goBackFun(){
            let that = this;
            that.$router.back();
        },
        // 加载更多
        loadBottom () {
            if (this.pageIndex < this.totalPageCount) {
                this.canLoadmore = false;
                this.pageIndex++
                this.initData()
            }
        },
        clearInvoiceCode(){
            this.invoiceCode = '';
        },

        showFilterFun(){
            this.showFilter = !this.showFilter;
        },
        //确认筛选
        confirmFilter(filterOptionArr){
            let that = this;
            that.showFilter = false;
            that.invoiceTypeArr = JSON.parse(JSON.stringify(filterOptionArr));
            that.invoiceType = that.invoiceTypeArr.join(',');
            that.init('filter');
        },
        // 初始化 type 区分是页面刷新初始化还是搜索重新初始化
        init (type) {
            this.loading = true
            this.pageIndex = 1
            this.initData(type)
        },
        //初始化列表数据 type 区分 1加载更多 2搜索重新初始化 3页面重新初始化
        initData(type){
            let that = this;
            let param = {
                userId: invoiceHandler.userId,
                companyId: invoiceHandler.companyId,
                channelId: invoiceHandler.channelId,
                pageSize:that.pageSize,
                pageIndex:that.pageIndex,
                invoiceType:that.invoiceType,
                invoiceCode:that.invoiceCode
            };
            invoiceHandler.verInvoiceList(param).then(res=>{
                that.loading = false;
                this.canLoadmore = true
                if (res.resultCode==0 && res.result){
                    that.totalPageCount = res.result.totalPageCount;
                    if (type == 'filter' || type == 'search'){ //筛选和搜索
                        that.verInvoiceList = res.result.verInvoiceList;
                    } else {
                        that.verInvoiceList = [...that.verInvoiceList, ...res.result.verInvoiceList]
                    }
                }
            }).catch(e=>{
                console.log(e);
                that.loading = false;
            })
        },
        //跳转到详情
        gotoDetail(item){
            this.$router.push({
                path:'/check/result',
                query:{
                    verRecordId:item.verRecordId
                }
            })
        }

    }
}
</script>
<style lang="less" scoped>
@import '~themes/default/styles/checkRecordList.less';
</style>
