<template>
    <view :class="classObj[type]">
        <view class="order-title">待付款</view>
        <view class="countdown">{{stateTime}}</view>
    </view>
</template>

<script>

export default {
    name:'unpaid-countdown',
    props:{
        orderItem: { // 订单项数据
            type:Object,
            default:()=>{}
        },
        type: { // 倒计时样式
            type:String,
            default:()=>'normal'
        }
    },
    data(){
        return {
            stateTime: '',
            secInterval: null,
            classObj:{
                normal:'normal-countdown',
                card:'unpaid-countdown'
            }

        }
    },
    created(){
        this.countDownBySecond(this.orderItem.remainTime)
    },
    methods:{
        //倒计时(参数为：剩余秒数)
        countDownBySecond(second) {
            let that = this;
            //创建定时器前先清除定时器
            clearInterval(that.secInterval);
            let diffrentTimeStamp = second * 1000;
            that.secInterval = setInterval(() => {
                if (diffrentTimeStamp > 0) {
                    //将时间戳转换为天，时，分，秒 并倒计时
                    that.stateTime = that.formatDuring(diffrentTimeStamp)
                } else {
                    that.stateTime = ''
                }
                diffrentTimeStamp -= 1000; //相差时间 毫秒数
            }, 1000)
        },
        //将时间戳转换为时分秒
        formatDuring(mss) {
            let days = parseInt(mss / (1000 * 60 * 60 * 24));
            let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            let seconds = ((mss % (1000 * 60)) / 1000).toFixed(0);
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            if(this.type == 'card'){
                if (days > 0) {
                    return "剩"+ days + "天" + hours + "时" + minutes + "分";
                } else if (hours > 0) {
                    return "剩"+ hours + "时" + minutes + "分";
                } else if (minutes >= 1) {
                    return "剩"+ minutes + "分";
                } 
                //如果剩 1分钟之内就不让显示
                return "剩"+seconds+"秒"
            }
            if (days > 0) {
                return `剩余时间：${days}天${hours}:${minutes}:${seconds}`;
            } else if (hours > 0) {
                return `剩余时间：${hours}:${minutes}:${seconds}`;
            } else if (minutes >= 1) {
                return `剩余时间：${minutes}:${seconds}`;
            } 
            //如果剩 1分钟之内就不让显示
            return `剩余时间：${seconds}`;
        }
    }

}
</script>

<style lang="scss" scoped>
    /* 卡片式倒计时样式 */
    .unpaid-countdown{
        height: 32rpx;
        line-height: 32rpx;
        border-top-left-radius: 6rpx;
        border-bottom-left-radius: 6rpx;
        display: flex;
        overflow: hidden;
        font-size: 22rpx;
        font-weight: bold;
        background: #fff;
        padding-left: 8rpx;
        border-top-right-radius: 6rpx;
        border-bottom-right-radius: 6rpx;

        .order-title {
            width: 80rpx;
            height: 32rpx;
            color: #FEFEFE;
            background: linear-gradient(148deg,#fb8453 6%, #ff0000 91%);
            border-top-left-radius: 6rpx;
            border-bottom-left-radius: 6rpx;
            text-align: center;
            position:relative;
            &::after {
                content: "";
                position: absolute;
                top: 0;
                right: -8rpx;
                border-width: 32rpx 8rpx;
                border-style: solid;
                border-color: #ff0000 transparent transparent transparent;
            }
        }
        .countdown{
            height: 32rpx;
            padding: 0 8rpx 0 16rpx;
            color:#f30300;
            border-top:2rpx solid #F30300;
            border-right:2rpx solid #F30300;
            border-bottom:2rpx solid #F30300;
            border-top-right-radius: 6rpx;
            border-bottom-right-radius: 6rpx;                   
        }
    }
    /* 普通倒计时样式 */
    .normal-countdown {
        width: 374rpx;
        margin-left: 23rpx;
        font-size: 26rpx;
        color: #222222;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
        margin-right: 18rpx;
        .order-title {
            font-size: 30rpx;
            color: #222222;
            font-weight: bold;
            margin-bottom: 12rpx
        }

        .countdown {
            color: #666666;
            font-size: 26rpx;
        }
    }
</style>