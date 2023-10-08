<template>
    <bottomSheet :options="options" @action="shareAction" @close="$emit('close','')" globalsign="share"></bottomSheet>
</template>
<script>
import bottomSheet from './bottomSheet.vue';
import {copyText, isNotEmpty} from '@/utils/common';
import shareHandler from '@/utils/shareHandler.js';
export default {
    components: {
        bottomSheet
    },
    props: {
        shareOptions: {//分享信息
            type: Object,
            default() {
                return {}
            }
        },
        needJudgeChannelSupportWechat: {//是否需要判断渠道支持微信分享 默认值是true需要 只有商品详情页面不需要判断，是一直展示的
            type: Boolean,
            defaultd: true
        },
        supportTypes:{//与app有交互的分享方式，对不同渠道或客户端进行控制
            type: Array,
            default() {
                return ['bizmate']
            }
        },
        showCopy:{//复制按钮与app无交互单独控制
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isPC:SnUtils?.isPC(),//是否是pc客户端
            inApp:SnUtils?.getBizMateVersion(),//是否在伴正事
            supportWechat:false,//渠道控制是否支持微信分享 
            judgeWhiteList:['copylink','note'],//不需要判断的白名单
            options:[//2022-7-20调整h5分享方式由sinosdk控制，supportTypes由业务侧传递
                { name:'分享给同事',type:'bizmate',imgUrl:  require('./img/icon_common_workmate@2x.png'),show: false, needJudgeInApp:true},
                { name:'微信分享',type:'wechat',imgUrl: require('./img/icon_common_wechat@2x.png'),show:false,needJudgeNotPC:true, needJudgeInApp:true},
                { name:'朋友圈分享',type:'wechatTimeline',imgUrl: require('./img/icon_common_friend@2x.png'),show: false,needJudgeNotPC:true, needJudgeInApp:true},
                { name:'复制链接',type:'copylink',imgUrl: require('./img/icon_common_link@2x.png'),show:this.showCopy},
                { name:'记事本分享',type:'note',imgUrl: require('./img/icon_common_note@2x.png'),show:false}
            ]
        };
    },
    computed:{

    },
    created(){
        this.init();
    },
    mounted(){
        this.getAppinfo()
    },
    methods: {
        /**
         * 初始化
         */        
        async init() {
            let channelOptions = await window.getChannelOptions;
            this.supportWechat = !!channelOptions.supportShareWx;
            this.options.forEach(optItem=>{
                optItem.show = this.judgeShareTypeShow(optItem);
            })
        },
        /**
         * 判断是否展示
         */        
        judgeShareTypeShow(optItem) {
            if (this.judgeWhiteList.indexOf(optItem.type)>-1){ //白名单不做判断
                return optItem.show;
            }
            if (!!optItem.needJudgeNotPC && this.isPC){ //需要判断不是pc才展示
                return false;
            }
            if (!!optItem.needJudgeInApp && !this.inApp){ //需要判断在伴正事才展示
                return false;
            }
            if ((!!this.needJudgeChannelSupportWechat && !this.supportWechat)){ //需要判断渠道是否支持微信分享 或者需要分享的功能是否是商品详情页面
                return false;
            }
            if (this.supportTypes.indexOf(optItem.type)==-1){ //需要业务侧是否支持微信分享
                return false;
            }
            return true;

        },
        /**
         * 分享界面点击动作
         */        
        shareAction(option) {
            let that = this;
            if ('copylink'==option.type){
                that.copyShare();
            } else if ('bizmate'==option.type){
                that.$moduleGate(()=>{
                    that.share(option.type);
                })
            } else {
                that.share(option.type);
            }
        },
        /**
         * 复制分享操作
         * @param data 分享的数据
         */ 
        copyShare(){
            let that = this;
            let copyStr = that.shareOptions.title+' '+that.shareOptions.link;
            copyText(copyStr);
            try {
                this.$bbcStatEvent({behaviorType:'share'});
            } catch(e) {
                console.log(e)
            }
            //分享成功关闭分享面板
            that.$emit('close','');
        },
        /**
         * 分享操作
         * @param option 分享的类型
         */ 
        async share(type){
            let that = this;
            // 调用分享的方法
            shareHandler.share(type, that.shareOptions, that.closePanel)
        },

        // 关闭分享面板
        closePanel(){
            //分享成功关闭分享面板
            this.$emit('close','');
        },

        /**
         * 获取appName和logo 在globalData里面获取
         * 
         */ 
        getAppinfo(){
            let that = this;
            if (isNotEmpty(getApp().globalData.appInfo.name)){
                that.options[0].name = getApp().globalData.appInfo.name;
            }
            if (isNotEmpty(getApp().globalData.appInfo.logo)){
                that.options[0].imgUrl = getApp().globalData.appInfo.logo;
            }           
        }
    }
};
</script>