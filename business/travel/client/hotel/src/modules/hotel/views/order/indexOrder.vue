<template>
  <div>
    <OrderSkeleton v-if="loading"></OrderSkeleton>
<!--    <transition name="fade">-->
    <RealPage v-show="showPage" @showOff="showOff"></RealPage>
<!--    </transition>-->
  </div>
</template>
<script>
import OrderSkeleton from './orderSkeleton'
document.body.addEventListener('touchstart', function () {});
export default {
    components: {
        OrderSkeleton,
        'RealPage': resolve => { require(['./order.vue'], resolve) } //异步加载组件
    },
    data: function () {
        return {
            loading:true,
            showPage: false
        }
    },
    created: function () {
        // let _this = this;
    },
    mounted() {
    },
    methods: {
        showOff(){
            this.showPage=true
            this.loading=false
        }
    }
}
</script>
<style scoped lang="less">
    .fade-enter-active, .fade-leave-active {
        -webkit-animation-name: fadeIn;
        -webkit-animation-duration: .3s;
        -webkit-animation-iteration-count: 1;
        -webkit-animation-delay: 0s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
    @-webkit-keyframes fadeIn {
        0% {
            opacity: 0;
        }
        33% {
            opacity: 0.33;
        }
        66% {
            opacity: 0.7;
        }
        100% {
            opacity: 1;
        }
    }
</style>