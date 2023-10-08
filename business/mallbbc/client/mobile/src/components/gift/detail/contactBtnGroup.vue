<template>
    <!-- 客服组件 -->
    <view class="customer_service">
        <view class="service_title" v-if="showTitle">客户服务</view>
        <view class="service_btnlist">
            <view @click="contactCustomerRefund">
                <image :src="imgUrl+'common/icon/kefu.svg'" mode=""></image>
                <text>在线客服</text>
            </view>
            <view @click="goCall">
                <image :src="imgUrl+'common/icon/btn_common_phone1.svg'" mode=""></image>
                <text>客服电话</text>
            </view>
        </view>
    </view>
</template>

<script>
import mixin from '@/common/mixin/orderMixin' //订单混入
export default {
    mixins: [mixin],
    props: {
        showTitle: {
            type: Boolean,
            default: false
        },
        orderDetailVO: {
            type: Object,
            default: () => {
            }
        },
        childOrderVO: {
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
    methods: {
        // 客服
        contactCustomerRefund() {
            this.gotoCustomerService(this.orderDetailVO, 'detail');
        },
        //拨打电话
        goCall() {
            const store = this.childOrderVO;
            if (!store.servicePhone) {
                uni.showToast({
                    title: '该商家暂未设置电话',
                    icon: 'none'
                })
                return
            }
            if (SnUtils.isPC()) {
                uni.showModal({
                    content: store.servicePhone,
                    showCancel: false
                });
                return;
            }
            uni.makePhoneCall({
                phoneNumber: store.servicePhone
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.customer_service {
    background-color: #fff;
    border-radius: 20rpx;
    padding: 12rpx 32rpx 24rpx;

    .service_title {
        font-size: 32rpx;
        height: 44rpx;
        line-height: 44rpx;
        font-weight: 600;
        color: #222;
        margin: 10rpx 0 20rpx 0;
    }

    .service_btnlist {
        display: flex;
        flex-wrap: wrap;

        > view {
            width: 318rpx;
            text-align: center;
            height: 72rpx;
            line-height: 72rpx;
            background-color: #f6f8f9;
            cursor: pointer;

            &:nth-child(odd) {
                margin-right: 10rpx;
                border-radius: 16rpx 0 0 16rpx;
            }

            &:nth-child(even) {
                border-radius: 0 16rpx 16rpx 0;
            }

            image {
                width: 36rpx;
                height: 36rpx;
                margin-right: 8rpx;
                vertical-align: middle;
            }
        }
    }
}
</style>