<template>
    <div ref="activity" :class="{noscroll:noscroll}">
        <div ref='outPageWrap' class="activityOutWrap" @scroll="outPageWrapScroll" :style="bgStyle">
            <div class="activityWrap">
                <render-engine 
                    v-model="activityDetail.pageInfo" 
                    @addCart="addCart"
                    @clickGoodsThumb="gotoGoodsDetails"
                    @getTabOffsetTop="getTabOffsetTop"
                    @viewMore="activityBackHome"
                    @tabChange="tabChange"
                    :timeBefore="timeBefore"
                    :timeEnd="timeEnd"
                    :state="activityDetail.marketingState"
                ></render-engine>

                <!-- <renderEngine 
                    v-model="activityDetail.pageInfo" 
                    @addCart="addCart"
                    @clickGoodsThumb="gotoGoodsDetails"
                    @getTabOffsetTop="getTabOffsetTop"
                    @viewMore="activityBackHome"
                    @tabChange="tabChange"
                    :timeBefore="timeBefore"
                    :timeEnd="timeEnd"
                    :state="activityDetail.marketingState"
                ></renderEngine> -->
            </div>
            
            

            <!--提前加入购物车，活动开始后可快人一步抢到好货！活动还未开始的时候，底部展示-->
            <div v-if="showNoStartTips && showBottomTips" class="not_strat_tips fixed-dom-partTips">
                <div class="icon icon1">
                    <Icon type='icon_shangyun_common_inform' size=".72" />
                </div>
                <div class="text_tips">提前加入购物车，活动开始后可快人一步抢到好货！</div>
                <div @click="showBottomTips=false" class="icon icon2">
                    <Icon type='icon_common_close' size=".36" />
                </div>
            </div>
           
        </div>
        <template v-if="showThumb">
            <!-- 右下加跳转购物车的模块  -->
            <cartThumb v-if="!isguest" class="activityCartThumb" ref='cartThumb' @clickCartThumb="clickCartThumb"></cartThumb>
            <div class="activityBackHome" @click="activityBackHome"></div>
        </template>

       
    </div> 
</template>

<script>
    import { Tab, TabItem, TransferDom, Popup } from 'vux';
    const Icon = ()=>import('common/components/base/Icon.vue');
    const emptyPage = ()=>import('commonComp/base/emptyPage.vue');
    const loadingComp = ()=>import('commonComp/base/LoadingComp.vue');
    import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
    import activityHandler from 'common/lib/requestHandler/activityHandler.js';
    const thumb01 = ()=>import('commonComp/goodsThumb/thumb01.vue');
    const cartThumb = ()=>import('commonComp/cartThumb/cartThumb.vue');

    import {discountGoods,activityGoods,activityRule,discount,markingPriceDate,employeePrice} from 'common/lib/enum/activitysGoods';
    import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
    import AddCartAnimation from 'common/lib/animation/addCart.js'
    import extendUtils from 'common/lib/utils'

    import shareHandler from 'common/lib/requestHandler/shareHandler.js';
    // import renderEngine from './renderEngine/index';

    export default {
        directives: {TransferDom},
        mixins: [tChatEventMixin],
        components: {
            thumb01,
            Tab,
            TabItem,
            emptyPage,
            Popup,
            Icon,
            loadingComp,
            cartThumb,
            // renderEngine
            
        },
        data() {
            let that = this;
            return Object.assign(extendUtils.stateManager.setData([
                
            ], that), {

                activityGoodsDate:activityGoods,//内购商品列表二维
                isPC: extendUtils.isPC(),//区分移动端和PC端

                tabOffsetTop:0,//tab栏距离文档顶部的距离

                scrollTop:0,//页面滚动高度
                outPageScrollTop:0,//页面跳转出去时页面的滚动高度
                noscroll:false,//二级页面展开时页面禁止滚动
    
                fromHome:false,//是否从首页跳转过来

                isguest:true,//是否是游客身份

                marketingId: this.$route.query.marketingId, //获取活动id
                activityDetail: {}, //活动详情对象
                timeBefore: false, //是否在活动开始时间之前
                timeEnd: false,//是否在活动结束时间之前
                showBottomTips: true, //是否展示底部未开始的提示
                showThumb: false, //是否展示底部的回到首页 去购物车图标
            })
        },
        async created() {
            this.isguest = 'guest' == extendUtils.getGuestIdentity();
            this.setThirdShare();
        },
        beforeRouteLeave(to,from,next){
            shareHandler.cancelBizmateShare();
            next()
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                if('/home'==from.path || from.path.indexOf('index')>-1){
                    vm.$refs.outPageWrap.scrollTop = 0;
                    vm.scrollTop = 0;
                    vm.outPageScrollTop = 0;
                    // 从首页进来的话移除顶部定位的tab
                    vm.$nextTick(()=>{
                        try {
                            let tabDom = document.getElementsByClassName('tabs_wrap')[0];
                            tabDom.classList.remove('tab_fixed');
                            tabDom.classList.remove('fixed-dom-part');
                        } catch (error) {
                            
                        }
                    })
                    vm.fromHome = true;
                }
            })
        },        
        destroyed(){
        },
        mounted() {
        
        },
        activated(){
            let that = this;
            // 初始化title 因为该页面保活了，当从该页面跳转到其他页面再回来时，此时title没有更新，为了title更新，新增了该方法
            that.initTitle();
            //初始化活动详情
            this.initDate();
            try {
                setTimeout(() => {
                    this.$nextTick(()=>{
                        //判断前进后退再来处理保活问题
                        if(!that.fromHome){
                            that.$refs.outPageWrap.scrollTop = that.outPageScrollTop;
                        }
                        that.fromHome = false;
                    })
                }, 0);
            } catch (error) {
            }            
        },
        watch:{
            
        },
        computed:{
           showNoStartTips(){
              try {
                  return this.activityDetail.marketingState == 'NOT_STARTED';
              } catch (error) {
                  return false;
              }
           },
            bgStyle(){
                try {
                    let bgConfig = this.activityDetail.pageInfo[0].data.bgConfig;
                    if(bgConfig.use == 'color'){
                        return {
                            background: bgConfig.color
                        }
                    }else if(bgConfig.use == 'url'){
                        return {
                            backgroundImage: `url(${bgConfig.url})`,
                            backgroundPosition: 'top center',
                            backgroundRepeat: 'repeat-y',
                            backgroundSize: '100% auto',
                        }
                    }else{
                            return {
                                background: '#fff'
                            }
                    }
                } catch (error) {
                        return {
                            background: '#fff'
                        }
                }
            }
        },
        methods:{
            /**
            * 页面元素滚动
            */
            outPageWrapScroll(){
                let that= this;
                var scrollTop = that.$refs.outPageWrap.scrollTop;
                that.scrollEvent(scrollTop);
            },    
            
            // 初始化当前的title
            initTitle(){
                if(Object.keys(this.activityDetail).length>0){
                    this.activityDetail.pageInfo[0].data.title = '';
                }
            },
     
            /** 
             *  页面初始化,通过活动id获取活动详情
             */
            initDate(){
                let that= this;
                that.showThumb = false;
                //通过活动id marketingId获取相关的活动数据
                that.marketingId = that.$route.query.marketingId;
                
                let param = {
                    marketingId: this.marketingId,
                }
                that.$loading.show();
                activityHandler.getMarketingDetail(param).then(res=>{
                    that.$loading.hide();
                    if(!!res && res.resultCode == 0 && res.result){
                        let item = res.result;
                        that.activityDetail = that.detailData = Object.assign({}, item, {
                            pageInfo: item.pageInfo ? JSON.parse(item.pageInfo) : [],
                        });
                        that.showThumb = true;
                        that.judgeTime();   
                        // 获取京东供应商价格，即京东app上面展示的价格
                        that.getSupplierPrice(that.activityDetail.marketingSkuInfos);               
                    }
                    // console.log('that.activityDetail', that.activityDetail)
                }).catch(e=>{
                    that.$loading.hide();
                    console.log(e)
                })
            },

            
            // 获取供应商价格，目前是京东的 并更新
            getSupplierPrice(skusList){
                if(!!!skusList || skusList.length <= 0){return}
                const that = this;
                let ids = [];
                skusList.forEach(element => {
                    !!element.sku && ids.push(element.sku)
                });
                let param = {
                    skuList: ids
                }
                goodsHandler.getSupplierPrices(param).then(res=>{
                    if(res.resultCode == 0 && res.result && res.result.length>0){
                        let list = res.result;
                        try {  
                            let tabList = that.activityDetail.pageInfo[0].data.tabList.data;
                            for (let i = 0; i < tabList.length; i++) {
                                let item = tabList[i];
                                if(item.goodsList && item.goodsList.length > 0){
                                    for (let j = 0; j < item.goodsList.length; j++) {
                                        let index = list.findIndex(k => {
                                            return k.sku == item.goodsList[j].sku;
                                        })
                                        if(index > -1 && list[index].price && list[index].price > 0){
                                            item.goodsList[j] = Object.assign({}, item.goodsList[j], {
                                                supplierPrice: list[index].price
                                            })
                                        }
                                    }
                                
                                }                                
                            }
                            // 强制更新从京东查到的最新的京东app上显示的价格
                            that.$forceUpdate();
                        } catch (error) {
                            console.log(error);
                        }
                        
                    }
                }).catch(e=>{
                    console.log(e);
                })
            },

            // 通过判断活动时间，处理商品thumb01上面显示即将开始还是已经结束
            judgeTime(){
                let that =this
                if(this.activityDetail.marketingState == 'ENDED'){ //当活动状态为已结束的时候，此时展示活动结束的样式，首先根据状态判断
                    this.timeBefore = false;
                    this.timeEnd = true;
                    extendUtils.showToast('本次活动已结束，下次活动敬请关注近日小助手消息。', null, 3000);
                }else{
                    let nowTime = new Date().getTime();
                    let startTime = this.activityDetail.marketingStartTime;
                    let endTime = this.activityDetail.marketingEndTime;
                    if(nowTime < startTime){
                        this.timeBefore = true;
                        this.timeEnd = false;
                    }else if(nowTime >= startTime && nowTime < endTime){
                        this.timeBefore = false;
                        this.timeEnd = false;
                    }else if(nowTime >= endTime){
                        this.timeBefore = false;
                        this.timeEnd = true;
                    }
                }
            },


            // 获取tab距离顶部的距离
            getTabOffsetTop(top){
                this.tabOffsetTop = top;
            },

    
  
            /** 
             *  监听页面滚动事件
             */
            scrollEvent(scrollTop){
                let that = this;
                that.scrollTop = scrollTop;
                let tabDom = document.getElementsByClassName('tabs_wrap')[0];
                
         
                //兼容样式             
                if(that.scrollTop > that.tabOffsetTop) {
                    tabDom.classList.add('tab_fixed');
                    tabDom.classList.add('fixed-dom-part');
                } else {
                    tabDom.classList.remove('tab_fixed');
                    tabDom.classList.remove('fixed-dom-part');
                }
            },

            // 当tab栏选项变更时候的触发的回调
            tabChange(){
                const that = this;
                if(that.scrollTop > that.tabOffsetTop){
                    that.$refs.outPageWrap.scrollTop = (that.tabOffsetTop);
                }
            },
            

            /**
             * 加入购物车
             */
            addCart($event, item, index){
                if(this.timeEnd){
                    extendUtils.showToast('本次活动已结束，下次活动敬请关注近日小助手消息。');
                    return false
                }
                let goods = [{
                    "sku":item.sku,
                    "supplierId":item.supplierId,
                    "quantity": 1, //默认数量为1
                    "name": item.name,
                    "specification": item.specification || '', //产品的规格，颜色等相关的详情以对象的方式传递过去
                    "imageUrl": item.imgUrl,
                    "jdCardCategoryId3": item.categoryId3 || '', //商品的三级分类，该字段目前用来判断实体礼品卡不能加入购物车的
                }]
                //加入购物车的方法在全局混入里面globalMixin.js
                this.setIntoShopCar(goods).then(flag => {
                    if(!!flag){ //加入购物车接口返回成功后，再执行动画
                        setTimeout(async ()=>{
                            let cartDom = this.$refs.cartThumb.$el;
                            let animation = new AddCartAnimation(cartDom)
                            //抛物线动画效果
                            // await animation.start($event, {offset: {x: 'left',y:'top'}});
                            //+1动画
                            await animation.addNumShow(cartDom);                        
                        }, 0)
                    }
                }).catch(e => {
                    console.error('加入购物车失败====',e);
                });
            },
        
 


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
                title:'员工限时特惠', // 分享标题 
                desc:'这些商品太值了，手慢无，点击查看', // 分享描述   
                link:callBackUrl, // 分享链接  
                imgUrl: that.activityGoodsDate[0].goodsList[0].imagePath|| '', // 分享图标,图片绝对地址 
            }
            //设置二次分享
            shareHandler.setThirdShareInfo(shareInfo);
        },

     
         
            /**
             * 跳转商品详情页面
             * @param item 商品对象
             */
            gotoGoodsDetails(item){
                
                let that = this;
                // 活动结束了，不能进入商品详情
                if(this.timeEnd){
                    extendUtils.showToast('本次活动已结束，下次活动敬请关注近日小助手消息。');
                    return false;
                } 
                
                that.outPageScrollTop = that.scrollTop;
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
                let that = this;
                that.outPageScrollTop = that.scrollTop;
                this.$router.push({
                    path: "/cart"
                })
            },
            /**
             * 返回首页
             */
            activityBackHome(){
                this.$router.push({
                    path: '/home'
                })
            },

           
            /**
             * 注册T信的回退事件
             */
            goBackFun(){
                if(!!this.$route.query.pageFrom && 'index'==this.$route.query.pageFrom){ //说明是从banner页面进入的（或者说是从商城进入的） 此时点击回退直接路由回退。
                    this.$router.back();
                }else{ //此时说明是通过其他方式进入的页面，例如推送等，此时回退应该是页面级回退
                    extendUtils.goBackPage(null, 1);
                }
            },
        
        },
    }
</script>
<style scoped lang="less">
@import '~themes/default/styles/marketing/index.less';
</style>
