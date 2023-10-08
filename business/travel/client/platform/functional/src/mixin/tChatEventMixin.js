/*
 * 回退事件和刷新事件注册
 */
import extendUtils from '../utils';
let backFuncLock = null;
var tChatEventMixin = {
    created: function () {
        this.initAppEvent()
    },
    //TODO 为了兼容保活页面注册事件被覆盖,所以在该生命周期钩子activated里重新注册一遍
    activated(){
        this.initAppEvent()
    },
    /**
   * 混入的methods
   */
    methods:{
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
                    that.H5AppBack();
                })
            } catch (e){
                console.error('注册回退事件error=====', e);
            }
        },

        /**
     * 注册H5的回退事件方法
     */
        H5AppBack(time=1000){
            let that = this;
            extendUtils.throttle(async function() {
                try {
                    //页面返回时全局关闭modal弹窗2020年5月9日09:00:42
                    that.$modal && that.$modal.close && that.$modal.close();
                } catch (e){
                    console.error('全局关闭modal error=====', e);
                }
                if (!!that.goBackFun){
                    let backSteps = that.$route && that.$route.query && that.$route.query.backSteps;
                    //返回锁，closeTopPop函数可能是异步的，如果上一个closeTopPop没完成，说明上一个回退也没完成，此时再回退时，应该阻止
                    if (!backFuncLock){
                        backFuncLock = true;
                        await extendUtils.stateManager.closeTopPop(function(){
                            if (backSteps==null){
                                backSteps = 1;
                            }
                            that.goBackFun(backSteps);
                        }); //业务侧需要提供一个goBackFun函数
                        backFuncLock = false;
                    }
                } else {
                    console.log('业务侧需要提供一个goBackFun函数');
                }
            }, that, time);
        },


        /**
     * 注册T新的刷新事件方法
     */
        tChatEventRefresh(){
            try {
                //tudo pc注册刷新事件调用reload方法会导致history.length +1导致返回异常，目前屏蔽掉pc注册返回事件，后续pc修复bug后再放开
                if (!!extendUtils.isPC()){ return }
                sinosdk.sino.onRefresh(()=>{
                    //如果引入了mescroll组件，则调用组件自带的下拉刷新
                    this.refresh && this.refresh();
                })
            } catch (e) {
                console.error('注册刷新事件error=====', e);
            }
        },
        /**
     * 默认刷新事件
     */
        refresh(){
        //商旅默认刷新事件为刷新页面
            extendUtils.reloadWithNoCache();
        }
    }
}

export default tChatEventMixin;
    

