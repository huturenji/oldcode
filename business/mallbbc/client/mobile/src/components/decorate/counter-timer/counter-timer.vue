<!-- 倒计时组件
-->
<template name="counter-timer">
    <view class="counter-timer" v-margin="decoItem">
        <view v-for="(item,index) in timeList" :key="index" class="counter_item" @click="goPage(item)">
            <img :src="item.bgImg.img ? item.bgImg.img : ''"/>
            <view :style="{fontWeight:item.fontStyle.isBold?'bold':'normal',top:item.positionStyle.positionY+'%',left:item.positionStyle.positionX+'%',
            fontSize:item.fontStyle.size?item.fontStyle.size*2/100+'rem':'0.24rem',color:item.fontStyle.color?item.fontStyle.color:'#222'}" class="num-font time">
            {{ item.showTime }}
            </view>
        </view>
    </view>
</template>

<script>
import { skipTo, isNotEmpty } from '@/utils/common.js'
export default {
    name: "deco-counter-timer",
    components: {
        
    },
    data() {
        return {
            timeList: [],
            secInterval:null
        }
    },
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        },
        isDecoReady: {}
    },
    computed: {
    },
    watch: {
        decoItem: {
            handler(val){
                if (isNotEmpty(val) && this.isDecoReady){
                    this.timeList = JSON.parse(JSON.stringify(this.decoItem.data))
                }
            },
            deep: true,
            immediate: true
        }  
    },
    mounted(){
        this.secInterval = setInterval(() => {
            this.timeList.forEach(item => {
                this.$set(item, 'showTime', this.handleTime(item.countTime,item.countSet))
            })
        }, 1000)
    },
    methods: {
        handleTime(timeStr,type){
            let time = timeStr.replaceAll('-','/')
            let countTime = ''
            let localTime = ''
            let tempCountTime = 0
            if (time) {
                if (type == 0) {
                    localTime = new Date().toLocaleDateString()
                    tempCountTime = parseInt((new Date(`${time.slice(0,10)} 00:00:00`).getTime() - new Date(localTime).getTime())/1000)
                    countTime = parseInt(tempCountTime / 60 / 60 / 24)>0?parseInt(tempCountTime / 60 / 60 / 24):0

                } else if (type == 1) {
                    if (time.length == 10) {
                        time = `${time} 00:00:00`
                    }
                    localTime = new Date()
                    tempCountTime = parseInt((new Date(time).getTime() - new Date(localTime).getTime())/1000)
                    countTime = `${this.getAllTime(tempCountTime).hours}:${this.getAllTime(tempCountTime).minutes}:${this.getAllTime(tempCountTime).seconds}`
                }
                if (tempCountTime < 0) {
                    clearInterval(this.secInterval)
                }
            }
            return countTime
        
        },
        getAllTime(time){
            let temptHours = parseInt(time / 60 / 60)>0?parseInt(time / 60 / 60):0;
            let temptMinutes = parseInt(time / 60 % 60)>0?parseInt(time / 60 % 60):0;
            let temptSeconds = parseInt(time % 60)>0?parseInt(time % 60):0;
            let hours = temptHours > 9 ? `${temptHours}` : `0${temptHours}`;
            let minutes = temptMinutes > 9 ? `${temptMinutes}` : `0${temptMinutes}`;
            let seconds = temptSeconds > 9 ? `${temptSeconds}` : `0${temptSeconds}`;
            return {hours:hours,minutes:minutes,seconds:seconds}
        },
        goPage(item) {
            skipTo(item.bgImg, this);
        }
        
        
    }
}
</script>

<style lang='scss' scoped>
    .counter-timer {
        .counter_item {
            position: relative;
            font-size:0;
            img {
                width: 100%;
            }
            .time {
                width: fit-content;
                position: absolute;
                top: 0%;
                left: 0%;
                font-size: 24rpx;
            }
        }
    }
</style>
