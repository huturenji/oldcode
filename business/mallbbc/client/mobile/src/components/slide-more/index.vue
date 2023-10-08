<!-- 巨拾惠首页底部向上滑查看更多
-->
<template>
    <view class="slide-more flex_row_center_center">
        <view>{{ text }}</view>
    </view>
</template>

<script>

export default {
    name: "slideMore",
    data() {
        return {
            
        }
    },
    props: {
        text: {
            type: String,
            default:''
        }
    },
    methods: {}
}
</script>

<style lang='scss' scoped>
.slide-more{
    width: 100%;
    height: 104rpx;
    view {
        padding: 0rpx 12rpx;
        line-height: 40rpx;
        font-size: 28rpx;
        color: #A4ACB2;
        text {
            color: #222222;
        }
    }
    &::before,&::after {
        display: block;
        content: '';
        width: 18rpx;
        height: 2rpx;
        background: #a4acb2;
    }
}
</style>
