<template>
    <div class="hotelDate">
        <!--tab-->
        <div class="tab">
            <div>
                <div class="panel">
                    <div class="panel-box panel-box_attend">
                        <div class="panel-box_bd">
                            <p class="panel-box_title top leftPart"><span class="checkin mr10">入住</span><span class="dataTips">{{InDate|sDay}}</span></p>
                            <p class="panel-box_title leftPart blueActive">{{InDate|formatDate}}</p>
                        </div>
                        <div class="panel-box_bd">
                            <p class="panel-box_title mid"><span class="day">共{{InDays||0}}晚 </span></p>
                        </div>
                        <div class="panel-box_bd">
                            <p class="panel-box_title top rightPart"> <span class="checkin mr10">离店</span><span class="dataTips">{{OutDate|eDay}}</span></p>
                            <p class="panel-box_title rightPart blueActive">{{OutDate|formatDate}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import tripHandler from '../js/tripHandler.js';
export default {
    components: {
    },
    props:{
        InDate:{
            type:Number,
            default: new Date().getTime()
        },
        OutDate:{
            type:Number,
            default:new Date().getTime()+24*60*60*1000
        },
        InDays:{
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

    },
    filters:{
        formatDate:function(val){
            return new Date(parseInt(val)).format('MM月dd日');
        },
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
            return tripHandler.indexToWeek(time.getDay());
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
            return tripHandler.indexToWeek(time.getDay());
        }
    }
}
</script>
<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
@font-color-blue:#478aee;
@font-color-red:#FF0000;
@font-color-orange:#FF6600;
.hotelDate{
    .tab{
        //border-bottom: 1px solid #d9d9d9;
        .pd3{
            padding: 0 .3rem;
        }
        .panel{
            background: #fff;
            //margin-bottom: .1rem;
            //border-bottom: .01rem solid #e3e3e3;
            .panel-box {
                position: relative;
            }
            .panel-box_attend {   
                display: -ms-flexbox;
                display: -webkit-box;
                display: -webkit-flex;
                display: flex;
                -webkit-box-pack: space-between;
                -webkit-justify-content: space-between;
                -moz-justify-content: space-between;
                -ms-justify-content: space-between;
                -o-justify-content: space-between;
                justify-content: space-between;
                -ms-flex-align: center;
                -webkit-align-items: center;
                -moz-align-items: center;
                align-items: center;
                height: 1.59rem;
                p{
                    font-size: .32rem;
                }
                .panel-box_hd {
                    margin-right: .1rem;
                    width: 2rem;
                    height: 2rem;
                    line-height: 2rem;
                    text-align: center;
                }
                .panel-box_bd {
                    -webkit-box-flex: 1;      
                    -moz-box-flex: 1;        
                    -webkit-flex: 1;          
                    -ms-flex: 1;              
                    flex: 1;
                    min-width: 0;
                    text-align: center;
                    .name{
                        font-size:0.32rem;
                        font-weight: 500;
                    }
                    .address{
                        font-size: .30rem;
                        padding-top: 0;
                    }
                    h4{
                        span{
                            margin-left: .15rem;
                            font-size: .25rem;
                        }
                        i{
                            font-size: .24rem;
                            color: @font-color-red;
                            font-style:initial;
                            border: 1px solid @font-color-red;
                            margin-left: .15rem;
                            padding: .01rem .06rem;
                        }
                    }

                    .box_commit{
                        color: @font-color-blue;
                        padding-top: 0.03rem;
                        text-align: right;
                    }
                }
                .panel-box_img {
                    width: 80%;
                    max-height: 100%;
                    vertical-align: middle;
                    border-radius: .06rem;
                }
                .panel-box_mask{
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    margin-left: -0.1rem;
                    text-align: center;
                    background: rgba(255, 255, 255, 0.8);
                    .btn{
                        position: absolute;
                        color: @font-color-red;
                        border: 1px solid @font-color-red;
                        left: 35%;
                        bottom: .3rem;
                        text-align: center;
                        padding: 0 .6rem;

                    }
                }
                .panel-box_title {
                    width: auto;
                    font-size: .36rem;
                    color: #478aee;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: break-word;
                    word-break: break-all;
                    .rate{
                        color: @font-color-orange;
                        font-weight:600;
                    }
                    .checkin,.dataTips{
                        color: #999;
                        font-size: .24rem;
                    }
                    .comment{
                        margin-left: .2rem;
                    }
                    .icon{
                        font-size: .25rem;
                        img{
                            width: .24rem;
                            margin-left: .1rem;
                            margin-right: .06rem;
                        }
                        &:first-child{
                            img{
                                margin-left: 0;
                            }
                        }
                    }
                    .day{
                        display: inline-block;
                        border: 1px dashed #d9d9d9;
                        text-align: center;
                        line-height: 0.54rem;
                        border-radius: .54rem;
                        font-size: 0.28rem;
                        padding: 0 0.2rem;
                        color: @text-color;
                    }
                }
                .panel-box_title.top{
                    margin-top: 0;
                }
                .panel-box_title.mid{
                    margin-top: 0;
                    padding-top: 0;
                }
                .panel-box_money{
                    text-align: right;
                    margin-right: .12rem;
                    font-size: .36rem;
                    color:@font-color-red;
                }
            }
            .panel-box_desc {
                color: #999999;
                font-size: .25rem;
                line-height: 1.2;
                /*overflow: hidden;*/
                /*text-overflow: ellipsis;*/
                display: -webkit-box;
                -webkit-box-orient: vertical;
                /*-webkit-line-clamp: 2;*/
            }
            .panel-box_time{
                flex: 1;
                -webkit-flex: 1;
                display: -webkit-box;
                display: -webkit-flex;
                display: flex;
            }
            .box_time {
                padding-top: 0.2rem;
            }
            .box_icon {
            }
            .box_icon_img {
                width: .42rem;
            }
        }
    }
    .leftPart{
        text-align: left;
    }
    .rightPart{
        text-align: right;
    }
    .blueActive{
        &:active{
            .normal-btn();
        }
    }
    .mr10{
        margin-right: 0.1rem;
    }
}
</style>

