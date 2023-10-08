<template>
    <div>
        <!-- <LoadingX v-if="loading" tip='页面加载中' :spinning="true" :turn="true" /> -->
        <wrapper v-if="loading"></wrapper>
        <!--    <transition name="fade">-->
        <RealPage v-show="!loading" @showOff="showOff"></RealPage>
        <!--    </transition>-->
    </div>
</template>
<script>
import wrapper from "./wrapper";
document.body.addEventListener("touchstart", function() {});
export default {
    components: {
        wrapper,
        RealPage: resolve => {
            require(["./index.vue"], resolve);
        } //异步加载组件
    },
    data: function() {
        return {
            loading: true
        };
    },
    created: function() {
        //   setTimeout(()=>{
        // _this.showPage = true;
        // },600)//动画切换完成再加载组件
    },
    mounted() {},
    methods: {
        showOff() {
            let _this = this;
            _this.loading = false;
        }
    }
};
</script>
<style scoped lang="less">
.fade-enter-active,
.fade-leave-active {
    -webkit-animation-name: fadeIn;
    -webkit-animation-duration: 0.3s;
    -webkit-animation-iteration-count: 1;
    -webkit-animation-delay: 0s;
}
.fade-enter,
.fade-leave-to {
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