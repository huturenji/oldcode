/*
 * 回退事件和刷新事件注册
 */
import extendUtils from 'common/lib/utils'
let backFuncLock = null;
var tChatEventMixin = {
    created: function () {
        this.tChatEventAppBack();//注册T信回退事件
        this.tChatEventRefresh();//注册T信刷新事件
    },
    //TODO 为了兼容保活页面注册事件被覆盖,所以在该生命周期钩子activated里重新注册一遍
    activated(){
        this.tChatEventAppBack();//注册T信回退事件
        this.tChatEventRefresh();//注册T信刷新事件
    },
    /**
   * 混入的methods
   */
    methods:{
    /**
     * 注册T信的回退事件方法
     */
        tChatEventAppBack(){
            let that = this;
            try{
                sinosdk.sino.onBack(function(){
                    that.H5AppBack();
                })
            }catch(e){
                console.error('注册回退事件error=====', e);
            }
        },

        /**
     * 注册H5的回退事件方法
     */
        H5AppBack(time=1000){
            let that = this;
            extendUtils.throttle(async function() {
                try{
                    //页面返回时全局关闭modal弹窗2020年5月9日09:00:42
                    // eslint-disable-next-line no-unused-expressions
                    that.$modal && that.$modal.close && that.$modal.close();
                }catch(e){
                    console.error('全局关闭modal error=====', e);
                }
                if(!!that.goBackFun){
                    let backSteps = that.$route && that.$route.query && that.$route.query.backSteps;
                    //返回锁，closeTopPop函数可能是异步的，如果上一个closeTopPop没完成，说明上一个回退也没完成，此时再回退时，应该阻止
                    if(!backFuncLock){
                        backFuncLock = true;
                        await extendUtils.stateManager.closeTopPop(function(){
                            if(backSteps==null){
                                backSteps = 1;
                            }
                            that.goBackFun(backSteps);
                        }); //业务侧需要提供一个goBackFun函数
                        backFuncLock = false;
                    }
                }else{
                    console.log('业务侧需要提供一个goBackFun函数');
                }
            }, 'appback', time);
        },


        /**
     * 注册T新的刷新事件方法
     */
        tChatEventRefresh(){
            try{
                sinosdk.sino.onRefresh(()=>{
                    // 更改为强刷新
                    if(extendUtils.isNotEmpty(this.refresh)){
                        // eslint-disable-next-line no-unused-expressions
                        this.refresh && this.refresh(this.mescroll)
                    }else{
                        extendUtils.reloadPage();
                    }
          
                })
            }catch (e) {
                console.error('注册刷新事件error=====', e);
            }
        }
    }
}

export default tChatEventMixin;
    

