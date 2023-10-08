
import utils from "./utils.js"
import requestParam from "./requestParam.js"

/**
 * 运营管理的http的客户端基础库，依赖平台库SnUtils。
 * 包含3块功能：Ajax请求封装，错误码处理，授权校验处理
 */
class apibase {
    /**
     * 
     * @param {*} enableAuth  是否启用授权
     */
    constructor(enableAuth) {
        this.authEnable = enableAuth || false
        this.setErrorCodeData(this.getErrorCode())
    }

    //自定义的基础的错误码
    getErrorCode() {
        return {
            //授权失败（token过期或验签失败），http状态码401
            "AUTHORIZE_FAILED": {
                text: '获取信息失败，请稍后重试',
                noticeType: utils.NoticeType.TOAST,
                showCode: false
            },
            //无权限，http状态码403
            "NO_AUTHORIZATION": {
                text: '您没有权限',
                noticeType: utils.NoticeType.TOAST,
                showCode: false
            },
            //接口异常(公共异常)
            "NETWORK_ERR": [
                {
                    text: "获取信息失败，请稍后重试",
                    noticeType: utils.NoticeType.TOAST
                }
            ]
        }
    }

    /**
     * api的封装方法
     * @param {*} url  请求数据url
     * @param {*} data  请求参数
     * @param {*} paramObj 其他参数
     */
    async apiCallHandler(url, data, paramObj = {}, notAuth) {
        let that = this;
        //授权校验的业务，分2种：一个是发起请求之前本地校验。一个是给请求加校验信息，服务器校验。
        if (that.authEnable && !notAuth) {
            if (!this.keycloakResult) {
                this.keycloakResult = Vue.prototype.$keycloak
            }
            if (!!this.keycloakResult) {
                let authHeader = {
                    headers: {
                        Authorization: 'Bearer ' + this.keycloakResult.token
                    }
                }
                paramObj = Object.assign({}, paramObj, authHeader)
            } else {
                console.error("no keycloak login result")
            }
        }
        //修复url中斜线的问题
        url = utils.autoFixUrl(url);
        //默认是content-type
        if ((!paramObj.headers || paramObj.headers) && !paramObj.headers['content-type']) {
            paramObj = Object.assign({ headers: { 'content-type': 'application/json;charset=UTF-8' } }, paramObj)
        }

        return new Promise(async (resolve, reject) => {
            //请求方法和参数处理
            let request = await requestParam.getRequestObj(url, data, paramObj);
            utils[request.fun](request.param).then(async (da) => {
                let newData = {};
                if (request.useBsl) { //走了安全链路的分支
                    try {
                        newData = await requestParam.analysisParam(da, request.param);
                    } catch (error) {
                        reject(error)
                        console.error(error)
                    }
                } else { //没走安全链路的分支
                    newData = da;
                }
                that.handleHttp4Then(request.param, newData, resolve, reject)
            }).catch((e) => {
                //根据httpRequest的逻辑，http的状态码不是200的都会rej出来
                that.handleHttp4Catch(request.param, e, resolve, reject)
            });
        });
    }

    /**
     * 正常数据的返回处理，主要就是错误码的匹配
     * @param {*} data 
     * @param {*} res 
     * @param {*} rej 
     */
    handleHttp4Then(param, data, res, rej) {
        //有的场景只有状态码，没有任何数据返回，data此时为空，这就不需要错误码。
        if (!data) {
            res(data);
        }
        utils.errorCodeInterceptor.init({
            url: param.url,
            code: data.code || +data.resultCode,
            data: data
        }).run().then(() => {
            res(data);
        }).catch(() => {
            rej(data);
        });
    }

    /**
     * 根据httpRequest的逻辑，http的状态码不是200的都会rej出来
     * @param {*} e 
     * @param {*} res 
     * @param {*} rej 
     */
    handleHttp4Catch(param, e, res, rej) {
        let status = e.status;
        let httpErrorCode = 'NETWORK_ERR';
        //code 401 token 过期回到首页
        if (status == 401 && this.authEnable) {
            localStorage.setItem("neterror", "401,url=" + param.url)
            this.keycloakResult && this.keycloakResult.logoutFn()
            return
        } else if (status == 403) {
            httpErrorCode = 'NO_AUTHORIZATION';
        } else {
            httpErrorCode = 'NETWORK_ERR';
        }
        utils.errorCodeInterceptor.init().run(httpErrorCode, param.url).then(() => {
            res();
        }).catch((e2) => {
            console.error(e2);
            rej(e)
        });
        console.error(e);
    }

    //自定义错误码
    setErrorCodeData(errorMap) {
        if (!!errorMap) {
            Object.assign(utils.ErrorCodeMap, errorMap);
        } else {
            console.error("errorMap is empty")
        }
    }

    /**
     * 设置错误码的白名单
     */
    setErrorCodeWhiteList(whiteArr = []) {
        //这里统一添加URL的拦截器的白名单 global有一些内置名单，如下所示。我们不需要的话，需要自己删除。
        //    global: ['operationservice.','coupon.','couponScore.','train/getHotCity','flight/getHotAirportCity','hotel/getHotCity'],
        whiteArr.forEach(item => {
            utils.WhiteList.global.push(item)
        })
    }
}

export default apibase;

