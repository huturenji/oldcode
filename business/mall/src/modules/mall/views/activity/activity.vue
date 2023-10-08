<template>
    <div ref="activity" :class="{noscroll:noscroll}">
        <div ref='outPageWrap' class="activityOutWrap" @scroll="outPageWrapScroll">
            <div class="activityWrap">
                <!-- 去除活动说明 黄志刚需求2021-3-5 14:04:16-->
                <!-- <div class="tipsBut icon-btn" @click="showTipsPopup=true">活动说明</div> -->
                <!-- <div class="cashBut icon-btn" @click="gotoCash"></div> -->
                <div class="discountOutWrap" v-if="false">
                    <div class="discountWrap">
                        <swiper :options="swiperOptions" swiperId="activity_id">
                            <template v-for="(group,index) in discountGoodsDate" >
                                <swiper-item class="black" :key="index">
                                    <div class="goodsList">
                                        <template v-for="(item,ind) in group" >
                                            <div class="itemGoodWrap" :key="ind" @click="gotoGoodsDetails(item)">
                                                <div class="itemGood">
                                                    <div class="topImgWrap">
                                                        <div class="topImg" v-bind:style="{backgroundImage: 'url(' + BMallConfig.IMG_PREFIX+(item.imagePath) + ')'}"></div>
                                                    </div>
                                                    <div class="itemName">{{item.name}}</div>
                                                    <div class="itemprice"><priceLabel :amount='item.unitPrice' toFixed='2' :camelCase='false'/></div>
                                                    <div class="itemTips" v-if="!!discountDate[item.sku] && ''!=discountDate[item.sku]">{{discountDate[item.sku]}}</div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </swiper-item>
                            </template>
                        </swiper>
                    </div>
                </div>
                <div class="ruleTips" v-if="false">
                    <p>1.参与折扣活动的仅限本页面展示商品；</p>
                    <p>2.购买折扣商品时请按显示的价格支付，收货后系统自动返还优惠金额；</p>
                    <p>3.相同折扣标签的商品可自由搭配，总件数满足对应数量要求即可。</p>
                </div>
                <div class="tabWrap" ref="tabWrap">
                    <tab ref='tabBox' :line-width=3 active-color='#10833C' default-color="#333333" custom-bar-width='.4rem' bar-active-color="#10833C">
                        <tab-item  
                        class='tab-item' 
                        :selected="index == activeIndex" 
                        v-for="(item, index) in activityGoodsDate"
                        @on-item-click="changeTab(index)" 
                        :key="index">
                        {{item.name}}
                        </tab-item>
                    </tab>                
                    
                    <!-- <div ref='tabBox' class="tab-wrap" :line-width=3 active-color='#ffffff' default-color="#301396" custom-bar-width='.4rem' bar-active-color="#F03B93">
                        <div class="tab-container" 
                            v-for="(item, index) in activityGoodsDate"
                            :class="{'active':index == activeIndex}" 
                            @click="changeTab(index)" 
                            :key="index"
                        >
                            <div
                            class='tab-item icon-btn' 
                            >
                            {{item.name}}
                            </div>
                        </div>
                    </div> -->

                </div>
                <div class="goodsOutWrap" :style="listHeight">
                    <div class="goodsWrap">
                        <div class="goodsShowWrap" :style="leftStyle">
                            <div class="goods" v-for="(group, index) in activityGoodsDate" :key="index">
                                <loadingComp v-if="activityGoodsDate[index].loading"></loadingComp>
                                <emptyPage v-else-if="activityGoodsDate[index].goodsList.length == 0"></emptyPage>
                                <div class="goodsItem" v-else @click="gotoGoodsDetails(item, ind)" v-for="(item, ind) in group.goodsList" :key="ind">
                                    <thumb01 :img='item.imagePath'
                                    :title='item.name'
                                    :price='item.unitPrice'
                                    :discount='discountDate[item.sku]'
                                    :status='judgeStatus(item)'
                                    :goodsOriginal='markingPriceDateData[item.sku]'
                                    tag='内购价'
                                    @addCart='addCart($event, item, index)'/>
                                </div>
                                <div v-if="!!activityGoodsDate[index].nomore" class="readMore icon-btn" @click="activityBackHome">查看更多商品</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <div class="tabWrap tabFixed" :class="{tabFixedShow:tabFixedShow}">
                    <tab ref='tabBox' :line-width=3 active-color='#E44127' default-color="#333333" custom-bar-width='.4rem' bar-active-color="#E44127">
                        <tab-item  
                        class='tab-item' 
                        :selected="index == activeIndex" 
                        v-for="(item, index) in activityGoodsDate"
                        @on-item-click="changeTab(index)" 
                        :key="index">
                        {{item.name}}
                        </tab-item>
                    </tab>                
                </div> -->
            </div>
            <!-- <div class="actfooter"></div> -->
        </div>
        <div class="tabOutWrap tabFixed" :class="{tabFixedShow:tabFixedShow}">
            <div class="tabWrap">
                <!-- <div ref='tabBox' class="tab-wrap" :line-width=3 active-color='#ffffff' default-color="#301396" custom-bar-width='.4rem' bar-active-color="#F03B93">
                        <div class="tab-container" 
                            v-for="(item, index) in activityGoodsDate"
                            :class="{'active':index == activeIndex}" 
                            @click="changeTab(index)" 
                            :key="index"
                        >
                            <div
                            class='tab-item icon-btn' 
                            >
                            {{item.name}}
                            </div>
                        </div>
                    </div> -->

                <tab ref='tabBox' :line-width=3 active-color='#10833C' default-color="#333333" custom-bar-width='.4rem' bar-active-color="#10833C">
                    <tab-item  
                    class='tab-item' 
                    :selected="index == activeIndex" 
                    v-for="(item, index) in activityGoodsDate"
                    @on-item-click="changeTab(index)" 
                    :key="index">
                    {{item.name}}
                    </tab-item>
                </tab>                
            </div>
        </div>
        <!-- 新年活动没有单独的活动说明 -->
        <!-- 活动说明 -->
        <div v-transfer-dom >
            <popup class="tipsWrapPopup" v-model="showTipsPopup" height='100%' width='100%' @click.native="showTipsPopup=false" :popup-style={zIndex:1001}>
                <div class="tipsOutWrap">
                    <div class="tipsWrap">
                        <div class="textWrap">
                            <div class="textTitle" v-for="(item) in activityRuleDate.title" :key="item">{{item}}</div>
                            <div class="textLine" v-for="(item) in activityRuleDate.content" :key="item" v-html="item"></div>
                        </div>
                        <Icon class="closeBut icon-btn" @click="showTipsPopup=false" type='icon_common_close' size='.6'></Icon>
                    </div>
                </div>
            </popup>
        </div>  
        <!-- 右下加跳转购物车的模块  -->
        <cartThumb class="activityCartThumb" ref='cartThumb' @clickCartThumb="clickCartThumb"></cartThumb>
        <div class="activityBackHome" @click="activityBackHome"></div>
        
    </div> 
</template>

<script>
    import { Tab, TabItem, TransferDom ,Popup} from 'vux';
    import { Swiper, SwiperItem} from 'commonComp/swiper';
    const Icon = ()=>import('common/components/base/Icon.vue');
    const emptyPage = ()=>import('commonComp/base/emptyPage.vue');
    const loadingComp = ()=>import('commonComp/base/LoadingComp.vue');
    import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
    const thumb01 = ()=>import('commonComp/goodsThumb/thumb01.vue');
    const cartThumb = ()=>import('commonComp/cartThumb/cartThumb.vue');
    import priceLabel from 'common/components/base/priceLabel';
    import {discountGoods,activityGoods,activityRule,discount,markingPriceDate} from 'common/lib/enum/activityGoods';
    import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
    import AddCartAnimation from 'common/lib/animation/addCart.js'
    import extendUtils from 'common/lib/utils'
    import GradientColor from 'common/lib/animation/utils/gradientColor.js'
    //动画帧数
    const animationStep = 100;
    //需要动画的组件样式数组。将过渡的中间色分为animationStep份
    const animationColors = {
        inputBg: new GradientColor('rgba(255,255,255,0.45)', 'rgb(245, 245, 245)', animationStep),
        inputPlaceHolderColor: new GradientColor('#fff', '#c2c2c2', animationStep),
        searchIcon:new GradientColor('#fff', '#c2c2c2', animationStep),
    }
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
            Swiper,
            SwiperItem,
            priceLabel
        },
        data() {
            let that = this;
            return Object.assign(extendUtils.stateManager.setData([
                {
                    name:'showTipsPopup',  //活动说明
                    show:{
                        callback(){
                            that.noscroll = true;
                        }
                    },
                    hide:{
                        callback(){
                            that.noscroll = false;
                        }
                    }
                },
            ], that), {
                discountGoodsDate:discountGoods,//热销商品
                activityGoodsDate:activityGoods,//内购商品列表二维
                activityRuleDate:activityRule,//规则
                discountDate:discount,//折扣数据
                markingPriceDateData:markingPriceDate,
                activeIndex: 0,//tab active
                isPC: extendUtils.isPC(),//区分移动端和PC端
                tabFixedShow:false,//定位tab是否显示
                tabOffsetTop:0,//tab栏距离文档顶部的距离
                scrollTop:0,//页面滚动高度
                outPageScrollTop:0,//页面跳转出去时页面的滚动高度
                noscroll:false,//二级页面展开时页面禁止滚动
                swiperOptions:{ //swiper相关的配置   
                    pagination: '.swiper-pagination',// 如果需要分页器
                    paginationType : 'bullets', //分页器type           
                    observer:true,
                    observeParents:true,
                    loop: false,
                    // autoplay: 2000, //自动轮播事件间隔
                    autoplayDisableOnInteraction: false, //用户操作swiper之后，是否禁止autoplay。默认为true：停止。
                },
                fromHome:false,//是否从首页跳转过来
            })
        },
        created() {
            this.initDate();
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                if('/home'==from.path || from.path.indexOf('index')>-1){
                    vm.$refs.outPageWrap.scrollTop = 0;
                    vm.scrollTop = 0;
                    vm.outPageScrollTop = 0;
                    vm.tabFixedShow = false;
                    vm.activeIndex = 0;
                    vm.fromHome = true;
                }
            })
        },        
        destroyed(){
        },
        mounted() {
            let that = this;
            setTimeout(() => {
                this.$nextTick(()=>{
                    that.tabOffsetTop = that.$refs.tabWrap.offsetTop;
                })
            }, 0);
        },
        activated(){
            let that = this;
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
            leftStyle(){
                return {
                    left: '-' + this.activeIndex*100 + '%'
                }
            },
            listHeight(){
                if(this.activityGoodsDate[this.activeIndex].goodsList.length==0){
                    return {
                        height: '10rem'
                    }
                }else{
                    //在pc和app上高度不一样，需要区分处理
                    let itemHeight = this.isPC?365:5.38;
                    let tipsHeight = this.isPc?200:1.2;
                    let unit = this.isPC?'px':'rem';
                    let length = this.activityGoodsDate[this.activeIndex].goodsList.length;
                    return {
                        height: (Math.ceil(this.activityGoodsDate[this.activeIndex].goodsList.length/2)*itemHeight+tipsHeight) + unit
                    }
                }
            },
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
            /**
            * 阻止默认事件
            */
            stopPropagation(){
                try {
                    event.stopPropagation();
                    return false;
                } catch (error) {

                }
            },
            /** 
             *  页面初始化
             */
            initDate(){
                let that= this;
                //初始化查询第一个tab的数据
                that.getGoodsForLoop(that.activeIndex);
                //初始化查询热销商品的数据，女神节活动没有热销区
                // that.getHotGoodsForLoop();
            },
            /** 
             *  循环查询热销数据活动
             */
            getHotGoodsForLoop(){
                let that = this;
                let interval = 1000;
                let times = that.discountGoodsDate.length
                for(let i=0;i<times;i++){
                    setTimeout(() => {
                        that.getHotlistUnitPrice(that.discountGoodsDate[i],i);
                    }, interval*i);
                }
            },
            /**
             * 根据商品编号去查询商品的价格
             * @param {str} cartList商品列表数据
             * @param {num} tabIndex商品tablist索引
             */
            getHotlistUnitPrice(cartList,tabIndex){
                const that = this;
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
                    if(res.resultCode == 0 && res.result){
                        let resList = res.result.productPrice;
                        that.discountGoodsDate[tabIndex] = that.discountGoodsDate[tabIndex].map(value => {
                            let index = resList.findIndex(temp => {
                                return temp.sku == value.sku;
                            })
                            if(index > -1){
                                value = Object.assign({}, value, {unitPrice:resList[index].unitPrice});
                            }     
                            return value;             　　
                        })
                        this.$forceUpdate();
                    }
                }).catch(e=>{
                    console.log(e);
                })
            }, 
            /** 
             *  循环查询数据
             */
            getGoodsForLoop(tabIndex){
                let that = this;
                let pagesize = 6;
                let interval = 1000;
                let leng = that.activityGoodsDate[tabIndex].goodsSkus.length;
                let times = Math.ceil(leng/pagesize);
                for(let i=0;i<times;i++){
                    let goodsSkus = that.activityGoodsDate[tabIndex].goodsSkus.slice(i*pagesize,(i+1)*pagesize)
                    setTimeout(() => {
                        that.getGoodsDetail(goodsSkus,tabIndex,(times-1)==i,i);
                    }, interval*i);
                }
            },
            /** 
             *  监听页面滚动事件
             */
            scrollEvent(scrollTop){
                let that = this;
                that.scrollTop = scrollTop;
                //兼容初始取值失败的问题
                if(that.tabOffsetTop==0){
                    that.tabOffsetTop = that.$refs.tabWrap.offsetTop;
                } 
                //兼容样式             
                if(that.scrollTop >= that.tabOffsetTop-10) {
                    that.tabFixedShow = true;
                } else {
                    that.tabFixedShow = false;
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
             * 加入购物车
             */
            addCart($event, item, index){
                let goods = [{
                    "sku":item.sku,
                    "supplierId":item.supplierId,
                    "quantity": 1, //默认数量为1
                    "name": item.wareName || item.name,
                    "specification": JSON.stringify(item.specification) || '', //产品的规格，颜色等相关的详情以对象的方式传递过去
                    "imageUrl": item.imageUrl || item.imagePath,
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
             * 获取购物清单的商品信息
             * @param {num} index切换tab的索引
             */
            changeTab(index){
                let that = this;
                that.activeIndex = index;
                if(!that.activityGoodsDate[index].isLoad){
                    that.getGoodsForLoop(index);
                }
                if(that.scrollTop > that.tabOffsetTop){
                    that.$refs.outPageWrap.scrollTop = that.tabOffsetTop;
                }
            },
            /**
             * 获取购物清单的商品信息
             * @param {str} skus商品id列表
             * @param {num} tabIndex商品tablist索引
             * @param {boolean} lastPage 是否是最后一页
             */
            getGoodsDetail(skus,tabIndex,lastPage,index){
                const that = this;
                let param = {
                    sku: skus,
                    supplierId:goodsHandler.supplierId,
                    channelId: goodsHandler.channelId,
                }
                // that.activityGoodsDate[tabIndex].loading = true;
                goodsHandler.getProductSimpleDetail(param).then(res=>{
                    if(res.resultCode == 0 && res.result){
                        let goods = res.result.detail;
                        let cllectList = [];
                        let skuList = param.sku;
                        for(let i = 0;i < skuList.length;i++){    //解决服务端返回采购列表排序与购物车不一致的问题
                            for(let j = 0;j < goods.length;j++){
                                if(skuList[i] == goods[j].sku){
                                    cllectList.push(goods[j]);
                                }
                            }
                        }
                        // if(index==0)console.log(JSON.stringify( cllectList.map(item=>{return {sku:item.sku,name:item.name,imagePath:item.imagePath,categoryId1:item.categoryId1,categoryId2:item.categoryId2,categoryId3:item.categoryId3}})))
                        //根据商品id查询商品价格
                        if(cllectList.length>0){
                            for(let i = 0;i < cllectList.length;i++){  
                                let index = that.activityGoodsDate[tabIndex].goodsList.findIndex(temp => {
                                    return temp.sku == cllectList[i].sku;
                                })
                                if(index > -1){
                                    if("1" == cllectList[i].state){
                                        that.activityGoodsDate[tabIndex].goodsList[index] = cllectList[i];
                                    }else {
                                        that.activityGoodsDate[tabIndex].goodsList.splice(index, 1);
                                    }
                                } else if("1" == cllectList[i].state){
                                    that.activityGoodsDate[tabIndex].goodsList.push(cllectList[i])
                                }
                            }
                            that.activityGoodsDate[tabIndex].isLoad = true;
                            that.activityGoodsDate[tabIndex].loading = false;
                            if(!!lastPage){
                                that.activityGoodsDate[tabIndex].nomore = true; 
                            }
                            that.getlistUnitPrice(cllectList,tabIndex);
                        }
                    }else{
                        that.activityGoodsDate[tabIndex].loading = false;
                    }
                    
                }).catch(e=>{
                    console.log(e);
                    that.activityGoodsDate[tabIndex].loading = false;
                })
            },
            /**
             * 根据商品编号去查询商品的价格
             * @param {str} cartList商品列表数据
             * @param {num} tabIndex商品tablist索引
             */
            getlistUnitPrice(cartList,tabIndex){
                const that = this;
                let ids = cartList.map(function(value){
                　　return {
                        categoryId1:value.categoryId1,
                        categoryId2:value.categoryId2,
                        categoryId3:value.categoryId3,                    
                        sku:value.sku
                    }
                })
                let param = {
                    spId: cartList[0].supplierId,
                    businessType:'COMMODITY',
                    productInfos: ids,
                }
                goodsHandler.getlistUnitPrice(param).then(res=>{
                    if(res.resultCode == 0 && res.result){
                        let tempCartList = res.result.productPrice;
                        that.activityGoodsDate[tabIndex].goodsList = that.activityGoodsDate[tabIndex].goodsList.map(value => {
                            let index = tempCartList.findIndex(temp => {
                                return temp.sku == value.sku;
                            })
                            if(index > -1){
                                value = Object.assign({}, value, {unitPrice:tempCartList[index].unitPrice});
                            }     
                            return value;             　　
                        })
                        //查询商品销售属性
                        that.getProductSpec(cartList,tabIndex);
                    }
                }).catch(e=>{
                    console.log(e);
                })
            }, 
            /**
             * 根据商品编号去查询商品的销售属性
             * @param {str} cartList商品列表数据
             * @param {num} tabIndex商品tablist索引
             */
            getProductSpec(cartList,tabIndex){
                const that = this;
                let ids = cartList.map(function(value){
                　　return value.sku
                })
                let param = {
                    sku: ids,
                    supplierId:cartList[0].supplierId
                }
                goodsHandler.getProductSpec(param).then(res=>{
                    if(res.resultCode == 0 && res.result){
                        let tempCartList = res.result.spec;
                        that.activityGoodsDate[tabIndex].goodsList = that.activityGoodsDate[tabIndex].goodsList.map(value => {
                            let index = tempCartList.findIndex(temp => {
                                return temp.sku == value.sku;
                            })
                            if(index > -1){
                                value = Object.assign({}, value, {specification: JSON.stringify(tempCartList[index])}); //此处需要序列化一下，以为该页面显示的商品规格处理的方法都是dealSpecification
                            }     
                            return value;             　　
                        })
                    }
                }).catch(e=>{
                    console.log(e);
                })
            },             
            /**
             * 跳转商品详情页面
             * @param item 商品对象
             */
            gotoGoodsDetails(item){
                let that = this;
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
             * 页面刷新入口函数 mescroll刷新回调
             * @param mescroll对象
             */
            // refresh(mescroll){
            //     extendUtils.reloadPage();
            // },
            /**
             * T信tChatEventRefresh刷新事件回调
             * 在首页注册的T信刷新事件为reload页面
             */
            refreshClearCache(){
                extendUtils.reloadPage();
            },
            /**
             * 注册T信的回退事件
             */
            goBackFun(){
                if(!!this.$route.query.pageFrom && 'index'==this.$route.query.pageFrom){
                    this.$router.back();
                }else{
                    this.$router.push({
                        path: '/home'
                    })
                }
            },
            /**
             * 去兑奖
             */
            gotoCash(){
                window.open('https://www.wjx.cn/vj/Pw77FMV.aspx')
            }
        },
    }
</script>
<style scoped lang="less">
@import '~themes/default/styles/activity/activity.less';
</style>
