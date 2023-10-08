<template>
    <view :class="{content: nav_list.length}" :style="[styles, setBgStyle]">
        <view class="sort_wrap">
            <!-- 顶部的分类tab -->
            <view class="sort_title_wrap" v-if="nav_list.length>1||(decoProps.showFirstNav&&nav_list.length==1)">
                <view ref='tab' v-if="decoProps.cateStyle === 1">
                    <tabs 
                        :class="{'tab_top_fixed': decoProps.showMoreTabFixed}"
                        :customLine="true"
                        :list="nav_list"
                        :current="currIndex" 
                        keyName="title" 
                        :itemStyle="{height: '100rpx'}"
                        :inactiveStyle="inactiveStyle"
                        :activeStyle="activeStyle"     
                        :lineWidth="'46rpx'"
                        :lineHeight="'22rpx'"    
                        @tabChange="change"                        
                    ></tabs>
                </view>
                <view ref='tab' class="cate2" v-if="decoProps.cateStyle === 2">
                    <customTabs 
                        :list="nav_list"
                        :current='currIndex'
                        :lineWidth="0"
                        :itemStyle="{'height': '76rpx','font-size':'36rpx'}"
                        :showScrollBar="false"
                        :tabIndexStyle='tabIndexStyle'
                        @change="change"
                        class="scrollView"
                    >
                    </customTabs>
                </view>
                <view ref='tab' class="cate3" v-if="decoProps.cateStyle === 3">
                    <imgTabs 
                        :list="nav_list"
                        :current='currIndex'
                        :lineWidth="0"
                        :itemStyle="{'height': '76rpx','font-size':'36rpx'}"
                        :showScrollBar="false"
                        :tabIndexStyle='tabIndexStyle'
                        @change="change"
                        class="scrollView"
                    >
                    </imgTabs>
                </view>
            </view>
            <view v-if="nav_list.length" class="sort_goods_wrap">
                <view class="recommend-goods flex_row_start_start">
                    <view :class="{goods_item_wrap: currNavItem.goodsList.length==0}" class="width100">
                        <!-- 商品骨架图部分 -->
                        <thumbSkeleton
                            v-if="showSkeletonLoading" 
                            :style="{width: '100%'}"
                            :showType="skeletonType[decoProps.show_style]"
                            :quantity="dealNumber()"
                        />

                        <template v-else-if="!showSkeletonLoading && currNavItem.goodsList.length > 0">

                            <view v-show="currIndex==i" v-for="(temp, i) in nav_list" :key="i">
                                <!-- 对应装修的商品展示模式为：一行一个 -->
                                <template v-if="decoProps.show_style=='bijia'">
                                    <thumbDecorateH v-for="item in temp.goodsList" :key="item.sku" :goods="item" :showThumbTips="true" borderRadius="16" />
                                </template>
    
                                <!-- 对应装修的商品展示模式为：大图 -->
                                <template v-if="decoProps.show_style=='datubijia'">
                                    <thumbDecorateBigH class="goods_item" v-for="(item) in temp.goodsList" :key="item.sku" :goodsItem="item" borderRadius="16" :showThumbTips="true" />
                                </template>
    
                                <!-- 对应装修的商品展示模式为：一行两个和一行两个2 -->
                                <template v-if="decoProps.show_style === 'half_rank' || decoProps.show_style=='small'">
                                    <view class="twoGoodsList">
                                        <view class="column">
                                            <thumbDecorateV class="goods_item" v-for="item in twoGoodsList(temp.goodsList, 0)" borderRadius="16" :key="item.sku" :goodsItem="item" :showThumbTips="true" />
                                        </view>
                                        <view class="column">
                                            <thumbDecorateV class="goods_item" v-for="item in twoGoodsList(temp.goodsList, 1)" borderRadius="16" :key="item.sku" :goodsItem="item" :showThumbTips="true" />
                                        </view>
                                    </view>
                                </template>
    
                                <template>
                                    <loadingState :state='loadingStates' v-if="!currNavItem.done" />
                                    <noMoreDataDivider v-if="showNoMore && decoProps.isShowMore && currNavItem.done" />
                                </template>
                            </view>
                        </template>

                        <!-- 暂无商品 -->
                        <template v-else>
                            <view class="no_goods">
                                <view class="no_goods_text">
                                    <view class="img"></view>
                                    <text>暂无数据</text>
                                </view>
                            </view>
                        </template>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import pullProdouctPriceMixin from '@/common/mixin/pullProdouctPriceMixin'
import tabs from "@/common/components/tab/base";
import thumbDecorateBigH from "@/common/components/thumb/thumb-decorate-big-h.vue";
import thumbDecorateH from '@/common/components/thumb/thumb-decorate-h.vue';
import thumbDecorateV from '@/common/components/thumb/thumb-decorate-v.vue';
import thumbSkeleton from '@/common/components/thumb/thumb-skeleton.vue';
import noMoreDataDivider from "@/common/components/division/index.vue";
import { isNotEmpty, checkPaginationHasMore } from '@/utils/common.js'
import loadingState from "@/common/components/loading/loading.vue";
import mixin from "@/common/components/decorate/common/mixin/index";
import customTabs from "@/common/components/tab/custom";
import imgTabs from "@/common/components/tab/imgtab";
import goodsHandler from "@/views/components/goods/handler.js";
export default {
    name: 'deco-goods-category',
    mixins: [pullProdouctPriceMixin, mixin],
    data(){
        return {
            // 装修组件属性
            decoProps: {},
            skeletonType: {
                small: 'small',
                bijia: 'bijia',
                datubijia: 'datubijia',
                zhexianbijia: 'zhexianbijia',
                half_rank: 'small'
            },
            currIndex: 0,
            nav_list: [],
            cycleStop: false,
            sizeLoading: false,
            firstLoad: false,  // 记录商品的初次加载
            showNoMore: true, // 是否显示没有更多了
            hasmore:true,
            loadingState:'first_loading',
            goodsPoolFlag:true
        }
    },
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        thumbDecorateH,
        thumbDecorateBigH,
        thumbDecorateV,
        thumbSkeleton,
        noMoreDataDivider,
        loadingState,
        tabs,
        customTabs,
        imgTabs
    },
    computed:{
        currNavItem(){
            return this.nav_list[this.currIndex] || {};
        },

        // 分类样式
        tabIndexStyle() {
            let style = {}
            if (this.nav_list.length > 3) {
                style.width = '184rpx'
            } else {
                style.flex = 1
            }
            return style
        },

        showSkeletonLoading(){
            return this.currNavItem.skeletonLoading; 
        },

        // 一行两个商品拆分
        twoGoodsList() {
            return (goods, type) => {
                let list = []
                goods.forEach((item, index) => {
                    if (index % 2 === type) {
                        list.push(item)
                    }
                })
                return list
            }
        },

        useOnlineSources(){
            return isNotEmpty(this.decoItem.onlineSources)
        },

        inactiveStyle(){
            return { 
                color: '#222222',
                transform: 'scale(1)',
                fontSize:'30rpx'
            }
        },
        loadingStates(){
            let flag
            if(this.decoProps.sources === 'goodsPool'){
                flag = this.loadingState
            }else{
                flag = 'loading'
            }
            return flag
        },
        activeStyle(){
            return {
                color: '#222222',
                transform: 'scale(1.05)',
                transformOrigin:'center bottom',
                fontWeight:'bold',
                transition: 'transform .3s',
                fontSize:'32rpx'
            }
        },
        // 组件背景样式
        setBgStyle() {
            let style = {}
            if (this.decoItem.props.isShowStyle) {
                style.backgroundColor = this.decoItem.styles[0].background.color
            }
            
            return style
        }
    },
    mounted() {
        this.decoProps = this.decoItem.props
        this.initMoreTabData(this.decoItem);
        this.initBackgroud(this.decoItem)
        this.initSpace(this.decoItem)
        uni.$off('decoReachBottom')
        uni.$on('decoReachBottom',this.decoReachBottom)
    },
    activated() {
        this.goodsPoolFlag = true
        // 只有完成了初次加载，才循环请求控制
        if (this.firstLoad) {
            if(this.decoItem.props.sources === 'goodsPool'){
                this.getGoodsPoolGoods(this.nav_list[this.currIndex])
            }
            this.dealCycle(false)
        }
    },
    deactivated() {
        this.goodsPoolFlag =false
        this.dealCycle(true)
    },
    methods: {
        //分页下拉加载更多
        decoReachBottom(){
            if (this.hasmore&&this.loadingState!=='loading'&&this.decoItem.props.sources === 'goodsPool'&&!this.nav_list[this.currIndex].skeletonLoading) {
                this.getGoodsPoolGoods(this.nav_list[this.currIndex]);
            }
        },
        // 处理显示没有更多了 
        // todo 处理切换tab的时候，先显示了没有更多了 又显示商品列表的问题
        dealShowNoMore(){
            this.showNoMore = false;
            setTimeout(()=>{
                this.showNoMore = true;
            }, 2000)
        },
        /***
         * 处理处理估计图的数量
         * 如果装修的商品数量小于10 骨架图的数量就展示装修的商品数量
         */
        dealNumber(){
            let defaultNumber = 10;
            if (this.decoProps.sources === 'upload'&&this.currNavItem.ids.length < 10){
                defaultNumber = this.currNavItem.ids.length
            }
            return defaultNumber;
        },

        // 控制循环请求 即当离开当前页面的时候，此时停止掉对应的请求
        dealCycle(isStop) {
            if (this.nav_list.length === 0) { return }
            this.cycleStop = isStop
            if (!isStop) {
                this.getMoreTabData(this.currIndex, this.nav_list[this.currIndex].pageIndex)
            }
        },
     
        /**
         * @param {*} isOnce 是否初次触发，手动触发为true 不修改瀑布流中的方法，切换时为 undefined
         */        
        change(item){
            this.dealShowNoMore();

            this.currIndex = item.index;
            this.tabChange(item)
        },

        /*====================获取各个tab下的数据 start======================= */
        // 初始化 more_tab 装修的数据
        initMoreTabData(data) { // 通过装修接口api，实时返回的商品数据
            this.decoProps = data.props
            if (this.decoProps.sources === 'upload'){
               // 装修选择的商品，返回装修的数据
                this.nav_list = data.data.map((goodsItem, index) => {
                    return {
                        ...goodsItem,
                        pageIndex: 1,
                        totalPage: this.dealGoodsSplit(goodsItem.ids.length).length - 1,
                        index,
                        showStyle: this.decoProps.show_style,
                        goodsList: [], //用来真正渲染的商品数据字段
                        skeletonLoading: true, //是否显示该tab栏的骨架图
                        done: false, //该列表是否加载完毕
                        isLoad: false, // 是否进行过加载 初次加载或初次tab切换后为true，再次切换tab不进行数据加载逻辑
                        goodsSplit: this.dealGoodsSplit(goodsItem.ids.length) //当前切片列表 在pullProdouctPriceMixin里面
                    }
                })
            }else if(this.decoProps.sources === 'goodsPool'){
                this.nav_list = data.data.map((goodsItem, index) => {
                    return {
                        ...goodsItem,
                        pageIndex: 1,
                        index,
                        showStyle: this.decoProps.show_style,
                        goodsList: [], //用来真正渲染的商品数据字段
                        skeletonLoading: true, //是否显示该tab栏的骨架图
                        done: false, //该列表是否加载完毕
                        isLoad: false // 是否进行过加载 初次加载或初次tab切换后为true，再次切换tab不进行数据加载逻辑
                    }
                })
            }
            
            // 先默认加载第一个tab的数据
            if (this.nav_list.length > 0) {
                this.change(this.nav_list[0], true)
            }
        },

        /**
         * 获取并筛选商品数据 
         * 1.先加载装修商品的骨架图；
         * 2.skus、是否限售、是否有库存共同决定筛选出显示的商品。
         * @param tabIndex 当前tab的索引
         * @param pageIndex 需要加载数据的页数
        */
        async getMoreTabData(tabIndex, pageIndex) {
           
            const tabInfo = this.nav_list[tabIndex];
        
            if ( this.cycleStop || pageIndex > tabInfo.totalPage) { // 离开当前页的时候停止掉 或者 当前页大于总页数
                this.$set(tabInfo, 'skeletonLoading', false); // 干掉骨架图
                return 
            } 
            this.$set(tabInfo, 'isLoad', true);
            const skus = tabInfo.ids.slice(tabInfo.goodsSplit[pageIndex-1], tabInfo.goodsSplit[pageIndex]);
            if (skus && skus.length > 0 && isNotEmpty(tabInfo.goodsSplit[pageIndex-1])){ 
                // 通过接口获取更新和过滤相关的商品数据
                if (pageIndex == 1){ //当前tab栏的第一页的时候 显示骨架图
                    this.$set(tabInfo, 'skeletonLoading', true);
                } 
                let list = await this.updateGoodsBySkus(skus, this.decoProps.show_style); //在pullProdouctPriceMixin中
                if(this.decoProps.filterNoSubstantialGoods){
                    // 过滤掉实惠标签
                    list = list.filter(item => goodsHandler.isShowJdLable(item))
                }
                if (this.decoProps.filterNosaleGoods) {
                    list = await this.filterGoodsByAddress(list)
                    this.firstLoad = true
                    tabInfo.goodsList.push(...list); // 先更新渲染的商品数据
                } else {
                    this.firstLoad = true
                    tabInfo.goodsList.push(...list); // 先更新渲染的商品数据
                    this.updateGoodsByAddress(list) //在pullProdouctPriceMixin中 再更新商品的区域限售和有货无货
                }
                if(tabInfo.goodsList.length > 0){
                    this.$set(tabInfo, 'skeletonLoading', false); // 干掉骨架图
                }
            } else {
                this.firstLoad = true
            }

            //当前页数+1
            this.$set(tabInfo, 'pageIndex', ++tabInfo.pageIndex);

            // 如果装修的商品未加载完成，加载下一页
            if (tabInfo.pageIndex <= tabInfo.totalPage) {
                // 递归调用该方法
                this.getMoreTabData(tabIndex, tabInfo.pageIndex)
            } else {
                this.$set(tabInfo, 'skeletonLoading', false); // 干掉骨架图
                this.$set(tabInfo, 'done', true); // 说明加载完成
                this.$forceUpdate();
            }
            
        },

        getGoodsPoolGoods(data) {
            const tabInfo = this.nav_list[this.currIndex];
            let groupIds = []
            let goodsGroupList = data.goodsGroup||[]
            if(goodsGroupList&&goodsGroupList.length>0){
                goodsGroupList.forEach(item=>{
                    groupIds.push(item.groupId)
                })
            }
            this.loadingState = this.loadingState == 'first_loading' ? this.loadingState : 'loading';
            let param = {}
            param.pageSize = 20 
            param.pageIndex = tabInfo.pageIndex
            param.productPoolId = data?.goodsPool?.productPoolId
            param.groupIds = groupIds
            goodsHandler.getGoodsPoolGoods(param).then(async res => {
                if (res.state === 200 && res.data) {
                    let list = res.data.list.map(item => {
                        return {...item, canPurchase: true, hasStock: true}
                    })
                    if(this.decoProps.filterNoSubstantialGoods){
                        list = list.filter(item => goodsHandler.isShowJdLable(item))
                    }
                    if(this.decoProps.filterNosaleGoods){
                        list = await this.filterGoodsByAddress(list);
                    }else{
                        list = await this.updateGoodsByAddress(list)
                    }
                    this.hasmore = checkPaginationHasMore(res.data.pagination)
                    //当上一页请求的数据为单数时，此次请求过滤后的商品数量为0个或者1个时，会导致页面看上去像没有数据了一样，测试认为是bug，作此判断
                    if(this.goodsPoolFlag&&list&&list.length<2&&this.hasmore&&tabInfo.goodsList.length>8){
                        this.getGoodsPoolGoods(this.nav_list[this.currIndex])
                    }
                    if((list&&list.length>0)||!this.hasmore){
                        tabInfo.skeletonLoading = false
                    }
                    // 如果数据没加载完，自动加载下一个数据
                    if(tabInfo.pageIndex==1){
                        tabInfo.goodsList = list
                    }else{
                        tabInfo.goodsList = tabInfo.goodsList.concat(list)
                    }
                    if (this.hasmore) {
                        tabInfo.pageIndex++;
                        this.loadingState = 'allow_loading_more';
                    } else {
                        this.loadingState = 'no_more_data';
                        tabInfo.done = true
                    }
                    if(this.goodsPoolFlag&&tabInfo.goodsList.length<8&&this.decoProps.sources === 'goodsPool'&&this.hasmore){
                        this.getGoodsPoolGoods(this.nav_list[this.currIndex])
                    }
                    this.firstLoad = true
                }else{
                    tabInfo.skeletonLoading = false
                    tabInfo.done = true
                    this.firstLoad = true
                }
            })
        },
        // more_tab 切换事件，只有初次切换时才进行加载数据
        tabChange(data) {
            if (this.decoProps.sources === 'goodsPool'){
                // 获取商品池数据
                if(data.pageIndex==1||this.currNavItem.goodsList.length<8){
                    this.getGoodsPoolGoods(data)
                }
            }else if(this.decoProps.sources === 'upload'){
                this.nav_list.forEach((item, index) => {
                    if (index === data.index && !item.isLoad) {
                        this.getMoreTabData(index, item.pageIndex)
                    }
                })
            }
        }
        /*====================获取各个tab下的数据 end======================= */
    }
}
</script>

<style scoped lang='scss'>
    .content {
        display: flex;
        flex-direction: column; 
        box-sizing: border-box;
        .sort_wrap {
            .sort_title_wrap { 
                .tab_top_fixed{
                    width: 750rpx;
                    overflow-x: auto;
                    z-index: 199;
                    padding: 0 20rpx;
                    background: #ffffff;
                }
                ::v-deep .u-scroll-view {
                    // font-weight: bold;
                    .u-tab-item{
                        transition: all .3s linear !important;
                    }
                }
                ::v-deep .u-tabs__wrapper__nav__item__text>span{
                    transition: all .3s linear !important;
                }
                ::v-deep .u-scroll-box {
                    font-size: 0;
                }
        
                .sort_title_item {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    margin-right: 48rpx;
                    white-space: nowrap;
                    box-sizing: border-box;
                    .sort_title {
                        font-size: 32rpx;
                        color: #222;
                        font-weight: 500;
                        position: relative;
                        line-height: 46rpx;
                        height: 46rpx;
                        &.active_item{
                            font-size:36rpx;
                            font-weight: 600;
                            color: #222;
                            line-height: 50rpx;
                            height: 50rpx;
                            &::after{
                                content: "";
                                width: 52rpx;
                                height: 8rpx;
                                background-color: #FC1C1C;
                                position: absolute;
                                bottom: -10rpx;
                                left: 50%;
                                margin-left: -26rpx;
                                border-radius: 4rpx;
                            }
                        }
                    }
    
                    .sort_sub_title {
                        height: 32rpx;
                        font-size: 24rpx;
                        background: transparent;
                        border-radius: 16rpx;
                        color: #666;
                        text-align: center;
                        line-height: 32rpx;
                        padding: 0 10rpx;
                        margin-top: 10rpx;
                    }
                }
            }
            .sort_title_wrap::-webkit-scrollbar{
              display: none;
            }
        }
    }
    
    .cate2 {
        width: 100%;
        height: 76rpx;
        margin-top: 8rpx;
        display: flex;
        overflow-x: auto;
        position: relative;
        border-radius: 12rpx;

        .scrollView {
            width: 100%;
        }

        ::v-deep .tabs__wrapper__nav {
            .tabs__wrapper__nav__item {
                padding: 0;
            }
            & > view:nth-last-child(2) {
                .right-cate-con-box {
                    border:none;
                }
            }
        }

        .right-cate-con-box {
            width: 100%;
            position: relative;
            height: 76rpx;
            text-align: center;
            font-size: 28rpx;
            color: #222;
            background-color: #fff;
            cursor: pointer;
            border-right: 2px solid #eff2f5;

            &.active {
                border-right: none;
            }

            .oneRow {
                width: 100%;
                height: 100%;
            }
        }
    }

    .cate3 {
        width: 100%;
        height: 76rpx;
        display: flex;
        overflow-x: auto;
        position: relative;
        .scrollView {
            width: 100%;
        }

        ::v-deep .tabs__wrapper__nav {
            .tabs__wrapper__nav__item {
                padding: 0;
            }
            & > view:nth-last-child(2) {
                .right-cate-con-box {
                    border:none;
                }
            }
        }
    }

    .list-scroll-content{
        height: 100vh;
    }
    .recommend-title {
        display: flex;
        justify-content: center;
    
        image {
            width: 387rpx;
            height: 34rpx;
            margin: 30rpx 0;
        }
    }
    .recommend-goods {
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .no_goods{
        width: 100%;
        height: 700rpx;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding-top: calc(800rpx * 0.32 - 128rpx);
        .no_goods_text{
            display: flex;
            flex-direction: column;
            .img {
                width: 256rpx;
                height: 256rpx;
                background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwnr.png') center no-repeat;
                background-size: 100% 100%;
            }

            text {
                color: $main-third-color;
                font-size: 28rpx;
                width: 100%;
                text-align: center;
            }
        }
        
    }
    .sort_goods_wrap{
        width: 100%;
        min-height: 1000rpx;
        box-sizing: border-box;
    }
    .width100{
        width: 100%;
        border-radius: 20rpx;
    }
    .goods_item_wrap{
        width: 100%;
        min-height: 800rpx;
    }
    
    .scroll-view {
        width: 100%;
        white-space: nowrap;
    }

    .twoGoodsList {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        width: 100%;
        .column {
            display: flex;
            flex: 1;
            flex-direction: column;
            height: auto;
            overflow: hidden;
        }
    }
</style>
