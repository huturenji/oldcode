<template>
    <view class="guest" @click="login">
        <view class="blank_top"></view>
        <view class="guest-info">
            <view class="avatar_wrapper">
                <image :src="defaultMemberAvatar" />
            </view>
            <view class="name_wrapper">
                <text class="name">未登录</text>

                <view class="member_name" v-if="false">
                    <text>会员名</text>
                    <text> - </text>
                </view>
            </view>
            <view class="operate_wrapper">
                <text class="iconfont icon_arrow_right"></text>
            </view>
        </view>
        <view class="guest-tips" v-if="false">
            <view class="image_wrapper">
                <image :src="imgTips" />
            </view>
            <text class="txt">{{ txtTips }}</text>
        </view>
        <view class="blank_bottom"></view>
    </view>
</template>
<script>

export default {
    components: {},
    props: {
        memberInfo: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            imgTips: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwnr.png',
            txtTips: '尊敬的游客，欢迎您~~',
        }
    },
    computed: {
    },
    methods: {
        login() {
            this.$Router.push({
                path: '/views/mine/login-page'
            })
        },
    }
}
</script>

<style scoped lang="scss">
.guest {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 9;
    display: flex;
    flex-direction: column;

    .blank_top {
        height: 200rpx;
        background-color: rgba($color: #fff, $alpha: 1);
    }

    .blank_bottom {
        flex: 1;
        background-color: rgba($color: #fff, $alpha: 0);
    }

    .guest-info {
        padding: 20rpx;
        background-color: rgba($color: #D7D7D7, $alpha: 1);
        display: flex;
        justify-content: space-between;
        align-items: center;



        .avatar_wrapper {
            width: 112rpx;
            height: 112rpx;
            border-radius: 50%;
            border: 8rpx solid #fff;
            overflow: hidden;
            margin-right: 20rpx;
        }

        .name_wrapper {
            flex-grow: 1;

            display: flex;
            flex-direction: column;
            justify-content: flex-start;

            .name {
                font-size: 38rpx;
                font-weight: bold;
                color: #333;
            }

            .member_name {
                margin-top: 6rpx;

                text {
                    color: #666;
                    font-size: 26rpx;
                }
            }
        }
    }

    .guest-tips {
        padding: 0 20rpx;
        background-color: rgba($color: #fff, $alpha: 0);
        height: 500rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .image_wrapper {
            width: 250rpx;
            height: 250rpx;
        }

        .txt {
            color: #999;
            font-size: 28rpx;
        }

    }

}
</style>