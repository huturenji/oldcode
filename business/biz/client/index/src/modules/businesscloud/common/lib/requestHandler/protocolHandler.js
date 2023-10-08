import base from './base'
import extendUtils from '../utils';
class protocolHandler extends base{
    constructor(){
        super();
        extendUtils.WhiteList.global.push('/channel/v1/getChannel')
    }

    /**
     * 是否开启协议
     */
    enableProtocols(){
        //商旅没有这个开关，不实现。 如果没有配置协议，则认为不开启
    }

    /**
     * 获取协议内容
     * @param {*} channelId 
     * @returns 必须返回type：text或file。然后按类型返回相应的字段
     */
    getAppProtocols(token){
        let that = this;
        return new Promise(resolve=>{
            let userInfo = authorization.getUserInfo();
            let channelId = userInfo.channelId;
            //防止父类取不到token
            let headers = token ? {Authorization: 'Bearer '+token} : {};
            that.request('/channel/v1/getChannel',{channelId: channelId}, {method: 'get', notAssignUserParam: true, headers: headers}).then(res=>{
                if(res.result && res.result.state=="ENABLE" && res.result.protocol){
                    let protocols = [];
                    res.result.protocol.forEach(p=>{
                        if(p.fileUrlList && p.fileUrlList.length>0){
                            p.protocolFileUrl = p.fileUrlList[0]
                            protocols.push(p);
                        }
                    })
                    resolve({
                        authFiles:protocols,
                        type: 'file',
                    });
                }else{
                    resolve();
                }
            }).catch(e=>{
                resolve();
                console.error(e);
            })
        })
    }

    /**
     * 记录用户是否同意了协议
     * @param param: {logUserConsents: [授权协议id的list], token: [用户token]}
     */
    logUserConsent(param){
        let logUserConsents = []
        let userInfo = authorization.getUserInfo();
        param.protocols.authFiles && param.protocols.authFiles.forEach(auth=>{
            logUserConsents.push({
                "userId": userInfo.userId,
                "companyId": userInfo.companyId,
                "channelId": userInfo.channelId,
                "protocolId": auth.protocolId,
            })
        })

        return new Promise(resolve=>{
            this.request('/channel/v1/addUserAgreeProtocol', {userAgreeProtocolList: logUserConsents}, {notAssignUserParam: true}).then(res=>{
                resolve(res.resultCode==0)
            }).catch(e=>{
                resolve(false);
                console.error(e);
            })
        })
    }

    /**
     * 获取用户是否同意了协议
     * @param token: [用户token]
     */
    getUserConsent(token){
        let userInfo = authorization.getUserInfo();
        let param = {
            "userId": userInfo.userId,
            "companyId": userInfo.companyId,
            "channelId": userInfo.channelId,
        }
        return new Promise(resolve=>{
            this.request('/channel/v1/getUserAgreeProtocol', param, {method: 'get', notAssignUserParam: true}).then(res=>{
                let result = res.resultCode==0 && res.result.protocolIds && res.result.protocolIds.length>0;
                resolve(result);
            }).catch(e=>{
                resolve(false);
                console.error(e);
            })
        })
    }
}

export default new protocolHandler();