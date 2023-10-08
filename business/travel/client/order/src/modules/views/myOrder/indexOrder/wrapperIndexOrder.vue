<template>
  <div style='height:100%'>
     <wrapper class="switch" v-if="loading"></wrapper>
<!--    <transition name="fade">--> 
    <RealPage class="switch" v-show="!loading" @showOff="showOff"></RealPage>
<!--    </transition>-->
  </div>
</template>
<script>
import wrapper from "./wrapper";
document.body.addEventListener('touchstart', function () {});
export default {
    components: {
        wrapper,
        'RealPage': resolve => { require(['./indexOrder.vue'], resolve) } //异步加载组件
    },
    data: function () {
        return {
            //indexOrder.vue糅合了个人订单列表和企业订单管理两部分代码，通过参数来区分，我们添加骨架图，按照需求
            //只处理个人订单列表，暂不处理企业订单管理。所以骨架图需要屏蔽企业订单管理,orderDispatch == 0是判断条件，表示
            //来自于企业订单管理。
            loading: true
            // showPage: false,
        }
    },
    created: function () {
        // let _this = this;
        // setTimeout(()=>{
        //     _this.showPage = true;
        // },600)//动画切换完成再加载组件
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
    .switch{
        transition: 0.3s;
    }
</style>
