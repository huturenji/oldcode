<template>
  <div class="step-wrap">
    <ul class="steps">
        <li class="steps-item" v-for="(item,index) in SetData" :key="index" :class="{'active':Steps===index}">
            <Icon :type='Steps>=index ? "icon_mall_checkbox_sel" : "icon_mall_checkbox_nor"' size='.48'/>
            <span :class="Steps>=index?'active':''">{{item}}</span>
        </li>
    </ul>
  </div>
</template>
<script>
import Icon from 'common/components/base/Icon';
export default {
    components: {
        Icon
    },
    props:{
        //步骤个数  限制为3步   超出可能导致UI混乱
        SetData:{
            type:Array,
            default:()=>['订单下单','订单完成','发票开具']
        },
        //表示当前进行到的流程的index，与SetData数组的下标同步
        Steps:{
            type:Number,
            default:0
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
.step-wrap{
    max-width: 270px;
    .steps {
        position: relative;
        display: flex;
        justify-content: space-between;
        .steps-item{
            list-style-type: none;
            font-size: 0.26rem;
            text-align: center;
            position: relative;
            float: left;
            min-width: 1.05rem;
            .active{
                color: @text-color;
            }
            .icon{
                content: '';
                display: block;
                line-height: 0.48rem;
                border-radius: 0.48rem;
                color: @theme-color;
                text-align: center;
                font-weight: 700;
                margin: 0 auto 0.24rem auto;
            }
        }
    }
    /*连接线*/
    .steps li ~ li:after {
        content: "";
        width: 100%;
        height: 2px;
        border-top: 1px solid @theme-color;
        position: absolute;
        left: -100%;
        top: 0.24rem;
        z-index: 1;
    }

    /*将当前/完成步骤之后的数字及连接线变灰*/
    .steps li.active ~ li:before{
        background: url(~themes/default/img/icon/icon_mall_checkbox_nor.svg) no-repeat;
        background-size: cover;
    }
    .steps li.active ~ li:after {
        border-top: 1px dashed @third-text-color;
    }
}

   
</style>