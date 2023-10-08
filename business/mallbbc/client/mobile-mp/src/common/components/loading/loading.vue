<template name="loadingState">
<view>
    <!-- 这个状态已经删除了 -->
    <view  v-show="state == 'allow_loading_more'">
    </view>
    <view class="common_loading flex_row_center_center" v-show="state == 'first_loading'" :style="{marginTop:mTop}">
        <image class="loading_icon" :src="'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/loading/'+loadingImg" />
        <text class="tip" :style="{color:stateColor}">加载中...</text>
    </view>
    <view class="allow_loading_more flex_row_center_center" v-show="state == 'loading'">
        <image class="loading_more_icon" :src="'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/loading/'+loadingImg" />
        <text class="tip" :style="{color:stateColor}">数据加载中...</text>
    </view>
    <!-- showEndFlag 默认为true，展示，设置为false，则不展示 -->
    <view class="no_more_data" v-show="state == 'no_more_data'&&showEndFlag" :style="{color:stateColor}">
        数据加载完毕~
    </view>
    <!-- 页面加载遮罩 -->
    <view class="loading_wrapper" v-show="state == 'page_loading_shade'">
        <view class="icon_wrapper">
            <image class="loading_more_icon" :src="'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/loading/'+loadingImg" />
            <text class="tip">页面加载中</text>
        </view>
    </view>
</view>
</template>

<script>
export default {
    name: "loadingState",
    data() {
        return {
        }
    },
    props: {
        state: {
            type: String,
            default: 'allow_loading_more'
        },
        mTop: {
            type: String,
            default: '200rpx'
        },
        showEndFlag: {
            type: Boolean,
            default: true
        },
        stateColor:{
            type: String,
            default: '#999' 
        },
        loadingImg:{
            type: String,
            default: 'icon_common_bprocess.png' 
        }
    },
    methods: {

    }
}
</script>

<style lang='scss'>
    /* template:allow_loading_more start */
    .allow_loading_more {
        height: 80rpx;

        .allow_loading_icon {
            width: 30rpx;
            height: 30rpx;
            margin-right: 12rpx;
            // color: $main-color;
        }

        .tip {
            color: #222;
            font-size: 24rpx;
            margin-left: 8rpx;
        }

        .loading_more_icon {
            width: 30rpx;
            height: 30rpx;
            animation: submitLoading 0.6s linear infinite;
            -webkit-animation:submitLoading 0.6s linear infinite;
        }
    }

    /* template:allow_loading_more end */

    /* template:loading start */
    .common_loading {
        flex: 1;

        .loading_icon {
            width: 40rpx;
            height: 40rpx;
            margin-right: 10rpx;
            animation: submitLoading 0.6s linear infinite;
            -webkit-animation:submitLoading 0.6s linear infinite;
        }
    }

    /* template:loading end */

    /* template:no_more_data start */
    .no_more_data {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 80rpx;
        text-align: center;
        line-height: 80rpx;
        color: #999;
        font-size: 24rpx;
        width: 750rpx;
    }

    .loading_wrapper {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #eff2f5;

        .icon_wrapper {
            width: 200rpx;
            height: 200rpx;
            background: #767676;
            border-radius: 10rpx;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .loading_more_icon {
                width: 70rpx;
                height: 70rpx;
                
                animation: submitLoading 0.6s linear infinite;
                -webkit-animation:submitLoading 0.6s linear infinite;
                margin-bottom: 10rpx;
            }

            .tip {
                color: #fff;
                font-weight: bold;
                font-size: 28rpx;
            }
        }
    }

    /* template:no_more_data end */
    @-webkit-keyframes submitLoading {
            0% {
            -webkit-transform: rotate3d(0, 0, 1, 0deg);
                    transform: rotate3d(0, 0, 1, 0deg);
            }
            100% {
            -webkit-transform: rotate3d(0, 0, 1, 360deg);
                    transform: rotate3d(0, 0, 1, 360deg);
            }
        }
        @keyframes submitLoading {
            0% {
            -webkit-transform: rotate3d(0, 0, 1, 0deg);
                    transform: rotate3d(0, 0, 1, 0deg);
            }
            100% {
            -webkit-transform: rotate3d(0, 0, 1, 360deg);
                    transform: rotate3d(0, 0, 1, 360deg);
            }
        }
</style>
