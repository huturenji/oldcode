<template>
    <!-- 顶部回退的组件 -->
    <div v-transfer-dom>
        <div v-if="show" class="top-title fixed-dom-part">
            <div @click="changeEdit" class="edit">{{!!editFlag ? '编辑' : '完成'}}</div>
        </div>
    </div>
</template>
<script>
import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
export default {
    props:{
        show:{ //是否需要编辑
            type: Boolean,
            default:false
        }
    },
    data(){
        return {
            editFlag: true, //编辑 true  完成 false
        }
    },
    methods: {
        /***
         * 点击操作的按钮 编辑或者完成
         */
       changeEdit(){
           this.$emit('changeEdit', this.editFlag);
           this.editFlag = !this.editFlag;
       },
    }
}
</script>
<style lang="less" scoped>
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.top-title{
    position: fixed;
    z-index: 10;
    width: 100%;
    height: 0.82rem;
    line-height: 0.82rem;
    text-align: center;
    font-size: 0.3rem;
    font-weight: bold;
    cursor: pointer;
    color: #000;
    top: @title-bar-height;
    left: 0;
    right: 0;
    background: @background-color;
    .edit{
        color: @secondary-text-color;
        font-size: 0.28rem;
        position: absolute;
        right: 0.2rem;
        top: 0;
        font-weight: normal;
    }
}
   
</style>