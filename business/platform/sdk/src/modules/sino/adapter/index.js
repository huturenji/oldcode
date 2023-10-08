import {channelInterceptor} from 'sino/adapter/channel'
import * as polyfillAdapter from 'sino/adapter/polyfill'
import constant from 'sino/constant'

export {getChannelMapper, getAppNameByChannelId} from 'sino/adapter/channel'

/**
 * 渠道adapter代理
 * @param {*} obj 
 */
export function adapter(obj){
    return new Proxy(obj, {
        get(target, property, receiver) {
            if(target.hasOwnProperty(property)){
                try{
                    let newValue = new Proxy(target[property], {
                        apply: async function(method, thisArg, argumentsList) {
                            let proceed = false;
                            //是否继续执行原函数
                            let proceedFunc = {proceedDefault(){
                                proceed = true;
                            }}
                            let result = await channelInterceptor.call(thisArg, property, method, argumentsList, proceedFunc)
                            if(proceed){
                                return method.apply(thisArg, argumentsList);
                            }else{
                                return result
                            }
                        }
                    })
                    return newValue
                }catch(e){
                    console.warn(e);
                }
            }
            return target[property];
        }
    })
}

export function polyfill(obj){
    return new Proxy(obj, {
        get(target, property, receiver) {
            if(target.hasOwnProperty(property)){
                try{
                    let newValue = new Proxy(target[property], {
                        apply: async function(method, thisArg, argumentsList) {
                            let result;
                            try{
                                result = await method.apply(thisArg, argumentsList);
                            }catch(e){
                                //一般出现在registerHandler失败时
                                if(e && e.name == 'jsbridge'){
                                    result = e;
                                }
                            }
                            if((result || {}).ret == constant.NO_BRIDGE_ERROR.RET){
                                if(polyfillAdapter[property]){
                                    result = polyfillAdapter[property].apply(thisArg, argumentsList)
                                }
                            }
                            return result
                        }
                    })
                    return newValue
                }catch(e){
                    console.warn(e);
                }
            }
            return target[property];
        }
    })
}