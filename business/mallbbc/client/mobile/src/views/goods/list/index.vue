<template>
    <view class="content">
        <view class="fixed_top_status_bar"></view>
        <view class="top_part" ref="topPart">
            <!-- 搜索头部分 start -->
            <view class='sea_input_part'>
                <!-- #ifndef MP-WEIXIN-->
                <text v-if="false" class="back_icon iconfont icon_arrow_left" @click="navBack"></text>
                <!-- #endif -->
                <view class="search_center" @click="e=>search()">
                    <text class="iconfont icon_search"></text>
                    <input disabled class='sea_input' type='text' :value="searchParams.keyword"
                        :placeholder="$L('请输入关键词')"/>
                    <image v-if='searchParams.keyword' class='clear_content' v-show="searchParams.keyword"
                        :src="imgUrl+'common/icon/icon_search_clean.svg'" @click.stop="clearInput" />
                </view>
            </view>

            <!-- 搜索头部分 end -->

            <!-- 头部搜索nav start -->
            <!--排序有问题，暂不放开 v-if='false'-->
            <view class="navbar" @click="hideBrandMask">
                <view class="top flex_row_between_center">
                    <view class="nav-item" :class="{current: !filterType}" @click="tabClick()">
                        <text>{{$L('综合推荐')}}</text>
                    </view>
                    <!-- <view class="nav-item" :class="{current: filterType.startsWith('price')}" @click="tabClick('price')" v-if="curStoreItem.key!=='JD'">
                        {{$L('价格')}}
                        <view class='icons'>
                            <text class="iconfont icon_arrow_up_fill" :class='{active: filterType == "price_asc"}'></text>
                            <text class="iconfont icon_arrow_up_fill reverse" :class='{active: filterType == "price_desc"}'></text>
                        </view>
                    </view> -->
                    <view class="nav-item" :class="{current: filterType.startsWith('sale')}" @click="tabClick('sale')">
                            {{$L('销量')}}
                    </view>
                    <view class="nav-item brand_title" @click.stop="showBrandMask" :class="{active:showBrandMaskFlag,selected:selectBrandText && selectBrandText.length>0 && !showBrandMaskFlag}">
                        <text v-if="selectBrandText && selectBrandText.length>0" :class="{red:!showBrandMaskFlag}" class="selected_brand_title title">{{selectBrandText.join(',')}}</text>
                        <text v-else class="title">{{$L('品牌')}}</text>
                        <text class="iconfont icon_arrow_up_fill reverse" :class='{active: selectBrandText && selectBrandText.length>0 && !showBrandMaskFlag}'></text>
                    </view>
                    <view class="nav-item">
                        <view class="cate_icon" :class="{row_two:gridFlag}" @click="tabShowStyle"></view>
                    </view>
                </view>

                <!--  todo 放开排序，仍屏蔽筛选：2022/8/1 v-if='false' -->
                <template v-if='false'>
                    <view class="nav-item default" v-if="showStoreList">
                        <text>{{$L('筛选')}}</text>
                        <text class="filter_icon iconfont icon_filter_fill"></text>
                    </view>
                    <view v-else class="nav-item" @click="toggleCateMask('show')">
                        <text>{{$L('筛选')}}</text>
                        <text class="filter_icon iconfont icon_filter_fill"></text>
                    </view>
                    <text v-if="showStoreList" class="cate_item iconfont icon_list  default"></text>
                    <text v-else
                        :class="{cate_item:loadingState, iconfont:loadingState, icon_category:gridFlag,icon_list:!gridFlag,grid_icon:gridFlag}"
                        @click="tabShowStyle"></text>
                </template>

            </view>
        </view>
        <!-- 头部搜索nav end -->

        <view
            v-if="loaded && goodsList.length==0"
            class="empty_part flex_column_start_center" :style='{marginTop: emptyTop+"px"}'>
            <view class='empty_content'>
                <view class="imgWrap"></view>
                <text>{{$L('暂无数据')}}</text>
            </view>
        </view>

        <!-- 联盟相关的商品列表 -->
        <template>
            <scroll-view v-if='goodsList && goodsList.length>0' enable-flex class="goods_part" @scroll="listScroll" :scroll-top="listScrollTop" 
            scroll-y @scrolltolower='getMoreData'>
                <view v-if='gridFlag' class="goods_list_another flex_row_start_start">
                    <!-- 竖向的商品瀑布流展示 -->
                    <waterfall ref="waterfallComp" :addTime="0" v-model="goodsList">
                        <template v-slot:left="{leftList}">
                            <!-- 这里编写您的内容，item为您传递给v-model的数组元素 -->
                            <thumbSearchSmall v-for="(item, index) in leftList" :key="index" :goodsItem="item" />
                        </template>
                        <template v-slot:right="{rightList}">
                            <thumbSearchSmall v-for="(item, index) in rightList" :key="index" :goodsItem="item" />
                        </template>
                    </waterfall>
                </view>
                <view v-else class="goods_list flex_row_start_start">
                    <thumbSearchRow v-for="(item,index) in goodsList" :goods_info="item" :key='index'/>
                </view>
                <loadingState v-if="loadingState != 'first_loading' && goodsList.length > 0" :state='loadingState' />
            </scroll-view>
        </template>

        <!-- 品牌列表弹窗 -->
        <view class="brand-mask" v-if="showBrandMaskFlag" @click="closeBrandMask" :style="{top:topPartHeight+'px'}">
            <view class="brand_list">
                <view class="brand_list_con">
                    <scroll-view enable-flex scroll-y class="cate-list" v-if="brandList && brandList.length>0">
                        <view class="cate-list-row flex_row_start_center">
                            <view v-for="(item,index) in brandList" :key="index" class="brand_name flex_row_start_center" :class="{sel:tempselectBrandList.findIndex(val => val.brandId == item.brandId)>-1}"
                            @click.stop="selBrandNew(item.brandId, item.brandName)">
                                <view class="select_icon" v-if="tempselectBrandList.findIndex(val => val.brandId == item.brandId)>-1"></view>
                                <text>{{item.brandName}}</text>
                            </view>
                        </view>
                    </scroll-view>
                </view>
                <view class="operate_btn flex_row_center_center">
                    <view class="btn reset flex_row_center_center" @click.stop="reset">{{$L('重置')}}</view>
                    <view class="btn confirm flex_row_center_center" @click.stop="confirm">{{$L('确认')}}</view>
                </view>
            </view>
        </view>

        <!-- 页面悬浮的购物车按钮-->
        <template v-if="!disabledModule">
            <!-- <cart :decoItem="{props: {}}"></cart> -->
        </template>
        <!-- 页面悬浮的返回顶部按钮-->
        <template v-if="showBackTop">
            <scrollto @scrollToTop="scrollToTop"></scrollto>
        </template>
    </view>
</template>
<script module="filters" lang="wxs" src="@/utils/filter.wxs"></script>
<script>
    import {pageUnfilled, isNotEmpty, getViewportInfo, isH5} from '@/utils/common.js'
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    import thumbSearchRow from "@/components/goods/thumb/thumb-search-row.vue";
    import thumbSearchSmall from "@/components/goods/thumb/thumb-search-small.vue";
    import loadingState from "@/components/loading/loading.vue";
    import waterfall from "@/components/waterfall/index";
    import scrollto from '@/components/decorate/scrollto/scrollto.vue';
    // import cart from '@/components/decorate/cart/cart.vue';
    
    import { mapState, mapGetters } from 'vuex';
    import taskLock from '@/utils/taskLock/index.js';
    import goodsHandler from '@/components/goods/handler';
    export default {
        components: {
            thumbSearchRow,
            thumbSearchSmall,
            loadingState,
            waterfall,
            uniPopup,
            scrollto
        },
        data() {
            return {
                imgUrl: getApp().globalData.imgUrl,
                source: '', //页面来源（从哪个页面进入的），如果是搜素页，点击该页顶部搜素的时候会返回上级页面，否则会跳转
                searchParams: {
                    brandId: [], //选中的品牌，多选
                    categoryIds: '', //选中的分类
                    lowPrice: '', //筛选的最低价
                    highPrice: '', //筛选的最高价
                    attribudeId: '',
                    keyword: '',
                    skus: '',
                    cateId: ''
                }, //搜索的参数
                stopPullDownRefresh: false, //是否下拉刷新中
                filterType: '',//排序条件，不用null，避免空指针判断
                cateList: [], //分类列表
                brandList: [], //品牌列表
                goodsList: [],
                loadingState: 'first_loading',
                pageSize: 20,
                current: 1,
                loading: false, //是否加载数据
                hasMore: true, //是否还有数据
                gridFlag: true, // 是否为瀑布流展示
                store_list: [],
                store_info: {
                    pageSize: 20,
                    current: 1,
                    hasMore: false
                },
                showStoreList: false,
                attributeList: [], //商品属性列表
                cateFlag: 'up',
                brandFlag: 'up',
                selectCateText: '', //已选分类名称
                selectBrandText: [], //已选品牌列表
                keyword: '',
                showAddressPop: false, //控制地址右侧弹窗的变量
                showAddressAnimate: false, //控制地址弹窗显示的动画
                choosedAddress: {}, //选中的地址
                store: 1, //仅看有货的筛选条件 仅看有货=1， 全部商商品=0
                showBackTop: false,//是否显示返回顶部按钮
                showBackTopHeight: '',//显示返回顶部按钮的最小高度，100为tabbarg高度和顶部搜索栏高度
                listScrollTop: 0,
                oldScrollTop: 0, 
                lastScrollTop:0,//页面离开前最后的滚动高度
                tabMode: 'column',
                switchTabMode: true, //是否可以切换顶部店铺列表的tab 默认是true 可以切换
                storeId: -1, //店铺id 搜索页面通过url参数传过来的，默认是全网比价的店铺id 联盟枚举里面全网比价的店铺id是-1
                storeAndSupplierInfos: [], //店铺id和对应的供应商关系
                showStoreTabs: true, //是否展示顶部的店铺列表
                onceLock: new taskLock.Once(),
                isPC: isH5() ? SnUtils.isPC() : false,
                loaded:false, //商品列表接口是否请求完成
                sortType: {//排序方式
                    price: {
                        asc: 'asc',
                        desc: 'desc'
                    }, 
                    sale: {
                        desc: 'desc'
                    }
                },
                allowSetScroll:true,//允许滚动事件触发
                seletedSortType: '',// 选中的排序类型
                showBrandMaskFlag:false, //是否显示品牌列表弹窗
                tempselectBrandTextList:[], //仅做显示的选中品牌名列表
                tempselectBrandList:[], //仅做显示的选中品牌列表
                topPartHeight:0
            };
        },
        async created() {
            if (this.$Route.query.keyword) { //关键词
                this.searchParams.keyword = decodeURIComponent(this.$Route.query.keyword)
            }
            if (this.$Route.query.skus) { //关键词
                this.searchParams.skus = decodeURIComponent(this.$Route.query.skus)
            }
        
            if (this.$Route.query.categoryIds) { //接受分类
                this.searchParams.categoryIds = this.$Route.query.categoryIds;
                if (!this.$Route.query.source) { //如果是优惠券进来的分类，不调取筛选条件中的品牌等
                    this.getcateList(this.$Route.query.categoryIds);
                }
            }
            if (this.$Route.query.brandId) { //品牌id
                this.searchParams.brandId = decodeURIComponent(this.$Route.query.brandId)
            }
        
            
            if (this.$Route.query.storeId) { //店铺id
                this.storeId = decodeURIComponent(this.$Route.query.storeId)
            }


            try {
                if (this.$Route.query.storeAndSupplierInfos) { //店铺id
                    this.storeAndSupplierInfos = JSON.parse(decodeURIComponent(this.$Route.query.storeAndSupplierInfos));
                    if(this.storeAndSupplierInfos && this.storeAndSupplierInfos.length == 1){ //只有当前其数组长度为1时，默认选中当前店铺
                        this.storeId = this.storeAndSupplierInfos[0].storeId;
                    }else{
                        this.storeId = -1; //默认全网比价的店铺id是-1
                    }
                } else if(this.$Route.query.storeId) {
                    // 从优惠券跳转来，对商品进行店铺筛选，暂时只考虑一家店铺
                    this.storeAndSupplierInfos = [
                        { storeId: this.$Route.query.storeId }
                    ];
                }
            } catch (error) {
                this.storeAndSupplierInfos = [];
                this.storeId = -1; //默认全网比价的店铺id是-1
            }

            // console.log('this.storeAndSupplierInfos', this.storeAndSupplierInfos);
            

            try {
                let showStoreTabs  = this.$Route.query.showStoreTabs.toString();
                this.showStoreTabs = showStoreTabs == 'false' ? false : true;
            } catch (error) {
                //没有配置showStoreTabs参数，默认不展示店铺列表
                this.showStoreTabs = false;
            }
            // 等待地址获取
            await this.addressPromise;
            //这里加锁，是为了防止第一页的补页和翻页同时执行，导致同时查询第二页
            this.onceLock.exec(async () => {
                await this.getShopList();
                this.onceLock.release('productListScroll')
            }, 'productListScroll')    
            // 获取店铺列表
        },
        mounted() {
            this.initTopHeight(); //初始化页面指定的高度
            
        },

        computed:{
            ...mapState(['addressPromise', 'defaultAddress']),
            ...mapGetters(['disabledModule'])
        },
        //下拉刷新
        onPullDownRefresh() {
            this.current = 1;
            this.stopPullDownRefresh = true; //下拉刷新状态
            this.getGoodsList();
        },
        beforeRouteLeave(to, from, next) {
            //离开页面时记住滚动高度
            this.allowSetScroll = false;
            this.lastScrollTop = this.oldScrollTop;
            next();
        },
        onShow(){
            this.allowSetScroll = true;
        },
        activated(){
            //再次进入页面时恢复高度，兼容部分设备异常的将滚动区域高度变为0的问题
            this.$nextTick(() => {
                setTimeout(() => {
                    //高度加1兼容scrollview设置高度无效的问题
                    this.listScrollTop = this.lastScrollTop+1;
                    this.oldScrollTop = this.lastScrollTop+1;
                }, 0);
            }); 
        },
        methods: {
            async initTopHeight(){
                try {  
                    let { height } = await getViewportInfo();
                    //显示返回顶部按钮的最小高度，100为tabbarg高度和顶部搜索栏高度
                    this.showBackTopHeight = height - 100;
                } catch (error) {
                    
                }
            },
            getGoodsList(type, filter=[]) {
                let that = this;
                return new Promise(async resolve => {
                    //处理属性选择
                    let attributeInfo = []
                    this.attributeList.map(item => {
                        if (item.select_list.length > 0) {
                            item.select_list.map(item => {
                                attributeInfo.push(item)
                            })
                        }
                    })
                    let param = {};
                    param.pageSize = this.pageSize;
                    param.pageIndex = this.current;
                    isNotEmpty(this.filterType) && (param.sort = this.filterType);
                    param.stockFilter = this.store; //仅看有货的筛选
                    //获取渠道配置信息，确认是否查询比价数据
                    let channelOptions = await window.getChannelOptions;
                    if(!!this.defaultAddress.provinceCode){ //地址的筛选
                        param.provinceCode = this.defaultAddress.provinceCode;
                        param.cityCode = this.defaultAddress.cityCode;
                        param.districtCode = this.defaultAddress.districtCode;
                        param.townCode = this.defaultAddress.townCode;
                    }else{
                        //当没有地址的时候，此时仅看有货重置成0
                        param.stockFilter = 0;
                    }
                    if (this.searchParams.categoryIds) {
                        param.categoryIds = (this.searchParams.categoryIds+'').split(',').map((item)=>{return parseInt(item)})
                    }
                    if (this.searchParams.cateId) {
                        param.categoryIds = (this.searchParams.cateId+'').split(',').map((item)=>{return parseInt(item)})
                    }
                    // if (attributeInfo.length > 0) {
                    //     param.attributeInfo = attributeInfo.join(',')
                    // }
                    if (this.searchParams.highPrice) {
                        param.max = this.searchParams.highPrice
                    }
                    if (this.searchParams.lowPrice) {
                        param.min = this.searchParams.lowPrice;
                    }
                    
                    if(this.searchParams.lowPrice&&this.searchParams.highPrice){
                        if (Number(this.searchParams.lowPrice) > Number(this.searchParams.highPrice)) {
                            let tmp = this.searchParams.lowPrice
                            this.searchParams.lowPrice = this.searchParams.highPrice
                            this.searchParams.highPrice = tmp
                            param.max = this.searchParams.highPrice
                            param.min = this.searchParams.lowPrice
                        }
                    }else if(!this.searchParams.lowPrice&&this.searchParams.highPrice){
                        delete this.searchParams.lowPrice
                    }else if(this.searchParams.lowPrice&&!this.searchParams.highPrice){
                        delete this.searchParams.highPrice
                    }
                    
                    if (this.searchParams.keyword) {
                        param.keyword = this.searchParams.keyword
                    }
                    
                    if(this.storeAndSupplierInfos.length >= 1){ //此时说明全网比价有其他的筛选条件
                        param.storeAndSupplierInfos = this.storeAndSupplierInfos;
                    }
                    
                    if (this.searchParams.brandId.length) {
                        param.brandInfoVOList = this.searchParams.brandId;
                    }
                    if (this.loadingState == 'first_loading'){
                        uni.showLoading({mask:false});
                    }
                    this.loaded = false;
            
                    this.loadingState = this.loadingState == 'first_loading' ? this.loadingState : 'loading';
                    goodsHandler.search(param).then(async res => {
                        // 切换排序条件时，防止串数据
                        if(this.seletedSortType != '' && type != this.seletedSortType){
                            resolve();
                            return;
                        }

                        if(JSON.stringify(filter) != JSON.stringify(this.searchParams.brandId)){
                            resolve();
                            return;
                        }

                        if (res.state == 200) {
                            goodsHandler.handlePrice(res.data.productVOPageVO.list)
                            if (!isNotEmpty(this.searchParams.brandId) && res.data.brandInfoVOList!=null) {
                                this.brandList = res.data.brandInfoVOList;
                            }
                            if (this.current == 1) {
                                // 当是首页的时候，此时需要先更新已经渲染的瀑布流数据
                                that.$refs.waterfallComp && that.$refs.waterfallComp.clear();
                                await that.$nextTick();
                                this.goodsList = res.data.productVOPageVO.list;
    
                            } else {
                                this.goodsList = this.goodsList.concat(res.data.productVOPageVO.list);
                            }
                            if(pageUnfilled(res.data.productVOPageVO.pagination, this.pageSize)){
                                this.current++;
                                if(this.goodsList.length>0){
                                    this.loadingState = 'allow_loading_more';
                                }
                                //如果这页没查到数据，则不要隐藏loading
                                if(isNotEmpty(this.goodsList)){
                                    uni.hideLoading();
                                }
                                await this.getGoodsList(this.seletedSortType, this.searchParams.brandId);
                                resolve();
                                return;
                            }
                            this.hasMore = this.$hasMoreByPageCount(res.data.productVOPageVO.pagination); //是否还有数据
                            if (this.hasMore) {
                                this.current++;
                                this.loadingState = 'allow_loading_more';
                            } else {
                                this.loadingState = 'no_more_data';
                            }

                            
                        } else {
                            //错误提示
                            this.loadingState = '';
                        }
                        if (this.stopPullDownRefresh) {
                            this.stopPullDownRefresh = false;
                            uni.stopPullDownRefresh();
                        }
                        this.loaded = true;
                        uni.hideLoading();
                        resolve();
                    }).catch((e)=>{
                        this.loaded = true;
                        uni.hideLoading();
                        resolve();
                        console.error(e)
                    }).finally(()=>{
                        //不要在这里关闭loading，会导致补页时loading闪烁
                    })
                })
            },

            //加载更多事件
            getMoreData() {       
                // 兼容lazy-load组件，图片懒加载
                // 此uOnReachBottom事件由加载更多时发出，目的是让页面到底时，保证所有图片都进行加载，做到绝对稳定且可靠
                uni.$emit('uOnReachBottom')
                if (this.hasMore) {
                    this.onceLock.exec(async () => {
                        await this.getGoodsList(this.seletedSortType, this.searchParams.brandId);
                        this.onceLock.release('productListScroll')
                    }, 'productListScroll')
                }

            },
            //切换页面展示风格  
            tabShowStyle() {
                this.gridFlag = !this.gridFlag;
            },

            //筛选点击
            tabClick(type) {

                // 保存当前选中排序类型
                this.seletedSortType = type;
                
                //动态给filterType赋值
                let sortTypeObj = this.sortType[type];
                let filterType = '';
                if(isNotEmpty(type) && isNotEmpty(sortTypeObj)){
                    let sortKeys = Object.keys(sortTypeObj);
                    let sortTypeLength = sortKeys.length;
                    if(sortTypeLength == 1){
                        filterType = type + '_' + sortTypeObj[sortKeys[0]]
                    }else if(sortTypeLength == 2){
                        let currSort = this.filterType.split('_')[1]
                        let newSortIndex = sortTypeObj[sortKeys[0]] == currSort ? 1 : 0
                        filterType = type + '_' + sortTypeObj[sortKeys[newSortIndex]]
                    } 
                }
                
                //排序无变化则不处理
                if(this.filterType == filterType){
                    return;
                }
                this.filterType = filterType;

                //根据筛选条件重新请求
                this.loadingState = 'first_loading';
                this.goodsList = [];
                this.current = 1;
                this.getGoodsList(type, this.searchParams.brandId);
            },

            //获取店铺列表
            getShopList() {
                return new Promise(resolve => {
                    let param = {};
                    param.pageSize = this.store_info.pageSize;
                    param.current = this.store_info.current;
                    goodsHandler.getStoreList(param).then(async res => {
                        if (res.state == 200) {
                            if (this.store_info.current == 1) {
                                this.store_list = res.data.list;
                            } else {
                                this.store_list = this.store_list.concat(res.data.list);
                            }
                            await this.$nextTick()
                            this.topPartHeight = this.$refs.topPart.$el.offsetHeight + window.titleBarHeight;
                            //获取店铺列表之后 再获取商品列表 防止商品列表搜索的时候，没有传storeId
                            await this.getGoodsList();
                        }
                        resolve()
                    }).catch(e => {
                        console.error(e);
                        resolve();
                    })
                })
            },

            //点击顶部搜索事件
            search(keyword=this.searchParams.keyword, forward='replace') {
                uni.hideLoading();
                this.$Router[forward]({
                    path: '/pages/search/search',
                    query: {...this.$Route.query, 'showStoreList': this.showStoreTabs,'keyword':encodeURIComponent(keyword)} //此处需要整合showStoreList参数是因为，搜索页面需要该参数来判断商品列表是否需要展示店铺列表，保持重复搜索显示店铺列表一致的问题
                })
            },
            navBack() {
                this.$Router.back(1)
            },
            // 选择品牌：这种方式是只有点击确定才会更新，否则会保持上一次确认的结果
            selBrandNew(id, name) {
                let tmp_data = this.tempselectBrandList;
                let index = tmp_data.findIndex(item => item.brandId==id);
                if (index > -1) {
                    //选中的话取消选中
                    this.tempselectBrandList.splice(index, 1);
                    this.tempselectBrandTextList.splice(index, 1);
                } else {
                    this.tempselectBrandList.push({brandId:id,brandName:name});
                    this.tempselectBrandTextList.push(name);
                }
            },
            // 品牌选择重置
            reset() {
                this.tempselectBrandList = [];
                this.tempselectBrandTextList = [];
            },
            // 品牌选择确定
            confirm() {
                this.showBrandMaskFlag = false
                this.searchParams.brandId = JSON.parse(JSON.stringify(this.tempselectBrandList));   
                this.selectBrandText = JSON.parse(JSON.stringify(this.tempselectBrandTextList));
                this.loadingState = 'first_loading';
                this.goodsList = [];
                this.current = 1;
                this.getGoodsList(this.seletedSortType,this.searchParams.brandId);
            },
            // 显示品牌列表弹窗
            showBrandMask() {
                this.showBrandMaskFlag = !this.showBrandMaskFlag;
                this.tempselectBrandList = JSON.parse(JSON.stringify(this.searchParams.brandId));
                this.tempselectBrandTextList = JSON.parse(JSON.stringify(this.selectBrandText));
            },
            hideBrandMask() {
                this.showBrandMaskFlag = false;
                this.tempselectBrandList = JSON.parse(JSON.stringify(this.searchParams.brandId));
                this.tempselectBrandTextList = JSON.parse(JSON.stringify(this.selectBrandText));
            },
            // 关闭品牌列表弹窗
            closeBrandMask() {
                this.showBrandMaskFlag = false;
            },   

            //根据二级分类获取三级分类
            getcateList(id) {
                goodsHandler.getCategoriesAndBrands({
                    categoryId: id
                }).then(res => {
                    if (res.state == 200) {
                        if (res.data.categoryList != null) {
                            this.cateList = res.data.categoryList;
                            // this.cateList.map(item => {
                            //     if (item.categoryId == this.searchParams.categoryIds) {
                            //         // this.selectCateText = item.categoryName
                            //     }
                            // })
                        }
                        if (res.data.brandList != null) {
                            // this.brandList = res.data.brandList;
                        }

                        if (res.data.attributeList != null) {
                            this.attributeList = res.data.attributeList;
                            this.attributeList.map(item => {
                                this.$set(item, 'select_list', [])
                                this.$set(item, 'select_text_list', [])
                                this.$set(item, 'showFlag', 'up')
                                this.$set(item, 'showLimit', 6)
                            })
                        }
                    } else {
                        this.$api.msg(res.msg);
                    }
                }).catch((e) => {
                    //异常处理
                })
            },

            //清空输入框的值
            clearInput(e) {
                this.search('', 'push')
            },

            listScroll({detail}){
                if(this.allowSetScroll){
                    this.oldScrollTop = detail.scrollTop;
                    this.showBackTop = detail.scrollTop > this.showBackTopHeight; 

                    //页面滑动切换联盟tabs切换的样式
                    if(!!this.switchTabMode){ //是否可以切换tab风格 默认是true
                        this.tabMode = detail.scrollTop<=0 ? 'column' : 'row';
                    }
                }
            },
            scrollToTop(){
                this.listScrollTop = this.oldScrollTop;
                this.$nextTick(() => {
                    this.listScrollTop = 0
                });
            },

        },
    }
</script>

<style lang="scss" scoped>
    page,
    .content {
        background: $bg-color-split;
        display: flex;
        flex-direction: column;
        width: 750rpx;
        flex: 1;
        margin: 0 auto;
    }

    .content{
        overflow: hidden;
    }

    uni-page-body {
        display: flex;
        height: 100%;
    }
    .sea_input_part {
        position: relative;
        display: flex;
        align-items: center;
        height: 88rpx;
        background-color: #fff;
        width: 750rpx;
        padding-right: 30rpx;
        margin: 0 auto;
        /* #ifdef APP-PLUS  */
        top: var(--status-bar-height);

        /* #endif */
        .back_icon {
            padding-left: 20rpx;
        }

        .sea_input {
            flex: 1;
            height: 65rpx;
            font-size: 28rpx;
            color: #333;
        }

        .search_center {
            display: flex;
            align-items: center;
            border: none;
            flex: 1;
            height: 68rpx;
            margin-left: 30rpx;
            padding-left: 20rpx;
            border-radius: 20rpx;
            background-color: #f2f5f8;
            .icon_search {
                font-size: 32rpx;
                margin-right: 8rpx;
                color: #999;
            }
        }

        .clear_content {
            width: 28rpx !important;
            height: 28rpx !important;
            margin-right: 20rpx !important;
        }
    }

    .top_part {
        border-radius: 0 0 16rpx 16rpx;
        z-index: 9;
    }

    .navbar {
        position: relative;
        margin: 0 auto;
        width: 750rpx;
        background: #fff;
        z-index: 10;
        .top {
            height: 72rpx;
            padding: 0 64rpx;
        }

        .nav-item {
            $paddingTop: 12rpx;
            $paddingBottom: 24rpx;

            flex: none;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 60rpx;
            line-height: 36rpx;
            font-size: 26rpx;
            color: #666666;
            position: relative;
            cursor: pointer;
            &.brand_title {
                width: fit-content;
                min-width: 156rpx;
                max-width: 302rpx;
                padding: 0 24rpx;
                height: 60rpx;
                line-height: 60rpx;
                border-radius: 34rpx;
                &.active {
                    height: 74rpx;
                    border-radius: 34rpx 34rpx 0px 0px;
                    background: #eff2f5;
                }
                &.selected {
                    color: var(--tagColor);
                }
                .selected_brand_title { 
                    white-space:nowrap;
                    overflow:hidden ;
                    text-overflow: ellipsis;
                    &.red {
                        font-weight: bold;
                        color: var(--tagColor);
                    }
                }
                .title {
                    margin-right: 8rpx;
                }
                .reverse {
                    font-size: 12rpx;
                    transform: rotate(180deg);
                    &.active {
                        color: var(--tagColor);
                    }
                }
            }
            .icons{
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                transform: scale(0.5);
                color: #c2c2c2;
                .iconfont {
                    font-size: 24rpx;
                    line-height: normal;
                    &.active {
                        color: var(--listFilterActiveColor);
                    }
                    &.reverse{
                        transform: rotate(180deg);
                    }
                }
            }

            .filter_icon {
                font-size: 24rpx;
                margin-left: 9rpx;
                transform: scale(0.8, 0.8);
                margin-top: 6rpx;
            }

            &.current {
                color: var(--tagColor);
                font-weight: bold;
            }
            .cate_icon {
                width: 32rpx;
                height: 32rpx;
                background: url('@/static/shared/common/icon/btn_common_yihang.svg') center/100% no-repeat;
                &.row_two {
                    background: url('@/static/shared/common/icon/btn_common_xiaotu.svg') center/100% no-repeat;
                }
            }
        }

        .cate_item {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 32rpx;
            width: 32rpx;
            position: relative;
            font-size: 40rpx;
            color: #666;

            &.grid_icon {
                font-size: 28rpx;
            }

        }
    }

    .goods_part {
        flex: 1;
        max-width: 750rpx;
        transition: all .3s;
        padding: 0 20rpx;
        overflow: auto;

        //覆盖组件内的margin
        ::v-deep .goods_h_item:first-of-type{
            margin-top: 20rpx;
        }

        ::v-deep .waterfall .goods_item:first-of-type{
            margin-top: 20rpx !important;
        }
    }

    .goods_list {
        flex-wrap: wrap;
        width: 100%;
    }

    .goods_list_another {
        flex-wrap: wrap;
        width: 100%;
        #left-column{
            .goods_item{
                margin: 10rpx 10rpx 10rpx 0;
            }
        }
        #right-column{
            .goods_item{
                margin: 10rpx 0rpx 10rpx 10rpx;
            }
        }
    }

    /* 分类 */
    .brand-mask {
        position: fixed;
        left: 0;
        right: 0;
        margin: 0 auto;
        // top: calc(var(--window-top) + var(--titleBarFillHeight, 0px) + 240rpx);
        bottom: 0;
        width: 750rpx;
        background: rgba(0, 0, 0, 0.5);
        z-index: 95;
        transition: .3s;
        overflow: hidden;
        .brand_list {
            min-height: 376rpx;
            max-height: 952rpx;
            padding: 18rpx 30rpx 48rpx;
            background: linear-gradient(180deg,#eff2f5 1%, #eff2f5);
            border-radius: 0 0 20rpx 20rpx;
            .brand_list_con {
                min-height: 218rpx;
                height: calc(100% - 92rpx);
                max-height: 794rpx;
                .cate-list {
                    height: 100%;
                    max-height: 794rpx;
                    .cate-list-row {
                        flex-wrap: wrap;
                        .brand_name {
                            width: 50%;
                            height: 64rpx;
                            padding-right: 32rpx;
                            font-size: 26rpx;
                            
                            text {
                                flex: 1;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                -webkit-box-orient: vertical;
                                word-break:break-all;
                            }
                            .select_icon {
                                width: 32rpx;
                                height: 32rpx;
                                margin-right: 10rpx;
                                background: var(--checkedImg);
                                background-size: 100% 100%;
                            }
                            &.sel {
                                color: var(--tagColor);
                                font-weight: bold;
                            }
                        }
                    } 
                }
            }
            .operate_btn {
                margin-top: 12rpx;
                .btn {
                    flex: 1;
                    height: 80rpx;
                    font-weight: bold;
                }
                .reset {
                    border: 1px solid var(--confirmBtnBgColor2);
                    color: var(--confirmBtnBgColor2);
                    font-size: 32rpx;
                    border-radius: 40rpx 0 0 40rpx;
                }
                .confirm {
                    background: var(--confirmBtnBgColor2);
                    color: var(--confirmBtnTextColor);
                    border: 1px solid var(--confirmBtnBgColor2);
                    border-left: 0px;
                    border-right: 0px;
                    font-size: 32rpx;
                    border-radius: 0 40rpx 40rpx 0;
                }
            }
        }
    }

    .cate-list {
        height: calc(100vh - var(--titleBarFillHeight) - 100rpx);
        .part {
            padding: 30rpx;
            background: #fff;
            // &.part4{
            //     min-height: 630rpx;
            // }

            .title {
                // margin-bottom: 10rpx;

                .left {
                    color: $main-font-color;
                    font-size: 28rpx;
                    font-weight: bold;
                }

                .iconfont {
                    font-size: 24rpx;
                    transform: rotate(90deg);
                    -ms-transform: rotate(90deg);
                    color: #c2c2c2;
                    /* IE 9 */
                    -webkit-transform: rotate(90deg);

                    /* Safari and Chrome */
                    &.up {
                        -webkit-animation: moveUp 0.6 ease-in-out 0.2s forwards;
                    }

                    &.down {
                        -webkit-animation: moveDown 0.6 ease-in-out 0.2s forwards;
                    }

                    @-webkit-keyframes moveUp {
                        0% {
                            -webkit-transform: rotate(90deg);
                        }

                        100% {
                            -webkit-transform: rotate(360deg);
                        }
                    }

                    @-webkit-keyframes moveDown {
                        0% {
                            -webkit-transform: rotate(360deg);
                        }

                        100% {
                            -webkit-transform: rotate(495deg);
                        }
                    }
                }
            }
        }
    }

    .empty_part {
        flex: auto;
        position: relative;
        width: 100%;

        .empty_content{
            display: flex;
            flex-direction: column;
            align-items: center;
            position: absolute;
            top: 39%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .imgWrap {
            width: 256rpx;
            height: 256rpx;
            background: var(--searchEmptyImg);
            background-size: 100%;
        }

        text {
            color: $main-third-color;
            font-size: 28rpx;
        }

        button {
            width: 245rpx;
            height: 66rpx;
            background: rgba(252, 28, 28, .05);
            border-radius: 33rpx;
            color: $main-color;
            font-size: 30rpx;
            font-weight: bold;
            margin-top: 29rpx;
        }

        uni-button:after {
            border-radius: 200rpx;
            border-color: #fff;
        }
    }

    .fixed_top_status_bar {
        position: fixed;
        /* #ifdef APP-PLUS */
        height: var(--status-bar-height);
        /* #endif */
        /* #ifndef APP-PLUS */
        height: 0;
        /* #endif */
        top: 0;
        left: 0;
        right: 0;
        z-index: 99;
        background: #fff;
    }

    .default {
        color: #dddddd !important;
    }

    .default .iconfont {
        color: #dddddd !important;
    }
</style>
