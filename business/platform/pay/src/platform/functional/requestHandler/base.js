import extendUtils from '../utils';
import {CheckNetWorkFunction, GetAppConfigFunction} from '../jsbridge';
import injectErrorCode from '../errorCode/config';
import constant from '../constant';
class RequestHandler {
    constructor(){
        let that = this;
        //注入请求的全局配置
        injectErrorCode();
        this.TOKEN_FAILED_RETRY_TIMES = 1;//授权失败后重试次数
        //先获取channelId，再填充全局参数
        this.setChannelId().then(()=>{
            that.getBaseParams();
            that._primaryKey = that.getPrimaryKey();
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
                    //如果get时没有值，则再重新获取一次
                    that.getBaseParams();
                    that._primaryKey = that.getPrimaryKey();
                    return that._primaryKey;;
                },
            })
        });
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
        return `${this.userId}_${this.companyId}_${this.channelId}` 
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
        return new Promise((res,rej)=>{
            //检查网络状态后，再发送请求
            CheckNetWorkFunction().then(function (suc) {
                if(suc){
                    let param = {
                        url:url,
                        data:data,
                        method:paramObj.method || 'post',
                        timeout:paramObj.timeout,
                        headers:paramObj.headers,
                        responseType:paramObj.responseType || 'json'
                    }
                    extendUtils.httpRequest(param).then((data)=>{
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
                    //离线资源包直接显示本地资源，不显示无网络默认图
                    // new errorCodeInterceptor().run('NETWORK_ERR',url);
                    console.log('net is disable');
                    rej('net is disable');               
                }
            });       
        });    
    }

    /**
     * 数据请求
     */
    async request (url, param={}, httpConfig={}) {
        let that = this;

        let newParam = await extendUtils.authInterceptor(param, url) || {};//授权拦截器处理后的参数对象
        let token = this.getUserToken() || {};//获取用户token

        //如果不是formData类型，则使用处理后的参数对象，否则使用原始值
        if(!(param instanceof FormData) && !httpConfig.notAssignUserParam){
            param = Object.assign({}, newParam, that.userInfoParam(token));
        }

        httpConfig = Object.assign({}, httpConfig);

        //如果传进来的是绝对路径，则不用拼接url,否则新增访问html下的域名+端口作为前缀
        (url.startsWith('http://')||url.startsWith('https://'))?url:url = location.origin + url;
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
        let tokenParsed = extendUtils.getStorage(`${this.primaryKey}_token`);
        let token = null;
        try{
            token = tokenParsed ? JSON.parse(tokenParsed) : null
        }catch(e){
            console.error('get header token failed! ',e);
        }
        return token;
    }

    /**
     * 封装默认header信息
     */
    defaultHeaders(token){
        return {
            headers:{
                Authorization: 'Bearer '+token.access_token,
            }
        }
    }

    /**
     * 获取用户参数
     * @param {*} token 
     */
    userInfoParam(token){
        return {
            userId: token.tokenParsed.sub,
            companyId: token.tokenParsed.companyId,
            channelId: token.tokenParsed.channelId,
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
        constant.USER_CONFIG.URL_STABLE_PARAMS.forEach(key => {
            let value = extendUtils.getUserPara(key);
            this['_'+key] = value;
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                set: function(_value){
                    that['_'+key] = _value;
                },
                get: function () {
                    //非标识用户身份的参数，直接返回，不做处理
                    if(constant.USER_CONFIG.USER_INFO_PARAMS.indexOf(key)==-1){
                        return that['_'+key];
                    }
                    //用户身份参数需要授权后才拿到，因此未授权完成时，返回null，防止有的业务在授权完成前拿到了这些参数
                    if(!that.authorized()){
                        return null;
                    }
                    //如果get时有值，则直接返回
                    if(!!that['_'+key]){
                        return that['_'+key];
                    }
                    //从url上重新获取
                    that['_'+key] = extendUtils.getUserPara(key);
                    return that['_'+key];
                },
            })
        })
    }

    /**
     * 获取渠道id
     */
    async getChannelId(){
        try{
            let data = await GetAppConfigFunction({key: 'tid'});
            return data && data.value;
        }catch(e){
            console.error(e);
        }
    }

    /**
     * 如果url上没有channelId，则从app获取，然后放到url上
     */
    async setChannelId(){
        let channelId = extendUtils.getUserPara('channelId');
        if(!channelId){
            channelId = await this.getChannelId();
            let url = extendUtils.assignUrlParam('channelId', channelId)
            history.replaceState(null, null, url);
        }
    }
}

export default RequestHandler;
