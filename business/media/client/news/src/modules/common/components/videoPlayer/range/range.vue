<template>
    <div class="mint-range" :class="{ 'mint-range--disabled': disabled }">
        <slot name="start"></slot>
        <div class="mint-range-content" ref="content">
            <div class="mint-range-runway" :style="{ right: -btnWidth + 'rem' }"></div>
            <div class="mint-range-progress" :style="{ width: progress + '%'}"></div>
            <div class="mint-range-thumb" ref="thumb"
                 :style="{ left: progress + '%' }"
                 :class="{'thumb-round': btnRound}"
            ></div>
        </div>
        <slot name="end"></slot>
        <div class="mint-range-progress-real" :style="{ width: progress + '%'}"></div>
    </div>
</template>
<script type="text/babel">
import draggable from './draggable.js';
export default {
    name: 'range',
    props: {
        min: { // 区间最小值
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        height: { // range高度
            type: Number,
            default: 0.1
        },
        step: { // 滑动步数
            type: Number,
            default: 1
        },
        disabled: { // 禁止滑动
            type: Boolean,
            default: false
        },
        value: { // 预设值
            type: Number
        },
        btnWidth: { // 滑块的宽
            type: Number,
            default: 0.3
        },
        btnHeight: { // 滑块的高
            type: Number,
            default: 0.3
        },
        btnRound: { // 滑块默认为圆形
            type: Boolean,
            default: true
        }
    },
    computed: {
        progress () {
            const value = this.value;
            if (typeof value === 'undefined' || value === null) {return 0;}
            return Math.floor((value - this.min) / (this.max - this.min) * 100);
        }
    },
    mounted () {
        const thumb = this.$refs.thumb;
        const content = this.$refs.content;
        const getThumbPosition = () => {
            const contentBox = content.getBoundingClientRect();
            const thumbBox = thumb.getBoundingClientRect();
            return {
                left: thumbBox.left - contentBox.left,
                top: thumbBox.top - contentBox.top,
                thumbBoxLeft: thumbBox.left
            };
        };
        let dragState = {};
        draggable(thumb, {
            start: (event) => {
                if (this.disabled) {return;}
                const position = getThumbPosition();
                const thumbClickDetalX = event.clientX - position.thumbBoxLeft;
                dragState = {
                    thumbStartLeft: position.left,
                    thumbStartTop: position.top,
                    thumbClickDetalX: thumbClickDetalX
                };
            },
            drag: (e) => {
                if (this.disabled) {return;}
                const contentBox = content.getBoundingClientRect();
                const deltaX = e.pageX - contentBox.left - dragState.thumbStartLeft - dragState.thumbClickDetalX;
                const stepCount = Math.ceil((this.max - this.min) / this.step);
                const newPosition = (dragState.thumbStartLeft + deltaX) - (dragState.thumbStartLeft + deltaX) % (contentBox.width / stepCount);
                let newProgress = newPosition / contentBox.width;
                if (newProgress < 0) {
                    newProgress = 0;
                } else if (newProgress > 1) {
                    newProgress = 1;
                }
                this.value = Math.round(this.min + newProgress * (this.max - this.min));
                this.$emit('change', Math.round(this.min + newProgress * (this.max - this.min)));
                // try {
                //     event.stopPropagation();
                // } catch (error) {

                // }

            },
            end: () => {
                // if (this.disabled) return;
                // this.$emit('change', this.value);
                // dragState = {};
            }
        });
    }
};
</script>

<style lang="less">
@import '~newsStyles/themes/default.less';
@import '~newsStyles/mixins/mixinsStyle.less';
    .mint-range {
        width: 100%;
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        box-sizing: border-box;
        height: 0.92rem;
    }

    .mint-range-content {
        position: relative;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        height: 0.92rem;
        margin-right: 0.3rem;
    }

    .mint-range-runway {
        position: absolute;
        top: 0;
        left: 0;
        height: 0.92rem;
        background: url(img/f4.png) no-repeat center;
        background-size: 100% 2px;
    }

    .mint-range-progress,
    .mint-range-progress-real {
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        width: 0;
        height: 0.92rem;
        background: url(img/b.png) no-repeat center;
        background-size: 100% 2px;
    }

    .mint-range-progress {
        opacity: 0;
    }

    .mint-range-thumb {
        position: absolute;
        left: 0;
        z-index: 2;
        width:0.92rem;
        height:0.92rem;
        top: 0;
        .flex-box();
        .align-items(center);
        // .justify-content(center);
        &:after{
            content: '';
            width: 0.3rem;
            height: 0.3rem;
            display: inline-block;
            border-radius: 0.3rem;
            background: #fff;
        }
    }

    .thumb-round {
        border-radius: 100%;
        box-shadow: 0 1px .03rem rgba(0, 0, 0, .4);
    }

    .mt-range--disabled {
        opacity: .5;
    }
</style>
