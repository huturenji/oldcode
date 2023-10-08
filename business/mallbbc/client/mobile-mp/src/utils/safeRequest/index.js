
/**
 * 该方法为处理请求的参数的方法
 * 目前有两种fun httpRequest和bslRequest
 */

import BSL_CONF from './config'; 
import crypt from './crypt'; 
export const bslConfig = BSL_CONF.JSON_CONF;

//当前环境是否支持加解密
const isBoolean = value => Object.prototype.toString.call(value) == '[object Boolean]'
const isString = value => Object.prototype.toString.call(value) == '[object String]'

class SafeRequest {
    constructor(){
        this.enableBsl = bslConfig.app.default_bsl_switch;
        this.encryption = bslConfig.app.default_encryption_switch;
        this.cryptUtil = null;
    }

    /**
     * 组装请求参数参数
     * @param {*} url     请求数据url
     * @param {*} data    请求参数
     * @param {*} httpConfig  请求配置
     */     
    async packageParams(requestParams, config){
        let {enableBsl} = config;
        this.enableBsl = isBoolean(enableBsl) ? enableBsl : this.enableBsl;//优先级：业务配置 => 通用配置
        //是否使用安全链路
        if (this.enableBsl === false){
            return requestParams
        }
        //使用安全链路
        let {bslBody, encryptionToken} = await this.getBslParam(requestParams, config);
        return {
            url: (bslConfig.bslService || '') + BSL_CONF.PATH,
            method: BSL_CONF.METHOD,
            data: bslBody,
            //请求参数对象中通过encryption来标识是否需要加密，默认为true
            header: this.encryption === false ? BSL_CONF.NO_ENCRYTION_HEADERS : BSL_CONF.ENCRYTION_HEADERS,
            encryptionToken
        }
    }    

    /**
     * 解析bsl response
     * @param data 返回的数据
     * @param param 参数
     */
    unpackageParams(data, {encryptionToken}){
        return new Promise(async (resolve,reject) => {
            try {
                //非bsl则直接返回
                if (!this.enableBsl){
                    resolve(data);
                    return;
                }
                if (this.encryption !== false && !!data){ //非加密
                    this.cryptUtil = crypt.initJWECrypt({sm2pubkey: bslConfig.app.sm2pubkey, kid: bslConfig.app.kid});
                    data = await this.cryptUtil.decryption(data, encryptionToken);
                }
                if (!data){
                    resolve(data)
                } else {
                    let saveLinkData = isString(data) ? JSON.parse(data) : data;
                    if (200 == saveLinkData.code){
                        resolve(JSON.parse(saveLinkData.body))
                    } else {
                        reject(saveLinkData)
                    }
                }
            } catch (error) {
                reject(error) 
            }            
        });
    }


    /**
     * 组装安全链路参数
     * @param {*} data    请求参数
     * @param {*} httpConfig  请求配置
     */    
    async getBslParam({url, data, method, header}, {encryption}){
        let that = this;
        //优先使用业务侧的开关
        if (isBoolean(encryption)){ 
            this.encryption = encryption;
        }
        //参数统一处理，处理bsl代理安全链路所需参数
        let contentType = '';//原始请求中的content-type
        header && Object.keys(header).some(key => {
            if (key.toUpperCase() == 'CONTENT-TYPE'){
                contentType = header[key]
                delete header[key];//不是用header中的content-type，下面统一处理
                return true;
            }
            return false;
        })
        //是否是form表单
        let isFormData = contentType.indexOf('application/x-www-form-urlencoded') > -1
        //bsl中参数的header必须是数组
        let jsonStrHeaders = [];
        for (let key in header){
            jsonStrHeaders.push(key + ':' + header[key])
        }
        //非form表单使用json
        if (!!isFormData){
            jsonStrHeaders.push("content-type:application/x-www-form-urlencoded;charset=UTF-8")
        } else {
            jsonStrHeaders.push("content-type:application/json;charset=UTF-8")
        }
        let bslBody = {
            path: url,
            version: BSL_CONF.BODY_HTTP_VERSION,
            method: (method || 'post').toUpperCase(),
            headers: jsonStrHeaders,
            reqid: that.wxuuid(),//UUID
            timestamp: parseInt(new Date().getTime()/1000)
        }
        //get请求使用param传参，post使用body
        if (bslBody.method.toUpperCase() == 'GET'){
            let dataParam = this.encodeParam(data);
            //bsl情况下，参数需要放到url后面，否则服务端拿不到
            bslBody.path += `${url.indexOf('?') > -1 ? '&' : '?'}${this.genGetParam(dataParam)}`
        } else {
            //若是form表单的参数，body格式为&拼接的key-value的字符串;否则用json字符串
            bslBody.body = isFormData ? this.genGetParam(data) : isString(data) ? data : JSON.stringify(data);
        }
        //如果需要加密
        let encryptionToken = '';//解密app所需的token，加密时app返回，需要成对使用
        if (this.encryption){
            that.cryptUtil = crypt.initJWECrypt({sm2pubkey: bslConfig.app.sm2pubkey, kid: bslConfig.app.kid});
            let {data: bslData, done, cek} = await this.cryptUtil.encryption(bslBody);
            this.encryption = done;
            if (!!done){ //done为true说明app端掉用jsbridge方法成功，并且正常返回。
                encryptionToken = cek;
                bslBody = bslData;
            }
        }
        let bslRequestParam = {
            bslBody,
            encryptionToken: encryptionToken
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
            if (Object.prototype.hasOwnProperty.call(object, o)) {
                resObj[o] = encodeURIComponent(object[o]);
            }
        }
        return resObj;
    }

    genGetParam(data){
        let objStr = '';
        for (var o in data){
            if (Object.prototype.hasOwnProperty.call(data, o)) {
                objStr += `&${o}=${data[o]}`;
            }
        }
        return objStr.slice(1);
    }

    // 生成UUID
    wxuuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        
        var uuid = s.join("");
        return uuid;
    }
}
export default new SafeRequest();