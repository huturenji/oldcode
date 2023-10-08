<template>
    <div class="hotelCard cursorp normal-btn">
        <div class="cardWrap" @click="$emit('openIntroduction')">
            <div class="leftWrap">
                <div class="titleWrap">{{orderInfo.hotelName || ''}}</div>
                <div class="textinfo"><Icon type='location' class="rightButton normal-btn" size=".24"/>{{orderInfo.address || ''}}</div>
            </div>
            <Icon type='right' class="rightButton normal-btn" size=".24"/>
        </div>
    </div>
</template>
<script>
import extendUtils from 'orderCommon/extend.js';
import Icon from "components/icon";
export default {
    components: {
        Icon
    },
    props:{
        orderInfo:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    data() {
        return {}
    },
    created() {
            
    },
    mounted() {
    },
    methods: {


    },
    watch:{
    },
    filters:{
        formatDate:function(val){
            return new Date(parseInt(val)).format('MM月dd日');
        },
        sDay:function(value){
            var val = parseInt(value);
            var time = new Date(val);
            if (new Date(val).toDateString() == new Date().toDateString()){
                return '今天'
            }
            return extendUtils.indexToWeek(time.getDay());
        },
        eDay:function(value){
            var val = parseInt(value);
            var time = new Date(val);
            if (new Date(val).toDateString() == new Date(new Date().getTime()+24*60*60*1000).toDateString()){
                return '明天'
            }
            return extendUtils.indexToWeek(time.getDay());
        }
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/index.less';
@import '~styles/mixins/mixinsStyle.less';
.hotelCard{
    padding: 0 0.3rem 0.3rem;
    .cardWrap{
        background: @sub-background-color;
        border-radius: 0.2rem;
        padding: 0.4rem 0.5rem 0.3rem;
        box-shadow:0px 0.04rem 0.30rem -0.04rem rgba(125,155,250,0.22);
        color: @text-color;
        font-size: 0.26rem;
        .flex-box();
        .align-items();
        .leftWrap{
            .flex(1);
            .titleWrap{
                font-size: 0.3rem;
                font-weight: bold;
                margin-bottom: 0.1rem;
            }
            .textinfo{
                font-size: 0.26rem;
                line-height: 0.42rem;
                color: @third-text-color;
                .flex-box();
                .align-items();
                .rightButton{
                    margin-right: 0.08rem;
                }

            }
        }
        .rightButton{
            fill: @third-text-color;
        }
    }
}
</style>