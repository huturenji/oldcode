
<template>
<!-- 购物车小组件 -->
<div @click="clickCartThumb" class="cart-thumb ">
    <!-- 只有购物车数量大于0的时候才显示才显示购物车内商品的数量 -->
    <div v-if="cartNum > 0">
        <numThumb :number="Number(cartNum) > 99 ? '99+' : Number(cartNum)"/>
    </div>
</div>
</template>
<script>
import numThumb from './numThumb'
export default {
    components:{
        numThumb
    },
    props:{

    },
    data(){
        return {

        }
    },
    computed:{
        cartNum(){
            var numbers = this.$store.state.cartNumber;
            return numbers;
        }
    },
    created(){
        //分发获取购物车数量的接口 在vuex里面
        this.$store.dispatch('getCartNum');
    },
    methods: {
        /**
         * 点击购物车小icon触发emit事件
         */
        clickCartThumb(){
            this.$emit('clickCartThumb');
        }
    }
}
</script>
<style lang="less" scoped>
@import '~themes/default/styles/common/variable.less';
.cart-thumb{
    position: fixed;
    bottom: .7rem;
    right: 0.2rem;
    z-index: 100;
    width: 1rem;
    height: 1rem;
    background: url('~themes/default/img/icon/icon_mall_gouwuche_nor.svg') center no-repeat;
    background-size: contain;

    &:active{
        background: url('~themes/default/img/icon/icon_mall_gouwuche_pre.svg') center no-repeat;
        background-size: contain;
    }

}

//针对pc端样式调整 0.4rem 表示距离右侧边0.4rem
@media screen and (min-width: @screen-lg) {
    .cart-thumb{
        right: calc(~'(100vw - 960px) / 2 + 0.4rem') !important;
    }
}
</style>
