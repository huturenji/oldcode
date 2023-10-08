<template>
    <view class="btn-box">
        <button class="btn" :session-from="sessionFrom" :show-message-card="showCard" :send-message-title="titleStr"
            hover-class="none" :send-message-path="path" :send-message-img="image" open-type="contact">
            <slot>
                <view class="btn-content">
                    <image class="icon" :src="kefuImage"></image>
                    <view class="btn-txt">在线客服</view>
                </view>
            </slot>
        </button>
    </view>
</template>

<script>
import { getMemberInfo } from '@/utils/auth/auth.js';
export default {
    data() {
        return {
            kefuImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_wode_kefu.svg',
            userInfo: {}, // 用户信息
        }
    },
    props: {
        showCard: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        path: {
            type: String,
            default: ''
        },
        image: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: '订单号'
        }
    },
    created(){
        this.getUserInfo()
    },
    computed: {
        titleStr() {
            return `${this.name} ${this.title}`
        },
        sessionFrom(){
            let params = {"绑定手机号":this.userInfo.memberMobile,"会员名":this.userInfo.memberName,"昵称":this.userInfo.memberNickName,"真实姓名":this.userInfo.memberTrueName?this.userInfo.memberTrueName:''};
            return `sobot|${!!this.userInfo.memberNickName?this.userInfo.memberNickName:''}|${!!this.userInfo.memberAvatar?this.userInfo.memberAvatar:''}|${JSON.stringify(params)}|`
        }
    },
    methods: {
        async getUserInfo() {
            this.userInfo = await getMemberInfo();
        }
    }
}
</script>

<style scoped lang="scss">
.btn-box {
    button {
        margin: 0;
        padding: 0;
        line-height: none;
        border: none;
        background: none;
        outline: none;
    }

    button::after {
        display: none;
    }

    .btn-content {
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
            width: 36rpx;
            height: 36rpx;
            margin-right: 10rpx;
        }

        .btn-txt{
            font-size: 28rpx;
            font-family: PingFang SC, PingFang SC-Regular;
            font-weight: 400;
            color: #222222;
        }
    }

}
</style>