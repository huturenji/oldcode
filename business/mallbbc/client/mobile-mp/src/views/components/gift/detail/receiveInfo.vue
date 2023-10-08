<template>
    <!-- 收礼地址信息组件 -->
    <view class="receive-addr-wrapper">
        <view class="user-info">
            <image :src="weizhi" mode="" class="addr_icon"></image>
            <text class="name">{{ receiveInfo.receiverName || receiveInfo.memberName }}</text>
            <text class="phone">{{ receiveMobile || '' }}</text>
        </view>
        <view class="addr-wrapper">
            <text class="addr">{{ receiveInfo.receiverAreaInfo }}{{ receiveInfo.receiverAddress }}</text>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        receiveInfo: {
            type: Object,
            default: () => {
                return {
                    phone: "15623192717",
                    addr: '广东省深圳市福田区沙头街道车公庙泰然大厦C座1605'
                }
            }
        }
    },
    data() {
        return {
            weizhi: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_weizhi.svg',
        }
    },
    computed: {
        receiveMobile() {
            let mobile = this.receiveInfo.receiverMobile
            if (mobile) {
                mobile = mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                return mobile
            }
            return ""
        }
    }
}
</script>

<style lang="scss" scoped>
.receive-addr-wrapper {
    background-color: #fff;
    border-radius: 20rpx;
    padding: 24rpx 24rpx;
    margin-bottom: 20rpx;
    .user-info {
        display: flex;
        align-items: center;

        .addr_icon {
            width: 40rpx;
            height: 40rpx;
            margin-right: 20rpx;
        }

        .name {
            font-size: 34rpx;
            font-weight: 600;
            color: #222;
            margin-right: 16rpx;
        }

        .phone {
            font-size: 28rpx;
            font-weight: 400;
            color: #333333;
        }
    }

    .addr-wrapper {
        font-size: 28rpx;
        font-weight: 400;
        color: #333333;
        margin: 12rpx 12rpx 0 56rpx;

        .addr {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            color: #666666;
            font-size: 28rpx;
            font-weight: 400;
            // line-height: 40rpx;
            // height: 80rpx;
        }
    }
}
</style>