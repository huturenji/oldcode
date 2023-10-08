<template>
    <!-- 顶部的组件 -->
    <div class="top-tips">
        <div>
           <Icon type='correct_service' size=".26"/>
           <span>无需垫付</span>
        </div>
        <div>
           <Icon type='icon_mall_fapiaobaozhang' size=".26"/>
           <span>发票保障</span>
        </div>
        <div>
           <Icon type='correct_service' size=".26"/>
           <span>合规透明</span>
        </div>
    </div>
</template>
<script>
const Icon = ()=>import('common/components/base/Icon');
export default {
    props:{

    },
    components:{
        Icon
    },
    data(){
        return {

        }
    },
    methods: {

    }
}
</script>
<style lang="less" scoped>
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.top-tips{
    width: 100%;
    display: flex;
    align-items: center;
    height: 0.6rem;
    div{
        width: 33.33%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    span{
        font-size: 0.24rem;
        color: @third-text-color;
        margin-left: 0.03rem;
    }
}
</style>
