/*
 * @Author: whchen
 * @Descripttion: 
 * @Date: 2023-04-04 09:35:25
 * @LastEditTime: 2023-04-11 12:12:56
 * @FilePath: \mobile-miniprogram\src\common\mixin\system.js
 */
const mixin = {
    data() {
        return {
            statusBarHeight: 0,
            navigationBarHeight: 0,
            navHeight: 0,
            windowHeight: 0, // 可使用窗口高度
            windowWidth: 0,
            capsuleGap: 0,
            capsuleInfo: {},

        }
    },  
    created() {
        this.statusBarHeight = getApp().globalData.statusBarHeight
        this.navigationBarHeight = getApp().globalData.navigationBarHeight
        this.windowHeight = uni.getSystemInfoSync().windowHeight
        this.windowWidth = uni.getSystemInfoSync().windowWidth
        this.navHeight = getApp().globalData.navHeight
        this.capsuleGap = getApp().globalData.capsuleGap
        this.capsuleInfo = getApp().globalData.capsuleInfo
    },
    onShow() {
        
    },
    methods: {
        
    }
}
export default mixin;