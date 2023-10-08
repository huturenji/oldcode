<template>
	<web-view :src="link"> </web-view>
</template>

<script>
	import config from '@/common/lib/config'
	export default {
		name: 'web-view-travel',
		data(){
			return {
				link: '', // 跳转的第三方地址
				channelId: '',
			}
		},
		computed: {
			
		},
		onLoad(options) {
			this.channelId = options.channelId
			this.initLink()
			this.initTitle()
		},
		created() {
			
		},
		methods: {
			initLink(){
				let userParams = getApp().globalData.userParams;
				let apiUrl = config.API_URL;
				let serviceName = config.SERVICE_NAME;
				let appId = config.MINI_CONFIG.APPID;
				let openId = userParams.openId;
				let channelId = this.channelId;
				let param = {
					appId,
					openId,
					channelId
				}
				let paramStr = JSON.stringify(param)
				let link = `${apiUrl}${serviceName}/static/mobile/index.html#/?bp-param=${encodeURIComponent(paramStr)}`
				// let link = `https://bplussit.sinosun.com:18380/mallbbcg2/static/mobile/index.html#/?bp-param=${encodeURIComponent(paramStr)}`
				// let link = `http://10.2.25.139:8080/index.html#/hotel/orderDetail?orderNo=VH445224333791232&pageFrom=orderList&bp-param=${encodeURIComponent(paramStr)}`
				// console.log(param, 'param1');
				// console.log(link, 'link2');
				this.link = link;
			},
			initTitle(){
				uni.setNavigationBarTitle({
					title: '差旅首页'
				})
			}
		}
	}
</script>

<style>

</style>
