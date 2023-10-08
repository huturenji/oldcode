<!--
 * @Author: whchen
 * @Descripttion: 
 * @Date: 2023-04-18 08:52:32
 * @LastEditTime: 2023-04-18 17:24:52
 * @FilePath: \mobile-miniprogram\src\common\components\thumb-goods-tags\logistics-icon.vue
-->
<template>
    <view class="logistics-wrapper">
        <!-- 京东物流 -->
        <view class="logistics-icon" v-if="showJdLogistics">
            <view class="icon-bg">
                <image mode="widthFix" :src="airplaneImg" />
            </view>
            <view>京东物流</view>
        </view>
        <!-- 厂家配送 -->
        <view class="logistics-icon" v-else>
            <view>厂家配送</view>
        </view>
    </view>
</template>

<script>
// import { isString, isObject, isNotEmpty } from '@/utils/common.js';
export default {
    data() {
        return {
            airplaneImg: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_xq_feiji.svg",
        }
    },
    props: {
        showJdLogistics: {
            type: Boolean,
            default: false
        }
    },
    computed: {

    }
}
</script>

<style scoped lang="scss">
.logistics-wrapper {
    display: flex;
    margin-top: 8rpx;
    .logistics-icon {
        display: flex;
        align-items: center;
        height: 28rpx;
        line-height: 28rpx;
        margin-right: 12rpx;
        color: #F30300;
        font-size: 18rpx;
        border: 1rpx solid #F30300;
        border-radius: 4rpx;
        transform: rotateZ(360deg);
        padding: 0 8rpx;
        .icon-bg {
            display: flex;
            align-items: center;
            background: #F30300;
            width: 28rpx;
            height: 100%;
            padding: 2rpx;
            transform: translateX(-8rpx);
        }
    }
}
</style>
