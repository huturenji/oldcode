let safeAreaInsetBottom = 0;
document.body.style.setProperty('--safe-area-inset-bottom', '0px')
export default {
    /**
     * 获取安全区域的值
     * (这里就用同步方法，避免引用该值的地方都变成异步)
     */
    getSafeAreaInsetBottom(){
        return safeAreaInsetBottom;
    },

    /**
     * 设置抓握器悬浮（仅IOS生效）
     * 同时设置安全区域高度
     */
    suspend(){
        sinosdk.sino.setHomeIndicatorSuspend().then(data => {
            safeAreaInsetBottom = data?.responseData?.safeAreaInsetBottom ?? 0
            document.body.style.setProperty('--safe-area-inset-bottom', safeAreaInsetBottom + 'px')
        })
    }
}
