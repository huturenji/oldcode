import * as bridge from "sino/bridge/lib/handler";
import utils from 'sino/common/utils'
import constant from 'sino/constant'
export default {
    getChannelId: (function Singleton(){
        let channelId = null;
        return async ()=>{
            if(utils.isNotStrictEmpty(channelId)){
                return channelId;
            }
            //如果是web版bizmate打开的，则用此种方式获取
            let signData = utils.getSignData();
            if(utils.isNotEmpty(signData)){
                return channelId = utils.decodeSignData(signData, 'channelId');
            }
            
            if(utils.getPlatform() == constant.RUN_ENV.BROWSER){
                return channelId = -1;
            }
            //小程序从bp-param中获取
            if(utils.getPlatform() == constant.RUN_ENV.WECHAT_MINI_APP || utils.getPlatform() == constant.RUN_ENV.WECHAT_H5){
                return (utils.getBpParam()).channelId
            }
            let res = await bridge.callHandler('GetAppConfigFunction', {key: 'tid'});
            channelId = res.value;
            return channelId;
        }
    })()
}