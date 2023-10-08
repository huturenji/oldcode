<template>
    <div class="topwarp" :class="{'topwarp-disabled':isshow}"   :style="{height: swiperHeight}" >
        <swiper class="istopwarp" :swiperId="'swiper-container-top' + keyIndex" :options="options" :class="{borderBottom:isBorder}">
            <swiper-item class="column" v-for="item in swiperList" :key="item.id" >
                <div onClick="onlyOnegotodateli(this)" :articleId="item.articleId">
                    <div :class="{'swiper-no-swiping':stopSwiper}">
                        <h4 class="nowarp" :data-item="item.articleId">{{item.title}}</h4>
                        <div class="texts" :data-item="item.articleId">
                            <p v-if="topNewsConfig">【置顶】</p>
                            <span>{{item.mediaName}}</span><span>{{formatMsgTime(item.lastUpdateTime, item.currentTime)}}</span>
                        </div>
                    </div>
                </div>
            </swiper-item>
        </swiper>
    </div>
</template>

<script>
import { Swiper, SwiperItem } from "commonComp/swiper";
import extendUtils from 'common/lib/utils';
export default {
    name: "topSwiper",
    data(){
        return{
            swiperHeight:0
        }
    },
    components: {
        Swiper,
        SwiperItem
    },
    props:{
        keyIndex:{
            type:[Number, String]
        },
        options:{
            type:Object,
            default:()=>{}
        },
        swiperList: {
            type: Array,
            default: () => []
        },
        swiperNumber:{
            type:Number,
            default:0
        },
        isBorder:{
            type:Boolean,
            default:true
        },
        topNewsConfig:{
            type:Boolean,
            default:true
        },
        stopSwiper:{
            type:Boolean,
            default:false
        }
    },
    watch:{

    },
    mounted(){
        let that = this
        
        // 置顶信息只有一条时 不轮播且有点击事件
        window.onlyOnegotodateli = function(dom){
            if(that.stopSwiper){
                extendUtils.openPage('article?articleId='+dom.attributes.articleid.value)
            }else{
                return
            }
        }
        
        this.swiperHeight=1.22*this.swiperNumber+0.32+'rem';
        
    },
    methods:{ 
        /**
         * 时间显示格式化
         * @param timespan 时间戳
         */        
        formatMsgTime (timespan, systemTime) {
            var dateTime = new Date(timespan);
            var year = dateTime.getFullYear();
            var month = dateTime.getMonth() + 1;
            var day = dateTime.getDate();
            var hour = dateTime.getHours();
            var minute = dateTime.getMinutes();
            // var second = dateTime.getSeconds();
            var milliseconds = 0;
            var timeSpanStr;
            milliseconds = systemTime - timespan;
            //1分钟内显示为刚刚
            if (milliseconds < 1000 * 60 * 1) {
                timeSpanStr = '刚刚';
            //一小时内展示为x分钟前
            }else if (1000 * 60 * 1 <= milliseconds && milliseconds < 1000 * 60 * 60) {
                timeSpanStr = Math.floor((milliseconds / (1000 * 60))) + '分钟前';
            //一天内展示为x小时前
            }else if (1000 * 60 * 60 * 1 <= milliseconds && milliseconds < 1000 * 60 * 60 * 24) {
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60)) + '小时前';
            //7天内展示为x天前
            }else if (1000 * 60 * 60 * 24 <= milliseconds && milliseconds < 1000 * 60 * 60 * 24 * 7) {
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
            //1个月内展示为x周前
            }else if (1000 * 60 * 60 * 24 * 7 <= milliseconds && milliseconds < 1000 * 60 * 60 * 24 * 30) {
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 7)) + '周前';
            //1年内展示为x月前
            }else if (1000 * 60 * 60 * 24 * 30 <= milliseconds && milliseconds < 1000 * 60 * 60 * 24 * 365) {
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 30)) + '月前';
            //1年以上展示为x年前
            }else if (1000 * 60 * 60 * 24 * 365 <= milliseconds){
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 365)) + '年前';
            //异常展示年月日
            }else {
                timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
            }
            return timeSpanStr;
        }
        // stopMousemove(e){
        //     e.stopPropagation()
        //     console.log(111);
        // }
    }
};
</script>

<style lang="less" scoped>
@import "./style/istopwarp.less";
</style>