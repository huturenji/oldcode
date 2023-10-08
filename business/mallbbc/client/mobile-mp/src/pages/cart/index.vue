<!-- 购物车页面 -->
<template>
    <CartComp ref="cart-comp" :custom="true" />
</template>
<script>
import CartComp from '@/common/components/cart/cart-comp.vue';
export default {
    components: { CartComp },
    onShow() {
        this.setTabBarIndex(2);
        this.$refs[`cart-comp`]?.reloadData();
        this.$statEvent({
            behaviorType: 'pv',
            pageUrl: this.$Route.path,
            referrerPageUrl: '',
        })
    },
    watch: {
        '$store.state.cartNum'(val) {
            this.setCartNum(val || 0)
        }
    }
}
</script>
<style scoped lang="scss">
$action-section-min-padding-bottom: 14rpx;
$vertical-offset-height: 20rpx; // 相对于tabbar定位的 垂直偏移量 相对于tabbar定位的
$tabbar-height-common: calc(12rpx + 90rpx + env(safe-area-inset-bottom));
::v-deep .uni-navbar .uni-navbar__header .uni-navbar__header-btns-left {
    width: auto !important;
    padding: 0rpx !important;
}
::v-deep .freight_uniPop {
    .uni-popup__wrapper-box {
        padding-bottom: 0 !important;
        bottom: 0 !important;
    }
}
::v-deep .uni-popup__wrapper-box{
    bottom: calc(#{$tabbar-height-common} - #{$vertical-offset-height}) !important;
    padding-bottom: $vertical-offset-height !important;
}

::v-deep .cart-list{
    height: calc(100vh - 360rpx) !important;
    // padding-bottom: calc(96rpx + #{$tabbar-height-common} + 30rpx) !important;
    .bottom-placeholder {
        width: 100%;
        height: calc(96rpx + #{$tabbar-height-common} + 30rpx);
        background: transparent;
    }
}
::v-deep .action-section{
    height: calc(96rpx + #{$tabbar-height-common} + #{$action-section-min-padding-bottom}) !important;
    padding-bottom: calc(#{$tabbar-height-common} + #{$action-section-min-padding-bottom}) !important;
}
::v-deep .fast_del_bottom{
    padding-bottom: calc(#{$tabbar-height-common} + #{$action-section-min-padding-bottom}) !important;
}

/* 购物车列表项 */
::v-deep .swiper-cell-content {
    display: flex;
}
::v-deep .right_bottom .uni-numbox {
    width: 148rpx!important;
    height: 40rpx!important;

    &__minus,
    &__plus {
        width: 44rpx!important;
    }
    &__value {
        width: 60rpx!important;
        min-height: unset;
    }
    &__minus,
    &__value,
    &__plus {
        border-color: #999;
        height: 40rpx!important;
        line-height: 40rpx !important;
    }
}
uni-page-body {
    overflow: auto;
}
</style>