<!--
 * @Descripttion: your project
 * @Author: mawenshu
 * @Date: 2023-05-09 16:51:43
-->
<template>
    <view class="skeleton-wrap animated-opacity">
        <view :class="['item', { 'short_item': i % 2 == 0 }]" v-for="i in Number(row)" :key="i"></view>
    </view>
</template>

<script>
export default {
    props: {
        row: {
            type: Number,
            default: 3
        }
    }
}
</script>

<style lang="scss" scoped>
.skeleton-wrap {
    margin: 20rpx 0;
    border-radius: 20rpx;
    padding: 20rpx;
    background-color: #fff;

    .item {
        margin-bottom: 30rpx;
        display: flex;
        justify-content: space-between;

        &::before {
            content: '';
            display: block;
            width: 50%;
            height: 30rpx;
            background-color: #eaeff4;
        }

        &::after {
            content: '';
            display: block;
            width: 20%;
            height: 30rpx;
            background-color: #eaeff4;
        }

    }

    .short_item{
        margin-bottom: 20rpx;
        &::before {
            width: 30%;
        }
    }
}

.animated-opacity {
    animation-name: breathe;
    animation-duration: 0.7s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease;
    position: relative;
}

@keyframes breathe {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0.4;
    }
}
</style>