<template>
      <div v-if="show" class="time" :class="{detailStyle: useType=='detail'}">
        <span class="day num-font">{{remainTime | remainDayTimeFilter}}</span>
        <span class="blackbg num-font">{{remainTime | remainHoursTimeFilter}}</span>
        <span class="dot">:</span>
        <span class="blackbg num-font">{{remainTime | remainMinutesTimeFilter}}</span>
        <span class="dot">:</span>
        <span class="blackbg num-font">{{remainTime | remainSecondsTimeFilter}}</span>
    </div> 
</template>

<script>

export default {
    props: {
        // 使用的位置，目前是为了兼容不同的地方使用样式有差别 detail代表商品详情页。
        useType:{
            type: String,
            default: 'normal',
        },

        // 截止时间 单位是毫秒
        deadline:{
            type: Number || String,            
        }
    },
    data(){
        return {
            remainTime: null,//活动剩余时间，单位是毫秒
            timer: null, //定时器
        }
    },
    filters:{
        /**
         * 活动剩余时间天的格式化
         */
        remainDayTimeFilter(val){
            let days = parseInt(val / (1000 * 60 * 60 * 24));
            return `${days}天`;
        },

        /**
         * 活动剩余时间小时的格式化
         */
        remainHoursTimeFilter(val){
            let hours = parseInt((val % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            return `${hours < 10 ? '0' + hours : hours}`;
        },

        /**
         * 活动剩余时间分钟的格式化
         */
        remainMinutesTimeFilter(val){
            let minutes = parseInt((val % (1000 * 60 * 60)) / (1000 * 60));
            return `${minutes < 10 ? '0' + minutes : minutes}`;
        },

        /**
         * 活动剩余时间秒的格式化
         */
        remainSecondsTimeFilter(val){
            let seconds = parseInt(parseInt((val % (1000 * 60)) / 1000));
            return `${seconds < 10 ? '0' + seconds : seconds}`;
        },
    },
    mounted(){
        this.$nextTick(()=>{
            this.cutDownTime();
        })
    },
    computed:{
        show(){
            return this.remainTime && this.remainTime > 0;
        }
    },
    methods:{
        cutDownTime(){
            const that = this;
            let nowTime = new Date().getTime();
            that.remainTime = (parseInt((that.deadline - nowTime)/1000))*1000; //毫秒取整
            if(!!that.remainTime && that.remainTime >= 0){
               
                that.countdownClear();
                that.timer = setInterval(() => {
                    if(that.remainTime <= 0){
                        that.remainTime = null;
                        that.countdownClear();
                        //触发倒计时结束事件
                        that.countdownEnd();
                    }else{
                        that.remainTime = that.remainTime - 1000; //注意单位是毫秒ms
                    }
                    
                }, 1000)
            }
        },
        /**
         * 清空倒计时
         */
        countdownClear(){
            !!this.timer && clearInterval(this.timer);
        },

        
        /**
         * 倒计时结束事件
         */
        countdownEnd(){
            this.$emit('cutDownEnded');
        },
    },
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.time{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .22rem;
    .blackbg{
        margin: 0 .06rem;
        width: .32rem;
        height: .32rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        .bpx(1px, .03rem);
    }
}

.time.detailStyle{
    display: flex;
    align-items: center;
    justify-content: center;
    .day{
        color: #222;
    }
    .blackbg{
        background: #222;
        color: #fff;
        border-radius: .06rem;
        &::before{
            border: none 0;
        }
    }
}

// pc端样式特殊定制，字体的大小需要调大
@media screen and (min-width: @screen-sm) {
    .time.detailStyle{
        .day{
            font-size: .24rem;
        }
        .blackbg{
            width: .36rem;
            height: .36rem;
            font-size: .24rem;
            background: #222;
            color: #fff;
            border-radius: .06rem;
        }
    }
}

</style>