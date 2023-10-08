<!-- 鹅毛情领取页首页上面领取进度
-->
<template>
    <view>
        <!-- 未领取和领取人进来显示 -->
        <view class="receive-process" :class="{margin10:current>=0}">
            <view>
                <steps :stepsList="stepsList" :current="current"/>
            </view>
            <view class="receive-tips" v-if="current==0 && finishPay">
                <view class="receive_tips_con flex_row_center_center">
                    <text>{{$L('剩余')}}</text>
                    <text class="time" v-if="timeObj.days!='00'"><text class="num-font">{{timeObj.days}}</text>天</text>
                    <text class="time"><text class="num-font">{{timeObj.hours}}</text>小时<text class="num-font">{{timeObj.minutes}}</text>分</text>
                    <text>{{$L('未收礼将自动失效')}}</text>
                </view>
            </view>
            <view class="receive-tips" v-if="current==1">
                <view class="receive_tips_con flex_row_center_center">{{$L('礼物已收下，快来填写你的收货地址吧！')}}</view>
            </view>
            <view class="receive-tips" v-if="current==2">
                <view class="receive_tips_con flex_row_center_center">{{$L('已完成收礼，快去看看礼物到哪里了')}}</view>
            </view>
        </view>
        
    </view>
</template>

<script>
import steps from "@/components/steps/index.vue";
export default {
    name: "receive-process",
    data() {
        return {
            stepsList:[
                {
                    img:'gift/icon_common_1_nor.png',
                    imgActive:'gift/icon_common_1_sel.png',
                    imgCompleted:'gift/icon_common_wancheng.png',
                    title:'收下礼物'
                },
                {
                    img:'gift/icon_common_2_nor.png',
                    imgActive:'gift/icon_common_2_sel.png',
                    imgCompleted:'gift/icon_common_wancheng.png',
                    title:'填写收礼地址'
                },
                {
                    img:'gift/icon_common_3_nor.png',
                    imgActive:'gift/icon_common_3_sel.png',
                    imgCompleted:'gift/icon_common_wancheng.png',
                    title:'完成收礼'
                }
            ]
        }
    },
    components: {
        steps
    },
    props: {
        current: {
            type:[Number, String],
            default:0
        },
        timeObj:{
            type:Object
        },
        // 是否已付款
        finishPay:{
            type: Boolean
        }
    },
    methods: {
        
       
    }
}
</script>

<style lang='scss' scoped>
.receive-process{
    padding: 20rpx 0 28rpx 0;
    border-radius: 0px 0px 20rpx 20rpx;
    background: #fff;
    .receive-tips{
        padding: 0 82rpx 0 66rpx;
        margin-top: 26rpx;
    }
    .receive_tips_con{
        width: 100%;
        height: 72rpx;
        font-size: 28rpx;
        border-radius: 36rpx;
        color: #666666;
        .time{
            font-weight: normal;
            color: #222222;
        }
        text:first-child{
            margin-right: 8rpx;
        }
        text:last-child{
            margin-left: 8rpx;
        }
    }
    .notMoreGift{
        font-size: 32rpx;
        color: #666666;
    }
}
</style>
