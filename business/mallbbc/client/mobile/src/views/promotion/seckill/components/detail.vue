<!-- 商品详情页涉及秒杀价格模块的显示组件 -->
<template>
    <!-- 秒杀活动 start -->
    <view v-if="show" class="goods_detail_thumb second_kill">
        <!-- 秒杀活动  detail.state ：1未开始   2进行中 3结束-->
        <!-- 秒杀活动未开始 start -->
        <view v-if="detail.state == 1" class="seckill_will_start flex_row_start_center">
            <view class="left flex_column_between_start">
                <view class="title">{{$L('当前价')}}</view>
                <view v-if="priceInfo.originalSalePrice" class="price" :style="{fontSize:leftPrice['small'][filters.toSplit(filters.toFix(priceInfo.originalSalePrice))[0].length]+'rpx'}">
                    <text class="num-font">¥</text>
                    <text class="num-font intPrice" :style="{fontSize:leftPrice['big'][filters.toSplit(filters.toFix(priceInfo.originalSalePrice))[0].length]+'rpx'}">{{filters.toSplit(filters.toFix(priceInfo.originalSalePrice))[0]}}.</text>
                    <text class="num-font">{{filters.toSplit(filters.toFix(priceInfo.originalSalePrice))[1]}}</text>
                </view>
                <view v-else class="no_price" >
                    <text>￥</text>
                    <text class="">暂无报价</text>
                </view>
            </view>
            <view class="center flex_column_between_start">
                <view class="title">{{$L('限时秒杀')}}</view>
                <view class="price" :style="{fontSize:rightPrice['small'][filters.toSplit(filters.toFix(detail.promotionPrice))[0].length]+'rpx'}">
                    <text class="num-font">¥</text>
                    <text class="num-font intPrice" :style="{fontSize:rightPrice['big'][filters.toSplit(filters.toFix(detail.promotionPrice))[0].length]+'rpx'}">{{filters.toSplit(filters.toFix(detail.promotionPrice))[0]}}.</text>
                    <text class="num-font">{{filters.toSplit(filters.toFix(detail.promotionPrice))[1]}}</text>
                </view>
            </view>
            <view  v-if="!disabledModule" class="right flex_column_between_end">
                <view class="preview flex_row_center_center" v-if="!detail.remind" @click="secKillPreview">
                    <view class="img"></view>
                    <view>{{$L('提醒我')}}</view>
                </view>
                <view class="cancel_preview flex_row_center_center" v-else @click="secKillPreview">
                    {{$L('取消提醒')}}
                </view>
                <view class="tips">
                    {{seckillTime + ' '+$L("开售")}}
                </view>
            </view>
        </view>
        <!-- 秒杀活动未开始 end -->
        <!-- 秒杀活动进行中 start -->
        <view v-if="detail.state == 2" class="seckill_start flex_row_between_center">
            <view class="second_kill_left">
                <view class="promotion_icon">{{$L('限时秒杀')}}</view>
                <view class="second_price_box flex_row_start_end">
                    
                    <view class="price num-font"
                        v-if="filters.toSplit(filters.toFix(detail.promotionPrice))[0] && filters.toSplit(filters.toFix(detail.promotionPrice))[1]">
                        <text>¥</text><text class="intPrice">{{filters.toSplit(filters.toFix(detail.promotionPrice))[0]}}</text>.<text>{{filters.toSplit(filters.toFix(detail.promotionPrice))[1]}}</text>
                    </view>
                    
                    <view v-if="priceInfo.originalSalePrice" class="second_kill_price line_through num-font">
                        <view>{{$L('原价')}}</view>
                        <view>¥{{filters.toFix(priceInfo.originalSalePrice)}}</view>
                    </view>
                    <view v-else class="no_price" >
                        <text>￥</text>
                        <text class="">暂无报价</text>
                    </view>
                </view>
            </view>
            <view class="second_kill_right">
                <view class="second_kill_text">
                    {{$L('距离结束')}}
                </view>
                <view class="sec_kill_countdown">
                    <text class="time num-font">{{secKillHr}}</text>
                    <text class="time_tips"></text>
                    <text class="time num-font">{{secKillMin}}</text>
                    <text class="time_tips"></text>
                    <text class="time num-font">{{secKillSec}}</text>
                </view>
            </view>
        </view>
        <!-- 秒杀活动进行中 end -->

    </view>
    <!-- 秒杀活动 end -->
</template>
<script module="filters" lang="wxs" src="@/utils/filter.wxs"></script>
<script>
import promotionHandler from "@/views/promotion/common/handler";
import {
    mapState,
    mapMutations,
    mapGetters
} from 'vuex';
export default {
    components: {
       
    },
    props:{
        // 秒杀活动详情
        detail: {
            type: Object,
            default: () => {}
        },
        // 价格相关信息
        priceInfo: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            secKillDay: '00', //秒杀活动倒计时 天
            secKillHr: '', //秒杀活动倒计时 时
            secKillMin: '', //秒杀活动倒计时 分
            secKillSec: '', //秒杀活动倒计时 秒 
            timer: null, //倒计时对象
            rightPrice:{ //价格字号大小枚举
                small:{1:32,2:32,3:32,4:32,5:30,6:26,7:24,8:24},
                big:{1:48,2:48,3:48,4:48,5:40,6:36,7:32,8:28}
            },
            leftPrice:{
                small:{1:32,2:32,3:32,4:32,5:30,6:30,7:26,8:24},
                big:{1:48,2:48,3:48,4:48,5:48,6:40,7:36,8:32}
            }
        };
    },
    created() {
    },
    watch: {
        detail: {
            handler(val){
                this.initCountTime(val);
            },
            immediate: true,
            deep: true
        }
    },
    computed: {
        ...mapState(['hasLogin', 'userInfo']),
        ...mapGetters(['disabledModule']),
        show(){
            return Object.keys(this.detail).length > 0
        },
        seckillTime(){
            return this.detail.startTime.substring(0, this.detail.startTime.length-3)
        }
    },
    
    methods: {
        // 初始化倒计时相关功能
        initCountTime(detail){
            let that = this;
            if (detail.state == 1 || detail.state == 2) {
                let countTime = detail.distanceTime; //剩余时间秒 单位：s【秒】
                that.getTime(countTime);
                that.timer = setInterval(() => {
                    if (countTime <= 0) {
                        //倒计时结束，清除倒计时
                        clearInterval(that.timer);
                        if(detail.state == 1){ // 未开始秒杀的商品倒计时结束之后，需要重新拉取秒杀详情
                            that.$emit('initPromotionDetail')
                        } else { // 秒杀结束的商品需要重新调用商品详情
                            that.$emit('initGoodsDetail')
                        }
                    } else {
                        countTime--;
                        that.getTime(countTime);
                    }
                }, 1000)
            }
        },  

        // 倒计时处理
        getTime(countTime){
            // let day = parseInt(countTime / 60 / 60 / 24);
            let hours = parseInt(countTime / 60 / 60);
            let minutes = parseInt(countTime / 60 % 60);
            let seconds = parseInt(countTime % 60);
            // this.secKillDay = day;
            this.secKillHr = hours > 9 ? (hours> 99? '99' : hours) : ('0' + hours);
            this.secKillMin = minutes > 9 ? minutes : '0' + minutes;
            this.secKillSec = seconds > 9 ? seconds : '0' + seconds;
        },

        //秒杀活动提醒我及取消提醒
        secKillPreview() {
            if (!this.hasLogin) {
                //提示登陆
                return;
            } else {
                let param = {};  
                param.key = this.userInfo.access_token;
                param.productId  = this.detail.productId; //秒杀商品id
                promotionHandler.setSeckillRemind(param).then(res => {
                    if (res.state == 200) {
                        this.detail.remind = !this.detail.remind;
                        if (this.detail.remind){
                            this.$api.msg('活动预约成功');
                        } else{
                            this.$api.msg('取消预约成功');
                        }

                        //取消提醒或者设置提醒的时候，将该stageSkuId记录在 全局window对象下面，此处是为了在商品详情页变更设置和取消提醒之后，回退到秒杀列表页面，此时秒杀列表的设置和取消提醒的状态没有变更
                        window.productId  = this.detail.productId ;
                        window.remind = this.detail.remind;


                    } else {
                        this.$api.msg(res.msg);
                    }
                }).catch((e) => {
                    //异常处理
                })
            }
        },
}
        
}
</script>

<style lang='scss' scoped>
/* 秒杀活动 start */
.second_kill {
    width: 750rpx;
    height: 116rpx;
    .price{
        margin-top: 12rpx;
        height: 38rpx;
        line-height: 38rpx;
        font-size: 32rpx;
        .intPrice{
            font-size: 48rpx;
        }
    }
}
.seckill_will_start{
    padding: 0 28rpx;
    height: 100%;
    background: var(--xianshimiaosha);
    background-size: 100% 100%;
    .no_price{
        color:var(--prizeColor1);
    }
    .left,.center{
        height: 100%;
        padding: 12rpx 0 18rpx 0;
        font-size: 26rpx;
    }
    .title{
        line-height: 36rpx;
        font-weight: bold;
    }
    .left{
        width:248rpx;
        padding-right: 48rpx;
        color: var(--prizeColor1); 
        
    }
    .center{
        width: 174rpx;
        color: var(--prizeColor2);
        .title{
            padding-left: 20rpx;
        }
    }
    .right {
        flex: 1;
        height: 100%;
        padding: 14rpx 0 16rpx 0;
        .preview{ 
            color: var(--confirmBtnBgColor2);
            .img {
                width: 28rpx;
                height: 28rpx;
                background: var(--naozhongBg1);
                background-size: 100% 100%;
            }
            text {
                margin-left: 4rpx;
                line-height: 24rpx;
            }
        }
        .tips{
            font-size: 22rpx;
            font-weight: bold;
            color: var(--prizeColor2);
            word-break: break-all;
        }
        .cancel_preview,.preview{
            width: 144rpx;
            // margin: 14rpx 0 6rpx 0;
            height: 52rpx;
            background: #fff;
            border-radius: 26rpx;
            font-size: 24rpx;
            font-weight: bold;
        }
        .cancel_preview{
            color: var(--detailNoRemind);
        }
    }
}
.seckill_start{
    padding: 0 30rpx;
    height: 100%;
    background: var(--xianshimiaoshao2);
    background-size: 100% 100%;
    .price{
        margin-bottom: 10rpx;
        color: var(--prizeColor2);
    }
}

.second_kill_left {
    height: 100%;
    padding-top: 14rpx;
}
.promotion_icon{
    line-height: 40rpx;
    height: 40rpx;
    background: var(--naozhongBg);
    background-size: 30rpx 30rpx;
    padding-left: 34rpx;
    height: 30rpx;
    font-size: 28rpx;
    color: var(--miaoshaTipsColor);
    font-weight: 600;
    display: flex;
    align-items: center;
    padding-bottom: 4rpx;
}

.second_kill_price {
    margin-left: 14rpx;
    font-size: 24rpx;
    
    color: var(--prizeColor3);
    height: 36rpx;
    display: flex;
    position: relative;
    &.line_through::before{
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background: var(--prizeColor3);
        position: absolute;
        top: 18rpx;
    }
    .price{
        font-size: 26rpx;
        padding-left: 6rpx;
    } 
}
.no_price{
    font-size: 36rpx;
    font-weight: bold;
    text-align: left;
    color: #222222;
    margin-top: 10rpx;
}
.second_kill_right {
    height: 100%;
    padding: 16rpx 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}

.second_kill_text {
    font-size: 24rpx;
    
    color: #ffffff;
    margin-bottom: 12rpx;
    height: 34rpx;
}

.sec_kill_countdown {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    
    font-weight: 600;
    color: #FF333A;
    line-height: 34rpx;
}

.sec_kill_countdown .day {
    margin-right: 10rpx;
}

.sec_kill_countdown .time { 
    width: 48rpx;
    height: 36rpx;
    line-height: 36rpx;
    background: url('@/static/shared/goods/bg_bnj_time1.svg') center no-repeat;
    background-size: 100% 100%;
    font-weight: bold;
    text-align: center;
    color: #222222;
}

.sec_kill_countdown .time_tips {
    width: 6rpx;
    height: 24rpx;
    background: url('@/static/shared/goods/bg_bnj_time2.svg') center no-repeat;
    background-size: 100% 100%;
    margin: 0 12rpx;
}

/* 秒杀活动 end */
</style>
