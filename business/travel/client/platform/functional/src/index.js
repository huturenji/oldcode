import constant from './constant';
import mixin from './mixin';
import requesthandler from './requesthandler/base';
import * as authHandler from './requesthandler/authhandler'
import uploadhandler from './requesthandler/uploadhandler'
import utils from './utils'
import Confirm from './utils/confirm.js'

let query = SnUtils.getUrlParams();
if ((sinosdk.sino.getChannelMapper().huaxing.channelIds.indexOf(query['ProdId'])>-1 
|| sinosdk.sino.getChannelMapper().chouzhou.channelIds.indexOf(query['ProdId'])>-1) 
&& !SnUtils.getBizMateVersion()){
    const comfirm = new Confirm();
    comfirm.show({
        content: '您的APP版本太低，暂时无法使用该功能，请升级APP软件版本',
        confirmText: "知道了",
        showCancelButton: false,
        onConfirm: function(){
            try {
                utils.closePage()
            } catch (e){
                sinosdk.sino.back()
            }
        }
    })
    throw '华兴银行版本低，不可用'
}


export var functional = Object.assign(utils, constant, mixin ,{baseRequestHandler: requesthandler}, {authHandler: authHandler}, {uploadhandler: uploadhandler}) ;
