<template>
    <div class="tips_info">
        <div class="tipsInfo" v-if="stopSales">该商品已下架，非常抱歉！</div>
        <div class="tipsInfo" v-else-if="!stopSales && !!areaRestrict">该商品在该地区暂不支持销售，非常抱歉！</div>
        <div class="tipsInfo" v-else-if="!stopSales && !areaRestrict && !hasStock">抱歉，所选商品无货</div>
    </div>
</template>
<script>
export default {
    props:{
        //是否有库存 true=有 false=无
        hasStock:{
            type:Boolean,
            default:true
        },
        //是否上下架 true=下架 false=上架
        stopSales:{
            type:Boolean,
            default:false
        },
        //是否区域限售 true=下架 false=上架
        areaRestrict:{
            type:Boolean,
            default:false
        }
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.tipsInfo{
    font-size: 0.26rem;
    background: rgba(0,0,0,.5);
    color: #fff;
    text-align: center;
    line-height: 0.6rem;
}
</style>