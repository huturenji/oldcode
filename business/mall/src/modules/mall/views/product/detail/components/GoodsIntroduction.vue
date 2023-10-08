<template>
    <div>
        <DetailTitle titleName="商品信息"></DetailTitle>
        <div class="intro-box" v-html="goodsDetailsObj.introduction"></div>
    </div>
</template>
<script>
const DetailTitle = ()=>import('./DetailTitle.vue');
export default {
    name: 'GoodsIntroduction',
    props:{
        //传递的商品详情
        goodsDetailsObj:{
            type: Object,
            required: true,
            default(){
                return {}
            }
        }
    },
    components:{
        DetailTitle
    },
    data(){
        return {
            widthNum: 750, //京东返回的大字段是写死的750px;
        }
    },
    created(){},
    mounted(){
        this.initStyle();
    },
    methods:{
        /**
         * 京东返回的大字段是写死的750px，此画布需要用css3的zoom 缩放一下
         */
        initStyle(){
            let oWidth = document.body.clientWidth|| window.screen.width;
            if(oWidth <= 750){
                let scale = (oWidth / this.widthNum)-0.03;
                let dom = document.getElementsByClassName('intro-box')[0];
                dom.style.zoom = scale;
            }else{
                let dom = document.getElementsByClassName('intro-box')[0];
                dom.style.textAlign = 'center';
                dom.style.margin = '0 auto';
            }

        },
    }
}
</script>
<style scoped lang="less">
.intro-box{
    width: 100%;
    overflow: hidden;
    /deep/ & > div{
        margin: auto !important; //兼容京东返回的商品向请图片大字报 自己添加了margin导致的样式问题
        float: none!important; //兼容京东返回的商品向请图片大字报 自己添加了margin导致的样式问题
        &:last-of-type{
            margin-bottom: 3rem;
        }
    }
    /deep/ & > img{
        &:last-of-type{
            margin-bottom: 3rem;
        }
    }
}
</style>