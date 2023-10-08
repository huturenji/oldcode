<template>
<view class="u-tabs">
    <view class="u-tabs__wrapper">
        <slot name="left" />
        <view class="u-tabs__wrapper__scroll-view-wrapper">
            <scroll-view
                :scroll-y="scrollable"
                :scroll-top="scrollTop"
                scroll-with-animation
                class="u-tabs__wrapper__scroll-view"
                :show-scrollbar="false"
                ref="u-tabs__wrapper__scroll-view"
            >
                <view
                    class="u-tabs__wrapper__nav"
                    ref="u-tabs__wrapper__nav"
                >
                    <view
                        class="u-tabs__wrapper__nav__item"
                        v-for="(item, index) in list"
                        :key="index"
                        @tap="clickHandler(item, index)"
                        :ref="`u-tabs__wrapper__nav__item-${index}`"
                        :style="[$u.addStyle(itemStyle), {flex: scrollable ? '' : 1}]"
                        :class="[`u-tabs__wrapper__nav__item-${index}`, item.disabled && 'u-tabs__wrapper__nav__item--disabled']"
                    >
                        <!-- <text
                            :class="[item.disabled && 'u-tabs__wrapper__nav__item__text--disabled']"
                            class="u-tabs__wrapper__nav__item__text"
                            :style="[textStyle(index)]"
                        >{{ item[keyName] }}</text> -->
                        <slot name="content" :navItem="{item:item,index:index}"></slot>
                        <u-badge
                            :show="!!(item.badge && (item.badge.show || item.badge.isDot || item.badge.value))"
                            :isDot="item.badge && item.badge.isDot || propsBadge.isDot"
                            :value="item.badge && item.badge.value || propsBadge.value"
                            :max="item.badge && item.badge.max || propsBadge.max"
                            :type="item.badge && item.badge.type || propsBadge.type"
                            :showZero="item.badge && item.badge.showZero || propsBadge.showZero"
                            :bgColor="item.badge && item.badge.bgColor || propsBadge.bgColor"
                            :color="item.badge && item.badge.color || propsBadge.color"
                            :shape="item.badge && item.badge.shape || propsBadge.shape"
                            :numberType="item.badge && item.badge.numberType || propsBadge.numberType"
                            :inverted="item.badge && item.badge.inverted || propsBadge.inverted"
                            customStyle="margin-left: 4px;"
                        ></u-badge>
                    </view>
                    <!-- #ifdef APP-NVUE -->
                    <view
                        class="u-tabs__wrapper__nav__line"
                        ref="u-tabs__wrapper__nav__line"
                        :style="[{
                                width: $u.addUnit(lineWidth),
                                height: $u.addUnit(lineHeight),
                                background: lineColor,
                                backgroundSize: lineBgSize,
                            }]"
                    >
                        <!-- #endif -->
                        <!-- #ifndef APP-NVUE -->
                        <view
                            class="u-tabs__wrapper__nav__line"
                            ref="u-tabs__wrapper__nav__line"
                            :style="[{
                                    width: $u.addUnit(lineWidth),
                                    transform: `translateY(${lineOffsetTop}px)`,
                                    transitionDuration: `${firstTime ? 0 : duration}ms`,
                                    height: $u.addUnit(lineHeight),
                                    background: lineColor,
                                    backgroundSize: lineBgSize,
                                }]"
                        >
                            <!-- #endif -->
                        </view>
                    </view>
            </scroll-view>
        </view>
        <slot name="right" />
    </view>
</view>
</template>

<script>
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation')
const dom = uni.requireNativePlugin('dom')
// #endif
// import props from './props.js';
export default {
    name: 'u-tabs',
    // mixins: [uni.$u.mpMixin, uni.$u.mixin],
    data() {
        return {
            firstTime: true,
            scrollTop: 0,
            scrollViewHeight: 0,
            lineOffsetTop: 0,
            tabsRect: {
                top: 0
            },
            innerCurrent: 0,
            moving: false
        }
    },
    props: {
        // 滑块的移动过渡时间，单位ms
        duration: {
            type: Number,
            default: uni.$u.props.tabs.duration
        },
        // tabs标签数组
        list: {
            type: Array,
            default: uni.$u.props.tabs.list
        },
        // 滑块颜色
        lineColor: {
            type: String,
            default: uni.$u.props.tabs.lineColor
        },
        // 菜单选择中时的样式
        activeStyle: {
            type: [String, Object],
            default: uni.$u.props.tabs.activeStyle
        },
        // 菜单非选中时的样式
        inactiveStyle: {
            type: [String, Object],
            default: uni.$u.props.tabs.inactiveStyle
        },
        // 滑块长度
        lineWidth: {
            type: [String, Number],
            default: uni.$u.props.tabs.lineWidth
        },
        // 滑块高度
        lineHeight: {
            type: [String, Number],
            default: uni.$u.props.tabs.lineHeight
        },
        // 滑块背景显示大小，当滑块背景设置为图片时使用
        lineBgSize: {
            type: String,
            default: uni.$u.props.tabs.lineBgSize
        },
        // 菜单item的样式
        itemStyle: {
            type: [String, Object],
            default: uni.$u.props.tabs.itemStyle
        },
        // 菜单是否可滚动
        scrollable: {
            type: Boolean,
            default: uni.$u.props.tabs.scrollable
        },
        // 当前选中标签的索引
        current: {
            type: [Number, String],
            default: uni.$u.props.tabs.current
        },
        // 默认读取的键名
        keyName: {
            type: String,
            default: uni.$u.props.tabs.keyName
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
        }
    },
    computed: {
        textStyle() {
            return index => {
                const style = {}
                // 取当期是否激活的样式
                const customeStyle = index === this.innerCurrent ? uni.$u.addStyle(this.activeStyle) : uni.$u.addStyle(this.inactiveStyle)
                // 如果当前菜单被禁用，则加上对应颜色，需要在此做处理，是因为nvue下，无法在style样式中通过!import覆盖标签的内联样式
                if (this.list[index].disabled) {
                    style.color = '#c8c9cc'
                }
                return uni.$u.deepMerge(customeStyle, style)
            }
        },
        propsBadge() {
            return uni.$u.props.badge
        }
    },
    async mounted() {
        this.init()
    },
    methods: {
        setLineLeft() {
            const tabItem = this.list[this.innerCurrent];
            if (!tabItem) {
                return;
            }
            // 获取滑块该移动的位置
            let lineOffsetTop = this.list
                .slice(0, this.innerCurrent)
                .reduce((total, curr) => total + curr.rect.height, 0);
            // 获取下划线的数值px表示法
            const lineHeight = uni.$u.getPx(this.lineHeight);
            this.lineOffsetTop = lineOffsetTop + (tabItem.rect.height - lineHeight) / 2
            // #ifdef APP-NVUE
            // 第一次移动滑块，无需过渡时间
            this.animation(this.lineOffsetTop, this.firstTime ? 0 : parseInt(this.duration))
            // #endif

            // 如果是第一次执行此方法，让滑块在初始化时，瞬间滑动到第一个tab item的中间
            // 这里需要一个定时器，因为在非nvue下，是直接通过style绑定过渡时间，需要等其过渡完成后，再设置为false(非第一次移动滑块)
            if (this.firstTime) {
                setTimeout(() => {
                    this.firstTime = false
                }, 10);
            }
        },
        // nvue下设置滑块的位置
        animation(y, duration = 0) {
            // #ifdef APP-NVUE
            const ref = this.$refs['u-tabs__wrapper__nav__line']
            animation.transition(ref, {
                styles: {
                    transform: `translateY(${y}px)`
                },
                duration
            })
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
            this.$nextTick(()=>{
                this.resize()
            })
            
            this.$emit('change', {
                ...item,
                index
            })
        },
        init() {
            uni.$u.sleep().then(() => {
                this.resize()
            })
        },
        setScrollLeft() {
            // 当前活动tab的布局信息，有tab菜单的width和left(为元素左边界到父元素左边界的距离)等信息
            const tabRect = this.list[this.innerCurrent]
            // 累加得到当前item到上边的距离
            const offsetTop = this.list
                .slice(0, this.innerCurrent)
                .reduce((total, curr) => {
                    return total + curr.rect.height
                }, 0)
            // 此处为屏幕宽度
            // const windowHeight = uni.$u.sys().windowHeight
            // 将活动的tabs-item移动到屏幕正中间，实际上是对scroll-view的移动
            // this.tabsRect.height：整个固定的tab高度；tabRect.rect.height：当前tabItem高度；scrollViewHeight：整个scroll-view高度
            let scrollTop = offsetTop - (this.tabsRect.height - tabRect.rect.height) / 2
            // 这里做一个限制，限制scrollTop的最大值为整个scroll-view高度减去tabs组件的高度
            scrollTop = Math.min(scrollTop, this.scrollViewHeight - this.tabsRect.height)
            this.scrollTop = Math.max(0, scrollTop)
        },
        // 获取所有标签的尺寸
        resize() {
            // 如果不存在list，则不处理
            if (this.list.length === 0) {
                return
            }
            Promise.all([this.getTabsRect(), this.getAllItemRect()]).then(([tabsRect, itemRect = []]) => {
                this.tabsRect = tabsRect
                this.scrollViewHeight = 0
                itemRect.forEach((item, index) => {
                    // 计算scroll-view的宽度，这里
                    this.scrollViewHeight += item.height
                    // 另外计算每一个item的中心点X轴坐标
                    this.list[index].rect = item
                })
                // 获取了tabs的尺寸之后，设置滑块的位置
                this.setLineLeft()
                this.setScrollLeft()
            })
        },
        // 获取导航菜单的尺寸
        getTabsRect() {
            return new Promise(resolve => {
                this.queryRect('u-tabs__wrapper__scroll-view').then(size => resolve(size))
            })
        },
        // 获取所有标签的尺寸
        getAllItemRect() {
            return new Promise(resolve => {
                const promiseAllArr = this.list.map((item, index) => this.queryRect(
                    `u-tabs__wrapper__nav__item-${index}`, true))
                Promise.all(promiseAllArr).then(sizes => resolve(sizes))
            })
        },
        // 获取各个标签的尺寸
        queryRect(el, item) {
            // #ifndef APP-NVUE
            // $uGetRect为uView自带的节点查询简化方法，详见文档介绍：https://www.uviewui.com/js/getRect.html
            // 组件内部一般用this.$uGetRect，对外的为uni.$u.getRect，二者功能一致，名称不同
            return new Promise(resolve => {
                this.$uGetRect(`.${el}`).then(size => {
                    resolve(size)
                })
            })
            // #endif

            // #ifdef APP-NVUE
            // nvue下，使用dom模块查询元素高度
            // 返回一个promise，让调用此方法的主体能使用then回调
            // eslint-disable-next-line no-unreachable
            return new Promise(resolve => {
                dom.getComponentRect(item ? this.$refs[el][0] : this.$refs[el], res => {
                    resolve(res.size)
                })
            })
            // #endif
        }
    }
}
</script>

<style lang="scss" scoped>
view, scroll-view{
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    flex-grow: 0;
    flex-basis: auto;
    align-items: stretch;
    align-content: flex-start;
}
.u-tabs {
    height: 100%;
    width: 100%;
    justify-content: center;
    align-content: center;
    &__wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        // align-items: center;

        &__scroll-view-wrapper {
            width: 100%;
            flex: 1;
            flex-direction: column;
            /* #ifndef APP-NVUE */
            overflow: hidden auto;
            /* #endif */
        }

        &__scroll-view {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        &__nav {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            flex: 1;
            position: relative;

            &__item {
                width: 100%;
                text-align: center;
                padding: 0 11px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                &--disabled {
                    /* #ifndef APP-NVUE */
                    cursor: not-allowed;
                    /* #endif */
                }

                &__text {
                    font-size: 15px;
                    color: $u-content-color;
                    // writing-mode: vertical-lr;

                    &--disabled {
                        color: $u-disabled-color !important;
                    }
                }
            }

            &__line {
                width: 3px;
                background: $u-primary;
                height: 30px;
                position: absolute;
                right: 2px;
                // border-radius: 100px;
                transition-property: transform;
                transition-duration: 300ms;
            }
        }
    }
}
</style>
