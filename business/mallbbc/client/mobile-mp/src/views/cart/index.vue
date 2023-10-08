<!--
 * @Descripttion: your project
 * @Author: mawenshu
 * @Date: 2023-04-06 16:52:51
-->
<!-- 购物车页面 -->
<template>
    <CartComp ref="cart-comp" />
</template>
<script>

import CartComp from '@/common/components/cart/cart-comp.vue';
export default {
    components: { CartComp },
    onShow(){
        this.$refs[`cart-comp`]?.reloadData();
    },
}
</script>
<style scoped lang="scss">
$action-section-min-padding-bottom: 14rpx;
::v-deep .address_manage{
    top: 0 !important;
}
::v-deep .filter_wrapper{
    top: 0 !important;
}

::v-deep .cart-list{
    height: calc(100vh - 190rpx);
    // padding-bottom: calc(96rpx + 40rpx - 18rpx) !important;
    .bottom-placeholder {
        width: 100%;
        height: calc(96rpx + 40rpx - 18rpx);
        background: transparent;
    }
}
::v-deep .action-section{
    height: calc(96rpx + $action-section-min-padding-bottom) !important;
    padding-bottom: $action-section-min-padding-bottom !important;
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
::v-deep .content .promotion_box .promotion_goods_box {
    &.ios {
        height: calc(100% - 140rpx);
    }
}
::v-deep .spec_model .spec_model_con .spec_model_content {
    height: calc(60vh - 120rpx);
    &.ios {
        height: calc(60vh - 140rpx);
    }
}
</style>