<template>
    <view class="img_warp" v-margin="decoItem" 
        :style="{
            position:position,
            top:top,
            zIndex:zIndex,
            width:width
        }"
    >
        <view class="img_warp_item"  @click="goDetail(item)" v-for="(item, index) in decoItem.data"  :key="index" > 
            <image class="img_item" :src="setImg(item)" mode="widthFix" ></image>
        </view>
    </view>
</template>

<script>
import { skipTo } from '@/utils/common.js'
export default {
    name: "deco-image-combination",
    data() {
        return {
            imgStyles:0,
            position:'relative',
            top:0,
            zIndex:0,
            width:''
        }
    },
    props: {
        decoItem:{},
        parentScrollTop: {
            type: Number,
            default: 0
        },
        isChildren: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        parentScrollTop:{
            handler(val){
                //不在初始化时执行，避免多次触发同一事件
                if (val > 0&&!this.isChildren){
                    this.imgStyles = 1
                }else{
                    this.imgStyles = 0
                }
            },
            immediate: true
        }       
    },
    computed:{
        setImg(){
            return item=>{
                let img
                if(this.imgStyles == 0){
                    img = item.img
                }else{
                    img = !!item.imgActivity?item.imgActivity:item.img
                }
                return img
            }
        }
    },
    mounted(){
        this.setImageWrapStyle()
    },
    methods:{
        goDetail(item){
            skipTo(item, this)
        },
        setImageWrapStyle(){
            this.$nextTick(()=>{
                if (!this.isChildren&&!!this.decoItem.props.fixed){
                    this.position = 'fixed'
                    this.top = window.titleHeight + window.statusHeight -1 + 'px'
                    this.zIndex = 2000
                    this.width = '100%'
                }
            })
        }
        // ,
        // imageLoad() {
        //     try {
        //         this.mountedCount += 1
        //         if (this.mountedCount === this.decoItem.data.length) {
        //             // 该延时器是为了兼容部分手机上【目前已知iphone7】上有的图片依旧有白线的问题
        //             setTimeout(()=>{
        //                 getQuerySelector('.img_warp_item', true, this).then(res => {
        //                     res.forEach((item, index) => {
        //                         // 修复图片的宽高有小数点，小数点宽高在不不同的机型上有白线的问题
        //                         //item.width==0?res[index-1].width:item.width   预览时获取新加的图片的宽度为0，导致新加的图片无法显示做此兼容
        //                         this.$set(this.imgStyles, index, {width: parseInt(item.width==0?res[index-1].width:item.width), height:parseInt(item.height)})
        //                     })
        //                 })
        //             }, 50)
        //         }
        //     } catch (error) {
                
        //     }
        // },
        // setImgStyle(index) {
        //     let style = {}
        //     if (this.imgStyles[index] && this.imgStyles[index].width && this.imgStyles[index].height) {
        //         style = {
        //             width: `${this.imgStyles[index].width}px`,
        //             height: `${this.imgStyles[index].height}px`
        //         }
        //     } else {
        //         style = { flex: 1 }
        //     }
        //     return style
        // }
    }
}
</script>

<style lang='scss'>
    .img_warp{
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        font-size: 0;
        // width: 100%;
        .img_warp_item{
            flex: 1;
            .img_item{
                min-height: 1px; //为了修复当图片没有加载完成的时候，快速离开，再回来图片加载异常的问题
                width: 100%;
                vertical-align: top;
            }
            //为了修复当图片没有加载完成的时候，快速离开，再回来图片加载异常的问题
            ::v-deep uni-image{
                height: auto;
            }
            ::v-deep uni-image > img {
                object-fit: unset;
            }
        }
    } 
</style>