<template>
<div class="orderCard">
    <div class="cardWrap">
        <div class="titleWrap">{{hotelName}}</div>
        <div class="textinfo">
            <Icon type='icon_common_calendar' class="calendar" size=".24"/>
            {{inDate|formatDate}}入住-{{outDate|formatDate}}离店 住{{inDays||0}}晚</div>
        <div class="textinfo roominfo">
            <Icon type='icon_common_clamation-circle' class="textinfoRight" size=".24"/>
            <span>{{room.roomName}}</span>
            <span v-if="-1 != productIndex">| {{room.roomProducts[productIndex].breakfastType}}</span>
            <span v-if="service.indexOf('免费wifi')">| 免费WiFi</span>
        </div>
        <div class="textinfo rightButton" @click="openRoomInfo"><span class="normal-btn">房型详情<Icon type='icon_common_rightarrow' class="textinfoRight" size=".24"/></span></div>
    </div>
</div>
</template>

<script>
    
import hotelHandler from 'hotelHandler/hotelHandler.js'
import Icon from 'components/icon';
export default {
    components: {
        Icon
    },
    props:{
        inDate:{
            type:Number,
            default: new Date().getTime()
        },
        hotelId: {
            type:Number
        },
        outDate:{
            type:Number,
            default:new Date().getTime()+24*60*60*1000
        },
        inDays:{
            type:Number,
            default:1
        },
        hotelName:{
            type:String,
            default:''
        },
        address: {
            type:String,
            default:''
        },
        roomName:{
            type:String,
            default:'标准间'
        },
        roomCount:{
            type:Number,
            default:1
        },
        hoteTel:{
            type:String
        },
        page:{
            type:String
        },
        room:{
            type:Object,
            default() {
                return {}
            }
        },
        service:{
            type:String,
            default:'无'
        },
        productIndex:{
            type:Number,
            default:-1
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
        callPhone(tel){
            sinosdk.sino.callTel(tel);
        },
        openRoomInfo(){
            this.$emit('showHotelRoomInfo',true)
        }
    },
    watch:{
    },
    filters:{
        formatDate:function(val){
            return new Date(parseInt(val)).format('MM月dd日');
        },
        sDay:function(v){
            var val = parseInt(v);
            var time = new Date(val);
            if (new Date(val).toDateString() == new Date().toDateString()){
                return '今天'
            }
            return hotelHandler.indexToWeek(time.getDay());
        },
        eDay:function(v){
            var val = parseInt(v);
            var time = new Date(val);
            if (new Date(val).toDateString() == new Date(new Date().getTime()+24*60*60*1000).toDateString()){
                return '明天'
            }
            return hotelHandler.indexToWeek(time.getDay());
        }
    }
}
</script>
<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.orderCard{
    padding: 0.3rem;
    .cardWrap{
        background: @sub-background-color;
        border-radius: 0.2rem;
        padding: 0.4rem 0.5rem 0.3rem;
        box-shadow:0px 0.04rem 0.30rem -0.04rem rgba(125,155,250,0.22);
        color: @text-color;
        font-size: 0.26rem;
        .titleWrap{
            font-size: 0.36rem;
            font-weight: bold;
            margin-bottom: 0.3rem;
        }
        .textinfo{
            line-height: 0.42rem;
            .calendar{
                fill: @text-color;
            }
            &.roominfo{
                margin-bottom: 0.2rem;
                color: @third-text-color;
                .calendar{
                    fill: @third-text-color;
                }
            }
        }
        .rightButton{
            color: @third-text-color;
            text-align: right;
            .flex-box();
            .align-items(center);
            .justify-content(flex-end);
            .textinfoRight{
                fill: @third-text-color;
            }
        }
    }
}
</style>

