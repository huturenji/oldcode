<template>
<div class="empty-page">
    <div class="empty-box">
        <img :src="BMallConfig.DEFAULT_PAGE.IMG[emptyImg]">
        <p class="tips">
            <span>{{tips}}</span>
            <!-- 插槽用来处理无数据刷新等相关的操作，需要业务测自己处理 -->
            <slot />
        </p>
    </div>
</div>
</template>
<script>
export default {
    props:{
        //空白页面显示的文字内容
        tips:{
            type:String,
            default:'暂无内容'
        },
        emptyImg:{ //config.js 里面配置的图片名
            type:String,
            default:'DEFAULT_EMPTY_IMG'
        }
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
.empty-page{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .empty-box{
        text-align: center;
        .tips{
            font-size: 0.3rem;
            color: #c2c2c2;
            margin-top: 0.1rem;
        }
    }
    img{
        width: 2.56rem;
        height: auto;
    }
}
</style>