<template>
    <view id="svga-container" :style="containerStyle">
        <image v-if="showCloseIcon" @click="$emit('close')" class="close_icon" :style="[closeIconStyle]" :src="imgUrl + 'common/icon/close_screen.png'" mode="widthFix"></image>
    </view>
</template>

<script>
import { isNotEmpty } from '@/utils/common.js'
// 参考文档https://blog.csdn.net/charlie_y/article/details/124802535
let SVGA = require('@/utils/svga/svga.min.js')
export default {
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
        };
    },
    computed: {
       
    },

    components: {},
    props: {
        // 外层容器的样式
        containerStyle: {
            type: Object,
            default: ()=>{
                return {}
            }
        },
        // 渲染的动画的宽 单位px
        width: {
            type: [Number, String],
            default: 300
        },
        // 渲染的动画的高 单位px
        height: {
            type: [Number, String],
            default: 500
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
    mounted(){
       
    },
    onLoad() {},
    watch:{
        // 监听动画路径src的变化
        src: {
            handler(val){
                if(isNotEmpty(val)){
                    this.initSvga(val);
                }
            },
            deep: true,
            immediate: true
        }
    },

    methods: {
        // 初始化svga动画
        initSvga(src){
            try {
                let that = this;
                setTimeout(() => {
                    const canvasList = document.getElementById('svga-container')
                    const canvas = document.createElement('canvas')
                    // 解决canvas渲染动画模糊的问题
                    canvas.width = that.width*2;
                    canvas.height = that.height*2;
                    canvas.style.transform = 'scale(0.5)';
                    canvas.id = 'animate-myCanvas'
                    canvasList.appendChild(canvas)
                    const player = new SVGA.Player('#animate-myCanvas')
                    const parser = new SVGA.Parser('#animate-myCanvas')
                    // 待实例化完成 在进行load
                    setTimeout(()=>{
                        parser.load(
                            src,
                            function(value) {
                                player.setVideoItem(value)
                                player.loops = that.loops;
                                player.setContentMode(that.contentMode);
                                player.startAnimation()
                                // 监听动画完成
                                player.onFinished(() => {
                                    console.log('动画结束')
                                    that.$emit('done')
                                })
                            }
                        )
                    }, 0)
                }, 0)
            } catch (error) {
                console.log('初始化svga动画失败');
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

