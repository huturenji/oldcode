import store from '../store'
import EncryptRequest from '../utils/encryptRequest'
import injectErrorCode from './errorCode';

export default class Request{
    constructor(){
        this.snutils = store.state.depends.snutils;
        this.sinosdk = store.state.depends.sinosdk;
        this.TOKEN_FAILED_RETRY_TIMES = 1;//授权失败后重试次数
        this.encryptRequest = new EncryptRequest(store.state.config)
        injectErrorCode();//注入错误码
    }

    
    /**
     * 重新尝试请求
     * @param {*} url 
     * @param {*} data 
     * @param {*} httpConfig 
     */
    async reRequest(url, data, httpConfig){
        return new Promise((res, rej)=>{
            httpConfig = Object.assign({}, httpConfig, {retryTimes: (httpConfig.retryTimes || 0)+1});//添加重试次数
            this.send(url, data,httpConfig).then(data=>{
                res(data);
            }).catch(e=>{
                rej(e);
            });
        })
    }
    
    async setToken(httpConfig){
        let token = store.state.config.token;
        //拼接token
        if(token){
            if(typeof store.state.config.token == 'function'){
                token = await store.state.config.token()
            }
            if(!httpConfig.headers){
                httpConfig.headers = {}
            }
            httpConfig.headers.Authorization = 'Bearer ' + token
        }
    }

    send(path, data, httpConfig={}) {
        let that = this;
        return new Promise(async (res, rej)=>{
            try{
                //网络监测
                if(store.state.config.checkNetwork && store.getters.isBizMateEnv){
                    let netInfo = await this.sinosdk.getNetInfo()
                    if(!netInfo.contectState){
                        throw 'net is disable';
                    }
                }

                'GET'===(httpConfig.method || '').toUpperCase()?Object.assign(data,{t:new Date().getTime()}):'';
                let url = this.snutils.autoFixUrl(store.state.config.origin + path);//拼接、处理url
                data = Object.assign({}, data, store.state.config.commonParams);//合并公共参数

                //设置token
                await this.setToken(httpConfig)

                //请求方法和参数处理
                let request = await this.encryptRequest.getRequestObj(path, data, httpConfig);
        
                this.snutils[request.fun](request.param).then(async (response)=>{
                    //解密
                    if(request.useBsl){
                        try {
                            response = await this.encryptRequest.analysisParam(response, request.param); //解析参数
                        } catch (error) {
                            rej(error)
                            console.error(error)
                        }
                    }
                    let code = store.state.config.responseAdapter.isSuccess(response) ? 0 : response[store.state.config.responseAdapter.codeKey];
                    this.snutils.errorCodeInterceptor.init({
                        url:url,
                        code: code,
                        data: response
                    }).run().then(()=>{
                        res(response);
                    }).catch(()=>{
                        rej(response);
                    });
                }).catch((e)=>{
                    let status = e.status;
                    let httpErrorCode = 'NETWORK_ERR';
                    if(request.useBsl){ 
                        //请求失败也要调用一次解密，释放app内存
                        this.encryptRequest.analysisParam('', request.param).catch(e=>{console.log(e)});
                        
                        //当开启bsl安全链路层的时候，此时需要适配安全链路层的错误码(coding在此处的原因是因为安全链路错误码结构是既有http错误（e.status = 403）又有具体的错误码（errorCode = 87001020）)
                        //安全链路http状态码非200的时候，此时response均为明文返回，不需要解密。
                        let errorData = JSON.parse(e.response);
                        this.snutils.errorCodeInterceptor.init({
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
                        if(!httpConfig.retryTimes || httpConfig.retryTimes < this.TOKEN_FAILED_RETRY_TIMES){
                            that.reRequest(url, data,httpConfig).then(response=>{
                                res(response);
                            }).catch(e=>{
                                rej(e);
                            });
                            return;
                        }
                        httpErrorCode = 'AUTHORIZE_FAILED';
                    }else if(status == 403){
                        httpErrorCode = 'NO_AUTHORIZATION';
                    }
                    this.snutils.errorCodeInterceptor.init().run(httpErrorCode,url).then(()=>{
                        res();
                    }).catch((e2)=>{
                        console.error(e2);
                        rej(e)
                    });
                    console.error(e);
                });
            }catch(e){
                console.error(e); 
                rej()
            }
        })
    }
}
