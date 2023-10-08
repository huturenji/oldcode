/*
 * @Descripttion: 腾讯 jsbridge方法
 * @version: 1.0
 * @Author: yg
 * @LastEditors: Please set LastEditors
 * @Date: 2019-04-28 17:21:12
 * @LastEditTime: 2020-11-13 14:21:24
 */

const OPENPAGE_FUNCTION = 'openPage';//打开页面
const BRIDGE_TYPE = 'tmf';//tmf bridge类型为tmf

let tmfAddEvents = {};
/**
 * tmf监听事情  避免document.removeEventListener方法失效，该方法remove的是同一句柄的函数，并不是同名的函数
 * @param {*} event 
 */
let tmfAddEventListener= function(event){
    tmfAddEvents[event.type]&&tmfAddEvents[event.type](event);
}

//腾讯 tmf bridge
class tmfbridge{
    /**
     * 构造方法
     */
    constructor(){
        this.BRIDGE_TYPE = BRIDGE_TYPE; 
        this.uniqueId = 1;
        this.bridge = window.TMFJSBridge;
        this.init = this.init.bind(this);
    }
    /**
     * 初始化 获取TMF jsbridge的TMFJSBridge
     */
    init(){
        const that = this;
        return new Promise((res,rej)=>{
          if(that.bridge){
                res(that);
            }else{
                document.addEventListener('TMFJSBridgeReady',()=>{
                    that.bridge=window.TMFJSBridge;
                    res(that)
                }, false);
            }
        });
    }
    /**
     * 主动调用native方法，返回promise对象
     * @param {string} method 方法名
     * @param {object} param 参数
     * @param {string} type 类型 tmfAdapterEvent
     */
    callHandler(method, param,type="tmfAdapterEvent"){
        const that = this;
        return new Promise((res,rej)=>{
            let callData = that.getCallParam(method,param,type);
            window.TMFJSBridge.invoke(callData.type, callData.sendData, function(result) {
                let responseData = result.responseData;
                try {
                    responseData = undefined!=responseData && ""!=responseData ? JSON.parse(responseData) : responseData
                    res(responseData);
                }catch (e) {
                    console.error(e);
                    res(responseData);
                }
            });
        });
    }
    /**
     * 
     * @param {string} method 
     * @param {Object} param 
     * @param {string} type 
     */
    getCallParam(method, param,type){
        let sendData = {handlerName: method,data: param};
        this.isAndroid() && Object.assign(sendData,{callbackId:'cb_' + `${this.uniqueId++}_${new Date().getTime()}`});
        if(OPENPAGE_FUNCTION===method){//打开页面
            type = method;
            sendData = {
                url: param
            }
        }
        return {type:type,sendData:sendData}
    }
    /**
     * 监听native调用函数，使用回调函数接受bridge返回的数据
     * @param {string} method 方法名
     * @param {*function callback 回调函数
     */
    registerHandler(method,callback){
        document.removeEventListener(method, tmfAddEventListener);
        tmfAddEvents[method] = function(e) { 
            callback && callback(e.tmf&&e.tmf.data);
        }
        document.addEventListener(method, tmfAddEventListener);
    }
    /**
     * 内部方法，不需要外部使用，判断是否AND机
     */
    isAndroid(){
        let  u = window.navigator.userAgent;
        return u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    }
}
export const bridge = new tmfbridge();

