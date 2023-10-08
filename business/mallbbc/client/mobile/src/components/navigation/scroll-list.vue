<template>
    <view
        class="u-scroll-list"
        ref="u-scroll-list"
        @mousemove="barMouseMove"
        @mouseup="isBarClick = false"
    >
        <!-- #ifdef APP-NVUE -->
        <!-- nvue使用bindingX实现，以得到更好的性能 -->
        <scroller
            class="u-scroll-list__scroll-view"
            ref="u-scroll-list__scroll-view"
            scroll-direction="horizontal"
            :show-scrollbar="false"
            :offset-accuracy="1"
            @scroll="nvueScrollHandler"
        >
            <view class="u-scroll-list__scroll-view__content">
                <slot />
            </view>
        </scroller>
        <!-- #endif -->
        <!-- #ifndef APP-NVUE -->
        <!-- #ifdef MP-WEIXIN || APP-VUE || H5 || MP-QQ -->
        <!-- 以上平台，支持wxs -->
        <scroll-view
            :scroll-left="myScrollLeft"
            class="u-scroll-list__scroll-view"
            scroll-x
            @scroll="wxs.scroll"
            @scrolltoupper="wxs.scrolltoupper"
            @scrolltolower="wxs.scrolltolower"
            :data-scrollWidth="scrollWidth"
            :data-barWidth="getPx(indicatorBarWidth)"
            :data-indicatorWidth="getPx(indicatorWidth)"
            :show-scrollbar="false"
            :upper-threshold="0"
            :lower-threshold="0"
        >
            <!-- #endif -->
            <!-- #ifndef APP-NVUE || MP-WEIXIN || H5 || APP-VUE || MP-QQ -->
            <!-- 非以上平台，只能使用普通js实现 -->
            <scroll-view
                :scroll-left="myScrollLeft"
                class="u-scroll-list__scroll-view"
                scroll-x
                @scroll="scrollHandler"
                @scrolltoupper="scrolltoupperHandler"
                @scrolltolower="scrolltolowerHandler"
                :show-scrollbar="false"
                :upper-threshold="0"
                :lower-threshold="0"
            >
                <!-- #endif -->
                <view class="u-scroll-list__scroll-view__content">
                    <slot />
                </view>
            </scroll-view>
            <!-- #endif -->
            <view
                class="u-scroll-list__indicator"
                v-if="indicator && allScrollWidth > scrollBoxWidth"
                :style="[addStyle(indicatorStyle)]"
            >
                <view
                    class="u-scroll-list__indicator__line"
                    :style="[lineStyle]"
                >
                    <view
                        @mousedown="barMouseDown"
                        @mousemove="barMouseMove"
                        @mouseup="isBarClick = false"
                        class="u-scroll-list__indicator__line__bar"
                        :style="[barStyle]"
                    ></view>
                </view>
            </view>
    </view>
</template>

<!-- #ifndef APP-NVUE || MP-WEIXIN || H5 || APP-VUE || MP-QQ -->
<script
    src="./scrollWxs.wxs"
    module="wxs"
    lang="wxs"
></script>
<!-- #endif -->

<script>
/**
 * scrollList 横向滚动列表
 * @description 该组件一般用于同时展示多个商品、分类的场景，也可以完成左右滑动的列表。
 * @property {String | Number}indicatorWidth指示器的整体宽度 (默认 50 )
 * @property {String | Number}indicatorBarWidth滑块的宽度 (默认 20 )
 * @property {Boolean}indicator是否显示面板指示器 (默认 true )
 * @property {String}indicatorColor指示器非激活颜色 (默认 '#f2f2f2' )
 * @property {String}indicatorActiveColor指示器的激活颜色 (默认 '#3c9cff' )
 * @property {String | Object}indicatorStyle指示器样式，可通过bottom，left，right进行定位
 * @event {Function} left滑动到左边时触发
 * @event {Function} right滑动到右边时触发
 * @example
 */

import { isH5 } from '@/utils/common';
import props from './props.js';
export default {
    name: 'u-scroll-list',
    mixins: [props],
    data() {
        return {
            scrollInfo: {
                scrollLeft: 0,
                scrollWidth: 0
            },
            scrollWidth: 0,
            allScrollWidth: 0,
            scrollBoxWidth: 0,
            isPC: isH5() ? SnUtils.isPC() : false,
            isBarClick: false,
            myScrollLeft: 0,
            oldClientX: 0
        }
    },
    computed: {
        // 指示器为线型的样式
        barStyle() {
            const style = {}
            // #ifndef APP-NVUE || MP-WEIXIN || H5 || APP-VUE || MP-QQ
            // 此为普通js方案，只有在非nvue和不支持wxs方案的端才使用、
            // 此处的计算理由为：scroll-view的滚动距离与目标滚动距离(scroll-view的实际宽度减去包裹元素的宽度)之比，等于滑块当前移动距离与总需
            // 滑动距离(指示器的总宽度减去滑块宽度)的比值
            const scrollLeft = this.scrollInfo.scrollLeft,
                scrollWidth = this.scrollInfo.scrollWidth,
                barAllMoveWidth = this.indicatorWidth - this.indicatorBarWidth
            const x = scrollLeft / (scrollWidth - this.scrollWidth) * barAllMoveWidth
            style.transform = `translateX(${ x }px)`
            // #endif
            // 设置滑块的宽度和背景色，是每个平台都需要的
            style.width = this.addUnit(this.indicatorBarWidth)
            style.backgroundColor = this.indicatorActiveColor
            return style
        },
        lineStyle() {
            const style = {}
            // 指示器整体的样式，需要设置其宽度和背景色
            style.width = this.addUnit(this.indicatorWidth)
            style.backgroundColor = this.indicatorColor
            return style
        }
    },
    mounted() {
        this.init()
    },
    methods: {

        /**
         * 判断是否为空
         */
        empty(value) {
            switch (typeof value) {
            case 'undefined':
                return true
            case 'string':
                if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true
                break
            case 'boolean':
                if (!value) return true
                break
            case 'number':
                if (value === 0 || isNaN(value)) return true
                break
            case 'object':
                if (value === null || value.length === 0) return true
                for (const i in value) {
                    return false
                }
                return true
            }
            return false
        },
        /**
         * @description 样式转换
         * 对象转字符串，或者字符串转对象
         * @param {object | string} customStyle 需要转换的目标
         * @param {String} target 转换的目的，object-转为对象，string-转为字符串
         * @returns {object|string}
         */
        addStyle(customStyle, target = 'object') {
            // 字符串转字符串，对象转对象情形，直接返回
            if (this.empty(customStyle) || typeof(customStyle) === 'object' && target === 'object' || target === 'string' &&
                typeof(customStyle) === 'string') {
                return customStyle
            }
            // 字符串转对象
            if (target === 'object') {
                // 去除字符串样式中的两端空格(中间的空格不能去掉，比如padding: 20px 0如果去掉了就错了)，空格是无用的
                customStyle = trim(customStyle)
                // 根据";"将字符串转为数组形式
                const styleArray = customStyle.split(';')
                const style = {}
                // 历遍数组，拼接成对象
                for (let i = 0; i < styleArray.length; i++) {
                    // 'font-size:20px;color:red;'，如此最后字符串有";"的话，会导致styleArray最后一个元素为空字符串，这里需要过滤
                    if (styleArray[i]) {
                        const item = styleArray[i].split(':')
                        style[trim(item[0])] = trim(item[1])
                    }
                }
                return style
            }
            // 这里为对象转字符串形式
            let string = ''
            for (const i in customStyle) {
                // 驼峰转为中划线的形式，否则css内联样式，无法识别驼峰样式属性名
                const key = i.replace(/([A-Z])/g, '-$1').toLowerCase()
                string += `${key}:${customStyle[i]};`
            }
            // 去除两端空格
            return trim(string)
        },
        /**
         * @description 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
         * @param {string|number} value 需要添加单位的值
         * @param {string} unit 添加的单位名 比如px
         */
        addUnit(value = 'auto', unit = 'px') {
            value = String(value)
            // 用uView内置验证规则中的number判断是否为数值
            return this.number(value) ? `${value}${unit}` : value
        },

        /**
         * @description 用于获取用户传递值的px值  如果用户传递了"xxpx"或者"xxrpx"，取出其数值部分，如果是"xxxrpx"还需要用过uni.upx2px进行转换
         * @param {number|string} value 用户传递值的px值
         * @param {boolean} unit 
         * @returns {number|string}
         */
        getPx(value, unit = false) {
            if (this.number(value)) {
                return unit ? `${value}px` : Number(value)
            }
            // 如果带有rpx，先取出其数值部分，再转为px值
            if (/(rpx|upx)$/.test(value)) {
                return unit ? `${uni.upx2px(parseInt(value))}px` : Number(uni.upx2px(parseInt(value)))
            }
            return unit ? `${parseInt(value)}px` : parseInt(value)
        },

        /**
         * @description 进行延时，以达到可以简写代码的目的 比如: await uni.$u.sleep(20)将会阻塞20ms
         * @param {number} value 堵塞时间 单位ms 毫秒
         * @returns {Promise} 返回promise
         */
        sleep(value = 30) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve()
                }, value)
            })
        },

        /**
         * 验证十进制数字
         */
        number(value) {
            return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value)
        },

        init() {
            this.getComponentWidth()
        },
        // #ifndef APP-NVUE || MP-WEIXIN || H5 || APP-VUE || MP-QQ
        // scroll-view触发滚动事件
        scrollHandler(e) {
            this.scrollInfo = e.detail
            this.myScrollLeft = e.detail.scrollLeft
        },
        scrolltoupperHandler() {
            this.scrollEvent('left')
            this.scrollInfo.scrollLeft = 0
        },
        scrolltolowerHandler() {
            this.scrollEvent('right')
            // 在普通js方案中，滚动到右边时，通过设置this.scrollInfo，模拟出滚动到右边的情况
            // 因为上方是用过computed计算的，设置后，会自动调整滑块的位置
            this.scrollInfo.scrollLeft = this.getPx(this.indicatorWidth) - this.getPx(this.indicatorBarWidth)
        },
        // #endif
        //
        scrollEvent(status) {
            this.$emit(status)
        },
        // 获取组件的宽度
        async getComponentWidth() {
            // 延时一定时间，以获取dom尺寸
            await this.sleep(30)
            // #ifndef APP-NVUE
            let boxSize = await this.$uGetRect('.u-scroll-list__scroll-view__content')
            this.scrollBoxWidth = boxSize.width

            this.$uGetRect('.u-scroll-list').then(size => {
                this.scrollWidth = size.width
            })

            this.$uGetRect('.scroll-list').then(size => {
                this.allScrollWidth = size.width
            })
            // #endif

            
        },

        // 滚动条相关事件
        barMouseDown(e) {
            if(!this.isPC) return
            this.isBarClick = true
            // #ifndef APP-NVUE || MP-WEIXIN || H5 || APP-VUE || MP-QQ
            this.myScrollLeft = this.wxs.getBarLeft()
            // #endif

            this.oldClientX = e.clientX
        },
        barMouseMove(e) {
            if(!this.isBarClick || !this.isPC) return
            // 计算scroll需要滚动的距离x  x / scroll超出部分 = 鼠标移动距离 / 模拟滚动条间隙
            this.myScrollLeft += (this.allScrollWidth - this.scrollWidth) * (e.clientX - this.oldClientX) / (this.indicatorWidth - this.indicatorBarWidth)
            // 对 scroll-left进行边界判断
            if(this.myScrollLeft < 0) {
                this.myScrollLeft = 0
            } else if(this.myScrollLeft > (this.allScrollWidth - this.scrollWidth)) {
                this.myScrollLeft = this.allScrollWidth - this.scrollWidth
            }
            this.oldClientX = e.clientX
        }
    }
}
</script>

<style lang="scss" scoped>
// pc端滚动条样式注释
// @media screen and (min-width: 550px) {
//     ::v-deep ::-webkit-scrollbar {
//         height: 4px !important;
//         display: inline-block !important;
//     }

//     ::v-deep ::-webkit-scrollbar-thumb {
//         border-radius: 10px !important;
//         background: rgba(255, 255, 255, 0.3) !important;
//     }

//     ::v-deep ::-webkit-scrollbar-track {
//         border-radius: 10px !important;
//         background: rgba(0, 0, 0, 0.05) !important;
//     }
// }

::v-deep ::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    color: transparent !important;
    background: transparent !important;
}

.u-scroll-list {
    // padding-bottom: 10px;

    &__scroll-view {
        display: flex;

        &__content {
            display: flex;
        }
    }

    &__indicator {
        display: flex;
        justify-content: center;
        margin-top: 13px;

        &__line {
            width: 60px;
            height: 3px;
            border-radius: 2px;
            overflow: hidden;

            &__bar {
                width: 20px;
                height: 3px;
                border-radius: 2px;
            }
        }
    }
}
</style>
