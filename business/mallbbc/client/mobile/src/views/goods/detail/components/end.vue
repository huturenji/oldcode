<template>
    <!-- 到底了组件 -->
    <view class="end">
        <view class="tips"></view>
        <view class="text">到底啦</view>
        <view class="tips"></view>
    </view>
</template>
<script>
export default {
    props:{  
    
    }
}
</script>
<style scoped lang='scss'>
.end{
    width: 100%;
    height: 80rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #EFF2F5;
    .text{
        margin: 0 12rpx;
        font-size: 28rpx;
        
        font-weight: 400;
        text-align: center;
        color: #999999;
        line-height: 40rpx;
    }
    .tips{
        width: 22rpx;
        height: 2rpx;
        background: #d8d8d8;
    }
}
</style>