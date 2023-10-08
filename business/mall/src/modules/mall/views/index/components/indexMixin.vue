<template>
   
</template>
<script>
  import topTips from './topTips.vue';
  import { TransferDom } from 'vux';
  import Icon from 'commonComp/base/Icon';
  const swiperComp = ()=>import('common/components/swiper/swiperComp.vue');
  const searchComp = ()=>import('common/components/search/simpleSearch.vue');
  import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
  const thumb01 = ()=>import('commonComp/goodsThumb/thumb01.vue');
  const Tab = ()=>import('commonComp/tab/index.vue');
  const brand = ()=>import('./brand.vue');
  const recommendThumb = ()=>import('./recommendThumb.vue');
  import mescrollMixin from 'common/lib/mixin/mescrollMixin';
 
  import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
  import extendUtils from 'common/lib/utils'
  import AddCartAnimation from 'common/lib/animation/addCart.js'
  import changeBannerColorMixin from 'common/lib/animation/changeBannerColor.js'
  import GradientColor from 'common/lib/animation/utils/gradientColor.js'
  import shareHandler from 'common/lib/requestHandler/shareHandler.js';
  
  //动画帧数
  const animationStep = 100;
  //需要动画的组件样式数组。将过渡的中间色分为animationStep份
  const animationColors = {
    searchDom: new GradientColor('rgba(255,255,255,0)', 'rgba(255,255,255,1)', animationStep),
    inputBg: new GradientColor('rgba(255,255,255,0.45)', 'rgb(245, 245, 245)', animationStep),
    inputPlaceHolderColor: new GradientColor('#fff', '#c2c2c2', animationStep),
    searchIcon:new GradientColor('#fff', '#c2c2c2', animationStep),
  }

  //加载cityCodeHandler初始化cityCode组件
  import cityIdHandler from 'common/lib/city/cityIdHandler'; 
  
  export default {
    mixins: [mescrollMixin, tChatEventMixin,changeBannerColorMixin],
    directives: {TransferDom},
    data() {
      let that = this;
      return {
        mescrollDown: {//自定义下拉刷新的配置
          warpId: 'upRefresh',
          warpClass: "mescroll-downwarp white"
        },
        mescrollUp: {
          use: true, //是否应用上拉加载功能
          auto: false,//不自动加载列表
          loadFull: {
            use : true,
          },
        },
        searchTheme: 'transparent',
        productCategories: [], //商品分类列表
        activeIndex: 0,
        activeItem:{},
        goodsList: [], //商品分类下对应的商品列表
        productCategoryId: '', //选中的商品分类的id
        BpProductKeyword: '', //查询的关键字
        swiperOptipns:{}, //swiper的配置
        bgColor: '',//跟随图片变化背景色的变化
        isRefresh: false,//是否是刷新操作
        recommendList: [], //首页推荐列表
        loadedRecommendList: false,//是否加载了好物推荐和品牌列表
        recommendBrandList: [], //首页品牌精选列表
        isPC: extendUtils.isPC(),//区分移动端和PC端
        showGraBg: true, //是否显示banner顶部的渐变块，当在首页推荐页面下滑距离时。此时不显示
        isguest:true,//是否是游客身份
      }
    },
    components: {
      thumb01,
      searchComp,
      Tab,
      topTips,
      swiperComp,
      recommendThumb,
      brand,
      Icon
    },
    async created() {
        let that = this;
      this.bgColor = this.bannerList[0].bgColor;
      this.isguest = 'guest' == extendUtils.getGuestIdentity();
      this.initProductCategories();    
      this.initSwiperOptions(); //初始化swiper的相关配置项
      this.setThirdShare();
    },  

    destroyed(){
      window.onresize = null;
    },
    mounted() {
      
    },
    beforeRouteLeave(to,from,next){
        shareHandler.cancelBizmateShare();
        next()
    },
    async activated(){
      let that = this;

      //页面回来后，重新初始化滚动条的位置。
      try {
        that.onScroll(that.mescroll, 0)     
      } catch (error) {
        
      }  
      //重新初始化更新swiper 
      if(!!that.$refs.swiperCompRef && !!that.$refs.swiperCompRef.swiper){      
        that.$refs.swiperCompRef.resetSwiper();
      }
      
      //重新初始化cityId
      await extendUtils.authInterceptor();
      if(!this.isguest){
          cityIdHandler.init(); //等授权完成后，再去初始化cityId
      }
      that.setThirdShare();
      
    },
    watch:{
      /**
       * 监听分类id，切换的时候初始化产品数据
       */
      productCategoryId:{
        handler(val){
          if(!!val && val != 'indexRecommend'){
            this.initGoodsList();//初始化分页数据
          }else if((!!val && val == 'indexRecommend')){
            // 首页推荐的分类的话锁定上拉加载
            this.lockUpScroll();
            //获取首页推荐分类和品牌列表
            this.getRecommendListAndBrandList();
          }
        },
        immediate: true,
        deep: true
      }
    },
    computed:{
      //是否是首页的推荐分类
      isRecommendIndex(){
        if(!!!this.productCategoryId){
          return true;
        }else{
          return this.productCategoryId == 'indexRecommend';
        }
      },

      isLoop(){
        return this.bannerList.length > 1;
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
            let callBackUrl = locationHref.indexOf('channelId')==-1?locationHref+'&channelId='+(goodsHandler.channelId||this.$route.query.channelId||''):locationHref;
            let shareInfo = {
                title:appName, // 分享标题 
                desc:appName+'，精选商品，企业专享低价，点击查看', // 分享描述   
                link:callBackUrl, // 分享链接  
                imgUrl: location.origin+'/mall/static/shop/assets/img/icon_mall.png'|| '', // 分享图标,图片绝对地址 
            }
            //设置二次分享
            shareHandler.setThirdShareInfo(shareInfo);
        },
      /**
       * 点击栏目
       */ 
      clickTab(index, item){
          this.chageGoodsTypes(index, item);
      },

      /**
       * 变更商品分类
       * @param item 分类对象
       * @param index 分类索引
       */
      chageGoodsTypes(index, item){
        this.dealTabInkBar(item, index);
        this.activeIndex = index;
        this.activeItem = item;
        this.productCategoryId = item.productCategoryId;
      },

      /*****
       * 初始化swiper相关的配置项
       */

      initSwiperOptions(){
        const that = this;
        this.swiperOptipns = {
          from:'index', //该参数用来配置是哪里来的swiper配置 index代表是首页的
         
          autoplay: 2000,
          autoplayDisableOnInteraction : false, 
          observer:true,
          
          observeParents:true,
          grabCursor: true, //设置为true时，鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状。（根据浏览器形状有所不同）
          slidesPerView : 1, //每页显示的数量
          spaceBetween : 20,//slide之间的间距
          updateOnImagesReady: true,
          watchSlidesProgress : true,
          resistanceRatio: 0, //控制两侧的不回弹
          onClick: function (swiper, event) { //次数是为了修复，当loop模式下，轮播的图片点击事件失效的问题
            let dataset = event.target.dataset;
            if(!!dataset && !!dataset.item){
              let item = JSON.parse(dataset.item)
              that.clickBanner(item); //点击banner图片的跳转
            }
          },

          onInit: function(swiper){
             //Swiper初始化了
          },
          onImagesReady: function(swiper){ //所有内置图像加载完成后执行，同时“updateOnImagesReady”需设置为“true’
          
          },
          onProgress: function(swiper, progress){
            that.$nextTick(() => {
              let index = swiper.realIndex;
              that.bgColor = that.bannerList[index].bgColor;
            })
          }

        };
        if(this.isLoop){ //当banner图片数量》=2张的时候 此时需要自动轮播和分页标识
          this.swiperOptipns = Object.assign({}, this.swiperOptipns, {
            pagination: '.swiper-pagination',// 如果需要分页器
            paginationType: 'bullets', //分页器type
            loop: true,
          })
        }
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
       * 点击banner图片的跳转 
       */
      clickBanner(item){
        
        //如果没有path直接返回
        if(!item.path){ return };
        this.$router.push({
            path: item.path,
            query:item.query
        })
      },

      /**
       * 加入购物车
       */
      addCart($event, item, index){
        let that = this;
        let goods = [{
          "sku":item.sku,
          "supplierId":item.supplierId,
          "quantity": 1, //默认数量为1
          "name": item.wareName || item.name,
          "specification": JSON.stringify(item.specification) || '', //产品的规格，颜色等相关的详情以对象的方式传递过去
          "imageUrl": item.imageUrl,
          "jdCardCategoryId3": item.categoryId3 || '', //商品的三级分类，该字段目前用来判断实体礼品卡不能加入购物车的
        }]
        //加入购物车的方法在全局混入里面globalMixin.js
        this.setIntoShopCar(goods).then(flag => {
          if(!!flag){ //加入购物车接口返回成功后，再执行动画
            setTimeout(async ()=>{
              let cartDom = document.getElementById('footerCart');
              let animation = new AddCartAnimation(cartDom)
              //抛物线动画效果
              await animation.start($event);
              //+1动画
              await animation.addNumShow(cartDom);
            }, 0)
          }
        }).catch(e => {
          console.error('加入购物车失败====',e);
        });
      },

      /**
       * 自动控制分类菜单的位置，以及滑动动画 （mescroll组件的回调）
       * @param mescroll mescroll对象
       * @param scrollTop 滚动条滚动的高度
       * @param isUp true向上滑，false向下滑
       */
      onScroll(mescroll, scrollTop, isUp){
        let dom = this.$refs.categories;
        let searchDom = this.$refs.searchDom.$el;
        let topDom = this.$refs.searchBannerContent;
        let listPart = this.$refs.listPart;
        //搜索栏样式随滚动条高度渐变
        let persent = scrollTop  / searchDom.offsetHeight;//当前位移占总位移的百分比，依此算出当前样式进度的百分比
        let currStep = (persent*100).toFixed(0);//百分比转换成颜色组的下标
        currStep = currStep<1 ? 1 : (currStep>100 ? 100 : currStep);//限制下标区间
        let input = searchDom.getElementsByTagName('input')[0];//输入框dom
        let inputPlaceHolder = searchDom.getElementsByClassName('placeholder')[0];//placeholder dom（用div模拟的）
        let searchIcon = searchDom.getElementsByClassName('icon-search')[0];//搜索图标dom
        //根据位移情况来选择颜色的下标
        //1. 如果是无位移，则都是初始化样式
        //2. 如果在位移途中，滚动距离<搜索栏的高度，则搜索栏的样式按百分比渐变（即动画效果）
        //3. 如果滚动距离>=搜索栏的高度，此时动画执行完毕
        //4. 为了防止滚动过程中出现动画未正确结束的情况，当滚动距离>=搜索栏的高度，强制更新样式为终止样式
        //5. 如果滚动距离<搜索栏的高度时，滚动条已到底部，则强制更新样式为终止样式
        let index = 0;
        if(scrollTop<=0){
          //搜索栏浮动，不固定在最上方
          searchDom.classList.add('float');
          searchDom.classList.remove('fixed');
          searchDom.classList.remove('fixed-dom-part');
          index = 0;
        }else {
          //搜索固定页面在最上方
          searchDom.classList.add('fixed');
          searchDom.classList.add('fixed-dom-part');
          searchDom.classList.remove('float');
          //向上滑动时滑动到底部 && 滚动距离>=搜索栏的高度
          if(scrollTop>=searchDom.offsetHeight
            || (isUp && (scrollTop + mescroll.scrollDom.clientHeight == mescroll.scrollDom.scrollHeight))){
            index = animationStep-1;
          }else{
            index = currStep-1;
          }
        }
        //按百分比更新dom样式
        this.styleAinimation(searchDom, 'background', animationColors.searchDom[index]);
        this.styleAinimation(input, 'background', animationColors.inputBg[index]);
        this.styleAinimation(inputPlaceHolder, 'color', animationColors.inputPlaceHolderColor[index]);
        this.styleAinimation(searchIcon, 'color', animationColors.searchIcon[index]);
        // 分类列表随滚动条固定
        if(scrollTop >= searchDom.offsetHeight){
          dom.classList.add('fixed');
          dom.classList.add('fixed-dom-part');
          dom.classList.add('fixed-dom-shadow');
          listPart && listPart.classList.add('float');
          this.showGraBg = false;
        }else{
          dom.classList.remove('fixed');
          dom.classList.remove('fixed-dom-part');
          dom.classList.remove('fixed-dom-shadow');
          listPart && listPart.classList.remove('float');
          this.showGraBg = true;
        }
      },

      /** 
      * 获取首页推荐分类的推荐列表和品牌列表 
      */
      getRecommendListAndBrandList(mescroll){
        this.getRecommendList(mescroll); //初始化首页推荐分类
        this.getRecommendBrandList(); //初始化首页品牌精选
      },

      /**
       * 更新dom样式
       */
      styleAinimation(dom, styleName, styleValue){
        dom.style[styleName] = styleValue;
      },

      /**
       * 变更商品分类
       * @param item 分类对象
       * @param index 分类索引
       */
      chageGoodsTypes(item, index){
        this.dealTabInkBar(item, index);
        this.activeIndex = index;
        this.activeItem = item;
        this.productCategoryId = item.productCategoryId;
      },
      /**
       * 对tab组件下linkbar 加位置控制
       * @param item 分类对象
       * @param index 分类索引
       */
      dealTabInkBar(item, index){
        //先判空
        if(!document.getElementsByClassName('vux-tab-ink-bar').length){
          return false;
        }
        //组件所需
        document.getElementsByClassName('vux-tab-ink-bar')[0].style.right = '100%';
        //item宽度
        let itemWidth = document.getElementsByClassName('vux-tab-item')[index].offsetWidth;
        //item左边距
        let itemLeft = document.getElementsByClassName('vux-tab-item')[index].offsetLeft;
        //边框的宽度
        let borderWidth = document.getElementsByClassName('vux-tab-bar-inner')[0].offsetWidth;
        document.getElementsByClassName('vux-tab-ink-bar')[0].style.left = ((itemLeft+itemWidth/2-borderWidth/2) + 'px');
      },

      /** 
      * 查询首页的推荐列表
      */
      getRecommendList(mescroll){
        let that = this;
        that.$loading.show();
        let param = {
          supplierId: goodsHandler.supplierId,
          channelId: goodsHandler.channelId,
          companyId: goodsHandler.companyId,
          userId: goodsHandler.userId
        };
        goodsHandler.getRecommendList(param).then(res=>{
          that.$loading.hide();
          if(res.resultCode == 0){
            that.recommendList = res.result.recommendProductList;
            that.$nextTick(e=>{
              that.loadedRecommendList = true;
            })
            if(!!mescroll){
              mescroll.endSuccess(that.recommendList.length, false);
              mescroll.endUpScroll(false); //移除无任何数据的空布局
            }

          }
        }).catch(e=>{
            console.log(e);
            that.$loading.hide();
        })
      },

      /** 
      * 查询首页的品牌精选列表
      */
      getRecommendBrandList(){
        let that = this;
        that.$loading.show();
        let param = {
          supplierId: goodsHandler.supplierId,
          channelId: goodsHandler.channelId,
          companyId: goodsHandler.companyId,
          userId: goodsHandler.userId
        };
        goodsHandler.getRecommendBrandList(param).then(res=>{
          that.$loading.hide();
          if(res.resultCode == 0){
            that.recommendBrandList = res.result.recommendBrandList;
          }
        }).catch(e=>{
            console.log(e);
            that.$loading.hide();
        })
      },


      /**
       * 查询B+平台商品分类
       */
      initProductCategories(){
        const that = this;
        that.$loading.show();//全局loading插件
        let param = {
          productCategoryType: 0 //B+平台商品分类类型，0=一级，1=二级，2=三级，默认不填，查询全部分类类型
        }
        if(!!goodsHandler.supplierId){
          param['supplierId'] = goodsHandler.supplierId
        }
        return new Promise((resolve, reject)=>{
          goodsHandler.getCategoryList(param).then(res=>{
            that.$loading.hide();
            if(res.resultCode == 0 && !!res.result){
              //默认显示10个类型
              let tempList = res.result.productCategoryList;
              //只有state为1的分类信息才展示
              let list = tempList.filter(item => {
                return item.state == 1
              })

              //将首页的推荐分类unshift到分类 列表的第一个
              let indexRecommendItem = {
                productCategoryId: 'indexRecommend',//id为indexRecommend
                productCategoryName: '推荐',//name为推荐
              }
              list.unshift(indexRecommendItem)
              
              //首页默认展示10个分类
              that.productCategories = list.slice(0, 10);

              //默认首先显示第一个商品池的信息
              that.productCategoryId = that.productCategories[0].productCategoryId;

              this.$emit('showOff',''); //关闭骨架图
              
              that.removeSimpleDomIndex(); //屏蔽掉首页添加的简单的dom
            }
            resolve();
          }).catch(e=>{
              console.log(e);
              this.$emit('showOff',''); //关闭骨架图
              reject();
              that.$loading.hide();
          })
        })
      },

      //屏蔽掉首页添加的简单的dom
      removeSimpleDomIndex(){
        var bgdomWrap = document.getElementById('htmlBg');
        if(!!bgdomWrap){
          bgdomWrap.style.display = 'none';
        }
      },


      /**
       * 页面刷新入口函数 mescroll刷新回调
       * @param mescroll对象
       */
      re_fresh(mescroll){
        if(!!this.isRecommendIndex){//如果当前分类是推荐
          this.getRecommendListAndBrandList(mescroll);
          this.lockUpScroll();
        }else{
          this.isRefresh = true;
          this.mescroll.resetUpScroll();
        }
      },

      /** 
      * 锁定上拉刷新，推荐分类的时候需要锁定，其他分类的时候打开
      */
      lockUpScroll(){
        if(!!this.mescroll){
          this.mescroll.lockUpScroll(true); //锁定上拉加载 ( isLock=ture,null 锁定 ; isLock=false 解锁 )
          this.mescroll.endUpScroll(false);//结束上拉加载的状态
        }
      },

      /**
       * T信tChatEventRefresh刷新事件回调
       * 在首页注册的T信刷新事件为reload页面
       */
      refreshClearCache(){
        this.clearWebViewCache();
        // reload页面
        if('ios' == extendUtils.getNavigatorType()){
          let currHref = location.href;
          let iosHackStr = 'sswbv_multipage=false'
          let replaceUrl = currHref + (currHref.indexOf('?')>-1 ? '&' : '?') + iosHackStr;
          //如果当前url没有sswbv_multipage=false，就加上，再reload
          if(currHref.indexOf(iosHackStr)==-1){
              location.replace(replaceUrl);
          } 
        }
        window.location.reload(true);
      },

      /**
       * 首页点击右上角的刷新，调取jsbridge清空webview缓存的方法(目前只有安卓T信适用，mpaas版本和ios都没有)
       */
      clearWebViewCache(){
        try {
          extendUtils.ClearWebViewCache();
        } catch (error) {
          console.log(error)
        }
      },

      /**
       * 根据商品分类id查询B+平台商品列表和详情 mescroll回调
       * @param page 分页对象，由mescroll提供
       * @param mescroll mescroll对象
       */
      async getListData(page, mescroll){
        if(this.productCategories.length == 0 || !this.productCategoryId){
          //查询B+平台商品分类
          await this.initProductCategories();
        }    
        try{
          let data = await this.searchBpProducts(page, this.productCategoryId, mescroll);

          this.$emit('showOff',''); //关闭骨架图

          //获取价格
          let list = await this.getlistUnitPrice(data.hitResult, this.productCategoryId);
          //如果是刷新操作，则先清空原数据（刷新loading时没有清空，需要在这里清空）
          if(this.isRefresh){
            this.goodsList = [];
            this.isRefresh = false;
          }
           
          if(list && list.length>0){
            this.goodsList.push(...list);
          }
          //获取销售属性
          this.getProductSpec(list, this.productCategoryId);
          mescroll.endByPage(list.length, data.pageCount);
        }catch(e){
          console.error(e);
          this.$emit('showOff',''); //关闭骨架图
          mescroll.endErr();
        }
        
      },
        /**
         * 根据商品编号去查询商品的价格
         */
        getlistUnitPrice(cartList, productCategoryId){
            if(!cartList || 0 == cartList.length){
                return []
            }            
            const that = this;
            return new Promise((resolve, reject) => {
                let resList = cartList;
                let ids = cartList.map(function(value){
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
                    //如果返回结果时切换分类了，则丢弃当前结果
                    if(productCategoryId != that.productCategoryId){
                        return;
                    }
                    if(res.resultCode == 0 && res.result){
                        let tempCartList = res.result.productPrice;
                        resList = cartList.map(value => {
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
         * 根据商品编号去查询商品的销售属性
         */
        getProductSpec(cartList, productCategoryId){
            if(!cartList || 0 == cartList.length){
                return
            }   
            const that = this;
            let ids = cartList.map(function(value){
            　　return value.sku
            })
            let param = {
                sku: ids,
                supplierId:cartList[0].supplierId
            }
            goodsHandler.getProductSpec(param).then(res=>{
                //如果返回结果时切换分类了，则丢弃当前结果
                if(productCategoryId != that.productCategoryId){
                    return;
                }
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
                console.log(e);
            })
        },
      /**
       * 获取商品列表 mescroll分页回调
       * @param page 分页对象
       * @param productCategoryId 分类id
       */
      async searchBpProducts(page, productCategoryId, mescroll){
          let that = this;
        return new Promise((resolve, reject) => {
            let param = {
                channelId: goodsHandler.channelId,
                cid1:productCategoryId,
                keyword:this.BpProductKeyword,
                pageIndex: page.num+'',
                pageSize: page.size+'',
            }
            if(!!goodsHandler.supplierId){
                param['supplierId'] = goodsHandler.supplierId
            }
            goodsHandler.getProductList(param).then(res=>{
                //如果返回结果时切换分类了，则丢弃当前结果
                if(productCategoryId != this.productCategoryId){
                  return;
                }
                if(res.resultCode == 0 && res.result){
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
       * 初始化分页数据
       */
      initGoodsList(){
        this.goodsList = [];
        this.mescroll.resetUpScroll();
      },

      /**
       * 根据关键字查询筛选商品列表
       * @param searchValue 关键字
       */
      searchFun(searchValue){
        this.BpProductKeyword = searchValue;
        this.initGoodsList();
      },

      /**
       * 跳转商品详情页面
       * @param item 商品对象
       */
      gotoGoodsDetails(item){
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
       * 点击搜索框前面的分类按钮 跳转到分类页面
       */
      gotoGoodsSort(){
        this.$router.push({
          path:'/category'
        })
      },

      /**
       * 首页点击搜索模块的时候跳转到搜索页面
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
       * 点击更多,跳转分类页面
       */
      viewMoreFun(){
        this.$router.push({
          path:'/category'
        })
      },

      refresh(){
        extendUtils.ClearWebViewCache();
        extendUtils.reloadPage();
      },

      /**
       * 注册T信的回退事件
       */
      goBackFun(){
        if(!!this.$route.query.middlePage){
          extendUtils.goBackPage('sswbv_close_browser', null); //如果有中间页的话，无论多少，回退多少步，均关闭webview浏览器（因为申请采购跳转审批，在跳转商城，在跳转申请采购，在跳转商城等等不知道回退多少步数）
        }else{
          //必须>0的正整数，表示回退的页面层及数量。backSteps与url不可同时存在，若同时存在忽略url,使用backSteps,所以此时backSteps传null。
          extendUtils.goBackPage(null, 1);
        }
      }
    },
  }
</script>

