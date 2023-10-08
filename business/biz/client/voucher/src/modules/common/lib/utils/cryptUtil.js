
import JWECrypt from './JWECrypt'
class Crypt{
    constructor(config){
        this.initJWECrypt(config)
    }    

    /**
     * 初始化加解密的工具类
     * @param {*} config 配置项
     * @memberof encryption
     */
    initJWECrypt(configs){
        this.JWECryptUtil = new JWECrypt(configs);
    }

    /**
     * app加密
     * param参数，加密的内容
     */
    encryption(param){
        let that = this;
        return new Promise(async resolve => {
            try{
                const {data, cek} = await that.JWECryptUtil.encrypt(JSON.stringify(param))
                resolve({
                    data,
                    done: true, 
                    cek
                })
            }catch(e){
                resolve({
                    data: param, 
                    done: false
                })
                console.warn('h5 encrypt request failed！', e);
            }
        });
    }

    /**
     * app解密
     * @param {*} data    请求参数
     * @param {*} param  是否加密以及解密所需token
     */
    decryption(data, encryptionToken){
        let that = this;
        return new Promise(async resolve => {   
            try{
                const result = await that.JWECryptUtil.decrypt(data, encryptionToken);
                resolve(result)
            }catch(e){
                resolve(data);
                console.error('bsl解密失败: ' + e)
            }
        });
    }
    
}
export default Crypt;