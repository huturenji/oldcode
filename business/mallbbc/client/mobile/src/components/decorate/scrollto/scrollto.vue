<template>
    <view @click="backToTop" class="backTop" >
    </view>
</template>
<script>
export default {
    name: 'deco-scrollto',
    data() {
        return {
            duration:200//页面滚动动画时长
        };
    },
    props: {
            
    },
    computed: {
    },
    created() {
            
    },
    methods: {
        backToTop() { //回到顶部  
            this.$emit('scrollToTop')
        } 
    }
}
</script>

<style lang='scss'>
.backTop{
    position: fixed;
    bottom: calc(314rpx + var(--safe-area-inset-bottom));
    right: calc((100vw - 750rpx) / 2 + 40rpx);   
    z-index: 100;
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    background: url('@/static/shared/common/img/btn_common_zhiding.svg') center no-repeat;
    background-size: 94rpx 94rpx;
    // overflow: hidden;
    box-shadow: 0px 2rpx 14rpx 0px rgba(132,132,132,0.40); 
}
</style>
