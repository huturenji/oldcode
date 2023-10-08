import extendUtils from 'utils';
import constant from 'constant';

class AuthHandler {
    constructor(config){
        this.config = config;
        this.loginKcConfig = {};
        this.tokenInterval = null;
    }

    /**
     * 初始化参数
     */
    async init(){
        //获取T信用户信息
        this.tchatUserInfo = sinosdk.sino.isInSinoEnv ? await this.getTchatUserInfo() : {};
        //获取渠道信息
        this.channelId = sinosdk.sino.isInSinoEnv ? await this.getChannelId() : '';
        //获取keycloak的关键参数，必须由外部传入
        await this.setKeycloakParams();
        //使用T信用户id和企业id拼接得到缓存key的前缀
        this.primaryKey = this.getPrimaryKey();
        //是否已登陆（有token且未过期）
        this.logined = this.isTokenAvaliable();
        if(this.logined){
            this.token = this.getCacheToken();
        }
    }
    getPrimaryKey(){
        if(typeof this.config.primaryKey == 'function'){
            return this.config.primaryKey({userId: this.tchatUserInfo.uaId, cpyId: this.tchatUserInfo.cpyId, channelId: this.channelId})
        }
        if(!!this.config.primaryKey){
            return this.config.primaryKey;
        }
        let prefix = this.tchatUserInfo?.uaId
        return constant.STORAGE_PREFIX + prefix;//加上clientId是因为多个client可能使用同一个域名，这会导致缓存串了
    }
    /**
     * 获取渠道id
     */
    async getChannelId(){
        try{
            if(this.channelId){
                return this.channelId;
            }
            if(this.config.channelId){
                return this.config.channelId
            }
            let data = await sinosdk.sino.getChannelId();
            return data;
        }catch(e){
            console.error(e);
            throw '获取channelId失败: '+e
        }
    }
    /**
     * 获取T信用户信息
     */
    getTchatUserInfo(){
        return new Promise(resolve=>{
            sinosdk.sino.getUserInfo().then(res=>{
                resolve({
                    uaId: extendUtils.getNonnullValue(res.UAId),
                    cpyId: extendUtils.getNonnullValue(res.cpyId),
                    cpyName: extendUtils.getNonnullValue(res.cpyName),
                    userName: extendUtils.getNonnullValue(res.uName),
                    userPhone: extendUtils.getNonnullValue(res.uPhone)
                })
            }).catch(e=>{
                console.error(e);
                resolve({})
            })
        })
    }

    /**
     * 用户是否已登陆
     * @param minValidity 还有多久过期，单位秒
     */
    isTokenAvaliable(minValidity = 90, token = this.getCacheToken()){
        try{
            if(extendUtils.isNotEmpty(token)){
                return !extendUtils.isTokenExpired(extendUtils.decodeToken(token), minValidity)
            }
            return false;
        }catch(e){
            console.error(e);
            return false;
        }
    }


    /**
     * 初始化，获取登陆所需的参数。
     */
    async setKeycloakParams(){
        this.loginKcConfig = await this.getLoginConfig(this.config.loginKcConfig);
    }

    async getUserToken(){
        let that = this;
        if(this.logined){
            return this.token;
        }
        let idToken = this.config.idToken || (await sinosdk.sino.getIdToken())?.idToken;
        //如果从app拿不到idToken，则使用TGC获取idToken，这个功能需要业务侧提供
        if(!idToken){
            if(!this.config.getIdTokenByTGC){
                throw 'no getIdTokenByTGC function'
            }
            idToken = await this.config.getIdTokenByTGC();
        }
        return that.getLoginToken({
            onLoad: 'exchange-token',
            token: idToken,
            subjectIssuer: this.channelId,
            tokenStoreScope: 'local',
            kcType: 'token',
            cacheKeyPre: this.primaryKey,//登陆前是null，因此需要重新登陆；登陆后有值，因此直接从缓存获取token
            tokenType: 'urn:ietf:params:oauth:token-type:jwt',
            autoUpdateToken: true,
        }, 1);
    }

    /**
     * 用户登录【核心】方法
     * @param {*} option 登陆参数
     */
     async getLoginToken(option, retryTimes=0){
        let that = this;
        let keycloak = new Keycloak(this.loginKcConfig);
        //如果已经登陆了，则将缓存的token填充
        if(!!this.logined){
            keycloak.tokenParsed = this.loginedToken
        }
        async function retry(){
            //最多exchange两次，防止无限循环
            if(retryTimes > 0){
                return await that.getLoginToken(option, --retryTimes);
            }else{
                return null
            }
        }
        return new Promise(async (resolve, reject)=>{
            try{
                keycloak.onAuthRefreshError = ()=>{
                    that.getUserToken();
                }
                await keycloak.init(option);
                //keycloak有bug，用户第一次exchange时，无法同步用户基础信息（即没有companyId和channelId），此时需要再exchange一次
                //校验token合法性
                let verify = this.verifyToken(keycloak.token);
                if(verify !== true){
                    keycloak.tokenCache.clear(keycloak.getCacheKey());
                    let retryResult = await retry();
                    if(retryResult){
                        resolve(retryResult);
                    }else if(typeof verify == 'string'){
                        reject(verify)
                    }else{
                        reject('未获取到token')
                    }
                    return;
                }
                that.logined = true;
                resolve(keycloak.token);
            }catch(e){
                e = 'keycloak token exchange failed: '+e;
                reject(e);
                console.error(e);
            }
        })
    }

    verifyToken(token){
        try{
            if(!token){
                return false;
            }
            let tokenParsed = extendUtils.decodeToken(token)
            if(!tokenParsed.sub && tokenParsed.sub!=0){
                return 'token信息缺失：缺少userId'
            }
            if(!tokenParsed.channelId && tokenParsed.channelId!=0){
                return 'token信息缺失：缺少channelId'
            }
            return true;
        }catch(e){
            console.error(e);
            return false;
        }
    }
    
    /**
     * 获取缓存中的用户token
     */
    getCacheToken(){
        let token = extendUtils.getStorage(this.primaryKey + constant.SPLIT + this.config.cacheKey.TOKEN);
        try{
            token = JSON.parse(token).access_token
        }catch(e){}
        return token;
    }

   /**
     * 获取keycloak登陆的配置
     * @param {*} loginKcConfig 
     */
    async getLoginConfig(loginKcConfig){
        let obj = loginKcConfig;
        if(typeof loginKcConfig == 'string'){
            obj = await extendUtils.getJsonFile(loginKcConfig)
        }
        if(!obj['auth-server-url']){
            throw new Error('auth-server-url is empty')
        }
        if(!obj['realm']){
            throw new Error('realm is empty')
        }
        obj['clientId'] = obj['clientId'] || obj['resource']
        if(!obj['clientId']){
            throw new Error('clientId is empty')
        }
        return {
            url: obj['auth-server-url'],
            realm: obj['realm'],
            clientId: obj['clientId']
        }
    }


    //返回keycloak的用户信息
    getUserInfo() {
        try {
            let token = this.getCacheToken();
            if (!token) {
                throw 'no user token!';
            }
            let tokenParsed = extendUtils.decodeToken(token)
            //用户信息不可直接全部透传，只返回需要的信息，敏感信息不可返回，否则容易导致敏感信息暴露
            return {
                userId: extendUtils.getNonnullValue(tokenParsed.sub),
                companyId: extendUtils.getNonnullValue(this.tchatUserInfo.cpyId),
                companyName: extendUtils.getNonnullValue(this.tchatUserInfo.cpyName),
                channelId: sinosdk.sino.isInSinoEnv ? this.channelId : extendUtils.getNonnullValue(tokenParsed.channelId),
                channelName: extendUtils.getNonnullValue(tokenParsed.channelName),
                userName: extendUtils.getNonnullValue(tokenParsed.userName),
            }
        } catch (e) {
            console.error(e);
            return {}
        }
    }

    logout(){
        clearInterval(this.tokenInterval);
        this.tokenInterval = null;
    }
}

export default AuthHandler;
