<template name="empty_container">
    <view class="empty_container">
        <view class="empty_sort_page">
            <image :src="'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/' + emptyImg + '.png'" mode="aspectFit" class="empty_img">
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
        }
    },
    mounted() {}
}
</script>

<style lang='scss'>
    .empty_container {
        .empty_sort_page {
            width: 100%;
            // height: 100vh;
            background: #EFF2F5;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 180rpx;

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
