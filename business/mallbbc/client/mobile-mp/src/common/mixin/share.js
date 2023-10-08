import config from '@/common/lib/config'
export default {
    data() {
        return {
            sharePath: '',
        }
    },
    onLoad(){
    },
    computed: {
        // 通过分享链接点击进来的
        showHome(){
            const pages = getCurrentPages(); //当前页面栈
            return pages && pages.length <= 1 
        }
    },
    // 设置当前页面分享到朋友
    onShareAppMessage(option) {
        return this.getDefaultShareMessage();
    },
    methods: {
        getCurrentPagePath() {
            let pages = getCurrentPages();
            // 获取当前页面的对象
            let page = pages[pages.length - 1];
            return `/${page.route}`
        },
        getDefaultShareMessage() {
            let jushihuiShareImg = config.JU_SHARE_IMAGE;
            let emaoqingShareImg = config.GIFT_SHARE_IMAGE;
            return {
                title: '',
                path: this.getCurrentPagePath(),
                imageUrl: this.isJushihuiApp ? jushihuiShareImg : emaoqingShareImg,
                success(res) {
                    // 转发成功之后的回调
                    if (res.errMsg == 'shareAppMessage:ok') { }
                },
                fail(res) {
                    // 转发失败之后的回调
                    if (res.errMsg == 'shareAppMessage:fail cancel') {
                        // 用户取消转发
                    } else if (res.errMsg == 'shareAppMessage:fail') {
                        // 转发失败，其中 detail message 为详细失败信息
                    }
                },
                complete(res) {
                    // 转发结束之后的回调（转发成不成功都会执行）
                }
            }
        },
        setShareAppMessage(option) {
            let defaultShareMessage = this.getDefaultShareMessage();
            return { ...defaultShareMessage, ...option };
        },
        // 分享到朋友圈
        getDefaultShareTimeLine() {
            let jushihuiShareImg = config.JU_SHARE_IMAGE;
            let emaoqingShareImg = config.GIFT_SHARE_IMAGE;
            return {
                title: '',
                query: '', // 分享的参数 a=1&b=2
                imageUrl: this.isJushihuiApp ? jushihuiShareImg : emaoqingShareImg,
            }
        },
        setShareTimeLine(option) {
            let timeLineConfig = this.getDefaultShareTimeLine();
            return { ...timeLineConfig, ...option };
        },
        goHome() {
            uni.switchTab({
                url: '/pages/index/index'
            })
        }, 
    }
}