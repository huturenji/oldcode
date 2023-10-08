/**
 * 代理全局函数
 */
export let proxyAgent = (function(){
    let agents = {
        uniToast(){
            let showLoading = uni.showLoading;
            uni.showLoading = (options={}) => {
                if (options.mask !== false){
                    options.mask = true;
                }
                showLoading(options)
            };
        }
    }
    return {
        open(){
            Object.values(agents).forEach(agent => agent())
        }
    }
})()