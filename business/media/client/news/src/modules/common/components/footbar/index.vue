<template>
    <div class="footbarWrap">
        <div class="btnItem likeWrap"  :globalsign="newsUserPrivate.like?'':'like'" :globalsigndata="uploadData">
            <div class="itemWrap" @click="setNewsUserPrivate('like')">
                <Icon class="foorbarIcon" :class="{animate:newsUserPrivate.like}" :type="!newsUserPrivate.like ? 'icon_zixun_dianzan' : 'icon_zixun_dianzan_sel'" size=".32" />
                <span v-if="barType" class="textDetail" :class="{colorActive:newsUserPrivate.like}">赞</span>
                <span class="text" :class="{colorActive:newsUserPrivate.like}">{{likeNumText()}}</span>
            </div>
        </div>
        <div class="btnItem hateWrap"  :globalsign="newsUserPrivate.hate?'':'hate'" :globalsigndata="uploadData">
            <div class="itemWrap" @click="setNewsUserPrivate('hate')">
                <Icon class="foorbarIcon" :class="{animate:newsUserPrivate.hate}" :type="!newsUserPrivate.hate ? 'icon_zixun_caiyicai' : 'icon_zixun_caiyicai_sel'" size=".32" />
                <span v-if="barType" class="textDetail">踩</span>
                <span class="text">{{hateNumText()}}</span>
            </div>
        </div>
        <div class="btnItem wowWrap"  :globalsign="newsUserPrivate.wow?'':'wow'" :globalsigndata="uploadData">
            <div class="itemWrap" @click="setNewsUserPrivate('wow')">
                <Icon class="foorbarIcon" :class="{animate:newsUserPrivate.wow}" :type="!newsUserPrivate.wow ? 'icon_zixun_zaiyue' : 'icon_zixun_zaiyue_sel'" size=".32" />
                <span v-if="barType" class="textDetail" :class="{colorActive:newsUserPrivate.wow}">在阅</span>
                <span class="text" :class="{colorActive:newsUserPrivate.wow}">{{wowNumText()}}</span>
                <div class="tipsInfoWrap" :class="{list:!barType}" v-if="newsUserPrivate.wow && barType">
                    <div class="tipsInfo">
                        <span class="textinfo">您的在阅信息已同步至悦览室 </span>
                        <span class="bottomBut" @click.stop="$moduleGate(()=>gotoPage('/readingRoom'))">查看悦览室</span>
                        <span class="arrow"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="btnItem collectionWrap"  :globalsign="newsUserPrivate.favorite?'':'favorite'" :globalsigndata="uploadData">
            <div class="itemWrap" @click="setNewsUserPrivate('favorite')">
                <Icon class="foorbarIcon" :class="{animate:newsUserPrivate.favorite}" :type="!newsUserPrivate.favorite ? 'icon_zixun_shoucang' : 'icon_zixun_shoucang_sel'" size=".32" />
                <span v-if="barType" class="textDetail">收藏</span>
                <span class="text"></span>
            </div>
        </div>
        <div class="btnItem shareWrap" >
            <div class="itemWrap" @click="action('share')">
                <Icon class="foorbarIcon" type='icon_zixun_forward' size=".32" />
                <span v-if="barType" class="textDetail">分享</span>
                <span class="text"></span>
            </div>
        </div>
        <div class="btnItem moreWrap" >
            <div class="itemWrap" @click="action('more')">
                <Icon class="foorbarIcon" type='icon_zixun_more' size=".32" />
                <span class="text"></span>
            </div>
        </div>
    </div>
</template>
<script>
// import extendUtils from 'common/lib/utils';
import newsHandler from 'common/lib/requestHandler/newsHandler';
import scrollLockMixin from 'common/lib/mixin/scrollLockMixin.js';
import Icon from 'commonComp/icon';
export default {
    mixins:[scrollLockMixin],
    components: {
        Icon
    },
    props: {
        newsInfo: {//消息类型NEWS、VIDEO、AD等
            type: Object,
            default: ()=>{
                return {
                    statistics:{
                        upCount:0,
                        downCount:0,
                        wowCount:0
                    }
                }
            }
        }, 
        barType:{//是否想详细模式，按钮右侧显示文字
            detail:Boolean,
            default:false
        }
    },
    watch:{
        
    },   

    data() {
        return {
            newsUserPrivate:{//资讯赞、踩等用户信息
                like:this.newsInfo.statistics.like || false,
                hate:this.newsInfo.statistics.hate || false,
                favorite:this.newsInfo.statistics.favorite || false,
                wow:this.newsInfo.statistics.wow || false
            },
            newsInfoCopy:this.newsInfo,//新闻数据
            requesting: false //判断是否是请求中。。。
        };
    },
    computed:{
        //数据埋点上报数据
        uploadData(){
            return JSON.stringify({
                'articleId' : this.newsInfo.articleId,
                'categoryId' : this.newsInfo.categoryId || '',
                'categoryName' : this.newsInfo.categoryName || '',
                'supplierId' : (this.newsInfo.supplier||{}).supplierId || '',
                'supplierName' : (this.newsInfo.supplier||{}).supplierName || ''
            })
        }
    },
    created(){
        this.initData();
    },
    mounted(){
    },

    methods: {
        /**
         * 页面数据初始化
         */  
        initData(){
            let that = this;
            let param = {
                companyId:newsHandler.companyId,
                channelId:newsHandler.channelId,
                userId:newsHandler.userId,
                articlesId:[this.newsInfoCopy.articleId]
            }            
            newsHandler.getNewsUserPrivate(param).then((res) => {
                if(!!res.result.actions[0]){
                    that.requesting = false;
                    that.newsUserPrivate = res.result.actions[0];
                    that.getNewsDetail();
                }
            }).catch((err) => {
                that.requesting = false;
                console.log(err);
            });
        },
        /**
         * 获取资讯详情
         */        
        getNewsDetail(){
            let that = this;
            newsHandler.getNewsDetail({articleId: this.newsInfoCopy.articleId}).then((res) => {
                if(res.resultCode == 0 && !!res.result){
                    that.newsInfoCopy.statistics.upCount = res.result.statistics.upCount;
                    that.newsInfoCopy.statistics.downCount = res.result.statistics.downCount;
                    that.newsInfoCopy.statistics.wowCount = res.result.statistics.wowCount;
                    let newsActionData = {
                        newsUserPrivate:that.newsUserPrivate,
                        statistics:res.result.statistics
                    }
                    that.$emit('newsUpadta',newsActionData);
                }
            }).catch((err) => {
                console.log(err);
            });
        }, 
        /**
         * 存用户点赞、踩、收藏、浏览或不喜欢（不感兴趣）的记录
         * @param type FAVORITE-赞 HATE-踩 LIKE-收藏 HISTORY-历史记录 UNLIKE-不喜欢（不感兴趣）
         */ 
        setNewsUserPrivate(type){
            let that = this;
            if( !!that.requesting ){ return }
            let bisMap = {
                like:{
                    add:'addRecord',
                    del:'deleteRecord',
                    bisType:'LIKE'
                },
                hate:{
                    add:'addRecord',
                    del:'deleteRecord',
                    bisType:'HATE'
                },
                favorite:{
                    add:'addRecord',
                    del:'deleteRecord',
                    bisType:'FAVORITE'
                },
                wow:{
                    add:'addRecord',
                    del:'deleteRecord',
                    bisType:'WOW',
                    needThirdUserId:true
                }
            }
            //判断增加还是删除
            let actionName = that.newsUserPrivate[type]?bisMap[type].del:bisMap[type].add;
            let param = {
                companyId:newsHandler.companyId,
                channelId:newsHandler.channelId,
                userId:newsHandler.userId,
                articleId:that.newsUserPrivate[type]?[this.newsInfoCopy.articleId]:this.newsInfoCopy.articleId ,
                type:bisMap[type].bisType
            }
            //add时需要传递时间
            if(!that.newsUserPrivate[type]){
                param['articleId'] = that.newsInfoCopy.articleId;
                param['lastUpdateTime'] = that.newsInfoCopy.lastUpdateTime;
                if(!!bisMap[type].needThirdUserId){
                    param['thirdUserId'] = newsHandler.uaId;
                }
            }else{
                param['articlesId'] = [that.newsInfoCopy.articleId];
            }
            that.requesting = true;
            newsHandler[actionName](param).then(() => {
                that.initData();
            }).catch((err) => {
                that.requesting = false;
                console.log(err);
            });
        },
        /**
         * 计算点赞数显示
         */ 
        likeNumText(){
            let num = (this.newsInfoCopy.statistics||{}).upCount||0;
            let res = '';
            if(num <= 0){
                res = '';
            }else if(0 < num && num < 1000){
                res = num
            }else if(num < 10000){
                res = (num/1000).toFixed(1)+'k'
            }else{
                res = (num/10000).toFixed(1)+'w'
            }
            return res;
        },
        /**
         * 计算点踩数显示
         */ 
        hateNumText(){
            let num = (this.newsInfoCopy.statistics||{}).downCount||0;
            let res = '';
            if(num <= 0){
                res = '';
            }else if(0 < num && num < 100){
                res = num
            }else{
                res = '99+'
            }
            return res;
        },
        /**
         * 计算在阅数显示
         */ 
        wowNumText(){
            let num = (this.newsInfoCopy.statistics||{}).wowCount||0;
            let res = '';
            if(num <= 0){
                res = '';
            }else if(0 < num && num < 100){
                res = num
            }else{
                res = '99+'
            }
            return res;
        },
        /**
         * 动作
         * @param option type
         */  
        action(type){
            this.$emit('action',type)
        },
        /**
        *  跳转相关的页面
        */
        gotoPage(path){
            this.$router.push({
                path:path,
                query:{
                    pageFrom:'article'
                }
            })
        }
    }
};
</script>
<style lang="less">
    @import "index.less";
</style>