<template>
    <div v-if="show" class="cut_down">
       <span :style="{color: textColor}">{{countdownText}}</span>
    </div>
</template>

<script>

export default {
    props:{
        data: {
            type: Object,
            default: ()=> {}
        },
        // 活动状态
        state:{
            type: String
        }
    },
    data(){
        return {
            countdownText: '',
        }
    },
    computed:{
        startTime(){
            return this.data.startTime;
        },
        endTime(){
            return this.data.endTime;
        },
        textColor(){
            
            return this.data.textColor;
        },
        show(){
            return this.data && Object.keys(this.data).length > 0
        }
    },
    mounted(){
       this.activityCountdown();
    },
    watch:{
       
    },
    methods:{
        activityCountdown(){
            let that =this
            if(this.state && this.state=='ENDED'){
                this.countdownText = '活动已结束'
            }else{

                let nowTime = new Date().getTime();
                if(nowTime<this.startTime){
                    this.countdownText = '距离活动开始还有：'+ this.transTime(this.startTime-nowTime)
                    setTimeout(() => {
                        that.activityCountdown()
                    }, 1000);
                }else if(nowTime>=this.startTime&&nowTime<this.endTime){
                    this.countdownText = '距离活动结束还有：'+ this.transTime(this.endTime-nowTime)
                    setTimeout(() => {
                        that.activityCountdown()
                    }, 1000);
                }else if(nowTime>=this.endTime){
                    this.countdownText = '活动已结束'
                }
            }
           
        }, 
        transTime(timestamp) {
            let res = ''
            if (timestamp >= 86400000) {
                let days = Math.floor(timestamp / 86400000);
                res+= days + '天';
            }
            if (timestamp >= 3600000) {
                let hours = Math.floor(timestamp%86400000 / 3600000);
                if(hours<10){
                    res+= '0'+hours+'小时';
                }else{
                    res+= hours+'小时';
                }
            }
            if (timestamp >= 60000) {
                let minutes = Math.floor(timestamp%86400000%3600000 / 60000);
                if(minutes<10){
                    res+= '0'+minutes+'分钟';
                }else{
                    res+= minutes+'分钟'
                }
            }
            let secend = Math.floor(timestamp%86400000%3600000%60000 / 1000);
            if(secend<10){
                    res+= '0'+secend+'秒';
                }else{
                    res+= secend+'秒'
                }
            return res
        },
    }
}
</script>

<style scoped lang="less">
// 屏幕尺寸
@screen-sm: 550px;
@screen-md: 768px;
@screen-lg: 1080px;
//------------ 移动端通用样式 -------------
@media screen and (max-width: @screen-sm) {
    .cut_down{
       background: #fff;
       border-radius: .26rem;
       color: #FF4D70;
       padding: .08rem .26rem;
       white-space: nowrap;
       font-weight: 500;
       font-size: .24rem;
   }
}


//------------ pc端通用样式 包括pc客户端 浏览器端 -------------
@media screen and (min-width: @screen-sm) {
   .cut_down{
       background: #fff;
       border-radius: 13px;
       color: #D73F7B;
       padding: 4px 13px;
       white-space: nowrap;
       font-weight: 500;
       font-size: 12px;
   }
}
</style>