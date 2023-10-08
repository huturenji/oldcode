<template>
    <div>
        <div class='entryListOutWrap'> 
            <!-- banner区域 -->
            <div class="swiper-content">
                <div id="indexBg" :class="{changsha:changshaCustom}">
                    <div class='bgbar'>特价酒店</div>
                    <div class='bgTabWrap bgFlex'>
                        <div class='bgTab'>高效便捷</div>
                        <div class='bgTab'>性价比高</div>
                    </div>
                </div>
                <swiperComp ref='swiperCompRef' v-if="!changshaCustom" :list="bannerList" :swiperOptipns="swiperOptipns"/>
            </div>
            <div class="menuOutWrap" v-if="changshaCustom">
                <div class="topListGroupOutWrap">
                    <div class="topListGroupWrapBg"></div>
                    <div class="topListGroupWrap changshabg" @click="openchangshaEntry()">
                    </div>
                </div>
            </div>
            <div class="menuOutWrap" v-else>
                <!-- 顶部菜单 -->
                <div class="topListGroupOutWrap">
                    <div class="topListGroupWrapBg"></div>
                    <div class="topListGroupWrap">
                        <div class="topListWrap"> 
                            <div class="left">
                                <div class="topItem" :class="entry.className" v-for="(entry,idx) in bpentryList.leftEntryList" @click="openEntry(entry)" :key="idx" v-bind:style="{backgroundImage: 'url(' + entry.src + ')'}"></div>
                            </div>
                            <div class="right">
                                <div class="topItem" :class="entry.className" v-for="(entry,idx) in bpentryList.rightEntryList" @click="openEntry(entry)" :key="idx" v-bind:style="{backgroundImage: 'url(' + entry.src + ')'}"></div>
                            </div>
                        </div>
                        <div class="topListWrap"> 
                            <div class="topItem" :class="entry.className" v-for="(entry,idx) in bpentryList.bottomEntryList" @click="openEntry(entry)" :key="idx" v-bind:style="{backgroundImage: 'url(' + entry.src + ')'}"></div>
                        </div>
                        					
                    </div>
                </div>
                <!-- 商旅菜单 -->
                <div class="bpListGroupWrap">
                    <div class="bpListWrap" v-if="bpListGroup.length > 0">                
                        <div class="bpItem" :class="'lineItem'+entry.lineItems" v-for="(entry,idx) in bpListGroup" :key="idx">
                            <div class="textWrap icon-btn" v-bind:style="{backgroundImage: 'url(' + entry.src + ')'}" @click="openEntry(entry)">{{entry.name}}</div>   
                        </div>
                    </div>					
                </div>     
                <!-- 常用菜单 -->
                <div class="entryListGroupWrap" v-if="getChannelCtrl('used')">
                    <div class="groupTitle">{{historyListGroup.groupName}}</div>
                    <div class="entryListWrap" v-if="historyListGroup.entryList.length > 0">                
                        <div class="entryItem icon-btn" ontouchstart="" v-for="(entry,idx) in historyListGroup.entryList" :key="idx" >
                            <div class="textInWrap" @click="openEntry(entry)" v-bind:style="{backgroundImage: 'url(' + entry.src + ')'}">{{entry.name.replace(/拉钩/g, "拉勾")}}</div> 
                        </div>
                    </div>					
                </div>
                <!-- 第三方菜单 -->
                <template  v-if="getChannelCtrl('third')">
                    <div class="entryListGroupWrap" v-for="(group,index) in entryListGroup" :key="index" v-if="getChannelThirdCtrl(group.groupId)">
                        <div class="groupTitle">{{group.groupName}}</div>
                        <div class="entryListWrap" v-if="group.entryList.length > 0">                
                            <div class="entryItem icon-btn" ontouchstart="" v-for="(entry,idx) in group.entryList" :key="idx" >
                                <div class="textInWrap" @click="openEntry(entry)" v-bind:style="{backgroundImage: 'url(' + entry.src + ')'}">{{entry.name}}</div>
                            </div>
                        </div>					
                    </div> 
                </template>
            </div>
        </div>
    </div>    
</template>
<script>
    import extendUtils from 'common/lib/utils';
    import {bpAppConfig,topListGroup,entryListGroup,authTypeMap,bpListGroup,historyListGroup,channelIdCtrl,channelIdWhiteCtrl} from './js/entryEnum.js';
    const swiperComp = ()=>import('common/components/swiper/swiperComp.vue');
    import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
    export default {
        mixins: [tChatEventMixin],
    	directives: {
	    },
        components: {
            swiperComp
        },
		props:{
		},
        data() {
            return {
                bpAppConfig:bpAppConfig,//商旅商城各环境域名
                entryListGroup: entryListGroup,//菜单支持二级配置
                authTypeMap:authTypeMap,//授权类型
                bpListGroup:bpListGroup,//商旅小应用
                historyListGroup:historyListGroup,//我的常用
                bpentryList:topListGroup,//顶部菜单
                channelIdCtrl:channelIdCtrl,//渠道对于功能的控制
                channelIdWhiteCtrl:channelIdWhiteCtrl,//渠道对第三方小应用的控制
                changshaCustom:false,//是否是长沙银行用于控制定制
                bannerList:[ //首页的banner图片
                    {
                        imgUrl: require('./img/banner/bg_shangyun_banner1@2x.png'),
                    },
                    {
                        imgUrl: require('./img/banner/bg_shangyun_banner3@2x.png'),
                    },
                    {
                        imgUrl: require('./img/banner/bg_shangyun_banner4@2x.png'),
                    }
                ],
                swiperOptipns:{ //swiper的配置
                    from:'index', //该参数用来配置是哪里来的swiper配置 index代表是首页的
                    pagination: '.swiper-pagination',// 如果需要分页器
                    paginationType : 'bullets', //分页器type
                    autoplay:3000, //自动轮播事件间隔
                    loop: true, //循环轮播
                    observer:true,
                    observeParents:true,
                    slidesPerView : 1, //每页显示的数量
                    spaceBetween : 0,//slide之间的间距
                    uniqueNavElements: false, //container以外的分页器也生效了
                    autoplayDisableOnInteraction: false,//用户操作后继续自动播放
                    onInit: function(swiper){
                        //Swiper初始化了
                        //alert(swiper.activeIndex);提示Swiper的当前索引
                    },
                    onSliderMove: function(swiper, event){ //手指触碰Swiper并拖动slide时执行
                    }
                },
                authParma:{'TGC':'','ProdId':'','cpyId':'','uaId':'','appId':'','terType':''},//授权相关所需参数
                channelId:this.$route.query.ProdId || this.$route.query.channelId || '',//渠道id
            }
        },
        created() {
            //数据初始化
            this.initData();
        },
        mounted() {
        },
        methods: { 		
			/**
			 * 页面初始化
			 */	
            async initData(){
                let _this = this;
                for (var key in _this.authParma) {
                    _this.authParma[key] = this.$route.query[key] || '';
                }
                _this.getHistory();
                if(''==_this.channelId){
                    _this.channelId = await _this.getAppConfig()+'';
                    _this.changshaCustom = this.getChannelIschangsha('bdsh2');
                }else{
                    _this.changshaCustom = this.getChannelIschangsha('bdsh2');
                }
            },  	       	
			/**
			 * 渠道对于页面内容的控制
			 */	
            getChannelCtrl(type){
                let that = this;
                let contentHideType = type+'Hide';
                let res = true;
                if(!!that.channelId && !!that.channelIdCtrl && !!that.channelIdCtrl[that.channelId]){
                    if(!!that.channelIdCtrl[that.channelId][contentHideType]){
                        res = false;
                    }
                }
                return res;
            },
			/**
			 * 是否是长沙银行
			 */	
            getChannelIschangsha(){
                let that = this;
                let res = true;
                if(!!that.channelIdWhiteCtrl && !!that.channelIdWhiteCtrl['bdsh2'] && 0 < that.channelIdWhiteCtrl['bdsh2'].length){
                    res = false;
                    let channelIds = that.channelIdWhiteCtrl['bdsh2'];
                    if(!!that.channelId && that.arrhaveitem(that.channelId,channelIds)){
                        res = true;
                    }
                }
                return res;
            },
			/**
			 * 渠道对于页面第三方分类内容的控制
			 */	
            getChannelThirdCtrl(groupId){
                let that = this;
                let res = true;
                if(!!that.channelIdWhiteCtrl && !!that.channelIdWhiteCtrl[groupId] && 0 < that.channelIdWhiteCtrl[groupId].length){
                    res = false;
                    let channelIds = that.channelIdWhiteCtrl[groupId];
                    if(!!that.channelId && that.arrhaveitem(that.channelId,channelIds)){
                        res = true;
                    }
                }
                return res;
            },
            /**
            * 维数组是否包含元素
            */
            arrhaveitem(item, arr, key) {
                let _this = this;
                var isInArr = false;
                var len = arr.length;
                for (var i = 0; i < len; i++) {
                    if (!!key ? arr[i][key] == item : arr[i] == item) {
                        isInArr = true;
                        break;
                    }
                }
                return isInArr;
            },
			/**
			 * 获取常用数据
			 */	            
            getHistory(){
                let _this = this;
                let historyList = !!JSON.parse(extendUtils.getStorage('mallbbcCloudEntryHistory')) ? JSON.parse(extendUtils.getStorage('mallbbcCloudEntryHistory')) : [];
                if(0 < historyList.length){
                    _this.historyListGroup.entryList.unshift(...historyList);
                    _this.historyListGroup.entryList = _this.historyListGroup.entryList.slice(0,4);
                }else{
                    //无缓存历史的情况下将默认数据存储
                    extendUtils.setStorage('mallbbcCloudEntryHistory',JSON.stringify(_this.historyListGroup.entryList));
                }
            }, 
			/**
			 * 长沙银行打开弗兰社
			 */	 
            openchangshaEntry(){
                let _this = this;
                let entry = {name: '弗兰社', url:'/home/index',authType:'bankofchangsha',saveHistory:true,appId:268435801,unwantedTime:true};
                _this.openEntry(entry);
            },  
			/**
			 * 页面跳转
			 */	
			openEntry(entry){
                let _this = this;
                let authParam = '';
                let env = _this.GlobalConfig.RUN_ENV;
                //判空
                if(!!!entry || ''==entry.url || !!!entry.url){
                    extendUtils.showToast('连接配置错误')
                    return;
                }
                //判断授权类型
                let authType = entry.authType;
                if(_this.authTypeMap[authType].needAuth){
                    let authTypeArr = _this.authTypeMap[authType].list;
                    authTypeArr.forEach((key,index) => {
                        let str = index==0?'':'&';
                        authParam += (str+key+'='+_this.authParma[key]);
                    });
                    if(!!_this.authTypeMap[authType].addPagefrom){
                        authParam += '&pageFrom=entryList';
                    }
                }

                //判断渠道开关
                let bpApp = (_this.bpAppConfig[authType]||{})[env]||{};
                if(!!bpApp.ctrlOpen && !_this.channelFliter(bpApp,_this.channelId+'')){
                    extendUtils.showToast('程序小哥努力开发中，敬请期待...')
                    return;
                }
                //存储我的常用
                _this.setHistory(entry);
                //根据不同环境获取不同域名
                let host = '';
                //商旅和商城需要根据不同环境拼装不同的域名
                if(_this.authTypeMap[authType].needGetEnvHost){
                    host = _this.bpAppConfig[authType][env].url;
                }
                let url = host+entry.url+authParam;
                if('third'!=entry.authType && !entry.unwantedTime){
                    let date = new Date();
                    url+='&t='+date.getTime();
                }
                // ios存在bug，可用不可见的打不开
                if(!!entry.appId){
                    extendUtils.openAppletFunction({appId:entry.appId,url:url})
                }else{
                    extendUtils.openWebViewFunction({url:url}).then( e=> {
                        if(!!e && e.ret == '404'){ //如果终端不支持‘openWebViewFunction’，此时用openpage的方式打开
                            extendUtils.openPage(url);
                        }
                    })
                }
            }, 
			/**
			 * 根据渠道判断小应用是否开启
             * @param entry 连接对象
			 */	  

            channelFliter(bpApp,channelId){
                let res = false;
                if(!!channelId && ''!=channelId && !!bpApp.openByChannels && 0 < bpApp.openByChannels.length && bpApp.openByChannels.indexOf(channelId) > -1){
                    res = true;
                }
                return res;
            },
			/**
			 * 保存常用数据
             * @param entry 连接对象
			 */	            
            setHistory(entryData){
                let _this = this;
                let entry = JSON.parse(JSON.stringify(entryData));
                if(!!entry.saveHistory && entry.saveHistory){
                    let historyList = !!JSON.parse(extendUtils.getStorage('mallbbcCloudEntryHistory')) ? JSON.parse(extendUtils.getStorage('mallbbcCloudEntryHistory')) : [];
                    let index = historyList.findIndex(value => {
                        return entry.name == value.name;
                    })
                    //重复数据处理
                    if(index > -1){
                        historyList.splice(index,1);
                    }
                    entry.saveHistory = false;
                    historyList.unshift(entry);
                    historyList = historyList.slice(0,4);
                    extendUtils.setStorage('mallbbcCloudEntryHistory',JSON.stringify(historyList))
                    setTimeout(() => {
                        _this.getHistory();
                    }, 1000);
                }
            }, 
            /**
             * 异步获取渠道id
             */	
            async getAppConfig() {
                return await extendUtils.GetAppConfigFunction({'key':'tid'}).then(function(data){
                    if(!!data){
                        var jsonData = JSON.parse(data.value);
                        return jsonData;
                    }
                }).catch((err)=>{
                    return 0;
                })
            },
            /**
             * 页面刷新入口函数刷新回调
             * @param mescroll对象
             */
            refresh(mescroll){
                this.refreshClearCache();
            },
            /**
             * T信tChatEventRefresh刷新事件回调
             * 在首页注册的T信刷新事件为reload页面
             */
            refreshClearCache(){
                this.clearWebViewCache();
                // reload页面
                extendUtils.reloadPage();
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
             * T信回退事件的注册回调 必须是goBackFun
             */
            goBackFun(){
                //分享购物车回退是路由回退
                extendUtils.goBackPage('-1');
            },   
        }
    }
</script>
<style>.common-header{display:none !important} #htmlBg{display: none;}</style>
<style scoped lang="less">
@import '~businesscloudStyles/themes/default.less';
@import '~businesscloudStyles/mixins/mixinsStyle.less';
@media screen and (min-width: 550px){#indexBg {display: none;}}
.entryListOutWrap{
    .swiper-content{
        height: 3.8rem;
        position: relative;
        width: 100%;
        overflow: hidden;
        #indexBg {position: absolute;left: 0;right: 0;top: 0;height: 3.8rem;}
        #indexBg .bgFlex{display: flex;-webkit-box-align: center;align-items: center}
        #indexBg .bgbar{padding: 1.58rem .4rem 0.03rem 0.55rem;font-size: 0.46rem;color: #c2c2c2;letter-spacing: 0.08rem;}
        #indexBg .bgTabWrap{display: flex;-webkit-box-align: center;padding: 0 0.55rem;}
        #indexBg .bgTab{color: #c2c2c2;font-size: .22rem;margin-right:.24rem;}
        #indexBg.changsha{
            .bgbar,.bgTabWrap{
                display: none;
            }
            background: url('./img/banner/bg_shangyun_banner4@3x.png') no-repeat;
            background-size: 100% auto;
        }
        /deep/ .swiper-comp{
            .swiper-container{
                position: relative;
                height: 3.8rem;
                // box-shadow: 0px 0.3rem 0.3rem -0.3rem #5d5b5b;
                .swiper-pagination-content{
                    position: absolute;
                    bottom: .54rem;
                    left: 50%;
                    transform: translateX(-50%);
                    display: inline-block;
                    z-index: 99;
                    .swiper-pagination{
                        position: relative;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        padding: 0 .12rem;
                    .swiper-pagination-bullet{
                        border-radius:0.04rem;
                        width: .12rem;
                        height: .06rem;
                        display: inline-block;
                        background: rgba(255,255,255,0.6);
                        margin: 0 .04rem;
                        &.swiper-pagination-bullet-active{
                            width: .24rem;
                            background: #fff;
                            }
                        }
                    }
                }
                .swiper-slide{
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        } 
        /deep/ .swiper-pagination{
            left: 0;
            right: 0;
            .swiper-pagination-bullet{
                width: 0.24rem;
                height: 0.06rem;
                border-radius: 0.1rem;
                background:rgba(232,232,232,1);
                margin-right: 0.12rem;
                opacity: 1;
            }
            .swiper-pagination-bullet-active{
                background: #E82B29;
            }
        }
    }  
    .menuOutWrap{
        position: relative;
        top: -0.4rem;
        z-index: 1;
    }
    .topListGroupOutWrap{
        position: relative;
        padding-top:0.4rem; 
        padding-bottom:.1rem; 
        border-radius:0.3rem 0.3rem 0 0;
        .topListGroupWrapBg{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom:0.66rem;
            background: linear-gradient(180deg, #FFFFFF 0%, #FEFEFE 74%, #F6F9FD 100%);
            z-index: -1;
            border-radius: 0.3rem 0.3rem 0 0;
        }
        .topListGroupWrap{
            padding: 0 0.3rem 0.2rem;
            &.changshabg{
                margin: 0 0.3rem;
                background: url('./img/banner_fulanshe@3x.png') no-repeat;
                height: 10.72rem;
                background-size: 100% auto;
            }
            .topListWrap{  
                font-size: 0;
                .flex-box();    
                .justify-content(space-between);
                .left,.right{
                    .flex(1);
                }
                .left{
                    margin-right: 0.06rem;
                }
                .topItem{
                    background-repeat:  no-repeat;
                    background-position: center;
                    background-size: 100% 100%;
                    &.flight{
                        height: 4.06rem;
                        margin-bottom: 0.2rem;
                    }
                    &.hotel{
                        height: 2rem;
                        margin-bottom: 0.06rem;
                    }
                    &.train{
                        height: 2rem;
                        margin-bottom: 0.2rem;
                    }
                    &.jd{
                        height: 2.24rem;
                    }
                    &.suning{
                        height: 2.24rem;
                    }
                    &:active{
                        opacity: 0.7;
                    }
                    &.bbc{
                        flex: 1;
                        height: 2.06rem;
                    }
                }
            }
        }
    }
    .entryListGroupWrap{
        padding: 0.08rem 0.3rem 0.4rem 0.3rem;
        .groupTitle{
            font-size: 0.34rem;
            line-height: 0.48rem;
            color: #222;
            font-weight: 600;
            margin-bottom: 0.2rem;
        } 
        .entryListWrap{       
            background: #fff;
            box-shadow: 0 0.02rem 0.16rem 0 rgba(38, 45, 217, 0.03);
            border-radius: 0.2rem;
            .flex-box();    
            flex-wrap: wrap;  
            .entryItem{
                .flex(0 0 25%);
                font-size: 0;
                height: 2.4rem;
                padding: 0 0;
                .textInWrap{
                    height: 100%;
                    padding-top: 1.48rem;
                    line-height: 0.4rem;
                    font-size: 0.28rem;
                    color: #222;
                    text-align: center;
                    background-repeat:  no-repeat;
                    background-position: top 0.52rem center;
                    background-size: 0.72rem 0.72rem;
                }
            }
        }
    }
    .bpListGroupWrap{
        padding: 0 0.3rem 0.32rem 0.3rem;
        .bpListWrap{
            overflow: hidden;
            .flex-box();  
            flex-wrap: wrap;  
            font-size: 0;
            .bpItem{
                .flex(0 0 33.3333%);
                &.lineItemTwo{
                    .flex(1);
                }
                .textWrap{
                    padding: 0.28rem 0 0 0.3rem;
                    height: 1.28rem;
                    background-color: #fff;
                    background-repeat: no-repeat;
                    background-position: right;
                    background-size: contain;
                    line-height: 0.44rem;
                    font-size: 0.32rem;
                    color: #222;
                    font-weight: 600;
                    box-shadow: 0px 0.02rem 0.16rem 0px rgba(38, 45, 217, 0.03);
                    border-radius: 0 0.16rem 0.16rem 0;
                }
                &:nth-of-type(2),&:nth-of-type(5){
                    padding-right: 0;
                }
                &:first-child{
                    margin-right: 0.06rem;
                    .textWrap{
                        border-radius: 0.16rem 0 0 0.16rem;
                    }
                    
                }
            }
        }    
    }
}
@media screen and (min-width: 550px){
    .entryListOutWrap {
        max-width: 550px;
        margin: 0 auto;
    }
    .entryListOutWrap .topListGroupOutWrap .topListGroupWrap .topListWrap .topItem{
        width: 100%;
        &.flight{
            height: 304px;
            margin-bottom: 15px;
        }
        &.hotel{
            height: 150px;
            margin-bottom: 4px;
        }
        &.train{
            height: 150px;
            margin-bottom: 15px;
        }
        &.jd{
            height: 168px;
        }
        &.suning{
            height: 168px;
        }
        &.bbc{
            height: 164px;
        }
    }
    .bpListGroupWrap{
        .bpListWrap{
            .bpItem{
                .textWrap{
                    height: 94px;
                }
            }
        }
    } 
    .entryListOutWrap .topListGroupOutWrap .topListGroupWrap .topListWrap .left{
        margin-right: 4px;
    } 
    .entryListOutWrap .bpListGroupWrap .bpListWrap .bpItem:first-child{
        margin-right: 4px;
    } 
    .entryListOutWrap .topListGroupOutWrap .topListGroupWrap.changshabg{
        height: 855px;
    }
    .entryListOutWrap .swiper-content #indexBg.changsha{
        height: 279px;
        display: block;
    }
    /deep/.entryListOutWrap .swiper-content,.entryListOutWrap .swiper-content .swiper-comp .swiper-container{
        height: 279px;
    }
    /deep/.entryListOutWrap .swiper-content .swiper-comp .swiper-container{
        height: 279px;
    }
}
</style>