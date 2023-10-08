<template>
    <div class="swiper-comp"> 
        <div class="swiper-container" :class="swiperContainer">
            <div class="swiper-wrapper">
                <div v-for='(item, index) in list' :key='index' class="swiper-slide">
                    <img class="photo" :src='item.imgUrl'>
                </div>
            </div>
            <!-- 分页器 -->
            <div class="swiper-pagination-content"><div class="swiper-pagination"></div></div>
        </div>
    </div>
</template>

<script>
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';
export default {
    name:'swiper-comp',
    components:{},
    computed:{
        /**
         * 哪里使用的swiper初始化不同的swiper实例
         */
        swiperContainer(){
            let key = this.swiperOptipns.from;
            switch (key) {
                case 'index':
                    return 'swiper-container-index'
                    break;

                case 'detail':
                    return 'swiper-container-detail'
                    break;

                default:
                    return 'swiper-container-default'
                    break;
            }
        }
    },
    props:{
        list:{
            type:Array,
            default:()=>[]
        },

        //swiper控制的一些参数
        swiperOptipns:{ 
            type:Object,
            default(){
                return {
                    autoplay:true, 
                    loop: false, // 循环模式选项
                    // 如果需要分页器
                    pagination: {
                        el: '.swiper-pagination',
                    },
                }
            }
        }
    },
    data(){
        return {
            swiper: null,
        }
    },

    watch:{
        /**
         * 监听传递的图片list变化
         */
        list:{
            handler(val){
                this.initSwiper();
            },
            deep:true,
            immediate:true
        },
    },
    mounted(){
        this.initSwiper();
    },
    methods:{
        /**
         * 初始化swiper实例
         */
        initSwiper(){
            this.swiper = new Swiper('.' + this.swiperContainer, this.swiperOptipns);
        },
    }

}
</script>

<style scoped lang="less">
@import '~businesscloudStyles/themes/default.less';
@import '~businesscloudStyles/mixins/mixinsStyle.less';
.swiper-container{
    width: 100%;
    .swiper-slide{
        text-align: center;
        img{
            width: 100%;
            height: auto;
            max-height: 100%;
        }
    }
}
</style>
