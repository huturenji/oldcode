<template>
    <div class="videoWrap">
        <div class="videoDomWrap">
            <video
                ref="videoDom"
                :src="videoSrc"
                :volume="volume"
                :poster="videoDefaultImg"
                :autoplay="autoplay"
                :loop="loop"
                :muted="muted"
                :preload="preload"
                :width="width"
                :style="{height:height}"
                @play="playTypeUpdata(true)"
                @pause="playTypeUpdata(false)"
                @timeupdate="timeupdate"
                @canplay="initvideo"
                @volumechange="volumechange"
                @ended="ended=true"
                @waiting="videoWaiting"
                :playsinline="playsinlineTyp"
                webkit-playsinline="webkit-playsinline"
                x-webkit-airplay="allow"
                oncontextmenu="return false;"
            >您的浏览器不支持播放本视频</video>
        </div>
        <div class="videoCtrlWrap"  ref="videoCtrlDom" @click.stop="playingCtrlShowDo(2000)" @touchStart.stop="playingCtrlShowDo(2000)">
            <div class="videoTitle opacityTransition" v-show="playingCtrlShow && ''!=title" >{{title}}</div>
            <div class="playBtn opacityTransition waiting" v-show="waiting"></div>
            <div class="playBtn opacityTransition" v-show="!waiting&&(playingCtrlShow || !play)" @click.stop="playVideo" :class="{pause:play,replay:ended}"></div>
            <div class="ctrlBottomWrap opacityTransition" v-show="playingCtrlShow && !ended" @touchmove.stop="stopPropagation">
                <div class="mutedWrap" @click.stop="muted=!muted" :class="{active:muted}"></div>
                <div class="palyedTime">{{formatTime(currentTime)}}</div>
                <div class="timeCtrl">
                <range
                    :value="currentPercentage"
                    @change="rangeChange"
                    :min="0"
                    :max="100"
                    :height="0.02"
                    :step="1"
                    :btnRound="true"
                    :btnWidth=".3"
                    :btnHeight=".3"
                >
                </range>
                </div>
                <div class="videoTime">{{formatTime(duration)}}</div>
                <div class="fullScreen" @click="fullnScreen"></div>
            </div>
        </div>
    </div>
</template>
<script>
// import extendUtils from 'common/lib/utils';
import range from './range/range.vue';
export default {
    components: {
        range
    },
    props: {
        videoSrc: {//视频地址
            type: String
        },
        volume: {//音量
            type: Number,
            default: 0.5
        },
        videoDefaultImg: {//视频封面图片
            type: String,
            default: ""
        },
        title:{//新闻title
            type: String,
            default: ""
        },
        autoplay: {//是否自动播放
            type: Boolean,
            default: false
        },
        loop:{//是否循环播放
            type: Boolean,
            default: false
        },
        muted:{//是否静音
            type: Boolean,
            default: false
        },
        preload:{//是否预加载，如启用autoplay则此项设置无效
            type: Boolean,
            default: false
        },
        width:{//视频宽度
            type: String,
            default:"100%"
        },
        height:{//视频高度
            type: String
        },
        domScrollTop:{//视频组件距离窗口顶部的距离
            type: String,
            default:null
        }     
    },
    data() {
        return {
            play:false,//视频播放状态
            duration:0,//视频的总长度，单位秒
            currentTime:0,//视频播放进度，单位秒
            currentPercentage:0,//视频播放进度百分比数值
            ended:false,//视频是否播放完成
            waiting:false,//视频加载中
            timeWhenWaiting:0,//视频加载中的时间
            playingCtrlShow:true,//控件是否展示
            playsinlineTyp:'playsinline',//声明ios网页内播放
            windowH:0,//窗口的高度
            announcer:false//是否是发布广播的播放器，用于广播控制视频暂停
        };
    },
    created() {
        this.initData();
        this.getClientHeight();
    },
    mounted(){
        // this.$refs.videoDom.load()
        // this.$refs.videoDom.addEventListener('canplay', () => {
        //     this.duration = this.$refs.videoDom.duration;
        //     console.log('加载的匿名函数',this.duration);
        // })
    },
    watch: {
        domScrollTop(value,oldvalue){
            if(value<oldvalue){//往上滚
                if(-100 > value){//距离顶部100px时停止播放
                    this.$refs.videoDom.pause();
                }
            }else if(value>oldvalue){//往下滚
                if(value > (this.windowH-100)){//距离底部100时停止播放
                    this.$refs.videoDom.pause();
                }
            }
        }
    },
    methods: {
        fullScreenstopPropagation(){
            if ((document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen)||false){
                event.stopPropagation();
                return false;
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
         * 初始化组件
         */
        initData() {
            //播放控制，全局只有一个视频播放
            globalBus.$on('videoPlayTypeUpdata',()=>{
                //正在播放且不是发布广播的元素
                if(!!this.play && !!!this.announcer){
                    this.$refs.videoDom.pause();
                    this.playingCtrlShow = true;
                }
                this.announcer = false;
            })
        },
        /**
         * 初始化视频相关数据
         */
        initvideo(){
            try {
                
                this.duration = this.$refs.videoDom.duration;
            } catch (error) {

            }
        },
        /**
         * 视频播放控制
         */
        playVideo() {
            this.play = !this.play;
            if(this.play){
                this.$refs.videoDom.play();
                this.ended=false;
                this.waiting =false;
            }else{
                this.$refs.videoDom.pause();
            }
        },
        /**
         * 进度切换控制
         */
        rangeChange(value){
            this.$refs.videoDom.currentTime = this.duration*value/100;
            this.waiting =false;
            try {
                event.stopPropagation();
            } catch (error) {

            }
        },
        /**
         * 进度切换控制
         */
        stopPropagation(){
            try {
                event.stopPropagation();
            } catch (error) {

            }
        },

        /**
         * 播放时间变化
         */
        timeupdate(){
            this.currentTime = this.$refs.videoDom.currentTime;
            this.currentPercentage = (this.currentTime/this.duration)*100;
            if(this.timeWhenWaiting != this.currentTime){
                this.waiting = false;
            }
        },
        /**
         * 播放时间显示格式化
         */
        formatTime(seconds){
            return new Date(parseInt(seconds*1000)).format('mm:ss')
        },
        /**
         * 视频元素原生播放事件
         * @param type 播放或暂停true/flase
         */
        playTypeUpdata(type){
            let that = this;
            this.play = type;
            
            //广播视频播放状态，携带videoSrc用来控制播放和暂停
            if(!!type){
                that.ended=false;
                that.playingCtrlShowDo(0);
                that.announcer = true;
                globalBus.$emit('videoPlayTypeUpdata',this.videoSrc);
                that.$emit('play','');
            }else{
                that.$emit('pause','');
            }
        },
        /**
         * 视频全屏模式
         */
        fullnScreen(){
            let that = this;
            // this.$refs.videoDom.webkitRequestFullScreen();
            let el = this.$refs.videoDom || document;
            if (el.requestFullscreen) {//ios
                el.requestFullscreen();
                return;
            } else if (el.webkitRequestFullscreen) {//android
                el.webkitRequestFullscreen();
                return;
            } else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
                return;
            } else if (el.msRequestFullscreen) {
                el.msRequestFullscreen();
                return;
            } else if (el.oRequestFullscreen) {
                el.oRequestFullscreen();
                return;
            }
            //ios视频全屏
            that.$refs.videoDom.webkitEnterFullScreen();
            return;
            
            // extendUtils.showToast('该浏览器不支持全屏播放')
        },
        /**
         * 全屏模式下同步书否静音
         */
        volumechange(){
            this.muted = this.$refs.videoDom.muted;
        },
        /**
         * 视频加载中
         */
        videoWaiting(){
            this.timeWhenWaiting = this.$refs.videoDom.currentTime;
            this.waiting = true;
        },
        /**
         * playing过程中控制组件显隐
         */
        playingCtrlShowDo(delay){
            let that = this;
            if(!that.play){
                return
            }
            clearTimeout(that.setTime)
            this.playingCtrlShow = true;
            that.setTime = setTimeout(() => {
                if(that.play){
                    this.playingCtrlShow = false;
                }
            }, delay);
        }
    }
};
</script>
<style lang="less">
@import '~newsStyles/themes/default.less';
@import '~newsStyles/mixins/mixinsStyle.less';
.videoWrap{
    position: relative;
    .videoDomWrap{
        background: #000;
        border-radius: 0.12rem;
        overflow: hidden;
        font-size: 0;
        video{
            width: 100%;
            max-width: 100% !important;
            max-height: 3.88rem;
            border-radius: 0.12rem;
            overflow: hidden;
        }
    }
    .videoCtrlWrap{
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 1;
        transform: translateZ(10px);
        .videoTitle{
            .line-clamp(2);
            font-size: 0.34rem;
            line-height: 0.44rem;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            height:1.46rem;
            background:linear-gradient(180deg,rgba(0,0,0,0.79) 0%,rgba(0,0,0,0) 100%);
            color: @sub-background-color;
            padding: 0.16rem 0.3rem 0;
            border-radius: 0.12rem;
        }
        .playBtn{
            position: absolute;
            left: 50%;
            top: 50%;
            margin: -25px 0 0 -25px;
            width: 50px;
            height: 50px;
            background-image: url(img/icon_zixun_bofang.svg);
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
            transition: visibility 0s, opacity 0s;
            transition-delay:0s;
            transform: translateZ(10px);
            &.pause{
                background-image: url(img/icon_zixun_zanting.svg);
            }
            &.replay{
                background-image: url(img/icon_zixun_chongbo.svg);
            }
            &.waiting{
                animation: cricleLoading 1s steps(12, end) infinite;
                background: transparent url(img/icon_mall_jiazai.svg) no-repeat center;
                background-size:22px 22px;
            }
        }
        .ctrlBottomWrap{
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 0 0.08rem ;
            z-index: 2;
            .flex-box();
            .align-items(center);
            .justify-content(space-between);
            background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.79) 100%);
            border-radius: 0.12rem;
            .mutedWrap{
                width: 0.52rem;
                height: 0.92rem;
                background: url(img/icon_zixun_yangshengqi.svg) no-repeat center;
                background-size: 0.36rem 0.36rem;
                &.active{
                    background: url(img/icon_zixun_yangshengqi_jinyin.svg) no-repeat center;
                    background-size: 0.36rem 0.36rem;
                }
            }
            .palyedTime{
                margin-right: 0.16rem;
                font-size: 0.24rem;
                line-height: 0.92rem;
                color: @sub-background-color;
            }
            .timeCtrl{
                .flex(1);
                margin-right: 0.16rem;
                /deep/ .videoTimeRange{
                    &.vux-range-input-box{
                        margin-right: 0 !important;
                        margin-left: 0 !important;
                        .range-bar{
                            .range-handle{
                                // height: 14px;
                                // width: 14px;
                                transform: scale(0.5);
                                transition: all 0.5s ease 0s;
                            }
                            .range-min,.range-max{
                                display: none;
                            }
                            .range-quantity{
                                background-color:@theme-color;
                                transition: all 0.5s ease 0s;
                            }
                        }
                    }
                }

            }
            .videoTime{
                font-size: 0.24rem;
                line-height: 0.92rem;
                color: @sub-background-color;
            }
            .fullScreen{
                width: 0.52rem;
                height: 0.92rem;
                background: url(img/icon_zixun_zuidahua.svg) no-repeat center;
                background-size: 0.36rem 0.36rem;
            }
        }
    }
}
.opacityTransition{
    transition: all 0.5s;
}
@-webkit-keyframes cricleLoading {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
@keyframes cricleLoading {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
@media screen and (min-width: @screen-sm) {
    .videoWrap{
        .videoDomWrap{
            video{
                max-height: 388px;
            }
        }
    }    
}
</style>