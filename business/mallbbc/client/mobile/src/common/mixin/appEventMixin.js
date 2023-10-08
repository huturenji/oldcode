import {
    isNotEmpty
} from '@/utils/common.js'
const mixin={
    data() {
        return {   
            
        }
    },    
    mounted() {  
              
    },

    onShow() {
        //【注意】如果有其他场景需要覆盖app事件，onShow中注册事件会导致上述操作被覆盖
        //举例：打开协议详情时，会覆盖原有onBack事件，但把手机切到后台再切回前台时会执行onShow，导致协议组件注册的onBack事件被覆盖
        //另需注意： PC端在任何页面点击回退按钮都会触发onShow，导致协议详情在pc上无法关闭
        if (window.freezeRegisterAppEvent){ //增加一个变量锁暂时解决该问题
            return
        }
        this.initAppEvent();
    },
    
    methods: {
        initAppEvent(){
            this.tChatEventAppBack();//注册T信回退事件
            this.tChatEventRefresh();//注册T信刷新事件
        },
        /**
         * 注册T信的回退事件方法
         */
        tChatEventAppBack(){
            let that = this;
            try {
                sinosdk.sino.onBack(function(){
                    if (sinosdk.sino.message.broadcastEventToFrame('appBack')){
                        return;
                    }
                    that.appBackFun()
                }, that)
            } catch (e){
                console.error('注册回退事件error=====', e);
            }
        },

        /**
         * 跳转tabbar页面
         * @param str path 
         */
        gotoTabbarPage(path){
            if (isNotEmpty(path)){
                uni.switchTab({ 
                    url: path,
                    fail:()=>{
                        console.log('switchTab fail')
                        uni.navigateTo({ url: path});
                    }
                });
            } else {
                console.log('gotoTabbarPage fasil :'+path)
            }
        },
        /**
        * 跳转tabbar首页
        * @param num index 
        */
        gotoTabbarHomePage(){
            window.onTabBarLoad?.then(bar=>{
                bar.gotoHomePage();
            }) 
        },
        /**
        * 判断是否是tabbar页面
        * @param {*} path 
        * @returns 
        */
        isTabbarPage(path=null){
            return new Promise((resolve)=>{
                let res = false;
                window.onTabBarLoad?.then(bar=>{
                    let item = bar.getTabbarItem(path);
                    if (isNotEmpty(item) && isNotEmpty(item.pagePath)){
                        res = true;
                    }
                    resolve(res)
                })  
            })
        },
        async appBackFun(){
            //如果页面内自定义了函数，则以页面内的函数为最优先执行
            if (this.onPageBack){
                this.onPageBack();
                return;
            }
            let backTo = SnUtils.getUserPara('backTo');//指定回退到哪里
            let closeTo = SnUtils.getUserPara('closeTo');//指定关闭页面几步
            let redirectTo = SnUtils.getUserPara('redirectTo');//指定回退到哪里
            let reLaunchTo = SnUtils.getUserPara('reLaunchTo');//指定回退到哪里
            try {
                //未设置aliasPath的路由还是取path
                let currentPath = this.$Route?.aliasPath || this.$Route?.path;
                if (window.location.hash.replaceAll("#","").split('?')[0] == window.tabBar?.getHomePage()){ //如果当前页面是首页，此时回退页面
                    sinosdk.sino.back(null, 1);
                } else if (backTo && !isNaN(backTo)){ //设置了返回步数
                    this.$Router.back(Math.abs(backTo))
                } else if (closeTo && !isNaN(closeTo)){ //设置了关闭页面步数
                    sinosdk.sino.back(null, Math.abs(closeTo));
                } else if (!!redirectTo){ //设置返回方式为： 重定向到某个path
                    redirectTo = decodeURIComponent(redirectTo);
                    if (await this.isTabbarPage(redirectTo)){
                        this.gotoTabbarPage(redirectTo);
                    } else {
                        //兼容page.json配置了tabbar导致redirectTo失败的场景
                        uni.redirectTo({
                            url: redirectTo,
                            fail:()=>{
                                uni.switchTab({ url: redirectTo});
                            }
                        })
                    }
                } else if (!!reLaunchTo){ //设置返回方式为： reLaunch到某个path
                    reLaunchTo = decodeURIComponent(reLaunchTo);
                    if (await this.isTabbarPage(reLaunchTo)){
                        this.gotoTabbarPage(reLaunchTo);
                    } else {
                        uni.reLaunch({
                            url: reLaunchTo
                        })
                    }
                } else if (isNotEmpty(currentPath) && await this.isTabbarPage(currentPath)){ //如果是其他四其他首页个页面,此时均回退到首页
                    this.gotoTabbarHomePage();
                } else {
                    window.currHref = location.href;
                    this.$Router?.back(1);
                    setTimeout(()=>{
                        if (window.currHref == location.href){
                            sinosdk.sino.back(null, 1);
                        }
                    }, 300)
                }
            } catch (error) {
                console.error(error)
            }
        },
        /**
         * 注册T新的刷新事件方法
         */
        tChatEventRefresh(){
            try {
                let that = this;
                sinosdk.sino.getBridgeType().then((res)=>{
                    if (res != 'mpaas'){
                        sinosdk.sino.onRefresh(()=>{
                            if (sinosdk.sino.message.broadcastEventToFrame('appRefresh')){
                                return;
                            }
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