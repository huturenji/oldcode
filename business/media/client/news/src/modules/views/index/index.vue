<template>
    <div class="indexWrap">
        <!-- 首页的骨架图 -->
        <!-- <template v-if="showSkeleton">
            <indexSkeleton></indexSkeleton>
        </template> -->
        <template>
            <nav>
                <Icon type='h5 svg_icon_zixun_touxiang' size=".6" style="marginRight:0.2rem;" @click.native='goMyCenter'/>
                <searchBar :showCancel='true' class='search-bar'/>
                <div class="reading_room" @click='goReadingRoom'></div>
                <div class='mask' @click.prevent='goSearch'></div>
            </nav>
            <div class='news-tab-container'>
                <tab class='news-tab' :list='tabs' v-model='showCurrTabIndex' @click='clickTab'>
                    <template v-slot:last>
                        <div class='placeholder'></div>
                    </template>
                </tab>
                <div class='edit-channel'>
                    <Icon type='btn_nav_more' size=".44" @click.native='goEditChannel'/>
                </div>
            </div>
            
            <div class="swiper-wrap">
                <div id='demo0'></div>
                <swiper ref='swiperComp' v-model="currTabIndex" swiperId='indexId' :options="swiperOptions">
                    <swiper-item v-for="(item, index) in tabs" :key="index" class='stop-swiping'>
                        <div class="tab-swiper">
                            <listTemplate 
                                class="contentWrap" 
                                ref='listTemplate' 
                                :mescrollDownConfig='mescrollDownConfig'
                                :mescrollUpConfig="mescrollUpConfig"
                                :listItemConfig="{'videoType': getVideoType(index), showIgoreBtn: true, categoryId: tabs[index].categoryId}" 
                                :ignoreId='index==currTabIndex ? ignoreId: null' 
                                :pageConfig='{size: GlobalConfig.PAGE_SIZE.DEFAULT}' 
                                :getDataFunc='getDataList'
                                :showCustEmptyWrap="true"
                                :showSlotTop="isShowIndustryList(index)"
                                @click='clickNews'
                                globalsign='indexScroll'
                            >
                                <template slot="top"> 
                                    <template v-if="swiperFlag" >
                                        <topWarp v-if="showTopList(index)" @stopTopMescrollDown='stopTopMescrollDown' @startTopMescrollDown='startTopMescrollDown' :keyIndex="index" :swiperSpeed="swiperSpeed" :topNewsConfig="topNewsConfig" :swiperNumber="swiperNumber" :isBorder="!(industryListMap[currTabIndex]&&industryListMap[currTabIndex].length>0)" :swiperList="topNewsData[currTabIndex]" />
                                    </template>
                                    <industryWrap :show="isShowIndustryList(index)" :id="index" :list="industryListMap[currTabIndex]"></industryWrap>
                                </template>                   
                            </listTemplate>
                        </div>
                    </swiper-item>
                </swiper>
            </div>

        </template>
        <!--屏蔽和举报-->
        <div v-transfer-dom>
            <popup v-model="showignorePopup" position="right" width="100%" is-transparent :show-mask="false" class="ignorePopupDialog">
                <ignorePop v-if="showignorePopup" @ignoreNews="ignoreNews" @reportNewsShow="reportNewsShow" @close="showignorePopup=false" :newsItem="newsItem"></ignorePop>
            </popup>
        </div>    
        <!--举报界面-->
        <div v-transfer-dom>
            <popup v-model="showReportPopup" position="right" width="100%" is-transparent>
                <reportPop :showReportPopup="showReportPopup" v-if="showReportPopup" @reportDone="reportNews" :newsItem="newsItem"></reportPop>
            </popup>
        </div>    
        <!--分享-->
        <div v-transfer-dom>
            <popup v-model="showSharePopup" position="bottom" height="auto" width="100%" class="radiusTop">
                <share v-if="showSharePopup" @close="showSharePopup=false" :newsItem="newsItem"></share>
            </popup>
        </div>     
        <!--more-->
        <div v-transfer-dom>
            <popup v-model="showMoreActionPopup" position="bottom" height="auto" width="100%" class="radiusTop">
                <moreAction v-if="showMoreActionPopup" @close="showMoreActionPopup=false" @moreAction="moreAction" :newsItem="newsItem"></moreAction>
            </popup>
        </div> 

        <div v-transfer-dom>
            <emptyPage v-if='!enable' tips='资讯模块已停用，敬请谅解'/>
        </div>
    </div>
</template>
<script>

import { Popup, TransferDom } from 'vux';
import { Swiper, SwiperItem} from 'commonComp/swiper';
import { industryWrap } from 'commonComp/industry';
import topWarp from 'commonComp/topWarp';
// import { indexSkeleton } from 'commonComp/skeleton';//首页的骨架图
import tab from 'commonComp/tab';
import Icon from 'commonComp/icon';
import extendUtils from 'common/lib/utils';
import newsHandler from 'common/lib/requestHandler/newsHandler';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import listTemplate from 'commonComp/listTemplate';
import {mapGetters} from 'vuex'

const ignorePop = ()=>import('commonComp/ignorePop');
const reportPop = ()=>import('commonComp/reportPop');

// const searchBar = ()=>import('commonComp/search/searchBar');
import searchBar from 'commonComp/search/searchBar';
const share = ()=>import('commonComp/share');
const moreAction = ()=>import('commonComp/moreAction');
const emptyPage = ()=>import('commonComp/emptyPage');

export default {
    mixins: [tChatEventMixin],
    directives: {TransferDom},
    components:{
        Popup,
        listTemplate,
        Swiper, 
        SwiperItem, 
        ignorePop,
        reportPop,
        tab,
        searchBar,
        Icon,
        topWarp,
        industryWrap,
        share,
        moreAction,
        // indexSkeleton,
        emptyPage
    },
    data() {
        let that = this;
        return Object.assign(extendUtils.stateManager.setData([
            {
                name: 'showignorePopup'//屏蔽和举报
            },
            {
                name: 'showReportPopup'//举报界面
            },
            {
                name: 'showSharePopup'//分享界面
            },
            {
                name: 'showMoreActionPopup'//moreAction界面
            }
        ], that), {
            cursor:null, // 资讯列表接口返回的页面索引ID
            enable: true,
            preTabIndex: 0,//前一个tab，用来控制选择当前tab时不作处理
            currTabIndex: 0,//当前tab
            showCurrTabIndex: 0,//控制tab显示用
            tabs: [],
            direction: 'right',
            newsItem: null,//屏蔽举报的新闻数据
            ignoreId: null,
            industryListMap: {}, //专业设备tab页下需要显示的行业map
            showSkeleton: true,//是否显示首页的骨架图
            swiperOptions:{ //swiper相关的配置              
                observer:true,
                observeParents:true,
                resistanceRatio: 0, //控制两侧的不回弹
                swipeHandler: '.swipe-handler',
                noSwiping : true,
                noSwipingClass : 'stop-swiping', //不可拖动块的类名，当noSwiping设置为true时，并且在slide（或其他元素）加上noSwipingClass对应的类名，目标将无法触摸拖动。 原因是因为滑动再个别机型上特别卡，所以暂时屏蔽该功能
                onSlideChangeStart:function(swiper){ //手指触碰Swiper并拖动slide时执行
                    that.showCurrTabIndex = swiper.activeIndex
                },
                onSlideChangeEnd: function(swiper){ //手指触碰Swiper并拖动slide结束时执行
                    that.currTabIndex = swiper.activeIndex;
                    // eslint-disable-next-line no-unused-expressions
                    that.currTabIndex!=that.preTabIndex && that.changeTab(that.currTabIndex);
                },
                onSliderMove(){
                    this.stopMescrollDown()
                },
                onTouchEnd: function(){ //手指触碰Swiper并拖动slide时执行
                    this.startMescrollDown()
                }
            },
            mescrollDownConfig:{
                
            },
            mescrollUpConfig: {
                auto: false,
                loadFull: {use : true},
                empty: {
                    tip: '暂无内容，敬请期待'
                }
            },
            adIndex:0,//从3条广告中选取一条的索引值
            topNewsData:{}, //置顶轮播数据
            topNewsConfig:false,//指定标签显示
            swiperFlag:false,
            productUrl:location.origin+location.pathname//页面访问路径
        })
    },
    async created(){
        this.initCacheTabs();//初始化首页的频道数据，先在缓存里面取，然后请求接口更新缓存数据
        // try{  
        //     let channelConfig = await newsHandler.getChannel();
        //     this.enable = channelConfig.result.state=="ENABLE"
        // }catch(e){
        //     console.error(e);
        //     this.enable = false;
        // }

        if(!this.enable){
            return;
        }
        let that = this;
        
        //屏蔽
        globalBus.$on('ignorePopupShow',(item)=>{
            that.newsItem = Object.assign({},item)
            that.showignorePopup = true;
        })
        //分享
        globalBus.$on('share',(item)=>{
            that.newsItem = Object.assign({},item)
            that.showSharePopup = true;
        })
        //more
        globalBus.$on('more',(item)=>{
            that.newsItem = Object.assign({},item)
            this.showMoreActionPopup = true;
        })
        
        this.getTabs();
        this.onReActived();  
    },
    beforeDestroy(){
        globalBus.$off('ignorePopupShow',()=>{})
        globalBus.$off('share',()=>{})
        globalBus.$off('more',()=>{})
    },
    watch: {
        tabs: {
            handler(val){
                try{
                    //将当前用户的频道存储起来
                    if(val && val.length>0){
                        extendUtils.setStorage(newsHandler.primaryKey+'_myChannels', JSON.stringify(val));
                    }
                    
                }catch(e){
                    console.error(e);
                }
            },
            deep: true
        }
    },
    computed: {
        ...mapGetters(['getRole'])
    },
    methods: {
        //初始化首页的频道数据，先在缓存里面取，然后请求接口更新缓存数据和展示的数据
        initCacheTabs(){
            let that = this;
            let myChannels = that.getCacheData(newsHandler.primaryKey+'_myChannels');
            if(!!myChannels && myChannels.length > 0){
                that.tabs = myChannels;
               
                that.showSkeleton = false;
                that.$emit('showOff','');
            }else{
                that.showSkeleton = true;
            }
        },
      

        /**获取缓存的方法 */
        getCacheData(key){
            let result = extendUtils.getStorage(key);
            return !!result ? JSON.parse(result) : null;
        },
        /** 
        * 是否显示行业网站列表
        */
        isShowIndustryList(index){
            return index == this.currTabIndex && 0 < this.tabs.length && 'INDUSTRY' == this.tabs[index].categoryType && 0 < (this.industryListMap[this.currTabIndex]||[]).length 
        },
        /** 
        * 是否显示置顶中的置顶标签
        */
        showTopList(index){
            return index == this.currTabIndex && 0 < this.tabs.length && 0 < (this.topNewsData[this.currTabIndex]||[]).length 
        },
        /**
         * 获取用户栏目
         */  
        async getTabs(){
            let res = await newsHandler.getMyChannels({
                userId: newsHandler.userId,
                companyId: newsHandler.companyId,
                channelId: newsHandler.channelId
            });
            this.tabs = res.result.categories || [];
            this.showSkeleton = false;
            this.$emit('showOff','');
            this.$nextTick(()=>{
                // eslint-disable-next-line no-unused-expressions
                this.$refs.listTemplate && this.$refs.listTemplate.length>0 && this.$refs.listTemplate[0].init(true);
            })
        },
        /**
         * 点击栏目
         */ 
        clickTab(index){
            this.currTabIndex = index;
            this.activeTab(index, this.preTabIndex == index || !this.tabs[index].loaded);
        },
        /**
         * 切换栏目
         */ 
        changeTab(index){
            this.activeTab(index, !this.tabs[index].loaded);
        },
        /**
         * 切换栏目动作
         */ 
        activeTab(index, load){
            //页面跳转时全局广播停止播放视频
            globalBus.$emit('videoPlayTypeUpdata','');
            //点击tab时，如果仍是当前tab，则重新拉取数据
            if(load){
                this.$refs.listTemplate[index].init(!this.tabs[index].loaded);
                document.querySelectorAll('.mescroll')[index].scrollTop=0;
            }
            this.preTabIndex = index;
        },

        /** 
        * 请求咨询列表和请求行业列表需要同时执行
        * 原因：因为如果频道是行业频道的话，此时需要显示行业频道下的行业网站，如果不同时请求渲染数据，次数页面的渲染会有卡顿的问题
        */

        getDataList(page){
            const that = this;
            return new Promise((resolve) =>{
                Promise.all([that.getNewsList(page), that.getIndustryList()]).then(res => {
                    let dataNews = res[0];
                    //标记已被访问过的新闻
                    const key = newsHandler.primaryKey+'_visited_news';
                    let visitedNews = extendUtils.getSession(key);
                    if(!!visitedNews && dataNews.hitResult){
                        visitedNews = JSON.parse(visitedNews)
                        dataNews.hitResult = dataNews.hitResult.map(news=>{
                            if(visitedNews.indexOf(news.articleId)>-1){
                                that.$set(news, 'visited', true);
                            }
                            return news;
                        })
                    }
                    resolve(dataNews);
                }).catch(e=>{
                    resolve();
                    console.log(e)
                })
            })
        },
        /**
         * 获取置顶资讯列表
         * @param resultList 
         */
        getTopNewsList(resultList){
            let that = this;
            let resultData = resultList;
            return new Promise((resolve)=>{
                let params={
                    categoryId:that.tabs[that.currTabIndex].categoryId,
                    pageSize:10000,
                    pageIndex:1
                }
                newsHandler.getTopNewsList(params).then(res=>{
                    if(res.resultCode == 0 && !!res.result && res.result.hitResult && 0<res.result.hitResult.length){
                        if(res.result.topSpecification.swiperFlag){
                            that.$set(that.topNewsData, that.currTabIndex, res.result.hitResult);
                            that.topNewsConfig=res.result.topSpecification.showTopFlag
                            that.swiperNumber=res.result.topSpecification.swiperItemNum
                            that.swiperSpeed=res.result.topSpecification.swiperInterval
                            that.swiperFlag=res.result.topSpecification.swiperFlag
                            resolve(resultData);
                        }else{
                            let tempTopList = res.result.hitResult.map((item)=>{
                                if(res.result.topSpecification.showTopFlag){
                                    return Object.assign({},item,{showTopFlag:true})
                                }
                                return Object.assign({},item,{showTopFlag:false})
                                
                            })
                            if(tempTopList.length<res.result.topSpecification.itemNum){
                                res.result.topSpecification.itemNum=tempTopList.length
                            }
                            tempTopList = that.getSomeList(tempTopList,res.result.topSpecification.itemNum)                           
                            resultData.hitResult = tempTopList.concat(resultData.hitResult);
                            resolve(resultData)
                        }
                    }else{ 
                        resolve(resultData);
                    }
                }).catch((err) => {
                    console.log(err);
                    resolve(resultData);
                });
            })
        },
        //随机置顶资讯条数
        getSomeList(list,num){
            let newList=[];
            let numList = [];
            let len = list.length;
            for(let i=0;i<len;i++){
                numList.push(i);
            }
            let choosedIndexList = this.getRandomArrayElements(numList,num);
            choosedIndexList.sort(this.sortFunc);
            choosedIndexList.forEach(item => {
                newList.push(list[item]);
            });
            return newList;
        },
        /**
         * 数据中获取随机元素
         */  
        getRandomArrayElements(arr, count) {
            var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
            while (i-- > min) {
                index = Math.floor((i + 1) * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp;
            }
            return shuffled.slice(min);
        },
        /**
         * 排序用
         */    
        sortFunc(a,b){
            return a-b;
        },
        /**
         * 获取资讯列表
         */        
        getNewsList(page){
            let that = this;
            let currTabIndex = that.currTabIndex;//一定要在这里定义变量，不可在请求后获取，否则可能获取错误（执行时机问题）
            return new Promise((resolve, reject)=>{
                //判断当前页  若 num == 1 两种情况 分别是 首页刷新 下拉刷新 这时要求cursor为null 从第二页开始要求根据cursor查询资讯列表
                if(page.num == 1){
                    that.tabs[that.currTabIndex].cursor = null;
                }
                let param = {
                    companyId: newsHandler.getCompanyId,
                    userId: newsHandler.getUserId,
                    channelId: newsHandler.getChannelId,
                    categoryId: that.tabs[that.currTabIndex].categoryId,
                    pageIndex: page.num,
                    pageSize: page.size,
                    //查询时 若num == 1 cursor = null  若num !=1 cursor == this.cursor
                    cursor:that.tabs[that.currTabIndex].cursor?that.tabs[that.currTabIndex].cursor:null
                }
                newsHandler.getNewsList(param).then(async (res) => {
                    //视频频道查询用户对于文章是否点赞、是否点踩、是否收藏数据
                    let listResult = res.result;
                    //获取接口返回的cursor
                    that.tabs[that.currTabIndex].cursor = res.result.cursor;
                    

                    //第一页要查询置顶新闻
                    if(page.num==1){
                        listResult = await that.getTopNewsList(listResult);
                    }
                    
                    
                    //todu要闻添加前端配置的广告 目前前端写死，后续由服务器提供后，这里需要删除
                    // if('1' == that.tabs[that.currTabIndex].categoryId){
                    //     try {
                    //         listResult = await that.getAd(res.result,page.num,page.size);
                    //     } catch (error) {
                    //         console.log(err);
                    //     }
                    // }
                    if('2' == that.tabs[that.currTabIndex].categoryId){
                        try {
                            listResult = await that.getListAction(res.result);
                            resolve(listResult);
                        } catch (error) {
                            resolve(listResult);
                        }
                    }else{
                        resolve(listResult);
                    }
                    that.tabs[currTabIndex].loaded = true;//记住这个tab已经获取过数据了
                }).catch((err) => {
                    console.log(err);
                    reject();
                });
            })
        },
        /**
         * 获取广告
         * @param resultList 返回的文章列表数据
         * @param pageIndex 页数从1开始
         * @param pageSize 每页条数
         * todu 目前前端写死，后续由服务器提供后，这里需要删除
         */          
        getAd(resultList,pageIndex,pageSize){
            let that = this;
            let adList = [
                {
                    articleType:'AD',
                    articleId:'ad01',
                    title:'热点新闻 行业聚焦 引爆话题圈',
                    cover:[{url:require('./img/ad/bg_zixun_banner1@2x.png')}],
                    lastUpdateTime:0,//发布时间显示为刚刚
                    currentTime:0,//发布时间显示为刚刚
                    mediaName:'银企通商云',
                    tips:'[广告]',
                    noLink:true
                },
                {
                    articleType:'AD',
                    articleId:'ad02',
                    title:'高层声音 最新政策 行业动态 生意快人一步',
                    cover:[{url:require('./img/ad/bg_zixun_banner2@2x.jpg')}],
                    lastUpdateTime:0,//发布时间显示为刚刚
                    currentTime:0,//发布时间显示为刚刚
                    mediaName:'银企通商云',
                    tips:'[广告]',
                    noLink:true
                },
                {
                    articleType:'AD',
                    articleId:'ad03',
                    title:'财经早班车 3分钟掌握市场投资要点',
                    cover:[{url:require('./img/ad/bg_zixun_banner3@2x.jpg')}],
                    lastUpdateTime:0,//发布时间显示为刚刚
                    currentTime:0,//发布时间显示为刚刚
                    mediaName:'银企通商云',
                    tips:'[广告]',
                    noLink:true
                }
            ]
            return new Promise((resolve) => {
                if(!!!resultList.hitResult || 0 == resultList.hitResult.length){
                    resolve(resultList);
                }
                try {
                    let afterLen = 3;//从第三条开始
                    let loop = 6;//每隔6条新闻添加一条广告
                    let beLen = (pageIndex-1)*pageSize;//前面页数的新闻数量
                    let tempHitResult = [...resultList.hitResult];
                    let len = tempHitResult.length;//当前页的新闻数量
                    let rightLen = loop - (beLen % loop)-afterLen;//当前页往后偏移量
                    if(len > rightLen){
                        for (let i = 0; i <= Math.floor((len - rightLen) / loop); i++) {
                            let adItem = adList[that.adIndex];
                            that.adIndex++;
                            if(3<= that.adIndex){
                                that.adIndex = 0 ;
                            }
                            tempHitResult.splice((i+1)*loop+i-(loop-rightLen), 0, adItem); 
                        }
                    }
                    resultList.hitResult = tempHitResult;
                    resolve(resultList);
                } catch (error) {
                    resolve(resultList)
                }
            })
        },
        /**
         * 获取资讯列表关于是否点赞、点踩、分享等数据
         * @param resultList 返回的文章列表数据
         */          
        getListAction(resultList){
            return new Promise((resolve) => {
                if(!!!resultList.hitResult || 0 == resultList.hitResult.length){
                    resolve(resultList);
                }
                let articlesId = resultList.hitResult.map((item)=>{
                    return item.articleId;
                })
                let param = {
                    companyId:newsHandler.companyId,
                    channelId:newsHandler.channelId,
                    userId:newsHandler.userId,
                    articlesId:articlesId
                }            
                newsHandler.getNewsUserPrivate(param).then((res) => {
                    if(res.resultCode == 0 && !!res.result){                       
                        try {
                            let actions = res.result.actions;
                            let tempResList = resultList.hitResult.map(value => {
                                let index = actions.findIndex(action => {
                                    return action.articleId == value.articleId;
                                })
                                if(index > -1){
                                    value.statistics = Object.assign({}, value.statistics, actions[index]);
                                }     
                                return value;            
                            })
                            resultList.hitResult = tempResList;
                            resolve(resultList);                            
                        } catch (error) {
                            resolve(resultList)
                        }
                    }else{
                        resolve(resultList)
                    }
                }).catch(() => {
                    resolve(resultList)
                });
            })
        },
        /**
         * 获取专用设备下的行业列表的数据
         */        
        getIndustryList(){
            let that = this;
            that.$set(that.industryListMap, that.currTabIndex, [])
            return new Promise((resolve)=>{
                if('INDUSTRY' != that.tabs[that.currTabIndex].categoryType){ //如果该频道为新闻频道，则不去请求接口了
                    resolve([]);
                    return
                }
                let param = {
                    industryId:that.tabs[that.currTabIndex].categoryId
                }
                newsHandler.listAppIndustrySite(param).then((res) => {
                    if(res.resultCode == 0 && res.result.industrySite.length > 0 && !!res.result.industrySite[0].site && res.result.industrySite[0].site.length > 0){
                        let tempList = res.result.industrySite[0].site.slice(0, 7); //此处默认截取前7个
                       
                        //将最后的全部及对应的icon添加到数组
                        let item = {"siteName": "全部", "id": 'all', "logo": require('./img/icon_zixun_gengduo.png'), "phoneUrl":"industry", "pcUrl":"industry"}
                        tempList.push(item);
                        that.$set(that.industryListMap, that.currTabIndex, tempList);
                        resolve(tempList)
                    }else if(res.result.industrySite.length == 0){
                        that.$set(that.industryListMap, that.currTabIndex, [])
                        resolve([])
                    }else{
                        resolve([])
                    }
                }).catch((err) => {
                    console.log(err);
                    resolve([]);
                });
            })
        },
        getVideoType(tabIndex){
            // if(this.tabs[tabIndex] && this.tabs[tabIndex].specialType && this.tabs[tabIndex].specialType.indexOf('VIDEO')>-1){
            if(this.tabs[tabIndex] && this.tabs[tabIndex].categoryId==2){
                return 'detail';
            }
            return 'preview';
            
        },
        /**
         * 屏蔽新闻
         */ 
        ignoreNews(){
            // let that = this;
            // that.$loading.show();
            let param = {
                companyId:newsHandler.companyId,
                channelId:newsHandler.channelId,
                userId:newsHandler.userId,
                articleId:this.newsItem.articleId,
                type:'UNLIKE',
                lastUpdateTime:this.newsItem.lastUpdateTime
            }
            newsHandler.addRecord(param).then(() => {
                // that.$loading.hide();
                //删除成功
                this.ignoreId = [this.newsItem.articleId];
                this.showignorePopup = false;
                this.showReportPopup = false;
                extendUtils.showToast('屏蔽此条内容')
                this.$nextTick(()=>{
                    this.ignoreId = null;
                })

              
            }).catch((err) => {
                // that.$loading.hide();
                console.log(err);
            });
        },
        

        /**
         * 举报新闻
         */ 
        reportNews(){
            // let that = this;
            this.ignoreId = [this.newsItem.articleId];
            this.showignorePopup = false;
            this.showReportPopup = false;
            this.$nextTick(()=>{
                this.ignoreId = null;
            })
        },
        /**
         * 打开举报新闻界面
         */ 
        reportNewsShow(){
            this.showignorePopup = false;
            this.showMoreActionPopup = false;
            extendUtils.openPage(this.productUrl+'#/report?articleId='+this.newsItem.articleId)
            // this.showReportPopup = true;
        },
        /**
         * 更多操作
         */ 
        moreAction(type){
            if('report'==type){//举报
                this.reportNewsShow();
            }
        },
        /**
         * 记住已访问过的新闻
         */ 
        clickNews(data){
            const key = newsHandler.primaryKey+'_visited_news';
            let visitedNews = extendUtils.getSession(key);
            visitedNews = !!visitedNews ? JSON.parse(visitedNews) : [];
            visitedNews.push(data.articleId);
            this.$set(data, 'visited', true);
            extendUtils.setSession(key, JSON.stringify(visitedNews))
        },
        /**
         * 跳转搜索页面
         */ 
        goSearch(){
            extendUtils.openPage(this.productUrl+'#/search')
        },

        /**
        * 跳转到“我的”页面
        */
        goMyCenter(){
            let that = this;
            this.$moduleGate(()=>{
                extendUtils.openPage(that.productUrl+'#/personal')
            })
        },
        /**
        * 跳转到“阅览室”页面
        */
        goReadingRoom(){
            this.$moduleGate(()=>{
                extendUtils.openPage(this.productUrl+'#/readingRoom')
            })
        },
        /**
        * 跳转到编辑频道页面
        */
        goEditChannel(){
            this.$moduleGate(()=>{
                extendUtils.openPage(this.productUrl+'#/channel')
            })
        },
        //页面刷新方法
        refresh(){
            // this.activeTab(this.currTabIndex, true);
            //首页不仅要刷新还需要清空缓存，其他页面不需要清缓存，清缓存会把history栈清空，然后[路由回退]有问题
            sinosdk.sino.clearWebViewCache();
            extendUtils.reloadPage();
        },

        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            extendUtils.closePage(null, 1);                   
        },
        /**
         * 上层窗口关闭，本页面重新激活时 
         */
        onReActived(){
            sinosdk.sino.onChildWindowClose(function (res) {
                try {
                    res = extendUtils.analyzeWinCloseData(res);
                    //编辑频道窗口关闭数据
                    if(res.type=='updateChannel'){
                        let newChannelList = res.data;
                        let newTabIndex; 
                        if(res.target){
                            newTabIndex = newChannelList.findIndex(tab0=>{return tab0.categoryId == res.target.categoryId});
                        }else if(this.tabs.findIndex(tab1=>tab1.categoryId===newChannelList[newChannelList.length-1].categoryId)==-1){
                            //如果新的list最后一个标签是新增的（即不在原list中），则当前tab定位到最后
                            newTabIndex = newChannelList.length-1;
                           
                        }else{
                            newTabIndex = newChannelList.findIndex(channel=>channel.categoryId===this.tabs[this.currTabIndex].categoryId);
                            newTabIndex = newTabIndex ==-1 ? newChannelList.length-1 : newTabIndex
                        }
                        this.tabs = newChannelList;
                        //延迟更新当前tab,防止dom还未更新
                        this.$forceUpdate();
                        this.$nextTick(()=>{
                            if(newTabIndex && newTabIndex>-1||newTabIndex=='0'){
                                this.currTabIndex = newTabIndex;
                            }else if(this.currTabIndex > this.tabs.length-1){
                                this.currTabIndex = this.tabs.length-1
                            }
                            this.activeTab(this.currTabIndex, true);
                            this.$refs.swiperComp.swiper.update()
                        })
                    }
                    //定位到某个频道
                    else if(res.type=='locationChannel'){
                        let tabData = res.data;
                        let index = this.tabs.findIndex(tab1=>{return tab1.categoryId == tabData.categoryId})
                        this.clickTab(index);
                        this.currTabIndex = index;
                    }
                } catch (e) {
                    console.error(e)
                }
            }.bind(this));
        },
        /*阻止触发下拉刷新*/
        stopMescrollDown(){
            try{
                this.$refs.listTemplate[this.currTabIndex].mescroll.lockDownScroll(true);
            }catch(e){
                console.error(e);
            }
        },
        /*开始触发下拉刷新*/
        startMescrollDown(){
            try{
                this.$refs.listTemplate[this.currTabIndex].mescroll.lockDownScroll(false);
            }catch(e){
                console.error(e);
            }
        },
        /*阻止置顶轮播下拉时触发下拉刷新*/
        stopTopMescrollDown(){
            this.stopMescrollDown()
        },
        startTopMescrollDown(){
            this.startMescrollDown()
        }
    }
};
</script>
<style lang="less" scoped>
@import "~themes/default/styles/index/index.less";
</style>