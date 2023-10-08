import * as projectconstant from './projectconstant'
import utilshandler from './utilshandler'
import eventlistenerhandler from './eventlistenerhandler'
import SnUtils from 'libs/snutilsproxy'
import * as productutils from './productutils'

String.prototype.compare = function (str) {
    //不区分大小写
    if (this.toLowerCase() == str.toLowerCase()) {
        return true; // 正确
    } 
    return false; // 错误
  
}
let eventHandler = {
    listenerEvents:eventlistenerhandler.listenerEvents,
    signKey:eventlistenerhandler.signKey,
    addEventListenerGlobal: eventlistenerhandler.addEventListenerGlobal,
    hasAuth: eventlistenerhandler.hasAuth,
    getOptionHaveAuth: eventlistenerhandler.getOptionHaveAuth,
    JudgmentAuth: eventlistenerhandler.JudgmentAuth,
    getObjKeyByList: eventlistenerhandler.getObjKeyByList,
    getSignForEvent: eventlistenerhandler.getSignForEvent
}
export default Object.assign({}, projectconstant, utilshandler, eventHandler, SnUtils, productutils)
