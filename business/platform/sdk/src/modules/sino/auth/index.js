import utils from 'sino/common/utils';
import constant from 'sino/constant'
import channel from '../bridge/base/channel';
let keycloakConfig = null;
let serviceAuthObj = null;
export default {

    install(path, id='auth'){
        return new Promise(async resolve => {
            utils.loadScript({
                src: path,
                id: id,
                onload: async function() {
                    resolve();
                }
            })
        })
    },

    /**
     * 授权开启
     * @param {*} path 
     * @param {*} opt 
     * @param {*} events 
     * @returns 
     */
    getToken(path, opt = {}, events = {}, moduleId) {
        return new Promise(async resolve => {
            this.install(path, moduleId).then(async ()=>{
                serviceAuthObj = swpServiceAuth;
                keycloakConfig = keycloakConfig || (opt.loginKcConfigPath ? await utils.getJsonFile(opt.loginKcConfigPath) : null);
                Object.assign(opt.loginKcConfig, keycloakConfig);
                //微信环境下，thirdUserId、clientSecret、applicationId、source都是必填参数
                if((utils.getPlatform() == constant.RUN_ENV.WECHAT_H5 || utils.getPlatform() == constant.RUN_ENV.WECHAT_MINI_APP)
                    && utils.isNotEmpty(opt.clientSecret)
                    && utils.isNotEmpty(opt.thirdUserId)
                    && utils.isNotEmpty(opt.applicationId)
                    && utils.isNotEmpty(opt.source)){

                    const channelId = await channel.getChannelId()
                    opt.signData = {
                        thirdUserId: opt.thirdUserId, //第三方用户Id
                        channelId: channelId,
                        applicationId: opt.applicationId,
                        source: opt.source,
                        clientSecret: opt.clientSecret,
                        signAlg: 'SHA256',
                    }
                    opt.primaryKey = 'wechat'
                }
                swpServiceAuth.install(opt, events).then(
                    async data => {
                        resolve(data);
                    }	
                )
            })
        })
    },

    instance(){
        return serviceAuthObj;
    },
}