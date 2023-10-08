<template name="activity_not_open">
    <view class="activity_not_open">
        <view class="empty_sort_page">
            <image :src="`${imgUrl}${emptyFileObj[theme]}/${emptyImg}.png`" mode="aspectFit" class="empty_img">
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
            imgUrl: getApp().globalData.imgUrl,
            // 用于设置主体对应图片文件夹
            theme: 'bnj',
            emptyFileObj: {
                bnj: 'empty',
                jushihui: 'empty_jushihui'
            }
        }
    },
    async mounted() {
        let channelOptions = await window.getChannelOptions;
        if (channelOptions && channelOptions.theme){
            this.theme = channelOptions.theme;
        }
    }
}
</script>

<style lang='scss'>
    .activity_not_open {
        .empty_sort_page {
            width: 100%;
            // height: 100vh;
            background: $bg-color-split;
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
