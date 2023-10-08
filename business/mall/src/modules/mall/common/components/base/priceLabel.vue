<template>
    <div class="price-label num-font" v-if='amount!=null'>
        <i class="rmb" :class='{"camelCase": camelCase}'>&yen;</i><span class='int'>{{priceInt(amount)}}</span><span class='float' :class="{floatMin: floatMin}">{{priceFloat(amount, toFixed)}}</span>
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
        // 保留两位数字的后两位是否需要小字体展示
        floatMin:{
            type: Boolean,
            default: false,
        },
        amount:{
            required: true,
        },
        toFixed: {
            type: String,
            default: '2',
        },
     
    },
    methods: {
        /**
         * 截取整数位
         */
        priceInt(val){
            let result = extendUtils.priceInt(val);
            if(this.format){
                result = this.toThousands(result);
            }
            return result;
        },
        /**
         * 截取小数位
         */
        priceFloat(val, toFixed){
            return extendUtils.priceFloat(val, toFixed);
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
.price-label{
    color: inherit;
    font-size: inherit;
    display: inline-block;
    .int{
        font-weight: 400;
        margin-left: 0.05rem;
    }
    .camelCase,.floatMin{
        font-size: .8em;
    }
}
</style>