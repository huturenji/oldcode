<!-- 步骤条组件
-->
<template>
    <view class="steps">
        <view class="steps_con flex_row_center_center">
            <view v-for="(item,index) in stepsList" :key="index" class="flex_row_center_end">
                <view class="flex_column_center_center">
                    <image
                    :src="(current>index || current==stepsList.length-1)?imgUrl+item.imgCompleted:current==index?imgUrl+item.imgActive:imgUrl+item.img"></image>
                    <text class="title" :style="current>=index?activeTitleStyle:inactiveTitleStyle">{{item.title}}</text>
                </view>
                <view class="dashedDot" v-if="index!=stepsList.length-1" :class="{activeDotStyle:current>index}"></view>
            </view>
        </view>
    </view>
</template>

<script>

export default {
    name: "steps",
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
        }
    },
    components: {
        
    },
    props: {
        stepsList: {
            type: Array
        },
        current: {
            type:[Number, String],
            default:0
        },
        // title选中样式
        activeTitleStyle: {
            type: Object,
            default:()=>{
                return {color:'#f30300',fontWeight:'bold'}
            }
        },
        // title未选中样式
        inactiveTitleStyle: {
            type: Object,
            default:()=>{}
        }
    },
    methods: {
        
       
    }
}
</script>

<style lang='scss' scoped>
.steps_con{
    image{
        width: 48rpx;
        height: 48rpx;
    }

    .title{
        margin-top: 8rpx;
        line-height: 42rpx;
        font-size: 28rpx;
        color: #999999;
    }
    
    .dashedDot{
        width: 78rpx;
        height: 2rpx;
        margin: 0 16rpx 16rpx;
        border: 2rpx dashed #c2c2c2;
        &.activeDotStyle{
            border: 2rpx solid #f30300;
        }
    }
}
</style>
