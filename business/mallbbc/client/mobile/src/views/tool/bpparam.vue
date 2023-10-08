<!-- bp-param参数生成页面 目前是工具生成bp-param参数的 -->
<template>
    <view class='edit_nick_name'>
        
    </view>
</template>
<script>

import { Base64 } from 'js-base64'
export default {
    data() {
        return {
           
        };
    },
    mounted(){
        // str要加密的字符串
        let bpParam = {'channelId':'9729'};
        let str = JSON.stringify(bpParam)
        // console.log('解密---',encodeURIComponent(str));

        // let str="哈哈哈=+_-%";
        // 加密
        let jiami = Base64.encodeURI(str)
        // 解密
        let jiemi = JSON.parse(Base64.decode(decodeURIComponent(jiami)))

        console.log('加密+++', jiami);
        console.log('解密---', jiemi);
    },
    computed: {
    },
    methods: {
        
    }
}
</script>

<style lang='scss'>
    
</style>
