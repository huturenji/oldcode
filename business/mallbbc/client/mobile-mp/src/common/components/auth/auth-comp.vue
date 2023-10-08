<template>
    <view class="auth_comp_wrapper" :style="{ 'padding-bottom': paddingBottom }">

        <!-- 页面显示样式 -->
        <view class="top_wrapper_page" v-if="mode == 'page'">
            <view class="logo"></view>
            <view class="tips">
                <!-- #ifdef JUSHIHUI-->
                <text class="tips-title">手机登录成为巨拾惠会员</text>
                <text class="tips-title">享受更多权益</text>
                <!-- #endif -->

                <!-- #ifdef EMAOQING-->
                <text class="tips-title">手机登录成为鹅毛情会员</text>
                <text class="tips-des">享受更多权益</text>
                <!-- #endif -->
            </view>
        </view>

        <!-- 弹窗显示样式 -->
        <view class="top_wrapper_pop" v-else>
            <view class="logo_wrapper">
                <view class="logo"></view>
                <!-- #ifdef JUSHIHUI-->
                <text>巨拾惠 申请</text>
                <!-- #endif -->

                <!-- #ifdef EMAOQING-->
                <text>鹅毛情</text>
                <!-- #endif -->
            </view>
            <view class="tips">
                <!-- #ifdef JUSHIHUI-->
                <text class="tips-title">欢迎使用巨拾惠</text>
                <text class="tips-des">手机登录成为巨拾惠会员 享受更多权益</text>
                <!-- #endif -->

                <!-- #ifdef EMAOQING-->
                <text class="tips-title">手机登录成为鹅毛情会员</text>
                <text class="tips-des">享受更多权益</text>
                <!-- #endif -->
            </view>
        </view>

        <!-- 权益icon展示 -->
        <view class="icon-wrapper">
            <view class="icon-box shihui-icon">
                <img src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/login/icon_denglu_shihuishangping.svg" class="icon-img" />
                <img src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/shihui/icon_sousuo_shihuia.svg" class="icon-tag" />
                <text>实惠商品</text>
            </view>
            <view class="icon-box">
                <img src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/login/icon_denglu_zhuanshuquanyi.svg" class="icon-img" />
                <text>专属权益</text>
            </view>
            <view class="icon-box">
                <img src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/login/icon_denglu_jifenxiangdui.svg" class="icon-img" />
                <text>积分享兑</text>
            </view>
            <view class="icon-box">
                <img src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/login/icon_denglu_zhuanshukefu.svg" class="icon-img" />
                <text>专属客服</text>
            </view>
        </view>

        <view class="auth_btn_wrapper" :class="{auth_btn_wrapper_page: mode == 'page'}">
            <button class="auth_btn" type="default" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
                微信手机号一键登录
            </button>
            <view class="no_auth_btn" @click="$emit('cancel')">放弃权益 暂不注册会员</view>
        </view>
    </view>
</template>

<script>
import wxAuth from '@/utils/auth/weixin.js';
import { updateUserInfo, login } from '@/utils/auth/auth.js';
import { isIos } from '@/utils/common';

export default {
    props: ['mode'],
    computed: {
        // ios和android不一样
        paddingBottom() {
            if (isIos) {
                return '104rpx'
            } else {
                return '122rpx'
            }
        },
    },
    methods: {
        async getPhoneNumber({ detail: { errMsg, code } }) {
            // 用户点击允许
            if (errMsg === "getPhoneNumber:ok") {
                let phoneNumber = await wxAuth.getPhoneByCode(code);

                // 走认证流程授权
                if (phoneNumber) {
                    // 这里目前等效于 注册
                    await updateUserInfo(phoneNumber);
                    // 登录
                    let authenticated = await login();

                    // 执行回调函数
                    this.$emit('confirm', authenticated);

                } else { //接口获取手机号失败
                    this.$emit('confirm', false);
                }
            }

            // 用户点击取消或者其他异常
            else {
                this.$emit('confirm', false);
            }
        }
    }
}
</script>


<style scoped lang="scss">
.auth_comp_wrapper {
    background-color: #fff;
    border-radius: 20rpx 20rpx 0rpx 0rpx;
    padding: 40rpx 40rpx 122rpx;
}

.top_wrapper_page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 38rpx;
    padding-bottom: 24rpx;
    .logo {
        width: 160rpx;
        height: 160rpx;
        border-radius: 50%;
        margin-top: 100rpx;
        // #ifdef JUSHIHUI
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/logo/jushihui_logo.png') no-repeat;
        // #endif

        // #ifdef EMAOQING
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/logo/emaoqing_logo.png') no-repeat;
        // #endif
        background-size: contain;
        background-position: center;
    }

    .tips {
        font-size: 40rpx;
        color: #323232;
        font-weight: 400;
        line-height: 60rpx;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin-top: 16rpx;
        .tips-title {
            font-size: 36rpx;
            color: #000;
        }
        .tips-des {
            font-size: 32rpx;
            font-weight: 400;
            color: #999999;
            margin-top: 20rpx;
        }
    }


}

.top_wrapper_pop {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .logo_wrapper {
        display: flex;
        align-items: center;


        .logo {
            width: 56rpx;
            height: 56rpx;
            border-radius: 50%;
            // #ifdef JUSHIHUI
            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/logo/jushihui_logo.png') no-repeat;
            // #endif        
            // #ifdef EMAOQING
            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/logo/emaoqing_logo.png') no-repeat;
            // #endif
            background-size: contain;
            background-position: center;
        }

        text {
            font-size: 30rpx;
            margin-left: 16rpx;
            font-weight: 600;
            color: #222222;
        }

    }


    .tips {
        margin-top: 40rpx;
        font-size: 36rpx;
        color: #323232;
        font-weight: bold;
        line-height: 60rpx;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        .tips-title {
            font-size: 40rpx;
        }
        .tips-des {
            font-size: 30rpx;
            color: #999;
            font-weight: 400;
            margin-top: 10rpx;
        }
    }
}

.icon-wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 44rpx;
    .icon-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &.shihui-icon {
            position: relative;
            .icon-tag {
                position: absolute;
                width: 102rpx;
                height: 30rpx;
                top: -12rpx;
                right: -58rpx;
            }
        }
        .icon-img {
            width: 90rpx;
            height: 90rpx;
            margin-bottom: 18rpx;
        }
        text {
            font-size: 28rpx;
            color: #222222;
        }
    }
}

.auth_btn_wrapper {
    margin-top: 86rpx;
    padding: 0 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    &.auth_btn_wrapper_page {
        margin-top: 120rpx;
    }
    .auth_btn {
        width: 100%;
        line-height: 80rpx;
        height: 80rpx;
        padding: 0 40rpx;
        border-radius: 44rpx;
        background-color: #07C160;
        color: #fff;
        font-size: 30rpx;
        font-weight: 600;
    }

    .no_auth_btn {
        width: 100%;
        text-align: center;
        // line-height: 80rpx;
        // height: 80rpx;
        margin: 20rpx 0;
        font-size: 30rpx;
        color: #666666;
    }

    button::after {
        display: none !important;
    }
}
</style>