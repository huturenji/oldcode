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
    tChatEventAppBack(time=1000){
      let that = this;
      try{
        extendUtils.appBack(function(){
          extendUtils.throttle(function() {
            that._appBack()
          }, that, time);
        },that)
      }catch(e){
        console.error('注册回退事件error=====', e);
      }
    },

    async _appBack(){
        let that = this;
        try{
            //页面返回时全局关闭modal弹窗2020年5月9日09:00:42
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
    },

    /**
     * 注册T新的刷新事件方法
     */
    tChatEventRefresh(){
      try{
        extendUtils.reFreshPage(()=>{
          if(this.$route.path == '/home'){ //首页的T信刷新事件，需要清空缓存
            this.refreshClearCache();
          }else{
            //如果引入了mescroll组件,并且配置了使用下拉刷新，则调用组件自带的下拉刷新
            // if(this.mescroll && !!this.mescrollDown.use){
            //   this.mescroll.triggerDownScroll();
            // }else{//否则业务侧需要提供一个refresh函数
            //   this.refresh && this.refresh(this.mescroll, 'feature');
            // }

            if(this.refresh){
                this.refresh && this.refresh(this.mescroll, 'feature');
            }else{
                extendUtils.reloadWithNoCache();
            }
          }
        }, this)
      }catch (e) {
        console.error('注册刷新事件error=====', e);
      }
    },
  }
}

export default tChatEventMixin;

   

    
    

