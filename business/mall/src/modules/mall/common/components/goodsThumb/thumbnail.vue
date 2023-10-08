<!--
    商品缩略图及相应的各个状态
-->
<template>
    <div class="goods-thumbnail-container">
        <img class="photo" :src="BMallConfig.GOODS.DEFAULT_THUMBNAIL" v-real-img='imgPath'>
        <template v-if='status && Object.keys(status).length>0'>
            <p class="image_tag disabled" v-if='status.noSale' :class="{bottom: !!status.position && status.position=='bottom'}"><span>{{!!status.position && status.position=='bottom'?'该商品已下架，非常抱歉！':'下架'}}</span></p>
            <p class="image_tag disabled bottom" v-if='!status.noSale && !!status.areaRestrict'><span>不支持销售</span></p> 
            <p class="image_tag bottom" v-if='!status.noSale && !status.noStock && status.remainNum>0 && status.remainNum<=10'><span>仅剩{{status.remainNum}}件</span></p>
            <p class="image_tag disabled" v-else-if='!status.noSale && !!status.noStock'><span>无货</span></p>
            <p class="image_tag disabled" v-else-if='status.unitPriceChange'><span>变价</span></p>
        </template>
    </div>
</template>
<script>

    export default {
        props: {
            src: {//商品图片
                type: String,
                default: ''
            },
            status: {
                type: Object,
                default: null
            },
        },
        computed: {
            imgPath(){
                if(!this.src){
                    return null;
                }
                if(this.src.startsWith("http:") || this.src.startsWith("https:")){
                    return this.src;
                }
                if(this.src=='GIFT_NO_IMG'){ //当商品的赠品和附件没有图片时，此时src特殊处理。
                    return this.BMallConfig.GOODS.DEFAULT_THUMBNAIL_GIFT;
                }
                return this.BMallConfig.IMG_PREFIX + this.src;
            }
        }
    }

</script>
<style scoped lang="less">
  @import '~themes/default/styles/goodsThumb/thumbnail.less';
</style>