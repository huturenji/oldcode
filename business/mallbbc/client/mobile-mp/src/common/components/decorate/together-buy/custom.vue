<template>
    <view class="tabs" style="{ padding-bottom: 0 }">
        <view class="tabs__wrapper">
            <slot name="left" />
            
            <!-- 注释外层容器为了修复ios12及以下无法滑动问题 -->
            <!-- <view class="tabs__wrapper__scroll-view-wrapper"> -->
            <scroll-view
                :scroll-x="scrollable"
                :scroll-left="scrollLeft"
                scroll-with-animation
                class="tabs__wrapper__scroll-view"
                :show-scrollbar="false"
                ref="tabs__wrapper__scroll-view"
                style="white-space: nowrap;"
            >
                <view
                    class="tabs__wrapper__nav"
                    ref="tabs__wrapper__nav"
                    :style="[{
                        flex: scrollable ? 0 : 1
                    }]"
                >
                    <view
                        class="tabs__wrapper__nav__item"
                        v-for="(item, index) in list"
                        :key="index"
                        @tap="clickHandler(item, index)"
                        :ref="`tabs__wrapper__nav__item-${index}`"
                        :style="[addStyle(itemStyle)]"
                        :class="[`tabs__wrapper__nav__item-${index}`, item.disabled && 'tabs__wrapper__nav__item--disabled']"
                    >    
                        <view class="right-cate-con-box" :style="[tabIndexStyle]" :class="{ active: current == index }">
                            <view class="twoRow flex_column_center_center">
                                <view class="num-font">{{ item.title }}</view>
                                <view class="distanceTime" v-if="item.frontState === 2">
                                    <text class="text1" v-if="item.distanceTime >= 0">距结束</text>
                                    <text class="num-font text2" v-if="item.distanceTime >= 0">
                                        {{ leftTime(item.distanceTime).hour }}:{{ leftTime(item.distanceTime).min }}:{{ leftTime(item.distanceTime).second }}
                                    </text>
                                    <text class="text1" v-else>已结束</text>
                                </view>
                                <view class="distanceTime" v-else>
                                    <text class="text1">{{ cateShowEnum[item.frontStateValue] }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>
            <!-- </view> -->
            <slot name="right" />
        </view>
    </view>
</template>

<script>
export default {
    name: 'tabs-com',
    props: {
        // 滑块的移动过渡时间，单位ms
        duration: {
            type: Number,
            default: 300
        },
        // tabs标签数组
        list: {
            type: Array,
            default: () => []
        },
        // 滑块位置
        lineBottom: {
            type: String,
            default: '2px'
        },
        // 滑块高度
        lineHeight: {
            type: [String, Number],
            default: 0
        },
        // 菜单item的样式
        itemStyle: {
            type: [String, Object],
            default: () => ({
                height: '44px'
            })
        },
        // 菜单是否可滚动
        scrollable: {
            type: Boolean,
            default: true
        },
        // 当前选中标签的索引
        current: {
            type: [Number, String],
            default: 0
        },
        // 组件的排列方式 column=图片和文字上下排列 row=图片和文字左右排列
        mode: {
            type: String,
            default: 'column'
        },
        tabIndexStyle: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            firstTime: true,
            scrollLeft: 0,
            scrollViewWidth: 0,
            lineOffsetLeft: 0,
            tabsRect: {
                left: 0
            },
            innerCurrent: 0,
            moving: false,
            lineWidth:20,
            cateShowEnum: {
                '即将开始': '即将开抢',
                '进行中': '进行中',
                '已结束': '已结束',
                '已开始': '已开始',
                '抢购中': '抢购中'
            }
        }
    },
    watch: {
        current: {
            immediate: true,
            handler (newValue) {
                // 内外部值不相等时，才尝试移动滑块
                if (newValue !== this.innerCurrent) {
                    this.innerCurrent = newValue
                    this.$nextTick(() => {
                        this.resize()
                    })
                }
            }
        },
        // list变化时，重新渲染list各项信息
        list() {
            this.$nextTick(() => {
                this.resize()
            })
        },
        mode: {
            immediate: true,
            handler () {
                this.$nextTick(() => {
                    this.resize()
                })
            }
        }
    },
    computed: {
        // 倒计时
        leftTime() {
            return (time) => {
                let hours = parseInt(time / 60 / 60 % 24)
                let minutes = parseInt(time / 60 % 60)
                let seconds = parseInt(time % 60)

                return {
                    hour: hours > 9 ? hours : '0' + hours,
                    min: minutes > 9 ? minutes : '0' + minutes,
                    second: seconds > 9 ? seconds : '0' + seconds
                }
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        setLineLeft() {
            const tabItem = this.list[this.innerCurrent];
            if (!tabItem) {
                return;
            }
            // 获取滑块该移动的位置
            let lineOffsetLeft = this.list
                .slice(0, this.innerCurrent)
                .reduce((total, curr) => total + curr.rect.width, 0);
            let lineWidth = this.lineWidth = tabItem.rect.width; // 拷贝副本，防止间接修改props中的值
            // 如果lineWidth不是数字类型的话
            if (typeof lineWidth !== 'number') {
                // 判断后缀是否为rpx
                if (lineWidth.indexOf('rpx') > -1) {
                    lineWidth = uni.upx2px(parseFloat(lineWidth)); // rpx -> px
                } else {
                    lineWidth = parseFloat(lineWidth);
                }
            }
            this.lineOffsetLeft = lineOffsetLeft + (tabItem.rect.width - lineWidth) / 2
            // #ifdef APP-NVUE
            // 第一次移动滑块，无需过渡时间
            this.animation(this.lineOffsetLeft, this.firstTime ? 0 : parseInt(this.duration))
            // #endif

            // 如果是第一次执行此方法，让滑块在初始化时，瞬间滑动到第一个tab item的中间
            // 这里需要一个定时器，因为在非nvue下，是直接通过style绑定过渡时间，需要等其过渡完成后，再设置为false(非第一次移动滑块)
            if (this.firstTime) {
                setTimeout(() => {
                    this.firstTime = false
                }, 10);
            }
        },

        /**
             * @description 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
             * @param {string|number} value 需要添加单位的值
             * @param {string} unit 添加的单位名 比如px
             */
        addUnit(v = 'auto', unit = 'px') {
            let value = String(v)
            // 用uView内置验证规则中的number判断是否为数值
            return this.number(value) ? `${value}${unit}` : value
        },

        /**
             * 验证十进制数字
             */
        number(value) {
            return /^[+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value)
        },

        /**
             * 判断是否为空
             */
        empty(value) {
            switch (typeof value) {
            case 'undefined':
                return true
            case 'string':
                if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) { return true }
                break
            case 'boolean':
                if (!value) { return true }
                break
            case 'number':
                if (value === 0 || isNaN(value)) { return true }
                break
            case 'object':
                if (value === null || value.length === 0) { return true }
                /* eslint-disable */
                for (const i in value) {
                    return false
                }
                /* eslint-disable */
                return true
            default:
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
            if (this.empty(customStyle) || (typeof (customStyle) === 'object' && target === 'object') || (target === 'string'
                    && typeof (customStyle) === 'string')) {
                return customStyle
            }
            // 字符串转对象
            if (target === 'object') {
                // 去除字符串样式中的两端空格(中间的空格不能去掉，比如padding: 20px 0如果去掉了就错了)，空格是无用的
                let customStyleCopy = trim(customStyle)
                // 根据";"将字符串转为数组形式
                const styleArray = customStyleCopy.split(';')
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

        // nvue下设置滑块的位置
        animation(x, duration = 0) {
            // #ifdef APP-NVUE
            const ref = this.$refs['tabs__wrapper__nav__line']
            /* eslint-disable */  //animation为app模块
            animation.transition(ref, {
                styles: {
                    transform: `translateX(${x}px)`
                },
                duration
            })
            /* eslint-enable */
            // #endif
        },
        // 点击某一个标签
        clickHandler(item, index) {
            // 因为标签可能为disabled状态，所以click是一定会发出的，但是change事件是需要可用的状态才发出
            this.$emit('click', {
                ...item,
                index
            })
            // 如果disabled状态，返回
            if (item.disabled) { return }
            this.innerCurrent = index
            this.resize()
            this.$emit('change', {
                ...item,
                index
            })
        },
        init() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve()
                }, 30)
            }).then(() => {
                this.resize()
            })
                
        },
        setScrollLeft() {
            // 当前活动tab的布局信息，有tab菜单的width和left(为元素左边界到父元素左边界的距离)等信息
            const tabRect = this.list[this.innerCurrent]
            // 累加得到当前item到左边的距离
            const offsetLeft = this.list
                .slice(0, this.innerCurrent)
                .reduce((total, curr) => {
                    return total + curr.rect.width
                }, 0)
            // 此处为屏幕宽度
            const windowWidth = uni.getSystemInfoSync().windowWidth
            // 将活动的tabs-item移动到屏幕正中间，实际上是对scroll-view的移动
            let scrollLeft = offsetLeft - (this.tabsRect.width - tabRect.rect.width) / 2 - (windowWidth - this.tabsRect
                .right) / 2 + this.tabsRect.left / 2
            // 这里做一个限制，限制scrollLeft的最大值为整个scroll-view宽度减去tabs组件的宽度
            scrollLeft = Math.min(scrollLeft, this.scrollViewWidth - this.tabsRect.width)
            this.scrollLeft = Math.max(0, scrollLeft)
        },
        // 获取所有标签的尺寸
        resize() {
            // 如果不存在list，则不处理
            if (this.list.length === 0) {
                return 
            }
            Promise.all([this.getTabsRect(), this.getAllItemRect()]).then(([tabsRect, itemRect = []]) => {
                this.tabsRect = tabsRect
                this.scrollViewWidth = 0
                itemRect.forEach((item, index) => {
                    // 计算scroll-view的宽度，这里
                    this.scrollViewWidth += item.width
                    // 另外计算每一个item的中心点X轴坐标
                    /* eslint-disable */
                    this.list[index].rect = item
                     /* eslint-disable */
                })
                // 获取了tabs的尺寸之后，设置滑块的位置
                this.setLineLeft()
                this.setScrollLeft()
            })
        },
        // 获取导航菜单的尺寸
        getTabsRect() {
            return new Promise(resolve => {
                this.queryRect('tabs__wrapper__scroll-view').then(size => resolve(size))
            })
        },
        // 获取所有标签的尺寸
        getAllItemRect() {
            return new Promise(resolve => {
                const promiseAllArr = this.list.map((item, index) => this.queryRect(
                    `tabs__wrapper__nav__item-${index}`, true))
                Promise.all(promiseAllArr).then(sizes => resolve(sizes))
            })
        },
        // 获取各个标签的尺寸
        queryRect(el, item) {
            // #ifndef APP-NVUE
            // $uGetRect为uView自带的节点查询简化方法，详见文档介绍：https://www.uviewui.com/js/getRect.html
            // 组件内部一般用this.$uGetRect，对外的为uni.getRect，二者功能一致，名称不同
            return new Promise(resolve => {
                this.$uGetRect(`.${el}`).then(size => {
                    resolve(size)
                })
            })
            // #endif

            // #ifdef APP-NVUE 
            // nvue下，使用dom模块查询元素高度
            // 返回一个promise，让调用此方法的主体能使用then回调
            /* eslint-disable */
            return new Promise(resolve => {
                dom.getComponentRect(item ? this.$refs[el][0] : this.$refs[el], res => {
                    resolve(res.size)
                })
            })
            /* eslint-disable */
            // #endif
        }
    }
}
</script>

<style lang="scss" scoped>
    .tabs {

        &__wrapper {
            display: flex;
            align-items: center;

            &__scroll-view-wrapper {
                flex: 1;
                /* #ifndef APP-NVUE */
                overflow: auto hidden;
                /* #endif */
            }

            &__scroll-view {
                display: flex;
                flex: 1;
            }

            &__nav {
                display: flex;
                position: relative;

                &__item {
                    padding: 0 11px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex: 1;

                    &--disabled {
                        /* #ifndef APP-NVUE */
                        cursor: not-allowed;
                        /* #endif */
                    }
                }

                &__line {
                    position: absolute;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition-property: transform;
                    transition-duration: 300ms;
                }
            }
        }
    }

    .tabs__wrapper__nav {
        > view:last-child {
            .right-cate-con-box {
                border: none !important;
            }
        }

        .tabs__wrapper__nav__item {
            padding: 0 !important;
        }
    }

    .right-cate-con-box {
        width: 100%;
        position: relative;
        height: 76rpx;
        text-align: center;
        font-size: 28rpx;
        color: #222;
        background-color: #fff;
        border-right: 2px solid #eff2f5;

        &.active {
            color: #fff;
            background-color: #f30300;
            border-right: none;
        }

        .oneRow {
            width: 100%;
            height: 100%;
        }
        .twoRow {
            width: 100%;
            height: 100%;
            view:first-child{
                font-size: 32rpx;
                line-height:32rpx;
            }
            .distanceTime {
                line-height:32rpx;
                font-size: 20rpx;
                .text1 {
                    vertical-align: text-bottom;
                }
                .text2 {
                    padding-left: 6rpx;
                    font-size: 26rpx;
                }
            }
        }
    }
</style>
