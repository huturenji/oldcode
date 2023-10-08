<template>
    <div>
        <Icon type='service' size='1.2' class='icon icon-service'/>
        <div class='taxTips'>
            <div>退票申请已提交，我们会尽快处理，</div>
            <div>请您耐心等待</div>
        </div>

        <div class="buttonWrap">
            <SnButton type="primary"  @click.native="$emit('close')">确定</SnButton>
        </div>
    </div>
</template>

<script>
const SnButton = ()=>import('components/button');
const Icon = ()=>import('components/icon');
export default {
    components: {
        SnButton,Icon
    },
    props: {
    },
    data() {
        return {

        }
    },
    created() {

    },
    mounted() { },
    methods: {
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/common/index.less';
    .icon-service {
        margin: 1.75rem auto 0;
        fill: @success-color;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
    }

    .buttonWrap {
        width: 100%;
        padding: 0 @white-space;
        .sn-button{
            max-width: initial;
        }
    }

    .taxTips {
        display: block;
        text-align: center;
        font-size: .32rem;
        width: 80%;
        margin: .84rem auto 1rem;
        color: @third-text-color;
    }

</style>