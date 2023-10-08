<!--
    商品缩略图及相应的各个状态
-->
<template>
    <div class="goods-thumbnail-container">
        <img class="photo" :src="imgPath" >
    </div>
</template>
<script>

    export default {
        props: {
            src: {//商品图片
                type: String,
                default: ''
            }
        },
        data(){
            return {
                IMG_PREFIX: 'https://img13.360buyimg.com/n1/s350x350_'
            }
        },
        computed: {
            imgPath(){
                if(!this.src){
                    return null;
                }
                // data: 此处startsWith("data:")是因为图片有可能是base64的
                if(this.src.startsWith("http:") || this.src.startsWith("https:") || this.src.startsWith("data:")){
                    return this.src;
                }
                return this.IMG_PREFIX + this.src;
            }
        }
    }

</script>
<style scoped lang="less">
.goods-thumbnail-container{
    width: 100%;
    img{
        width: 100%;
        height: auto;
        display: block;
        background: #f7f7f7;
    }
}
</style>