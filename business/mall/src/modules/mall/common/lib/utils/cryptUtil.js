
import * as jsbridge from './snJsBridge'

class crypt{
    constructor(){}    
    
    /**
     * app加密
     * param参数，加密的内容
     */
    encryption(param){
        return new Promise(function(res, rej){
            let encryptionParam = {
                type: 0,
                keyType: 0,
                data: JSON.stringify(param)
            }
            //如果app加密方法报错，或者没有加密的方法，此时把原参数resolve出去
            jsbridge.EncryptionFunction(encryptionParam).then(data=>{
                if(!!data && 0 == data.ret && !!data.responseData.token){ //如果加密的app支持加密的function，并且返回的数据格式里面又token，此时是说明ok的
                    res({data: data.responseData, done: true})
                }else{
                    res({data: param, done: false})
                }
            }).catch(e=>{
                res({data: param, done: false})
            })
        });
    };

    /**
     * app解密
     * @param {*} data    请求参数
     * @param {*} param  是否加密以及解密所需token
     */
    decryption(data, param){
        return new Promise(function(res, rej){   
            let decryptionParam = {
                type: 0,
                keyType: 0,
                data: data,
                token: param.encryptionToken
            }
            jsbridge.DecryptionFunction(decryptionParam).then(resData=>{
                if(!!resData && 0==resData.ret && !!resData.responseData.result){
                    res(resData.responseData.result)
                }else{
                    rej(resData)
                }
            }).catch(e=>{
                rej(e)
            })           
        });
    };
    
}
export default new crypt();