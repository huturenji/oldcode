<template>
<div class="shihui_container">
    <img v-for="i in 4" :key="i" :src="getImgUrl(i)"/>
</div>
</template>

<script>
import extendUtils from 'flightCommon/extend.js';
export default {
    mixins: [extendUtils.mixin.tChatEventMixin],
    computed:{
        getImgUrl(){
            return (i) => {
                let imageUrl = require(`./img/pic_feiji_shihui${i++}.png`);
                return imageUrl
            }
        }
    },
    methods: {
        //注册并监听t信返回事件
        goBackFun(){
            this.closeTopPop()           
        },
        closeTopPop(){
            extendUtils.stateManager.closeTopPop(() => {
                extendUtils.closePage('');
            });
        }
    }
}
</script>

<style lang="less" scoped>
.shihui_container{
    width: 100%;
    display: flex;
    flex-direction: column;
    img{
        width: 100%;
        height: auto;
    }
}
</style>