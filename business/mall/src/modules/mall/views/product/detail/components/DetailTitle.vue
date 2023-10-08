<template>
    <div class="detail-title">
        <div class="line left"></div>
        <p>{{titleName}}</p>
        <div class="line right"></div>
    </div>
</template>
<script>
export default {
    props:{
        titleName:{
            type: String,
            required: true
        }
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.detail-title{
    padding: 0.05rem 0 0.3rem 0;
    text-align: center;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p{
        display: inline-block;
        padding: 0 0.2rem;
        text-align: center;
        color: @third-text-color;
        font-size: 0.24rem;
    }
    .line{
        flex: 1;
        height: 1px;
        background: @border-color-base;
        transform: scaleY(0.5);
        -webkit-transform: scaleY(0.5);
    }
}
</style>