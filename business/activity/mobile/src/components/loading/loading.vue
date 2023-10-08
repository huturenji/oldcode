<!-- 空页面
    空图标可以自定义
    内容提示可以自定义
    空页面所占的高度也可以自自定义
-->
<template name="loadingState">
<view>
    <!-- 这个状态已经删除了 -->
    <view  v-show="state == 'allow_loading_more'">
        <!-- <text class="allow_loading_icon iconfont icon_scroll_top"></text>
        <text class="tip">向上滑动浏览更多数据</text> -->
    </view>
    <view class="common_loading flex_row_center_center" v-show="state == 'first_loading'" :style="{marginTop:mTop}">
        <image class="loading_icon" :src="imgUrl+'loading/'+loadingImg" />
        <text class="tip" :style="{color:stateColor}">加载中...</text>
    </view>
    <view class="allow_loading_more flex_row_center_center" v-show="state == 'loading'">
        <image class="loading_more_icon" :src="imgUrl+'loading/'+loadingImg" />
        <text class="tip" :style="{color:stateColor}">数据加载中...</text>
    </view>
    <!-- showEndFlag 默认为true，展示，设置为false，则不展示 -->
    <view style="width:100%" class="no_more_data" v-show="state == 'no_more_data'&&showEndFlag" :style="{color:stateColor}">
        数据加载完毕~
    </view>
</view>
</template>

<script>
export default {
    name: "loadingState",
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
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
            default: '#222' 
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
            color: #FC1C1C;
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
        color: #222;
        font-size: 24rpx;
        width: 750rpx;
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
