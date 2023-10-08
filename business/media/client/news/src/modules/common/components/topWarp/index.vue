<template>
    <topSwiper :keyIndex="keyIndex"  :options="options" :stopSwiper='stopSwiper' :swiperNumber="swiperNumber" :swiperList="newsData" :topNewsConfig="topNewsConfig" :key=Math.random()*10000 :isBorder="isBorder" />
</template>
<script>
import topSwiper from './topSwiper'
import extendUtils from 'common/lib/utils';
export default {
    // name:'topWarp',
    components:{
        topSwiper
    },
    data(){
        return{
            options:{},
            // swiperSpeed:this.swiperSpeed,
            // swiperNumber:this.swiperNumber,
            timer:null,
            newsData:[],
            swiperTouch:true
        }
    },
    props:{
        keyIndex:{
            type:[Number, String]
        },
        swiperList:{
            type:Array,
            default:()=>[]
        },
        isBorder:{
            type:Boolean,
            default:true
        },
        swiperNumber:{
            type:Number,
            default:1
        },
        swiperSpeed:{
            type:Number,
            default:3000
        },
        topNewsConfig:{
            type:Boolean,
            default:true
        }
    },
    watch:{
        swiperList:{
            handler(val){          
                this.newsData=val
                if(val.length<this.swiperNumber){
                    this.swiperNumber=val.length
                }
                this.initSwiper()
            },
            immediate:true
        }
    },
    methods:{
        /****
         * 初始化轮播参数
         */
        initSwiper(){
            let that = this;
            that.options={
                direction: "vertical",//控制滚动方向
                loop: true,// 控制循环
                slidesPerView : 'auto',
                loopedSlides : that.swiperList.length,
                autoplayDisableOnInteraction: false,
                onClick:function(swiper, event){
                    if(!that.swiperTouch){
                        return false
                    }
                    let dataset = event.target.dataset;
                    if(!!dataset && !!dataset.item){
                        let item = dataset.item;
                        that.goDetail(item); //点击详情的跳转
                    }
                },
                onSliderMove:function(){
                    try {
                        clearTimeout(that.timer)
                        that.swiperTouch=false
                        that.$emit('stopTopMescrollDown')
                    } catch (error) {

                    }
                },
                onSlideChangeEnd:function(){
                    try {
                        that.timer = setTimeout(()=>{
                            that.swiperTouch=true
                            that.$emit('startTopMescrollDown')
                        }, 500)
                    } catch (error) {
                        
                    }
                }
            }
            clearTimeout(this.timer);
            if(this.swiperNumber < this.swiperList.length){
                this.timer = setTimeout(()=>{
                    let autoplay = this.swiperSpeed<3000?3000:this.swiperSpeed
                    that.options = Object.assign({}, that.options, {
                        'autoplay': autoplay,
                        'loop': true
                    })
                },(that.swiperNumber-1)*this.swiperSpeed)
            }else{
                that.stopSwiper=true
                that.options = Object.assign({}, that.options, {
                    'autoplay': false,
                    'loop':false
                })
            }

        },
        /*****
         * 点击跳转详情页
         */
        goDetail(id){
            extendUtils.openPage('article?articleId='+id)
        }
    },
    mounted(){       
    }
}
</script>