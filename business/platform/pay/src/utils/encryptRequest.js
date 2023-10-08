
/**
 * 该方法为处理请求的参数的方法
 * 目前有两种fun httpRequest和bslRequest
 */

import Crypt from './cryptUtil'; 
import { v4 as uuidv4 } from 'uuid';//引入uuid
import store from '../store'

export default class EncryptRequest {
    constructor(config){
        this.config = config;
    }
    /**
     * 组装请求参数参数
     * @param {*} url     请求数据url
     * @param {*} data    请求参数
     * @param {*} paramObj  请求配置
     */     
    async getRequestObj(url, data, paramObj={}){
        let that = this;
        let bslConfig = this.config.bslConfig; //获取bsl配置文件
        this.cryptUtil = new Crypt({sm2pubkey: bslConfig.app.sm2pubkey, kid: bslConfig.app.kid})
        let requestObj = {};
        //是否使用安全链路
        if(!!bslConfig && !paramObj.noUseBsl){
            requestObj = {
                param: {}, 
                fun: '', 
                useBsl: bslConfig.app.default_bsl_switch
            };
        }else{
            requestObj.useBsl = false;
        }
        if(requestObj.useBsl){
            requestObj.fun = 'bslRequest';
            //使用安全链路
            requestObj.param = await that.getBslParam(url, data, paramObj, bslConfig);
            requestObj.param.baseURL = bslConfig.bslService;
            
        }else{
            requestObj.fun = 'httpRequest';
            requestObj.param = {
                url:url,
                data:data,
                method:paramObj.method || 'post',
                timeout:paramObj.timeout,
                headers:paramObj.headers,
                responseType:paramObj.responseType || 'json'
            }
        }
        return requestObj;
    }    

    /**
     * 组装安全链路参数
     * @param {*} url     请求数据url
     * @param {*} data    请求参数
     * @param {*} paramObj  请求配置
     */    
    async getBslParam(url, data, paramObj={}, bslConfig={}){
        let that = this;
        //使用bsl时不要域名
        try{
            let urlObj = new URL(url);
            url = urlObj.pathname + urlObj.search + urlObj.hash
        }catch(e){}
        //是否加密判断，业务侧传递encryption优先，小应用默认encryption次之
        let encryption = false;
        if (!!this.config.bslConfig.BIZMATEVER){ //此处为了处理老T信（旧的银行）不走加密方法
            encryption = (false===paramObj.encryption || true===paramObj.encryption) ? paramObj.encryption : bslConfig.app.default_encryption_switch;
        }
        //解密app所需的token，加密时app返回，需要成对使用
        let encryptionToken = '';
        //参数统一处理，处理bsl代理安全链路所需参数
        let jsonStrHeaders = ["content-type:application/json;charset=UTF-8"];
        for(let key in paramObj.headers){
            jsonStrHeaders.push(key+':'+paramObj.headers[key])
        }
        let bslBody = {
            version:this.config.bslConfig.BODY_HTTP_VERSION,
            method:(paramObj.method || 'post').toUpperCase(),
            path:url,
            headers:jsonStrHeaders,
            reqid:uuidv4(),//UUID
            timestamp:parseInt(new Date().getTime()/1000)
        }
        //get请求使用param传参，post使用body
        if("GET"==bslBody.method.toUpperCase()){
            let dataParam = that.encodeParam(data);
            bslBody.param = that.genGetParam(bslBody, dataParam);
        }else{
            bslBody.body = JSON.stringify(data)
        }
        //如果需要加密
        if(encryption){
            let {data: bslData, done, cek} = await this.cryptUtil.encryption(bslBody);
            encryption = done;
            if(!!done){ //done为true说明app端掉用jsbridge方法成功，并且正常返回。
                encryptionToken = cek;
                bslBody = bslData;
            }
        }
        let bslRequestParam = {
            bslBody: bslBody,
            encryption: encryption,
            encryptionToken: encryptionToken,
            path: url,
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
        if("GET"==requestObj.method.toUpperCase()){
            return joinObject(data,'&');
        }
        return null;
    }

    /**
     * 一维obj值转义
     * @param data 返回的数据
     * @param param 参数
     */
    analysisParam(data, param){
        return new Promise(async (res,rej) => {
            //非加密则直接返回
            try {
                if(param.encryption === false){ //非加密
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
                    let resData = await this.cryptUtil.decryption(data, param.encryptionToken)
                    let decryptData = JSON.parse(resData);
                    if(200 == decryptData.code){
                        res(JSON.parse(decryptData.body))
                    }else{
                        rej(resData)
                    }
                }
            } catch (error) {
                rej(error) 
            }  
        });
    }
 
}

function joinObject(object,symbol){
    let objStr = '';
    for(var o in object){
        if (object.hasOwnProperty(o)) {
            objStr += `${symbol}${o}=${object[o]}`;
        }
    }
    return objStr.slice(1);
}
