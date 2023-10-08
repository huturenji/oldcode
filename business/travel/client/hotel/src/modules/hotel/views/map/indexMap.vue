<template>
  <div>
    <LoadingX v-if="loading" tipsText="页面加载中"/>
<!--    <transition name="fade">-->
    <RealPage v-if="showPage" @showOff="showOff"></RealPage>
<!--    </transition>-->
  </div>
</template>
<script>
import LoadingX from "components/loading/LoadingX.vue";
document.body.addEventListener('touchstart', function () {});
export default {
    components: {
        LoadingX,
        'RealPage': resolve => { require(['./map.vue'], resolve) } //异步加载组件
    },
    data: function () {
        return {
            loading:true,
            showPage: false
        }
    },
    created: function () {
        let _this = this;
        setTimeout(()=>{
            _this.showPage = true;
        },600)//动画切换完成再加载组件
    },
    mounted() {
    },
    methods: {
        showOff(){
            let _this = this;
            _this.loading = false;
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