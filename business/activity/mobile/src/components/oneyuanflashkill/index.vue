<template>
    <view class="oneyuanflashkillWrap">
        <view class="countdownWrap">
            <view class="seat" v-show="showCountdown">
                <view class="countdown">
                    <span>即将开始：</span>
                    <span class="numbg num-font mr8">{{countdownObj.d}}</span>
                    <span>天</span>
                    <span class="numbg num-font mr8 ml8">{{countdownObj.h}}</span>
                    <span>时</span>
                    <span class="numbg num-font mr8 ml8">{{countdownObj.m}}</span>
                    <span>分</span>
                    <span class="numbg num-font mr8 ml8">{{countdownObj.s}}</span>
                    <span>秒</span>
                </view>
            </view>
        </view>
    
        <view class="oneyuanflashkill">

            <view :class="`oneyuanflashkill_box size_5`">
                <!-- 开始按钮 -->
                <view class="start" @click="startDraw"></view>
                <!-- 奖品列表 -->
                <view v-for="(item, i) in prizeList" :key="'luckmarquee'+ i" :class="[`gift gift_${i + 1}`]">
                    <view class="gift_img">
                        <image :src="item.imgUrl" :mode="i==0?'widthFix':'scaleToFill'" />
                    </view>
                </view>
            </view>
            <view class="win_list" @click="towinprizelistPage"></view>
            <!-- 抽奖进度弹框 -->
            <view v-transfer-dom>
                <uni-popup class="processPopup" ref="process" :isMaskClick="false">
                    <view class="processWrap">
                        <view class="clock"></view>
                        <view class="progressLineWrap">
                            <view class="progressLine" :style="{'width':processPrecent+'%'}"></view>
                        </view>
                        <view class="process_tips">秒杀进度<span class="num-font">{{processPrecent}}%</span></view>
                    </view>
                </uni-popup>
            </view>
        </view>
    </view>
</template>
<script>
    import {isNotEmpty} from '@/utils/common.js'
    export default {
        props: {
            // 奖品列表
            prizeList: {
                type: Array,
                required: true
            },
            // 中奖奖品的 index
            prizeIndex: {
                type: Number || String,
                default: -1
            },
            checkRun: {
                type: Function,
                default: () => { return true }
            }
        },
        data() {
            return {
                processPrecent:0,//进度条
                lock: false,//进度锁
                showCountdown:false,//是否显示倒计时
                startTime:this.$Route.query.startTime || null,//活动开始时间
                countdownObj:{//倒计时显示数据天时分秒
                    d:null,
                    h:null,
                    m:null,
                    s:null
                }
            }
        },
        computed: {
        },
        mounted() {
            this.initCountdown();
        },
        methods: {
            /**
             * 点击我的奖品按钮
             */
            towinprizelistPage(){
                this.$emit('towinprizelistPage');
            },
            /**
             * 启动或停止抽奖进度条
             */
            handleProcess() {
                let interval = setInterval(() => {
                    if (this.processPrecent < 100) {
                        this.processPrecent++;
                    } else {
                        clearInterval(interval);
                        setTimeout(() => {
                            this.$refs.process.close();
                            this.$emit('end-turns');
                            this.lock = false;
                        }, 200);
                    }
                }, 40)
            },
            /*
            * 开始秒杀
            */
            startDraw() {
                if(!this.lock && this.checkRun()) {
                    this.lock = true;
                    // 开始转动修改为经判断后再进行
                    this.$emit('start-turns', () => {
                        this.processPrecent = 0;
                        this.$refs.process.open();
                        this.handleProcess();
                    });
                }
            },
            /*
            * 初始化倒计时
            */
            initCountdown(){
                let nowTimeSeconds = new Date().getTime();
                if(isNotEmpty(this.startTime) && parseInt(this.startTime) > nowTimeSeconds){
                    let spareSeconds = parseInt((parseInt(this.startTime) - nowTimeSeconds)/1000);
                    this.intervalBis(spareSeconds);
                    this.showCountdown = true;
                }
            },
            /*
            * 倒计时业务
            * totalSeconds：倒计时总秒数
            */
            intervalBis(seconds) {
                let that = this;
                this.timer = setInterval(()=>{
                    if (seconds < 0){
                        this.showCountdown = false;
                        clearInterval(that.timer);
                    } else {
                        this.getTimeNotice(seconds);
                        seconds--;
                    }
                },1000)
            },
            /*
            * 获取倒计时
            * totalSeconds：倒计时总秒数
            */
            getTimeNotice(totalSeconds) {
                let days = parseInt(totalSeconds / 24 / 60 / 60);
                let hours = parseInt((totalSeconds-days*24*3600) / 60 / 60);
                let minutes = parseInt(totalSeconds / 60 % 60);
                let seconds = parseInt(totalSeconds % 60);
                this.countdownObj.d = `${days > 9 ? days : '0' + days}`
                this.countdownObj.h = `${hours > 9 ? hours : '0' + hours}`
                this.countdownObj.m = `${minutes > 9 ? minutes : '0' + minutes}`
                this.countdownObj.s = `${seconds > 9 ? seconds : '0' + seconds}`
            }
        }
    }
</script>

<style lang="scss" scoped>
.oneyuanflashkillWrap{

    .countdownWrap{
        margin: 0 auto;
        width: 582rpx;
        height: 102rpx;
        margin-bottom: -10rpx;
        .seat{
            width: 100%;
            height: 100%;
            background: url('@/static/shared/oneyuanflashkill/bg_yiyuan_daojishi.png')no-repeat center;
            background-size: 100%;
            padding: 7rpx 15rpx 0;
            .countdown{
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                line-height: 40rpx;
                font-size: 28rpx;
                height: 74rpx;
                .numbg{
                    display: inline-block;
                    width: 52rpx;
                    height: 40rpx;
                    background: url('@/static/shared/oneyuanflashkill/pic_yiyuan_time.png')no-repeat center;
                    background-size: 100%;
                    color: #fff;
                    font-size: 32rpx;
                    font-weight: 700;
                    line-height: 38rpx;
                }
                .mr8{
                    margin-right: 8rpx;
                }
                .ml8{
                    margin-left: 8rpx;
                }

            }
        }

    }
}
.oneyuanflashkill {
    position: relative;
    width: 750rpx;
    height: 940rpx;
    padding: 156rpx 54rpx 0rpx;
    background: url('@/static/shared/oneyuanflashkill/pic_yiyuan_yiyuanmiaosha.png')no-repeat center;
    background-size: 100% 100%;
    .win_list{
        position: absolute;
        width: 194rpx;
        height: 66rpx;
        right: 64rpx;
        top:64rpx;
        z-index: 100;
        background: url('@/static/shared/oneyuanflashkill/icon_cj_yyg_wodejiangpin3.png')no-repeat center;
        background-size: 100%;
    }
    .oneyuanflashkill_box {
        .gift {
            background: #fff;
        }
    }

    .oneyuanflashkill_box.size_5 {
        position: relative;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;

        .start {
            position: relative;
            top: 540rpx;
            left: 95rpx;
            width: 452rpx;
            height: 170rpx;
            background: url("@/static/shared/oneyuanflashkill/btn_yiyuan_button_dis.png") no-repeat center;
            background-size: 100% 100%;
        }

        .gift {
            list-style: none;
            position: absolute;
            width: 186rpx;
            height: 254rpx;
            border-radius: 16rpx;
            background-size: 100% 100%;
            overflow: hidden;
            .gift_img {
                width: 100%;
                height: 100%;
                overflow: hidden;
                border-radius: 16rpx;
                image {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        // 上面三个
        .gift_1 {
            top: 0rpx;
            left:196rpx;
            width: 250rpx;
            height: 518rpx;
            padding-top: 15rpx;
            .gift_img{
                width: 100%;
                height: auto;
            }
        }
        // 左边二个
        .gift_2 {
            top: 0rpx;
            left: 0rpx;
        }
        .gift_3 {
            left: 0rpx;
            top: 264rpx;
        }
        // 右边三个
        .gift_4{
            left: 456rpx;
            top: 0rpx;
        }
        .gift_5 {
            left: 456rpx;
            top: 264rpx;
        }
    }
}
::v-deep.processPopup>uni-view>uni-view{
    &:first-child{
        background-color: rgba(0,0,0,0.7) !important;
    }
}
::v-deep .processWrap {
    position: relative;
    top: -120rpx;
    text-align: center;
    .clock{
        margin: 0 auto;
        margin-bottom: -30rpx;
        width: 248rpx;
        height: 258rpx;
        background: url("@/static/shared/oneyuanflashkill/pic_yiyuan_naoling.png") no-repeat center;
        background-size: 100% 100%;
    }
    .progressLineWrap{
        margin-bottom: 22rpx;
        width: 464rpx;
        height: 32rpx;
        padding: 4rpx;
        background: url("@/static/shared/oneyuanflashkill/pic_yiyuan_jindutiao0.png") no-repeat center;
        background-size: 100% 100%;
        .progressLine{
            width: 0;
            height: 100%;
            background: url("@/static/shared/oneyuanflashkill/pic_yiyuan_jindutiao100.png") no-repeat left;
            background-size: 456rpx 100%;
            border-radius: 30rpx;
        }
    }
    .process_tips{
        height: 44rpx;
        font-size: 32rpx;
        font-weight: 600;
        color: #ffdac2;
        line-height: 44rpx;
        span{
            padding-left: 12rpx;
        }
    }

}
@keyframes startMove {
	0% {
        -webkit-transform: scale(1);
        transform: scale(1);
	}
	25% {
        -webkit-transform: scale(1.05);
        transform: scale(1.05);
	}
	50% {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
	}
	75% {
        -webkit-transform: scale(1.05);
        transform: scale(1.05);
	}
	100% {
        -webkit-transform: scale(1.0);
        transform: scale(1.0);
	}
}
</style>
