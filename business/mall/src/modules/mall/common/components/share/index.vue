<template>
    <bottomSheet :options="options" @action="shareAction" @close="$emit('close','')" globalsign="share"></bottomSheet>
</template>
<script>
import extendUtils from 'common/lib/utils';
const bottomSheet = ()=>import('common/components/bottomSheet');
export default {
    components: {
        bottomSheet
    },
    props: {
        shareOptions: {//分享信息
            type: Object,
            default: {}
        }, 
    },
    data() {
        return {
            options:[
                { name:'分享给同事',type:'bizmate',imgUrl:  require('./img/icon_common_workmate@2x.png'),pcShow:true},
                { name:'微信分享',type:'wechat',imgUrl: require('./img/icon_common_wechat@2x.png'),pcShow:false},
                { name:'朋友圈分享',type:'wechatTimeline',imgUrl: require('./img/icon_common_friend@2x.png'),pcShow:false},
                { name:'复制链接',type:'copylink',imgUrl: require('./img/icon_common_link@2x.png'),pcShow:true},
                // { name:'记事本分享',type:'note',imgUrl: require('./img/icon_common_note@2x.png'),pcShow:false},
            ],//data:image/png;base64,
            appinfo:{ name:'分享给同事',type:'bizmate',imgUrl:  require('./img/icon_common_workmate@2x.png'),pcShow:true},
        };
    },
    computed:{
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
            let copyStr = that.shareOptions.title+' '+that.shareOptions.link;
            var input = document.createElement("input");
            input.value = copyStr;
            input.readOnly = 'readonly';
            document.body.appendChild(input);
            input.select();
            input.setSelectionRange(0, input.value.length), document.execCommand('Copy');
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
            let param = {
                sharingType:type,//分享的类型，伴正事分享bizmate，微信分享wechat，朋友圈分享wechatTimeline
                title : that.shareOptions.title, // 分享标题          
                desc : that.shareOptions.desc, // 分享描述           
                link : that.shareOptions.link, // 分享链接          
                imgUrl : that.shareOptions.imgUrl, // 分享图标,图片绝对地址 
                appId: that.shareOptions.appId,//小应用Id
                appName: that.shareOptions.appName,//小应用名字,无合法appId时使用appName
                contentType : that.shareOptions.contentType // 分享类型,music、video或link，不填默认为link
            }
            //分享成功关闭分享面板
            that.$emit('close','');
            extendUtils.shareFunction(param).then((res)=>{
            })
        },
        /**
         * 获取appName和logo
         * 
         */ 
        getAppinfo(){
            let that = this;
             extendUtils.GetAppConfigFunction({'key':'appName'}).then(function(data){
                if(!!data.value){//用户存在
                    // key，appName 和 appLogo
                    that.options[0].name = data.value
                    extendUtils.GetAppConfigFunction({'key':'appLogo'}).then(function(res){
                        if(!!res.value){//用户存在
                            that.options[0].imgUrl = res.value
                        }else{
                            return
                        }
                    }).catch((err)=>{
                        return false;
                    })
                }else{
                    return
                }
            }).catch((err)=>{
                return false;
            })
             
        },
    }
};
</script>