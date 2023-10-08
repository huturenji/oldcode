<template>
    <view :style="[styles, { backgroundColor: decoItem.props.color, height: decoItem.props.text + 'px' }]">
    </view>
</template>

<script>
import { skipTo } from "@/utils/common.js";
import indexMixin from "@/common/components/decorate/common/mixin/index";
import { isNotEmpty } from "@/utils/common.js";
export default {
    name: "deco-fix-blank",
    mixins: [indexMixin],
    components: {},
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => { }
        }
    },
    watch: {
        /**
         * 监听到装修数据变化时，开始绘制整体框架
         */
        decoItem: {
            handler(val, oldVal) {
                if (isNotEmpty(val) && JSON.stringify(val) != JSON.stringify(oldVal)) {
                    this.initBackgroud(val)
                    this.initSpace(val)
                }
            },
            deep: true,
            immediate: true
        },
    },

    data() {
        return {};
    },
    methods: {
        // 相关跳转
        skipTo(item) {
            skipTo(item, this);
        }
    }
};
</script>

<style lang="scss" scoped>

</style>