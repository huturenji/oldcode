import {baseAdapter} from '../base';
import utils from 'sino/common/utils';
import bridgeMethod from 'sino/bridge/base';
import constant from 'sino/constant'
export let channelIds = {
    dev: '5248005',
    sit: '3150853',
    uat: '2102277',
    prod: '5125'
}
export let appName = '海峡企业银行'
export let adapter = Object.assign({}, baseAdapter, {
    async onSdkLoad(){
        let proceed = arguments[arguments.length-1];
        if(utils.getBplusAppInfo()['name'] == 'bbc-mobile'){
            let enterpriseType = utils.getUrlParam('enterpriseType');
            let channelId = await bridgeMethod.getChannelId();
            if(utils.isNotEmpty(enterpriseType)){
                if(enterpriseType == 'normal'){
                    let topicId = utils.concatByZero(channelId, 1);
                    location.replace(location.origin+location.pathname+'#/pages/topic/index?id='+topicId)
                    return;
                }else if(enterpriseType == 'technology'){
                    let topicId = utils.concatByZero(channelId, 2);
                    location.replace(location.origin+location.pathname+'#/pages/topic/index?id='+topicId)
                    return;
                }
            }
        }
        proceed.proceedDefault();
    },
    getToken(path, opt = {}, events = {}){
        let proceed = arguments[arguments.length-1];
       // if(utils.compareBizVersion('1.2.0') > -1){
            opt.mode = 'native';
      //  }
        //继续执行原函数
        proceed.proceedDefault(path, opt = {}, events = {});
    },

    /**
     * 用户是否已登录(老银行默认已登录)
     * @returns 
     */    
     async isLogined() {
        return {
            ret: 0,
            responseData: {
                status: 1
            }
        };
},
})