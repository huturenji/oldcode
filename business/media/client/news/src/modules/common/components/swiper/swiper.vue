<template>
  <div class="swiper-container" :id="swiperId">
    <div class="swiper-wrapper">
        <slot></slot>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
import Swiper from 'swiper/dist/js/swiper.min.js'; //导入
import 'swiper/dist/css/swiper.css';
export default {
    name: 'swiper',
    props: {
    //渲染swiperId
        swiperId: {
            type: String,
            default: 'swiper-container'
        },
        value:{
            type: Number,
            default: 0
        },
        //渲染的每一项
        list: {
            type: Array,
            default () {
                return []
            }
        },
        //swiper的相关配置
        options:{
            type:Object,
            default(){
                return{}
            }
        }
    },
    data () {
        return {
            swiper: null
        }
    },
    watch: {
        value:{
            handler(val){
                if(!this.swiper){return}
                this.swiper.slideTo(val);
            }
        }
    },
    created () {
    
    },
    mounted () {
 
        this.$nextTick(() => {
            this.render(); 
        })
    
    },
    methods: {
        render(){
            if(!this.swiper){
                this.newSwiper();
            }
        },
        rerender(){
            // eslint-disable-next-line no-unused-expressions
            this.swiper && this.swiper.destroy();
            this.newSwiper();
        },
        newSwiper(){
            let id = '#' + this.swiperId
            this.swiper = new Swiper(id, this.options);
        }
    }
 
  
}

</script>
