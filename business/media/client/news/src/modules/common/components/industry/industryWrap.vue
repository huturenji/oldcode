<template>
  <div>
    <transition name="slide-fade">
      <div v-if="show" class="industryWrap">
        <div id="list" ref="scrollWrap" class="content">
            <swiper :swiperId="'industryId' + id" :options="swiperOptions">
                <swiper-item v-if="firstList.length > 0">
                    <industryItem v-for="(item, index) in firstList" :key="index" :item="item"></industryItem>
                </swiper-item>
                <swiper-item v-if="secondList.length > 0">
                    <industryItem v-for="(item, index) in secondList" :key="index" :item="item"></industryItem>
                </swiper-item>
            </swiper>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import extendUtils from 'common/lib/utils';
import {Swiper, SwiperItem} from 'commonComp/swiper';
import industryItem from './industryItem';
export default {
    name: 'industryWrap',
    components:{
        Swiper,
        SwiperItem,
        industryItem
    },
    props:{
        list:{
            type: Array,
            default(){
                return []
            }
        },
        id:{
            type: Number,
            default:0
        },
        show:{
            type:Boolean,
            default: false
        }
    },
    computed:{
        firstList(){
            return this.list.slice(0,4);
        },
        secondList(){
            return this.list.slice(4);
        },
        swiperOptions(){
            let options = {
                paginationType : 'bullets',
                // nested:true,
                // resistanceRatio: 0,
                paginationClickable: true,
                observer:true,//修改swiper自己或子元素时，自动初始化swiper
                observeSlideChildren:true,
                observeParents:true//修改swiper的父元素时，自动初始化swiper
            }
            if(this.secondList.length>0){
                options = {
                    ...options,
                    pagination : '.swiper-pagination'
                }
            }
            return options
        }
    },
    data(){
        return {
      
        }
    },
    mounted(){
   
    },
    methods:{
   
    }
}
</script>

<style lang="less" scoped>
@import './style/industryWrap.less';
</style>