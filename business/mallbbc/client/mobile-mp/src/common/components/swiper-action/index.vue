<!-- 
    滑动单元格
    solt="right" 主体右侧内容 slot中事件不需要触发滑动时需要阻止冒泡,并使用 mousedown 和 touchstart
    @param cellClose cell关闭事件
    @param cellOpen cell开启事件
    @param cellShow cell是否显示，默认为 false
    @param cellMoving 滑块开启事件, 返回滑块是否进行滑动，该变量可用于滑动结束时阻止默认插槽的点击事件
    @fn cellReset 重新计算插槽宽度
-->
<template>
    <view class="swiper-action swiper-cell">
        <view
            class="swiper-cell-content"
            :style="[contentStyle]"
            @mousedown="goodsMouseDown"
            @touchstart="goodsTouchstart"
            @mousemove="goodsMouseMove"
            @touchmove="goodsTouchmove"
            @mouseup="goodsMouseUp"
            @touchend="goodsMouseUp"
            @touchcancel="goodsMouseUp"
        >
            <slot />
        </view>
        
        <view class="swiper-cell-right" ref="swiperCellRight" :style="[cellRStyle, isShow]">
            <slot name="right" />
        </view>
    </view>
</template>

<script>
import { getQuerySelector } from '@/utils/common.js'

export default {
    name: 'goodsCheck',
    props: {
        cellShow: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        cellShow: {
            handler(isShow) {
                this.isAnimation = true
                this.goodsLeft = isShow ? (- this.slideWidth) : 0
            }
        },
    },
    computed: {
        cellRStyle() {
            let style = {
                right: ( - this.slideWidth - this.goodsLeft) + 'px',
                transition: this.isAnimation ? '0.2s' : '0s'
            }
            return style
        },
        contentStyle() {
            let style = {
                transform: 'translateX(' + this.goodsLeft + 'px)',
                transition: this.isAnimation ? '0.2s' : '0s'
            }
            return style
        },
        isShow() {
            return { opacity: this.showDel ? 1 : 0 }
        }
    },
    data() {
        return {
            slideWidth: 0, // 右侧宽度
            mouseDown: false,
            isAnimation: false, // 手拖拽松开后需要回弹动画，拖拽时不需要
            moveY: 0,
            moveX: 0,
            goodsLeft: 0, // 滑动距离
            isMoving: false, // 是否正在滑动
            showDel: false, 
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getRightWidth()
        })

        // 监听全局的mouseup事件
    },
    methods: {
        async getRightWidth() {
            let { width } = await getQuerySelector('.swiper-cell-right', false, this)
            setTimeout(() => {
                this.showDel = true;
            })
            this.slideWidth = width
            this.isAnimation = false
            this.goodsLeft = 0
        },
        cellReset() {
            this.$nextTick(() => {
                this.getRightWidth()
            })
        },
        goodsMouseDown(e) {
            if (this.slideWidth === 0) { return }
            this.isAnimation = false
            this.mouseDown = true
            this.moveY = e.clientY;
            this.moveX = e.clientX;
        },
        goodsMouseMove(e) {
            if (!this.mouseDown || this.slideWidth === 0) { return }
            this.move(e)
        },
        goodsMouseUp() {
            if (this.slideWidth === 0) { return }
            this.mouseDown = false
            this.isAnimation = true
            if (Math.abs(this.goodsLeft) > this.slideWidth / 2) {
                this.goodsLeft = (- this.slideWidth)
                this.$emit('cellOpen')
            } else {
                this.goodsLeft = 0
                this.$emit('cellClose')
            }

            if (this.isMoving) {
                this.isMoving = false
                setTimeout(() => {
                    this.$emit('cellMoving', false)
                }, 0)
            }
        },
        goodsTouchstart({ touches }) {
            if (this.slideWidth === 0) { return }
            this.isAnimation = false
            this.moveY = touches[0].clientY;
            this.moveX = touches[0].clientX;
        },
        goodsTouchmove(e) {
            if (this.slideWidth === 0) { return }
            this.move(e.touches[0])
        },
        move(e) {
            let moveX = e.clientX - this.moveX
            let moveY = e.clientY - this.moveY
            this.moveX = e.clientX
            this.moveY = e.clientY
            // 上下滑动距离大于左右滑动/2时，左右滑动不作响应
            if (Math.abs(moveY) > Math.abs(moveX) / 2) {
                return
            }
            // 触发正在滑动事件
            if (!this.isMoving) {
                this.isMoving = true
                this.$emit('cellMoving', true)
            }
            this.goodsLeft += moveX
            // 对滑动范围作出限制
            if (this.goodsLeft > 0) {
                this.goodsLeft = 0
            } else if (Math.abs(this.goodsLeft) > this.slideWidth) {
                this.goodsLeft = (- this.slideWidth)
            }
        }
    }
}
</script>

<style lang='scss'>
.swiper-action.swiper-cell {
    width: 100%;
    position: relative;
    overflow-x: hidden;

    .swiper-cell-content {
        position: relative;
        width: 100%;
    }

    .swiper-cell-right {
        height: 100%;
        position: absolute;
        top: 0;
        > view {
            height: 100%;
        }
    }
}
</style>
