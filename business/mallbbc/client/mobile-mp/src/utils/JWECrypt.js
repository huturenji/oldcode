
class JWECrypt {
    constructor(){
        // 头部
        this.header = { alg: "SM2", enc: "G128CBC-HG128", kid: '' };
        // 公钥
        this.publicKey = '04';
        this.config = {};
        this.modules = {}
    }

    initModules(){
        this.modules = require('./jwe-crypt')
        return this;
    }

    initJWECrypt(config = {}){
        //配置对象
        this.config = config;
        return this;
    }

    // 加密
    async encrypt(originalData) {
        let { header, publicKey } = this;
        const { sm2pubkey, kid } = this.config;
        header.kid = kid;
        publicKey = publicKey + sm2pubkey;
        let {CompactEncrypt, encoder} = this.modules;
        const jweAndcek = await new CompactEncrypt(encoder.encode(originalData)).setProtectedHeader(header).encrypt(publicKey);
        const encryptedData = jweAndcek["jwe"];
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
            console.warn('JSON.parse() error in decrypt function, param is: ' + data)
        }
        const encryptedData = this.transferResDecryptedData(data);
        let {compactDecrypt, decoder} = this.modules;
        const { plaintext } = await compactDecrypt(encryptedData, cek);
        const decryptedData = decoder.decode(plaintext);
        return decryptedData;
    }

    // 将接口返回的数据拼接成解密需要的格式
    transferResDecryptedData(data) {
        const { protected: protectedHeader, encrypted_key, iv, ciphertext, tag } = data;
        return protectedHeader + '.' + encrypted_key + '.' + iv + '.' + ciphertext + '.' + tag;
    }


}

export default new JWECrypt();


