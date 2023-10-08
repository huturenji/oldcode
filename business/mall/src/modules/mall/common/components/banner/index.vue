<template>
    <div v-if="show" class="banner" ref="bannerWrap" :style="{'height': bannerWrapHeight}">
       <slot name="cutDown"></slot>
       <div class="banner_swiper-container">
            <div class="swiper-wrapper">
                <div @click="gotoHref(item)" v-for="(item, index) in data" :key="index" class="swiper-slide">
                    <img :src="item.imgUrl">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swiper from 'swiper/dist/js/swiper.min.js'; //导入
import 'swiper/dist/css/swiper.css';
export default {
    props:{
        data:{
            type: Array,
            default:()=>[]
        },
        swiperOptions:{
            type: Object,
            default:()=>{
                return {
                    autoplay: 2000,
                    autoplayDisableOnInteraction : false, 
                    observer:true,
                    observeParents:true,
                    slidesPerView : 1, //每页显示的数量
                    spaceBetween : 20,//slide之间的间距
                    updateOnImagesReady: true,
                    watchSlidesProgress : true,
                    resistanceRatio: 0, //控制两侧的不回弹
                    autoHeight: true, //高度随内容变化
                }   
            }
        }
    },
    data(){
        return {
           swiper: null, //swiper实例化的对象
           bannerWrapHeight: '100px',
        }
    },
    watch:{
        data(val){
            if(val && val.length > 0){
                this.initSwiper();
                this.getBannerWrapHeight();
            }      
        },
    },
    mounted(){
        this.initSwiper();
        this.getBannerWrapHeight();
    },

    computed:{
        show(){
            return !!this.data && !!this.data.length
        },

        
    },
    methods:{
        /**
         * 初始化swiper实例
         */
        initSwiper(){
            let that = this;
            setTimeout(() => {
                that.$nextTick(()=>{
                    if(!!that.swiper && !!that.swiper.destroy){ 
                        that.swiper.destroy(); 
                        that.swiper = null;
                    }
                    that.swiper = new Swiper('.banner_swiper-container', that.swiperOptions);
                })
            }, 90); //兼容ios上顶部的banner显示不全banner图片的问题
            
        },

        gotoHref(item){
            if(!!item.href){
                window.open(item.href);
            }
        },

        getStyle (obj, attr) {
            if (obj.currentStyle) { // 兼容IE
                return obj.currentStyle[attr]
            } else {
                return window.getComputedStyle(obj, null)[attr]
            };
        },

        // 根据上传的图片获取banner容器的高度
        getBannerWrapHeight(){
            try {
                this.$nextTick(()=>{
                    let bannerWrapWidth = parseInt(this.getStyle(this.$refs.bannerWrap, "width"));
                    let imgHeight = parseInt(this.data[0].imgHeight || 0); //因为上传的banner图片的宽高必须都是一样的 所以此处直接取0就可以了
                    let imgWidth = parseInt(this.data[0].imgWidth || 0);
                    let height = parseInt((bannerWrapWidth * imgHeight)/imgWidth);
                    this.bannerWrapHeight = `${height}px`;
                })
            } catch (error) {
                console.log(error)
            }
        }
        

    }
}
</script>

<style scoped lang="less">
// 屏幕尺寸
@screen-sm: 550px;
@screen-md: 768px;
@screen-lg: 1080px;
//------------ 移动端通用样式 -------------
@media screen and (max-width: @screen-sm) {
    .banner{
        background: #ecf5ff;
        width: 100%;
        cursor: pointer;
        overflow: hidden;
        position: relative;
        .swiper-container{
            height: 100%;
        }
        .swiper-slide{
            width: 100%;
            height: 100%;
            img{
                width: 100%;
                height: 100%;
                display: block;
            }
        }
        /deep/ .cut_down{
            position: absolute;
            left: 50%;
            transform: translate3d(-50%, 0, 0);
            bottom: .28rem;
            z-index: 100;
        }
    } 
}


//------------ pc端通用样式 包括pc客户端 浏览器端 -------------
@media screen and (min-width: @screen-sm) {
    .banner{
        background: #ecf5ff;
        width: 100%;
        cursor: pointer;
        overflow: hidden;
        position: relative;
        .swiper-container{
            height: 100%;
        }
        .swiper-slide{
            width: 100%;
            height: 100%;
            img{
                width: 100%;
                height: 100%;
                display: block;
            }
        }
        /deep/ .cut_down{
            position: absolute;
            left: 50%;
            transform: translate3d(-50%, 0, 0);
            bottom: 12px;
            z-index: 100;
        }
    } 
}
</style>