<template>
    <div>
        <div v-if="loading && isInit" >
            <LoadingX tip='获取发票信息中，请稍后...' :spinning="true" :turn="true" />
        </div>
        <EmptyX v-else-if="!loading && invoiceList.length == 0 && isInit" tipsText='暂无发票'/>
        <div v-else>
            <div class="searchBar">
                <search placeholder="搜索" 
                        v-model="keyword" 
                        auto-scroll-to-top 
                        @on-cancel="searchCancel"
                        @on-focus="searchFocus = true"
                        @on-blur="searchBlur"
                        ref="search">
                </search>
            </div>
            <div :class="{searchFocus: searchFocus}">
                <LoadingX v-if="loading" tipsText='获取发票信息中，请稍后...'  />
                <EmptyX v-else-if="!loading && invoiceList.length == 0" tipsText='无符合条件的发票' />
                <div v-else class="invoiceList" v-infinite-scroll="loadBottom" ref="loadmore" infinite-scroll-distance="50" :infinite-scroll-disabled="!canLoadmore">
                    <div class="listItem" v-for="(item, index) in invoiceList" :key="index">
                        <swipeout>
                            <!-- :disabled='isPC' -->
                            <swipeout-item :ref='"swipeoutItem"+index' @on-open="handleSwipeoutOpen(index)" >
                                <div slot="right-menu">
                                    <swipeout-button class="cursorp" @click.native="openDeleteConfirm(item)" background-color="#FF4E3A">删除</swipeout-button>
                                </div>
                                <div slot="content" class="content cursorp" @click="openInvoiceDetail(item)">
                                    <div class="title" :class="judgeTypeStyle(item.orderType)">
                                        <span>付款方：{{item.buyer}}</span>
                                        <span>{{item.createTime}}</span>

                                        <!-- <span>{{item.content}}</span> -->
                                        <!-- <span class="deleteBtn" v-if="isPC" @click.stop="openDeleteConfirm(item)">删除</span> -->
                                    </div>
                                    
                                    <div class="details">
                                        <div class="content-item content_tips">
                                            {{item.content}}
                                        </div>
                                        <div class="content-item">
                                            <span class="content_price">发票金额</span>
                                            <span class="content_des TaxAmount num-font"><span class="symbol">￥</span>{{item.price}}</span>
                                        </div>
                                        <div class="content-item">
                                            <span class="content_title">行程：</span>
                                            <span v-if="item.orderType === 'ORDER_TYPE_HOTEL'" class="content_des">{{item.startCity}}  {{item.travelMessage}}</span>
                                            <span v-else class="content_des">{{item.startCity + ' -- ' + item.endCity}}  {{item.travelMessage}}</span>
                                        </div>
                                           
                                    </div>
                                </div>
                            </swipeout-item>
                        </swipeout>
                    </div>
                    <div class="noMore" v-show="pageNum >= pageTotle">- 没有更多发票了哦 -</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';
import LoadingX from "components/loading/index";
import EmptyX from "components/empty/EmptyX.vue";
import {
    TransferDom,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Search
} from 'vux';

export default {
    mixins: [invoiceHandler.mixin.tChatEventMixin],
    name: 'myInvoice',
    directives: {
        TransferDom
    },
    components: {
        LoadingX,
        EmptyX,
        Swipeout,
        SwipeoutItem,
        SwipeoutButton,
        Search
    },
    data () {
        let managerData = invoiceHandler.stateManager.setData([
            
        ], this)
        let data = {
            isPC: invoiceHandler.isPC(),
            isInit: true,
            loading: true,
            invoiceList: [],
            keyword: '',
            pageSize: 10,
            pageNum: 1,
            pageTotle: 1,
            canLoadmore: true,
            noMore: false,
            searchFocus: false
        }
        data = Object.assign(managerData, data)
        return data
    },
    watch: {
        keyword () {
            this.init('search')
        }
    },
    created () {
        // let that = this
        // //注册并监听t信返回事件
        // invoiceHandler.appBack(function(){     
        //     invoiceHandler.stateManager.closeTopPop(() => {
        //         that.$router.back()
        //     });
        // },that)
        //注册刷新事件，入口页面强制刷新
        this.init('init')
    },
    methods: {
        //注册并监听t信返回事件
        goBackFun(){
            let that = this
            that.$router.back()
        },
        // 初始化 type 区分是页面刷新初始化还是搜索重新初始化
        init (type) {
            this.loading = true
            this.pageNum = 1
            this.getInvoiceList(type)
        },
        // 加载更多
        loadBottom () {
            if (this.pageNum < this.pageTotle) {
                this.canLoadmore = false
                this.pageNum++
                this.getInvoiceList()
            }
        },
        // 获取发票列表 init 区分1加载更多 2搜索重新初始化 3页面重新初始化
        getInvoiceList (init) {
            let param = {
                pageIndex: this.pageNum,
                pageSize: this.pageSize,
                searchContent: this.keyword
            }
            invoiceHandler.getInvoiceHistories(param).then(res => {
                this.loading = false
                this.canLoadmore = true
                if (!!res.result) {
                    this.pageTotle = res.result.totalPages
                    if (init === 'search') {
                        this.invoiceList = res.result.invoiceApplyResponses
                    } else if (init === 'init') {
                        this.invoiceList = res.result.invoiceApplyResponses
                        this.isInit = this.invoiceList.length === 0
                    } else {
                        this.invoiceList = [...this.invoiceList, ...res.result.invoiceApplyResponses]
                    }
                }
            }).catch(err => {
                console.error(err)
                this.loading = false;
            })
        },
        // 打开发票详情弹窗，查看发票详情
        openInvoiceDetail (item) {
            const that = this;
            let orderNo = item.orderNo;
            if (!!orderNo){
                that.$router.push({
                    path: '/detail',
                    query:{
                        type: 'myInvoice',
                        orderNo: orderNo
                    }
                })
            } else {
                invoiceHandler.showToast('orderNo不能为空!')
            }
        },
        // 打开删除确认弹窗
        openDeleteConfirm (item) {
            let that = this
            let str = '确定删除该张发票？';
            invoiceHandler.showConfirm(str, function(){
                that.deleteInvoice(item)
            }, 2, '取消', '确定', null, null, true);
        },
        // 删除发票记录
        deleteInvoice (item) {
            let param = {
                orderNo: item.orderNo
            }
            invoiceHandler.deleteInvoiceHistory(param).then(res => {
                if (res.resultCode == 0) {
                    this.init('init')
                } else {
                    invoiceHandler.showToast('删除失败')
                }
            }).catch(err => {
                console.error(err)
                invoiceHandler.showToast('删除失败')
            })
        },
        
        //处理s实现一个swiperout打开其他的会关闭
        /*@chooseIndex被操作的swipe
        */
        handleSwipeoutOpen(chooseIndex) {
            const that = this;
            if (chooseIndex > -1) {
                that.invoiceList.forEach((val, index) => {
                    if (index != chooseIndex && that.$refs['swipeoutItem' + index][0].isOpen == true) {
                        that.$refs['swipeoutItem' + index][0].close();
                    }
                })
            }
        },
        searchBlur(){
            if (this.keyword === ''){
                this.$refs.search.cancel();
                // this.searchFocus = false;
            }
        },
        searchCancel() {
            this.searchFocus = false
            if (this.keyword !== '') {
                this.keyword = ''
                this.init('search')
            }
        },
        judgeTypeStyle(type){
            if (type == 'ORDER_TYPE_CAR'){
                return {
                    car:true
                }
            } else if (type == 'ORDER_TYPE_FLIGHT'){
                return {
                    flight:true
                }
            } else if (type == 'ORDER_TYPE_TRAIN'){
                return {
                    train:true
                }
            } else if (type == 'ORDER_TYPE_HOTEL'){
                return {
                    hotel:true
                }
            }
        }

    }
}
</script>

<style lang='less' scoped>
@import '~themes/default/styles/myInvoice.less';
</style>
