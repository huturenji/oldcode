<template>
    <bottomSheet :options="options" @action="shareAction" @close="$emit('close','')" globalsign="share" :globalsigndata="uploadData"></bottomSheet>
</template>
<script>
import extendUtils from 'common/lib/utils';
import scrollLockMixin from 'common/lib/mixin/scrollLockMixin.js';
import newsHandler from 'common/lib/requestHandler/newsHandler';
import {mapGetters} from 'vuex'
import constant from 'common/config';
const bottomSheet = ()=>import('commonComp/bottomSheet');
export default {
    mixins:[scrollLockMixin],
    components: {
        bottomSheet
    },
    props: {
        newsItem: {//消息类型NEWS、VIDEO、AD等
            type: Object,
            default: ()=>{}
        } 
    },
    data() {
        let options = []
        if(sinosdk.sino.isInSinoEnv()){
            if(this.getRole == constant.ROLE.USER){
                options.push(
                    { name:'BIZMATE',type:'bizmate',imgUrl: require('./img/icon_common_banzhengshi@2x.png'),pcShow:true}
                )
            }
            options.push(...[
                { name:'微信分享',type:'wechat',imgUrl: require('./img/icon_common_wechat@2x.png'),pcShow:false},
                { name:'朋友圈分享',type:'wechatTimeline',imgUrl: require('./img/icon_common_friend@2x.png'),pcShow:false}
            ])
        }
        return {
            options:[
                ...options,
                { name:'复制链接',type:'copylink',imgUrl: require('./img/icon_common_link@2x.png'),pcShow:true}
            ],
            appinfo:{ name:'分享给同事',type:'bizmate',imgUrl: require('./img/icon_common_workmate@2x.png'),pcShow:true}
        };
    },
    computed:{
        ...mapGetters(['getRole']),
        //数据埋点上报数据
        uploadData(){
            return JSON.stringify({
                'articleId' : this.newsItem.articleId,
                'categoryId' : this.newsItem.categoryId || '',
                'categoryName' : this.newsItem.categoryName || '',
                'supplierId' : (this.newsItem.supplier||{}).supplierId || '',
                'supplierName' : (this.newsItem.supplier||{}).supplierName || ''
            })
        }
    },
    created(){
    },
    mounted(){
        this.getAppinfo()
    },
    methods: {
        /**
         * 分享界面点击动作
         */        
        shareAction(option) {
            let that = this;
            if('copylink'==option.type){
                that.copyShare();
            }else{
                that.share(option.type);
            }
        },
        /**
         * 复制分享操作
         * @param data 分享的数据
         */ 
        copyShare(){
            let that = this;
            let location = window.location;
            let shareLink = location.origin + location.pathname + "#/shareArticle?articleId="+that.newsItem.articleId+"&pageFrom=share"+"&channelId="+newsHandler.getUserParam('channelId');
            let copyStr = that.newsItem.title+' '+shareLink;
            var input = document.createElement("input");
            input.value = copyStr;
            input.readOnly = 'readonly';
            document.body.appendChild(input);
            input.select();
            input.setSelectionRange(0, input.value.length); document.execCommand('Copy');//逗号改成了分号
            document.body.removeChild(input);
            extendUtils.showToast('复制成功');
            //分享成功关闭分享面板
            that.$emit('close','');
        },

        /**
         * 分享操作
         * @param option 分享的类型
         */ 
        async share(type){
            let that = this;
            let imgUrl = that.newsItem.cover[0]?that.newsItem.cover[0].url:'';
            let location = window.location;
            let appId = await that.getAppConfig();
            let shareLink = location.origin + location.pathname + "#/shareArticle?articleId="+that.newsItem.articleId+"&pageFrom=share"+"&channelId="+newsHandler.getUserParam('channelId');
            let param = {
                sharingType:type,//分享的类型，伴正事分享bizmate，微信分享wechat，朋友圈分享wechatTimeline
                title : that.newsItem.title, // 分享标题          
                desc : that.newsItem.title, // 分享描述           
                link : shareLink, // 分享链接          
                imgUrl : imgUrl, // 分享图标,图片绝对地址  
                appId: appId+'',//小应用Id
                appName: '资讯',//小应用名字,无合法appId时使用appName
                contentType : 'link' // 分享类型,music、video或link，不填默认为link
            }
            //分享成功关闭分享面板
            that.$emit('close','');
            sinosdk.sino.share(param).then(()=>{
            })

        },
        /**
         * 异步获取appId
         */	
        async getAppConfig() {
            return await sinosdk.sino.getAppInfo({'key':'msgSource'}).then(function(data){
                if(!!data){//用户存在
                    var jsonData = JSON.parse(data.value);
                    return jsonData.appId || 0
                }
            }).catch(()=>{
                return 0;
            })
        },
        /**
         * 获取appName和logo
         * 
         */ 
        getAppinfo(){
            let bizmateShare = this.options.find(o => o.type == 'bizmate');
            if(!bizmateShare){
                return
            }
            // that.options.unshift(that.appinfo)
            sinosdk.sino.getAppInfo({'key':'appName'}).then(function(data){
                if(!!data.value){//用户存在
                    // key，appName 和 appLogo
                    bizmateShare.name = data.value
                    sinosdk.sino.getAppInfo({'key':'appLogo'}).then(function(datac){
                        if(!!datac.value){//用户存在
                            bizmateShare.imgUrl = datac.value
                        }else{
                            return
                        }
                    }).catch(()=>{
                        return false;
                    })
                }else{
                    return
                }
            }).catch(()=>{
                return false;
            })
        }

    }
};
</script>
<style lang="less">
    @import "index.less";
</style>