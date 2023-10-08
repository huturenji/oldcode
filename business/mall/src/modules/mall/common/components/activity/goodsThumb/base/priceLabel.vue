<template>
    <div class="price-label num-font" v-if='amount!=null'>
        <i class="rmb" :class='{"camelCase": camelCase}'>&yen;</i><span class='int'>{{priceInt(amount)}}</span><span class='float'>{{priceFloat(amount, toFixed)}}</span>
    </div>
</template>
<script>
import extendUtils from 'common/lib/utils';
export default {
    name:'price-label',
    props:{
        format: {
            type: Boolean,
            default: true,
        },
        camelCase:{
            type: Boolean,
            default: true,
        },
        amount:{
            required: true,
        },
        toFixed: {
            type: String,
            default: '2',
        }
    },
    methods: {
        /**
         * 截取整数位
         */
        priceInt(val){
            let result = this.priceIntFun(val);
            if(this.format){
                result = this.toThousands(result);
            }
            return result;
        },

        priceIntFun(val){
            return new Number(val).toFloor(0);
        },

        priceFloatFun(val, toFixed=2){
            //此情况下无意义
            if(toFixed<=0){
                return '';
            }
            let numStr = new String(val);
            let array = numStr.split('.');
            let point = array.length>1 ? array[1] : '';
            //小数位如果比补零的个数小，则直接补零
            if(point.length<toFixed){
                let result = '.' + point;
                for(let i = 0; i < toFixed-point.length; i++){
                    result += '0'
                }
                return result;
            }else if(point.length==toFixed){
                return '.' + point;
            }else{
                //否则用去尾法处理小数位
                let num = new Number(val).toFloor(toFixed);
                return '.' + new String(num).split('.')[1];
            }
        },

        /**
         * 截取小数位
         */
        priceFloat(val, toFixed){
            return this.priceFloatFun(val, toFixed);
        },
        /**
         * 格式化数字（整数位） 比如1,000,000
         */
        toThousands(num) {
            var num = (num || 0).toString(), result = '';
            while (num.length > 3) {
                result = ',' + num.slice(-3) + result;
                num = num.slice(0, num.length - 3);
            }
            if (num) { result = num + result; }
            return result;
        }
    },
}
</script>
<style scoped lang="less">
// 屏幕尺寸
@screen-sm: 550px;
@screen-md: 768px;
@screen-lg: 1080px;
@font-face{
    font-family: 'Alibaba Font';
    src: url('./font/sinosunnumber-bold.ttf');
}
.num-font{
    font-family: 'Alibaba Font', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft Yahei', '宋体', Tahoma, Arial, Helvetica, STHeiti, sans-serif;
}
.price-label{
    color: inherit;
    font-size: inherit;
    display: inline-block;
    .int{
        font-weight: 400;

    }
    .camelCase{
        font-size: .8em;        
    }
}
//------------ 移动端通用样式 -------------
@media screen and (max-width: @screen-sm) {
    .price-label .camelCase{
         margin-right: .05rem;
    }
}
</style>