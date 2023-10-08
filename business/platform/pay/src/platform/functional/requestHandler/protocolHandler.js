import base from './base'
class protocolHandler extends base{
    constructor(){
        super();
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
    getAppProtocols(channelId){
        let that = this;
        return new Promise(resolve=>{
            that.request('/channel/v1/getChannel',{channelId: channelId}, {method: 'get', notAssignUserParam: true}).then(res=>{
                resolve({
                    protocolContent: res.result.protocol.protocolContent,
                    summaryList: res.result.protocol.summaryList,
                    type: 'text',
                });
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
    logUserConsentUrl(param){
        //商旅没有这个接口，不实现
    }

    /**
     * 获取用户
     * @param token: [用户token]
     */
    getUserConsent(token){
        //商旅没有这个接口，不实现
    }
}

export default new protocolHandler();