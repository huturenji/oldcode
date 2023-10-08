<template>
	<div>
		<router-view class="child-view" :loginResult="loginResult" v-if="!$route.meta.keepAlive && !$route.meta.needAnimation"></router-view>
		<transition :name="transitionName">
			<router-view class="child-view" :loginResult="loginResult" v-if="!$route.meta.keepAlive && $route.meta.needAnimation"></router-view>
		</transition>
		<keep-alive>
			<router-view class="child-view" :loginResult="loginResult" v-if="$route.meta.keepAlive && !$route.meta.needAnimation"></router-view>
		</keep-alive>
		<transition :name="transitionName">
			<keep-alive>
				<router-view class="child-view" :loginResult="loginResult" v-if="$route.meta.keepAlive && $route.meta.needAnimation"></router-view>
			</keep-alive>
		</transition>
	</div>
</template>

<script>
    let {getSession}  = SnUtils;
	export default {
		name: 'home',
		data() {
			return {
                transitionName: 'slide-left',
                loginResult:0,//登录结果
			}
		},
		components: {},
		created: function() {},
		methods: {},
		watch: {
			'$route' (to, from) {
				if(getSession('nextDirection') == 'forward') { //前进
					this.transitionName = 'slide-left';
				} else if(getSession('nextDirection') == 'back') {
					this.transitionName = 'slide-right';
				}
			}
		}
	}
</script>

<style lang="less">
@import "index.less";	
</style>