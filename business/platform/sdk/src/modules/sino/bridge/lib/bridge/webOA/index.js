import utils from "sino/common/utils";

let tempCert = '';//临时凭证，用于区分是否是自己发送的message
export default class WebOAJsBridge{
	constructor() {
		this.uniqueId = 1;//register回调的序列号
		this.webMethodMap = {};//存储register的回调函数
        this.forwardMethodMap = {};//转发消息的容器
		this.addOAMessageListener();//监听父容器的postMessage消息
	}

    static PARENT_MSG_NAME = Object.freeze('weboaPostMessage')
    static CHILD_MSG_NAME = Object.freeze('childPostMessage')
    static FORWARD_MSG_NAME = Object.freeze('forwardPostMessage')

    /**
     * 监听父容器的postMessage消息
     */
    addOAMessageListener() {
		window.addEventListener("message", e => {
            if(!e.data){
                return;
            }
            //处理子窗口（非自己）转发的消息
            if(e.data.type == WebOAJsBridge.FORWARD_MSG_NAME && tempCert != e.data.tempCert){
                this.forwardMethodMap[e.data.forwardId] = e.data.windowName;//记住消息来源
                this.sendMsg(e.data.handler, e.data.data)
                return;
            }
            //过滤非父窗口消息
            if(e.data.type !== WebOAJsBridge.PARENT_MSG_NAME || (utils.isNotEmpty(tempCert) && tempCert == e.data.tempCert)){
                return;
            }
			let callbackId = e.data.handler,
				data = e.data.data;
			try {
				data = JSON.parse(data);
			} catch (error) {}

            //收到父框架消息后，判断是否是转发的消息。如果是，则向下转发，本window不处理
            let windowName = this.forwardMethodMap[callbackId]
            if(windowName){
                tempCert = performance.now();
                self.frames[windowName].postMessage(
                    {
                        type: WebOAJsBridge.PARENT_MSG_NAME,
                        handler: callbackId,
                        data: e.data.data,
                        tempCert: tempCert
                    },
                    location.origin
                );
                return;
            }

            if (callbackId === "refreshPage") {
                /**===【一次关闭多个窗口】的逻辑说明===**/
                /* 1. webOA对CloseAppletFunction的执行如下：
                    a. 关闭当前小应用；
                    b. 将data.backSteps--后发送postMessage(refreshPage, {backSteps, loadData})（这是伪码）消息给子页面
                * /
                /* 2. 子页面（如果注册了refreshPage）接收到refreshPage通知后，如果backSteps仍大于0，则继续CloseAppletFunction（循环上述逻辑执行关闭页面），
                    *  直到backSteps=0时，执行当前页面的回调函数（如果有）
                */
                if (data.backSteps > 0) {
                    this.sendMsg("CloseAppletFunction", { backSteps: data.backSteps, loadData: data.loadData });
                    return;
                }
            }
			if (typeof this.webMethodMap[callbackId] === "function") {
				try {
					this.webMethodMap[callbackId](data);
				} catch (error) {
					console.log(`function ${e.data.handler}报错`);
				}
			}
		});
	}

    needForwardMsg(){
        return !utils.isInWebOA(false)
    }

    /**
	 * 通知父页面
	 * @param {*} method
	 * @param {*} data
	 */
	sendMsg(method, data) {
        //当前window不在webOA中，则说明有嵌套iframe，需要父iframe转发消息
        if(this.needForwardMsg()){
            //注册app按钮的消息不转发。子页面不应覆盖父页面的这些函数
            //TODO 这里未想出更好的处理方式，先硬编码
            if (method !== "refreshPage" 
                && method !== 'notifyAppBackEvent'
                && method !== "notifyAppBack" 
                && method !== 'registerMenu' 
                && method !== 'RegisterMenuFunction' 
                && method !== 'clickMenuCallBack'){
                    tempCert = performance.now();
                    parent.postMessage(
                        {
                            type: WebOAJsBridge.FORWARD_MSG_NAME,
                            handler: method,
                            data: data,
                            forwardId: data.callbackId || (data.data || {}).callbackId,
                            windowName: window.name,
                            tempCert: tempCert
                        },
                        location.origin
                    );
            }
            return;
        }
		let msg = {
			data: data,
			source: window.name
		};
		parent.postMessage(
            {
                type: WebOAJsBridge.CHILD_MSG_NAME,
				handler: method,
				data: JSON.stringify(msg)
			},
			"*"
		);
	}

    callHandler(handlerName, data){
        return new Promise(resolve => {
            this.registerHandler(handlerName, resolve, data);
        })
    }

    /**
	 * 注册监听app的事件
	 * @param {*} method
	 * @param {*} callback
	 */
	registerHandler(method, callbackFuntion, data = {}) {
		//注册刷新回退事件
        let forward = this.needForwardMsg() ? 'forward_' : ''
		let callbackId = `${forward}${method}_${this.uniqueId++}_${+new Date()}`;
		if (method === "refreshPage" || method === "notifyAppBack") {
			callbackId = method;
		}
		let param = {
				data: data,
				callbackId: callbackId,
        };
        //适配webOA中的数据结构。webOA中，registerHandler和callHandler的callbackId所在层级不同
        if(utils.isObject(data)){
            param = Object.assign({}, param, data)
        }
        this.sendMsg(method, param);
		// 缓存callback事件
		this.webMethodMap[callbackId] = callbackFuntion;
	}
}