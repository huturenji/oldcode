import extendUtils from 'utils';
import constant from 'constant';
import {request, kcRequest} from 'utils/request'

const MAX_RENEW_COUNT = 2;
class AuthHandler {
    constructor(config, events){
        this.config = config;
        this.loginKcConfig = {};
        this.tokenInterval = null;
        this.role = config.identity;
        this.events = events;
        this.renewCount = sessionStorage.getItem('authRenewCount') || 0;
    }

    /**
     * 初始化参数
     */
    async init(){
        //获取T信用户信息
        this.tchatUserInfo = await this.getTchatUserInfo();
        //获取渠道信息
        this.channelId = await this.getChannelId();
        //获取keycloak的关键参数，必须由外部传入
        await this.setKeycloakParams();
        //使用T信用户id和企业id拼接得到缓存key的前缀
        this.getPrimaryKey();
        //是否已登陆（有token且未过期）
        this.logined = this.isTokenAvaliable();
        if(this.logined){
            this.token = this.getCacheToken();
        }
    }

    /**
     * 获取缓存的主键。每次都调用该方法来获取，避免因未登录而导致某些数据(比如uaId)拿不到
     */
    getPrimaryKey(){
        if(this.primaryKey){
            return this.primaryKey;
        }
        if(typeof this.config.primaryKey == 'function'){
            this.primaryKey = this.config.primaryKey({userId: this.tchatUserInfo.uaId, cpyId: this.tchatUserInfo.cpyId, channelId: this.channelId})
        }
        if(!!this.config.primaryKey){
            this.primaryKey = this.config.primaryKey;
        }
        //伴正事环境且非游客,或从web版bizmate打开
        if((sinosdk.sino.isInSinoEnv() && !this.useGuest()) || sinosdk.sino.openedByBizmateWeb()){
            //必须要有uaId（没有uaId或uaId为0说明用户没登录）
            if(this.tchatUserInfo?.uaId && this.tchatUserInfo?.uaId != 0 && this.tchatUserInfo?.uaId != '0'){
                this.primaryKey = constant.STORAGE_PREFIX + this.tchatUserInfo.uaId
            }
        }
        else if(sinosdk.sino.getPlatform() == sinosdk.sino.constant.RUN_ENV.WECHAT_H5 || sinosdk.sino.getPlatform() == sinosdk.sino.constant.RUN_ENV.WECHAT_MINI_APP){
            this.primaryKey = constant.STORAGE_PREFIX + 'wechat';
        }
        //游客或非伴正事环境
        else{
            this.primaryKey = constant.STORAGE_PREFIX + 'guest';
        }
        return this.primaryKey || '';
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
        if(!this.loginKcConfig.clientId){
            this.loginKcConfig = await this.getLoginConfig(this.config.loginKcConfig);
        }
    }

    isGuest(){
        return this.getRole() == constant.IDENTITY.GUEST;
    }

    useGuest(){
        return this.config.identity == constant.IDENTITY.GUEST;
    }

    async getUserToken(){
        //如果已登录（token未过期），则直接返回token
        if(this.logined){
            this.autoUpdateToken();//开启自动刷新token
            return this.token;
        }
        if(this.useGuest()){
            // this.removeAllUserToken();
            return this.guestLogin();
        }

        let result = null;
        if(this.config.mode == 'h5'){
            result = await this.getTokenByH5Flow();
        }else if(this.config.mode == 'native'){
            result = await this.getTokenByJsBridge(true, 1)
        }else if(this.config.mode == 'sign'){
            //如果外部未传sign，则自己根据参数生成
            if(extendUtils.isEmpty(this.config.signData.sign)){
                const signObj = await this.createSign();
                this.config.signData.sign = signObj.sign;
                this.config.signData.timestamp = signObj.timestamp
            }
            result = await this.getTokenBySign();
        }
        //user登录后，删除游客token
        // this.removeGuestToken();
        return result;
    }

    /**
     * 用户登录【核心】方法
     * @param {*} refresh 是否获取最新token
     * @param {*} retryTimes 重试次数
     */
    async getTokenByJsBridge(refresh=true, retryTimes=0){
        return new Promise((resolve, reject)=>{
            let endpoint = this.getEndpoint(this.loginKcConfig)
            let param = {
                clientId: endpoint.clientId,
                serviceName: this.loginKcConfig.serviceName,
                refresh: !!refresh,
            }
            endpoint.auth && (param.authorizationUrl = endpoint.auth)
            endpoint.token && (param.tokenUrl = endpoint.token)
            sinosdk.sino.getAccessToken(param).then(async res=>{
                this.token = res ? res.accessToken : null;
                if(!this.verifyToken(this.token)){
                    if(retryTimes>0){
                        resolve(await this.getTokenByJsBridge(true, --retryTimes));
                        return;
                    }
                    this.log('bpAuthLog','error',`B+ authorization by native flow[getAccessToken]: ${extendUtils.objToStr(res)}`)
                    throw 'GetAccessTokenFunction返回内容：'+(res!=null && res!=undefined ? extendUtils.objToStr(res) : res);//发生错误时记录原始内容
                }
                //从登录后重新获取一次伴正事用户信息。适用场景：游客访问->拉起登陆，此时tchatUserInfo中没有用户信息，需要重新获取
                this.tchatUserInfo = await this.getTchatUserInfo();
                //设置角色
                this.setRole(constant.IDENTITY.USER);
                //开启自动刷新token
                this.autoUpdateToken();
                extendUtils.setStorage(this.getPrimaryKey() + constant.SPLIT + this.config.cacheKey.TOKEN, this.token)
                this.log('bpAuthLog','info',`B+ authorization by native flow[getAccessToken]: ${extendUtils.objToStr(res)}`)
                resolve(this.token);
            }).catch(e=>{
                console.error(e);
                reject(e)
            })
        })
    }

    verifyToken(token){
        try{
            if(!token){
                return false;
            }
            let tokenParsed = extendUtils.decodeToken(token)
            if(!tokenParsed.sub && tokenParsed.sub!=0){
                extendUtils.showToast('token信息缺失：缺少userId')
                return false;
            }
            if(!tokenParsed.channelId && tokenParsed.channelId!=0){
                extendUtils.showToast('token信息缺失：缺少channelId')
                return false;
            }
            if(this.role == constant.IDENTITY.USER && extendUtils.isNotEmpty(this.channelId) && tokenParsed.channelId != this.channelId){
                extendUtils.showToast(`token中的channelId和app不一致：token中${tokenParsed.channelId}，app中${this.channelId}`)
                return false;
            }
            return true;
        }catch(e){
            console.error(e);
            return false;
        }
    }

    /**
     * 自动更新token
     */
    autoUpdateToken(){
        if(this.config.autoUpdateToken === false){
            return;
        }
        try{
            let that = this;
            if(this.tokenInterval != null){
                return;
            }
            clearInterval(this.tokenInterval);
            this.tokenInterval = setInterval(async ()=>{
                if(!that.isTokenAvaliable()){
                    //无网络时不刷新
                    if(!(await sinosdk.sino.getNetInfo()).contectState){
                        return;
                    }
                    if(this.config.mode == 'h5' || this.isGuest()){
                        that.refreshTokenByH5Flow();
                    }else if(this.config.mode == 'native'){
                        that.getTokenByJsBridge();
                    }else if(this.config.mode == 'sign'){
                        that.refreshTokenBySign();
                    }
                }
            }, 30 * 1000);
        }catch(e){
            console.error(e)
        }
    }
    
    /**
     * 获取缓存中的用户token
     */
    getCacheToken(){
        return extendUtils.getStorage(this.getPrimaryKey() + constant.SPLIT + this.config.cacheKey.TOKEN);
    }

    /**
     * 删除当前的游客tokne
     */
    removeGuestToken(){
        const guestPrefix = constant.STORAGE_PREFIX + 'guest'+ constant.SPLIT
        extendUtils.removeStorage(guestPrefix + this.config.cacheKey.TOKEN);
        extendUtils.removeStorage(guestPrefix + this.config.cacheKey.REFRESH_TOKEN);
    }

    /**
     * 删除当期项目下所有user token
     */
    removeAllUserToken(){
        Object.keys(localStorage).forEach(key=>{
            const commonJoin = constant.SPLIT;
            if(key.endsWith(commonJoin + this.config.cacheKey.TOKEN)
            || key.endsWith(commonJoin + this.config.cacheKey.REFRESH_TOKEN)){
                localStorage.removeItem(key);
            }
        })
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
        obj['clientId'] = obj['clientId'] || obj['resource']
        if(!obj['clientId']){
            throw 'clientId is empty'
        }
        return obj;
    }

    /**
     * 获取keycloak接口路径
     * @param {*} loginKcConfig 
     * @returns 
     */
    getEndpoint(loginKcConfig){
        let url = loginKcConfig['auth-server-url'];
        if(url.endsWith('/')){
            url = url.substring(0, url.length-1);
        }
        return {
            auth: url ? `${url}/realms/${loginKcConfig.realm}/protocol/openid-connect/auth` : null,
            token: url ? `${url}/realms/${loginKcConfig.realm}/protocol/openid-connect/token` : null,
            clientId: loginKcConfig.clientId
        }
    }

    guestLogin(){
        let that = this;
        return new Promise((resolve, reject)=>{
            let endpoint = this.getEndpoint(this.loginKcConfig);
            kcRequest({
                url: endpoint.token,
                method: 'post',
                data: {
                    grant_type: 'password',
                    username: encodeURIComponent(this.config.guestUserName),
                    password: encodeURIComponent(this.config.guestPassword),
                    client_id: encodeURIComponent(endpoint.clientId)
                }
            }).then(data => {
                that.setRole(constant.IDENTITY.GUEST);
                resolve(that.setToken(data.access_token, data.refresh_token));
                that.log('bpAuthLog', 'info', `B+ authorization by h5 flow[guest login]: ${extendUtils.objToStr(data)}`)
            }).catch(e => {
                reject(extendUtils.objToStr(e.response));
                console.error('get guest token error! ', extendUtils.objToStr(e.response));
                that.log('bpAuthLog', 'error', `B+ authorization by h5 flow[guest login]: ${e.response}`)
            })
        })
    }


    /**
     * H5实现标准第三方授权流程获取token第一步：获取第三方code
     * @returns 
     */
    async getTokenByH5Flow(){
        let that = this;
        return new Promise(async (resolve, reject)=>{
            try{
                let refreshToken = extendUtils.getStorage(that.getPrimaryKey() + constant.SPLIT + this.config.cacheKey.REFRESH_TOKEN);
                if(!this.isTokenAvaliable() && this.isTokenAvaliable(90, refreshToken)){
                    resolve(await this.refreshTokenByH5Flow());
                    return;
                }

                let getCodeSilently = this.config.authSilence;
                //重定向授权流程。从keycloak重定向回来后，获取url上的code
                if(!getCodeSilently){
                    let code = extendUtils.getUrlParams()['code'];
                    if(extendUtils.isNotStrictEmpty(code)){
                        extendUtils.removeUserParamOnUrl();
                        that.log('bpAuthLog', 'info', `B+ authorization by h5 flow[get code]: code: ${code}`)
                        resolve(await this.getTokenByCode(code));
                        return;
                    }
                }
                
                let endpoint = this.getEndpoint(this.loginKcConfig);
                let codeVerifier = extendUtils.generateCodeVerifier(96);//43到128位的随机字符串作为codeVerifier
                let redirectUri = this.config.silentAuthRedirectUri || location.href;
                let code_challenge = await extendUtils.generatePkceChallenge("S256", codeVerifier);//codeVerifier做SHA256运算，然后再做base64-encode运算
                let state = extendUtils.createUUID();//随机唯一标识
                let nonce = extendUtils.createUUID();//随机唯一标识
                //通过keycloak的idp配置，获取code
                let authUrl = `${endpoint.auth}?redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${endpoint.clientId}`
                + `&response_type=code&state=${state}&nonce=${nonce}&&scope=openid%20email%20profile`
                + `&code_challenge=${code_challenge}&code_challenge_method=S256&kc_idp_hint=${this.channelId}`
                
                extendUtils.setStorage('codeVerifier', codeVerifier);//存储在local中，从keycloak重定向回来后使用
                extendUtils.setStorage('redirectUri', redirectUri);
                this.log('bpAuthLog', 'info', `B+ authorization by h5 flow[start]: auth url: ${authUrl}`)

                //等待网络可用（安卓某些机型上，长时间置于后台会导致app无网络，此时唤醒app，短时间内网络未恢复，需等待网络恢复后再授权）
                let netState = await this.awaitNetValiable();
                if(!netState){
                    this.triggerEvent('onError', 'no network')
                    this.log('bpAuthLog', 'warn', 'B+ authorization by h5 flow[start]: no network')
                }

                //静默获取code，使用iframe
                if(getCodeSilently){
                    var iframe = document.createElement("iframe");
                    iframe.setAttribute("src", authUrl);
                    iframe.style.display = "none";
                    iframe.onload = ()=>{
                        let code = extendUtils.getUrlParams(iframe.contentWindow.location.href)['code'];
                        that.log('bpAuthLog', 'info', `B+ authorization by h5 flow in frame[get code]: code: ${code}`)
                        if(extendUtils.isNotStrictEmpty(code)){
                            extendUtils.removeUserParamOnUrl();
                            iframe.remove()
                            that.getTokenByCode(code).then(token=>{
                                !!token && (that.setRole(constant.IDENTITY.USER));
                                resolve(token);
                            });
                        }
                    }
                    document.body.appendChild(iframe);
                }else{
                    //重定向到keycloak获取code
                    location.href = authUrl;      
                }
            }catch(error){
                reject(error);
                that.log('bpAuthLog', 'error', `B+ authorization by h5 flow error: ${error}`)
            }
        })
    }

    /**
     * 等待网络可用。 最多等待5秒
     * @param {*} tryCount 
     * @returns 
     */
    awaitNetValiable(tryCount = 0){
        let that = this;
        return new Promise(async resolve => {
            let netValiable = (await sinosdk.sino.getNetInfo()).contectState;
            if(netValiable){
                resolve(true)
                return;
            }
            if(tryCount > 5){
                resolve(false);
                return;
            }
            setTimeout(()=>{
                resolve(that.awaitNetValiable(++tryCount));
            }, 1000)
        })
    }

    /**
     * 通过第三方code获取相应token
     * @param {*} code 
     * @returns 
     */
    getTokenByCode(code){
        return new Promise((resolve, reject)=>{
            let that = this;
            if(extendUtils.isNotStrictEmpty(code)){
                let endpoint = this.getEndpoint(this.loginKcConfig);
                let codeVerifier = extendUtils.getStorage('codeVerifier');
                let redirectUri = extendUtils.getStorage('redirectUri');
                
                try{
                    kcRequest({
                        url: endpoint.token,
                        method: 'post',
                        data: {
                            code: code,
                            grant_type: 'authorization_code',
                            client_id: encodeURIComponent(endpoint.clientId),
                            code_verifier: codeVerifier,
                            redirect_uri: encodeURIComponent(redirectUri)
                        },
                        withCredentials: true
                    }).then(data => {
                        resolve(that.setToken(data.access_token, data.refresh_token));
                        that.log('bpAuthLog', 'info', `B+ authorization by h5 flow[get token]: ${extendUtils.objToStr(data)}`)
                    }).catch(e => {
                        reject(extendUtils.objToStr(e));
                        console.error('get token by code error! ', extendUtils.objToStr(e));
                        that.log('bpAuthLog', 'error', `B+ authorization by h5 flow[get token]: ${e.response}`)
                    }).finally(()=>{
                        extendUtils.removeStorage('codeVerifier');
                        extendUtils.removeStorage('redirectUri');
                    })
                }catch(e){
                    that.log('bpAuthLog', 'error', `B+ authorization by h5 flow[get token]: ${e}`)
                    reject(e);
                }
            }
        })
    }

    setToken(access_token, refresh_token){
        this.token = access_token;
        this.token && this.autoUpdateToken();//开启自动刷新token
        //token校验失败（缺失关键信息），则不使用
        if(!this.verifyToken(this.token)){
            return;
        }
        extendUtils.setStorage(this.getPrimaryKey() + constant.SPLIT + this.config.cacheKey.TOKEN, access_token)
        extendUtils.setStorage(this.getPrimaryKey() + constant.SPLIT + this.config.cacheKey.REFRESH_TOKEN, refresh_token)
        return this.token;
    }

    /**
     * H5刷新token
     */
    refreshTokenByH5Flow(){
        let that = this;
        return new Promise(async resolve => {
            let refreshToken = extendUtils.getStorage(that.getPrimaryKey() + constant.SPLIT + this.config.cacheKey.REFRESH_TOKEN);
            let decodeToken = extendUtils.decodeToken(refreshToken)
            //refreshToken失效，修改登录状态
            if(extendUtils.isTokenExpired(decodeToken, 0)){
                resolve(await that.renew());//重新授权
                return;
            }
            let endpoint = this.getEndpoint(this.loginKcConfig);
            kcRequest({
                url: endpoint.token,
                method: 'post',
                data: {
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    client_id: decodeToken.azp//从token中拿clientId，防止公用token时clientId串了
                },
                withCredentials: true
            }).then(data => {
                resolve(that.setToken(data.access_token, data.refresh_token))
                that.log('bpAuthLog', 'info', `B+ authorization by h5 flow[refresh token]: ${extendUtils.objToStr(data)}`)
            }).catch(async e => {
                resolve(await that.renew());//重新授权
                console.warn('refresh token by H5 flow failed! ', e);
                that.log('bpAuthLog', 'error', `B+ authorization by h5 flow[refresh token]: ${e.response}`)
            })
        })
    }

    /**
     * 微信：生成签名
     */
    async createSign(){
        try {
            let params = {
                thirdUserId: this.config.signData.thirdUserId, //第三方用户Id
                name: this.config.signData.name, //名字
                mobile: this.config.signData.mobile, //手机号
                channelId: this.config.signData.channelId, //渠道ID
                timestamp: this.config.signData.timestamp || new Date().getTime(), //时间戳
                signAlg: this.config.signData.signAlg || 'SHA256' //签名算法
            };
            let paramsArr = ['thirdUserId', 'name', 'mobile', 'channelId', 'timestamp', 'signAlg'].sort();//按照字母的字典顺序排列
            let str = ''
            paramsArr.forEach(item => {
                str+=`${item}=${params[item]}&`
            })
            str += this.config.signData.clientSecret;
            let sign = (await import('utils/SHA256')).sha256(str)?.toUpperCase();
            return {sign, timestamp: params.timestamp };
        } catch (error) {
            console.log('签名报错', error);
        }
    }

    /**
     * 微信：通过签名获取token
     * @param {*} data 
     * @returns 
     */
    getTokenBySign(){
        let that = this;
        return new Promise(async resolve => {
            let refreshToken = extendUtils.getStorage(that.getPrimaryKey() + constant.SPLIT + this.config.cacheKey.REFRESH_TOKEN);
            if(!this.isTokenAvaliable() && this.isTokenAvaliable(90, refreshToken)){
                resolve(await this.refreshTokenBySign());
                return;
            }
            request({
                url: location.origin + '/bizcloud/user-center/v1/unionAuth',
                data: that.config.signData,
                method: 'post',
            }).then(result => {
                if(result.resultCode == 0){
                    that.setRole(constant.IDENTITY.USER)
                    let tokenResponse = result.result
                    resolve(that.setToken(tokenResponse.accessToken, tokenResponse.refreshToken))
                    that.log('bpAuthLog', 'info', `B+ authorization by sign flow[get token]: ${extendUtils.objToStr(result)}`)
                }else{
                    resolve(null);
                    that.log('bpAuthLog', 'error', `B+ authorization by sign flow[get token]: ${extendUtils.objToStr(result)}`)
                }
            }).catch(e => {
                resolve(null);
                that.log('bpAuthLog', 'error', `B+ authorization by sign flow[get token]: ${e}`)
            })
        })
    }

    /**
     * 刷新token：签名授权流程
     * @returns 
     */
    refreshTokenBySign(){
        let that = this;
        return new Promise(async resolve => {
            let refreshToken = extendUtils.getStorage(that.getPrimaryKey() + constant.SPLIT + this.config.cacheKey.REFRESH_TOKEN);
            //refreshToken失效，修改登录状态
            if(extendUtils.isTokenExpired(extendUtils.decodeToken(refreshToken), 0)){
                resolve(await that.renew());//重新授权
                return;
            }
            request({
                url: location.origin + '/bizcloud/user-center/v1/refreshToken',
                data: {refreshToken: refreshToken},
                method: 'post',
            }).then(async result => {
                if(result.resultCode == 0){
                    let tokenResponse = result.result
                    resolve(that.setToken(tokenResponse.accessToken, tokenResponse.refreshToken))
                    that.log('bpAuthLog', 'info', `B+ authorization by sign flow[refresh token]: ${extendUtils.objToStr(result)}`)
                }else{
                    resolve(await that.renew());//重新授权
                    that.log('bpAuthLog', 'error', `B+ authorization by sign flow[refresh token]: ${extendUtils.objToStr(result)}`)
                }
            }).catch(async e => {
                resolve(await that.renew());
                that.log('bpAuthLog', 'error', `B+ authorization by sign flow[refresh token]: ${e}`)
            })
        })
    }

    /**
     * 用户状态（登录失效后）续期
     */
    async renew(){
        //限制重试次数
        if(this.renewCount > MAX_RENEW_COUNT){
            return '';
        }
        sessionStorage.setItem('authRenewCount', this.renewCount++);
        this.logined = false;
        if(this.isGuest()){
            return await this.guestLogin();
        }
        if(this.config.mode == 'h5'){
            return await this.getTokenByH5Flow();
        }
        if(this.config.mode == 'sign'){
            return await this.getTokenBySign();
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
                companyId: extendUtils.getNonnullValue(this.tchatUserInfo.cpyId) || -1,
                companyName: extendUtils.getNonnullValue(this.tchatUserInfo.cpyName),
                channelId: this.channelId,
                channelName: extendUtils.getNonnullValue(tokenParsed.channelName),
                userName: extendUtils.getNonnullValue(tokenParsed.userName),
            }
        } catch (e) {
            console.error(e);
            return {}
        }
    }

    setRole(value){
        this.role = value;
    }

    getRole(){
        return this.role;
    }

    logout(){
        this.removeGuestToken();
        this.removeAllUserToken();
        clearInterval(this.tokenInterval);
        this.tokenInterval = null;
    }

    log(type, level, desc){
        this.triggerEvent('log', type, level, desc)
    }

    triggerEvent(name, ...params){
        try{
            this.events[name] && this.events[name](...params)
        }catch(e){
            console.warn('授权触发事件出错：' + e)
        }
    }
    
}

export default AuthHandler;
