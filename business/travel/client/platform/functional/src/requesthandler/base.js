import extendUtils from '../utils';
import injectErrorCode from '../errorcode/index';
import constant from '../constant';
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
                if (!!that._primaryKey){
                    return that._primaryKey;
                }
                that._primaryKey = that.getPrimaryKey();
                return that._primaryKey;
            }
        })
    }


    /**
     * 有userId时才能有primaryKey，否则primaryKey是不完整的，生成了无意义，且会对其他流程有影响
     */
    getPrimaryKey(){
        if (!this.userId){
            throw new Error('no userId');
        }
        return `${this.userId}_${this.companyId}_${this.channelId}_${constant.AUTH_CONFIG.loginKcConfig.clientId}` 
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
    apiCallHandler(url, dataP,paramObj={}) {
        let that = this;
        //如果传进来的是绝对路径，则不用拼接url,否则新增访问html下的域名+端口作为前缀
        if (!(url.startsWith('http://')||url.startsWith('https://'))){
            url = '/travel' + url
        }
        //修复url中斜线的问题
        url = extendUtils.autoFixUrl(url);
        return new Promise(async (resolve,reject)=>{
            let checkNetWorkEnable = true;

            //有些页面可能不在app中访问，因此不需要检查网络
            if (!extendUtils.inBrowser()){
                //检查网络状态后，再发送请求
                checkNetWorkEnable = (await sinosdk.sino.getNetInfo()).contectState;
            }
            //检查网络状态后，再发送请求
            if (checkNetWorkEnable){
                //请求方法和参数处理
                let request = await extendUtils.requestParam.getRequestObj(url,dataP,paramObj);
                extendUtils[request.fun](request.param).then(async (da)=>{
                    //解密
                    let data = {};
                    if (request.useBsl){
                        try {
                            data = await extendUtils.requestParam.analysisParam(da,request.param);
                        } catch (error) {
                            reject(error)
                            console.error(error)
                        }
                    } else {
                        data = da;
                    }
                    extendUtils.errorCodeInterceptor.init({
                        url:url,
                        code:(data || {}).resultCode,
                        data: data
                    }).run().then(()=>{
                        resolve(data);
                    }).catch(()=>{
                        reject(data);
                    });
                }).catch((e)=>{
                    let status = e.status;
                    if (status == 0){ return } //由于用户在http返回前关闭/取消，或者防火墙等原因，会造成http请求没有status信息 If the state is UNSENT or OPENED, return 0.(解决安卓打开新页面在新页面请求没有完成的时候页面回退时报错的问题)
                    let httpErrorCode = 'NETWORK_ERR';
                    if (request.useBsl){
                        //请求失败也要调用一次解密，释放app内存
                        extendUtils.requestParam.analysisParam('', request.param).catch((er) => { console.log(er) });
                        
                        //当开启bsl安全链路层的时候，此时需要适配安全链路层的错误码(coding在此处的原因是因为安全链路错误码结构是既有http错误（e.status = 403）又有具体的错误码（errorCode = 87001020）)
                        //安全链路http状态码非200的时候，此时response均为明文返回，不需要解密。
                        let errorData = JSON.parse(e.response);
                        extendUtils.errorCodeInterceptor.init({
                            url: url,
                            code: (errorData || {}).errorCode,
                            data: errorData
                        }).run().then(()=>{
                            resolve(errorData);
                        }).catch(()=>{
                            reject(errorData);
                        });
                        return
                    }
                    //授权失败时需要重试一次
                    if (status == 401){  
                        if (!paramObj.retryTimes || paramObj.retryTimes < that.TOKEN_FAILED_RETRY_TIMES){
                            that.reRequest(url, dataP, paramObj).then(res=>{
                                resolve(res);
                            }).catch(error=>{
                                reject(error);
                            });
                            return;
                        }
                        httpErrorCode = 'AUTHORIZE_FAILED';
                    } else if (status == 403){
                        httpErrorCode = 'NO_AUTHORIZATION';
                    }
                    extendUtils.errorCodeInterceptor.init().run(httpErrorCode,url).then(()=>{
                        resolve();
                    }).catch((e2)=>{
                        console.error(e2);
                        reject(e)
                    });
                    console.error(e);
                });
            } else {
                //离线资源包直接显示本地资源，不显示无网络默认图
                // new errorCodeInterceptor().run('NETWORK_ERR',url);
                console.log('net is disable');
                reject('net is disable');               
            }
        });    
    }

    /**
     * 数据请求
     */
    async request (url, param={}, httpConfig={}) {
        let that = this;

        let token = that.getUserToken();//获取用户token
        //如果不是formData类型，则使用处理后的参数对象，否则使用原始值
        if (!(param instanceof FormData) && !httpConfig.notAssignUserParam){
            param = Object.assign({}, param, {
                userId: this.userId,
                companyId: extendUtils.isNotEmpty(this.companyId) ? this.companyId : -1,
                channelId: this.channelId
            });
        }

        httpConfig = Object.assign({}, httpConfig);

        if ('GET'===(httpConfig.method || '').toUpperCase()){
            Object.assign(param,{t:new Date().getTime()})
        }

        return new Promise((resolve, reject) => {
            let _httpConfig = Object.assign({}, httpConfig, this.defaultHeaders(token))
            that.apiCallHandler(url, param, _httpConfig).then(data => {
                if (data.resultCode == 0) {
                    resolve(data);
                } else {
                    reject(data);
                }
            }).catch(err => {
                reject(err.resultCode ? err : null);//只把拦截器返回的异常数据抛出去
                try {
                    console.log(err && JSON.stringify(err));
                } catch (e) {
                    console.log(e)
                }
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
        if (!token){
            return {};
        }
        return {
            headers:{
                Authorization: 'Bearer '+token
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
        return new Promise((resolve, reject)=>{
            paramObj = Object.assign({}, paramObj, {retryTimes: (paramObj.retryTimes || 0)+1});//添加重试次数
            this.apiCallHandler(url, data,paramObj).then(res=>{
                resolve(res);
            }).catch(e=>{
                reject(e);
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
                    //如果get时有值，则直接返回
                    if (!!that['_'+key]){
                        return that['_'+key];
                    }
                    //从授权组件中获取相应的参数
                    that['_'+key] = that.getUserParam(key);
                    return that['_'+key];
                }
            })
        })
    }

    /**
     * 从授权组件的接口中提取用户参数
     * @param {*} key 
     */
    getUserParam(key){
        let result = null;
        if (window.authorization){
            let tchatInfo = authorization.getTchatUserInfo();//授权组件提供的t信用户数据
            let userInfoInToken = authorization.getUserInfo();//授权组件提供的token数据
            if (key!=null && key!=undefined){
                //分别从这两个对象中提取参数，匹配到则返回
                if (tchatInfo && Object.keys(tchatInfo).some(_key=>{
                    result = tchatInfo[_key];
                    return _key.toLowerCase() == key.toLowerCase();
                })){
                    return result!=null && result!=undefined && result!='null' && result!='undefined' ? result : null;
                }
    
                if (tchatInfo && Object.keys(userInfoInToken).some(_key=>{
                    result = userInfoInToken[_key];
                    return _key.toLowerCase() == key.toLowerCase();
                })){
                    return result!=null && result!=undefined && result!='null' && result!='undefined' ? result : null;
                }
            } else {
                return Object.assign({}, tchatInfo, userInfoInToken)
            }
        }
        return result;
    }

}

export default RequestHandler;
