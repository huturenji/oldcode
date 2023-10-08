<template>
    <!-- 收礼地址信息组件 -->
    <view class="receive-addr-wrapper">
        <view class="left">
            <view class="img-wrapper">
                <image class="img" :src="imgUrl + 'gift/btn_common_weizhi.svg'" mode=""></image>
            </view>
        </view>
        <view class="right">
            <view>
                <text class="name">{{ receiveInfo.receiverName }}</text>
                <text class="phone">{{ receiveMobile }}</text>
            </view>
            <view class="addr-wrapper">
                <text class="addr">{{ receiveInfo.receiverAreaInfo }} {{ receiveInfo.receiverAddress }}</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        receiveInfo: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
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
    margin: 0 20rpx;
    display: flex;
    padding: 28rpx 24rpx 28rpx 0;

    .left {
        .img-wrapper {
            width: 80rpx;
            text-align: center;
            padding-top: 4rpx;
        }

        .img {
            width: 40rpx;
            height: 40rpx;
        }
    }

    .right {
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

        .addr-wrapper {
            font-size: 28rpx;
            font-weight: 400;
            color: #333333;
            margin-top: 20rpx;

            .addr {
                // width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                color: #666666;
                font-size: 28rpx;
                font-weight: 400;
            }
        }
    }
}
</style>