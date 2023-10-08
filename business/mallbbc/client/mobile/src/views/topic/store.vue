<template>
    <view class="container" :key="topic_id">
        <!-- #ifdef H5-->
        <home-deco :deco_info="deco_data" ref="homeDecoComp" :defaultScrollView='defaultScrollView' :is_show_top="false" :topic_name="topic_name" :is_from_found="false" :isPageShowCart="true" isPageShowTop></home-deco>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN||APP-PLUS -->
        <home-deco :deco_info="deco_data" :defaultScrollView='defaultScrollView' :is_show_top="false" :topic_name="topic_name" :is_from_found="true" :isPageShowCart="true" isPageShowTop></home-deco>
        <!-- #endif -->
    </view>
</template>

<script>
import HomeDeco from '@/components/decorate'
// import {disableIosBounce} from "@/common/mixin/bounceMixin";
import shareHandler from '@/utils/shareHandler.js';
import decorateHandler from '@/components/decorate/handler';
import {handleBpParam,setShareUrl} from '@/utils/common.js'
export default {
    // mixins:[disableIosBounce],
    data() {
        return {
            defaultScrollView: document,
            deco_data:null,
            topic_id:this.$Route.query.id, //专题id
            shareChannelId: '',
            channelId: '', // url中的渠道id
            shareLink:true,//分享装修页面是链接还是图片，true为链接，false为图片，专题页配置，默认为true
            topic_name:'', //专题名称
            client:'', //客户端类型
            bpparam:null
        };
    },
    components: {
        HomeDeco
    },

    mounted(){
        if (handleBpParam(this)?.channelId) {
            this.channelId = handleBpParam(this).channelId
        }
        this.topic_id = this.$Route.query.id
        this.storeId = this.$Route.query.storeId
        this.loadData(this.storeId);

    },
    onShow() {
        //页面再次打开时注册转发信息
        if ('' != this.topic_name){
            this.setThirdShare(this.shareLink);
        }
    },
    onPageScroll(){
        
    },
    onReachBottom(){
        uni.$emit('reachBottom');
    }, 
    methods: {
        /**
             * 请求静态数据只是为了代码不那么乱
             * 分次请求未作整合
             */
        async loadData(id) {
            uni.showLoading()
            let param = {
                storeId: id,
                os: 'h5'
            }
            let config = {};
            if (this.channelId) {
                param.channelId = this.channelId
            }
            decorateHandler.getsellerIndexDeco(param,config).then(async res => {
                if (res.state == 200) {
                    uni.hideLoading()
                    if (res.data==null){
                        this.deco_data = []
                        return
                    }
                    if (res.data.data != ''){
                        this.deco_data = JSON.parse(res.data.data);
                    } else {
                        this.deco_data = []
                    }
                    this.topic_name = res.data.showName || res.data.name;
                    this.deco_data.forEach(item => { //shareLink支持分享链接
                        if (item.type === 'share') {
                            this.shareLink = item.props.shareLink;
                        }
                    })

                    this.setThirdShare(this.shareLink);
                    uni.setNavigationBarTitle({
                        title: this.topic_name
                    })
                    uni.hideLoading()
                }
            })
        },
        /**
         * setThirdShare
         */
        async setThirdShare(shareLink){
            //2022-10-28装修页面配置页面是否支持分享链接
            if (false===shareLink){ //装修页配置不分享链接
                shareHandler.cancelBizmateShare();
            } else {
                // #ifdef H5
                //设置第三方（微信、朋友圈等）分享信息
                let location = window.location;
                let locationHref = location.href;
                let callBackUrl = locationHref
                this.shareChannelId = await sinosdk.sino.getChannelId()
                if (setShareUrl(callBackUrl,this.shareChannelId)) {
                    callBackUrl = setShareUrl(callBackUrl,this.shareChannelId)
                }
                let shareInfo = {
                    title:this.topic_name, // 分享标题 
                    desc:'这些商品太值了，手慢无，点击查看', // 分享描述   
                    link:callBackUrl, // 分享链接    
                    imgUrl: require('../../static/shared/user/logo.png') // 分享图标,图片绝对地址 
                }
                //设置二次分享
                shareHandler.setThirdShareInfo(shareInfo);
                // #endif
            }

        }
    }
}
</script>

<style lang="scss">
//document不可滚动，至少从装修容器这一级才可滚动
page{
    // height: 100%;
    // overflow: hidden;
}
.container{
    // height: 100%;
}
</style>
