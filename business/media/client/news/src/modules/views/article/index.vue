<template>
    <div class="articleWrap">
        <!-- 新闻详情的骨架图 -->
        <template v-if="showSkeleton"> 
            <detailSkeleton />
        </template>

        <template v-else>
            <emptyPage  v-if="showEmpty" :tips='emptyTip'/>
            <template v-else>
                <iframe v-if="checkUrl(articleDate.news)" ref="Iframe" :src="articleDate.news" frameborder="0" width="100%" height="100%" style="overflow-y: auto;padding-bottom: 1.3rem;"></iframe>
                <!-- <iframe ref="Iframe" src="https://baijiahao.baidu.com/s?id=1708203553238984522&wfr=spider&for=pc" frameborder="0" width="100%" height="100%" style="overflow-y: auto;padding-bottom: 1.3rem;"></iframe> -->
                <div class="articleContentWrap" v-else>
                    <div class="contentOutWrap" >
                        <div class="title">{{articleDate.title}}</div>
                        <div class="authWrap">
                            <div class="authName">{{articleDate.mediaName||articleDate.authorName}}</div>
                            <!-- 资讯编辑没有映射mediaName,现阶段判断没有mediaName就展示authorName -->
                            <div class="publishTime">{{formatMsgTime(articleDate.lastUpdateTime, articleDate.currentTime)}}</div>
                        </div>
                        <div v-if="'NEWS'==articleDate.articleType" class="content" v-html="articleDate.news"></div>
                        <videoPlayer v-else :videoSrc="autoVideoRatio.url" :videoDefaultImg="videoDefaultImg"></videoPlayer>
                        <div class="recommendWrap" v-if="0 < recommendWrap.length">
                            <template v-for='item in recommendWrap'>
                                <newsItem class='newsItem' ref='newsItem'
                                    :key = "item.articleId"
                                    :newsInfo="item"
                                ></newsItem>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </template>
        <!--footbar-->
        <div class="footBarOutWrap pcDialog" v-if="showFootBar">
            <detailsFootbar :newsInfo="articleDate" @action="footbarAction" :barType="true" @newsUpadta="newsUpadta"></detailsFootbar>
        </div>
        <!--举报界面-->
        <div v-transfer-dom>
            <popup v-model="showReportPopup" position="right" width="100%" is-transparent>
                <reportPop @reportDone="reportNews" :newsItem="articleDate" :showReportPopup="showReportPopup"></reportPop>
            </popup>
        </div>    
        <!--分享-->
        <div v-transfer-dom>
            <popup v-model="showSharePopup" position="bottom" height="auto" width="100%" class="radiusTop">
                <share @close="showSharePopup=false" :newsItem="articleDate"></share>
            </popup>
        </div>     
        <!--more-->
        <div v-transfer-dom>
            <popup v-model="showMoreActionPopup" position="bottom" height="auto" width="100%" class="radiusTop">
                <moreAction @close="showMoreActionPopup=false" @moreAction="moreAction" :newsItem="articleDate"></moreAction>
            </popup>
        </div>
        <!--图片详情-->
    <div v-transfer-dom>
        <previewer :list="imgList" ref="previewer" :options="options"></previewer>
    </div>
    </div>    
</template>
<script>
import extendUtils from 'common/lib/utils';
import newsHandler from 'common/lib/requestHandler/newsHandler';
import shareHandler from 'common/lib/requestHandler/shareHandler';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import { Popup , TransferDom , Previewer } from 'vux';
import { detailSkeleton } from 'commonComp/skeleton';//新闻详情页的骨架图
import {mapGetters} from 'vuex'
import constant from 'common/config';
const videoPlayer = ()=>import('commonComp/videoPlayer');
const newsItem = ()=>import('commonComp/newsItem');
const emptyPage = ()=>import('commonComp/emptyPage');
// const footbar = ()=>import('commonComp/footbar');
const detailsFootbar = ()=>import('commonComp/detailsFootbar');
const reportPop = ()=>import('commonComp/reportPop');
const share = ()=>import('commonComp/share');
const moreAction = ()=>import('commonComp/moreAction');
export default {
    mixins: [tChatEventMixin],
    directives: {TransferDom},
    components:{
        videoPlayer,
        newsItem,
        // footbar,
        detailsFootbar,
        Popup,
        Previewer,
        reportPop,
        share,
        moreAction,
        detailSkeleton,
        emptyPage
    },
    data() {
        let that = this;
        return Object.assign(extendUtils.stateManager.setData([
            {
                name: 'showReportPopup',//举报界面
                show:{
                    title:'举报内容' 
                },
                hide:{
                    title:'详情'
                }
            },
            {
                name: 'showSharePopup'//分享界面
            },
            {
                name: 'showMoreActionPopup'//moreAction界面
            }
        ], that), {
            articleDate:{},//新闻详情
            recommendWrap:[],//推荐新闻数据 TODO 暂不实现
            articleId:this.$route.query.articleId,//新闻id
            showSkeleton: true,//骨架图显示
            guestToken: null,
            emptyTip: '暂无内容',
            imgList:[],//图片list
            options: {//图片展示插件
                tapToToggleControls: false,
                fullscreenEl: false,
                zoomEl: false,
                // shareEl: extendUtils.isPC(),
                shareEl: false,
                shareButtons: [
                    {id: 'download', label: '保存图片', url: '{{raw_image_url}}', download: true}
                ],
                counterEl: true,
                preloaderEl: false,
                captionEl: false,
                getThumbBoundsFn (index) {
                    let thumbnail = document.querySelectorAll('img')[index]
                    let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                    let rect = thumbnail.getBoundingClientRect()
                    return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
                }
            },
            imgListIndex:0,
            imgUrl:""
        })
        
    },
    async created(){
        this.initData();
        
    },
    mounted() {
        /**
         * 点击图片动作
         */   
        window.showImg = (e)=>{
            this.imgList.forEach((item,i) => {
                if(e.src == item.src){
                    this.imgListIndex = i
                }
            })
            this.$refs.previewer.show(this.imgListIndex)
        }
    },
    computed: {
        ...mapGetters(['getRole']),
        showFootBar(){
            return !this.showSkeleton && !this.showEmpty
        },
        /**
         * 自动选择播放的视频分辨率
         */ 
        autoVideoRatio(){
            if(this.articleDate && this.articleDate.video){
                //现阶段默认选择第一个分辨率的视频
                if(this.articleDate.video.length>0){
                    return this.articleDate.video[0];
                }
            }
            return {}
        },
        /** 
        * 是否显示缺损页
        */
        showEmpty(){
            return !this.articleDate || Object.keys(this.articleDate).length <= 0;
        },

        /** 
        * 视频的背景图
        */
        videoDefaultImg(){
            if(Object.keys(this.articleDate).length > 0 && !!this.articleDate.cover && !!this.articleDate.cover.length > 0 && !!this.articleDate.cover[0].url){
                return this.articleDate.cover[0].url;
            }
            return ""
            
        }
    },
    beforeRouteLeave(to,from,next){
        shareHandler.cancelBizmateShare();
        next()
    },
    methods: {
        /**
         * 初始换相关数据
         */
        initData(){
            let that = this;
            that.getNewsDetail();
            //暂无推荐新闻
            // that.getrecommendNewsList();
        },
        /**
         * 获取资讯详情
         */        
        getNewsDetail(requestHeader){
            let that = this;
            that.showSkeleton = true;
            newsHandler.getNewsDetail({articleId: this.articleId}, requestHeader).then((res) => {
                that.showSkeleton = false;
                if(res.resultCode == 0 && !!res.result){
                    that.articleDate = res.result;
                    
                    
                    //分享出去的不做记录
                    if(!authorization.isGuest()){
                        that.addHistory();
                    }
                    //注册微信分享信息
                    //设置第三方分享信息
                    that.setThirdShare(requestHeader);
                    //获取图文资讯中的图片列表
                    if(!!that.articleDate.news){
                        that.articleDate.news = that.articleDate.news.replace(/<img/g,'<img class="pswp--zoom-allowed" onclick="showImg(this)"');
                        let imgReg = /<img.*?(?:>|\/>)/gi ;//匹配图片中的img标签
                        let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配图片中的src
                        let arr = that.articleDate.news.match(imgReg) || []; //筛选出所有的img标签 list
                        let srcarr = [];
                        for (let i = 0; i < arr.length; i++) {
                            let src = arr[i].match(srcReg)
                            // 拼装图片list
                            let obj = {
                                src: src[1]
                                // w: 600,
                                // h: 400
                            }
                            srcarr.push(obj);
                        }
                        that.imgList = srcarr;
                    }
                }
            }).catch((err) => {
                console.log(err);
                that.showSkeleton = false;
                if(err.resultCode=='81100002'){
                    that.emptyTip = '该内容已被发布者删除'
                }
            });
        }, 
        /**
         * setThirdShare
		 * @param {obj} requestHeader 游客请求数据的header
         */
        setThirdShare(requestHeader){
            let that = this;
            //设置第三方（微信、朋友圈等）分享信息
            // let imgUrl = that.articleDate.cover[0].url||'';
            let imgUrl = that.articleDate.cover[0]?that.articleDate.cover[0].url:'';
            let location = window.location;
            let channelId = newsHandler.channelId || that.$route.query.channelId;
            let shareLink = location.origin + location.pathname + "#/shareArticle?articleId="+that.articleDate.articleId+"&pageFrom=share"+"&channelId="+channelId;
            let shareInfo = {
                title:that.articleDate.title, // 分享标题 
                desc:that.articleDate.title, // 分享描述   
                link:shareLink, // 分享链接  
                imgUrl:imgUrl // 分享图标,图片绝对地址 
            }
            shareHandler.setThirdShareInfo(shareInfo,requestHeader);
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
                articleId:that.articleDate.articleId,
                type:'HISTORY',
                lastUpdateTime:that.articleDate.lastUpdateTime
            }
            newsHandler.addRecord(param).then(() => {

            }).catch((err) => {
                console.log(err);
            });
        },
        /**
         * 获取推荐资讯
         */        
        getrecommendNewsList(){
            let that = this;
            newsHandler.getrecommendNewsList({}).then((res) => {
                that.recommendWrap = that.getArrItem(res.result.data,2);
            }).catch((err) => {
                console.log(err);
            });
        },
        /**
         * footBar动作
         * @param type share 、more
         */
        footbarAction(type){
            let that = this;
            if('share'==type){//分享
                if(this.getRole == constant.ROLE.USER){
                    // 调用APP分享
                    sinosdk.sino.sharePanel({}).then((res)=>{
                        if(res.ret == "404"){
                            that.showSharePopup = true;
                        }
                    }).catch((err) => {
                        console.log(err);
                        that.showSharePopup = true;
                    });
                }else{
                    that.showSharePopup = true;
                }

                // that.showSharePopup = true;
            }else if('more'==type){//more
                that.showMoreActionPopup = true;
            }
        },
        /**
         * 更多操作
         * @param type report
         */ 
        moreAction(type){
            if('report'==type){//举报
                this.showMoreActionPopup = false;
                this.showReportPopup = true;
            }
        },
        /**
         * 屏蔽新闻
         */ 
        reportNews(){
            this.showReportPopup = false;
        },
        /**
        从数组中随机抽取数据 2016-09-09
        **/
        getArrItem(arr, num) {
            var temp_array = new Array();
            for (var index in arr) {
                temp_array.push(arr[index]);
            }
            var return_array = new Array();
            for (var i = 0; i < num; i++) {
                if (temp_array.length > 0) {
                    var arrIndex = Math.floor(Math.random() * temp_array.length);
                    return_array[i] = temp_array[arrIndex];
                    temp_array.splice(arrIndex, 1);
                } else {
                    break;
                }
            }
            return return_array;
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
         * 获取随机字符串
         * @param length 长度
         */	
        randomString(length) {  
            let e = length || 32;
            var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
                a = t.length,
                n = '';
            for (let i = 0; i < e; i++) {n += t.charAt(Math.floor(Math.random() * a))}
            return n;
        },
        encodeUTF8(s) {
            var i, r = [], c, x;
            for (i = 0; i < s.length; i++)
            {if ((c = s.charCodeAt(i)) < 0x80) {r.push(c);}
            else if (c < 0x800) {r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));}
            else {
                if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
                {c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000;
                    r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));}
                else {r.push(0xE0 + (c >> 12 & 0xF));}
                r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
            }}
            return r;
        },
        // 字符串加密成 hex 字符串
        sha1(s1) {
            let that = this;
            var data = new Uint8Array(that.encodeUTF8(s1))
            var i, j, t;
            var l = ((data.length + 8) >>> 6 << 4) + 16, s = new Uint8Array(l << 2);
            s.set(new Uint8Array(data.buffer)); s = new Uint32Array(s.buffer);
            for (t = new DataView(s.buffer), i = 0; i < l; i++){s[i] = t.getUint32(i << 2);}
            s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
            s[l - 1] = data.length << 3;
            /* eslint-disable */
            var w = [], f = [
                    function () { return m[1] & m[2] | ~m[1] & m[3]; },
                    function () { return m[1] ^ m[2] ^ m[3]; },
                    function () { return m[1] & m[2] | m[1] & m[3] | m[2] & m[3]; },
                    function () { return m[1] ^ m[2] ^ m[3]; }
                ], rol = function (n, c) { return n << c | n >>> (32 - c); },
                k = [1518500249, 1859775393, -1894007588, -899497514],
                m = [1732584193, -271733879, null, null, -1009589776];
            m[2] = ~m[0], m[3] = ~m[1];
            for (i = 0; i < s.length; i += 16) {
                var o = m.slice(0);
                for (j = 0; j < 80; j++)
                {w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
                t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
                m[1] = rol(m[1], 30), m.pop(), m.unshift(t);}
                for (j = 0; j < 5; j++){m[j] = m[j] + o[j] | 0;}
            }
            t = new DataView(new Uint32Array(m).buffer);
            for (var i = 0; i < 5; i++){m[i] = t.getUint32(i << 2);}

            var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
                return (e < 16 ? '0' : '') + e.toString(16);
            }).join('');
            return hex;
            /* eslint-enable */
        },
        /**
         * footbar数据更新
         */
        newsUpadta(data){
            this.newsActionData = data;
        },
        /**
         * T信刷新事件的注册
         */
        // refresh(){
        //     this.initData()
        // },
        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            let loadData = {
                type: 'updateArticle',
                data: {
                    newsActionData:this.newsActionData
                }
            };
            loadData = JSON.stringify(loadData);
            extendUtils.closePage('', 1, loadData);  
        },
        /**
         * 检查是否是外部链接
         */
        checkUrl(url){
            var strRegex = '^((https|http|ftp|rtsp|mms)?://)' 
                + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@ 
                + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 
                + '|' // 允许IP和DOMAIN（域名） 
                + '([0-9a-z_!~*\'()-]+.)*' // 域名- www. 
                + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名 
                + '[a-z]{2,6})' // first level domain- .com or .museum 
                + '(:[0-9]{1,4})?' // 端口- :80 
                + '((/?)|' // a slash isn't required if there is no file name 
                + '(/[0-9a-zA-Z_!~*\'().;?:@&=+$,%#-]+)+/?)$'; 
            var re=new RegExp(strRegex); 
            if(!url){
                return false
            }
            return re.test(url);
            
            
        }
    }
};
</script>
<style lang="less">
    @import "~themes/default/styles/article/article.less";
</style>