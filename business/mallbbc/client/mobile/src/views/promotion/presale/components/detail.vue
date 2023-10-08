<template>
    <view v-if="show">
        <view class="presale2" :style="'background-image:url('+imgUrl+'activity/pre_sale_bg.png);background-size:100% 100%;background-repeat:no-repeat;margin-top:-26rpx;position:relative'">
            <view class="presale1_left">
                <!-- 进行中 -->
                <view class="presale1_price">
                    <view class="presale1_title">{{$L("预售价")}}: </view>
                    <view class="presale1_title_b"><text>￥</text><text>{{detail.presellPrice}}</text></view>
                    <view class="presale1_price1 presale1_price2">
                        <image :src="imgUrl + 'site/yushouhuore.png'"></image>
                        <view>
                            <view class="presale_oragin_price">{{$L("原价")}}：{{detail.productPrice}}</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="presale1_right">
                <view class="collect_deposit" v-if="detail.type==1">
                    <text>{{$L("预售定金")}}</text>
                    <text>￥{{detail.firstMoney}}</text>
                    <text v-if="detail.firstExpand>0">{{$L("可抵")}}</text>
                    <text v-if="detail.firstExpand>0">￥{{detail.firstExpand}}</text>
                </view>
                <view class="collect_deposit" v-if="detail.type==2&&detail.pre_run!=1">
                    <text>{{$L("已售")}}</text>
                    <text>{{' '}}{{detail.saleNum}}{{$L("件")}}</text>
                </view>
                <view class="collect_deposit" v-if="detail.type==2&&detail.pre_run==1">
                    <text></text>
                    <text>即将开始</text>
                </view>
                <view class="presale1_start_time" v-if="detail.pre_run == 1">{{$L("活动开始时间")}}:{{detail.startTime}}</view>
                <view class="presale1_start_time1" v-else>{{$L("活动结束时间")}}：{{detail.endTime}}</view>
            </view>
        </view>
        <view class="presale3" v-if="detail.pre_run!=1">
            <view class="presale_desc" v-if="detail.type==1">{{$L("付尾款时间")}}：{{detail.remainStartTime}} ~ {{detail.remainEndTime}}</view>
            <view class="presale_desc">{{$L("发货时间")}}：{{detail.deliverTime}}</view>
        </view>
    </view>
</template>

<script>
export default {
    props:['detail'],
    data(){
        return {
            imgUrl:getApp().globalData.imgUrl,
            secInterval: null
        }
    },
    created() {
        
    },
    computed: {
        show(){
            return Object.keys(this.detail).length > 0
        }
    },
    watch: {
        detail: {
            handler(val){
                this.initCountTime(val);
                this.initData(val)
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        initCountTime(){
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
                }
            }, 1000)
        },

        initData(){
            let now = new Date()
            let preStartDate = new Date(this.detail.startTime.replace(/-/g, '/'))
            let preEndDate = new Date(this.detail.endTime.replace(/-/g, '/'))
            this.detail.endTime = this.detail.endTime.substring(0, this.detail.endTime.length - 3)
            this.detail.startTime = this.detail.startTime.substring(0, this.detail.startTime.length - 3)
            if (now > preStartDate && now < preEndDate) {
                this.detail.pre_run = 2 //活动进行中
            } else if (now < preStartDate) {
                this.detail.pre_run = 1 //活动未开始
            } else if (now > preEndDate) {
                this.detail.pre_run = 3 //活动已结束
            }
        }
    }
}
</script>

<style lang="scss">
    .presale3{
        background-color: #fff;
        padding: 20rpx;
        .presale_desc{
            
            font-size: 26rpx;
            color: #999999;
            &:nth-child(2){
                margin-top: 14rpx;
            }
        }
    }
    
    .presale1 {
        width: 100%;
        height: 163rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20rpx 0 53rpx;
        box-sizing: border-box;
    }
    
    .presale1_left {
        display: flex;
        flex-direction: column;
        padding-top: 15rpx;
        height: 100%;
    }
    
    .presale1_price {
        display: flex;
        flex-direction: column;
        
    }
    
    .presale1_title {
        font-size: 28rpx;
        
        font-weight: nornal;
        color: rgba(254, 254, 254, 1);
        line-height: 40rpx;
    }
    
    .presale1_title_b {
        font-size: 28rpx;
        
        font-weight: nornal;
        color: rgba(254, 254, 254, 1);
        line-height: 46rpx;
        margin-left: 40rpx;
        text:nth-child(2){
            font-size: 45rpx;
        }
    }
    
    .presale1_price1 {
        display: flex;
        align-items: center;
    }
    
    .presale1_price2 {
        display: flex;
        align-items: flex-start;
        margin-top: 10rpx;
    }
    
    .presale1_price1 image {
        width: 24rpx;
        height: 28rpx;
    }
    
    .presale1_prices {
        display: flex;
        font-size: 30rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
    }
    
    .presale_oragin_price {
        font-size: 22rpx;
        
        font-weight: 400;
        text-decoration: line-through;
        color: rgba(254, 254, 254, 1);
        opacity: 0.7;
        margin-left: 36rpx;
    }
    
    .presale1_right {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .presale2 {
        width: 100%;
        height: 163rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20rpx 0 39rpx;
        box-sizing: border-box;
    }
    
    .collect_deposit {
        display: flex;
        font-size: 24rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        align-items: center;
        white-space: pre-wrap;
    }
    
    .collect_deposit text:nth-child(2){
        font-size: 40rpx;
        margin-right: 10rpx;
        font-weight: bold;
        white-space: pre-wrap;
    }
    .collect_deposit text:nth-child(4) {
        font-size: 26rpx;
        margin-right: 10rpx;
        font-weight: bold;
        white-space: pre-wrap;
    }
    
    .presale1_start_time {
        width: 380rpx;
        height: 30rpx;
        background: rgba(255, 255, 255, 1);
        border-radius: 15rpx;
        font-size: 20rpx;
        
        font-weight: 500;
        color: #F91573;
        text-align: center;
        line-height: 30rpx;
        margin-top: 10rpx;
    }
    
    .presale1_start_time1 {
        width: 380rpx;
        height: 30rpx;
        background:rgba(255, 255, 255, 1);
        border-radius: 15rpx;
        font-size: 20rpx;
        
        font-weight: 500;
        color: #F91573;
        text-align: center;
        line-height: 30rpx;
        margin-top: 10rpx;
    }
</style>
