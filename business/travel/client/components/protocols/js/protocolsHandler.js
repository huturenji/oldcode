/*
 * @Descripttion: 获取下单页面用户协议的js方法
 * @version: 
 * @Author: xwc
 * @Date: 2020年11月26日16:59:41
 * @LastEditors: zb
 */
var functional = SnTravel.functional;
class protocolsHandler extends functional.baseRequestHandler{
    constructor(){
        super();
        // 调试数据userId、companyId、channelId
        this.conf = null;
    }

    /**
     * 获取运营渠道管理配置的下单页需要用的用户协议
     * @param param
     * @return {*}
     */
    getAppProtocols(param){
        return this.request('/channel/v1/getChannel', param, {method:'get'});
    }
}
Object.assign(protocolsHandler.prototype, functional);
export default new protocolsHandler();