<template>
    <view class="noMore-data">
        <view class="text" :style="{color:color}">{{text}}</view>
    </view>
</template>
<script>
export default {
    name:"noMoreDataDivider",
    data() {
        return {
        };
    },
    props: {
        text: {
            type: String,
            default: '没有更多了'
        },
        color: {
            type: String,
            default: '#a4acb2'
        }
    },
    computed: {
    },
    created() {
    },
    methods: {
    }
}
</script>

<style lang='scss'>
.noMore-data{
    width: 100%;
    padding: 18rpx 0 34rpx 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .text{
        font-size: 28rpx;
        color: #a4acb2;
        position: relative;

        &::before{
            content: "";
            position: absolute;
            width: 24rpx;
            height: 2rpx;
            opacity: 0.5;
            background: #a4acb2;
            left: -32rpx;
            top: 50%;
        }
        &::after{
            content: "";
            position: absolute;
            width: 24rpx;
            height: 2rpx;
            opacity: 0.5;
            background: #a4acb2;
            right: -32rpx;
            top: 50%;
        }
    }
}
</style>
