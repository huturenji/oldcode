<template>
    <view v-if="show" class="ladder ladder_bg" :style="'background-image:url('+imgUrl+'activity/ladder_regiment_end1.png);background-size:100% 100%;background-repeat:no-repeat;'">
        <view class="ladder_left">
            <view class="ladder_deposit">
                <view class="deposit_text">{{$L('定金')}}</view>
                <view class="deposit"><text>￥</text><text>{{filters.toFix(detail.advanceDeposit)}}</text></view>
            </view>
            
            <view class="deposit_price">
                <text>{{$L('现价')}}：{{filters.toFix(detail.currentPrice)}}</text>
                <text v-if="detail.currentLadderLevel>0">{{$L('原价')}}：{{filters.toFix(detail.productPrice)}}</text>
            </view>
            
        </view>
        <view class="jtt_right">
            <view class="activity_not_started" v-if="detail.ladder_run>1">{{detail.distanceEndTime!=0?$L("活动进行中"):$L("活动已结束")}}</view>
            <!-- <view class="activity_not_started">已参团{{detail.bbc_already_num}}人</view> -->
            <view class="pro_wrap" v-if="detail.distanceEndTime!=0&&detail.ladder_run>1">
                <view class="pro" :style="'width: ' + ladderProcess + '%;'"></view>
            </view>
            <view class="djs" v-if="detail.distanceEndTime!=0">
                <text class="count_down_title">{{detail.ladder_run==1?'距开始':'距结束'}}</text>
                <text class="count_down_day ">{{ladderDay*1>0?ladderDay:'00'}}{{$L('天')}}</text>
                <text class="count_down_hours limited_discount_hours ladder_text">{{ladderHour*1>0?ladderHour:'00'}}</text>
                <text class="count_down_flag">:</text>
                <text class="count_down_minutes limited_discount_minutes ladder_text">{{ladderMinute*1>0?ladderMinute:'00'}}</text>
                <text class="countdown-break-flag">:</text>
                <text class="count_down_seconds limited_discount_seconds ladder_text">{{ladderSecond*1>0?ladderSecond:'00'}}</text>
            </view>
        </view>
    </view>
</template>

<script module="filters" lang="wxs" src="@/utils/filter.wxs"></script>
<script>
    export default{
        props:{
            // 活动详情
            detail: {
                type: Object,
                default: () => {}
            }
        },
        data(){
            return{
                imgUrl:getApp().globalData.imgUrl,
                ladderDay:'00',
                ladderHour:'00',
                ladderMinute:'00',
                ladderSecond:'00'
            }
        },
        computed: {
            show(){
                return Object.keys(this.detail).length > 0
            },
            ladderProcess(){
                return this.detail.joinedNum < this.detail.ruleList[this.detail.ruleList.length - 1]
                            .joinGroupNum ? (this.detail.joinedNum / this.detail.ruleList[this.detail.ruleList.length - 1]
                                .joinGroupNum) * 100 : 100
            }
        },
        created() {
            let countTime = 0; //剩余时间秒
            let now = new Date()
            let start = new Date(this.detail.startTime)
            if(this.detail.ladder_run==1){
                countTime = (start.getTime() - now.getTime())/1000
            }else{
                countTime = this.detail.distanceEndTime
            }
            this.secInterval = setInterval(()=>{
                if(countTime == 0){
                    //倒计时结束，清除倒计时
                    clearInterval(this.secInterval);
                    this.$emit('initGoodsDetail')
                }else{
                    countTime--;
                    let day = parseInt(countTime / 60 / 60 / 24);
                    let hours = parseInt(countTime / 60 / 60 % 24);
                    let minutes = parseInt(countTime / 60 % 60);
                    let seconds = parseInt(countTime % 60);
                    this.ladderDay = day;
                    this.ladderHour = hours > 9 ? hours : '0' + hours;
                    this.ladderMinute = minutes > 9 ? minutes : '0' + minutes;
                    this.ladderSecond = seconds > 9 ? seconds : '0' + seconds;
                }
            },1000)
        }
    }
</script>

<style lang="scss" scoped>
/* 阶梯团活动 */
.ladder {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 140rpx;
    overflow: hidden;

}

/* 阶梯团活动end */
.jtt_left {
    position: relative;
    flex: 0 0 501rpx;
    display: flex;
    align-items: center;
    height: 110rpx;
    background-color: #ed6307;
    color: #fff;
    font-size: 22rpx;
    .dj {
        flex: 0 0 280rpx;
        font-size: 30rpx;
        text-align: center;
        text {
            font-size: 36rpx;
        }
    }
}
.jtt_right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 140rpx;
    font-size: 24rpx;
    color: #5f4a08;
    .activity_not_started {
        font-size: 30rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
    }
    .djs {
        font-size: 20rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        display: flex;
        align-items: center;
        .count_down_title {
            font-size: 24rpx;
            
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            flex-shrink: 0;
        }
        .count_down_day {
            font-size: 20rpx;
            
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            margin: 0 9rpx;
            flex-shrink: 0;
        }
        .count_down_hours,
        .count_down_minutes,
        .count_down_seconds {
            width: 34rpx;
            height: 34rpx;
            background: rgba(255, 255, 255, 1);
            border-radius: 50%;
            text-align: center;
            color: #FF284D;
            font-size: 20rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 34rpx;
        }
    
        .count_down_flag,.countdown-break-flag {
            font-size: 20rpx;
            color: #fff;
            margin: 0 9rpx;
        }
        .limited_discount_hours,
        .limited_discount_minutes,
        .limited_discount_seconds {
            color: #B329FA;
        }
    
    }
}
.jtt_price {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 90rpx;
}
.pro_wrap {
    width: 210rpx;
    height: 9rpx;
    border: 1rpx solid #FFFFFF;
    border-radius: 5rpx;
    overflow: hidden;
    margin: 11rpx 0 19rpx;
    .pro {
        width: 0;
        height: 14rpx;
        background: linear-gradient(-90deg, #FEEAD6 0%, #FFFFFF 100%);
        border-radius: 5rpx;
    }
}
.ladder_bg {
    width: 750rpx;
    height: 140rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20rpx 0 23rpx;
    box-sizing: border-box;
    .ladder_left {
        height: 140rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .ladder_deposit {
            display: flex;
            align-items: flex-end;
            margin-bottom: 18rpx;
            .deposit_text {
                font-size: 30rpx;
                
                font-weight: 500;
                color: rgba(255, 255, 255, 1);
            }
            .deposit {
                font-size: 30rpx;
                
                font-weight: 500;
                color: rgba(255, 255, 255, 1);
                line-height: 30rpx;
                text:nth-child(2) {
                    font-size: 50rpx;
                    font-weight: bold;
                }
    
            }
    
        }
        .deposit_price {
            display: flex;
            align-items: center;
            text:nth-child(1) {
                font-size: 24rpx;
                
                font-weight: 500;
                color: rgba(255, 255, 255, 1);
            }
            text:nth-child(2) {
                font-size: 20rpx;
                
                font-weight: 400;
                text-decoration: line-through;
                color: rgba(254, 254, 254, 1);
                opacity: 0.7;
                margin-left: 19rpx;
                text-decoration: line-through;
            }
        }
    }
}
.ladder_text {
    color: #FD8E01 !important;
}
</style>
