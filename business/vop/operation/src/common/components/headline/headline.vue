<template>
    <div class="headline">
        <div class="infoName">
            {{ headTxt }}
        </div>
        <slot name="component"></slot>
    </div>
</template>

<script>
export default {
    props: {
        headTxt: {
            type: String,
            default: ""
        }
    },
    created() {},
    mounted() {},
    methods: {}
};
</script>

<style scoped lang="less">
.headline {
    padding: 20px 0 5px 0;
    border-bottom: 1px solid #dcdee2;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .infoName {
        color: #333333;
        font-size: 14px;
        font-weight: 800px;
    }
}
</style>