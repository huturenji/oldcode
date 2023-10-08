<template>
    <!-- 礼物动效 -->
    <view class="gift_effect">
        <image 
            id="effect" 
            class="effect" 
            :class="{fadeout:fadeoutOption}" 
            @load="setFadeout" 
            :src="imgSrc"
            mode="widthFix"
        :style="[init()]"
        />
        <view class="capsule flex_row_center_center" v-show="capsuleShow" @click="skip">
            <view class="skip">跳过</view>
            <view class="countdown">{{second}}S</view>
        </view>
    </view>
</template>
<script>
import {getQuerySelector} from '@/utils/common.js'
export default {
    data() {
        return {
            duration:2000,//动画总时长 单位:ms
            fadeoutDuration:500,//淡出时长 单位:ms
            fadeoutOption:false,//是否展示淡出动画
            second:0,//倒计时秒数
            capsuleShow:false,//胶囊是否显示
            imgSrc:'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/emao02.gif?'+new Date().getTime()//图片地址添加时间戳防止微信上二次访问不播放
        }
    },
    created(){
    },
    mounted(){
        this.init();
        uni.onWindowResize(this.init)
    },
    methods:{
        /**
         * 初始化,适配不同宽高比的屏幕,按照背景设置bottom的方式处理
        */
        async init(){
            let imgW = 750;
            let imgH = 1624;
            let sceneW = await getQuerySelector('.gift_effect',false,this).width;
            let sceneH = await getQuerySelector('.gift_effect',false,this).height;
            if (sceneW/sceneH > imgW/imgH){
                return {
                    'width':'100%'
                }
            } else {
                return {
                    'height':'100%'
                }
            }
        },
        /**
         * 设置淡出动画
        */
        setFadeout(){
            this.countdown();
            setTimeout(() => {
                this.fadeoutOption = true;
                setTimeout(() => {
                    this.$emit('playEnd');
                }, this.fadeoutDuration);
            }, this.duration);
        },
        /**
         * 跳过动画
        */
        skip(){
            this.$emit('playEnd');
        },
        /**
         * 倒计时
        */
        countdown(){
            let timeSum = this.duration + this.fadeoutDuration;
            let loopTime = 1000;
            this.second = parseInt(timeSum/1000);
            timeSum -= loopTime;
            this.capsuleShow = true;
            let timer = setInterval(() => {
                this.second = parseInt(timeSum/1000);
                timeSum -= loopTime;
                if (this.second === 0){
                    clearInterval(timer)
                }
            }, loopTime);
        }
        
    }
}
</script>

<style lang="scss" scoped>
.gift_effect{
    position:fixed;
    width: 750rpx;
    left: 0;
    right: 0;
    top: -2rpx;
    bottom: -2rpx;
    overflow: hidden;
    .effect{
        width: 750rpx;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        opacity: 1;
        max-width: initial;
    }  
    .capsule{
        position: absolute;
        right: 30rpx;
        top: 36rpx;
        width: 152rpx;
        line-height:60rpx;
        border-radius: 60rpx;
        background: rgba(0,0,0,0.3);
        font-size: 28rpx;
        font-weight: 500;
        .skip{
            margin-right: 10rpx;
            text-align: right;
            color: #fff;
        }
        .countdown{
            color: #fff;
        }
    }
    .fadeout{
        transition: all 0.5s ease-in;
        opacity: 0;
    }

}
</style>