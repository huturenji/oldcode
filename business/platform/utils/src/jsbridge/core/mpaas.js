/*
 * @Descripttion: ali mpaas jsbridge交互方法
 * @version: 1.0
 * @Author: yg
 * @LastEditors: Please set LastEditors
 * @Date: 2019-04-28 17:21:12
 * @LastEditTime: 2020-12-17 16:21:54
 */

//常量
const RELOADPAGE_FUNCTION = 'ReloadPageFunction';//刷新页面
const RESUME_FUNCTION = 'resume';//页面重新进入
const GOBACK_FUNCTION = 'goBackFunction';//页面回退
const OPENPAGE_FUNCTION = 'openPage';//打开页面
const OPENAPPLET_FUNCTION = 'OpenAppletFunction';//以小应用方式打开页面
const TITLEBARCOLOR = 4688622; //兆日蓝，加载页面之前就设置标题背景颜色
const BRIDGE_TYPE = 'mpaas';//mpaas bridge类型为mpaas
 /**
  * 方法转换，将notifyAppBack转换为back，将refreshPage转换为resume
  */
const TRANSFER_METHOD = {
  'notifyAppBack': 'back',//页面回退
  'refreshPage': 'resume',//页面刷新
  'goBackFunction_url':'popTo',//回退页面参数中有url
  'goBackFunction_backstep':'popWindow',//回退页面参数中没有url
  'openPage':'pushWindow',//打开页面
};

//直接调用函数，不走callhandler,key为app调用的函数名，value为mpaas.js对应的具名函数
const CALL_NAMED_FUNCTION = {
  [OPENAPPLET_FUNCTION]:'openApplet',//打开小应用
  [GOBACK_FUNCTION]:'goback',//页面回退
  [OPENPAGE_FUNCTION]:'openPage',//打开页面
  [RELOADPAGE_FUNCTION]:'reloadPage'//重新加载页面，一般为刷新操作
}

let mPaasAddEvents = {};
/**
 *  mpaas事件监听
 * @param {Object} event 事件
 */
let mPaasAddEventListener = event => {
    mPaasAddEvents[event.type]&&mPaasAddEvents[event.type](event);
}

//ali mpaas bridge
class mpaasbridge{
  constructor(){  
    this.BRIDGE_TYPE = BRIDGE_TYPE;  
    this.uniqueId = 1;
    this.bridge = window.AlipayJSBridge;
  }
  //初始化，获取mpaas jsbridge的AlipayJSBridge
  init(){
    const that = this;
    this.initResume();//初始化mpaas页面重新进入，主要用于多级页面回退
    this.setTitle();//初始化兼容IOS设置title方法
    return new Promise((res,rej)=>{//返回bridge对象
        if(that.bridge){
            res(that);
        }else{
            document.addEventListener('AlipayJSBridgeReady',()=>{
                that.bridge=window.AlipayJSBridge;
                res(that);
            }, false);
        }
    });
  }
  /**
   * 调用mpaas call方法
   * @param {string} type 调用类型
   * @param {object} data 调用参数
   * @param {function} callback 回调函数
   */
   mPaasCall(type,data,callback){
    this.bridge.call(type,data,(result)=>{
      let responseData = (result.mPaaSAdapterEvent||{}).responseData
      try {
        responseData = undefined!=responseData && ""!=responseData ? JSON.parse(responseData) : responseData;
        callback && callback(responseData);
      }catch (e) {
        console.error(e);
        callback && callback(responseData);
      }
    })
  }
  /**
  * 主动调用native方法，返回promise对象
  * @param {string} method 方法名
  * @param {object} param 参数
  * @param {string} type 类型 默认为mPaaSAdapterEvent
  */
  callHandler(method,param,type='mPaaSAdapterEvent'){
    const that = this;
    return new Promise((res,rej)=>{   
      if(CALL_NAMED_FUNCTION[method]){//打开页面或者以小应用方式打开页面，调用对应的函数，直接返回
        that.callFunction(CALL_NAMED_FUNCTION[method],param,res)
        return;
      } 
      let sendData = {handlerName: method,data: param};
      this.isAndroid() && Object.assign(sendData,{callbackId:'cb_' + `${this.uniqueId++}_${new Date().getTime()}`});
      this.mPaasCall(type, sendData,res)
    });
  }
  /**
 * 监听native调用函数，使用回调函数接受bridge返回的数据
 * @param {string} method 方法名
 * @param {function} callback 回调函数
 */
  registerHandler(method,callback){
    const that = this;
    method = that.transferMethod(method) || method;
    document.removeEventListener(method, mPaasAddEventListener);
    mPaasAddEvents[method] = function (event) {
        //兼容mPaas的resume方法
        (RESUME_FUNCTION===method)&&that.callResume(event,that.bridge);
        event.preventDefault && event.preventDefault();
        callback && callback(event.data);
    }
    document.addEventListener(method, mPaasAddEventListener);
  }
  /**
   * 打开页面
   * @param {Object} param 数据参数，打开页面的url
   * @param {function} callback 回调函数
   */
  openPage(param,callback){
    let type = this.transferMethod(OPENPAGE_FUNCTION);
    let sendData = {
      url: encodeURI(param),
      param: {
          readTitle: true,
          showOptionMenu: false,
          titleBarColor: TITLEBARCOLOR //兆日蓝，加载页面之前就设置标题背景颜色
      }
    }
    this.mPaasCall(type,sendData,callback)
  }
  /**
   * 小应用方式打开页面
   * @param {Object} param 数据参数
   * @param {function} callback 回调函数
   */
   openApplet(param,callback){
    const that = this;
    const method = RESUME_FUNCTION;
    let url = param.url;
    document.removeEventListener(method,mPaasAddEventListener);
    mPaasAddEvents[method] = function (event) {
      event.preventDefault && event.preventDefault();
      let loadData = event.data && event.data.loadData && JSON.parse(event.data.loadData) || {};
      //如果url上uniqueId与回调函数中的uniqueId相同，则将数据返回
      (that.getUrlParams(url).uniqueId==loadData.uniqueId) && callback && callback({
        responseData: event.data.loadData,
        ret: 0
      });
    }
    document.addEventListener(method, mPaasAddEventListener);
    //如果url中包含http或者是通配符$****$ 直接跳过，否则加上域名前缀 
    let toUrl = (url.startsWith('http')||url.startsWith(`$`))?url:window.Common_Config.originUrl + url;
    this.openPage(toUrl);
  }
  /**
   * 回退事件
   * @param {Object} param 数据参数
   * @param {function} callback 回调函数
   */
   goback(param,callback){
    const that = this;
    const method = GOBACK_FUNCTION;
    let callData = {};
    ('String'===Object.prototype.toString.call(param).match(/^\[object\s(.*)\]$/)[1])&&(param=JSON.parse(param));
    if(param.backSteps&&0<param.backSteps){//backSteps存在，执行popWindow方法
      callData = that.getBackStepsParam(method,param);
    }else {
        if(param.url){//url存在，执行popTo方法
          callData.type = that.transferMethod(method+'_url')||method; 
          callData.sendData = {urlPattern: param.url}
        }else{//url不存在，执行backSteps为1的popWindow方法
            param.backSteps = 1;
            callData = that.getBackStepsParam(method,param);
        }
    }
    this.mPaasCall(callData.type,callData.sendData,callback)
  }
  /**
   * 页面刷新
   * @param {object} param 参数
   * @param {function} callback 回调函数
   * @returns 
   */
   reloadPage(param,callback){
    window.location.reload();
  }
  /**
   * 获取url参数
   * @param {string} url 
   * @returns 
   */
  getUrlParams(url = window.location.href) {
    var regexP = /[^#&\?]+=[^#&\?]*/ig,
      res = {};
    var ms = url.match(regexP);
    if (ms) {
      for (var i = 0; i < ms.length; i++) {
        var arr = ms[i].split('=');
        res[arr[0]] = decodeURI(arr[1]);
      }
    }
    return res;
  }
  /**
 * 根据方法名执行方法
 * @param {string} method 方法名
 * @param {Object} param 参数
 * @param {function} callback 回调函数
 * @param {Object} content 函数执行上下文，默认为this
 */
  callFunction(method,param,callback,content=this){
    if(typeof content[method]==='function'){
      content[method].call(content,param,callback);
    }
  }
  /**
   * 获取gobackfunction backSteps下的参数
   * @param {*} method 
   * @param {*} param 
   */
  getBackStepsParam(method,param){
    let type = this.transferMethod(method+'_backstep')||method;
    let sendData = {
        data: {
            backSteps: param.backSteps-1,
            loadData: param.loadData
        }
    }
    return{type:type,sendData:sendData}
  }
  /**
   * 内部方法 判断是否AND机
   */
  isAndroid(){
    let  u = window.navigator.userAgent;
    return u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
  }
  /**
   * 内部方法，判断是否为伴正事
   */
  isBizMate(){
    let u = window.navigator.userAgent;
    return u.indexOf('Bizmate') >-1;
  }
  /**
   * 内部方法，转换方法,将app方法转换为mpaas方法，注意mpaas平台需要区分是伴正事Bizmate和T信
   * @param {string} method 
   */
  transferMethod(method){
    return TRANSFER_METHOD[method];
  }
  /**
   * 初始化resume方法
 * mPaas环境下，页面加载时，执行该方法，用在页面被调用唤醒时触发，主要使用场景为页面回退
 * 例如 A-B-C三个页面 场景为C回退到A，代码流程逻辑为：
 * 1、C调用 AlipayJSBridge.call('popWindow',{})，关闭C页面；
 * 2、C被关闭，B被唤醒，此时会触发addEventListener注册的resume方法，重新唤醒B页面；
 * 3、B页面resume方法有回调，会执行AlipayJSBridge.call('popWindow',{})，发现backSteps>0,关闭B页面；
 * 4、B被关闭，A被唤醒，此时会触发addEventListener注册的resume方法，重新唤醒A页面,发现backSteps=0，不作操作，流程完结；
 */
  initResume(){
    const that = this;
    mPaasAddEvents[RESUME_FUNCTION] = function (event) {
        that.callResume(event,window.AlipayJSBridge);
    };
    document.addEventListener(RESUME_FUNCTION, mPaasAddEventListener);
  }
  /**
   * 调用resume方法
   * @param {obejct} event
   * @param {obejct} bridge  AlipayJSBridge对象
   */
  callResume(event,bridge=window.AlipayJSBridge){
    if(!bridge){
        return
    }
    let backSteps = event.data && event.data.backSteps || 0;
    let loadData = event.data && event.data.loadData || '';
    if (backSteps > 0) {
        bridge.call('popWindow', {
            data: {
                backSteps: backSteps-1,
                loadData: loadData
            }
        });
    }
  }
  /**
   * 兼容mpaas IOS title修改
   */
  setTitle(){
    var titleEl = document.getElementsByTagName("title")[0];
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var MutationObserverConfig={
        childList: true,
        subtree: true,
        characterData: true
    };
    var observer=new MutationObserver(function(mutations){
        window.AlipayJSBridge&&window.AlipayJSBridge.call('setTitle', {
            title: document.title,
        });
    });
    observer.observe(titleEl,MutationObserverConfig);
  }
}

export const bridge = new mpaasbridge();

