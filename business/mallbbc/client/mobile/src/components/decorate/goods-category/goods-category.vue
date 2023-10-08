<template>
    <view :class="{content:nav_list.length}" v-margin="decoItem">
        <view class="sort_wrap">
            <!-- 顶部的分类tab -->
            <view class="sort_title_wrap" v-if="nav_list.length>1||(decoProps.showFirstNav&&nav_list.length==1)">
                <view ref='tab' v-if="decoProps.cateStyle === 1">
                    <tabs 
                        :class="{'tab_top_fixed': showMoreTabFixed}"
                        :customLine="true"
                        :list="nav_list"
                        :current="currIndex" 
                        keyName="title" 
                        :itemStyle="{height: '88rpx'}"
                        :inactiveStyle="{color: '#222222', transform: 'scale(1)',fontSize:'30rpx'}"
                        :activeStyle="{color: '#222222', transform: 'scale(1.1)', transformOrigin:'center bottom', fontWeight:'bold',transition: 'transform .3s',fontSize:'34rpx'}"     
                        lineWidth="46rpx"
                        lineHeight="22rpx"    
                        @tabChange="change"                        
                    ></tabs>
                </view>
                <view ref="tab" class="cate2" v-if="decoProps.cateStyle === 2">
                    <customTabs 
                        :list="nav_list"
                        :current='currIndex'
                        :lineWidth="0"
                        :showScrollBar="false"
                        @change="change"
                        class="scrollView"
                    >
                        <template v-slot:content="{navItem}">
                            <view class="right-cate-con-box" :style="cateWidthStyle" :class="{ active: currIndex == navItem.index }">
                                <view class="oneRow flex_column_center_center">{{ navItem.item.title }}</view>
                            </view>
                        </template>
                    </customTabs>
                </view>
                <view ref="tab" class="cate3" v-if="decoProps.cateStyle === 3">
                    <customTabs 
                        :list="nav_list"
                        :current='currIndex'
                        :lineWidth="0"
                        :showScrollBar="false"
                        @change="change"
                        class="scrollView"
                    >
                        <template v-slot:content="{navItem}">
                            <view class="image-cate-con-box" :style="cateWidthStyle">
                                <image class="img_item" :src="setImg(navItem)" mode="heightFix" ></image>
                            </view>
                        </template>
                    </customTabs>
                </view>
            </view>
            <view v-if="nav_list.length" class="sort_goods_wrap">
                <view class="recommend-goods flex_row_start_start">
                    <view :class="{goods_item_wrap:currNavItem.goodsList.length == 0}" class="width100">
                        
                        <!-- 商品骨架图部分 -->
                        <thumbSkeleton
                            v-if="showSkeletonLoading" 
                            :showType="skeletonType[decoProps.show_style]"
                            :quantity="dealNumber()"
                        />

                        <template v-else-if="!showSkeletonLoading && currNavItem.goodsList.length > 0">
                            <view v-show="currIndex == i" v-for="(tab, i) in nav_list" :key="i">
                                <!-- 商品列表瀑布流组件 对应装修的商品展示模式为：一行两个-->
                                <view v-if="!!!decoProps.show_style || decoProps.show_style=='small'" style="width: 100%;">
                                    <goodsListWaterfall
                                        ref='goodsListWaterfall'
                                        :isInOffcanvas="isChildren"
                                        :list="tab.goodsList"
                                        :icon_type="currNavItem.cart_icon_type"
                                        :addTime="0"
                                        :showMore="decoProps.isShowMore && currNavItem.done"
                                        :showThumbTips="true"
                                        mode="replaceAndUpdate"
                                    />
                                    <loadingState :state='loadingStates' v-if="!currNavItem.done && sizeLoading" />
                                </view>
    
                                <!-- 对应装修的商品展示模式为：比价列表 和 折线比价 -->
                                <template v-else-if="decoProps.show_style=='bijia' || decoProps.show_style=='zhexianbijia'">
                                    <thumbDecoreRow
                                        v-for="(item) in tab.goodsList"
                                        class="goods_item"
                                        :key="item.sku"
                                        :isInOffcanvas="isChildren"
                                        :goods_info="item"
                                        :showThumbTips="true"
                                    />
                                </template>
    
                                <!-- 对应装修的商品展示模式为：大图比价 -->
                                <template v-else-if="decoProps.show_style=='datubijia'">
                                    <thumbDecoreBig class="goods_item" v-for="(item) in tab.goodsList" :key="item.sku" :goods_info="item" :showThumbTips="true" />
                                </template>
    
                                <!-- 对应装修的商品展示模式为：一行两个2 -->
                                <template v-if="decoProps.show_style === 'half_rank'">
                                    <view class="twoGoodsList">
                                        <view class="column">
                                            <thumbNormalSmall class="goods_item" v-for="item in twoGoodsList(tab.goodsList, 0)" :key="item.sku" :goodsItem="item" :showThumbTips="true" />
                                        </view>
                                        <view class="column">
                                            <thumbNormalSmall class="goods_item" v-for="item in twoGoodsList(tab.goodsList, 1)" :key="item.sku" :goodsItem="item" :showThumbTips="true" />
                                        </view>
                                    </view>
                                </template>
    
                                <!-- loading状态和缺损页 只有非一行两个的模式才有 -->
                                <template v-if="decoProps.show_style!='small'">
                                    <loadingState :state='loadingStates' v-if="!currNavItem.done && sizeLoading" />
                                    <noMoreDataDivider v-if="decoProps.isShowMore && currNavItem.done" />
                                </template>
                            </view>
                        </template>

                        <!-- 暂无商品 -->
                        <template v-else>
                            <view class="no_goods">
                                <view class="no_goods_text flex_column_center_center">
                                    <view class="img"></view>
                                <text>暂无数据</text></view>
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
import goodsListWaterfall from "@/components/goods/waterfallList.vue";
import tabs from "@/components/tab/base";
import thumbDecoreRow from '@/components/goods/thumb/thumb-decore-row.vue';
import thumbSkeleton from '@/components/goods/thumb/thumb-skeleton.vue';
import thumbDecoreBig from '@/components/goods/thumb/thumb-decore-big.vue';
import thumbNormalSmall from '@/components/goods/thumb/thumb-normal-small.vue';
import noMoreDataDivider from "@/components/division/index.vue";
import { isNotEmpty } from '@/utils/common.js'
// import saleState from '@/common/lib/enum/saleState.js'
import eventsMixin from '../common/mixin/eventsMixin'
import loadingState from "@/components/loading/loading.vue";
import customTabs from "@/components/tab/custom";
import goodsHandler from '@/components/goods/handler';
export default {
    name: 'deco-goods-category',
    mixins: [pullProdouctPriceMixin, eventsMixin],
    data(){
        return {
            // 装修组件属性
            decoProps: {},

            imgUrl: getApp().globalData.imgUrl,
            skeletonType: {
                small: 'small',
                bijia: 'bijia',
                datubijia: 'datubijia',
                zhexianbijia: 'zhexianbijia',
                half_rank: 'small'
            },
            currIndex: 0,
            showMoreTabFixed: false,
            moreTabOffsetTop: 0,
            nav_list: [],
            cycleStop: false,
            sizeLoading: false,
            firstLoad: false, // 记录商品的初次加载
            splitTimeout: 300, //端装修的商品分类数据假分页数据切片延时加载的时间 单位： ms
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
        },
        parentScrollTop: {
            type: Number,
            default: 0
        },
        isChildren: {
            type: Boolean,
            default: false
        },
        isDecoReady: {}
    },
    components: {
        goodsListWaterfall,
        thumbDecoreRow,
        thumbDecoreBig,
        thumbNormalSmall,
        thumbSkeleton,
        noMoreDataDivider,
        loadingState,
        tabs,
        customTabs
    },
    computed:{
        currNavItem(){
            return this.nav_list[this.currIndex];
        },
        showSkeletonLoading(){
            return this.currNavItem.skeletonLoading; 
        },
        // 一行两个商品拆分
        twoGoodsList() {
            return (goods, type) => {
                let list = []
                goods.forEach((item, index) => {
                    if (index % 2 == type) {
                        list.push(item)
                    }
                })
                return list
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
        // 分类样式
        cateWidthStyle() {
            let style = {}
            if (this.nav_list.length > 3) {
                style.width = '184rpx'
            } else {
                style.flex = 1
            }
            return style
        },
        setImg(){
            return navItem=>{
                let img
                if(navItem.index == this.currIndex){
                    img = navItem.item.imgActivity
                }else{
                    img = navItem.item.img
                }
                return img
            }
        }
    },
    watch: {
        parentScrollTop:{
            handler(val, oldVal){
                //不在初始化时执行，避免多次触发同一事件
                if (oldVal != undefined){
                    this.tabFixed(val)
                }
            },
            immediate: true
        },
        showMoreTabFixed(val, oldVal){
            if (val != oldVal && this.$refs.tab && !this.isChildren){
                this.$emit('addFixed', this.$refs.tab.$el, val)
                this.custEvents.dispatch('addFixed', this.$refs.tab.$el, val)
            }
        },
        decoItem: {
            handler(val){
                if (isNotEmpty(val) && this.isDecoReady){
                    this.initMoreTabData(val);
                }
            },
            deep: true,
            immediate: true
        }         
    },
    mounted() {
        // 监听页面触底事件
        this.custEvents.addListener('reachBottom', () => {
            this.sizeLoading = true
            if (this.hasmore&&this.loadingState!=='loading'&&this.decoProps.sources === 'goodsPool'&&!this.nav_list[this.currIndex].skeletonLoading) {
                this.getGoodsPoolGoods(this.nav_list[this.currIndex]);
            }
        })
    },
    activated() {
        this.goodsPoolFlag = true
        // 只有完成了初次加载，才循环请求控制
        if (this.firstLoad) {
            this.dealCycle(false)
            if(this.decoProps.sources === 'goodsPool'){
                this.getGoodsPoolGoods(this.nav_list[this.currIndex])
            }
        }
    },
    deactivated() {
        this.goodsPoolFlag =false
        this.dealCycle(true)
    },
    methods: {
        /***
         * 处理处理估计图的数量
         * 如果装修的商品数量小于10 骨架图的数量就展示装修的商品数量
         */
        dealNumber(){
            let defaultNumber = 10;
            if(this.decoProps.sources === 'upload'){
                if (this.currNavItem.ids.length < 10){
                    defaultNumber = this.currNavItem.ids.length
                }
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
     
        tabFixed(){

            try {
                let domList = document.querySelectorAll('.sort_title_wrap');
                //todo 目前只支持首页配置一个more_tab组件的情况
                if (domList.length>1){ return }
                let domTop = domList[0].offsetTop;
                if (this.parentScrollTop > domTop&&!!!this.decoItem.props.fixed&&!this.isChildren){
                    this.showMoreTabFixed = true;
                    this.moreTabOffsetTop = domTop;
                } else {
                    this.showMoreTabFixed = false;
                    this.moreTabOffsetTop = 0;
                }
            } catch (error) {
                // console.log('error', error)
                this.showMoreTabFixed = false;
            }
        },

        /**
         * @param {*} isOnce 是否初次触发，手动触发为true 不修改瀑布流中的方法，切换时为 undefined
         */        
        change(item, isOnce){
            if (this.decoProps.sources === 'upload'||this.decoProps.sources === 'goodsPool') {
                !isOnce && this.$refs?.goodsListWaterfall?.$refs?.waterfall.onTabChange()
            }
            this.currIndex = item.index;
            this.tabToTop();

            this.tabChange(item)
            this.$emit('changeTab', item);
        },

        //more_tab切换顶部的导航title之后，每一个下侧的商品没有滚动到顶部的问题优化 优化tab下面的商品这一页刷到底了，到另一个应该是从头开始浏览
        tabToTop(){
            try {
                if (this.moreTabOffsetTop>0){
                    
                    uni.pageScrollTo({
                        scrollTop: this.moreTabOffsetTop,
                        duration: 0
                    });
                        
                }
            } catch (error) {
                        
            }
        },

        /*====================获取各个tab下的数据 start======================= */
        // 初始化 more_tab 装修的数据
        initMoreTabData(data) {
            // 初始化属性信息
            this.decoProps = data.props
            
            if (this.decoProps.sources === 'upload') { // 装修选择的商品，返回装修的数据
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
            // 兼容lazy-load组件，图片懒加载
            // 此uOnReachBottom事件由加载更多时发出，目的是让页面到底时，保证所有图片都进行加载，做到绝对稳定且可靠
            uni.$emit('uOnReachBottom')

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
                
                if(!!this.decoProps.filterNoSubstantialGoods){
                    // 过滤掉非实惠商品
                    list = list.filter(item => goodsHandler.isShowJdLable(item))
                }
                if (this.decoProps.filterNosaleGoods) {
                    list = await this.filterGoodsByAddress(list)
                    this.firstLoad = true
                    tabInfo.goodsList.push(...list); // 先更新渲染的商品数据
                } else {
                    this.firstLoad = true
                    list = await this.updateGoodsByAddress(list) //在pullProdouctPriceMixin中 再更新商品的区域限售和有货无货
                    tabInfo.goodsList.push(...list); // 先更新渲染的商品数据
                }
                
                // 只有查到了数据 再关闭骨架图
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
            // console.log(groupIds);
            goodsHandler.getGoodsPoolGoods(param).then(async res => {
                if (res.state === 200 && res.data) {
                    goodsHandler.handlePrice(res.data.list)
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
                    this.hasmore = this.$checkPaginationHasMore(res.data.pagination)
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
                ::v-deep .u-tabs__wrapper__nav__line{
                    bottom: 0px;
                }
            }
            .sort_title_wrap::-webkit-scrollbar{
              display: none;
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
            .img {
                width: 256rpx;
                height: 256rpx;
                background: var(--emptyImg);
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
        min-height: 600rpx;
        box-sizing: border-box;
    }
    .width100{
        width: 100%;

        .goods_item {
            margin-top: 20rpx;
        }

        ::v-deep .skeleton-wrap {
            margin-top: 20rpx !important;
            .wrap-item {
                margin-top: 20rpx !important;

                &:first-child {
                    margin-top: 0 !important;
                }
            }

            .small-part {
                .wrap-item {
                    margin-top: 0 !important;
                }
            }
        }
    }
    .goods_item_wrap{
        width: 100%;
        min-height: 800rpx;
        display: flex;
    }
    
    .scroll-view {
        width: 100%;
        white-space: nowrap;
    }

    // 分类样式
    .cate3 {
        width: 100%;
        height: 76rpx;
        display: flex;
        overflow-x: auto;
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

        .image-cate-con-box{
            width: 100%;
            position: relative;
            height: 100%;
            text-align: center;
            // font-size: 28rpx;
            // color: #222;
            // background-color: #fff;
            cursor: pointer;
            .img_item{
                min-height: 1px; //为了修复当图片没有加载完成的时候，快速离开，再回来图片加载异常的问题
                width: 100%;
                height: 100%;
                vertical-align: top;
            }
            //为了修复当图片没有加载完成的时候，快速离开，再回来图片加载异常的问题
            ::v-deep uni-image{
                height: auto;
            }
            ::v-deep uni-image > img {
                object-fit: unset;
            }
        }
    }
    // 分类样式
    .cate2 {
        width: 100%;
        height: 76rpx;
        // margin-top: 8rpx;
        display: flex;
        overflow-x: auto;
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

        .image-cate-con-box{
            width: 100%;
            position: relative;
            height: 100%;
            text-align: center;
            // font-size: 28rpx;
            // color: #222;
            // background-color: #fff;
            cursor: pointer;
            .img_item{
                min-height: 1px; //为了修复当图片没有加载完成的时候，快速离开，再回来图片加载异常的问题
                width: 100%;
                height: 100%;
                vertical-align: top;
            }
            //为了修复当图片没有加载完成的时候，快速离开，再回来图片加载异常的问题
            ::v-deep uni-image{
                height: auto;
            }
            ::v-deep uni-image > img {
                object-fit: unset;
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
                color: var(--confirmBtnTextColor);
                background-color: var(--confirmBtnBgColor2);
                border-right: none;
            }

            .oneRow {
                width: 100%;
                height: 100%;
            }
        }
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

            &:first-child {
                padding-right: 10rpx;
            }

            &:last-child {
                padding-left: 10rpx;
            }
        }
    }
</style>
