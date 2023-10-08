import utils from 'sino/common/utils';
import WebOAJsBridge from 'sino/bridge/lib/bridge/webOA'
import constant from 'sino/constant'
/*
 * @Descripttion: webOA jsbridge方法
 */
const BRIDGE_TYPE = constant.BRIDGE_TYPE.WEBOA;//mpaas bridge类型为sino
/**
 * webOA jsbridge
 */
class WebOABridge {
    /**
     * 构造方法
     */
    constructor() {
        this.BRIDGE_TYPE = BRIDGE_TYPE;
        this.bridge = new WebOAJsBridge();
        this.init = this.init.bind(this);
    }
    
    /**
     * 初始化
     */
    init() {
        let that = this;
        return new Promise(resolve=>{
            if(utils.isInWebOA()){
                const e = new Event('WebOAJSBridgeReady');
                window.dispatchEvent(e);
                resolve(that);
            }
        });
    }


    /**
     * 主动调用native方法，返回promise对象
     * @param {string} method 方法名
     * @param {object} param 参数
     */
    callHandler(method, param) {
        //方法重载
        let override = overrideMethods(this.bridge);
        if(override[method]){
            return override[method](param);
        }
        return this.bridge.callHandler(method, param)
    }

    /**
     * 监听native调用函数，使用回调函数接受bridge返回的数据
     * @param {string} method 方法名
     * @param {*function callback 回调函数
     */
    registerHandler(method, callback) {
        this.bridge.registerHandler(method, callback)
    }

    
}

function fillOrigin(url){
    if(url.startsWith('http://') || url.startsWith('https://')){
        return url;
    }
    return location.origin + (url.startsWith('/') ? url : '/'+url);
}

/**
 * 定制某些bridge函数，返回一个对象，对象名=jsBridge接口名
 * @param {*} bridge 
 * @returns 
 */
let overrideMethods = function(bridge){
    if(!bridge){
        return {}
    }
    const targetPrefix = 'bplus'
    return {
        openPage: param=>{

            return bridge.callHandler('OpenAppletFunction', {
                url: fillOrigin(param),
                target: targetPrefix + "_blank"
            })
        },
        
        OpenAppletFunction: param=>{
            param.target = targetPrefix + "_blank"
            param.url = fillOrigin(param.url)
            bridge.sendMsg('OpenAppletFunction', param)
            return new Promise(resolve => {
                let handler = e => {
                    if (!e.data || e.data.type !== WebOAJsBridge.PARENT_MSG_NAME) return;
                    let method = e.data.handler;
                    if (method !== "refreshPage") return;
                    window.removeEventListener("message", handler)
                    let param = e.data.data;
                    try {
                        param = JSON.parse(param);
                    } catch (e) {}
                    if (!param.backSteps) {
                        resolve({
                            ret: 0,
                            responseData: param.loadData
                        });
                    }
                }
                window.addEventListener("message", handler)
            })
        },

        OpenWebViewFunction: param=>{
            param.url = fillOrigin(param.url)
            return bridge.callHandler('OpenAppletFunction', {
                ...param,
                target: targetPrefix + "_blank"
            })
        },

        goBackFunction: param=>{
            try{
                param = JSON.parse(param)
            }catch(e){}
            let {backSteps, loadData} = param;
            return bridge.callHandler("CloseAppletFunction", { backSteps, loadData })
        },

        RegisterMenuFunction: menuList => {
            bridge.sendMsg("registerMenu", menuList);
            menuList.forEach(element => {
                if (typeof element.func === "function") {
                    bridge.webMethodMap[element.menuId] = element.func;
                }
            });
            return Promise.resolve()
        }
    }
}



export const bridge = new WebOABridge();
