<template>
    <u-tabs
        ref="proxyTabs" 
        :lineHeight="lineHeightComputed"
        :lineColor="lineColorComputed"
        :duration="duration"
        :list="list"
        :activeStyle="activeStyle"
        :inactiveStyle="inactiveStyle"
        :lineWidth="lineWidth"
        :lineBgSize="lineBgSize"
        :itemStyle="itemStyle"
        :scrollable="scrollable"
        :current="current"
        :keyName="keyName"
        @change="change"                      
    >
        <template #left>
            <slot name="left"></slot>
        </template>
        <template #right>
            <slot name="right"></slot>
        </template>
    </u-tabs> 
</template>
<script>

export default {
    name: 'proxy_tabs',
    props:{
        lineHeight: {
            type: [String, Number],
            default: 3
        },
        customLine: {
            type: Boolean,
            default: false
        },
        lineColor: {
            type: String,
            default: '#f30300'
        },
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
        // 菜单选择中时的样式
        activeStyle: {
            type: [String, Object],
            default: () => ({
                color: '#303133'
            })
        },
        // 菜单非选中时的样式
        inactiveStyle: {
            type: [String, Object],
            default: () => ({
                color: '#606266'
            })
        },
        // 滑块长度
        lineWidth: {
            type: [String, Number],
            default: 20
        },
        // 滑块背景显示大小，当滑块背景设置为图片时使用
        lineBgSize: {
            type: String,
            default: 'cover'
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
        // 默认读取的键名
        keyName: {
            type: String,
            default: 'name'
        }
    },
    data(){
        return {
            lineHeightComputed: 0,
            lineBg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_bnj_xuanzhong.png' //默认导航下侧的自定义图片
        }
    },
    mounted(){
        // 解决tab导航下侧的滑动线条 先在最左侧然后又居中的问题。因为uview-ui实现的有个30ms的休眠 => uni.$u.sleep().then(() => {this.resize()}
        // 目前借助lineHeight属性来实现
        setTimeout(() => {
            this.lineHeightComputed = this.lineHeight;
        }, 32)
    },
    computed: {
        lineColorComputed(){
            let style = this.lineColor || '#f30300';
            if (this.customLine){
                style = `url(${this.lineBg}) 100% 100%`
            }
            return style;
        }
    },
    methods:{
        async change(item){
            await this.$nextTick();
            this.$refs?.proxyTabs?.resize?.();
            this.$emit('tabChange', item);
        }
    }
}
</script>
<style lang='scss' scoped>

</style>