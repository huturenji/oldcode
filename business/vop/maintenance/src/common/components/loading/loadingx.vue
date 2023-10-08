<template>
    <div
        class="loadingXBack"
        v-if="isSHow"
    >
        <span class="loadingXContent">{{ tipsText }}</span>
    </div>
</template>

<script>
export default {
    name: "Loading",
    data() {
        return {
            tipsText: "加载中...",
            isSHow: false
        };
    },
    created() {},
    mounted() {},
    methods: {}
};
</script>
<style scoped lang="less">
.loadingXBack {
    text-align: center;
    position: fixed;
    z-index: 1498;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 18px;
    background: #ffffff8f;
}

.loadingXContent {
    z-index: 1499;
    margin-top: 50vh;
    padding-left: 50px;
    color: #333333;
    display: inline-block;
    background: url(./img/loading.gif) no-repeat left;
    background-size: contain;
}
</style>
