import utils from 'sino/common/utils';
import constant from 'sino/constant'
/*
 * @Descripttion: js与native进行交互入口文件
 * @version: 1.0
 * @Author: yg
 * @LastEditors: Please set LastEditors
 * @Date: 2019-04-28 17:21:12
 * @LastEditTime: 2020-11-13 14:21:44
 */

const TIMEOUT = 15000;//获取jsbridge对象超时时间
let _window = utils.getWindow();
_window.isJsbridge = false;//是否有jsbridge对象

function notBridgeError(message){
    return Object.assign({
        ret: constant.NO_BRIDGE_ERROR.RET,
        name: constant.NO_BRIDGE_ERROR.NAME,
        message: message || 'there is no jsbridge'
    })
}

let promisebridgeArr = [
    new Promise(res=>{
        setTimeout(()=> res(notBridgeError(`connect ${TIMEOUT}ms jsbridge timeout; time is ${new Date().getTime()}; there is no jsbridge`)),TIMEOUT);
    })
];


let requireAll = requireContext => requireContext.keys().map(requireContext);

//导入core下所有的js文件
let req = require.context('./core', false, /\.js$/);

//方法对应的提示语 对象
let methodTips = {
            init:{tips:'add file not have init fucntion'},
            callHandler:{tips:'add file not have callHandler fucntion'},
            registerHandler:{tips:'add file not have registerHandler fucntion'},
        }

requireAll(req).forEach(ele => {
    if(!ele.bridge){
        throw('add file not have export bridge object')
    }else{
        let tips = (checkNull(ele.bridge,methodTips));
        if(tips){
            throw(tips);
        }else{
            //将bridge中的int方法组成数组
            promisebridgeArr.push(ele.bridge.init());
        }
    }
});

/**
 * 判断对象是否包含元素，并返回提示语
 * @param {*} object 
 * @param {*} arr 
 */
function checkNull(object,methodTips={}){  
    for (const key in methodTips) {
        if (!object[key]) {
            return methodTips[key].tips;
        }
    }
    return null;
}

//初始化所有bridge，获取真实bridge
let initbridge = (function(){
    //只要有一个方法返回了jsbridge对象，则直接将该jsbridge对象返回
    return new Promise(res=>{
        const platform = utils.getPlatform()
        if(platform == constant.RUN_ENV.BROWSER
            || platform == constant.RUN_ENV.WECHAT_H5 
            || platform == constant.RUN_ENV.WECHAT_MINI_APP){
            res(notBridgeError('there is no jsbridge in normal browser'));
            return;
        }
        Promise.race(promisebridgeArr).then(
            bridge=>{
                _window.isJsbridge=!!bridge;
                res(bridge);
            },
            e=>{
                _window.isJsbridge=false;
                console.warn(e);
                res(notBridgeError('initbridge race error'));
            })
    });
})();


/**
 * 获取bridge的type类型，用来区分是sino bridge、mpaas bridge、tmf bridge、cherry bridge
 * sino表示sino bridge
 * mpaas表示mpaas bridge
 * tmf表示tmf bridge
 * cherry表示cherry bridge
 */
export const getBridgeType = ()=>{
    return new Promise((resolve,reject)=>{
        initbridge.then(bridge=>{
            resolve((bridge || {}).BRIDGE_TYPE)
        }).catch(e=>{
            if(e && e.name == 'jsbridge'){
                resolve(null);
            }else{
                reject(e);
            }
        });
    });
}
/**
 * 主动调用native方法
 * @param {string} method 方法名
 * @param {object} param 参数
 * @param {string} type 方法类型
 */
export const callHandler = (method,param,type)=>{
    return new Promise(resolve=>{
        initbridge.then((bridge={})=>{
            if(bridge.ret == notBridgeError().ret || !bridge.callHandler){
                resolve(notBridgeError(bridge.errorMsg || bridge.message));
                return;
            }
            bridge.callHandler(method,param,type).then((data)=>{
                resolve(data)
            });
        });
    })
}
/**
 * 监听native回调方法
 * @param {string} method 方法名称
 * @param {function} callback 回调函数
 */
export const registerHandler = (method,callback)=>{
    return new Promise(resolve=>{ 
        initbridge.then((bridge={}) => {
            if(bridge.ret == notBridgeError().ret || !bridge.registerHandler){
                resolve(notBridgeError(bridge.errorMsg || bridge.message));
                return;
            }
            bridge.registerHandler(method,callback);
            resolve()
        })
    })
};
