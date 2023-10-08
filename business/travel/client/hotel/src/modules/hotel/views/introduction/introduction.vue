<template>
    <div class="introduction">
        <LoadingX v-if="loading" />
        <div v-else>
            <div class="tit">酒店简介</div>
            <div class="textWrap" v-html="fomateText(hotelDetailInfo.contents)"></div>
            <div class="tit">酒店设施</div>
            <div class="textWrap" v-html="fomateText(hotelDetailInfo.service)"></div>
            <div class="tit">酒店交通</div>
            <div class="textWrap" v-html="fomateText(hotelDetailInfo.traffic)"></div>
            <div class="tit">酒店地址</div>
            <div class="textWrap" v-html="fomateText(hotelDetailInfo.address)"></div>
        </div>
    </div>
</template>
<script>
import hotelHandler from 'hotelHandler/hotelHandler.js'
import LoadingX from "components/loading/LoadingX.vue";
import {} from 'vux';
export default {
    mixins: [hotelHandler.mixin.tChatEventMixin],
    directives: {
    },
    components: {
        LoadingX
    },
    props:{
    },
    data() {
        return {
            loading:true,//数据加载中
            hotelDetailInfo:{} //酒店数据
        }
    },
    created() {
        let _this = this;
        //注册并监听t信返回事件
        _this.$emit('showOff', true);
        //获取酒店数据
        _this.getHotelDetail();
    },
    mounted() {
    },
    methods: {
        /**
         * 获取酒店数据
         */
        getHotelDetail:function(){
            var _this = this;
            _this.loading = true;
            if (!!hotelHandler.getStorage('hotelDetailInfo')){
                _this.loading = false;
                _this.hotelDetailInfo = JSON.parse(hotelHandler.getStorage('hotelDetailInfo'));
            }
        },
        /**
         * 格式化dom文本
         */
        fomateText:function(str){
            var text = '';
            text = str;
            text = text.replace(/lt;brgt;/g, "</p><p>");
            text = text.replace(/\n/g, "</p><p>");
            text = text.replace(/<br>/g, "</p><p>");
            if ('' == text){
                text = '无';
            }
            return '<p>'+text+'</p>';
        },
        /**
            * T信回退事件的注册回调 必须是goBackFun
            */
        goBackFun(){
            var _this = this;
            _this.$router.back();             
        }            
    }
}
</script>
<style lang="less">
@import '~styles/core/common.less';
.introduction{
    .tit{
        font-size: 0.26rem;
        padding: 0.15rem 0.3rem;
        color: @third-text-color;
    }
    .textWrap{
        font-size: 0.28rem;
        color: @text-color;
        padding: 0.25rem 0.3rem;
        background: @sub-background-color;
    }
}
</style>

