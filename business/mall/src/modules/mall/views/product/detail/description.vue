<template>
    <div class="des-box" ref='desBox'>
       <div ref='goodsIntro' class="goods-intro" :class='descNavFixed && "fixed-dom-part"'>
           <div class="tab-box">
                <tab :line-width=2 custom-bar-width='28px'>
                    <tab-item class='tab-item' :selected="index == activeIndex" v-for="(item, index) in tabList" @on-item-click="changeGoodsIntr(item, index)" :key="index">{{item.name}}</tab-item>
                </tab>
           </div>

            <!-- <p @click="changeGoodsIntr(item, index)" v-for="(item, index) in tabList" :key="index" :class="{active:componentName == item.code}">{{item.name}}</p> -->
        </div>
        <!-- 动态组件展示商品介绍/规格参数/包装售后 -->
        <div class="isComponent">
            <component 
                :is="componentName" 
                :goodsDetailsObj="goodsDetailsObj">
            </component>
        </div>
    </div>
</template>
<script>
import { Tab, TabItem } from 'vux';
const GoodsIntroduction = ()=>import('./components/GoodsIntroduction.vue');
const AfterSale = ()=>import('./components/AfterSale.vue');
const Specifications = ()=>import('./components/Specifications.vue');
export default {
    name: 'goodsDetailsDes',
    components: {
        Tab,
        TabItem,
        GoodsIntroduction,
        AfterSale,
        Specifications,
    },
    props:{
        descNavFixed: {
            type: Boolean,
            default: false
        },
        //传递的商品详情
        goodsDetailsObj:{
            type: Object,
            required: true,
            default(){
                return {}
            }
        }
    },
    data(){
        return {
            activeIndex:0,
            componentName: 'GoodsIntroduction', //动态组件匹配
            tabList:[
                {
                    name:'商品介绍',
                    code: 'GoodsIntroduction'
                },
                {
                    name:'规则参数',
                    code: 'Specifications'
                },
                {
                    name:'包装售后',
                    code: 'AfterSale'
                },
            ]
        }
    },
    watch:{
        /**
         * 监听props传递的样式的变化
         */
        descNavFixed(newVal){
            let desBox = this.$refs.desBox;
            let goodsIntro = this.$refs.goodsIntro;
            if(!desBox || !goodsIntro){
                return;
            }
            if(!!newVal){
                desBox.style.paddingTop = goodsIntro.offsetHeight+'px';
            }else{
                desBox.style.paddingTop = '';
            }
        }
    },
    methods: {

        /**
         * 切换商品详情的规格 参数等tab的回调
         */
        changeGoodsIntr(item,index){
            this.activeIndex = index
            this.componentName = item.code;
            this.$emit('fixedDes');
        },
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/product/detail/description.less';
</style>