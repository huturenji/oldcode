<template>
    <view 
        class="u-wrap" 
        :class="'lazy-item-' + elIndex"
        :style="{
            opacity: Number(opacity),
            borderRadius: borderRadius + 'rpx',
            // 因为time值需要改变,所以不直接用duration值(不能改变父组件prop传过来的值)
            transition: `opacity ${time / 1000}s ease-in-out`
        }"
        
    >
        <view class="lazy-item" :class="'lazy-item-' + elIndex">
            <image 
                v-if="!imgError" 
                :style="{borderRadius: borderRadius + 'rpx'}" 
                class="u-lazy-item"
                :src="showRealImg ? imageSrc : loadingImg" 
                :mode="imgMode" 
                @load="imgLoaded" 
                @error="loadError"
            ></image>

            <image
                v-else
                :style="{borderRadius: borderRadius + 'rpx'}" 
                class="u-lazy-item error"  
                :src="errorImg"
                mode="aspectFit" 
                @load="errorImgLoaded"
            ></image>


        </view>
        <!-- 真实的图片加载 -->
        <image @load="realFakerImageLoaded" class="real_faker_image" :src="imageSrc"></image>
    </view>
</template>

<script>
/**
 * lazyLoad 懒加载
 * @description 懒加载使用的场景为：页面有很多图片时，APP会同时加载所有的图片，导致页面卡顿，各个位置的图片出现前后不一致等.
 * @tutorial https://www.uviewui.com/components/lazyLoad.html
 * @property {String} imageSrc 图片路径
 * @property {String} loading-img 预加载时的占位图
 * @property {String} error-img 图片加载出错时的占位图
 * @property {String} threshold 触发加载时的位置，见上方说明，单位 rpx（默认300）
 * @property {String Number} duration 图片加载成功时，淡入淡出时间，单位ms（默认）
 * @property {Boolean} is-effect 图片加载成功时，是否启用淡入淡出效果（默认true）
 * @property {String Number} border-radius 图片圆角值，单位rpx（默认0）
 * @property {String Number} mg-mode 图片的裁剪模式，详见image组件裁剪模式（默认widthFix）
 * @event {Function} load 图片加载成功时触发
 * @event {Function} error 图片加载失败时触发
 */
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
        // loading图片样式 1 = 灰底； 2 = 白底 默认1
        loadingImgMode: {
            type:  [Number, String],
            default: 1
        },
        // 图片进入可见区域前多少像素时，单位rpx，开始加载图片
        // 负数为图片超出屏幕底部多少距离后触发懒加载，正数为图片顶部距离屏幕底部多少距离时触发(图片还没出现在屏幕上)
        threshold: {
            type: [Number, String],
            default: 100
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
            loadingImgMode1: window.themeObj.config.loadingImage, //比N家图片默认loading占位图2 此处用base64的原因是 阻止网络请求，尽量提高占位图显示时间 模式2为白底
            errorImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgBAMAAAB54XoeAAAAGFBMVEX////o6Ojs7Ozy8vL19fX6+vr4+Pjv7+8mW3O5AAAC5UlEQVRo3u3bwW7aQBAGYMc25JrZOOHKWjVnR5V6jiNVuQJq78ATxFLfX+0C1R8Kk9nWv1Qr2TmGzZfxMp7drCEL8VyLElV4eSpRUf/IjvEgejyGAVuJi9uDtzbGIEUzmjC6fHtMG5kiLmglwkvx7tdgL8QUXZYVIswU2+xKhJniTdaFRB8zQpSHwu33U0mJcLGzzP+uXk6Kbg8uOeBkD4YLz0gRrAQmMIEJ/IDgt7quvxLBnYRY0MBcDjEngRN/BN2SA66wn+GAHvsZCpgLYs4At4K4Z4BeEI4ATuR1LIeD5dlGeCCYn4DzBL5L8I+yGWFhn956o2wOJ+1rlA329RIw0kUKy+hoF/rjVmTUm6UE/idwRwYLmXNA3LCOCna4V4eCuP8dDyzRTjhgj45MAXdYMyhggUVjIIgWjxQJYCdipvhdA83dUKNMyiYanOKCsbKdj6lMUDt8b5Sqak0Qh+9Wik/h5zMLxC1ipZijAGzQi1gpligAG+xErBRRpY0NXsvFWCpv2sYCp15/boDbHFFpoPm4ZqNcQ6uBxuMa7HzL02u4VUHrcc3mvG3YW2Kve7fanLg3wJ3uuY06pFHBQvRoMUT7WwBRrmos8Iacx70CdsYEqnNcXQZzewI7iQLtinlBkcaDvTmBhUSCVsXMcJfHg4U9gb38DXhlTuCTkMAFWgwFnKEGCCCeSnoW+IKKpoCfUNEUcIaK5oBzVDQHdOgaw0GkOPE80OEIhFk2UxKIVt1xQCxOJRGsmHcKjhsLEojRDxwQe5prEohl3HNAbF5zItggRQKIFsEC0SI4IFJck0CkSAKR4pYEoouxQHQxEoguxgLRIkgguhgJxC/1JBBdLBosPlvRZiEuvvTlPR3qJjCBCUxgAv8RpH+wlv/R315Ebjjgav8feyeEFHESWGGBJ3yOP1wsdisDv2mATZq3E+yiPRem0kywlOi4w/DBCWL8mpdgg5NuRoI4xH+uhyaIr5P8BKV9mLp0PjLWAAAAAElFTkSuQmCC', // 加载失败的错误占位图
            opacity: 1,
            time: this.duration,
            showRealImg: false, //是否显示真正的图片
            imgError: false, // 图片加载失败
            elIndex: this.guid()
        }
    },
    computed: {
        // 将threshold从rpx转为px
        getThreshold() {
            // 先取绝对值，因为threshold可能是负数，最后根据this.threshold是正数或者负数，重新还原
            let thresholdPx = uni.upx2px(Math.abs(this.threshold));
            return this.threshold < 0 ? -thresholdPx : thresholdPx;
        },

        // 占位图base64地址
        loadingImg(){
            return this['loadingImgMode' + this.loadingImgMode];
        }
    },
    created() {
        // 由于一些特殊原因，不能将此变量放到data中定义
        this.observer = {};
    },
    mounted() {
        try {
            // 此uOnReachBottom事件滚动事件发出，目的是让页面到底时，保证所有图片都进行加载，做到绝对稳定且可靠
            this.$nextTick(() => {
                uni.$once('uOnReachBottom', () => {
                    if (!this.showRealImg) { this.showRealImg = true; }
                });
            })
            // mounted的时候，不一定挂载了这个元素，延时300ms，否则会报错或者不报错，但是也没有效果
            setTimeout(() => {
                let that = this;
                // 这里是组件内获取布局状态
                that.disconnectObserver('contentObserver');
                const contentObserver = uni.createIntersectionObserver(that);
                
                // 要理解这里怎么计算的，请看这个：
                // https://blog.csdn.net/qq_25324335/article/details/83687695
                try {
                    contentObserver.relativeToViewport({
                        bottom: that.getThreshold
                    }).observe('.lazy-item-' + that.elIndex, (res) => {
                        if (res.intersectionRatio > 0 && !that.showRealImg) {
                            // 懒加载状态改变
                            that.showRealImg = true;
                            // 如果图片已经加载，去掉监听，减少性能的消耗
                            that.disconnectObserver('contentObserver');
                        }
                    })
                    that.contentObserver = contentObserver;
                } catch (error) {
                    
                }
            }, 350)           
        } catch (error) {
            
        }
    },
    beforeDestroy() {
        // 销毁页面时，可能还没触发某张很底部的懒加载图片，所以把这个事件给去掉
        //observer.disconnect();
    },
    watch: {
        showRealImg() {
            // 如果是不开启过渡效果，直接返回
            if (!this.isEffect) { return; }
            this.time = 0;
            // 原来opacity为1(不透明，是为了显示占位图)，改成0(透明，意味着该元素显示的是背景颜色，默认的白色)，再改成1，是为了获得过渡效果
            this.opacity = 0;
            // 延时30ms，否则在浏览器H5，过渡效果无效
            setTimeout(() => {
                this.time = this.duration;
                this.opacity = 1;
            }, 30)
        },
        // 图片路径发生变化时，需要重新标记一些变量，否则会一直卡在某一个状态，比如isError
        imageSrc(n) {
            if (!n) {
                // 如果传入null或者''，或者undefined，标记为错误状态
                this.imgError = true;
            } else {
                this.imgError = false;
            }
        }
    },
    methods: {
        /**
             * @param {Number} len uuid的长度
             * @param {Boolean} firstU 将返回的首字母置为"u"
             * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
             */
        guid(len = 32, firstU = true, radix = null) {
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
            const uuid = []
            let rax = radix || chars.length

            if (len) {
                // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
                for (let i = 0; i < len; i++) { uuid[i] = chars[0 | Math.random() * rax] }
            } else {
                let r
                // rfc4122标准要求返回的uuid中,某些位为固定的字符
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
                uuid[14] = '4'

                for (let i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
                    }
                }
            }
            // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
            if (firstU) {
                uuid.shift()
                return `u${uuid.join('')}`
            }
            return uuid.join('')
        },
        // 当真实的图片加载完之后,触发变量变更
        realFakerImageLoaded(){
            this.$nextTick(() => {
                uni.$emit('uOnReachBottom');
            })
        },
        // 图片加载完成事件
        imgLoaded() {
            this.$emit('load');
        },
        // 错误的图片加载完成
        errorImgLoaded() {
            this.$emit('error');
        },
        // 图片加载失败
        loadError() {
            this.imgError = true;
        },
        disconnectObserver(observerName) {
            const observer = this[observerName];
            observer && observer.disconnect();
        }
    }
}
</script>

<style scoped lang="scss">
    .u-wrap {
        width: 100%;
        height: 100%;
        background-color: #eee;
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
    .real_faker_image{
        width: 0rpx;
        height: 0rpx;
        opacity: 0;
        position: fixed;
        top: 0;
        left: 0;
    }
</style>
