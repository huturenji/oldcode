<template>
	<div>
	 	<changeTrainTickets></changeTrainTickets>
	</div>
</template>

<script>
 	import trainHandler from 'trainHandler/common/lib/trainHandler.js';
	import changeTrainTickets from 'trainComponents/trainComp/endorseInfo.vue';
	export default {
        mixins: [trainHandler.mixin.tChatEventMixin],
		directives: {
		},
		components: {
			changeTrainTickets,
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
			let that = this;
			//注册并监听t信返回事件
			// sinosdk.sino.onBack(function(){
			// 	trainHandler.stateManager.closeTopPop(()=>{
			// 		sinosdk.sino.back('');
			// 	});
			// },that)
		},
		mounted: function() {},
		methods: {
                //注册并监听t信返回事件
            goBackFun(){
                sinosdk.sino.back('');
            },
        }
	}
</script>

<style>
</style>