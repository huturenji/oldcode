<template>
    <view class="empty_container">
        <view class="empty_box">
            <image class="empty_img" :src="'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/' + emptyImg + '.png'" mode="widthFix">
            </image>
            <view class="empty_text">{{ tips }}</view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'ActivityNotOpen',
    components: {},
    props: {
        emptyImg: {
            type: String,
            default: 'icon_defpage_zwnr'
        },
        tips: {
            type: String,
            default: '模块暂未开启'
        }
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
        }
    },
    mounted() {}
}
</script>

<style lang='scss'>
    .empty_container {
        .empty_box {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            .empty_img {
                width: 256rpx;
                height: 256rpx;
            }
            .empty_text {
                font-size: 28rpx;
                color: #999;
            }
        }
    }
</style>
