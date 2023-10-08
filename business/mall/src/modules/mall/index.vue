<template>
	<div>
        <template>
            <transition :name="transitionName" >
                <router-view class="child-view" :key='key' v-if="!$route.meta.keepAlive"></router-view>			
            </transition>	
            <transition :name="transitionName" >
                <keep-alive>
                    <router-view class="child-view" :key='key' v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
            </transition>
        </template>
	</div>
</template>

<script>
	import extendUtils from 'common/lib/utils'
	export default {
		name: 'mall',
		data() {
			return {
                transitionName: 'slide-left',
                authInitialized: false,
			}
		},
		created: function () {
		},
		computed: {
			key() {
				return this.$route.path.replace(/\//g, '_')
			}
		},
		methods: {
		},
		watch: {
			'$route'(to, from) {
				//没有定义动画则返回
				if(!this.$route.meta.needAnimation){
					this.transitionName = ''
					return;
				}
				//如果配置了index，则根据index来判断左右。否则根据路由的前进后退来判断
				if(!!to.meta.index){
					this.transitionName = to.meta.index > from.meta.index ? 'slide-left' : 'slide-right';
				}else{
					if (extendUtils.getSession('nextDirection') == 'forward') { //前进
						this.transitionName = 'slide-left';
					} else if (extendUtils.getSession('nextDirection') == 'back') {
						this.transitionName = 'slide-right';
					}
				}
			}
		}
	}
</script>

<style lang="less">
	@import '~mallStyles/core/common.less';	
</style>