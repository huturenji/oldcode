
import external from "./external";
import * as jsbridge from './snJsBridge'
import config from '../../config'; 
import { v4 as uuidv4 } from 'uuid';//引入uuid
class encryption{
    constructor(){
    }
    /**
     * 组装安全链路参数
     * @param {*} url     请求数据url
     * @param {*} data    请求参数
     * @param {*} paramObj  请求配置
     */    
    async getEncryptionParam(url,data,paramObj={}){
        let that = this;
        //是否加密判断，业务侧传递encryption优先，小应用默认encryption次之
        let encryption = false;
        if (!!config.BSL_CONF.BIZMATEVER){
            encryption = (false===paramObj.encryption || true===paramObj.encryption)?paramObj.encryption:config.BSL_CONF.DEFAULT_ENCRYPTION;
        }
        //解密app所需的token，加密时app返回，需要成对使用
        let encryptionToken = '';
        //参数统一处理，处理bsl代理安全链路所需参数
        let jsonStrHeaders = ["content-type:application/json;charset=UTF-8"];
        for(let key in paramObj.headers){
            jsonStrHeaders.push(key+':'+paramObj.headers[key])
        }
        let bslBody = {
            version:config.BSL_CONF.BODY_HTTP_VERSION,
            method:(paramObj.method || 'post').toUpperCase(),
            path:url,
            headers:jsonStrHeaders,
            reqid:uuidv4(),//UUID
            timestamp:parseInt(new Date().getTime()/1000)
        }
        //get请求使用param传参，post使用body
        if(config.BSL_CONF.GET_METHOD==bslBody.method.toUpperCase()){
            let dataParam = that.encodeParam(data);
            bslBody.param = that.genGetParam(bslBody,dataParam);
        }else{
            bslBody.body = JSON.stringify(data)
        }
        //如果需要加密
        if(encryption){
            let afterEncryptionData =  await that.priEncryptionFunction(bslBody);
            encryptionToken = afterEncryptionData.token;
            bslBody = JSON.parse(afterEncryptionData.result);
        }
        let bslRequestParam = {
            bslBody:bslBody,
            encryption:encryption,
            encryptionToken:encryptionToken,
            path:url,
        }
        return bslRequestParam;
    }
    /**
     * 一维obj值转义
     * param;参数
     */
    encodeParam(object){
        let resObj = {};
        for(var o in object){
            if (object.hasOwnProperty(o)) {
                resObj[o] = encodeURIComponent(object[o]);
            }
        }
        return resObj;
    }
    genGetParam(requestObj,data){
        if(config.BSL_CONF.GET_METHOD==requestObj.method.toUpperCase()){
            return external.joinObject(data,'&');
        }
        return null;
    }
    /**
     * app加密
     * param;参数
     */
    priEncryptionFunction(param){
        return new Promise(function(res,rej){
            let encryptionParam = {
                type:0,
                keyType:0,
                data:JSON.stringify(param)
            }
            jsbridge.EncryptionFunction(encryptionParam).then(data=>{
                if(!!data && 0==data.ret){
                    res(data.responseData)
                }else{
                    rej('encryption fail')
                }
            }).catch(e=>{
                rej('encryption fail')
            })
        });
    };

    /**
     * app解密
     * @param {*} data    请求参数
     * @param {*} bslRequestParam  是否加密以及解密所需token
     */
    priDecryptionFunction(data,bslRequestParam){
        return new Promise(function(res,rej){
            //非加密则直接返回
            try {
                if(bslRequestParam.encryption===false){
                    if(''==data){
                        res(data)
                    }else{
                        let saveLinkData = JSON.parse(data);
                        if(200==saveLinkData.code){
                            res(JSON.parse(saveLinkData.body))
                        }else{
                            rej(data)
                        }
                    }
                }else{
                    let decryptionParam = {
                        type:0,
                        keyType:0,
                        data:data,
                        token:bslRequestParam.encryptionToken
                    }
                    jsbridge.DecryptionFunction(decryptionParam).then(resData=>{
                        if(!!resData && 0==resData.ret && !!resData.responseData.result){
                            let decryptData = JSON.parse(resData.responseData.result);
                            if(200==decryptData.code){
                                res(JSON.parse(decryptData.body))
                            }else{
                                rej(resData)
                            }
                        }else{
                            rej(resData)
                        }
                    }).catch(e=>{
                        rej(e)
                    })
                }
            } catch (error) {
                rej(error) 
            }            
        });
    };
}
export default new encryption();