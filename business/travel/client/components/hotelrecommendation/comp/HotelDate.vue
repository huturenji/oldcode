<template>
    <div class="hotelDate normal-btn cursorp">
        <div class="panelWrap">
            <div class="panelBox">
                <div class="panelBoxbd">
                    <p class="panelBoxLine top leftPart"><span class="checkin mr10">入住</span><span class="dataTips">{{inDate|sDay}}</span></p>
                    <p class="panelBoxLine leftPart"><span class="big64 num-font">{{formatDate(inDate,'MM')}}</span>月<span class="big64 num-font">{{formatDate(inDate,'dd')}}</span>日</p>
                </div>
                <div class="panelBoxbd">
                    <p class="panelBoxLine mid"><span class="day">共{{inDays||0}}晚 </span></p>
                </div>
                <div class="panelBoxbd">
                    <p class="panelBoxLine top rightPart"> <span class="checkin mr10">离店</span><span class="dataTips">{{outDate|eDay}}</span></p>
                    <p class="panelBoxLine rightPart"><span class="big64 num-font">{{formatDate(outDate,'MM')}}</span>月<span class="big64 num-font">{{formatDate(outDate,'dd')}}</span>日</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import HotelMarketingHandler from '../js/HotelMarketingHandler.js';
export default {
    components: {
    },
    props:{
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
        }
            
    },
    data() {
        return {
        }
    },
    created() {

    },
    mounted() {
            
    },
    methods: {
        /**
             * 格式化时间数据
             */
        formatDate:function(val,format){
            return new Date(parseInt(val)).format(format);
        }
    },
    filters:{
        sDay:function(vald){
            console.log("sDay:"+vald)
            var val = parseInt(vald);
            var time = new Date(val);
            if (new Date(val).toDateString() == new Date().toDateString()){
                return '今天'
            }
            if (new Date(val).toDateString() == new Date(new Date().getTime()+24*60*60*1000).toDateString()){
                return '明天'
            }
            if (new Date(val).toDateString() == new Date(new Date().getTime()+24*60*60*1000*2).toDateString()){
                return '后天'
            }
            return HotelMarketingHandler.indexToWeek(time.getDay());
        },
        eDay:function(vald){
            var val = parseInt(vald);
            var time = new Date(val);
            if (new Date(val).toDateString() == new Date().toDateString()){
                return '今天'
            }
            if (new Date(val).toDateString() == new Date(new Date().getTime()+24*60*60*1000).toDateString()){
                return '明天'
            }
            if (new Date(val).toDateString() == new Date(new Date().getTime()+24*60*60*1000*2).toDateString()){
                return '后天'
            }
            return HotelMarketingHandler.indexToWeek(time.getDay());
        }
    }
}
</script>
<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.hotelDate{
    background: @sub-background-color;
    .panelWrap{
        .panelBox {   
            position: relative;
            height: 1.59rem;
            .flex-box();
            .justify-content(space-between);
            .align-items(center);
            .panelBoxbd {            
                .flex(1);
                text-align: center;
            }
            .panelBoxLine {
                width: auto;
                font-size: .24rem;
                color: @text-color;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-wrap: break-word;
                word-break: break-all;
                .checkin,.dataTips{
                    color: @third-text-color;
                    font-size: .24rem;
                }
                .dataTips{
                    color: @text-color;
                }
                .day{
                    display: inline-block;
                    text-align: center;
                    line-height: 0.54rem;
                    font-size: 0.24rem;
                    padding: 0 0.2rem;
                    color: @text-color;
                }
                .big64{
                    font-size: 0.68rem;
                    font-weight: bold;

                }
            }
            .panelBoxLine.top{
                margin-top: 0;
            }
            .panelBoxLine.mid{
                margin-top: 0;
                padding-top: 0;
            }
        }
    }
    .leftPart{
        text-align: left;
    }
    .rightPart{
        text-align: right;
    }
    .mr10{
        margin-right: 0.1rem;
    }
}
</style>

