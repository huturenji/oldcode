<template></template>
<script>
import {
    mapGetters
} from 'vuex';
import cart from '@/components/decorate/cart/cart.vue';
import shareHandler from '@/utils/shareHandler.js';
import { setSession, getSession, getUserKey, handleBpParam, setShareUrl } from '@/utils/common';
import DB from '@/utils/indexDB'
import decorateHandler from '@/components/decorate/handler';
export default {
    mixins:[],
    data() {
        return {
            deco_data: null,
            topic_id:1, //专题id
            topicKey:'famouseId',//页面key
            topic_name:'', //专题名称
            client:'', //客户端类型
            loading:false,//数据加载中
            shareChannelId:'',//渠道id
            decoInfo:[],//页面装修数据
            showCartThumb:false,//是否显示购物车按钮
            requestDecoIndex:0,//请求次序索引
            decoInfoSetStorage:true, //页面数据是否存缓存
            showBackBtn: false, //TODO
            sessionKey: '',
            sessionChannelKey: 'channelId',
            channelId: '', // url中的渠道id，分享时用到
            userKey: getUserKey(),
            isDecoReady: false, // 用于装修数据是否请求完成
            bpparam:null
        };
    },
    components: {
        /* eslint-disable */
        cart
        /* eslint-enable */
    },
    //全局配置
    computed: {
        ...mapGetters(['disabledModule'])
    },
    mounted() {     
        this.initPage();
    },
    activated() {
        //防止tabbar快速切换时loading消失
        if (this.loading){
            uni.showLoading()
        }
        //页面再次打开时注册转发信息
        if ('' != this.topic_name){
            this.setThirdShare();
        }
    },
    methods: {
        // 页面初始化
        initPage(){
            // #ifdef H5
            window.onTabBarLoad?.then(bar=>{
                this.sessionKey = 'bbc' + this.topicKey + 'topicId'; //初始化缓存的key
                this.sessionChannelKey = 'bbc' + this.topicKey + 'channelId'; //初始化缓存的key
                //url上是否携带装修id，存储缓存并从缓存取，兼容页面返回时的场景
                if (!!this.$Route.query.topicId && '' != this.$Route.query.topicId){
                    setSession(this.sessionKey, this.$Route.query.topicId);
                }
                if (!!getSession(this.sessionKey)){
                    this.topic_id = getSession(this.sessionKey);
                } else {
                    this.topic_id = bar.getTabbarItem().topicId;
                }

                //url上是否携带渠道id，存储缓存并从缓存取，兼容页面返回时的场景
                if (handleBpParam(this)?.channelId){
                    setSession(this.sessionChannelKey, handleBpParam(this).channelId);
                }
                if (!!getSession(this.sessionChannelKey)){
                    this.channelId = getSession(this.sessionChannelKey);
                } else {
                    this.channelId = undefined
                }
                this.getDecoInfo();
            }); 
            // #endif

            // #ifdef MP-WEIXIN
            this.getDecoInfo();
            // #endif
        },

        //获取装修数据
        async getDecoInfo(){
            let that = this;
            if (this.topic_id == 'user' || this.topic_id == ''){ //如果是我的页面 此时不去请求装修数据
                this.deco_data = []
                return
            }
            let tempData = {};

            let decoKey = 'bbcDecoInfoplus_' + that.topic_id
            if (that.decoInfoSetStorage && !!await DB.getOne('DecoInfo', decoKey, this.userKey)) {
                tempData = await DB.getOne('DecoInfo', decoKey, this.userKey);
                if (!!tempData && tempData != '' && !!tempData.data) {
                    const deco_data = JSON.parse(tempData.data || "[]")
                    // 判断缓存有数据并且数据为重构后的数据结构, 才进行数据渲染
                    if (deco_data.length > 0 && !Object.prototype.hasOwnProperty.call(deco_data[0], 'is_show')) {
                        that.afterGetDecoInfo(tempData);
                    }
                }
                //有缓存的情况下取最新数据更新缓存和数据
                that.getDecoInfoRequest(true);
            } else {
                let data = await that.getDecoInfoRequest();
                if (!!data){
                    tempData = data;
                    that.afterGetDecoInfo(tempData, true);
                } else {
                    that.deco_data = [];
                }
            }
        },
        /**
             * 请求装修数据之后的操作
             * @param Obj 装修页数据
             * @param flag 是否需要更新商品数据，因为装修的涉及商品的卡片是需要调取接口更新的
             */
        async afterGetDecoInfo(tempData, flag=false){
            // 如果是接口返回的数据，将状态修改为true
            if (flag) { this.isDecoReady = true }
            
            let that = this;
            if (!!tempData && tempData!='' && !!tempData.data){
                // 判断装修数据是否为新数据结构， 装修组件直接含有is_show的为旧数据结构，如果是旧的，则不使用缓存数据
                that.deco_data = JSON.parse(tempData.data || "[]")

                // 调取主组件页面的更新商品信息的方法
                await that.$nextTick()
            } else {
                that.deco_data = [];
            }
            that.showCartThumb = that.deco_data.some(item => item.type === 'cart' && item.props.showCart)
            //装修页面名称修改为showName，兼容显示name
            that.topic_name = tempData.showName || tempData.name;
            uni.setNavigationBarTitle({
                title:that.topic_name
            })
            //将title存储到缓存中，页面回退后取出赋值 WEBOA场景下使用todo删除
            if(sinosdk.sino.getPlatform()==sinosdk.sino.constant.RUN_ENV.WEBOA){
                if(this.$route.path=='/pages/tabbar/services'||this.$route.path=='/pages/tabbar/personalcenter'){
                    uni.setStorageSync('weboa_topic_title',that.topic_name)//设置title有问题，需要在路由处设置
                }    
            }
            this.setThirdShare();
            // #ifdef H5
            //清除首页html骨架图
            if (!!document.getElementById('htmlBg')){
                document.getElementById('htmlBg').style.display = 'none';
            }
            // #endif
        },
        /**
         * 请求静态数据只是为了代码不那么乱
         * @param  boolean 是否刷新页面数据
         */
        getDecoInfoRequest(refreshPage=false) {
              
            let that = this;
            let requestDecoIndex = ++that.requestDecoIndex;
            return new Promise(async (resolve)=>{
                this.loading = true;
                if (!refreshPage){
                    uni.showLoading()
                }
                let param = {
                    decoId: that.topic_id,
                    type: 'topic'
                }
                let config = {};
                if (this.channelId) {
                    param.channelId = this.channelId
                }
                decorateHandler.getTopicDeco(param,config).then(async res => {
                    this.loading = false;
                    uni.hideLoading();
                    if (res.state == 200 && res.data.data != '') {
                        //最后一次请求才刷新数据
                        if (requestDecoIndex == that.requestDecoIndex){
                            let DecoName = 'bbcDecoInfoplus_' + that.topic_id
                            res.data.DecoName = DecoName
                            if (await DB.getOne('DecoInfo', DecoName, this.userKey)) {
                                DB.put('DecoInfo', res.data, this.userKey)
                            } else {
                                DB.add('DecoInfo', res.data, this.userKey)
                            }
                        }
                        //需要刷新数据的时候才刷新
                        if (!!refreshPage && requestDecoIndex == that.requestDecoIndex){
                            that.afterGetDecoInfo(res.data, true);
                        }
                            
                        resolve(res.data)
                    } else {
                        resolve({})
                    }
                }).catch(()=>{
                    resolve({})
                })
            })
        },
        /**
         * setThirdShare
         */
        async setThirdShare(){
            // #ifdef H5
            //设置第三方（微信、朋友圈等）分享信息
            let location = window.location;
            let locationHref = location.href;
            let callBackUrl = locationHref;
            this.shareChannelId = await sinosdk.sino.getChannelId()
            // 判断分享地址
            if (setShareUrl(callBackUrl,this.shareChannelId)) {
                callBackUrl = setShareUrl(callBackUrl,this.shareChannelId)
            }

            // 判断
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
</script>
<style lang="scss">
</style>
