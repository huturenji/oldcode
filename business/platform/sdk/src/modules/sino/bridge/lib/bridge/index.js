import utils from 'sino/common/utils';
import constant from 'sino/constant'

let navInfo = utils.getAppVersion();
if(navInfo && navInfo.platform && navInfo.platform.toLowerCase() == constant.BRIDGE_TYPE.CHERRY){
    require('./cherry')
}else if(navInfo && navInfo.platform && navInfo.platform.toLowerCase() == constant.BRIDGE_TYPE.WEBSINO){
    require('./websino')
}else{
    require('./sino')
}