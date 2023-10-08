<template>
  <div>
      <div class="train-list-wrap">
        <orderConfirmSkeleton v-if="loading"></orderConfirmSkeleton>
    <!--    <transition name="fade">-->
        <RealPage v-show="showPage" @showOff="showOff"></RealPage>
    <!--    </transition>-->
      </div>
  </div>
</template>
<script>
    document.body.addEventListener('touchstart', function () {});
    import orderConfirmSkeleton from './orderConfirmSkeleton.vue'
    export default {
        components: {
            orderConfirmSkeleton,
            'RealPage': resolve => {require(['./orderConfirm.vue'], resolve)} //异步加载组件
        },
        data: function () {
            return {
            	loading:true,
                showPage: false,
            }
        },
        created: function () {
        	let _this = this; 	
        },
        mounted() {
        },
        methods: {
            showOff(){
                this.loading=false,
                this.showPage=true
            }
        },
    }
</script>
<style scoped lang="less">
@import '~styles/core/common.less';
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
.train-list-wrap{
    
}
</style>