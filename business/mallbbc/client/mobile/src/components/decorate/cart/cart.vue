<template>
    <view @click="toCartPage" class="cart-thumb" :style="{backgroundImage: (decoItem && decoItem.props && decoItem.props.img)?'url('+decoItem.props.img+')':'url('+imgUrl+'cart/btn_common_shopping.svg'+')'}">
        <view v-if="cartNum>0" class="num fontScaleIgnore" :class="{maxNum: cartNum > 99}">{{cartNum > 99 ? '99+' : cartNum}}</view>
    </view>
</template>
 
<script>
import {
    mapState
} from 'vuex';
export default {
    name:'cart',
    data() {
        return {
            imgUrl:getApp().globalData.imgUrl
        };
    },
    props: {
        decoItem: {
            type: Object,
            default: ()=>{}
        }  
    },
    computed: {
        ...mapState(['cartNum'])
    },
    created() {
        
    },
    methods: {
        // 跳转到购物车页面
        toCartPage() {
            let that = this;
            this.$moduleGate(()=>{
                that.$Router.push({
                    path: '/pages/cart/cart'
                })
            })
        }
    }
}
</script>

<style lang='scss'>
.cart-thumb{
    position: fixed;
    bottom: calc(170rpx + var(--safe-area-inset-bottom)); 
    right: calc((100vw - 750rpx) / 2 + 40rpx);   
    z-index: 100;
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 94rpx 94rpx;
    // overflow: hidden;
    z-index: 100;
    box-shadow: 0px 2rpx 14rpx 0px rgba(132,132,132,0.40); 
    .num.fontScaleIgnore{
        position: absolute;
        width: 30rpx;
        height: 30rpx;
        padding: 4rpx;
        border-radius: 50%;
        background: #f30300;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24rpx;
        right: 0rpx;
        top: -8rpx;
        &.maxNum{
            width: 36rpx;
            height: 36rpx;
            font-size: 18rpx;
        }
    }
}
</style>
