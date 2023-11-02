<template>
    <div
        class="namedcomp"
        :style="{alignItems:(long ? 'baseline':'center')}"
    >
        <div
            class="compNameA"
            :class="{'require':required,'long':long}"
            v-if="compName"
        >
            {{ compName + "：" }}
        </div>

        <slot name="component"></slot>
    </div>
</template>

<script>
export default {
    props: {
        compName: {
            type: String,
            default: ""
        },
        required: {
            type: Boolean,
            default: false
        },
        long: {
            type: Boolean,
            default: false
        }
    },
    created() {},
    mounted() {},
    methods: {}
};
</script>

<style scoped lang="less">
.namedcomp {
    display: flex;
    padding: 5px;
    word-break: break-all;
    .compNameA {
        margin-right: 15px;
        flex: 0 0 110px;
        text-align: right;
    }
    .long {
        flex: 0 0 170px;
    }
    .require:before {
        content: "*";
        color: red;
        font-size: 12px;
        margin-right: 6px;
    }
}
</style>