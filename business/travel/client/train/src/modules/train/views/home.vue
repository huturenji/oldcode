<template>
  <!--2019.1.30修改添加 xg14-->
	<div class="indexWrap">
		<!-- 服务提示 -->
    	<Platform name="serviceReminders"></Platform>
		<div class="indexbg">
            <!-- 小红包入口 不能加到index层级中iphone6 IOS兼容 -->
            <!-- <RedPocket ref="redPocket"></RedPocket> -->
			<div class="topButtonWrap"></div>
			<div class="contentWrap">
				<div class='swiperWrap'>
					<realIndex />
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import trainHandler from 'trainHandler/common/lib/trainHandler.js';
	const Platform = ()=>import('components/announcement/index');
	const realIndex = ()=>import('./index/index.vue');
    // import RedPocket from 'components/coupon/redPocket.vue'
    import {getAPPCustomConfigs} from 'feature/customFunctionConfigs.js';
	export default {
        components: {
			// RedPocket,
			realIndex,
			Platform
        },
		data() {
			return {}
		},
		created(){
      		trainHandler.setStorage('homePageType','mini');
        },
        methods:{
           
        }
	}
</script>

<style lang="less">
@import '~themes/default/styles/home.less';
</style>
