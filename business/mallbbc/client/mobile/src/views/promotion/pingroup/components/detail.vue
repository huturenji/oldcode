<template>
    <view class="pingtuanA"
        :style="'background: url(' + img_url + 'activity/group_bg.png) no-repeat;background-size:100% 100%;'">
        <view class="pintuan_left">
            <view class="pintuan_left_price" v-if="detail.spellPrice">￥{{detail.spellPrice}}</view>
                <view class="pintuan_left_group">
                    <view class="pintuan_left_num">
                        <image :src="img_url + 'activity/pintuan.png'"></image>
                        <text>{{detail.requiredNum}}{{$L("人团")}}</text>
                    </view>
                    <view class="group_return_regiment fontScaleIgnore" v-if="detail.leaderPrice!=0">
                        {{$L("团长优惠价")}}￥{{detail.leaderPrice}}
                    </view>
                </view>
        </view>
        <!-- promotion_start_flag   1未开始 0结束 2进行中-->
        <!-- 进行中 -->
        <view class="pintuan_right" v-if="detail.state == 1">
            <view class="pintuan_right_num">{{$L("已拼")}}{{detail.saleNum}}{{$L("件")}}</view>
            <view>
                <text style="font-size: 26rpx;">{{$L("距结束")}}</text>
                <div class="countdown" style="display: inline-block;width: auto;">
                    <div class="countdown_group fontScaleIgnore">
                        <text>{{pinDay || 0}}{{$L("天")}}</text>
                        <text class="countdown1">{{pinHours}}</text>
                        <text class="countdown2">:</text>
                        <text class="countdown1">{{pinMinutes}}</text>
                        <text class="countdown2">:</text>
                        <text class="countdown1">{{pinSeconds}}</text>
                    </div>
                </div>
            </view>
        </view>
        <!-- 未开始 -->
        <view class="pintuan_right" v-if="detail.state == 0">
            <view class="pintuan_right_num">{{$L("活动未开始")}}</view>
            <view>
            <text style="font-size: 26rpx;">{{$L("距开始")}}</text>
                <div class="countdown" style="display: inline-block;width: auto;">
                    <div class="countdown_group fontScaleIgnore">
                        <text>{{pinDay || 0}}{{$L("天")}}</text>
                        <text class="countdown1">{{pinHours}}</text>
                        <text class="countdown2">:</text>
                        <text class="countdown1">{{pinMinutes}}</text>
                        <text class="countdown2">:</text>
                        <text class="countdown1">{{pinSeconds}}</text>
                    </div>
                </div>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'detail',
    props: ['detail'],
    data() {
        return {
            img_url: getApp().globalData.imgUrl,
            pinDay: '00',
            pinHours: '00',
            pinMinutes: '00',
            pinSeconds: '00',
            secInterval: null
        }
    },
    created() {
        let countTime = 0;
        let now = new Date()
        let startTime = new Date(this.detail.startTime)
        if (now < startTime) {
            countTime = (startTime.getTime() - now.getTime()) / 1000
            
        } else {
            countTime = this.detail.distanceEndTime
        }
        this.secInterval = setInterval(() => {
            if (countTime == 0) {
                //倒计时结束，清除倒计时
                clearInterval(this.secInterval);
                this.$emit('initGoodsDetail')
            } else {
                countTime--;
                let day = parseInt(countTime / 60 / 60 / 24);
                let hours = parseInt(countTime / 60 / 60 % 24);
                let minutes = parseInt(countTime / 60 % 60);
                let seconds = parseInt(countTime % 60);
                this.pinDay = day;
                this.pinHours = hours > 9 ? hours : '0' + hours;
                this.pinMinutes = minutes > 9 ? minutes : '0' + minutes;
                this.pinSeconds = seconds > 9 ? seconds : '0' + seconds;
            }
        }, 1000)
    }
}
</script>

<style>
    .pingtuanA {
        background-size: 100% 100%;
        width: 100%;
        height: 140rpx;
        display: flex;
        align-items: center;
        padding: 0 26rpx 0 31rpx;
        box-sizing: border-box;
        color: #FFFFFF;
        justify-content: space-between;
    }

    .pingtuanA .left {
        width: 60%;
        height: 100%;
        line-height: 100rpx;
        display: inline-block;
        float: left;
        overflow: hidden;
    }

    .left .jge {
        font-size: 51rpx;
        padding-left: 21rpx;
    }

    .tuanfan {
        float: right;
        font-size: 20rpx;
        width: 150rpx;
        height: 83rpx;
        line-height: 37rpx;
        padding-top: 17rpx;
    }

    .usertuan p {
        background: #b20a10;
        margin-top: 2rpx;
        padding: 0 12rpx;
        border-radius: 32rpx;
    }

    .usertuan image {
        width: 23rpx;
        height: 19rpx;
        margin-right: 5rpx;
    }

    .left .jge span {
        font-size: 32rpx;
        margin-right: 8rpx;
    }

    .pingtuanA .right {
        display: inline-block;
        width: 40%;
        height: 100%;
        background: transparent;
        padding: 12rpx 0 0 0;
        color: #65540f;
    }

    .dime {
        /* padding-left: 50rpx; */
        font-size: 20rpx;
        display: flex;
        align-items: center;
    }

    .dime image {
        display: inline-block;
        width: 26rpx;
        height: 26rpx;
    }

    .dime em {
        margin: 0 8rpx;
    }

    .pingtuanA .dime span {
        margin: 0 5rpx;
        display: inline-block;
        width: 34rpx;
        height: 24rpx;
        text-align: center;
        line-height: 24rpx;
        background: #d0b340;
    }

    .pingtuanA .dime span:nth-child(2n) {
        padding: 0;
        width: 1rpx;
        height: 1rpx;
    }

    .rtop {
        font-size: 28rpx;
        text-align: center;
        margin-bottom: 8rpx;
    }

    .pintuan_left {
        display: flex;
        flex-direction: column;
    }

    .pintuan_left_price {
        font-size: 44rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 44rpx;
    }

    .pintuan_left_group {
        display: flex;
        align-items: center;
        margin-top: 21rpx;
        min-width: 249rpx;
        height: 30rpx;
        border-radius: 15rpx 15rpx 0 15rpx;
    }

    .pintuan_left_num {
        min-width: 135rpx;
        height: 30rpx;
        background: #EF1720;
        border-radius: 15rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1rpx solid #FFFFFF;
        box-sizing: border-box;
    }

    .pintuan_left_num image {
        width: 25rpx;
        height: 21rpx;
        margin-right: 9rpx;
    }

    .pintuan_left_num text {
        font-size: 22rpx;
        
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
    }


    .group_return_regiment,.group_return_regiment.fontScaleIgnore {
        /* width:135rpx; */
        padding: 0 12rpx;
        box-sizing: border-box;
        height: 30rpx;
        background: rgba(255, 255, 255, 1);
        border-radius: 0 15rpx 0 15rpx;
        font-size: 22rpx;
        
        font-weight: 400;
        color: rgba(233, 17, 30, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: -10rpx;
    }

    .pintuan_right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .pintuan_right_num {
        font-size: 30rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
    }

    .pingtuan1 {
        width: 100%;
        height: 140rpx;
        display: flex;
        justify-content: space-between;
        padding: 0 20rpx 0 33rpx;
        box-sizing: border-box;
    }

    .count_down1 {
        display: flex;
        align-items: center;
    }

    .count_down_title {
        font-size: 24rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        flex-shrink: 0;
    }

    .countdown {
        display: flex;
        align-items: center;
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

    .count_down_flag {
        font-size: 20rpx;
        color: #fff;
        margin: 0 9rpx;
    }

    .limited_discount_hours,
    .limited_discount_minutes,
    .limited_discount_seconds {
        color: #B329FA;
    }

    .countdown_group.fontScaleIgnore{
        display: flex;
        /* align-items: center; */
        font-size: 24rpx;
        
        font-weight: 500;
        color: #FFFFFF;
    }

    .countdown1 {
        width: 34rpx;
        height: 34rpx;
        background: #FFFFFF;
        border-radius: 50%;
        font-size: 20rpx;
        
        font-weight: 500;
        color: #F12826;
        text-align: center;
        line-height: 34rpx;
        margin-left: 10rpx;
    }

    .countdown_group text:nth-of-type(1) {
        font-size: 24rpx;
        
        font-weight: 500;
        color: #FFFFFF;
    }

    .countdown2 {
        margin-left: 10rpx;
    }
</style>
