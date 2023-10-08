<script>
import config from '@/common/lib/config'
export default {
    //全局配置
    globalData: {
        imgUrl: `/static/shared/`, // 静态资源地址前置
        //#ifdef MP-WEIXIN
        apiUrl: config.API_URL,
        //#endif
        //#ifdef H5
        apiUrl: window.location.origin + '/',
        //#endif
        userParams: {}, // 用户相关参数信息
        statusBarHeight: 0, // 状态导航栏高度
        navHeight: 0, // 总体高度
        navigationBarHeight: 0, // 导航栏高度(标题栏高度)
        capsuleGap: 0, // 胶囊距离标题栏的间隙
        shopList: [] //账号关联的门店列表
    },
    onLaunch: function() {
        // 获取设备的相关高度信息
        this.getSystemInfo();
    },
    onShow: function() {
    },
    onHide: function() {
    },
    methods: {
        getSystemInfo(){ 
            //#ifdef MP-WEIXIN
            // 状态栏高度
            this.globalData.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;

            // 获取微信胶囊的位置信息 width,height,top,right,left,bottom
            const custom = uni.getMenuButtonBoundingClientRect()

            // 导航栏高度(标题栏高度) = 胶囊高度 + (顶部距离 - 状态栏高度) * 2
            this.globalData.navigationBarHeight = custom.height + (custom.top - this.globalData.statusBarHeight) * 2

            // 胶囊距离标题栏的间隙
            this.globalData.capsuleGap = custom.top - this.globalData.statusBarHeight
			
            // 总体高度 = 状态栏高度 + 导航栏高度
            this.globalData.navHeight = this.globalData.navigationBarHeight + this.globalData.statusBarHeight
            //#endif
        }
    }
}
</script>

<style lang='scss'>
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";

	/*
    全局公共样式
    */
    @import '@/common/css/base.css';

	/*每个页面公共css */
	view {
		box-sizing: border-box;
	}
	page{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
    }
	image{
		width: 100%;
		height: 100%;
	}
	 /* 页面wrapper的位置在titlebar下方，tabbar上方 */
	uni-page-wrapper{
		position: absolute;
		top: var(--titleBarFillHeight, 0px);
		left: 0;
		width: 100%;
		background-color: $bg-color-split;
		height: calc(100% - var(--titleBarFillHeight, 0px) - var(--tabBarHeight, 0px) );
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 0;
	}

	@media screen and (min-width: 616px){
		uni-page-wrapper{
			left: 50%;
			margin-left: -375rpx;
			width: 750rpx;
		}
	}

	/* 防止uni-page-wrapper的marginTop坍塌 */
	uni-page-body, uni-page-body > uni-view:first-of-type{
		&::before{
			content: '';
			display: block;
			overflow: hidden;
		}
	}
</style>
