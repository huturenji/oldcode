import { isHairSucreen, isIos } from '@/utils/common';
const mixin = {
    data() {
        return {
            statusBarHeight: 0,
            navigationBarHeight: 0,
            navHeight: 0,
            windowHeight: 0, // 可使用窗口高度
            capsuleGap: 0
        }
    },  
    created() {
        this.initSystemConfig();
    },
    computed: {
        iosHairPhone(){
            return isIos() && isHairSucreen();
        }
       
    },
    methods: {
        initSystemConfig(){
            this.statusBarHeight = getApp().globalData.statusBarHeight
            this.navigationBarHeight = getApp().globalData.navigationBarHeight
            this.windowHeight = uni.getSystemInfoSync().windowHeight
            this.navHeight = getApp().globalData.navHeight
            this.capsuleGap = getApp().globalData.capsuleGap
        }
    }
}
export default mixin;