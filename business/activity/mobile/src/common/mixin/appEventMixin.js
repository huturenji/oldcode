const mixin = {
    data() {
        return {}
    },  
    mounted() {},
    onShow() {
        this.tChatEventAppBack(); //注册T信回退事件
        this.tChatEventRefresh(); //注册T信刷新事件
    },
    methods: {
        /**
         * 注册T信的回退事件方法
         */
        tChatEventAppBack(){
            let that = this;
            try {
                sinosdk.sino.onBack(function(){
                    that.appBackFun()
                }, that)
            } catch (e){
                console.error('注册回退事件error=====', e);
            }
        },
        appBackFun() {
            let closeTo = SnUtils.getUserPara('closeTo');//指定关闭页面几步
            // 如果当前页面是首页，此时回退页面
            if (closeTo && !isNaN(closeTo)){ 
                sinosdk.sino.back(null, Math.abs(closeTo));
            } else {
                window.currHref = location.href;
                // 页面回退一级
                uni.navigateBack({
                    delta: 1
                })
                setTimeout(()=>{
                    if (window.currHref == location.href){
                        sinosdk.sino.back(null, 1);
                    }
                }, 300)
            }
        },
        /**
         * 注册T新的刷新事件方法
         */
        tChatEventRefresh(){
            try {
                let that = this;
                sinosdk.sino.getBridgeType().then(res => {
                    if (res != 'mpaas'){
                        sinosdk.sino.onRefresh(() => {
                            if (!that.refresh || that.refresh()!==false){
                                window.location.reload(true);
                            }
                        }, this)
                    }
                })
            } catch (e) {
                console.error('注册刷新事件error=====', e);
            }
        }
    }
}
export default mixin;