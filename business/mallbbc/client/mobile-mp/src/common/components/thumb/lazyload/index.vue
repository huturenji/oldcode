<template>
    <view 
        class="u-wrap" 
        :style="{
            opacity: Number(opacity),
            borderRadius: borderRadius + 'rpx',
            // 因为time值需要改变,所以不直接用duration值(不能改变父组件prop传过来的值)
            transition: `opacity ${time / 1000}s ease-in-out`
        }"
        
    >
        <view class="lazy-item">
            <image 
                :lazy-load="true"
                :style="{borderRadius: borderRadius + 'rpx'}" 
                class="u-lazy-item"
                :src="showImage" 
                :mode="imgMode" 
                @load="imgLoaded" 
                @error="loadError"
            ></image>
        </view>
    </view>
</template>

<script>
export default {
    name: 'lazy-load',
    props: {
        // 要显示的图片
        imageSrc: {
            type: String,
            default: ''
        },
        // 图片裁剪模式
        imgMode: {
            type: String,
            default: 'widthFix'
        },
        // 淡入淡出动画的过渡时间
        duration: {
            type: [Number, String],
            default: 500
        },
        // 是否使用过渡效果
        isEffect: {
            type: Boolean,
            default: true
        },
        // 圆角值
        borderRadius: {
            type: [Number, String],
            default: 0
        }
    },
    data() {
        return {
            errorImg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/errorload.png', // 加载失败的错误占位图
            opacity: 1,
            time: this.duration,
            showImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/lazyload.svg' //真正渲染的图片地址,一开始是loading占位图
        }
    },
    computed: {},
    mounted() {},
    
    watch: {
        showImage() {
            // 如果是不开启过渡效果，直接返回
            if (!this.isEffect) { return; }
            this.time = 0;
            // 原来opacity为1(不透明，是为了显示占位图)，改成0(透明，意味着该元素显示的是背景颜色，默认的白色)，再改成1，是为了获得过渡效果
            this.opacity = 0;
            // 延时30ms，否则在浏览器H5，过渡效果无效
            setTimeout(() => {
                this.time = this.duration;
                this.opacity = 1;
            }, 0)
        },
        // 图片路径发生变化时，需要重新标记一些变量，否则会一直卡在某一个状态，比如isError
        imageSrc: {
            handler(n){
                if (!n) {
                    // 如果传入null或者''，或者undefined，标记为错误状态
                    this.showImage = this.errorImg
                } else {
                    setTimeout(() => {
                        this.showImage = n;
                    }, 200)
                }
            },
            immediate: true
        }
    },
    methods: {
        // 图片加载完成事件
        imgLoaded() {
            this.$emit('load');
        },

        // 图片加载失败
        loadError() {
            this.showImage = this.errorImg;
        }
        
    }
}
</script>

<style scoped lang="scss">
    .u-wrap {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        overflow: hidden;
        .lazy-item{
            width: 100%;
            height: 100%;
        }
    }

    .u-lazy-item {
        width: 100%;
        height: 100%;
        // 骗系统开启硬件加速
        transform: transition3d(0, 0, 0);
        // 防止图片加载“闪一下”
        will-change: transform;
        /* #ifndef APP-NVUE */
        display: block;
        /* #endif */
    }
    // 页面结构复杂，css样式太多的情况，使用 image 可能导致样式生效较慢，出现 “闪一下” 的情况，此时设置 image{will-change: transform} ,可优化此问题。
    image{
        will-change: transform
    }
</style>
