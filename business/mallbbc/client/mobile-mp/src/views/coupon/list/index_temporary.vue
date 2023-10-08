<template>
    <view class="coupon-center-container">
        <view class="coupon-list">
            <view class="coupon" v-for="(coupon, couponIndex) in couponList" :key="couponIndex"
                @click="receiveCoupon(coupon.couponId)">
                <view>
                    {{ coupon.couponName }}
                </view>
                <view>
                    {{ coupon.couponContent }}
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import cartHandler from "@/views/components/cart/handler";

export default {
    data() {
        return {
            couponList: []
        }
    },
    onLoad() {
        this.getCouponList()
    },
    methods: {
        getCouponList() {
            cartHandler.couponCenter().then(res => {
                if (res.state == 200) {
                    this.couponList = res.data.couponList;
                }
            })
        },
        receiveCoupon(couponId) {
            cartHandler.receiveCoupon({
                couponId
            }).then(res => {
                if (res.state == 200) {
                    uni.showToast({
                        icon: 'success',
                        title: `领取成功`
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.coupon-center-container{
    padding: 0 10px;
}
.coupon-list {
    overflow: hidden;
}

.coupon {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    margin-top: 10px;
}
</style>