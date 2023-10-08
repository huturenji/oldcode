<!--
    商品缩略图及相应的各个状态
-->
<template>
    <div class="order-list-container">
        <div class="fix-box" :class="[showTabShadow?'show-shadow':'']">
            <div class='search-bar'>
                <div class="search-mask" v-if='inputting' @click='clickMask'></div>
                <div class='search-content'>
                    <searchComp ref="searchComp" v-model="keywords" :isCacheSearchHistory='false' placeholderText='商品名称/商品编号/订单号' @search="search" @focusInputFun="focusInput" @cancleEmit="inputting=false"/> 
                </div>
            </div>
            <nav>
                <tab 
                    :line-width=3 
                    custom-bar-width="30px" 
                    :scroll-threshold=6
                    >
                    <tab-item 
                        v-for="nav in navList" 
                        :key="nav.code" 
                        :selected="nav.code == currNav.code"
                        @on-item-click="changeNav(nav)"
                    >{{nav.name}}</tab-item>
                </tab>
            </nav>
        </div>
        <div class='list'>
            <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
                <div id='orderList'>
                    <div class='item cursorp normal-btn' 
                        v-if='order.products && order.products.length>0'
                        v-for='(order, index) in orderList' 
                        :key='index'
                        @click='goDetail(order)'  
                    >   
                        <thumb04 :order='order'>
                            <btnGroup 
                                class='btn-group' 
                                @deleteOrderCompleted="deleteOrderCompleted(order, index)" 
                                @cancelOrderCompleted="changeOrderState(order, index)" 
                                @confirmReceiptCompleted="changeOrderStateCompleted(order, index)" 
                                :orderInfo='order' 
                                :btnTypes='btnTypes'/>
                        </thumb04>
                    </div>
                </div>
            </mescrollVue>
        </div>
    </div>
</template>
<script>
    import { Tab, TabItem } from 'vux';
    import { SnModal } from 'sinosun-ui';
    import extendUtils from 'common/lib/utils';
    import orderHandler from 'common/lib/requestHandler/orderHandler.js';
    import {getOrderStates, OrderState} from 'common/lib/enum/orderStatusEnum';
    import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
    import mescrollMixin from 'common/lib/mixin/mescrollMixin';
    import thumb04 from 'common/components/goodsThumb/thumb04.vue';
    import btnGroup from 'common/components/orderBtn/btnGroup.vue';
    const searchComp = ()=>import('commonComp/search/simpleSearch.vue');
    export default {
        mixins: [mescrollMixin,tChatEventMixin],
        components: {searchComp, thumb04, btnGroup, Tab, TabItem},
        data(){
            let navList = getOrderStates('ALL', 'UNPAID', 'UNRECEIVED', 'COMPLETE', 'CANCELED');
            //动态路由获取默认展示的订单类型
            let routeOrderType = this.$route.params.orderType;
            let currNav = routeOrderType ? navList[routeOrderType.toUpperCase()] : navList.ALL;

            return Object.assign(extendUtils.stateManager.setData([
                {
                    name: 'inputting',
                }
            ], this), {
                 mescrollUp: {
                    empty: {
                        warpId: 'orderList'
                    },
                    page: {
                        num: 0,
                        size: 10 //订单这里的分页是每页显示10条
                    },
                },
                currNav: currNav,//选中的菜单索引
                keywords: '',//搜索关键字
                navList: navList,//菜单列表
                orderList: [],//订单列表
                btnTypes: ['deleteOrder', 'refundDetail', 'invoiceDetail', 'confirmReceipt', 'showExpress',  'orderAgain', 'pay', 'approval'],
                showTabShadow:false,//是否显示tab阴影
            })
        },
        mounted(){
            
        },
        //此处是为了解决，从商云的我的商城进入时，如果供应商切换到苏宁（或其他）时，支付完成后到订单列表在回退到首页时，页面的title未更新为对应供应商企业购的问题。
        beforeRouteLeave(to, from, next){
            if(!!to && to.path == '/home'){
                to.meta.title = extendUtils.getMallTitle();
            }
            next();
        },
        activated(){         
            //如果页面是前进过来的，则重新加载；否则保活
            
            if(extendUtils.getSession('nextDirection') == 'forward'){
               
               this.clearSearchOptions();  
               //保活页激活
               this.initOrderPage();
            } 
            //页面返回的时候刷新状态
            this.changeOrderStateKeepLive();     
            //页面返回的时候去除在订单详情页面已删除的订单
            this.deleteOrderKeepLive(); 
        },
        computed:{
            
        },
        watch:{
           inputting(val){
               if(!val && !this.keywords){
                   this.initOrderPage();
               }
           }
        },
        methods: {
            //滚动事件，动态添加tab阴影
            onScroll(mescroll, scrollTop, isUp){
                if(scrollTop>5){
                    this.showTabShadow = true;
                }else{
                    this.showTabShadow = false;
                }
            },
            /**
             * 初始化分页数据
             */
            initOrderPage(){
                this.orderList = [];
                this.mescroll.resetUpScroll();
            },

            /**
             * 清空筛选条件相关选项
             */
            clearSearchOptions(){
                this.inputting = false;
                this.keywords = '';
                this.changeCurrNav();
            },

            /**
             * 将当前选中的tab标签改为与动态路由参数匹配的
             */
            changeCurrNav(){
                //动态路由获取默认展示的订单类型
                let routeOrderType = this.$route.params.orderType;
                this.currNav = !!routeOrderType ? this.navList[routeOrderType.toUpperCase()] : this.navList.ALL;
            },

            /**
             * 将当前选中的tab标签改为全部标签  
             * 此处适用于搜索组件的搜索的回调,因为改搜索功能只针对于全部订单
             */
            changeCurrNavAll(){
                this.currNav = getOrderStates('ALL').ALL;
            },

             /**
             * 页面刷新入口函数 mescroll刷新回调
             * @param mescroll对象
             */
            re_fresh(mescroll){
                //mescroll在刷新时，会显示上拉分页的loading，这里隐藏掉
                try{
                    let loadingDom = document.getElementsByClassName('mescroll-upwarp');
                    if(loadingDom && loadingDom.length>0){
                        loadingDom = loadingDom[0];
                        loadingDom.style.visibility='hidden';
                    }
                }catch(e){
                    console.error(e);
                }
                this.initOrderPage();
            },

            /**
             * 根据商品分类id查询B+平台商品列表和详情 mescroll回调
             * @param page 分页对象，由mescroll提供
             * @param mescroll mescroll对象
             */
            async getListData(page, mescroll){
                try{
                    let data = await this.searchOrderList(page, this.currNav.code);
                    let list = data.result.orders;
                    if(list && list.length>0){
                        this.orderList.push(...list);
                    }
                    mescroll.endByPage(list.length, data.result.pages);
                }catch(e){
                    console.error(e);
                    mescroll.endErr();
                }
            },

             /**
             * 获取订单列表的数据
             * @param page 分页的对象
             * @param currNavId 当前搜索的订单列表状态ID 暂时用navList对象里面的index标识
             */
            searchOrderList(page, currNavId){
                let that = this;
                return new Promise((resolve, reject) => {
                    orderHandler.getOrderList({
                        channelId: orderHandler.channelId,
                        companyId: orderHandler.companyId,
                        userId: orderHandler.userId,
                        supplierId: orderHandler.supplierId,
                        queryExt: {
                            ext: that.keywords,
                            orderState: currNavId,
                        },
                        pageNum: page.num,
                        pageSize: page.size,
                    }).then(res=>{
                        //如果返回结果时切换分类了，则丢弃当前结果
                        if(currNavId != this.currNav.code){
                          return;
                        }
                        resolve(res);
                    }).catch(e=>{ 
                        console.log(e);
                        reject();
                    })
                })
            },
            /**
             * 搜索
             */
            search(keywords){
                this.keywords = keywords;
                this.inputting = false;
                this.changeCurrNavAll();
                this.initOrderPage();
            },
            /**
             * 切换订单类型
             */
            changeNav(nav){
                this.currNav = nav;
                this.keywords = null;
                this.initOrderPage();
            },

            /**
             * 事件： 焦点放在input上时
             */
            focusInput(){
                this.inputting = true;
            },

            /**
             * 前往订单详情
             */
            goDetail(order){
                this.$router.push({
                    path: '/order/detail/'+order.orderNo
                })
            },

            /****
            *点击搜索的mask
             */
            clickMask(){
                this.inputting = false;
                this.$refs.searchComp.showCancleBtnCopy = false;
            },

            /**
             * T信回退事件的注册回调 必须是goBackFun
             */
            goBackFun(backSteps){
                let middlePage = this.$route.query.middlePage; //middlePage该参数目前仅仅是用来保证从提交订单页面提交的申请采购，表单完结后，点击确定或返回按钮，跳到订单列表页面，此时点击返回返回到首页，此时在在首页返回直接关闭浏览器
                if(backSteps == 'home' || !!middlePage){//如果backSteps是home的话或者是中间页的话表示回到首页
                    this.$router.push({
                        path: '/home',
                        query: {
                           middlePage
                        }
                    })
                }else{
                    this.$router.go(-backSteps);
                }
            },

            /**
             * 将订单的状态变为已取消 
             */
            changeOrderState(order, index){
                if((this.currNav.code == OrderState.UNPAID.code) || (this.currNav.code == OrderState.UNAPPROVAL.code)){ //如果是待付款或者待审批的状态下，将该条目移除
                    this.orderList.splice(index, 1);
                }else{
                    this.orderList[index].orderState = OrderState.CANCELED.code;   
                    this.orderList.splice(index, 1, this.orderList[index]);
                }
            },
            /**
             * 将订单的状态变为已完成
             */
            changeOrderStateCompleted(order, index){
                if(this.currNav.code == OrderState.UNRECEIVED.code){ //如果是待收货的状态下，将该条目移除
                    this.orderList.splice(index, 1);
                }else{
                    this.orderList[index].orderState = OrderState.COMPLETE.code;   
                    this.orderList.splice(index, 1, this.orderList[index]);
                }
            },
            /**
             * 订单删除后处理列表数据
             * todu这里目前会有bug，删除数据后把本地数据删除了，没有重新拉去服务器数据，会导致下一页的数据与当前页数据之间有数据加载不到，刷新后能解决
             */            
            deleteOrderCompleted(order, index){
                this.orderList.splice(index, 1);
            },
            /** 
             *  从订单列表返回如果订单状态变化了，更新当前列表中当前条目的数据
             *  保活导致的
             */
            changeOrderStateKeepLive(){
                if(!window.orderItemContainer){return}
 
                let index = this.orderList.findIndex(item => {
                    return window.orderItemContainer.orderNo == item.orderNo;
                })
                if(index > -1 && (window.orderItemContainer.orderState != this.orderList[index].orderState)){//如果存在index,并且orderState订单状态不相等，则更新状态
                    if((this.currNav.code == OrderState.UNPAID.code) || (this.currNav.code == OrderState.UNAPPROVAL.code) || (this.currNav.code == OrderState.UNRECEIVED.code)){ //如果是待付款、或待审批的状态下，将该条目移除
                        this.orderList.splice(index, 1);
                    }else{
                        this.orderList[index].orderState = window.orderItemContainer.orderState;   
                        this.orderList.splice(index, 1, this.orderList[index]);
                    }
                }
                window.orderItemContainer = null; //清空该对象
            },
            /** 
             *  从订单列表返回如果订单删除了，删除当前列表中当前条目的数据
             *  保活导致的
             */
            deleteOrderKeepLive(){
                if(!window.detletedOrder){return}
                let index = this.orderList.findIndex(item => {
                    return window.detletedOrder == item.orderNo;
                })
                if(index > -1){//如果存在index,则删除数据
                    this.orderList.splice(index, 1);
                }
                window.detletedOrder = null; //清空该对象
            }            
           
        }
    }

</script>
<style scoped lang="less">
  @import '~themes/default/styles/order/orderList/orderList.less';
</style>
<style lang='less'>
  @import '~themes/default/styles/components/mescroll.less';
</style>