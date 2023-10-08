<!-- 活动标签组件-->
<template>
    <view :class="`activeLabel fontScaleIgnore ${classMap[promotionType]}`">
        <view class="activeLabel_con fitFont">
            <view class="activeLabel_font fontScaleIgnore">
                <view class="activeLabel_bg"></view>
                <view class="name">{{activeName}}</view>
            </view>
            <view class="activeLabel_notice num-font fontScaleIgnore">{{rightText}}</view>
            <view class="activeLabel_time num-font fontScaleIgnore" v-if="stateType=='start'">{{remainingTime}}</view>
        </view>
    </view>
</template>
<script>
import {isNotEmpty,formateDateToString, fitFontSize} from '@/utils/common.js'
export default {
    name: "activeLabel",
    props: {
        promotionType: {
            Boolean: Number
        },
        // 活动名称
        activeName: {
            Boolean: String,
            default: ""
        },
        // 开始时间
        startTime:{
            Boolean: [Number,String],
            default: 0
        },
        // 结束时间
        endTime:{
            Boolean: [Number,String],
            default: 0
        },
        //距结束时间
        distanceEndTime:{
            Boolean: Number,
            default: 0

        }
    },
    data() {
        return {
            remainingTime:'00:00:00',//倒计时
            stateType:'brforeStart',//未开始
            rightText:'',//右侧文字
            startTimeParam:null,//格式化后的开始时间
            endTimeParam:null,//格式化后的结束时间
            nowTimeSeconds:null,//当前时间戳
            totalSeconds:this.distanceEndTime,//定时任务总时长
            timer:null,//定时器任务
            classMap: {
                104: 'seckill',
                106: 'together',
                107: 'everyDay'
            }
        };
    },
    created(){
        this.init();
    },
    methods: {
        /*
        * 初始化组件
        */
        async init(){
            if (isNotEmpty(this.startTime) && isNotEmpty(this.endTime) && (this.startTime != this.endTime)){
                // eslint-disable-next-line prefer-regex-literals
                const timeReg = new RegExp("-", "gm");
                if (parseInt(this.startTime)==this.startTime){ //如果是时间戳字符串格式，转化成数字
                    this.startTimeParam = new Date(parseInt(this.startTime)).getTime();
                } else {
                    this.startTime = this.startTime.replace(timeReg, "/");
                    this.startTimeParam = new Date(this.startTime).getTime();
                }
                if (parseInt(this.endTime)==this.endTime){
                    this.endTimeParam = new Date(parseInt(this.endTime)).getTime();
                } else {
                    this.endTime = this.endTime.replace(timeReg, "/");
                    this.endTimeParam = new Date(this.endTime).getTime();
                }
                this.nowTimeSeconds = new Date().getTime();
                let spareSeconds = parseInt((this.endTimeParam - this.nowTimeSeconds)/1000);
                if (!this.totalSeconds || this.totalSeconds < spareSeconds){
                    this.totalSeconds = spareSeconds;
                }
                this.calcRemainingSeconds();
                if (this.totalSeconds>=0){
                    this.intervalBis();
                }
                await this.$nextTick()
                setTimeout(() => {
                    let fontDom = document.getElementsByClassName('fitFont');
                    fitFontSize(fontDom,8);
                },200)
                
            }
        },
        /*
        * 计算剩余时间
        */
        calcRemainingSeconds() {
            this.nowTimeSeconds = new Date().getTime();
            if (this.nowTimeSeconds < this.startTimeParam){ //未开始
                this.stateType = 'brforeStart';
                this.rightText = formateDateToString(new Date(this.startTimeParam),'hh:mm')+' 场次即将开始';
            } else if (this.nowTimeSeconds > this.startTimeParam && this.nowTimeSeconds < this.endTimeParam){ //进行中
                this.stateType = 'start';
                this.rightText = '距结束';
                this.remainingTime = this.getTimeNotice((this.endTimeParam-this.nowTimeSeconds)/1000);
            } else if (this.nowTimeSeconds > this.endTimeParam){ //已结束
                this.rightText = '已结束';
                this.stateType = 'end';
                this.$emit('activeNoticeEvevt')
                clearInterval(this.timer);
            }
        },
        /*
         * 倒计时业务
         * totalSeconds：倒计时总秒数
         */
        intervalBis() {
            let that = this;
            let seconds = this.totalSeconds;
            this.timer = setInterval(()=>{
                if (seconds < 0){
                    clearInterval(that.timer);
                } else {
                    that.calcRemainingSeconds();
                    seconds--;
                }
            },1000)
        },
        /*
         * 获取倒计时
         * totalSeconds：倒计时总秒数
         */
        getTimeNotice(totalSeconds) {
            let hours = parseInt(totalSeconds / 60 / 60);
            let minutes = parseInt(totalSeconds / 60 % 60);
            let seconds = parseInt(totalSeconds % 60);
            return `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
        }
    }
};
</script>

<style lang='scss' scoped>
.activeLabel.fontScaleIgnore {
    width: 100%;
    .activeLabel_con {
        width: fit-content;
        height: 34rpx;
        line-height: 34rpx;
        background: #06e0dc;
        border-radius: 8rpx;
        overflow: hidden;
        font-size: 22rpx;
        display: flex;
        align-items: center;
        padding-right: 8rpx;
    }
    .activeLabel_font.fontScaleIgnore {
        position: relative;
        letter-spacing: 4rpx;
        white-space: nowrap;
    }
    .activeLabel_font .name{
        position: relative;
        padding: 0 4rpx 0 8rpx;
        font-weight: 600;
        color: #06e0dc;
    }
    .activeLabel_font .activeLabel_bg {
        text-align: center;
        transform: skewX(-10deg);
        position: absolute;
        top: -2rpx;
        left: -10rpx;
        bottom: -2rpx;
        right: 0;
        background-color: #222;
    }
    .activeLabel_notice.fontScaleIgnore {
        margin-left: 4rpx;
        z-index: 1;
        white-space: nowrap;
    }
    .activeLabel_time.fontScaleIgnore {
        width: 90rpx;
        margin-left: 4rpx;
        z-index: 1;
        white-space: nowrap;
    }
}

// 内置颜色样式
.activeLabel.seckill {
    .activeLabel_con {
        background-color: #fff;
        border: 2rpx solid #ffaf00;
        .activeLabel_bg {
            background-color: #ffaf00;
        }
        .name {
            color: #fff;
        }
    }
    .activeLabel_notice,
    .activeLabel_time {
        color: #ffaf00;
    }
}

.activeLabel.together {
    .activeLabel_con {
        background-color: #fff;
        border: 2rpx solid #06c7c3;
        .activeLabel_bg {
            background-color: #06c7c3;
        }
        .name {
            color: #fff;
        }
    }
    .activeLabel_notice,
    .activeLabel_time {
        color: #06c7c3;
    }
}
.activeLabel.everyDay {
    .activeLabel_con {
        background-color: #fff;
        border: 2rpx solid #ff2595;
        .activeLabel_bg {
            background-color: #ff2595;
        }
        .name {
            color: #fff;
        }
    }
    .activeLabel_notice,
    .activeLabel_time {
        color: #ff2595;
    }
}
</style>
