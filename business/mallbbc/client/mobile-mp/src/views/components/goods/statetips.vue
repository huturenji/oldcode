<template>
    <view class="tips_info">
        <view class="tipsInfo">
            <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_common_warning.svg" class="warning" ></image>
            <text v-if="!stopSales">该商品已下架，非常抱歉！</text>
            <text v-else-if="stopSales && !areaLimit">该商品在该地区暂不支持销售，非常抱歉！</text>
            <text v-else-if="stopSales && areaLimit && !hasStock">抱歉，所选商品无货</text>
            
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
             
        }
    },
    props: {
        //是否有库存 true=有 false=无
        hasStock: {
            type: Boolean,
            default: true,
        },

        //是否上下架 true=下架 false=上架
        stopSales: {
            type: Boolean,
            default: true,
        },

        //是否区域可售 true=区域可售 false=区域不可售
        areaLimit: {
            type: Boolean,
            default: true,
        },
    },
};
</script>
<style scoped lang='scss'>
.tipsInfo {
    width: 750rpx;
    height: 68rpx;
    // position: absolute;
    z-index: 11;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.8);
    // bottom: 92rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 26rpx;
    .warning {
        width: 32rpx;
        height: 32rpx;
        margin: 2rpx 8rpx 0 0;
    }
}
</style>