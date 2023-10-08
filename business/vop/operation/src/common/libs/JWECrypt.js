/*
 * @Author: huxudong
 * @Date: 2020-12-09 16:28:31
 * @LastEditTime: 2021-03-09 08:59:16
 * @Description: JWE加解密
 */
import { CompactEncrypt, compactDecrypt, encoder, decoder } from "sinosun-jwe";


class JWECrypt {
    constructor(config = {}){
        //配置对象
        this.config = config;
        // 头部
        this.header = { alg: "SM2", enc: "G128CBC-HG128", kid: '' };
        // 公钥
        this.publicKey = '04';
    }

    // 加密
    async encrypt(originalData) {
        // console.log('前端上传的明文数据:', originalData);
        let { header, publicKey } = this;
        const { sm2pubkey, kid } = this.config;
        header.kid = kid;
        publicKey = publicKey + sm2pubkey;
        const jweAndcek = await new CompactEncrypt(encoder.encode(originalData)).setProtectedHeader(header).encrypt(publicKey);
        const encryptedData = jweAndcek["jwe"];
        // console.log('前端上传的加密数据:', jweAndcek);
        return {
            data: this.transferReqEncryptedData(encryptedData),
            cek: jweAndcek["cek"]
        }
    }

    // 将前端加密的数据拼接成接口需要的格式
    transferReqEncryptedData(encryptedData) {
        const arr = encryptedData.split('.');
        const obj = {
            "protected": arr[0],
            "encrypted_key": arr[1],
            "iv": arr[2],
            "ciphertext": arr[3],
            "tag": arr[4]
        }
        return obj;
    }

    // 解密
    async decrypt(data, cek){
        try {
            if (typeof data == 'string'){
                data = JSON.parse(data);
            }
        } catch (error) {

        }
        const encryptedData = this.transferResDecryptedData(data);
        const { plaintext } = await compactDecrypt(encryptedData, cek);
        const decryptedData = decoder.decode(plaintext);
        // console.log('接口返回的明文数据:', decryptedData);
        return decryptedData;
    }

    // 将接口返回的数据拼接成解密需要的格式
    transferResDecryptedData(data) {
        const { protected: protectedHeader, encrypted_key, iv, ciphertext, tag } = data;
        return protectedHeader + '.' + encrypted_key + '.' + iv + '.' + ciphertext + '.' + tag;
    }


}

export default JWECrypt;


