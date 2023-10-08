<template>
  <div>
    <div class="train-list-wrap">
        <wrapper v-if='loading'></wrapper>
    <!--    <transition name="fade">-->
        <RealPage v-if="showPage" @showOff="showOff"></RealPage>
    <!--    </transition>-->
    </div>
  </div>
</template>
<script>
    document.body.addEventListener('touchstart', function () {});
    import wrapper from "./wrapper";
    import RealPage from './trainList.vue';
    export default {
        components: {
            wrapper,
            // RealPage
            'RealPage': resolve => {require(['./trainList.vue'], resolve)} //异步加载组件
        },
        data: function () {
            return {
            	loading:true,
                showPage: false,
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
            showOff(type){
                let _this = this;
                _this.loading = false;
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