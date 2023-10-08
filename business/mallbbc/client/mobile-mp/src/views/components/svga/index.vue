<template>
    <view id="svga-container" :style="[style]">
        <w-loading ref="loading"></w-loading>
        <canvas
            type="2d"
            :style="[canvasStyle]"
            id="svga-canvas"
        ></canvas>
        <image v-if="showCloseIcon" @click="$emit('close')" class="close_icon" :style="[closeIconStyle]" :src="imgUrl + 'common/icon/close_screen.png'" mode="widthFix"></image>
    </view>
</template>

<script>
import { isNotEmpty } from "@/utils/common.js";
let { Parser, Player } = require("./svgaplayer.weapp");
const parser = new Parser();
const player = new Player;

export default {
    data() {
        return {
             
        };
    },
    computed: {
        canvasStyle(){
            return {
                width: this.width,
                height: this.height,
            }
        }
    },
    watch:{
        // 监听动画路径src的变化
        src: {
            handler(val, oldVal){
                if(isNotEmpty(val) && isNotEmpty(oldVal) && val != oldVal){
                    this.initSvga(val);
                }
            },
            deep: true
        }
    },
    components: {},
    props: {
        // 外层容器的样式
        style: {
            type: Object,
            default: ()=>{
                return {}
            }
        },
        // 渲染的动画的宽 单位px
        width: {
            type: [Number | String],
            default: '300px'
        },
        // 渲染的动画的高 单位px
        height: {
            type: [Number | String],
            default: '500px'
        },
        // 设置当前动画的循环次数，0代表无限循环
        loops: {
            type: Number,
            default: 0
        },
        // 渲染的动画的绝对路径地址
        src: {
            type: String,
            require: true
        },
        // 可选值为 Fill / AspectFill / AspectFit
        contentMode: {
            type: String,
            default: 'AspectFit'
        },
        // 是否显示关闭icon
        showCloseIcon: {
            type: Boolean,
            default: false
        },
        //关闭icon按钮的样式
        closeIconStyle: {
            type: Object,
            default: ()=>{
                return {}
            }
        }
    },
    onReady(){}, 
    mounted(){
        if(isNotEmpty(this.src)){
            this.initSvga(this.src);
        }
    },
    onLoad() {
        
    },
    methods: {        
        // 初始化svga动画
        async initSvga(src){
            var that = this;
            try {
                this.$refs?.loading?.open();
                await player.setCanvas('#svga-canvas', that)
                var videoItem = await parser.load(src);
                await player.setVideoItem(videoItem);
                player.loops = that.loops;
                player.setContentMode(that.contentMode);
                this.$refs?.loading?.close();
                player.startAnimation();
                // 监听动画完成
                player.onFinished(() => {
                    console.log('动画结束')
                    that.$emit('done');
                })

            } catch (error) {
                console.log(error);
                this.$refs?.loading?.close();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.close_icon{
    width: 44rpx;
    height: 44rpx;
    position: absolute;
    top: 192rpx;
    right: 92rpx;
    z-index: 300000;
}
</style>

