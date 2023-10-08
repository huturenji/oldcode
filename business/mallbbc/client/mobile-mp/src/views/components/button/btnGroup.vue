<!--
 * @Descripttion: your project
 * @Author: mawenshu
 * @Date: 2023-03-14 16:22:59
-->
<template>
    <view class="btnGroup">
        <btnFactory
            ref="btnFactory" 
            :type='btn' 
            :giftInfo='giftInfo'
            :size='size' 
            :remainTime="remainTime"
            :interval="interval"
            v-for="(btn, index) in btnTypes" 
            :key='index' 
            @cancelResult="cancelResult"
            @viewInvoice="viewInvoice"
            @timing="timing"
            @timeout="timeout"
            @order-pay-success="orderPaySuccess"
        ></btnFactory>
    </view>
</template>

<script>
import btnFactory from '@/views/components/button/btnFactory';
export default {
    components: {
        btnFactory
    },
    props: {
        interval: {
            type: Number,
            default: 1
        },
        remainTime: {
            type: Number,
            default: 0
        },
        btnTypes: {
            type: Array,
            default: ()=>{
                return ['fillAddress', 'detail','receiveGift','IKnow']
            }
        },
        giftInfo:{
            type: Object,
            default: ()=>{}
        },
        size:{
            type: String,
            default: 'normal'
        }
    },
    methods: {
        cancelResult({featherId}){
            this.$emit('cancelResult', {featherId})
        },
        viewInvoice(previewInvoice){
            this.$emit('viewInvoice', previewInvoice)
        },
        timing(param){
            this.$emit('timing', param)
        },
        timeout(param){
            this.$emit('timeout', param)
        },
        orderPaySuccess(param){
            this.$emit('order-pay-success', param)
        }
    },
}
</script>

<style lang="scss" scoped>
.btnGroup{
    display: flex;
    width: 100%;
    justify-content: center;
}
</style>
