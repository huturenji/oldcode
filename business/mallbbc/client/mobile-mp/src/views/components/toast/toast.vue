<template>
    <view class="toast-box">
        <view v-if="mask" class="mask"></view>
        <view class="toast-icon">
            <slot name="toast-icon"></slot>
        </view>
        <view class="toast-content">
            <view class="toast-title">
                <slot name="toast-title"></slot>
            </view>
            <view class="toast-body">
                <slot name="toast-body"></slot>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'toast',
    props: {
        mask: {
            default: false,
            type: Boolean
        }
    },
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
.toast-box {
    .mask{
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
    }
    padding: 20rpx;
    position: fixed;
    z-index: 999;
    width: 400rpx;
    min-height: 300rpx;
    left: 50%;
    top: 50%;
    margin-left: -200rpx;
    margin-top: -150rpx;
    border-radius: 20rpx;
    background-color:  rgba($color: #000000, $alpha: 0.7);


    display: flex;
    flex-direction: column;
    align-items: center;

    .toast-content {
        display: flex;
        flex-direction: column;
        align-items: center;

        .toast-title,
        .toast-body {
            color: #fff;
            font-size: 28rpx;
            text-align: center;
        }
    }
}
</style>