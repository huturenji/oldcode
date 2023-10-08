<!--
 * @Author: whchen
 * @Descripttion: 
 * @Date: 2023-04-04 09:35:25
 * @LastEditTime: 2023-05-06 16:59:59
 * @FilePath: \mobile-miniprogram\src\App.vue
-->
<script>
	import config from '@/common/lib/config'
	export default {
		//全局配置
		globalData: {
			apiUrl: config.API_CONFIG[config.ENV],
			userParams: {},// 用户相关参数信息
			statusBarHeight: 0, // 状态导航栏高度
			navHeight: 0, // 总体高度
			navigationBarHeight: 0, // 导航栏高度(标题栏高度)
			capsuleGap: 0, // 小程序胶囊间隙
			capsuleInfo: {},
            version: '',
		},
		onLaunch: function() {
			// 获取设备的相关高度信息
			this.getSystemInfo();
            // 预加载部分信息
            this.backstageReq();
		},
		onShow: function() {
			
		},
		onHide: function() {
		},
		methods: {
			getSystemInfo(){ 
				try {
					// 状态栏高度
					this.globalData.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
					// 获取微信胶囊的位置信息 width,height,top,right,left,bottom
					const custom = uni.getMenuButtonBoundingClientRect()
				
					// 导航栏高度(标题栏高度) = 胶囊高度 + (顶部距离 - 状态栏高度) * 2
					this.globalData.navigationBarHeight = custom.height + (custom.top - this.globalData.statusBarHeight) * 2

					// 胶囊间隙
					this.globalData.capsuleGap = custom.top - this.globalData.statusBarHeight
					
					// 胶囊信息
					this.globalData.capsuleInfo = custom

					// 总体高度 = 状态栏高度 + 导航栏高度
					this.globalData.navHeight = this.globalData.navigationBarHeight + this.globalData.statusBarHeight
					
					// 小程序sdk版本号
					this.globalData.version = uni.getAppBaseInfo()?.hostSDKVersion || ''
				} catch(e) {
					console.log(e)
				}
				
			},
            // 获取地址列表
            async backstageReq() {
                this.$store.dispatch('getAddressList');
            },
		}
	}
</script>

<style lang='scss'>
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";

	/*
	全局体图标——阿里巴巴图标库
    */
    @import '@/common/css/icons.css';
	
    /*
    全局公共样式
    */
    @import '@/common/css/base.css';

	/*每个页面公共css */
	*{
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	view {
		box-sizing: border-box;
	}
	page{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
        background-color: $uni-bg-color;
        overflow-y: scroll;
    }
	image{
		width: 100%;
		height: 100%;
	}
	@font-face{
		font-family: 'Alibaba Font';
		src: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/font/sinosunnumber.ttf');
	}

	/* 兆日字体 */
	.num-font{
		font-family: 'Alibaba Font', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft Yahei', '宋体', Tahoma, Arial, Helvetica, STHeiti, sans-serif;
	}  

</style>
