<template>
	<web-view :src="link"> </web-view>
</template>

<script>
	import { isNotEmpty } from '@/utils/common.js'
	export default {
		name: 'web-view',
		data(){
			return {
				link: '', // 跳转的第三方地址
				title: '' //页面title
			}
		},
		computed: {
			
		},
		onLoad(options) {
			if(isNotEmpty(options.link)){
				this.initLink(options.link)
			}
			if(isNotEmpty(options.title)){
				this.initTitle(options.title)
			}
			
		},
		created() {
			
		},
		methods: {
			initLink(link){
				this.link = decodeURIComponent(decodeURIComponent(link))
			},
			initTitle(title){
				this.title = decodeURIComponent(decodeURIComponent(title)) || ''
				uni.setNavigationBarTitle({
					title: this.title
				})
			}
		}
	}
</script>

<style>

</style>
