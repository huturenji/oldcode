<template>
    <!-- 生成行程失败跳转的页面 -->
    <div class='operation-fail'>
        <div class="approve-content">
            <img src="~assets/img/trip/icon_work_refuse.svg">
            <p class="tips">生成行程失败</p>
        </div> 
        <div @click="$emit('operationFailConfirm')" class="confirmBtn">
            确定
        </div>
      
    </div>
</template>

<script>
export default {
    components: {
           
    },
    watch:{
            
    },
    data(){
        return {
               
        }
    },
    props:{
            
    },
     
    methods:{
            
    }
}
</script>

<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
 .operation-fail{
     .approve-content{
        box-sizing: border-box;
        background-color: @sub-background-color;
        padding: 1rem 0 1.6rem 0;
        text-align: center;
         img{
             width: 1rem;
             height: auto;
         }
        .tips{
            font-size: .34rem;
            margin-top: .29rem;
        }
        
     }
    .confirmBtn{
        width: 92%;
        height: 0.88rem;
        line-height: 0.88rem;
        text-align: center;
        color: @sub-background-color;
        background-color: @theme-color;
        cursor: pointer;
        border-radius:.2rem;
        margin: 1rem auto;
        font-size:0.3rem;
        &:active{
            opacity: .8;
        }
    }
 }
</style>