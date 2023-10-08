<template>
    <div :class="recommendItem.productNameEn" @click="gotoRecommendList(recommendItem)" class="recommend-thumb">  
        <img :src="recommendImgList[recommendItem.productNameEn]">
        <img v-if="!!use && use == 'SN'" class="sn_en_bg" :src="recommendImgList[recommendItem.productNameEn + '_EN']">
        <span :class='{[recommendItem.productNameEn]:recommendItem.productNameEn}' class="name">{{recommendItem.productName}}</span>  
    </div>
</template>
<script>
import { recommendImgList } from 'common/lib/enum/indexImgEnum';
import extendUtils from 'common/lib/utils';
export default {
    props:{
        recommendItem:{
            type: Object,
            required: true,
            default(){
                return {}
            },
        },
        use: {
            type: String,
        }
    },
    components:{},
    data(){
        return {
            recommendImgList: recommendImgList,
            isPC: extendUtils.isPC(),//区分移动端和PC端
        }
    },
    methods: {
        gotoRecommendList(item){
            this.$router.push({
                path:'/product/recommendList',
                query: {
                    skus: JSON.stringify(item.sku),
                    recommendTitle: item.productName,
                    categoryId1: item.categoryId1,
                    t: new Date().getTime()
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.recommend-thumb{
    cursor: pointer;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    &.computerOfficeSN, &.phoneDigitalSN{
        background-color: #F5F8FF;
        display: flex;
        align-items: center;
        img{
            height: auto;
        }
    }
    &.phoneDigitalSN{
        background-color: #F9F5FF;
    }
    &.cleaningCareSN{
        background-color: #FFF9F9;
    }
    &.clockSN{
        background-color: #F8F6FA;
    }
    &.foodDrinkSN{
        background-color: #FFFAF4;
    }
    &.deviceSN{
        background-color: #F4FDFC;
    }
    img.sn_en_bg{
        position: absolute;
        width: auto;
        height: .28rem;
        left: .2rem;
        top: .7rem;
    }
    .name{
        position: absolute;
        color: #333;
        font-weight:bold;
        left: .2rem;
        top: .2rem;   
        font-size: .3rem;     
        &.computerOfficeSN{
           color: #4987FF; 
        }
        &.cleaningCareSN{
           color: #D05856; 
        }
        &.clockSN{
           color: #777777; 
        }
        &.foodDrinkSN{
           color: #E28300;  
        }
        &.phoneDigitalSN{
           color: #C0A0F3;  
        }
        &.deviceSN{
           color: #0DA27F; 
        }
    }
    //pc端显示推荐分类样式
    @media screen and (min-width: @screen-sm) { 
        .name{
            left: .3rem;
            top: .3rem;
            font-size: .34rem;
        }
        img.sn_en_bg{
            left: .3rem;
            top: .92rem;
            height: .4rem;
        }
    }
    img{
        width: 100%;
        height: 100%;
        display: block;
    }
}
</style>
