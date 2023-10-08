<template>
<!-- 价格区间的筛选模板 -->
<div class="filter-price-container">
    <div class="title-part">
        <p class="title-name">价格区间</p>
    </div>
    <div class="price-part">
        <div class="input-part"><input v-model="value.minPrice" type="text" maxlength="8" pattern="[0-9]*" :placeholder="minPlaceholder" @input="checkMinNumber" @focus="minPlaceholder=''" @blur="minPlaceholder='最低价'"></div>
        <div class="line"><span></span></div>
        <div class="input-part"><input v-model="value.maxPrice" type="text" maxlength="8"  pattern="[0-9]*" :placeholder="maxPlaceholder" @input="checkMaxNumber" @focus="maxPlaceholder=''" @blur="maxPlaceholder='最高价'"></div>
    </div>
</div>
</template>

<script>

export default {
    props:{
        value:{
            type: Object,
            default(){
                return {
                    minPrice:'',
                    maxPrice:'',
                }
            }
        }
    },
    data() {
        return {
            minPlaceholder:'最低价',
            maxPlaceholder:'最高价',
        }
    },
    watch:{
        /**
         * 监听价格区间传递的props值得变化的回调
        */
        value: {
            handler(val){
                this.$emit('input', val);
            },
            deep: true
        }
    },
    computed: {
    },
    components: {

    },
    created() {
        
    },
    methods:{
        /******* 
         * 检测最小价格输入是否是纯数字
         */
        checkMinNumber($event){
            let newVal = $event.target.value;
            let reg = /^[0-9]*$/;
            if(!!reg.test(newVal)){
                this.value.minPrice = newVal;
            }else{
                this.value.minPrice = this.value.minPrice.replace(/\D/g,'');
            }
        },
        /*******
         * 检测最大价格输入是否是纯数字
         */
        checkMaxNumber($event){
            let newVal = $event.target.value;
            let reg = /^[0-9]*$/;
            if(!!reg.test(newVal)){
                this.value.maxPrice = newVal;
            }else{
                this.value.maxPrice = this.value.maxPrice.replace(/\D/g,'');
            }
        }
    }
} 
</script>

<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.filter-price-container{
    padding: 0.6rem 0.3rem 0.3rem 0.3rem;
    .title-part{
        font-size: 0.24rem;
        .title-name{
            color: @text-color;
            font-weight: bold;
        }
    }
    .price-part{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.2rem;
        .line{
            width: 0.8rem;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            span{
                display: inline-block;
                width: 10px;
                height: 1px;
                background: @placeholder-color;
            }
        }
        .input-part{
            flex: 1;
            text-align: center;
            height: 0.6rem;
            line-height: 0.6rem;
            background: @background-color;
            border-radius: 0.4rem;
            input{
               text-align: center; 
               font-size: 0.24rem;
            }
        }
    }
}

</style>
