<template name="imgThumb">
    <view class="imgThumb_container">
        <view class="watermark" v-if="showWatermark"></view>
        <lazyload 
            :imageSrc="imgSrc" 
            threshold="200" 
            :duration="10"
            :loadingImgMode="loadingImgMode"
            :is-effect="true"
        ></lazyload>

        <view class="mask" v-if="noSale && showThumbTips">
            <view class="text">暂不可售</view>
        </view>
    </view>
</template>

<script>
import lazyload from "@/components/lazyload/index";
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
            type: String
        },

        // loading图片样式 1 = 灰底； 2 = 白底 默认1
        loadingImgMode: {
            type:  [Number, String],
            default: 1
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
        }
    },
    mounted(){},
    methods: {
       
    }
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
        background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/goods-watermark-g2.png") left top no-repeat;
        background-size: 100% 100%;;
        z-index: 1;
    }
}
.mask{
    padding: 6rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .text{
        width: 108rpx;
        height: 108rpx;
        border: 1px dashed #fff;
        border-radius: 50%;
        text-align: center;
        line-height: 108rpx;
        color: #fff;
        font-size: 22rpx;
    }
   
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
}
</style>
