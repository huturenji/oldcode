<!-- 角标组件
-->
<template>
    <view class="label_box"
    :style="{
        width:width*2+'rpx',
        height:width*2+'rpx',
        borderWidth:borderWidth*2+'rpx',
        borderBottomColor:isBgImg?'transparent':bgColor,
        opacity:opacity,
        background:labelBackground

    }"
    :class="{left_top_label:direction=='leftTop',right_top_label:direction=='rightTop'}"
    >
        <view :style="{color:textColor,fontSize:textFontSize,bottom:-1*(borderWidth+(width-borderWidth*2-borderWidth)/2)*2+'rpx'}" class="flex_row_center_center">{{text}}</view>
    </view>
</template>

<script>

export default {
    name: "angle-label",
    data() {
        return {
            
        }
    },
    components: {
        
    },
    computed: {
        // 标签背景
        labelBackground(){
            let bg = '';
            if (this.isBgImg){
                bg = `${this.bgColor} ${-1*this.borderWidth*2}rpx ${(this.width - this.borderWidth*2)*2}rpx/ ${this.width*2}rpx ${this.borderWidth*2}rpx no-repeat`
            } else {
                bg = ''
            }
            return bg
        }
    },
    props: {
        // label标签位置，目前只写了两种，leftTop:左上角,rightTop:右上角
        direction: {
            Boolean: String,
            default:'leftTop'
        },
        // label标签文字
        text: {
            Boolean: String,
            default:'热销'
        },
        // label标签的宽高（单位：px）
        width: {
            Boolean: [Number,String],
            default:80
        },
        // 边框宽，正常是宽的1/4
        borderWidth: {
            Boolean:[Number,String],
            default:20
        },
        // labe标签背景颜色
        bgColor: {
            Boolean: String,
            default:'#f30300'
        },
        // label标签文字颜色
        textColor: {
            Boolean: String,
            default:'#ffffff'
        },
        // label标签文字大小
        textFontSize: {
            Boolean: String,
            default:'24rpx'
        },
        // 透明度
        opacity: {
            Boolean: String,
            default:'1'
        },
        // 传入的是背景而不是颜色
        isBgImg: {
            Boolean: Boolean,
            default:false
        }
    },
    mounted(){
        
    },
    methods: {
        
       
    }
}
</script>

<style lang='scss' scoped>

.label_box{
    position: relative;
    width: 120rpx;
    height: 120rpx;
    border-style: solid;
    border-top-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: #f30300;
    transform-origin: 50%;
    font-size: 20rpx;
    opacity: 1;
    &.left_top_label{
        transform: translate(-50%,-50%) rotate(-45deg);
    }
    &.right_top_label{
        transform: translate(50%,-50%) rotate(45deg);
    }
    view{
        width: 100%;
        height: 100%;
        position: absolute;
        bottom: 0;
        color: #ffffff;
        white-space: nowrap;
    }
}

</style>
