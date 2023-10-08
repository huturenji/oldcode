<template>
<div class="goodslist-container">
    <div class="search_part">
        <!-- 顶部的搜索栏 -->
        <searchComp  
            @click.native="gotoSearch"  
            ref='searchDom' 
            class='search-content float' 
            :isDisabled="true" 
            @search="searchFun" />
    </div>
    <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <div id='listRecommend' class="list-part">
            <ul class="goods-list">
                <li @click="gotoGoodsDetails(item, index)" class="goods-item" v-for="(item, index) in recommendList" :key="index">
                    <thumb01 
                        :img='item.imagePath'
                        :title='item.name'
                        :price='item.unitPrice'
                        :status='judgeStatus(item)'
                        :hideAddCart='isguest'
                        @addCart='addCart($event, item, index)'
                    />
                </li>
            </ul>
            <div v-if="recommendList && recommendList.length > 0" class="view_more" @click="goGoodsList()">查看更多分类</div>
        </div>
    </mescrollVue>
  

    <!-- 右下加跳转购物车的模块  -->
    <div v-transfer-dom>
       <cartThumb v-show="showCartThumb" v-if="!isguest" ref='cartThumb' @clickCartThumb="clickCartThumb"></cartThumb>
    </div>
</div>
</template>

<script>
import { Popup } from "vux";
import cartThumb from 'commonComp/cartThumb/cartThumb.vue';
import thumb01 from 'commonComp/goodsThumb/thumb01.vue';
import searchComp from 'common/components/search/simpleSearch.vue';
import {ProductStatus, ProductStockStatus} from 'common/lib/enum/productStatusEnum';
import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
import mescrollMixin from 'common/lib/mixin/mescrollMixin';
import AddCartAnimation from 'common/lib/animation/addCart.js';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import extendUtils from 'common/lib/utils';
import shareHandler from 'common/lib/requestHandler/shareHandler.js';
export default {
    mixins: [mescrollMixin, tChatEventMixin],
    data() {
        return Object.assign(extendUtils.stateManager.setData([
            
        ], this), {
            mescrollDown: {//自定义下拉刷新的配置
              use: false
            },
            mescrollUp: {
                auto: true,//不自动加载列表
                loadFull: {
                    use : true,
                },
                empty: {
                    warpId: 'listRecommend',
                    icon: require('themes/default/img/defaultPage/img_defpage_nocontent@2x.png'),
                    tip: '暂无内容'
                },
                htmlNodata: '',
            },
            skus: JSON.parse(this.$route.query.skus) || [],//sku的列表
            recommendTitle: this.$route.query.recommendTitle || '商品列表',//显示的title
            recommendList:[], //推荐的商品列表
            showCartThumb: true, //是否显示推荐页面右下角的购物车icon
            isguest:true,//是否是游客身份
        })
    },
    components: {
        thumb01,
        Popup,
        cartThumb,
        searchComp
    },
    created() {
      this.isguest = 'guest' == extendUtils.getGuestIdentity();
    },

    activated(){
        this.initParam();
         //如果页面是前进过来的，则重新加载；否则保活        
        if(extendUtils.getSession('nextDirection') == 'forward'){ 
            this.initGoodsPage();
        }
        this.setThirdShare();
    },
    beforeRouteLeave(to,from,next){
        shareHandler.cancelBizmateShare();
        next()
    }, 
    deactivated(){
        this.showCartThumb = false;
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
                imgUrl: that.recommendList[0].imagePath||'', // 分享图标,图片绝对地址 
            }
            //设置二次分享
            shareHandler.setThirdShareInfo(shareInfo);
        },        
        initParam(){
            this.showCartThumb = true;
            this.skus = JSON.parse(this.$route.query.skus) || [];
            this.recommendTitle = this.$route.query.recommendTitle || '商品列表';
            //更新title
            document.title = this.recommendTitle;
        },

        /**
         * 初始化分页数据
         */
        initGoodsPage(){
            this.recommendList = [];
            this.mescroll.resetUpScroll();
        },


       initData(){
            const that = this;
            let param = {
                channelId: goodsHandler.channelId,
                sku: that.skus,
                supplierId: goodsHandler.supplierId
            }
            return new Promise((resolve, reject) => {
                goodsHandler.getProductDetail(param).then(res=>{
                    if(res.resultCode == 0 && !!res.result && !!res.result.detail){
                        let list = res.result.detail;
                        if(list.length > 0){
                            //此处过滤掉下架和不在商品池的商品
                            let newList = list.filter(item => {
                                return !ProductStatus[item.state].stopSales && !item.notInPool; 
                            })
                            resolve(newList);
                        }else{
                           resolve([]); 
                        }
                    }
                }).catch(e=>{
                    console.log(e);
                    resolve([]); 
                })
            })
       },
        /**
         * 点击查看更多分类跳转到商品列表
         */
       goGoodsList(){
            this.$router.push({
                path:'/product/list',
                query:{
                    cid1: this.$route.query.categoryId1 || ''
                }
            })
       },

       /**
         * 跳转到搜索页面
         */
        gotoSearch(){
            this.$router.push({
                path:'/search',
                query:{
                    fromIndex:true
                }
            })
        },
       
         /**
         * 批量查询商品售价并对应的赋值给商品详情price字段
         */
        getlistUnitPrice(list){
            return new Promise((resolve, reject) => {
                if(list.length <= 0){ resolve([])};
                let ids = list.map(function(value){
                　　return {
                        sku: value.sku,
                        categoryId1: value.categoryId1 || '',
                        categoryId2: value.categoryId2 || '',
                        categoryId3: value.categoryId3 || '',
                    }
                })
                let param = {
                    spId: list[0].supplierId,
                    businessType: 'COMMODITY',
                    productInfos: ids,
                }
                
                goodsHandler.getlistUnitPrice(param).then(res => {
                    if(res.resultCode == 0 && !!res.result.productPrice && res.result.productPrice.length > 0){
                       let newList = list.map(item=>{
                           let index = res.result.productPrice.findIndex(temp => {
                               return item.sku == temp.sku
                           })
                           if(index > -1){
                               item = Object.assign({}, item, {
                                    unitPrice: res.result.productPrice[index].unitPrice
                               })
                           }
                           return item;
                       })
                       resolve(newList)
                    }
                }).catch(e=>{
                    console.log(e);
                    resolve([])
                })
            })
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
            	"specification": JSON.stringify(item.specification) || '',
                "imageUrl": item.imagePath,
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
            this.initGoodsPage();
        },

        /**
         * 初始化分页数据
         */
        initGoodsPage(){
            this.recommendList = [];
            this.mescroll.resetUpScroll();
        },

       
       /**
       * 根据商品分类id查询B+平台商品列表和详情 mescroll回调
       * @param page 分页对象，由mescroll提供
       * @param mescroll mescroll对象
       */
        async getListData(page, mescroll){
            let that = this;
            try{
                //获取商品详情
                let detailList = await this.initData();

                //查询商品库存，如果无货的话，则过滤掉该商品
                let list = await this.getlistStock(detailList);
             
                //更新商品价格
                this.recommendList = await this.getlistUnitPrice(list);
                try {
                    if(1==page.num){
                        that.setThirdShare();
                    }
                } catch (error) {
                    console.log(error);
                }
                //获取销售属性
                this.getProductSpec(this.recommendList);
                mescroll.endSuccess(this.recommendList.length, false);
            }catch(e){
                console.error(e);
                mescroll.endErr();
            }
        },



         /**
         * 查询该商品的库存数量
         */
		getlistStock(list){
            return new Promise(async (resolve, reject) => {
                if(!!!list || list.length <= 0){ resolve([]) }
                let that = this;

                let addressId = await goodsHandler.getAddressId();
                if(!!!addressId){resolve(list)}; //如果没有地址相关的信息，此时直接resolve原数据
                let addressCodeArr = addressId.split('/');
                let provinceCode = addressCodeArr[0];
                let cityCode = addressCodeArr[1] || '';
                let districtCode = addressCodeArr[2] || '';
                let townCode = addressCodeArr[3] || '';
                
                let stockRequire = this.skus.map(item => {
                    return {
                        sku: item,
                        num: 1,
                    }
                })

                let param = {
                    stockRequire: stockRequire,
                    areaId1: provinceCode,
                    areaId2: cityCode,
                    areaId3: districtCode,
                    areaId4: townCode,
                    supplierId: goodsHandler.supplierId,
                }
                goodsHandler.getlistStock(param).then(res=>{
                    if(res.resultCode == 0 && !!res.result && res.result.stock.length > 0){
                        let stockList = res.result.stock;
                        let newList = list.filter((item, index) => {
                            let one = stockList.findIndex(temp => {
                                return temp.sku == item.sku;
                            })
                            return ProductStockStatus[stockList[one].stockState].hasStocks;
                        })
                        resolve(newList); 
                    }
                }).catch(e=>{ 
                    console.log(e);
                    resolve(list);
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
                    noSale: true,
                    position: 'bottom'
                }
            }
            return stateObj;
        },

 
        /**
         * 根据商品编号去查询商品的销售属性
         */
        getProductSpec(list){
            if(!list || 0 == list.length){
                return
            }            
            const that = this;
            let ids = list.map(function(value){
            　　return value.sku
            })
            let param = {
                sku: ids,
                supplierId:list[0].supplierId
            }
            goodsHandler.getProductSpec(param).then(res=>{
                if(res.resultCode == 0 && res.result){
                    let tempCartList = res.result.spec;
                    that.recommendList = that.recommendList.map(value => {
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
         * 跳转到购物车
         */
        clickCartThumb(){
            this.$router.push({
                path: "/cart"
            })
        },

        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            if(!!this.$route.query.pageFrom && 'share' == this.$route.query.pageFrom){
                extendUtils.goBackPage('');
            }else{
                this.$router.back();
            }
        },
    },

}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/product/list/recommendList.less';
</style>
<style lang='less'>
    @import '~themes/default/styles/components/mescroll.less';
</style>
