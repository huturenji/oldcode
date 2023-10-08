<template>
    <!--pages/productSearch/productSearch.wxml-->
    <view class="shop_homepage">

        <view class="content">
            <!-- 占位状态栏 start -->
            <!-- #ifdef H5 || APP-PLUS -->
            <view class="fixed_top_status_bar"></view>
            <!-- #endif -->

            <!-- 占位状态栏 end -->
            <!-- 搜索 -->
            <view class="search1" :class="{search1bottom:search1bottom}">
                <view class="search_input">
                    <image :src="imgUrl+'common/icon/shop_list_search.png'"></image>
                    <input focus :placeholder="storeInnerLabelId?$L('搜索店铺内该分类下商品'):$L('搜索店铺内商品')" :value="searchVal" @input="searchInput" @confirm="search" maxlength="100" />
                    <image class="cancel" :src="imgUrl+'common/icon/icon_search_clean.svg'" @tap="cancel" v-if="searchVal != ''" @focus="inputFocus"></image>
                </view>
                <view class="search_text" @tap="search">{{$L('搜索')}}</view>
            </view>

            <!-- 搜索历史 start -->
            <view class="search-item" v-if="history_val && history_val.length && historyShow">
                <view class="search-title">
                    <text>{{$L('搜索历史')}}</text>
                    <view class="del" @click="clearHistoryFun">
                        <image :src="imgUrl+'common/icon/del_search.png'" />
                    </view>
                </view>

                <view class="search-con">
                    <view class="item" v-for="(item,index) in history_display_val" :key="index" @click="btnSearch(item)">{{item}}
                    </view>
                </view>
                <view class="search_drawer" v-if="history_val && history_val.length > history_display_max"
                    @click="searchDrewerOpen=!searchDrewerOpen">
                    <text>{{$L('更多历史搜索')}}</text>
                    <text class="iconfont" :class="searchDrewerOpen ?'icon_arrow_up':'icon_arrow_down'"></text>
                </view>
            </view>
            <!-- 搜索历史 end -->
            <!-- 店铺信息-->
            <view class="shop_des">
                <view class="des_con1'">
                    <!-- 全部商品 -->
                    <view class="all_commodities">
                        <view :class="'all_commodities_nav ' + (searchShow ? 'nav1' : '')" v-if="show">
                            <view class="comprehensive" @tap="commoditiesNav" data-index="0">
                                <text :class="'pre_title ' + (commodNavIdx == 0 ? 'active' : '')">{{$L('综合')}}</text>
                            </view>
                            <view :class="'sales_volume ' + (commodNavIdx == 1 ? 'active' : '')" @tap="commoditiesNav" data-index="1"
                             data-isAscendingOrder="0">{{$L('销量')}}</view>
                            <view class="price" @tap="commoditiesNav" data-index="2">
                                <text :class="'pre_title ' + (commodNavIdx == 2 ? 'active' : '')">{{$L('价格')}}</text>
                                <view class="price_switch">
                                    <image class="xiala_up" :src="commodNavIdx == 2 && isAscendingOrder == 1 ? imgUrl+'common/icon/xiala_up1.png' : imgUrl+'common/icon/xiala_up.png'"></image>
                                    <image class="xiala_down" :src="commodNavIdx != 2 ? imgUrl+'common/icon/xiala_down.png' : commodNavIdx == 2 && isAscendingOrder == 1 ? imgUrl+'common/icon/xiala_down.png' : imgUrl+'common/icon/xiala_down1.png'"></image>
                                </view>
                            </view>
                            <view :class="'sales_volume ' + (commodNavIdx == 5 ? 'active' : '')" @tap="commoditiesNav" data-index="5">{{$L('人气')}}</view>
                            <view class="layout" @tap="layoutSwitch">
                                <image :src="grid_list ? imgUrl+'goods/fenlei1.png' : imgUrl+'goods/fenlei2.png'"></image>
                            </view>
                        </view>
                        
                        <template v-if="productList.length > 0">
                            <view v-show='grid_list' class="goods_list_another flex_row_start_start" >
                                <!-- 竖向的商品瀑布流展示 -->
                                <waterfall ref="waterfallComp" :add-time="0" v-model="productList">
                                    <template v-slot:left="{leftList}">
                                        <!-- 这里编写您的内容，item为您传递给v-model的数组元素 -->
                                        <thumbGoodsV v-for="(item, index) in leftList" :key="index" :goods_info="item" />
                                    </template>
                                    <template v-slot:right="{rightList}">
                                        <thumbGoodsV v-for="(item, index) in rightList" :key="index" :goods_info="item" />
                                    </template>
                                </waterfall>
                            </view>
                            <view v-show='!grid_list' class="goods_list flex_row_start_start">
                                <thumbGoodsH v-for="(item, index) in productList" :goods_info="item" :key='index' />
                            </view>
                            <view class="is_more">{{hasmore ? '数据加载中...' : '数据加载完毕~'}}</view>
                        </template>

                        <view class="no_content" v-if="no_content_product && productList.length == 0">
                            <view class="img"></view>
                            <text>{{$L('暂无任何商品')}}~</text>
                        </view>

                    </view>
                </view>
        
            </view>
            <!-- 确认删除搜索历史的弹窗 -->
            <uni-popup ref="delPopup" type="dialog">
                <uni-popup-dialog type="input" title ="提示" content="确认要清空搜索历史吗?" :duration="2000"  @confirm="confirmDelete()"></uni-popup-dialog>
            </uni-popup>
        </view>
    </view>
</template>

<script module="filters" lang="wxs" src="../../utils/filter.wxs"></script>

<script>
    import {pageUnfilled} from '@/utils/common.js'
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
    import thumbGoodsV from "@/components/goods/thumb/thumb-goods-v.vue";
    import thumbGoodsH from "@/components/goods/thumb/thumb-goods-h.vue";
    import waterfall from "@/components/waterfall/index";
    import goodsHandler from '@/components/goods/handler';
    export default {
        components:{
            uniPopup,
            uniPopupDialog,
            thumbGoodsV,
            thumbGoodsH,
            waterfall
        },
        data() {
            return {
                bid: '',
                vid: '',
                store_list: [],
                searchVal: '',
                //搜索框内的值
                searchList: [],
                show: false,
                // 是否展示历史记录
                historyShow:true,
                // 下边框
                search1bottom:true,
                productList: [],
                //全部商品列表
                current: '1',
                //默认第一页
                pageSize: 10,
                //默认十条
                commodNavIdx: '0',
                //商品列表nav默认第一项
                isAscendingOrder: 1,
                //是否升序
                grid_list: true,
                //是否是两列grid_list布局
                stc_id: '',
                //商品分类id
                stc_name: '',
                //商品分类的名称
                no_more: false,
                //没有更多数据了
                imgUrl: getApp().globalData.imgUrl,
                //图片地址
                hasmore: true,
                //有无更多
                no_content_product: false //没有商品
                    ,
                city_site_open: "",
                searchShow: false,
                storeInnerLabelId: '',
                // 历史搜索
                history_val: [],
                history_display_val: [],
                searchDrewerOpen:false,//搜索历史更多开关
                history_display_max: 9,//搜索历史默认显示数字
                requestLock: false,
            };
        },
        props: {},
        mounted(){
            this.getHistoryList();
            this.vid = this.$Route.query.vid
            if (this.$Route.query.searchVal != undefined && this.$Route.query.searchVal) {
                this.searchVal = this.$Route.query.searchVal
                this.show = true
                this.getProductList();
            }
            if (this.$Route.query.storeInnerLabelId) {
                this.storeInnerLabelId = this.$Route.query.storeInnerLabelId
                this.getProductList();
                this.show = true
            }
            this.$bbcStatEvent({behaviorType:'spv',storeId:this.vid});
        },
        onLoad: function(options) {
            // this.vid = this.$Route.query.vid
            // if (this.$Route.query.searchVal != undefined && this.$Route.query.searchVal) {
            //     this.searchVal = this.$Route.query.searchVal
            //     this.show = true
            //     this.getProductList();
            // }
            // if (this.$Route.query.storeInnerLabelId) {
            //     this.storeInnerLabelId = this.$Route.query.storeInnerLabelId
            //     this.getProductList();
            //     this.show = true
            // }
            // this.$bbcStatEvent({behaviorType:'spv',storeId:this.vid});
        },

        // 加载更多
        onReachBottom(e) {
            if (this.hasmore) {
                this.getProductList();
            }
        },
        watch:{
            history_val: {
                handler: function() {                    
                    if(this.history_val && this.history_val.length> this.history_display_max){
                        this.history_display_val = this.history_val.slice(0, this.history_display_max)                    
                        this.searchDrewerOpen = false
                    }else{
                        this.history_display_val = JSON.parse(JSON.stringify(this.history_val))
                    }
                },
                deep: true
            },
            searchDrewerOpen: {
                handler: function() {
                    if(this.searchDrewerOpen){
                        this.history_display_val = JSON.parse(JSON.stringify(this.history_val))
                    }else{
                        this.history_display_val = this.history_val.slice(0, this.history_display_max)                    
                    }
                },
            },
        },
        methods: {
            // 商品详情
            goods_detail(sku, spu) {
                this.$Router.push({path:'/standard/product/detail',query:{sku,spu}})
            },
            //获取滚动条的当前位置
            onPageScroll: function(e) {
                if (e.scrollTop > 150) {
                    this.searchShow = true
                } else {
                    this.searchShow = false
                }
            },
            go_back() {
                this.$Router.back(1)
            },
            
            //获取历史记录
            getHistoryList() {
                this.vid = this.$Route.query.vid
                let history_data
                // 区分店铺
                if(this.vid){
                    history_data = this.$getStorageSync("his_keyword_"+this.vid)
                }
                if (history_data) {
                    let his_array = history_data.split("~");
                    let last_arr = [];
                    for (var i = 0; i < his_array.length; i++) {
                        !this.$checkSpace(his_array[i]) && last_arr.push(his_array[i]);
                    }
                    this.history_val = last_arr;
                }
            },
            // 显示清除的弹窗
            clearHistoryFun(){
                this.$refs.delPopup.open();
            },
            //清除搜索历史
            confirmDelete() {
                if(this.vid){
                    this.$removeStorageSync("his_keyword_"+this.vid);
                }
                this.history_val = [];
                this.$refs.delPopup.close();
            },
            //设置缓存
            setHistoryData() {
                let {
                    history_val,
                    searchVal
                } = this;
                let tmp_data = [...history_val];
                tmp_data.unshift(searchVal);
                // 最多取15条，不重复且不为空的数据
                // 取消最多15条限制，可以全屏显示
                tmp_data = tmp_data.reduce((a, b) => {
                    (b && a.indexOf(b) == -1) ? a.push(b): null;
                    return a;
                }, [])
                let history_val_str = tmp_data.join('~');
                this.history_val = tmp_data;
                // 区分店铺
                if(this.vid){
                    this.$setStorageSync("his_keyword_"+this.vid, history_val_str)
                }
            },
            //清空搜索输入框内容
            cancel() {
                this.searchVal = '';
                this.searchVal = ''
                this.show = false
                this.current = 1;
                this.getProductList();
            },

            // 获取全部商品列表
            getProductList() {
                if(this.requestLock){
                    return;
                }
                let that = this
                let commodNavIdx = that.commodNavIdx
                let isAscendingOrder = that.isAscendingOrder
                let param = {}
                param.pageIndex = this.current
                param.pageSize = this.pageSize
                // if (that.storeInnerLabelId) {
                //     param.storeInnerLabelId = that.storeInnerLabelId;
                // }
                if (that.searchVal) {
                    param.keyword = that.searchVal;
                }
                if (commodNavIdx == 2) {
                    if (isAscendingOrder == 1) {
                        param.sort = 3
                    } else {
                        param.sort = 4
                    }
                } else {
                    param.sort = commodNavIdx
                }
                param.storeAndSupplierInfos = [{storeId: that.vid,}];
                uni.showLoading()
                this.requestLock = true;
                goodsHandler.search(param).then(res => {
                    this.requestLock = false;    
                    if (res.state == 200) {
                        if (res.data.list.length == 0) {
                            that.no_content_product = true
                            that.productList=[]
                        } else {
                            if (that.current == 1) {
                                // 当是首页的时候，此时需要先更新已经渲染的瀑布流数据
                                that.$refs.waterfallComp && that.$refs.waterfallComp.clear();
                                that.$nextTick(()=>{
                                    that.productList = res.data.list
                                })
                            } else {
                                that.productList = that.productList.concat(res.data.list);
                            }
                            if(pageUnfilled(res.data.pagination, this.pageSize)){
                                this.current++;
                                this.getProductList();
                                return;
                            }
                            let hasmore = this.$hasMoreByPageCount(res.data.pagination); //是否还有数据
                            if (hasmore) {
                                that.current++;
                            }
                            that.hasmore = hasmore
                        }
                        uni.hideLoading();
                    }
                }).catch((e)=>{
                    this.requestLock = false;
                    console.error(e)
                }).finally(()=>{
                    uni.hideLoading();
                })
            },

            //商品列表tab切换
            commoditiesNav(e) {
                //切换时回到页面的顶部
                if (uni.pageScrollTo) {
                    //判断这个方法是否可用
                    uni.pageScrollTo({
                        scrollTop: 0
                    });
                } else {
                    uni.showModal({
                        title: '提示',
                        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                    });
                }
                
                let commodNavIdx = e.currentTarget.dataset.index;
                this.commodNavIdx = commodNavIdx
                this.pn = '1'
                this.current = 1;
                this.productList = [];
                if (commodNavIdx == 2) {
                    this.isAscendingOrder = this.isAscendingOrder == 1 ? '0' : '1'
                }

                this.getProductList();
            },

            //布局切换
            layoutSwitch() {
                this.grid_list = !this.grid_list
            },
            
            inputFocus(){
                this.show=false
                this.searchPn = 1;
            },

            //获取搜索框内的值
            searchInput(e) {
                this.searchVal = e.detail.value
                this.pn = '1'
            },

            //搜索
            search() {
                this.current = 1
                this.show = true
                this.historyShow = false
                this.search1bottom=false
                // this.searchVal = item
                this.getProductList();
                this.setHistoryData()
            },
            //搜索
            btnSearch(item) {
                this.current = 1
                this.show = true
                this.historyShow = false
                this.search1bottom=false
                this.searchVal = item
                this.getProductList();
                this.setHistoryData()
            },

            getmore() {
                let that = this;

                if (!that.flag && that.search_hasmore) {
                    that.search();
                }
            },


        }
    };
</script>
<style>
    .search-item {
        margin-top: 44px;
        padding: 30rpx 28rpx;
        background: #fff;
    }
    .search_drawer{
            display: flex;
            justify-content: center;
            font-size: 24rpx;
            color: #2D2D2D;
            margin-top: 20rpx;
            
        }

    .search_drawer .iconfont {
                font-size: 27rpx;
                color: #c2c2c2;
                margin-left: 4rpx;
            }
    .search-con {
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            
        }
    .search-con .item {
                height: 50rpx;
                padding: 0 18rpx;
                color: #2D2D2D;
                line-height: 50rpx;
                font-size: 24rpx;
                background-color: $bg-color-split;
                border-radius: 25rpx;
                margin-right: 20rpx;
                margin-top: 20rpx;
                max-width: 274rpx;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
            }
    .search-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 48rpx;
            color: #2D2D2D;
            font-size: 28rpx;
            font-weight: bold;

            /* image {
                width: 48rpx;
                height: 48rpx;
            } */
        }

    .search-title image {
        width: 48rpx;
        height: 48rpx;
    }
    /* pages/productSearch/productSearch.wxss */
    page {
        /* width: 100%; */
        height: 100%;
        background: $bg-color-split;
        width: 750rpx;
        margin: 0 auto;
    }

    .shop_homepage {
        width: 750rpx;
    }

    .status_bar {
        height: var(--status-bar-height);
        /* width: 100%; */
        width: 750rpx;
        background: #FFFFFF;

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

    .content {
        /* width: 100%; */
        width: 750rpx;
        /* height: 754rpx; */
        /* background: black; */
        background-size: 100%;
    }

    /* 搜索框 */
    .search {
        width: 750rpx;
        /* width: 100%; */
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 25rpx 0 55rpx;
        box-sizing: border-box;
        position: fixed;
        /* #ifdef APP-PLUS */
        top: var(--status-bar-height);
        /* #endif */
        /* #ifndef APP-PLUS */
        top: var(--titleBarFillHeight, 0px);
        /* #endif */
        z-index: 10;
    }

    .search_input {
        width: 580rpx;
        height: 65rpx;
        display: flex;
        align-items: center;
        padding-left: 20rpx;
        background: rgba(248, 248, 248, 1);
        border-radius: 33px;
    }

    .search_input1 {
        width: 580rpx;
        height: 65rpx;
        background: rgba(255, 255, 255, 1);
        border: 2rpx solid rgba(255, 12, 12, 1);
        border-radius: 33rpx;
    }

    .search_input image {
        width: 30rpx;
        height: 30rpx;
        margin-right: 20rpx;
    }

    .search_input .cancel {
        width: 47rpx;
        height: 47rpx;
    }

    .search input {
        width: 500rpx;
        font-size: 24rpx;
        
        font-weight: 400;
        color: rgba(148, 148, 148, 1);
        line-height: 32rpx;
    }

    .more {
        width: 50rpx;
        height: 50rpx;
    }

    /* 搜索框 */
    /* #ifdef MP-WEIXIN*/
    .search1 {
        /* width: 100%; */
        width: 750rpx;
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 35rpx;
        box-sizing: border-box;
        position: fixed;
        top: 0;
        z-index: 10;
        background: #FFFFFF;
    }

    /* #endif */
    /* #ifdef H5 || APP-PLUS*/
    .search1 {
        /* width: 100%; */
        width: 750rpx;
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 35rpx;
        box-sizing: border-box;
        position: fixed;
        /* #ifdef APP-PLUS */
        top: var(--status-bar-height);
        /* #endif */
        /* #ifndef APP-PLUS */
        top: var(--titleBarFillHeight, 0px);
        /* #endif */
        z-index: 10;
        background: #FFFFFF;
        padding: 0 15rpx 0 0;
    }

    .search1bottom{
        border-bottom:2rpx solid #eee;
    }
    /* #endif */

    .search1 .search_input {
        width: 570rpx;
        height: 65rpx;
        border: 2rpx solid rgba(225, 37, 27, 1);
        border-radius: 33rpx;
        display: flex;
        align-items: center;
        padding-left: 20rpx;
        background: #FFFFFF;
    }

    .search1 .search_input image {
        width: 30rpx;
        height: 30rpx;
        margin-right: 20rpx;
    }

    .search1 .search_input .cancel {
        width: 47rpx;
        height: 47rpx;
    }

    .search1 input {
        /* width: 500rpx; */
        font-size: 24rpx;
        
        font-weight: 400;
        color: rgba(148, 148, 148, 1);
        line-height: 32rpx;
        flex: 1;
    }

    .search1 .search_text {
        font-size: 30rpx;
        
        font-weight: 500;
        color: rgba(45, 45, 45, 1);
        line-height: 32rpx;
    }

    /* 店铺详情 */
    .shop_des {
        width: 100%;
        color: rgba(255, 255, 255, 1);
        /* padding-top: 70rpx; */
        padding-top: 62rpx;
        box-sizing: border-box;
        background-size: 100%;
    }

    .des_top {
        width: 100%;
        height: 449rpx;
    }

    .shop_info {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 31rpx 20rpx 39rpx;
        box-sizing: border-box;
    }

    .info_left {
        width: 100%;
        display: flex;
        align-items: center;
    }

    .info_left .avat {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 16rpx;
    }

    .info_des {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: space-between;
    }

    .info_top {
        display: flex;
        align-items: center;
    }

    .info_top text:nth-of-type(1) {
        font-size: 30rpx;
        
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        line-height: 32rpx;
    }

    .info_top image {
        width: 40rpx;
        height: 40rpx;
        margin-right: 14rpx;
    }
    .goods_list {
        flex-wrap: wrap;
        width: 750rpx;
    }

    .goods_list_another {
        margin-top: 20rpx;
        flex-wrap: wrap;
        width: 750rpx;
    }
    .info_top text:nth-of-type(2) {
        width: 60rpx;
        height: 30rpx;
        background: rgba(252, 28, 28, 1);
        border-radius: 15rpx;
        font-size: 24rpx;
        
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 30rpx;
        text-align: center;
    }

    .info_bot {
        display: flex;
        align-items: center;
        margin-top: 13rpx;
    }

    .info_bot image {
        width: 40rpx;
        height: 40rpx;
        margin-right: 8rpx;
    }

    .info_bot text {
        font-size: 24rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 32rpx;
    }

    .info_right {
        width: 110rpx;
        height: 50rpx;
        background: linear-gradient(-50deg, rgba(252, 28, 28, 1) 0%, rgba(255, 104, 3, 1) 100%);
        box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(252, 28, 28, 0.2);
        border-radius: 25rpx;
        font-size: 26rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .info_right1 {
        width: 110rpx;
        height: 50rpx;
        border: 1rpx solid rgba(255, 255, 255, 1);
        box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(252, 28, 28, 0.2);
        border-radius: 25rpx;
        font-size: 26rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 32rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .select_nav {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .nav_item {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .nav_item image {
        width: 64rpx;
        height: 64rpx;
        margin-bottom: 10rpx;
    }

    .nav_item text {
        font-size: 30rpx;
        
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 32rpx;
    }

    .nav1 {
        position: fixed;
        top: 88rpx;
        z-index: 5;
    }

    .des_con {
        margin-top: -145rpx;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 1);
        border-radius: 15rpx;
        position: absolute;
        z-index: 5;
    }

    .des_con1 {
        margin-top: 0;
        width: 100%;
        height: 100%;
        /* background:rgba(255,255,255,1); */
        background: $bg-color-split;
        border-radius: 15rpx;
        position: absolute;
        z-index: 5;
    }

    .all_commodities {
        width: 750rpx;
        box-sizing: border-box;
        padding-top: 26rpx;
        /* #ifdef APP-PLUS */
        padding-top:  calc(var(--status-bar-height) + 26rpx);
        /* #endif */
        background: $bg-color-split;
        position: absolute;
    }

    .all_commodities_nav {
        /* width: 100%; */
        width: 750rpx;
        height: 90rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 40rpx;
        box-sizing: border-box;
        background: #FFFFFF;
    }

    .comprehensive {
        display: flex;
        align-items: center;
    }

    .comprehensive .pre_title {
        font-size: 28rpx;
        
        color: rgba(45, 45, 45, 1);
        line-height: 32rpx;
    }

    .all_commodities_nav .active {
        font-size: 30rpx;
        
        font-weight: bold;
        color: rgba(243, 30, 30, 1);
        line-height: 32rpx;
    }

    .comprehensive image {
        width: 14rpx;
        height: 9rpx;
        margin-left: 10rpx;
    }

    .sales_volume {
        font-size: 28rpx;
        
        color: rgba(45, 45, 45, 1);
        line-height: 32rpx;
        display: flex;
        align-items: center;
    }

    .price {
        display: flex;
    }

    .price .pre_title {
        font-size: 28rpx;
        
        color: rgba(45, 45, 45, 1);
        line-height: 32rpx;
    }

    .price .active {
        font-size: 30rpx;
        
        font-weight: bold;
        color: rgba(243, 30, 30, 1);
        line-height: 32rpx;
    }

    .price_switch {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: 10rpx;
    }

    .price_switch image {
        width: 14rpx;
        height: 9rpx;
    }

    .price_switch image:nth-child(1) {
        margin-bottom: 5rpx;
    }

    .sales_volume {
        font-size: 28rpx;
        
        color: rgba(45, 45, 45, 1);
        line-height: 32rpx;
    }

    .layout {
        box-sizing: border-box;
        position: relative;
        padding: 0 26rpx 0 0;
        box-sizing: border-box;
    }

    .layout::before {
        content: "";
        width: 1rpx;
        height: 40rpx;
        position: absolute;
        top: 5rpx;
        left: -26rpx;
        background: rgba(187, 187, 187, 1);
    }

    .layout image {
        width: 50rpx;
        height: 50rpx;
    }

    /* 全部商品列表 */
    /* list布局 */
    .list {
        width: 100%;
        width: 750rpx;
        background:$bg-color-split;
        padding:20rpx 20rpx 102rpx;
        box-sizing:border-box;
    }

    .list .list_pre {
        width: 100%;
        background: rgba(255, 255, 255, 1);
        border-radius: 15rpx 0 0 15rpx;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        display: flex;
    }

    .list .pre_img {
        width: 294rpx;
        height: 294rpx;
        border-radius: 15rpx 0 0 15rpx;
    }

    .list .pre_img image {
        width: 294rpx;
        height: 294rpx;
        border-radius: 15rpx 0 0 15rpx;
    }

    .list .pre_des {
        width: 394rpx;
    }

    .time_limited {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .list .pre_des .time_limited_discount {
        /* width:106rpx; */
        padding: 0 11rpx;
        height: 30rpx;
        /* background:linear-gradient(45deg,rgba(255,108,0,1) 0%,rgba(255,192,83,1) 100%); */
        border-radius: 15rpx;
        font-size: 22rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 18rpx;
    }

    .list .list_pre .des_desc {
        margin-top: 43rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .list .list_pre .des_info {
        font-size: 24rpx;
        
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
        width: 310rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 35rpx;
        margin-top: 20rpx;
    }

    /* grid网格布局 */
    .all_commodities_list {
        background: $bg-color-split;
        padding: 20rpx 20rpx 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        box-sizing: border-box;
        width: 750rpx;
    }

    .product1 {
        margin-top: 90rpx;
    }

    .all_commodities_list .list_pre {
        width: 345rpx;
        /* height:590rpx; */
        background: rgba(255, 255, 255, 1);
        border-radius: 15rpx;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        padding-bottom: 20rpx;
    }

    .all_commodities_list .list_pre:nth-of-type(2n) {
        margin-right: 0;
    }

    .all_commodities_list .list_pre .pre_img {
        width: 345rpx;
        height: 345rpx;
        border-radius: 15rpx;
    }

    .all_commodities_list .list_pre .pre_img image {
        width: 345rpx;
        height: 345rpx;
        border-radius: 15rpx 15rpx 0 0;
    }

    .all_commodities_list .pre_des {
        padding: 20rpx;
        height: 272rpx;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .list .list_pre .pre_des {
        padding: 20rpx 0 20rpx 20rpx;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .list_pre .des_name {
        width: 310rpx;
        font-size: 28rpx;
        
        font-weight: 500;
        color: rgba(45, 45, 45, 1);
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        font-weight: bold;
    }

    .all_commodities_list .list_pre .des_info {
        font-size: 24rpx;
        
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
        width: 310rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 39rpx;
        margin-top: 9rpx;
    }

    .discount {
        display: flex;
    }

    .list_pre .time_limited_discount {
        /* width:106rpx; */
        padding: 0 11rpx;
        height: 30rpx;
        /* background:linear-gradient(45deg,rgba(255,108,0,1) 0%,rgba(255,192,83,1) 100%); */
        border-radius: 15rpx;
        font-size: 22rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 39rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 15rpx;
    }

    .all_commodities_list .list_pre .des_desc {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 31rpx;
    }

    .list_pre .des_desc .commodity_price {
        font-size: 34rpx;
        
        font-weight: 500;
        color: rgba(252, 28, 28, 1);
        font-weight: bold;
    }

    .commodity_price {
        font-size: 34rpx;
        
        color: rgba(252, 28, 28, 1);
        line-height: 32rpx;
        font-weight: bold;
    }

    .commodity_price text:nth-child(1),
    .commodity_price text:nth-last-child(1) {
        font-size: 22rpx;
    }

    .list_pre .des_desc .salenum {
        font-size: 22rpx;
        
        font-weight: 500;
        color: rgba(153, 153, 153, 1);
    }

    /* 无商品 */
    .no_content {
        margin: 167rpx auto;
        width: 750rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .no_content .img {
        width: 256rpx;
        height: 256rpx;
        background: var(--emptyImg);
        background-size: 100% 100%;
    }

    .no_content text {
        font-size: 28rpx;
        color: #999999;
    }

    .no_more {
        padding-bottom: 105rpx;
        color: #BBBBBB;
        font-size: 28rpx;
        z-index: 5;
        text-align: center;
        background: #F8F8F8;
    }

    /* 加载更多，没有更多 */
    .is_more {
        /* width: 100%; */
        width: 750rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22rpx;
        color: #999999;
        line-height: 22rpx;
        margin: 10rpx 0 30rpx;
        background: $bg-color-split;
    }

    .top_w_b {
        height: 34rpx;
        width: 34rpx;
        margin: 0 0 0 10rpx;
        display: block;
    }
    
</style>
