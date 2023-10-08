import {baseAdapter} from '../base'
import utils from 'sino/common/utils';
import bridgeMethod from 'sino/bridge/base';
export let channelIds = {
    dev: '5261061',
    sit: '3163909',
    uat: '2115333',
    prod: '18181',
}
export let appName = '津农企业银行'
export let adapter = Object.assign({}, baseAdapter, {
    async onSdkLoad(){
        let proceed = arguments[arguments.length-1];
        if(utils.getBplusAppInfo()['name'] == 'bbc-mobile'){
            let hash = location.hash;
            if(hash == '#/news'){
                let channelId = await bridgeMethod.getChannelId();
                let topicId = utils.concatByZero(channelId, 1);
                location.replace(location.origin+location.pathname+'#/pages/topic/index?id='+topicId+'&role=guest&enableAgreement=false')
            }
        }
        proceed.proceedDefault();
    },
})