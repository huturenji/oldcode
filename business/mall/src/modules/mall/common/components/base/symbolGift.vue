<template>
    <div class="detail-symbol" :style="styleColor">
        {{name}}
    </div>
</template>
<script>

export default {
    name: 'gift-symbol',
    components:{

    },
    computed: {
        styleColor(){
            return {
                'border': `1px solid ${this.color}`,
                'color': this.color
            }
        }
    },
    props:{
        //传递的商品详情
        name:{
            type: String,
            required: true,
        },
        //传递的文字和边框的颜色
        color:{
            type: String,
            default:'#ff4e3a'
        }
    },
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.detail-symbol{
    display: inline-block;
    min-width: .58rem;
    padding: 0 .08rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: .36rem;
    text-align: center;
    line-height: .36rem;
    border-radius: .08rem;
    
    font-size: .22rem;
}
</style>