import extendUtils from '../utils';
import injectErrorCode from '../errorCodeHandler/common.js';
import constant from 'common/config';
class RequestHandler {
    constructor(){
        let that = this;
        //注入请求的全局配置
        injectErrorCode();
        this.TOKEN_FAILED_RETRY_TIMES = 1;//授权失败后重试次数
        this.getBaseParams();
        Object.defineProperty(that, 'primaryKey', {
            configurable: true,
            enumerable: true,
            set: function(value){
                that._primaryKey = value;
            },
            get: function () {
                if(!!that._primaryKey){
                    return that._primaryKey;
                }
                that._primaryKey = that.getPrimaryKey();
                return that._primaryKey;
            },
        })
    }


    /**
     * 有userId时才能有primaryKey，否则primaryKey是不完整的，生成了无意义，且会对其他流程有影响
     */
    getPrimaryKey(){
        //如果还未授权，则不返回primaryKey
        if(!this.authorized()){
            return;
        }
        if(!this.userId){
            throw new Error('no userId');
        }
        return `${this.userId}_${this.companyId}_${this.channelId}_${constant.AUTH_CONFIG.loginKcConfig.clientId}` 
    }

    /**
     * 是否授权完成
     */
    authorized(){
        return window.authorization && window.authorization.isAuthorized();
    }

    /**
     * 数据请求
     * @param {*} url     请求数据url
     * @param {*} data    请求参数
     * @param {*} method  请求方法,默认为post
     * @param {*} timeout 超时时间
     * @param {*} headers  请求头类型
     * @param {*} responseType   返回数据类型
     */
    apiCallHandler(url, data,paramObj={}) {
        let that = this;
        //修复url中斜线的问题
        url = extendUtils.autoFixUrl(url);
        return new Promise(async (res,rej)=>{
            let checkNetWorkEnable = true;

            //有些页面可能不在app中访问，因此不需要检查网络
            let index = location.hash.indexOf('?');
            let routePath = location.hash.substring(1, index==-1 ? location.hash.length : index);//当前页面的路由。如果路由是重定向的，则route.path无法获取到当前真实的path，因此自己截取
            if(!constant.WHITE_LIST.JSBRIDGE.PATH.some(path=>{
                return routePath.startsWith(path)
            })){
                //检查网络状态后，再发送请求
                checkNetWorkEnable = await extendUtils.CheckNetWorkFunction();
            }
            if(checkNetWorkEnable){
                //请求参数
                let requestParam = {};
                //请求方法
                let requestFun = '';
                //是否使用安全链路
                let useBsl = true;
                if(!!paramObj.noUseBsl){
                    useBsl = false;
                }
                if(useBsl){
                    requestFun = 'bslRequest';
                    //使用安全链路
                    requestParam = await extendUtils.encryption.getEncryptionParam(url,data,paramObj);
                    let bslService = !!window.bslService?window.bslService:(await extendUtils.getJsonFile(constant.AUTH_CONFIG.bslConfig)).bslService;
                    if(!!bslService && '' != bslService){
                        requestParam.baseURL = window.bslService = bslService;
                    }
                }else{
                    requestFun = 'httpRequest';
                    requestParam = {
                        url:url,
                        data:data,
                        method:paramObj.method || 'post',
                        timeout:paramObj.timeout,
                        headers:paramObj.headers,
                        responseType:paramObj.responseType || 'json'
                    }
                }
                extendUtils[requestFun](requestParam).then(async (da)=>{
                    //解密
                    let data = {};
                    if(useBsl){
                        try {
                            data = await extendUtils.encryption.priDecryptionFunction(da,requestParam);
                        } catch (error) {
                            rej(error)
                            console.error(error)
                        }
                    }else{
                        data = da;
                    }
                    extendUtils.errorCodeInterceptor.init({
                        url:url,
                        code:data.resultCode,
                        data: data
                    }).run().then(()=>{
                        res(data);
                    }).catch(()=>{
                        rej(data);
                    });
                }).catch((e)=>{
                    let status = e.status;
                    let httpErrorCode = 'NETWORK_ERR';
                    if(useBsl){
                        //请求失败也要调用一次解密，释放app内存
                        extendUtils.encryption.priDecryptionFunction('',requestParam)
                    }
                    //授权失败时需要重试一次
                    if(status == 401){  
                        if(!paramObj.retryTimes || paramObj.retryTimes < that.TOKEN_FAILED_RETRY_TIMES){
                            that.reRequest(url, data,paramObj).then(data=>{
                                res(data);
                            }).catch(e=>{
                                rej(e);
                            });
                            return;
                        }
                        httpErrorCode = 'AUTHORIZE_FAILED';
                    }else if(status == 403){
                        httpErrorCode = 'NO_AUTHORIZATION';
                    }
                    extendUtils.errorCodeInterceptor.init().run(httpErrorCode,url).then(()=>{
                        res();
                    }).catch((e2)=>{
                        console.error(e2);
                        rej(e)
                    });
                    console.error(e);
                });
            }else{
                extendUtils.showToast('网络连接不可用');
                //离线资源包直接显示本地资源，不显示无网络默认图
                // new errorCodeInterceptor().run('NETWORK_ERR',url);
                console.log('net is disable');
                rej('net is disable');               
            }
        });    
    }

    /**
     * 数据请求
     */
    async request (url, param={}, httpConfig={}) {
        let that = this;

        let newParam = await extendUtils.authInterceptor(param, url) || {};//授权拦截器处理后的参数对象
        let token = that.getUserToken();//获取用户token
        //如果不是formData类型，则使用处理后的参数对象，否则使用原始值
        if(!(param instanceof FormData) && !httpConfig.notAssignUserParam){
            param = Object.assign({}, newParam, {
                userId: this.userId,
                companyId: this.companyId,
                channelId: this.channelId,
            });
        }

        httpConfig = Object.assign({}, httpConfig);

        //安全链路使用相对路径
        (url.startsWith('http://')||url.startsWith('https://'))?url:url = '/media' + url;
        'GET'===(httpConfig.method || '').toUpperCase()?Object.assign(param,{t:new Date().getTime()}):'';

        return new Promise((reslove, reject) => {
            let _httpConfig = Object.assign({}, httpConfig, this.defaultHeaders(token))
            that.apiCallHandler(url, param, _httpConfig).then(data => {
                if (data.resultCode == 0) {
                    reslove(data);
                } else {
                    reject(data);
                }
            }).catch(err => {
                reject(err.resultCode ? err : null);//只把拦截器返回的异常数据抛出去
                try {
                    log.err(err && JSON.stringify(err));
                } catch (e) { }
            })
        });
    }

    getUserToken(){
        return window.authorization && window.authorization.getToken()
    }

    /**
     * 封装默认header信息
     */
    defaultHeaders(token){
        if(!token){
            return {};
        }
        return {
            headers:{
                Authorization: 'Bearer '+token,
            }
        }
    }


    /**
     * 重新尝试请求
     * @param {*} url 
     * @param {*} data 
     * @param {*} paramObj 
     */
    async reRequest(url, data,paramObj){
        return new Promise((res, rej)=>{
            paramObj = Object.assign({}, paramObj, {retryTimes: (paramObj.retryTimes || 0)+1});//添加重试次数
            this.apiCallHandler(url, data,paramObj).then(data=>{
                res(data);
            }).catch(e=>{
                rej(e);
            });
        })
    }

    /**
     * 将一些基本的公共参数存入this中
     */
    getBaseParams(){
        let that = this;
        constant.USER_CONFIG.USER_INFO_PARAMS.forEach(key => {
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                set: function(_value){
                    that['_'+key] = _value;
                },
                get: function () {
                    //用户身份参数需要授权后才拿到，因此未授权完成时，返回null，防止有的业务在授权完成前拿到了这些参数
                    if(!that.authorized()){
                        return null;
                    }
                    //如果get时有值，则直接返回
                    if(!!that['_'+key]){
                        return that['_'+key];
                    }
                    //从授权组件中获取相应的参数
                    that['_'+key] = that.getUserParam(key);
                    return that['_'+key];
                },
            })
        })
    }

    /**
     * 从授权组件的接口中提取用户参数
     * @param {*} key 
     */
    getUserParam(key){
        let result = null;
        if(window.authorization){
            let tchatInfo = authorization.getTchatUserInfo();//授权组件提供的t信用户数据
            let userInfoInToken = authorization.getUserInfo();//授权组件提供的token数据
            if(key!=null && key!=undefined){
                //分别从这两个对象中提取参数，匹配到则返回
                if(tchatInfo && Object.keys(tchatInfo).some(_key=>{
                    result = tchatInfo[_key];
                    return _key.toLowerCase() == key.toLowerCase();
                })){
                    return result;
                }
    
                if(tchatInfo && Object.keys(userInfoInToken).some(_key=>{
                    result = userInfoInToken[_key];
                    return _key.toLowerCase() == key.toLowerCase();
                })){
                    return result;
                }
            }else{
                return Object.assign({}, tchatInfo, userInfoInToken)
            }
        }
        return result;
    }
}

export default RequestHandler;
