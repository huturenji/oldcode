<template>
<div class="goodslist-container">
    <!-- 顶部的搜索和筛选条件 -->
    <div class="top-part" :class="{filterIndex: showfilterPop}">
        <!-- 搜索栏 -->
        <div class="search-box-top">
            <div class="search-after">
                <searchComp @click.native="focusInputFun" :bgColor='searchBgColor' v-model="keyWords"  :showBtn='showBtn'/>
            </div>
            <!-- 列表的切换效果一期先不做，注释掉 -->
            <!-- <i @click="showType01=!showType01" v-if="showType01" class="iconfont iconshuliebiao"></i>
            <i @click="showType01=!showType01" v-else class="iconfont iconliebiao"></i> -->
        </div>

        <!-- 筛选条件 -->
        <div class="filter-option" :class="[showTabShadow?'show-shadow':'']">
            <p @click="selectOption(item, index)" :class="{active: tabIndex == index && !showBrandPop, activeBrand: (item.key == 'brand' && showBrandPop)}" v-for="(item, index) in filterOptionsTitleList" :key="index">
                <span class="option-name" :class="{optionNameBrand:item.key == 'brand'}">{{item.name}}</span>
                <span v-if="item.hasIcon"  class="icon_box" :class="{activeIcon: (item.key == 'brand' && showBrandPop)}">
                    <template v-if="item.key == 'price'">
                        <span class="icon_box_item">
                            <Icon :type="(tabIndex == index && sortType == 'price_asc')?'arrow-up-active':'arrow-up'" :size="item.size" />
                            <Icon :type="(tabIndex == index && sortType == 'price_desc')?'arrow-down-active':'arrow-down'" :size="item.size" />
                        </span>
                    </template>
                    <template v-else>
                        <Icon v-if="(tabIndex == index && !showBrandPop) || (item.key == 'brand' && showBrandPop)"  type='arrow-down-active' :size="item.size"/>
                        <Icon v-else  :type='item.iconName' :size="item.size" />
                    </template>
                    
                </span>
            </p>
        </div>
    </div>
    

    <!-- 下方的商品列表 -->
    <div class="list-part">
        <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
            <div id='productList'>
                <ul v-if="showType01" class="goods-list01">
                    <li @click="gotoGoodsDetails(item, index)" class="goods-item01" v-for="(item, index) in goodsList" :key="index">
                        <thumb01 :img='item.imageUrl'
                            :title='item.name'
                            :price='item.price'
                            :hideAddCart='isguest'
                            @addCart='addCart($event, item, index)'
                        />
                    </li>
                </ul>
                <!-- 当列表为thumb03即单行商品列表的时候，此时有左滑加入收藏的功能 -->
                <ul v-else class="goods-list02">
                    <li @click="gotoGoodsDetails(item, index)" class="goods-item02" v-for="(item, index) in goodsList" :key="index">
                        <swipeout>
                            <swipeout-item :ref='"swipeoutItem" + index' @on-open="handleSwipeoutOpen(index)" :disabled="isguest">
                                <div class="list-thumb03" slot="content">
                                    <div class="item-box">
                                        <thumb03
                                            :img='item.imageUrl'
                                            :title='item.name'
                                            :price='item.price'
                                            :hideAddCart='isguest'
                                            :status='judgeStatus(item)'
                                        >
                                            <button slot='action' class="addCart-icon-section" @click.stop='addCart($event, item, index)' v-if="!isguest">
                                                <span class="cart-icon"></span>
                                            </button>

                                            <template v-if="item.isGoingOn" slot="priceLabel">
                                                <div class="price_lable">活动价</div>
                                            </template>

                                            <template  v-if="item.isPreheat" slot="cutDown">
                                                <div class="cut_wrap">
                                                    <div class="cut_content">
                                                        <div class="text">距活动开始还剩</div>
                                                        <cutDown :deadline="item.marketingStartTime" @cutDownEnded="initGoodsPage" /> 
                                                    </div>
                                                </div>
                                            </template>


                                        </thumb03>
                                    </div>
                                </div>
                                <div slot="right-menu">
                                    <swipeout-button @click.native.stop="addFavoriteFun(item, index)" class="addFavorite">
                                        <p><Icon type='icon_mall_collect2' size=".4"/></p>
                                        <span>移入收藏</span>
                                    </swipeout-button>
                                </div>
                            </swipeout-item>
                        </swipeout>

                    </li>
                </ul>
            </div>
        </mescrollVue>
    </div>

    <!--品牌勾选模块弹窗-->
    <div v-transfer-dom>
        <popup v-model="showBrandPop" position="top">
            <brandListFilter v-model="brandFilterList.children" :showBrandPop="showBrandPop" @closeBrandListPop="closeBrandListPop" :brandSearchType="brandSearchType"></brandListFilter>
        </popup>
    </div>

    <!--筛选模块弹窗-->
    <div v-transfer-dom>
        <popup v-model="showfilterPop" width="85%" position="right" :popup-style={zIndex:800} class="filter-right">
            <filterComp v-model="selectedFilterObj" :showfilterPop="showfilterPop" :brandSearchType="brandSearchType" :brandFilterList="brandFilterList"  @closeFilterListPop="closeFilterListPop" ></filterComp>
        </popup>
    </div>

    <!-- 右下加跳转购物车的模块  -->
    <div v-transfer-dom>
       <cartThumb v-if="$route.name=='productList' && !isguest" ref='cartThumb' @clickCartThumb="clickCartThumb"></cartThumb>
    </div>
</div>
</template>

<script>
import { Popup, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux';
import {ProductActivityStatus} from 'common/lib/enum/productStatusEnum';
import { SnIcon } from 'sinosun-ui';
const searchComp = ()=>import('commonComp/search/simpleSearch.vue');
const cartThumb = ()=>import('commonComp/cartThumb/cartThumb.vue');
const thumb03 = ()=>import('commonComp/goodsThumb/thumb03.vue');
const thumb01 = ()=>import('commonComp/goodsThumb/thumb01.vue');
const loadingComp = ()=>import('commonComp/base/LoadingComp.vue');
const Icon = ()=>import('commonComp/base/Icon.vue');
const cutDown = ()=>import('commonComp/base/cutDown.vue');
const brandListFilter = ()=>import('./filter/brandListFilter/brandListFilter.vue');
const filterComp = ()=>import('./filter/filter.vue');
import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
import activityHandler from 'common/lib/requestHandler/activityHandler.js';
import mescrollMixin from 'common/lib/mixin/mescrollMixin';
import AddCartAnimation from 'common/lib/animation/addCart.js';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import shareHandler from 'common/lib/requestHandler/shareHandler.js';
import extendUtils from 'common/lib/utils';
export default {
    mixins: [mescrollMixin, tChatEventMixin],
    data() {
        return Object.assign(extendUtils.stateManager.setData([
          
        ], this), {
            showBrandPop: false,  //是否显示品牌列表的筛选弹窗变量 因为品牌筛选的弹窗和筛选的弹窗 在回退的时候有偶现的不能回退的问题，故此两处的弹窗没有用stateManager管理
            showfilterPop: false, //是否显示筛选的弹窗变量 因为品牌筛选的弹窗和筛选的弹窗 在回退的时候有偶现的不能回退的问题，故此两处的弹窗没有用stateManager管理
            searchBgColor: '#F5F5F5',
            selectedFilterObj: {}, //选择的筛选所有的选项 对象集合
            keyWords: this.$route.query.keyWords || '', //参数传递的keyWords参数
            cid1: this.$route.query.cid1 || '', //参数传递的分类id,一级分类
            catId: this.$route.query.catId || '', //参数传递的分类Id,只支持三级类目Id
            tabIndex: -1,
            showType01: false, //显示的筛选的商品列表的形态 true代表thumb01（两列的） false代表thumb02（一横排的）
            filterOptionsTitleList: [ //筛选title数据
                {
                    name: '销量',
                    hasIcon: false,
                    iconName: 'icon_common_downarrow',
                    key: 'sales',
                    size:0.12
                },
                {
                    name: '价格',
                    hasIcon: true,
                    iconName: 'arrow-down',
                    key: 'price',
                    size:0.12
                },
                {
                    name: '品牌',
                    hasIcon: true,
                    iconName: 'arrow-down',
                    key: 'brand',
                    size:0.12
                },
                {
                    name: '筛选',
                    hasIcon: true,
                    iconName: 'icon_filter_screen',
                    key: 'filter',
                    size:0.24
                }
            ],
            goodsList: [],// 商品分类下对应的商品列表
            brandFilterList:{
                children:[]
            }, //品牌筛选的单独对象
            sortType: '', //销量排序只支持降序  sale_desc; 价格排序降序price_desc 升序price_asc
            brands: [], //品牌的筛选
            min: '', //价格区间的最小值
            max: '',//价格区间的最大值
            mescrollUp:{
                empty: {
                    warpId: 'productList',
                    icon: require('themes/default/img/defaultPage/img_defpage_noresult@3x.png'),
                    tip: '没有此商品'
                },
                loadFull: {
                    use : true,
                },
            },
            showBtn:false, //商品列表页  搜索栏不显示按钮
            showTabShadow:false,//是否显示tab阴影,
            listDone: false, //代表列表已经加载完成
            brandSearchType: 'single', //是否支持品牌筛选的单选和多选 single代表单选 multiple代表多选 此处是在config.js配置的
            isguest:true,//是否是游客身份
        })
    },
    components: {
        searchComp,
        thumb03,
        thumb01,
        loadingComp,
        Popup,
        Swipeout,
        SwipeoutItem,
        SwipeoutButton,
        brandListFilter,
        filterComp,
        cartThumb,
        Icon,
        SnIcon,
        cutDown
    },
    created() {
        this.isguest = 'guest' == extendUtils.getGuestIdentity();
        this.brandSearchType = this.BMallConfig.SUPPLIER_Map[goodsHandler.supplierId].searchBrand || 'single';
    },
    activated() {
        //如果页面是前进过来的，则重新加载；否则保活        
        if(extendUtils.getSession('nextDirection') == 'forward'){ 
            this.initParam();
            this.initGoodsPage();
        }else{
            //判断是否是点击搜索历史跳转进来的。若是，重新请求数据
            if(extendUtils.getSession('fromSearchHistary') == 'forward'){
                this.initParam();
                this.initGoodsPage();
            }
        }
        this.setThirdShare();
    },
    beforeRouteLeave(to,from,next){
        shareHandler.cancelBizmateShare();
        next()
    },    
    watch:{
        /**
         * 监听右侧弹出框筛选条件的所有筛选的数据
         */
        selectedFilterObj:{
            handler(newVal, oldVal){
                if(Object.keys(newVal).length <= 0){
                    return
                }
                //更新价格的参数
                this.min = newVal.priceRange.minPrice;
                this.max = newVal.priceRange.maxPrice;

                //更新品牌筛选的数据，做到联动效果
                this.brandFilterList = newVal.brandFilterList;

                //处理筛选项品牌标题的文字显示
                this.dealBrandTitle(this.brandFilterList.children);

                //筛选请求数据
                if(Object.keys(oldVal).length > 0){
                    this.initGoodsPage();
                }
            },
            deep: true
        },

        //品牌筛选展示 锁定body滚动
        showBrandPop(val){
            this.scrollBodyLock(val);
        },
        //筛选列表展示 锁定body滚动
        showfilterPop(val){
            this.scrollBodyLock(val);
        }
    },

    methods:{
        /**
         * setThirdShare
         */
		setThirdShare(){
            let that = this;
            //设置第三方（微信、朋友圈等）分享信息
            let location = window.location;
            let locationHref = location.href;
            let appName = that.BMallConfig.SUPPLIER_Map[goodsHandler.supplierId].name+'企业购';
            let callBackUrl = (locationHref.indexOf('channelId')==-1?locationHref+'&channelId='+(goodsHandler.channelId||this.$route.query.channelId||''):locationHref)+'&pageFrom=share';
            let shareInfo = {
                title:'海量商品，等你来挑', // 分享标题 
                desc:'好东西太多了，快来一起挑挑看，点击查看', // 分享描述   
                link:callBackUrl, // 分享链接  
                imgUrl: (!!that.goodsList[0] && that.goodsList[0].imageUrl)||'', // 分享图标,图片绝对地址 
            }
            //设置二次分享
            shareHandler.setThirdShareInfo(shareInfo);
        },
        /**
         *处理筛选项品牌标题的文字显示
         */
        dealBrandTitle(val){
            if(val.length > 0){
                //如果所有的商品均为false 即都没选中的话 将筛选名称更新为‘品牌’
                let flag = val.every(item => {
                    return !item.choosed;
                })
                if(!!flag){
                        //将品牌的筛选标题用选择的品牌名称重新更换为品牌
                    this.changeBrandTitle('品牌');
                    this.brands=[];
                }else{
                    let brandStrArr = [];
                    let brandItemArr = [];
                    val.forEach((item, index) => {
                        if(!!item.choosed){
                            brandStrArr.push(item.name);
                            brandItemArr.push(item);
                        }
                    })
                    this.changeBrandTitle(brandStrArr.join(','));
                    //更新品牌的筛选项
                    this.brands = brandItemArr;
                }
            }else{
                //将品牌的筛选标题用选择的品牌名称重新更换为品牌
                this.changeBrandTitle('品牌');
                this.brands=[];
            }
        },


        /**
         * 加入购物车
         */
        addCart($event, item, index){
            let goods = [{
            	"sku":item.sku,
            	"supplierId":item.supplierId,
            	"quantity":1,
            	"name": item.name || item.wareName,
            	"specification":JSON.stringify(item.specification) || '',
                "imageUrl": item.imageUrl,
                "jdCardCategoryId3": item.categoryId3 || '', //商品的三级分类，该字段目前用来判断实体礼品卡不能加入购物车的
            }]
            //加入购物车的方法在全局混入里面globalMixin.js
            this.setIntoShopCar(goods).then(flag => {
                if(!!flag){ //加入购物车接口返回成功后，再执行动画
                    setTimeout(async ()=>{
                        let cartDom = this.$refs.cartThumb.$el;
                        let animation = new AddCartAnimation(cartDom)
                        //抛物线动画效果
                        await animation.start($event, {offset: {x: 'left',y:'top'}});
                        //+1动画
                        await animation.addNumShow(cartDom);
                    },0)
                }
            }).catch(e => {
                console.error('加入购物车失败====',e);
            });
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
            this.initGoodsPage();
        },
        /**
         * 初始化分页数据
         */
        initGoodsPage(){
            this.showBrandPop = false;
            this.showfilterPop = false;
            this.goodsList = [];
            this.mescroll.resetUpScroll();
        },

        /** 
         * 更新还原筛选的参数
        */
        initParam(){
            extendUtils.removeSession('fromSearchHistary');
            this.selectedFilterObj = {};//清空筛选项
            this.keyWords = this.$route.query.keyWords || '', //参数传递的keyWords参数
            this.cid1 = this.$route.query.cid1 || '', //参数传递的分类id,一级分类
            this.catId = this.$route.query.catId || '', //参数传递的分类Id,只支持三级类目Id
            this.brands = [];
            this.sortType = ''; //销量排序只支持降序  sale_desc; 价格排序降序price_desc 升序price_asc
            this.min = '';  //价格区间的最小值
            this.max = ''; //价格区间的最大值
            this.tabIndex = -1;
        },

       /**
       * 根据商品分类id查询B+平台商品列表和详情 mescroll回调
       * @param page 分页对象，由mescroll提供
       * @param mescroll mescroll对象
       */
        async getListData(page, mescroll){
            let that = this;
            try{
                //获取商品列表
                this.listDone = false;
                let data = await this.searchBpProducts(page, this.catId, this.cid1);
                //获取价格
                let list = await this.getlistUnitPrice(data.hitResult);

                //批量获取活动详情
                let newList = await this.listProductMarketing(list);

                if(newList && newList.length>0){
                    this.goodsList.push(...newList);
                }
                try {
                    if(1==page.num){
                        that.setThirdShare();
                    }
                } catch (error) {
                    console.log(error);
                }
                this.listDone = true;
                //获取销售属性
                this.getProductSpec(list);
                mescroll.endByPage((list && list.length||0), data.pageCount);
            }catch(e){
                console.error(e);
                mescroll.endErr();
            }
        },

        /*********
         * 处理商品列表的筛选的品牌列表
         * 目前只取id和name
         */
        dealBrands(brandsList){
            if(!!!brandsList || brandsList.lenth <= 0){return []}
            return brandsList.map(item => {
                return {
                    id: item.id,
                    name: item.name
                }
            })
        },

        /**
         * 获取商品列表的数据
         */
        searchBpProducts(page, catId, cid1){
            let that = this;
            return new Promise((resolve, reject) => {
                let param = {
                    channelId: goodsHandler.channelId,
                    catId: catId+'',
                    cid1: cid1+'',
                    keyword: this.keyWords,
                    sortType: this.sortType,
                    brandsList: this.dealBrands(this.brands),
                    min: this.min,
                    max: this.max,
                    pageIndex: page.num+'',
                    pageSize: page.size+'',
                }
                if(!!goodsHandler.supplierId){
                    param['supplierId'] = goodsHandler.supplierId
                }
                goodsHandler.getProductList(param).then(res=>{
                    //如果返回结果时切换分类了，则丢弃当前结果
                    if(res.resultCode == 0 && res.result){
                        //更新筛选项列表,只需第一次或者保活的时候更新
                        if(!!res.result.brandAggregate && !!res.result.brandAggregate.brandList && res.result.brandAggregate.brandList.length >= 0 && Object.keys(this.selectedFilterObj).length <= 0){
                            that.selectedFilterObj = that.dealBranListData(res.result.brandAggregate.brandList);
                        }
                        resolve(res.result);
                    }else{
                        resolve();
                    }
                }).catch(e=>{
                    console.log(e);
                    reject();
                })
            })
        },

         /** 
         *  判断商品的上下架状态
         */
        judgeStatus(item){
            if(!item){return {}};
            let stateObj = {};
            if(item.state == 0){//说明商品下架
            stateObj =  {
                noSale: true
            }
            }
            return stateObj;
        },

        /**
         * 根据商品编号去查询商品的价格
         */
        getlistUnitPrice(goodsList){
            if(!goodsList || 0 == goodsList.length){
                return []
            }
            const that = this;
            return new Promise((resolve, reject) => {
                let resList = goodsList;
                let ids = goodsList.map(function(value){
                　　return {
                        categoryId1:value.categoryId1,
                        categoryId2:value.categoryId2,
                        categoryId3:value.categoryId3,
                        sku:value.sku
                    }
                })
                let param = {
                    spId: goodsHandler.supplierId,
                    businessType:'COMMODITY',
                    productInfos: ids,
                }
                goodsHandler.getlistUnitPrice(param).then(res=>{
                    if(res.resultCode == 0 && res.result){
                        let tempCartList = res.result.productPrice;
                        resList = goodsList.map(value => {
                            let index = tempCartList.findIndex(temp => {
                                return temp.sku == value.sku;
                            })
                            if(index > -1){
                                value = Object.assign({}, value, {price:tempCartList[index].unitPrice});
                            }     
                            return value;             　　
                        })
                    }
                    resolve(resList);
                }).catch(e=>{
                    console.log(e);
                    reject();
                })
            })
        }, 
        /**
         * 根据商品编号和channelId批量获取商品的活动信息
         */
        listProductMarketing(goodsList){
            const that = this;
            return new Promise((resolve, reject) => {
                if(!goodsList || 0 == goodsList.length){
                    resolve([]);
                }
                let resList = goodsList;
                let skuList = goodsList.map(function(value){
                　　return value.sku
                })
                let param = {
                    channelId: activityHandler.channelId,
                    skuList: skuList
                }
                activityHandler.listProductMarketing(param).then(res=>{
                    
                    if(res.resultCode == 0 && res.result && res.result.list && res.result.list.length>0){
                        
                        let tempList = res.result.list;
                        resList = goodsList.map(value => {
                            let index = tempList.findIndex(temp => {
                                return temp.sku == value.sku;
                            })
                            if(index > -1){
                                value = Object.assign({}, value, {
                                    isPreheat: ProductActivityStatus[tempList[index].marketingState].isPreheat,
                                    isGoingOn: ProductActivityStatus[tempList[index].marketingState].isGoingOn,
                                    isEnded: ProductActivityStatus[tempList[index].marketingState].isEnded,
                                    marketingStartTime: tempList[index].marketingStartTime,
                                });
                                // 只有当活动进行中的时候，才更新活动价格
                                if(!!value.isGoingOn){
                                    value = Object.assign({}, value, {
                                        price: tempList[index].promotionalPrice,
                                    });
                                }
                            }     
                            return value;             　　
                        })
                    }
                    resolve(resList);
                }).catch(e=>{
                    console.log(e);
                    reject();
                })
            })
        }, 
        /**
         * 根据商品编号去查询商品的销售属性
         */
        getProductSpec(cartList){
            if(!cartList  || 0 == cartList.length){
                return
            }            
            const that = this;
            let ids = cartList.map(function(value){
            　　return value.sku
            })
            let param = {
                sku: ids,
                supplierId:goodsHandler.supplierId
            }
            goodsHandler.getProductSpec(param).then(res=>{
                if(res.resultCode == 0 && res.result){
                    let tempCartList = res.result.spec;
                    that.goodsList = that.goodsList.map(value => {
                        let index = tempCartList.findIndex(temp => {
                            return temp.sku == value.sku;
                        })
                        if(index > -1){
                            value = Object.assign({}, value, {specification:tempCartList[index]});
                        }     
                        return value;             　　
                    })
                }
            }).catch(e=>{
                console.log(e)
            })
        },         
        /**
         * 处理筛选列表数据
         */
        dealBranListData(list){
            if(list.length >= 0){
                list.map(item => {
                    item.choosed = false;
                    return item;
                });//新增choosed字段用来判断是否选择
                return {
                    'brandFilterList': { //品牌筛选项
                        name: '品牌', //筛选标题title
                        selectedName:'全部', //右上角展示的名称
                        showAll: true, //是否显示右上角的全部内容
                        number: 6, //默认显示的数量
                        children: list
                    },
                    'priceRange': { //价格区间筛选对象
                        minPrice: '',
                        maxPrice: '',
                    },
                }

            }
        },

        /**
         * 当显示弹窗的时候需要body的滚动移除
         */
        scrollBodyLock(val){
             document.body.style.overflow = !!val ? 'hidden' : 'auto';
        },

        /**
         * 修改品牌的筛选后，品牌的标题显示名称的方法处理
         */
        changeBrandTitle(name){
            for(let i = 0; i < this.filterOptionsTitleList.length; i++){
                if(this.filterOptionsTitleList[i].key && this.filterOptionsTitleList[i].key == 'brand'){
                    this.filterOptionsTitleList[i].name = name;
                    break;
                }
            }
        },

        /**
         * 跳转商品详情页面
         * @param item 单个的商品详情
         */
        gotoGoodsDetails(item, index){
            this.$router.push(
                {
                    path: '/product/detail',
                    query:{
                        sku: item.sku,
                        supplierId: item.supplierId
                    }
                }
            )
        },

        /**
         * 点击筛选条件后的处理回调
         * @param item 单个的筛选条件项
         */
        selectOption(item, index){
            if(item.key == 'sales' || item.key == 'price'){
                this.tabIndex = index;
                this.showBrandPop = false;
                if(item.key == 'sales'){ //销量的筛选
                    this.sortType = 'sale_desc';
                }else if(item.key == 'price'){ //价格的筛选
                    if(this.sortType == 'price_asc' || this.sortType == 'price_desc'){
                       this.sortType = this.sortType == 'price_asc' ? 'price_desc' : 'price_asc';
                    }else{
                    //this.sortType = 'price_desc';
                    //43736 建议首次改成由低到高
                       this.sortType = 'price_asc';
                    }
                }
                this.initGoodsPage();
            }else if(item.key == 'brand'){ //当等于品牌的时候显示品牌选择的弹窗
                if(!this.listDone){ return }; //当列表数据加载完，才能点击筛选项
                this.showBrandPop = !this.showBrandPop;
            }else if(item.key == 'filter'){ //当是筛选的时候，右侧弹窗弹出筛选的内容
                if(!this.listDone){ return }; //当列表数据加载完，才能点击筛选项
                this.showBrandPop = false;
                this.showfilterPop = true;
            }
        },

         /**
         * 搜索框聚焦的回调
         */
        focusInputFun(){
            this.$router.replace({
                path:'/search',
                query:{
                    fromProductList:true,
                    keyWords:this.keyWords
                }
            })
        },

        /**
         * 关闭品牌列表的弹窗
         */
        closeBrandListPop(){
            this.showBrandPop = false;
        },

        /**
         * 关闭筛选的弹窗
         */
        closeFilterListPop(){
            this.showfilterPop = false;
        },

        /**
         * 跳转到购物车
         */
        clickCartThumb(){
            this.$router.push({
                path: "/cart"
            })
        },

        /***
         * 处理s实现一个swiperout打开其他的会关闭
         * @param chooseIndex 被操作的swipe
         */
        handleSwipeoutOpen(chooseIndex) {
            const that = this;
            if (chooseIndex > -1) {
                that.goodsList.forEach((val, index) => {
                    if (index != chooseIndex && that.$refs['swipeoutItem' + index][0].isOpen == true) {
                        that.$refs['swipeoutItem' + index][0].close();
                    }
                })
            }
        },

        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            //因为品牌筛选的弹窗和筛选的弹窗 在回退的时候有偶现的不能回退的问题，故此两处的弹窗没有用stateManager管理
            if(!!this.showBrandPop){
                this.showBrandPop = false;
            }else if(!!this.showfilterPop){
                this.showfilterPop = false;
            }else if(!!this.$route.query.pageFrom && 'share' == this.$route.query.pageFrom){
                extendUtils.goBackPage('');
            }else{
                this.$router.back();
            }
        },
        /**
         * 加入收藏方法回调
         */
        addFavoriteFun(item){
            if(!!item.sku){
                let skus = [{
                    sku: item.sku,
                    supplierId: item.supplierId,
                }];
                this.addFavorite(skus);//加入收藏的方法在全局globalMixin.js里面
            }else{
                console.log('产品sku错误')
            }
        }
    },

}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/product/list/list.less';
</style>
<style lang='less'>
    @import '~themes/default/styles/components/mescroll.less';
</style>
