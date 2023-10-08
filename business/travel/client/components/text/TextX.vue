<template>
    <div class="bp_textWrap" :class="{noLeftPadding:noLeftPadding,noRightPadding:noRightPadding,allLinePointer:lineClick}">
        <div class="textLeft" :style="{width: labelWidth}">{{label}}<span v-if="isMustFill" class="redStart">*</span></div>
        <div class="textMid">
            <input class="textInput" :class="{isRightAlign:isRightAlign}" type="text" :placeholder="placeholder" :maxlength="maxlength" @input="$emit('input',value)" @focus="$emit('focus','')" :readonly="readonly" v-model="value"/>
        </div>
        <div class="textRight" v-if="arrhaveitem(rightButType,rightButTypeList)">
            <div class="textRightBut cursorp" :class="rightButType" @click="$emit('rightButtonDo','')"></div>
        </div>
    </div>
</template>
<script>
export default {
    directives:{
    },
    components:{
    },
    props:{
        value: {//双向绑定的值
            type: String,
            default:''
        },
        placeholder:{
            type:String,
            default:''
        },
        label:{
            type:String,
            default:''
        },
        maxlength:{
            type:Number,
            default:200
        },
        readonly:{
            type:Boolean,
            default:false
        },
        noLeftPadding:{
            type:Boolean,
            default:false
        },
        noRightPadding:{
            type:Boolean,
            default:false
        },
        rightButType:{//右侧按钮样式
            type:String,
            default:''
        },
        isMustFill:{//是否显示lable红色*
            type:Boolean,
            default:false
        },
        isRightAlign:{//是否右对齐
            type:Boolean,
            default:false
        },
        labelWidth:{//label宽度
            type:String,
            default:'1.8rem'
        },
        lineClick:{//是否整行显示手型样式*
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            rightButTypeList:[
                'connect',
                'arrow'
            ]
        };
    },
    created(){
    },
    mounted(){
    },
    methods:{
        /**
         * 数组是否包含元素
         * @item 元素
         * @arr 数组
         */
        arrhaveitem(item,arr){
            var isInArr = false;
            var len = arr.length;
            for (var i=0;i<len;i++){
                if (arr[i] == item){
                    isInArr = true;
                    break;
                }
            }
            return isInArr;
        }
    }
}
</script>
<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.bp_textWrap {
    .flex-box();
    .align-items(center);
    background: @sub-background-color;
    font-size: 0.32rem;
    color: @text-color;
    padding: 0 0.3rem;
    &.noLeftPadding{
        padding-left: 0;
    }
    &.noRightPadding{
        padding-left: 0;
    }
    .textLeft{
        padding: 0.25rem 0;
        width: 1.8rem;
        padding-right: 0.1rem;
        color: var(--secondaryTextColor);
        .redStart{
            color: @danger-color;
        }
    }
    .textMid{
        padding: 0.25rem 0;
        .flex(1);
        .textInput{
            width: 100%;
            &.isRightAlign{
                text-align: right;
            }
        }
    }
    .textRight{
        width: 0.6rem;
        .textRightBut{
            width: 0.6rem;
            height: 0.6rem;
            &.connect{
                background: url(./img/connect.png) no-repeat right;
                background-size: 0.45rem 0.45rem;
                &:active{
                    background: url(./img/connect_pre.png) no-repeat right;
                    background-size: 0.45rem 0.45rem;
                }
            }
            &.arrow{
                background: url(./img/icon_right_o.png) no-repeat right;
                background-size: 0.16rem 0.3rem;
            }
            
        }
        
    }
    &.allLinePointer{
        cursor: pointer;
        .textMid{
            .textInput{
                cursor: pointer;
            }
        }    
    }

}

</style>