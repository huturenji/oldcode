
import extendUtils from "./utils.js";
import JWECrypt from './JWECrypt'
import config from './config'; //相关的配置选项
import { v4 as uuidv4 } from 'uuid';//引入uuid
class encryption{
    constructor(){
        this.JWECryptUtil = {};
        this.initBslConfig();
    }

    /**
     * 初始化配置文件
     */
    async initBslConfig(){
        let bslConfig = await extendUtils.getBslConfig(); //获取bslConfig配置文件
        this.initJWECrypt(bslConfig); //初始化加解密工具
        return bslConfig;
    }

    /**
     * 初始化加解密的工具类
     * @param {*} config 配置项
     * @memberof encryption
     */
    initJWECrypt(configs){
        this.JWECryptUtil = new JWECrypt(configs.management);
    }
    
    /**
     * 组装请求参数参数
     * @param {*} url     请求数据url
     * @param {*} data    请求参数
     * @param {*} paramObj  请求配置
     */     
    async getRequestObj(url, data,paramObj = {}){
        let that = this;
        let bslConfig = await this.initBslConfig(); //获取bsl
        let requestObj = {
            param: {}, //参数
            fun: '', //方法名
            useBsl: bslConfig.management.default_bsl_switch //运营端是否启用bsl
        };

        //判断业务接口是否使用安全链路，优先级最高
        if (!!paramObj.noUseBsl){
            requestObj.useBsl = false;
        }

        if (requestObj.useBsl){
            requestObj.fun = 'bslRequest';
            //使用安全链路
            requestObj.param = await that.getBslParam(url, data, paramObj, bslConfig);
            requestObj.param.baseURL = bslConfig.bslService;

        } else {
            requestObj.fun = 'httpRequest';
            requestObj.param = {
                url: url,
                data: data,
                method: paramObj.method || 'post',//默认方法为post
                timeout: paramObj.timeout,
                headers: paramObj.headers,
                responseType: paramObj.responseType || 'json',
                async: paramObj.async || true
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
        //是否加密判断，业务侧传递encryption优先，小应用默认encryption次之
        let encryptions = true;
        encryptions = (false===paramObj.encryption || true===paramObj.encryption) ? paramObj.encryption : bslConfig.management.default_encryption_switch;

        //参数统一处理，处理bsl代理安全链路所需参数
        let jsonStrHeaders = ["content-type:application/json;charset=UTF-8"];
        for (let key in paramObj.headers){
            jsonStrHeaders.push(key+':'+paramObj.headers[key])
        }
        let bslBody = {
            version: config.BSL_CONF.BODY_HTTP_VERSION,
            method: (paramObj.method || 'post').toUpperCase(),
            path: url,
            headers: jsonStrHeaders,
            reqid: uuidv4(),//UUID
            timestamp: parseInt(new Date().getTime()/1000)
        }
        //get请求使用param传参，post使用body
        if (config.BSL_CONF.GET_METHOD == bslBody.method.toUpperCase()){
            let dataParam = that.encodeParam(data);
            bslBody.param = that.genGetParam(bslBody, dataParam);
        } else {
            bslBody.body = JSON.stringify(data)
        }
        //如果需要加密
        let cek = null;
        if (encryptions){   
            let cryptConfig = await that.JWECryptUtil.encrypt(JSON.stringify(bslBody));
            bslBody = cryptConfig.data;
            cek = cryptConfig.cek;
        }
        let bslRequestParam = {
            bslBody: bslBody,
            encryption: encryptions,
            path: url,
            cek: cek
        }
        return bslRequestParam;
    }

    /**
     * 一维obj值转义
     * param;参数
     */
    encodeParam(object){
        let resObj = {};
        for (var o in object){
            if ( Object.prototype.hasOwnProperty.call(object, o)) {
                
                resObj[o] = encodeURIComponent(object[o]);
            }
        }
        return resObj;
    }

    genGetParam(requestObj,data){
        if (config.BSL_CONF.GET_METHOD==requestObj.method.toUpperCase()){
            return extendUtils.joinObject(data,'&');
        }
        return null;
    }


    /**
     * app解密
     * @param {*} data    请求参数
     * @param {*} bslRequestParam  是否加密以及解密所需token
     */
    analysisParam(data, bslRequestParam){
        let that = this;
        return new Promise(async (resolve, reject) => {
            try {
                if ('' == data){
                    resolve(data)
                } else {
                    let saveLinkData = !!bslRequestParam.encryption ? JSON.parse(await that.JWECryptUtil.decrypt(data, bslRequestParam.cek)) : JSON.parse(data);
                    if (200 == saveLinkData.code){
                        resolve(JSON.parse(saveLinkData.body))
                    } else {
                        reject(data)
                    }
                }
            } catch (error) {
                reject(error) 
            }            
        });
    }
}
export default new encryption();