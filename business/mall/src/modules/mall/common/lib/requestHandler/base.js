import extendUtils from 'common/lib/utils'
import injectErrorCode from '../errorCodeHandler/common.js';
import httpPostProcessors from "../../../mock/DMT/proxy/processors/HttpPostProcessors";
import constant from '../config';
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
                return that._primaryKey;;
            },
        })
    }


    /**
     * 有userId时才能有primaryKey，否则primaryKey是不完整的，生成了无意义，且会对其他流程有影响
     */
    getPrimaryKey(){
        //如果身份是游客，则单独
        let guestPrimaryKey = this.getGuestPrimaryKey();
        let role = extendUtils.getStorage(guestPrimaryKey+'_identity');
        if(role!=null && role!=undefined && role=='guest'){
            return guestPrimaryKey
        }
        //如果还未授权，则不返回primaryKey
        if(!this.authorized()){
            return;
        }
        if(!this.userId){
            throw new Error('no userId');
        }
        return `${this.userId}_${this.companyId}_${this.channelId}_${constant.AUTH_CONFIG.loginKcConfig.clientId}_${this.supplierId}` 
    }

    getGuestPrimaryKey(){
        let channelId = extendUtils.getUserPara('channelId')
        let supplierId = extendUtils.getUserPara('supplierId')
        return channelId + '_' + supplierId;
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
    apiCallHandler(_url, data,paramObj={}) {
        let that = this;
        //如果传进来的是绝对路径，则不用拼接url,否则新增访问html下的域名+端口作为前缀
        let url = _url;
        if(!url.startsWith('http://') && !url.startsWith('https://')){
            url =  '/mall' + _url;
        }

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

                //请求方法和参数处理
                let request = await extendUtils.requestParam.getRequestObj(url, data, paramObj);

                extendUtils[request.fun](request.param).then(async (da)=>{
                    //解密
                    let data = {};
                    if(request.useBsl){
                        try {
                            data = await extendUtils.requestParam.analysisParam(da, request.param); //解析参数
                            //DMT中台业务处理
                            data = that.DMTProcessHandler(data, request)
                        } catch (error) {
                            rej(error)
                            console.error(error)
                        }
                    }else{
                        //DMT中台业务处理
                        data = that.DMTProcessHandler(da, request);
                    }
                    extendUtils.errorCodeInterceptor.init({
                        url:url,
                        code:(data || {}).resultCode,
                        data: data
                    }).run().then(()=>{
                        res(data);
                    }).catch(()=>{
                        rej(data);
                    });
                }).catch((e)=>{
                    let status = e.status;
                    let httpErrorCode = 'NETWORK_ERR';
                    if(request.useBsl){ 
                        //请求失败也要调用一次解密，释放app内存
                        extendUtils.requestParam.analysisParam('', request.param).catch(e=>{console.log(e)});
                        
                        //当开启bsl安全链路层的时候，此时需要适配安全链路层的错误码(coding在此处的原因是因为安全链路错误码结构是既有http错误（e.status = 403）又有具体的错误码（errorCode = 87001020）)
                        //安全链路http状态码非200的时候，此时response均为明文返回，不需要解密。
                        let errorData = JSON.parse(e.response);
                        extendUtils.errorCodeInterceptor.init({
                            url: url,
                            code: (errorData || {}).errorCode,
                            data: errorData
                        }).run().then(()=>{
                            res(errorData);
                        }).catch(()=>{
                            rej(errorData);
                        });
                        return
                    }
                    //授权失败时需要重试一次
                    if(status == 401){  
                        if(!paramObj.retryTimes || paramObj.retryTimes < that.TOKEN_FAILED_RETRY_TIMES){
                            that.reRequest(_url, data,paramObj).then(data=>{
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
    }


    /**
     * DMT中台业务处理挪到此处执行
     */
    DMTProcessHandler(data, request){
        let findUlrProcess = httpPostProcessors.getProcess4Cache(request.useBsl ? request.param.path : request.param.url);
        if(!!findUlrProcess){
            return findUlrProcess(data);
        }else{
            return data;
        }
    }

    /**
     * 数据请求
     */
    async request (url, param={}, httpConfig={}) {
        let that = this;

        let token = that.getUserToken();//获取用户token
        //更新参数中的用户信息
        if(!(param instanceof FormData) && !(httpConfig||{}).notAssignUserParam){
            await extendUtils.authInterceptor(param, url);
            param = Object.assign({}, param, {
                userId: this.userId,
                companyId: this.companyId,
                channelId: this.channelId,
            });
        }

        httpConfig = Object.assign({}, httpConfig);

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
        if(extendUtils.getBizMateVersion()){
            return window.authorization && window.authorization.getToken();
        }else{
            let primaryKey = this.getGuestPrimaryKey();
            return JSON.parse(extendUtils.getStorage(primaryKey));
        }
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
        constant.URL_STABLE_PARAMS.forEach(key => {
            let value = extendUtils.getUserPara(key);
            this['_'+key] = value;
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                set: function(_value){
                    that['_'+key] = _value;
                },
                get: function () {
                    return extendUtils.getUserPara(key);
                },
            })
        })

        constant.USER_INFO_PARAMS.forEach(key => {
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                set: function(_value){
                    that['_'+key] = _value;
                },
                get: function () {
                    //用户身份参数需要授权后才拿到，因此未授权完成时，返回null，防止有的业务在授权完成前拿到了这些参数
                    if(!that.authorized()){
                        //如果get时有值，则直接返回
                        if(!!that['_'+key]){
                            return that['_'+key];
                        }
                        return null;
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
                    return result!=null && result!=undefined && result!='null' && result!='undefined' ? result : null;
                }
    
                if(tchatInfo && Object.keys(userInfoInToken).some(_key=>{
                    result = userInfoInToken[_key];
                    return _key.toLowerCase() == key.toLowerCase();
                })){
                    return result!=null && result!=undefined && result!='null' && result!='undefined' ? result : null;
                }
            }else{
                return Object.assign({}, tchatInfo, userInfoInToken)
            }
        }
        return result;
    }
}

export default RequestHandler;
