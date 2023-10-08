<template>
    <div class="swiper-comp"> 
        <div class="swiper-container" :class="swiperContainer">
            <div class="swiper-wrapper">
                <div v-for='(item, index) in list' :key='index' class="swiper-slide">
                    <img v-if="swiperContainer == 'swiper-container-detail'" class="photo thumbnail" :src="BMallConfig.GOODS.DEFAULT_THUMBNAIL" v-real-img='item.imgUrl'>
                    <img v-else class="photo" :data-item="stringify(item)" :src='item.imgUrl'>
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
            default(){
                return []
            },
        },

        //swiper控制的一些参数
        swiperOptipns:{ 
            type:Object,
            default(){
                return {
                    autoplay:true, 
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
            swiper: null, //swiper实例
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
            let that = this;
            that.$nextTick(()=>{
                 if(!that.swiper){
                     that.swiper = new Swiper('.' + that.swiperContainer, that.swiperOptipns);
                 }else{
                     that.updateSwiper();
                 }
             })
            
        },

        resetSwiper(){
            let that = this;
            that.swiper.destroy(); //销毁Swiper。销毁所有绑定的监听事件，移除鼠标键盘事件，释放浏览器内存。
            that.$nextTick(()=>{
                that.swiper = new Swiper('.' + that.swiperContainer, that.swiperOptipns);
            })
        },

        /**
         * 更新swiper
         */
        updateSwiper(){
            let that = this;
          
            //更新Swiper的时候需要先把自动轮播stop掉，然后再重新轮播，否责会造成swiper不会重新autoplay
            that.swiper.update && that.swiper.update();
            that.swiper.stopAutoplay();
            that.swiper.startAutoplay();
        },

        
        
        /** 
         * 将对象字符串话
         */
        stringify(item){
            return window.JSON.stringify(item);
        }
    }

}
</script>

<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.swiper-container{
    width: 100%;
    .swiper-slide{
        text-align: center;
        cursor: pointer;
        // background-color: @thumbnail-bg-color;
        img{
            width: 100%;
            height: auto;
            max-height: 100%;
            display: block;
            &.thumbnail{
                transform: scale(.5, .5);
            }
            &.full{
                transform: scale(1, 1);
            }
        }
    }
}
</style>
