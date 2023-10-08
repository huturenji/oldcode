/*
 * @Descripttion: 页面前进、后退的判断方法
 * @version: 
 * @Author: yg
 * @Date: 2020-09-28 15:18:11
 * @LastEditors: yg
 * @LastEditTime: 2020-09-28 15:29:40
 */
var DirectionHandler = (function (){
    const STATU = {
      FORWARD: 'forward',
      BACK: 'back'
    }
    function directionHandler(){
      this.addListener()
    }
  
    directionHandler.prototype = {
      /**
       * 监听页面的前进和后退事件。
       * 由于VUE Router已经执行了pushSate函数，所以这里可以直接监听popstate函数
       */
      addListener(){
        window.addEventListener('popstate',()=>{
          // let closePop = stateManager.closeTopPop();
          // this.setBackState(!closePop)
        })
      },
      /**
       * 后退动作
       */
      back(){
        window.sessionStorage.setItem('nextDirection', STATU.BACK);
      },
      /**
       * 前进动作
       */
      forward(){
        window.sessionStorage.setItem('nextDirection', STATU.FORWARD);
      },
      /**
       * 设置页面回退动作的状态
       * @param state true表示页面真的回退了，false表示是回退动作，但实际是关闭弹窗，页面没有回退
       */
      setBackState(state){
        window.sessionStorage.setItem('backState', state)
      },
      /**
       * 获取页面回退动作的状态
       * @param state true表示页面真的回退了，false表示是回退动作，但实际是关闭弹窗，页面没有回退
       */
      getBackState(){
        let state = window.sessionStorage.getItem('backState')
        return state == 'false' ? false : true
      },
      /**
       * 页面是否是回退状态
       * @return {boolean}
       */
      isBack(){
        return window.sessionStorage.getItem('nextDirection')==STATU.BACK
      },
      /**
       * 页面是否是前进状态
       * @return {boolean}
       */
      isForward(){
        return window.sessionStorage.getItem('nextDirection')==STATU.FORWARD
      }
    }
    return directionHandler
  })()
  export var directionHandler = new DirectionHandler()