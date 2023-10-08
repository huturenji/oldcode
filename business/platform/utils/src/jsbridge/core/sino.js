/*
 * @Descripttion: sino jsbridge方法
 * @version: 1.0
 * @Author: yg
 * @LastEditors: Please set LastEditors
 * @Date: 2019-04-28 17:21:12
 * @LastEditTime: 2020-11-13 14:21:08
 */

const OPENPAGE_FUNCTION = 'openPage';//打开页面
const BRIDGE_TYPE = 'sino';//mpaas bridge类型为sino
/**
 * T信 jsbridge
 */
class sinobridge {
  /**
   * 构造方法
   */
  constructor(){
    this.BRIDGE_TYPE = BRIDGE_TYPE;;  
    this.bridge = window.WebViewJavascriptBridge;
    this.init = this.init.bind(this);
  }

  /**
   * 初始化，获取T信 jsbridge的WebViewJavascriptBridge 
   */
  init(){
    const that = this;
    return new Promise((res,rej)=>{
        if(that.bridge){
            res(that);
        }else{
            document.addEventListener('WebViewJavascriptBridgeReady',()=>{
                that.bridge=window.WebViewJavascriptBridge
                res(that);
            }, false);
        }
    });
  }

 /**
  * 主动调用native方法，返回promise对象
  * @param {string} method 方法名
  * @param {object} param 参数
  */
  callHandler(method, param){
    const that = this;
    return new Promise((res,rej)=>{
        if(OPENPAGE_FUNCTION==method){//打开页面方法，直接window.open 
            window.open(param);
            res();
            return;
        }
        that.bridge&&that.bridge.callHandler(method, param, function (responseData) {
            try {
                responseData = undefined!=responseData && ""!=responseData ? JSON.parse(responseData) : responseData
                res(responseData);
            }catch (e) {
                console.error(e);
                res(responseData);
            }
        });
    })
  }

  /**
   * 监听native调用函数，使用回调函数接受bridge返回的数据
   * @param {string} method 方法名
   * @param {*function callback 回调函数
   */
  registerHandler(method,callback){
    return this.bridge&&this.bridge.registerHandler(method, data => callback&&callback(data))
  }
}

export const bridge = new sinobridge();
