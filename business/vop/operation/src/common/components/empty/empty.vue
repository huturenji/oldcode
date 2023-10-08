<template>
    <div
        class="noInfo"
        :class="{top:'top'==styleType}"
    >
        {{ tipsText }}
    </div>
</template>
<script>
export default {
    components: {
    },
    props:{
        tipsText:{
            type:String,
            default:'暂无数据'
        },
        styleType:{
            type:String,
            default:''
        }
    },
    data() {
        return {

        }
    },
    created() {

    },
    mounted() {
    },
    methods: {

    }
}
</script>
<style scoped lang="less">
    .noInfo{
        // margin-top: 1.3rem;
        height: 0.5rem;
        padding-top: 3rem;
        text-align: center;
        font-size: 0.32rem;
        line-height: 0.42rem;
        color: #b2b2b2;
        background: url(./img/empty.png) no-repeat center;
        background-size: 1.62rem 1.84rem;
    }
    .noInfo.top{
        margin-top: 0.3rem;
        padding-top: 2.09rem;
        background: url(./img/empty.png) no-repeat top;
        background-size: 1.62rem 1.84rem;
    }
</style>

