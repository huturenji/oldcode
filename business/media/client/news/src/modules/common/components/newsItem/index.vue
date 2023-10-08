<template>
    <div class="newItemWrap cursorp" :class="{showWowinfo:showWowinfo}" ref="newsItemWrap" @click="goDetail()">
        <div v-if="showWowinfo">
            <div class="newItemContentOutWrap">
                <!-- 文章 -->
                <div class="newItemContentWrap newItemYlsContent" v-if="'NEWS'==newsInfo.articleType">
                    <div class="newItemContent">
                        <div class="newTitle" :class="{noMinheight:'THREE'==layoutType, visited: !!newsInfo.visited, top: !!newsInfo.showTopFlag}" v-html="setTitleHeightLight(newsInfo.title,keyword)"></div>
                        <div class="imgList" v-if="'THREE'==layoutType">
                            <template v-for="(img,ind) in images.slice(0,3)">
                                <div class="imgItem" v-if="lazyShow" :key="ind">
                                    <img class="imgItemInWrap" :src="img.url||''">
                                </div>
                                <div class="imgItem default" v-else  :key="ind"></div>
                            </template>
                        </div>
                    </div>
                    <div class="rightImg" v-if="lazyShow && 'SINGLE'==layoutType && images.length>0 && !singleHiddenImg" >
                        <!-- <div class="rightImgInWrap" :style="{backgroundImage: 'url(' + (images[0]||{}).url || '' + ')'}"></div> -->
                        <img class="rightImgInWrap" :src="(images[0]||{}).url || '' ">
                    </div>
                    <div class="rightImg default" v-if="!lazyShow && 'SINGLE'==layoutType && images.length>0 && !singleHiddenImg"></div>
                </div>
                <!-- 视频 -->
                <div class="newItemContentWrap" v-else-if="'VIDEO'==newsInfo.articleType">
                    <div class="newItemContent">
                        <div class="newTitle noMinheight" :class='{visited: !!newsInfo.visited, top: !!newsInfo.showTopFlag}' v-show="'detail'!=listItemConfig.videoType" v-html="setTitleHeightLight(newsInfo.title,keyword)"></div>
                        <div v-if='newsInfo.state=="ENABLED"' class="videoPlayWrap" :class="{nomt:'detail'==listItemConfig.videoType}">
                            <videoPlayer v-if="lazyShow" :videoSrc="autoVideoRatio.url" :domScrollTop="domScrollTop" :videoDefaultImg="videoDefaultImg" :title="'detail'==listItemConfig.videoType?newsInfo.title:''" @play="addHistory"></videoPlayer>
                            <div v-else class="videoLazyImg"></div>
                        </div>
                        <div v-else class='disable-video'>
                            <div class='icon'></div>
                            <div class='text'>该视频无法播放</div>    
                            <div class='tips'>可能被作者删除或者屏蔽</div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <!-- 不支持的类型 -->
                </div>
                <div class="newItemTipsWrap">
                    <div class="infoBarWrap">
                        <div class="infoBar">
                            <div class="top" v-if="!!newsInfo.showTopFlag">【置顶】</div>
                            <div class="auth">{{newsInfo.mediaName||newsInfo.authorName}} </div>
                            <div class="publish">{{formatMsgTime(newsInfo.lastUpdateTime, newsInfo.currentTime)}}</div>
                        </div>
                        <div class="rightAction" v-if='listItemConfig.showIgoreBtn' @click.stop="rightAction($event)">
                            <Icon type='btn_common_close' size=".18"/>
                        </div>
                    </div>
                    <div class="floatItem" v-if="!!newsInfo.readNumber">{{newsInfo.readNumber < 100?newsInfo.readNumber:'99+'}}位同事看过</div>
                </div>
                    
            </div>
            <div class="wowWrap" v-if="wowUnames.length > 0">
                <template v-if="wowUnames.length > 0">
                    <div class="wowOnlineLineWrap" v-if="!showAllwow" @click.stop="(wowUnames.length > 2 || namesTooLong)?showAllwow=true:''">
                        <Icon class="wowIcon" :type="'icon_zixun_zaiyue'" size=".32" />
                        <div class="namesWrap" ref="namesWrap">{{wowUnames.slice(0,2).join('、')}}</div>
                        <div class="tipsLine">{{((wowUnames.length < 3)?'在阅':('等'+wowUnames.length+'人在阅'))}}</div>
                        <Icon class="arrowIcon" v-if="wowUnames.length > 2 || namesTooLong" :type="'icon_common_downarrow'" size=".32" />
                    </div>
                    <div class="wowListWrap" v-else>
                        <Icon class="wowIcon" :type="'icon_zixun_zaiyue'" size=".32" />
                        <span class="textLine" v-if="showAllwow">{{wowUnames.join('、')}}</span>
                    </div>
                    <div class="cloasebut" v-if="showAllwow" @click.stop="showAllwow=false"><span>收起</span><Icon class="arrowIcon" :type="'icon_common_uparrow'" size=".32" /></div>
                </template>
            </div>
        </div>
        <div v-else>
            <div class="newItemContentOutWrap">
                <!-- 文章 -->
                <div class="newItemContentWrap" v-if="'NEWS'==newsInfo.articleType">
                    <div class="newItemContent">
                        <div class="newTitle" :class="{noMinheight:'THREE'==layoutType, visited: !!newsInfo.visited, top: !!newsInfo.showTopFlag}" v-html="setTitleHeightLight(newsInfo.title,keyword)"></div>
                        <div class="imgList" v-if="'THREE'==layoutType">
                            <template v-for="(img,ind) in images.slice(0,3)">
                                <div class="imgItem" v-if="lazyShow" :key="ind">
                                    <!-- <div class="imgItemInWrap" :style="{backgroundImage: 'url(' + img.url||'' + ')'}"></div> -->
                                    <img class="imgItemInWrap" :src="img.url||''">
                                </div>
                                <div class="imgItem default" v-else  :key="ind"></div>
                            </template>
                        </div>
                        <div class="infoBarWrap">
                            <div class="infoBar">
                                <div class="top" v-if="!!newsInfo.showTopFlag">【置顶】</div>
                                <div class="auth">{{newsInfo.mediaName||newsInfo.authorName}} </div>
                                <div class="publish">{{formatMsgTime(newsInfo.lastUpdateTime, newsInfo.currentTime)}}</div>
                            </div>
                            <div class="rightAction" v-if='listItemConfig.showIgoreBtn' @click.stop="rightAction($event)">
                                <Icon type='btn_common_close' size=".18"/>
                            </div>
                        </div>
                    </div>
                    <div class="rightImg" v-if="lazyShow && 'SINGLE'==layoutType && images.length>0 && !singleHiddenImg" >
                        <!-- <div class="rightImgInWrap" :style="{backgroundImage: 'url(' + (images[0]||{}).url || '' + ')'}"></div> -->
                        <img class="rightImgInWrap" :src="(images[0]||{}).url || '' ">
                    </div>
                    <div class="rightImg default" v-if="!lazyShow && 'SINGLE'==layoutType && images.length>0 && !singleHiddenImg"></div>
                </div>
                <!-- 视频 -->
                <div  class="newItemContentWrap" v-else-if="'VIDEO'==newsInfo.articleType">
                    <div class="newItemContent">
                        <div class="newTitle noMinheight" :class='{visited: !!newsInfo.visited,top:!!newsInfo.showTopFlag}' v-show="'detail'!=listItemConfig.videoType" v-html="setTitleHeightLight(newsInfo.title,keyword)"></div>
                        <div v-if='newsInfo.state=="ENABLED"' class="videoPlayWrap" :class="{nomt:'detail'==listItemConfig.videoType}">
                            <videoPlayer v-if="lazyShow" :videoSrc="autoVideoRatio.url" :domScrollTop="domScrollTop" :videoDefaultImg="videoDefaultImg" :title="'detail'==listItemConfig.videoType?newsInfo.title:''" @play="addHistory"></videoPlayer>
                            <div v-else class="videoLazyImg"></div>
                        </div>
                        <div v-else class='disable-video'>
                            <div class='icon'></div>
                            <div class='text'>该视频无法播放</div>    
                            <div class='tips'>可能被作者删除或者屏蔽</div>
                        </div>
                        <div class="infoBarWrap">
                            <div class="infoBar">
                                <div class="top" v-if="!!newsInfo.showTopFlag">【置顶】</div> 
                                <div class="auth" :class="{detail:'detail'==listItemConfig.videoType,isGuest:isGuest}">{{newsInfo.mediaName||newsInfo.authorName}}</div>
                                <div class="publish" v-if="'detail'!=listItemConfig.videoType||isGuest">{{formatMsgTime(newsInfo.lastUpdateTime, newsInfo.currentTime)}}</div>
                                <div class="footbarOut" v-else>
                                    <footbar :newsInfo="newsInfo" @action="footbarAction"></footbar>
                                </div>
                            </div>
                            <div class="rightAction" v-if="listItemConfig.showIgoreBtn && 'detail'!=listItemConfig.videoType" @click.stop="rightAction($event)" >
                                <Icon type='btn_common_close' size=".18"/>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <!-- 广告 -->
                <div class="newItemContentWrap" v-else-if="'AD'==newsInfo.articleType">
                    <div class="newItemContent">
                        <div class="newTitle noMinheight" v-html="setTitleHeightLight(newsInfo.title,keyword)"></div>
                        <div class="adMediaWrap">
                            <!-- <div class="adMedia" :style="{backgroundImage: 'url(' + videoDefaultImg||'' + ')'}"></div> -->
                            <img class="adMedia" :src="videoDefaultImg || ''">
                        </div>
                        <div class="infoBarWrap">
                            <div class="infoBar">
                                <div class="ad">{{newsInfo.tips}}</div>
                                <div class="auth">{{newsInfo.mediaName||newsInfo.authorName}}</div>
                                <div class="publish">{{formatMsgTime(newsInfo.lastUpdateTime, newsInfo.currentTime)}}</div>
                            </div>
                            <!-- <div class="rightAction" v-if='listItemConfig.showIgoreBtn' @click.stop="rightAction($event)">
                                <Icon type='btn_common_close' size=".18"/>
                            </div> -->
                        </div>
                    </div>
                </div>
                <div v-else>
                    <!-- 不支持的类型 -->
                </div>
            </div>
            <!-- <div class="wowWrap" v-if="showWowinfo"  @click.stop="">
                <div class="floatItem" v-if="!!newsInfo.readNumber">{{newsInfo.readNumber < 100?newsInfo.readNumber:'99+'}}位同事看过</div>
                <template v-if="wowUnames.length > 0">
                    <div class="wowOnlineLineWrap" v-if="!showAllwow" @click.stop="(wowUnames.length > 2 || namesTooLong)?showAllwow=true:''">
                        <Icon class="wowIcon" :type="'icon_zixun_zaiyue'" size=".32" />
                        <div class="namesWrap" ref="namesWrap">{{wowUnames.slice(0,2).join('、')}}</div>
                        <div class="tipsLine">{{((wowUnames.length < 3)?'在阅':('等'+wowUnames.length+'人在阅'))}}</div>
                        <Icon class="arrowIcon" v-if="wowUnames.length > 2 || namesTooLong" :type="'icon_common_downarrow'" size=".32" />
                    </div>
                    <div class="wowListWrap" v-else>
                        <Icon class="wowIcon" :type="'icon_zixun_zaiyue'" size=".32" />
                        <span class="textLine" v-if="showAllwow">{{wowUnames.join('、')}}</span>
                    </div>
                    <div class="cloasebut" v-if="showAllwow" @click.stop="showAllwow=false"><span>收起</span><Icon class="arrowIcon" :type="'icon_common_uparrow'" size=".32" /></div>
                </template>
            </div> -->
        </div>
    </div>
</template>
<script>
import videoPlayer from 'commonComp/videoPlayer/index.vue';
import footbar from 'commonComp/footbar/index.vue';
import extendUtils from 'common/lib/utils';
import newsHandler from 'common/lib/requestHandler/newsHandler';
import Icon from 'commonComp/icon';
export default {
    components: {
        videoPlayer,
        footbar,
        Icon
    },
    props: {
        listItemConfig: {//组件多种样式形态控制
            type: Object,
            default: ()=>{return {
                showIgoreBtn: false,
                videoType: 'preview'
            }}
        },
        newsInfo:{//资讯item
            type: Object,
            default: ()=>{}
        },
        showCheck:{//是否是编辑状态
            type:Boolean,
            default: false
        },
        keyword:{//搜索关键字，用于高亮显示title
            type:String,
            default:''
        },
        scrollTop:{//页面滚动高度
            type:Number,
            default:0
        },
        showWowinfo:{//是否显示在阅信息
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            domScrollTop:null,//dom距离顶部窗口的距离
            domScrollBottom:null,//dom距离底部窗口的距离
            lazyShow:false,//懒加载，滑动到可见区域再加载图片和视频
            windowH:0,//窗口的高度
            singleHiddenImg: (Math.floor(Math.random()*100) < 25) || false,//单张图片时有25%的概率不展示图片
            wowUnames:[],//wow人员名称列表
            showAllwow:false,//展示所有在阅人员
            namesTooLong:false,//在阅人名是否超长
            productUrl:location.origin+location.pathname//页面访问路径
        };
    },
    created() {
        this.initData();
        //获取窗口高度，供懒加载使用
        this.getClientHeight();
    },
    mounted(){
        this.scrollCtrl();
    },
    watch: {
        scrollTop(){
            this.scrollCtrl();
        },
        newsInfo: {
            handler(){
                let that = this;
                try{
                    if(that.showWowinfo){
                        that.getWowUnames();
                    }
                }catch(e){
                    console.error(e);
                }
            },
            deep: true
        }
    },
    computed: {
        
        /**
         * 游客
         */ 
        isGuest(){
            return authorization.isGuest()
        },
        /**
         * 图文新闻的图片
         */ 
        images(){
            return this.newsInfo ? this.newsInfo.cover : [];
        },
        /**
         * 自动选择播放的视频分辨率
         */ 
        autoVideoRatio(){
            if(this.newsInfo && this.newsInfo.video){
                //现阶段默认选择第一个分辨率的视频
                if(this.newsInfo.video.length>0){
                    return this.newsInfo.video[0];
                }
            }
            return {}
        },

        /**
         * 图文格式的新闻时，预览图的布局方式
         * @return SINGLE, THREE， 默认空
         */ 
        layoutType(){
            if(this.newsInfo.articleType=='NEWS'){
                if(this.newsInfo.cover.length==1){
                    return 'SINGLE';
                }else if(this.newsInfo.cover){
                    return 'THREE';
                }
            }
            return null;
        },

        /** 
        * 视频的背景图
        */
        videoDefaultImg(){
            if(Object.keys(this.newsInfo).length > 0 && !!this.newsInfo.cover && !!this.newsInfo.cover.length > 0 && !!this.newsInfo.cover[0].url){
                return this.newsInfo.cover[0].url;
            }
            return ""
            
        }
    },
    methods: {
        /**
         * 初始相关数据
         */
        initData() {
            let that = this;
            if(that.showWowinfo){
                that.getWowUnames();
            }
            globalBus.$on('updateArticle',(value)=>{
                if(value.newsActionData.newsUserPrivate.articleId == that.newsInfo.articleId){
                    // let data = value;
                    that.newsInfo.statistics = value.newsActionData.statistics;
                    that.getWowList(that.newsInfo.articleId)
                }
            })
            
        },
        /**
         * 页面滚动时的控制
         */
        scrollCtrl(){
            let videoDom = this.$refs.newsItemWrap;
            this.domScrollTop = videoDom.getBoundingClientRect().top;
            this.domScrollBottom = videoDom.getBoundingClientRect().bottom;
            //懒加载使用，滚动到可视区域后开始加载图片、视频
            if(this.domScrollTop < this.windowH){
                this.lazyShow = true;
            }
        },
        /**
         * 获取窗口高度
         */
        getClientHeight(){
            var clientHeight=0;
            if(document.body.clientHeight&&document.documentElement.clientHeight){
                clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
            }else{
                clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
            }
            this.windowH = clientHeight;
        },
        /**
         * 右侧功能按钮
         * event @param 元素对象
         */
        rightAction(event){
            let that = this;
            let posAndSize = {
                // x:('SINGLE'==this.layoutType && 'NEWS'==this.newsInfo.articleType && !that.singleHiddenImg) ? (event.clientX-event.offsetX+event.target.clientWidth/2):(event.clientX-event.offsetX),
                x:('SINGLE'==this.layoutType && 'NEWS'==this.newsInfo.articleType && !that.singleHiddenImg) ? (event.target.parentNode.parentNode.clientWidth):(event.target.parentNode.parentNode.clientWidth),
                y:event.clientY-event.offsetY+event.target.clientHeight,
                w:event.target.clientWidth,
                h:event.target.clientHeight,
                arrowType:('SINGLE'==this.layoutType && 'NEWS'==this.newsInfo.articleType && !that.singleHiddenImg) ? 'mid':'right'
            }
            this.$set(this.newsInfo, 'posAndSize', posAndSize);
            globalBus.$emit('ignorePopupShow',this.newsInfo)
        },
        /**
         * footBar动作
         * @param type share 、more
         */
        footbarAction(type){
            globalBus.$emit(type,this.newsInfo)
        },
        /**
         * title高亮处理
         * @param str 字符串
         * @param keyWord 高亮关键字
         */
        setTitleHeightLight(str,keyword){
            let titleText = str;
            if(''!=keyword){
                keyword = keyword.replace(/\?/, '\\\?').replace(/\+/, '\\\+').replace(/\*/, '\\\*')//处理特殊字符，防止正则报错
                titleText = titleText.replace(new RegExp(keyword, 'g'),'<span class="highlight">'+keyword+'</span>')
            }
            return titleText;
        },
        /**
         * 时间显示格式化
         * @param timespan 时间戳
         */        
        formatMsgTime (timespan, systemTime) {
            var dateTime = new Date(timespan);
            var year = dateTime.getFullYear();
            var month = dateTime.getMonth() + 1;
            var day = dateTime.getDate();
            var hour = dateTime.getHours();
            var minute = dateTime.getMinutes();
            // var second = dateTime.getSeconds();
            var milliseconds = 0;
            var timeSpanStr;
            milliseconds = systemTime - timespan;
            //1分钟内显示为刚刚
            if (milliseconds < 1000 * 60 * 1) {
                timeSpanStr = '刚刚';
            //一小时内展示为x分钟前
            }else if (1000 * 60 * 1 <= milliseconds && milliseconds < 1000 * 60 * 60) {
                timeSpanStr = Math.floor((milliseconds / (1000 * 60))) + '分钟前';
            //一天内展示为x小时前
            }else if (1000 * 60 * 60 * 1 <= milliseconds && milliseconds < 1000 * 60 * 60 * 24) {
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60)) + '小时前';
            //7天内展示为x天前
            }else if (1000 * 60 * 60 * 24 <= milliseconds && milliseconds < 1000 * 60 * 60 * 24 * 7) {
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
            //1个月内展示为x周前
            }else if (1000 * 60 * 60 * 24 * 7 <= milliseconds && milliseconds < 1000 * 60 * 60 * 24 * 30) {
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 7)) + '周前';
            //1年内展示为x月前
            }else if (1000 * 60 * 60 * 24 * 30 <= milliseconds && milliseconds < 1000 * 60 * 60 * 24 * 365) {
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 30)) + '月前';
            //1年以上展示为x年前
            }else if (1000 * 60 * 60 * 24 * 365 <= milliseconds){
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 365)) + '年前';
            //异常展示年月日
            }else {
                timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
            }
            return timeSpanStr;
        },
        /**
         * 跳转到资讯详情
         */ 
        goDetail(){
            if(this.newsInfo.state == "DISABLE"){
                extendUtils.showToast('该内容已被发布者删除');
                return;
            }
            
            //广告类型目前没有连接
            if(!!this.newsInfo.noLink){
                return;
            }

            //批量删除编辑状态、视频频道的视频不跳转
            if(!(this.showCheck || ('detail'==this.listItemConfig.videoType && 'VIDEO'==this.newsInfo.articleType))){
                extendUtils.openPage(this.productUrl+'#/article?articleId='+this.newsInfo.articleId)
            }
        },
        /**
         * 添加阅读历史
         */ 
        addHistory(){
            let that = this;
            let param = {
                companyId:newsHandler.companyId,
                channelId:newsHandler.channelId,
                userId:newsHandler.userId,
                articleId:that.newsInfo.articleId,
                type:'HISTORY',
                lastUpdateTime:that.newsInfo.lastUpdateTime
            }
            newsHandler.addRecord(param).then(() => {

            }).catch((err) => {
                console.log(err);
            });
        },
        /**
         * 异步获取用户名字
         */	
        getWowUnames(){
            let that = this;
            let wowUnames = [];
            try {
                that.newsInfo.thirdUserIds.map(async (item)=>{
                    if(!!item){
                        let uData = await sinosdk.sino.getUserInfo({UAId:item})
                        wowUnames.push(uData.uName)
                    }
                })
                that.wowUnames = wowUnames;
                setTimeout(() => {
                    that.$nextTick(()=>{
                        that.getNamesTooLong();
                    })
                }, 500);
            } catch (error) {
                
            }
        },
        /**
         * 判断名字是否超长
         */	
        getNamesTooLong(){
            let that = this;
            let res = false;
            if(that.wowUnames && that.wowUnames.length > 0){
                let dom = that.$refs.namesWrap;
                res = dom.scrollWidth > dom.clientWidth;
            }
            that.namesTooLong = res;
        },
        /** 
        * 通过articleIds查询在阅名单
        */
        getWowList(articleId){
            let that = this;
            let param = {
                companyId: newsHandler.companyId,
                channelId: newsHandler.channelId,
                userId: newsHandler.userId,
                articlesId: [articleId]
            }
            newsHandler.getWowList(param).then(async res => {
                if(res.resultCode == 0 && !!res.result){
                    that.newsInfo.thirdUserIds = res.result.articleUsers[0].thirdUserIds;
                    that.newsInfo.readNumber = res.result.articleUsers[0].readNumber || 0;
                }else{

                }
            }).catch(e => {
                console.log(e);
            })
        }
    }
};
</script>
<style lang="less" scoped>
    @import "index.less";
</style>