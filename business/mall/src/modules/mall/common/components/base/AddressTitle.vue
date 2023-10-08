<template>
    <div class="AddressTitle-container" v-if='showTitle'  :class="{'showBottomBorder':showBottomBorder}">
        <Icon class='icon-btn' :type='iconBtnType' @click='iconBtnCallback' size='.32' v-if='showIconBtn'/>
        <span class='address-title'>{{title}}</span>
        <div v-if="showCloseIcon" class="close-icon" @click='closePopup'>
        </div>
    </div>
</template>
<script>
import Icon from 'common/components/base/Icon';
export default {
    components:{
        Icon
    },
    props:{
        iconBtnType: {
            type: String,
            default: 'icon_common_leftarrow'
        },
        showIconBtn: {
            type: Boolean,
            default: false,
        },
        title:{
            type:String,
            default:'选择区域'
        },
        showTitle:{
            type:Boolean,
            default:true
        },
        showBottomBorder:{
            type:Boolean,
            default:false
        },
        showCloseIcon:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return {
           
        }

    },
    methods:{
        //关闭父级弹窗组件
        closePopup(){
            this.$emit('closePopup')
        },

        /**
         * icon按钮的回调函数
         */
        iconBtnCallback(){
            this.$emit('iconBtnCallback')
        }
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
    .AddressTitle-container{
        position: relative;
        overflow: hidden;
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #333;
        background: #fff;
        span{
            font-size: 0.32rem;
            font-weight: 600;
        }

        .icon-btn{
            position: absolute;
            left: .3rem;
            top: 50%;
            transform: translateY(-50%);
            color: #999;
        }

        .close-icon{
            position: absolute;
            top:50%;
            right: 0.3rem;
            transform: translateY(-50%);
            width: 0.4rem;
            height: 0.4rem;
            background: url(~themes/default/img/order/afterSale/icon_common_close.svg) no-repeat;
            background-size: 100% 100%;
            z-index: 10;
        }
    }
    .showBottomBorder{
        &:after{
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 1px;
            border-bottom: 1px solid @border-color-base;
            transform: scaleY(0.5);
            -webkit-transform: scaleY(0.5);
        }
    }
</style>