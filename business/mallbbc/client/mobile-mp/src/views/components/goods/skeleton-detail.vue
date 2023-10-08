<template>
    <view class="skeleton_container">
        <view class="thumb_mainImage" :style="[tempContainerImageStyle]"></view>
        <view class="skeleton_goods animated-opacity ">
            <view class="skeleton_short"></view>
            <view class="skeleton_long"></view>
            <view class="skeleton_middle"></view>
            <view class="skeleton_short"></view>
            <view class="skeleton_long"></view>
            <view class="skeleton_short"></view>
            <view class="skeleton_long"></view>
            <view class="skeleton_middle"></view>
            <view class="skeleton_short"></view>
            <view class="skeleton_long"></view>
            <view class="skeleton_middle"></view>
            <view class="skeleton_short"></view>
            <view class="skeleton_long"></view>
            <view class="skeleton_middle"></view>
            <view class="skeleton_short"></view>
            <view class="skeleton_long"></view>
            <view class="skeleton_middle"></view>
            <view class="skeleton_short"></view>
            <view class="skeleton_long"></view>
            <view class="skeleton_middle"></view>
            <view class="skeleton_short"></view>
            <view class="skeleton_long"></view>
            <view class="skeleton_middle"></view>
        </view>
        <view class="skeleton_bottom">
            <view>
                <view></view>
                <view></view>
            </view>
            <view></view>
        </view>
    </view>
</template>

<script>
export default {
    props: ['mainImage'],
    computed: {
        tempContainerImageStyle(){
            if(!this.mainImage || this.mainImage.length == 0){
                this.mainImage = 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_common_zhanweitu_jsh.svg'
            }
            return {
                backgroundImage: `url(${this.mainImage})`
            }
        },
    }
}
</script>

<style lang="scss" scoped>
//临时占位图
.skeleton_container {
    background-color: #fff;
    height: 100%;
    overflow-y: hidden;
    padding-top: 31px;
    display: flex;
    flex-direction: column;

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

    .thumb_mainImage {
        height: 750rpx;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        flex-shrink: 0;
    }

    .skeleton_goods {
        overflow-x: hidden;
        flex-grow: 1;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;


        &>view {
            margin-top: 20rpx;
        }


        &>view:nth-child(3n) {
            margin-top: 60rpx;
        }

        &>view:nth-child(4n) {
            margin-top: 50rpx;
        }

        &>view:nth-child(2) {
            margin-left: 80rpx;
            position: relative;
        }

        &>view:nth-child(2)::before {
            content: "";
            width: 60rpx;
            height: 30rpx;
            position: absolute;
            left: -80rpx;
            background-color: #eaeff4;
        }

        .skeleton_long {
            height: 30rpx;
            width: 100%;
            background-color: #eaeff4;
        }

        .skeleton_middle {
            height: 28rpx;
            width: 70%;
            background-color: #eaeff4;
        }

        .skeleton_short {
            height: 30rpx;
            width: 40%;
            background-color: #eaeff4;
        }
    }

    .skeleton_bottom {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 100rpx;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;


        &>view:nth-child(1) {
            flex: 1;
            display: flex;
            height: 100%;
            align-items: center;
            padding: 0 20rpx;
            justify-content: space-around;

            &>view {
                height: 50rpx;
                width: 50rpx;
                background-color: #eaeff4;
                border-radius: 10rpx;
            }
        }

        &>view:nth-child(2) {
            flex: 2;
            height: 100%;
            background-color: #eaeff4;
            border-radius: 10rpx;
        }


    }
}</style>