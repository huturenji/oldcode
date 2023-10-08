<template>
    <div class="orderCard">
        <div class="cardOutWrap bbpxs">
            <div class="cardWrap">
                <div class="titleWrap">{{orderInfo.roomName}} {{orderInfo.roomCount}}间</div>
                <div class="textinfo">{{inDate|formatDate}}入住 - {{outDate|formatDate}}离店 住{{inDays||0}}晚</div>
                <div class="textinfo roominfo">
                    <Icon type='icon_common_prompt' class="roomInfoBut normal-btn" size=".28"/>
                    <span class="roomInfoItem" v-if="-1 < orderInfo.amenities.indexOf('免费wifi')">免费WiFi</span>
                    <span class="roomInfoItem" v-else-if="-1 < orderInfo.amenities.indexOf('收费wifi')">收费WiFi</span>
                    <span class="roomInfoItem" v-if="-1 < orderInfo.amenities.indexOf('免费停车场')">免费停车场</span>
                    <span class="roomInfoItem" v-else-if="-1 < orderInfo.amenities.indexOf('收费停车场')">收费停车场</span>
                    <span class="roomInfoItem" v-if="-1 < orderInfo.amenities.indexOf('会议室')">会议室</span>
                    <span class="roomInfoItem">{{orderInfo.breakfastType}}</span>
                    <!-- <span v-if="-1 != productIndex">| {{room.RoomProducts[productIndex].BreakfastType}}</span> -->
                </div>
            </div>
        </div>
        <div class="buttonWrap">
            <div class="buttonitemWrap cursorp normal-btn ">
                <div class="buttonitem brpxs" :class="{disable: !orderInfo.hotelPhone}" @click="callPhone">
                    <Icon type='chat' class="rightButton normal-btn" size=".32"/>
                    <span>联系酒店</span>
                </div>
            </div>
            <div class="buttonitemWrap cursorp normal-btn">
                <div class="buttonitem " @click="$emit('showMap')">
                    <Icon type='location' class="rightButton normal-btn" size=".32"/>
                    <span>地图导航</span>
                </div>
            </div>
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
            type: Object
        },
        inDate:{
            type:Number,
            default: new Date().getTime()
        },
        outDate:{
            type:Number,
            default:new Date().getTime()+24*60*60*1000
        },
        inDays:{
            type:Number,
            default:1
        },
        page:{
            type:String
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
        callPhone() {
            if (!this.orderInfo.hotelPhone){
                extendUtils.showToast('酒店未预留联系电话');
                return;
            }
            sinosdk.sino.callTel(this.orderInfo.hotelPhone);
        }
    },
    watch:{
    },
    filters:{
        formatDate:function(val){
            return new Date(parseInt(val)).format('MM月dd日');
        },
        sDay:function(val){
            val = parseInt(val);
            var time = new Date(val);
            if (new Date(val).toDateString() == new Date().toDateString()){
                return '今天'
            }
            return extendUtils.indexToWeek(time.getDay());
        },
        eDay:function(val){
            val = parseInt(val);
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
.bbpxs{
    .bbpx();
}
.bbpxd{
    .bbpx(1px, @border-color-base, 0, 0, dashed);
}
.brpxs{
    .brpx();
}
.orderCard{
    margin-bottom: 0.2rem;
    background: @sub-background-color;
    .cardWrap{
        padding: 0.4rem 0.3rem;
        color: @text-color;
        font-size: 0.26rem;
        .titleWrap{
            font-size: 0.3rem;
            font-weight: bold;
            margin-bottom: 0.2rem;
        }
        .textinfo{
            line-height: 0.42rem;
            .roomInfoItem{
                padding: 0 0.1rem;
            }
            .roomInfoItem:not(:last-of-type){
                .brpx(1px, @third-text-color, 0.08rem, 0.08rem, solid);
            }
            &.roominfo{
                .flex-box();
                .align-items(center);
                margin-bottom: 0.2rem;
                color: @third-text-color;
                .roomInfoBut{
                    fill: @third-text-color;
                }
            }
        }
    }
    .buttonWrap{
        color: @third-text-color;
        font-size: 0.32rem;
        .flex-box();
        .buttonitemWrap{
            padding: 0.16rem 0;
            .flex(1);
            font-size: 0.28rem;
            text-align: center;
            .buttonitem{
                height: 0.56rem;
                .flex-box();
                .align-items(); 
                .justify-content();
                span{
                    color: @text-color;
                    margin-left: 0.1rem;
                }
                
                .rightButton{
                    fill: @third-text-color;
                }
            }
        }
    }
}
</style>

