<template>
    <div class="reportPageWrap">
        <reportPop :showReportPopup="showReportPopup" @reportDone="reportNews" :newsItem="newsItem"></reportPop>
    </div>    
</template>
<script>
import extendUtils from 'common/lib/utils';
// import newsHandler from 'common/lib/requestHandler/newsHandler';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import reportPop from 'commonComp/reportPop';
export default {
    mixins: [tChatEventMixin],
    components:{
        reportPop
    },
    data() {
        let that = this;
        return Object.assign(extendUtils.stateManager.setData([
        ], that), {
            articleId:this.$route.query.articleId,//新闻id
            newsItem:{//新闻详情
                articleId:this.$route.query.articleId
            }
        })
    },
    created(){
        this.initData();
    },
    computed: {
    },
    methods: {
        /**
         * 初始换相关数据
         */
        initData(){
            // let that = this;
        },
        /**
         * 屏蔽新闻
         */ 
        reportNews(){
            extendUtils.closePage(null, 1);  
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
            extendUtils.closePage(null, 1);        
        }
    }
};
</script>
<style lang="less">
    
</style>