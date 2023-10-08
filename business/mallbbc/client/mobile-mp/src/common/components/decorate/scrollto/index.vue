<template>
    <view @click="backToTop" class="backTop">
    </view>
</template>
<script>
export default {
    name: 'deco-scrollto',
    data() {
        return {
            
        };
    },
    props: {
        decoItem: {
            type: Object,
            default: () => {}
        },
        parentScrollTop: {
            type: Number,
            default: 0
        },
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
.backTop {
    position: fixed;
    bottom: 400rpx;
    right: calc((100vw - 750rpx) / 2 + 40rpx);   
    z-index: 100;
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_zhiding.svg') center no-repeat;
    background-size: 94rpx 94rpx;
    box-shadow: 0px 2rpx 14rpx 0px rgba(132,132,132,0.40); 
}
</style>
