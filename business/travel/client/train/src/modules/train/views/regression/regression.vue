<template>
	<div>
	 	<regressionComp></regressionComp>  
	</div>
</template>

<script>
	import trainHandler from 'trainHandler/common/lib/trainHandler.js';
	import regressionComp from 'trainComponents/trainComp/regressionComp/regressionComp.vue';
	export default {
        mixins: [trainHandler.mixin.tChatEventMixin],
		directives: {
		},
		components: {
      		regressionComp
		},
		data: function() {
			return {
			}
		},
		beforeRouteLeave(to, from, next) {
			let that = this;
			trainHandler.stateManager.closeTopPop(()=>{
				next();
			});
		},
		created: function() {
			// let that = this;
			// //注册并监听t信返回事件
			// sinosdk.sino.onBack(function(){
 			// 	trainHandler.stateManager.closeTopPop(()=>{
			// 		sinosdk.sino.back('');
			// 	});
			// }.bind(this),that);
		},
		mounted: function() {},
		methods: {
            goBackFun(){
            const that = this;
            that.$router.back();
            },
        }
	}
</script>

<style scoped lang="less">
</style>