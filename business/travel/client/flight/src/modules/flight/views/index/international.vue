<template>
<div>

    <div class='page-index-international'>
        <EmptyX type="developing" position="center" tipsText='程序小哥努力开发中，敬请期待...' />
    </div>
    <slot name= 'hotPhone'/>
</div>
</template>

<script>
import EmptyX from "components/empty/EmptyX.vue";
export default {
    components: {
        EmptyX
    },
    data() {
        return {
        };
    }
}
</script>
<style lang="less" scpoed>
    @import '~themes/default/styles/index/international.less';
</style>
