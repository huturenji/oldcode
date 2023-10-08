<template>
    <!-- 顶部的商品轮播组件组件 -->
    <view v-if="show" class="swiper-container">
       <!-- 顶部商品图 swiper 图片点击的时候，图片方法手势缩放的功能 -->
       <photoswipe ref="prImgs" :imgs.sync="images"></photoswipe>
            
        <!-- 图片轮播图dom start -->
        <view class="carousel">
            <swiper class="swiper-box" @change="(e)=>{change(e)}" :current="hasVideo?(current-1):current" :style="{transform:carouselImgTransform}" :duration="duration">
                <!-- #ifdef H5 -->
                <swiper-item v-if="hasVideo">
                    <image :src="images[0]"
                        class="slide-image"></image>
                    <image :src="imgUrl+'svideo/play.png'" class="play_btn" ></image>
                </swiper-item>
                <!-- #endif -->
            
                <!-- 默认规格 图  start-->
                <swiper-item class="swiper-item" v-for="(item, index) in images" :key="index" @click="prviewImage(index)">
                    <view class="image-wrapper" :class='{"mask": showMask}'>
                        <image :src="item" mode="aspectFit"></image>
                    </view>
                </swiper-item>
                <!-- 默认规格 图  end-->
            </swiper>
            <!-- 这里轮播点用组件，不用自带的 -->
            <customSwiperDot mode="nav" :dotNum="images.length" :currentIndex="hasVideo?(current-1):current" background="rgba(14,14,14,.2)" :swiperDotStyle="{position:'absolute',bottom:'40rpx',right:'30rpx'}"></customSwiperDot>
        </view>
        <!-- 图片轮播图dom end -->
    </view>
</template>
<script>
import photoswipe from '@/components/photoswipe/photoswipe.vue';
import customSwiperDot from '@/components/swiper-dot/index.vue';

export default {
    components:{ photoswipe, customSwiperDot },
    props:{  
        //水印
        showMask: {
            type: Boolean,
            default: false
        },
        // 图片列表
        images: {
            type: Array,
            default: ()=>[]
        },
        // 视频介绍地址
        video: {
            type: String,
            default: ''
        },
        // 当前选择的图片
        current: {
            type: Number,
            default: 0
        },
        carouselImgTransform: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            imgUrl: getApp().globalData.imgUrl
        }
    },
    computed: {
        hasVideo(){
            return !!this.video;
        },
        show(){
            return this.images && this.images.length > 0
        }
    },
    methods: {
        prviewImage(k){
            this.$nextTick(()=>{
                this.$refs.prImgs.initImage(k)
            })
        },
        

        // swiper切换
        change(e){
            this.$emit('change', e)
        }
    }
}
</script>
<style scoped lang='scss'>
.carousel {
    height: 750rpx;
    position: fixed;
    z-index: 0;
    
    .swiper-box {
        width: 750rpx;
        height: 750rpx;
    }

    swiper {
        height: 100%;
    }

    .image-wrapper {
        width: 100%;
        height: 100%;
        
        &.mask:before{
            position: absolute;
            content: '';
            width: 100%;
            height: 100%;
            background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/goods-watermark-g2.png") left bottom no-repeat;
            background-size: 100% 100%;
            z-index: 1;
        }
    }

    .swiper-item {
        display: flex;
        justify-content: center;
        align-content: center;
        height: 750rpx;
        overflow: hidden;

        image {
            max-width: 100%;
            max-height: 100%;
        }
    }

}

</style>