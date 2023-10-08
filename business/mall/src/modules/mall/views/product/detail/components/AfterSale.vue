<template>
    <div class="after-sale">
        <DetailTitle titleName="包装清单"></DetailTitle>
        <div class="content" v-html="goodsDetailsObj.wareQD || '---'"></div>
    </div>
</template>
<script>
const DetailTitle = ()=>import('./DetailTitle.vue');
export default {
    name: 'AfterSale',
    components:{
        DetailTitle
    },
    props:{
        //传递的商品详情
        goodsDetailsObj:{
            type: Object,
            required: true,
            default(){
                return {}
            }
        }
    },
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.content{
    color: @third-text-color;
    font-size: 0.24rem;
}
</style>