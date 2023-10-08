<template name="imgThumb">
    <view class="imgThumb_container">
        <view class="watermark" v-if="showWatermark"></view>
        <lazyload 
            :imageSrc="imgSrc" 
            threshold="200" 
            :duration="200"
            :is-effect="true"
            :borderRadius="borderRadius"
        ></lazyload>

        <view class="mask" v-if="noSale && showThumbTips">
            <view class="text">暂不可售</view>
        </view>
    </view>
</template>

<script>
import lazyload from '@/common/components/thumb/lazyload/index';

export default {
    name: "imgThumb",
    components:{
        lazyload
    },
    data() {
        return {
           
        }
    },

    props: {
        //显示水印图
        showWatermark: {
            type: Boolean,
            default: true
        },
        // 是否显示加入购物车的按钮
        imgSrc:{
            type: String,
            default: ''
        },

        // 是否暂不可售
        noSale: {
            type: [Boolean],
            default: false
        },
        // 是否显示tips遮罩
        showThumbTips: {
            type: [Boolean],
            default: false
        },
        borderRadius: {
            type: [Number, String],
            default: 0
        }
    },
    mounted(){},
    methods: {}
}
</script>

<style scoped lang='scss'>
.imgThumb_container{
    width: 100%;
    height: 100%;
    position: relative;

    .watermark{
        position: absolute;
        width: 100%;
        height: 100%;
        background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/goods-watermark.png") left top no-repeat;
        background-size: 100% 100%;;
        z-index: 1;
    }
}
.mask{
    padding: 6rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120rpx;
    height: 120rpx;
    opacity: 0.7;
    background: #000000;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -60rpx;
    margin-top: -60rpx;

    .text {
        width: 108rpx;
        height: 108rpx;
        border: 1px dashed #fff;
        border-radius: 50%;
        text-align: center;
        line-height: 108rpx;
        color: #fff;
        font-size: 22rpx;
    }
}
</style>
