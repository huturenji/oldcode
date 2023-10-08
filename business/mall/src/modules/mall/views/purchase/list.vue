<template>
<div class="purchasedList-container">
    <div class="purchasedList-box">
          <!-- 商品的列表渲染 -->
        <emptyPage v-if="purchasedGoods.length <= 0"></emptyPage>
        <div v-else class="list-box">
             <p class="maybe">可能·采</p>
             <ul>
                 <li @click="gotoDetail(item, index)" v-for="(item, index) in purchasedGoodsList" :key="index">
                        <thumb01   
                            :img='item.BpProductImagePath' 
                            :title='!!item.BpProductName?item.BpProductName:item.BpBproductBrandName'
                            :price='item.BpProductPriceForUser'
                            :status='item.status'
                            @addCart='addCart(item, index)'
                        ></thumb01>
                 </li>
             </ul>
             <div class="no-more">抱歉，没有更多商品啦~</div>
        </div>
    </div>

    <!-- 定位底部的购物车按钮 -->
    <div v-transfer-dom>
        <cartThumb @clickCartThumb="clickCartThumb"></cartThumb>
    </div>
</div>
</template>
<script>
import cartThumb from 'commonComp/cartThumb/cartThumb.vue';
import emptyPage from 'commonComp/base/emptyPage.vue';
import thumb01 from 'commonComp/goodsThumb/thumb01.vue';
import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
export default {
    components:{
        emptyPage,
        thumb01,
        cartThumb
    },
    data(){
        return {
           purchasedGoodsList:[] //常购清单列表
        }
    },
    created(){
       this.getPurchasedList();
    },
    methods: {
        addCart(item, index){
           
        },
        /**
         * 跳转到购物车
         */
        clickCartThumb(){
            this.$router.push({
                path: "/cart"
            })
        },

         /**
         * 获取常购清单列表
         */
        async getPurchasedList(){
            this.purchasedGoodsList = await goodsHandler.getPurchasedList();
        },

         /**
         * 跳转订单详情
         */
        gotoDetail(item){
             this.$router.push(
                {
                    path: '/product/detail',
                    query:{
                        BpProductProviderNum: item.BpProductProviderNum
                    }
                }
            )
        }
    }
}
</script>
<style lang="less" scoped>
@import '~themes/default/styles/purchase/list.less';
</style>